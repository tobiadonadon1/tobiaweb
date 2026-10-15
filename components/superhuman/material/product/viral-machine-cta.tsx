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
 * Reduced motion keeps the eyes, still, and nothing else moves.
 */

const PEEK = [C.angles, C.account, C.niche, C.voice];

export function CtaFace() {
  const face = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = face.current;
    const btn = el?.closest<HTMLElement>(".vm-cta");
    if (!el || !btn) return;
    if (!matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

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
