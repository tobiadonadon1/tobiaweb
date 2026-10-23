#!/usr/bin/env node
/**
 * PUBLISH THE TRAINING SHEETS.
 *
 *   node scripts/training-build.mjs
 *
 * For every sheet listed in lib/training/sheets.ts, takes the printed PDF and
 * its page picture from ~/Desktop/construct-training (set TRAINING_SRC to use
 * another folder) and writes:
 *
 *   private/training/<id>.pdf.enc    the PDF, sealed with SHOP_FILE_KEY (the repo is public)
 *   private/training/<id>.webp.enc   a 480px picture of the page, sealed too: it's readable
 *   public/training/<id>-locked.webp a tiny blurred one, for a plan that doesn't reach it
 *
 * A PDF is only re-sealed when it changed (its hash is kept beside it in
 * private/training/hashes.json), so a rebuild doesn't rewrite every file.
 * Print a sheet first: node ~/Desktop/construct-training/tools/print.mjs <id>
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseKey, seal, unseal } from "../lib/shop/seal.ts";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(process.env.TRAINING_SRC || path.join(os.homedir(), "Desktop/construct-training"));
const SEALED = path.join(root, "private/training");
const PICTURES = path.join(root, "public/training");

const raw =
  process.env.SHOP_FILE_KEY ||
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("SHOP_FILE_KEY="))
    ?.slice("SHOP_FILE_KEY=".length)
    .trim();
if (!raw) {
  console.error("SHOP_FILE_KEY is not set (environment or .env.local).");
  process.exit(1);
}
const key = parseKey(raw);

// The ids, read from the registry the site uses, so the two can't disagree.
const ids = [...readFileSync(path.join(root, "lib/training/sheets.ts"), "utf8").matchAll(/^\s+id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
mkdirSync(SEALED, { recursive: true });
mkdirSync(PICTURES, { recursive: true });
const hashesPath = path.join(SEALED, "hashes.json");
const hashes = existsSync(hashesPath) ? JSON.parse(readFileSync(hashesPath, "utf8")) : {};

let failed = false;
for (const id of ids) {
  const pdf = path.join(SRC, "pdf", `${id}.pdf`);
  const thumb = path.join(SRC, "thumbs", `${id}.png`);
  if (!existsSync(pdf) || !existsSync(thumb)) {
    console.error(`✗ ${id}: print it first (missing ${existsSync(pdf) ? "thumbs" : "pdf"}/${id}.*)`);
    failed = true;
    continue;
  }
  const plain = readFileSync(pdf);
  const pages = (plain.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== 1) {
    console.error(`✗ ${id}: ${pages} pages; a sheet is one page`);
    failed = true;
    continue;
  }
  const sha = createHash("sha256").update(plain).digest("hex").slice(0, 16);
  const out = path.join(SEALED, `${id}.pdf.enc`);
  if (hashes[id] !== sha || !existsSync(out)) {
    const sealed = seal(plain, key);
    if (!unseal(sealed, key).equals(plain)) throw new Error(`${id}: seal round trip failed`);
    writeFileSync(out, sealed);
    hashes[id] = sha;
    console.log(`sealed ${id} (${plain.length.toLocaleString()} bytes)`);
  }
  // The page pictures (Pillow): a readable 480px one, sealed like the PDF and
  // handed out by the same route; and a tiny blurred one anyone may see.
  const tmp = path.join(os.tmpdir(), `sheet-${id}.webp`);
  const locked = path.join(PICTURES, `${id}-locked.webp`);
  execFileSync("python3", [
    "-c",
    [
      "import sys",
      "from PIL import Image, ImageFilter",
      "im=Image.open(sys.argv[1]).convert('RGB')",
      "im.resize((480, round(im.height*480/im.width)), Image.LANCZOS).save(sys.argv[2],'WEBP',quality=82)",
      "s=im.resize((120, round(im.height*120/im.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.2))",
      "s.resize((240, round(s.height*2)), Image.BILINEAR).save(sys.argv[3],'WEBP',quality=60)",
    ].join("\n"),
    thumb,
    tmp,
    locked,
  ]);
  const picture = readFileSync(tmp);
  const psha = createHash("sha256").update(picture).digest("hex").slice(0, 16);
  const pout = path.join(SEALED, `${id}.webp.enc`);
  if (hashes[`${id}.webp`] !== psha || !existsSync(pout)) {
    writeFileSync(pout, seal(picture, key));
    hashes[`${id}.webp`] = psha;
  }
  rmSync(tmp, { force: true });
  // The readable picture used to be public; it isn't any more.
  rmSync(path.join(PICTURES, `${id}.webp`), { force: true });
}
writeFileSync(hashesPath, JSON.stringify(hashes, null, 2) + "\n");
if (failed) process.exit(1);
console.log(`✓ ${ids.length} sheets published.`);
