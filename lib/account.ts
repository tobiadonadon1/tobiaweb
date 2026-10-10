import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * CONSTRUCT ACCOUNTS.
 *
 * An account is an email and a password, confirmed once with a six-digit
 * code. Its point is small and concrete: a signed-in visitor takes any free
 * product in one click, without typing their email again. Every account is
 * also a row in `members`, Tobia's mailing list.
 *
 * Supabase Auth does the hard parts (password hashing, codes, rate limits;
 * project "tobiaweb", codes sent from Tobia's Gmail). The browser never
 * talks to Supabase: the site's API routes do, and keep the session in two
 * httpOnly cookies, so no token is ever readable by a script on the page.
 *
 * The env names start with ACCOUNTS_ on purpose: lib/shop/leads.ts reads
 * SUPABASE_URL to decide where leads go, and accounts must not change that.
 */

const URL = process.env.ACCOUNTS_SUPABASE_URL ?? "";
const PUBLISHABLE = process.env.ACCOUNTS_SUPABASE_PUBLISHABLE_KEY ?? "";
const SECRET = process.env.ACCOUNTS_SUPABASE_SECRET_KEY ?? "";

export const ACCESS_COOKIE = "tw_at";
export const REFRESH_COOKIE = "tw_rt";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 90; // signed in for 90 days unless they sign out

export function accountsConfigured() {
  return Boolean(URL && PUBLISHABLE && SECRET);
}

/** A fresh client per request: no session is ever shared between visitors. */
export function authClient(): SupabaseClient {
  return createClient(URL, PUBLISHABLE, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

export function adminClient(): SupabaseClient {
  return createClient(URL, SECRET, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type Session = { access_token: string; refresh_token: string; expires_in?: number };
export type Member = { id: string; email: string };

/** Set-Cookie headers for a session, or for signing out (session = null). */
export function sessionCookies(session: Session | null, secure: boolean): string[] {
  const base = `Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
  if (!session) return [`${ACCESS_COOKIE}=; ${base}; Max-Age=0`, `${REFRESH_COOKIE}=; ${base}; Max-Age=0`];
  return [
    `${ACCESS_COOKIE}=${session.access_token}; ${base}; Max-Age=${session.expires_in ?? 3600}`,
    `${REFRESH_COOKIE}=${session.refresh_token}; ${base}; Max-Age=${REFRESH_MAX_AGE}`,
  ];
}

function readCookie(header: string | null, name: string) {
  const m = (header ?? "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Who is signed in, from the request's cookies. Refreshes an expired access
 * token with the refresh token; when it does, `cookies` carries the new ones
 * for the response. Never throws: anything wrong means "not signed in".
 */
export async function currentMember(request: Request): Promise<{ member: Member | null; cookies: string[] }> {
  if (!accountsConfigured()) return { member: null, cookies: [] };
  const header = request.headers.get("cookie");
  const access = readCookie(header, ACCESS_COOKIE);
  const refresh = readCookie(header, REFRESH_COOKIE);
  const secure = new globalThis.URL(request.url).protocol === "https:";
  const sb = authClient();
  if (access) {
    const { data } = await sb.auth.getUser(access);
    if (data.user?.email) return { member: { id: data.user.id, email: data.user.email }, cookies: [] };
  }
  if (refresh) {
    const { data } = await sb.auth.refreshSession({ refresh_token: refresh });
    if (data.session && data.user?.email) {
      return { member: { id: data.user.id, email: data.user.email }, cookies: sessionCookies(data.session, secure) };
    }
    return { member: null, cookies: sessionCookies(null, secure) };
  }
  return { member: null, cookies: [] };
}

/** A member took a free product: keep the record (never blocks the download). */
export async function noteDownload(member: Member, product: string) {
  try {
    await adminClient().from("downloads").insert({ member_id: member.id, product });
  } catch (err) {
    console.error("[account] could not note download", err);
  }
}
