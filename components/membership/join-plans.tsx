"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { useMember } from "@/components/account/use-member";
import { money, PLANS, SELF_SERVE, type PaidTier, type Tier } from "@/lib/membership/tiers";
import { productById } from "@/lib/shop/products";

/**
 * THE PLANS: Free, Pro, Ultimate side by side, Universal under them.
 *
 * Everything printed comes from lib/membership/tiers.ts, the same file the
 * checkout and every gate read, so the page can't promise what the site
 * doesn't give. The Join buttons are plain forms posting to
 * /api/membership/join: they work before hydration, and the route decides
 * where to go (sign up first, Stripe Checkout, or the billing portal for a
 * member changing plan).
 *
 * Signed in, the member's own plan says "Your plan" instead of a button.
 * The flags the routes send back (?join=error|soon, ?for=<skill>) are read
 * from the URL on the client, so the page itself stays static.
 */

const FREE_INCLUDES = [
  "Every free skill and guide, in one click",
  "Buy any premium or unique skill",
  "Notes from Tobi, if you want them",
];

type Flags = { join: string | null; forSkill: string | null };

const button =
  "group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[1.02rem] font-medium transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

function JoinButton({ tier, label, dark }: { tier: PaidTier; label: string; dark: boolean }) {
  const [pending, setPending] = useState(false);
  useEffect(() => {
    // Back from Stripe with the back button: the page may come from the cache still pending.
    const reset = (e: PageTransitionEvent) => e.persisted && setPending(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);
  return (
    <form
      action="/api/membership/join"
      method="post"
      onSubmit={(e) => {
        if (pending) e.preventDefault();
        else setPending(true);
      }}
    >
      <input type="hidden" name="tier" value={tier} />
      <button
        type="submit"
        aria-busy={pending}
        disabled={pending}
        className={`${button} ${
          dark
            ? "bg-[var(--paper)] text-[var(--ink)] focus-visible:outline-[var(--paper)]"
            : "bg-[var(--accent-clay-text)] text-[var(--paper)] shadow-[0_18px_40px_-18px_rgba(185,58,38,0.75)] focus-visible:outline-[var(--ink)]"
        }`}
      >
        {pending ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : null}
        {pending ? "Opening" : label}
        {pending ? null : (
          <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}

function YourPlan({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className={`${button} cursor-default hover:translate-y-0 border ${
          dark ? "border-[var(--hairline-on-ink)] text-[var(--paper)]" : "border-[var(--hairline-strong)] text-[var(--ink)]"
        }`}
      >
        <Check aria-hidden className="h-5 w-5" />
        Your plan
      </span>
      <Link
        href={ACCOUNT_HREF}
        className={`text-[0.92rem] underline underline-offset-4 ${dark ? "text-[color:rgba(250,248,242,0.75)] hover:text-[var(--paper)]" : "text-[color:rgba(11,31,58,0.7)] hover:text-[var(--ink)]"}`}
      >
        See what it opens
      </Link>
    </div>
  );
}

function Includes({ items, dark }: { items: string[]; dark: boolean }) {
  return (
    <ul className="mt-7 flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 text-[1rem] leading-[1.45]">
          <Check
            aria-hidden
            className={`mt-[0.2rem] h-4 w-4 flex-none ${
              i === 0 && item.startsWith("Everything") ? "opacity-50" : ""
            } ${dark ? "text-[#f0a58f]" : "text-[var(--accent-clay-text)]"}`}
          />
          <span className={dark ? "text-[color:rgba(250,248,242,0.88)]" : "text-[color:rgba(11,31,58,0.82)]"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function JoinPlans() {
  const member = useMember();
  const tier: Tier | undefined = member === undefined ? undefined : (member?.tier ?? "free");
  const [flags, setFlags] = useState<Flags>({ join: null, forSkill: null });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // Read once on mount: these only exist after a redirect from a route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlags({ join: q.get("join"), forSkill: q.get("for") });
  }, []);

  const wanted = productById(flags.forSkill);
  const paid = tier && tier !== "free";

  const cta = (t: PaidTier) => {
    if (tier === t) return null;
    if (paid) return `Switch to ${PLANS[t].name}`;
    return `Join ${PLANS[t].name}`;
  };

  return (
    <>
      {flags.join === "error" || flags.join === "soon" || wanted ? (
        <p
          role="status"
          className="mx-auto mb-10 max-w-[40rem] rounded-2xl border border-[var(--hairline-strong)] bg-white px-5 py-4 text-center text-[1rem] leading-[1.5] text-[var(--ink)]"
        >
          {flags.join === "error"
            ? "Checkout didn't open. Please try again in a moment."
            : flags.join === "soon"
              ? "Memberships open very soon, on this page."
              : `${wanted!.name} comes with Ultimate.`}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {/* FREE */}
        <article
          id="free"
          className="flex scroll-mt-28 flex-col rounded-[1.75rem] border border-[var(--hairline-strong)] bg-[rgba(255,255,255,0.55)] p-7 md:p-8"
        >
          <h2 className="font-serif text-[2rem] leading-none tracking-[-0.03em]">Free</h2>
          <p className="mt-4 text-[2.4rem] font-medium leading-none tracking-[-0.03em]">
            $0
          </p>
          <p className="mt-4 text-[1.02rem] leading-[1.5] text-[color:rgba(11,31,58,0.72)]">
            An account, and everything I give away.
          </p>
          <Includes items={FREE_INCLUDES} dark={false} />
          <div className="mt-auto pt-9">
            {tier === undefined ? (
              <div className="h-[3.25rem]" />
            ) : tier === "free" && member ? (
              <YourPlan dark={false} />
            ) : member ? null : (
              <Link
                href={`${ACCOUNT_HREF}?mode=signup&next=${encodeURIComponent(JOIN_HREF)}`}
                className={`${button} border border-[var(--hairline-strong)] bg-white text-[var(--ink)] focus-visible:outline-[var(--ink)]`}
              >
                Create a free account
              </Link>
            )}
          </div>
        </article>

        {SELF_SERVE.map((t) => {
          const plan = PLANS[t];
          const dark = t === "ultimate";
          const label = cta(t);
          return (
            <article
              key={t}
              id={t}
              className={`relative flex scroll-mt-28 flex-col rounded-[1.75rem] p-7 md:p-8 ${
                dark
                  ? "bg-[var(--ink)] text-[var(--paper)] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.7)]"
                  : "border border-[rgba(185,58,38,0.35)] bg-white shadow-[0_30px_60px_-40px_rgba(185,58,38,0.55)]"
              }`}
            >
              {dark ? (
                <span className="absolute right-6 top-6 rounded-full bg-[var(--accent-clay-text)] px-3 py-1 text-[0.8rem] font-medium text-[var(--paper)]">
                  Everything
                </span>
              ) : null}
              <h2 className="font-serif text-[2rem] leading-none tracking-[-0.03em]">{plan.name}</h2>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[2.4rem] font-medium leading-none tracking-[-0.03em]">
                  {money(plan.priceCents!, plan.currency)}
                </span>
                <span className={dark ? "text-[color:rgba(250,248,242,0.65)]" : "text-[color:rgba(11,31,58,0.6)]"}>
                  a month
                </span>
              </p>
              <p
                className={`mt-4 text-[1.02rem] leading-[1.5] ${
                  dark ? "text-[color:rgba(250,248,242,0.75)]" : "text-[color:rgba(11,31,58,0.72)]"
                }`}
              >
                {plan.line}
              </p>
              <Includes items={plan.includes} dark={dark} />
              <div className="mt-auto pt-9">
                {tier === undefined ? (
                  <div className="h-[3.25rem]" />
                ) : tier === "universal" ? (
                  <p className="text-center text-[0.95rem] opacity-70">Included in your Universal plan.</p>
                ) : label ? (
                  <JoinButton tier={t} label={label} dark={dark} />
                ) : (
                  <YourPlan dark={dark} />
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mx-auto mt-8 max-w-[44rem] text-center text-[0.95rem] leading-[1.55] text-[color:rgba(11,31,58,0.62)]">
        Billed monthly. Cancel any time from your account and keep everything until the end of the month you paid
        for. Switching between Pro and Ultimate is prorated to the day.
      </p>

      <Universal tier={tier} signedIn={Boolean(member)} />
    </>
  );
}

/** Universal: no button, a note to Tobia. Posts to /api/membership/inquire. */
function Universal({ tier, signedIn }: { tier: Tier | undefined; signedIn: boolean }) {
  const plan = PLANS.universal;
  const ids = useId();
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "busy") return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("busy");
    setError("");
    try {
      const res = await fetch("/api/membership/inquire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, kind: "universal" }),
      });
      const r = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (r.ok) return setState("sent");
      setState("error");
      setError(
        r.error === "too-short"
          ? "Tell me a little more: a sentence or two."
          : r.error === "bad-email"
            ? "That address doesn't look right."
            : r.error === "too-many"
              ? "That's a few already. I'll answer those first."
              : "It didn't send. Try again in a minute.",
      );
    } catch {
      setState("error");
      setError("It didn't send. Try again in a minute.");
    }
  };

  const field =
    "w-full rounded-xl border border-[var(--hairline-on-ink)] bg-[rgba(250,248,242,0.06)] px-4 py-3 text-[1rem] text-[var(--paper)] outline-none transition-colors placeholder:text-[color:rgba(250,248,242,0.4)] focus:border-[color:rgba(250,248,242,0.6)]";

  return (
    <section
      id="universal"
      aria-labelledby={`${ids}-h`}
      className="mt-16 scroll-mt-28 overflow-hidden rounded-[2rem] bg-[var(--accent-clay-text)] text-[var(--paper)]"
    >
      <div className="grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-12">
        <div>
          <p className="text-[0.92rem] uppercase tracking-[0.14em] text-[color:rgba(250,248,242,0.75)]">
            Priced on a call
          </p>
          <h2 id={`${ids}-h`} className="mt-3 font-serif text-[clamp(2.4rem,6vw,3.4rem)] leading-[0.98] tracking-[-0.035em]">
            {plan.name}
          </h2>
          <p className="mt-4 text-[1.15rem] leading-[1.5] text-[color:rgba(250,248,242,0.88)]">{plan.line}</p>
          <ul className="mt-7 flex flex-col gap-3">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-3 text-[1rem] leading-[1.45]">
                <Check aria-hidden className="mt-[0.2rem] h-4 w-4 flex-none" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {tier === "universal" ? (
          <div className="self-center">
            <YourPlan dark />
          </div>
        ) : state === "sent" ? (
          <div role="status" className="self-center rounded-2xl bg-[var(--ink)] p-7">
            <p className="font-serif text-[1.8rem] leading-[1.05] tracking-[-0.03em]">Sent. I&rsquo;ll write back.</p>
            <p className="mt-3 text-[1rem] leading-[1.5] text-[color:rgba(250,248,242,0.75)]">
              Usually within two days, from my own inbox, to set up a call.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl bg-[var(--ink)] p-6 md:p-7" noValidate>
            <p className="text-[1.05rem] leading-[1.5] text-[color:rgba(250,248,242,0.85)]">
              Tell me what you&rsquo;re building. I&rsquo;ll answer to set up a call.
            </p>
            {/* No person fills this in; the route drops a form that has it. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            {signedIn ? null : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${ids}-name`} className="mb-1.5 block text-[0.9rem] text-[color:rgba(250,248,242,0.75)]">
                    Name
                  </label>
                  <input id={`${ids}-name`} name="name" autoComplete="name" className={field} />
                </div>
                <div>
                  <label htmlFor={`${ids}-email`} className="mb-1.5 block text-[0.9rem] text-[color:rgba(250,248,242,0.75)]">
                    Email
                  </label>
                  <input
                    id={`${ids}-email`}
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={field}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor={`${ids}-body`} className="mb-1.5 block text-[0.9rem] text-[color:rgba(250,248,242,0.75)]">
                What you&rsquo;re building
              </label>
              <textarea id={`${ids}-body`} name="body" required rows={4} maxLength={4000} className={`${field} resize-y`} />
            </div>
            <p role="alert" className="min-h-[1.3em] text-[0.95rem] text-[#f0a58f]">
              {error}
            </p>
            <button
              type="submit"
              disabled={state === "busy"}
              className={`${button} -mt-2 bg-[var(--paper)] text-[var(--ink)] focus-visible:outline-[var(--paper)]`}
            >
              {state === "busy" ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : null}
              Let&rsquo;s talk
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
