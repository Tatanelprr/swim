import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

import { Footer } from "./_components/layout/Footer";
import { Sidebar } from "./_components/layout/Sidebar";
import { TopBar } from "./_components/layout/TopBar";

import { CreateFolder } from "./_components/CreateFolder";
import { FolderList } from "./_components/FolderList";
import { FolderDropzoneClient } from "./_components/FolderDropzoneClient";
import { FolderViewClient } from "./_components/FolderViewClient";

const isDev = process.env.NODE_ENV === "development";
export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getSession();

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-[#0b1020] text-white">
        <TopBar folderId={null} />
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
          <Sidebar isDev={isDev} showRootCreate />

          <main className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold">Mon Swim</div>
            </div>

            <div className="mt-6">
              <FolderDropzoneClient folderId={null} />
            </div>

            {isDev ? (
              <FolderViewClient folderId={null} />
            ) : (
              <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
                <div className="text-4xl">🏊‍♂️</div>
                <div className="mt-3 text-base font-semibold">Swim</div>
                <div className="mt-1 text-sm text-white/60">
                  Active le mode dev pour afficher la vue Swim.
                </div>
              </div>
            )}

          </main>
        </div>

        <Footer />
      </div>
    </HydrateClient>
  );

}