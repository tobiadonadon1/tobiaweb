/**
 * WHAT EACH MEMBERSHIP GETS, WRITTEN ONCE.
 *
 * The join page prints these plans, the checkout charges them, and every gate
 * on the site (downloads, training, the requests board, the contact links)
 * asks the same two questions of this file: `hasPerk(tier, perk)` for a
 * service, `offer(product, tier)` for a skill. Change a plan here and the
 * whole site follows.
 *
 *   Free       free skills; premium and unique skills are bought
 *   Pro        + premium skills included, unique skills a little cheaper,
 *              some of the training, the Masterclass and Design shelves,
 *              the bi-monthly Q&A and workshop, Telegram DMs
 *   Ultimate   + unique skills much cheaper (some free), Ultimate-only
 *              skills, all the training, 1-on-1 calls,
 *              commissions, the network, requests and voting
 *   Universal  everything in Ultimate, plus help building, design reviews
 *              and marketing; priced per person ("Custom"), so it starts
 *              with an email to Tobia. He sets it up in Stripe on a price
 *              with metadata tier=universal, and the site follows.
 *
 * Pure data and pure functions: safe to import from a page.
 */

import type { Product } from "@/lib/shop/products";

export type Tier = "free" | "pro" | "ultimate" | "universal";
export type PaidTier = Exclude<Tier, "free">;

const RANK: Record<Tier, number> = { free: 0, pro: 1, ultimate: 2, universal: 3 };

export const isTier = (t: unknown): t is Tier => typeof t === "string" && Object.hasOwn(RANK, t);
export const atLeast = (tier: Tier, min: Tier) => RANK[tier] >= RANK[min];
export const higher = (a: Tier, b: Tier): Tier => (RANK[a] >= RANK[b] ? a : b);

export type Perk =
  | "premium-skills" // premium skills included
  | "exclusive-skills" // Ultimate-only skills
  | "training" // the training library (how much: `trainingReach`)
  | "masterclass" // the shelf's Masterclass: in-depth video lessons
  | "design" // the shelf's Design: website templates
  | "qa" // bi-monthly live group Q&A
  | "workshop" // bi-monthly live workshop
  | "calls" // 1-on-1 calls
  | "telegram" // direct contact on Telegram
  | "network" // the members' network
  | "commission" // a skill built for them (paid separately)
  | "requests"; // ask for skills and vote on what's next

const PERKS: Record<Tier, Perk[]> = {
  free: [],
  pro: ["premium-skills", "training", "masterclass", "design", "qa", "workshop", "telegram"],
  ultimate: ["premium-skills", "exclusive-skills", "training", "masterclass", "design", "qa", "workshop", "calls", "telegram", "network", "commission", "requests"],
  universal: ["premium-skills", "exclusive-skills", "training", "masterclass", "design", "qa", "workshop", "calls", "telegram", "network", "commission", "requests"],
};

export const hasPerk = (tier: Tier, perk: Perk) => PERKS[tier].includes(perk);
export const perksOf = (tier: Tier) => PERKS[tier];

/** Training rows are marked pro (some) or ultimate (all); a tier sees rows at or below it. */
export const trainingReach = (tier: Tier): ("pro" | "ultimate")[] =>
  atLeast(tier, "ultimate") ? ["pro", "ultimate"] : atLeast(tier, "pro") ? ["pro"] : [];

export type Plan = {
  tier: PaidTier;
  name: string;
  /** Minor units a month. */
  priceCents: number;
  currency: "eur";
  /** The Stripe price's lookup_key (scripts/membership-setup.mjs makes it). */
  lookupKey: string;
  /** Printed instead of the price, with no "per month" (Universal: Custom). */
  priceLabel?: string;
  line: string;
  /** What the join page lists, in order. */
  includes: string[];
};

