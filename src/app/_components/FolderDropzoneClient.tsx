"use client";

import { Dropzone } from "./Dropzone";
import { api } from "~/trpc/react";

export function FolderDropzoneClient({ folderId }: { folderId: string | null }) {
  const utils = api.useUtils();

  return (
    <Dropzone
      folderId={folderId}
      onUploaded={async () => {
        await utils.folder.getByParent.invalidate({
          parentId: folderId ?? null,
        });
      }}
    />
  );
}