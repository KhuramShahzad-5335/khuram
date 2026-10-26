"use client";
import { useId, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  isArticleImage,
  UPLOAD_LIMIT,
  UPLOAD_TYPES,
} from "@/lib/article-images";

export function StudioImageUpload({
  label,
  src,
  onUploaded,
  onBusy,
}: {
  label: string;
  src: string;
  onUploaded: (image: { src: string; width: number; height: number }) => void;
  onBusy: (busy: boolean) => void;
}) {
  const id = useId();
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  async function send(file: File) {
    setMessage("");
    setFailed(false);
    if (
      !UPLOAD_TYPES.includes(file.type) ||
      !file.size ||
      file.size > UPLOAD_LIMIT
    ) {
      setFailed(true);
      setMessage("Choose a JPEG, PNG or WebP image up to 5 MB.");
      return;
    }
    onBusy(true);
    setProgress(0);
    try {
      const bitmap = await createImageBitmap(file);
      const originalWidth = bitmap.width;
      const originalHeight = bitmap.height;
      if (
        originalWidth > 12000 ||
        originalHeight > 12000 ||
        originalWidth * originalHeight > 40000000
      ) {
        bitmap.close();
        throw new Error(
          "Please resize this image to at most 12,000 pixels per side and 40 megapixels.",
        );
      }
      const scale = Math.min(1, 1600 / Math.max(originalWidth, originalHeight));
      const width = Math.max(1, Math.round(originalWidth * scale));
      const height = Math.max(1, Math.round(originalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        bitmap.close();
        throw new Error("Your browser could not prepare the image.");
      }
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const prepared = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) =>
            result
              ? resolve(result)
              : reject(new Error("Image compression failed. Please retry.")),
          "image/webp",
          0.84,
        ),
      );
      if (prepared.size > UPLOAD_LIMIT)
        throw new Error(
          "The prepared image is too large. Choose a smaller image.",
        );
      const extension = prepared.type === "image/webp" ? "webp" : "png";
      const blob = await upload(
        `blog/${crypto.randomUUID()}.${extension}`,
        prepared,
        {
          access: "public",
          handleUploadUrl: "/studio/api/upload/",
          contentType: prepared.type,
          abortSignal: AbortSignal.timeout(120000),
          onUploadProgress: ({ percentage }) =>
            setProgress(Math.round(percentage)),
        },
      );
      if (!isArticleImage(blob.url))
        throw new Error(
          "The upload did not return a supported public image URL.",
        );
      onUploaded({ src: blob.url, width, height });
      setMessage(
        `Uploaded (${Math.ceil(prepared.size / 1024)} KB). Add descriptive alt text, then save or publish to attach it to this article.`,
      );
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed. Please retry; your current image is unchanged.",
      );
    } finally {
      setProgress(null);
      onBusy(false);
    }
  }
  return (
    <div className="space-y-3 rounded-xl border border-(--border) p-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-describedby={id + "-hint"}
        disabled={progress !== null}
        className="block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-(--text) file:px-3 file:py-2 file:text-(--background)"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void send(file);
        }}
      />
      <p id={id + "-hint"} className="text-xs text-(--muted)">
        JPEG, PNG or WebP · up to 5 MB. Automatically resized and compressed.
        Uploaded images are public, including draft images.
      </p>
      {progress !== null && (
        <div role="status" className="text-sm">
          <progress
            className="w-full"
            value={progress}
            max={100}
            aria-label="Image upload progress"
          />
          Uploading… {progress}%
        </div>
      )}
      {message && (
        <p role={failed ? "alert" : "status"} className="text-sm break-words">
          {message}
        </p>
      )}
      {src && isArticleImage(src) && (
        <img
          src={src}
          alt="Selected article image preview"
          className="max-h-48 w-full rounded-lg object-contain"
        />
      )}
    </div>
  );
}
