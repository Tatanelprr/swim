"use client";

import Link from "next/link";
import { Folder, Pencil, Trash, Save } from "lucide-react";

type DropPayload =
  | { type: "file"; id: string }
  | { type: "folder"; id: string }
  | null;

function readDropPayload(e: React.DragEvent): DropPayload {
  const fileId = e.dataTransfer.getData("application/swim-file-id");
  if (fileId) return { type: "file", id: fileId };

  const folderId = e.dataTransfer.getData("application/swim-folder-id");
  if (folderId) return { type: "folder", id: folderId };

  return null;
}

export function FolderRow({
  folder,
  isEditing,
  newName,
  setNewName,
  startEditing,
  stopEditing,
  onSave,
  onDelete,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  folder: { id: string; name: string };
  isEditing: boolean;

  newName: string;
  setNewName: (v: string) => void;

  startEditing: () => void;
  stopEditing: () => void;
  onSave: () => void;
  onDelete: () => void;

  isDragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (payload: Exclude<DropPayload, null>) => void;
}) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/swim-folder-id", folder.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={[
        "rounded-xl border px-3 py-2 transition",
        "border-white/10 bg-white/5 hover:bg-white/10",
        isDragOver ? "ring-2 ring-white/20" : "",
      ].join(" ")}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        const payload = readDropPayload(e);
        onDragLeave();
        if (!payload) return;
        onDrop(payload);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Folder size={18} className="shrink-0 text-white/70" />

          {isEditing ? (
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-white/30"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") stopEditing();
              }}
            />
          ) : (
            <Link
              href={`/folder/${folder.id}`}
              className="truncate text-sm text-white/85 hover:underline"
            >
              {folder.name}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <button
              onClick={onSave}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Sauvegarder"
              type="button"
            >
              <Save size={14} />
            </button>
          ) : (
            <button
              onClick={startEditing}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Renommer"
              type="button"
            >
              <Pencil size={14} />
            </button>
          )}

          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Supprimer le dossier"
            type="button"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {isDragOver ? (
        <div className="mt-2 text-xs text-white/50">Relâche pour déplacer ici</div>
      ) : null}
    </li>
  );
}
