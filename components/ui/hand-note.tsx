"use client";

import { useEffect, useRef } from "react";

/**
 * THE HAND IN THE MARGIN.
 *
 * A scribbled note and an arrow that draws itself on as you reach it, points
 * at the thing it is talking about, and then keeps breathing so it reads as
 * something alive rather than something printed. It is the site leaning over
 * your shoulder and saying "down here", which is a job no button does as well.
 *
 * IT IS DRAWN TWICE. Every arrow is two strokes on nearly the same path: a
 * heavier one underneath and a lighter one just off it. That is what a person
 * does when they go back over a line to make sure you saw it, and it is the
 * thing that separates this from an icon. Tobia: "two-dimensional, but one
 * inside of the other".
 *
 * HOW THE DRAW-ON WORKS WITHOUT MEASURING ANYTHING. `pathLength="1"` renames
 * the path's own length to 1, so the dash array and offset can be written in
 * plain fractions and a CSS transition can run them. No getTotalLength, no
 * layout read, no JavaScript in the animation at all: an observer adds one
 * class and CSS does the rest.
 *
 * NOTHING HERE IS CONTENT. The notes are aria-hidden. Everything they point at
 * is a real link with its own real label, so a reader who never sees the
 * scribble loses nothing at all.
 */

/**
 * The gestures, all in a 200 x 200 box so a caller only has to pick a size.
 * Each one is a single stroke, because a hand does not lift the pen.
 */
const GESTURES: Record<string, string> = {
  /** A loop, then a long fall. The one that pushes you down the page. */
  down:
    "M100 8 C 60 20, 44 56, 74 68 C 100 78, 108 44, 84 34 C 64 26, 52 48, 62 78 C 72 110, 96 132, 100 176",
  /** Rounds a thing and comes back to point at it. */
  circle:
    "M132 44 C 84 24, 40 52, 44 100 C 48 150, 104 176, 144 152 C 178 132, 176 84, 140 62 C 122 51, 104 54, 96 66",
  /** A short hook to the right, for pointing across at a card. */
  right:
    "M20 52 C 62 40, 96 60, 116 96 C 132 126, 150 142, 182 140",
};

/** The arrow head, drawn in the same two strokes as the tail. */
const HEADS: Record<string, string> = {
  down: "M86 158 L100 178 L116 160",
  circle: "M84 78 L96 66 L110 74",
  right: "M166 126 L184 141 L166 154",
};

export function HandNote({
  gesture = "down",
  label,
  color = "var(--accent-clay)",
  size = 132,
  className = "",
  /** Flips the drawing so one gesture serves both sides of a column. */
  flip = false,
  /** Where the writing sits relative to the arrow. */
  labelClassName = "",
}: {
  gesture?: keyof typeof GESTURES | string;
  label: string;
  color?: string;
  size?: number;
  className?: string;
  flip?: boolean;
  labelClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("hand-note--in");
      return;
    }
    el.classList.add("hand-note--armed");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("hand-note--in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = GESTURES[gesture] ?? GESTURES.down;
  const head = HEADS[gesture] ?? HEADS.down;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`hand-note pointer-events-none select-none ${className}`}
      style={{ color }}
    >
      <span
        className={`hand-note__label block font-hand text-[1.35rem] leading-[1.15] md:text-[1.6rem] ${labelClassName}`}
      >
        {label}
      </span>

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="hand-note__draw block overflow-visible"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        {/* Under-stroke: heavier, slightly transparent, a touch off the line. */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
          strokeWidth="6"
          transform="translate(1.6 1.4)"
        >
          <path d={d} pathLength={1} className="hand-note__tail" />
          <path d={head} pathLength={1} className="hand-note__head" />
        </g>
        {/* The line you actually read. */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.4"
        >
          <path d={d} pathLength={1} className="hand-note__tail" />
          <path d={head} pathLength={1} className="hand-note__head" />
        </g>
      </svg>
    </div>
  );
}
