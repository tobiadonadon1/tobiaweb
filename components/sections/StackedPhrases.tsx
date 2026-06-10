"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The three phrases. Placeholder copy — rewrite freely.
const phrases = [
  {
    id: 1,
    eyebrow: "01",
    title: "I turn attention into revenue.",
    description: "Brand, offer, and story — engineered to convert, not just to look good.",
  },
  {
    id: 2,
    eyebrow: "02",
    title: "Design is the unfair advantage.",
    description: "Work so considered it does the selling for you, before a word is said.",
  },
  {
    id: 3,
    eyebrow: "03",
    title: "Learn it, read it, or hire it.",
    description: "Info products, a book, and an agency — three doors, one obsession.",
  },
];

// Off-white "coloured glass". Tweak when Tobia passes the exact tone.
const GLASS_BG =
  "linear-gradient(145deg, rgba(252,251,248,0.78), rgba(247,246,242,0.58))";

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

  return (
    <div
      ref={containerRef}
      className="flex h-screen items-center justify-center"
      style={{ position: "sticky", top: 0 }}
    >
      <div
        ref={cardRef}
        className="relative w-[86%] max-w-4xl md:w-[70%]"
        style={{
          height: "440px",
          borderRadius: "28px",
          top: `calc(-5vh + ${index * 26}px)`,
          transformOrigin: "top",
        }}
      >
        <div
          className="relative flex h-full w-full flex-col justify-center overflow-hidden px-10 md:px-16"
          style={{
            borderRadius: "28px",
            background: GLASS_BG,
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow:
              "0 24px 70px rgba(20,20,25,0.12), 0 4px 14px rgba(20,20,25,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {/* Soft glass sheen along the top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 45%, transparent 100%)",
              borderRadius: "28px 28px 0 0",
            }}
          />

          <span className="relative z-10 mb-6 font-mono text-xs tracking-[0.4em] text-black/40">
            {eyebrow}
          </span>
          <h3 className="relative z-10 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-[#0a0a0a] md:text-6xl">
            {title}
          </h3>
          <p className="relative z-10 mt-6 max-w-md text-base leading-relaxed text-black/55 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export function StackedPhrases() {
  return (
    <section id="phrases" className="w-full bg-white">
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
    </section>
  );
}
