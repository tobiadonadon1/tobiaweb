"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   PROJECTS — layout 1b.

   Superhuman is the INK FEATURE (deep-navy panel, the OPEN/sellable lead).
   Sole + The Book are FLAT EDITORIAL INDEX ROWS beside it — hairline rules,
   mono status, serif title, NO glass, NO equal floats. Hover unfurls a row
   (it grows; its sibling recedes; more copy surfaces). Click runs the shared-
   element expand into the project page (a body-level sheet that grows to
   fullscreen, turns to paper, the route swaps beneath, then the sheet lifts).

   The whole arrangement lives ON the navy that the tide deposited (see
   ProjectsSection) — one continuous ink, not a second navy block.
   ============================================================================ */

export interface ProjectEntry {
  title: string;
  /** Short body shown at rest in the row / under the feature title. */
  description: string;
  /** Extra copy that surfaces only when a row unfurls (hover/focus). */
  unfurl?: string;
  /** Quiet mono status — e.g. "open — for first launches". */
  status: string;
  href: string;
  /**
   * Optional REAL, ungraded photo to reveal on unfurl. Omit until Tobia
   * provides one — we never ship a grey placeholder block (spec §3.3.4).
   */
  photo?: { src: string; alt: string };
}

/* Back-compat alias: the old call sites typed items as BentoItem. */
export type BentoItem = ProjectEntry & { flagship?: boolean };

// Open-into-the-page timing: the sheet expands over ~0.6s, the route swaps
// beneath it, then the sheet lifts to reveal the risen page.
const EXPAND_S = 0.6;
const PUSH_MS = 420;
const REVEAL_MS = 1000;

const SHEET_SHADOW =
  "0 30px 70px rgba(8,18,34,0.45), 0 10px 22px rgba(8,18,34,0.3)";

/**
 * Shared-element expansion, reused by the feature panel and the index rows.
 * A body-level sheet at the clicked element's exact rect grows to fullscreen
 * (vanilla DOM — it must survive the route change), turning to paper as it
 * goes. Returns a click handler; the second arg dims its host while opening.
 *
 * Reduced motion: router.push directly (no sheet). Cmd/middle/shift-click and
 * non-primary buttons fall through to native new-tab behaviour.
 */
function useSharedExpand(onOpenChange: (opening: boolean) => void) {
  const router = useRouter();
  const navigating = useRef(false);

  return (e: React.MouseEvent<HTMLAnchorElement>, href: string, fromInk: boolean) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    onOpenChange(true);

    const sheet = document.createElement("div");
    Object.assign(sheet.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: "20px",
      // Starts in the element's own world (ink rows start navy, so the sheet
      // doesn't flash paper before turning), then paper fades up beneath.
      background: fromInk
        ? "linear-gradient(150deg, #0c2342, #0b1f3a)"
        : "linear-gradient(145deg, #fdfcf9, #f7f5ef)",
      border: "1px solid rgba(207,233,238,0.12)",
      boxShadow: SHEET_SHADOW,
      zIndex: "80",
      pointerEvents: "none",
      willChange: "top, left, width, height",
    } as Partial<CSSStyleDeclaration>);

    const paper = document.createElement("div");
    Object.assign(paper.style, {
      position: "absolute",
      inset: "0",
      borderRadius: "inherit",
      background: "#faf8f2",
      opacity: "0",
    } as Partial<CSSStyleDeclaration>);
    sheet.appendChild(paper);
    document.body.appendChild(sheet);

    gsap.to(sheet, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: EXPAND_S,
      ease: "power3.inOut",
    });
    gsap.to(paper, { opacity: 1, duration: 0.45, delay: 0.15, ease: "power2.out" });

    window.setTimeout(() => router.push(href), PUSH_MS);
    window.setTimeout(() => {
      gsap.to(sheet, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => sheet.remove(),
      });
    }, REVEAL_MS);
  };
}

/* The hover-revealed cue (typographic). Tone adapts to its ground. */
function EnterCue({ onInk }: { onInk?: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 font-mono text-[11px] tracking-wide opacity-60",
        "transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100",
        "group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100",
        onInk
          ? "text-[#cfe9ee]/55 group-hover:text-[#7dd3fc]"
          : "text-black/35 group-hover:text-cyan-900/80"
      )}
    >
      Enter
      <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  );
}

/* ----------------------------------------------------------------------------
   SUPERHUMAN — the ink feature panel (the OPEN/sellable lead).
   Deep-navy ground (the page's ink continues into it via .ink-field), mono
   status, serif title, body, and a "write me" CTA. NOT The Book.
   ---------------------------------------------------------------------------- */
