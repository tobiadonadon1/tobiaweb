import { accountsConfigured, adminClient, authClient, currentMember, sessionCookies, type Session } from "@/lib/account";

/**
 * POST /api/account/<action>   (and GET /api/account/me)
 *
 *   signup  { email, password }        creates the account; Supabase emails a code
 *   verify  { email, code }            confirms it and signs in
 *   resend  { email }                  a fresh code
 *   signin  { email, password }        signs in (unconfirmed → a code goes out)
 *   forgot  { email }                  emails a reset code
 *   reset   { email, code, password }  sets the new password and signs in
 *   signout                            clears the session
 *   me      (GET)                      { member: { email } | null }
 *
 * Every answer is { ok, error? } with one of a few plain error codes the page
 * turns into a sentence. The session lives in httpOnly cookies set here
 * (lib/account.ts); the browser never holds a token it could leak.
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
  if (/user_already_exists|already registered/.test(m)) return "exists";
  return "failed";
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
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) return fail(reason(error));
      // Supabase answers an address that already has a confirmed account with
      // an empty user rather than an error, and sends nothing.
      if (data.user && (data.user.identities ?? []).length === 0) return fail("exists");
      return reply({ ok: true, next: "code" });
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
        // Signed up but never typed the code: send a fresh one and go there.
        if (why === "unconfirmed") {
          await sb.auth.resend({ type: "signup", email });
          return reply({ ok: false, error: "unconfirmed", next: "code" });
        }
        return fail(why);
      }
      return signedIn(data.session);
    }
    case "forgot": {
      const { error } = await sb.auth.resetPasswordForEmail(email);
      // Same answer whether or not the address has an account.
      return error && reason(error) === "too-many" ? fail("too-many", 429) : reply({ ok: true, next: "reset" });
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
