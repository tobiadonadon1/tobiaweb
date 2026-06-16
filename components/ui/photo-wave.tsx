"use client";

import { useRef, useCallback } from "react";
import { motion, useSpring } from "motion/react";

// Adapted from a 21st.dev 3D cursor-wave gallery — the MECHANIC kept, the
// rainbow neon stripped for Ink & Paper: his sea-toned photos, ink hairlines,
// soft shadows, on warm paper. Capped + his own optimized images for perf.
const PANEL_COUNT = 14;
const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const Z_SPREAD = 38;
const SIGMA = 2.8;

const PANEL_IMAGES = [
  "/trail/trail-01.jpg",
  "/trail/trail-02.jpg",
  "/trail/trail-03.jpg",
  "/trail/trail-04.jpg",
  "/trail/trail-05.jpg",
  "/trail/trail-06.jpg",
  "/trail/trail-07.jpg",
  "/trail/trail-08.jpg",
];

function Panel({
  index,
  total,
  waveY,
  scaleY,
}: {
  index: number;
  total: number;
  waveY: ReturnType<typeof useSpring>;
  scaleY: ReturnType<typeof useSpring>;
}) {
  const t = index / (total - 1);
  const baseZ = (index - (total - 1)) * Z_SPREAD;
  const w = 200 + t * 80;
  const h = 280 + t * 120;
  const opacity = 0.4 + t * 0.6;
  const imageUrl = PANEL_IMAGES[index % PANEL_IMAGES.length];

  return (
    <motion.div
      className="absolute overflow-hidden rounded-xl pointer-events-none"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        translateZ: baseZ,
        y: waveY,
        scaleY,
        transformOrigin: "bottom center",
        opacity,
        boxShadow: `0 ${18 + t * 22}px ${36 + t * 30}px rgba(11,31,58,${0.1 + t * 0.14})`,
      }}
    >
      {/* His photo, sea-toned */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.82) contrast(0.97)",
        }}
      />
      {/* Navy unifier (replaces the rainbow) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(11,31,58,0.12)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Soft depth vignette toward the foot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(11,31,58,0) 45%, rgba(11,31,58,0.28) 100%)",
        }}
      />
      {/* Ink hairline + a whisper of top sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `1px solid rgba(11,31,58,${0.08 + t * 0.14})`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
          boxSizing: "border-box",
        }}
      />
    </motion.div>
  );
}

export default function PhotoWave() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Constant count → hooks-in-loop is stable.
  const waveYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(0, WAVE_SPRING)
  );
  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(1, WAVE_SPRING)
  );
  const rotY = useSpring(-40, SCENE_SPRING);
  const rotX = useSpring(16, SCENE_SPRING);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      rotY.set(-40 + (cx - 0.5) * 14);
      rotX.set(16 + (cy - 0.5) * -10);
      const cursorCardPos = cx * (PANEL_COUNT - 1);
      waveYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(-influence * 64);
      });
      scaleYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(0.5 + influence * 0.5);
      });
    },
    [rotY, rotX, waveYSprings, scaleYSprings]
  );

  const handleMouseLeave = useCallback(() => {
    rotY.set(-40);
    rotX.set(16);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full w-full select-none items-center justify-center"
      style={{ perspective: "900px" }}
    >
      <motion.div
        style={{
          rotateY: rotY,
          rotateX: rotX,
          transformStyle: "preserve-3d",
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <Panel
            key={i}
            index={i}
            total={PANEL_COUNT}
            waveY={waveYSprings[i]}
            scaleY={scaleYSprings[i]}
          />
        ))}
      </motion.div>
    </div>
  );
}
