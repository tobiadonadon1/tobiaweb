"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useMember } from "./use-member";

/**
 * SIGN IN, CREATE AN ACCOUNT, RESET THE PASSWORD.
 *
 * Every step answers in place: the page never reloads until the visitor is
 * signed in, and then it goes back where they came from (`?next=`). The
 * address typed on one step carries to the next, so nobody types it twice.
 *
 * Creating an account is an email, a password, then the six-digit code
 * Supabase sends (from Tobia's Gmail, see lib/account.ts). Signing in with an
 * account that never got its code sends a fresh one and opens the code step.
 */

type Mode = "signin" | "signup" | "code" | "forgot" | "reset";

const ERRORS: Record<string, string> = {
  "bad-email": "That address doesn't look right.",
  "wrong-password": "That email and password don't match.",
  "weak-password": "Use at least 8 characters.",
  "bad-code": "That code didn't work. Check it, or send a new one.",
  "too-many": "Too many tries. Wait a few minutes, then try again.",
  unconfirmed: "This account isn't confirmed yet. We just sent you a code.",
};
const FALLBACK = "Something went wrong on our side. Try again in a minute.";

const HEAD: Record<Mode, [string, string]> = {
  signin: ["Sign in", "Take any free skill or guide in one click, without typing your email each time."],
  signup: [
    "Create your account",
    "One account for all of Construct. Free skills and guides download in one click, and new ones reach you by email.",
  ],
  code: ["Check your email", ""],
  forgot: ["Reset your password", "Type your email and we'll send you a code."],
  reset: ["Choose a new password", ""],
};

/** Only paths on this site, never another origin. */
function safeNext(raw: string | null) {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : null;
}

