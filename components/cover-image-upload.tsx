"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, X } from "lucide-react";

interface CoverImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  className,
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-border",
          "flex flex-col items-center justify-center gap-2",
          "text-muted-foreground hover:text-foreground hover:border-foreground/30",
          "transition-colors cursor-pointer",
          uploading && "opacity-50 cursor-not-allowed",
        )}
      >
        {value ? (
          <Image src={value} alt="Cover" fill className="object-cover" />
        ) : uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm font-medium">Add cover image</span>
          </>
        )}

        {/* Hover overlay when image is set */}
        {value && !uploading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
            <ImagePlus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
          </div>
        )}
      </button>

      {/* Remove button */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X size={12} />
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
