"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: THE PAGE STARTS AS ONE OF ITS OWN VIDEOS.
 *
 * Three beats in the Kinetic style the skill ships, each a full-frame colour
 * flip with one word slammed in: Describe. on ink, Approve. on the page's
 * orange, Render. on lime, which is the whole product in three words. A
 * timeline runs under them, a clip per beat and a playhead crossing it, so
 * it reads as a film, not a splash. At 2.1s the frame slides up like the
 * skill's stack transition and the orange hero is under it.
 *
 * CSS alone runs it (globals.css, MOTION DESIGNER), from the first paint.
 * Script only takes it out of the page when it's done, or at once on any
 * scroll, key or tap. Every visit plays it (the Web Designer Pro rule).
 * Reduced motion never shows it. Decoration over a page that is already
 * there, so hidden from assistive tech.
 */
const BEATS = [
  { word: "Describe.", tc: "00:01" },
  { word: "Approve.", tc: "00:02" },
  { word: "Render.", tc: "00:03" },
];

export function MotionDesignerIntro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // reduced motion: CSS never shows it; take it out on the next tick
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = window.setTimeout(() => setGone(true), reduced ? 0 : 2700);
    if (reduced) return () => window.clearTimeout(done);
    const skip = () => {
      document.documentElement.classList.add("mdx-skip");
      window.setTimeout(() => setGone(true), 240);
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, opts);
    return () => {
      window.clearTimeout(done);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  useEffect(() => {
    if (gone) document.documentElement.classList.add("mdx-skip");
  }, [gone]);

  if (gone) return null;
  return (
    <div className="mdx-intro" aria-hidden>
      {BEATS.map((b, i) => (
        <div key={b.word} className={`mdx-intro__frame mdx-intro__frame--${i}`}>
          <span className="mdx-intro__word">{b.word}</span>
          <span className="mdx-intro__tc">{b.tc}</span>
        </div>
      ))}
      <div className="mdx-intro__hud">
        <span>Motion Designer</span>
        <span>Kinetic · 16:9 · 122 bpm</span>
      </div>
      <div className="mdx-intro__track">
        <i />
        <i />
        <i />
        <b />
      </div>
    </div>
  );
}
