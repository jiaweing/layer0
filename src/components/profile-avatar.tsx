"use client";

import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  Loader2,
  Upload,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { useFileUpload } from "@/hooks/use-file-upload";

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = 200,
  outputHeight: number = 200
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Set canvas size to square avatar size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    return null;
  }
}

interface ProfileAvatarProps {
  currentAvatar?: string | null;
  onAvatarChange?: (avatarUrl: string | null) => void;
}

export default function ProfileAvatar({
  currentAvatar,
  onAvatarChange,
}: ProfileAvatarProps) {
  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    multiple: false,
  });

  const {
    uploadAvatar,
    removeAvatar,
    isUploading,
    isRemoving,
    uploadError,
    removeError,
  } = useAvatarUpload();

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);

  // Ref to track the previous file ID to detect new uploads
  const previousFileIdRef = useRef<string | undefined | null>(null);

  // Callback for Cropper to provide crop data
  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      console.error("Missing data for apply:", {
        previewUrl,
        fileId,
        croppedAreaPixels,
      });
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }

    try {
      // Get the cropped image blob
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);

      if (!croppedBlob) {
        throw new Error("Failed to generate cropped image blob.");
      }

      // Upload to S3 via API
      await uploadAvatar(croppedBlob, `avatar-${Date.now()}.jpg`);

      // Close dialog and clean up
      setIsDialogOpen(false);
      removeFile(fileId);
      setCroppedAreaPixels(null);
      setZoom(1); // Notify parent component if callback provided
      if (onAvatarChange) {
        onAvatarChange(currentAvatar || null);
      }
    } catch (error) {
      console.error("Error during avatar upload:", error);
      // Keep dialog open so user can try again
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      if (onAvatarChange) {
        onAvatarChange(null);
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  // Effect to open dialog when a new file is ready
  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true);
      setCroppedAreaPixels(null);
      setZoom(1);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex">
        {/* Avatar display and upload area */}
        <button
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={currentAvatar ? "Change avatar" : "Upload avatar"}
          disabled={isUploading || isRemoving}
        >
          {isUploading || isRemoving ? (
            <Loader2 className="size-6 animate-spin opacity-60" />
          ) : currentAvatar ? (
            <img
              className="size-full object-cover"
              src={currentAvatar}
              alt="Profile avatar"
              width={96}
              height={96}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-1"
            >
              <CircleUserRoundIcon className="size-6 opacity-60" />
              <Upload className="size-4 opacity-40" />
            </div>
          )}
        </button>

        {/* Remove button */}
        {currentAvatar && !isUploading && !isRemoving && (
          <Button
            onClick={handleRemoveAvatar}
            size="icon"
            variant="destructive"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-sm"
            aria-label="Remove avatar"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload avatar file"
          tabIndex={-1}
        />
      </div>
      {/* Status text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isUploading
            ? "Uploading avatar..."
            : isRemoving
            ? "Removing avatar..."
            : "Click or drag to upload avatar"}
        </p>
        {(uploadError || removeError) && (
          <p className="text-sm text-red-500 mt-1">
            {uploadError?.message ||
              removeError?.message ||
              "An error occurred"}
          </p>
        )}
      </div>
      {/* Cropper Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">
            Crop avatar image dialog
          </DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  aria-label="Cancel"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Crop Avatar</span>
              </div>
              <Button
                className="-my-1"
                onClick={handleApply}
                disabled={!previewUrl || isUploading}
                autoFocus
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
              <Slider
                defaultValue={[1]}
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                aria-label="Zoom slider"
              />
              <ZoomInIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
    </div>
  );
}
