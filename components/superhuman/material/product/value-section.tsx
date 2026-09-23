"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Specimen } from "../specimens";

/**
 * WHAT THE €5 GETS YOU, AS ONE PINNED STAGE.
 *
 * This was a 2 x 2 grid of four identical heading-and-paragraph cells, the
 * most recognisable AI-page tell there is. Now the section holds still while
 * the reader scrolls through four points, and the product's own mark, in 3D,
 * acts each one out (see coin-stage.tsx): it turns like a dial, gives up its
 * 2¢ slice, faces you with both prices, then takes the slice back and grows a
 * stack. The copy stays real HTML beside it.
 *
 * ONE NUMBER DRIVES IT. `stage` runs from -1 (the section rising into view)
 * through 0..3 (the four points, pinned) and is written to a ref on every
 * scroll frame, so the 3D reads it without React re-rendering. The copy
 * reads the same number to set its own opacity.
 *
 * DESKTOP lists all four points and lights the current one; clicking a point
 * scrolls to it (a mouse shortcut; the list itself is plain text in order).
 * A PHONE has no room for four, so the points share one slot under the coin
 * and cross over, with a thin rail for where you are.
 *
 * REDUCED MOTION gets no pin and no WebGL at all: CSS unpins the section and
 * shows every point, and the flat mark stands in for the coin. Nothing that
 * carries meaning depends on motion.
 */

const CoinStage = dynamic(() => import("./coin-stage"), { ssr: false });

export type ValuePoint = { title: string; text: string };

/** Scroll travel for the three transitions, in small-viewport heights. */
const TRAVEL_SVH = 210;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function ValueSection({
  title,
  points,
  productId,
}: {
  title: string;
  points: ValuePoint[];
  productId: string;
}) {
  const section = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const rail = useRef<(HTMLSpanElement | null)[]>([]);
  const stage = useRef(-1);
  const [motion, setMotion] = useState<boolean | null>(null);
  const [live, setLive] = useState(false);
  const last = points.length - 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setMotion(!mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ---- scroll → stage → copy opacity ---- */
  useEffect(() => {
    if (!motion) return;
    const el = section.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      const s =
        r.top > 0
          ? -clamp(r.top / vh) // still arriving
          : clamp(-r.top / Math.max(1, travel)) * last;
      stage.current = s;

      const floor = wide.matches ? 0.26 : 0;
      items.current.forEach((li, i) => {
        if (!li) return;
        const d = Math.abs(Math.max(0, s) - i);
        const on = clamp(1 - (d - 0.24) / 0.34);
        li.style.opacity = String(floor + (1 - floor) * on);
        li.style.setProperty("--lift", `${(1 - on) * (i > s ? 14 : -14)}px`);
        li.toggleAttribute("data-current", on > 0.5);
      });
      rail.current.forEach((bar, i) => {
        if (bar) bar.style.transform = `scaleX(${clamp(Math.max(0, s) - i + 1)})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [motion, last]);

  /** Desktop: a point in the list is also a way to jump to it. */
  const goTo = useCallback(
    (i: number) => {
      const el = section.current;
      if (!el || !window.matchMedia("(min-width: 1024px)").matches) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (travel * i) / last + 2, behavior: "smooth" });
    },
    [last],
  );

  const onReady = useCallback(() => setLive(true), []);
  const onError = useCallback(() => setLive(false), []);

  return (
    <section
      ref={section}
      aria-labelledby="value-title"
      className="value-pin relative"
      style={{ ["--value-travel" as string]: `${TRAVEL_SVH}svh` }}
    >
      <div className="value-stage sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[auto_1fr_auto] px-6 pb-[max(10.5rem,calc(env(safe-area-inset-bottom)+10rem))] pt-24 sm:pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:pb-16 lg:pt-28">
          <h2
            id="value-title"
            className="text-balance font-serif text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)] lg:col-span-2"
          >
            {title}
          </h2>

          {/* ---- the coin ---- */}
          <div className="relative min-h-0 lg:col-start-1 lg:row-start-2">
            <Specimen
              id={productId}
              instance="value"
              className={`absolute inset-0 m-auto h-auto max-h-[80%] w-[min(70%,420px)] transition-opacity duration-700 ${
                live ? "opacity-0" : "opacity-100"
              }`}
            />
            {motion ? (
              <CoinStage
                stage={stage}
                onReady={onReady}
                onError={onError}
                className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
              />
            ) : null}
          </div>

          {/* ---- the four points ---- */}
          <div className="relative lg:col-start-2 lg:row-start-2 lg:self-center">
            {/* A phone's sense of where it is: four hairlines that fill. */}
            <div aria-hidden className="value-rail mb-5 flex gap-1.5 lg:hidden">
              {points.map((p, i) => (
                <span key={p.title} className="h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--hairline)]">
                  <span
                    ref={(n) => {
                      rail.current[i] = n;
                    }}
                    className="block h-full origin-left bg-[var(--accent-clay-text)]"
                    style={{ transform: i === 0 ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>

            <ol className="value-list relative list-none">
              {points.map((p, i) => (
                <li
                  key={p.title}
                  ref={(n) => {
                    items.current[i] = n;
                  }}
                  data-current={i === 0 ? "" : undefined}
                  className="value-item"
                  style={{ opacity: i === 0 ? 1 : undefined }}
                  // A mouse shortcut on desktop. Keyboard and screen-reader
                  // users already have the whole list, in order, as text.
                  onClick={() => goTo(i)}
                >
                  <h3 className="text-[1.5rem] leading-snug tracking-[-0.02em] text-[var(--ink)] md:text-[1.75rem]">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 max-w-[42ch] text-pretty text-[1.02rem] leading-[1.6] text-[color:rgba(11,31,58,0.7)] md:text-[1.06rem]">
                    {p.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
