"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import type { MemberInfo } from "@/components/account/use-member";
import { higher, offer, planName, planPrice, PLANS, SELF_SERVE, type PaidTier, type Tier } from "@/lib/membership/tiers";
import { PRODUCTS } from "@/lib/shop/products";
import { JoinButton } from "./join-plans";
import { FREE_PLAN, LOOK, PLAN_BUTTON, UniversalMail } from "./plan-cards";
import { PlanBadge } from "./plan-badge";
import { RequestsBoard } from "./requests-board";
import {
  CallsSection,
  CustomSection,
  GROUPS,
  h2,
  isSectionId,
  LiveSection,
  Locked,
  LockMark,
  needs,
  NetworkSection,
  quiet,
  SECTIONS,
  sectionById,
  ShelfSection,
  SkillsSection,
  soft,
  TelegramSection,
  type Perks,
  type Section,
  type SectionId,
} from "./member-sections";

/**
 * THE ACCOUNT PAGE, SIGNED IN: THE DASHBOARD.
 *
 * A sidebar of sections (a strip of pills on a phone) and one section at a
 * time beside it. The sections and what opens them are in member-sections.tsx:
 *
 *   Overview         the plan, then a tile for every section with its next step
 *   Library          Skills (Paid and Free tabs), Masterclass, Design, Training
 *   With me          Live Q&A, Telegram
 *   Ultimate         1-on-1 call, Custom skills, Network, Requests
 *   Account          Plan & billing: the plan card, Stripe's billing portal,
 *                    and the plans above theirs, each one click away
 *
 * The section is the URL's hash (#training, #billing...), so a link can open
 * one, and Back walks through the sections like pages. A section the plan
 * doesn't reach is drawn locked, with the pill of the plan that opens it.
 *
 * The links and training come from /api/membership/perks, which checks the
 * plan on the server; nothing private is in this file or the page.
 */

