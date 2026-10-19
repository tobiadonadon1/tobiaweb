"use client";

import { useEffect, useRef } from "react";

/**
 * THE BUTTON IS AN iPHONE DUO.
 *
 * Viral Machine's button is a sleeping bot, Web Designer Pro's an object on a
 * canvas; this one is the phone. The black pill is two halves with a hairline
 * fold down the middle. Hover it and it hinges a little, like a book about to
 * open. Press it and it folds shut, springs open flat, and its "screen" lights
 * up with a wallpaper that comes into focus (the clarity pull of the page's
 * film). On the claim, an iOS notification drops above it with a line ("Opened
 * like a book.", then the next one on the next press, kept per visitor).
 *
 * Rendered as a button's content: FreeClaim's `face` (with `hold={FOLD_MS}` and
 * `buttonClassName="dd-fold-btn"`), or inside the hero's link to #claim
 * (`scrollTo`: the link waits for the fold, then scrolls). CSS: globals.css,
 * DUO DESIGNER, .dd-fold. Reduced motion: no hinge; the banner just appears.
 */

export const FOLD_MS = 1500;

const LINES = [
  "Opened like a book.",
  "Both screens, ready.",
  "Fold, meet design.",
  "Hinge approved.",
  "Closed, open, and everything between.",
  "Unfolded. Nicely.",
];
const KEY = "dd-fold";

function nextLine(): string {
  let i = 0;
  try {
    i = Number(localStorage.getItem(KEY)) || 0;
    localStorage.setItem(KEY, String(i + 1));
  } catch {
    // Storage blocked: count for this page view only.
    i = (window as { __ddFold?: number }).__ddFold ?? 0;
    (window as { __ddFold?: number }).__ddFold = i + 1;
  }
  return LINES[i % LINES.length];
}

/** Drops an iOS-style notification above the button, then lets it slide away. */
function notify(btn: HTMLElement, ms: number) {
  document.querySelectorAll(".dd-note").forEach((n) => n.remove());
  const r = btn.getBoundingClientRect();
  const note = document.createElement("div");
  note.className = "dd-note";
  note.setAttribute("aria-hidden", "true");
  note.style.animationDuration = `${ms}ms`;
  const icon = document.createElement("span");
  icon.className = "dd-note__icon";
  const body = document.createElement("span");
  body.className = "dd-note__body";
  const head = document.createElement("span");
  head.className = "dd-note__head";
  head.innerHTML = "<b>Duo Designer</b><i>now</i>";
  const line = document.createElement("span");
  line.className = "dd-note__line";
  line.textContent = nextLine();
  body.append(head, line);
  note.append(icon, body);
  document.body.appendChild(note);
  const w = note.offsetWidth;
  const cx = r.left + r.width / 2;
  const left = Math.min(Math.max(cx - w / 2, 12), window.innerWidth - w - 12);
  note.style.left = `${left + window.scrollX}px`;
  note.style.top = `${r.top + window.scrollY - note.offsetHeight - 14}px`;
  window.setTimeout(() => note.remove(), ms);
}

export function DuoFoldFace({ label, scrollTo, banner = true }: { label: string; scrollTo?: string; banner?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const btn = el?.closest<HTMLElement>(".dd-fold-btn");
    if (!el || !btn) return;
    const timers: number[] = [];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (ev: Event) => {
      // Fold again on every press: drop the flag, reflow, set it back.
      btn.removeAttribute("data-unfold");
      void btn.offsetWidth;
      btn.dataset.unfold = "";
      timers.push(window.setTimeout(() => btn.removeAttribute("data-unfold"), FOLD_MS));
      if (banner) notify(btn, FOLD_MS + 600);
      if (scrollTo) {
        ev.preventDefault();
        const go = () => {
          const target = document.getElementById(scrollTo);
          target?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
          history.replaceState(null, "", `#${scrollTo}`);
        };
        if (still) go();
        else timers.push(window.setTimeout(go, 620));
      }
    };

    btn.addEventListener("click", onClick);
    return () => {
      btn.removeEventListener("click", onClick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [scrollTo, banner]);

  return (
    <span ref={root} className="dd-fold">
      <span aria-hidden className="dd-fold__half dd-fold__half--l" />
      <span aria-hidden className="dd-fold__half dd-fold__half--r" />
      <span aria-hidden className="dd-fold__screen" />
      <span className="dd-fold__label">{label}</span>
    </span>
  );
}
