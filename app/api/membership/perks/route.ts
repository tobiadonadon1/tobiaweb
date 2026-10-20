import { accountsConfigured, adminClient, currentMember } from "@/lib/account";
import { membershipOf, ownedProducts } from "@/lib/membership/server";
import { hasPerk, perksOf, trainingReach, type Perk } from "@/lib/membership/tiers";

/**
 * GET /api/membership/perks
 *
 * Everything a member's plan opens, and only that: the private links (the
 * Telegram line, the network, the live sessions, the 1-on-1 booking page),
 * the training they can reach, and what they bought. The links live in
 * environment variables and the training in the database, never in the
 * public repository, so the only way to them is through this check.
 *
 *   MEMBERS_TELEGRAM_URL   Telegram DMs              Pro and up
 *   MEMBERS_QA_URL         bi-monthly group Q&A      Pro and up
 *   MEMBERS_WORKSHOP_URL   bi-monthly workshop       Ultimate and up
 *   MEMBERS_CALLS_URL      1-on-1 booking page       Ultimate and up
 *   MEMBERS_NETWORK_URL    the members' network      Ultimate and up
 */

export const dynamic = "force-dynamic";

const LINKS: [Perk, string][] = [
  ["telegram", "MEMBERS_TELEGRAM_URL"],
  ["qa", "MEMBERS_QA_URL"],
  ["workshop", "MEMBERS_WORKSHOP_URL"],
  ["calls", "MEMBERS_CALLS_URL"],
  ["network", "MEMBERS_NETWORK_URL"],
];

export async function GET(request: Request) {
  const { member, cookies } = await currentMember(request);
  const headers = new Headers({ "content-type": "application/json", "cache-control": "private, no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  if (!member) return new Response(JSON.stringify({ ok: false, error: "sign-in" }), { status: 401, headers });

  const { tier } = await membershipOf(member);
  const links: Partial<Record<Perk, string | null>> = {};
  for (const [perk, env] of LINKS) {
    // null: the plan has it, but it isn't set up yet ("coming soon" on the page).
    if (hasPerk(tier, perk)) links[perk] = process.env[env] || null;
  }

  let training: { id: string; title: string; summary: string | null; kind: string; url: string; tier: string }[] = [];
  const reach = trainingReach(tier);
  if (reach.length && accountsConfigured()) {
    const { data, error } = await adminClient()
      .from("training")
      .select("id, title, summary, kind, url, tier")
      .eq("published", true)
      .in("tier", reach)
      .order("sort");
    // Said as a failure, so the dashboard offers "Try again" rather than "soon".
    if (error) {
      console.error("[membership] could not read training", error);
      return new Response(JSON.stringify({ ok: false, error: "failed" }), { status: 500, headers });
    }
    training = data ?? [];
  }

  const owned = await ownedProducts(member);
  return new Response(JSON.stringify({ ok: true, tier, perks: perksOf(tier), links, training, owned }), { headers });
}
