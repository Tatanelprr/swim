"use client";

import { Trash, File as FileIcon } from "lucide-react";

export function FileRow({
  file,
  onDelete,
}: {
  file: { id: string; name: string; s3Key: string };
  onDelete: () => void;
}) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/swim-file-id", file.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
      title="Glisse ce fichier sur un dossier pour le déplacer"
    >
      <div className="flex min-w-0 items-center gap-2">
        <FileIcon size={18} className="shrink-0 text-white/70" />
        <a
          href={`/uploads/${file.s3Key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-white/85 hover:underline"
        >
          {file.name}
        </a>
      </div>

      <button
        onClick={onDelete}
        className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
        aria-label="Supprimer le fichier"
        type="button"
      >
        <Trash size={14} />
      </button>
    </li>
  );
}
