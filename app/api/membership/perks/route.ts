import { accountsConfigured, adminClient, currentMember } from "@/lib/account";
import { membershipOf, ownedProducts } from "@/lib/membership/server";
import { hasPerk, perksOf, trainingReach, type Perk } from "@/lib/membership/tiers";
import { SHEETS } from "@/lib/training/sheets";
import { sealedLink } from "@/lib/membership/contact";

/**
 * GET /api/membership/perks
 *
 * Everything a member's plan opens, and only that: the private links (the
 * Telegram line, the network, the live sessions, the 1-on-1 booking page),
 * the training they can reach (with the Masterclass lessons and the Design
 * templates, which are training rows on their own shelf), and what they bought. The links live in
 * environment variables and the training in the database, never in the
 * public repository, so the only way to them is through this check.
 *
 *   MEMBERS_TELEGRAM_URL   Telegram DMs              Pro and up
 *   MEMBERS_QA_URL         bi-monthly group Q&A      Pro and up
 *   MEMBERS_WORKSHOP_URL   bi-monthly workshop       Ultimate and up
 *   MEMBERS_CALLS_URL      1-on-1 booking page       Ultimate and up
 *   MEMBERS_NETWORK_URL    the members' network      Ultimate and up
 *
 * Telegram (with its QR code) and the call have sealed defaults
 * (lib/membership/contact.ts), so they work with no variable set; the
 * variable still wins if it is.
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
  let telegramQr: string | null = null;
  if (hasPerk(tier, "telegram")) {
    const sealed = await sealedLink("telegram");
    links.telegram ||= sealed?.url ?? null;
    telegramQr = sealed?.qr ?? null;
  }
  if (hasPerk(tier, "calls")) links.calls ||= (await sealedLink("calls"))?.url ?? null;

  // Rows above the plan (an Ultimate-only lesson, seen by Pro) come back
  // with no url and `locked`, so the dashboard can show what Ultimate adds
  // without ever handing the link out.
  let training: {
    id: string;
    title: string;
    summary: string | null;
    kind: string;
    url: string | null;
    tier: string;
    shelf: string;
    locked: boolean;
    /** When it went up, so the dashboard can say "new". */
    added: string;
    /** Training sheets only: the row it sits in. */
    group?: string;
  }[] = [];
  const reach = trainingReach(tier);
  if (reach.length && accountsConfigured()) {
    // `shelf` sorts rows into Training, Masterclass and Design. Before its
    // migration runs, every row reads as training.
    const read = (columns: string) =>
      adminClient().from("training").select(columns).eq("published", true).in("tier", ["pro", "ultimate"]).order("sort");
    let { data, error } = await read("id, title, summary, kind, url, tier, shelf, created_at");
    if (error && /shelf/.test(error.message)) ({ data, error } = await read("id, title, summary, kind, url, tier, created_at"));
    // Said as a failure, so the dashboard offers "Try again" rather than "soon".
    if (error) {
      console.error("[membership] could not read training", error);
      return new Response(JSON.stringify({ ok: false, error: "failed" }), { status: 500, headers });
    }
    type Row = { id: string; title: string; summary: string | null; kind: string; url: string; tier: "pro" | "ultimate"; shelf?: string; created_at: string };
    training = ((data ?? []) as unknown as Row[]).map(({ created_at, ...row }) => {
      const open = reach.includes(row.tier);
      return { ...row, url: open ? row.url : null, shelf: row.shelf ?? "training", locked: !open, added: created_at };
    });
  }

  // The training sheets live in the code, not the database (lib/training/sheets.ts):
  // first on the Training shelf, behind the same plan check.
  if (reach.length) {
    const sheets = SHEETS.map((s) => {
      const open = reach.includes(s.tier);
      return {
        id: `sheet-${s.id}`,
        title: s.title,
        summary: s.summary,
        kind: "sheet",
        group: s.group,
        url: open ? `/api/membership/file?id=${s.id}` : null,
        tier: s.tier,
        shelf: "training",
        locked: !open,
        added: `${s.added}T12:00:00Z`,
      };
    });
    training = [...sheets, ...training];
  }

  const owned = await ownedProducts(member);
  return new Response(JSON.stringify({ ok: true, tier, perks: perksOf(tier), links, telegramQr, training, owned }), { headers });
}
