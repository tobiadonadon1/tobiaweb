"use client";

import { useEffect, useRef } from "react";

/**
 * THE WAVE.
 *
 * What was here before: twelve blurred orange circles drifting on CSS
 * keyframes. Tobia's note killed it: "the energy flare, I was thinking more
 * like a wave, like a wave, more dynamic, more fluid, something a bit more
 * pretty, maybe even orange and blue, like the background blue, like navy
 * royal blue, and then this orange flare that is dynamic."
 *
 * So this is one field, not a scatter. Deep royal navy water with a swell
 * moving through it, a brighter blue crest riding the swell, and an orange
 * flare travelling along the underside of that same crest with a hot glint
 * inside it. The blue and the orange share their wave functions, which is the
 * whole trick: the light is IN the water rather than floating over it.
 *
 * It also travels with the reader. Scroll progress does two things: it slides
 * the ribbons up, each by its own `par` so the near water moves further than
 * the deep, and it moves every ribbon's gain from its `gain[0]` to its
 * `gain[1]`, so the top of the page is cold deep water and the ask at the
 * bottom is the warmest moment on it. One continuous journey instead of three
 * separate light rigs.
 *
 * The brightness is capped, and not by eye: paper type sits on this at every
 * scroll position, so the peak of every ribbon is set where the rendered page
 * still clears WCAG AA under each piece of type. Measured off screenshots of
 * the real page, at five scroll positions, sampled across a full sweep of the
 * flare, at 1440x900 and 390x844.
 *
 * HOW IT STAYS CHEAP
 *   - The field is evaluated per pixel, but into a buffer of about 14,000
 *     pixels total (roughly 150x93 on a laptop, 80x175 on a phone) which the
 *     browser then upscales for free on the GPU. A small `blur()` sized to
 *     about one buffer pixel smooths the interpolation seams. Full-resolution
 *     per-pixel work on the main thread is exactly what this avoids.
 *   - The per-column part of the maths (where each ribbon is, and how bright
 *     it is at that column) is hoisted out of the pixel loop, so the inner
 *     loop is arithmetic on two flat Float32Arrays and no trig at all.
 *   - One rAF for the whole page, throttled to about 40fps. The motion is slow
 *     liquid; the extra frames buy nothing and cost real battery.
 *   - An IntersectionObserver stops it when the field is off screen, and a
 *     visibilitychange listener stops it when the tab is hidden. The clock is
 *     an accumulator, so a resumed field carries on rather than jumping.
 *   - Under prefers-reduced-motion nothing is scheduled at all: one frame is
 *     drawn, in full colour, and that is the page.
 *
 * Nothing here animates a layout property. The canvas never moves; only its
 * contents change.
 */

const TAU = Math.PI * 2;

/** Total pixels in the offscreen buffer, whatever the aspect ratio. */
const BUDGET = 14000;
const MIN_DIM = 48;
/** Throttle. 24ms lands at about 40fps. */
const STEP = 24;
/** How far the field slides up over a full page of scroll, in screens, before
 *  each ribbon's own `par` scales it. */
const DRIFT = 0.26;
/** The frame drawn when the reader has asked for no motion. */
const STILL = { t: 11.5, p: 0.45 };

type Wave = readonly [k: number, amp: number, speed: number, phase: number];

interface Ribbon {
  /** Resting centre, in screen heights from the top of the viewport. */
  y: number;
  /** Half-thickness, in screen heights. */
  th: number;
  /** Slow vertical drift of the whole ribbon: amplitude, rad/s, phase. */
  drift: readonly [number, number, number];
  /** Thickness breathing: fraction, rad/s, phase. */
  breathe: readonly [number, number, number];
  /** Horizontal undulation, summed. Ribbons that share a set move as one. */
  waves: readonly Wave[];
  /**
   * The light this ribbon carries, per channel at gain 1. A channel may be
   * NEGATIVE: the orange ribbons take blue OUT of the water they cross, which
   * is the only way an orange light laid over a blue one reads as orange
   * rather than as pink. Additive-only, the first pass went mauve.
   */
  rgb: readonly [number, number, number];
  /** Gain at the top of the page, and at the bottom. */
  gain: readonly [number, number];
  /** How much of the scroll slide this ribbon takes. Deep water moves least. */
  par?: number;
  /** A window travelling along x. Without one the ribbon spans the screen. */
  env?: {
    /** Half-width of the window, in screen widths. */
    w: number;
    /** How far the centre sweeps either side of the middle. */
    travel: number;
    speed: number;
    phase: number;
    /** What is left of the ribbon outside the window. */
    floor: number;
  };
}