export function FeaturePanel({
  entry,
  className,
}: {
  entry: ProjectEntry;
  className?: string;
}) {
  const [opening, setOpening] = useState(false);
  const expand = useSharedExpand(setOpening);

  return (
    <Link
      href={entry.href}
      onClick={(e) => expand(e, entry.href, true)}
      className={cn(
        "group relative flex h-full min-h-[clamp(300px,40vh,420px)] flex-col justify-between",
        "overflow-hidden rounded-[20px] outline-none",
        "ink-field ink-grain border border-[color:var(--hairline-on-ink)]",
        "p-8 md:p-11",
        "transition-[transform,opacity,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 focus-visible:-translate-y-1",
        opening && "opacity-40 duration-500",
        className
      )}
      style={{
        boxShadow:
          "0 24px 60px rgba(8,18,34,0.4), inset 0 1px 0 rgba(207,233,238,0.06)",
      }}
    >
      {/* A live sky band that warms on hover — the accent reserved for the
          interactive moment, low at rest, lifting under the pointer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 18% 110%, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.05) 38%, transparent 66%)",
        }}
      />

      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7dd3fc]/80">
          {entry.status}
        </span>
        <h3 className="mt-6 font-serif text-4xl leading-[0.98] tracking-tight text-[#faf8f2] md:text-6xl">
          {entry.title}
        </h3>
        <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-[#cfe9ee]/75 md:text-lg">
          {entry.description}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex items-end justify-between gap-6">
        {/* The "write me" CTA — the sellable lead's real call. It lives inside
            the card link, so we stop the row-open and route nowhere: the page
            CTA mailto is on the product page; here it just reads as the cue to
            open. (Kept as text, not a second nav target, to avoid nested <a>.) */}
        <span className="font-serif text-lg italic text-[#faf8f2]/85 md:text-xl">
          Write me. Tell me what you&rsquo;re building.
        </span>
        <EnterCue onInk />
      </div>
    </Link>
  );
}

/* ----------------------------------------------------------------------------
   EDITORIAL INDEX — Sole + The Book as flat hairline rows on the ink.
   Hover/focus UNFURLS a row: it grows (flex-grow) and reveals its extra copy
   (and a real ungraded photo if provided); the sibling recedes. No glass.
   The whole stack uses .editorial-index--on-ink for paper-on-ink hairlines.
   ---------------------------------------------------------------------------- */
export function EditorialIndex({
  entries,
  className,
}: {
  entries: ProjectEntry[];
  className?: string;
}) {
  const [opening, setOpening] = useState(false);
  const expand = useSharedExpand(setOpening);
  // Which row is unfurled (hover/focus). On touch / no-hover this stays null
  // and the rows simply read as a calm typeset list — still fully tappable.
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "editorial-index editorial-index--on-ink flex h-full flex-col",
        opening && "pointer-events-none opacity-40 transition-opacity duration-500",
        className
      )}
    >
      {entries.map((entry) => {
        const isActive = active === entry.href;
        const isRecessed = active !== null && !isActive;
        return (
          <Link
            key={entry.href}
            href={entry.href}
            onClick={(e) => expand(e, entry.href, true)}
            onMouseEnter={() => setActive(entry.href)}
            onMouseLeave={() => setActive((cur) => (cur === entry.href ? null : cur))}
            onFocus={() => setActive(entry.href)}
            onBlur={() => setActive((cur) => (cur === entry.href ? null : cur))}
            className={cn(
              "group relative flex min-h-0 flex-col justify-center overflow-hidden outline-none",
              // The unfurl: flex-grow drives the grow/recede; opacity dims the
              // sibling. Settle ~0.55s (within the hover≤300ms / settle window;
              // this is the size-change "settle" not the hover-tint).
              "transition-[flex-grow,opacity] duration-[550ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
              "py-6 md:py-7",
              isActive ? "flex-[2.4]" : isRecessed ? "flex-[0.85] opacity-55" : "flex-1"
            )}
            style={{ flexGrow: isActive ? 2.4 : isRecessed ? 0.85 : 1 }}
          >
            <div className="flex items-baseline justify-between gap-5">
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#cfe9ee]/55 transition-colors duration-300 group-hover:text-[#7dd3fc]/90 group-focus-visible:text-[#7dd3fc]/90">
                  {entry.status}
                </span>
                <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-[#faf8f2] md:text-4xl">
                  {entry.title}
                </h3>
              </div>
              <EnterCue onInk />
            </div>

            {/* Rest body — always present, single line, quiet. */}
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#cfe9ee]/65">
              {entry.description}
            </p>

            {/* Unfurled extra — grid-rows trick animates height with no fixed
                px (no inline % transform — respects the GSAP trap lesson; this
                is pure CSS grid, not a transform). */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-[550ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                isActive ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                {entry.unfurl && (
                  <p className="max-w-md text-sm leading-relaxed text-[#cfe9ee]/80">
                    {entry.unfurl}
                  </p>
                )}
                {/* A REAL, ungraded photo if (and only if) one is provided —
                    no sea-tone grading, no grey placeholder box. */}
                {entry.photo && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={entry.photo.src}
                    alt={entry.photo.alt}
                    className="mt-5 w-full max-w-md rounded-md border border-[color:var(--hairline-on-ink)] object-cover"
                  />
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Back-compat shim: the previous default export. ProjectsSection no longer
   uses this (it composes FeaturePanel + EditorialIndex directly), but keeping
   it means any stray import won't break the build. It renders the new layout
   1b from a flat item list: the flagship item becomes the feature, the rest
   become index rows.
   ---------------------------------------------------------------------------- */
export function BentoGrid({
  items,
  className,
}: {
  items: BentoItem[];
  className?: string;
}) {
  const feature = items.find((i) => i.flagship) ?? items[0];
  const rows = items.filter((i) => i !== feature);
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      <FeaturePanel entry={feature} />
      <EditorialIndex entries={rows} />
    </div>
  );
}
