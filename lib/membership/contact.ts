import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseKey, unseal } from "@/lib/shop/seal";

/**
 * MY PRIVATE LINKS, for members: Telegram (with its QR code) and the
 * Calendly page for the 1-on-1 call. The Telegram ones carry my phone number
 * and the booking page is Ultimate's, and the repository is public, so they
 * are committed sealed (private/members/<name>.json.enc, with SHOP_FILE_KEY,
 * like the products) and only /api/membership/perks opens them, for a plan
 * that has the perk.
 *
 * To change one: write { "url": "https://…" } (Telegram also "qr": a
 * data:image/png;base64 URL) to a file outside the repo and run
 *   node scripts/seal-product.mjs <that file> private/members/<name>.json.enc
 */
export type SealedLink = { url: string; qr: string | null };

const cached = new Map<string, Promise<SealedLink | null>>();

export function sealedLink(name: "telegram" | "calls"): Promise<SealedLink | null> {
  let hit = cached.get(name);
  if (!hit) {
    hit = (async () => {
      const raw = process.env.SHOP_FILE_KEY;
      if (!raw) return null;
      const sealed = await readFile(path.join(process.cwd(), "private", "members", `${name}.json.enc`));
      const { url, qr } = JSON.parse(unseal(sealed, parseKey(raw)).toString("utf8")) as Partial<SealedLink>;
      return url ? { url, qr: qr ?? null } : null;
    })().catch((e) => {
      console.error(`[membership] could not open the sealed ${name} link`, e);
      cached.delete(name);
      return null;
    });
    cached.set(name, hit);
  }
  return hit;
}
