"use client";

import { useEffect, useRef } from "react";

interface EmberFieldProps {
  /**
   * Live scroll progress of the tide stage (0→1), read every frame —
   * same pattern as glsl-hills' tintRef. The net fades in with the ink
   * and stays alive through the crest (the navy block scrolls away
   * carrying it — no fade-out at the top end).
   */
  progressRef: { current: number };
  className?: string;
}

interface Mote {
  x: number; // px
  y: number; // px
  vx: number; // px/s
  vy: number; // px/s
  r: number;
  color: string;
  baseAlpha: number;
}

const COLORS = [
  "56,189,248", // sky
  "103,232,249", // cyan
  "45,212,191", // teal
];

const COUNT = 46;
const LINK_DIST = 130; // px — pairs closer than this get a connecting line
const SPEED_MIN = 8; // px/s
const SPEED_MAX = 20;

/**
 * A living net in the ink: a few dozen slow-drifting nodes with hairline
 * connections forming and breaking between neighbours — a constellation
 * breathing inside the navy, not bubbles rising. 2D canvas, `lighter`
 * compositing (it only really surfaces against the deep blue), imperative
 * (no React re-renders). Honors reduced motion by rendering nothing.
 */
export function EmberField({ progressRef, className }: EmberFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): Mote => {
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      const dir = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * (w || 1440),
        y: Math.random() * (h || 900),
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        r: 1 + Math.random() * 0.8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        baseAlpha: 0.3 + Math.random() * 0.25,
      };
    };
    const motes: Mote[] = Array.from({ length: COUNT }, spawn);

    let raf = 0;
    let last = performance.now();
    let cleared = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Ramp in as the ink deepens (p≈0.45→0.75), then HOLD — the net
      // rides the navy block out of the viewport instead of dying first.
      const p = progressRef.current;
      const t = Math.min(Math.max((p - 0.45) / 0.3, 0), 1);
      const intensity = t * t * (3 - 2 * t); // smoothstep

      if (intensity <= 0.02) {
        if (!cleared) {
          ctx.clearRect(0, 0, w, h);
          cleared = true;
        }
        return;
      }
      cleared = false;

      // Drift: slow wander — tiny random steering, wrapped edges.
      const m = 24; // wrap margin so nodes glide off one side onto the other
      for (const mote of motes) {
        mote.vx += (Math.random() - 0.5) * 6 * dt;
        mote.vy += (Math.random() - 0.5) * 6 * dt;
        const sp = Math.hypot(mote.vx, mote.vy);
        if (sp > SPEED_MAX) {
          mote.vx = (mote.vx / sp) * SPEED_MAX;
          mote.vy = (mote.vy / sp) * SPEED_MAX;
        }
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        if (mote.x < -m) mote.x = w + m;
        if (mote.x > w + m) mote.x = -m;
        if (mote.y < -m) mote.y = h + m;
        if (mote.y > h + m) mote.y = -m;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // The net: hairline links between near neighbours, stronger when closer.
      ctx.lineWidth = 1;
      for (let i = 0; i < motes.length; i++) {
        for (let j = i + 1; j < motes.length; j++) {
          const a = motes[i];
          const b = motes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d >= LINK_DIST) continue;
          const la = 0.26 * (1 - d / LINK_DIST) * intensity;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(103,232,249,${la.toFixed(3)})`;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // The nodes.
      for (const mote of motes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${mote.color},${(mote.baseAlpha * intensity).toFixed(3)})`;
        ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
