"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE BRAKE, DRAWN. Spending fills toward Meta's own spending limit and stops
 * dead at the scarlet line. Fills once, when it scrolls into view; full from
 * the start without script or with reduced motion (meta-ads.css).
 */
export function MetaAdsGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="ma-gauge m-0" data-in={seen || undefined}>
      <h3>A hard spending cap.</h3>
      <p>Meta stops at your limit. Not one cent over.</p>
      <div className="ma-gauge__track" aria-hidden>
        <span className="ma-gauge__fill" />
        <span className="ma-gauge__cap">
          <span>Your limit</span>
        </span>
      </div>
    </figure>
  );
}
