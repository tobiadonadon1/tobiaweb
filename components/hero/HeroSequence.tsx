"use client";

import { useEffect, useRef, useState } from "react";
import TypingEffect from "@/components/ui/typing-effect";
import { ImageTrail } from "@/components/ui/image-trail";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { ButtonColorful } from "@/components/ui/button-colorful";

/**
 * Tobia's own photos, trailing the pointer on the intro loader.
 * Originals live in assets/trail-originals/; these are web-optimized copies.
 */
const TRAIL_IMAGES = [
  "/trail/trail-01.jpg",
  "/trail/trail-02.jpg",
  "/trail/trail-03.jpg",
  "/trail/trail-04.jpg",
  "/trail/trail-05.jpg",
  "/trail/trail-06.jpg",
  "/trail/trail-07.jpg",
  "/trail/trail-08.jpg",
];

const NAME = "Tobia Donadon";
const TYPING_SPEED = 95; // base ms per character (humanized: varies per key)
const HOLD_MS = 1000; // breath on the finished name before the cancel
const EXIT_MS = 380; // the fast cancel into the hero

type Phase = "typing" | "typed" | "exiting" | "done";

export default function HeroSequence() {
  const [phase, setPhase] = useState<Phase>("typing");
  // Hover state lifted from the CTA so the mountains beneath it light up.
  const [ctaHover, setCtaHover] = useState(false);
  // 0→1 tint level the hills shader reads every frame: on CTA hover the
  // ridge LINES slightly lean blue (no overlay wash — the mountains
  // themselves tint). Eased here so it breathes in/out over ~0.6s.
  const hillsTintRef = useRef(0);

  useEffect(() => {
    const target = ctaHover ? 1 : 0;
    let raf = 0;
    const step = () => {
      const cur = hillsTintRef.current;
      const next = cur + (target - cur) * 0.09;
      hillsTintRef.current = Math.abs(target - next) < 0.005 ? target : next;
      if (hillsTintRef.current !== target) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ctaHover]);

  useEffect(() => {
    // The loader owns the screen: pin to top and lock scroll while it plays.
    window.scrollTo(0, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Phase chain driven by the typing actually finishing (not a stopwatch,
  // since humanized typing has a variable duration).
  useEffect(() => {
    if (phase === "typed") {
      const t = setTimeout(() => setPhase("exiting"), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "exiting") {
      const t = setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("intro:done"));
      }, EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const heroRevealed = phase === "exiting" || phase === "done";

  return (
    <section className="paper-bg relative h-screen w-full overflow-hidden">
      {/* The flowing monochrome mountains — pre-warmed behind the loader.
          On CTA hover the shader slightly tints the central ridge lines blue
          (hillsTintRef) — the mountains themselves colour, no overlay wash. */}
      <div className="absolute inset-0 z-0">
        <GLSLHills
          lineColor="#8b9199"
          opacity={2.0}
          speed={0.32}
          segments={150}
          tintRef={hillsTintRef}
          tintColor="#38bdf8"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 42%, rgba(250,248,242,0) 38%, rgba(250,248,242,0.92) 100%)",
          }}
        />
      </div>

      {/* Headline — rises in as the loader cancels. */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ease-out ${
          heroRevealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-[#0a0a0a] md:text-7xl">
          I&rsquo;m figuring this out.
          <br />
          <span className="font-light italic">
            Maybe we can figure it out together.
          </span>
        </h1>
        <p className="mt-7 max-w-md text-sm leading-relaxed text-black/55 md:text-base">
          I build with technology, and I write about the inner world —
          consciousness, presence, the power we have within. I&rsquo;m 20, and
          the place I actually live is where those two meet. This is the
          notebook I keep in public.
        </p>
        <div className="pointer-events-auto relative mt-8">
          {/* Hovering the CTA slightly tints the mountain lines below it blue
              (the shader's tintRef, driven by ctaHover). */}
          <ButtonColorful
            label="See what I'm building"
            onHoverChange={setCtaHover}
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </div>

      {/* The loader — white sheet, the name typing itself out, and images
          trailing the pointer. Cancels fast, then unmounts. */}
      {phase !== "done" && (
        <div
          className={`paper-bg absolute inset-0 z-40 transition-opacity ease-out ${
            phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${EXIT_MS}ms` }}
        >
          <ImageTrail images={TRAIL_IMAGES} spawnDistance={150} />
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            {/* Solid black editorial serif — trail images pass behind it. */}
            <TypingEffect
              texts={[NAME]}
              typingSpeed={TYPING_SPEED}
              humanize
              onComplete={() => setPhase((p) => (p === "typing" ? "typed" : p))}
              rotationInterval={99999}
              className="font-serif text-5xl font-normal tracking-tight text-[#0a0a0a] md:text-7xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
