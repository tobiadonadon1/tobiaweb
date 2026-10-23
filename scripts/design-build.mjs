#!/usr/bin/env node
/**
 * BUILD THE DESIGN LIBRARY.
 *
 *   node scripts/design-build.mjs            every block in ~/Desktop/construct-design/blocks
 *   node scripts/design-build.mjs --check    validate only, write nothing
 *   node scripts/design-build.mjs --lenient  skip a block that does not pass yet (while building)
 *
 * A block is two files in the source folder (outside this repo, because the
 * repo is public and the readable code is what members pay for):
 *
 *   <slug>.tsx    the component: one file, React only, its CSS inside it
 *   <slug>.json   what the page says about it (title, category, controls…)
 *
 * For each block this writes:
 *
 *   components/design-library/compiled/<slug>.js   minified, for the live preview
 *   private/design/<slug>.tsx.enc                   the source, sealed (SHOP_FILE_KEY)
 *
 * and, for the whole library, private/design/construct-design.zip.enc (every
 * source and a README, the "Download all") and
 * components/design-library/catalog.generated.ts, which the page reads.
 *
 * A source is only re-sealed when it changed (the catalog keeps its hash), so
 * a rebuild doesn't rewrite every sealed file. Set DESIGN_SRC to build from
 * another folder.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import * as esbuild from "esbuild";
import { parseKey, seal, unseal } from "../lib/shop/seal.ts";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(process.env.DESIGN_SRC || path.join(os.homedir(), "Desktop/construct-design/blocks"));
const COMPILED = path.join(root, "components/design-library/compiled");
const SEALED = path.join(root, "private/design");
const CATALOG = path.join(root, "components/design-library/catalog.generated.ts");
const CHECK = process.argv.includes("--check");
// While blocks are being written: a block that does not pass yet is skipped, not fatal.
const LENIENT = process.argv.includes("--lenient");

const CATEGORIES = ["Press", "Hover", "Drag", "Type", "Select", "Loading", "Scroll"];
const CONTROL_TYPES = ["swatch", "segment", "range"];

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

/* ---------------------------------------------------------------- key */
let key = null;
if (!CHECK) {
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
  key = parseKey(raw);
}

/* ------------------------------------------------- the previous build */
// slug → sha of the source it was sealed from, so unchanged blocks keep their sealed file.
const before = new Map();
if (existsSync(CATALOG)) {
  for (const m of readFileSync(CATALOG, "utf8").matchAll(/"slug": "([^"]+)",[\s\S]*?"sha": "([0-9a-f]+)"/g)) before.set(m[1], m[2]);
}

/* ------------------------------------------------------------- blocks */
const slugs = readdirSync(SRC)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5))
  .sort();

/* Members paste these into strict TypeScript projects: every block must
   typecheck on its own, against React's types and nothing else. */
const typeErrors = new Map();
{
  const ts = (await import("typescript")).default;
  const files = slugs.map((s) => path.join(SRC, `${s}.tsx`)).filter(existsSync);
  const types = path.join(root, "node_modules/@types");
  const program = ts.createProgram(files, {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2020,
    lib: ["lib.dom.d.ts", "lib.es2022.d.ts"],
    typeRoots: [types],
    types: ["react"],
    paths: { react: [path.join(types, "react")], "react/*": [path.join(types, "react/*")] },
  });
  for (const d of ts.getPreEmitDiagnostics(program)) {
    if (!d.file) continue;
    const slug = path.basename(d.file.fileName, ".tsx");
    const { line } = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
    const list = typeErrors.get(slug) ?? [];
    list.push(`line ${line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`);
    typeErrors.set(slug, list);
  }
}

