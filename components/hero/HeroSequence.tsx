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
  // Pointer-following tint: a SECOND band the shader centres on the cursor.
  // cursorXRef is the live pointer-X (0→1, left→right); cursorActiveRef is
  // its eased 0→1 strength — both READ PER-FRAME by the shader (NOT in any
  // effect deps, mirroring hillsTintRef). cursorTargetRef is the easing goal.
  const cursorXRef = useRef(0.5);
  const cursorActiveRef = useRef(0);
  const cursorTargetRef = useRef(0); // 0 = rest, 1 = pointer over the ridge

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

  // Cursor-follow tint: track the pointer over the hero and ease a glow band
  // toward it. DISABLED under prefers-reduced-motion (freeze, no travelling
  // light). The ~0.09/frame lerp gives the ~0.6s breathe-in / decay-on-leave.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      cursorXRef.current = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
      cursorTargetRef.current = 1;
    };
    const onLeave = () => {
      cursorTargetRef.current = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    window.addEventListener("blur", onLeave);

    // A persistent rAF eases cursorActiveRef toward its target every frame.
    let raf = 0;
    const ease = () => {
      const cur = cursorActiveRef.current;
      const t = cursorTargetRef.current;
      cursorActiveRef.current = cur + (t - cur) * 0.09;
      raf = requestAnimationFrame(ease);
    };
    raf = requestAnimationFrame(ease);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

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
          (hillsTintRef); a second band (cursorXRef/cursorActiveRef) FOLLOWS
          the pointer across the ridge — the mountains themselves colour, no
          overlay wash. lineColor deepened to a cooler slate so the ridges
          carry tonal weight AT REST, not only on hover. */}
      <div className="absolute inset-0 z-0">
        <GLSLHills
          lineColor="#6b7480"
          opacity={2.0}
          speed={0.32}
          segments={150}
          tintRef={hillsTintRef}
          cursorXRef={cursorXRef}
          cursorActiveRef={cursorActiveRef}
          tintColor="#38bdf8"
        />

        {/* Paper vignette — keeps the centre clean behind the headline.
            Raised the clear radius so the brought-up ridges still read. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, rgba(250,248,242,0) 42%, rgba(250,248,242,0.9) 100%)",
          }}
        />

        {/* Standing weight: a low ink gradient anchored at the bottom third,
            BEHIND the text. Grounds the headline + CTA so they stop floating
            in white. Paper stays dominant — this is depth at the base, not a
            dark hero (top ~62% untouched, peaks at a soft deep-navy ~0.22). */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              "linear-gradient(to top, rgba(11,31,58,0.22) 0%, rgba(11,31,58,0.1) 38%, rgba(11,31,58,0) 100%)",
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
          I build tools, write about consciousness, and help people launch
          things. I&rsquo;m 20, and I think about the future a lot. This is
          where I share what I&rsquo;m working on.
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
