/**
 * THE MEMBERS' LIBRARY: THE DESIGN BLOCKS AND THE TRAINING SHEETS.
 *
 * The repository is public, so what members pay for is sealed in private/
 * and only the plan check hands it out. These pin that every block and every
 * sheet the site lists has its sealed file (and that it opens with the key),
 * that nothing readable sits in public/, and which plans open what.
 *
 *   npm test
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const { DESIGN_MANIFEST } = await import("../components/design-library/manifest.generated.ts");
const { SHEETS } = await import("../lib/training/sheets.ts");
const { hasPerk, trainingReach } = await import("../lib/membership/tiers.ts");
const { parseKey, unseal } = await import("../lib/shop/seal.ts");

// The key is only on machines that build; without it the round trips are skipped, not failed.
const rawKey =
  process.env.SHOP_FILE_KEY ||
  (existsSync(path.join(root, ".env.local"))
    ? readFileSync(path.join(root, ".env.local"), "utf8")
        .split(/\r?\n/)
        .find((l) => l.startsWith("SHOP_FILE_KEY="))
        ?.slice("SHOP_FILE_KEY=".length)
        .trim()
    : undefined);

const slugs = Object.keys(DESIGN_MANIFEST);

test("design: Pro and up open the library; Free gets only the blocks marked free", () => {
  assert.ok(hasPerk("pro", "design"));
  assert.ok(hasPerk("ultimate", "design"));
  assert.ok(!hasPerk("free", "design"));
  const free = slugs.filter((s) => DESIGN_MANIFEST[s].free);
  assert.ok(free.length >= 1 && free.length < slugs.length / 2, "a few free blocks, not most of them");
});

test("design: every block has its preview and its sealed source, and there is no whole-library download", () => {
  assert.ok(slugs.length >= 20);
  for (const slug of slugs) {
    assert.ok(existsSync(path.join(root, "components/design-library/compiled", `${slug}.js`)), `${slug}: no compiled preview`);
    assert.ok(existsSync(path.join(root, "private/design", `${slug}.tsx.enc`)), `${slug}: no sealed source`);
  }
  assert.ok(!existsSync(path.join(root, "private/design/construct-design.zip.enc")), "members take one block at a time");
  // Nothing sealed that the site no longer lists.
  for (const f of readdirSync(path.join(root, "private/design")))
    if (f.endsWith(".tsx.enc")) assert.ok(slugs.includes(f.replace(".tsx.enc", "")), `${f}: sealed but not listed`);
});

test("design: the public preview carries no readable source", () => {
  for (const slug of slugs) {
    const js = readFileSync(path.join(root, "components/design-library/compiled", `${slug}.js`), "utf8");
    // The header comment (props, usage) is the readable part; minified output has none.
    assert.ok(!/\n \* /.test(js), `${slug}: the preview still has the source's comments`);
  }
});

test("design: the sealed sources open with the key", { skip: !rawKey && "no SHOP_FILE_KEY here" }, () => {
  const key = parseKey(rawKey);
  for (const slug of slugs) {
    const src = unseal(readFileSync(path.join(root, "private/design", `${slug}.tsx.enc`)), key).toString("utf8");
    assert.match(src, /^"use client";/, `${slug}: source doesn't start with "use client"`);
    assert.match(src, /export default function [A-Z]/, `${slug}: no default export`);
  }
});

test("training: every sheet is sealed, with a sealed picture and a blurred public one", () => {
  assert.ok(SHEETS.length >= 12);
  assert.ok(SHEETS.filter((s) => s.group === "skills").length >= 5, "a sheet for each main skill");
  assert.equal(new Set(SHEETS.map((s) => s.id)).size, SHEETS.length, "sheet ids are unique");
  for (const s of SHEETS) {
    assert.ok(["pro", "ultimate"].includes(s.tier), `${s.id}: tier`);
    assert.ok(existsSync(path.join(root, "private/training", `${s.id}.pdf.enc`)), `${s.id}: no sealed PDF`);
    assert.ok(existsSync(path.join(root, "private/training", `${s.id}.webp.enc`)), `${s.id}: no sealed picture`);
    assert.ok(existsSync(path.join(root, "public/training", `${s.id}-locked.webp`)), `${s.id}: no locked picture`);
  }
  // The readable pictures are members' content: none of them public.
  for (const f of readdirSync(path.join(root, "public/training"))) assert.match(f, /-locked\.webp$/, `${f} is public`);
});

test("training: Pro reaches the pro sheets, Ultimate all of them, Free none", () => {
  const reach = (tier) => SHEETS.filter((s) => trainingReach(tier).includes(s.tier)).length;
  assert.equal(reach("free"), 0);
  assert.equal(reach("ultimate"), SHEETS.length);
  assert.ok(reach("pro") > 0 && reach("pro") < SHEETS.length, "Ultimate opens more than Pro");
});

test("training: the sealed PDFs open, one page each", { skip: !rawKey && "no SHOP_FILE_KEY here" }, () => {
  const key = parseKey(rawKey);
  for (const s of SHEETS) {
    const pdf = unseal(readFileSync(path.join(root, "private/training", `${s.id}.pdf.enc`)), key);
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-", `${s.id}: not a PDF`);
    assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length, 1, `${s.id}: not one page`);
  }
});
