"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Folder, File as FileIcon } from "lucide-react";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function SearchBar() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q.trim(), 250);

  const enabled = debouncedQ.length >= 2;

  const { data, isFetching } = api.folder.search.useQuery(
    { q: debouncedQ, limit: 12 },
    { enabled },
  );

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="text-white/50">⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher dans Swim…"
          className="w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/40"
        />
        {isFetching ? <span className="text-xs text-white/40">...</span> : null}
      </div>

      {enabled ? (
		<div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-lg">
			{!data?.folders?.length && !data?.files?.length ? (
			<div className="px-3 py-3 text-sm text-white/60">
				Aucun résultat
			</div>
			) : (
			<ul className="max-h-80 overflow-auto">
				{/* FOLDERS */}
				{data?.folders?.map((folder) => (
				<li key={folder.id}>
					<Link
					href={`/folder/${folder.id}`}
					className="flex items-center justify-between px-3 py-2 text-sm text-white/80 hover:bg-white/5"
					>
					<div className="flex items-center gap-2">
						<Folder size={18} />
						<span className="truncate">{folder.name}</span>
					</div>
					<span className="text-xs text-white/40">Dossier</span>
					</Link>
				</li>
				))}

				{/* FILES */}
				{data?.files?.map((file) => (
				<li key={file.id}>
					<Link
					href={`/file/${file.id}`}
					className="flex items-center justify-between px-3 py-2 text-sm text-white/80 hover:bg-white/5"
					>
					<div className="flex items-center gap-2">
						<FileIcon size={18} />
						<span className="truncate">{file.name}</span>
					</div>
					<span className="text-xs text-white/40">Fichier</span>
					</Link>
				</li>
				))}
			</ul>
			)}
		</div>
		) : null}

    </div>
  );
}
