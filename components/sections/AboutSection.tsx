"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { track } from "@vercel/analytics";

// At-a-glance facts — the quiet mono proof voice.
const FACTS: [string, string][] = [
  ["Roots", "Italy"],
  ["Formed", "Miami"],
  ["Age", "20"],
  ["Practice", "meditation · photography"],
  ["Currently", "building quietly"],
];

/**
 * About — where the visitor finally meets Tobia. The quietest section on
 * the site: a short letter in his direct voice, one sea-toned portrait,
 * and a whisper-sized fact stack. The Line cameos as a hand-drawn stroke
 * under his name, drawing itself as the section enters. Everything
 * settles once; nothing moves on its own.
 */
export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stroke = strokeRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = Array.from(root.querySelectorAll("[data-settle]")) as HTMLElement[];
    gsap.set(blocks, { opacity: 0, y: 22, filter: "blur(6px)" });

    let strokeLen = 0;
    if (stroke) {
      strokeLen = stroke.getTotalLength();
      stroke.style.strokeDasharray = `${strokeLen}`;
      stroke.style.strokeDashoffset = `${strokeLen}`;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const i = blocks.indexOf(entry.target as HTMLElement);
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            delay: Math.min(i * 0.08, 0.3),
            clearProps: "opacity,transform,filter",
          });
          // The headline block carries the name-stroke: draw it as it lands.
          if (stroke && entry.target.contains(stroke)) {
            gsap.to(stroke, {
              strokeDashoffset: 0,
              duration: 0.9,
              delay: 0.45,
              ease: "power2.inOut",
            });
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    blocks.forEach((b) => io.observe(b));

    return () => {
      io.disconnect();
      gsap.killTweensOf(blocks);
      if (stroke) gsap.killTweensOf(stroke);
    };
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="border-t border-black/5 bg-background"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-28 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:py-36">
        {/* ---- The letter ---- */}
        <div className="flex flex-col justify-center">
          <span data-settle className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
            About
          </span>

          <h2 data-settle className="mt-6 font-serif text-5xl tracking-tight text-[#0a0a0a] md:text-6xl">
            Hi. I&rsquo;m{" "}
            <span className="relative inline-block">
              Tobia
              {/* The Line's cameo: a hand-drawn ink stroke under the name. */}
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-[10px] w-full"
              >
                <path
                  ref={strokeRef}
                  d="M3 8 C 24 4, 44 9, 62 7 S 100 4, 117 7"
                  fill="none"
                  stroke="#0b1f3a"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h2>

          <div className="mt-9 max-w-xl space-y-5 text-base leading-relaxed text-black/60 md:text-lg">
            <p data-settle>
              I&rsquo;m a twenty-year-old Italian who fell in love with
              building things — first drones and 3D printers, then companies.
              I studied in Miami, graduated early, and now my days run between
              a very big company and my own quiet projects.
            </p>
            <p data-settle>
              Away from screens I meditate, shoot photographs, and travel on a
              one-way curiosity. Most of what I believe about work comes from
              people who treat building as a way of thinking — and from paying
              attention to dreams, which sounds strange until you try it.
            </p>
            <p data-settle className="font-serif text-xl italic text-black/45 md:text-2xl">
              This site is me figuring things out in public. If something here
              resonates, I&rsquo;d genuinely like to hear from you. Or just walk
              alongside for a while — you can find me on{" "}
              <a
                href="/ig/about"
                onClick={() => track("follow_click", { network: "instagram", placement: "about" })}
                className="underline decoration-black/20 underline-offset-4 transition-colors hover:text-cyan-900"
              >
                Instagram
              </a>
              , and on{" "}
              <a
                href="https://www.linkedin.com/in/tobia-donadon"
                target="_blank"
                rel="me noreferrer"
                onClick={() => track("follow_click", { network: "linkedin", placement: "about" })}
                className="underline decoration-black/20 underline-offset-4 transition-colors hover:text-cyan-900"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>

          <div data-settle className="mt-9 flex items-end justify-between">
            <a
              href="mailto:tobia@donadon.com?subject=Hi%20Tobia"
              onClick={() => track("write_me", { origin: "about" })}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45 underline decoration-black/20 underline-offset-4 transition-colors hover:text-cyan-900 hover:decoration-cyan-900/40"
            >
              Write me
            </a>
            <span className="font-serif text-3xl italic text-black/55">— Tobia</span>
          </div>
        </div>

        {/* ---- The portrait + the facts ---- */}
        <div className="flex flex-col justify-center gap-7">
          <figure data-settle>
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border"
              style={{ borderColor: "rgba(30,26,14,0.08)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- his own photo, sea-toned */}
              <img
                src="/trail/trail-08.jpg"
                alt="Tobia, somewhere on the road"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "saturate(0.82) contrast(0.97)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "rgba(11,31,58,0.08)", mixBlendMode: "multiply" }}
              />
            </div>
            <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-black/30">
              somewhere on the road · 2026
            </figcaption>
          </figure>

          <dl data-settle className="space-y-2.5 border-t border-black/10 pt-6">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/35">
                  {k}
                </dt>
                <dd className="text-right font-serif text-lg text-black/65">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
