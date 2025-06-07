import { useAuth } from "@/components/providers/auth";
import { legacyApiService, useConvexAPI } from "@/lib/convex-api";
import { S3Service } from "@/lib/s3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAvatarUpload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const { updateUserProfile } = useConvexAPI();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("User not authenticated");
      setIsUploading(true);

      // First upload to S3
      const avatarUrl = await S3Service.uploadFile(file, "avatars");

      // Then update user profile with the new avatar URL (MongoDB/Better Auth)
      const updatedUser = await legacyApiService.updateProfile({
        image: avatarUrl,
      });

      // Also update the user in Convex database
      await updateUserProfile({
        authId: user.id,
        image: avatarUrl,
        name: user.name,
      });

      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      // Update the user data in the auth context
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setIsUploading(false);
    },
    onError: (error) => {
      console.error("Avatar upload failed:", error);
      setIsUploading(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Delete from S3 if user has an avatar
      if (user.image) {
        try {
          await S3Service.deleteFile(user.image);
        } catch (error) {
          console.warn("Failed to delete avatar from S3:", error);
        }
      }

      // Update user profile to remove avatar (MongoDB/Better Auth)
      const updatedUser = await legacyApiService.updateProfile({
        image: undefined,
      });

      // Also update the user in Convex database
      await updateUserProfile({
        authId: user.id,
        image: undefined,
        name: user.name,
      });

      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      // Update the user data in the auth context
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Avatar removal failed:", error);
    },
  });

  const uploadAvatar = async (
    croppedBlob: Blob,
    fileName: string = "avatar.jpg"
  ) => {
    try {
      const file = new File([croppedBlob], fileName, { type: "image/jpeg" });
      await uploadMutation.mutateAsync(file);
    } catch (error) {
      throw error;
    }
  };

  const removeAvatar = async () => {
    try {
      await removeMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadAvatar,
    removeAvatar,
    isUploading: isUploading || uploadMutation.isPending,
    isRemoving: removeMutation.isPending,
    uploadError: uploadMutation.error,
    removeError: removeMutation.error,
  };
}