const blocks = [];
for (const slug of slugs) {
  const errs = [];
  const err = (m) => errs.push(m);
  const tsxPath = path.join(SRC, `${slug}.tsx`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`${slug}: the slug must be lowercase-with-hyphens`);
  if (!existsSync(tsxPath)) {
    if (LENIENT) console.warn(`… skipped ${slug}: no .tsx yet`);
    else fail(`${slug}: ${slug}.json has no ${slug}.tsx beside it`);
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(readFileSync(path.join(SRC, `${slug}.json`), "utf8"));
  } catch (e) {
    if (LENIENT) console.warn(`… skipped ${slug}: bad JSON`);
    else fail(`${slug}.json is not valid JSON: ${e.message}`);
    continue;
  }
  const source = readFileSync(tsxPath, "utf8");

  // The contract a block keeps, so it can be pasted anywhere.
  if (!meta.title) err(`${slug}: no title`);
  if (!CATEGORIES.includes(meta.category)) err(`${slug}: category must be one of ${CATEGORIES.join(", ")}`);
  if (!meta.description || meta.description.length > 260) err(`${slug}: description missing or over 260 characters`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.added ?? "")) err(`${slug}: added must be YYYY-MM-DD`);
  for (const c of meta.controls ?? []) {
    if (!c.prop || !c.label || !CONTROL_TYPES.includes(c.type)) err(`${slug}: a control needs prop, label and a type of ${CONTROL_TYPES.join("/")}`);
    if (c.type !== "range" && !(Array.isArray(c.options) && c.options.every((o) => Array.isArray(o) && o.length === 2)))
      err(`${slug}: control ${c.prop} needs options as [label, value] pairs`);
    if (c.type === "range" && [c.min, c.max, c.step, c.default].some((n) => typeof n !== "number")) err(`${slug}: range ${c.prop} needs min, max, step and default (the prop's default)`);
  }
  const imports = [...source.matchAll(/^\s*import[\s\S]*?from\s+["']([^"']+)["']/gm)].map((m) => m[1]);
  const foreign = imports.filter((m) => m !== "react");
  if (foreign.length) err(`${slug}: imports ${foreign.join(", ")}; a block may import only from "react"`);
  const component = source.match(/export default function ([A-Z]\w*)/)?.[1];
  if (!component) err(`${slug}: needs \`export default function Name\` (a capitalised name)`);

  for (const t of typeErrors.get(slug) ?? []) err(`${slug}: type error, ${t}`);

  let compiled;
  try {
    const out = await esbuild.build({
      entryPoints: [tsxPath],
      bundle: true,
      write: false,
      format: "esm",
      jsx: "automatic",
      target: "es2020",
      minify: true,
      legalComments: "none",
      external: ["react", "react/jsx-runtime", "react-dom"],
      logLevel: "silent",
    });
    compiled = out.outputFiles[0].text.replace(/^"use client";/, "");
  } catch (e) {
    err(`${slug}: does not compile\n${e.message}`);
  }
  if (errs.length) {
    if (LENIENT) console.warn(`… skipped ${slug}: ${errs.join("; ")}`);
    else errs.forEach(fail);
    continue;
  }
  const sha = createHash("sha256").update(source).digest("hex").slice(0, 16);
  blocks.push({
    slug,
    component,
    title: meta.title,
    category: meta.category,
    description: meta.description,
    free: Boolean(meta.free),
    added: meta.added,
    order: typeof meta.order === "number" ? meta.order : 0,
    ground: meta.ground ?? null,
    dark: Boolean(meta.dark),
    controls: meta.controls ?? [],
    howItWorks: meta.howItWorks ?? null,
    lines: source.split("\n").length,
    sha,
    compiled,
    source,
  });
}

if (process.exitCode) {
  console.error("\nNothing written: fix the above and run it again.");
  process.exit(1);
}
if (CHECK) {
  console.log(`✓ ${blocks.length} blocks pass.`);
  process.exit(0);
}

/* ------------------------------------------------------------- write */
mkdirSync(COMPILED, { recursive: true });
mkdirSync(SEALED, { recursive: true });

const ident = (slug) => "B_" + slug.replace(/-/g, "_");
let changed = 0;
for (const b of blocks) {
  writeFileSync(
    path.join(COMPILED, `${b.slug}.js`),
    `"use client";\n/* Construct · Design library: the compiled preview of "${b.title}". The source is for members. */\n${b.compiled}`,
  );
  const sealedPath = path.join(SEALED, `${b.slug}.tsx.enc`);
  if (before.get(b.slug) !== b.sha || !existsSync(sealedPath)) {
    const plain = Buffer.from(b.source);
    const sealed = seal(plain, key);
    if (!unseal(sealed, key).equals(plain)) throw new Error(`${b.slug}: seal round trip failed`);
    writeFileSync(sealedPath, sealed);
    changed++;
  }
}

// Blocks that were removed from the source folder leave the site too.
for (const f of readdirSync(COMPILED)) if (!blocks.some((b) => `${b.slug}.js` === f)) rmSync(path.join(COMPILED, f));
for (const f of readdirSync(SEALED))
  if (f.endsWith(".tsx.enc") && !blocks.some((b) => `${b.slug}.tsx.enc` === f)) rmSync(path.join(SEALED, f));

// Newest and most loved first: the grid, the catalog and the zip all use this order.
const order = [...blocks].sort((a, b) => b.order - a.order || b.added.localeCompare(a.added) || a.title.localeCompare(b.title));

