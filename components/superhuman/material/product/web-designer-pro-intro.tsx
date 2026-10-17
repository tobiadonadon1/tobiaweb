"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { KEY, SKIP_CSS } from "./web-designer-pro-skip";

/**
 * THE OPENING: A NAME, DESIGNED IN FRONT OF YOU.
 *
 * It happens in a design tool. On a ruled paper canvas a caret types WEB
 * DESIGNER in cobalt; the text gets selected (hairline, four handles, a size
 * readout) and the cursor drags the corner until the name fills the screen
 * while the readout counts up. Then it clicks: cobalt pours out from the
 * handle under the cursor, turning the type red where it passes, PRO. lands,
 * and at 2.8s it dissolves into the hero.
 *
 * CSS alone runs it (globals.css, WEB DESIGNER PRO), from the first paint.
 * Script only measures where the handle ends up (so the colour pours from the
 * cursor at any screen size), steps aside on any scroll, key or tap, and
 * tints the browser's own bars: paper while the canvas is up, cobalt once it
 * floods, then back.
 *
 * ONCE PER VISIT, like the homepage's rule: coming back to this page in the
 * same tab, or back from Stripe (?checkout=), goes straight to the hero; a
 * refresh plays it again. SKIP_SCRIPT (web-designer-pro-skip.ts) decides
 * before the first paint on a full load; the layout effect decides on a
 * client-side visit. Either adds the one <style id="wdp-skip"> that hides it.
 *
 * Reduced motion shows the last frame and fades it away. Decoration over a
 * page that is already there, so hidden from assistive tech.
 */

const PAPER = "#ECEAE3";
const COBALT = "#1F3AD6";
function skipping() {
  return !!document.getElementById("wdp-skip");
}

function themeMeta(): HTMLMetaElement {
  let m = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (!m) {
    m = document.createElement("meta");
    m.name = "theme-color";
    m.dataset.wdp = "";
    document.head.appendChild(m);
  }
  return m;
}

const LINES = ["Web", "Designer"];

/** False until the first mount in this document: that one is a full load, later ones are client-side visits. */
let mountedBefore = false;

/** The name as typed: one span per letter (the same in both layers, so they line up to the pixel). */
function Name({ live = false }: { live?: boolean }) {
  let n = 0;
  const total = LINES.join(" ").length;
  return (
    <span className={`wdp-intro__box ${live ? "wdp-intro__box--live" : ""}`}>
      <span className="wdp-intro__text">
        {LINES.map((w, li) => (
          <span key={w} className="wdp-intro__line">
            {[...(li === 0 ? `${w} ` : w)].map((ch) => {
              const i = n++;
              return (
                <span
                  key={i}
                  className={`wdp-intro__ch ${i === total - 1 ? "wdp-intro__ch--last" : ""}`}
                  style={{ "--n": i } as React.CSSProperties}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
        {live ? (
          <span className="wdp-intro__sel">
            <i />
            <i />
            <i />
            <i />
            <span className="wdp-intro__size" />
            <svg className="wdp-intro__cursor" viewBox="0 0 22 22" fill="none">
              <path d="M3 2l15 7.5-6.4 1.9L8.6 18z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        ) : null}
      </span>
      <span className="wdp-intro__pro">Pro.</span>
    </span>
  );
}

export function WebDesignerProIntro() {
  const [done, setDone] = useState(false);

  // Decided once per mount: React's development replay of effects must reuse
  // the decision, not read back the "played" flag it just wrote.
  const skip = useRef<boolean | null>(null);

  // Before paint: skip a return visit, and measure where the pour starts.
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".wdp-intro");
    if (!root) return;
    if (skip.current === null) {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const fullLoad = !mountedBefore && !!nav && new URL(nav.name).pathname === location.pathname;
      mountedBefore = true;
      let played = false;
      try {
        played = sessionStorage.getItem(KEY) === "1";
        sessionStorage.setItem(KEY, "1");
      } catch {
        // Blocked storage: it just plays.
      }
      skip.current = fullLoad ? skipping() : played || location.search.includes("checkout=");
    }
    if (skip.current && !skipping()) {
      const s = document.createElement("style");
      s.id = "wdp-skip";
      s.textContent = SKIP_CSS;
      document.head.appendChild(s);
    }
    // The red copy sits where the dragged name ends: its bottom-right corner
    // is the handle under the cursor.
    const measure = () => {
      const end = root.querySelector(".wdp-intro__flood .wdp-intro__text")?.getBoundingClientRect();
      if (!end?.width) return;
      root.style.setProperty("--wdp-at-x", `${Math.round(end.right)}px`);
      root.style.setProperty("--wdp-at-y", `${Math.round(end.bottom)}px`);
    };
    measure();
    // Again once Archivo is in (the fallback's metrics put the corner
    // elsewhere), and when a phone is turned mid-opening.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      document.getElementById("wdp-skip")?.remove();
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".wdp-intro");
    if (!root || skipping()) return;
    const meta = themeMeta();
    const before = meta.content;
    const html = document.documentElement;
    // Once skipped or finished, a late animation event must not tint again.
    let over = false;

    const tint = (c: string) => {
      meta.content = c;
      html.style.backgroundColor = c;
      document.body.style.backgroundColor = c;
    };
    const untint = () => {
      if (meta.dataset.wdp !== undefined) meta.remove();
      else meta.content = before || PAPER;
      html.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
    };

    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    const stopListening = () => {
      for (const e of events) window.removeEventListener(e, finish);
    };
    function finish() {
      over = true;
      stopListening();
      setDone(true);
    }

    tint(PAPER);
    const onStart = (e: AnimationEvent) => {
      if (!over && e.animationName === "wdp-flood") tint(COBALT);
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target !== root || (e.animationName !== "wdp-curtain" && e.animationName !== "wdp-curtain-fade")) return;
      over = true;
      stopListening();
      untint();
    };
    root.addEventListener("animationstart", onStart);
    root.addEventListener("animationend", onEnd);
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const t = window.setTimeout(untint, 3800);

    return () => {
      window.clearTimeout(t);
      root.removeEventListener("animationstart", onStart);
      root.removeEventListener("animationend", onEnd);
      stopListening();
      untint();
    };
  }, []);

  return (
    <div className="wdp-intro" data-done={done || undefined} aria-hidden>
      <span className="wdp-intro__ruler wdp-intro__ruler--x" />
      <span className="wdp-intro__ruler wdp-intro__ruler--y" />
      <span className="wdp-intro__file">Untitled — Home</span>

      <div className="wdp-intro__stage">
        <Name live />
      </div>
      {/* The fill: the same name in red on cobalt, revealed by a circle that
          grows from the cursor, so the type turns red exactly where the
          colour pours. */}
      <div className="wdp-intro__flood">
        <div className="wdp-intro__stage">
          <Name />
        </div>
      </div>

      <span className="wdp-intro__edge">
        <span>Skill for Claude Code &amp; Codex</span>
        <span>€5</span>
      </span>
    </div>
  );
}
