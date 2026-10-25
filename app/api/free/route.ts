import { currentMember, noteDownload } from "@/lib/account";
import { later } from "@/lib/later";
import { subscribe } from "@/lib/newsletter";
import { sendFree } from "@/lib/shop/deliver";
import { freeLink } from "@/lib/shop/free";
import { recordLead } from "@/lib/shop/leads";
import { productById } from "@/lib/shop/products";
import { originFor } from "@/lib/shop/stripe";

/**
 * POST /api/free   { product, email, website?, newsletter? }
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
 *
 * A SIGNED-IN MEMBER (lib/account.ts) skips all of that: no address to type,
 * no email to wait for. The answer carries the signed download link for their
 * own address and the page starts the download at once. The lead is still
 * recorded, so the sheet keeps counting who took what.
 *
 * THE NEWSLETTER BOX under the button (lib/newsletter.ts): `newsletter: true`
 * only when the visitor ticked it. The address goes on the list and to
 * beehiiv (campaign free_skill), and its lead row says " · newsletter" too.
 */

export const dynamic = "force-dynamic";
// Room for the sheet's slow first answer, which runs after the response.
export const maxDuration = 60;

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
  if (!product || !product.free) return Response.json({ ok: false, error: "not-free" }, { status: 404 });

  const news = body.newsletter === true;
  const tag = news ? " · newsletter" : "";

  const { member, cookies } = await currentMember(request);
  if (member) {
    const download = freeLink(originFor(request), product, member.email);
    await later(async () => {
      await noteDownload(member, product.id);
      if (news) await subscribe(member.email, "free_skill", product.id);
      const stored = await recordLead({ email: member.email, product: product.id, page: `${product.href} (member)${tag}` });
      console.info("[free] member lead", product.id, stored);
    });
    const headers = new Headers({ "content-type": "application/json" });
    for (const c of cookies) headers.append("set-cookie", c);
    return new Response(JSON.stringify({ ok: true, download }), { headers });
  }

  // Free with an account only: nothing is emailed, the visitor signs in first.
  if (product.accountOnly) return Response.json({ ok: false, error: "sign-in" }, { status: 401 });

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
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
    console.info("[free] sent", product.id, sent.via);
    await later(async () => {
      if (news) await subscribe(email, "free_skill", product.id);
      const stored = await recordLead({ email, product: product.id, page: `${product.href}${tag}` });
      console.info("[free] lead", product.id, stored);
    });
    // An instant product downloads on the page too, signed for this address.
    return Response.json(product.instant ? { ok: true, download: freeLink(origin, product, email) } : { ok: true });
  } catch (err) {
    console.error("[free] could not send", product.id, err);
    // Keep the address even if the send failed, so Tobia can follow up.
    await later(async () => {
      if (news) await subscribe(email, "free_skill", product.id);
      await recordLead({ email, product: product.id, page: `${product.href} (send failed)${tag}` });
    });
    // The address is kept, so an instant product still downloads: the email was only a copy.
    if (product.instant) return Response.json({ ok: true, download: freeLink(origin, product, email) });
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
}
