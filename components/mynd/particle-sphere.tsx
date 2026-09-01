"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * THE SPHERE, AND ITS JOURNEY.
 *
 * A shell of particles wired to their nearest neighbours, so what you see is a
 * mesh with a front and a back, and it turns. Charge is dropped onto a random
 * particle roughly once a second and diffuses along the wires, so light
 * travels across the surface and dies out: a real diffusion over a real graph,
 * not a pile of independent twinkles.
 *
 * It no longer sits still behind the headline. The canvas is sticky for the
 * length of the hero plus the statement under it, and the shell TRAVELS: it
 * holds the middle of the screen while the hero leaves, moves across to the
 * dock beside "It reads what the company already writes down", and stays whole
 * there for the whole time that sentence takes to read.
 *
 * Then it goes, in four beats rather than a fade:
 *   1 an inhale. The shell tightens and the wires brighten.
 *   2 a flash on the terracotta as it lets go.
 *   3 the throw. Every particle leaves on its own beat, fast off the mark,
 *     along its own radius plus its own direction, and keeps travelling.
 *   4 the wires snap. Each one retracts hard towards one end and sparks as it
 *     does, instead of every wire dimming together.
 *
 * Every part of that is a pure function of one scroll progress `p`, driven by
 * a scrubbed ScrollTrigger. Nothing here fires once, so scrolling back up
 * retraces the same states in reverse and the shell reassembles exactly.
 *
 * AND BECAUSE OF THAT, it can come back. `mode="reform"` runs the same four
 * beats with the break progress counted DOWN instead of up, over the steps
 * section's own scroll: the pieces fade up out of nothing, gather, the wires
 * reach back to each other, and the flash fires at the moment the shell
 * becomes whole. Then it falls under gravity, lands, settles once, and stays
 * put for the rest of the page. Not a second animation — one subtraction.
 *
 * Cost control. Geometry is built once and memoised at module scope. The loop
 * allocates nothing but the two rects it measures: every buffer is a
 * preallocated typed array, edges are sorted into alpha buckets and stroked
 * once per bucket instead of nine hundred times, and the glow is one
 * pre-rendered sprite blitted per lit point. An IntersectionObserver stops the
 * loop the moment the stage leaves the screen. Under prefers-reduced-motion
 * there is no travel at all: the diffusion is stepped forward off-loop and one
 * settled frame is drawn in the middle of the hero.
 */

const COUNT = 700;
const NEIGHBOURS = 3;
/**
 * Camera distance in sphere radii. Sets how much perspective the shell has.
 *
 * The break has to respect it. A particle thrown past 2.7 in model space
 * crosses the eye: it projects through infinity, comes back as a giant blob,
 * and then to a negative depth, which is a NaN radius and a particle that
 * silently disappears. So the model only ever expands to about 2.0, well
 * inside the camera, and the cloud gets its real width in SCREEN space
 * instead, after the projection, where no such limit exists.
 */
const D = 2.7;
const P_MIN = D / (D + 1.06);
const P_MAX = D / (D - 1.06);
const P_SPAN = P_MAX - P_MIN;
const BUCKETS = 14;
const EDGE_ALPHA_MAX = 0.8;

/** Where, along the stage's scroll, the shell leaves the hero and arrives. */
const TRAVEL_IN = 0.07;
const TRAVEL_OUT = 0.32;
/**
 * And where it breaks.
 *
 * TWO THINGS WERE WRONG AND THEY PULLED AGAINST EACH OTHER. The break was too
 * quick, and there was most of a screen of blank paper between it and the next
 * section. But the blank paper WAS the break's runway: the canvas is sticky
 * for the length of the stage, so every pixel of padding under the sentence is
 * a pixel of scroll the shell has to come apart in. Shortening the gap by
 * itself would only have made the break faster still.
 *
 * So the two were separated. The journey no longer ends where the stage stops
 * holding the screen ("bottom bottom"); it ends where the stage leaves it
 * entirely ("bottom top"). The shell therefore keeps coming apart while the
 * page carries it up and away, which means the runway is no longer bounded by
 * the padding, and the padding could be cut (88vh to 55vh) without taking
 * anything from the break. What used to be blank paper is now debris drifting
 * off the top of the screen as the next section arrives.
 *
 * Net: the break runs over roughly twice the scroll it used to, and the gap
 * after it is a third shorter.
 */
const BREAK_IN = 0.52;
const BREAK_OUT = 1;

