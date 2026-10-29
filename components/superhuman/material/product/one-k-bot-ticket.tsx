"use client";

import { useEffect, useRef } from "react";

/**
 * THE GOLDEN TICKET, A THING YOU CAN HANDLE.
 *
 * Tobia (2026-10-29): the ticket with a texture, that you can move around
 * like a carpet, and a smaller one in the hero. So it is engraved foil (a
 * banknote's guilloche lines, a grain, a rainbow sheen that only shows at an
 * angle), it tilts toward the pointer with the light following it, and it
 * can be grabbed and dragged: it leans into the way it's pulled, floats
 * there, and springs home when let go. At rest it drifts a little, like a
 * carpet on air.
 *
 * One spring loop writes CSS variables on the element (no React renders per
 * frame), and only runs while the ticket is on screen. On a phone a vertical
 * swipe still scrolls the page (touch-action: pan-y); sideways drags it.
 * Reduced motion: it tilts a little to the pointer and never floats.
 */

type Props = {
  children: React.ReactNode;
  className?: string;
  /** How far it can be dragged and how much it leans, 1 for the big one. */
  scale?: number;
  /** A tap without a drag (the hero's mini ticket scrolls to the big one). */
  onTap?: () => void;
  label?: string;
};

export function GoldenTicket({ children, className = "", scale = 1, onTap, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Current values, velocities, and where each one is headed.
    const s = { x: 0, y: 0, rx: 0, ry: 0, rz: 0, mx: 50, my: 30 };
    const v = { x: 0, y: 0, rx: 0, ry: 0, rz: 0, mx: 0, my: 0 };
    const goal = { ...s };
    let hover = false;
    let drag: { id: number; sx: number; sy: number; lx: number; moved: boolean } | null = null;
    let raf = 0;
    let seen = false;
    const t0 = performance.now();

    const pointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      goal.mx = px * 100;
      goal.my = py * 100;
      const lean = still ? 4 : 11;
      goal.rx = -(py - 0.5) * lean * 1.4;
      goal.ry = (px - 0.5) * lean * 2;
    };

    const tick = (now: number) => {
      raf = 0;
      const t = (now - t0) / 1000;
      if (!hover && !drag) {
        // At rest it floats: a slow sway and bob, the light drifting with it.
        goal.x = 0;
        goal.y = still ? 0 : Math.sin(t * 0.9) * 5 * scale;
        goal.rx = still ? 0 : Math.sin(t * 0.7) * 3.5;
        goal.ry = still ? 0 : Math.cos(t * 0.55) * 5;
        goal.rz = still ? 0 : Math.sin(t * 0.45) * 0.8;
        goal.mx = 50 + Math.cos(t * 0.55) * 30;
        goal.my = 30 + Math.sin(t * 0.7) * 20;
      }
      if (!drag) {
        if (hover) goal.x = goal.y = 0;
        if (hover) goal.rz = 0;
      }
      let busy = false;
      for (const k of Object.keys(s) as (keyof typeof s)[]) {
        const stiff = drag && (k === "x" || k === "y") ? 0.35 : 0.08;
        v[k] = (v[k] + (goal[k] - s[k]) * stiff) * 0.78;
        s[k] += v[k];
        if (Math.abs(v[k]) > 0.01 || Math.abs(goal[k] - s[k]) > 0.05) busy = true;
      }
      el.style.setProperty("--tx", `${s.x.toFixed(2)}px`);
      el.style.setProperty("--ty", `${s.y.toFixed(2)}px`);
      el.style.setProperty("--rx", `${s.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${s.ry.toFixed(2)}deg`);
      el.style.setProperty("--rz", `${s.rz.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${s.mx.toFixed(1)}%`);
      el.style.setProperty("--my", `${s.my.toFixed(1)}%`);
      if (seen && (busy || !still || hover || drag)) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && seen) raf = requestAnimationFrame(tick);
    };

    const enter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
      pointer(e);
      wake();
    };
    const move = (e: PointerEvent) => {
      if (drag && e.pointerId === drag.id) {
        const dx = e.clientX - drag.sx;
        const dy = e.clientY - drag.sy;
        if (Math.hypot(dx, dy) > 6) drag.moved = true;
        // Pulled like a carpet: it follows with a give, leans into the pull.
        const reach = 160 * scale;
        goal.x = reach * Math.tanh(dx / reach);
        goal.y = reach * 0.6 * Math.tanh(dy / (reach * 0.6));
        goal.rz = Math.max(-7, Math.min(7, (e.clientX - drag.lx) * 0.45));
        drag.lx = e.clientX;
      }
      if (hover || drag) pointer(e);
      wake();
    };
    const leave = () => {
      hover = false;
      wake();
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, moved: false };
      el.setPointerCapture(e.pointerId);
      el.dataset.grab = "";
      pointer(e);
      wake();
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      // A cancel is the page taking the touch for a scroll: never a tap.
      const tapped = !drag.moved && e.type === "pointerup";
      drag = null;
      delete el.dataset.grab;
      goal.x = goal.y = goal.rz = 0;
      if (e.pointerType !== "mouse") hover = false;
      wake();
      if (tapped) onTap?.();
    };

    const io = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      wake();
    });
    io.observe(el);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [scale, onTap]);

  return (
    <div className="okb-tk-stage">
      <div
        ref={ref}
        className={`okb-tk okb-foil ${className}`}
        role={onTap ? "button" : undefined}
        tabIndex={onTap ? 0 : undefined}
        aria-label={label}
        onKeyDown={onTap ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onTap()) : undefined}
      >
        <span className="okb-tk__engrave" aria-hidden />
        <span className="okb-tk__grain" aria-hidden />
        {children}
        <span className="okb-tk__holo" aria-hidden />
        <span className="okb-tk__glare" aria-hidden />
      </div>
    </div>
  );
}

/** The hero's small ticket: a tap takes you to the big one. */
export function MiniTicket() {
  return (
    <GoldenTicket
      scale={0.5}
      className="okb-tk--mini"
      label="The $1K challenge, Oct 30 to Nov 8. See the prize."
      onTap={() => document.getElementById("okb-win")?.scrollIntoView({ behavior: "smooth", block: "center" })}
    >
      <span className="relative flex h-full flex-col justify-between px-5 py-3.5 text-[#140d00]">
        <span className="flex items-center justify-between font-[family-name:var(--okb-mono)] text-[0.56rem] uppercase tracking-[0.16em] opacity-75">
          <span>Admit one</span>
          <span>Free</span>
        </span>
        <span className="block whitespace-nowrap font-[family-name:var(--okb-archivo)] text-[1.2rem] font-black sm:text-[1.55rem] leading-[0.9] tracking-[-0.04em]">
          The $1K <span className="font-[family-name:var(--okb-serif)] font-normal italic tracking-[-0.01em]">challenge</span>
        </span>
        <span className="flex items-center justify-between font-[family-name:var(--okb-mono)] text-[0.56rem] uppercase tracking-[0.16em] opacity-75">
          <span>Oct 30 → Nov 8</span>
          <span>10 days</span>
        </span>
      </span>
    </GoldenTicket>
  );
}
