"use client";

import { useEffect, useRef } from "react";
import { BotSvg, C } from "./viral-machine-bits";

/**
 * THE BUTTON IS A BOT.
 *
 * Rendered inside FreeClaim's button (its `face` slot) in place of the arrow:
 * two Grok pill eyes in the label's own colour, and four little bots waiting
 * under the button's bottom edge. The CSS lives in globals.css (VIRAL MACHINE,
 * .vm-cta).
 *
 *   Far away   the eyes follow the pointer anywhere on the page, and blink.
 *   Closer     --near rises from 0 to 1 over the last 220px: the eyes grow and
 *              the bots rise into the button, as if they noticed you coming.
 *   Hover      the button wobbles into an irregular shape and jumps through
 *              the six colours, the bots pop all the way up.
 *   Touch      no pointer to follow, so the eyes look around and the bots play
 *              peekaboo on their own, slower.
 *
 *   Click      it complains, in a speech bubble over its eyes. Each click
 *              says the next line, and the place in the list is kept per
 *              visitor (localStorage), so a returning visitor hears a new one.
 *              The bubble is plain DOM on <body>: the click swaps the button
 *              for the email field, and the bubble has to outlive it.
 *
 * Reduced motion keeps the eyes, still, and nothing else moves.
 */

const PEEK = [C.angles, C.account, C.niche, C.voice];

const OUCH = [
  "Ouch.",
  "Next time, a little softer.",
  "No need to smash.",
  "Easy, easy.",
  "Gently. We bruise.",
  "Ow. Worth it though.",
  "Hey, that tickles.",
];
const OUCH_KEY = "vm-ouch";

function nextOuch(): string {
  let i = 0;
  try {
    i = Number(localStorage.getItem(OUCH_KEY)) || 0;
    localStorage.setItem(OUCH_KEY, String(i + 1));
  } catch {
    // Storage blocked: count for this page view only.
    i = (window as { __vmOuch?: number }).__vmOuch ?? 0;
    (window as { __vmOuch?: number }).__vmOuch = i + 1;
  }
  return OUCH[i % OUCH.length];
}

/** Pops the bubble over the eyes, then lets it float off and removes it. */
function complain(eyes: HTMLElement) {
  document.querySelectorAll(".vm-ouch").forEach((b) => b.remove());
  const r = eyes.getBoundingClientRect();
  const bubble = document.createElement("div");
  bubble.className = "vm-ouch";
  bubble.setAttribute("aria-hidden", "true");
  bubble.textContent = nextOuch();
  document.body.appendChild(bubble);
  const w = bubble.offsetWidth;
  const cx = r.left + r.width / 2;
  const left = Math.min(Math.max(cx - w / 2, 12), window.innerWidth - w - 12);
  bubble.style.left = `${left + window.scrollX}px`;
  bubble.style.top = `${r.top + window.scrollY - bubble.offsetHeight - 18}px`;
  // The tail points at the eyes even when the bubble is pushed off-centre.
  bubble.style.setProperty("--tail", `${Math.min(Math.max(cx - left, 16), w - 16)}px`);
  window.setTimeout(() => bubble.remove(), 2200);
}

export function CtaFace() {
  const face = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = face.current;
    const btn = el?.closest<HTMLElement>(".vm-cta");
    if (!el || !btn) return;
    const onClick = () => complain(el);
    btn.addEventListener("click", onClick);
    if (!matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
      return () => btn.removeEventListener("click", onClick);
    }

    let raf = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      raf = 0;
      const e = el.getBoundingClientRect();
      const dx = x - (e.left + e.width / 2);
      const dy = y - (e.top + e.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      // Look at the pointer: all the way once it is 80px off, less when close.
      const m = Math.min(1, d / 80);
      el.style.setProperty("--lx", `${((dx / d) * m * 3).toFixed(2)}px`);
      el.style.setProperty("--ly", `${((dy / d) * m * 2.5).toFixed(2)}px`);
      // How close to the button's edge, 0 (220px or more) to 1 (touching).
      const r = btn.getBoundingClientRect();
      const edge = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      btn.style.setProperty("--near", Math.max(0, 1 - edge / 220).toFixed(3));
    };
    const onMove = (ev: PointerEvent) => {
      x = ev.clientX;
      y = ev.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      btn.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <span ref={face} className="vm-face" aria-hidden>
        <span className="vm-eye" />
        <span className="vm-eye" />
      </span>
      <span className="vm-peek" aria-hidden>
        {PEEK.map((s, i) => (
          <span key={s.key} style={{ "--p": i } as React.CSSProperties}>
            <BotSvg spec={s.crew} />
          </span>
        ))}
      </span>
    </>
  );
}
