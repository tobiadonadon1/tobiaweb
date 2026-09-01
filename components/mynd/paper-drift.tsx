"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The company's memory, coming apart as you scroll.
 *
 * Six sheets arrive as one tidy stack and are pulled apart by the scroll into
 * a scatter that never resolves. The scroll is the only thing that moves them:
 * this replaced a pointer-driven field, and the whole point is that the reader
 * gets the motion for free just by reading down the page.
 *
 * Only transform is animated. Distances are functions of the measured field,
 * recomputed on every ScrollTrigger refresh, so it survives a resize. Under
 * prefers-reduced-motion it is simply drawn in its finished, scattered state.
 */

type Sheet = {
  /** Where it lands, as a fraction of the field's width and height. */
  x: number;
  y: number;
  rot: number;
  /** Where it starts inside the stack, in pixels. Deliberately tiny. */
  sx: number;
  sy: number;
  srot: number;
  /** How many ruled lines the sheet carries. */
  lines: number;
  short?: boolean;
};

const SHEETS: Sheet[] = [
  { x: -0.3, y: -0.22, rot: -8, sx: -5, sy: -7, srot: -3, lines: 4 },
  { x: 0.09, y: -0.26, rot: 5, sx: 4, sy: -3, srot: 2, lines: 3, short: true },
  { x: 0.33, y: -0.06, rot: 10, sx: 7, sy: 2, srot: 4, lines: 5 },
  { x: -0.31, y: 0.16, rot: 6, sx: -6, sy: 5, srot: -1, lines: 3 },
  { x: 0.01, y: 0.17, rot: -4, sx: 1, sy: 8, srot: 3, lines: 5, short: true },
  { x: 0.3, y: 0.26, rot: -11, sx: 6, sy: -6, srot: -4, lines: 4 },
];

export function PaperDrift() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>("[data-sheet]", field);
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    if (reduced) {
      // Land on the finished state, and keep landing on it when the window
      // changes size: the scatter is a fraction of the field, not a constant.
      const place = () => {
        cards.forEach((el, i) => {
          const s = SHEETS[i];
          gsap.set(el, {
            x: field.clientWidth * s.x,
            y: field.clientHeight * s.y,
            rotation: s.rot,
          });
        });
      };
      place();
      const ro = new ResizeObserver(place);
      ro.observe(field);
      return () => ro.disconnect();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: field,
          start: "top 88%",
          end: "bottom 32%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((el, i) => {
        const s = SHEETS[i];
        tl.fromTo(
          el,
          { x: s.sx, y: s.sy, rotation: s.srot },
          {
            x: () => field.clientWidth * s.x,
            y: () => field.clientHeight * s.y,
            rotation: s.rot,
            ease: "power1.inOut",
          },
          0,
        );
      });
    }, field);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      aria-hidden
      className="relative w-full overflow-hidden aspect-[5/4] sm:aspect-[4/3]"
    >
      {SHEETS.map((s, i) => (
        <div
          key={i}
          data-sheet
          className="absolute left-1/2 top-1/2 w-[26%] min-w-[92px]"
          style={{
            aspectRatio: "1 / 1.28",
            background: "#fdfbf6",
            border: "1px solid rgba(196,98,59,0.28)",
            boxShadow: "0 12px 26px -18px rgba(36,24,19,0.55)",
          }}
        >
          <div className="flex h-full flex-col gap-[7%] p-[12%] pt-[16%]">
            <span
              className="block h-[3px] w-1/2"
              style={{ background: "rgba(196,98,59,0.42)" }}
            />
            {Array.from({ length: s.lines }).map((_, k) => (
              <span
                key={k}
                className="block h-px"
                style={{
                  background: "rgba(36,24,19,0.16)",
                  width:
                    k === s.lines - 1 ? (s.short ? "44%" : "62%") : "100%",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
