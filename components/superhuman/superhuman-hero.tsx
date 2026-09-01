"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SuperhumanStar, STAR_TIGHT_BOX } from "./superhuman-star";
import { SECTION_LABELS } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, DrawSVGPlugin);
}

/** Rendered height of the hero mark, in px. */
const STAR_PX = 132;

/**
 * The mark, on paper.
 *
 * `--accent-sky` is tuned to sing on the navy shelf; on a cream ground at 300px
 * it was both too bright and completely flat, so it read as a sticker laid on
 * the page rather than an object cut out of it. This ramp runs from a lit
 * top-left edge to a shadowed bottom-right one, and sits several stops deeper
 * overall. The shelf's flying rays keep the bright sky, because on ink they
 * have to.
 */
const STAR_GRADIENT = { from: "#5aa6cc", mid: "#2f7fae", to: "#12435f" } as const;

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
        const cuts = gsap.utils.toArray<SVGPathElement>(".sh-hero-cut");
        const solid = root.querySelector<HTMLElement>("[data-star-solid]");
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");

        const split = title
          ? SplitText.create(title, { type: "chars", mask: "chars" })
          : null;

        gsap.set(solid, { opacity: 0 });
        if (split) gsap.set(split.chars, { yPercent: 108 });
        gsap.set(rest, { opacity: 0, y: 14 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Each ray cuts itself out, one after another.
        tl.from(cuts, {
          drawSVG: "0%",
          duration: 0.7,
          stagger: 0.055,
          ease: "power2.inOut",
        });
        // Then the paper fills in behind the cut lines, and the lines go.
        tl.to(solid, { opacity: 1, duration: 0.5 }, "-=0.22");
        tl.to(".sh-hero-outline", { opacity: 0, duration: 0.45 }, "<");

        if (split) {
          tl.to(
            split.chars,
            { yPercent: 0, duration: 0.72, stagger: 0.03, ease: "power3.out" },
            "-=0.4",
          );
        }
        tl.to(rest, { opacity: 1, y: 0, duration: 0.7 }, "-=0.32");

        // Once it has arrived, it keeps turning. 96 seconds a revolution is
        // slow enough that you never catch it moving, and just fast enough
        // that the screen is never quite still.
        const spin = gsap.to("[data-star-solid]", {
          rotate: 360,
          duration: 96,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
        spin.timeScale(0);
        tl.call(() => gsap.to(spin, { timeScale: 1, duration: 3, ease: "power1.in" }));

        return () => {
          spin.kill();
          split?.revert();
        };
      }, scope);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // Stroke width in user units, so the cut line lands at a true hairline
  // whatever size the mark is rendered at.
  const strokeWidth = (1.4 * STAR_TIGHT_BOX.h) / STAR_PX;

  return (
    <section
      ref={scope}
      id="hero"
      data-sh-section={SECTION_LABELS.hero}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-36 pt-28 text-center sm:pb-28 sm:pt-32"
    >
      {/* The mark: two stacked copies of one geometry. The outline is what
          draws; the solid is what stays. */}
      <div
        className="relative text-[var(--accent-sky)]"
        style={{
          height: STAR_PX,
          width: Math.round(STAR_PX * (STAR_TIGHT_BOX.w / STAR_TIGHT_BOX.h)),
        }}
      >
        <span className="sh-hero-outline absolute inset-0 block">
          <SuperhumanStar
            size={STAR_PX}
            variant="rays"
            className="h-full w-full"
            rayProps={() => ({
              className: "sh-hero-cut",
              fill: "none",
              stroke: "currentColor",
              strokeWidth,
            })}
            coreProps={{ fill: "none" }}
          />
        </span>
        <span data-star-solid className="absolute inset-0 block">
          <SuperhumanStar
            size={STAR_PX}
            className="h-full w-full"
            gradient={STAR_GRADIENT}
          />
        </span>
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
        A place you fill.
      </p>
    </section>
  );
}
