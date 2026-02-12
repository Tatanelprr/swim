"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, FolderPlus, Upload, FilePlus } from "lucide-react";
import { api } from "~/trpc/react";

type NewButtonProps = {
  folderId: string | null;
  onUploaded?: () => void; // optionnel (ex: router.refresh)
};

export function NewButton({ folderId, onUploaded }: NewButtonProps) {
  const [open, setOpen] = useState(false);

  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const utils = api.useUtils();

  const createFolder = api.folder.create.useMutation({
    onSuccess: async () => {
      setFolderName("");
      setShowFolderInput(false);
      setOpen(false);
      await utils.folder.getByParent.invalidate({ parentId: folderId });
      onUploaded?.();
    },
  });

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    if (folderId) fd.append("folderId", folderId);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      console.error("Upload failed", await res.text());
      return;
    }

    setOpen(false);
    await utils.folder.getByParent.invalidate({ parentId: folderId });
    onUploaded?.();
  }

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="whitespace-nowrap inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#0b1020] hover:bg-white/90"
      >
        Nouveau
        <ChevronDown size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-lg">
          <div className="p-2">
            {/* Créer dossier */}
            <button
              type="button"
              onClick={() => setShowFolderInput((v) => !v)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            >
              <FolderPlus size={16} />
              Créer un dossier
            </button>

            {showFolderInput ? (
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Nom du dossier</div>
                <input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Ex: Documents"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                  autoFocus
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = folderName.trim();
                      if (!trimmed) return;
                      createFolder.mutate({ name: trimmed, parentId: folderId });
                    }}
                    disabled={!folderName.trim() || createFolder.isPending}
                    className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0b1020] hover:bg-white/90 disabled:opacity-50"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFolderInput(false);
                      setFolderName("");
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : null}

            {/* Créer fichier (placeholder tant que tu n'as pas l'API) */}
            <button
              type="button"
              disabled
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/40"
              title="À brancher sur une mutation file.createEmpty"
            >
              <FilePlus size={16} />
              Créer un fichier (bientôt)
            </button>

            {/* Import */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            >
              <Upload size={16} />
              Importer un fichier
            </button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                void uploadFile(file);
                e.currentTarget.value = "";
              }}
            />
          </div>

          <div className="border-t border-white/10 px-3 py-2 text-xs text-white/50">
            Destination : {folderId ? "dossier courant" : "racine"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
