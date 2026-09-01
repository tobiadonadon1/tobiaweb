/**
 * THE SUPERHUMAN MARK
 *
 * An asymmetric eight point star, rebuilt from the pale blue paper cut-out
 * on Tobia's desk. The asymmetry is the whole character of it: one ray runs
 * long up and to the left, one runs long to the right, and the other six are
 * deliberately uneven. A regular star would be a different, duller mark.
 *
 * The geometry is derived once at module load from eight (angle, length)
 * pairs measured off the photograph, so every surface on the page (hero,
 * compass, the shelf's flying rays) is speaking about the SAME star and can
 * never drift apart.
 *
 * Two renderings come out of that geometry:
 *
 *   variant="solid"  a SINGLE closed path, the true union outline of the
 *                    eight needles. Used everywhere the mark is just a mark,
 *                    and as the stroke for the hero's draw-on.
 *
 *   variant="rays"   the same silhouette cut into eight separate needle
 *                    paths (plus the inner core polygon that hides the
 *                    seams between them). Only the peak needs this, because
 *                    only the peak takes the star apart.
 *
 * Everything is unit space: the longest ray has length 1, centred on (0,0).
 * `size` scales it into pixels at render time. Colour is `currentColor`.
 */

import { useId } from "react";

import type { Ref, SVGProps } from "react";

/** One ray. Angle in degrees, screen convention: 0 points right, positive turns clockwise. */
export type StarRay = {
  angle: number;
  /** Fraction of the longest ray. */
  length: number;
};

/**
 * Measured off the reference photograph, clockwise, starting from the long
 * up-and-left ray (index 0 is the one the compass points with).
 */
export const STAR_RAYS: readonly StarRay[] = [
  { angle: -105.9, length: 1.0 }, // the long one, up and left
  { angle: -75.1, length: 0.547 }, // short, nearly straight up
  { angle: -37.1, length: 0.694 },
  { angle: 4.1, length: 0.727 }, // the second long one, out to the right
  { angle: 43.9, length: 0.627 },
  { angle: 95.2, length: 0.53 }, // short, nearly straight down
  { angle: 147.6, length: 0.629 },
  { angle: 189.0, length: 0.65 },
];

export const RAY_COUNT = STAR_RAYS.length;

type Pt = { x: number; y: number };

/** Half-width of a ray where it meets the core. Longer rays are a touch broader. */
const CORE_HALF = 0.052;
const halfBase = (length: number) => CORE_HALF * (0.6 + 0.4 * length);

const toRad = (deg: number) => (deg * Math.PI) / 180;
const rotate = (p: Pt, a: number): Pt => ({
  x: p.x * Math.cos(a) - p.y * Math.sin(a),
  y: p.x * Math.sin(a) + p.y * Math.cos(a),
});

const NEEDLES = STAR_RAYS.map((ray) => {
  const a = toRad(ray.angle);
  const b = halfBase(ray.length);
  return {
    a,
    tip: { x: ray.length * Math.cos(a), y: ray.length * Math.sin(a) },
    // The two points where this needle meets the core, counter-clockwise
    // side first.
    ccw: rotate({ x: 0, y: -b }, a),
    cw: rotate({ x: 0, y: b }, a),
  };
});

/** Where two straight lines cross, or null if they are parallel. */
function crossing(p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt | null {
  const den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(den) < 1e-9) return null;
  const a = p1.x * p2.y - p1.y * p2.x;
  const b = p3.x * p4.y - p3.y * p4.x;
  return {
    x: (a * (p3.x - p4.x) - (p1.x - p2.x) * b) / den,
    y: (a * (p3.y - p4.y) - (p1.y - p2.y) * b) / den,
  };
}

/**
 * The valley between ray i and ray i+1: where their facing edges actually
 * meet. Solving for it (rather than parking every valley on one inner
 * radius) is what gives the mark its hand-cut feel, because the notch
 * between two close rays is naturally shallower than between two far apart.
 */
