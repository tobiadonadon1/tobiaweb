"use client";

import { useEffect, useRef } from "react";
import { HandFrame, HandMark } from "./hand";

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
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={scope}
      aria-labelledby="myynd-steps"
      data-tint="steps"
      className="relative px-6 py-28 lg:py-36"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <h2
          id="myynd-steps"
          className="max-w-[16ch] font-serif text-[2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.7rem]"
          style={{ color: "var(--m-ink)" }}
        >
          Four steps, in this order.
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

        <ol className="relative mt-14 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.name}
              data-step
              className={step.drop}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <div
                className="relative h-full px-6 pb-7 pt-6"
                style={{ background: "var(--m-cream)" }}
              >
                <HandFrame id={`step-${i}`} color="var(--m-ink)" weight={1.5} />

                <div className="relative">
                  <span
                    className="font-mono text-[0.68rem] uppercase tracking-[0.16em]"
                    style={{ color: "rgba(23,19,15,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <HandMark
                    id={`step-${i}`}
                    name={step.mark}
                    className="mt-4 h-auto w-full max-w-[8.5rem]"
                  />

                  <h3
                    className="mt-6 font-serif text-[1.35rem] leading-none tracking-[-0.03em]"
                    style={{ color: step.color }}
                  >
                    {step.name}
                  </h3>
                  <p
                    className="mt-2.5 text-[0.92rem] leading-[1.6]"
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
