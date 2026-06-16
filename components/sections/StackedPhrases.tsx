"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Tobia's three identity messages — one per card, verbatim.
const phrases = [
  {
    id: 1,
    eyebrow: "01",
    title: "Who Am I",
    description:
      "I aim to build technologies and write ideas that connect AI and consciousness, where design meets depth and innovation serves growth. Through my work, I explore how intelligence can guide us to create with purpose and awareness.",
  },
  {
    id: 2,
    eyebrow: "02",
    title: "Where am I going",
    description:
      "I'll keep building, writing, and learning. I'm driven to shape a world where innovation feels human and awareness leads progress. My path is about creating with purpose, growing through experience, and letting what I learn compound into everything I build.",
  },
  {
    id: 3,
    eyebrow: "03",
    title: "Why I create",
    description:
      "I create to understand. To turn complexity into clarity. To build systems, stories, and experiences that remind us what we're capable of when intelligence meets intention.",
  },
];

// Off-white "coloured glass" on the paper background.
const GLASS_BG =
  "linear-gradient(145deg, rgba(253,252,249,0.82), rgba(247,245,239,0.6))";

const MAX_TILT_DEG = 10;

// Aurora intensity dials (group opacity over the blobs' own gradients).
// The blobs run deep ocean-blue/steel-navy — raising their group opacity is
// how the INK arrives inside the glass (the plasma carries more navy weight),
// without touching the shared .aurora gradients. Still clearly translucent.
const AURORA_REST = "0.42"; // ambient — ink present, never heavy
const AURORA_HOVER = "0.56"; // hover — the plasma comes alive, deeper navy

// Real shade: clearly visible at rest, deepens when the card lifts on hover.
// The long cast shadow now leans toward the navy ink (not neutral warm-grey)
// so each card pools a little of the arriving depth onto the ground beneath.
const REST_SHADOW =
  "0 30px 70px rgba(11,31,58,0.2), 0 10px 22px rgba(28,24,14,0.1), inset 0 1px 0 rgba(255,255,255,0.7)";
const HOVER_SHADOW =
  "0 48px 110px rgba(11,31,58,0.32), 0 14px 30px rgba(28,24,14,0.15), inset 0 1px 0 rgba(255,255,255,0.78)";

interface PhraseCardProps {
  eyebrow: string;
  title: string;
  description: string;
  index: number;
  totalCards: number;
}

const PhraseCard: React.FC<PhraseCardProps> = ({
  eyebrow,
  title,
  description,
  index,
  totalCards,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const targetScale = 1 - (totalCards - index) * 0.05;
    gsap.set(card, { scale: 1, transformOrigin: "center top" });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress);
        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: "center top",
        });
      },
    });

    return () => st.kill();
  }, [index, totalCards]);

  // Glassmorphism hover: the card leans toward the cursor (±10°) while a
  // glare on the glass follows the mouse (via --mouse-x / --mouse-y).
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = x / r.width - 0.5;
    const py = y / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(
      px * MAX_TILT_DEG
    ).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mouse-x", `${x.toFixed(0)}px`);
    el.style.setProperty("--mouse-y", `${y.toFixed(0)}px`);
    // Belt-and-braces: any movement lights the glare (enter can be missed)
    // and intensifies the drifting aurora (opacity only — drift never stops).
    if (glareRef.current) glareRef.current.style.opacity = "1";
    if (tailRef.current) tailRef.current.style.opacity = AURORA_HOVER;
  };

  const handleEnter = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = "transform 120ms ease-out, box-shadow 350ms ease";
    el.style.boxShadow = HOVER_SHADOW;
    if (glareRef.current) glareRef.current.style.opacity = "1";
    // Aurora brightens (opacity) and gently swells (--ah scale); the
    // continuous drift is untouched, so hover reads as the plasma coming alive.
    if (tailRef.current) {
      tailRef.current.style.opacity = AURORA_HOVER;
      tailRef.current.style.setProperty("--ah", "1.08");
    }
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = "transform 450ms ease, box-shadow 450ms ease";
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = REST_SHADOW;
    if (glareRef.current) glareRef.current.style.opacity = "0";
    if (tailRef.current) {
      tailRef.current.style.opacity = AURORA_REST; // calm ambient rest level
      tailRef.current.style.setProperty("--ah", "1");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-screen items-center justify-center"
      style={{ position: "sticky", top: 0 }}
    >
      <div
        ref={cardRef}
        className="relative w-[88%] max-w-4xl md:w-[72%]"
        style={{
          top: `calc(-5vh + ${index * 26}px)`,
          transformOrigin: "top",
          perspective: "1100px",
        }}
      >
        <div
          ref={tiltRef}
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="relative flex h-[460px] w-full flex-col justify-between overflow-hidden px-10 py-12 md:px-16 md:py-14"
          style={{
            borderRadius: "28px",
            background: GLASS_BG,
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid rgba(11,31,58,0.1)",
            boxShadow: REST_SHADOW,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Soft glass sheen along the top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 45%, transparent 100%)",
              borderRadius: "28px 28px 0 0",
            }}
          />

          {/* Dynamic glare that follows the cursor across the glass —
              tinted toward the CTA's cyan family */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{
              opacity: 0,
              transition: "opacity 300ms ease",
              background:
                "radial-gradient(560px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(216,234,242,0.4), transparent 42%)",
              borderRadius: "28px",
            }}
          />

          {/* Drifting aurora: soft blue/cyan plasma blobs that wander
              continuously behind the glass, clipped to the rounded card and
              sitting BEHIND the text (z-10) / glare (z-[5]) / sheen. The blobs
              screen-blend among themselves (isolated) into a lava-lamp plasma.
              The existing hover handlers intensify it via opacity + a gentle
              --ah swell; the drift itself never stops. */}
          <div
            ref={tailRef}
            data-aurora
            className="aurora z-[1]"
            style={{ opacity: Number(AURORA_REST) }}
          >
            <span className="aurora__blob aurora__blob--a" />
            <span className="aurora__blob aurora__blob--b" />
            <span className="aurora__blob aurora__blob--c" />
            <span className="aurora__blob aurora__blob--d" />
          </div>

          {/* Top row: number + rule */}
          <div className="relative z-10 flex items-center gap-5">
            <span className="font-mono text-xs tracking-[0.4em] text-black/40">
              {eyebrow}
            </span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          {/* The message */}
          <div className="relative z-10">
            <h3 className="font-serif text-4xl leading-[1.05] tracking-tight text-[#0a0a0a] md:text-6xl">
              {title}
            </h3>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/60 md:text-lg">
              {description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export function StackedPhrases() {
  return (
    <section id="phrases" className="relative w-full bg-background">
      {/* Ink ARRIVES in the ground: a single-hue navy pool eased over a long
          multi-stop alpha ramp (banding lesson) blooms behind the sticky
          stack and fades to transparent paper at every edge (waterline
          lesson — no visible seam to the neighbours). Paper stays dominant;
          the depth gathers only where the cards live. Achieved here in the
          component, not in the shared .aurora gradients. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 50%, rgba(11,31,58,0.12) 0%, rgba(11,31,58,0.085) 28%, rgba(11,31,58,0.045) 52%, rgba(11,31,58,0.018) 74%, rgba(11,31,58,0) 100%)",
        }}
      />
      <div className="relative z-10">
        {phrases.map((p, index) => (
          <PhraseCard
            key={p.id}
            eyebrow={p.eyebrow}
            title={p.title}
            description={p.description}
            index={index}
            totalCards={phrases.length}
          />
        ))}
      </div>
    </section>
  );
}
