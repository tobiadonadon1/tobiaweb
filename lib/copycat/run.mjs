/**
 * COPYCAT DETECTIVE ON THE SERVER: the facts, before anyone judges anything.
 *
 * The website's version of the skill's check.mjs (~/.claude/skills/
 * copycat-detective): the same readers, dates, credit check and picture
 * comparison, minus the parts that need a desktop (contact sheets, page
 * photographs). Links only; every fetch goes through the public-internet
 * guard in util.mjs. Frames are written to a temporary folder the caller
 * removes.
 *
 * `say(step)` is called as each stage starts, so the page can show progress.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { download } from "./util.mjs";
import { resolve, kindOf, xTimeline, xTime } from "./sources.mjs";
import { order, credit, ownReplies, othersSaid, sharedPhrases, wordOverlap, nameLikeness, key } from "./compare.mjs";
import { ffmpeg, frames, normalise, hash, hamming, isBlank, correlation, sameness, trim, accents, sameAccents, size } from "./media.mjs";

const SOCIAL = new Set(["x", "tiktok", "instagram", "threads"]);
export const who = (it) => (it.handle ? (SOCIAL.has(it.kind) && !it.handle.startsWith("@") ? "@" + it.handle : it.handle) : it.title || String(it.url || "").replace(/^https?:\/\/(www\.)?/, ""));

/**
 * @param {{ links: string[], suspectFirst?: boolean }} opts
 * @param {(step: string) => void} [say]
 * @returns {Promise<{ dir: string, error?: string, needsOriginal?: boolean, item?: any, kase?: Record<string, any> }>}
 */
