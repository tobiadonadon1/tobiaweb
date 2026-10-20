"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Download, LoaderCircle } from "lucide-react";
import { JOIN_HREF } from "@/components/account/links";
import type { MemberInfo } from "@/components/account/use-member";
import { higher, offer, planName, planPrice, PLANS, SELF_SERVE, type PaidTier, type Perk, type Tier } from "@/lib/membership/tiers";
import { JoinButton } from "./join-plans";
import { FREE_PLAN, LOOK, PLAN_BUTTON, UniversalMail } from "./plan-cards";
import { PRODUCTS } from "@/lib/shop/products";
import { RequestsBoard } from "./requests-board";

/**
 * THE ACCOUNT PAGE, SIGNED IN.
 *
 *   who           the address, sign out, back to where they were
 *   the plan      a card in the plan's gradient: which one, when it renews
 *                 (or ends), Manage billing, and everything it includes
 *   go further    the plans above theirs, each one click from Stripe
 *                 (Checkout, or for a member the portal's "confirm the new
 *                 plan"); Universal is an email to Tobia
 *   your skills   every paid skill the plan includes, and every one they
 *                 bought, each one a download
 *   your line     the private links the plan opens (Telegram, Q&A, workshop,
 *                 calls, network), or "coming soon" when one isn't set yet
 *   training      the videos and files their tier reaches
 *   Ultimate      the requests board and the commission form
 *
 * The links and training come from /api/membership/perks, which checks the
 * plan on the server; nothing private is in this file or the page.
 */

type Perks = {
  tier: Tier;
  perks: Perk[];
  links: Partial<Record<Perk, string | null>>;
  training: { id: string; title: string; summary: string | null; kind: string; url: string; tier: string }[];
  owned: string[];
};

const LINK_NAMES: [Perk, string, string][] = [
  ["telegram", "Message me on Telegram", "Direct, for anything you're stuck on."],
  ["qa", "Live group Q&A", "Every two months. Bring questions."],
  ["workshop", "Live workshop", "Every two months. We build something together."],
  ["calls", "Book a 1-on-1 call", "Just you and me."],
  ["network", "The network", "Members who ship, in one place."],
];

const soft = "text-[color:rgba(11,31,58,0.68)]";
const h2 = "font-serif text-[1.9rem] leading-none tracking-[-0.03em]";
const card = "rounded-2xl border border-[var(--hairline-strong)] bg-white";
const quiet =
  "rounded text-[0.95rem] text-[color:rgba(11,31,58,0.7)] underline underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

function statusLine(sub: NonNullable<NonNullable<MemberInfo>["subscription"]>) {
  const when = date(sub.renews);
  if (sub.status === "past_due") return "Your last payment didn't go through. Update your card in billing to keep it.";
  if (sub.cancelAtPeriodEnd) return when ? `Cancelled. Everything stays open until ${when}.` : "Cancelled at the end of this month.";
  if (sub.status === "trialing") return when ? `On a trial until ${when}.` : "On a trial.";
  return when ? `Renews on ${when}.` : "Active.";
}

