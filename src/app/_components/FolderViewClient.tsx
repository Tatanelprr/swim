"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

import { CreateFolder } from "~/app/_components/CreateFolder";
import { FolderList } from "~/app/_components/FolderList";

type SortBy = "name" | "updatedAt";
type SortDir = "asc" | "desc";

export function FolderViewClient({ folderId }: { folderId: string | null }) {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const options: Array<{
    key: `${SortBy}:${SortDir}`;
    label: string;
    sortBy: SortBy;
    sortDir: SortDir;
  }> = [
    { key: "name:asc", label: "Nom (A → Z)", sortBy: "name", sortDir: "asc" },
    { key: "name:desc", label: "Nom (Z → A)", sortBy: "name", sortDir: "desc" },
    { key: "updatedAt:desc", label: "Modifié (récent)", sortBy: "updatedAt", sortDir: "desc" },
    { key: "updatedAt:asc", label: "Modifié (ancien)", sortBy: "updatedAt", sortDir: "asc" },
  ];

  const currentKey = `${sortBy}:${sortDir}` as const;

  return (
    <div className="mt-6 grid gap-4">
      {/* Barre d’actions (bouton Trier) */}
      <div className="relative flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          Trier
          <ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"} />
        </button>

        {open ? (
          <>
            {/* overlay click-outside */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold text-white/60">
                Trier par
              </div>
              <ul className="py-1">
                {options.map((opt) => {
                  const active = opt.key === currentKey;
                  return (
                    <li key={opt.key}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                        onClick={() => {
                          setSortBy(opt.sortBy);
                          setSortDir(opt.sortDir);
                          setOpen(false);
                        }}
                      >
                        <span className="truncate">{opt.label}</span>
                        {active ? <Check size={16} /> : <span className="w-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : null}
      </div>

      {/* Liste triée */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <FolderList parentId={folderId} sortBy={sortBy} sortDir={sortDir} />
      </section>
    </div>
  );
}
