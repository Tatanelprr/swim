"use client";

type SortBy = "name" | "updatedAt";
type SortDir = "asc" | "desc";

export function SortControl({
  sortBy,
  sortDir,
  onChange,
}: {
  sortBy: SortBy;
  sortDir: SortDir;
  onChange: (v: { sortBy: SortBy; sortDir: SortDir }) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-xs text-white/50">Trier par</div>

      <button
        type="button"
        onClick={() => onChange({ sortBy: "name", sortDir })}
        className={[
          "rounded-xl border px-3 py-2 text-sm",
          sortBy === "name"
            ? "border-white/20 bg-white/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
        ].join(" ")}
      >
        Nom
      </button>

      <button
        type="button"
        onClick={() => onChange({ sortBy: "updatedAt", sortDir })}
        className={[
          "rounded-xl border px-3 py-2 text-sm",
          sortBy === "updatedAt"
            ? "border-white/20 bg-white/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
        ].join(" ")}
      >
        Date de modification
      </button>

      <div className="mx-1 h-6 w-px bg-white/10" />

      <button
        type="button"
        onClick={() => onChange({ sortBy, sortDir: sortDir === "asc" ? "desc" : "asc" })}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      >
        {sortDir === "asc" ? "Asc" : "Desc"}
      </button>
    </div>
  );
}
