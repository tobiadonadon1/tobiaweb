import { accountsConfigured, adminClient, currentMember } from "@/lib/account";
import { membershipOf } from "@/lib/membership/server";
import { hasPerk } from "@/lib/membership/tiers";

/**
 * THE REQUESTS BOARD (Ultimate and up).
 *
 *   GET                                       the requests, most votes first
 *   POST { action: "create", title, details } ask for a skill (3 every 30 days)
 *   POST { action: "vote" | "unvote", id }    one vote per member per request
 *
 * Tobia moves a request along (open → planned → building → shipped, or
 * declined) by editing its status in the database; the board shows it.
 */

export const dynamic = "force-dynamic";

const PER_30_DAYS = 3;

const json = (body: unknown, status = 200, cookies: string[] = []) => {
  const headers = new Headers({ "content-type": "application/json", "cache-control": "private, no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(JSON.stringify(body), { status, headers });
};

async function gate(request: Request) {
  const { member, cookies } = await currentMember(request);
  if (!member) return { error: json({ ok: false, error: "sign-in" }, 401, cookies) };
  if (!accountsConfigured()) return { error: json({ ok: false, error: "unavailable" }, 503, cookies) };
  const { tier } = await membershipOf(member);
  if (!hasPerk(tier, "requests")) return { error: json({ ok: false, error: "plan", needs: "ultimate" }, 403, cookies) };
  return { member, cookies };
}

export async function GET(request: Request) {
  const g = await gate(request);
  if (g.error) return g.error;
  const db = adminClient();
  const { data: rows, error } = await db
    .from("skill_requests")
    .select("id, member_id, title, details, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return json({ ok: false, error: "failed" }, 500, g.cookies);
  const ids = (rows ?? []).map((r) => r.id);
  const { data: votes } = ids.length
    ? await db.from("skill_votes").select("request_id, member_id").in("request_id", ids)
    : { data: [] as { request_id: number; member_id: string }[] };

  const requests = (rows ?? [])
    .map((r) => {
      const mine = (votes ?? []).filter((v) => v.request_id === r.id);
      return {
        id: r.id,
        title: r.title,
        details: r.details,
        status: r.status,
        created_at: r.created_at,
        votes: mine.length,
        voted: mine.some((v) => v.member_id === g.member.id),
        yours: r.member_id === g.member.id,
      };
    })
    .sort((a, b) => b.votes - a.votes || b.created_at.localeCompare(a.created_at));
  return json({ ok: true, requests }, 200, g.cookies);
}

export async function POST(request: Request) {
  const g = await gate(request);
  if (g.error) return g.error;
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400, g.cookies);
  }
  const db = adminClient();

  if (body.action === "create") {
    const title = typeof body.title === "string" ? body.title.trim().replace(/\s+/g, " ") : "";
    const details = typeof body.details === "string" ? body.details.trim().slice(0, 2000) : "";
    if (title.length < 3 || title.length > 120) return json({ ok: false, error: "bad-title" }, 400, g.cookies);
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { count } = await db
      .from("skill_requests")
      .select("id", { count: "exact", head: true })
      .eq("member_id", g.member.id)
      .gte("created_at", since);
    if ((count ?? 0) >= PER_30_DAYS) return json({ ok: false, error: "limit", per: PER_30_DAYS }, 429, g.cookies);
    const { data, error } = await db
      .from("skill_requests")
      .insert({ member_id: g.member.id, title, details: details || null })
      .select("id")
      .single();
    if (error || !data) return json({ ok: false, error: "failed" }, 500, g.cookies);
    // Asking for it is a vote for it.
    await db.from("skill_votes").insert({ request_id: data.id, member_id: g.member.id });
    return json({ ok: true, id: data.id }, 200, g.cookies);
  }

  if (body.action === "vote" || body.action === "unvote") {
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id < 1) return json({ ok: false, error: "bad-request" }, 400, g.cookies);
    const { error } =
      body.action === "vote"
        ? await db.from("skill_votes").upsert({ request_id: id, member_id: g.member.id }, { ignoreDuplicates: true })
        : await db.from("skill_votes").delete().eq("request_id", id).eq("member_id", g.member.id);
    if (error) return json({ ok: false, error: error.code === "23503" ? "not-found" : "failed" }, error.code === "23503" ? 404 : 500, g.cookies);
    return json({ ok: true }, 200, g.cookies);
  }

  return json({ ok: false, error: "bad-request" }, 400, g.cookies);
}
