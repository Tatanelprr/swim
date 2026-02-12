import { HydrateClient } from "~/trpc/server";

import { TopBar } from "~/app/_components/layout/TopBar";
import { Sidebar } from "~/app/_components/layout/Sidebar";
import { Footer } from "~/app/_components/layout/Footer";

import { CreateFolder } from "~/app/_components/CreateFolder";
import { FolderViewClient } from "~/app/_components/FolderViewClient";
import { FolderList } from "~/app/_components/FolderList";
import { BackButton } from "~/app/_components/BackButton";
import { FolderDropzoneClient } from "~/app/_components/FolderDropzoneClient";

const isDev = process.env.NODE_ENV === "development";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0b1020] text-white">
        <TopBar folderId={folderId} />
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
          <Sidebar isDev={isDev} />

          <main className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BackButton />
                  <h1 className="text-lg font-semibold">Mon Swim</h1>
                </div>
              </div>

              <div className="hidden md:block">
                <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                  Dossier: {folderId.slice(0, 8)}…
                </span>
              </div>
            </div>

            <div className="mt-6">
              <FolderDropzoneClient folderId={folderId} />
            </div>

            <FolderViewClient folderId={folderId} />

          </main>
        </div>

        <Footer />
      </div>
    </HydrateClient>
  );
}
