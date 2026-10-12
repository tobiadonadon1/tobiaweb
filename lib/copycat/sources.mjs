// Turns a link (or a file) into one "item": who, when, what it says, what it shows.
//
// Every date carries its source and what it proves. A post's ID is the
// strongest: X, TikTok, Instagram, Threads and LinkedIn write the creation
// time into the ID itself, so the date can't be edited and survives deletion.
import fs from "node:fs";
import path from "node:path";
import { get, stamp, parseDate, decode } from "./util.mjs";

const X_HOSTS = "(?:x|twitter|fxtwitter|vxtwitter|fixupx|fixvx|girlcockx|stupidpenisx)\\.com";
const RE = {
  x: new RegExp(`${X_HOSTS}/(?:#!/)?(?:(\\w{1,15})/status(?:es)?|i(?:/web)?/status)/(\\d{2,20})`, "i"),
  appstore: /apps\.apple\.com\/(?:([a-z]{2})\/)?app\/(?:[^/]+\/)?id(\d+)/i,
  play: /play\.google\.com\/store\/apps\/details\?(?:[^#]*&)?id=([\w.]+)/i,
  github: /github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i,
  tiktok: /tiktok\.com\/@([\w.-]+)\/(?:video|photo)\/(\d{15,20})/i,
  instagram: /instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]{5,})/i,
  threads: /threads\.(?:net|com)\/@([\w.]+)\/post\/([\w-]{5,})/i,
  linkedin: /linkedin\.com\/.*?(?:activity[:-]|ugcPost[:-]|share[:-])(\d{19})/i,
  youtube: /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i,
};

// The time an ID was made, for the platforms that encode it.
const X_EPOCH = 1288834974657n;
export function xTime(id) {
  const n = BigInt(id);
  // IDs before Nov 2010 are plain counters with no time inside.
  return n > 30000000000000n ? new Date(Number((n >> 22n) + X_EPOCH)) : null;
}
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export function igTime(code) {
  let n = 0n;
  for (const c of code.slice(0, 11)) { const i = B64.indexOf(c); if (i < 0) return null; n = n * 64n + BigInt(i); }
  return new Date(Number(n >> 23n) + 1314220021721);
}
export const tiktokTime = (id) => new Date(Number(BigInt(id) >> 32n) * 1000);
export const linkedinTime = (id) => new Date(Number(BigInt(id) >> 22n));

const plausible = (d, from = "2006-01-01") => d && +d > +new Date(from) && +d < Date.now() + 864e5;

