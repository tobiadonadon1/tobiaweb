"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import {
  RAY_LOCAL_D,
  STAR_CORE_D,
  STAR_RAYS,
  STAR_TIGHT_ASPECT,
  STAR_VIEWBOX_TIGHT,
} from "./superhuman-star";
import { EMAIL, mailto } from "./shelf-data";

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
  const rays = useRef<(SVGPathElement | null)[]>([]);
  const core = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = STAR_RAYS.map((ray) => ({
        rot: ray.angle - 52,
        s: 0.1,
        o: 0,
      }));
      const coreState = { o: 0 };

      const apply = (i: number) => {
        const el = rays.current[i];
        if (!el) return;
        const st = state[i];
        el.setAttribute(
          "transform",
          `rotate(${st.rot.toFixed(2)}) scale(${st.s.toFixed(4)})`,
        );
        el.setAttribute("opacity", st.o.toFixed(3));
      };
      const applyCore = () => {
        core.current?.setAttribute("opacity", coreState.o.toFixed(3));
      };

      state.forEach((_, i) => apply(i));
      applyCore();

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 74%", once: true },
      });

      state.forEach((st, i) => {
        tl.to(
          st,
          {
            rot: STAR_RAYS[i].angle,
            s: 1,
            o: 1,
            duration: 0.9,
            ease: "power3.out",
            onUpdate: () => apply(i),
          },
          0.05 + i * 0.055,
        );
      });
      tl.to(
        coreState,
        { o: 1, duration: 0.5, ease: "power2.out", onUpdate: applyCore },
        0.3,
      );
      tl.from(
        root.querySelectorAll("[data-close-fade]"),
        { opacity: 0, y: 16, duration: 0.8, stagger: 0.11, ease: "power2.out" },
        0.5,
      );

      return () => {
        rays.current.forEach((el, i) => {
          el?.removeAttribute("opacity");
          el?.setAttribute("transform", `rotate(${STAR_RAYS[i].angle})`);
        });
        core.current?.removeAttribute("opacity");
      };
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
      {/* The tight box keeps the resting mark visually centred; overflow
          stays visible so a ray mid-unfold is never clipped by it. */}
      <svg
        width={Math.round(STAR_PX * STAR_TIGHT_ASPECT)}
        height={STAR_PX}
        viewBox={STAR_VIEWBOX_TIGHT}
        aria-hidden="true"
        style={{ overflow: "visible" }}
        className="text-[var(--accent-sky)]"
        fill="url(#sh-close-star)"
      >
        {/* Matches the hero mark: this one is on paper too. */}
        <defs>
          <linearGradient id="sh-close-star" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5aa6cc" />
            <stop offset="58%" stopColor="#2f7fae" />
            <stop offset="100%" stopColor="#12435f" />
          </linearGradient>
        </defs>
        <path ref={core} d={STAR_CORE_D} />
        {STAR_RAYS.map((ray, i) => (
          <path
            key={i}
            ref={(el) => {
              rays.current[i] = el;
            }}
            d={RAY_LOCAL_D[i]}
            transform={`rotate(${ray.angle})`}
          />
        ))}
      </svg>

      <h2
        data-close-fade
        className="mt-12 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] tracking-[-0.025em] text-[var(--ink)]"
      >
        Start with one thing.
      </h2>

      {/* The three names used to be repeated here as links to three offer
          pages. The pages are gone, the field is on the card, and repeating
          the shelf under the shelf was the page saying the same thing a
          third time. What is left is the one thing the page cannot do for
          you: write. */}
      <a
        data-close-fade
        href={mailto("Construct")}
        className="group mt-11 inline-flex items-center gap-2 border-b border-[rgba(11,31,58,0.2)] pb-1 text-sm text-[var(--ink)] transition-colors hover:border-[rgba(56,189,248,0.9)]"
      >
        {EMAIL}
        <ArrowUpRight className="h-4 w-4 text-[var(--accent-sky)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>

    </section>
  );
}