/**
 * THE RETURN, on the steps section's own scroll (`mode="reform"`).
 *
 * Nothing here is a second animation. The break was authored as a pure
 * function of one number, so playing that number BACKWARDS is the whole
 * reassembly: the debris fades up out of nothing, the wires reach back to
 * each other instead of snapping, and the flash that fired when the shell let
 * go now fires at the moment it becomes whole again.
 *
 * Then it falls. The shell forms in the air above the section, drops under
 * something that reads as gravity rather than a glide, lands, settles once,
 * and stays exactly there for the rest of the page. That last part is the
 * point: it is the same body that came apart, back together and staying put.
 */
const REFORM_IN = 0.16;
const REFORM_OUT = 0.6;
const FALL_IN = 0.56;
const FALL_OUT = 0.84;
/** How long the one settle after the landing takes, in the same progress. */
const LAND_SPAN = 0.13;

type Geo = {
  bx: Float32Array;
  by: Float32Array;
  bz: Float32Array;
  phase: Float32Array;
  /** Per-particle break: a direction to fly off in, and how eagerly. */
  jx: Float32Array;
  jy: Float32Array;
  jz: Float32Array;
  jr: Float32Array;
  ea: Int32Array;
  eb: Int32Array;
};

let GEO: Geo | null = null;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
/**
 * A floor with no corner on it. Used to stop the shell following the dock off
 * the top of the screen once the sentence has been read: a hard clamp would
 * put a kink in the travel, this just leans on it.
 */
const softFloor = (v: number, floor: number, k: number) => {
  const t = (v - floor) / k;
  if (t > 18) return v;
  return floor + k * Math.log1p(Math.exp(t));
};

/** Fibonacci shell, then every point reaches for its three nearest. */
function buildGeo(): Geo {
  const bx = new Float32Array(COUNT);
  const by = new Float32Array(COUNT);
  const bz = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);
  const jx = new Float32Array(COUNT);
  const jy = new Float32Array(COUNT);
  const jz = new Float32Array(COUNT);
  const jr = new Float32Array(COUNT);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Fixed seed: the break looks the same on every load and on every replay.
  let s = 20260828 >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    bx[i] = Math.cos(th) * r;
    by[i] = y;
    bz[i] = Math.sin(th) * r;
    phase[i] = (i * 1.61803) % (Math.PI * 2);
    jx[i] = rnd() * 2 - 1;
    jy[i] = rnd() * 2 - 1;
    jz[i] = rnd() * 2 - 1;
    jr[i] = rnd();
  }

  const pairs = new Set<number>();
  const best = new Float64Array(NEIGHBOURS);
  const bestIdx = new Int32Array(NEIGHBOURS);

  for (let i = 0; i < COUNT; i++) {
    best.fill(Infinity);
    bestIdx.fill(-1);
    for (let j = 0; j < COUNT; j++) {
      if (j === i) continue;
      const dx = bx[j] - bx[i];
      const dy = by[j] - by[i];
      const dz = bz[j] - bz[i];
      const d = dx * dx + dy * dy + dz * dz;
      if (d >= best[NEIGHBOURS - 1]) continue;
      let k = NEIGHBOURS - 1;
      while (k > 0 && best[k - 1] > d) {
        best[k] = best[k - 1];
        bestIdx[k] = bestIdx[k - 1];
        k--;
      }
      best[k] = d;
      bestIdx[k] = j;
    }
    for (let k = 0; k < NEIGHBOURS; k++) {
      const j = bestIdx[k];
      if (j < 0) continue;
      pairs.add(i < j ? i * COUNT + j : j * COUNT + i);
    }
  }

  const ea = new Int32Array(pairs.size);
  const eb = new Int32Array(pairs.size);
  let n = 0;
  pairs.forEach((key) => {
    ea[n] = Math.floor(key / COUNT);
    eb[n] = key % COUNT;
    n++;
  });
  return { bx, by, bz, phase, jx, jy, jz, jr, ea, eb };
}

function geometry(): Geo {
  if (!GEO) GEO = buildGeo();
  return GEO;
}

