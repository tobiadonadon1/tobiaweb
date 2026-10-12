import fs from "node:fs";
import { generateText, Output, type FilePart, type TextPart } from "ai";
import { z } from "zod";
import { normalise } from "./media.mjs";
import { who } from "./run.mjs";
import { day, short } from "./util.mjs";

/**
 * THE JUDGEMENT, AND THE GUARDS AROUND IT.
 *
 * The facts come from run.mjs. Claude (through Vercel's AI Gateway) looks at
 * the frames from both sides, with the same rules as the skill's
 * references/judging.md, and answers in a fixed shape: a verdict, the frames
 * to show, and what matches. Then `decide()` checks that answer against the
 * facts: a "no credit" stamp can't appear when the later one credits the
 * original, when they're under two days apart, or when there are fewer than
 * three matches, whatever the model said. The post is written from a fixed
 * template, never by the model, so it can't call anyone a name.
 */

export const MODEL = process.env.COPYCAT_MODEL || "anthropic/claude-opus-5.5";

export const VERDICTS = ["uncredited", "reupload", "credited", "similar", "too-close", "wrong-way", "same-account", "unknown"] as const;
export type Verdict = (typeof VERDICTS)[number];

const Answer = z.object({
  verdict: z.enum(VERDICTS),
  why: z.string().describe("One or two plain sentences for the person: what you found, in facts. No names called, no guesses about motives."),
  show: z.object({ earlier: z.string(), later: z.string() }).describe("The one frame label from each side where the likeness is easiest to see, e.g. E2 and L3."),
  matches: z.array(z.string()).max(4).describe("For uncredited/reupload/credited: 1 to 4 specific things visible in BOTH frames shown, each 34 characters or fewer, each starting with 'Same'. Empty otherwise."),
});
export type Answer = z.infer<typeof Answer>;

const RULES = `You are Copycat Detective. You decide whether a later post, app or site copies an earlier one, using only the facts and pictures given. Facts, not verdicts: never call anyone a copycat, thief or liar, never guess motives.

Decide in this order and stop at the first that applies:
1. Order unknown, a tie, or "unproven" in the facts → "unknown". The person said the first link is the suspected copy; if facts.suspect is "earlier" → "wrong-way".
2. sameAccount → "same-account".
3. credit.named is true (a quote, reply, mention, link or fork naming THIS original) → "credited".
4. pixels.same is true AND you can see it's the same picture (same moment, same pixels; maybe cropped, re-encoded, captioned) → "reupload".
5. Specific matches: list what the two share. Count an item only if it is visible in both pictures, specific (a different designer solving the same problem would almost certainly have done it differently), and true as written. Kinds: layout, visual (shapes, illustrations, mascots, effects), colour (shared accent colours with deltaE under about 3; never stock platform colours, black, white or grey), words (the same headline or unusual copy, read them in the pictures), flow, assets, rules (an original game mechanic, judged as of the earlier date).
   NEVER counts: standard iOS/Android/web components (tab bars, nav bars, sheets, toggles, card lists, search fields), dark or light mode, rounded corners, gradients, glass, the platform's stock colours and icons, a common app category, common charts or progress rings, the same framework or AI tool, a centred hero, a phone mockup on a plain background, that month's trends. Two people recreating the same famous product's UI copy that product, not each other.
   3+ specific matches of at least 2 kinds → candidate "uncredited". Fewer → "similar".
6. Under 48 hours apart (order.close) and not a reupload → "too-close", unless the later post's own words say it rebuilt something it saw (credit.wordsOnly) and there's no other source (credit.elsewhere empty).
7. If the later account posted an earlier version of the same thing before the first post (history.later.before), it may be theirs → "unknown".

Pick "show" frames that best show the likeness (same screen, same moment). Matches: 1 to 4, each 34 characters or fewer, each starting with "Same", most specific first. "why": one or two short plain sentences with the key facts (who first, how much later, credit or not), written for the person who asked.`;

/** A small JPEG of a frame for the model (640 px wide). */
function small(file: string): Buffer | null {
  try {
    const out = file.replace(/(\.\w+)$/, ".s$1");
    if (!fs.existsSync(/*turbopackIgnore: true*/ out)) normalise(file, out, null, 640);
    return fs.readFileSync(/*turbopackIgnore: true*/ out);
  } catch {
    return null;
  }
}

// The case is the skill's JSON, read loosely on purpose (it comes from plain JavaScript).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Kase = Record<string, any>;

type Frame = { label: string; file: string; from: string; size?: { width: number; height: number } | null };

/** The facts the model needs, without file paths or long text. */
function brief(k: Kase) {
  const side = (it: Kase) => ({ who: who(it), kind: it.kind, url: it.url, when: it.when, title: it.kind !== "x" ? it.title : undefined, text: (it.text || "").slice(0, 600), followers: it.followers ?? undefined });
  return {
    earlier: side(k.earlier),
    later: side(k.later),
    order: k.order,
    suspect: k.suspect,
    sameAccount: k.sameAccount,
    credit: k.credit,
    creditRead: k.creditRead,
    laterReplies: k.laterReplies?.slice(0, 5),
    othersSaid: k.othersSaid?.slice(0, 4),
    history: { later: k.history?.later ? { covers: k.history.later.covers, failed: k.history.later.failed, before: k.history.later.before?.map((p: Kase) => ({ at: p.at, text: p.text.slice(0, 160) })) } : null },
    pixels: k.pixels,
    colours: k.colours ? { shared: k.colours.shared } : null,
    words: k.words,
  };
}

