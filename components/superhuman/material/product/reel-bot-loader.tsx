"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: A FRAME AT DUSK.
 *
 * Tobia (2026-11-04): the old opening (Grok Army's metal bot hopping over
 * GROK) was too close to the other bot pages. This one is quiet and short:
 * a 9:16 frame draws itself in one line, a horizon crosses it, a low sun
 * rises inside, the name fades in under it, and the frame grows past the
 * edges of the screen into the hero, which is the same dusk.
 *
 * CSS alone runs it (globals.css, REEL BOT), about 2.6 s, so it plays from
 * the first paint and ends by itself. Script only steps it aside on any
 * scroll, key or tap. Reduced motion skips it. Decoration over a page that is
 * already there, so it is hidden from assistive tech.
 */
export function ReelBotLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.rbIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    // Once it has played out, stop listening, so a late "finish" can't
    // restart a fade over a page that is already in use.
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
      document.documentElement.dataset.rbIntro = "done";
    }, 2800);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="rb-load" data-done={done || undefined} aria-hidden>
      <div className="rb-load__stage">
        <svg viewBox="0 0 90 160" className="rb-load__frame">
          <defs>
            <clipPath id="rb-load-clip">
              <rect x="1" y="1" width="88" height="158" rx="11" />
            </clipPath>
          </defs>
          <rect className="rb-load__fill" x="1" y="1" width="88" height="158" rx="11" />
          <g clipPath="url(#rb-load-clip)">
            <circle className="rb-load__sun" cx="45" cy="104" r="15" />
            <rect className="rb-load__sea" x="0" y="104" width="90" height="60" />
            <line className="rb-load__horizon" x1="0" y1="104" x2="90" y2="104" pathLength={1} />
          </g>
          <rect className="rb-load__line" x="1" y="1" width="88" height="158" rx="11" pathLength={1} />
        </svg>
        <p className="rb-load__name">Reel Bot Factory</p>
      </div>
    </div>
  );
}
