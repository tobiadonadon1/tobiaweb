"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FeaturePanel,
  EditorialIndex,
  type ProjectEntry,
} from "@/components/ui/bento-grid";
import { EmberField } from "@/components/ui/ember-field";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================================
   PROJECTS — full-screen, layout 1b. Copy per funnel §3.4.

   THE LEAD is Superhuman (the OPEN/sellable B2B AI work — what businesses, and
   a major company, actually pay him for). It is the INK FEATURE. Sole + The
   Book are flat editorial index rows beside it. The Road has just proven Tobia
   by compounding, so these read as obvious; the offers are loud in content,
   quiet in size.

   The Book is the SOUL, never the proof — it NEVER headlines until launch.
   ============================================================================ */

const SUPERHUMAN: ProjectEntry = {
  title: "Superhuman",
  // funnel §3.4 — the REWRITE.
  description:
    "Consulting that makes you or your business superhuman with AI — the systems, the infrastructure, built with you and left running.",
  status: "open — taking on a few",
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
      "Hands-on help when the thing is built but won't quite ship — positioning, decisions, and the final push to press publish.",
    unfurl:
      "Not for scaling something that already works — Sole stays with first things. If you're at the start, the door is open: write me one paragraph about what you're building. I read and answer every email myself.",
    status: "open — for first launches",
    href: "/projects/sole",
  },
  {
    title: "The Book",
    // funnel §3.4 — the soul, finishing. A date is a magnet, kept honest.
    description:
      "The horizon this whole site bends toward — the intersection of technology and the inner world, written in public.",
    unfurl:
      "The first draft is done; I'm deep in revisions — the slow part where a book becomes good. It comes out at the end of 2026. That's a real date, and I mean to keep it. Want the first chapter the week it lands? That's the whole list.",
    status: "finishing — out late 2026",
    href: "/projects/book",
  },
];

/* bookShift — POST-LAUNCH SEAM ───────────────────────────────────────────────
   When The Book launches (late 2026), it flips from a quiet index row to the
   ink feature, and Superhuman drops into the index rows. To make that switch:
     • set FEATURE = THE_BOOK entry, INDEX = [SUPERHUMAN, SOLE]
     • update The Book's status to its launched line ("out now" / a buy link)
     • move The Book's <FeaturePanel> CTA from "write me" to the real purchase
   Everything downstream (the ink feature treatment, the index rows, the
   shared-element expand, the tide) is already book-agnostic, so this is a
   data swap, not a rebuild. Leave Superhuman OPEN — it still pays the bills.
   ──────────────────────────────────────────────────────────────────────── */
const FEATURE = SUPERHUMAN;
const INDEX = INDEX_ROWS;

/**
 * The Projects chapter.
 *
 * RECONCILING THE TIDE WITH THE FEATURE (spec §3.3.7): the old section let the
 * ink-tide rise, crest, then scroll OFF to reveal PAPER bento cards. The new
 * full-screen feature is itself navy — keeping both would stack two fighting
 * navy blocks. So the tide no longer drains away: it DEPOSITS the screen into
 * a held navy ground, and the feature + index rows live directly on that ink.
 * One continuous ink.
 *
 * Mechanically: the scrubbed tide stage (sticky, 170%-tall wash) plays the
 * APPROACH exactly as before — paper melts into rising navy, the crest line
 * surfaces — but it settles at full cover and HOLDS. The content panel sits in
 * the same flow with a negative top margin, so its own .ink-field ground (the
 * SAME navy hue the tide deposited) tucks directly under the settled tide:
 * when the sticky releases, navy meets navy with no seam, and the crest line
 * rides up to become the chapter header above the feature. The EmberField
 * living net breathes inside the feature ink. The ink-cursor signal stays on
 * the whole time navy fills the screen.
 */
