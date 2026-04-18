"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { generateCoverImage } from "@/app/actions";

interface CoverImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
  deckTitle?: string;
  deckDescription?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  className,
  deckTitle,
  deckDescription,
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const busy = uploading || generating;

  async function handleGenerate() {
    if (!deckTitle?.trim()) return;
    setError(null);
    setGenerating(true);
    try {
      const { url } = await generateCoverImage(deckTitle, deckDescription || undefined);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

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

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!busy) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }

  return (
    <div className={cn("relative group/cover", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={busy}
        className={cn(
          "relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-border",
          "flex flex-col items-center justify-center gap-2",
          "text-muted-foreground hover:text-foreground hover:border-foreground/30",
          "transition-colors cursor-pointer",
          isDragging && "border-foreground/50 bg-muted text-foreground",
          busy && "opacity-50 cursor-not-allowed",
        )}
      >
        {value && !generating ? (
          <Image src={value} alt="Cover" fill className="object-cover" loading="eager" priority />
        ) : busy ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            {generating && (
              <span className="text-sm font-medium">Generating cover...</span>
            )}
          </>
        ) : (
          <>
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm font-medium">
              {isDragging ? "Drop to upload" : "Add cover image"}
            </span>
            {!isDragging && (
              <span className="text-xs text-muted-foreground">or drag and drop</span>
            )}
          </>
        )}

        {/* Hover overlay when image is set */}
        {value && !busy && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <ImagePlus className="w-6 h-6 text-white" />
          </div>
        )}
      </button>

      {/* Generate with AI button */}
      {!value && !busy && deckTitle?.trim() && (
        <button
          type="button"
          onClick={handleGenerate}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      )}

      {/* Regenerate button */}
      {value && !busy && deckTitle?.trim() && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleGenerate();
          }}
          className="absolute top-2 left-2 opacity-0 hover:!opacity-100 peer-hover:opacity-100 group-hover/cover:opacity-100 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white hover:bg-black/80 transition-all"
        >
          <Sparkles size={12} />
          Regenerate
        </button>
      )}

      {/* Remove button */}
      {value && !busy && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 opacity-0 group-hover/cover:opacity-100 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
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
