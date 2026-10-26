"use client";

import { useEffect, useState } from "react";
import { LEAD, botShape } from "./grok-army-bots";

/**
 * THE OPENING: ONE BOT, AND THE WORD GROK.
 *
 * Tobia's brief (2026-10-26): Grok Army's page, but this time just one bot,
 * a little like Pixar's lamp. The metal disc hops in with its eyes shut,
 * from G to R, over the O to K, looks back, jumps on the O and squashes it
 * flat, and lands in its place: GR(bot)K. Then it opens its eyes, and the
 * camera flies into the right one. The slot eye is cut through the metal,
 * as dark as the page, so going into it is going into the site.
 *
 * CSS alone runs it (globals.css, REEL BOT), so it plays from the first
 * paint and ends by itself after about four and a half seconds. Script only
 * steps it aside on any scroll, key or tap. It plays once a visit (the
 * page's inline script hides it on the way back, reel-bot-page.tsx), and
 * reduced motion skips it. Decoration over a page that is already there,
 * so it is hidden from assistive tech.
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
    return () => {
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="rb-load" data-done={done || undefined} aria-hidden>
      <div className="rb-load__stage">
        <div className="rb-load__word">
          {["G", "R", "O", "K"].map((l, i) => (
            <span key={l} className={`rb-load__l rb-load__l--${i}`}>
              {l}
            </span>
          ))}
        </div>
        <div className="rb-load__bot">
          <div className="rb-load__face">
            <svg viewBox="0 0 100 100" className="block h-full w-full overflow-visible">
              {botShape(LEAD)}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
