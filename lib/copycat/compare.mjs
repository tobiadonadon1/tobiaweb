// The measurable part of the judgement: who was first, by how much, whether
// the later one gave credit, and how much of the words they share.
import { get, gap, calendarDays } from "./util.mjs";

const lc = (s) => String(s || "").toLowerCase();

/** The ID a link points at, so x.com/a/status/1 and twitter.com/b/status/1 compare equal. */
export function key(url) {
  const s = String(url || "");
  const x = /(?:x|twitter)\.com\/(?:\w+|i(?:\/web)?)\/status(?:es)?\/(\d+)/i.exec(s);
  if (x) return `x:${x[1]}`;
  const app = /apps\.apple\.com\/.*?id(\d+)/i.exec(s);
  if (app) return `appstore:${app[1]}`;
  const play = /[?&]id=([\w.]+)/.exec(s);
  if (/play\.google\.com/.test(s) && play) return `play:${play[1]}`;
  const gh = /github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i.exec(s);
  if (gh) return `github:${lc(gh[1])}/${lc(gh[2])}`;
  try { const u = new URL(/^https?:/.test(s) ? s : `https://${s}`); return `web:${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`; } catch { return s; }
}
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };

export function order(a, b) {
  if (!a.when || !b.when) return { known: false, missing: [!a.when && "first link", !b.when && "second link"].filter(Boolean) };
  const ta = +new Date(a.when.iso), tb = +new Date(b.when.iso);
  const [earlier, later] = ta <= tb ? ["a", "b"] : ["b", "a"];
  const E = earlier === "a" ? a : b, L = earlier === "a" ? b : a;
  const ms = Math.abs(tb - ta);
  const dayPrecision = a.when.precision === "day" || b.when.precision === "day";
  return {
    known: true,
    earlier, later, ms,
    hours: Math.floor(ms / 36e5),
    days: dayPrecision ? calendarDays(E.when.iso, L.when.iso) : Math.floor(ms / 864e5),
    label: gap(E.when.iso, L.when.iso, { dayPrecision }),
    dayPrecision,
    swapped: earlier === "b",
    // Under two days apart, two people may simply have had the same idea.
    close: ms < 48 * 36e5,
    // A day-precision date can't order two things on the same calendar day.
    tie: dayPrecision && calendarDays(E.when.iso, L.when.iso) < 1,
    // "Existed by" (an archive capture) on the LATER side proves nothing:
    // that thing may be much older than its first capture.
    unproven: L.when.precision === "by" ? `${L.kind === "web" ? "the later site" : "the later one"}'s date is only when the archive first saw it; it may be older` : null,
  };
}