export const PLANS: Record<PaidTier, Plan> = {
  pro: {
    tier: "pro",
    name: "Pro",
    priceCents: 1900,
    currency: "eur",
    lookupKey: "construct_pro_monthly",
    line: "The complete premium library, live sessions and direct access to me.",
    includes: [
      "All free skills and guides",
      "Every premium skill, included",
      "Unique skills at member pricing",
      "Masterclass: in-depth video lessons, 10 to 20 minutes, never on YouTube",
      "Design: website templates you ship as they are",
      "Selected training videos and resources",
      "Live group Q&A, twice a month",
      "Direct messaging with me on Telegram",
    ],
  },
  ultimate: {
    tier: "ultimate",
    name: "Ultimate",
    priceCents: 5900,
    currency: "eur",
    lookupKey: "construct_ultimate_monthly",
    line: "Everything in Pro, plus 1-on-1 access, a private community and a voice in the roadmap.",
    includes: [
      "Everything in Pro",
      "Unique skills at a deep discount, with some included",
      "Exclusive skills, available only to Ultimate members",
      "The complete training library",
      "A private 1-on-1 call with me",
      "Custom skills built to your spec (billed separately)",
      "A private network of builders who ship",
      "Request new skills and vote on the roadmap",
    ],
  },
  universal: {
    tier: "universal",
    name: "Universal",
    priceCents: 39900,
    currency: "eur",
    lookupKey: "construct_universal_monthly",
    priceLabel: "Custom",
    line: "A hands-on partnership. We work alongside you, from product to launch.",
    includes: [
      "Everything in Ultimate",
      "Hands-on support building your product",
      "Expert design reviews, with improved versions delivered",
      "Go-to-market and marketing strategy",
      "A scope tailored to your goals",
    ],
  },
};

export const planName = (tier: Tier) => (tier === "free" ? "Free" : PLANS[tier].name);

/** A plan's price as people read it: "€0", "€19" with "per month", or its label ("Custom"). */
export const planPrice = (tier: Tier): { amount: string; per: string | null } => {
  if (tier === "free") return { amount: "€0", per: null };
  const plan = PLANS[tier];
  return plan.priceLabel ? { amount: plan.priceLabel, per: null } : { amount: money(plan.priceCents, plan.currency), per: "per month" };
};

/** Paid plans someone can start from the join page; Universal starts with an email. */
export const SELF_SERVE: PaidTier[] = ["pro", "ultimate"];

/**
 * A SKILL, AS ONE TIER SEES IT.
 *
 *   free      a free skill: anyone takes it
 *   included  comes with the membership: downloads without paying
 *   buy       pays `priceCents` (the member price, or the full one)
 *   locked    not sold to this tier (an Ultimate-only skill)
 *
 * Skills are `premium` unless they say otherwise. Unique skills take their
 * member prices from `memberPrice`, or 15% off for Pro and 50% off for
 * Ultimate, rounded to whole units. A member price of 0 means included.
 */
export type Offer =
  | { kind: "free" }
  | { kind: "included" }
  | { kind: "buy"; priceCents: number; fullCents: number }
  | { kind: "locked"; needs: Tier };

export type Level = "premium" | "unique" | "exclusive";
export const levelOf = (p: Pick<Product, "level">): Level => p.level ?? "premium";

const PRO_OFF = 0.15;
const ULTIMATE_OFF = 0.5;
const roundUnits = (cents: number) => Math.max(100, Math.round(cents / 100) * 100);

export function offer(p: Pick<Product, "free" | "level" | "priceCents" | "memberPrice">, tier: Tier): Offer {
  if (p.free) return { kind: "free" };
  const full = p.priceCents;
  const buy = (cents: number): Offer => (cents <= 0 ? { kind: "included" } : { kind: "buy", priceCents: cents, fullCents: full });
  switch (levelOf(p)) {
    case "premium":
      return hasPerk(tier, "premium-skills") ? { kind: "included" } : buy(full);
    case "exclusive":
      return hasPerk(tier, "exclusive-skills") ? { kind: "included" } : { kind: "locked", needs: "ultimate" };
    case "unique":
      if (atLeast(tier, "ultimate")) return buy(p.memberPrice?.ultimate ?? roundUnits(full * (1 - ULTIMATE_OFF)));
      if (atLeast(tier, "pro")) return buy(p.memberPrice?.pro ?? roundUnits(full * (1 - PRO_OFF)));
      return buy(full);
  }
}

/** What a page needs to show a skill's price to any tier, without the whole product. */
export type Pricing = Pick<Product, "free" | "level" | "priceCents" | "memberPrice" | "currency">;
export const pricingOf = (p: Product): Pricing => ({
  free: p.free,
  level: p.level,
  priceCents: p.priceCents,
  memberPrice: p.memberPrice,
  currency: p.currency,
});

const SYMBOL = { eur: "€", usd: "$" } as const;
export const money = (cents: number, currency: keyof typeof SYMBOL) =>
  `${SYMBOL[currency]}${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;