export function MemberPanel({
  member,
  next,
  onSignOut,
}: {
  member: NonNullable<MemberInfo>;
  next: string | null;
  onSignOut: () => void;
}) {
  const ids = useId();
  const [perks, setPerks] = useState<Perks | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [billingError, setBillingError] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // Read once: these only exist after a redirect from a membership route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJoined(q.get("joined"));
    setBillingError(q.get("billing") === "error");
    let live = true;
    fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((b: Perks & { ok?: boolean }) => live && b.ok && setPerks(b))
      .catch(() => {});
    const reset = (e: PageTransitionEvent) => e.persisted && setOpening(false);
    window.addEventListener("pageshow", reset);
    return () => {
      live = false;
      window.removeEventListener("pageshow", reset);
    };
  }, []);

  const tier = member.tier;
  const paid = tier !== "free";
  const sub = member.subscription;
  const look = LOOK[tier];
  const plan = tier === "free" ? FREE_PLAN : PLANS[tier];
  const price = planPrice(tier);
  const upgrades = SELF_SERVE.filter((t) => higher(t, tier) === t && t !== tier);

  const owned = new Set(perks?.owned ?? []);
  const library = Object.values(PRODUCTS).filter(
    (p) => !p.free && (owned.has(p.id) || offer(p, tier).kind === "included"),
  );

  return (
    <div className="flex flex-col gap-16">
      {/* WHO */}
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <p className={`text-[0.85rem] uppercase tracking-[0.14em] ${soft}`}>Your account</p>
          <h1 id={`${ids}-h`} className="mt-3 font-serif text-[clamp(2.4rem,7vw,3.6rem)] leading-[0.98] tracking-[-0.035em]">
            Welcome <em>back</em>.
          </h1>
          <p className={`mt-4 break-all text-[1.05rem] ${soft}`}>
            {member.email}
            <span aria-hidden> · </span>
            <button type="button" onClick={onSignOut} className={quiet}>
              Sign out
            </button>
          </p>
        </div>
        <Link
          href={next ?? "/projects/construct"}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--hairline-strong)] bg-white px-5 py-2.5 text-[0.98rem] transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          {next ? "Back to where you were" : "Browse Construct"}
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </header>

      {joined ? (
        <p
          role="status"
          className="-mt-6 rounded-2xl bg-[var(--ink)] px-6 py-5 text-[1.05rem] leading-[1.5] text-[var(--paper)]"
        >
          {paid ? (
            <>
              <span className="font-serif text-[1.5rem] tracking-[-0.02em]">Welcome to {planName(tier)}.</span>
              <br />
              Everything below is open now. A receipt is on its way to your inbox.
            </>
          ) : (
            "Your payment went through. Your plan shows up here in a few seconds: refresh if it hasn't."
          )}
        </p>
      ) : null}

      {/* THE PLAN: a membership card in the plan's own gradient */}
      <section aria-labelledby={`${ids}-plan`} className={`overflow-hidden rounded-[2rem] p-7 md:p-10 ${look.card}`}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
          <div className="flex flex-col">
            <p className={`text-[0.85rem] uppercase tracking-[0.14em] ${look.soft}`}>Your plan</p>
            <h2 id={`${ids}-plan`} className="mt-3 font-serif text-[clamp(3rem,8vw,4.4rem)] leading-[0.9] tracking-[-0.04em]">
              {plan.name}
            </h2>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[1.6rem] font-medium leading-none tracking-[-0.02em]">{price.amount}</span>
              <span className={look.soft}>{tier === "free" ? "forever" : price.per}</span>
            </p>
            <p className={`mt-4 text-[1rem] leading-[1.5] ${look.soft}`}>
              {sub ? statusLine(sub) : paid ? "Set up with me directly." : plan.line}
            </p>
            {sub ? (
              <form action="/api/membership/billing" method="post" onSubmit={() => setOpening(true)} className="mt-auto pt-8">
                <button
                  type="submit"
                  disabled={opening}
                  className={`${PLAN_BUTTON} w-auto px-6 ${look.button}`}
                >
                  {opening ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
                  Manage billing
                </button>
                <p className={`mt-3 text-[0.88rem] leading-[1.45] ${look.soft}`}>
                  Card, invoices, plan or cancel. Handled by Stripe.
                </p>
              </form>
            ) : null}
            {billingError ? (
              <p role="alert" className="mt-3 text-[0.95rem] font-medium">
                Billing didn&rsquo;t open. Please try again in a moment.
              </p>
            ) : null}
          </div>
          <div>
            <p className={`text-[0.85rem] uppercase tracking-[0.14em] ${look.soft}`}>What it opens</p>
            <ul className="mt-4 grid gap-2.5">
              {plan.includes.map((item, i) => (
                <li key={item} className="flex gap-2.5 text-[0.98rem] leading-[1.45]">
                  <Check aria-hidden className={`mt-[0.2rem] h-4 w-4 flex-none ${look.check}`} />
                  <span className={i === 0 && item.startsWith("Everything") ? "font-medium" : look.soft}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* UPGRADE: one click to Stripe (or, for a member, straight to "confirm the new plan") */}
      {tier !== "universal" ? (
        <section aria-labelledby={`${ids}-up`}>
          <h2 id={`${ids}-up`} className={h2}>
            {upgrades.length ? (
              <>
                Go <em>further</em>
              </>
            ) : (
              "Want us to build it with you?"
            )}
          </h2>
          {upgrades.length && paid ? (
            <p className={`mt-3 text-[1rem] leading-[1.5] ${soft}`}>
              Switch in one click. You only pay the difference for the rest of the month.
            </p>
          ) : null}
          <div className={`mt-7 grid gap-5 ${upgrades.length ? "md:grid-cols-2 xl:grid-cols-3" : "md:max-w-[26rem]"}`}>
            {upgrades.map((t) => (
              <UpgradeCard key={t} tier={t}>
                <JoinButton tier={t} label={paid ? `Switch to ${PLANS[t].name}` : `Join ${PLANS[t].name}`} />
              </UpgradeCard>
            ))}
            <UpgradeCard tier="universal">
              <UniversalMail />
            </UpgradeCard>
          </div>
        </section>
      ) : null}

      {/* YOUR SKILLS */}
      {library.length ? (
        <section aria-labelledby={`${ids}-skills`}>
          <h2 id={`${ids}-skills`} className={h2}>
            Your skills
          </h2>
          <p className={`mt-3 text-[1rem] leading-[1.5] ${soft}`}>
            {paid ? "Every one your plan includes, and every one you bought." : "The ones you bought."}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {library.map((p) => (
              <li key={p.id} className={`${card} flex items-center justify-between gap-4 px-5 py-4`}>
                <div className="min-w-0">
                  <Link href={p.href} className="text-[1.05rem] font-medium hover:underline hover:underline-offset-4">
                    {p.name}
                  </Link>
                  <p className={`text-[0.88rem] ${soft}`}>{owned.has(p.id) ? "Bought" : `In ${planName(tier)}`}</p>
                </div>
                <a
                  href={`/api/download?product=${p.id}&member=1`}
                  className="inline-flex flex-none items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-[0.92rem] text-[var(--paper)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                >
                  <Download aria-hidden className="h-4 w-4" />
                  Download
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* YOUR LINE TO ME */}
      {paid && perks ? (
        <section aria-labelledby={`${ids}-line`}>
          <h2 id={`${ids}-line`} className={h2}>
            Your line to me
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {LINK_NAMES.filter(([perk]) => perk in perks.links).map(([perk, name, line]) => {
              const url = perks.links[perk];
              const inner = (
                <>
                  <span className="flex items-center justify-between gap-3 text-[1.02rem] font-medium">
                    {name}
                    {url ? <ArrowUpRight aria-hidden className="h-4 w-4 flex-none" /> : null}
                  </span>
                  <span className={`mt-1 block text-[0.9rem] leading-[1.45] ${soft}`}>{url ? line : "Coming soon."}</span>
                </>
              );
              return (
                <li key={perk}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${card} block h-full p-5 transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={`${card} h-full p-5 opacity-70`}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* TRAINING */}
      {paid && perks ? (
        <section aria-labelledby={`${ids}-training`}>
          <h2 id={`${ids}-training`} className={h2}>
            Training
          </h2>
          {perks.training.length ? (
            <ul className={`${card} mt-6 divide-y divide-[var(--hairline)]`}>
              {perks.training.map((t) => (
                <li key={t.id}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[rgba(11,31,58,0.03)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
                  >
                    <span className="min-w-0">
                      <span className="block text-[1.02rem] font-medium">{t.title}</span>
                      {t.summary ? <span className={`mt-0.5 block text-[0.9rem] leading-[1.45] ${soft}`}>{t.summary}</span> : null}
                    </span>
                    <span className={`flex flex-none items-center gap-1.5 text-[0.85rem] capitalize ${soft}`}>
                      {t.kind}
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-3 text-[1rem] leading-[1.5] ${soft}`}>The first videos and files land here soon.</p>
          )}
          {tier === "pro" ? (
            <p className={`mt-4 text-[0.92rem] ${soft}`}>
              Ultimate opens all of it.{" "}
              <Link href={`${JOIN_HREF}#ultimate`} className={quiet}>
                See Ultimate
              </Link>
            </p>
          ) : null}
        </section>
      ) : null}

      {/* ULTIMATE: REQUESTS AND COMMISSIONS */}
      {perks?.perks.includes("requests") ? (
        <>
          <RequestsBoard />
          <Commission />
        </>
      ) : null}
    </div>
  );
}

/** A plan above theirs, small: name, price, what it adds, and its one button. */
function UpgradeCard({ tier, children }: { tier: PaidTier; children: React.ReactNode }) {
  const look = LOOK[tier];
  const plan = PLANS[tier];
  const price = planPrice(tier);
  return (
    <article className={`flex flex-col overflow-hidden rounded-[1.6rem] p-6 ${look.card}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em]">{plan.name}</h3>
        <p className="flex items-baseline gap-1">
          <span className="text-[1.3rem] font-medium">{price.amount}</span>
          {price.per ? <span className={`text-[0.9rem] ${look.soft}`}>{price.per}</span> : null}
        </p>
      </div>
      <p className={`mt-3 text-[0.95rem] leading-[1.45] ${look.soft}`}>{plan.line}</p>
      <ul className="mt-5 grid gap-2">
        {plan.includes.slice(0, 5).map((item, i) => (
          <li key={item} className="flex gap-2.5 text-[0.92rem] leading-[1.4]">
            <Check aria-hidden className={`mt-[0.15rem] h-4 w-4 flex-none ${look.check}`} />
            <span className={i === 0 && item.startsWith("Everything") ? "font-medium" : look.soft}>{item}</span>
          </li>
        ))}
        {plan.includes.length > 5 ? (
          <li className={`pl-[1.6rem] text-[0.92rem] ${look.soft}`}>and {plan.includes.length - 5} more</li>
        ) : null}
      </ul>
      <div className="mt-auto pt-7">{children}</div>
    </article>
  );
}

/** A skill built for them, paid separately: a note to Tobia (/api/membership/inquire). */
function Commission() {
  const ids = useId();
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "busy") return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("busy");
    setError("");
    const r = (await fetch("/api/membership/inquire", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, kind: "commission" }),
    })
      .then((res) => res.json())
      .catch(() => ({}))) as { ok?: boolean; error?: string };
    if (r.ok) return setState("sent");
    setState("idle");
    setError(
      r.error === "too-short"
        ? "Tell me a little more: what it should do, and for whom."
        : r.error === "too-many"
          ? "That's a few already. I'll answer those first."
          : "It didn't send. Try again in a minute.",
    );
  };

  const field =
    "w-full rounded-xl border border-[var(--hairline-strong)] bg-white px-4 py-3 text-[1rem] text-[var(--ink)] outline-none transition-colors focus:border-[color:rgba(11,31,58,0.55)]";

  return (
    <section aria-labelledby={`${ids}-h`}>
      <h2 id={`${ids}-h`} className={h2}>
        Commission a skill
      </h2>
      <p className={`mt-3 text-[1rem] leading-[1.5] ${soft}`}>
        A skill built for you and your work. Priced separately: tell me what you need and I&rsquo;ll reply with a quote.
      </p>
      {state === "sent" ? (
        <p role="status" className={`${card} mt-6 p-5 text-[1.02rem]`}>
          Sent. I&rsquo;ll reply from my own inbox.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div>
            <label htmlFor={`${ids}-body`} className={`mb-1.5 block text-[0.92rem] ${soft}`}>
              What should it do?
            </label>
            <textarea id={`${ids}-body`} name="body" required rows={4} maxLength={4000} className={`${field} resize-y`} />
          </div>
          <div>
            <label htmlFor={`${ids}-budget`} className={`mb-1.5 block text-[0.92rem] ${soft}`}>
              Budget (optional)
            </label>
            <input id={`${ids}-budget`} name="budget" maxLength={120} className={field} />
          </div>
          <p role="alert" className="min-h-[1.3em] text-[0.95rem] text-[var(--accent-clay-text)]">
            {error}
          </p>
          <button
            type="submit"
            disabled={state === "busy"}
            className="-mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-[1rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            {state === "busy" ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
            Send it to me
          </button>
        </form>
      )}
    </section>
  );
}