export function ProjectsSection() {
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const tideRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Live tide progress for the entrance ember canvas (read per frame).
  const progressRef = useRef(0);
  // The content-panel net is always fully alive (its ink is permanent), so it
  // breathes behind the feature even after the tide stage has scrolled off.
  const liveRef = useRef(1);

  useEffect(() => {
    const wrap = stageWrapRef.current;
    const tide = tideRef.current;
    const crest = crestRef.current;
    const content = contentRef.current;
    if (!wrap || !tide || !crest || !content) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: no scrub. The ink is simply present — the content panel
    // carries its own .ink-field, so we just pin the cursor signal on while
    // the section is in view and show the crest. No tide travel.
    if (reduced) {
      gsap.set(tide, { yPercent: -41 });
      gsap.set(crest, { opacity: 1, y: 0 });
      const io = new IntersectionObserver(
        ([e]) => {
          document.body.dataset.ink = e.isIntersecting ? "1" : "";
        },
        { threshold: 0.4 }
      );
      io.observe(content);
      return () => {
        io.disconnect();
        delete document.body.dataset.ink;
      };
    }

    // Initialize position via GSAP ONLY (an inline translateY(105%) here once
    // got parsed as a fixed +1606px offset that ADDED to every scrubbed
    // yPercent — the tide could never reach the screen). Respect that.
    gsap.set(tide, { y: 0, yPercent: -7.5 });

    // Map stage progress → tide travel (yPercent of the tide's own 170vh).
    // The trigger starts at "top bottom", so p 0→0.5 is the APPROACH: the
    // stage sliding up under the departing Road section. The waterline hugs
    // the stage's leading edge through it, so blue is on screen the moment the
    // last Road content releases — never an empty paper viewport.
    //   0→0.5     approach — yP +2→0: the tide's TRUE alpha-0 edge rides at
    //             (or just below) the stage's overflow-hidden clip line, so
    //             paper melts into blue with NO visible seam.
    //   0.5→0.7   surge to -41: solid ink covers the screen and STAYS. (Unlike
    //             the old build, there is no later drain — the navy is the
    //             feature's ground now, so it must end at full cover.)
    //   0.7→1     HELD at full cover; the sticky then releases at p=1 and the
    //             stage scrolls up, the crest riding with it to sit atop the
    //             feature, whose own .ink-field continues the identical navy.
    const tideY = (p: number) => {
      if (p < 0.5) return gsap.utils.interpolate(2, 0, p / 0.5);
      if (p < 0.7) return gsap.utils.interpolate(0, -41, (p - 0.5) / 0.2);
      return -41;
    };
    // The chapter title fades in once the ink behind it is solid, fills the
    // navy entrance, then rides up with the stage as the sticky releases.
    const crestAlpha = (p: number) => {
      if (p < 0.66) return 0;
      if (p < 0.78) return (p - 0.66) / 0.12;
      return 1;
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        gsap.set(tide, { yPercent: tideY(p) });
        const a = crestAlpha(p);
        gsap.set(crest, { opacity: a, y: (1 - a) * 18 });
        // The ink-cursor flips to paper-white while the screen is mostly navy.
        // Keep it on through the hold (p≥0.5) AND hand off to the content's own
        // observer below, so the signal never blinks at the seam.
        if (self.isActive && p >= 0.5) document.body.dataset.ink = "1";
      },
    });

    // Once the tide has scrolled off, the content panel (its own .ink-field)
    // fills the screen — keep the ink-cursor signal alive over it, then clear
    // when the navy content finally leaves the viewport (handing to neighbours).
    const contentIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) document.body.dataset.ink = "1";
        else if (!st.isActive) document.body.dataset.ink = "";
      },
      { threshold: 0.35 }
    );
    contentIO.observe(content);

    return () => {
      st.kill();
      contentIO.disconnect();
      delete document.body.dataset.ink;
    };
  }, []);

  return (
    <section id="projects" className="relative">
      {/* ---- The tide stage: the ink ENTRANCE (sticky viewport, tall run) ----
          Unchanged in spirit from the loved version, but it now settles at full
          cover and holds — it deposits the screen into navy instead of
          draining away. pointer-events-none: purely decorative; the content
          panel below carries all interaction. */}
      <div ref={stageWrapRef} className="paper-bg relative h-[200vh]">
        <div className="pointer-events-none sticky top-0 h-screen overflow-hidden">
          {/* The ink wash — one transform wrapper, scrubbed (position set by
              GSAP only). Carries its own paper-fibre grain baked in (a blend
              against the page can't survive the sticky/transform stacking
              contexts). */}
          <div
            ref={tideRef}
            className="absolute inset-x-0 top-0 z-0 h-[170%]"
            style={{ willChange: "transform" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  // ONE deep-navy hue with a long, eased alpha falloff
                  // (~smoothstep across many close stops). Few-stop ramps
                  // banded visibly; transparency over paper does the lightening.
                  // The SOLID bottom (#0b1f3a) is the exact ground the content
                  // .ink-field continues — so navy meets navy at the seam.
                  "linear-gradient(to top, #0b1f3a 0%, #0c2342 38%, #0e2949 55%, rgba(14,41,73,0.97) 62%, rgba(14,41,73,0.88) 68%, rgba(13,38,68,0.74) 74%, rgba(13,36,64,0.56) 79%, rgba(12,33,60,0.38) 84%, rgba(12,31,56,0.22) 88%, rgba(11,29,53,0.1) 92%, rgba(11,28,50,0.03) 95%, rgba(11,28,50,0) 98%)",
              }}
            >
              {/* Paper-fibre speckle inside the ink, masked so it fades out
                  with the wash (never a dusty band above the crest). */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='9'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.65 0 0 0 0 0.72 0 0 0 0 0.85 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  maskImage:
                    "linear-gradient(to top, black 0%, black 55%, transparent 95%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, black 0%, black 55%, transparent 95%)",
                }}
              />
            </div>
          </div>

          {/* The living net — drifting nodes/links, breathing in the ink. */}
          <EmberField progressRef={progressRef} className="z-[1]" />

          {/* The chapter title — it lives HERE, on the navy entrance, fading in
              once the ink is solid so it fills the screen the tide deposited
              (not empty navy). It then rides up with the stage as the sticky
              releases. The feature panel below carries NO header — the title is
              shown once, here. */}
          <div
            ref={crestRef}
            className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#faf8f2]/60">
              Projects
            </span>
            <h2 className="mt-5 font-serif text-4xl tracking-tight text-[#faf8f2] md:text-6xl">
              What I&rsquo;m building.
            </h2>
          </div>
        </div>
      </div>

      {/* ---- The full-screen content, ON the navy the tide deposited ----
          The -mt tucks this panel's .ink-field under the settled tide so the
          sticky release reveals an identical navy (no seam). This is the ONE
          continuous ink: feature + rows live here, the EmberField breathes
          behind, the crest header rides in from the tide above. */}
      <div
        ref={contentRef}
        className="ink-field ink-grain relative z-[3] -mt-px min-h-screen overflow-hidden"
      >
        {/* The living net continues behind the feature ink (the entrance net
            scrolled off with the tide). Always alive — liveRef is pinned at 1. */}
        <EmberField progressRef={liveRef} className="z-0 opacity-80" />

        {/* Seam (lead reconcile): the feature ink melts at its bottom into the
            paper of Thoughts below — navy → paper with no waterline. Above the
            ground/net, below the content. */}
        <div aria-hidden className="melt-to-paper-b z-[1]" />

        <div className="relative z-[2] mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 md:py-24">
          {/* No header here — the chapter title "What I'm building." lives on
              the navy entrance above (the tide crest), shown once. */}

          {/* Layout 1b: the ink feature (Superhuman) dominant; Sole + Book as
              flat editorial index rows beside it. Asymmetric — the feature is
              wider; the rows are a calm typeset column. NOT three equal floats. */}
          <div className="grid flex-1 grid-cols-1 items-stretch gap-8 md:grid-cols-[1.35fr_1fr] md:gap-12">
            <FeaturePanel entry={FEATURE} />
            {/* The index column is transparent (it shows the page ink); only
                its hairlines and type carry it. */}
            <EditorialIndex entries={INDEX} className="md:pt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
