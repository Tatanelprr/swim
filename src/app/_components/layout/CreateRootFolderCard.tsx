import { CreateFolder } from "~/app/_components/CreateFolder";

export function CreateRootFolderCard() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#101a33] p-4">
      <div className="text-sm font-semibold">Créer</div>
      <div className="mt-2 text-xs text-white/60">Ajoute un dossier à la racine.</div>
      <div className="mt-3">
        <CreateFolder parentId={null} />
      </div>
    </div>
  );
}
