import { createHmac, timingSafeEqual } from "node:crypto";
import { parseKey } from "./seal";
import type { Product } from "./products";

/**
 * THE DOWNLOAD LINK FOR SOMETHING GIVEN AWAY.
 *
 * A bought product's link carries the Stripe session id, and Stripe vouches
 * for it. A free one has no payment to point at, so its link carries the
 * address it was sent to and a signature over that address and the product:
 * HMAC-SHA256 under a key derived from SHOP_FILE_KEY (the key that already
 * guards the sealed files, so there is nothing new to configure).
 *
 * So the link works for exactly the person it was emailed to, forever, and
 * nobody can make one for an address without the key. It is not secret from
 * that person: forwarding their own email forwards the product, which is fine
 * for a free thing. What it stops is the page handing the file out without
 * the address being left.
 */

function signingKey(): Buffer {
  const raw = process.env.SHOP_FILE_KEY;
  if (!raw) throw new Error("SHOP_FILE_KEY is not set");
  // A separate key for signing, derived rather than reused as-is.
  return createHmac("sha256", parseKey(raw)).update("free-download-v1").digest();
}

const norm = (email: string) => email.trim().toLowerCase();

export function freeToken(product: Product, email: string): string {
  return createHmac("sha256", signingKey())
    .update(`${product.id}:${norm(email)}`)
    .digest("base64url")
    .slice(0, 32);
}

export function freeLink(base: string, product: Product, email: string): string {
  const q = new URLSearchParams({ product: product.id, e: norm(email), t: freeToken(product, email) });
  return `${base}/api/download?${q}`;
}

export function verifyFree(product: Product, email: string, token: string): boolean {
  if (!product.free || !email || !token) return false;
  const want = Buffer.from(freeToken(product, email));
  const got = Buffer.from(token);
  return want.length === got.length && timingSafeEqual(want, got);
}