export async function runCheck({ links, suspectFirst = true }, say = (step) => {}) {
  const dir = fs.mkdtempSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ os.tmpdir(), "copycat-"));
  // Links only: never a path on this server.
  links = links.map((l) => String(l).trim()).filter(Boolean).slice(0, 2).map((l) => (/^https?:\/\//i.test(l) ? l : `https://${l}`));
  if (!links.length || links.some((l) => /\s/.test(l))) return { dir, error: "Paste a link that starts with https://." };
  say("read");
  const items = await Promise.all(links.map((l) => resolve(l)));
  for (const it of items) if (it.kind === "file" || it.kind === "missing-file" || it.kind === "unknown") return { dir, error: "Paste a link that starts with https://." };

  /* ---------------------------------------------- one link: find the original */
  let found = null;
  if (items.length === 1) {
    say("original");
    const later = items[0];
    const own = await ownReplies(later);
    const cands = [];
    if (later.quote?.url) cands.push({ url: later.quote.url, how: "it quotes this post" });
    if (later.replyTo?.url) cands.push({ url: later.replyTo.url, how: "it replies to this post" });
    if (later.kind === "github") for (const u of [later.extra?.parent, later.extra?.source]) if (u) cands.push({ url: u, how: "it's a fork of this" });
    const ownHost = (() => { try { return new URL(later.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
    const profile = /^https?:\/\/(?:www\.)?(?:x|twitter|instagram|facebook|linkedin|youtube|tiktok|threads|discord|reddit|github)\.(?:com|net|gg|me)\/?[^/]*\/?$/i;
    const saysRemade = later.kind !== "web" || /\b(inspired by|based on|remake of|recreat|clone of|credit (?:to|goes to)|original (?:by|from|design|idea)|h\/t)\b/i.test(later.pageText || "");
    if (saysRemade) for (const l of later.links || []) {
      let h = "";
      try { h = new URL(l).hostname.replace(/^www\./, ""); } catch { continue; }
      if (h === ownHost || profile.test(l) || kindOf(l) === "unknown") continue;
      cands.push({ url: l, how: "it links to this" });
    }
    for (const r of own) { if (r.quote?.url) cands.push({ url: r.quote.url, how: "its author quotes this in a reply" }); for (const l of r.links) cands.push({ url: l, how: "its author links to this in a reply" }); }
    const seen = new Set([key(later.url)]);
    const site = later.extra?.site ? (() => { try { return new URL(later.extra.site).hostname.replace(/^www\./, ""); } catch { return null; } })() : null;
    const list = cands.filter((c) => {
      const k = key(c.url);
      if (seen.has(k)) return false;
      seen.add(k);
      if (/\/(photo|video)\/\d+$/.test(c.url)) return false;
      const x = /(?:x|twitter)\.com\/(\w+)\/status\/(\d+)/i.exec(c.url);
      if (x && later.handle && x[1].toLowerCase() === later.handle.toLowerCase()) return false;
      if (x && later.when && xTime(x[2]) && +xTime(x[2]) >= +new Date(later.when.iso)) return false;
      try { const h = new URL(c.url).hostname.replace(/^www\./, ""); if (site && h === site) return false; } catch {}
      if (/(privacy|terms|legal|support|help|eula|policy|contact)/i.test(c.url)) return false;
      return true;
    });
    if (!list.length) return { dir, needsOriginal: true, item: later };
    found = { ...list[0], others: list.slice(1).map((c) => c.url) };
    items.push(await resolve(list[0].url));
  }

  /* ------------------------------------------------------------ the order */
  const ord = order(items[0], items[1]);
  const known = ord.known && !ord.tie;
  const E = known ? items[ord.earlier === "a" ? 0 : 1] : found ? items[1] : items[0];
  const L = known ? items[ord.later === "a" ? 0 : 1] : found ? items[0] : items[1];
  const sameAccount = !!(E.handle && L.handle && E.handle.toLowerCase() === L.handle.toLowerCase() && E.kind === L.kind);
  // On the page the first box is the one they suspect.
  const suspect = known && suspectFirst && links.length === 2 ? (items[0] === L ? "later" : "earlier") : null;

  /* --------------------------------------------------------- the credit */
  say("credit");
  const replies = await ownReplies(L);
  const cred = credit(L, E, replies);
  const others = await othersSaid(L, E);
  const history = {};
  for (const [side, it] of [["later", L], ["earlier", E]]) {
    if (it.kind !== "x" || !it.handle || !it.when || !it.available) continue;
    const t = await xTimeline(it.handle, { pages: 2 });
    history[side] = { failed: t.failed, reachesBackTo: t.reachesBackTo, covers: !!t.reachesBackTo && t.reachesBackTo < it.when.iso, before: t.posts.filter((p) => p.at < it.when.iso && p.id !== it.id).slice(-10) };
  }

  /* ------------------------------------------------------------ the media */
  say("media");
  const pics = { E: [], L: [] };
  const notes = [];
  if (!ffmpeg()) notes.push("ffmpeg is missing on the server, so pictures weren't compared.");
  else {
    fs.mkdirSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ dir, "frames"), { recursive: true });
    const stamp = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`;
    for (const [tag, it] of [["E", E], ["L", L]]) {
      const raw = path.join(/*turbopackIgnore: true*/ dir, "media", tag);
      fs.mkdirSync(/*turbopackIgnore: true*/ raw, { recursive: true });
      let n = 0;
      const add = (file, from, t) => {
        if (!file || !fs.existsSync(/*turbopackIgnore: true*/ file) || isBlank(file)) return false;
        if (!/app icon|share image/.test(from)) trim(file);
        pics[tag].push({ file, from, t, hash: hash(file) });
        return true;
      };
      for (const m of it.media.slice(0, 4)) {
        n++;
        try {
          const src = path.join(/*turbopackIgnore: true*/ raw, `${n}${m.type === "photo" ? ".jpg" : ".mp4"}`);
          try { await download(m.url, src); } catch (e) { if (m.fallback) await download(m.fallback, src); else throw e; }
          if (m.type === "photo") add(normalise(src, path.join(/*turbopackIgnore: true*/ dir, "frames", `${tag}-photo${n}.jpg`)), `${m.role || "picture"} ${n}`);
          else for (const fr of frames(src, path.join(/*turbopackIgnore: true*/ dir, "frames"), `${tag}-v${n}`, { max: it.media.length > 1 ? 4 : 6 }).frames) add(fr.file, `video ${n} at ${stamp(fr.t)}`, fr.t);
        } catch (e) { notes.push(`${tag === "E" ? "Earlier" : "Later"} media ${n} couldn't be read.`); }
      }
      if (it.icon) { try { const ic = path.join(/*turbopackIgnore: true*/ raw, "icon.jpg"); await download(it.icon, ic); add(normalise(ic, path.join(/*turbopackIgnore: true*/ dir, "frames", `${tag}-icon.jpg`)), "app icon"); } catch {} }
      pics[tag] = pics[tag].slice(0, 8).map((p, i) => ({ ...p, label: `${tag}${i + 1}`, minor: /app icon|share image/.test(p.from) }));
    }
  }
  for (const [tag, it] of [["E", E], ["L", L]]) {
    const src = it.avatar || it.icon;
    if (!src) continue;
    try { it.avatarFile = (await download(src, path.join(/*turbopackIgnore: true*/ dir, `${tag}-avatar.jpg`), { maxBytes: 2e6 })).file; } catch {}
  }

  say("compare");
  let pixels = null, colours = null;
  if (pics.E.some((p) => !p.minor) && pics.L.some((p) => !p.minor)) {
    const pairs = [];
    for (const x of pics.E) for (const y of pics.L) if (!x.minor && !y.minor) pairs.push({ e: x.label, l: y.label, distance: hamming(x.hash, y.hash), ex: x.file, lx: y.file });
    pairs.sort((p, q) => p.distance - q.distance);
    const top = pairs.slice(0, 3).map((p) => ({ e: p.e, l: p.l, distance: p.distance, correlation: correlation(p.ex, p.lx), ex: p.ex, lx: p.lx }));
    for (const p of top.slice(0, 2)) { const s = sameness(p.ex, p.lx); if (s) p.aligned = s; }
    const identical = top.filter((p) => p.aligned && p.aligned.overlap >= 0.8 && p.aligned.mad <= 6 && p.aligned.differs <= 0.05 && p.aligned.contentDiffers <= 0.15);
    const near = top.filter((p) => !identical.includes(p) && p.aligned && p.aligned.contentDiffers <= 0.3 && (p.aligned.mad <= 12 || p.distance <= 8 && p.correlation >= 0.9));
    const clean = ({ ex, lx, ...r }) => r;
    pixels = { closest: top.map(clean), same: identical.length > 0, samePairs: identical.map(clean), near: near.map(clean) };
    const ea = accents(pics.E.map((p) => p.file)), la = accents(pics.L.map((p) => p.file));
    colours = { earlier: ea.slice(0, 6), later: la.slice(0, 6), shared: sameAccents(ea, la) };
  }

  const title = (it) => (it.kind === "file" ? null : it.title);
  const textE = [title(E), E.text].filter(Boolean).join("\n"), textL = [title(L), L.text].filter(Boolean).join("\n");
  const words = { shared: sharedPhrases(textE, textL), overlap: wordOverlap(textE, textL), names: title(E) && title(L) ? { earlier: title(E), later: title(L), likeness: nameLikeness(title(E), title(L)) } : null };

  const strip = (it) => { const { media, pageText, ...rest } = it; return { ...rest, text: (it.text || "").slice(0, 1200), media: media.map(({ type, url, width, height, duration }) => ({ type, url, width, height, duration })) }; };
  return {
    dir,
    kase: {
      checkedAt: new Date().toISOString(),
      inputs: links,
      found,
      order: ord,
      suspect,
      sameAccount,
      earlier: strip(E),
      later: strip(L),
      credit: cred,
      creditRead: { post: L.available !== false, replies: L.kind === "x" ? replies.ok !== false : null },
      laterReplies: replies.map((r) => ({ url: r.url, text: r.text.slice(0, 280) })),
      othersSaid: others,
      history,
      frames: { earlier: pics.E.map(({ label, file, from, t }) => ({ label, file, from, t, size: size(file) })), later: pics.L.map(({ label, file, from, t }) => ({ label, file, from, t, size: size(file) })) },
      pixels,
      colours,
      words,
      notes,
    },
  };
}
