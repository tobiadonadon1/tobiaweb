"use client";

import { useEffect, useRef } from "react";

/**
 * THE BOTS LOOK AT YOU. A wrapper that writes where the pointer is, relative
 * to its own centre, into two CSS variables (-1 to 1); the page's CSS moves
 * every pair of eyes inside it a few units that way. Eyes only: the bodies
 * never move, tilt or turn. No pointer (a phone), or reduced motion, and the
 * eyes simply stay where they were drawn.
 */
export function LookingSquad({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const dx = (x - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy = (y - (r.top + r.height / 2)) / (window.innerHeight / 2);
      el.style.setProperty("--ga-lx", Math.max(-1, Math.min(1, dx)).toFixed(3));
      el.style.setProperty("--ga-ly", Math.max(-1, Math.min(1, dy)).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={`ga-look ${className ?? ""}`}>
      {children}
    </div>
  );
}
