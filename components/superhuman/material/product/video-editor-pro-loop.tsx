"use client";

import { useEffect, useRef } from "react";

/**
 * A "What it does" card's clip: a few seconds of the final reel, silent, looping.
 * It loads nothing until it's near the screen and plays only while it's seen,
 * so four of them don't fight the hero film. Reduced motion keeps the poster.
 */

export function VideoEditorProLoop({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
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
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover"
    />
  );
}
