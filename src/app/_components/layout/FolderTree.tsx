"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { Folder } from "lucide-react";

type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
};

export function FolderTree() {
  const { data } = api.folder.getTree.useQuery();
  const params = useParams();
  const currentFolderId = params?.folderId as string | undefined;

  if (!data) return null;

  // Construire arbre
  const buildTree = (parentId: string | null): FolderNode[] => {
    return data.filter((folder) => folder.parentId === parentId);
  };

  const renderTree = (parentId: string | null, level = 0) => {
    const children = buildTree(parentId);

    return children.map((folder) => {
      const isActive = folder.id === currentFolderId;

      return (
        <div key={folder.id}>
          <Link
            href={`/folder/${folder.id}`}
            className={[
              "flex items-center gap-2 rounded-lg px-2 py-1 text-sm",
              "hover:bg-white/10",
              isActive ? "bg-white/15 text-white" : "text-white/80",
            ].join(" ")}
            style={{ paddingLeft: `${level * 16}px` }}
          >
            <Folder size={14} />
            {folder.name}
          </Link>

          {renderTree(folder.id, level + 1)}
        </div>
      );
    });
  };

  return <div className="space-y-1">{renderTree(null)}</div>;
}