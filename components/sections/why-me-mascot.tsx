"use client";

import { useEffect, useRef } from "react";

/**
 * THE LITTLE MAN, LIVING ON THE CARDS.
 *
 * The site's mark (public/logo.png) is a figure with its arms up inside a set
 * of concentric arcs, like a signal going out. Tobia: "the little man is
 * walking over the cards, jumping between one card and the other."
 *
 * WHY IT IS DRAWN HERE AND NOT THE PNG. A flat image can be moved around and
 * nothing else. Redrawn as SVG the knees bend, the arms counter-swing, and the
 * arms throw up into the mark's own pose over a gap. A picture sliding along a
 * card reads as a sticker on a rail; a figure whose knees bend reads as alive.
 *
 * HE IMPROVISES. There is no route. Every time he finishes a move he looks at
 * where he is and picks the next one — stroll, hop the gap, step off the edge,
 * put up a ladder, or just stand there a moment and turn around — weighted by
 * what is actually reachable and biased against going straight back where he
 * came from. Two visits to this section are never the same. ("He shouldn't
 * always do the same round. It has to be random. He has to be kind of alive.")
 *
 * HE MEASURES `offsetTop`, NOT `getBoundingClientRect()`. This is the whole
 * reason he used to walk sunk below the bottom card's edge. The cards arrive on
 * a Motion spring that animates `y: 20 → 0` as a TRANSFORM, and a bounding rect
 * includes transforms, so a route measured while the last card was still
 * springing baked in a stale 13px offset. `offsetTop` reports the settled
 * layout position and ignores transforms entirely, so his feet land on the real
 * border from the first frame and no timing guess is involved.
 *
 * THE GAIT IS DRIVEN BY GROUND DISTANCE, NOT BY THE CLOCK, so cadence and speed
 * can never disagree and the stride freezes the instant his feet leave a card.
 *
 * HIS SOLES SIT ON THE BORDER. The viewBox is sized so the bottom of the foot
 * stroke lands on its last unit, and the bob is applied to the torso group
 * only, so the walk cycle never sinks his feet through the edge.
 *
 * A LADDER MAY NOT PASS THROUGH A CARD. Before he puts one up, anything whose
 * body lies across the climb is checked for, so he never leans a ladder over
 * the face of the card in between.
 *
 * IT ONLY RUNS WHEN YOU CAN SEE IT (IntersectionObserver), only on layouts wide
 * enough to have the cards side by side, and not at all under reduced motion,
 * where he simply stands on the first card.
 */

/** Ground speed, px/s. */
const WALK_SPEED = 66;
/** Up the ladder, px/s. */
const CLIMB_SPEED = 155;
/** Gravity for the falls, px/s². Slower than real, which reads better small. */
const GRAV = 1400;
/** The ladder telescoping up, and folding away again. */
const DEPLOY_TIME = 0.6;
const STOW_TIME = 0.5;
/** A beat at the lip of a card before he steps off it. */
const EDGE_BEAT = 0.18;

/**
 * Drawn size. 26x36 of viewBox into 32x44 of layout: `meet` scales by the
 * height, so viewBox y=36 lands exactly on the bottom of the box and his soles
 * land exactly on the card's border.
 */
const MW = 32;
const MH = 44;

/**
 * How far in from a card's corner he turns. The cards are rounded at 24px, so
 * anything less and he walks out over the curve with nothing under his feet.
 */
const EDGE_PAD = 38;
/** Two cards are in the same row if their tops are within this. */
const ROW_TOL = 14;
/** Ground covered by one step. Sets the cadence against the walk speed. */
const STRIDE = 13;
/** Ladder rung spacing, which is also the climb's stride, and the rail gauge. */
const RUNG = 22;
const LADDER_W = 19;

