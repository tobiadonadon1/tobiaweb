"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: SIX WORDS, ONE A BEAT.
 *
 * Tobia's idea: before the page, the six things Pro adds fire onto the screen
 * one after another, each on its own colour, and then the curtain lifts on
 * the name and the button. It runs on CSS alone (globals.css, APP DESIGNER
 * PRO), so it plays from the first paint, before any script, on every visit,
 * and ends on its own after about five and a half seconds.
 *
 * Script does two things on top:
 *   IT STEPS ASIDE. Any scroll, key or tap lifts the curtain at once.
 *   IT TINTS THE BROWSER. Phones colour their status bar and toolbar from the
 *   page (theme-color, or the page's own ground). Left alone they keep the
 *   first word's green while the words change under it. So on every beat
 *   (the moment a layer appears) the theme colour and the page ground follow
 *   the word, and both go back to the site's paper when the curtain lifts.
 *
 * Reduced motion sees the same words as plain cross-fades. It is decoration
 * over a page that is already there underneath, so it is hidden from
 * assistive tech.
 */

const PAPER = "#faf8f2";

function themeMeta(): HTMLMetaElement {
  let m = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (!m) {
    m = document.createElement("meta");
    m.name = "theme-color";
    m.dataset.adp = "";
    document.head.appendChild(m);
  }
  return m;
}

export function ProIntro({ words }: { words: { word: string; bg: string; fg: string }[] }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".adp-intro");
    if (!root) return;
    const meta = themeMeta();
    const before = meta.content;
    const html = document.documentElement;

    const tint = (c: string) => {
      meta.content = c;
      html.style.backgroundColor = c;
      document.body.style.backgroundColor = c;
    };
    const untint = () => {
      if (meta.dataset.adp !== undefined) meta.remove();
      else meta.content = before || PAPER;
      html.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
    };

    // Catch up with the beat the CSS is already on (the page may hydrate a
    // second in), then follow every new layer as it appears.
    const layers = [...root.querySelectorAll<HTMLElement>(".adp-intro__layer")];
    const shown = layers.filter((l) => getComputedStyle(l).visibility === "visible");
    tint(words[Math.max(0, shown.length - 1)]?.bg ?? words[0].bg);
    const onStart = (e: AnimationEvent) => {
      if (e.animationName !== "adp-show") return;
      const i = layers.indexOf(e.target as HTMLElement);
      if (i > -1) tint(words[i].bg);
    };
    root.addEventListener("animationstart", onStart);

    // The curtain is up: give the browser its paper back.
    const onEnd = (e: AnimationEvent) => {
      if (e.target === root && (e.animationName === "adp-curtain" || e.animationName === "adp-curtain-fade")) untint();
    };
    root.addEventListener("animationend", onEnd);

    const finish = () => {
      setDone(true);
      document.documentElement.dataset.adpIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const t = window.setTimeout(untint, words.length * 900 + 1400);

    return () => {
      window.clearTimeout(t);
      root.removeEventListener("animationstart", onStart);
      root.removeEventListener("animationend", onEnd);
      for (const e of events) window.removeEventListener(e, finish);
      untint();
    };
  }, [words]);

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
