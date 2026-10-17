import type { SupabaseClient } from "@supabase/supabase-js";
import { accountsConfigured, adminClient } from "@/lib/account";
import { addSubscriber, isGone, type AddResult, type Campaign } from "@/lib/beehiiv";

/**
 * THE NEWSLETTER: WHO SAID YES, AND BEEHIIV.
 *
 * Consent is a box nobody finds ticked (components/account/newsletter.tsx),
 * in three places, each with its beehiiv campaign:
 *
 *   Create account                      account_signup
 *   under every "Get it for free"       free_skill
 *   Sign in, and the bot's nudge after  login_prompt
 *
 * A tick lands here, in this order:
 *
 *   1. newsletter   the consent record: one row per address (email, source:
 *                   the exact place, campaign, consented_at: the first time).
 *                   Written before beehiiv is asked, so consent is never lost.
 *   2. members      an account's own flag, `mailing`, kept in step.
 *   3. beehiiv      the address is added to "Notes from Tobi" (lib/beehiiv.ts).
 *                   Accepted: beehiiv's id and status are stored with synced_at.
 *                   Down or slow: the row keeps synced_at null and the error,
 *                   and the daily sweep (syncOwed, app/api/newsletter/sync)
 *                   sends it later.
 *
 * NO DUPLICATES. The row is keyed by address; a second tick anywhere keeps
 * the first time and place, and an address beehiiv already has is not sent
 * again.
 *
 * NEVER REACTIVATED. Someone who unsubscribed (beehiiv's webhook, see
 * markUnsubscribed) stays unsubscribed: a later tick changes nothing here,
 * and beehiiv is always asked with reactivate_existing false. If beehiiv
 * already had the address as unsubscribed, its answer ("inactive") is
 * recorded the same way.
 *
 * NOTHING BREAKS A SIGN-IN OR A DOWNLOAD. Every function here catches and
 * logs; the routes run them after the response (lib/later.ts).
 *
 * Server only. Every function takes an optional client and beehiiv call so
 * the tests can pass stand-ins; without one it is the secret-key client, and
 * without accounts configured it does nothing.
 */

type Db = Pick<SupabaseClient, "from">;
type Push = (email: string, campaign: Campaign) => Promise<AddResult>;
type Deps = { db?: Db; push?: Push };

/** pending: the consent is stored, beehiiv didn't take it yet (the sweep will send it). */
export type Outcome = "subscribed" | "pending" | "unsubscribed" | "failed";
export type { Campaign };

/** After this many failed sends the sweep stops trying an address (the error stays on the row). */
export const MAX_ATTEMPTS = 8;
const GAVE_UP = 99;

const client = (given?: Db): Db | null => given ?? (accountsConfigured() ? adminClient() : null);
const normal = (email: string) => email.trim().toLowerCase();

type Row = { email: string; status: string; campaign: string | null; synced_at: string | null; sync_attempts: number | null };

async function readRow(sb: Db, email: string): Promise<Row | null> {
  const { data, error } = await sb
    .from("newsletter")
    .select("email,status,campaign,synced_at,sync_attempts")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return (data as Row | null) ?? null;
}

async function setFlag(sb: Db, email: string, on: boolean) {
  try {
    const { error } = await sb.from("members").update({ mailing: on }).eq("email", email);
    if (error) throw error;
  } catch (err) {
    console.error("[newsletter] could not set the member's flag", err);
  }
}

/** Send one address to beehiiv and write down what it said. */
async function push(sb: Db, row: Pick<Row, "email" | "campaign" | "sync_attempts">, campaign: Campaign, send: Push): Promise<Outcome> {
  const r = await send(row.email, (row.campaign as Campaign | null) ?? campaign);
  const now = new Date().toISOString();
  try {
    if (r.ok && isGone(r.status)) {
      // beehiiv already has them as unsubscribed (or the address bounces): respect it.
      const { error } = await sb
        .from("newsletter")
        .update({ status: "unsubscribed", unsubscribed_at: now, beehiiv_id: r.id, beehiiv_status: r.status, synced_at: now, sync_error: null, updated_at: now })
        .eq("email", row.email);
      if (error) throw error;
      await setFlag(sb, row.email, false);
      console.info("[newsletter] beehiiv has this address as", r.status, "- recorded, not reactivated");
      return "unsubscribed";
    }
    if (r.ok) {
      const { error } = await sb
        .from("newsletter")
        .update({ beehiiv_id: r.id, beehiiv_status: r.status, synced_at: now, sync_error: null, updated_at: now })
        .eq("email", row.email);
      if (error) throw error;
      return "subscribed";
    }
    console.error("[newsletter] beehiiv did not take the address, kept to send again:", r.error);
    const attempts = r.retry ? (row.sync_attempts ?? 0) + 1 : GAVE_UP;
    const { error } = await sb.from("newsletter").update({ sync_error: r.error, sync_attempts: attempts, updated_at: now }).eq("email", row.email);
    if (error) throw error;
  } catch (err) {
    console.error("[newsletter] could not record beehiiv's answer", err);
  }
  // Consent is stored either way; beehiiv will get it from the sweep.
  return r.ok ? "subscribed" : "pending";
}

