import type { ReactNode } from "react";

export function StaticPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-display text-display-m text-ink">{title}</h1>
      {description && <p className="mt-2 font-body text-sm text-stone">{description}</p>}
      <div className="mt-10 space-y-6 font-body text-sm leading-relaxed text-ink">
        {children}
      </div>
    </div>
  );
}
