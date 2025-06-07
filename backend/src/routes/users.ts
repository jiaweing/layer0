import { Hono } from "hono";
import multer from "multer";
import { UserService } from "../lib/database.js";
import { S3Service } from "../lib/s3.js";

const app = new Hono();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get user by auth ID
app.get("/:authId", async (c) => {
  try {
    const authId = c.req.param("authId");

    const user = await UserService.findUserById(authId);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(UserService.transformToApiUser(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Get multiple users by auth IDs
app.post("/batch", async (c) => {
  try {
    const body = await c.req.json();
    const { authIds } = body;

    if (!Array.isArray(authIds)) {
      return c.json({ error: "authIds must be an array" }, 400);
    }

    const userMap = await UserService.findUsersByIds(authIds);

    // Transform to API format
    const transformedUsers: Record<string, any> = {};
    Object.keys(userMap).forEach((id) => {
      transformedUsers[id] = UserService.transformToApiUser(userMap[id]);
    });

    return c.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Upload avatar
app.post("/:authId/avatar", async (c) => {
  try {
    const authId = c.req.param("authId");

    // Parse multipart form data
    const formData = await c.req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return c.json({ error: "Only image files are allowed" }, 400);
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: "File size too large. Maximum 5MB allowed" }, 400);
    }

    // Get current user to check if they have an existing avatar
    const currentUser = await UserService.findUserById(authId);
    if (!currentUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const avatarUrl = await S3Service.uploadFile(
      buffer,
      file.name,
      file.type,
      "avatars"
    );

    // Delete old avatar if exists
    if (currentUser.image) {
      try {
        await S3Service.deleteFile(currentUser.image);
      } catch (error) {
        console.warn("Failed to delete old avatar:", error);
      }
    }

    // Update user with new avatar URL
    const updatedUser = await UserService.updateUserAvatar(authId, avatarUrl);

    if (!updatedUser) {
      return c.json({ error: "Failed to update user avatar" }, 500);
    }

    return c.json({
      message: "Avatar uploaded successfully",
      user: UserService.transformToApiUser(updatedUser),
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return c.json({ error: "Failed to upload avatar" }, 500);
  }
});

// Remove avatar
app.delete("/:authId/avatar", async (c) => {
  try {
    const authId = c.req.param("authId");

    // Get current user to check if they have an avatar
    const currentUser = await UserService.findUserById(authId);
    if (!currentUser) {
      return c.json({ error: "User not found" }, 404);
    }

    if (!currentUser.image) {
      return c.json({ error: "User has no avatar to remove" }, 400);
    }

    // Delete from S3
    try {
      await S3Service.deleteFile(currentUser.image);
    } catch (error) {
      console.warn("Failed to delete avatar from S3:", error);
    }

    // Remove avatar from user record
    const updatedUser = await UserService.removeUserAvatar(authId);

    if (!updatedUser) {
      return c.json({ error: "Failed to remove user avatar" }, 500);
    }

    return c.json({
      message: "Avatar removed successfully",
      user: UserService.transformToApiUser(updatedUser),
    });
  } catch (error) {
    console.error("Error removing avatar:", error);
    return c.json({ error: "Failed to remove avatar" }, 500);
  }
});

export default app;
