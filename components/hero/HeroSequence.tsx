"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Tobia's own photos, web-optimized from assets/trail-originals/. They stack
 * inside the intro frame and wipe open one after another. The LAST entry is
 * the one the hero settles on and holds — that is DSCF3134, by request.
 */
/**
 * Each photo ships at two widths so a phone never downloads desktop-sized
 * files: `sizes="100vw"` tells the browser the frame ends up full-bleed, and
 * it picks the candidate that matches the device's real pixel width.
 */
type IntroImage = { src: string; w1: number; w2: number };

const INTRO_IMAGES: IntroImage[] = [
  { src: "/trail/trail-01.jpg", w1: 700, w2: 1400 },
  { src: "/trail/trail-09.jpg", w1: 700, w2: 1400 },
  { src: "/trail/trail-02.jpg", w1: 1000, w2: 2000 },
  { src: "/trail/trail-10.jpg", w1: 700, w2: 1400 },
  { src: "/trail/trail-03.jpg", w1: 480, w2: 912 },
  { src: "/trail/trail-11.jpg", w1: 700, w2: 1400 },
  { src: "/trail/trail-05.jpg", w1: 480, w2: 920 },
  { src: "/trail/trail-06.jpg", w1: 1000, w2: 2000 },
  { src: "/trail/trail-07.jpg", w1: 960, w2: 1920 },
  { src: "/trail/trail-08.jpg", w1: 700, w2: 1400 },
  { src: "/trail/trail-04.jpg", w1: 1000, w2: 2000 },
];

const NAME = "Tobia Donadon";

/**
 * Has this DOCUMENT already mounted the hero once?
 *
 * `performance.getEntriesByType("navigation")[0].type` describes how the
 * document was fetched, and it keeps saying "reload" for the whole life of
 * that document, including across every client-side route change inside it.
 * So after one refresh of the homepage, the reload check below stayed true
 * forever: walking into a project page and back re-ran the loader and yanked
 * the page to the top, which is precisely the bug this was meant to fix.
 *
 * Module scope is exactly the right lifetime. It survives client-side
 * navigation and dies with the document, so the reload signal is honoured
 * once and then spent.
 */
let reloadSpent = false;

// Loader beats, in seconds. Each photo wipes down over the one before it;
// once the last has landed the frame opens out to full bleed, the vignette
// arrives, and the name rises from the bottom-left.
// Slower than it was. The whole sequence used to finish in 3.75s, which read
// as a flicker rather than a sequence: eleven photographs went past faster
// than any of them could be looked at. These four numbers ARE the pacing, and
// they are the only place to change it. Now ~5.0s to the name.
const FIRST_REVEAL_DELAY = 0.45;
const REVEAL_STAGGER = 0.2;
const REVEAL_DURATION = 1.15;
const EXPAND_DURATION = 1.4;
const NAME_AT =
  FIRST_REVEAL_DELAY +
  (INTRO_IMAGES.length - 1) * REVEAL_STAGGER +
  REVEAL_DURATION +
  EXPAND_DURATION;

/**
 * Splits a line into per-word masks so each word can rise out of its own
 * clipped box. The spaces sit OUTSIDE the masks — inside, they'd travel with
 * the word and the line would breathe as it animates.
 */
function MaskedWords({ text }: { text: string }) {
  const words = text.split(/\s+/);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-top">
            <span className="js-word inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 && (
            // A real space lives INSIDE the spacer: the box keeps its fixed
            // width for layout, but textContent, the accessible name and
            // anything crawling the page now read "Tobia Donadon", not
            // "TobiaDonadon".
            <span className="inline-block w-[0.24em]">{" "}</span>
          )}
        </Fragment>
      ))}
    </>
  );
}

