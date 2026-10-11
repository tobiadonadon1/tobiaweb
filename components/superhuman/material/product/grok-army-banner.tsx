"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * THE BANNER: Tobia's drawing of the whole crowd of bots (every shape and
 * colour, arrows all pointing in) with the word in the middle cut out, so the
 * goal can be live text that changes: goal, grok army, $$$$ (Tobia's three). The server renders "goal", so a crawler or a
 * screenshot reads the idea; script then swaps the word in place (a fade and
 * a small rise, nothing turns). Reduced motion keeps "goal".
 *
 * The drawing is 1600 x 639. Wide screens show all of it; a phone shows the
 * middle at 4:3 so the word stays big. The word is sized to the banner's own
 * width (cqw) to sit where the original lettering was.
 */

const WORDS = ["goal", "grok army", "$$$$"];


export function GrokArmyBanner({ className }: { className?: string }) {
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div
      role="img"
      aria-label="A crowd of bots in every shape and colour, all heading for one goal"
      className={`relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#f9f8f6] [container-type:inline-size] sm:aspect-[1600/639] sm:rounded-[2rem] ${className ?? ""}`}
    >
      <Image
        src="/shop/grok-army/banner.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 grid place-items-center" aria-hidden>
        {WORDS.map((w, i) => (
          <span
            key={w}
            className="ga-word whitespace-nowrap text-[14cqw] font-extrabold leading-none tracking-[-0.02em] text-[#1a1a1a] [grid-area:1/1] sm:text-[9.2cqw]"
            data-on={i === word || undefined}
          >
            {w}
          </span>
        ))}
      </div>

    </div>
  );
}
