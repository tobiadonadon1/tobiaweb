"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A real carousel the skill made, swipeable on the page: scroll-snap on a
 * phone (the thumb does it), arrows and a counter on a desktop. The slides are
 * the exact PNGs it rendered, so what you swipe here is what gets posted.
 */
export function CarouselDeck({ slides, label }: { slides: { src: string; alt: string }[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0");
    setAt(Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / step))));
  }, [slides.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const go = (d: number) => {
    const el = track.current;
    const card = el?.children[Math.max(0, Math.min(slides.length - 1, at + d))] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="cd-deck" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={track} className="cd-deck__track">
        {slides.map((s, i) => (
          <li key={s.src} className="cd-deck__slide" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            <Image src={s.src} alt={s.alt} width={810} height={1013} sizes="(min-width: 1024px) 24rem, 78vw" className="block h-auto w-full" />
          </li>
        ))}
      </ul>
      <div className="cd-deck__bar">
        <span className="cd-deck__count" aria-live="polite">
          {String(at + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}
        </span>
        <span className="cd-deck__dots" aria-hidden>
          {slides.map((s, i) => (
            <i key={s.src} data-on={i === at || undefined} />
          ))}
        </span>
        <span className="cd-deck__arrows">
          <button type="button" onClick={() => go(-1)} disabled={at === 0} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => go(1)} disabled={at === slides.length - 1} aria-label="Next slide">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </span>
      </div>
    </div>
  );
}
