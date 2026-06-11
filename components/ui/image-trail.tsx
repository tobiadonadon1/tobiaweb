"use client";

import { useEffect, useRef } from "react";

interface ImageTrailProps {
  images: string[];
  /** Pixels the cursor must travel before the next image spawns. */
  spawnDistance?: number;
  className?: string;
}

/**
 * Spawns images that trail the pointer: each time the cursor travels
 * `spawnDistance` pixels, the next image pops in at the cursor position,
 * lingers for a beat, and fades away (see `.trail-img` in globals.css).
 * Imperative DOM (no React re-render per spawn) keeps it perfectly smooth.
 */
export function ImageTrail({
  images,
  spawnDistance = 90,
  className,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const counter = useRef(0);

  // Warm the browser cache so the first spawns aren't blank.
  useEffect(() => {
    images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (lastPos.current) {
        const d = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
        if (d < spawnDistance) return;
      }
      lastPos.current = { x, y };

      const img = document.createElement("img");
      img.src = images[counter.current++ % images.length];
      img.alt = "";
      img.className = "trail-img";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.setProperty("--r", `${(Math.random() * 16 - 8).toFixed(1)}deg`);
      container.appendChild(img);
      img.addEventListener("animationend", () => img.remove());
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [images, spawnDistance]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
