"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

type DropzoneProps = {
  folderId: string | null;
  onUploaded?: () => void; // pour refresh
};

export function Dropzone({ folderId, onUploaded }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadOne = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        if (folderId) fd.append("folderId", folderId);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");

        onUploaded?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [folderId, onUploaded],
  );

  const uploadMany = useCallback(
    async (files: FileList | File[]) => {
      for (const f of Array.from(files)) await uploadOne(f);
    },
    [uploadOne],
  );

  return (
    <div
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) void uploadMany(e.dataTransfer.files);
      }}
      className={[
        "rounded-2xl border border-dashed p-6 transition",
        "border-white/15 bg-white/5",
        isDragging ? "bg-white/10 border-white/30" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <UploadCloud className="h-5 w-5 text-white/80" />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90">
            Dépose tes fichiers ici
          </div>
          <div className="text-xs text-white/60">
            ou{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="underline decoration-white/30 underline-offset-4 hover:text-white/80"
              disabled={isUploading}
            >
              clique pour sélectionner
            </button>
          </div>
        </div>

        <div className="ml-auto text-xs text-white/60">
          {isUploading ? "Upload..." : null}
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void uploadMany(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