/** One soft terracotta disc, rendered once, blitted under every lit point. */
function makeGlow(): HTMLCanvasElement {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(196,98,59,0.85)");
    grad.addColorStop(0.35, "rgba(196,98,59,0.30)");
    grad.addColorStop(1, "rgba(196,98,59,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

/** The haze the shell sits in, so it reads as a body and not as a wireframe. */
function makeHaze(): HTMLCanvasElement {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(196,98,59,0.14)");
    grad.addColorStop(0.42, "rgba(196,98,59,0.07)");
    grad.addColorStop(0.78, "rgba(196,98,59,0.014)");
    grad.addColorStop(1, "rgba(196,98,59,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

export function ParticleSphere({
  mode = "break",
  className = "",
}: {
  /**
   * "break"  the hero shell: it travels to the dock beside the sentence and
   *          comes apart there.
   * "reform" the return: it gathers out of nothing at the top of the steps
   *          section, falls, and stays.
   */
  mode?: "break" | "reform";
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geo = geometry();
    const { bx, by, bz, phase, jx, jy, jz, jr, ea, eb } = geo;
    const edgeCount = ea.length;

    const reform = mode === "reform";

    // The elements the journey is measured against. Breaking: the stage it is
    // stuck to, and the empty square beside the statement it travels towards.
    // Reforming: the section it gathers over, and no dock at all.
    const stage = wrap.closest<HTMLElement>(
      reform ? "[data-sphere-reform]" : "[data-sphere-stage]",
    );
    const dock = reform
      ? null
      : (stage?.querySelector<HTMLElement>("[data-sphere-dock]") ?? null);

    /** The one number the whole journey is a function of. */
    const journey = { p: 0 };

    /* ---------------- preallocated scratch ---------------- */
    const sx = new Float32Array(COUNT);
    const sy = new Float32Array(COUNT);
    const df = new Float32Array(COUNT);
    /** Distance along the view axis, so the silhouette can be lit. */
    const dz = new Float32Array(COUNT);
    const pr = new Float32Array(COUNT);
    const energy = new Float32Array(COUNT);
    const flow = new Float32Array(COUNT);
    // Alpha buckets of edges, each a flat [x1,y1,x2,y2] run.
    const segs: Float32Array[] = [];
    const segN = new Int32Array(BUCKETS);
    for (let b = 0; b < BUCKETS; b++) segs.push(new Float32Array(edgeCount * 4));
    // Points bucketed the same way, so a bucket is one fill.
    const PT_BUCKETS = 8;
    const ptIdx: Int32Array[] = [];
    const ptN = new Int32Array(PT_BUCKETS);
    for (let b = 0; b < PT_BUCKETS; b++) ptIdx.push(new Int32Array(COUNT));
    const litIdx = new Int32Array(COUNT);

    const glow = makeGlow();
    const haze = makeHaze();

    let w = 0;
    let h = 0;
    let seed = 20260828;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    /* ---------------- diffusion over the mesh ---------------- */
    let emitAt = 0.35;
    const step = (dt: number, t: number) => {
      if (t >= emitAt) {
        emitAt = t + 0.42 + rand() * 0.55;
        energy[(rand() * COUNT) | 0] = 1;
        energy[(rand() * COUNT) | 0] = 0.75;
        if (rand() > 0.55) energy[(rand() * COUNT) | 0] = 0.55;
      }
      flow.fill(0);
      const rate = Math.min(0.5, dt * 5.2);
      for (let k = 0; k < edgeCount; k++) {
        const a = ea[k];
        const b = eb[k];
        const d = (energy[a] - energy[b]) * rate * 0.2;
        flow[a] -= d;
        flow[b] += d;
      }
      const decay = Math.exp(-dt / 1.3);
      for (let i = 0; i < COUNT; i++) {
        const v = (energy[i] + flow[i]) * decay;
        energy[i] = v < 0.0015 ? 0 : v;
      }
    };

    /* ---------------- the frame ---------------- */
    const draw = (t: number) => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      /* ---- where the shell is, this scroll position ---- */
      const p = journey.p;
      let cx: number;
      let cy: number;
      let R: number;
      /** Raw break progress. Every beat below is a slice of this one number. */
      let brk: number;

      if (reform) {
        // THE RETURN. One subtraction is the entire reassembly: every beat of
        // the break already reads this number, so running it down from 1 to 0
        // gathers the debris, reaches the wires back to each other and fires
        // the flash on the way IN rather than on the way out.
        brk = 1 - smooth(ramp(p, REFORM_IN, REFORM_OUT));

        // Wide: it keeps to the right, clear of the heading's measure, in the
        // half of the row that carries nothing, and comes to rest on the four
        // steps' own rule.
        //
        // Narrow: there is no clear half. Nothing on a phone can hold a two
        // hundred pixel object away from the type, so it stops pretending to
        // and settles CENTRED BEHIND the heading as a watermark — smaller,
        // and placed so the whole shell is inside the section rather than
        // half cut off by the top of the screen.
        const wide = w >= 1024;
        cx = w * (wide ? 0.76 : 0.5);
        R = wide
          ? Math.min(w * 0.15, h * 0.17)
          : Math.min(w * 0.21, h * 0.1);

        // The shell gathers just above the section's own top edge. Higher
        // than that and it forms on top of the film in the section above,
        // which reads as a mistake rather than as something arriving.
        const topY = h * (wide ? 0.14 : 0.1);
        const restY = h * (wide ? 0.46 : 0.33);
        // Gravity, not a glide: it accelerates the whole way down.
        const fall = ramp(p, FALL_IN, FALL_OUT);
        cy = topY + (restY - topY) * fall * fall;
        // And it lands. One short settle, damped to nothing, and then it
        // simply stays there for the rest of the page.
        const land = ramp(p, FALL_OUT, FALL_OUT + LAND_SPAN);
        if (land > 0 && land < 1) {
          cy -= Math.sin(land * Math.PI * 2) * (1 - land) * R * 0.18;
        }
      } else {
        // Eased so the shell leaves and lands slowly and crosses quickly.
        const trav = smooth(ramp(p, TRAVEL_IN, TRAVEL_OUT));
        brk = ramp(p, BREAK_IN, BREAK_OUT);

        // Home: the middle of the hero. Under `sm:` the title is lifted clear
        // of the bottom nav, so the shell's home is lifted with it.
        const homeX = w / 2;
        const homeY = h / 2 - (w < 640 ? 62 : 0);
        const homeR = Math.min(w * 0.46, h * 0.36);

        cx = homeX;
        cy = homeY;
        R = homeR;
        if (dock && trav > 0) {
          // Read live rather than cached: the dock rides the page, so as the
          // reader keeps scrolling the shell keeps station beside the
          // sentence.
          const d = dock.getBoundingClientRect();
          const c = canvas.getBoundingClientRect();
          const dx = d.left + d.width / 2 - c.left;
          const dy = d.top + d.height / 2 - c.top;
          const dr = Math.min(d.width, d.height) * 0.44;
          cx = homeX + (dx - homeX) * trav;
          cy = homeY + (dy - homeY) * trav;
          R = homeR + (dr - homeR) * trav;
          // Past the sentence the dock keeps climbing, and following it would
          // break the shell off the top of the screen where nobody is
          // looking. Lean on a floor instead, faded in with the travel so
          // there is no step when the tracking starts. Still a pure function
          // of scroll.
          //
          // The floor sits higher on a narrow screen. There the shell is
          // above the sentence rather than beside it, so holding it at the
          // middle of the viewport would put the whole break on top of the
          // type.
          const floor = h * (w < 640 ? 0.2 : 0.36);
          cy += (softFloor(cy, floor, h * 0.09) - cy) * trav;
        }
      }

      /* ---- the break, in beats ---- */
      // 1 the inhale: it tightens, then lets that go into the throw.
      const inhale = smooth(ramp(brk, 0, 0.18));
      const release = smooth(ramp(brk, 0.18, 0.34));
      const pull = inhale * (1 - release);
      const shellScale = 1 - 0.12 * pull;
      // 2 the flash: a short brightening on the terracotta at the moment of
      //   release, on the points, the wires and the haze together.
      const flash =
        smooth(ramp(brk, 0.1, 0.21)) * (1 - smooth(ramp(brk, 0.21, 0.46)));
      // 3 the throw.
      const thrown = ramp(brk, 0.17, 1);
      // 4 the wires: their own beat, and gone well before the debris is.
      const snapT = ramp(brk, 0.14, 0.5);
      const edgeFade = 1 - smooth(ramp(brk, 0.1, 0.54));
      // The fade lags the separation on purpose. If both ran together the
      // shell would just dim; letting the pieces leave at full strength first
      // is what makes it read as a break rather than a dissolve.
      const bodyFade = 1 - smooth(ramp(brk, 0.44, 1));
      const rs = Math.max(0.6, Math.min(1.2, R / 320));

      if (bodyFade <= 0.002) return;

      // The body it sits in. It blooms on the flash and is gone soon after,
      // because once the shell is debris there is no body left to haze.
      // The body goes with the pieces: it tightens on the inhale, blooms once
      // on the flash, then opens out with the cloud and thins away. It must
      // not simply sit there, or the break reads as a shape fading behind a
      // constant smudge.
      const hazeFade = bodyFade * (1 - smooth(ramp(brk, 0.16, 0.44)));
      if (hazeFade > 0.004) {
        const hz = R * 2.9 * shellScale * (1 + thrown * 0.55);
        ctx.globalAlpha = Math.min(1, hazeFade * (1 + flash * 0.6));
        ctx.drawImage(haze, cx - hz / 2, cy - hz / 2, hz, hz);
        ctx.globalAlpha = 1;
      }

      // A quarter turn of extra rotation across the break: the shell is not
      // just expanding, it is being turned by whatever let go of it.
      const yaw = t * 0.085 + smooth(ramp(brk, 0.14, 1)) * 0.44;
      const pitch = -0.3 + Math.sin(t * 0.107) * 0.17;
      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      ptN.fill(0);
      let litN = 0;

      for (let i = 0; i < COUNT; i++) {
        const br = 1 + Math.sin(t * 0.55 + phase[i]) * 0.045;
        const lead = jr[i];
        // Its own beat: the eager ones are already gone while the rest are
        // still letting go, which is what gives the break an edge.
        let tp = (thrown - lead * 0.14) / (1 - lead * 0.14);
        tp = tp < 0 ? 0 : tp > 1 ? 1 : tp;
        const u = 1 - tp;
        // Off the mark quickly, then a drift that never quite stops: debris
        // that is still travelling when it finally fades out. The burst was
        // cubic and read as an explosion; quadratic reaches exactly the same
        // place, about a fifth less violently in the first instant, which is
        // what a shell coming apart should look like next to one detonating.
        const g = (1 - u * u) * 0.92 + tp * 0.46;
        // In model space it only opens a little, and every particle leaves
        // along its own radius plus its own direction. The width comes after
        // the projection.
        const out = br * shellScale * (1 + g * (0.1 + lead * 0.34));
        const sc = g * 0.14;
        const x = bx[i] * out + jx[i] * sc;
        const y = by[i] * out + jy[i] * sc;
        const z = bz[i] * out + jz[i] * sc;
        const x1 = x * cyaw + z * syaw;
        const z1 = z * cyaw - x * syaw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;

        const persp = D / (D - z2);
        // Clamped rather than renormalised: the whole shell keeps exactly the
        // depth shading it always had, and the debris that has left it
        // saturates at the two ends instead of flattening everything else.
        let d = (persp - P_MIN) / P_SPAN;
        if (d < 0) d = 0;
        else if (d > 1) d = 1;
        df[i] = d;
        dz[i] = z2 < 0 ? -z2 : z2;
        // The throw, in screen space. This is what actually opens the cloud.
        const fly = R * persp * (1 + g * 1.25);
        sx[i] = cx + x1 * fly;
        sy[i] = cy + y2 * fly;

        const en = energy[i] * edgeFade;
        // Two things brighten a particle: how near the front of the shell it
        // is, and how close it is to the silhouette. The second is what makes
        // this read as a sphere rather than as a flat net: particles crowd at
        // the rim in projection, so the rim is where the shell has an edge.
        const rim = 1 - dz[i];
        const rim6 = rim * rim * rim;
        let radius =
          (0.42 + Math.pow(d, 1.25) * 1.95) *
          rs *
          (1 + tp * 1.7) *
          (1 + flash * 0.55);
        let alpha =
          (0.06 + Math.pow(d, 1.8) * 0.6 + rim6 * rim6 * 0.55) *
          (1 + flash * 0.55);
        if (en > 0.02) {
          radius *= 1 + en * 1.25;
          alpha = alpha + en * 0.75;
          litIdx[litN++] = i;
        }
        alpha *= bodyFade;
        if (alpha > 0.98) alpha = 0.98;
        pr[i] = radius;
        let b = ((alpha / 0.98) * PT_BUCKETS) | 0;
        if (b > PT_BUCKETS - 1) b = PT_BUCKETS - 1;
        if (b < 0) b = 0;
        ptIdx[b][ptN[b]++] = i;
      }

      /* ---- wires ---- */
      if (edgeFade > 0.004) {
        segN.fill(0);
        for (let k = 0; k < edgeCount; k++) {
          const a = ea[k];
          const bE = eb[k];
          const dd = (df[a] + df[bE]) * 0.5;
          const rimE = 1 - (dz[a] + dz[bE]) * 0.5;
          const r4 = rimE * rimE * rimE * rimE;
          let alpha = 0.014 + Math.pow(dd, 2.4) * 0.22 + r4 * r4 * 0.24;
          const en = energy[a] > energy[bE] ? energy[a] : energy[bE];
          if (en > 0.02) alpha += en * 0.34;
          // Each wire lets go on its own beat and whips back towards one end,
          // hard at first: a link snapping, not a rubber band relaxing. It
          // sparks as it goes, which is the only bright thing left by then.
          const cut = clamp01((snapT - jr[a] * 0.62) / 0.3);
          const rr = 1 - cut;
          const reach = rr * rr;
          const spark = cut * rr * 4;
          alpha = (alpha * (1 + spark * 1.25) + spark * 0.085) * edgeFade;
          let bu = ((alpha / EDGE_ALPHA_MAX) * BUCKETS) | 0;
          if (bu > BUCKETS - 1) bu = BUCKETS - 1;
          if (bu < 0) bu = 0;
          const buf = segs[bu];
          let n = segN[bu];
          const ax = sx[a];
          const ay = sy[a];
          buf[n++] = ax;
          buf[n++] = ay;
          buf[n++] = ax + (sx[bE] - ax) * reach;
          buf[n++] = ay + (sy[bE] - ay) * reach;
          segN[bu] = n;
        }

        ctx.lineWidth = 1 + flash * 0.55;
        for (let b = 0; b < BUCKETS; b++) {
          const n = segN[b];
          if (!n) continue;
          const buf = segs[b];
          ctx.strokeStyle = `rgba(196,98,59,${(((b + 0.5) / BUCKETS) * EDGE_ALPHA_MAX).toFixed(3)})`;
          ctx.beginPath();
          for (let s = 0; s < n; s += 4) {
            ctx.moveTo(buf[s], buf[s + 1]);
            ctx.lineTo(buf[s + 2], buf[s + 3]);
          }
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }

      /* ---- the particles ---- */
      for (let b = 0; b < PT_BUCKETS; b++) {
        const n = ptN[b];
        if (!n) continue;
        const list = ptIdx[b];
        ctx.fillStyle = `rgba(196,98,59,${(((b + 0.5) / PT_BUCKETS) * 0.98).toFixed(3)})`;
        ctx.beginPath();
        for (let s = 0; s < n; s++) {
          const i = list[s];
          const r = pr[i];
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      /* ---- the charge travelling over the surface ---- */
      for (let s = 0; s < litN; s++) {
        const i = litIdx[s];
        const en = energy[i] * edgeFade;
        const size = (11 + df[i] * 30) * rs * (0.42 + en) * (1 + flash * 0.7);
        ctx.globalAlpha =
          Math.min(0.9, en * (0.3 + df[i] * 0.75) * (1 + flash * 0.9)) *
          bodyFade;
        ctx.drawImage(glow, sx[i] - size / 2, sy[i] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------- sizing ---------------- */
    if (reduced) journey.p = reform ? 1 : 0;

    let dpr = 1;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    if (reduced) {
      // No journey at all: one still frame. In the hero that is the whole
      // shell in the middle of the screen; in the steps section it is the
      // shell already landed and at rest, which is the state that section is
      // about anyway. Not a dead frame either: the diffusion is run forward
      // off the clock so the shell already has charge travelling on it.
      journey.p = reform ? 1 : 0;
      for (let s = 0; s < 150; s++) step(1 / 60, s / 60);
      draw(0);
      return () => {
        ro.disconnect();
      };
    }

    /* ---------------- the journey ---------------- */
    // One scrubbed tween on one number. Every scroll position maps to a state,
    // so reversing costs nothing and reassembly is not a separate animation.
    const travel = stage
      ? gsap.fromTo(
          journey,
          { p: 0 },
          {
            p: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              // Breaking: from the moment the stage takes the screen to the
              // moment it has left it completely. Deliberately NOT "bottom
              // bottom", which is where the canvas stops being sticky: past
              // that point the shell rides the page upward, and letting the
              // break carry on through that ride is what buys it a runway
              // longer than the padding under the sentence.
              //
              // Reforming: nothing is pinned, and the shell has to have
              // gathered and landed while the section is still being read, so
              // progress runs from the section entering the viewport to its
              // foot reaching the bottom of it.
              start: reform ? "top bottom" : "top top",
              end: reform ? "bottom bottom" : "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        )
      : null;

    /* ---------------- the loop ---------------- */
    let raf = 0;
    let last = 0;
    let clock = 0;
    let running = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      clock += dt;
      step(dt, clock);
      draw(clock);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    // Webfonts change how tall the statement is, which moves the dock and the
    // end of the stage. Measure again once they have landed.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      travel?.scrollTrigger?.kill();
      travel?.kill();
    };
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
