"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Slide {
  src: string;
  caption?: string;
}

/**
 * A quiet sea-toned slideshow: photos crossfade and breathe (slow Ken-Burns
 * scale), auto-advancing, pausing on hover, with dots to jump. His own
 * photography, graded to the ink. Reduced motion holds the first frame.
 */
export function PhotoSlideshow({
  slides,
  className,
}: {
  slides: Slide[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setActive((p) => (p + 1) % slides.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: "rgba(30,26,14,0.08)" }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {slides.map((s, idx) => (
          <div
            key={s.src}
            aria-hidden={idx !== active}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
            style={{ opacity: idx === active ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local sea-toned plate */}
            <img
              src={s.src}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5200ms] ease-out"
              style={{
                filter: "saturate(0.82) contrast(0.97)",
                transform: idx === active ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "rgba(11,31,58,0.08)", mixBlendMode: "multiply" }}
            />
            {s.caption && (
              <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#faf8f2]/80">
                {s.caption}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2.5">
        {slides.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Photo ${idx + 1}`}
            onClick={() => setActive(idx)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: idx === active ? 22 : 6,
              backgroundColor:
                idx === active ? "rgba(11,31,58,0.6)" : "rgba(11,31,58,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
