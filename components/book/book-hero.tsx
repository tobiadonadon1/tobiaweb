"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sheet } from "@/components/book/sheet";
import { whenFontsReady } from "@/components/book/fonts-ready";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * THE ONLY THING ON THE FIRST SCREEN.
 *
 * What was here: a CSS-3D book that turned with the pointer, a lede, a "Stay
 * tuned" pill and a mono status line. Tobia's verdict on the object was
 * "terrible" and on the status line "shit copywriting, the font is disgusting,
 * the colour is disgusting, the positioning is disgusting". All of it is gone,
 * and the lede went with it in this pass ("remove the line under the title").
 *
 * So the hero is two words and a great deal of dark, which is a lot of dark to
 * ask two words to hold. The wave is what holds it (see wave-field.tsx): the
 * swell crosses the screen behind the title, and the title sits IN the water
 * rather than floating in black. The only thing this section adds is a scrim
 * that keeps the top of the screen deep, so the swell reads as light rising.
 *
 * The markup renders FINISHED. Motion only ever subtracts from it, and only
 * after we know the reader wants motion, so reduced motion needs no branch.
 */
export function BookHero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;

    const pre = gsap.context(() => {
      gsap.set("[data-hero-mask] > *", { yPercent: 110 });
    }, el);

    const cancel = whenFontsReady(() => {
      pre.revert();
      ctx = gsap.context(() => {
        // Only the title moves. The light is NOT faded in: it blends on
        // `screen`, and any wrapper at opacity < 1 isolates the blend group,
        // so a fade would have popped colour at the end of the tween. The room
        // is simply already lit when the reader arrives, which is also truer.
        gsap.set("[data-hero-mask] > *", { yPercent: 110 });
        gsap.to("[data-hero-mask] > *", {
          yPercent: 0,
          duration: 1.35,
          ease: "expo.out",
          delay: 0.25,
        });
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
      pre.revert();
    };
  }, []);

  return (
    <header
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center pb-32 pt-32"
    >
      {/* Holds the TOP of the screen deep, so the swell below reads as light
          rising and the fixed Back control keeps its contrast. It falls to
          nothing a quarter of the way down, well clear of the section edge,
          which is where a seam would otherwise show. Navy, not black: the
          water has to keep its colour under it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,8,18,0.62) 0%, rgba(3,8,18,0.34) 10%, rgba(3,8,18,0.12) 17%, rgba(3,8,18,0) 26%)",
        }}
      />

      <Sheet className="relative z-10">
        <div className="mx-auto max-w-[46rem] text-center">
          <div data-hero-mask className="overflow-hidden pb-[0.12em]">
            <h1 className="font-serif text-[clamp(3.75rem,12vw,9.5rem)] leading-[1.02] tracking-[-0.03em] text-paper">
              The Book
            </h1>
          </div>
        </div>
      </Sheet>
    </header>
  );
}
