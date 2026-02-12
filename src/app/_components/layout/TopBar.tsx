"use client";
import { Folder, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImportButton } from "./ImportButton";
import { SearchBar } from "./SearchBar";

export function TopBar({ folderId }: { folderId?: string | null }) {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl">
            <span className="flex items-center gap-2">
            <Folder size={18} />
            </span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white/90">Swim</div>
            <div className="text-xs text-white/50">Espace de fichiers</div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
			<SearchBar />
		</div>


        <div className="ml-auto flex items-center gap-2">
          <ImportButton folderId={folderId ?? null} onUploaded={() => router.refresh()} />
          <button className="whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#0b1020] hover:bg-white/90">
            Créer un fichier
          </button>
        </div>
      </div>
    </header>
  );
}
