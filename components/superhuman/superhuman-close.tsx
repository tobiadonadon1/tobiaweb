"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { ConstructStar } from "./construct-star";
import Link from "next/link";
import { EMAIL, mailto, shelfHref } from "./shelf-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STAR_PX = 150;

/**
 * SECTION 6, resolve. Anchor: centre.
 *
 * Device family: reassembly. The star that came apart on the shelf puts
 * itself back together here, ray by ray, each one swinging up out of the
 * core and unfolding to its own length. Then it holds, and the page ends on
 * an action rather than on a fade.
 *
 * Transforms are written to the `transform` attribute directly, from one
 * timeline, so there is never a question about how a baked rotation and an
 * animated one compose.
 */
export function SuperhumanClose() {
  const scope = useRef<HTMLElement>(null);

  /**
   * THE REASSEMBLY IS GONE. The old mark was eight separable rays, so the
   * close could take the star apart on the shelf and put it back together
   * here, one ray swinging up out of the core at a time. It was the best
   * device on the page and it cannot survive the new symbol: a drawing has no
   * parts to reassemble, and faking some would be the one dishonest object in
   * a section whose whole job is to be plain.
   *
   * What is left is a settle. The mark and the two lines under it rise once
   * as the section arrives, and then the page stops moving, which is what a
   * close should do anyway.
   */
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-close-rise]", {
          opacity: 0,
          y: 18,
          duration: 0.8,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        });
      }, scope);
      return () => ctx.revert();
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={scope}
      id="close"
      className="flex flex-col items-center px-6 pb-20 pt-24 text-center md:pb-24 md:pt-32"
    >
      <div data-close-rise style={{ height: STAR_PX, width: STAR_PX }}>
        <ConstructStar id="close" className="h-full w-full" />
      </div>

      <h2
        data-close-rise
        className="mt-10 text-balance font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] tracking-[-0.025em] text-[var(--ink)] md:mt-12"
      >
        Start with one thing.
      </h2>

      {/* The three names used to be repeated here as links to three offer
          pages. The pages are gone, the field is on the card, and repeating
          the shelf under the shelf was the page saying the same thing a
          third time. What is left is the one thing the page cannot do for
          you: write. */}
      {/* THE ONE THING, NAMED. "Start with one thing" used to be followed
          only by an address, so the page told a ready reader to start and
          then gave them nowhere to start except their inbox. The one thing
          is the free shelf, so the close hands it over, and the address
          stays underneath for anyone the shelf did not answer. */}
      <p
        data-close-rise
        className="mt-6 max-w-[30ch] text-pretty text-[1.05rem] leading-[1.55] text-[color:rgba(11,31,58,0.66)] md:text-[1.15rem]"
      >
        Pick the piece nearest to what you are stuck on. If nothing fits, write to me.
      </p>

      <div
        data-close-rise
        className="mt-10 flex flex-col items-center gap-5"
      >
        <Link
          href={shelfHref("material")}
          className="group inline-flex min-h-[3.25rem] items-center gap-2.5 bg-[var(--ink)] px-7 py-4 text-[0.98rem] text-[var(--paper)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        >
          Open the free material
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        <a
          href={mailto("Construct")}
          className="group inline-flex min-h-11 items-center gap-2 border-b border-[rgba(11,31,58,0.2)] text-sm text-[color:rgba(11,31,58,0.72)] transition-colors hover:border-[var(--accent-clay)] hover:text-[var(--ink)]"
        >
          {EMAIL}
          <ArrowUpRight className="h-4 w-4 text-[var(--accent-clay-text)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

    </section>
  );
}
