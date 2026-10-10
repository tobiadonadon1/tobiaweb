import { createElement as h, type ReactElement } from "react";

/**
 * THE GROK ARMY BOTS, drawn once.
 *
 * Original characters, not xAI's or Grok's mark: a rounded body, a dark
 * visor with two eyes and a small smile, short arms and feet, and one badge
 * on the chest that says the bot's job. The Earner's badge is a gold coin
 * with a "$" on it, which is the army's whole promise in one shape. The
 * Chief of Staff wears a cap instead of an antenna, so the one you talk to is
 * the one you can pick out.
 *
 * PLAIN createElement, NO JSX, NO HOOKS, NO STYLE OBJECTS. The same shapes are
 * drawn by the sales page (React), by the Setups card and the share card
 * (specimen-svg.ts walks these elements into an SVG string, so a style
 * object or a function prop would print wrong), and by the script that
 * renders the Stripe image in plain Node, where a .tsx file cannot load.
 *
 * Each bot lives in a 100 x 120 box, feet on y = 118.
 */

export type BotId = "chief" | "scout" | "voice" | "earner" | "outbound" | "inbox";

export type Bot = {
  id: BotId;
  /** What the page calls it. */
  name: string;
  /** Its job in a few words, for the label over its name. */
  role: string;
  /** What it does, in a sentence or two. */
  job: string;
  color: string;
  /** The antenna ball (the Chief has a cap instead). */
  tip: string;
  glyph: "star" | "lens" | "bubble" | "dollar" | "plane" | "envelope";
};

export const VISOR = "#18211a";

export const BOTS: Bot[] = [
  {
    id: "chief",
    name: "Chief of Staff",
    role: "The one you talk to",
    job: "Runs the others, sends you a short read-out every morning, and asks you before anything is sent, posted, bought or deleted.",
    color: "#ffc83d",
    tip: "#ff6b4a",
    glyph: "star",
  },
  {
    id: "scout",
    name: "Scout",
    role: "X research",
    job: "Reads X every day for what your audience asks about and what is working in your niche, and hands the best angles to the others.",
    color: "#5aa8ff",
    tip: "#ffc83d",
    glyph: "lens",
  },
  {
    id: "voice",
    name: "Voice",
    role: "Your X account",
    job: "Turns your real work into original posts in your voice. Each one waits in X, ready for you to tap Post.",
    color: "#ff6b4a",
    tip: "#5aa8ff",
    glyph: "bubble",
  },
  {
    id: "earner",
    name: "Earner",
    role: "Makes it pay",
    job: "Builds lead magnets and offers from what the army learns, and keeps a payback scoreboard against what your plan costs.",
    color: "#3fcf8b",
    tip: "#ffc83d",
    glyph: "dollar",
  },
  {
    id: "outbound",
    name: "Outbound",
    role: "Finds clients",
    job: "Finds the right people and drafts a real email to each. Nothing goes out until you approve it.",
    color: "#ff8ec2",
    tip: "#5aa8ff",
    glyph: "plane",
  },
  {
    id: "inbox",
    name: "Inbox",
    role: "Keeps up",
    job: "Sorts the replies and drafts your answers, so nobody waits on you and nothing gets lost.",
    color: "#b7a2ff",
    tip: "#ff6b4a",
    glyph: "envelope",
  },
];

export const BOT_BY_ID = Object.fromEntries(BOTS.map((b) => [b.id, b])) as Record<BotId, Bot>;

