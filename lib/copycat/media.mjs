// Pictures and video, through ffmpeg only (the system's, or the one doctor installs).
//
//   frames()   stills from a video: evenly spaced plus every hard cut
//   hash()     a 64-bit picture fingerprint (dHash): near-equal = the same picture
//   accents()  the saturated colours a picture is built on, in Lab
//   deltaE()   CIEDE2000 distance between two colours (under ~3 = same to the eye)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as child from "node:child_process";
// Called through the namespace so the bundler doesn't try to trace ffmpeg's arguments as project files.
const spawnSync = (...a) => child.spawnSync(...a);
import ffmpegStatic from "ffmpeg-static";

export const HOME = process.env.TMPDIR || "/tmp";

let FF;
/** The server's ffmpeg: the ffmpeg-static binary bundled with the function, or a system one in development. */
export function ffmpeg() {
  if (FF !== undefined) return FF;
  const works = (bin) => bin && spawnSync(bin, ["-version"], { encoding: "utf8" }).status === 0;
  if (ffmpegStatic && works(ffmpegStatic)) return (FF = ffmpegStatic);
  if (works("ffmpeg")) return (FF = "ffmpeg");
  return (FF = null);
}

function run(argv, { buffer = false } = {}) {
  const bin = ffmpeg();
  if (!bin) throw new Error("ffmpeg is missing. Run the doctor with --fix.");
  // A "%" in a picture's path reads as a numbered sequence to ffmpeg: say it's one file.
  const args = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-i" && /%/.test(argv[i + 1] || "") && /\.(jpe?g|png|webp|bmp|tiff?)$/i.test(argv[i + 1])) args.push("-pattern_type", "none");
    args.push(argv[i]);
  }
  const r = spawnSync(bin, ["-hide_banner", "-nostdin", ...args], { encoding: buffer ? "buffer" : "utf8", maxBuffer: 64e6 });
  return r;
}

/** Duration in seconds, read from ffmpeg's own banner (no ffprobe needed). */
export function duration(file) {
  const r = run(["-i", file]);
  const m = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(String(r.stderr));
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}

/** Black bars around a screen recording: crop them so the screen is compared, not the frame. */
export function cropBox(file) {
  const r = run(["-t", "8", "-i", file, "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"]);
  const all = [...String(r.stderr).matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)];
  if (!all.length) return null;
  const [, w, h, x, y] = all.at(-1).map(Number);
  const size = /, (\d{2,5})x(\d{2,5})[, ]/.exec(String(r.stderr));
  if (!size) return null;
  const full = +size[1] * +size[2];
  // Only worth it when the bars are real (more than 4% of the picture).
  return w * h < full * 0.96 && w > 64 && h > 64 ? { w, h, x, y } : null;
}

