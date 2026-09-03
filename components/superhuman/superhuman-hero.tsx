"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ConstructStar } from "./construct-star";
import { HandNote } from "@/components/ui/hand-note";
import { SECTION_LABELS } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin);
}

/** Rendered height of the hero mark, in px. */
const STAR_PX = 168;

/**
 * SECTION 1, curiosity: a mark, a claim, almost nothing else.
 *
 * Device family: SVG draw-on plus kinetic type. The star arrives the way it
 * was made, one ray at a time, cut as an outline before the paper fills in
 * behind it. Then "Superhuman" comes up out of its own baseline, letter by
 * letter.
 *
 * Nothing here is hidden without JavaScript: the server renders the finished
 * state, and the effect only hides what it has already decided to animate.
 */
export function SuperhumanHero() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    // Splitting before the webfont lands measures the fallback's metrics and
    // leaves the characters a pixel or two out of place, permanently.
    document.fonts.ready.then(() => {
      if (cancelled || !scope.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // IT IS DRAWN, so it arrives drawn: the blue outline strokes itself on
        // the way a hand would put it down, and only then does the red get
        // filled in behind it. That is the whole entrance.
        tl.from(".cs-outline", {
          drawSVG: "0%",
          duration: 1.05,
          ease: "power1.inOut",
        });
        tl.from(
          ".cs-fill",
          { opacity: 0, scale: 0.86, transformOrigin: "50% 50%", duration: 0.55 },
          "-=0.3",
        );

        // NOTHING SPINS. The old mark turned once every 96 seconds, which a
        // computed star can carry and a drawing cannot: a hand drawn shape on
        // a slow rotation reads as a sticker on a fan.
      }, scope);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={scope}
      id="hero"
      data-sh-section={SECTION_LABELS.hero}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-36 pt-28 text-center sm:pb-28 sm:pt-32"
    >
      {/* The mark. One object now, not two stacked copies of a geometry:
          the outline and the fill are the two layers of the drawing itself. */}
      <div className="relative" style={{ height: STAR_PX, width: STAR_PX }}>
        <ConstructStar id="hero" className="h-full w-full" />
      </div>

      <h1
        data-hero-title
        // leading-[0.9] made the line box shorter than the glyphs, and
        // SplitText's per-character masks are overflow:hidden, so the p's
        // descender in "Super" was sliced clean off. 1.04 plus a little
        // bottom padding gives every character its full body back.
        className="mt-10 pb-[0.08em] font-serif text-[clamp(3.4rem,14vw,11.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)]"
      >
        Construct
      </h1>

      {/* A hero sub earns its place only by carrying a fact the headline does
          not, and "Superhuman" carries nothing on its own. This one says who
          is talking and why they get to: not "here is what I sell" but the
          mileage behind it, failures included. The failures are load-bearing.
          A line that only claims mastery reads as a sales page; a line that
          admits the wreckage first is the reason to believe the rest. */}
      <p
        data-hero-fade
        className="mt-9 max-w-[36ch] text-pretty text-[1.15rem] leading-[1.5] text-[color:rgba(11,31,58,0.68)] sm:text-[1.3rem]"
      >
        I was early to AI for code. Tried all of it, failed plenty,{" "}
        <strong className="font-semibold text-[var(--ink)]">
          got good at most of it.
        </strong>
      </p>

      {/* THE HAND, pushing you down the page. It is the only thing on this
          screen asking you to do something, and it does it in the margin
          rather than as a button, because a button here would be the page
          selling before it has said anything. */}
      <HandNote
        gesture="down"
        label="free material, down here"
        color="var(--accent-clay)"
        size={104}
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 sm:bottom-6"
        labelClassName="-rotate-2"
      />
    </section>
  );
}
