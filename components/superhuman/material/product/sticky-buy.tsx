"use client";

import { useEffect, useState } from "react";
import { BuyForm } from "./buy-form";

/**
 * THE BUTTON THAT FOLLOWS YOU, ON A PHONE ONLY.
 *
 * Most visitors arrive from a post, on a phone, and read down. By the time
 * they have decided, the button is four screens above them. So once the hero's
 * button has scrolled away, a slim bar rises at the bottom carrying the name,
 * the price and the same form. It sinks again when the closing button is on
 * screen or behind you, so it never covers the page's own ending or the
 * footer under it.
 *
 * Not on desktop, where the page is short enough in screens that the close is
 * never far, and a bar pinned to a wide window reads as an advert.
 */
export function StickyBuy({
  productId,
  name,
  price,
  heroId,
  closeId,
}: {
  productId: string;
  name: string;
  price: string;
  heroId: string;
  closeId: string;
}) {
  const [heroGone, setHeroGone] = useState(false);
  const [closeReached, setCloseReached] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const close = document.getElementById(closeId);
    if (!hero || !close) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // "Gone" means scrolled past, not merely off screen below.
        const past = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === hero) setHeroGone(past);
        if (e.target === close) setCloseReached(e.isIntersecting || past);
      }
    });
    io.observe(hero);
    io.observe(close);
    return () => io.disconnect();
  }, [heroId, closeId]);

  const shown = heroGone && !closeReached;

  /* A floating card, not a full-width bar, at the bottom edge. The site's
     nav lives at the top on every screen size now, so nothing down here
     competes with it. */
  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-3 z-40 mx-auto max-w-[26rem] transition-[transform,opacity] duration-500 ease-out bottom-[calc(env(safe-area-inset-bottom)+0.9rem)] sm:bottom-5 md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-[rgba(11,31,58,0.1)] bg-[rgba(250,248,242,0.92)] py-1.5 pl-5 pr-1.5 shadow-[0_18px_44px_-18px_rgba(11,31,58,0.45)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] leading-tight text-[var(--ink)]">{name}</p>
          <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            Instant download
          </p>
        </div>
        <BuyForm
          productId={productId}
          price={price}
          compact
          className="shrink-0"
        />
      </div>
    </div>
  );
}