export default function HeroSequence() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    /**
     * Should the loader play at all?
     *
     * It must NOT when the reader is coming BACK to the homepage. Returning
     * from a project page used to replay the whole photo sequence, lock the
     * scroll for four seconds and slam the page to y=0, which threw away the
     * place the reader had left from. Two signals mean "this is a return":
     *
     *   a hash in the URL   the back links point at /#projects, and the loader
     *                       would fight the browser's own scroll to it
     *   a session flag      set the first time the intro finishes, so any
     *                       later visit to / in the same tab lands instantly
     *
     * A fresh tab on a bare "/" still gets the full loader, which is the only
     * place it was ever earning its keep.
     */
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;

    // A REFRESH is a deliberate "start again", so it always plays, session
    // flag or not. Without this, the flag below swallowed the loader on every
    // reload of the homepage: it had played once in the tab, so it never
    // played again. Scoped to a reload OF THE HOMEPAGE, because refreshing a
    // project page and then walking back here is a return, not a restart.
    let restarted = false;
    if (!reloadSpent) {
      try {
        restarted =
          nav?.type === "reload" && new URL(nav.name).pathname === "/";
      } catch {
        // A malformed navigation entry is not worth failing the hero over.
      }
    }
    reloadSpent = true;

    const hash = window.location.hash;
    const returning =
      !restarted &&
      ((hash && hash !== "#home") ||
        sessionStorage.getItem("intro:played") === "1");

    // The loader owns the screen: pin to top and lock scroll while it plays.
    // Neither applies to a return visit.
    //
    // `behavior: "instant"` is load-bearing. globals.css sets
    // `scroll-behavior: smooth` on <html>, so a plain scrollTo(0, 0) from
    // deep in the page ANIMATES: the reader watches the whole site scroll
    // past on its way back to the top. This has to be a cut, not a journey.
    if (!returning) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const prevOverflow = document.body.style.overflow;
    if (!returning) document.body.style.overflow = "hidden";

    // Hands the page back: unlocks scroll and lets the nav fade in. Fires as
    // the name lands, not when the whole timeline drains.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      document.body.style.overflow = prevOverflow;
      // Remembered for the rest of the tab: the loader is a first-impression
      // device, and a first impression only happens once.
      try {
        sessionStorage.setItem("intro:played", "1");
      } catch {
        // Private mode with storage blocked. The loader simply plays again.
      }
      // Deferred a frame on purpose. The skip path calls release() during
      // this component's own effect, which can run BEFORE the nav has
      // attached its listener; the nav would then sit invisible until its
      // five second backstop. A frame is enough for every mount effect to
      // have run, and is imperceptible on the paths that animate.
      requestAnimationFrame(() =>
        window.dispatchEvent(new CustomEvent("intro:done")),
      );
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const images = q(".js-intro-image");
      const frame = q(".js-intro-frame");
      const radial = q(".js-intro-radial");
      const nameWords = q(".js-name .js-word");

      // The opened frame. Percentages, not dvh: GSAP's unit converter knows
      // px/%/em/rem/vw/vh but NOT dvh, so a dvh target tweens to garbage. The
      // frame's parent is `inset-0` inside a 100dvh section, so 100% lands on
      // exactly the same box. The resting 16/9 likewise comes from a calc()
      // height rather than `aspect-ratio`, which would snap, not animate.
      const OPEN = { width: "100%", height: "100%" };

      // A return visit lands on the finished frame with no animation at all,
      // exactly like the reduced-motion path, and then gets out of the way so
      // the browser can scroll to whatever hash brought us here.
      // Arriving at a section is also a cut. Next scrolls to the hash itself,
      // but `scroll-behavior: smooth` can still turn that into a long glide
      // down the page, so the landing is asserted here directly.
      if (returning && hash && hash !== "#home") {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, left: 0, behavior: "instant" });
        }
      }

      if (reduced || returning) {
        // No curtain and no expansion: land straight on the finished frame.
        gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(frame, OPEN);
        gsap.set(radial, { opacity: 1 });
        gsap.set(nameWords, { yPercent: 0, opacity: 1 });
        release();
        return;
      }

      gsap.set(images, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(nameWords, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline();

      tl.to(images, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: REVEAL_DURATION,
        delay: FIRST_REVEAL_DELAY,
        stagger: { each: REVEAL_STAGGER, ease: "power1.out" },
      });

      tl.to(frame, {
        ...OPEN,
        duration: EXPAND_DURATION,
        ease: "power3.inOut",
        // Re-assert the relative values so the full-bleed frame keeps
        // tracking the viewport on resize instead of freezing at px.
        onComplete: () => gsap.set(frame, OPEN),
      });

      tl.to(radial, { opacity: 1, duration: 0.85, ease: "power2.out" }, ">");

      tl.to(
        nameWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.075,
        },
        NAME_AT,
      );

      tl.call(release, undefined, NAME_AT);
    }, scope);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <section
      ref={scope}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] text-white"
    >
      {/* The frame: a small 16/9 card that opens out to fill the viewport.
          The 16/9 comes from a calc() height rather than `aspect-ratio` so
          GSAP has two plain numbers to tween. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="js-intro-frame relative h-[calc(min(88vw,28rem)*9/16)] w-[min(88vw,28rem)] overflow-hidden md:h-[calc(42vw*9/16)] md:w-[42vw]">
          {INTRO_IMAGES.map((img) => (
            <img
              key={img.src}
              src={img.src}
              srcSet={`${img.src} ${img.w1}w, ${img.src.replace(".jpg", "@2x.jpg")} ${img.w2}w`}
              sizes="100vw"
              alt=""
              loading="eager"
              decoding="async"
              className="js-intro-image absolute inset-0 h-full w-full object-cover"
            />
          ))}

          {/* Arrives once the frame is open — sinks the edges so the name
              reads against the photo without a slab behind it. */}
          <div
            aria-hidden
            className="js-intro-radial pointer-events-none absolute inset-0 z-10 opacity-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 88% at 50% 42%, transparent 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </div>
      </div>

      {/* The landing: the name arrives last, once the frame is full-bleed. */}
      <div className="js-name pointer-events-none absolute inset-x-0 bottom-32 z-20 sm:bottom-16 md:bottom-20 md:left-20 md:right-auto">
        <h1 className="px-5 text-center font-helvetica text-[clamp(2.25rem,7vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] md:px-0 md:text-left">
          <MaskedWords text={NAME} />
        </h1>
      </div>
    </section>
  );
}
