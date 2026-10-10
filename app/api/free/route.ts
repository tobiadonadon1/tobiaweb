import { after } from "next/server";
import { currentMember, noteDownload } from "@/lib/account";
import { sendFree } from "@/lib/shop/deliver";
import { freeLink } from "@/lib/shop/free";
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
 *
 * A SIGNED-IN MEMBER (lib/account.ts) skips all of that: no address to type,
 * no email to wait for. The answer carries the signed download link for their
 * own address and the page starts the download at once. The lead is still
 * recorded, so the sheet keeps counting who took what.
 */

export const dynamic = "force-dynamic";
// Room for the sheet's slow first answer, which runs after the response.
export const maxDuration = 60;

/**
 * Run `task` after the response has gone. Outside a request (the tests call
 * the handler directly) there is nothing to run after, so run it now.
 */
async function later(task: () => Promise<unknown>) {
  try {
    after(task);
  } catch {
    await task();
  }
}

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

  const { member, cookies } = await currentMember(request);
  if (member) {
    const download = freeLink(originFor(request), product, member.email);
    await later(async () => {
      await noteDownload(member, product.id);
      const stored = await recordLead({ email: member.email, product: product.id, page: `${product.href} (member)` });
      console.info("[free] member lead", product.id, stored);
    });
    const headers = new Headers({ "content-type": "application/json" });
    for (const c of cookies) headers.append("set-cookie", c);
    return new Response(JSON.stringify({ ok: true, download }), { headers });
  }

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
      const stored = await recordLead({ email, product: product.id, page: product.href });
      console.info("[free] lead", product.id, stored);
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[free] could not send", product.id, err);
    // Keep the address even if the send failed, so Tobia can follow up.
    await later(() => recordLead({ email, product: product.id, page: `${product.href} (send failed)` }));
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
}
