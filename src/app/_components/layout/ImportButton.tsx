"use client";

import { useRef, useState } from "react";

type ImportButtonProps = {
  folderId: string | null;
  onUploaded?: () => void;
};

export function ImportButton({ folderId, onUploaded }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);

        // ✅ la ligne qui change tout :
        if (folderId) fd.append("folderId", folderId);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
      }

      onUploaded?.();
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
      >
        {isUploading ? "Import..." : "Importer"}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => void uploadFiles(e.target.files)}
      />
    </>
  );
}
