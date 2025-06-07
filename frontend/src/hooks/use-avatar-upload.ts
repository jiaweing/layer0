import { useAuth } from "@/components/providers/auth";
import { apiService } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAvatarUpload() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("User not authenticated");
      setIsUploading(true);
      return apiService.uploadAvatar(user.id, file);
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
      return apiService.removeAvatar(user.id);
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
