import { createElement as h, type ReactElement } from "react";

/**
 * THE GROK ARMY BOTS, drawn once.
 *
 * Shaped like Grok Bot's own avatars, because a buyer should recognise their
 * bots on sight: one flat, solid shape each (a circle, a rounded triangle, a
 * rounded diamond, a soft square, a little trio of circles) with two white
 * pill eyes leaning the same way, high on the face. No mouth, no limbs, no
 * hats, badges or icons. The one you talk to is a brushed-metal disc with two
 * slot eyes cut through it, after the look Tobia picked.
 *
 * NO ROSTER. These are shapes and colours, not jobs: the buyer decides what
 * their bots do (and names them), so nothing here carries a name or a role.
 *
 * PLAIN createElement, NO JSX, NO HOOKS, NO STYLE OBJECTS. The same drawings
 * are rendered by the sales page (React), by the Setups card and the share
 * card (specimen-svg.ts walks these elements into an SVG string), and by the
 * script that renders the Stripe image in plain Node.
 *
 * Every bot lives in a 100 x 100 box.
 */

export type Shape = "disc" | "circle" | "triangle" | "diamond" | "square" | "trio";

export type BotSpec = { shape: Shape; color: string };

/** Grok Bot's avatar colours, plus a red Tobia asked for. */
export const COLORS = {
  teal: "#4db39b",
  orange: "#ef9440",
  indigo: "#5d57e6",
  violet: "#8152ee",
  blue: "#3f7bf3",
  red: "#ec5a33",
} as const;

const EYE = "#ffffff";
const SLOT = "#050505";

/** Two pill eyes, leaning like Grok Bot's: centred on (cx, cy), w x h each. */
function eyes(cx: number, cy: number, w: number, h2: number, gap: number, fill: string, className = "ga-eyes") {
  const pill = (x: number, y: number) =>
    h("rect", {
      x: x - w / 2,
      y: y - h2 / 2,
      width: w,
      height: h2,
      rx: w / 2,
      fill,
      transform: `rotate(-24 ${x} ${y})`,
    });
  return h("g", { className }, pill(cx - gap / 2, cy + gap * 0.12), pill(cx + gap / 2, cy - gap * 0.12));
}

/**
 * The metal: a few close stops at an angle read as brushed steel, and a soft
 * light from the top left. Gradient ids repeat when a page draws the disc
 * twice; the definitions are identical, so whichever one wins is right.
 */
function metalDefs() {
  return h(
    "defs",
    null,
    h(
      "linearGradient",
      { id: "ga-metal", x1: "0", y1: "0", x2: "1", y2: "1" },
      h("stop", { offset: "0", stopColor: "#f7f7f5" }),
      h("stop", { offset: "0.22", stopColor: "#dcdcda" }),
      h("stop", { offset: "0.4", stopColor: "#efefed" }),
      h("stop", { offset: "0.62", stopColor: "#bdbdbb" }),
      h("stop", { offset: "0.8", stopColor: "#d6d6d4" }),
      h("stop", { offset: "1", stopColor: "#9f9f9d" }),
    ),
    h(
      "linearGradient",
      { id: "ga-edge", x1: "0", y1: "0", x2: "1", y2: "1" },
      h("stop", { offset: "0", stopColor: "#8a8a88" }),
      h("stop", { offset: "1", stopColor: "#3c3c3b" }),
    ),
  );
}