const soft2 = "text-[color:rgba(11,31,58,0.6)]";

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
  const top = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [perks, setPerks] = useState<Perks | null>(null);
  const [perksState, setPerksState] = useState<"loading" | "ready" | "failed" | "signed-out">("loading");
  const [joined, setJoined] = useState<string | null>(null);
  const [billingError, setBillingError] = useState(false);
  const [active, setActive] = useState<SectionId>("overview");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // Read once: these only exist after a redirect from a membership route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJoined(q.get("joined"));
    const failed = q.get("billing") === "error";
    setBillingError(failed);
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      setActive(isSectionId(h) ? h : failed && !h ? "billing" : "overview");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // The plan's links and training. One quiet second try, then the section
  // says it didn't load (never "soon", which would be a wrong promise).
  useEffect(() => {
    if (perksState !== "loading") return;
    let live = true;
    const once = () =>
      fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" }).then(async (r) => {
        const b = (await r.json().catch(() => ({}))) as Perks & { ok?: boolean };
        if (r.status === 401) return "signed-out" as const;
        if (!r.ok || !b.ok) throw new Error(`perks ${r.status}`);
        return b;
      });
    once()
      .catch(() => new Promise((res) => setTimeout(res, 1500)).then(once))
      .then((b) => {
        if (!live) return;
        if (b === "signed-out") return setPerksState("signed-out");
        setPerks(b);
        setPerksState("ready");
      })
      .catch(() => live && setPerksState("failed"));
    return () => {
      live = false;
    };
  }, [perksState]);

  // A new section starts at its top, and the phone's strip keeps its pill in view.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const box = top.current?.getBoundingClientRect();
    if (box && box.top < 0) window.scrollTo({ top: window.scrollY + box.top - 96 });
    strip.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const tier = member.tier;
  const owned = new Set(perks?.owned ?? []);
  const library = Object.values(PRODUCTS).filter(
    (p) => !p.free && (owned.has(p.id) || offer(p, tier).kind === "included"),
  );

  const section = sectionById(active);
  const unlock = needs(section, tier);
  // Sections drawn from /api/membership/perks; the rest work without it.
  const fromPerks = !unlock && ["skills", "masterclass", "design", "training", "live", "telegram", "calls", "network"].includes(active);
  const notLoaded =
    perksState === "failed" || perksState === "signed-out" ? (
      <LoadFailed signedOut={perksState === "signed-out"} onRetry={() => setPerksState("loading")} />
    ) : null;

  return (
    <div ref={top} className="flex flex-col gap-10">
      {/* WHO */}
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-[0.85rem] uppercase tracking-[0.14em] ${soft}`}>
            Your dashboard <PlanBadge tier={tier} className="normal-case tracking-normal" />
          </p>
          <h1 className="mt-3 font-serif text-[clamp(2.4rem,7vw,3.6rem)] leading-[0.98] tracking-[-0.035em]">
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
        <p role="status" className="rounded-2xl bg-[var(--ink)] px-6 py-5 text-[1.05rem] leading-[1.5] text-[var(--paper)]">
          {tier !== "free" ? (
            <>
              <span className="font-serif text-[1.5rem] tracking-[-0.02em]">Welcome to {planName(tier)}.</span>
              <br />
              Everything in your plan is open now. A receipt is on its way to your inbox.
            </>
          ) : (
            "Your payment went through. Your plan shows up here in a few seconds: refresh if it hasn't."
          )}
        </p>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-12">
        {/* THE SECTIONS: a sidebar, or on a phone a strip of pills */}
        <nav aria-label="Dashboard" className="min-w-0 md:sticky md:top-28 md:self-start">
          <div ref={strip} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:hidden">
            {SECTIONS.map((s) => (
              <NavPill key={s.id} section={s} tier={tier} active={active === s.id} />
            ))}
          </div>
          <div className="hidden flex-col gap-6 md:flex">
            {GROUPS.map((g) => (
              <div key={g.label ?? "top"}>
                {g.label ? (
                  <p className={`mb-2 flex items-center gap-2 px-3 text-[0.72rem] uppercase tracking-[0.14em] ${soft2}`}>
                    {g.label === "Ultimate" && tier !== "ultimate" && tier !== "universal" ? (
                      <PlanBadge tier="ultimate" className="normal-case tracking-normal" />
                    ) : (
                      g.label
                    )}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-0.5">
                  {g.ids.map((id) => (
                    <li key={id}>
                      <NavRow section={sectionById(id)} tier={tier} active={active === id} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* THE SECTION */}
        <div className="min-w-0">
          {unlock ? (
            <Locked section={section} tier={tier} unlock={unlock} />
          ) : fromPerks && notLoaded ? (
            notLoaded
          ) : active === "overview" ? (
            <>
              {notLoaded ? <div className="mb-8">{notLoaded}</div> : null}
              <Overview ids={ids} member={member} perks={perks} libraryCount={library.length} />
            </>
          ) : active === "skills" ? (
            <SkillsSection ids={ids} tier={tier} owned={owned} />
          ) : active === "masterclass" || active === "design" || active === "training" ? (
            <ShelfSection ids={ids} shelf={active} tier={tier} perks={perks} />
          ) : active === "live" ? (
            <LiveSection ids={ids} perks={perks} />
          ) : active === "telegram" ? (
            <TelegramSection ids={ids} perks={perks} />
          ) : active === "calls" ? (
            <CallsSection ids={ids} perks={perks} />
          ) : active === "custom" ? (
            <CustomSection />
          ) : active === "network" ? (
            <NetworkSection ids={ids} perks={perks} />
          ) : active === "requests" ? (
            <RequestsBoard />
          ) : (
            <Billing ids={ids} member={member} billingError={billingError} />
          )}
        </div>
      </div>
    </div>
  );
}

/** The plan's links didn't arrive: say so, and one button to ask again. */
function LoadFailed({ signedOut, onRetry }: { signedOut: boolean; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--hairline-strong)] bg-white p-6">
      <p className="text-[1rem] leading-[1.5]">
        {signedOut ? "You were signed out. Sign in again to see your plan." : "Part of your dashboard didn't load. Your plan is fine."}
      </p>
      <button
        type="button"
        onClick={signedOut ? () => window.location.reload() : onRetry}
        className="flex-none rounded-full bg-[var(--ink)] px-5 py-2.5 text-[0.95rem] font-medium text-[var(--paper)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
      >
        {signedOut ? "Sign in" : "Try again"}
      </button>
    </div>
  );
}

const rowBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.98rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)]";

function NavRow({ section, tier, active }: { section: Section; tier: Tier; active: boolean }) {
  const Icon = section.icon;
  const lock = needs(section, tier);
  return (
    <a
      href={`#${section.id}`}
      aria-current={active ? "page" : undefined}
      className={`${rowBase} ${
        active ? "bg-[var(--ink)] text-[var(--paper)]" : `hover:bg-[rgba(11,31,58,0.06)] ${lock ? soft2 : "text-[var(--ink)]"}`
      }`}
    >
      <Icon aria-hidden className="h-[1.1rem] w-[1.1rem] flex-none" />
      {section.name}
      {lock ? <LockMark tier={lock} /> : null}
    </a>
  );
}