export function kindOf(link) {
  if (!/^https?:\/\//i.test(link) && fs.existsSync(/*turbopackIgnore: true*/ link)) return "file";
  if (!/^https?:\/\//i.test(link) && /\.(png|jpe?g|gif|webp|heic|mp4|mov|m4v|webm)$/i.test(link)) return "missing-file";
  let l = link;
  try { l = decodeURIComponent(link); } catch {}
  for (const [k, re] of Object.entries(RE)) if (re.test(l)) return k;
  return /^https?:\/\//i.test(link) || /^[\w-]+(\.[\w-]+)+/.test(link) ? "web" : "unknown";
}

const blank = (kind, url) => ({ kind, url, handle: null, name: null, title: null, text: "", when: null, dates: [], links: [], mentions: [], quote: null, replyTo: null, media: [], available: true, problem: null });

/* ------------------------------------------------------------------ X */

function xMedia(m) {
  if (!m) return [];
  return (m.all || []).map((v) => {
    if (v.type === "photo") {
      const u = v.url.includes("?") ? v.url : `${v.url}?name=orig`;
      return { type: "photo", url: u, width: v.width, height: v.height };
    }
    // The biggest MP4 up to 1280px is plenty for frames and keeps downloads small.
    const mp4 = (v.formats || v.variants || []).filter((f) => (f.container || f.content_type || "").includes("mp4") && f.url);
    const size = (f) => { const m = /\/(\d+)x(\d+)\//.exec(f.url); return m ? Math.max(+m[1], +m[2]) : 0; };
    const fit = mp4.filter((f) => size(f) && size(f) <= 1280).sort((a, b) => size(b) - size(a))[0]
      || mp4.sort((a, b) => size(a) - size(b))[0];
    return { type: v.type === "gif" ? "gif" : "video", url: fit?.url || v.url, width: v.width, height: v.height, duration: v.duration, thumb: v.thumbnail_url };
  });
}

function xItem(t, url) {
  const it = blank("x", t.url || url);
  it.id = t.id;
  it.handle = t.author?.screen_name || null;
  it.name = t.author?.name || null;
  // A reply starts with hidden @names X adds itself (outside display_text_range):
  // those aren't the author's words, so they don't count as a mention or credit.
  const [from = 0] = t.raw_text?.display_text_range || [];
  const body = t.raw_text?.text != null ? [...t.raw_text.text].slice(from).join("") : t.text ?? "";
  // Short links expanded; the trailing link to the post's own picture or video dropped.
  it.text = body.replace(/https:\/\/t\.co\/\w+/g, (s) => { const f = (t.raw_text?.facets || []).find((x) => x.original === s); return f?.type === "media" ? "" : f?.replacement || s; }).trim();
  for (const f of t.raw_text?.facets || []) {
    if (f.type === "url" && f.replacement) it.links.push(f.replacement);
    if (f.type === "mention" && f.original && (f.indices?.[0] ?? 0) >= from) it.mentions.push(f.original);
  }
  const fromId = xTime(t.id);
  it.when = fromId ? stamp(fromId, "the post's ID, which holds the exact time") : stamp(t.created_at, "X");
  // X's own date should agree with the ID to the second; say so only when it doesn't.
  if (t.created_at && fromId && Math.abs(+new Date(t.created_at) - +fromId) > 60000) it.dates.push({ label: "X's own date disagrees", iso: new Date(t.created_at).toISOString() });
  it.media = xMedia(t.media);
  it.replyTo = t.replying_to_status ? { handle: t.replying_to, id: t.replying_to_status, url: `https://x.com/${t.replying_to}/status/${t.replying_to_status}` } : null;
  it.stats = { likes: t.likes, reposts: t.retweets, quotes: t.quotes, views: t.views };
  it.followers = t.author?.followers ?? null;
  it.communityNote = t.community_note?.text || null;
  it.avatar = t.author?.avatar_url || null;
  return it;
}

async function fromX(link) {
  const [, linkHandle, id] = RE.x.exec(link);
  const viaId = xTime(id);
  const fx = await get(`https://api.fxtwitter.com/status/${id}`, { json: true });
  if (fx?.tweet) {
    const it = xItem(fx.tweet, link);
    if (fx.tweet.quote) it.quote = xItem(fx.tweet.quote);
    // X opens a post by its number and ignores the name in the link, so a
    // link can carry the wrong name. The author is whoever X says it is.
    if (linkHandle && linkHandle.toLowerCase() !== "i" && it.handle && linkHandle.toLowerCase() !== it.handle.toLowerCase()) it.linkHandle = linkHandle;
    it.quotes = fx.tweet.quotes ?? null;
    return it;
  }
  // Fallback: vxtwitter.
  const vx = await get(`https://api.vxtwitter.com/Twitter/status/${id}`, { json: true });
  if (vx?.tweetID) {
    const it = blank("x", vx.tweetURL?.replace("twitter.com", "x.com") || link);
    it.id = vx.tweetID; it.handle = vx.user_screen_name; it.name = vx.user_name; it.text = vx.text || "";
    it.when = viaId ? stamp(viaId, "the post's ID, which holds the exact time") : stamp(vx.date, "X");
    it.media = (vx.media_extended || []).map((m) => ({ type: m.type === "image" ? "photo" : m.type, url: m.url, width: m.size?.width, height: m.size?.height, duration: m.duration_millis ? m.duration_millis / 1000 : undefined, thumb: m.thumbnail_url }));
    it.mentions = (it.text.match(/@(\w{1,15})/g) || []).map((s) => s.slice(1));
    if (vx.qrtURL) it.quote = { kind: "x", url: vx.qrtURL, handle: vx.qrtURL.split("/")[3], id: vx.qrtURL.split("/").pop() };
    if (vx.replyingToID) it.replyTo = { handle: vx.replyingTo, id: vx.replyingToID, url: `https://x.com/${vx.replyingTo}/status/${vx.replyingToID}` };
    return it;
  }
  // Deleted, private or the readers are down: the ID still proves the time.
  const it = blank("x", link);
  it.id = id;
  const lh = RE.x.exec(link)[1];
  it.handle = lh && lh.toLowerCase() !== "i" ? lh : null;
  it.handleUnconfirmed = !!it.handle;
  it.available = false;
  it.problem = fx?.__status === 404 || fx?.code === 404 ? "This post can't be read: deleted, private, or from a suspended account." : `The post readers didn't answer (${fx?.__status || fx?.__error || "no answer"}).`;
  if (viaId) it.when = stamp(viaId, "the post's ID, which holds the exact time");
  return it;
}

/** An X account's recent posts (about the last 40). For the fairness check. */
export async function xTimeline(handle, { pages = 3 } = {}) {
  const posts = [];
  let cursor = null, reach = null;
  let failed = false;
  for (let p = 0; p < pages; p++) {
    // This endpoint answers 404 now and then for accounts that exist: try again before giving up.
    let d = null;
    for (let t = 0; t < 4 && !(d?.results?.length); t++) {
      if (t) await new Promise((r) => setTimeout(r, 1200 * t));
      d = await get(`https://api.fxtwitter.com/2/profile/${handle}/statuses${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`, { json: true });
    }
    const rows = d?.results || [];
    if (!rows.length) { if (p === 0) failed = true; break; }
    for (const r of rows) {
      if (r.author?.screen_name?.toLowerCase() !== handle.toLowerCase()) continue;
      if (posts.some((x) => x.id === r.id)) continue;
      const at = xTime(r.id) || new Date(r.created_at);
      posts.push({ id: r.id, url: r.url, at: at.toISOString(), text: (r.text || "").slice(0, 280), media: (r.media?.all || []).map((m) => m.type), quote: r.quote?.url || null });
      reach = at.toISOString();
    }
    cursor = d.cursor?.bottom;
    if (!cursor) break;
  }
  posts.sort((a, b) => a.at.localeCompare(b.at));
  return { posts, reachesBackTo: posts[0]?.at || reach, failed };
}

/* -------------------------------------------------------- App Store */

async function fromAppStore(link) {
  const [, cc = "us", id] = RE.appstore.exec(link);
  let d = await get(`https://itunes.apple.com/lookup?id=${id}&country=${cc}`, { json: true });
  if (!d?.results?.length && cc !== "us") d = await get(`https://itunes.apple.com/lookup?id=${id}&country=us`, { json: true });
  const it = blank("appstore", link);
  const a = d?.results?.[0];
  if (!a) { it.available = false; it.problem = "The App Store has no app with this ID in this country (removed, or region-locked)."; return it; }
  it.id = String(a.trackId);
  it.url = a.trackViewUrl?.split("?")[0] || link;
  it.title = a.trackName;
  it.name = a.sellerName || a.artistName;
  it.handle = a.artistName;
  it.text = a.description || "";
  it.when = stamp(a.releaseDate, "the App Store's first release date", "day");
  it.dates.push({ label: "current version released", iso: a.currentVersionReleaseDate });
  it.links = [...new Set((it.text.match(/https?:\/\/[^\s)\]>"']+/g) || []).map((u) => u.replace(/[.,;:!?]+$/, "")))];
  it.icon = a.artworkUrl512 || a.artworkUrl100;
  it.media = [...(a.screenshotUrls || []), ...(a.ipadScreenshotUrls || []).slice(0, 2)].map((u) => ({ type: "photo", url: u.replace(/\/\d+x\d+bb\.(png|jpg)$/, "/1290x0w.$1") }));
  it.extra = { version: a.version, genres: a.genres, price: a.formattedPrice, rating: a.averageUserRating, ratings: a.userRatingCount, developerUrl: a.artistViewUrl, site: a.sellerUrl || null };
  return it;
}

/* ------------------------------------------------------ Google Play */

async function fromPlay(link) {
  const [, pkg] = RE.play.exec(link);
  const it = blank("play", `https://play.google.com/store/apps/details?id=${pkg}`);
  it.id = pkg;
  let html = "";
  try { html = await (await get(`${it.url}&hl=en&gl=us`)).text(); } catch {}
  if (!html || /We're sorry, the requested URL was not found/i.test(html)) { it.available = false; it.problem = "Google Play has no app with this ID (removed or region-locked)."; return it; }
  const meta = (p) => (new RegExp(`<meta[^>]+property="${p}"[^>]+content="([^"]*)"`, "i").exec(html) || [])[1];
  it.title = decode((meta("og:title") || "").replace(/ - Apps on Google Play$/, ""));
  it.text = decode(meta("og:description") || "");
  it.icon = meta("og:image");
  it.name = (/"author":\s*\{[^}]*"name":\s*"([^"]+)"/.exec(html) || /<a[^>]+href="\/store\/apps\/dev(?:eloper)?\?id=[^"]+"[^>]*><span>([^<]+)</.exec(html) || [])[1] || null;
  it.handle = it.name;
  // The page carries its dates as ["May 29, 2013",[1369829880,…]]: the release
  // date and the last update. The earliest is the release.
  const dates = [...html.matchAll(/\["([A-Z][a-z]{2} \d{1,2}, \d{4})",\[(\d{9,11}),\d+\]\]/g)].map((m) => +m[2] * 1000).filter((t) => t > +new Date("2008-10-01")).sort((x, y) => x - y);
  if (dates.length) it.when = stamp(new Date(dates[0]), "Google Play's release date", "day");
  else it.problem = "Couldn't read a release date from this Google Play page. Use its website or a launch post for the date.";
  it.media = [...new Set((html.match(/https:\/\/play-lh\.googleusercontent\.com\/[\w-]{40,}/g) || []))].slice(1, 9).map((u) => ({ type: "photo", url: `${u}=h1080` }));
  return it;
}

/* ----------------------------------------------------------- GitHub */

async function fromGitHub(link) {
  const [, owner, repo] = RE.github.exec(link);
  const it = blank("github", `https://github.com/${owner}/${repo}`);
  const d = await get(`https://api.github.com/repos/${owner}/${repo}`, { json: true, headers: { accept: "application/vnd.github+json" } });
  if (!d?.id) { it.available = false; it.problem = d?.__status === 403 || d?.__status === 429 ? "GitHub's rate limit was hit (60 an hour without a login). Try again later." : d?.__status === 404 ? "This repository can't be read (private, renamed or deleted)." : `GitHub didn't answer (${d?.__status || d?.__error || "no answer"}). Try again.`; return it; }
  it.id = String(d.id);
  it.handle = d.owner?.login; it.name = d.owner?.login; it.title = d.name; it.text = d.description || "";
  // Credit usually sits in the README, so read its start too.
  try {
    const r = await get(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { accept: "application/vnd.github.raw" }, timeout: 15000 });
    if (r.ok) { const md = (await r.text()).slice(0, 6000); it.text = [it.text, md].filter(Boolean).join("\n\n"); it.readme = true; }
  } catch {}
  it.when = stamp(d.created_at, "GitHub's repository creation time, which can't be backdated (commit dates can)");
  it.dates.push({ label: "last push", iso: d.pushed_at });
  it.links = [...new Set([d.homepage, ...(it.text.match(/https?:\/\/[^\s)\]>"'`]+/g) || []).map((u) => u.replace(/[.,;:!?]+$/, ""))].filter(Boolean))];
  it.extra = { stars: d.stargazers_count, fork: d.fork, parent: d.parent?.html_url || null, source: d.source?.html_url || null, license: d.license?.spdx_id || null };
  if (d.owner?.avatar_url) it.avatar = d.owner.avatar_url;
  return it;
}

/* --------------------------------------------- posts decoded from IDs */

function fromDecoded(kind, link) {
  const it = blank(kind, link);
  let at = null, src = "";
  if (kind === "tiktok") { const [, h, id] = RE.tiktok.exec(link); it.handle = h; it.id = id; at = tiktokTime(id); src = "the video's ID (TikTok writes the time into it)"; }
  if (kind === "instagram") { const [, code] = RE.instagram.exec(link); it.id = code; at = igTime(code); src = "the post's code (Instagram writes the time into it)"; }
  if (kind === "threads") { const [, h, code] = RE.threads.exec(link); it.handle = h; it.id = code; at = igTime(code); src = "the post's code (Threads uses Instagram's IDs)"; if (at && +at < +new Date("2023-07-01")) at = null; }
  if (kind === "linkedin") { let l = link; try { l = decodeURIComponent(link); } catch {} const [, id] = RE.linkedin.exec(l); it.id = id; at = linkedinTime(id); src = "the post's ID (LinkedIn writes the time into it)"; }
  if (plausible(at, "2010-01-01")) it.when = stamp(at, src);
  else it.problem = "Couldn't read a date from this link.";
  it.needsMedia = true;
  it.problem = (it.problem ? it.problem + " " : "") + "This platform doesn't let tools download the post: drop a screenshot or screen recording of it in the chat.";
  return it;
}

async function fromYouTube(link) {
  const [, id] = RE.youtube.exec(link);
  const it = blank("youtube", `https://www.youtube.com/watch?v=${id}`);
  it.id = id;
  try {
    const html = await (await get(`${it.url}&hl=en`, { headers: { "accept-language": "en" } })).text();
    const pub = /itemprop="(?:datePublished|uploadDate)" content="([^"]+)"/.exec(html) || /"publishDate":"([^"]+)"/.exec(html) || /"uploadDate":"([^"]+)"/.exec(html);
    if (pub) it.when = stamp(pub[1], "YouTube's publish date", pub[1].length > 10 ? "exact" : "day");
    it.title = (/<meta name="title" content="([^"]*)"/.exec(html) || [])[1] || null;
    it.handle = (/"ownerChannelName":"([^"]+)"/.exec(html) || [])[1] || null;
    it.name = it.handle;
    // The full description lives in the player data; the meta tag stops at 160 characters.
    const full = /"shortDescription":"((?:[^"\\]|\\.)*)"/.exec(html);
    let desc = "";
    if (full) { try { desc = JSON.parse(`"${full[1]}"`); } catch {} }
    it.text = desc || decode((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || "");
    it.title = it.title && decode(it.title);
    it.links = [...new Set((it.text.match(/https?:\/\/[^\s)\]>"']+/g) || []).map((u) => u.replace(/[.,;:!?]+$/, "")))];
  } catch {}
  it.media = [{ type: "photo", url: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, fallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }];
  if (!it.when) it.problem = "YouTube didn't give a date for this video.";
  return it;
}

/* ------------------------------------------------------------ the web */

// Sites on a shared host: the host's registration date says nothing about the site.
const SHARED = /\.(vercel\.app|netlify\.app|github\.io|pages\.dev|framer\.(website|ai|app)|webflow\.io|carrd\.co|notion\.site|super\.site|wixsite\.com|squarespace\.com|bolt\.new|lovable\.app|replit\.app|web\.app|firebaseapp\.com|herokuapp\.com|onrender\.com|fly\.dev|glitch\.me|substack\.com|medium\.com|gumroad\.com|beehiiv\.com|producthunt\.com)$/i;

const PLATFORM = /^(dribbble\.com|behance\.net|medium\.com|producthunt\.com|substack\.com|gumroad\.com|notion\.site|figma\.com|codepen\.io|reddit\.com|indiehackers\.com|framer\.com|webflow\.com|vimeo\.com|pinterest\.com|tumblr\.com|youtube\.com|github\.com|x\.com|twitter\.com|linkedin\.com|instagram\.com|tiktok\.com|threads\.net)$/i;

async function fromWeb(link) {
  const url = /^https?:\/\//i.test(link) ? link : `https://${link}`;
  const u = new URL(url);
  const it = blank("web", url);
  it.handle = u.hostname.replace(/^www\./, "");
  // On a platform (dribbble.com/name, medium.com/@name) the account is the first path part, not the site.
  const part = u.pathname.split("/").filter(Boolean)[0];
  // A route (dribbble.com/shots/…) isn't an account: then the account is unknown.
  if (PLATFORM.test(it.handle)) it.handle = part && !/^(shots?|posts?|p|products?|launches|stories|story|watch|pin|status|video|reels?|gallery|projects?|pen|file|design|community|r|c|t|discussions?)$/i.test(part) ? `${it.handle}/${part}` : null;
  it.platform = PLATFORM.test(u.hostname.replace(/^www\./, ""));
  let html = "", finalUrl = url;
  try {
    const res = await get(url, { headers: { accept: "text/html" } });
    finalUrl = res.url || url;
    html = (await res.text()).slice(0, 2e6);
    if (!res.ok) it.problem = `The page answered ${res.status}.`;
  } catch (e) { it.problem = `The page didn't load (${e.message}).`; }
  const meta = (p) => {
    for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
      const attr = (n) => (new RegExp(`\\b${n}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag) || []).slice(1).find((v) => v !== undefined);
      if ((attr("property") || attr("name") || "").toLowerCase() === p) return decode(attr("content") || "");
    }
    return undefined;
  };
  const blocked = /Attention Required|Just a moment\.\.\.|cf-browser-verification|challenge-platform/i.test(html.slice(0, 20000));
  if (blocked) { it.problem = "The site blocked the reader (a bot check), so its own words weren't read."; html = ""; }
  it.title = meta("og:title") || decode((/<title[^>]*>([^<]*)<\/title>/i.exec(html) || [])[1]?.trim() || "") || it.handle;
  it.siteName = meta("og:site_name") || meta("application-name") || null;
  it.text = meta("og:description") || meta("description") || "";
  // Credit usually sits in the page itself (a footer, an "inspired by" line), not
  // in the description: read the visible text and every link on the page too.
  const body = decode(html.replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  it.pageText = body.slice(0, 20000);
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#][^"']*)["']/gi)].map((m) => { try { return new URL(decode(m[1]), url).href; } catch { return null; } }).filter((h) => h && /^https?:/i.test(h));
  it.links = [...new Set(hrefs)].slice(0, 300);
  try { if (new URL(finalUrl).hostname.replace(/^www\./, "") !== u.hostname.replace(/^www\./, "")) it.redirectedTo = finalUrl; } catch {}
  const og = meta("og:image");
  if (og) it.media.push({ type: "photo", url: new URL(og, url).href, role: "share image" });
  it.screenshot = true; // check.mjs photographs the page as it is today

  // The archive: the earliest capture of this exact page, then of the site.
  const ask = async (q) => {
    // The archive answers "temporarily offline" often; give it a few tries with a pause.
    let d;
    for (let t = 0; t < 3; t++) {
      if (t) await new Promise((r) => setTimeout(r, 2500 * t));
      d = await get(`https://web.archive.org/cdx/search/cdx?${q}&output=json&limit=1&fl=timestamp,original,statuscode&filter=statuscode:200`, { json: true, timeout: 25000, tries: 1 });
      if (Array.isArray(d)) break;
    }
    if (!Array.isArray(d) || d.length < 2) return d?.__status || d?.__error || d?.__notJson ? "down" : null;
    const [ts, orig] = d[1];
    const iso = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}T${ts.slice(8, 10)}:${ts.slice(10, 12)}:${ts.slice(12, 14)}Z`;
    return { iso, url: `https://web.archive.org/web/${ts}/${orig}` };
  };
  const pagePath = (u.hostname + u.pathname).replace(/\/$/, "");
  const page = await ask(`url=${encodeURIComponent(pagePath)}`);
  const site = u.pathname.length > 1 ? await ask(`url=${encodeURIComponent(u.hostname)}&matchType=host`) : page;
  if (page === "down" || site === "down") it.archiveDown = true;
  if (page && page !== "down") { it.dates.push({ label: "first archived (this page)", iso: page.iso, url: page.url }); it.archive = page.url; }
  if (site && site !== "down" && site !== page && !(page && page !== "down" && site.iso >= page.iso)) it.dates.push({ label: "first archived (anything on this site)", iso: site.iso, url: site.url });
  const first = page && page !== "down" ? page : null;
  if (first) it.when = stamp(first.iso, "the Internet Archive's first capture", "by");

  // Domain registration, unless the site lives on a shared host.
  const host = u.hostname.replace(/^www\./, "");
  if (!SHARED.test(host)) {
    const apex = host.split(".").slice(-2).join(".");
    const parts = host.split(".");
    const domain = /\.(co|com|org|net|ac|gov)\.[a-z]{2}$/i.test(host) ? parts.slice(-3).join(".") : apex;
    const r = await get(`https://rdap.org/domain/${domain}`, { json: true, timeout: 15000 });
    const reg = (r?.events || []).find((e) => e.eventAction === "registration");
    if (reg) it.dates.push({ label: `domain ${domain} registered (may be an earlier owner)`, iso: new Date(reg.eventDate).toISOString() });
  }
  if (!it.when) it.problem = (it.problem ? it.problem + " " : "") + (page === "down" ? "The Internet Archive didn't answer for this page, so there's no proven date yet: try again in a few minutes, or use the site's launch post." : "The Internet Archive has no capture of this exact page, so there's no proven date: use the site's launch post instead.");
  return it;
}

/* ---------------------------------------------------------- local file */

function fromFile(file, date, who) {
  const it = blank("file", path.resolve(/*turbopackIgnore: true*/ file));
  const ext = path.extname(file).toLowerCase();
  it.title = path.basename(/*turbopackIgnore: true*/ file);
  // Who posted it, as the person tells us ("@maker"). Shown as given.
  if (who) it.handle = String(who).trim();
  it.media = [{ type: /\.(mp4|mov|m4v|webm|gif)$/.test(ext) ? "video" : "photo", local: path.resolve(/*turbopackIgnore: true*/ file) }];
  const p = date ? parseDate(date) : null;
  if (p) { it.when = stamp(p.date, "the date you gave (not checked)", p.precision); it.when.given = true; }
  else if (date) it.problem = `Couldn't read the date "${date}". Use 2026-10-05 or 2026-10-05T16:28Z.`;
  else it.problem = "A file has no trustworthy date of its own. Give the date it was first posted, and the link if there is one.";
  it.mediaKind = /\.(mp4|mov|m4v|webm|gif)$/.test(ext) ? "recording" : "screenshot";
  it.unverified = true;
  return it;
}

const SHORT = /^(?:https?:\/\/)?(?:www\.)?(vm\.tiktok\.com|vt\.tiktok\.com|tiktok\.com\/t\/|t\.co\/|bit\.ly|lnkd\.in|instagr\.am|buff\.ly|ow\.ly|tinyurl\.com|youtu\.be|apple\.co|x\.gd|shorturl\.at|rebrand\.ly|dub\.sh)/i;

export async function resolve(link, { date, who } = {}) {
  const kind = kindOf(link);
  let it;
  if (kind === "x") it = await fromX(link);
  else if (kind === "appstore") it = await fromAppStore(link);
  else if (kind === "play") it = await fromPlay(link);
  else if (kind === "github") it = await fromGitHub(link);
  else if (kind === "youtube") it = await fromYouTube(link);
  else if (["tiktok", "instagram", "threads", "linkedin"].includes(kind)) it = fromDecoded(kind, link);
  else if (kind === "file") it = fromFile(link, date, who);
  else if (kind === "missing-file") { it = blank("file", link); it.available = false; it.problem = `There's no file at ${link}. Check the path (drag the file into the chat to get it exactly).`; }
  else if (kind === "web" && SHORT.test(link)) {
    // A short link: follow it to where it really goes, then read that.
    let to = null;
    try { const r = await get(/^https?:/i.test(link) ? link : `https://${link}`, { timeout: 15000 }); to = r.url; } catch {}
    it = to && kindOf(to) !== "web" ? await resolve(to, { date, who }) : await fromWeb(to || link);
  }
  else if (kind === "web") it = await fromWeb(link);
  else { it = blank("unknown", link); it.available = false; it.problem = "Not a link or a file I can read."; }
  // A date the person gives only fills a gap; it never replaces a proven one.
  if (date && !it.when && kind !== "file") {
    const p = parseDate(date);
    if (p) { it.when = stamp(p.date, "the date you gave (not checked)", p.precision); it.when.given = true; it.unverified = true; }
    else it.problem = (it.problem ? it.problem + " " : "") + `Couldn't read the date "${date}". Use 2026-10-05 or 2026-10-05T16:28Z.`;
  }
  it.input = link;
  return it;
}
