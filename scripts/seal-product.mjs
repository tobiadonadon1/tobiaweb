#!/usr/bin/env node
/**
 * Seal a product file for the shop.
 *
 *   npm run seal -- ~/Desktop/JevTrader/dist/the-98c-trade.zip
 *
 * Encrypts the zip into private/<name>.enc with SHOP_FILE_KEY, then decrypts it
 * again to prove the sealed copy is good before you commit it. The key is read
 * from the environment or from .env.local. If there is no key yet, one is
 * generated and written to .env.local, and the script tells you to copy it to
 * the deployment's environment variables: without the same key there, the
 * download cannot decrypt the file.
 *
 * To ship a new version of the product: rebuild the zip, run this again with
 * the same key, commit private/, deploy. Every buyer's link serves the new one.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { newKey, parseKey, seal, unseal } from "../lib/shop/seal.ts";

const root = path.resolve(import.meta.dirname, "..");
const [input, outArg] = process.argv.slice(2);

if (!input) {
  console.error("usage: npm run seal -- <path/to/product.zip> [private/output.enc]");
  process.exit(1);
}

const envFile = path.join(root, ".env.local");
function keyFromEnvFile() {
  if (!existsSync(envFile)) return undefined;
  const line = readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("SHOP_FILE_KEY="));
  return line?.slice("SHOP_FILE_KEY=".length).trim() || undefined;
}

let raw = process.env.SHOP_FILE_KEY || keyFromEnvFile();
if (!raw) {
  raw = newKey();
  appendFileSync(envFile, `${existsSync(envFile) ? "\n" : ""}SHOP_FILE_KEY=${raw}\n`);
  console.log("No SHOP_FILE_KEY found, so a new one was written to .env.local.");
  console.log("Copy it to Vercel → Settings → Environment Variables (Production), or downloads will fail.\n");
}
const key = parseKey(raw);

const plain = readFileSync(path.resolve(input));
const out = path.resolve(root, outArg ?? path.join("private", `${path.basename(input)}.enc`));
mkdirSync(path.dirname(out), { recursive: true });

const sealed = seal(plain, key);
if (!unseal(sealed, key).equals(plain)) {
  console.error("Round trip failed. Nothing written.");
  process.exit(1);
}
writeFileSync(out, sealed);

const sha = createHash("sha256").update(plain).digest("hex").slice(0, 16);
console.log(`Sealed ${path.basename(input)} (${plain.length.toLocaleString()} bytes, sha256 ${sha}…)`);
console.log(`     → ${path.relative(root, out)} (${sealed.length.toLocaleString()} bytes)`);
