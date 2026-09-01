"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RAY_LOCAL_D, STAR_CORE_D, STAR_RAYS } from "./superhuman-star";

/** Radius of the dial and of the star inside it, in the compass's own units. */
const DIAL_R = 27;
const STAR_R = 23;
/** How far the needle swings between the first section and the last. */
const SWEEP = 300;
/** How far a ray reaches toward the pointer, at most. */
const REACH = 0.19;

const shortestTurn = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

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
  const dialRef = useRef<SVGGElement>(null);
  const rays = useRef<(SVGPathElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [onInk, setOnInk] = useState(false);
  /** True once the close has arrived. The instrument is done at that point. */
  const [retired, setRetired] = useState(false);

  // Live rotation, shared between the section tween and the pointer maths.
  const spin = useRef({ rot: 0 });
  const stretch = useRef(STAR_RAYS.map(() => ({ v: 1 })));

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sh-section]"),
    );
    if (sections.length < 2) return;

    const spinState = spin.current;
    const stretchState = stretch.current;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* ---- drawing ---- */
    const applyRay = (i: number) => {
      rays.current[i]?.setAttribute(
        "transform",
        `rotate(${STAR_RAYS[i].angle}) scale(${stretchState[i].v.toFixed(4)},1)`,
      );
    };
    const applyDial = () => {
      dialRef.current?.setAttribute(
        "transform",
        `rotate(${spinState.rot.toFixed(2)}) scale(${STAR_R})`,
      );
    };
    STAR_RAYS.forEach((_, i) => applyRay(i));
    applyDial();

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

    /* ---- the pointer ---- */
    let quickTo: ((v: number) => void)[] = [];
    if (!reduced) {
      quickTo = STAR_RAYS.map((_, i) =>
        gsap.quickTo(stretchState[i], "v", {
          duration: 0.45,
          ease: "power3.out",
          onUpdate: () => applyRay(i),
        }),
      );
    }

    const onPointerMove = (event: PointerEvent) => {
      const el = rootRef.current?.querySelector("[data-dial]");
      if (!el || !quickTo.length) return;
      const box = el.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy);
      const near = clamp01(1 - dist / 280);
      const toward = (Math.atan2(dy, dx) * 180) / Math.PI;

      for (let i = 0; i < STAR_RAYS.length; i++) {
        const world = STAR_RAYS[i].angle + spinState.rot;
        const off = Math.abs(shortestTurn(toward - world));
        const facing = Math.max(0, 1 - off / 48);
        quickTo[i](1 + REACH * facing * near);
      }
    };

    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      sectionObserver.disconnect();
      inkObserver.disconnect();
      endObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gsap.killTweensOf(spinState);
      stretchState.forEach((s) => gsap.killTweensOf(s));
    };
  }, []);

  // Swing the needle whenever the section changes.
  useEffect(() => {
    if (labels.length < 2) return;
    const tick = -90 + (index / (labels.length - 1)) * SWEEP;
    const target = tick - STAR_RAYS[0].angle;
    const applyDial = () => {
      dialRef.current?.setAttribute(
        "transform",
        `rotate(${spin.current.rot.toFixed(2)}) scale(${STAR_R})`,
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spin.current.rot = target;
      applyDial();
      return;
    }
    const tween = gsap.to(spin.current, {
      rot: target,
      duration: 1.15,
      ease: "power3.inOut",
      onUpdate: applyDial,
    });
    return () => {
      tween.kill();
    };
  }, [index, labels.length]);

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
        className="text-[var(--accent-sky)]"
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
        <g ref={dialRef} fill="currentColor" transform={`rotate(0) scale(${STAR_R})`}>
          <path d={STAR_CORE_D} />
          {STAR_RAYS.map((ray, i) => (
            <path
              key={i}
              ref={(el) => {
                rays.current[i] = el;
              }}
              d={RAY_LOCAL_D[i]}
              transform={`rotate(${ray.angle})`}
            />
          ))}
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