/** The main swell. Everything that rides it shares this set exactly. */
const SWELL: readonly Wave[] = [
  [0.85, 0.12, 0.27, 1.7],
  [1.9, 0.048, -0.38, 0.25],
  [3.4, 0.019, 0.53, 4.0],
];
/** The slow water underneath. */
const UNDER: readonly Wave[] = [
  [0.6, 0.09, -0.19, 3.1],
  [1.5, 0.038, 0.31, 0.9],
];
/** The thinner water up top. */
const OVER: readonly Wave[] = [
  [1.2, 0.07, 0.23, 2.4],
  [2.6, 0.028, -0.41, 5.1],
];

const SWELL_DRIFT = [0.05, 0.11, 2.6] as const;
const OVER_DRIFT = [0.05, 0.127, 0.7] as const;

/**
 * The field, back to front.
 *
 * The swell, its crest, the orange flare and the glint inside it all share
 * SWELL and SWELL_DRIFT, so they are one moving body of water seen at four
 * depths. That is what makes it read as a wave rather than as four things
 * that happen to be near each other.
 *
 * The peak values are deliberately held down. Paper type (#faf8f2) sits on top
 * of this at every scroll position, and the brightest pixel the field is
 * allowed to make still clears 4.5:1 against it. Verified by sampling the
 * rendered page, not by eye.
 */
const RIBBONS: readonly Ribbon[] = [
  // Deep water. Broad, low, and always there: the floor of every screen.
  {
    y: 1.05,
    th: 0.32,
    par: 0.25,
    drift: [0.045, 0.087, 1.1],
    breathe: [0.1, 0.049, 0.4],
    waves: UNDER,
    rgb: [8, 20, 50],
    gain: [0.85, 0.7],
  },
  // THE SWELL. The one big body of blue crossing the screen.
  {
    y: 0.52,
    th: 0.135,
    par: 0.5,
    drift: SWELL_DRIFT,
    breathe: [0.16, 0.067, 1.1],
    waves: SWELL,
    rgb: [22, 54, 126],
    gain: [0.8, 0.55],
  },
  // Its crest: a soft highlight along the swell's upper edge, windowed so it
  // gathers and thins along the length of the wave instead of running edge to
  // edge like a rope. The first pass had no window and read as neon.
  {
    y: 0.462,
    th: 0.048,
    par: 0.5,
    drift: SWELL_DRIFT,
    breathe: [0.2, 0.083, 1.9],
    waves: SWELL,
    rgb: [56, 110, 200],
    gain: [0.32, 0.2],
    env: { w: 0.42, travel: 0.34, speed: 0.09, phase: 1.9, floor: 0.18 },
  },
  // A second, slower band of blue low down, so the water has layers rather
  // than one surface.
  {
    y: 0.88,
    th: 0.14,
    par: 0.35,
    drift: [0.05, 0.071, 4.4],
    breathe: [0.14, 0.057, 2.8],
    waves: UNDER,
    rgb: [14, 36, 92],
    gain: [0.55, 0.4],
  },
  // A faint band high up, on its own slower wave, so the first screen is not
  // empty above the swell.
  {
    y: 0.12,
    th: 0.11,
    par: 1,
    drift: OVER_DRIFT,
    breathe: [0.18, 0.073, 2.2],
    waves: OVER,
    rgb: [11, 30, 76],
    gain: [0.5, 0.3],
  },
  // THE FLARE. It rides the swell (same waves, same drift) but sits in the
  // dark trough BELOW it, where the blue has fallen away. That gap is the
  // whole reason it reads orange instead of mauve, and the negative blue
  // channel finishes the job.
  {
    y: 0.655,
    th: 0.05,
    par: 0.5,
    drift: SWELL_DRIFT,
    breathe: [0.22, 0.097, 0.5],
    waves: SWELL,
    rgb: [255, 88, -100],
    gain: [0.46, 0.56],
    env: { w: 0.3, travel: 0.38, speed: 0.21, phase: 0.6, floor: 0.1 },
  },
  // A wide, slow warmth up top sweeping the other way. It is what keeps the
  // orange from reading as one stripe.
  {
    y: 0.26,
    th: 0.13,
    par: 0.8,
    drift: OVER_DRIFT,
    breathe: [0.2, 0.061, 3.3],
    waves: OVER,
    rgb: [205, 76, -38],
    gain: [0.32, 0.4],
    env: { w: 0.36, travel: 0.46, speed: -0.147, phase: 2.4, floor: 0.14 },
  },
  // The glint: a small hot core inside the flare, on the flare's own sweep.
  {
    y: 0.655,
    th: 0.015,
    par: 0.5,
    drift: SWELL_DRIFT,
    breathe: [0.3, 0.113, 4.1],
    waves: SWELL,
    rgb: [255, 196, 70],
    gain: [0.07, 0.1],
    env: { w: 0.1, travel: 0.38, speed: 0.21, phase: 0.6, floor: 0 },
  },
  // Warmth in the deep, off almost entirely at the top of the page and open
  // by the time the reader reaches the ask. This is the ramp doing the work
  // that three separate light rigs used to do.
  {
    y: 1.06,
    th: 0.26,
    par: 0.25,
    drift: [0.04, 0.067, 5.2],
    breathe: [0.16, 0.053, 1.4],
    waves: UNDER,
    rgb: [155, 54, -46],
    gain: [0.12, 0.28],
    env: { w: 0.5, travel: 0.3, speed: 0.11, phase: 4.2, floor: 0.3 },
  },
];

