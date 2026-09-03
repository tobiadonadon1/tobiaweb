"use client";

import { useEffect } from "react";

/**
 * THE GROUND THAT FOLLOWS THE READER.
 *
 * Every section on this page used to carry its own background, which meant
 * every section boundary was a hard horizontal edge across the screen, and
 * for the second or two you spent straddling one you were reading type on two
 * different colours at once.
 *
 * This inverts it. Sections do not have backgrounds; they declare a tint
 * (`data-tint`) and the WHOLE PAGE moves to it as they arrive. There are no
 * edges left to straddle, the contrast under any given paragraph is constant,
 * and the page reads as one thing changing its mind rather than five things
 * stacked up. Tobia: "the rest of the website adopts the same background, so
 * that there's less contrast and it's easier to read".
 *
 * WHICH SECTION WINS. The one crossing the middle of the viewport, not the
 * one most visible: a thin band at 50% means the colour changes when the thing
 * you are actually reading changes, rather than when a tall section technically
 * starts overlapping a short one.
 *
 * WITHOUT JAVASCRIPT the page stays on the opening cream and every section is
 * legible on it, which is why the tints are all light except the close, which
 * carries its own dark background as well as declaring it.
 */
export function MyndGround({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".mynd-ground");
    if (!root) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tint]"),
    );
    if (!sections.length) return;

    const apply = (el: HTMLElement) => {
      root.style.setProperty("--m-ground", `var(--m-ground-${el.dataset.tint})`);
      root.dataset.onDark = el.dataset.tintDark === "1" ? "1" : "0";
    };

    /**
     * WHICHEVER SECTION OWNS THE MIDDLE OF THE SCREEN.
     *
     * Reading `isIntersecting` off the entries and applying the last true one
     * looks right and is not: the order of entries inside a single callback is
     * not defined, so when one section left the band as the next arrived, the
     * one leaving could be applied after the one arriving and the page would
     * settle on the wrong colour until the next scroll event. This measures
     * instead, and measuring cannot be ambiguous.
     */
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestGap = Infinity;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        // Distance from the section's own middle to the screen's middle.
        const gap = Math.abs((r.top + r.bottom) / 2 - mid);
        // A section that actually contains the middle always wins over one
        // that merely happens to be centred near it.
        const holds = r.top <= mid && r.bottom >= mid;
        const score = holds ? -1 : gap;
        if (score < bestGap) {
          bestGap = score;
          best = el;
        }
      }
      if (best) apply(best);
    };

    const io = new IntersectionObserver(pick, {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    });
    sections.forEach((s) => io.observe(s));
    pick();

    return () => io.disconnect();
  }, []);

  return <div className="mynd-ground">{children}</div>;
}
