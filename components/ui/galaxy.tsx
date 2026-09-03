"use client";

import { useEffect, useRef } from "react";

/**
 * THE GALAXY BEHIND "WHAT I'M BUILDING".
 *
 * WHAT THIS REPLACES. First a constellation net (forty-six cyan motes with
 * hairline links, which read as a graph database, not a sky), then a first
 * galaxy that fixed the structure but not the tone. Tobia on that one: "The
 * stars don't have to look childish like they do now. They should look more
 * like a galaxy, like an interstellar vibe, not a fake, childish game, but the
 * direction is good."
 *
 * FIVE THINGS WERE MAKING IT READ AS A GAME, and all five are addressed here:
 *
 *   1. SPARKLE CROSSES. Four-point flares on the bright stars are the cartoon
 *      twinkle idiom, and they were the loudest tell. Gone entirely.
 *   2. HARD-EDGED DOTS. `arc` + `fill` gives a circle with a cut edge, which
 *      is confetti. Every star is now a pre-baked radial-gradient sprite: a
 *      tiny core inside a wide, very faint halo. It is the falloff, and the
 *      way overlapping halos sum under `lighter`, that reads as photographic.
 *   3. SATURATED COLOUR. Candy gold and orange. The palette is now barely off
 *      white: the tint is meant to be felt across the field, not spotted on
 *      individual stars.
 *   4. EVEN BRIGHTNESS. A real field is overwhelmingly faint stars with a very
 *      few bright ones, so brightness runs through a power curve rather than a
 *      flat random. That single change is most of the depth.
 *   5. HEAVY BLINK. Amplitude was 0.24 to 1.0, a four-fold flash. It is now a
 *      few percent, and less on the bright stars, which is the difference
 *      between a sky breathing and a screen blinking.
 *
 * AND THE BAND HAS STRUCTURE. A smooth airbrushed haze looks synthetic; real
 * galactic dust is mottled and cut through with dark lanes. It is baked with
 * scattered mottle blobs and then has lanes carved OUT of it with
 * `destination-out`. That subtraction is what makes it look like dust rather
 * than like a gradient.
 *
 * THE TWINKLE IS A SINE PER STAR, each with its own rate and phase, so it is
 * continuous everywhere and can never pop. (The sphere on the Mynd page
 * learned this the hard way: quantised brightness plus rotation equals
 * flicker.)
 *
 * REDUCED MOTION gets the sky, held still.
 */

interface GalaxyProps {
  /**
   * Live scroll progress of the tide stage (0→1), read every frame. The sky
   * comes up with the ink and then HOLDS: the navy block carries it out of
   * the viewport rather than it dying first.
   */
  progressRef: { current: number };
  className?: string;
}

/**
 * Stellar colour, and the weight each one gets. These are deliberately close
 * to white. Real star colour is a subtle thing and the moment it is legible as
 * "a gold star" it stops being a sky and starts being decoration.
 */
const STARS: { rgb: string; w: number }[] = [
  { rgb: "255,255,255", w: 30 },
  { rgb: "223,233,252", w: 26 },
  { rgb: "199,215,244", w: 16 },
  { rgb: "255,248,233", w: 14 },
  { rgb: "252,233,198", w: 8 },
  { rgb: "246,215,184", w: 4 },
  { rgb: "238,197,184", w: 2 },
];
const WEIGHT_TOTAL = STARS.reduce((n, s) => n + s.w, 0);

function pickColour(r: number): number {
  let acc = 0;
  const target = r * WEIGHT_TOTAL;
  for (let i = 0; i < STARS.length; i++) {
    acc += STARS[i].w;
    if (target <= acc) return i;
  }
  return 0;
}

type Star = {
  x: number;
  y: number;
  /** Drawn size of the whole sprite, halo included. */
  d: number;
  c: number;
  base: number;
  /** Twinkle rate, phase, and how much of it this star gets. */
  rate: number;
  phase: number;
  tw: number;
  vx: number;
  vy: number;
};

