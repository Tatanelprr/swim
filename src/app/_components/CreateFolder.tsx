"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

type CreateFolderProps = {
  parentId: string | null;
  compact?: boolean; // utile si un jour tu veux une version petite
};

export function CreateFolder({ parentId, compact }: CreateFolderProps) {
  const [name, setName] = useState("");
  const utils = api.useUtils();

  const createFolder = api.folder.create.useMutation({
    onSuccess: async () => {
      setName("");
      await utils.folder.getByParent.invalidate({ parentId });
      await utils.folder.getTree.invalidate();
    },
  });

  const disabled = !name.trim() || createFolder.isPending;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/70">
        Nouveau dossier
      </label>

      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du dossier"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              createFolder.mutate({ name: name.trim(), parentId });
            }
          }}
        />

        <button
          onClick={() => createFolder.mutate({ name: name.trim(), parentId })}
          disabled={disabled}
          className={[
            "shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition",
            disabled
              ? "cursor-not-allowed bg-white/10 text-white/40"
              : "bg-white text-[#0b1020] hover:bg-white/90",
          ].join(" ")}
          aria-label="Créer le dossier"
        >
          {compact ? "＋" : createFolder.isPending ? "..." : "Créer"}
        </button>
      </div>

      {createFolder.error ? (
        <p className="text-xs text-red-300">
          Impossible de créer le dossier.
        </p>
      ) : null}
    </div>
  );
}
