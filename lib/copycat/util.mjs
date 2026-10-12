// Small shared helpers: arguments, network, dates, files.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import dns from "node:dns/promises";
import net from "node:net";

// The website's copy of the skill's helpers (~/.claude/skills/copycat-detective).
export const VERSION = "web-1";

// fxtwitter answers 403 to browser-looking agents, so say who we are.
export const UA = `copycat-detective/${VERSION} (+https://www.tobiadonadon.com)`;

// Flags that never take a value, so they can't swallow the link after them.
const SWITCHES = new Set(["force", "no-media", "copy-image", "help"]);

/** --flag value / --flag / positionals. */
export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (SWITCHES.has(key) || next === undefined || next.startsWith("--")) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

/** A local file as a URL a browser accepts, on every OS and with any characters in the path. */
export const fileUrl = (f) => pathToFileURL(path.resolve(/*turbopackIgnore: true*/ f)).href;

/** &amp; &#39; &#x2019; and friends, as text. */
export function decode(s) {
  return String(s ?? "").replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => {
    const k = e.toLowerCase();
    if (k[0] === "#") { const n = k[1] === "x" ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[k];
  });
}

/**
 * ONLY THE PUBLIC INTERNET. People paste any address here, so a link that
 * points inside a network (localhost, 10.x, 169.254.x metadata, …) is refused
 * before anything is fetched. Checked on the name's real addresses.
 */
const PRIVATE = [/^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^::1$/, /^f[cd]/i, /^fe80:/i, /^::ffff:(127|10|192\.168|169\.254)\./i, /^::$/];
export async function assertPublic(url) {
  const u = new URL(url);
  if (!/^https?:$/.test(u.protocol)) throw new Error("only http and https links");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("unusual port");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error("not a public address");
  const addrs = net.isIP(host) ? [host] : (await dns.lookup(host, { all: true, verbatim: true })).map((a) => a.address);
  if (!addrs.length || addrs.some((a) => PRIVATE.some((re) => re.test(a)))) throw new Error("not a public address");
}

export async function get(url, { json = false, timeout = 20000, headers = {}, tries = 2 } = {}) {
  let last;
  try { await assertPublic(url); } catch (e) { if (json) return { __error: e.message }; throw e; }
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, ...headers }, redirect: "follow", signal: AbortSignal.timeout(timeout) });
      if (res.status >= 500 && i + 1 < tries) { last = new Error(`${res.status} from ${new URL(url).host}`); continue; }
      if (!json) return res;
      if (!res.ok) return { __status: res.status };
      const text = await res.text();
      try { return JSON.parse(text); } catch { return { __status: res.status, __notJson: true }; }
    } catch (e) { last = e; }
  }
  if (json) return { __error: String(last?.message || last) };
  throw last;
}

export async function download(url, file, { maxBytes = 40e6, timeout = 60000 } = {}) {
  await assertPublic(url);
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(timeout) });
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
  const len = +res.headers.get("content-length") || 0;
  if (len > maxBytes) throw new Error(`file too big (${Math.round(len / 1e6)} MB): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(/*turbopackIgnore: true*/ file), { recursive: true });
  fs.writeFileSync(/*turbopackIgnore: true*/ file, buf);
  return { file, bytes: buf.length, type: res.headers.get("content-type") || "" };
}

/**
 * A date we can print and compare. Keeps where it came from and how precise it is:
 *   exact  the moment it was created (a post ID, an API timestamp)
 *   day    only the day is known (an App Store or Play release date)
 *   by     it existed by then, maybe long before (an archive capture)
 */
export function stamp(date, source, precision = "exact") {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(+d)) return null;
  return { iso: d.toISOString(), source, precision };
}

/** A date the person typed: 2026-10-05, 2026-10-05T16:28Z, 2026-10-05 16:28. Anything else is null. */
export function parseDate(input) {
  const s = String(input || "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:?\d{2})?)?$/.exec(s);
  if (!m) return null;
  const [, y, mo, d, h, mi, se, tz] = m;
  if (+mo < 1 || +mo > 12 || +d < 1 || +d > 31 || (h && (+h > 23 || +mi > 59))) return null;
  const iso = `${y}-${mo}-${d}T${h || "12"}:${mi || "00"}:${se || "00"}${tz ? (tz === "Z" ? "Z" : tz.replace(/(\d{2})(\d{2})$/, "$1:$2")) : "Z"}`;
  const date = new Date(iso);
  if (Number.isNaN(+date) || date.getUTCDate() !== +d && !tz) return null;
  return { date, precision: h ? "exact" : "day" };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "Oct 5, 2026" and "16:28 UTC": UTC on purpose, so both sides use one clock. */
export function day(iso) { const d = new Date(iso); return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; }
export function clock(iso) { const d = new Date(iso); return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`; }

/** Whole calendar days between two UTC dates (Mar 1 23:00 → Mar 2 01:00 is 1). */
export function calendarDays(fromIso, toIso) {
  const a = new Date(fromIso), b = new Date(toIso);
  return Math.round((Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()) - Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())) / 864e5);
}

/** Whole calendar months from one moment to a later one (Jan 31 → Feb 28 is 0). */
function calendarMonths(fromIso, toIso) {
  const a = new Date(fromIso), b = new Date(toIso);
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  const rest = (d) => ((d.getUTCDate() * 24 + d.getUTCHours()) * 60 + d.getUTCMinutes()) * 60 + d.getUTCSeconds();
  if (rest(b) < rest(a)) m--;
  return m;
}

/**
 * How much later, rounded DOWN so it never overstates: 47 hours is
 * "47 hours", not "2 days"; 11 months and 30 days is "11 months". Months and
 * years are counted on the calendar. Day-precision dates count calendar days
 * and never claim hours.
 */
export function gap(fromIso, toIso, { dayPrecision = false } = {}) {
  const ms = +new Date(toIso) - +new Date(fromIso);
  const n = (x, w) => `${x} ${w}${x === 1 ? "" : "s"}`;
  const min = Math.floor(ms / 60000), h = Math.floor(ms / 3600000);
  const d = dayPrecision ? calendarDays(fromIso, toIso) : Math.floor(ms / 864e5);
  if (dayPrecision) {
    if (d < 1) return "the same day";
  } else {
    if (min < 1) return "under a minute later";
    if (min < 60) return n(min, "minute") + " later";
    if (h < 48) return n(h, "hour") + " later";
  }
  if (d < 60) return n(d, "day") + " later";
  const mo = dayPrecision ? calendarMonths(fromIso.slice(0, 10) + "T00:00:00Z", toIso.slice(0, 10) + "T00:00:00Z") : calendarMonths(fromIso, toIso);
  if (mo < 12) return n(mo, "month") + " later";
  return n(Math.floor(mo / 12), "year") + " later";
}

export function desktop() {
  const d = path.join(/*turbopackIgnore: true*/ os.homedir(), "Desktop");
  return fs.existsSync(/*turbopackIgnore: true*/ d) ? d : os.homedir();
}

export const slug = (s) => String(s).replace(/[^\w@.-]+/g, " ").trim().slice(0, 40) || "case";

export function readJSON(file) { return JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ file, "utf8")); }
export function writeJSON(file, data) { fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(/*turbopackIgnore: true*/ file), { recursive: true }); fs.writeFileSync(/*turbopackIgnore: true*/ file, JSON.stringify(data, null, 2) + "\n"); }

export const short = (url) => String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
