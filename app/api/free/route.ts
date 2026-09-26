import { sendFree } from "@/lib/shop/deliver";
import { recordLead } from "@/lib/shop/leads";
import { productById } from "@/lib/shop/products";
import { originFor } from "@/lib/shop/stripe";

/**
 * POST /api/free   { product, email, website? }
 *
 * "Let me know where you want me to send the product": the free product's
 * whole checkout. It emails the product (the same email a buyer gets, with a
 * signed link instead of a receipt, see lib/shop/free.ts), records the address
 * (lib/shop/leads.ts), and answers { ok: true } once the email has gone.
 *
 * ABUSE. This sends mail from Tobia's Gmail to an address a stranger typed,
 * so it is guarded: a hidden `website` field that people never fill and bots
 * do (answered with a fake success, so they learn nothing), a plain address
 * check, and a per-address and per-IP limit. The limits live in memory, so
 * they reset with the function; they stop a burst, which is the realistic
 * threat, and Gmail's own daily cap is the backstop.
 */

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const WINDOW_MS = 10 * 60_000;
const PER_IP = 5;
const PER_ADDRESS = 2;
const hits = new Map<string, number[]>();

function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  const product = productById(body.product);
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  if (!product || !product.free) return Response.json({ ok: false, error: "not-free" }, { status: 404 });
  if (!EMAIL.test(email)) return Response.json({ ok: false, error: "bad-email" }, { status: 400 });

  // The honeypot: a real person never sees this field.
  if (typeof body.website === "string" && body.website.trim()) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`ip:${ip}`, PER_IP) || limited(`to:${email.toLowerCase()}`, PER_ADDRESS)) {
    return Response.json({ ok: false, error: "too-many" }, { status: 429 });
  }

  const origin = originFor(request);
  try {
    const sent = await sendFree(product, email, origin);
    const stored = await recordLead({ email, product: product.id, page: product.href });
    console.info("[free] sent", product.id, sent.via, "lead:", stored);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[free] could not send", product.id, err);
    // Keep the address even if the send failed, so Tobia can follow up.
    await recordLead({ email, product: product.id, page: `${product.href} (send failed)` });
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
}