// Words that say "I remade something I saw". Only phrases that can't mean
// anything else: "credit card", "based on research" and "designed by me" don't count.
const CREDIT_WORDS = /\b(inspired by|inspo from|h\/t|hat ?tip|credit (?:to|goes to)|credits (?:to|go to)|shout ?out to|remake of|recreat(?:ed|ing|ion of|e)\b|rebuil(?:t|ding) (?:this|it|the)|clone of|my (?:take|version|attempt) (?:on|of)|original (?:by|from|post|design|idea)|concept by|idea from|saw (?:this|it) (?:on|from|by)|couldn'?t wait\b|had to (?:see if i could )?(?:build|make|recreate|try)|(?:built|made) (?:it|this|my own) (?:myself|too)|via @)/i;

/**
 * Did the later one credit the earlier one? Named credit (a quote, a reply,
 * a mention, a link, a GitHub fork) is credit. Credit words with no name
 * ("inspired by a post I saw") is noted but is not credit.
 */
export function credit(later, earlier, extra = []) {
  const signals = [];
  const eh = lc(earlier.handle);
  const ek = key(earlier.url);
  // One signal per kind, text and place: a page that links home forty times says it once.
  const say = (kind, text, where = "the post") => { if (!signals.some((x) => x.kind === kind && x.text === text && x.where === where)) signals.push({ kind, text, where }); };

  const check = (it, where) => {
    // A web page's own visible text counts as what it says.
    if (it.pageText) it = { ...it, text: [it.text, it.pageText].filter(Boolean).join("\n") };
    if (it.quote) {
      if (key(it.quote.url) === ek) say("quote", "quotes the original post", where);
      else if (eh && lc(it.quote.handle) === eh) say("quote", `quotes a post by @${earlier.handle}`, where);
    }
    if (it.replyTo) {
      if (`x:${it.replyTo.id}` === ek) say("reply", "replies to the original post", where);
      else if (eh && lc(it.replyTo.handle) === eh && where === "the post") say("reply", `replies to @${earlier.handle}`, where);
    }
    if (eh && earlier.kind === "x" && (it.mentions || []).some((m) => lc(m) === eh)) say("mention", `mentions @${earlier.handle}`, where);
    if (eh && earlier.kind !== "x" && new RegExp(`@${eh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(it.text || "")) say("mention", `mentions @${earlier.handle}`, where);
    for (const l of it.links || []) {
      if (key(l) === ek) say("link", "links to the original", where);
      // A link to the original's own site is credit; a link to the same platform (dribbble.com) is not.
      else if (earlier.kind === "web" && !earlier.platform && host(l) && host(l) === host(earlier.url)) say("link", `links to ${host(earlier.url)}`, where);
    }
    // Naming the original product counts for products (an app, a site), not for
    // posts, and only when the name is its own: "Habit Tracker" or "Notes" in a
    // competitor's description is the category, not a credit.
    if (earlier.title && earlier.kind !== "x" && earlier.kind !== "file") {
      const t = brand(earlier);
      const hit = t.length >= 4 && new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "iu").test(it.text || "");
      // Its own name too ("2048" and "2048"): saying it credits nobody.
      const own = later.title && new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "iu").test(later.title);
      if (hit && !own) generic(t) ? say("generic", `uses "${t}", but that's a generic name, not a credit`, where) : say("name", `names "${t}"`, where);
    }
    const w = CREDIT_WORDS.exec(it.text || "");
    if (w) say("words", `says "${w[0].trim()}"`, where);
  };

  check(later, { x: "the post", web: "the page", appstore: "the listing", play: "the listing", github: "the repo", youtube: "the description" }[later.kind] || "the post");
  for (const r of extra) check(r, "a reply by the same account");
  if (later.kind === "github" && later.extra?.fork && earlier.kind === "github" && [later.extra.parent, later.extra.source].some((u) => u && key(u) === ek)) say("fork", "is a GitHub fork of it (the fork link is the credit)");

  // Credit given to SOMEONE ELSE: the later one may be a copy of a third
  // thing, and the earlier one may not be the original at all.
  const elsewhere = [];
  const lk = key(later.url);
  const lh = host(later.url);
  for (const it of [later, ...extra]) {
    // A page's own menu and its social profiles aren't sources.
    for (const l of it.links || []) { const k = key(l); if (k !== ek && k !== lk && host(l) !== lh && !/\/(photo|video)\/\d+$/.test(l) && !SOCIAL.test(l) && !PROFILE.test(l)) elsewhere.push(l); }
    if (it.quote?.url && key(it.quote.url) !== ek) elsewhere.push(it.quote.url);
  }
  const named = signals.some((s) => s.kind !== "words" && s.kind !== "generic");
  return { named, wordsOnly: !named && signals.some((s) => s.kind === "words"), signals, elsewhere: [...new Set(elsewhere)].slice(0, 6) };
}

const PROFILE = /^https?:\/\/(?:www\.)?(?:x|twitter|instagram|facebook|linkedin|youtube|tiktok|threads|discord|reddit|github|dribbble|behance|medium)\.(?:com|net|gg)\/?[^/?#]*\/?$/i;

/**
 * The name a product goes by, from its title: "Duolingo: Learn Languages" →
 * Duolingo, "Linear – Plan and build" → Linear, and for a web page its
 * og:site_name when it has one ("Home | Kiln" → Kiln, not "Home").
 */
function brand(it) {
  if (it.kind === "web" && it.siteName) return it.siteName.trim();
  const parts = it.title.split(/\s*[|–—·:]\s*|\s-\s/).map((x) => x.replace(/[^\p{L}\p{N}]+$/u, "").trim()).filter(Boolean);
  if (!parts.length) return "";
  if (it.kind === "web") return parts.filter((x) => !generic(x)).sort((a, b) => a.length - b.length)[0] || parts[0];
  return parts[0];
}

// Links every listing carries that credit nobody.
const SOCIAL = /(privacy|terms|legal|support|help|eula|policy|contact|mailto:|apple\.com\/legal|instagram\.com\/?$|facebook\.com\/?$)/i;

// Words an app is named after when it's named after its category.
const GENERIC = new Set("home homepage welcome about blog index landing official site website page login sign up pricing docs habit habits tracker track notes note todo to-do do list lists tasks task budget money finance timer focus pomodoro calendar planner journal diary photo photos editor camera scanner pdf ai chat chatbot assistant app apps pro plus free lite daily simple easy smart my the best weather music player video fitness workout gym run running steps sleep water reminder reminders alarm clock calculator translator translate dictionary game games puzzle quiz flashcards learn language recipes recipe meal meals diet calorie calories counter widget widgets wallpaper wallpapers vpn browser mail email password manager wallet crypto stocks news reader podcast podcasts radio map maps notes+ habit+ goals goal mood meditation yoga breathe breathing".split(" "));
const generic = (name) => name.toLowerCase().split(/[^\p{L}\p{N}+-]+/u).filter(Boolean).every((w) => GENERIC.has(w) || STOP.has(w));

/* --------------------------------------------------------------- text */

const STOP = new Set("a an and are as at be but by for from has have i i'm im in is it it's its just me my of on or our so that the this to was we with you your it’s i’m".split(" "));
const words = (s) => lc(s).replace(/https?:\/\/\S+|@\w+|#/g, " ").replace(/[^\p{L}\p{N}'’ ]+/gu, " ").split(/\s+/).filter(Boolean);

/** Phrases of five or more words that appear in both texts, longest first. */
export function sharedPhrases(ta, tb, n = 5) {
  const A = words(ta), B = words(tb);
  if (A.length < n || B.length < n) return [];
  const grams = new Set();
  for (let i = 0; i + n <= B.length; i++) grams.add(B.slice(i, i + n).join(" "));
  const out = [];
  let i = 0;
  while (i + n <= A.length) {
    if (grams.has(A.slice(i, i + n).join(" "))) {
      let j = i + n;
      const Bs = ` ${B.join(" ")} `;
      while (j < A.length && Bs.includes(` ${A.slice(i, j + 1).join(" ")} `)) j++;
      const phrase = A.slice(i, j);
      if (phrase.some((w) => !STOP.has(w))) out.push(phrase.join(" "));
      i = j;
    } else i++;
  }
  return [...new Set(out)].sort((x, y) => y.length - x.length).slice(0, 8);
}

export function wordOverlap(ta, tb) {
  const A = new Set(words(ta).filter((w) => !STOP.has(w) && w.length > 2));
  const B = new Set(words(tb).filter((w) => !STOP.has(w) && w.length > 2));
  if (!A.size || !B.size) return 0;
  let both = 0;
  for (const w of A) if (B.has(w)) both++;
  return Math.round((both / (A.size + B.size - both)) * 100) / 100;
}

/** 0..1, how alike two names are (1 = the same after lowercasing and dropping punctuation). */
export function nameLikeness(x, y) {
  const a = lc(x).replace(/[^\p{L}\p{N}]/gu, ""), b = lc(y).replace(/[^\p{L}\p{N}]/gu, "");
  if (!a || !b) return 0;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return Math.round((1 - d[a.length][b.length] / Math.max(a.length, b.length)) * 100) / 100;
}

/** The later account's own replies under its post: credit is often given there. */
export async function ownReplies(it) {
  if (it.kind !== "x" || !it.id || !it.available) { const none = []; none.ok = it.kind === "x" ? false : true; return none; }
  const out = [];
  let ok = true;
  const t = await get(`https://api.fxtwitter.com/2/thread/${it.id}`, { json: true });
  if (!t?.thread) ok = false;
  for (const r of t?.thread || []) if (r.id !== it.id) out.push(r);
  // Replies come a page at a time; read a few pages, and say so if they didn't load.
  let cursor = null;
  for (let p = 0; p < 4; p++) {
    const c = await get(`https://api.fxtwitter.com/2/conversation/${it.id}${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`, { json: true });
    if (!c?.replies) { if (p === 0) ok = false; break; }
    for (const r of c.replies) if (lc(r.author?.screen_name) === lc(it.handle) && !out.some((o) => o.id === r.id)) out.push(r);
    cursor = c.cursor?.bottom;
    if (!cursor || !c.replies.length) break;
  }
  // A reply starts with hidden @names X adds itself; those aren't the author's words.
  const list = out.map((r) => {
    const from = r.raw_text?.display_text_range?.[0] ?? 0;
    const shown = r.raw_text?.text != null ? [...r.raw_text.text].slice(from).join("") : r.text || "";
    return {
    url: r.url,
    text: shown.replace(/https:\/\/t\.co\/\w+/g, (s) => (r.raw_text?.facets || []).find((f) => f.original === s)?.replacement || s),
    links: (r.raw_text?.facets || []).filter((f) => f.type === "url" && f.replacement).map((f) => f.replacement),
    mentions: (r.raw_text?.facets || []).filter((f) => f.type === "mention" && (f.indices?.[0] ?? 0) >= from).map((f) => f.original),
    quote: r.quote ? { url: r.quote.url, handle: r.quote.author?.screen_name, id: r.quote.id } : null,
    replyTo: null,
  };
  });
  list.ok = ok;
  return list;
}

/** What other people said under the later post: someone may already have named the original. */
export async function othersSaid(it, earlier) {
  if (it.kind !== "x" || !it.id || !it.available) return [];
  const c = await get(`https://api.fxtwitter.com/2/conversation/${it.id}`, { json: true });
  const eh = lc(earlier?.handle);
  return (c?.replies || [])
    .filter((r) => lc(r.author?.screen_name) !== lc(it.handle))
    .filter((r) => /\b(cop(y|ied|ycat)|stole|original|ripped|clone|credit|same as|looks like)\b/i.test(r.text || "") || (eh && lc(r.text).includes(`@${eh}`)))
    .slice(0, 6)
    .map((r) => ({ url: r.url, by: r.author?.screen_name, text: (r.text || "").slice(0, 200) }));
}
