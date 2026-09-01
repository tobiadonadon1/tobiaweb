"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

// The block is hidden and revealed by touching the node directly, so the
// server sends visible markup and nothing has to re-render. A layout effect
// runs before the browser paints, so the hide is never seen.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * The quietest device on the page: a block that lifts a little the first time
 * it is seen, and never again. Transform and opacity only. Reduced motion
 * leaves the markup exactly as it was served.
 */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 950ms ${EASE} ${delay}ms, transform 950ms ${EASE} ${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
