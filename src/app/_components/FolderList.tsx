"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FileRow } from "./folder-list/FileRow";
import { FolderRow } from "./folder-list/FolderRow";
import { Section } from "./folder-list/Section";

export function FolderList({
  parentId,
  sortBy,
  sortDir,
}: {
  parentId: string | null;
  sortBy: "name" | "updatedAt";
  sortDir: "asc" | "desc";
}) {
  const utils = api.useUtils();

  const { data, isLoading } = api.folder.getByParent.useQuery({
    parentId,
    sortBy,
    sortDir,
  });

  const invalidate = async () => {
    await utils.folder.getByParent.invalidate({ parentId, sortBy, sortDir });
    await utils.folder.getTree.invalidate();
  };

  const renameFolder = api.folder.rename.useMutation({ onSuccess: invalidate });
  const deleteFolder = api.folder.delete.useMutation({ onSuccess: invalidate });
  const deleteFile = api.folder.deleteFile.useMutation({ onSuccess: invalidate });

  const moveFile = api.file.move.useMutation({ onSuccess: invalidate });
  const moveFolder = api.folder.moveFolder.useMutation({ onSuccess: invalidate });

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  if (isLoading) return <p className="text-white/60">Chargement...</p>;
  if (!data) return <p className="text-white/60">Aucun élément</p>;

  const folders = data.folders ?? [];
  const files = data.files ?? [];

  if (!folders.length && !files.length) {
    return <p className="text-white/60">Aucun élément</p>;
  }

  return (
    <div className="space-y-4">
      {files.length ? (
        <Section title="Fichiers">
          <ul className="space-y-2">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onDelete={() => deleteFile.mutate({ id: file.id })}
              />
            ))}
          </ul>
        </Section>
      ) : null}

      {folders.length ? (
        <Section title="Dossiers">
          <ul className="space-y-2">
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                isEditing={editingFolderId === folder.id}
                newName={newName}
                setNewName={setNewName}
                startEditing={() => {
                  setEditingFolderId(folder.id);
                  setNewName(folder.name);
                }}
                stopEditing={() => {
                  setEditingFolderId(null);
                  setNewName("");
                }}
                onSave={() => {
                  const trimmed = newName.trim();
                  if (!trimmed) return;
                  renameFolder.mutate({ id: folder.id, name: trimmed });
                  setEditingFolderId(null);
                  setNewName("");
                }}
                onDelete={() => deleteFolder.mutate({ id: folder.id })}
                isDragOver={dragOverFolderId === folder.id}
                onDragOver={() => setDragOverFolderId(folder.id)}
                onDragLeave={() => setDragOverFolderId(null)}
                onDrop={(payload) => {
                  setDragOverFolderId(null);

                  if (payload.type === "file") {
                    moveFile.mutate({
                      fileId: payload.id,
                      targetFolderId: folder.id,
                    });
                    return;
                  }

                  if (payload.type === "folder" && payload.id !== folder.id) {
                    moveFolder.mutate({
                      id: payload.id,
                      newParentId: folder.id,
                    });
                  }
                }}
              />
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}