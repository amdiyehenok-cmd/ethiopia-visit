"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type Props = {
  onUploaded: (url: string) => void;
  compact?: boolean;
};

export function PhotoUploadWidget({ onUploaded, compact = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.");
      return;
    }

    // Local preview
    const local = URL.createObjectURL(file);
    setPreview(local);
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");

      onUploaded(data.url);
      setPreview(data.url);
    } catch (e: unknown) {
      // If upload fails, use the local preview as a fallback URL
      onUploaded(local);
      setError((e instanceof Error ? e.message : "Upload failed") + " — using local preview.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (compact) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-ivory/60 hover:border-white/20 hover:text-ivory transition disabled:opacity-50"
        >
          {uploading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
          ) : (
            "📷"
          )}
          {uploading ? "Uploading…" : "Add photo"}
        </button>
        {error && <p className="mt-1 text-[10px] text-ethiopia-red/80">{error}</p>}
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-6 text-center transition hover:border-gold-primary/30"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image src={preview} alt="preview" fill className="object-cover" sizes="400px" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary/30 border-t-gold-primary" />
            </div>
          )}
        </div>
      ) : (
        <div className="py-4">
          <p className="text-4xl">📸</p>
          <p className="mt-3 text-sm text-ivory/60">Drag & drop or click to upload</p>
          <p className="text-xs text-ivory/30">JPG, PNG, WEBP · max 10 MB</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ivory/70 hover:border-gold-primary/30 hover:text-ivory transition disabled:opacity-50 w-full"
      >
        {uploading ? "Uploading…" : preview ? "Change photo" : "Select from device"}
      </button>

      {error && <p className="mt-2 text-xs text-ethiopia-red/80">{error}</p>}
    </div>
  );
}
