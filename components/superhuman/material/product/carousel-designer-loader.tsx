"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: A DECK IS DEALT, AND SWIPED.
 *
 * Tobia (2026-11-02): "a loader and everything", like the other pages. Five
 * real slides the skill made fly up from the bottom and land as a fanned
 * stack; a thumb comes in and swipes the top one away, the way a carousel is
 * read; then the whole paper lifts off the page like a slide going by.
 *
 * CSS alone runs it (carousel-designer.css, one 2.9 s clock), so it plays from
 * the first paint and ends by itself. Script only steps it aside on any
 * scroll, key or tap. Reduced motion skips it. Decoration over a page that is
 * already there, so it is hidden from assistive tech.
 */

const T = 2.9;

export function CarouselDesignerLoader({ cards }: { cards: { src: string; bg: string }[] }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.cdIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    // Once it has played out, stop listening, so a late "finish" can't restart
    // the fade and swallow the click that caused it.
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
      document.documentElement.dataset.cdIntro = "done";
    }, T * 1000);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  // Fanned from the back to the front: the last one is on top and gets swiped.
  const fan = [
    { x: "-34%", r: "-11deg" },
    { x: "34%", r: "10deg" },
    { x: "-16%", r: "-5deg" },
    { x: "17%", r: "5deg" },
    { x: "0%", r: "-1deg" },
  ];

  return (
    <div className="cd-load" data-done={done || undefined} aria-hidden>
      <div className="cd-load__sheet">
        <div className="cd-load__stack">
          {cards.slice(0, fan.length).map((c, i) => (
            <span
              key={c.src}
              className={`cd-load__card${i === fan.length - 1 ? " cd-load__card--top" : ""}`}
              style={{ "--x": fan[i].x, "--r": fan[i].r, "--d": `${0.12 + i * 0.11}s`, background: c.bg } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" decoding="sync" />
            </span>
          ))}
          <span className="cd-load__thumb" />
        </div>
        <p className="cd-load__word">
          Carousel Designer
        </p>
      </div>
    </div>
  );
}
