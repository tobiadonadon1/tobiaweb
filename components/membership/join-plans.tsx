"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { ACCOUNT_HREF } from "@/components/account/links";
import { useMember } from "@/components/account/use-member";
import { PLANS, type PaidTier, type Tier } from "@/lib/membership/tiers";
import { LOOK, PLAN_BUTTON, PlanCards } from "@/components/membership/plan-cards";
import { productById } from "@/lib/shop/products";

/**
 * THE PLANS: Free, Pro, Ultimate and Universal side by side, the same size
 * (components/membership/plan-cards.tsx), and under them a note to Tobia
 * (/api/membership/inquire) for anyone who wants to talk before Universal.
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

type Flags = { join: string | null; forSkill: string | null };

function JoinButton({ tier, label }: { tier: PaidTier; label: string }) {
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
      <button type="submit" aria-busy={pending} disabled={pending} className={`${PLAN_BUTTON} ${LOOK[tier].button}`}>
        {pending ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : null}
        {pending ? "Opening" : label}
        {pending ? null : (
          <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}

function YourPlan() {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className={`${PLAN_BUTTON} cursor-default border border-current shadow-none hover:translate-y-0`}>
        <Check aria-hidden className="h-5 w-5" />
        Your plan
      </span>
      <Link href={ACCOUNT_HREF} className="text-[0.92rem] underline underline-offset-4 opacity-80 hover:opacity-100">
        See what it opens
      </Link>
    </div>
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

      <PlanCards
        action={(t) => {
          if (tier === undefined) return <div className="h-[3.25rem]" />;
          if (t === "free") {
            if (member) return tier === "free" ? <YourPlan /> : null;
            return (
              <Link href={`${ACCOUNT_HREF}?mode=signup&plan=free`} className={`${PLAN_BUTTON} ${LOOK.free.button}`}>
                Create a free account
              </Link>
            );
          }
          if (tier === "universal" && t !== "universal")
            return <p className="text-center text-[0.95rem] opacity-80">Included in your Universal plan.</p>;
          const label = cta(t);
          return label ? <JoinButton tier={t} label={label} /> : <YourPlan />;
        }}
      />

      <p className="mx-auto mt-8 max-w-[44rem] text-center text-[0.95rem] leading-[1.55] text-[color:rgba(11,31,58,0.62)]">
        Billed monthly. Cancel any time from your account and keep everything until the end of the month you paid
        for. Switching plans is prorated to the day.
      </p>

      {tier === "universal" ? null : <UniversalQuestions signedIn={Boolean(member)} />}
    </>
  );
}

/** Before Universal: a note to Tobia (/api/membership/inquire), for questions first. */
function UniversalQuestions({ signedIn }: { signedIn: boolean }) {
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
      aria-labelledby={`${ids}-h`}
      className="mx-auto mt-16 max-w-[60rem] overflow-hidden rounded-[2rem] bg-[image:radial-gradient(90%_80%_at_100%_100%,rgba(236,138,53,0.35),transparent_60%),linear-gradient(160deg,#0b1f3a_0%,#2a1838_100%)] text-[var(--paper)]"
    >
      <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        <div className="self-center">
          <p className="text-[0.92rem] uppercase tracking-[0.14em] text-[#ffc98a]">Universal</p>
          <h2 id={`${ids}-h`} className="mt-3 font-serif text-[clamp(2.2rem,5vw,3rem)] leading-[0.98] tracking-[-0.035em]">
            Questions <em>first</em>?
          </h2>
          <p className="mt-4 text-[1.05rem] leading-[1.5] text-[color:rgba(250,248,242,0.8)]">
            Tell me what you&rsquo;re building and I&rsquo;ll write back before you join.
          </p>
        </div>

        {state === "sent" ? (
          <div role="status" className="self-center rounded-2xl bg-[rgba(250,248,242,0.06)] p-7">
            <p className="font-serif text-[1.8rem] leading-[1.05] tracking-[-0.03em]">Sent. I&rsquo;ll write back.</p>
            <p className="mt-3 text-[1rem] leading-[1.5] text-[color:rgba(250,248,242,0.75)]">
              Usually within two days, from my own inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
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
              className={`${PLAN_BUTTON} -mt-2 ${LOOK.ultimate.button}`}
            >
              {state === "busy" ? <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" /> : null}
              Send it to me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
