import { accountsConfigured, adminClient, authClient, currentMember, sessionCookies, type Session } from "@/lib/account";
import { isSubscribed, setMailing, subscribe } from "@/lib/newsletter";

/**
 * POST /api/account/<action>   (and GET /api/account/me)
 *
 *   signup  { email, password, newsletter? }  creates the account; Supabase emails a code
 *   verify  { email, code }            confirms it and signs in
 *   resend  { email }                  a fresh code
 *   signin  { email, password, newsletter? }  signs in (unconfirmed → a code goes out);
 *                                     the reply says whether they're subscribed
 *   newsletter                         the signed-in member ticks the box (the sign-in nudge)
 *   forgot  { email }                  emails a reset code
 *   reset   { email, code, password }  sets the new password and signs in
 *   signout                            clears the session
 *   me      (GET)                      { member: { email, newsletter } | null }
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
  if (/user_already_exists|email_exists|already (been )?registered/.test(m)) return "exists";
  // The code's email didn't go out (Supabase sends it through Tobia's Gmail).
  if (/error sending|smtp/.test(m)) return "mail-down";
  return "failed";
}

export async function GET(request: Request, { params }: { params: Promise<{ action: string }> }) {
  if ((await params).action !== "me") return fail("not-found", 404);
  const { member, cookies } = await currentMember(request);
  if (!member) return reply({ ok: true, member: null }, 200, cookies);
  return reply({ ok: true, member: { email: member.email, newsletter: await isSubscribed(member.email) } }, 200, cookies);
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!accountsConfigured()) return fail("unavailable", 503);
  const secure = new URL(request.url).protocol === "https:";
  const signedIn = (session: Session | null) => reply({ ok: true }, 200, sessionCookies(session, secure));

  if (action === "signout") return signedIn(null);

  // The box ticked after signing in (the bot's nudge on the sign-in form).
  if (action === "newsletter") {
    const { member, cookies } = await currentMember(request);
    if (!member) return fail("signed-out", 401);
    await subscribe(member.email, "signin");
    return reply({ ok: true }, 200, cookies);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return fail("bad-request");
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 10) : "";
  // The newsletter box: only a real tick counts, never a default.
  const newsletter = body.newsletter === true;
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
      // The trigger made the members row; write the box's answer on it.
      await setMailing(email, newsletter, "signup");
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
          // The password was right (Supabase checks it first): a tick counts.
          if (newsletter) await subscribe(email, "signin");
          const sent = await sb.auth.resend({ type: "signup", email });
          if (sent.error && reason(sent.error) === "mail-down") return fail("mail-down", 503);
          return reply({ ok: false, error: "unconfirmed", next: "code" });
        }
        return fail(why);
      }
      if (newsletter) await subscribe(email, "signin");
      const subscribed = newsletter || (await isSubscribed(email));
      return reply({ ok: true, newsletter: subscribed }, 200, sessionCookies(data.session, secure));
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
