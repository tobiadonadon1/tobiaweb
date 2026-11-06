"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE BRAKE, DRAWN. Spending fills the account toward Meta's own spending
 * limit and stops dead at the scarlet line. Fills once, when it scrolls into
 * view; full from the start without script or with reduced motion
 * (meta-ads.css).
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
      <p className="text-[0.82rem] font-bold uppercase tracking-[0.02em]">The hard brake</p>
      <p className="mt-2 max-w-[30ch] text-[1.45rem] font-bold leading-[1.1] tracking-[-0.045em]">
        Meta stops all spending at your limit. Not one cent over.
      </p>
      <div className="ma-gauge__track" aria-hidden>
        <span className="ma-gauge__fill" />
        <span className="ma-gauge__cap">
          <span>Your spending limit</span>
        </span>
      </div>
      <div className="ma-gauge__scale" aria-hidden>
        <span>Spent so far</span>
        <span>Stops here</span>
      </div>
      <figcaption className="ma-gauge__lock">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span>The skill won&rsquo;t switch anything on until that limit is set, and never above your daily cap.</span>
      </figcaption>
    </figure>
  );
}
