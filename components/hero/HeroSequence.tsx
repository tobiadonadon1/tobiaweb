"use client";

import { useEffect, useRef, useState } from "react";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { GLSLHills } from "@/components/ui/glsl-hills";

/**
 * Placeholder imagery for the loader gallery.
 * Swap these for Tobia's own photography later.
 */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1754769440490-2eb64d715775?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1758640920659-0bb864175983?w=1200&auto=format&fit=crop&q=70",
  "https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1725878746053-407492aa4034?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=1200&auto=format&fit=crop&q=70",
];

// Duration of the loader before the hero is revealed.
const INTRO_MS = 3000;
// Mountain colouring, timed from when the hero lands.
const COLOR_HOLD_MS = 1000; // stay monochrome this long after landing
const COLOR_RAMP_MS = 2000; // then colour in (fully coloured ~3s after landing)

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function HeroSequence() {
  const hillsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  // Live 0→1 blend the hills shader reads each frame (monochrome → pastel).
  const colorMixRef = useRef(0);
  // Once the loader finishes we unmount the gallery to free its WebGL context.
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    // The loader owns the screen: pin to top and lock scroll while it plays.
    window.scrollTo(0, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    let startTs: number | null = null;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = prevOverflow;
      setIntroDone(true);
      window.dispatchEvent(new CustomEvent("intro:done"));
    };

    const apply = (now: number) => {
      if (startTs === null) startTs = now;
      const p = clamp01((now - startTs) / INTRO_MS);

      // Gallery (the loader): holds, then dissolves near the end.
      if (galleryRef.current) {
        galleryRef.current.style.opacity = `${1 - seg(p, 0.6, 0.86)}`;
      }
      // Hills hero: blooms in behind the gallery as it dissolves.
      if (hillsRef.current) {
        hillsRef.current.style.opacity = `${smooth(seg(p, 0.58, 0.92))}`;
      }
      // Headline: rises in once the hero has arrived.
      if (textRef.current) {
        const t = smooth(seg(p, 0.78, 1));
        textRef.current.style.opacity = `${t}`;
        textRef.current.style.transform = `translateY(${lerp(26, 0, t)}px)`;
      }

      if (p < 1) {
        raf = requestAnimationFrame(apply);
      } else {
        finish();
      }
    };

    raf = requestAnimationFrame(apply);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // After the hero lands, hold briefly, then colour the mountains in.
  useEffect(() => {
    if (!introDone) return;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const t = now - startTs;
      colorMixRef.current = smooth(clamp01((t - COLOR_HOLD_MS) / COLOR_RAMP_MS));
      if (t < COLOR_HOLD_MS + COLOR_RAMP_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [introDone]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Hero hills — initial opacity via class so the unmount re-render
          doesn't fight the opacity we drive imperatively. */}
      <div ref={hillsRef} className="absolute inset-0 z-0 opacity-0">
        <GLSLHills
          lineColor="#8b9199"
          opacity={2.0}
          speed={0.32}
          segments={150}
          colorMixRef={colorMixRef}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 42%, rgba(255,255,255,0) 38%, rgba(255,255,255,0.92) 100%)",
          }}
        />
      </div>

      {/* Headline */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <span className="mb-7 font-mono text-[11px] uppercase tracking-[0.45em] text-black/45">
          Tobia Donadon
        </span>
        <h1 className="font-serif text-6xl leading-[0.95] tracking-tight text-[#0a0a0a] md:text-8xl">
          <span className="font-light italic">Selling,</span>
          <br />
          by design.
        </h1>
        <span className="mt-8 font-mono text-[11px] uppercase tracking-[0.35em] text-black/40">
          Info products · A book · An agency
        </span>
      </div>

      {/* The loader gallery — scattered images rushing toward the viewer.
          Unmounts once the intro completes. */}
      {!introDone && (
        <div ref={galleryRef} className="absolute inset-0 z-10 opacity-100">
          <InfiniteGallery
            images={HERO_IMAGES}
            interactive={false}
            visibleCount={16}
            spread={1.25}
            autoSpeed={16}
            fadeSettings={{
              fadeIn: { start: 0.0, end: 0.08 },
              fadeOut: { start: 0.86, end: 0.99 },
            }}
            blurSettings={{
              blurIn: { start: 0.0, end: 0.05 },
              blurOut: { start: 0.94, end: 1.0 },
              maxBlur: 2.0,
            }}
            className="h-screen w-full"
          />
        </div>
      )}
    </section>
  );
}