function NavPill({ section, tier, active }: { section: Section; tier: Tier; active: boolean }) {
  const Icon = section.icon;
  const lock = needs(section, tier);
  return (
    <a
      href={`#${section.id}`}
      aria-current={active ? "page" : undefined}
      className={`flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 text-[0.95rem] ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
          : `border-[var(--hairline-strong)] bg-white ${lock ? soft2 : "text-[var(--ink)]"}`
      }`}
    >
      <Icon aria-hidden className="h-4 w-4" />
      {section.name}
      {lock ? <LockMark tier={lock} /> : null}
    </a>
  );
}

/* ------------------------------------------------------------------ *
 * OVERVIEW: the plan, then every section as a tile with its next step.
 * ------------------------------------------------------------------ */
function Overview({
  ids,
  member,
  perks,
  libraryCount,
}: {
  ids: string;
  member: NonNullable<MemberInfo>;
  perks: Perks | null;
  libraryCount: number;
}) {
  const tier = member.tier;
  const look = LOOK[tier];
  const plan = tier === "free" ? FREE_PLAN : PLANS[tier];
  const sub = member.subscription;
  const links = perks?.links ?? {};
  const soon = perks ? "Lands here soon" : "…";

  const count = (shelf: string) => (perks?.training ?? []).filter((t) => t.shelf === shelf && !t.locked).length;
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const freeCount = Object.values(PRODUCTS).filter((p) => p.free).length;
  const status: Partial<Record<SectionId, string>> = {
    skills:
      tier === "free"
        ? `${freeCount} free, one click each${libraryCount ? ` · ${libraryCount} bought` : ""}`
        : `${libraryCount} premium ready · ${freeCount} free`,
    masterclass: count("masterclass") ? plural(count("masterclass"), "lesson", "lessons") : "The first lessons land here",
    design: count("design") ? plural(count("design"), "template", "templates") : "The first templates land here",
    training: count("training")
      ? plural(count("training"), "video or file", "videos and files")
      : "The first videos land here soon",
    live: links.qa ? "Twice a month · Join from here" : "Twice a month · The link lands here",
    telegram: links.telegram ? "Message me directly" : soon,
    calls: links.calls ? "Book your call" : soon,
    custom: "Ask for a quote",
    network: links.network ? "Open the network" : soon,
    requests: "Ask for skills, vote on what's next",
  };

  const tiles = SECTIONS.filter((s) => s.id !== "overview" && s.id !== "billing");
  const nextUp = SELF_SERVE.find((t) => higher(t, tier) === t && t !== tier);

  return (
    <section aria-labelledby={`${ids}-over`} className="flex flex-col gap-8">
      {/* the plan, small, in its own gradient */}
      <div className={`plan-card relative isolate flex flex-wrap items-end justify-between gap-6 overflow-clip rounded-[2rem] p-7 md:p-9 ${look.card}`} data-tier={tier}>
        <div>
          <p className={`text-[0.85rem] uppercase tracking-[0.14em] ${look.soft}`}>Your plan</p>
          <h2 id={`${ids}-over`} className="mt-2 font-serif text-[clamp(2.6rem,6vw,3.6rem)] leading-[0.9] tracking-[-0.04em]">
            {plan.name}
          </h2>
          <p className={`mt-3 text-[1rem] leading-[1.5] ${look.soft}`}>
            {member.granted ? "Given to you by Tobi." : sub ? statusLine(sub) : tier === "free" ? plan.line : "Set up with me directly."}
          </p>
        </div>
        <div className="flex-none">
          <a href="#billing" className={`${PLAN_BUTTON} px-7 ${look.button}`}>
            {/* Universal has nothing above it, so there it stays the billing door. */}
            {tier === "universal" ? "Plan & billing" : "Upgrade"}
            <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((s) => {
          const Icon = s.icon;
          const lock = needs(s, tier);
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group flex h-full flex-col rounded-2xl border p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  lock
                    ? "border-dashed border-[var(--hairline-strong)] bg-transparent hover:border-[rgba(11,31,58,0.4)]"
                    : "border-[var(--hairline-strong)] bg-white hover:border-[var(--ink)]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <Icon aria-hidden className={`h-5 w-5 ${lock ? "opacity-50" : ""}`} />
                  {lock ? <PlanBadge tier={lock} /> : <ArrowRight aria-hidden className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />}
                </span>
                <span className={`mt-4 text-[1.05rem] font-medium ${lock ? soft : ""}`}>{s.name}</span>
                <span className={`mt-1 text-[0.9rem] leading-[1.45] ${soft}`}>{lock ? s.about : status[s.id]}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {nextUp ? (
        <p className={`flex flex-wrap items-center gap-2 text-[0.98rem] ${soft}`}>
          <PlanBadge tier={nextUp} />
          {nextUp === "pro"
            ? "opens every premium skill, Masterclass, Design, training, the live Q&A and Telegram."
            : "adds the 1-on-1 call, custom skills, the network and the roadmap."}
          <a href="#billing" className={quiet}>
            See {planName(nextUp)}
          </a>
        </p>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * PLAN & BILLING: the membership card, Stripe's portal, the plans above.
 * ------------------------------------------------------------------ */
function Billing({ ids, member, billingError }: { ids: string; member: NonNullable<MemberInfo>; billingError: boolean }) {
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setOpening(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const tier = member.tier;
  const paid = tier !== "free";
  const sub = member.subscription;
  const look = LOOK[tier];
  const plan = tier === "free" ? FREE_PLAN : PLANS[tier];
  const price = planPrice(tier);
  const upgrades = SELF_SERVE.filter((t) => higher(t, tier) === t && t !== tier);

  return (
    <div className="flex flex-col gap-14">
      <section aria-labelledby={`${ids}-plan`} className={`plan-card relative isolate overflow-clip rounded-[2rem] p-7 md:p-10 ${look.card}`} data-tier={tier}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
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
              {member.granted ? "Given to you by Tobi. Nothing to pay." : sub ? statusLine(sub) : paid ? "Set up with me directly." : plan.line}
            </p>
            {sub ? (
              <form action="/api/membership/billing" method="post" onSubmit={() => setOpening(true)} className="mt-auto pt-8">
                <button type="submit" disabled={opening} className={`${PLAN_BUTTON} w-auto px-6 ${look.button}`}>
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
          <div className={`mt-7 grid gap-5 ${upgrades.length ? "lg:grid-cols-2" : "md:max-w-[26rem]"}`}>
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