/** Times of hard cuts, from ffmpeg's scene score. */
function cuts(file, threshold = 0.3) {
  const r = run(["-i", file, "-vf", `select='gt(scene,${threshold})',showinfo`, "-an", "-f", "null", "-"]);
  return [...String(r.stderr).matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
}

export function grab(file, t, out, crop) {
  const vf = [crop && `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, "scale='min(1440,iw)':-2"].filter(Boolean).join(",");
  const r = run(["-y", "-ss", String(Math.max(0, t)), "-i", file, "-frames:v", "1", "-vf", vf, "-q:v", "2", "-update", "1", out]);
  return r.status === 0 && fs.existsSync(/*turbopackIgnore: true*/ out) ? out : null;
}

/** Still images from a video: 6 evenly spaced + hard cuts, near-duplicates dropped, at most `max`. */
export function frames(file, dir, prefix, { max = 8 } = {}) {
  fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
  const dur = duration(file);
  // Borders (black bars, white cards around a phone) are trimmed per frame by trim().
  const crop = null;
  const fix = (t) => Math.round(Math.min(t, Math.max(0, dur - 0.05)) * 100) / 100;
  const even = new Set((dur > 0 ? Array.from({ length: 6 }, (_, i) => ((i + 0.5) * dur) / 6) : [0]).map(fix));
  const times = [...new Set([...even, ...cuts(file).map((t) => fix(t + 0.15))])].sort((a, b) => a - b);
  const kept = [];
  for (const t of times) {
    const out = path.join(/*turbopackIgnore: true*/ dir, `${prefix}-${String(t.toFixed(2)).replace(".", "_")}.jpg`);
    if (!grab(file, t, out, crop)) continue;
    const f = { file: out, t, hash: hash(out), blank: isBlank(out), even: even.has(t) };
    // Evenly spaced frames stay (a small animation changes little per frame);
    // a cut frame is dropped when it repeats one already kept.
    const repeat = kept.some((k) => hamming(k.hash, f.hash) <= 2 && correlation(k.file, f.file) >= 0.99);
    if (f.blank || (repeat && !f.even) || (repeat && hamming(kept.at(-1)?.hash, f.hash) === 0 && correlation(kept.at(-1).file, f.file) >= 0.999)) { fs.rmSync(/*turbopackIgnore: true*/ out, { force: true }); continue; }
    kept.push(f);
  }
  // Too many: keep an even spread, always the first and last.
  while (kept.length > max) {
    const i = kept.reduce((best, f, j) => (j > 0 && j < kept.length - 1 && (best < 0 || kept[j + 1].t - kept[j - 1].t < kept[best + 1].t - kept[best - 1].t) ? j : best), -1);
    fs.rmSync(/*turbopackIgnore: true*/ kept[i].file, { force: true });
    kept.splice(i, 1);
  }
  return { duration: dur, crop, frames: kept };
}

/** Any picture → JPEG we control (and the size it is). */
export function normalise(file, out, crop, width = 1440) {
  const vf = [crop && `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, `scale='min(${width},iw)':-2`].filter(Boolean).join(",");
  const r = run(["-y", "-i", file, "-frames:v", "1", "-vf", vf, "-q:v", "2", "-update", "1", out]);
  return r.status === 0 ? out : null;
}

export function size(file) {
  const r = run(["-i", file]);
  const m = /, (\d{2,5})x(\d{2,5})[, \[]/.exec(String(r.stderr));
  return m ? { width: +m[1], height: +m[2] } : null;
}

function raw(file, w, h, fmt) {
  const r = run(["-i", file, "-frames:v", "1", "-vf", `scale=${w}:${h}:flags=area,format=${fmt}`, "-f", "rawvideo", "-"], { buffer: true });
  const want = w * h * (fmt === "gray" ? 1 : 3);
  return r.stdout && r.stdout.length >= want ? r.stdout.subarray(0, want) : null;
}

/** dHash: is each pixel brighter than its right-hand neighbour, on a 9x8 thumbnail. */
export function hash(file) {
  const px = raw(file, 9, 8, "gray");
  if (!px) return null;
  let bits = "";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += px[y * 9 + x] > px[y * 9 + x + 1] ? "1" : "0";
  return BigInt("0b" + bits).toString(16).padStart(16, "0");
}

export function hamming(a, b) {
  if (!a || !b) return 64;
  let x = BigInt("0x" + a) ^ BigInt("0x" + b), n = 0;
  while (x) { n += Number(x & 1n); x >>= 1n; }
  return n;
}

/** Pearson correlation of two 32x32 grey thumbnails: 1 = the same picture. */
export function correlation(fa, fb) {
  const a = raw(fa, 32, 32, "gray"), b = raw(fb, 32, 32, "gray");
  if (!a || !b) return 0;
  const n = a.length;
  let sa = 0, sb = 0;
  for (let i = 0; i < n; i++) { sa += a[i]; sb += b[i]; }
  const ma = sa / n, mb = sb / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
  return da && db ? Math.round((num / Math.sqrt(da * db)) * 1000) / 1000 : 0;
}

/**
 * Trim uniform borders (black bars, a white card around a small phone, a
 * coloured frame) so the picture itself is compared and shown. Only whole
 * rows and columns that are one colour go; nothing with content in it is cut.
 * Writes the trimmed picture over the file and returns true when it trimmed.
 */
export function trim(file) {
  const sz = size(file);
  if (!sz) return false;
  const w = 240, h = Math.max(4, Math.round((w * sz.height) / sz.width));
  const px = raw(file, w, h, "rgb24");
  if (!px) return false;
  const at = (x, y) => { const i = (y * w + x) * 3; return [px[i], px[i + 1], px[i + 2]]; };
  const near = (c, r) => Math.abs(c[0] - r[0]) + Math.abs(c[1] - r[1]) + Math.abs(c[2] - r[2]) <= 30;
  const rowFlat = (y, r, x0 = 0, x1 = w) => { let ok = 0; for (let x = x0; x < x1; x++) if (near(at(x, y), r)) ok++; return ok >= (x1 - x0) * 0.99; };
  const colFlat = (x, r, y0, y1) => { let ok = 0; for (let y = y0; y < y1; y++) if (near(at(x, y), r)) ok++; return ok >= (y1 - y0) * 0.99; };
  let top = 0, bot = h - 1, left = 0, right = w - 1;
  const rt = at(Math.floor(w / 2), 0), rb = at(Math.floor(w / 2), h - 1);
  // Only neutral borders (white, black, grey) are frames; a coloured edge is the design.
  const neutral = (c) => Math.max(...c) - Math.min(...c) <= 24;
  if (neutral(rt)) while (top < h - 2 && rowFlat(top, rt)) top++;
  if (neutral(rb)) while (bot > top + 1 && rowFlat(bot, rb)) bot--;
  const rl = at(0, Math.floor((top + bot) / 2)), rr = at(w - 1, Math.floor((top + bot) / 2));
  if (neutral(rl)) while (left < w - 2 && colFlat(left, rl, top, bot + 1)) left++;
  if (neutral(rr)) while (right > left + 1 && colFlat(right, rr, top, bot + 1)) right--;
  // Leave a little breathing room around what's left.
  top = Math.max(0, top - 3); left = Math.max(0, left - 3); bot = Math.min(h - 1, bot + 3); right = Math.min(w - 1, right + 3);
  const cw = right - left + 1, ch = bot - top + 1;
  if (cw * ch > w * h * 0.95 || cw < w * 0.2 || ch < h * 0.2) return false;
  const k = sz.width / w;
  const box = { x: Math.max(0, Math.floor((left - 1) * k)), y: Math.max(0, Math.floor((top - 1) * k)) };
  box.w = Math.min(sz.width - box.x, Math.ceil((cw + 2) * k));
  box.h = Math.min(sz.height - box.y, Math.ceil((ch + 2) * k));
  const tmp = file.replace(/(\.\w+)$/, ".trim$1");
  const r = run(["-y", "-i", file, "-frames:v", "1", "-vf", `crop=${box.w}:${box.h}:${box.x}:${box.y}`, "-q:v", "2", "-update", "1", tmp]);
  if (r.status !== 0 || !fs.existsSync(/*turbopackIgnore: true*/ tmp)) return false;
  fs.renameSync(/*turbopackIgnore: true*/ tmp, file);
  return true;
}

function grey(file, w) {
  const sz = size(file);
  if (!sz) return null;
  const h = Math.max(2, Math.round((w * sz.height) / sz.width));
  const px = raw(file, w, h, "gray");
  return px ? { w, h, px } : null;
}

/** Mean absolute difference of B placed at (dx, dy) over A, on the overlap. */
function mad(A, B, dx, dy, minOverlap) {
  const x0 = Math.max(0, dx), y0 = Math.max(0, dy);
  const x1 = Math.min(A.w, dx + B.w), y1 = Math.min(A.h, dy + B.h);
  const area = (x1 - x0) * (y1 - y0);
  if (x1 <= x0 || y1 <= y0 || area < minOverlap) return null;
  let sum = 0;
  for (let y = y0; y < y1; y++) {
    const ra = y * A.w, rb = (y - dy) * B.w - dx;
    for (let x = x0; x < x1; x++) sum += Math.abs(A.px[ra + x] - B.px[rb + x]);
  }
  return { mad: sum / area, area, x0, y0, x1, y1 };
}

/**
 * IS IT THE SAME PICTURE, pixel for pixel? The fingerprint above compares
 * layouts, so a careful rebuild can pass it. This lines B up on A (searching
 * scale and position, so a re-upload that was cropped, scaled or given a
 * caption bar still lines up), then counts the pixels that disagree at a
 * size where text and small shapes are still visible. A re-upload disagrees
 * only where a watermark or caption sits; a rebuild disagrees everywhere
 * the type, the status bar or a shape differs.
 *
 * Returns { differs: share of the overlap that disagrees, overlap: share of A
 * that B covers, scale, dx, dy } or null.
 */
export function sameness(fa, fb) {
  // Coarse: search widths and offsets on small thumbnails.
  const CW = 48;
  const A = grey(fa, CW);
  if (!A) return null;
  let best = null;
  for (let wb = Math.round(CW * 0.66); wb <= Math.round(CW * 1.5); wb++) {
    const B = grey(fb, wb);
    if (!B) continue;
    const R = 10;
    for (let dy = -R - Math.max(0, B.h - A.h); dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const m = mad(A, B, dx, dy, A.w * A.h * 0.7);
      if (m && (!best || m.mad < best.mad)) best = { ...m, wb, dx, dy };
    }
  }
  if (!best) return null;
  // Fine: the same placement at 5x, nudged a pixel or two either way.
  const F = 5, FW = CW * F;
  const Af = grey(fa, FW);
  let fine = null;
  for (let dw = -F; dw <= F; dw += 1) {
    const Bf = grey(fb, best.wb * F + dw);
    if (!Bf) continue;
    for (let dy = best.dy * F - 3; dy <= best.dy * F + 3; dy++) for (let dx = best.dx * F - 3; dx <= best.dx * F + 3; dx++) {
      const m = mad(Af, Bf, dx, dy, Af.w * Af.h * 0.7);
      if (m && (!fine || m.mad < fine.mad)) fine = { ...m, Bf, dx, dy };
    }
  }
  if (!fine) return null;
  const { Bf, dx, dy } = fine;
  // Most of a UI screen is flat background, and two different screens agree
  // there. So disagreement is also measured on the content alone: pixels that
  // stand out from the background in either picture (text, shapes, photos).
  const hist = new Uint32Array(32);
  for (let i = 0; i < Af.px.length; i++) hist[Af.px[i] >> 3]++;
  const bg = (hist.indexOf(Math.max(...hist)) << 3) + 4;
  let off = 0, content = 0, contentOff = 0;
  for (let y = fine.y0; y < fine.y1; y++) for (let x = fine.x0; x < fine.x1; x++) {
    const va = Af.px[y * Af.w + x], vb = Bf.px[(y - dy) * Bf.w + (x - dx)];
    const bad = Math.abs(va - vb) > 40;
    if (bad) off++;
    if (Math.abs(va - bg) > 24 || Math.abs(vb - bg) > 24) { content++; if (bad) contentOff++; }
  }
  return {
    differs: Math.round((off / fine.area) * 1000) / 1000,
    contentDiffers: content ? Math.round((contentOff / content) * 1000) / 1000 : 0,
    overlap: Math.round((fine.area / (Af.w * Af.h)) * 100) / 100,
    mad: Math.round(fine.mad * 10) / 10,
    scale: Math.round((Bf.w / Af.w) * 100) / 100,
  };
}

/** A frame with almost nothing in it (black, white, a fade) fingerprints like every other blank frame. */
export function isBlank(file) {
  const px = raw(file, 32, 32, "gray");
  if (!px) return true;
  let s = 0, s2 = 0;
  for (const v of px) { s += v; s2 += v * v; }
  const mean = s / px.length;
  return Math.sqrt(s2 / px.length - mean * mean) < 9;
}

/* ------------------------------------------------------------ colour */

function toLab([r, g, b]) {
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

/** CIEDE2000. */
export function deltaE(l1, l2) {
  const [L1, a1, b1] = l1, [L2, a2, b2] = l2, rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G);
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (a, b) => { const v = Math.atan2(b, a) / rad; return v < 0 ? v + 360 : v; };
  const h1p = h(a1p, b1), h2p = h(a2p, b2);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = h2p - h1p;
  if (C1p * C2p === 0) dhp = 0; else if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lm = (L1 + L2) / 2, Cmp = (C1p + C2p) / 2;
  let hm = h1p + h2p;
  if (C1p * C2p !== 0) hm = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + (h1p + h2p < 360 ? 360 : -360)) / 2 : (h1p + h2p) / 2;
  const T = 1 - 0.17 * Math.cos((hm - 30) * rad) + 0.24 * Math.cos(2 * hm * rad) + 0.32 * Math.cos((3 * hm + 6) * rad) - 0.2 * Math.cos((4 * hm - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2), Sc = 1 + 0.045 * Cmp, Sh = 1 + 0.015 * Cmp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh));
}

