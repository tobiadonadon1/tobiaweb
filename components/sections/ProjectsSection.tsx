"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { EmberField } from "@/components/ui/ember-field";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The three projects (draft copy — Tobia rewrites later).
const PROJECTS: BentoItem[] = [
  {
    title: "The Book",
    description:
      "A long-form attempt to make sense of AI, consciousness, and what we become next — written slowly, and in public.",
    status: "in motion",
    href: "/projects/book",
    flagship: true,
  },
  {
    title: "Sole",
    description:
      "Hands-on help for people shipping their first things — positioning, product, and the push to press publish.",
    status: "open",
    href: "/projects/sole",
  },
  {
    title: "Superhuman",
    description:
      "A guided journey where small daily practices compound into abilities that feel superhuman.",
    status: "becoming",
    href: "/projects/superhuman",
  },
];

/**
 * The Projects chapter: an ink-tide transition into the bento grid.
 *
 * The stage slides in already carrying the tide — the waterline rides
 * its leading edge as the last identity card scrolls away, the navy
 * deepens to full cover, a serif line surfaces at the crest — and then
 * the whole navy block simply scrolls off the top like a normal section
 * (no recede animation), the cards arriving from below. A living net of
 * drifting nodes breathes inside the ink.
 *
 * Scroll choreography is scrubbed (sticky stage inside a tall wrapper,
 * same pattern as StackedPhrases) — transforms only, set imperatively.
 */
export function ProjectsSection() {
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const tideRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  // Live stage progress for the ember canvas (read per frame).
  const progressRef = useRef(0);

  useEffect(() => {
    const wrap = stageWrapRef.current;
    const tide = tideRef.current;
    const crest = crestRef.current;
    if (!wrap || !tide || !crest) return;

    // Initialize position via GSAP ONLY (an inline translateY(105%) here
    // once got parsed as a fixed +1606px offset that ADDED to every
    // scrubbed yPercent — the tide could never reach the screen).
    gsap.set(tide, { y: 0, yPercent: -7.5 });

    // Map stage progress → tide travel (yPercent of the tide's own 170vh;
    // stage-y of tide fraction f = 1.7·yP + 170·f, so the gradient's
    // visible edge — its top 8% is transparent — sits at 1.7·yP + 13.6vh).
    // The trigger starts at "top bottom", so p 0→0.5 is the APPROACH: the
    // stage sliding up under the departing identity card. The waterline
    // hugs the stage's leading edge through it (a ~3vh paper sliver, the
    // cyan crest line, ink deepening below), so blue is on screen the
    // moment the last card releases — never an empty paper viewport.
    //   0→0.5     approach — yP +2→0: the tide's TRUE alpha-0 edge rides at
    //             (or just below) the stage's overflow-hidden clip line, so
    //             paper melts into blue with NO visible seam. (At negative
    //             yP the clip cut the wash mid-alpha — a crisp "border"
    //             line Tobia rejected twice.)
    //   0.5→0.68  surge to -41 (solid ink covers the screen; -41 keeps the
    //             170%-tall tide's bottom at ~100.3vh; the stage is pinned
    //             by now, so the clip edge = viewport top — nothing to cut)
    //   0.68→1    HOLD at full cover. There is NO recede phase — the blue
    //             draining downward against the scroll read as "it
    //             disappears from above", which Tobia rejected. Instead the
    //             sticky releases at p=1 and the whole navy block scrolls
    //             off the top like any normal section, the cards arriving
    //             from below in plain document flow — continuative.
    const tideY = (p: number) => {
      if (p < 0.5) return gsap.utils.interpolate(2, 0, p / 0.5);
      if (p < 0.68) return gsap.utils.interpolate(0, -41, (p - 0.5) / 0.18);
      return -41;
    };
    // Crest text: surfaces once the ink behind it is solid, then RIDES the
    // navy block out of the viewport (no fade-out — it scrolls away with
    // its background, like ordinary page content).
    const crestAlpha = (p: number) => {
      if (p < 0.66) return 0;
      if (p < 0.78) return (p - 0.66) / 0.12;
      return 1;
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      // "top bottom": scrub through the approach too, so the ink arrives
      // with the section instead of after a white gap.
      start: "top bottom",
      end: "bottom bottom",
      // Snappier catch-up than scrub:1 — the recede must beat the grid
      // block into the viewport even on fast flicks.
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        gsap.set(tide, { yPercent: tideY(p) });
        const a = crestAlpha(p);
        gsap.set(crest, { opacity: a, y: (1 - a) * 18 });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="projects" className="paper-bg relative">
      {/* ---- The tide stage: sticky viewport inside a tall scroll run ----
          pointer-events-none: everything inside is decorative, and the grid
          block below overlaps this wrapper's tail (-mt) — the released
          sticky keeps covering that document range and must never eat the
          cards' hovers/clicks. */}
      <div ref={stageWrapRef} className="relative h-[200vh]">
        <div className="pointer-events-none sticky top-0 h-screen overflow-hidden">
          {/* The ink — one transform wrapper, scrubbed (position set by GSAP
              only; see effect). The wash carries its own paper-fiber grain
              baked in (a blend against the page can't survive the sticky/
              transform stacking contexts), plus a faint luminous crest line
              riding its top edge. */}
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
                  // banded visibly ("step-by-step" — rejected); a lighter
                  // steel-blue upper zone read milky against the navy.
                  // Transparency over paper does the lightening instead.
                  "linear-gradient(to top, #0b1f3a 0%, #0c2342 38%, #0e2949 55%, rgba(14,41,73,0.97) 62%, rgba(14,41,73,0.88) 68%, rgba(13,38,68,0.74) 74%, rgba(13,36,64,0.56) 79%, rgba(12,33,60,0.38) 84%, rgba(12,31,56,0.22) 88%, rgba(11,29,53,0.1) 92%, rgba(11,28,50,0.03) 95%, rgba(11,28,50,0) 98%)",
              }}
            >
              {/* Paper-fiber speckle inside the ink, masked so it fades out
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
            {/* (No crest-line glow: ANY line element at the waterline reads
                as a border — the paper must melt into the blue unmarked.) */}
          </div>

          {/* The living net — drifting nodes and hairline links in the ink */}
          <EmberField progressRef={progressRef} className="z-[1]" />

          {/* The line that surfaces at the crest */}
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

      {/* ---- After the navy block scrolls off: the three doors ----
          Plain document flow right behind the seam — the navy's bottom
          edge sweeps up and the cards are immediately there (their own
          entrance fires at "top bottom"). No header row: the crest line
          already announced the chapter. */}
      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-16">
        <BentoGrid items={PROJECTS} />
      </div>
    </section>
  );
}
