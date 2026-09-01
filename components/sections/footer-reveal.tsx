"use client";

import { useEffect } from "react";

/**
 * Drives `--reveal` on the footer: 0 while the page still covers it, 1 when it
 * is fully uncovered at the bottom of the scroll.
 *
 * The footer is `position: fixed` behind the page, so it is always technically
 * "in view" and an IntersectionObserver has nothing to observe. What actually
 * changes is how much of the page is left below the fold, which is one
 * subtraction: the bottom of the content against the bottom of the viewport.
 *
 * One passive scroll listener coalesced into a rAF, one custom property
 * written per frame, and nothing recomputed that has not moved.
 *
 * It also raises `data-footer-open` on <body> the moment any of the footer is
 * uncovered. Anything fixed to the viewport that must not sit on top of the
 * last page hides off that one flag in CSS — see `.sh-compass` in globals.css.
 * A flag rather than an event because the things that care are decorative and
 * should cost nothing: no second scroll listener, no observer, no re-render.
 */
export function FooterReveal() {
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".site-footer");
    const content = document.querySelector<HTMLElement>(".site-content");
    if (!footer || !content) return;

    // Reduced motion: the footer is a normal static block, so there is no
    // reveal to track. Light it fully and stop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      footer.style.setProperty("--reveal", "1");
      // The footer is a normal static block here, so it is only "open" once
      // it is actually on screen. Nothing is pinned over it, so the flag is
      // simply never raised.
      return;
    }

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const height = footer.offsetHeight || 1;
      // How far the viewport's bottom edge has passed the end of the content.
      const uncovered =
        window.scrollY + window.innerHeight - content.getBoundingClientRect().height - content.offsetTop;
      const p = Math.max(0, Math.min(1, uncovered / height));
      // Two decimals is past the point of visible difference and saves a
      // style write on most frames.
      const rounded = Math.round(p * 100) / 100;
      if (rounded === last) return;
      last = rounded;
      footer.style.setProperty("--reveal", String(rounded));
      // Anything above the page hides as soon as the footer is uncovered at
      // all. 0.01 rather than 0 so a sub-pixel rounding at rest cannot flicker
      // it on and off.
      if (rounded > 0.01) document.body.dataset.footerOpen = "1";
      else delete document.body.dataset.footerOpen;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete document.body.dataset.footerOpen;
    };
  }, []);

  return null;
}