/** The water itself, before any light: a vertical navy ramp. */
const GROUND: readonly (readonly [number, readonly [number, number, number]])[] =
  [
    [0.0, [4, 9, 19]],
    [0.42, [6, 16, 34]],
    [0.78, [5, 13, 28]],
    [1.0, [3, 8, 18]],
  ];

/** The page ground behind the canvas, and the ground of the <main> itself. */
export const WAVE_GROUND = "#050d1a";

/** A cool fibre over the light. Kills banding on the near-black. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='wv'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='11'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.72 0 0 0 0 0.78 0 0 0 0 0.92 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wv)'/%3E%3C/svg%3E\")";

function groundAt(v: number, out: Float32Array, at: number) {
  let i = 1;
  while (i < GROUND.length - 1 && v > GROUND[i][0]) i++;
  const [a, ca] = GROUND[i - 1];
  const [b, cb] = GROUND[i];
  const t = b === a ? 0 : (v - a) / (b - a);
  out[at] = ca[0] + (cb[0] - ca[0]) * t;
  out[at + 1] = ca[1] + (cb[1] - ca[1]) * t;
  out[at + 2] = ca[2] + (cb[2] - ca[2]) * t;
}

/**
 * The wave, mounted once from the page as the first child of `<main>`.
 *
 * It spans the whole document and sticks to the viewport, so the field is
 * always exactly one screen tall no matter how long the page gets. Everything
 * meant to be read goes above it on `relative z-10`.
 */