/**
 * The saturated colours across a set of pictures: k-means in Lab on small
 * thumbnails, then only clusters with real colour (chroma >= 22) that cover at
 * least 1.5% of the pixels. Greys, black and white say nothing about a copy.
 */
export function accents(files, k = 10) {
  const pts = [];
  for (const f of files) {
    const px = raw(f, 40, 40, "rgb24");
    if (!px) continue;
    for (let i = 0; i < px.length; i += 3) pts.push({ rgb: [px[i], px[i + 1], px[i + 2]], lab: toLab([px[i], px[i + 1], px[i + 2]]) });
  }
  if (pts.length < 50) return [];
  const colourful = pts.filter((p) => Math.hypot(p.lab[1], p.lab[2]) >= 22);
  if (colourful.length < pts.length * 0.015) return [];
  // Deterministic seeds: spread through the colourful pixels sorted by hue.
  colourful.sort((a, b) => Math.atan2(a.lab[2], a.lab[1]) - Math.atan2(b.lab[2], b.lab[1]));
  let cents = Array.from({ length: Math.min(k, colourful.length) }, (_, i) => colourful[Math.floor(((i + 0.5) * colourful.length) / k)].lab.slice());
  let groups;
  for (let it = 0; it < 12; it++) {
    groups = cents.map(() => []);
    for (const p of colourful) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < cents.length; c++) { const d = (p.lab[0] - cents[c][0]) ** 2 + (p.lab[1] - cents[c][1]) ** 2 + (p.lab[2] - cents[c][2]) ** 2; if (d < bd) { bd = d; best = c; } }
      groups[best].push(p);
    }
    cents = groups.map((g, c) => (g.length ? [0, 1, 2].map((j) => g.reduce((s, p) => s + p.lab[j], 0) / g.length) : cents[c]));
  }
  return groups
    .map((g, c) => ({ share: g.length / pts.length, lab: cents[c], rgb: g.length ? [0, 1, 2].map((j) => g.reduce((s, p) => s + p.rgb[j], 0) / g.length) : [0, 0, 0] }))
    .filter((g) => g.share >= 0.015 && Math.hypot(g.lab[1], g.lab[2]) >= 22)
    .sort((a, b) => b.share - a.share)
    .map((g) => ({ hex: hex(g.rgb), share: Math.round(g.share * 1000) / 10, lab: g.lab.map((v) => Math.round(v * 10) / 10) }));
}

// Colours every platform uses: matching them proves nothing.
const STOCK = ["#007AFF", "#0A84FF", "#34C759", "#30D158", "#FF3B30", "#FF453A", "#FF9500", "#FFCC00", "#5856D6", "#AF52DE", "#FF2D55", "#1DA1F2", "#1D9BF0", "#6200EE", "#03DAC6", "#4285F4", "#EA4335", "#FBBC05", "#34A853"].map((h) => toLab([1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))));

export function sameAccents(a, b) {
  const pairs = [];
  for (const x of a) {
    let best = null;
    for (const y of b) { const d = deltaE(x.lab, y.lab); if (!best || d < best.d) best = { y, d }; }
    if (best && best.d <= 6) {
      const stock = STOCK.some((s) => deltaE(s, x.lab) < 5);
      pairs.push({ a: x.hex, b: best.y.hex, deltaE: Math.round(best.d * 10) / 10, shareA: x.share, shareB: best.y.share, stock });
    }
  }
  return pairs.sort((p, q) => p.deltaE - q.deltaE);
}
