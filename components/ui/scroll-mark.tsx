"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

// Fire each scroll milestone at most once per page view (survives App Router
// soft-nav remounts, which would otherwise re-count the same reader).
const fired = new Set<string>();

/**
 * An invisible 1px sentinel: the first time it scrolls into view it reports a
 * single analytics event, then disconnects. Mount it at the top of a section
 * to measure "did the reader reach here" (e.g. reached_projects, reached_end).
 */
export function ScrollMark({ event }: { event: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.has(event)) return;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !fired.has(event)) {
          fired.add(event);
          track(event);
          io.disconnect();
        }
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [event]);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}