// Download all: every source and a README, zipped (when anything changed).
const zipPath = path.join(SEALED, "construct-design.zip.enc");
if (changed || !existsSync(zipPath) || before.size !== blocks.length || process.argv.includes("--zip")) {
  const dir = mkdtempSync(path.join(os.tmpdir(), "construct-design-"));
  const folder = path.join(dir, "construct-design");
  mkdirSync(path.join(folder, "components"), { recursive: true });
  for (const b of blocks) copyFileSync(path.join(SRC, `${b.slug}.tsx`), path.join(folder, "components", `${b.slug}.tsx`));
  const list = order.map((b) => `- **${b.title}** (${b.category}), \`components/${b.slug}.tsx\`, exports \`${b.component}\`: ${b.description}`);
  // The zip is also a Claude Code skill: unzipped into ~/.claude/skills/, Claude
  // knows every component and reaches for the right one on its own.
  writeFileSync(
    path.join(folder, "SKILL.md"),
    [
      "---",
      "name: construct-design",
      `description: Tobia Donadon's Construct design library, ${blocks.length} interactive React components with real motion (${order
        .slice(0, 8)
        .map((b) => b.title.toLowerCase())
        .join(", ")} and more). Use when building or polishing a React UI and a button, toggle, slider, input, list or loader should feel crafted, or when the user asks for one of these components by name.`,
      "---",
      "",
      "# Construct · Design library",
      "",
      "Each component is one self-contained file in `components/`: React only, its CSS inside it,",
      "strict TypeScript, keyboard and reduced motion handled. The comment at the top of each file",
      "lists its props and defaults.",
      "",
      "## How to use one",
      "",
      "1. Pick the component that fits from the list below. If none fits, say so; don't force one.",
      "2. Copy its file into the project's UI folder (e.g. `components/ui/`). Keep it one file.",
      "3. Read its header comment for the props. Set the colour props to the project's theme colours.",
      "   The components use `font-family: inherit`, so they take the project's font.",
      "4. Keep the motion and timing as they are: that's the point of the component.",
      "5. Remove the demo auto-reset where the header comment says it's there for the demo.",
      "6. Check it builds, typechecks, works with the keyboard and respects reduced motion.",
      "",
      "## The components",
      "",
      ...list,
      "",
    ].join("\n"),
  );
  writeFileSync(
    path.join(folder, "README.md"),
    [
      "# Construct · Design library",
      "",
      `${blocks.length} interactive React components by Tobia Donadon, for members of Construct (Pro and Ultimate).`,
      "",
      "Each file in components/ is one component: React only, no other dependencies, its CSS inside it.",
      "Copy a file into your project and import it:",
      "",
      "```tsx",
      'import HoldToConfirm from "@/components/ui/hold-to-confirm";',
      "",
      '<HoldToConfirm label="Delete project" onConfirm={() => remove()} />',
      "```",
      "",
      "Every file starts with a comment that lists its props. Works with React 18 and 19,",
      'Next.js (the files start with "use client"), Vite and Remix.',
      "",
      "## Use it as a Claude Code skill",
      "",
      "Unzip this folder into ~/.claude/skills/ (so you have ~/.claude/skills/construct-design/SKILL.md).",
      'Claude then knows every component here. Ask for one by name ("add the hold to confirm button")',
      "or describe what you need, or type /construct-design.",
      "",
      "## What's inside",
      "",
      ...list,
      "",
      "Use them in your own projects and your clients' projects. Please don't resell or",
      "republish the library itself.",
      "",
      "Newest version: https://www.tobiadonadon.com/projects/construct/design",
      "",
    ].join("\n"),
  );
  const zipFile = path.join(dir, "construct-design.zip");
  execFileSync("zip", ["-qrX", zipFile, "construct-design"], { cwd: dir });
  const plain = readFileSync(zipFile);
  writeFileSync(zipPath, seal(plain, key));
  rmSync(dir, { recursive: true, force: true });
  console.log(`Sealed the full library zip (${plain.length.toLocaleString()} bytes).`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const entry = ({ compiled, source, ...b }) => b;
writeFileSync(
  CATALOG,
  `/* GENERATED by scripts/design-build.mjs from the block sources. Don't edit: change the block's .json and build again. */
import type { ComponentType } from "react";
${order.map((b) => `import ${ident(b.slug)} from "./compiled/${b.slug}.js";`).join("\n")}

export type Control =
  | { prop: string; label: string; type: "swatch" | "segment"; options: [string, string | number | boolean][]; default?: string | number | boolean }
  | { prop: string; label: string; type: "range"; min: number; max: number; step: number; unit?: string; default?: number };

export type Block = {
  slug: string;
  /** The component's own name, for the usage line (<HoldToConfirm … />). */
  component: string;
  title: string;
  category: string;
  description: string;
  /** Open to any signed-in account; the rest are for Pro and Ultimate. */
  free: boolean;
  added: string;
  order: number;
  /** The card's ground, when the block wants one of its own. */
  ground: string | null;
  /** The block is drawn on a dark ground. */
  dark: boolean;
  controls: Control[];
  /** A few lines anyone may read: the trick at the heart of it. */
  howItWorks: string | null;
  lines: number;
  sha: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
};

export const CATEGORIES = ${JSON.stringify(CATEGORIES)} as const;

export const BLOCKS: Block[] = [
${order.map((b) => `  { ...${JSON.stringify(entry(b), null, 2).replace(/\n/g, "\n  ")}, Component: ${ident(b.slug)} },`).join("\n")}
];
`,
);

// The server's view: which blocks exist and which are free. No components,
// so the API route that hands out the source doesn't bundle the previews.
writeFileSync(
  path.join(root, "components/design-library/manifest.generated.ts"),
  `/* GENERATED by scripts/design-build.mjs. Don't edit. */
export const DESIGN_MANIFEST: Record<string, { title: string; description: string; free: boolean }> = ${JSON.stringify(
    Object.fromEntries(order.map((b) => [b.slug, { title: b.title, description: b.description, free: b.free }])),
    null,
    2,
  )};
`,
);

console.log(`✓ ${blocks.length} blocks built, ${changed} sealed anew.`);
