"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: THE VALUE, IN THREE BEATS.
 *
 * Tobia (2026-10-26): the value proposition from the very start. So the
 * loader says it before anything else: "Your raw clip." then what happens to
 * it, then "A finished reel." in bordeaux, while a playhead runs along a
 * timeline under the words and its bad stretches drop out. Then the curtain
 * lifts on the page, which says it again with the price.
 *
 * CSS alone runs it (globals.css, VIDEO EDITOR PRO), so it plays from the
 * first paint, on every visit, and lifts by itself after about 3.8 s. Script
 * only steps it aside on any scroll, key or tap. Reduced motion skips it.
 * Decoration over a page that is already there, so hidden from assistive tech.
 */

export function VideoEditorProLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.vepIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="vep-load" data-done={done || undefined} aria-hidden>
      <div className="vep-load__stage">
        <p className="vep-load__beat vep-load__beat--1">Your raw clip.</p>
        <p className="vep-load__beat vep-load__beat--2">Cut. Lit. Captioned. Mixed.</p>
        <p className="vep-load__beat vep-load__beat--3">A finished reel.</p>
        <div className="vep-load__track">
          {[18, 9, 14, 7, 20, 11, 21].map((w, i) => (
            <span key={i} className={`vep-load__clip ${i % 2 ? "vep-load__clip--bad" : ""}`} style={{ flexGrow: w }} />
          ))}
          <span className="vep-load__head" />
        </div>
      </div>
    </div>
  );
}