/** A five-pointed star around (cx, cy). */
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** The chest badge's symbol, centred on (50, 84). */
function glyph(kind: Bot["glyph"]): ReactElement {
  const line = { fill: "none", stroke: VISOR, strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (kind) {
    case "star":
      return h("polygon", { points: starPoints(50, 84.6, 7.6, 3.3), fill: VISOR });
    case "lens":
      return h(
        "g",
        null,
        h("circle", { cx: 48.4, cy: 82.4, r: 4.8, ...line }),
        h("path", { d: "M51.9 85.9 L55.6 89.6", ...line }),
      );
    case "bubble":
      return h("path", {
        d: "M44 77.5 H56 Q58 77.5 58 79.5 V86 Q58 88 56 88 H50 L45.6 91.6 L46.4 88 H44 Q42 88 42 86 V79.5 Q42 77.5 44 77.5 Z",
        fill: VISOR,
      });
    case "dollar":
      return h(
        "g",
        null,
        h("path", { d: "M50 74.6 V93.4", ...line, strokeWidth: 2.2 }),
        h("path", {
          d: "M54.6 79.4 C53.6 77.6 46.4 77.2 45.8 80.6 C45.2 83.8 54.6 83.2 54.4 87.2 C54.2 90.8 46.6 90.6 45.2 88.4",
          ...line,
          strokeWidth: 2.6,
        }),
      );
    case "plane":
      return h("path", { d: "M42 84 L58 77 L52.6 91.4 L49.6 86.6 Z", fill: VISOR });
    case "envelope":
      return h(
        "g",
        null,
        h("rect", { x: 42.4, y: 78.6, width: 15.2, height: 11, rx: 1.8, ...line, strokeWidth: 2.2 }),
        h("path", { d: "M42.8 79.4 L50 85 L57.2 79.4", ...line, strokeWidth: 2.2 }),
      );
  }
}

/**
 * One bot, placed: translate to (x, y), scale by s. `className` lands on the
 * bot's own group so the page can move it (the eyes carry `ga-eyes`, which
 * the page's CSS blinks).
 */
export function botShape(
  id: BotId,
  { x = 0, y = 0, s = 1, className, key, shadow = true }: { x?: number; y?: number; s?: number; className?: string; key?: string; shadow?: boolean } = {},
): ReactElement {
  const b = BOT_BY_ID[id];
  const c = b.color;
  const chief = id === "chief";
  return h(
    "g",
    { key: key ?? id, transform: `translate(${x} ${y}) scale(${s})`, className },
    shadow ? h("ellipse", { cx: 50, cy: 117, rx: 36, ry: 4.5, fill: "rgba(0,0,0,0.2)" }) : null,
    // Antenna, or the Chief's cap.
    chief
      ? h(
          "g",
          null,
          h("path", { d: "M20 25 C24 6 76 6 80 25 Z", fill: VISOR }),
          h("rect", { x: 12, y: 21, width: 76, height: 9, rx: 4.5, fill: VISOR }),
          h("polygon", { points: starPoints(50, 15, 5.4, 2.3), fill: c }),
        )
      : h(
          "g",
          null,
          h("rect", { x: 48, y: 5, width: 4, height: 16, rx: 2, fill: VISOR }),
          h("circle", { cx: 50, cy: 6.5, r: 6.5, fill: b.tip }),
        ),
    // Arms and feet, behind the body.
    h("rect", { x: 2, y: 60, width: 13, height: 26, rx: 6.5, fill: c }),
    h("rect", { x: 85, y: 60, width: 13, height: 26, rx: 6.5, fill: c }),
    h("rect", { x: 25, y: 98, width: 19, height: 18, rx: 7, fill: VISOR }),
    h("rect", { x: 56, y: 98, width: 19, height: 18, rx: 7, fill: VISOR }),
    // The body. The Chief's starts lower, under its cap.
    h("rect", { x: 10, y: chief ? 24 : 19, width: 80, height: chief ? 82 : 87, rx: 28, fill: c }),
    // The visor, the eyes, the smile.
    h("rect", { x: 20, y: 32, width: 60, height: 34, rx: 15, fill: VISOR }),
    h(
      "g",
      { className: "ga-eyes" },
      h("rect", { x: 33, y: 40, width: 10, height: 14, rx: 5, fill: "#ffffff" }),
      h("rect", { x: 57, y: 40, width: 10, height: 14, rx: 5, fill: "#ffffff" }),
    ),
    h("path", { d: "M44 58.6 Q50 62 56 58.6", fill: "none", stroke: "#ffffff", strokeWidth: 2.2, strokeLinecap: "round", opacity: 0.85 }),
    // The badge: a gold coin for the Earner, a pale disc for everyone else.
    h("circle", { cx: 50, cy: 84, r: 11.5, fill: id === "earner" ? "#ffd84d" : "rgba(255,255,255,0.88)" }),
    id === "earner" ? h("circle", { cx: 50, cy: 84, r: 11.5, fill: "none", stroke: VISOR, strokeWidth: 1.4, opacity: 0.35 }) : null,
    glyph(b.glyph),
  );
}

/**
 * THE SQUAD, as a group photo in the specimen's 400 x 330 frame: three at the
 * back, three in front, the Chief in the middle and largest, the Earner's coin
 * in the front row where it reads at thumbnail size.
 */
export const SQUAD_LAYOUT: { id: BotId; x: number; y: number; s: number }[] = [
  { id: "scout", x: 58, y: 46, s: 0.92 },
  { id: "outbound", x: 154, y: 30, s: 0.92 },
  { id: "inbox", x: 250, y: 46, s: 0.92 },
  { id: "earner", x: 14, y: 150, s: 1.12 },
  { id: "voice", x: 274, y: 150, s: 1.12 },
  { id: "chief", x: 128, y: 128, s: 1.44 },
];

export function squadShapes(className?: (id: BotId, i: number) => string | undefined): ReactElement[] {
  return SQUAD_LAYOUT.map((p, i) => botShape(p.id, { x: p.x, y: p.y, s: p.s, className: className?.(p.id, i) }));
}
