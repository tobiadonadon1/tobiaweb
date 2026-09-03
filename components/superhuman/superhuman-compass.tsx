"use client";

import { useEffect, useRef, useState } from "react";
import {
  OUTER_STAR_D,
  INNER_STAR_D,
  STAR_BLUE,
  STAR_RED,
} from "./construct-star";

/** Radius of the dial and of the star inside it, in the compass's own units. */
const DIAL_R = 27;
const STAR_R = 23;
/** How far the needle swings between the first section and the last. */
const SWEEP = 300;

/**
 * THE COMPASS. The star persists as a small instrument in the corner, and
 * its longest ray points at whichever section you are actually in: the dial
 * has one tick per section and the needle swings 300 degrees over the length
 * of the page.
 *
 * Move the pointer near it and the rays facing your cursor reach a little
 * further, which is the only thing on this page that answers to the mouse
 * rather than to the scroll.
 *
 * It reads the sections out of the DOM (`[data-sh-section]`), so the dial
 * can never disagree with the page. Two IntersectionObservers do all the
 * watching: one for which section is in the middle of the screen, one for
 * whether the corner the compass sits in currently has ink behind it. No
 * scroll listener, no rAF.
 *
 * Reduced motion: the needle still points, it just arrives without a swing,
 * and the pointer no longer moves the rays.
 *
 * IT KNOWS WHEN TO STOP, in two ways, because there are two ways it can
 * outstay its welcome.
 *
 * The close is not a tick on the dial. Without a third observer the needle
 * would simply hold the last section it saw and keep announcing ONE TO ONE
 * over a screen that says "Start with one thing" — an instrument naming a
 * place the reader has already left. So a third observer retires it when the
 * close crosses the middle of the viewport.
 *
 * And the footer is fixed BEHIND the page, with the page sliding up off it at
 * the very end, so anything else fixed to the viewport ends up floating over
 * the last thing on the site. `.sh-compass` is the handle for that:
 * `body[data-footer-open]` in globals.css fades it out, at no cost to this
 * component at all. The first rule almost always fires first; the second is
 * there because "almost always" is not a guarantee on a short page.
 */
export function SuperhumanCompass({ labels }: { labels: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [onInk, setOnInk] = useState(false);
  /** True once the close has arrived. The instrument is done at that point. */
  const [retired, setRetired] = useState(false);

  /**
   * NOTHING SPINS AND NOTHING STRETCHES ANY MORE.
   *
   * This instrument used the mark itself as its needle: the star sat in the
   * dial and turned so that its longest ray pointed at whichever section you
   * were in, and a pointer handler stretched individual rays toward the
   * cursor as it passed. Both were built on a star made of eight addressable
   * rays and neither can survive a drawn one. Tobia, on the new symbol:
   * "Don't make it rotate."
   *
   * The dial still works, because the needle was never the part carrying the
   * information: the lit tick and the label under it already say where you
   * are, and they said it before the needle finished swinging. What is lost
   * is a flourish. What is kept is the instrument.
   */

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sh-section]"),
    );
    if (sections.length < 2) return;


    /* ---- which section are we in ---- */
    const seen = new Set<number>();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = sections.indexOf(entry.target as HTMLElement);
          if (i < 0) continue;
          if (entry.isIntersecting) seen.add(i);
          else seen.delete(i);
        }
        if (seen.size) setIndex(Math.max(...seen));
      },
      // A thin band across the middle of the viewport: whatever crosses it
      // is what you are reading.
      { rootMargin: "-46% 0px -46% 0px", threshold: 0 },
    );
    sections.forEach((s) => sectionObserver.observe(s));

    /* ---- is there ink behind the corner the compass sits in ---- */
    const inkObserver = new IntersectionObserver(
      (entries) => {
        setOnInk(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: "-86% 0px 0px 0px", threshold: 0 },
    );
    document
      .querySelectorAll("[data-sh-ink]")
      .forEach((el) => inkObserver.observe(el));

    /* ---- and when it is finished ---- */
    // The close is not a tick on the dial, so once the reader is in it the
    // needle has nothing left to point at and just repeats the last section
    // it saw. Rather than sit there naming a place you have already left, the
    // instrument packs up when the close reaches the middle of the screen —
    // which is also, and not by accident, before the footer is uncovered.
    const close = document.querySelector("#close");
    const endObserver = close
      ? new IntersectionObserver(
          (entries) => setRetired(entries[0].isIntersecting),
          { rootMargin: "0px 0px -55% 0px", threshold: 0 },
        )
      : null;
    if (close && endObserver) endObserver.observe(close);

    return () => {
      sectionObserver.disconnect();
      inkObserver.disconnect();
      endObserver?.disconnect();
    };
  }, []);

  const visible = index > 0 && labels.length > 1 && !retired;
  const line = onInk ? "rgba(207,233,238,0.28)" : "rgba(11,31,58,0.18)";
  const tickOn = onInk ? "rgba(207,233,238,0.75)" : "rgba(11,31,58,0.5)";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`sh-compass pointer-events-none fixed bottom-6 left-6 z-40 hidden flex-col items-start gap-2 transition-opacity duration-700 md:flex ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        data-dial
        width={62}
        height={62}
        viewBox="-40 -40 80 80"
        className="text-[var(--accent-clay)]"
      >
        <circle r={DIAL_R} fill="none" stroke={line} strokeWidth={1} />
        {labels.map((label, i) => {
          const a = ((-90 + (i / Math.max(1, labels.length - 1)) * SWEEP) * Math.PI) / 180;
          const on = i === index;
          return (
            <line
              key={label + i}
              x1={Math.cos(a) * (DIAL_R + 2.5)}
              y1={Math.sin(a) * (DIAL_R + 2.5)}
              x2={Math.cos(a) * (DIAL_R + (on ? 7.5 : 5.5))}
              y2={Math.sin(a) * (DIAL_R + (on ? 7.5 : 5.5))}
              stroke={on ? tickOn : line}
              strokeWidth={on ? 1.6 : 1}
            />
          );
        })}
        {/* The mark, held still in the middle of the dial. */}
        <g transform={`scale(${STAR_R / 50}) translate(-50 -50)`}>
          <path
            d={OUTER_STAR_D}
            fill="none"
            stroke={STAR_BLUE}
            strokeWidth={4.4}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d={INNER_STAR_D} fill={STAR_RED} />
        </g>
      </svg>

      <span
        className="font-mono text-[9px] uppercase leading-none tracking-[0.14em] whitespace-nowrap transition-colors duration-500"
        style={{ color: onInk ? "rgba(207,233,238,0.6)" : "rgba(11,31,58,0.42)" }}
      >
        {labels[index] ?? ""}
      </span>
    </div>
  );
}
