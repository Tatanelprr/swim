"use client";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="text-xs font-semibold text-white/50">{title}</div>
      {children}
    </section>
  );
}
