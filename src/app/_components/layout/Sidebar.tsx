import Link from "next/link";
import { CreateRootFolderCard } from "~/app/_components/layout/CreateRootFolderCard";
import { FolderTree } from "~/app/_components/layout/FolderTree";
type SidebarProps = {
  isDev: boolean;
  showRootCreate?: boolean;
};

export function Sidebar({ isDev, showRootCreate }: SidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/90">Navigation</div>
        {isDev ? (
          <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/70">
            DEV
          </span>
        ) : null}
      </div>

      <nav className="mt-4 space-y-1">
        <Link
          href="/"
          className="block w-full rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white hover:bg-white/15"
        >
          Swim
        </Link>

        <div className="mt-3">
    <FolderTree />
  </div>
      </nav>
    </aside>
  );
}