export async function judge(k: Kase): Promise<Answer> {
  // Frames most likely to show the likeness first: the closest pairs, then the rest.
  const order = (side: "earlier" | "later", key: "e" | "l"): Frame[] => {
    const list: Frame[] = k.frames[side];
    const first = (k.pixels?.closest || []).map((p: Kase) => p[key]);
    return [...list].sort((a, b) => (first.includes(a.label) ? 0 : 1) - (first.includes(b.label) ? 0 : 1)).slice(0, 5);
  };
  const content: (TextPart | FilePart)[] = [{ type: "text", text: `FACTS (JSON):\n${JSON.stringify(brief(k))}` }];
  for (const [side, key, name] of [["earlier", "e", "EARLIER"], ["later", "l", "LATER"]] as const) {
    for (const f of order(side, key)) {
      const img = small(f.file);
      if (!img) continue;
      content.push({ type: "text", text: `${name} frame ${f.label} (${f.from}):` });
      content.push({ type: "file", mediaType: "image/jpeg", data: img });
    }
  }
  const { output } = await generateText({
    model: MODEL,
    system: RULES,
    messages: [{ role: "user", content }],
    output: Output.object({ schema: Answer }),
    maxOutputTokens: 1200,
  });
  return output;
}

export type Decision = {
  verdict: Verdict;
  headline: string;
  why: string;
  receipt: boolean;
  show: { earlier: Frame; later: Frame } | null;
  matches: string[];
  post: string | null;
  intent: string | null;
};

const HEAD: Record<Verdict, string> = {
  uncredited: "No credit.",
  reupload: "Same picture, no credit.",
  credited: "Credited.",
  similar: "Just similar.",
  "too-close": "Too close to call.",
  "wrong-way": "Wrong way round.",
  "same-account": "Same account.",
  unknown: "Not enough to go on.",
};

/** The model's answer, held to the facts. */
export function decide(k: Kase, a: Answer | null): Decision {
  const ord = k.order || {};
  const named = !!k.credit?.named;
  const admitted = !!k.credit?.wordsOnly && !(k.credit?.elsewhere || []).length;
  let v: Verdict = a?.verdict ?? "unknown";
  if (!ord.known || ord.tie || ord.unproven) v = "unknown";
  else if (k.suspect === "earlier") v = "wrong-way";
  else if (k.sameAccount) v = "same-account";
  else if (named) v = "credited";
  else if (v === "credited") v = "similar"; // the model can't invent a credit
  if (v === "reupload" && !k.pixels?.same) v = "uncredited";
  const matches = (a?.matches || []).map((m) => m.trim()).filter(Boolean).slice(0, 4).map((m) => (m.length > 40 ? m.slice(0, 39).replace(/\s+\S*$/, "") + "…" : m));
  if (v === "uncredited" && matches.length < 3) v = "similar";
  if (v === "uncredited" && ord.close && !admitted) v = "too-close";

  const pick = (side: "earlier" | "later", label?: string): Frame | null => {
    const list: Frame[] = k.frames?.[side] || [];
    return list.find((f) => f.label === label) || list.find((f) => !/app icon|share image/.test(f.from)) || list[0] || null;
  };
  const fe = pick("earlier", a?.show?.earlier), fl = pick("later", a?.show?.later);
  const receipt = ["uncredited", "reupload", "credited"].includes(v) && !!fe && !!fl && (v !== "credited" || matches.length > 0);

  const E = k.earlier, L = k.later;
  const why = a?.why?.trim() || (ord.known ? `${who(L)} came ${ord.label}.` : "A date is missing, so the order can't be proven.");
  // The post: a fixed template (references/posting.md), never the model's words.
  const on = (it: Kase) => day(it.when.iso).replace(/, \d{4}$/, "");
  let post: string | null = null;
  if (v === "uncredited") post = `${who(E)} posted this on ${on(E)}.\n\nThis came out ${ord.label}, with no credit.\n\nOriginal: ${E.url}\n${L.url}`;
  if (v === "reupload") post = `This is ${who(E)}'s ${E.media?.some((m: Kase) => m.type !== "photo") ? "video" : "picture"} from ${on(E)}, reposted ${ord.label} with no credit.\n\nOriginal: ${E.url}\n${L.url}`;
  if (v === "credited" && receipt) post = `Nice remake of ${who(E)}'s work, credit included.\n\n${L.url}`;
  const intent = post ? `https://x.com/intent/post?${new URLSearchParams({ text: post }).toString().replace(/\+/g, "%20")}` : null;
  return { verdict: v, headline: HEAD[v], why, receipt, show: fe && fl ? { earlier: fe, later: fl } : null, matches: receipt ? matches : [], post, intent };
}

export const sources = (k: Kase) => ({ earlier: short(k.earlier.url), later: short(k.later.url) });
