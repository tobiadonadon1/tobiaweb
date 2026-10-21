"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: TWO SENTENCES, THEN THE VIDEO.
 *
 * Tobia's brief (2026-10-21): clean, no motion graphics. One phrase, then
 * another that comes up easily and sells it. Then the page, which opens on
 * his clip raw and edited.
 *
 * CSS alone runs it (globals.css, VIDEO EDITOR), so it plays from the first
 * paint and lifts by itself after about four seconds. Script only steps it
 * aside on any scroll, key or tap. It plays once a visit: the page's inline
 * script hides it on the way back (video-editor-page.tsx). Reduced motion
 * skips it. Decoration over a page that is already there, so it is hidden
 * from assistive tech.
 */

export function VideoLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.vdIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="vd-load" data-done={done || undefined} aria-hidden>
      <p className="vd-load__line">It has never been easier to run your personal brand.</p>
      <p className="vd-load__line">
        You can now edit videos with <span className="whitespace-nowrap">Claude Code.</span>
      </p>
    </div>
  );
}
