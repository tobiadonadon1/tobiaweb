import { accountsConfigured, adminClient, authClient, currentMember, sessionCookies, type Session } from "@/lib/account";

/**
 * POST /api/account/<action>   (and GET /api/account/me)
 *
 *   signup  { email, password }        creates the account and signs in at once
 *   verify  { email, code }            confirms an older account with its code
 *   resend  { email }                  a fresh code
 *   signin  { email, password }        signs in
 *   forgot  { email }                  emails a reset code
 *   reset   { email, code, password }  sets the new password and signs in
 *   signout                            clears the session
 *   me      (GET)                      { member: { email } | null }
 *
 * Every answer is { ok, error? } with one of a few plain error codes the page
 * turns into a sentence. The session lives in httpOnly cookies set here
 * (lib/account.ts); the browser never holds a token it could leak.
 *
 * NO CODE TO SIGN UP (Tobia's call, 2026-10-13). Accounts used to wait for a
 * six-digit code sent from Tobia's Gmail; when Google locked that login (SMTP
 * 534-5.7.9) every sign-up failed. Now the account is made already confirmed
 * and the visitor is signed in: nothing on the way in waits for an email.
 * The cost, accepted: an address isn't proven to be theirs. Email is still
 * how a password is reset. Accounts made before and never confirmed are
 * finished by signing up again or by signing in with their password.
 *
 * LIMITS. Supabase sees every request coming from this server, so its per-IP
 * limits can't tell visitors apart. These in-memory ones can, and stop a
 * burst against one address or from one visitor, like /api/free's.
 */

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const MIN_PASSWORD = 8;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, number[]>();

function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const over = recent.length >= max;
  if (!over) recent.push(now);
  hits.set(key, recent);
  return over;
}

function reply(body: Record<string, unknown>, status = 200, cookies: string[] = []) {
  const headers = new Headers({ "content-type": "application/json", "cache-control": "no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(JSON.stringify(body), { status, headers });
}
const fail = (error: string, status = 400) => reply({ ok: false, error }, status);

/** Supabase's messages, reduced to the few things a visitor can act on. */
function reason(err: { message?: string; code?: string; status?: number } | null): string {
  const m = `${err?.code ?? ""} ${err?.message ?? ""}`.toLowerCase();
  if (/email_not_confirmed|not confirmed/.test(m)) return "unconfirmed";
  if (/invalid_credentials|invalid login/.test(m)) return "wrong-password";
  if (/otp_expired|expired|invalid.*(token|otp)|token.*invalid/.test(m)) return "bad-code";
  if (/weak_password|password should/.test(m)) return "weak-password";
  if (/rate|too many|over_.*limit|security purposes/.test(m) || err?.status === 429) return "too-many";
  if (/user_already_exists|email_exists|already (been )?registered/.test(m)) return "exists";
  // The code's email didn't go out (Supabase sends it through Tobia's Gmail).
  if (/error sending|smtp/.test(m)) return "mail-down";
  return "failed";
}

/** The auth user behind an address, through members (one row per account, made by trigger). */
async function userByEmail(email: string) {
  const admin = adminClient();
  const { data: row } = await admin.from("members").select("id").eq("email", email).maybeSingle();
  if (!row?.id) return null;
  const { data } = await admin.auth.admin.getUserById(row.id);
  return data.user ?? null;
}

/** Confirm an account (and set its password) without a code. Returns the error, if any. */
async function confirm(id: string, password?: string) {
  const { error } = await adminClient().auth.admin.updateUserById(id, password ? { password, email_confirm: true } : { email_confirm: true });
  return error;
}

export async function GET(request: Request, { params }: { params: Promise<{ action: string }> }) {
  if ((await params).action !== "me") return fail("not-found", 404);
  const { member, cookies } = await currentMember(request);
  return reply({ ok: true, member: member ? { email: member.email } : null }, 200, cookies);
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!accountsConfigured()) return fail("unavailable", 503);
  const secure = new URL(request.url).protocol === "https:";
  const signedIn = (session: Session | null) => reply({ ok: true }, 200, sessionCookies(session, secure));

  if (action === "signout") return signedIn(null);

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return fail("bad-request");
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 10) : "";
  if (!EMAIL.test(email)) return fail("bad-email");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  // Codes are six digits: few guesses per address, generous for typing.
  const budget = action === "verify" || action === "reset" ? 8 : action === "signin" ? 10 : 4;
  if (limited(`${action}:ip:${ip}`, budget * 3) || limited(`${action}:to:${email}`, budget)) return fail("too-many", 429);

  const sb = authClient();

  switch (action) {
    case "signup": {
      if (password.length < MIN_PASSWORD) return fail("weak-password");
      const made = await adminClient().auth.admin.createUser({ email, password, email_confirm: true });
      if (made.error) {
        const why = reason(made.error);
        if (why !== "exists") return fail(why);
        // Made before the change but never confirmed (its code never came):
        // finish it with the password just chosen. A confirmed one stays theirs.
        const user = await userByEmail(email);
        if (!user || user.email_confirmed_at) return fail("exists");
        if (await confirm(user.id, password)) return fail("failed");
      }
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error || !data.session) return fail(reason(error));
      return signedIn(data.session);
    }
    case "resend": {
      const { error } = await sb.auth.resend({ type: "signup", email });
      return error ? fail(reason(error)) : reply({ ok: true });
    }
    case "verify": {
      if (code.length < 6) return fail("bad-code");
      const { data, error } = await sb.auth.verifyOtp({ email, token: code, type: "email" });
      if (error || !data.session) return fail(reason(error));
      return signedIn(data.session);
    }
    case "signin": {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        const why = reason(error);
        // Made before the change and never confirmed. Supabase only says "not
        // confirmed" once the password has matched, so confirm it and go in.
        if (why === "unconfirmed") {
          const user = await userByEmail(email);
          if (!user || (await confirm(user.id))) return fail("failed");
          const again = await sb.auth.signInWithPassword({ email, password });
          if (again.error || !again.data.session) return fail(reason(again.error));
          return signedIn(again.data.session);
        }
        return fail(why);
      }
      return signedIn(data.session);
    }
    case "forgot": {
      const { error } = await sb.auth.resetPasswordForEmail(email);
      // Same answer whether or not the address has an account (Supabase
      // doesn't error for an unknown one). A send that failed is said, not
      // hidden: otherwise the visitor waits for a code that isn't coming.
      if (!error) return reply({ ok: true, next: "reset" });
      const why = reason(error);
      if (why === "too-many") return fail("too-many", 429);
      return why === "mail-down" ? fail("mail-down", 503) : reply({ ok: true, next: "reset" });
    }
    case "reset": {
      if (password.length < MIN_PASSWORD) return fail("weak-password");
      if (code.length < 6) return fail("bad-code");
      const { data, error } = await sb.auth.verifyOtp({ email, token: code, type: "recovery" });
      if (error || !data.session || !data.user) return fail(reason(error));
      const { error: setErr } = await adminClient().auth.admin.updateUserById(data.user.id, { password });
      if (setErr) return fail(reason(setErr));
      // A new password ends every session, the code's own included: sign in
      // again with it so the visitor lands signed in.
      const fresh = await authClient().auth.signInWithPassword({ email, password });
      return signedIn(fresh.data.session);
    }
    default:
      return fail("not-found", 404);
  }
}
