"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LIBRARY_HREF } from "./access";
import { BLOCKS } from "./catalog.generated";
import { groundOf, Stage } from "./stage";

/**
 * THE DASHBOARD'S DESIGN SECTION: the library, in a window. The three newest
 * blocks running for real, how many there are, and the way into the
 * library, where a member picks what to take, one block at a time. Loaded only when
 * the section opens (member-sections.tsx imports it lazily), so the blocks
 * don't weigh on the rest of the dashboard.
 */
export default function DesignDashboardShelf() {
  const newest = [...BLOCKS].sort((a, b) => b.added.localeCompare(a.added) || b.order - a.order).slice(0, 3);
  return (
    <div className="mt-7 overflow-hidden rounded-[2rem] border border-[var(--hairline)] bg-white">
      <ul className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-3">
        {newest.map((b) => (
          <li key={b.slug}>
            <Link
              href={`${LIBRARY_HREF}?block=${b.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
            >
              <span
                className="relative block aspect-[44/34] overflow-hidden rounded-[1.5rem]"
                style={{ background: groundOf(b), color: b.dark ? "#f4f1ea" : "var(--ink)" }}
              >
                {/* A window, not a playground: the click opens the block in the library. */}
                <span className="pointer-events-none absolute inset-0" aria-hidden>
                  <Stage width={440} height={340}>
                    <b.Component />
                  </Stage>
                </span>
              </span>
              <span className="mt-2 flex items-baseline justify-between px-2 pb-1 text-[0.92rem]">
                <span className="font-medium">{b.title}</span>
                <span className="text-[color:rgba(11,31,58,0.5)] transition-colors group-hover:text-[var(--ink)]">{b.category} →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] p-6">
        <div>
          <p className="text-[1.1rem] font-medium">The design library · {BLOCKS.length} components</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={LIBRARY_HREF}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-5 text-[0.95rem] text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            Open the library
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
