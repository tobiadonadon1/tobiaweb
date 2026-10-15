"use client";

import { useEffect, useState } from "react";
import { BotSvg, type Six } from "./viral-machine-bits";

/**
 * THE OPENING: SIX BOTS, ONE A BEAT.
 *
 * The same opening as App Designer Pro (app-designer-pro-intro.tsx), with a
 * Grok bot on every colour: each one pops in with what it does for you
 * ("Reads your X.", "Watches your niche." …), then the curtain lifts on the
 * name and the button. CSS alone runs it (globals.css, VIRAL MACHINE), so it
 * plays from the first paint and ends by itself after about five and a half
 * seconds.
 *
 * Script steps aside on any scroll, key or tap, and tints the browser's own
 * bars to the colour on screen, then gives them the paper back.
 *
 * Reduced motion sees the same six as cross-fades. Decoration over a page
 * that is already there underneath, so it is hidden from assistive tech.
 */

const PAPER = "#faf8f2";

function themeMeta(): HTMLMetaElement {
  let m = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (!m) {
    m = document.createElement("meta");
    m.name = "theme-color";
    m.dataset.vm = "";
    document.head.appendChild(m);
  }
  return m;
}

export function ViralIntro({ six }: { six: readonly Six[] }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".vm-intro");
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
      if (meta.dataset.vm !== undefined) meta.remove();
      else meta.content = before || PAPER;
      html.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
    };

    const layers = [...root.querySelectorAll<HTMLElement>(".vm-intro__layer")];
    const shown = layers.filter((l) => getComputedStyle(l).visibility === "visible");
    tint(six[Math.max(0, shown.length - 1)]?.bg ?? six[0].bg);
    const onStart = (e: AnimationEvent) => {
      if (e.animationName !== "vm-show") return;
      const i = layers.indexOf(e.target as HTMLElement);
      if (i > -1) tint(six[i].bg);
    };
    root.addEventListener("animationstart", onStart);

    const onEnd = (e: AnimationEvent) => {
      if (e.target === root && (e.animationName === "vm-curtain" || e.animationName === "vm-curtain-fade")) untint();
    };
    root.addEventListener("animationend", onEnd);

    const finish = () => {
      setDone(true);
      document.documentElement.dataset.vmIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const t = window.setTimeout(untint, six.length * 900 + 1400);

    return () => {
      window.clearTimeout(t);
      root.removeEventListener("animationstart", onStart);
      root.removeEventListener("animationend", onEnd);
      for (const e of events) window.removeEventListener(e, finish);
      untint();
    };
  }, [six]);

  return (
    <div className="vm-intro" data-done={done || undefined} aria-hidden>
      {six.map((s, i) => (
        <div key={s.key} className="vm-intro__layer" style={{ "--i": i, "--bg": s.bg, "--fg": s.fg } as React.CSSProperties}>
          <div className="vm-intro__stack">
            <BotSvg spec={s.bot} className="vm-intro__bot" />
            <span className="vm-intro__word">{s.word}</span>
          </div>
          <span className="vm-intro__name">Viral Machine</span>
        </div>
      ))}
    </div>
  );
}
