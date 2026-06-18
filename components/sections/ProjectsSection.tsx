"use client";

import { useEffect, useRef } from "react";
import {
  FeaturePanel,
  EditorialIndex,
  type ProjectEntry,
} from "@/components/ui/bento-grid";
import { EmberField } from "@/components/ui/ember-field";

/* ============================================================================
   PROJECTS — full-screen, layout 1b. Copy per funnel §3.4.

   THE LEAD is Superhuman (the OPEN/sellable B2B AI work — what businesses, and
   a major company, actually pay him for). It is the INK FEATURE. Sole + The
   Book are flat editorial index rows beside it.

   ONE CONTINUOUS INK (the seam fix): the whole chapter is a SINGLE navy ground
   (`bg-ink`) with ONE EmberField net pinned behind everything. The old build
   stacked two navy blocks (a sticky tide + a content panel), each with its own
   net canvas — they could never line up, so a hard seam showed. Now there is
   exactly one background and one net: nothing to mismatch. The chapter melts in
   from the Road's paper at the top and melts back to paper at the bottom (the
   white space before the Thoughts desktop).
   ============================================================================ */

const SUPERHUMAN: ProjectEntry = {
  title: "Superhuman",
  // funnel §3.4 — the REWRITE.
  description:
    "Consulting that makes you or your business superhuman with AI: the systems, the infrastructure, built with you and left running.",
  status: "open, taking on a few",
  href: "/projects/superhuman",
};

// Sole + The Book — the two editorial index rows. ORDER MATTERS: Sole (the
// other OPEN offer) leads; The Book sits beneath it as the horizon. The Book
// is the soul, kept quiet in size until launch (see bookShift below).
const INDEX_ROWS: ProjectEntry[] = [
  {
    title: "Sole",
    // funnel §3.4
    description:
      "Hands-on help when the thing is built but won't quite ship: positioning, decisions, and the final push to press publish.",
    unfurl:
      "Not for scaling something that already works. Sole stays with first things. If you're at the start, the door is open: write me one paragraph about what you're building. I read and answer every email myself.",
    status: "open, for first launches",
    href: "/projects/sole",
  },
  {
    title: "The Book",
    // funnel §3.4 — the soul, finishing. A date is a magnet, kept honest.
    description:
      "The horizon this whole site bends toward: the intersection of technology and the inner world, written in public.",
    unfurl:
      "The first draft is done; I'm deep in revisions, the slow part where a book becomes good. It comes out at the end of 2026. That's a real date, and I mean to keep it. Want the first chapter the week it lands? That's the whole list.",
    status: "finishing, out late 2026",
    href: "/projects/book",
  },
];

/* bookShift — POST-LAUNCH SEAM ───────────────────────────────────────────────
   When The Book launches (late 2026), it flips from a quiet index row to the
   ink feature, and Superhuman drops into the index rows. To make that switch:
     • set FEATURE = THE_BOOK entry, INDEX = [SUPERHUMAN, SOLE]
     • update The Book's status to its launched line ("out now" / a buy link)
     • move The Book's <FeaturePanel> CTA from "write me" to the real purchase
   Everything downstream is book-agnostic, so this is a data swap, not a
   rebuild. Leave Superhuman OPEN — it still pays the bills.
   ──────────────────────────────────────────────────────────────────────── */
const FEATURE = SUPERHUMAN;
const INDEX = INDEX_ROWS;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // The net is always fully alive across the whole chapter (one continuous
  // field) — EmberField reads this every frame; 1 = full intensity.
  const liveRef = useRef(1);

  // Flip the ink-cursor to paper-white while the navy chapter fills the screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        document.body.dataset.ink = e.isIntersecting ? "1" : "";
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete document.body.dataset.ink;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-ink ink-grain relative"
    >
      {/* ONE living net for the WHOLE chapter — a single canvas pinned to the
          viewport, so the constellation is continuous everywhere (no two-canvas
          seam, ever). Sits behind all content. */}
      <div aria-hidden className="pointer-events-none sticky top-0 z-0 h-screen">
        <EmberField progressRef={liveRef} className="absolute inset-0 opacity-90" />
      </div>

      {/* The content rides OVER the pinned net (pulled up one viewport). */}
      <div className="relative z-[2] -mt-[100vh]">
        {/* Entrance: the Road's paper melts into the navy at the top edge. */}
        <div aria-hidden className="melt-to-paper-t z-[3]" />

        {/* The chapter title HOLDS (pins) as you scroll into the chapter — the
            'lock'. It releases into the feature + rows below. The navy ground +
            the one net stay put the whole time, so the seam can't come back. */}
        <div className="relative h-[185vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#faf8f2]/60">
              Projects
            </span>
            <h2 className="mt-5 font-serif text-4xl tracking-tight text-[#faf8f2] md:text-6xl">
              What I&rsquo;m building.
            </h2>
          </div>
        </div>

        {/* Layout 1b: the ink feature (Superhuman) + Sole/Book index rows. */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 md:py-24">
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
            <FeaturePanel entry={FEATURE} />
            <EditorialIndex entries={INDEX} className="md:pt-1" />
          </div>
        </div>

        {/* Bottom: the navy melts back to paper — the clean white space that
            now separates this chapter from the Thoughts desktop. */}
        <div aria-hidden className="melt-to-paper-b z-[3]" />
      </div>
    </section>
  );
}
