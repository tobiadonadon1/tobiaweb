"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Where the knowledge actually sits. Two rows of ordinary places, driven by
 * the scroll and pulling against each other: the top row travels right, the
 * bottom row travels left.
 *
 * It used to be a CSS animation on a timer, which meant it moved whether or
 * not anybody was there. Tying it to the scrollbar makes the reader the one
 * pulling the rows apart.
 *
 * Three copies of each row ride the track, so whichever way it is dragged the
 * window is always covered. The copies after the first are aria-hidden, so the
 * list is announced once. Reduced motion leaves both rows parked.
 */

const ROW_A = [
  "Slack threads",
  "Someone's inbox",
  "A shared drive",
  "Notion",
  "Meeting notes",
  "A pinned message",
  "The CRM",
  "A voice note",
];

const ROW_B = [
  "final_v4.docx",
  "A spreadsheet from 2021",
  "WhatsApp",
  "The old proposal",
  "A colleague who left",
  "Nobody wrote it down",
  "Ask Marco",
  "Decided on a call",
];

function Row({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none shrink-0 items-center gap-3 pr-3">
      {items.map((item) => (
        <li
          key={item}
          className="whitespace-nowrap rounded-full border px-5 py-2 text-[13px] leading-none sm:text-[14px]"
          style={{
            borderColor: "rgba(196,98,59,0.34)",
            color: "rgba(36,24,19,0.78)",
            background: "rgba(196,98,59,0.06)",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SpillMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!root || !top || !bottom) return;

    // Each track carries exactly three copies of its row, so a third of the
    // track is one copy: the distance that puts the row back where it started.
    const span = (el: HTMLElement) => el.getBoundingClientRect().width / 3 || 1;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(top, { x: () => -span(top) * 0.5 });
      gsap.set(bottom, { x: () => -span(bottom) * 0.5 });
      return;
    }

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
        invalidateOnRefresh: true,
      } as const;

      // Top row: arrives from the left, travels right.
      gsap.fromTo(
        top,
        { x: () => -span(top) },
        { x: 0, ease: "none", scrollTrigger: trigger },
      );
      // Bottom row: starts flush, travels left.
      gsap.fromTo(
        bottom,
        { x: 0 },
        { x: () => -span(bottom), ease: "none", scrollTrigger: trigger },
      );
    }, root);

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
      ref={rootRef}
      className="relative overflow-hidden py-1"
      style={{
        // Fades both ends into the ground so the rows arrive from nowhere.
        maskImage:
          "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
      }}
    >
      <div className="flex flex-col gap-3">
        <div ref={topRef} className="flex w-max">
          <Row items={ROW_A} />
          <div aria-hidden>
            <Row items={ROW_A} />
          </div>
          <div aria-hidden>
            <Row items={ROW_A} />
          </div>
        </div>
        <div ref={bottomRef} className="flex w-max">
          <Row items={ROW_B} />
          <div aria-hidden>
            <Row items={ROW_B} />
          </div>
          <div aria-hidden>
            <Row items={ROW_B} />
          </div>
        </div>
      </div>
    </div>
  );
}
