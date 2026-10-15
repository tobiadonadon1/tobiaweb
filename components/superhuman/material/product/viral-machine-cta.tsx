"use client";

import { useEffect, useRef } from "react";
import { OUCH_MS, WAKE_MS } from "./viral-machine-bits";

/**
 * THE BUTTON IS A SLEEPING BOT.
 *
 * Rendered as FreeClaim's button content (its `face` slot): at rest it is
 * only "Get it for free", white on a black pill. A click wakes it up:
 *
 *   1. the letters fly to the centre and shrink away, and two Grok pill eyes
 *      pop out where they meet;
 *   2. the black pill closes into a circle: a black Grok bot, white eyes;
 *   3. it frowns (brows down, a shake) and complains in a speech bubble:
 *      "Ouch, I was sleeping." and friends. Each click says the next line, and
 *      the place in the list is kept per visitor (localStorage).
 *
 * The page passes FreeClaim `hold={OUCH_MS}`, so the bot stays until its
 * bubble is gone and only then gives way to the email field or the download.
 * A further click shakes it again, with the next line. The CSS lives in
 * globals.css (VIRAL MACHINE, .vm-cta); the bubble is plain DOM on <body>.
 * Reduced motion skips the travel: the bot and its bubble just appear.
 */

const OUCH = [
  "Ouch, I was sleeping.",
  "Hey! I was napping.",
  "Five more minutes.",
  "Rude. I was dreaming.",
  "Who woke me up?",
  "Ow. Knock softer next time.",
  "I was sleeping. Fine, here.",
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

/** Pops the bubble over the bot's head, then lets it float off and removes it. */
function complain(btn: HTMLElement, ms: number) {
  document.querySelectorAll(".vm-ouch").forEach((b) => b.remove());
  const r = btn.getBoundingClientRect();
  const bubble = document.createElement("div");
  bubble.className = "vm-ouch";
  bubble.setAttribute("aria-hidden", "true");
  bubble.textContent = nextOuch();
  bubble.style.animationDuration = `${ms}ms`;
  document.body.appendChild(bubble);
  const w = bubble.offsetWidth;
  const cx = r.left + r.width / 2;
  const left = Math.min(Math.max(cx - w / 2, 12), window.innerWidth - w - 12);
  bubble.style.left = `${left + window.scrollX}px`;
  bubble.style.top = `${r.top + window.scrollY - bubble.offsetHeight - 16}px`;
  // The tail points at the bot even when the bubble is pushed off-centre.
  bubble.style.setProperty("--tail", `${Math.min(Math.max(cx - left, 16), w - 16)}px`);
  window.setTimeout(() => bubble.remove(), ms);
}

export function CtaWake({ label }: { label: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const btn = el?.closest<HTMLElement>(".vm-cta");
    if (!el || !btn) return;
    const timers: number[] = [];

    const onClick = () => {
      const asleep = btn.dataset.wake === undefined;
      if (asleep) {
        // Where each letter has to travel to reach the middle of the button.
        const b = btn.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        el.querySelectorAll<HTMLElement>(".vm-l").forEach((l) => {
          const r = l.getBoundingClientRect();
          l.style.setProperty("--dx", `${(cx - (r.left + r.width / 2)).toFixed(1)}px`);
          l.style.setProperty("--dy", `${(cy - (r.top + r.height / 2)).toFixed(1)}px`);
        });
        btn.style.setProperty("--h", `${b.height}px`);
        btn.dataset.wake = "";
      }
      // Shake again on every click: drop the flag, reflow, set it back.
      btn.removeAttribute("data-angry");
      void btn.offsetWidth;
      const delay = asleep ? WAKE_MS : 0;
      timers.push(
        window.setTimeout(() => {
          btn.dataset.angry = "";
          complain(btn, OUCH_MS - delay);
        }, delay),
      );
    };

    btn.addEventListener("click", onClick);
    return () => {
      btn.removeEventListener("click", onClick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <span ref={root} className="vm-wake">
      <span className="sr-only">{label}</span>
      <span className="vm-letters" aria-hidden>
        {[...label].map((ch, i) => (
          <span key={i} className="vm-l" style={{ "--i": i } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className="vm-bot" aria-hidden>
        {[0, 1].map((i) => (
          <span key={i} className="vm-e">
            <span className="vm-brow" />
            <span className="vm-pill" />
          </span>
        ))}
      </span>
    </span>
  );
}
