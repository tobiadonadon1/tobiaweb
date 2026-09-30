"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HandFrame, HandMark } from "./hand";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * THE FOUR STEPS.
 *
 * WHAT THIS REPLACES. Four names hung off one unbroken horizontal rule, with
 * the body text reassembling as it arrived. A clean timeline, and completely
 * anonymous: cover the words and there is nothing left. Tobia: "on the
 * timeline, I'd like to change that, switch it up a bit, and make it a bit
 * more creative."
 *
 * WHAT IT IS NOW. Four hand drawn cards, each with its own flat mark and its
 * own colour, threaded on a line that wanders across the row the way somebody
 * would draw it between four boxes on a napkin. The line is still the thing
 * that says these happen in an order. It just stopped being a ruler.
 *
 * THE CARDS SIT AT DIFFERENT HEIGHTS. A row of four boxes with their tops
 * aligned is a table. Nudging alternate cards down by a few percent is what
 * makes it read as things placed rather than things arranged, and it is the
 * only reason the eye travels left to right instead of taking the row in as
 * one block.
 *
 * The reveal is one observer and a class, matching the rest of the site.
 *
 * ON A PHONE the row becomes a column, and the thread used to simply vanish
 * (it was `hidden lg:block`), which left four stacked boxes: exactly the
 * table this was drawn to get away from. So the phone gets its own thread: it
 * runs down the left gutter, through a knot in each step's colour, and it is
 * DRAWN BY THE SCROLL, segment by segment, so the reader is the one pulling it
 * from one step to the next. Scrubbed, so it retracts going back up. The
 * cards themselves go compact there (mark beside the words, not above them),
 * which gets all four steps into about one screen instead of four.
 */

const STEPS: {
  name: string;
  body: string;
  mark: string;
  color: string;
  drop: string;
}[] = [
  {
    name: "Connect",
    body: "Files, mail, calendars, notes. Nothing new to install.",
    mark: "connect",
    color: "var(--m-blue)",
    drop: "lg:mt-0",
  },
  {
    name: "Capture",
    body: "Sit-downs with your people surface what was never written down.",
    mark: "capture",
    color: "var(--m-gold)",
    drop: "lg:mt-10",
  },
  {
    name: "Answer",
    body: "Ask anything. The whole company history answers back.",
    mark: "answer",
    color: "var(--m-green)",
    drop: "lg:mt-2",
  },
  {
    name: "Automate",
    body: "Agents take the repetitive work. Your people keep the judgment calls.",
    mark: "automate",
    color: "var(--m-clay)",
    drop: "lg:mt-12",
  },
];

export function StepsLine() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    cards.forEach((c) => c.classList.add("reveal--armed"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("reveal--in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    cards.forEach((c) => io.observe(c));

    // The phone thread. Each segment runs from its own step's knot to the
    // next one, and is drawn across exactly the scroll that carries the
    // reader between those two steps.
    const mm = gsap.matchMedia();
    mm.add("(max-width: 639px)", () => {
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-step-item]"));
      items.forEach((li) => {
        const path = li.querySelector<SVGPathElement>("[data-thread]");
        const knot = li.querySelector<HTMLElement>("[data-knot]");
        if (knot) {
          gsap.fromTo(
            knot,
            { scale: 0 },
            {
              scale: 1,
              ease: "back.out(2.4)",
              duration: 0.5,
              scrollTrigger: { trigger: li, start: "top 78%", toggleActions: "play none none reverse" },
            },
          );
        }
        if (path) {
          gsap.fromTo(
            path,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: li, start: "top 72%", end: "bottom 60%", scrub: 0.4 },
            },
          );
        }
      });
    });

    return () => {
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={scope}
      aria-labelledby="myynd-steps"
      data-tint="steps"
      className="relative px-6 py-24 lg:py-36"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <h2
          id="myynd-steps"
          className="max-w-[16ch] text-balance font-serif text-[2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.7rem]"
          style={{ color: "var(--m-ink)" }}
        >
          How it works, in four steps.
        </h2>

        {/* The thread. Drawn once across the whole row, behind the cards, and
            only on the width where the cards actually sit in a row. */}
        <svg
          aria-hidden
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 top-[52%] hidden h-24 w-full lg:block"
        >
          <defs>
            <filter id="steps-thread" x="-5%" y="-40%" width="110%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path
            d="M20 74 C 160 40, 200 96, 330 62 S 560 30, 660 76 S 880 52, 984 40"
            fill="none"
            stroke="var(--m-ink)"
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#steps-thread)"
          />
        </svg>

        <ol className="relative mt-10 grid list-none grid-cols-1 gap-5 pl-9 sm:mt-14 sm:grid-cols-2 sm:gap-8 sm:pl-0 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.name} data-step-item className={`relative ${step.drop}`}>
              {/* PHONE ONLY: this step's knot, and the length of thread that
                  runs from it down to the next one. The segment overshoots the
                  card by the gap plus the next knot's offset, so the four
                  pieces meet end to end. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-9 top-0 z-[1] flex h-[4.1rem] w-9 items-center justify-center sm:hidden"
              >
                <span
                  data-knot
                  className="block h-3 w-3 rounded-full"
                  style={{ background: step.color, boxShadow: "0 0 0 4px var(--m-ground, #f7eedd)" }}
                />
              </span>
              {i < STEPS.length - 1 ? (
                <svg
                  aria-hidden
                  viewBox="0 0 36 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -left-9 top-[2.05rem] w-9 sm:hidden"
                  style={{ height: "calc(100% + 1.25rem)" }}
                >
                  <path
                    data-thread
                    d="M18 0 C 4 18, 32 36, 17 52 S 5 84, 18 100"
                    fill="none"
                    stroke="var(--m-ink)"
                    strokeOpacity="0.38"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    strokeDasharray="1 1"
                  />
                </svg>
              ) : null}

              <div
                data-step
                className="relative h-full px-5 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-6"
                style={{ background: "var(--m-cream)", transitionDelay: `${i * 110}ms` }}
              >
                <HandFrame id={`step-${i}`} color="var(--m-ink)" weight={1.5} />

                {/* One grid, two arrangements. Phone: the mark on the left,
                    number, name and line stacked beside it. Wider: the
                    original column, number over mark over words. */}
                <div className="relative grid grid-cols-[4.25rem_1fr] items-start gap-x-4 sm:grid-cols-1">
                  <span
                    className="col-start-2 row-start-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] sm:col-start-1"
                    style={{ color: "rgba(23,19,15,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <HandMark
                    id={`step-${i}`}
                    name={step.mark}
                    className="col-start-1 row-span-3 row-start-1 mt-1 h-auto w-full sm:row-span-1 sm:row-start-2 sm:mt-4 sm:max-w-[8.5rem]"
                  />

                  <h3
                    className="col-start-2 row-start-2 mt-1.5 font-serif text-[1.45rem] leading-none tracking-[-0.03em] sm:col-start-1 sm:row-start-3 sm:mt-6 sm:text-[1.35rem]"
                    style={{ color: step.color }}
                  >
                    {step.name}
                  </h3>
                  <p
                    className="col-start-2 row-start-3 mt-2 text-pretty text-[0.95rem] leading-[1.55] sm:col-start-1 sm:row-start-4 sm:mt-2.5 sm:text-[0.92rem] sm:leading-[1.6]"
                    style={{ color: "rgba(23,19,15,0.72)" }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
