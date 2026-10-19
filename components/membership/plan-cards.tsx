import type { ReactNode } from "react";
import { Check, Mail } from "lucide-react";
import { UNIVERSAL_MAILTO } from "@/components/account/links";
import { planPrice, PLANS, type Tier } from "@/lib/membership/tiers";

/**
 * THE FOUR PLANS, SIDE BY SIDE, SAME SIZE: Free, Pro, Ultimate, Universal,
 * each with everything it includes, so nobody picks a plan blind. The join
 * page and the "Choose your plan" step of signing up both print these; each
 * passes the button that goes at the bottom of a card (`action`).
 *
 * Every plan owns a gradient (with a soft light in a corner), climbing from
 * quiet to loud like PlanBadge:
 *
 *   Free       white into paper
 *   Pro        the hot clay
 *   Ultimate   deep navy, lit from the corner
 *   Universal  navy into sunset
 */

export const TIERS: Tier[] = ["free", "pro", "ultimate", "universal"];

export const FREE_PLAN = {
  name: "Free",
  line: "An account, and everything I give away.",
  includes: ["Every free skill and guide, in one click", "Buy any premium or unique skill", "Notes from Tobi, if you want them"],
};

type Look = { card: string; soft: string; check: string; button: string };

export const LOOK: Record<Tier, Look> = {
  free: {
    card: "border border-[var(--hairline-strong)] bg-[image:radial-gradient(120%_70%_at_0%_0%,rgba(255,255,255,0.22),transparent_60%),linear-gradient(160deg,#ffffff_0%,#f6f1e6_55%,#ece3d1_100%)] text-[var(--ink)] shadow-[0_30px_60px_-45px_rgba(11,31,58,0.5)]",
    soft: "text-[color:rgba(11,31,58,0.72)]",
    check: "text-[var(--accent-clay-text)]",
    button: "bg-[var(--ink)] text-[var(--paper)] focus-visible:outline-[var(--ink)]",
  },
  pro: {
    card: "bg-[image:radial-gradient(120%_70%_at_0%_0%,rgba(255,255,255,0.22),transparent_60%),linear-gradient(155deg,#f0845c_0%,#d9502f_45%,#a82f1d_100%)] text-[var(--paper)] shadow-[0_40px_80px_-40px_rgba(185,58,38,0.85)]",
    soft: "text-[color:rgba(255,244,236,0.88)]",
    check: "text-[#ffe0cf]",
    button: "bg-[var(--paper)] text-[#a82f1d] focus-visible:outline-[var(--paper)]",
  },
  ultimate: {
    card: "bg-[image:radial-gradient(110%_70%_at_0%_0%,rgba(96,146,214,0.4),transparent_60%),linear-gradient(160deg,#1d3d6b_0%,#0b1f3a_55%,#050f1e_100%)] text-[var(--paper)] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.9)]",
    soft: "text-[color:rgba(250,248,242,0.8)]",
    check: "text-[#f0a58f]",
    button: "bg-[var(--paper)] text-[var(--ink)] focus-visible:outline-[var(--paper)]",
  },
  universal: {
    card: "bg-[image:radial-gradient(120%_60%_at_100%_100%,rgba(255,214,120,0.55),transparent_60%),linear-gradient(170deg,#0b1f3a_0%,#4a1d3d_32%,#b23a2c_68%,#ec8a35_100%)] text-[var(--paper)] shadow-[0_40px_80px_-40px_rgba(178,58,44,0.9)]",
    soft: "text-[color:rgba(255,244,236,0.86)]",
    check: "text-[#ffc98a]",
    button: "bg-[var(--paper)] text-[#7a2433] focus-visible:outline-[var(--paper)]",
  },
};

/** The big round button at the bottom of a card; add LOOK[tier].button for its colours. */
export const PLAN_BUTTON =
  "group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[1.02rem] font-medium shadow-[0_14px_30px_-18px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

/** Universal is priced per person: the button writes Tobia an email, ready to send. */
export function UniversalMail() {
  return (
    <a href={UNIVERSAL_MAILTO} className={`${PLAN_BUTTON} ${LOOK.universal.button}`}>
      <Mail aria-hidden className="h-5 w-5" />
      Email me
    </a>
  );
}

export function PlanCards({ action }: { action: (tier: Tier) => ReactNode }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
      {TIERS.map((tier) => {
        const plan = tier === "free" ? FREE_PLAN : PLANS[tier];
        const look = LOOK[tier];
        return (
          <article
            key={tier}
            id={tier}
            className={`relative flex scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem] p-7 ${look.card}`}
          >
            <h2 className="font-serif text-[2rem] leading-none tracking-[-0.03em]">{plan.name}</h2>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[2.4rem] font-medium leading-none tracking-[-0.03em]">
                {planPrice(tier).amount}
              </span>
              <span className={look.soft}>{tier === "free" ? "always" : planPrice(tier).per}</span>
            </p>
            <p className={`mt-4 text-[1rem] leading-[1.5] ${look.soft}`}>{plan.line}</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {plan.includes.map((item, i) => (
                <li key={item} className="flex gap-2.5 text-[0.95rem] leading-[1.45]">
                  <Check
                    aria-hidden
                    className={`mt-[0.2rem] h-4 w-4 flex-none ${look.check} ${
                      i === 0 && item.startsWith("Everything") ? "opacity-60" : ""
                    }`}
                  />
                  <span className={i === 0 && item.startsWith("Everything") ? "font-medium" : look.soft}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">{action(tier)}</div>
          </article>
        );
      })}
    </div>
  );
}
