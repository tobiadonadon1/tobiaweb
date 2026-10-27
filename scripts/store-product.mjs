#!/usr/bin/env node
/**
 * Put a product file in the private "products" bucket, exactly as it is.
 *
 *   node scripts/store-product.mjs "<path to the zip>" <path in the bucket>
 *   node scripts/store-product.mjs "~/Desktop/Video Editor Pro/Video Editor Pro.zip" video-editor-pro.zip
 *
 * For a file too big to send through a function (Vercel caps a response at
 * 4.5 MB): the product's `file.stored` names the path, and the download hands
 * out a signed link to it (lib/shop/file.ts). Replaces what's there, then
 * downloads it again through a signed link to prove the copy is byte for
 * byte the same. Every buyer's link serves the new one at once, no deploy.
 *
 * Reads ACCOUNTS_SUPABASE_URL and ACCOUNTS_SUPABASE_SECRET_KEY from .env.local.
 * Makes the bucket (private) the first time.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

process.loadEnvFile(".env.local");

const [input, dest] = process.argv.slice(2);
if (!input || !dest) {
  console.error('usage: node scripts/store-product.mjs "<path to the zip>" <path in the bucket>');
  process.exit(1);
}
const url = process.env.ACCOUNTS_SUPABASE_URL;
const key = process.env.ACCOUNTS_SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("ACCOUNTS_SUPABASE_URL / ACCOUNTS_SUPABASE_SECRET_KEY are not in .env.local");
  process.exit(1);
}
const auth = { apikey: key, authorization: `Bearer ${key}` };
const sha = (b) => createHash("sha256").update(b).digest("hex");

const file = readFileSync(path.resolve(input.replace(/^~(?=\/)/, os.homedir())));

// The bucket, private; "already exists" is fine.
const made = await fetch(`${url}/storage/v1/bucket`, {
  method: "POST",
  headers: { ...auth, "content-type": "application/json" },
  body: JSON.stringify({ id: "products", name: "products", public: false }),
});
if (!made.ok && !/already exists/i.test(await made.text())) {
  console.error(`could not make the bucket (${made.status})`);
  process.exit(1);
}

const object = `${url}/storage/v1/object/products/${dest.split("/").map(encodeURIComponent).join("/")}`;
const put = await fetch(object, {
  method: "POST",
  headers: { ...auth, "content-type": "application/zip", "x-upsert": "true", "cache-control": "no-store" },
  body: file,
});
if (!put.ok) {
  console.error(`upload failed (${put.status}):`, await put.text());
  process.exit(1);
}

// Prove it: fetch it back the way a buyer does.
const signed = await fetch(object.replace("/object/products/", "/object/sign/products/"), {
  method: "POST",
  headers: { ...auth, "content-type": "application/json" },
  body: JSON.stringify({ expiresIn: 60 }),
});
const { signedURL } = await signed.json();
const back = Buffer.from(await (await fetch(`${url}/storage/v1${signedURL}`)).arrayBuffer());
if (sha(back) !== sha(file)) {
  console.error("The stored copy doesn't match the file. Run this again.");
  process.exit(1);
}
console.log(`Stored ${path.basename(input)} as products/${dest} (${file.length.toLocaleString()} bytes, sha256 ${sha(file).slice(0, 16)}…), checked.`);
