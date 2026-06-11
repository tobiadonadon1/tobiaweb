"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The ink cursor: a small sky-blue dot (the mountains' highlight color)
 * that trails the pointer with a gentle lerp, grows over anything
 * clickable, and turns paper-white while the ink tide covers the screen
 * (ProjectsSection sets body[data-ink="1"] during the dark phase).
 * Fine pointers only; imperative rAF — no React re-renders per move.
 */
export function InkCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mount-gate: only on devices with a real pointer.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-ink-cursor");
    return () => document.documentElement.classList.remove("has-ink-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        dot.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      targetScale = t?.closest("a, button, [role='button']") ? 1.9 : 1;
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const k = reduced ? 1 : 0.22;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      scale += (targetScale - scale) * (reduced ? 1 : 0.18);
      dot.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      // Paper-white over the ink, sky-blue over the paper.
      dot.style.backgroundColor =
        document.body.dataset.ink === "1" ? "#faf8f2" : "#38bdf8";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 rounded-full"
      style={{
        opacity: 0,
        backgroundColor: "#38bdf8",
        transition: "background-color 250ms ease, opacity 200ms ease",
        boxShadow: "0 0 12px rgba(56,189,248,0.35)",
        willChange: "transform",
      }}
    />
  );
}