/** The widest gap he will hop, and the longest fall he will take. */
const HOP_REACH = 190;
const DROP_REACH = 460;
/** A ladder shorter than this is not worth the ceremony; longer is silly. */
const CLIMB_MIN = 70;
const CLIMB_MAX = 560;

type Plat = { left: number; right: number; top: number; bottom: number };

type Seg =
  | { kind: "walk"; x0: number; x1: number; y: number; dur: number }
  | {
      kind: "hop";
      x0: number;
      x1: number;
      y0: number;
      y1: number;
      dur: number;
      hi: number;
    }
  | {
      kind: "drop";
      x0: number;
      x1: number;
      y0: number;
      y1: number;
      out: number;
      arcX: number;
      dur: number;
    }
  | {
      kind: "idle";
      x: number;
      y: number;
      dur: number;
      /** Face to end on (0 keeps the current one), and whether he waves. */
      turn: number;
      wave: boolean;
    }
  | {
      kind: "deploy" | "stow";
      x: number;
      y: number;
      dur: number;
      lx: number;
      ly0: number;
      ly1: number;
    }
  | {
      kind: "climb";
      x: number;
      y0: number;
      y1: number;
      dur: number;
      lx: number;
      ly0: number;
      ly1: number;
    };

const ease = (k: number) => k * k * (3 - 2 * k);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function WhyMeMascot({
  scope,
}: {
  /** The positioned element the cards live in. */
  scope: React.RefObject<HTMLElement | null>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const torsoRef = useRef<SVGGElement>(null);
  const legLRef = useRef<SVGGElement>(null);
  const legRRef = useRef<SVGGElement>(null);
  const kneeLRef = useRef<SVGGElement>(null);
  const kneeRRef = useRef<SVGGElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const ladderRef = useRef<HTMLDivElement>(null);
  const ladderSvgRef = useRef<SVGSVGElement>(null);
  const ladderGRef = useRef<SVGGElement>(null);
  const ladderPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const root = scope.current;
    if (!host || !root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)");

    let plats: Plat[] = [];
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let ladderH = -1;

    /* ---- where he is, and what he is in the middle of doing ---- */
    let cur = 0;
    let prev = -1;
    let x = 0;
    let seg: Seg | null = null;
    let segT = 0;
    let queue: Seg[] = [];
    let lastKind = "";

    const span = (p: Plat) => [p.left + EDGE_PAD, p.right - EDGE_PAD] as const;

    /* ------------------------------------------------------------------ *
     * MEASURE
     * ------------------------------------------------------------------ */

    /**
     * Layout position inside the stage, WITHOUT transforms. See the note at the
     * top: this is the fix for him walking below the card's edge.
     */
    const offsetIn = (el: HTMLElement) => {
      let ox = 0;
      let oy = 0;
      let n: HTMLElement | null = el;
      while (n && n !== root) {
        ox += n.offsetLeft;
        oy += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return n === root ? { x: ox, y: oy } : null;
    };

    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      const next: Plat[] = [];
      for (const el of Array.from(
        root.querySelectorAll<HTMLElement>("[data-mascot-step]"),
      )) {
        const o = offsetIn(el);
        // The rect path is a fallback for a layout where the stage is not in
        // the offsetParent chain. It is transform-sensitive, hence second.
        const left = o ? o.x : el.getBoundingClientRect().left - rootBox.left;
        const top = o ? o.y : el.getBoundingClientRect().top - rootBox.top;
        const wpx = el.offsetWidth || el.getBoundingClientRect().width;
        const hpx = el.offsetHeight || el.getBoundingClientRect().height;
        if (wpx <= EDGE_PAD * 2 + 24) continue;
        next.push({ left, right: left + wpx, top, bottom: top + hpx });
      }
      next.sort((a, b) => a.top - b.top || a.left - b.left);
      plats = next;
      if (!plats.length) return;

      // Keep him where he was, on whatever platform is now nearest.
      cur = clamp(cur, 0, plats.length - 1);
      const [a, b] = span(plats[cur]);
      x = clamp(x || a, a, b);
      queue = [];
      seg = null;
      segT = 0;
      ladderH = -1;
    };

    /* ------------------------------------------------------------------ *
     * DECIDING WHAT TO DO NEXT
     * ------------------------------------------------------------------ */

    /**
     * Is the straight line from (lx, top) to (lx, bottom) clear of cards?
     * Used for BOTH the ladder and the falls: without it he would drop off the
     * "15" card straight through the face of the one below it on his way to the
     * bottom, and lean a ladder across a card standing in between.
     */
    const columnClear = (lx: number, top: number, bottom: number, from: number, to: number) =>
      plats.every((q, i) => {
        if (i === from || i === to) return true;
        if (lx < q.left || lx > q.right) return true;
        return q.bottom <= top || q.top >= bottom;
      });

    type Opt = { w: number; run: () => void };

    const decide = () => {
      const p = plats[cur];
      const [a, b] = span(p);
      const opts: Opt[] = [];
      const bias = (i: number) => (i === prev ? 0.3 : 1);

      /* STROLL — somewhere else on this card. */
      opts.push({
        w: lastKind === "walk" ? 0.7 : 2.2,
        run: () => {
          let to = rand(a, b);
          if (Math.abs(to - x) < 60) to = Math.abs(x - a) > Math.abs(x - b) ? a : b;
          queue.push({
            kind: "walk",
            x0: x,
            x1: to,
            y: p.top,
            dur: Math.abs(to - x) / WALK_SPEED,
          });
          x = to;
        },
      });

      /* IDLE — stand, look the other way, maybe put a hand up. */
      opts.push({
        w: lastKind === "idle" ? 0.15 : 1,
        run: () => {
          const wave = Math.random() < 0.35;
          queue.push({
            kind: "idle",
            x,
            y: p.top,
            dur: wave ? rand(1.1, 1.7) : rand(0.7, 2.1),
            turn: wave ? 0 : Math.random() < 0.6 ? -1 : 0,
            wave,
          });
        },
      });

      plats.forEach((q, i) => {
        if (i === cur) return;
        const [qa, qb] = span(q);

        /* HOP — a neighbour on the same row, across the gap. */
        if (Math.abs(q.top - p.top) <= ROW_TOL) {
          const right = q.left > p.right;
          const gap = right ? q.left - p.right : p.left - q.right;
          if (gap >= 0 && gap <= HOP_REACH) {
            // Only the immediate neighbour: he does not leap over a card.
            const between = plats.some(
              (r, j) =>
                j !== i &&
                j !== cur &&
                Math.abs(r.top - p.top) <= ROW_TOL &&
                (right ? r.left >= p.right && r.right <= q.left : r.right <= p.left && r.left >= q.right),
            );
            if (!between) {
              opts.push({
                w: 3 * bias(i),
                run: () => {
                  const launch = right ? b : a;
                  const land = right ? qa : qb;
                  if (Math.abs(launch - x) > 1) {
                    queue.push({
                      kind: "walk",
                      x0: x,
                      x1: launch,
                      y: p.top,
                      dur: Math.abs(launch - x) / WALK_SPEED,
                    });
                  }
                  const reach = Math.abs(land - launch);
                  queue.push({
                    kind: "hop",
                    x0: launch,
                    x1: land,
                    y0: p.top,
                    y1: q.top,
                    hi: 26 + reach * 0.16,
                    dur: clamp(0.4 + reach / 300, 0.4, 0.95),
                  });
                  prev = cur;
                  cur = i;
                  x = land;
                },
              });
            }
          }
        }

        /* DROP — step off one of this card's ends onto something below. */
        if (q.top > p.bottom - 4 && q.top - p.top <= DROP_REACH) {
          for (const edge of [a, b] as const) {
            if (edge < qa - 90 || edge > qb + 90) continue;
            const land = clamp(edge, qa, qb);
            if (!columnClear(land, p.top, q.top, cur, i)) continue;
            const fall = q.top - p.top;
            const right = edge === b;
            opts.push({
              w: 2.6 * bias(i),
              run: () => {
                if (Math.abs(edge - x) > 1) {
                  queue.push({
                    kind: "walk",
                    x0: x,
                    x1: edge,
                    y: p.top,
                    dur: Math.abs(edge - x) / WALK_SPEED,
                  });
                }
                queue.push({
                  kind: "idle",
                  x: edge,
                  y: p.top,
                  dur: EDGE_BEAT,
                  turn: 0,
                  wave: false,
                });
                queue.push({
                  kind: "drop",
                  x0: edge,
                  x1: land,
                  y0: p.top,
                  y1: q.top,
                  out: right ? 1 : -1,
                  // Enough of an arc to clear the corner he just left, so it
                  // reads as stepping OFF rather than falling through.
                  arcX: EDGE_PAD + 16,
                  dur: clamp(Math.sqrt((2 * fall) / GRAV), 0.34, 1.1),
                });
                prev = cur;
                cur = i;
                x = land;
              },
            });
          }
        }

        /* CLIMB — put up a ladder and go to the one above. */
        if (q.bottom < p.top + 4) {
          const h = p.top - q.top;
          const lo = Math.max(a, qa);
          const hi = Math.min(b, qb);
          if (h >= CLIMB_MIN && h <= CLIMB_MAX && hi - lo > 10) {
            opts.push({
              w: 2 * bias(i),
              run: () => {
                const lx = rand(lo, hi);
                if (!columnClear(lx, q.top, p.top, cur, i)) {
                  // Nothing to do here: fall through to a stroll instead.
                  queue.push({
                    kind: "idle",
                    x,
                    y: p.top,
                    dur: 0.5,
                    turn: 0,
                    wave: false,
                  });
                  return;
                }
                if (Math.abs(lx - x) > 1) {
                  queue.push({
                    kind: "walk",
                    x0: x,
                    x1: lx,
                    y: p.top,
                    dur: Math.abs(lx - x) / WALK_SPEED,
                  });
                }
                const bag = { lx, ly0: q.top, ly1: p.top };
                queue.push({ kind: "deploy", x: lx, y: p.top, dur: DEPLOY_TIME, ...bag });
                queue.push({
                  kind: "climb",
                  x: lx,
                  y0: p.top,
                  y1: q.top,
                  dur: h / CLIMB_SPEED,
                  ...bag,
                });
                queue.push({ kind: "stow", x: lx, y: q.top, dur: STOW_TIME, ...bag });
                prev = cur;
                cur = i;
                x = lx;
              },
            });
          }
        }
      });

      const total = opts.reduce((n, o) => n + o.w, 0);
      let r = Math.random() * total;
      for (const o of opts) {
        r -= o.w;
        if (r <= 0) {
          o.run();
          return;
        }
      }
      opts[0]?.run();
    };

    const nextSeg = (): Seg | null => {
      let guard = 0;
      while (!queue.length && guard++ < 4) {
        if (!plats.length) return null;
        decide();
      }
      const s = queue.shift() ?? null;
      if (s) lastKind = s.kind;
      return s;
    };

    /* ------------------------------------------------------------------ *
     * SAMPLING
     * ------------------------------------------------------------------ */

    const sample = (s: Seg, k: number) => {
      switch (s.kind) {
        case "walk":
          return {
            x: s.x0 + (s.x1 - s.x0) * k,
            y: s.y,
            lift: 0,
            air: 0,
            face: s.x1 >= s.x0 ? 1 : -1,
            kind: s.kind,
            k,
            seg: s,
          };
        case "hop": {
          const air = Math.sin(k * Math.PI);
          return {
            x: s.x0 + (s.x1 - s.x0) * k,
            y: s.y0 + (s.y1 - s.y0) * k,
            lift: air * s.hi,
            air,
            face: s.x1 >= s.x0 ? 1 : -1,
            kind: s.kind,
            k,
            seg: s,
          };
        }
        case "drop": {
          // He steps OFF the lip: a small pop, an outward arc past the corner,
          // then y accelerating like gravity rather than a lerp.
          const arc = Math.sin(k * Math.PI);
          return {
            x: s.x0 + (s.x1 - s.x0) * k + s.out * arc * s.arcX,
            y: s.y0 + (s.y1 - s.y0) * k * k,
            lift: arc * 12,
            air: Math.min(1, k * 5, (1 - k) * 7),
            face: s.out,
            kind: s.kind,
            k,
            seg: s,
          };
        }
        case "climb":
          return {
            x: s.x,
            y: s.y0 + (s.y1 - s.y0) * k,
            lift: 0,
            air: 0,
            face: 0,
            kind: s.kind,
            k,
            seg: s,
          };
        case "idle":
          return {
            x: s.x,
            y: s.y,
            lift: 0,
            air: 0,
            face: k < 0.45 ? 0 : s.turn,
            kind: s.kind,
            k,
            seg: s,
          };
        default:
          return {
            x: s.x,
            y: s.y,
            lift: 0,
            air: 0,
            face: 0,
            kind: s.kind,
            k,
            seg: s,
          };
      }
    };

    /* ------------------------------------------------------------------ *
     * THE LADDER
     * ------------------------------------------------------------------ */

    const drawLadder = (h: number) => {
      const svg = ladderSvgRef.current;
      const path = ladderPathRef.current;
      if (!svg || !path) return;
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${LADDER_W} ${h}`);
      const a = 2.4;
      const b = LADDER_W - 2.4;
      let d = `M${a} 0L${a} ${h}M${b} 0L${b} ${h}`;
      for (let y = RUNG * 0.5; y < h; y += RUNG) {
        d += `M${a} ${y.toFixed(1)}L${b} ${y.toFixed(1)}`;
      }
      path.setAttribute("d", d);
    };

    /* ------------------------------------------------------------------ *
     * FRAME
     * ------------------------------------------------------------------ */

    let gait = 0;
    let climbPh = 0;
    let face = 1;
    let px = 0;
    let py = 0;
    let hasPrev = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !plats.length) return;

      if (!reduced) segT += dt;
      let guard = 0;
      while ((!seg || segT >= seg.dur) && guard++ < 8) {
        if (seg) segT -= seg.dur;
        seg = nextSeg();
        if (!seg) return;
        if (reduced) break;
      }
      if (!seg) return;

      const at = sample(seg, seg.dur <= 0 ? 1 : clamp(segT / seg.dur, 0, 1));

      const dx = hasPrev ? at.x - px : 0;
      const dy = hasPrev ? at.y - py : 0;
      px = at.x;
      py = at.y;
      hasPrev = true;

      // THE ONE THING THAT MAKES IT LOOK LIKE WALKING: the stride advances with
      // ground covered, so cadence and speed can never disagree, and the phase
      // is frozen the instant his feet leave the card.
      if (at.kind === "walk" && Math.abs(dx) < 40) {
        gait += (Math.abs(dx) / STRIDE) * Math.PI;
      }
      if (at.kind === "climb" && Math.abs(dy) < 40) {
        climbPh += (Math.abs(dy) / RUNG) * Math.PI;
      }
      if (at.face) face = at.face === -1 && at.kind === "idle" ? -face : at.face;

      const t = now / 1000;
      let thighL: number;
      let thighR: number;
      let bendL: number;
      let bendR: number;
      let armL: number;
      let armR: number;
      let bob: number;

      if (at.kind === "climb") {
        // Opposite arm and leg, the way anybody actually goes up a ladder.
        const c = Math.sin(climbPh);
        const upL = Math.max(0, -c);
        const upR = Math.max(0, c);
        armL = 112 + c * 30;
        armR = -112 + c * 30;
        thighL = -10 - upL * 24;
        thighR = -10 - upR * 24;
        bendL = 26 + upL * 36;
        bendR = 26 + upR * 36;
        bob = Math.abs(c) * 0.5;
      } else if (at.kind === "deploy" || at.kind === "stow") {
        // Hauling it up, and folding it away again.
        const g = ease(at.kind === "deploy" ? at.k : 1 - at.k);
        armL = 40 + g * 74;
        armR = -40 - g * 74;
        thighL = -6;
        thighR = 6;
        bendL = 9;
        bendR = 9;
        bob = g * 1.2;
      } else if (at.kind === "idle") {
        // Standing: breathing, and a hand up if this is one of those.
        const breath = Math.sin(t * 1.9) * 0.5;
        const s = at.seg as Extract<Seg, { kind: "idle" }>;
        const w = s.wave ? Math.sin(at.k * Math.PI) : 0;
        armL = 12 + w * (96 + Math.sin(t * 12) * 16);
        armR = -12;
        thighL = -3;
        thighR = 3;
        bendL = 4;
        bendR = 4;
        bob = 0.5 + breath;
        gait = 0;
      } else {
        const swing = Math.sin(gait);
        const cos = Math.cos(gait);
        // Knees bend on the SWING half only, which is what clears the ground.
        const wThighL = -swing * 30;
        const wThighR = swing * 30;
        const wBendL = Math.max(0, cos) * 44;
        const wBendR = Math.max(0, -cos) * 44;
        const wArm = swing * 26;
        const wBob = at.kind === "walk" ? (1 - Math.abs(swing)) * 1.3 : 0;

        // Airborne he throws his arms up into the mark's own pose, and the
        // hands wave on their own out-of-phase wobble on the way over.
        const A = at.air;
        const f1 = Math.sin(t * 12.5) * 11 * A;
        const f2 = Math.sin(t * 12.5 + 2.1) * 11 * A;
        thighL = wThighL + (-26 - wThighL) * A;
        thighR = wThighR + (12 - wThighR) * A;
        bendL = wBendL + (48 - wBendL) * A;
        bendR = wBendR + (18 - wBendR) * A;
        armL = wArm + (116 + f1 - wArm) * A;
        armR = -wArm + (-116 + f2 + wArm) * A;
        bob = wBob * (1 - A);
      }

      host.style.transform = `translate3d(${(at.x - MW / 2).toFixed(1)}px, ${(
        at.y - MH - at.lift
      ).toFixed(1)}px, 0) scaleX(${face})`;

      legLRef.current?.setAttribute("transform", `rotate(${thighL.toFixed(1)} 13 21.5)`);
      kneeLRef.current?.setAttribute("transform", `rotate(${bendL.toFixed(1)} 13 28.1)`);
      legRRef.current?.setAttribute("transform", `rotate(${thighR.toFixed(1)} 13 21.5)`);
      kneeRRef.current?.setAttribute("transform", `rotate(${bendR.toFixed(1)} 13 28.1)`);
      armLRef.current?.setAttribute("transform", `rotate(${armL.toFixed(1)} 13 12.2)`);
      armRRef.current?.setAttribute("transform", `rotate(${armR.toFixed(1)} 13 12.2)`);
      torsoRef.current?.setAttribute("transform", `translate(0 ${bob.toFixed(2)})`);

      const lad = ladderRef.current;
      if (!lad) return;
      if (at.kind === "deploy" || at.kind === "climb" || at.kind === "stow") {
        const s = at.seg;
        const h = s.ly1 - s.ly0;
        if (h !== ladderH) {
          ladderH = h;
          drawLadder(h);
        }
        lad.style.opacity = "1";
        lad.style.transform = `translate3d(${(s.lx - LADDER_W / 2).toFixed(1)}px, ${s.ly0.toFixed(1)}px, 0)`;
        // Deploying it grows UP from his feet; stowing it folds away toward the
        // top, where he is now standing.
        const k =
          at.kind === "climb" ? 1 : at.kind === "deploy" ? ease(at.k) : 1 - ease(at.k);
        ladderGRef.current?.setAttribute(
          "transform",
          at.kind === "stow"
            ? `scale(1 ${k.toFixed(3)})`
            : `translate(0 ${h}) scale(1 ${k.toFixed(3)}) translate(0 ${-h})`,
        );
      } else if (lad.style.opacity !== "0") {
        lad.style.opacity = "0";
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(root);

    const apply = () => {
      if (!wide.matches) {
        host.style.opacity = "0";
        if (ladderRef.current) ladderRef.current.style.opacity = "0";
        plats = [];
        return;
      }
      host.style.opacity = "1";
      measure();
    };

    // A ResizeObserver catches the reflow a webfont swap or a copy change
    // causes, which a window resize listener alone would miss.
    const ro = new ResizeObserver(() => {
      if (wide.matches) measure();
    });
    ro.observe(root);

    apply();
    wide.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", apply);
      wide.removeEventListener("change", apply);
      ro.disconnect();
      io.disconnect();
    };
  }, [scope]);

  return (
    <>
      {/* THE LADDER, on its own layer because it can be as tall as the ink card
          and he is 44px. Hidden except on a climb. */}
      <div
        ref={ladderRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 will-change-transform"
        style={{ opacity: 0 }}
      >
        <svg ref={ladderSvgRef} width={LADDER_W} height={10} className="overflow-visible">
          <g ref={ladderGRef}>
            <path
              ref={ladderPathRef}
              d=""
              stroke="var(--accent-clay)"
              strokeWidth="1.7"
              strokeLinecap="round"
              opacity="0.6"
              fill="none"
            />
          </g>
        </svg>
      </div>

      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
        style={{ width: MW, height: MH, opacity: 0 }}
      >
        {/* CLAY, NOT INK.
            The mark he comes from is navy, and one of the cards he walks is the
            navy one, so drawn in the brand colour he simply disappeared into the
            thing he was standing on. Clay is the site's living accent (it is
            what the hand notes on Construct are drawn in) and it is the one
            colour that holds against both the ink card and the paper ones,
            which is the whole requirement for something that crosses both. */}
        <svg viewBox="0 0 26 36" width={MW} height={MH} className="overflow-visible">
          {/* Legs first, so the torso covers the hip joint. Each is a thigh
              with a shin nested inside it, so the knee is a real hinge. */}
          <g ref={legLRef}>
            <path
              d="M13 21.5L13 28.1"
              stroke="var(--accent-clay)"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
            <g ref={kneeLRef}>
              <path
                d="M13 28.1L13 34.1"
                stroke="var(--accent-clay)"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
          <g ref={legRRef}>
            <path
              d="M13 21.5L13 28.1"
              stroke="var(--accent-clay)"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
            <g ref={kneeRRef}>
              <path
                d="M13 28.1L13 34.1"
                stroke="var(--accent-clay)"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* Torso group: this is what carries the bob, so the walk cycle never
              moves his feet off the card's edge. */}
          <g ref={torsoRef}>
            <g ref={armLRef}>
              <path
                d="M13 12.2C10.8 14.4 9.9 17.2 10 20.2"
                stroke="var(--accent-clay)"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
            <g ref={armRRef}>
              <path
                d="M13 12.2C15.2 14.4 16.1 17.2 16 20.2"
                stroke="var(--accent-clay)"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
            <path
              d="M13 11.4L13 21.5"
              stroke="var(--accent-clay)"
              strokeWidth="6.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="13" cy="6" r="4.2" fill="var(--accent-clay)" />
          </g>
        </svg>
      </div>
    </>
  );
}
