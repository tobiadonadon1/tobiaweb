"use client";

import { useEffect, useRef } from "react";

/**
 * A MOTION PIECE, PLAYING.
 *
 * A muted loop that plays only while it is on screen (battery, and four of
 * them on one phone), and never for someone who asked for reduced motion:
 * they get the poster, which is the piece's resting composition.
 */
export function LoopVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      v.removeAttribute("autoplay");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label={label}
      className={`block aspect-[16/10] h-auto w-full object-cover ${className}`}
    />
  );
}
