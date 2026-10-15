import { botShape, type BotSpec } from "./grok-army-bots";

/**
 * VIRAL MACHINE'S SIX: what the X manager does, one colour each, and the Grok
 * bot that wears it. The opening, the hero's crew and the tiles all read from
 * here, so a colour always means the same job.
 *
 * The bots are Grok Bot's own avatar shapes (grok-army-bots.ts): a flat shape
 * and two leaning pill eyes. On the opening each wears its colour's ink, with
 * eyes in the colour itself, so it reads as a cut-out of the ground.
 * fg is the ink each colour carries at AA.
 */
export const SIX = [
  { key: "account", word: "Reads your X.", sticker: "Your account", bg: "#2E66EE", fg: "#FFFFFF", shape: "circle" },
  { key: "niche", word: "Watches your niche.", sticker: "Your niche", bg: "#4DB39B", fg: "#05231B", shape: "square" },
  { key: "angles", word: "Finds the angle.", sticker: "Angles", bg: "#EF9440", fg: "#2A1300", shape: "triangle" },
  { key: "voice", word: "Writes like you.", sticker: "Your voice", bg: "#8152EE", fg: "#FFFFFF", shape: "diamond" },
  { key: "learns", word: "Learns every week.", sticker: "Learns weekly", bg: "#EC5A33", fg: "#230600", shape: "circle" },
  { key: "algo", word: "Knows the algorithm.", sticker: "X's algorithm", bg: "#16171B", fg: "#FFFFFF", shape: "disc" },
].map((s) => ({
  ...s,
  // On its own colour the bot is the ink with the colour for eyes; the metal
  // disc keeps its slot eyes.
  bot: { shape: s.shape, color: s.fg, eye: s.bg } as BotSpec,
  // On paper (the hero's crew), the bot is the colour with white eyes.
  crew: { shape: s.shape, color: s.key === "algo" ? "silver" : s.bg } as BotSpec,
})) as readonly Six[];

export type Key = "account" | "niche" | "angles" | "voice" | "learns" | "algo";
export type Six = {
  key: Key;
  word: string;
  sticker: string;
  bg: string;
  fg: string;
  shape: BotSpec["shape"];
  bot: BotSpec;
  crew: BotSpec;
};

/**
 * How long the button's speech bubble shows (viral-machine-cta.tsx; the CSS
 * animation .vm-ouch is the same length), and so how long the pill stays
 * after a click. Here, not in the client file, so the server page can read it.
 */
export const OUCH_MS = 1400;

export const C = Object.fromEntries(SIX.map((s) => [s.key, s])) as Record<Key, Six>;

/** One Grok bot in a 100 x 100 box. */
export function BotSvg({ spec, className = "", title }: { spec: BotSpec; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {botShape(spec, { key: "b" })}
    </svg>
  );
}
