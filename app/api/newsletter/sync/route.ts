import { timingSafeEqual } from "node:crypto";
import { beehiivConfigured } from "@/lib/beehiiv";
import { syncOwed } from "@/lib/newsletter";

/**
 * GET /api/newsletter/sync   the daily sweep (vercel.json crons).
 *
 * A tick made while beehiiv was down is stored with synced_at null
 * (lib/newsletter.ts). This sends those to beehiiv, oldest first, a batch per
 * run, never reactivating anyone. Vercel calls it with
 * "Authorization: Bearer $CRON_SECRET"; nobody else can.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const a = Buffer.from(given), b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!beehiivConfigured()) return Response.json({ ok: false, error: "beehiiv-not-configured" }, { status: 503 });
  const result = await syncOwed(50);
  console.info("[newsletter sync]", JSON.stringify(result));
  return Response.json({ ok: true, ...result });
}