async function call(action: string, body?: Record<string, string>) {
  try {
    const res = await fetch(`/api/account/${action}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    return (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean; error?: string; next?: string };
  } catch {
    return { ok: false, error: "failed" };
  }
}

const field =
  "lx-input lx-input--light w-full rounded-xl border border-[var(--hairline-strong)] bg-white px-4 py-3 text-[1rem] text-[var(--ink)] shadow-[0_1px_0_rgba(11,31,58,0.04)] outline-none transition-colors placeholder:text-[color:rgba(11,31,58,0.38)] focus:border-[color:rgba(11,31,58,0.55)]";
const label = "mb-1.5 block text-[0.92rem] text-[color:rgba(11,31,58,0.75)]";
const quiet =
  "rounded text-[0.95rem] text-[color:rgba(11,31,58,0.7)] underline underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

export function AccountForms() {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const member = useMember();
  const ids = useId();

  const startMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(startMode);
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  // A wrong password and an address with no account look the same from here
  // (Supabase won't say which), so the error offers both ways forward.
  const [mismatch, setMismatch] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  // Each step starts with the cursor where the typing starts.
  useEffect(() => {
    first.current?.focus();
  }, [mode]);

  const go = (m: Mode) => {
    setMode(m);
    setError("");
    setNote("");
    setMismatch(false);
    setCode("");
    setAgain("");
    if (m !== "signin" && m !== "signup") setPassword("");
  };

  const finish = () => {
    // A full load, so every part of the page sees the new session.
    window.location.assign(next ?? "/projects/construct/account");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    // A new password is typed twice, so a slip can't lock anyone out.
    if ((mode === "signup" || mode === "reset") && password.length >= 8 && password !== again) {
      setMismatch(false);
      setNote("");
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    setNote("");
    setMismatch(false);
    const action = mode === "code" ? "verify" : mode;
    const r = await call(action, { email, password, code });
    setBusy(false);
    if (r.ok) {
      if (r.next === "code") return go("code");
      if (r.next === "reset") return go("reset");
      return finish();
    }
    if (r.error === "unconfirmed") {
      go("code");
      setNote(ERRORS.unconfirmed);
      return;
    }
    if (r.error === "exists") {
      setMode("signin");
      setError("There's already an account with this email. Sign in instead.");
      return;
    }
    setMismatch(r.error === "wrong-password");
    setError(ERRORS[r.error ?? ""] ?? FALLBACK);
  };

  const resend = async () => {
    setError("");
    const r = await call(mode === "reset" ? "forgot" : "resend", { email });
    if (r.ok) setNote("A new code is on its way.");
    else setError(ERRORS[r.error ?? ""] ?? FALLBACK);
  };

  const signOut = async () => {
    await call("signout");
    window.location.assign("/projects/construct/account");
  };

  if (member === undefined) {
    return <div className="min-h-[24rem]" aria-busy="true" />;
  }

  if (member) {
    return (
      <section aria-labelledby={`${ids}-h`}>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-clay-text)] text-[var(--paper)]">
          <Check aria-hidden className="h-5 w-5" />
        </span>
        <h1 id={`${ids}-h`} className="mt-6 font-serif text-[clamp(2.4rem,8vw,3.4rem)] leading-[0.98] tracking-[-0.035em]">
          You&rsquo;re signed in.
        </h1>
        <p className="mt-5 text-pretty text-[1.1rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">
          As <span className="text-[var(--ink)]">{member.email}</span>. Every free skill and guide on Construct now
          downloads in one click.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href={next ?? "/projects/construct"}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--accent-clay-text)] px-7 py-3.5 text-[1.05rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            {next ? "Back to where you were" : "Browse Construct"}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <button type="button" onClick={signOut} className={quiet}>
            Sign out
          </button>
        </div>
      </section>
    );
  }

  const [title, lead] = HEAD[mode];
  const sub =
    mode === "code"
      ? `We sent a 6-digit code to ${email}. Type it here to finish.`
      : mode === "reset"
        ? `We sent a 6-digit code to ${email}. Type it with your new password.`
        : lead;
  const needsPassword = mode === "signin" || mode === "signup" || mode === "reset";
  const needsCode = mode === "code" || mode === "reset";
  const button = {
    signin: "Sign in",
    signup: "Create account",
    code: "Confirm",
    forgot: "Send the code",
    reset: "Save and sign in",
  }[mode];

  return (
    <section aria-labelledby={`${ids}-h`}>
      {mode === "signin" || mode === "signup" ? (
        <div className="mb-8 inline-flex rounded-full border border-[var(--hairline-strong)] bg-white p-1 shadow-[0_1px_0_rgba(11,31,58,0.04)]">
          {(
            [
              ["signin", "Sign in"],
              ["signup", "Create account"],
            ] as const
          ).map(([m, text]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => mode !== m && go(m)}
              className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                mode === m
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[color:rgba(11,31,58,0.7)] hover:text-[var(--ink)]"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      ) : null}
      <h1 id={`${ids}-h`} className="font-serif text-[clamp(2.4rem,8vw,3.4rem)] leading-[0.98] tracking-[-0.035em]">
        {title}
      </h1>
      <p className="mt-5 text-pretty text-[1.1rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">{sub}</p>

      <form onSubmit={submit} className="mt-9 flex flex-col gap-5" noValidate>
        {!needsCode ? (
          <div>
            <label htmlFor={`${ids}-email`} className={label}>
              Email
            </label>
            <input
              ref={first}
              id={`${ids}-email`}
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
        ) : null}

        {needsCode ? (
          <div>
            <label htmlFor={`${ids}-code`} className={label}>
              Code
            </label>
            <input
              ref={first}
              id={`${ids}-code`}
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={`${field} font-mono text-[1.35rem] tracking-[0.35em]`}
            />
          </div>
        ) : null}

        {needsPassword ? (
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${ids}-pw`} className={label}>
                {mode === "reset" ? "New password" : "Password"}
              </label>
              {mode === "signin" ? (
                <button type="button" onClick={() => go("forgot")} className={`${quiet} mb-1.5 text-[0.88rem]`}>
                  Forgot it?
                </button>
              ) : null}
            </div>
            <div className="relative">
              <input
                id={`${ids}-pw`}
                type={show ? "text" : "password"}
                required
                minLength={mode === "signin" ? undefined : 8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${field} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[color:rgba(11,31,58,0.55)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
              >
                {show ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
              </button>
            </div>
            {mode !== "signin" ? (
              <p className="mt-1.5 text-[0.85rem] text-[color:rgba(11,31,58,0.55)]">At least 8 characters.</p>
            ) : null}
          </div>
        ) : null}

        {mode === "signup" || mode === "reset" ? (
          <div>
            <label htmlFor={`${ids}-again`} className={label}>
              Type it again
            </label>
            <input
              id={`${ids}-again`}
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={again}
              onChange={(e) => setAgain(e.target.value)}
              aria-invalid={again.length > 0 && again !== password.slice(0, again.length)}
              className={field}
            />
          </div>
        ) : null}

        <p role="alert" className="min-h-[1.3em] text-[0.95rem] leading-[1.45] text-[var(--accent-clay-text)]">
          {error}
          {mismatch ? (
            <>
              {" "}
              <span className="text-[color:rgba(11,31,58,0.72)]">
                No account yet?{" "}
                <button type="button" onClick={() => go("signup")} className={quiet}>
                  Create it with this email
                </button>
              </span>
            </>
          ) : null}
        </p>
        {note ? (
          <p role="status" className="-mt-4 text-[0.95rem] leading-[1.45] text-[color:rgba(11,31,58,0.72)]">
            {note}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--accent-clay-text)] px-7 py-3.5 text-[1.05rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          {busy ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
          {button}
        </button>
      </form>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        {mode === "signin" || mode === "signup" ? null : (
          <>
            {needsCode ? (
              <button type="button" onClick={resend} className={quiet}>
                Send a new code
              </button>
            ) : null}
            <button type="button" onClick={() => go("signin")} className={quiet}>
              Back to sign in
            </button>
          </>
        )}
      </div>
    </section>
  );
}
