"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Block } from "./catalog.generated";

/** The card behind a block: its own ground, or the library's warm grey (a deep one for dark blocks). */
export const groundOf = (b: Block) => b.ground ?? (b.dark ? "#15171c" : "#efebe3");

/**
 * A BLOCK'S STAGE: the block is laid out in a box of the size it was
 * designed at. Where the space is smaller, the box first shrinks to fit (down
 * to `minWidth` × `minHeight`, which a block still looks right in), and only
 * below that is it scaled down, like a thumbnail that still works. Never
 * scaled up: a block is drawn at its real size or smaller.
 */
export function Stage({
  width,
  height,
  minWidth = width,
  minHeight = height,
  children,
}: {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  children: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: width, h: height, scale: 1 });
  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const fit = () => {
      const w = Math.max(minWidth, Math.min(width, el.clientWidth));
      const h = Math.max(minHeight, Math.min(height, el.clientHeight));
      setBox({ w, h, scale: Math.min(1, el.clientWidth / w, el.clientHeight / h) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, minWidth, minHeight]);
  return (
    <div ref={outer} className="absolute inset-0 overflow-hidden">
      {/* Centred by position, not by the grid: a box wider than its space
          would otherwise hang off to the right before it is scaled. */}
      <div
        className="absolute left-1/2 top-1/2 grid place-items-center"
        style={{ width: box.w, height: box.h, transform: `translate(-50%, -50%)${box.scale < 1 ? ` scale(${box.scale})` : ""}` }}
      >
        {children}
      </div>
    </div>
  );
}