export function WaveField() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = host.current;
    const cv = canvas.current;
    if (!box || !cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const N = RIBBONS.length;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let bw = 0;
    let bh = 0;
    let img: ImageData | null = null;
    let ground = new Float32Array(0);
    let yA = new Float32Array(0);
    let gA = new Float32Array(0);
    const invTh = new Float32Array(N);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      col[i * 3] = RIBBONS[i].rgb[0];
      col[i * 3 + 1] = RIBBONS[i].rgb[1];
      col[i * 3 + 2] = RIBBONS[i].rgb[2];
    }

    let span = 1;
    let spanAt = 0;
    let raf = 0;
    let prev = 0;
    let clock = 0;
    let seen = true;

    const measure = () => {
      span = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      spanAt = performance.now();
    };

    const size = () => {
      const w = box.clientWidth || 1;
      const h = box.clientHeight || 1;
      const nw = Math.max(MIN_DIM, Math.round(Math.sqrt((BUDGET * w) / h)));
      const nh = Math.max(MIN_DIM, Math.round(BUDGET / nw));
      if (nw !== bw || nh !== bh) {
        bw = nw;
        bh = nh;
        cv.width = bw;
        cv.height = bh;
        img = ctx.createImageData(bw, bh);
        const d = img.data;
        for (let i = 3; i < d.length; i += 4) d[i] = 255;
        ground = new Float32Array(bh * 3);
        for (let y = 0; y < bh; y++) groundAt((y + 0.5) / bh, ground, y * 3);
        yA = new Float32Array(N * bw);
        gA = new Float32Array(N * bw);
      }
      // Sized to about one buffer pixel: enough to melt the upscale seams,
      // not enough to blur the wave itself away.
      const blur = Math.min(26, Math.max(7, (w / bw) * 1.25));
      cv.style.filter = `blur(${blur.toFixed(1)}px)`;
      measure();
    };

    const draw = (t: number, p: number) => {
      if (!img) return;
      const slide = -p * DRIFT;

      for (let i = 0; i < N; i++) {
        const r = RIBBONS[i];
        const centre =
          r.y +
          r.drift[0] * Math.sin(r.drift[1] * t + r.drift[2]) +
          slide * (r.par ?? 1);
        const th = r.th * (1 + r.breathe[0] * Math.sin(r.breathe[1] * t + r.breathe[2]));
        invTh[i] = 1 / th;
        const gain = r.gain[0] + (r.gain[1] - r.gain[0]) * p;
        const e = r.env;
        const cx = e ? 0.5 + e.travel * Math.sin(e.speed * t + e.phase) : 0;
        const inv = e ? 1 / e.w : 0;
        const floor = e ? e.floor : 0;
        const rest = 1 - floor;
        const ws = r.waves;
        const n = ws.length;
        const off = i * bw;

        for (let x = 0; x < bw; x++) {
          const u = (x + 0.5) / bw;
          let yy = centre;
          for (let k = 0; k < n; k++) {
            const w = ws[k];
            yy += w[1] * Math.sin(w[0] * u * TAU + w[2] * t + w[3]);
          }
          yA[off + x] = yy;
          if (e) {
            const d = (u - cx) * inv;
            let q = 1 / (1 + d * d);
            q *= q;
            gA[off + x] = gain * (floor + rest * q);
          } else {
            gA[off + x] = gain;
          }
        }
      }

      const data = img.data;
      let o = 0;
      for (let y = 0; y < bh; y++) {
        const v = (y + 0.5) / bh;
        const g0 = ground[y * 3];
        const g1 = ground[y * 3 + 1];
        const g2 = ground[y * 3 + 2];
        for (let x = 0; x < bw; x++) {
          let R = g0;
          let G = g1;
          let B = g2;
          for (let i = 0; i < N; i++) {
            const idx = i * bw + x;
            const d = (v - yA[idx]) * invTh[i];
            let q = 1 / (1 + d * d);
            q *= q;
            const w = q * gA[idx];
            if (w > 0.0015) {
              const c = i * 3;
              R += col[c] * w;
              G += col[c + 1] * w;
              B += col[c + 2] * w;
            }
          }
          // Uint8ClampedArray rounds and clamps for us.
          data[o] = R;
          data[o + 1] = G;
          data[o + 2] = B;
          o += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!prev) prev = now;
      if (now - prev < STEP) return;
      // Capped so a tab that was parked for a minute does not lurch.
      clock += Math.min(0.12, (now - prev) / 1000);
      prev = now;
      if (now - spanAt > 500) measure();
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      draw(clock, p);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      prev = 0;
    };

    const sync = () => {
      if (motion.matches) {
        stop();
        draw(STILL.t, STILL.p);
        return;
      }
      if (seen && !document.hidden) {
        if (!raf) raf = requestAnimationFrame(frame);
      } else {
        stop();
      }
    };

    size();
    draw(motion.matches ? STILL.t : 0, motion.matches ? STILL.p : 0);

    const io = new IntersectionObserver(
      (entries) => {
        seen = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => {
      size();
      if (motion.matches) draw(STILL.t, STILL.p);
    });
    ro.observe(box);

    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        ref={host}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100svh",
          // The still ground under the canvas: what a reader sees for the one
          // frame before the field paints, and if canvas never arrives.
          background: `linear-gradient(to bottom, #04091a 0%, #071429 46%, #050f20 100%)`,
        }}
      >
        <canvas
          ref={canvas}
          className="absolute"
          // Grown past the box so the blur's own soft edge falls off screen
          // instead of drawing a dark rim around the viewport.
          style={{ left: "-8%", top: "-8%", width: "116%", height: "116%" }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
        />
      </div>
    </div>
  );
}
