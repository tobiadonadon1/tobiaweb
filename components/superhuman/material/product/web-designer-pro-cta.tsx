"use client";

import { useEffect, useRef } from "react";

/**
 * THE BUY BUTTON IS AN OBJECT ON A CANVAS.
 *
 * Viral Machine's button is a sleeping bot; this one belongs to a design tool,
 * like the page's opening. Hover it (or tab to it) and it gets selected: a
 * hairline, four handles and a size tag that reads the button's real size.
 * Press it and the handles snap out and back while a comment pin pops above
 * with a line ("Good taste.", then the next one on the next press, kept per
 * visitor), as checkout opens. Nothing waits on the animation: the form
 * submits at once and Stripe takes its usual moment.
 *
 * Wraps a BuyForm; the overlay is measured onto its <button> (the form also
 * holds the error line, which the selection must not include). Decoration,
 * so hidden from assistive tech. CSS: globals.css, WEB DESIGNER PRO, .wdp-cta.
 */

const LINES = ["Good taste.", "Great taste, honestly.", "Taste: approved.", "Studio-grade choice.", "Ship it."];
const KEY = "wdp-taste";

function nextLine(): string {
  let i = 0;
  try {
    i = Number(localStorage.getItem(KEY)) || 0;
    localStorage.setItem(KEY, String(i + 1));
  } catch {
    // Storage blocked: count for this page view only.
    i = (window as { __wdpTaste?: number }).__wdpTaste ?? 0;
    (window as { __wdpTaste?: number }).__wdpTaste = i + 1;
  }
  return LINES[i % LINES.length];
}

export function WdpCta({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const pin = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = wrap.current;
    const btn = root?.querySelector("button");
    if (!root || !btn) return;
    const place = () => {
      const r = root.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      root.style.setProperty("--x", `${b.left - r.left}px`);
      root.style.setProperty("--y", `${b.top - r.top}px`);
      root.style.setProperty("--w", `${b.width}px`);
      root.style.setProperty("--h", `${b.height}px`);
      if (tag.current) tag.current.textContent = `Button · ${Math.round(b.width)} × ${Math.round(b.height)}`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(btn);
    ro.observe(root);

    let t = 0;
    const press = () => {
      if (btn.disabled) return;
      if (pin.current) pin.current.textContent = nextLine();
      root.removeAttribute("data-press");
      void root.offsetWidth; // restart the animations on a second press
      root.setAttribute("data-press", "");
      window.clearTimeout(t);
      t = window.setTimeout(() => root.removeAttribute("data-press"), 2400);
    };
    const form = btn.closest("form");
    form?.addEventListener("submit", press);
    return () => {
      ro.disconnect();
      form?.removeEventListener("submit", press);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <span ref={wrap} className="wdp-cta">
      {children}
      <span aria-hidden className="wdp-cta__sel">
        <i />
        <i />
        <i />
        <i />
        <span ref={tag} className="wdp-cta__tag" />
      </span>
      <span aria-hidden className="wdp-cta__pin">
        <span className="wdp-cta__avatar">T</span>
        <span ref={pin} className="wdp-cta__line" />
      </span>
    </span>
  );
}