const VALLEYS: Pt[] = NEEDLES.map((needle, i) => {
  const next = NEEDLES[(i + 1) % RAY_COUNT];
  const hit = crossing(needle.cw, needle.tip, next.ccw, next.tip);
  if (hit) {
    const r = Math.hypot(hit.x, hit.y);
    if (r > 0.02 && r < 0.4) return hit;
  }
  // Never reached with the measured geometry, but a mark that fails to
  // render is worse than one that falls back to a bisector.
  const mid = Math.atan2(
    (needle.tip.y + next.tip.y) / 2,
    (needle.tip.x + next.tip.x) / 2,
  );
  return { x: 0.12 * Math.cos(mid), y: 0.12 * Math.sin(mid) };
});

const round = (n: number) => Math.round(n * 10000) / 10000;
const poly = (pts: Pt[]) =>
  `M${pts.map((p) => `${round(p.x)} ${round(p.y)}`).join("L")}Z`;

/**
 * The whole mark as ONE closed path in unit space: tip, valley, tip, valley,
 * sixteen points around. Also the path the hero strokes on.
 */
export const STAR_OUTLINE_D = poly(
  NEEDLES.flatMap((needle, i) => [needle.tip, VALLEYS[i]]),
);

/**
 * One ray on its own, in its OWN frame: base at the origin, tip out along
 * +x at its natural length. That frame is what lets the peak place a ray
 * with nothing but translate, rotate and scale, and what lets a rule be a
 * ray flattened along y.
 */
export function rayLocalD(index: number): string {
  const back = -NEEDLES[index].a;
  const before = rotate(VALLEYS[(index + RAY_COUNT - 1) % RAY_COUNT], back);
  const after = rotate(VALLEYS[index], back);
  const tip = { x: STAR_RAYS[index].length, y: 0 };
  return poly([{ x: 0, y: 0 }, before, tip, after]);
}

/**
 * Each ray's two core corners expressed in the ray's OWN frame (base at the
 * origin, tip out along +x). The peak morphs a ray into a rule by lerping
 * these six points, so it needs the numbers, not just the path string.
 * `a` is always the counter-clockwise corner (negative y), `b` the clockwise
 * one (positive y).
 */
export const RAY_LOCAL_SHAPE: readonly {
  a: Pt;
  b: Pt;
  length: number;
}[] = STAR_RAYS.map((ray, i) => {
  const back = -NEEDLES[i].a;
  return {
    a: rotate(VALLEYS[(i + RAY_COUNT - 1) % RAY_COUNT], back),
    b: rotate(VALLEYS[i], back),
    length: ray.length,
  };
});

/** Every ray's local path, computed once. */
export const RAY_LOCAL_D: readonly string[] = STAR_RAYS.map((_, i) =>
  rayLocalD(i),
);

/** The inner polygon joining every valley. Sits under the eight rays and
 *  hides the hairline seams where they meet. Never pokes outside the mark. */
export const STAR_CORE_D = poly(VALLEYS);

/** Length of ray `i` as a fraction of the longest. */
export const rayLength = (index: number) => STAR_RAYS[index].length;
/** Resting angle of ray `i`, in degrees. */
export const rayAngle = (index: number) => STAR_RAYS[index].angle;

/**
 * Two viewBoxes, because the mark has two jobs.
 *
 * TIGHT wraps the silhouette, so a mark that just sits there sits centred in
 * its own box (the star is NOT symmetric, so a box centred on the
 * convergence point would leave a visible hole to the lower right).
 *
 * SPIN is square and centred on the convergence point, which is the only
 * thing a rotation may pivot around. The compass uses it.
 */
const PAD = 0.06;
const OUTLINE_PTS = NEEDLES.flatMap((needle, i) => [needle.tip, VALLEYS[i]]);
const minX = Math.min(...OUTLINE_PTS.map((p) => p.x)) - PAD;
const maxX = Math.max(...OUTLINE_PTS.map((p) => p.x)) + PAD;
const minY = Math.min(...OUTLINE_PTS.map((p) => p.y)) - PAD;
const maxY = Math.max(...OUTLINE_PTS.map((p) => p.y)) + PAD;

