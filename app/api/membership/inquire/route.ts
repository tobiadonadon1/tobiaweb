import { accountsConfigured, adminClient, currentMember } from "@/lib/account";
import { membershipOf } from "@/lib/membership/server";
import { notifyTobia } from "@/lib/membership/notify";
import { hasPerk, planName } from "@/lib/membership/tiers";

/**
 * POST /api/membership/inquire
 *
 *   { kind: "commission", body, budget? }        Ultimate and up: a skill built for them
 *   { kind: "universal", body, name?, email? }   anyone: "let's talk" about Universal
 *
 * Kept in `inquiries` and emailed to Tobia with the person as Reply-To.
 * `website` is a field no person fills in; a form that arrives with it is a
 * bot and gets a quiet "ok".
 */

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const WINDOW_MS = 60 * 60_000;
const hits = new Map<string, number[]>();
function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const json = (body: unknown, status = 200, cookies: string[] = []) => {
  const headers = new Headers({ "content-type": "application/json", "cache-control": "no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(JSON.stringify(body), { status, headers });
};
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }
  if (text(body.website, 200)) return json({ ok: true });
  if (!accountsConfigured()) return json({ ok: false, error: "unavailable" }, 503);

  const kind = body.kind === "commission" || body.kind === "universal" ? body.kind : null;
  if (!kind) return json({ ok: false, error: "bad-request" }, 400);
  const message = text(body.body, 4000);
  if (message.length < 10) return json({ ok: false, error: "too-short" }, 400);

  const { member, cookies } = await currentMember(request);
  const { tier } = await membershipOf(member);
  if (kind === "commission" && (!member || !hasPerk(tier, "commission"))) {
    return json({ ok: false, error: member ? "plan" : "sign-in", needs: "ultimate" }, member ? 403 : 401, cookies);
  }
  const email = member?.email ?? text(body.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: "bad-email" }, 400, cookies);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`ip:${ip}`, 6) || limited(`to:${email}`, 3)) return json({ ok: false, error: "too-many" }, 429, cookies);
  // The same cap, counted in the database: the map above is one server's
  // memory, and a new server starts it empty.
  const db = adminClient();
  const { count } = await db
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - WINDOW_MS).toISOString());
  if ((count ?? 0) >= 3) return json({ ok: false, error: "too-many" }, 429, cookies);

  const name = text(body.name, 120) || null;
  const budget = text(body.budget, 120) || null;
  const { error } = await db
    .from("inquiries")
    .insert({ kind, member_id: member?.id ?? null, email, name, body: message, budget });
  if (error) {
    console.error("[membership] could not save an inquiry", error);
    return json({ ok: false, error: "failed" }, 500, cookies);
  }

  const subject = kind === "commission" ? `Commission request from ${email}` : `Universal: ${name ?? email} wants to talk`;
  await notifyTobia(
    subject,
    [`From: ${name ? `${name} <${email}>` : email}`, `Plan: ${planName(tier)}`, budget ? `Budget: ${budget}` : "", "", message]
      .filter((l, i) => l || i > 2)
      .join("\n"),
    email,
  );
  return json({ ok: true }, 200, cookies);
}
