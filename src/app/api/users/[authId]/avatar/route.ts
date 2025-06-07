import { NextRequest, NextResponse } from "next/server";
import { S3Service } from "../../../../../lib/s3";

export async function POST(
  request: NextRequest,
  { params }: { params: { authId: string } }
) {
  try {
    const { authId } = params;

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed" },
        { status: 400 }
      );
    }

    // Upload to S3
    const avatarUrl = await S3Service.uploadFile(file, "avatars");

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatarUrl,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}

// Route for getting signed upload URLs (alternative approach)
export async function GET(
  request: NextRequest,
  { params }: { params: { authId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType");

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    // Validate content type
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const { uploadUrl, fileUrl } = await S3Service.getSignedUploadUrl(
      fileName,
      contentType,
      "avatars"
    );

    return NextResponse.json({
      uploadUrl,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
