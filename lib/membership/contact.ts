import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseKey, unseal } from "@/lib/shop/seal";

/**
 * MY TELEGRAM, for members: the link and its QR code. Both carry my phone
 * number, and the repository is public, so they are committed sealed
 * (private/members/telegram.json.enc, with SHOP_FILE_KEY, like the products)
 * and only /api/membership/perks opens them, for a plan that has the perk.
 *
 * To change it: write { "url": "https://t.me/…", "qr": "data:image/png;base64,…" }
 * to a file outside the repo and run
 *   node scripts/seal-product.mjs <that file> private/members/telegram.json.enc
 */
export type Telegram = { url: string; qr: string | null };

let cached: Promise<Telegram | null> | undefined;

export function sealedTelegram(): Promise<Telegram | null> {
  cached ??= (async () => {
    const raw = process.env.SHOP_FILE_KEY;
    if (!raw) return null;
    const sealed = await readFile(path.join(process.cwd(), "private", "members", "telegram.json.enc"));
    const { url, qr } = JSON.parse(unseal(sealed, parseKey(raw)).toString("utf8")) as Partial<Telegram>;
    return url ? { url, qr: qr ?? null } : null;
  })().catch((e) => {
    console.error("[membership] could not open the sealed Telegram", e);
    cached = undefined;
    return null;
  });
  return cached;
}
