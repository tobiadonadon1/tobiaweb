import type { SupabaseClient } from "@supabase/supabase-js";
import { accountsConfigured, adminClient } from "@/lib/account";

/**
 * THE NEWSLETTER: WHO SAID YES.
 *
 * Consent is a box nobody finds ticked: on Create account, on Sign in, and
 * under every free claim button (components/account/newsletter.tsx). A tick
 * lands here.
 *
 *   newsletter   every address that ticked it, once (email, source: where it
 *                was ticked, consented_at: the first time). The list to send to.
 *   members      an account's own flag, `mailing`, kept in step for accounts,
 *                so the site knows not to ask a subscribed member again.
 *
 * The table comes from supabase/migrations/20261016220000_newsletter.sql.
 * Until that is applied the upsert fails, which is logged and nothing more:
 * a tick never breaks a sign-in or a download, and anonymous ticks are also
 * marked on their lead row in the sheet (app/api/free).
 *
 * Server only. Every function takes an optional client so the tests can pass
 * a stand-in; without one it is the secret-key client, and without accounts
 * configured it does nothing.
 */

type Db = Pick<SupabaseClient, "from">;
const db = (given?: Db): Db | null => given ?? (accountsConfigured() ? adminClient() : null);

/** Someone ticked the box. Adds them to the list and, if they have an account, sets its flag. */
export async function subscribe(email: string, source: string, given?: Db): Promise<boolean> {
  const sb = db(given);
  if (!sb) return false;
  const address = email.trim().toLowerCase();
  let ok = true;
  try {
    const { error } = await sb.from("members").update({ mailing: true }).eq("email", address);
    if (error) throw error;
  } catch (err) {
    ok = false;
    console.error("[newsletter] could not set the member's flag", err);
  }
  try {
    const { error } = await sb
      .from("newsletter")
      .upsert({ email: address, source: source.slice(0, 80) }, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw error;
  } catch (err) {
    ok = false;
    console.error("[newsletter] could not add to the list", err);
  }
  return ok;
}

/** A new account's answer, ticked or not: written explicitly, never left to a default. */
export async function setMailing(email: string, on: boolean, source: string, given?: Db): Promise<void> {
  if (on) {
    await subscribe(email, source, given);
    return;
  }
  const sb = db(given);
  if (!sb) return;
  try {
    const { error } = await sb.from("members").update({ mailing: false }).eq("email", email.trim().toLowerCase());
    if (error) throw error;
  } catch (err) {
    console.error("[newsletter] could not clear the member's flag", err);
  }
}

/** Whether an account is subscribed. Unknown (an error) counts as subscribed, so nobody is nagged by a hiccup. */
export async function isSubscribed(email: string, given?: Db): Promise<boolean> {
  const sb = db(given);
  if (!sb) return true;
  try {
    const { data, error } = await sb.from("members").select("mailing").eq("email", email.trim().toLowerCase()).maybeSingle();
    if (error) throw error;
    return Boolean((data as { mailing?: boolean } | null)?.mailing);
  } catch (err) {
    console.error("[newsletter] could not read the member's flag", err);
    return true;
  }
}
