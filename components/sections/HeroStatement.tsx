"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BlockReveal } from "@/components/ui/block-reveal";
// The claim, the age and the share card all read from one file now, so a link
// preview can no longer contradict the page it is advertising. See lib/bio.ts.
import { CLAIM, CONTEXT } from "@/lib/bio";

/**
 * The statement block, straight under the photo hero.
 *
 * Structured in three descending beats rather than one slab: the CLAIM in
 * large Swiss caps, the CONTEXT in sentence case beneath it, then — under a
 * hairline — the UNDERSTATEMENT, small and tracked wide. The hierarchy is
 * inverted from a normal hero on purpose: what Tobia DOES carries the size,
 * and "I'm figuring this out" sits at the bottom as the quiet aside.
 *
 * A soft circular spotlight follows the pointer and RECOLOURS the type to
 * clay as it passes — same words underneath, only the colour changes. It's
 * a second, identical copy of the block masked to a circle; it arms only
 * once the reveal has finished, and only for real pointers.
 */
const UNDERSTATEMENT =
  "I'm figuring this out. Maybe we can figure it out together.";

/** The clay accent the spotlight paints with (globals.css --accent-clay). */
const CLAY = "#ce4631";

/**
 * Soft-edged circle. `closest-side` is load-bearing: the mask box is square,
 * and the default farthest-corner extent leaves the gradient still opaque at
 * the box edges — which clipped the "circle" into straight vertical sides.
 */
const MASK =
  "radial-gradient(circle closest-side, #000 0 55%, rgba(0,0,0,0.55) 82%, transparent 100%)";

/** Spotlight diameter once the pointer is over the block. */
const SPOT_SIZE = 320;

/**
 * One rendering of the three beats. Both the base copy and the spotlight
 * copy come from THIS function, so their line breaks and metrics are
 * identical by construction and the masked layer lands exactly on the type
 * underneath it.
 */
function Beats({ accent }: { accent?: boolean }) {
  return (
    <>
      <h2
        className={`text-center font-helvetica text-[clamp(1.6rem,4.2vw,3.25rem)] font-bold uppercase leading-[1.06] tracking-[-0.022em] [text-wrap:balance] ${
          accent ? "" : "text-[#0a0a0a]"
        }`}
        style={accent ? { color: CLAY } : undefined}
      >
        {CLAIM}
      </h2>

      <p
        className={`mt-7 max-w-[36rem] text-center font-helvetica text-[0.98rem] font-bold leading-[1.6] tracking-[-0.012em] [text-wrap:balance] md:mt-9 md:text-[1.12rem] ${
          accent ? "" : "text-[#0a0a0a]"
        }`}
        style={accent ? { color: CLAY } : undefined}
      >
        {CONTEXT}
      </p>

      {/* Hairline: the structural break between what he does and the aside. */}
      <div
        data-no-split
        aria-hidden
        className="mt-10 h-px w-10 md:mt-14"
        style={{
          backgroundColor: accent ? CLAY : "rgba(10,10,10,0.16)",
          opacity: accent ? 0.5 : 1,
        }}
      />

      {/* text-indent cancels the trailing letter-space that letter-spacing
          adds after the final character — without it, centred tracked type
          sits visibly half a space left of true centre. */}
      <p
        className={`mt-4 max-w-[46rem] text-center font-helvetica text-[0.66rem] font-medium uppercase leading-[2] tracking-[0.12em] [text-indent:0.24em] md:mt-5 md:text-[0.72rem] ${
          accent ? "" : "text-black/45"
        }`}
        style={accent ? { color: CLAY, opacity: 0.7 } : undefined}
      >
        {UNDERSTATEMENT}
      </p>
    </>
  );
}

export function HeroStatement() {
  const stage = useRef<HTMLDivElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  const onRevealed = useCallback(() => setArmed(true), []);

  useEffect(() => {
    if (!armed) return;
    const stageEl = stage.current;
    const spot = spotlight.current;
    if (!stageEl || !spot) return;

    // Pointer-driven and purely decorative: skip it for touch and for
    // anyone who asked for less motion.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The mask is positioned inside the stage's own box, so the pointer has
    // to be converted out of viewport space. Cached — recomputing the rect
    // on every move would force a layout each time.
    let rect = stageEl.getBoundingClientRect();
    const remeasure = () => {
      rect = stageEl.getBoundingClientRect();
    };

    let size = 0;
    const place = (clientX: number, clientY: number, animate: boolean) => {
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;
      const to = {
        webkitMaskPosition: `${x}px ${y}px`,
        maskPosition: `${x}px ${y}px`,
      };
      if (animate) {
        gsap.to(spot, { ...to, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      } else {
        gsap.set(spot, to);
      }
    };

    const onMove = (e: PointerEvent) => place(e.clientX, e.clientY, true);

    const onEnter = (e: PointerEvent) => {
      size = SPOT_SIZE;
      // Seed the position at the current size BEFORE growing, so the circle
      // opens under the cursor instead of sliding in from its old spot.
      place(e.clientX, e.clientY, false);
      gsap.to(spot, {
        webkitMaskSize: `${SPOT_SIZE}px`,
        maskSize: `${SPOT_SIZE}px`,
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      size = 0;
      gsap.to(spot, {
        webkitMaskSize: "0px",
        maskSize: "0px",
        duration: 0.4,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    stageEl.addEventListener("pointerenter", onEnter);
    stageEl.addEventListener("pointermove", onMove, { passive: true });
    stageEl.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      stageEl.removeEventListener("pointerenter", onEnter);
      stageEl.removeEventListener("pointermove", onMove);
      stageEl.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      gsap.killTweensOf(spot);
    };
  }, [armed]);

  return (
    <section
      id="statement"
      data-cursor-quiet
      data-cursor-hide
      className="paper-bg relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 py-28"
    >
      <div ref={stage} className="relative w-full max-w-[62rem]">
        <BlockReveal
          className="flex flex-col items-center"
          blockColor="#0a0a0a"
          onRevealed={onRevealed}
        >
          <Beats />
        </BlockReveal>

        {/* The spotlight copy: identical type, clay, clipped to a circle that
            follows the pointer. Hidden from assistive tech — it is the same
            words as the layer beneath it. */}
        <div
          ref={spotlight}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col items-center"
          style={{
            WebkitMaskImage: MASK,
            maskImage: MASK,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "0px",
            maskSize: "0px",
          }}
        >
          <Beats accent />
        </div>
      </div>
    </section>
  );
}
