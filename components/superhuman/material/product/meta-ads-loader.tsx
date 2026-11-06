"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: GOOD MORNING.
 *
 * Six bars rise like a chart of ads. One turns scarlet and drops; the rest
 * grow into its money. "Good morning." The product in two seconds. CSS runs
 * it (meta-ads.css, about 2.7 s) from the first paint; script only steps it
 * aside early on a scroll, key or tap. Reduced motion and no script skip it.
 * Decoration over a page that's already there, so hidden from assistive tech.
 */
const BARS = [62, 88, 40, 100, 54, 74];
const OFF = 2;

export function MetaAdsLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => setDone(true);
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
    }, 3000);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="ma-load" data-done={done || undefined} aria-hidden>
      <div className="ma-load__stage">
        <div className="ma-load__bars">
          {BARS.map((h, i) => (
            <i key={i} data-off={i === OFF || undefined} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <p className="ma-load__word">
          Good morning<span>.</span>
        </p>
      </div>
    </div>
  );
}
