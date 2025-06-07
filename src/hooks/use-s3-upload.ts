import { S3Service } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface UploadOptions {
  folder?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useS3Upload(options: UploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      options.onUploadStart?.();

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      try {
        const fileUrl = await S3Service.uploadFile(
          file,
          options.folder || "uploads"
        );
        setUploadProgress(100);
        clearInterval(progressInterval);
        options.onUploadComplete?.(fileUrl);
        return fileUrl;
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onError: (error: Error) => {
      setUploadProgress(0);
      setIsUploading(false);
      options.onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileUrl: string) => {
      await S3Service.deleteFile(fileUrl);
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    return uploadMutation.mutateAsync(file);
  };

  const deleteFile = async (fileUrl: string): Promise<void> => {
    return deleteMutation.mutateAsync(fileUrl);
  };

  // Upload using signed URL (alternative method)
  const uploadWithSignedUrl = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      options.onUploadStart?.();

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const fileUrl = await S3Service.uploadWithSignedUrl(file, options.folder);
      setUploadProgress(100);
      clearInterval(progressInterval);
      options.onUploadComplete?.(fileUrl);
      return fileUrl;
    } catch (error) {
      setUploadProgress(0);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploadWithSignedUrl,
    isUploading,
    uploadProgress,
    isDeleting: deleteMutation.isPending,
    error: uploadMutation.error || deleteMutation.error,
  };
}
