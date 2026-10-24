"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import type { MemberInfo } from "@/components/account/use-member";
import { higher, offer, planName, planPrice, PLANS, SELF_SERVE, type Tier } from "@/lib/membership/tiers";
import { PRODUCTS } from "@/lib/shop/products";
import { ago, LittleMan, nextQa, qaDate, SHELF_LOOK, SKILL_LOOK, Thumb, tileGlow, useSeen, type Look } from "./dashboard-art";
import { JoinButton } from "./join-plans";
import { FREE_PLAN, LOOK, PLAN_BUTTON, TIERS, UniversalMail } from "./plan-cards";
import { PlanBadge } from "./plan-badge";
import {
  CallsSection,
  CustomSection,
  GROUPS,
  h2,
  isSectionId,
  MOVED,
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
 *   Overview         the plan, what's new since the last visit (small), then
 *                    a tile for every section with its next step
 *   Library          Skills (Paid and Free tabs), Masterclass, Design, Training
 *   With me          Live Q&A, Direct messaging (Telegram)
 *   Ultimate         1-on-1 call (Calendly), Custom skills (with the requests board), Network
 *   Account          Plan & billing: the plan card, Stripe's billing portal,
 *                    and every other plan, up or down, each one click away
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
      const id = MOVED[h] ?? h;
      setActive(isSectionId(id) ? id : failed && !h ? "billing" : "overview");
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

  // What's new, per section: the sidebar pings with `fresh`, the stickers
  // and the overview's "New for you" read `wasNew` (see dashboard-art.tsx).
  const { fresh, wasNew, markSeen } = useSeen(member.email);
  useEffect(() => {
    if (active === "skills" || ((active === "masterclass" || active === "design" || active === "training") && perks)) markSeen(active);
  }, [active, perks, markSeen]);
  const rows = (perks?.training ?? []).filter((t) => !t.locked);
  const newCount: Partial<Record<SectionId, number>> = {
    skills: Object.values(PRODUCTS).filter((p) => fresh("skills", SKILL_LOOK[p.id].added)).length,
  };
  for (const shelf of ["masterclass", "design", "training"] as const) {
    newCount[shelf] = rows.filter((t) => t.shelf === shelf && fresh(shelf, t.added)).length;
  }
  const news = whatsNew(rows, wasNew);

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
        {/* Just the greeting: the plan is on the overview's banner, the
            account and the way out at the bottom of the sidebar (`Who`). */}
        <h1 className="min-w-0 font-serif text-[clamp(2.4rem,7vw,3.6rem)] leading-[0.98] tracking-[-0.035em]">
          Welcome <em>back</em>.
        </h1>
        {/* The way back to Construct is the page's own button, top left. This
            one only shows after a sign-in that came from somewhere else. */}
        {next ? (
          <Link
            href={next}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--hairline-strong)] bg-white px-5 py-2.5 text-[0.98rem] transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            Back to where you were
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        ) : null}
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
              <NavPill key={s.id} section={s} tier={tier} active={active === s.id} fresh={newCount[s.id] ?? 0} />
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
                    {/* Something new on these shelves: the little man waves from the label. */}
                    {g.ids.some((id) => newCount[id]) ? (
                      <span className="ml-auto flex items-end gap-1 normal-case tracking-normal">
                        <span className="-rotate-6 font-hand text-[1.05rem] leading-none text-[var(--accent-clay)]">new!</span>
                        <LittleMan pose="wave" className="h-6 w-auto" />
                      </span>
                    ) : null}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-0.5">
                  {g.ids.map((id) => (
                    <li key={id}>
                      <NavRow section={sectionById(id)} tier={tier} active={active === id} fresh={newCount[id] ?? 0} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Who email={member.email} onSignOut={onSignOut} className="px-3" />
          </div>
        </nav>

        {/* THE SECTION, with the way back to the overview above it. */}
        <div className="min-w-0">
          {active !== "overview" ? (
            <a
              href="#overview"
              className="group mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--hairline-strong)] bg-white py-2 pl-3 pr-4 text-[0.92rem] transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
            >
              <ArrowLeft aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Overview
            </a>
          ) : null}
          {unlock ? (
            <Locked section={section} tier={tier} unlock={unlock} />
          ) : fromPerks && notLoaded ? (
            notLoaded
          ) : active === "overview" ? (
            <>
              {notLoaded ? <div className="mb-8">{notLoaded}</div> : null}
              <Overview ids={ids} member={member} perks={perks} libraryCount={library.length} news={news} newCount={newCount} />
            </>
          ) : active === "skills" ? (
            <SkillsSection ids={ids} tier={tier} owned={owned} wasNew={(p) => wasNew("skills", SKILL_LOOK[p.id].added)} />
          ) : active === "masterclass" || active === "design" || active === "training" ? (
            <ShelfSection ids={ids} shelf={active} tier={tier} perks={perks} wasNew={(t) => wasNew(t.shelf, t.added)} />
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
          ) : (
            <Billing ids={ids} member={member} billingError={billingError} />
          )}
          {/* On a phone the sidebar is a strip of pills, so the account line closes the page. */}
          <Who email={member.email} onSignOut={onSignOut} className="mt-16 border-t border-[var(--hairline-strong)] pt-6 md:hidden" />
        </div>
      </div>
    </div>
  );
}

/** Who's signed in, and the way out: small, at the bottom. */
function Who({ email, onSignOut, className = "" }: { email: string; onSignOut: () => void; className?: string }) {
  return (
    <p className={`flex flex-col items-start gap-1 text-[0.9rem] leading-[1.4] ${soft} ${className}`}>
      <span className="max-w-full break-all">{email}</span>
      <button type="button" onClick={onSignOut} className={quiet}>
        Sign out
      </button>
    </p>
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

/** "2 new" beside a section with something added since it was last opened. */
function NewPing({ n, active }: { n: number; active: boolean }) {
  if (!n) return null;
  return (
    <span
      className={`ml-auto rounded-full px-2 py-0.5 text-[0.72rem] font-medium tabular-nums leading-[1.4] ${
        active ? "bg-[var(--paper)] text-[var(--ink)]" : "bg-[var(--accent-clay)] text-white"
      }`}
    >
      {n} new
    </span>
  );
}

function NavRow({ section, tier, active, fresh }: { section: Section; tier: Tier; active: boolean; fresh: number }) {
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
      {lock ? <LockMark tier={lock} /> : <NewPing n={fresh} active={active} />}
    </a>
  );
}

function NavPill({ section, tier, active, fresh }: { section: Section; tier: Tier; active: boolean; fresh: number }) {
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
      {lock ? <LockMark tier={lock} /> : <NewPing n={fresh} active={active} />}
    </a>
  );
}

/* ------------------------------------------------------------------ *
 * WHAT'S NEW: skills, lessons, templates and videos that went up since
 * their section was last opened, newest first. Nothing new: the latest
 * skills anyway, so the overview always has something to open.
 * ------------------------------------------------------------------ */
/** A skill shows its mark; a lesson, template or video its number on the shelf (`n`). */
type NewItem = { key: string; label: string; title: string; line: string | null; href: string; added: string; look: Look; mark?: string; n?: number };

function whatsNew(rows: Perks["training"], wasNew: (section: string, iso: string) => boolean): { items: NewItem[]; fresh: boolean } {
  const skills: NewItem[] = Object.values(PRODUCTS).map((p) => ({
    key: p.id,
    label: p.free ? "Free skill" : "Skill",
    title: p.name,
    line: p.share.line,
    href: "#skills",
    added: SKILL_LOOK[p.id].added,
    look: SKILL_LOOK[p.id],
    mark: p.id,
  }));
  const label = { masterclass: "Masterclass", design: "Design", training: "Training" } as Record<string, string>;
  const shelves: NewItem[] = rows.map((t) => {
    const shelf = (t.shelf in SHELF_LOOK ? t.shelf : "training") as keyof typeof SHELF_LOOK;
    const n = rows.filter((r) => r.shelf === t.shelf).indexOf(t) + 1;
    return { key: t.id, label: label[shelf], title: t.title, line: t.summary, href: `#${shelf}`, added: t.added, look: SHELF_LOOK[shelf], n };
  });
  const all = [...shelves, ...skills].sort((a, b) => b.added.localeCompare(a.added));
  const isNew = (i: NewItem) => wasNew(i.href.slice(1), i.added);
  const fresh = all.filter(isNew);
  return fresh.length ? { items: fresh.slice(0, 3), fresh: true } : { items: skills.sort((a, b) => b.added.localeCompare(a.added)).slice(0, 3), fresh: false };
}

/* ------------------------------------------------------------------ *
 * OVERVIEW: the plan, what's new, then every section as a tile with its
 * next step (and how many new things are in it).
 * ------------------------------------------------------------------ */
function Overview({
  ids,
  member,
  perks,
  libraryCount,
  news,
  newCount,
}: {
  ids: string;
  member: NonNullable<MemberInfo>;
  perks: Perks | null;
  libraryCount: number;
  news: { items: NewItem[]; fresh: boolean };
  newCount: Partial<Record<SectionId, number>>;
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
    masterclass: count("masterclass") ? plural(count("masterclass"), "lesson", "lessons") : "Coming shortly · being filmed now",
    design: count("design") ? plural(count("design"), "template", "templates") : "Coming shortly · on my desk now",
    training: count("training") ? plural(count("training"), "video or file", "videos and files") : "Coming shortly",
    live: `Next: ${qaDate(nextQa().at, "short")} · on YouTube`,
    telegram: links.telegram ? "Message me directly" : soon,
    calls: links.calls ? "Book on Calendly" : soon,
    custom: "Ask for a skill, vote on what's next",
    network: links.network ? "Open the network" : "Coming soon",
  };

  const tiles = SECTIONS.filter((s) => s.id !== "overview" && s.id !== "billing");
  const nextUp = SELF_SERVE.find((t) => higher(t, tier) === t && t !== tier);

  return (
    <section aria-labelledby={`${ids}-over`} className="flex flex-col gap-10">
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
        {/* Only Free gets a button here. A member's banner just says the
            plan: "Change plan" on it read as an invitation to cancel, and
            changing plan is still one click away in Plan & billing. */}
        {tier === "free" ? (
          <div className="flex-none">
            <a href="#billing" className={`${PLAN_BUTTON} px-7 ${look.button}`}>
              Upgrade
              <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        ) : null}
      </div>

      {/* WHAT'S NEW, or the latest: small, one line each, above the map. */}
      <div>
        <h3 className="flex items-end gap-2 font-serif text-[1.35rem] leading-none tracking-[-0.02em]">
          <LittleMan pose="wave" className="h-7 w-auto flex-none" />
          {news.fresh ? (
            <span>
              New <em>for you</em>
            </span>
          ) : (
            <span>
              Latest <em>on the shelf</em>
            </span>
          )}
        </h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {news.items.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="flex h-full items-center gap-3 rounded-2xl border border-[var(--hairline-strong)] bg-white p-3 transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                <Thumb look={item.look} mark={item.mark} n={item.n} instance="new" className="h-12 w-12" />
                <span className="min-w-0">
                  <span className={`block font-mono text-[0.62rem] uppercase tracking-[0.12em] ${soft}`}>
                    {item.label}
                    {ago(item.added) ? ` · ${ago(item.added)}` : ""}
                  </span>
                  <span className="mt-1 block truncate text-[0.98rem] font-medium">{item.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((s) => {
          const Icon = s.icon;
          const lock = needs(s, tier);
          const n = newCount[s.id] ?? 0;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,box-shadow] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  lock
                    ? "border-dashed border-[var(--hairline-strong)] bg-transparent hover:border-[rgba(11,31,58,0.3)]"
                    : "border-[var(--hairline-strong)] bg-white hover:border-[rgba(11,31,58,0.18)] hover:shadow-[0_18px_40px_-24px_rgba(11,31,58,0.35)]"
                }`}
              >
                {/* Each section's own soft colour, rising in on hover. */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 ${lock ? "group-hover:opacity-60" : ""}`}
                  style={tileGlow(s.id)}
                />
                <span className="flex items-center justify-between gap-3">
                  <Icon aria-hidden className={`h-5 w-5 ${lock ? "opacity-50" : ""}`} />
                  {lock ? (
                    <PlanBadge tier={lock} />
                  ) : n ? (
                    <span className="rounded-full bg-[var(--accent-clay)] px-2 py-0.5 text-[0.72rem] font-medium text-white">{n} new</span>
                  ) : (
                    <ArrowRight aria-hidden className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                  )}
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
  // A member doesn't "downgrade" to Free from a card next to the plans:
  // leaving is its own quiet section at the bottom (`Cancel`).
  const others = TIERS.filter((t): t is Exclude<Tier, "free"> => t !== tier && t !== "free");

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
                  Card and invoices. Handled by Stripe.
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

      {/* CHANGE PLAN: every other plan, in order, each with its one way in (see `Change`). */}
      <section aria-labelledby={`${ids}-up`}>
        <h2 id={`${ids}-up`} className={h2}>
          {tier === "free" ? (
            <>
              Go <em>further</em>
            </>
          ) : (
            <>
              Change <em>plan</em>
            </>
          )}
        </h2>
        {sub && !member.granted ? (
          <p className={`mt-3 max-w-[44rem] text-[1rem] leading-[1.5] ${soft}`}>
            Up or down, any time. Moving up, you pay only the difference this month. Moving down, the unused part comes off
            your next invoice.
          </p>
        ) : member.granted ? (
          <p className={`mt-3 max-w-[44rem] text-[1rem] leading-[1.5] ${soft}`}>
            Your plan is a gift. Anything above it you can join as usual.
          </p>
        ) : null}
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {others.map((t) => (
            <PlanOption key={t} tier={t} up={higher(t, tier) === t}>
              <Change to={t} member={member} />
            </PlanOption>
          ))}
        </div>
      </section>

      {paid ? <Cancel member={member} /> : null}
    </div>
  );
}

/**
 * CANCEL, at the very bottom of Plan & billing: plain about what happens,
 * with a quiet button, not a card that sits beside the plans.
 *
 *   paying              what they keep and until when; Stripe's cancel step
 *   already cancelled   until when it stays open; how to undo it
 *   a gift              nothing to cancel, no card on file
 *   set up by hand      write to me
 */
function Cancel({ member }: { member: NonNullable<MemberInfo> }) {
  const [opening, setOpening] = useState(false);
  const sub = member.subscription;
  const name = planName(member.tier);
  const until = sub ? date(sub.renews) : null;
  const point = (text: string) => (
    <li key={text} className="flex gap-2.5">
      <span aria-hidden className="mt-[0.6rem] h-1 w-1 flex-none rounded-full bg-[rgba(11,31,58,0.4)]" />
      <span>{text}</span>
    </li>
  );
  const portal = (to: "free" | null, label: string) => (
    <form action="/api/membership/billing" method="post" onSubmit={() => setOpening(true)} className="mt-6">
      {to ? <input type="hidden" name="to" value={to} /> : null}
      <button type="submit" disabled={opening} className={`${quiet} inline-flex items-center gap-2 disabled:opacity-60`}>
        {opening ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
        {label}
      </button>
    </form>
  );

  let body: React.ReactNode;
  if (member.granted && !sub) {
    body = <p>Your plan was given to you by Tobi: there&rsquo;s no card on file and nothing is ever charged, so there&rsquo;s nothing to cancel.</p>;
  } else if (!sub) {
    body = (
      <p>
        Your plan was set up with me directly.{" "}
        <a href={CHANGE_MAILTO} className={quiet}>
          Write to me
        </a>{" "}
        and I&rsquo;ll stop it.
      </p>
    );
  } else if (sub.cancelAtPeriodEnd) {
    body = (
      <>
        <ul className="grid gap-1.5">
          {point(until ? `Your subscription is cancelled. ${name} stays open until ${until}, then your account moves to Free.` : `Your subscription is cancelled. ${name} stays open to the end of this period, then your account moves to Free.`)}
          {point("You won't be charged again.")}
          {point("Changed your mind? Renew it in billing before then and nothing changes.")}
        </ul>
        {portal(null, "Renew in billing")}
      </>
    );
  } else {
    body = (
      <>
        <ul className="grid gap-1.5">
          {point(until ? `${name} stays open until ${until}, the end of what you've paid for. You won't be charged again.` : `${name} stays open to the end of what you've paid for. You won't be charged again.`)}
          {point("Then your account moves to Free. Your free skills and anything you bought stay yours.")}
          {point("You can undo it until that day, or join again any time.")}
        </ul>
        {portal("free", "Cancel subscription")}
        <p className="mt-2 text-[0.88rem]">Handled by Stripe, in one step.</p>
      </>
    );
  }

  return (
    <section aria-label="Cancel your subscription" className={`border-t border-[var(--hairline-strong)] pt-8 text-[0.98rem] leading-[1.55] ${soft}`}>
      <h2 className="mb-3 text-[1.05rem] font-medium text-[var(--ink)]">Cancel your subscription</h2>
      {body}
    </section>
  );
}

const CHANGE_MAILTO =
  "mailto:tobia@donadon.com?subject=" +
  encodeURIComponent("Construct: changing my plan") +
  "&body=" +
  encodeURIComponent("Hi Tobia,\n\nI'd like to change my Construct plan to: \n\nThanks,\n");

/**
 * THE ONE WAY INTO ANOTHER PLAN, for whoever is looking:
 *
 *   Universal                  an email to Tobia, from any plan
 *   paying, to another plan    Stripe's "confirm your new plan" (prorated), up or down
 *   Free, to a paid plan       Stripe Checkout
 *   a gift, to a plan above    Checkout too (the higher of the two wins)
 *   a gift, to a plan below    nothing to do: it's inside what they have
 *   set up by hand             an email to Tobia
 */
function Change({ to, member }: { to: Exclude<Tier, "free">; member: NonNullable<MemberInfo> }) {
  const tier = member.tier;
  const sub = member.subscription;
  const up = higher(to, tier) === to;
  const note = (text: string) => <p className={`text-[0.95rem] leading-[1.45] ${LOOK[to].soft}`}>{text}</p>;

  if (to === "universal") return <UniversalMail />;
  if (member.granted && !up) return note("Included in the plan Tobi gave you.");
  if (sub || tier === "free" || (member.granted && up)) {
    return <JoinButton tier={to} label={sub ? `${up ? "Switch" : "Move"} to ${PLANS[to].name}` : `Join ${PLANS[to].name}`} />;
  }
  return (
    <a href={CHANGE_MAILTO} className={`${PLAN_BUTTON} ${LOOK[to].button}`}>
      Write to me
    </a>
  );
}

/** Another plan, small: up or down, name, price, what it opens, and its one way in. */
function PlanOption({ tier, up, children }: { tier: Tier; up: boolean; children: React.ReactNode }) {
  const look = LOOK[tier];
  const plan = tier === "free" ? FREE_PLAN : PLANS[tier];
  const price = planPrice(tier);
  return (
    <article className={`flex flex-col overflow-hidden rounded-[1.6rem] p-6 ${look.card}`}>
      <p className={`text-[0.78rem] uppercase tracking-[0.14em] ${look.soft}`}>{up ? "Upgrade" : "Downgrade"}</p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
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
