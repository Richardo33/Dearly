"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaUploadProps = {
  defaultUrl?: string;
  folder: "diary" | "people";
  label: string;
  name: string;
  onUploaded?: (url: string) => void;
};

export function MediaUpload({
  defaultUrl,
  folder,
  label,
  name,
  onUploaded,
}: MediaUploadProps) {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState(defaultUrl ?? "");

  const handleUpload = async (file: File) => {
    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      message?: string;
      url?: string;
    };

    setIsUploading(false);

    if (!response.ok || !payload.url) {
      setError(payload.message ?? "Upload failed.");
      return;
    }

    setUrl(payload.url);
    onUploaded?.(payload.url);
  };

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed border-[#D9C9BC] bg-[#FFFDF9]",
          url ? "p-2" : "p-5",
        )}
      >
        {url ? (
          <div
            className="aspect-[4/3] rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center text-sm text-[#7C6A62]">
            <ImagePlus className="h-8 w-8 text-[#D9798F]" />
            <span className="font-semibold text-[#3D2F2A]">{label}</span>
            <span className="text-xs">JPG, PNG, or WebP up to 5MB</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void handleUpload(file);
                }
              }}
            />
          </label>
        )}

        {url ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="cursor-pointer rounded-full border border-[#D9C9BC] px-4 py-2 text-xs font-semibold">
              Change image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                disabled={isUploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    void handleUpload(file);
                  }
                }}
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Remove image"
              onClick={() => {
                setUrl("");
                onUploaded?.("");
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : null}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <Loader2 className="h-5 w-5 animate-spin text-[#D9798F]" />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
