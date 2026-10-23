"use client";

import { BLOCKS } from "@/components/design-library/catalog.generated";

/** The block at its defaults, in a gallery-sized card and a detail-sized stage. */
export function LabBlock({ slug }: { slug: string }) {
  const b = BLOCKS.find((x) => x.slug === slug)!;
  const ground = b.ground ?? (b.dark ? "#16181d" : "#efebe3");
  return (
    <main className="min-h-[100svh] bg-[var(--paper)] p-8 text-[var(--ink)]">
      <p className="mb-4 text-sm opacity-60">
        {b.title} · {b.category}
      </p>
      <div className="flex flex-wrap items-start gap-8">
        <div data-lab="card" className="grid h-[340px] w-[440px] max-w-full place-items-center overflow-hidden rounded-[28px]" style={{ background: ground }}>
          <b.Component />
        </div>
        <div data-lab="stage" className="grid h-[600px] w-[680px] max-w-full place-items-center overflow-hidden rounded-[28px]" style={{ background: ground }}>
          <b.Component />
        </div>
      </div>
    </main>
  );
}