function body(spec: BotSpec): ReactElement {
  const c = spec.color;
  switch (spec.shape) {
    case "disc":
      return h(
        "g",
        null,
        metalDefs(),
        // The coin's thickness, showing below and to the left.
        h("circle", { cx: 47, cy: 53.5, r: 45, fill: "url(#ga-edge)" }),
        h("circle", { cx: 50, cy: 50, r: 45, fill: "url(#ga-metal)" }),
        h("circle", { cx: 50, cy: 50, r: 44.4, fill: "none", stroke: "rgba(255,255,255,0.7)", strokeWidth: 1 }),
        // Slot eyes, cut through.
        eyes(60, 36, 11.5, 25, 19, SLOT),
      );
    case "circle":
      return h("g", null, h("circle", { cx: 50, cy: 50, r: 45, fill: c }), eyes(62, 34, 7.5, 15, 13, EYE));
    case "triangle":
      return h(
        "g",
        null,
        h("path", { d: "M50 14 L88 82 L12 82 Z", fill: c, stroke: c, strokeWidth: 18, strokeLinejoin: "round" }),
        eyes(58, 52, 7.5, 15, 13, EYE),
      );
    case "diamond":
      return h(
        "g",
        null,
        h("rect", { x: 19, y: 19, width: 62, height: 62, rx: 20, fill: c, transform: "rotate(45 50 50)" }),
        eyes(60, 38, 7.5, 15, 13, EYE),
      );
    case "square":
      return h("g", null, h("rect", { x: 7, y: 7, width: 86, height: 86, rx: 30, fill: c }), eyes(62, 34, 7.5, 15, 13, EYE));
    case "trio":
      return h(
        "g",
        null,
        h("circle", { cx: 50, cy: 28, r: 21, fill: COLORS.teal }),
        h("circle", { cx: 29, cy: 69, r: 24, fill: COLORS.indigo }),
        h("circle", { cx: 71, cy: 69, r: 24, fill: c }),
        eyes(56, 22, 4.6, 9, 8, EYE, "ga-eyes ga-eyes-a"),
        eyes(36, 64, 4.8, 9.5, 8.5, EYE, "ga-eyes ga-eyes-b"),
        eyes(78, 64, 4.8, 9.5, 8.5, EYE, "ga-eyes ga-eyes-c"),
      );
  }
}

/** The outline of a shape, for an empty place in the team. */
export function ghostShape(shape: Shape): ReactElement {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeDasharray: "5 6", vectorEffect: "non-scaling-stroke" } as const;
  switch (shape) {
    case "disc":
    case "circle":
      return h("circle", { cx: 50, cy: 50, r: 45, ...line });
    case "triangle":
      return h("path", { d: "M50 5 Q53 5 55 9 L96 82 Q98 91 88 91 L12 91 Q2 91 4 82 L45 9 Q47 5 50 5 Z", ...line });
    case "diamond":
      return h("rect", { x: 19, y: 19, width: 62, height: 62, rx: 20, transform: "rotate(45 50 50)", ...line });
    case "square":
      return h("rect", { x: 7, y: 7, width: 86, height: 86, rx: 30, ...line });
    case "trio":
      return h("g", null, h("circle", { cx: 50, cy: 28, r: 21, ...line }), h("circle", { cx: 29, cy: 69, r: 24, ...line }), h("circle", { cx: 71, cy: 69, r: 24, ...line }));
  }
}

/** One bot, placed: translate to (x, y), scale by s. */
export function botShape(
  spec: BotSpec,
  { x = 0, y = 0, s = 1, className, key }: { x?: number; y?: number; s?: number; className?: string; key?: string } = {},
): ReactElement {
  return h("g", { key: key ?? `${spec.shape}-${spec.color}-${x}-${y}`, transform: `translate(${x} ${y}) scale(${s})`, className }, body(spec));
}

/** The one you talk to. */
export const LEAD: BotSpec = { shape: "disc", color: "silver" };

/**
 * THE SQUAD, as a group in the specimen's 400 x 330 frame: the metal disc in
 * front and largest, the coloured bots gathered round it. Back ones first.
 */
export const SQUAD_LAYOUT: (BotSpec & { x: number; y: number; s: number })[] = [
  { shape: "circle", color: COLORS.teal, x: 34, y: 34, s: 0.66 },
  { shape: "triangle", color: COLORS.indigo, x: 286, y: 22, s: 0.74 },
  { shape: "diamond", color: COLORS.violet, x: 8, y: 168, s: 0.84 },
  { shape: "circle", color: COLORS.red, x: 304, y: 168, s: 0.8 },
  { shape: "square", color: COLORS.blue, x: 70, y: 262, s: 0.56 },
  { shape: "circle", color: COLORS.orange, x: 262, y: 266, s: 0.52 },
  { shape: "disc", color: "silver", x: 106, y: 66, s: 1.9 },
];

export function squadShapes(className?: (i: number) => string | undefined): ReactElement[] {
  return SQUAD_LAYOUT.map(({ x, y, s, ...spec }, i) => botShape(spec, { x, y, s, className: className?.(i), key: `sq-${i}` }));
}
