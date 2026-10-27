import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseKey, unseal } from "@/lib/shop/seal";

/**
 * THE DRIVE COPIES, for buyers of a skill who have no plan: their email and
 * thank-you page link here instead of to the Masterclass page.
 *
 * The repository is public and a Drive link is the lesson itself, so the
 * links are committed sealed (private/masterclass/drive.json.enc, with
 * SHOP_FILE_KEY, like the products and the members' links) and only opened
 * on the server. To change one: write { "<product id>": "https://drive…" }
 * to a file outside the repo and run
 *   node scripts/seal-product.mjs <that file> private/masterclass/drive.json.enc
 */
let cached: Promise<Record<string, string>> | null = null;

export function driveLinks(): Promise<Record<string, string>> {
  cached ??= (async () => {
    const raw = process.env.SHOP_FILE_KEY;
    if (!raw) return {};
    const sealed = await readFile(path.join(process.cwd(), "private", "masterclass", "drive.json.enc"));
    return JSON.parse(unseal(sealed, parseKey(raw)).toString("utf8")) as Record<string, string>;
  })().catch((e) => {
    console.error("[masterclass] could not open the sealed Drive links", e);
    cached = null;
    return {};
  });
  return cached;
}