/**
 * Far, mid, near: share of the field, sprite size, brightness and drift. The
 * near layer is a handful of stars only — that is the whole point of a power
 * law, and the reason the field has depth instead of texture.
 */
const LAYERS = [
  { share: 0.62, dMin: 2.4, dMax: 5.2, aMin: 0.1, aMax: 0.4, speed: 1.1 },
  { share: 0.29, dMin: 4.4, dMax: 8.5, aMin: 0.22, aMax: 0.62, speed: 2.4 },
  { share: 0.09, dMin: 7.5, dMax: 15, aMin: 0.4, aMax: 0.95, speed: 3.9 },
];

/** Roughly one star per this many square pixels, clamped at both ends. */
const AREA_PER_STAR = 2000;
const MIN_STARS = 220;
const MAX_STARS = 900;

/** Resolution of each baked star sprite. */
const SPRITE = 64;

export function Galaxy({ progressRef, className }: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    /** The Milky Way, drawn once per resize and blitted every frame. */
    let band: HTMLCanvasElement | null = null;

    /* ---------------------------------------------------------------- *
     * THE STAR SPRITES.
     *
     * One per palette colour, baked once. A bright pinprick core inside a
     * halo that falls away to nothing, which is what a point source through
     * any real optic actually looks like — and, drawn additively, what lets a
     * dense patch of faint stars glow as a patch rather than as dots.
     * ---------------------------------------------------------------- */
    const sprites: HTMLCanvasElement[] = STARS.map(({ rgb }) => {
      const c = document.createElement("canvas");
      c.width = SPRITE;
      c.height = SPRITE;
      const g = c.getContext("2d");
      if (!g) return c;
      const m = SPRITE / 2;
      const grad = g.createRadialGradient(m, m, 0, m, m, m);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(0.07, `rgba(${rgb},0.92)`);
      grad.addColorStop(0.16, `rgba(${rgb},0.42)`);
      grad.addColorStop(0.34, `rgba(${rgb},0.12)`);
      grad.addColorStop(0.62, `rgba(${rgb},0.03)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, SPRITE, SPRITE);
      return c;
    });

    /* ---------------------------------------------------------------- *
     * THE BAND.
     *
     * Built in three passes: a chain of wide faint gradients along a wobbling
     * diagonal, mottle blobs scattered near that axis to break the smoothness,
     * and then dark lanes CARVED OUT with `destination-out`. The subtraction
     * is the important one — dust reads as dust because of what it blocks.
     *
     * Baked because none of it changes: redrawing a hundred and thirty soft
     * gradients every frame would cost more than everything else put together.
     * ---------------------------------------------------------------- */
    const bakeBand = () => {
      if (w <= 0 || h <= 0) return;
      const c = document.createElement("canvas");
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const g = c.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Low-left to high-right: the angle a galactic plane usually cuts across
      // a photograph at.
      const x0 = -w * 0.15;
      const y0 = h * 1.02;
      const x1 = w * 1.15;
      const y1 = h * -0.02;
      const axis = (t: number) => ({
        x: x0 + (x1 - x0) * t,
        // A slow sine off the straight line: a galaxy is not a ruler.
        y: y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 1.6) * h * 0.06,
      });

      g.globalCompositeOperation = "lighter";

      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const { x, y } = axis(t);
        const taper = Math.sin(t * Math.PI);
        const rad = Math.max(w, h) * (0.1 + 0.13 * taper);
        const a = 0.036 * taper;
        if (a <= 0.001) continue;
        const grad = g.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, `rgba(176,198,248,${(a * 1.0).toFixed(4)})`);
        grad.addColorStop(0.45, `rgba(146,166,230,${(a * 0.5).toFixed(4)})`);
        grad.addColorStop(1, "rgba(118,146,218,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(x, y, rad, 0, Math.PI * 2);
        g.fill();
      }

      // MOTTLE. Clumps of unresolved light near the axis. Without these the
      // band is an airbrush gradient, which is the single most synthetic
      // looking thing a canvas can produce.
      for (let i = 0; i < 90; i++) {
        const t = Math.random();
        const { x, y } = axis(t);
        const off = (Math.random() - 0.5) * h * 0.5;
        const cx = x + off * 0.55;
        const cy = y + off;
        const rad = 26 + Math.random() * 92;
        const a = 0.006 + Math.random() * 0.011;
        const grad = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0, `rgba(198,214,252,${a.toFixed(4)})`);
        grad.addColorStop(1, "rgba(198,214,252,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(cx, cy, rad, 0, Math.PI * 2);
        g.fill();
      }

      // Two warmer cores, where the dust piles up.
      for (const [cx, cy, s] of [
        [w * 0.38, h * 0.62, 0.9],
        [w * 0.66, h * 0.36, 0.7],
      ] as const) {
        const rad = Math.max(w, h) * 0.22 * s;
        const grad = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0, `rgba(255,230,196,${(0.026 * s).toFixed(4)})`);
        grad.addColorStop(0.5, `rgba(198,190,232,${(0.013 * s).toFixed(4)})`);
        grad.addColorStop(1, "rgba(158,178,230,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(cx, cy, rad, 0, Math.PI * 2);
        g.fill();
      }

      // DARK LANES, subtracted. Long soft ellipses lying roughly along the
      // band, eating into what was just drawn.
      g.globalCompositeOperation = "destination-out";
      const angle = Math.atan2(y1 - y0, x1 - x0);
      for (let i = 0; i < 8; i++) {
        const t = 0.12 + Math.random() * 0.76;
        const { x, y } = axis(t);
        const cx = x + (Math.random() - 0.5) * w * 0.16;
        const cy = y + (Math.random() - 0.5) * h * 0.3;
        const len = h * (0.16 + Math.random() * 0.3);
        const thick = 0.1 + Math.random() * 0.16;
        g.save();
        g.translate(cx, cy);
        g.rotate(angle + (Math.random() - 0.5) * 0.5);
        g.scale(1, thick);
        const grad = g.createRadialGradient(0, 0, 0, 0, 0, len);
        grad.addColorStop(0, `rgba(0,0,0,${(0.4 + Math.random() * 0.3).toFixed(3)})`);
        grad.addColorStop(0.55, "rgba(0,0,0,0.16)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(0, 0, len, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }

      band = c;
    };

    const seedStars = () => {
      if (w <= 0 || h <= 0) return;
      const total = Math.min(
        MAX_STARS,
        Math.max(MIN_STARS, Math.round((w * h) / AREA_PER_STAR)),
      );
      const next: Star[] = [];
      for (const layer of LAYERS) {
        const n = Math.round(total * layer.share);
        for (let i = 0; i < n; i++) {
          const dir = Math.random() * Math.PI * 2;
          // Stars near the band are denser, which is what a band IS. A cheap
          // bias: half the field is placed anywhere, half is pulled towards
          // the diagonal the band runs along.
          let x = Math.random() * w;
          let y = Math.random() * h;
          if (Math.random() < 0.5) {
            const t = Math.random();
            x = -w * 0.15 + w * 1.3 * t;
            y = h * 1.02 + h * -1.04 * t + (Math.random() - 0.5) * h * 0.42;
          }
          // THE POWER CURVE. Most stars sit near the bottom of their layer's
          // range and a few reach the top, which is how a real field is
          // distributed and why this stopped looking like scattered confetti.
          const roll = Math.pow(Math.random(), 2.6);
          const bright = layer.aMin + roll * (layer.aMax - layer.aMin);
          next.push({
            x,
            y,
            d: layer.dMin + Math.pow(Math.random(), 2.2) * (layer.dMax - layer.dMin),
            c: pickColour(Math.random()),
            base: bright,
            rate: 0.3 + Math.random() * 0.95,
            phase: Math.random() * Math.PI * 2,
            // Faint stars shimmer, bright ones sit still. A big star pulsing
            // is the thing that reads as a game.
            tw: (0.05 + Math.random() * 0.1) * (1 - roll * 0.65),
            vx: Math.cos(dir) * layer.speed * 0.3,
            vy: Math.sin(dir) * layer.speed * 0.3,
          });
        }
      }
      stars = next;
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w <= 0 || h <= 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
      bakeBand();
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------------------------------------------------------------- *
     * THE SHOOTING STAR.
     *
     * One at a time, rare, thin, and gone in well under a second. It exists
     * because a sky that only twinkles is wallpaper, and because a single
     * event you might miss is the thing that makes somebody keep watching. It
     * is dimmer and rarer than it was: a bright streak every few seconds is a
     * screensaver, a faint one every twenty is a sky.
     * ---------------------------------------------------------------- */
    const shot = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      span: 0,
      next: 6 + Math.random() * 10,
    };

    const launchShot = () => {
      const fromLeft = Math.random() < 0.65;
      shot.x = fromLeft ? -40 : w + 40;
      shot.y = Math.random() * h * 0.55;
      const speed = 760 + Math.random() * 520;
      const angle = (fromLeft ? 1 : -1) * (0.24 + Math.random() * 0.22);
      shot.vx = (fromLeft ? 1 : -1) * Math.cos(angle) * speed;
      shot.vy = Math.sin(Math.abs(angle)) * speed;
      shot.span = 0.5 + Math.random() * 0.35;
      shot.life = 0;
      shot.active = true;
    };

    let raf = 0;
    let last = performance.now();
    let cleared = true;

    const paint = (intensity: number, time: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (band) {
        ctx.globalAlpha = intensity;
        ctx.drawImage(band, 0, 0, w, h);
      }

      for (const s of stars) {
        const tw = reduced ? 1 : 1 - s.tw + s.tw * Math.sin(time * s.rate + s.phase);
        const a = s.base * tw * intensity;
        if (a <= 0.004) continue;
        ctx.globalAlpha = a;
        const d = s.d;
        ctx.drawImage(sprites[s.c], s.x - d / 2, s.y - d / 2, d, d);
      }

      ctx.globalAlpha = 1;

      if (shot.active) {
        const k = 1 - shot.life / shot.span;
        const tailX = shot.x - shot.vx * 0.05;
        const tailY = shot.y - shot.vy * 0.05;
        const grad = ctx.createLinearGradient(tailX, tailY, shot.x, shot.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(248,246,238,${(0.55 * k * intensity).toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shot.x, shot.y);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Same ramp the net had, so the chapter's choreography is untouched:
      // up with the ink between p 0.45 and 0.75, then hold.
      const p = progressRef.current;
      const t = Math.min(Math.max((p - 0.45) / 0.3, 0), 1);
      const intensity = t * t * (3 - 2 * t);

      if (intensity <= 0.02) {
        if (!cleared) {
          ctx.clearRect(0, 0, w, h);
          cleared = true;
        }
        return;
      }
      cleared = false;

      if (!reduced) {
        const m = 20;
        for (const s of stars) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.x < -m) s.x = w + m;
          else if (s.x > w + m) s.x = -m;
          if (s.y < -m) s.y = h + m;
          else if (s.y > h + m) s.y = -m;
        }

        if (shot.active) {
          shot.life += dt;
          shot.x += shot.vx * dt;
          shot.y += shot.vy * dt;
          if (shot.life >= shot.span) {
            shot.active = false;
            shot.next = 11 + Math.random() * 14;
          }
        } else {
          shot.next -= dt;
          if (shot.next <= 0) launchShot();
        }
      }

      paint(intensity, now / 1000);
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
