"use client";

import { useEffect, useRef } from "react";

/**
 * ARRIVES ON SCROLL.
 *
 * An IntersectionObserver adding one class, and CSS doing the rest. Not GSAP:
 * this is an entrance, it happens once, and it does not need a timeline, a
 * matchMedia context or a scrubbed trigger. The whole thing is nine lines and
 * cannot fall out of sync with anything.
 *
 * WITHOUT JAVASCRIPT the content is simply visible: the hiding is applied by
 * the same class system that reveals it, and `.reveal` only hides once
 * `.reveal--armed` has been set from here. A reader with scripting off sees a
 * finished page rather than an empty one, which is the only acceptable
 * failure mode for an entrance.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("reveal--armed");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("reveal--in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
