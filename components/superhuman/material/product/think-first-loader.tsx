"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: THE MAP BEFORE THE PAGE.
 *
 * What the skill does, in two seconds: the pink ◆ lands, "here's what i'll
 * build:", its two lines draw in (the second in pink), "think first." Then
 * the glass lifts off the page. CSS alone runs it
 * (think-first.css, about 2.6 s) from the first paint; script only steps it
 * aside early on a scroll, key or tap. Reduced motion skips it. Decoration
 * over a page that is already there, so it is hidden from assistive tech.
 */
/** The two lines' lengths, as parts of the card. */
const ROWS = [0.94, 0.72];

export function ThinkFirstLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("tf-intro", "1");
    } catch {}
    const finish = () => setDone(true);
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
    }, 2800);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="tf-load" data-done={done || undefined} aria-hidden>
      <div className="tf-load__stage">
        <span className="tf-load__gem" />
        <div className="tf-load__map">
          <span className="tf-load__head">here&rsquo;s what i&rsquo;ll build:</span>
          {ROWS.map((w, i) => (
            <div key={i} className="tf-load__row" style={{ "--i": i * 2 + 1 } as React.CSSProperties}>
              <i style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
        <p className="tf-load__word">think first.</p>
      </div>
    </div>
  );
}
