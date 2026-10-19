"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { ACCOUNT_HREF } from "@/components/account/links";
import { useMember } from "@/components/account/use-member";
import { PLANS, type PaidTier, type Tier } from "@/lib/membership/tiers";
import { LOOK, PLAN_BUTTON, PlanCards, UniversalMail } from "@/components/membership/plan-cards";
import { productById } from "@/lib/shop/products";

/**
 * THE PLANS: Free, Pro, Ultimate and Universal side by side, the same size
 * (components/membership/plan-cards.tsx).
 *
 * Everything printed comes from lib/membership/tiers.ts, the same file the
 * checkout and every gate read, so the page can't promise what the site
 * doesn't give. The Join buttons are plain forms posting to
 * /api/membership/join: they work before hydration, and the route decides
 * where to go (sign up first, Stripe Checkout, or the billing portal for a
 * member changing plan).
 *
 * Universal's button is an email to Tobia, already written (UNIVERSAL_MAILTO).
 * Signed in, the member's own plan says "Your plan" instead of a button.
 * The flags the routes send back (?join=error|soon, ?for=<skill>) are read
 * from the URL on the client, so the page itself stays static.
 */

type Flags = { join: string | null; forSkill: string | null };

export function JoinButton({ tier, label }: { tier: PaidTier; label: string }) {
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
          if (t === "universal") return tier === "universal" ? <YourPlan /> : <UniversalMail />;
          const label = cta(t);
          return label ? <JoinButton tier={t} label={label} /> : <YourPlan />;
        }}
      />

      <p className="mx-auto mt-8 max-w-[44rem] text-center text-[0.95rem] leading-[1.55] text-[color:rgba(11,31,58,0.62)]">
        Billed monthly. Cancel any time from your account and keep everything until the end of the month you paid
        for. Switching plans is prorated to the day.
      </p>
    </>
  );
}