/** The tight box as numbers, for callers that need to reason in user units
 *  (a stroke width that has to come out at N screen pixels, say). */
export const STAR_TIGHT_BOX = {
  x: round(minX),
  y: round(minY),
  w: round(maxX - minX),
  h: round(maxY - minY),
};

export const STAR_VIEWBOX_TIGHT = `${STAR_TIGHT_BOX.x} ${STAR_TIGHT_BOX.y} ${STAR_TIGHT_BOX.w} ${STAR_TIGHT_BOX.h}`;

const SPIN_R = round(Math.max(-minX, maxX, -minY, maxY));
export const STAR_VIEWBOX_SPIN = `${-SPIN_R} ${-SPIN_R} ${SPIN_R * 2} ${
  SPIN_R * 2
}`;

/** Aspect ratio of the tight box, so a caller can size by width alone. */
export const STAR_TIGHT_ASPECT = STAR_TIGHT_BOX.w / STAR_TIGHT_BOX.h;

type StarProps = {
  /** Rendered height in px. Width follows the box's aspect. */
  size?: number;
  /** "tight" centres the silhouette; "spin" centres the pivot. */
  box?: "tight" | "spin";
  variant?: "solid" | "rays";
  className?: string;
  /** Ref onto the single solid path (the hero strokes it on). */
  pathRef?: Ref<SVGPathElement>;
  /** Extra props for the single solid path. */
  pathProps?: SVGProps<SVGPathElement>;
  /** Extra props for each ray path in `rays` mode, by index. */
  rayProps?: (index: number) => SVGProps<SVGPathElement>;
  coreProps?: SVGProps<SVGPathElement>;
  /** Paint the mark with a diagonal ramp instead of a flat currentColor. */
  gradient?: { from: string; mid?: string; to: string };
  title?: string;
};

/**
 * The mark. `viewBox` is the unit square scaled by 2.2 so the sharpest tips
 * keep a little air, and the origin sits dead centre, which means a caller
 * can rotate the whole `<g>` about (0,0) and it spins on its own axis.
 */
export function SuperhumanStar({
  size = 120,
  box = "tight",
  variant = "solid",
  className,
  pathRef,
  pathProps,
  rayProps,
  coreProps,
  gradient,
  title,
}: StarProps) {
  const tight = box === "tight";
  // Two mounted stars sharing a gradient id would silently corrupt each
  // other's paint, so the id is scoped per instance.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gid = `sh-star-${uid}`;
  return (
    <svg
      width={tight ? Math.round(size * STAR_TIGHT_ASPECT) : size}
      height={size}
      viewBox={tight ? STAR_VIEWBOX_TIGHT : STAR_VIEWBOX_SPIN}
      fill={gradient ? `url(#${gid})` : "currentColor"}
      className={className}
      {...(title
        ? { role: "img" as const, "aria-label": title }
        : { "aria-hidden": true as const })}
    >
      {title ? <title>{title}</title> : null}
      {/* A flat fill made the mark read as a sticker. One diagonal ramp gives
          it a lit edge and a shadowed one, which is all the dimension a
          geometric mark can take before it starts looking like a logo from
          2010. */}
      {gradient ? (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="58%" stopColor={gradient.mid ?? gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        </defs>
      ) : null}
      {variant === "solid" ? (
        <path ref={pathRef} d={STAR_OUTLINE_D} {...pathProps} />
      ) : (
        <>
          <path d={STAR_CORE_D} {...coreProps} />
          {STAR_RAYS.map((ray, i) => (
            <path
              key={i}
              d={RAY_LOCAL_D[i]}
              transform={`rotate(${ray.angle})`}
              {...rayProps?.(i)}
            />
          ))}
        </>
      )}
    </svg>
  );
}
