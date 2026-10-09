"use client";

import { useEffect, useRef } from "react";

/**
 * Starts a CSS-animated piece when it scrolls into view, once.
 *
 * Without JavaScript the piece shows its finished state (the CSS only
 * animates under [data-armed]). On mount it is armed (back to its first
 * frame, paused), and it plays when at least a third of it is on screen,
 * so a phone visitor who scrolls down to it still sees it happen.
 */
export function PlayOnView({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.play = "";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