/**
 * Someone ticked the box. Records the consent, flags their account, and adds
 * them to beehiiv. Never throws.
 */
export async function subscribe(email: string, campaign: Campaign, source: string, deps: Deps = {}): Promise<Outcome> {
  const sb = client(deps.db);
  if (!sb) return "failed";
  const address = normal(email);
  try {
    let row = await readRow(sb, address);
    if (row?.status === "unsubscribed") {
      console.info("[newsletter] tick from an address that unsubscribed: left unsubscribed");
      return "unsubscribed";
    }
    if (!row) {
      const { error } = await sb
        .from("newsletter")
        .upsert({ email: address, source: source.slice(0, 80), campaign, status: "subscribed" }, { onConflict: "email", ignoreDuplicates: true });
      if (error) throw error;
      // Re-read: a tick racing this one may have written the row first.
      row = (await readRow(sb, address)) ?? { email: address, status: "subscribed", campaign, synced_at: null, sync_attempts: 0 };
      if (row.status === "unsubscribed") return "unsubscribed";
    }
    await setFlag(sb, address, true);
    if (row.synced_at) return "subscribed";
    return await push(sb, row, campaign, deps.push ?? addSubscriber);
  } catch (err) {
    console.error("[newsletter] could not record the tick", err);
    return "failed";
  }
}

/** A new account's answer, ticked or not: written explicitly, never left to a default. */
export async function setMailing(email: string, on: boolean, campaign: Campaign, source: string, deps: Deps = {}): Promise<void> {
  if (on) {
    await subscribe(email, campaign, source, deps);
    return;
  }
  const sb = client(deps.db);
  if (sb) await setFlag(sb, normal(email), false);
}

/**
 * Whether this address has already answered (subscribed, or unsubscribed
 * since), so the site stops showing it the box. Only an address with no
 * record is asked. Unknown (an error) counts as answered: nobody is nagged
 * by a hiccup.
 */
export async function isSubscribed(email: string, deps: Deps = {}): Promise<boolean> {
  const sb = client(deps.db);
  if (!sb) return true;
  try {
    return (await readRow(sb, normal(email))) !== null;
  } catch (err) {
    console.error("[newsletter] could not read the list", err);
    return true;
  }
}

/**
 * beehiiv says this address unsubscribed (or was deleted): record it, so the
 * site never adds it again. An address the site never had is recorded too.
 */
export async function markUnsubscribed(email: string, beehiivId: string | null, deps: Deps = {}): Promise<boolean> {
  const sb = client(deps.db);
  if (!sb) return false;
  const address = normal(email);
  const now = new Date().toISOString();
  try {
    const fields = { status: "unsubscribed", unsubscribed_at: now, beehiiv_status: "inactive", updated_at: now, ...(beehiivId ? { beehiiv_id: beehiivId } : {}) };
    const row = await readRow(sb, address);
    const { error } = row
      ? await sb.from("newsletter").update(fields).eq("email", address)
      : await sb.from("newsletter").upsert({ email: address, source: "beehiiv", ...fields }, { onConflict: "email" });
    if (error) throw error;
    await setFlag(sb, address, false);
    return true;
  } catch (err) {
    console.error("[newsletter] could not record an unsubscribe", err);
    return false;
  }
}

/** Send beehiiv every consent it doesn't have yet (it was down at the time). */
export async function syncOwed(limit = 50, deps: Deps = {}): Promise<{ tried: number; sent: number; unsubscribed: number; failed: number }> {
  const sb = client(deps.db);
  const out = { tried: 0, sent: 0, unsubscribed: 0, failed: 0 };
  if (!sb) return out;
  const { data, error } = await sb
    .from("newsletter")
    .select("email,status,campaign,synced_at,sync_attempts")
    .eq("status", "subscribed")
    .is("synced_at", null)
    .lt("sync_attempts", MAX_ATTEMPTS)
    .order("consented_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("[newsletter] could not read the owed list", error);
    return out;
  }
  for (const row of (data as Row[] | null) ?? []) {
    out.tried++;
    const r = await push(sb, row, "free_skill", deps.push ?? addSubscriber);
    if (r === "subscribed") out.sent++;
    else if (r === "unsubscribed") out.unsubscribed++;
    else out.failed++; // pending: still owed, tried again tomorrow
  }
  return out;
}
