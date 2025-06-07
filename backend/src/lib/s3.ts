import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "layer0-uploads";
const CDN_URL = process.env.AWS_CLOUDFRONT_URL; // Optional CloudFront URL

export class S3Service {
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string = "avatars"
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "max-age=31536000", // 1 year cache
    });

    try {
      await s3Client.send(command);

      // Return URL (use CloudFront if available, otherwise S3 URL)
      if (CDN_URL) {
        return `${CDN_URL}/${key}`;
      }
      return `https://${BUCKET_NAME}.s3.${
        process.env.AWS_REGION || "us-east-1"
      }.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file");
    }
  }

  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      let key: string;
      if (CDN_URL && fileUrl.includes(CDN_URL)) {
        key = fileUrl.replace(`${CDN_URL}/`, "");
      } else {
        // Extract from S3 URL
        const urlParts = fileUrl.split("/");
        key = urlParts.slice(-2).join("/"); // folder/filename
      }

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file");
    }
  }

  static async getSignedUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = "avatars"
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "max-age=31536000",
    });

    try {
      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300, // 5 minutes
      });

      const fileUrl = CDN_URL
        ? `${CDN_URL}/${key}`
        : `https://${BUCKET_NAME}.s3.${
            process.env.AWS_REGION || "us-east-1"
          }.amazonaws.com/${key}`;

      return { uploadUrl, fileUrl };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate upload URL");
    }
  }
}
