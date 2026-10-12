"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: SIX WORDS, ONE A BEAT.
 *
 * Tobia's idea: before the page, the six things Pro adds fire onto the screen
 * one after another, each on its own colour, and then the curtain lifts on
 * the name and the button. It runs on CSS alone (globals.css, APP DESIGNER
 * PRO), so it plays from the first paint, before any script, and ends on its
 * own after about five and a half seconds.
 *
 * Script only makes it polite: any scroll, key or tap lifts it at once, and
 * someone who has already seen it in this tab gets the page straight away.
 * Reduced motion never sees it. It is decoration over a page that is already
 * there underneath, so it is hidden from assistive tech.
 */
export function ProIntro({ words }: { words: { word: string; bg: string; fg: string }[] }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("adp-intro") === "1";
      sessionStorage.setItem("adp-intro", "1");
    } catch {}
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.adpIntro = "done";
    };
    if (seen) {
      finish();
      return;
    }
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const t = window.setTimeout(finish, words.length * 900 + 700);
    return () => {
      window.clearTimeout(t);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, [words.length]);

  return (
    <div className="adp-intro" data-done={done || undefined} aria-hidden>
      {words.map((w, i) => (
        <div
          key={w.word}
          className="adp-intro__layer"
          style={{ "--i": i, "--bg": w.bg, "--fg": w.fg } as React.CSSProperties}
        >
          <span className="adp-intro__word">{w.word}</span>
          <span className="adp-intro__name">App Designer Pro</span>
        </div>
      ))}
    </div>
  );
}
