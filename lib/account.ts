import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { SHOP_EMAIL } from "@/lib/shop/products";

/**
 * CONSTRUCT ACCOUNTS.
 *
 * An account is an email and a password, confirmed once with a six-digit
 * code. Its point is small and concrete: a signed-in visitor takes any free
 * product in one click, without typing their email again. Every account is
 * also a row in `members`, Tobia's mailing list.
 *
 * Supabase Auth does the hard parts (password hashing, codes, rate limits;
 * project "tobiaweb", codes sent through Resend from the domain). The browser never
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

/**
 * WHEN SUPABASE CAN'T SEND THE CODE. Supabase sends codes through Resend
 * (smtp.resend.com, from the domain). When that fails, the admin API makes
 * the code without sending anything, and it goes out from Tobia's Gmail
 * instead (Resend again only if Gmail refuses too). Same code, same email
 * (supabase/templates), same verifyOtp.
 *
 *   signup    a new account: needs the password, creates the user
 *   confirm   an account that exists but was never confirmed (resend, signin)
 *   recovery  the forgot-password code
 *
 * Returns false when it couldn't either, and the visitor sees "mail-down".
 */
export async function sendCodeOurselves(kind: "signup" | "confirm" | "recovery", email: string, password = "") {
  const gmailPass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  if (!gmailPass && !process.env.RESEND_API_KEY) return false;
  const admin = adminClient().auth.admin;
  let made =
    kind === "signup"
      ? await admin.generateLink({ type: "signup", email, password })
      : kind === "recovery"
        ? await admin.generateLink({ type: "recovery", email })
        : await admin.generateLink({ type: "magiclink", email });
  // The failed signUp may have left the user behind, unconfirmed: a code for it.
  if (kind === "signup" && made.error) made = await admin.generateLink({ type: "magiclink", email });
  const code = made.data?.properties?.email_otp;
  if (made.error || !code) {
    console.error("[account] could not make a code", made.error);
    return false;
  }
  const reset = kind === "recovery";
  const subject = reset ? "Reset your Construct password" : "Your Construct code";
  const heading = reset ? "Reset your password" : "Your Construct code";
  const line = reset
    ? "Type this code on the page, then choose a new password."
    : "Type this code on the page to finish creating your account.";
  const html = `<!doctype html><html><body style="margin:0;padding:32px 20px;background:#f4f3ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0b1230">
<div style="max-width:440px;margin:0 auto;background:#ffffff;border-radius:14px;padding:32px">
<p style="margin:0 0 6px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#4a5683">Construct · Tobia Donadon</p>
<h1 style="margin:0 0 18px;font-size:24px;line-height:1.2">${heading}</h1>
<p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:#3a4160">${line}</p>
<p style="margin:0 0 22px;font-size:38px;font-weight:700;letter-spacing:.18em;font-family:Menlo,Consolas,monospace">${code}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:#6a7090">The code works for one hour. If you didn't ask for it, you can ignore this email.</p>
</div></body></html>`;
  const text = `${line}\n\n${code}\n\nThe code works for one hour. If you didn't ask for it, you can ignore this email.`;
  const gmail = process.env.SHOP_EMAIL_FROM || SHOP_EMAIL;
  if (gmailPass) {
    try {
      const info = await nodemailer
        .createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: gmail, pass: gmailPass }, connectionTimeout: 15_000 })
        .sendMail({ from: { name: "Tobia Donadon", address: gmail }, to: email, subject, html, text });
      if (!info.accepted?.length) throw new Error(`Gmail did not accept it: ${info.response ?? "no response"}`);
      console.warn(`[account] Supabase couldn't send the ${kind} code; sent it from Gmail`);
      return true;
    } catch (err) {
      console.error("[account] Gmail couldn't send the code either", err);
    }
  }
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Tobia Donadon <${process.env.RESEND_EMAIL_FROM || gmail}>`,
        to: [email],
        reply_to: gmail,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    console.warn(`[account] Supabase couldn't send the ${kind} code; sent it through Resend`);
    return true;
  } catch (err) {
    console.error("[account] Resend couldn't send the code either", err);
    return false;
  }
}
