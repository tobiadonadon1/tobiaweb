"use client";

import { useId, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CreditCard,
  Download,
  GraduationCap,
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  LoaderCircle,
  Lock,
  Package,
  PlayCircle,
  Radio,
  Send,
  Users,
  WandSparkles,
} from "lucide-react";
import { startDownload } from "@/components/account/use-member";
import { hasPerk, money, offer, planName, PLANS, type PaidTier, type Perk, type Tier } from "@/lib/membership/tiers";
import { PRODUCTS, type Product } from "@/lib/shop/products";
import { JoinButton } from "./join-plans";
import { LOOK } from "./plan-cards";
import { ago, ComingSoon, NewChip, SHELF_LOOK, SKILL_LOOK, Thumb } from "./dashboard-art";
import { PlanBadge } from "./plan-badge";

/**
 * THE DASHBOARD'S SECTIONS (member-panel.tsx draws the frame around them).
 *
 * One section per thing a plan opens, so every perk has one place to live
 * and one name: the sidebar, the overview's tiles and the section itself all
 * read SECTIONS. A section the plan doesn't reach still exists, drawn locked
 * with the pill of the plan that opens it and that plan's one-click button,
 * so a member always sees the whole map, and what the next plan adds.
 *
 * Which plan opens what comes from lib/membership/tiers.ts (`hasPerk`), and
 * every private link comes from /api/membership/perks, which checks the plan
 * on the server: nothing private is in this file.
 */

export type SectionId =
  | "overview"
  | "skills"
  | "masterclass"
  | "design"
  | "training"
  | "live"
  | "telegram"
  | "calls"
  | "custom"
  | "network"
  | "requests"
  | "billing";

export type Perks = {
  tier: Tier;
  perks: Perk[];
  links: Partial<Record<Perk, string | null>>;
  /** Training, Masterclass and Design rows. A `locked` row is above the plan: no url, shown as what the next plan adds. */
  training: { id: string; title: string; summary: string | null; kind: string; url: string | null; tier: string; shelf: string; locked: boolean; added: string }[];
  owned: string[];
};

export type Section = {
  id: SectionId;
  name: string;
  icon: LucideIcon;
  /** The perk that opens it; none means every account has it. */
  perk?: Perk;
  /** What it is, in one line: the locked view and the overview's locked tile say this. */
  about: string;
  /** Picks this section's line out of a plan's `includes`, so the locked view can lead with it. */
  match?: RegExp;
};

export const SECTIONS: Section[] = [
  { id: "overview", name: "Overview", icon: LayoutGrid, about: "Everything your plan opens." },
  { id: "skills", name: "Skills", icon: Package, about: "Every skill, paid and free, ready to download." },
  { id: "masterclass", name: "Masterclass", icon: GraduationCap, perk: "masterclass", about: "In-depth lessons, 10 to 20 minutes each. Made for members, never on YouTube.", match: /Masterclass/ },
  { id: "design", name: "Design", icon: LayoutTemplate, perk: "design", about: "Interactive components you copy into your site.", match: /^Design/ },
  { id: "training", name: "Training", icon: PlayCircle, perk: "training", about: "Training videos and resources.", match: /training/i },
  { id: "live", name: "Live Q&A", icon: Radio, perk: "qa", about: "A live group Q&A with me, twice a month.", match: /Q&A/ },
  { id: "telegram", name: "Telegram", icon: Send, perk: "telegram", about: "Direct messaging with me on Telegram.", match: /Telegram/ },
  { id: "calls", name: "1-on-1 call", icon: CalendarClock, perk: "calls", about: "A private 1-on-1 call with me.", match: /1-on-1/ },
  { id: "custom", name: "Custom skills", icon: WandSparkles, perk: "commission", about: "Skills built to your spec, billed separately.", match: /custom skills/i },
  { id: "network", name: "Network", icon: Users, perk: "network", about: "A private network of builders who ship.", match: /network/i },
  { id: "requests", name: "Requests", icon: ListChecks, perk: "requests", about: "Request new skills and vote on the roadmap.", match: /roadmap/i },
  { id: "billing", name: "Plan & billing", icon: CreditCard, about: "Your plan, your card and your invoices." },
];

/** The sidebar's groups, in order. "Ultimate" is labelled with its pill. */
export const GROUPS: { label: string | null; ids: SectionId[] }[] = [
  { label: null, ids: ["overview"] },
  { label: "Library", ids: ["skills", "masterclass", "design", "training"] },
  { label: "With me", ids: ["live", "telegram"] },
  { label: "Ultimate", ids: ["calls", "custom", "network", "requests"] },
  { label: "Account", ids: ["billing"] },
];

export const sectionById = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;
export const isSectionId = (v: string): v is SectionId => SECTIONS.some((s) => s.id === v);

/** The plan that opens a section: null when this tier already has it. */
export function needs(section: Section, tier: Tier): PaidTier | null {
  if (!section.perk || hasPerk(tier, section.perk)) return null;
  return hasPerk("pro", section.perk) ? "pro" : "ultimate";
}

export const soft = "text-[color:rgba(11,31,58,0.68)]";
export const h2 = "font-serif text-[1.9rem] leading-none tracking-[-0.03em]";
export const card = "rounded-2xl border border-[var(--hairline-strong)] bg-white";
export const quiet =
  "rounded text-[0.95rem] text-[color:rgba(11,31,58,0.7)] underline underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";
const inkButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-[1rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

/** A section's title and its one line. */
export function SectionHead({ id, title, line }: { id: string; title: string; line: string }) {
  return (
    <header>
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <p className={`mt-3 max-w-[38rem] text-[1rem] leading-[1.5] ${soft}`}>{line}</p>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * LOCKED: says plainly it isn't in their plan, then what the plan that
 * opens it gives them (this section's line first, nothing they already
 * have), and the one button to upgrade.
 * ------------------------------------------------------------------ */
export function Locked({ section, tier, unlock }: { section: Section; tier: Tier; unlock: PaidTier }) {
  const ids = useId();
  const plan = PLANS[unlock];
  const look = LOOK[unlock];
  const Icon = section.icon;
  // Not "All free skills and guides" to a free account, nor "Everything in Pro" to Pro.
  const already = (item: string) => item === "All free skills and guides" || (tier === "pro" && item === "Everything in Pro");
  const items = plan.includes.filter((item) => !already(item));
  const lead = section.match ? items.find((item) => section.match!.test(item)) : undefined;
  const list = lead ? [lead, ...items.filter((item) => item !== lead)] : items;
  return (
    <section aria-labelledby={`${ids}-h`} className={`plan-card relative isolate overflow-clip rounded-[2rem] p-7 md:p-10 ${look.card}`} data-tier={unlock}>
      <div className="flex items-center gap-3">
        <Icon aria-hidden className="h-6 w-6" />
        <span className={`flex items-center gap-1.5 text-[0.85rem] uppercase tracking-[0.14em] ${look.soft}`}>
          <Lock aria-hidden className="h-3.5 w-3.5" />
          Not in your plan
        </span>
      </div>
      <h2 id={`${ids}-h`} className="mt-6 max-w-[42rem] font-serif text-[clamp(2.1rem,5vw,3rem)] leading-[0.98] tracking-[-0.035em]">
        {section.name} {/s$/.test(section.name) ? "aren\u2019t" : "isn\u2019t"} in your plan <em>yet</em>.
      </h2>
      <p className={`mt-4 max-w-[34rem] text-[1.1rem] leading-[1.5] ${look.soft}`}>
        {section.about} Available only for {unlock === "pro" ? "Pro and Ultimate" : "Ultimate"} members.
      </p>
      <p className={`mt-8 flex items-center gap-2 text-[0.85rem] uppercase tracking-[0.14em] ${look.soft}`}>
        With <PlanBadge tier={unlock} className="px-2.5 py-0.5 normal-case tracking-normal ring-1 ring-inset ring-[rgba(255,255,255,0.5)]" /> you get
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {list.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.95rem] leading-[1.4]">
            <Check aria-hidden className={`mt-[0.15rem] h-4 w-4 flex-none ${look.check}`} />
            <span className={item === lead ? "font-medium" : look.soft}>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-9 max-w-[22rem]">
        <JoinButton tier={unlock} label={`Upgrade to ${plan.name}`} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * A PRIVATE LINK: the Q&A, Telegram, the call, the network.
 * ------------------------------------------------------------------ */
function LinkCard({
  icon: Icon,
  url,
  label,
  pending,
  children,
}: {
  icon: LucideIcon;
  url: string | null | undefined;
  label: string;
  /** What the card says while the link isn't set up yet. */
  pending: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${card} mt-7 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8`}>
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[rgba(11,31,58,0.06)]">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          {children}
          {url ? null : <p className={`text-[0.98rem] leading-[1.5] ${soft}`}>{pending}</p>}
        </div>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className={`${inkButton} flex-none`}>
          {label}
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

export function LiveSection({ ids, perks }: { ids: string; perks: Perks | null }) {
  const s = sectionById("live");
  return (
    <section aria-labelledby={`${ids}-live`}>
      <SectionHead id={`${ids}-live`} title="Live group Q&A" line="Twice a month, live with me and the other members. Bring what you're working on and what you're stuck on." />
      <LinkCard icon={s.icon} url={perks?.links.qa} label="Join the Q&A" pending="The link to the sessions lands here before the first one.">
        {perks?.links.qa ? <p className="text-[1.05rem] font-medium">Every session uses this link.</p> : null}
      </LinkCard>
      {perks?.links.workshop ? (
        <LinkCard icon={PlayCircle} url={perks.links.workshop} label="Join the workshop" pending="">
          <p className="text-[1.05rem] font-medium">The live workshop</p>
        </LinkCard>
      ) : null}
    </section>
  );
}

export function TelegramSection({ ids, perks }: { ids: string; perks: Perks | null }) {
  return (
    <section aria-labelledby={`${ids}-telegram`}>
      <SectionHead id={`${ids}-telegram`} title="Direct messaging" line="Message me on Telegram, for anything you're stuck on. I answer myself." />
      <LinkCard icon={Send} url={perks?.links.telegram} label="Message me on Telegram" pending="Your Telegram link lands here soon.">
        {perks?.links.telegram ? <p className="text-[1.05rem] font-medium">Opens a chat with me.</p> : null}
      </LinkCard>
    </section>
  );
}

export function CallsSection({ ids, perks }: { ids: string; perks: Perks | null }) {
  return (
    <section aria-labelledby={`${ids}-calls`}>
      <SectionHead id={`${ids}-calls`} title="Your 1-on-1 call" line="A private call with me, about your product. Pick a time that works for you." />
      <LinkCard icon={CalendarClock} url={perks?.links.calls} label="Book your call" pending="Booking opens here soon.">
        {perks?.links.calls ? <p className="text-[1.05rem] font-medium">Opens my calendar.</p> : null}
      </LinkCard>
    </section>
  );
}

export function NetworkSection({ ids, perks }: { ids: string; perks: Perks | null }) {
  return (
    <section aria-labelledby={`${ids}-network`}>
      <SectionHead id={`${ids}-network`} title="The network" line="A private network of builders who ship. Show what you're making, find the people to make it with." />
      <LinkCard icon={Users} url={perks?.links.network} label="Open the network" pending="The network opens here soon.">
        {perks?.links.network ? <p className="text-[1.05rem] font-medium">Members only.</p> : null}
      </LinkCard>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * SKILLS: two tabs, Paid and Free, and every skill in one of them. A
 * free account is never shown an empty page: the Free tab downloads in
 * one click, and the Paid tab says what each one costs and what Pro
 * includes. A member sees what their plan includes first.
 * ------------------------------------------------------------------ */
type SkillTab = "paid" | "free";

const pill =
  "inline-flex flex-none items-center gap-2 rounded-full px-4 py-2 text-[0.92rem] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";
const inkPill = `${pill} bg-[var(--ink)] text-[var(--paper)]`;
const linePill = `${pill} border border-[var(--hairline-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]`;

export function SkillsSection({
  ids,
  tier,
  owned,
  wasNew,
}: {
  ids: string;
  tier: Tier;
  owned: Set<string>;
  /** Went up since this section was last opened (dashboard-art.tsx `useSeen`). */
  wasNew: (p: Product) => boolean;
}) {
  const all = Object.values(PRODUCTS);
  const ready = (p: Product) => owned.has(p.id) || offer(p, tier).kind === "included";
  // What's theirs first, then by price.
  const paid = all.filter((p) => !p.free).sort((a, b) => Number(ready(b)) - Number(ready(a)) || a.priceCents - b.priceCents);
  // Newest first: what just went up is what a member came to see.
  const free = all.filter((p) => p.free).sort((a, b) => SKILL_LOOK[b.id].added.localeCompare(SKILL_LOOK[a.id].added));
  const [tab, setTab] = useState<SkillTab>(tier === "free" ? "free" : "paid");

  const tabs: { id: SkillTab; label: string; count: number }[] = [
    { id: "paid", label: "Paid", count: paid.length },
    { id: "free", label: "Free", count: free.length },
  ];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = tab === "paid" ? "free" : "paid";
    setTab(next);
    document.getElementById(`${ids}-tab-${next}`)?.focus();
  };

  return (
    <section aria-labelledby={`${ids}-skills`}>
      <SectionHead
        id={`${ids}-skills`}
        title="Skills"
        line={
          tier === "free"
            ? "Every free skill downloads in one click. Premium ones are a small price each, or all included with Pro."
            : `Every premium skill comes with ${planName(tier)}. Download any of them, as often as you like.`
        }
      />

      <div role="tablist" aria-label="Skills" onKeyDown={onKey} className="mt-7 inline-flex gap-1 rounded-full border border-[var(--hairline-strong)] bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`${ids}-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`${ids}-panel`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[0.98rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
              tab === t.id ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[color:rgba(11,31,58,0.72)] hover:text-[var(--ink)]"
            }`}
          >
            {t.label}
            <span className={`text-[0.82rem] tabular-nums ${tab === t.id ? "opacity-70" : "opacity-60"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div id={`${ids}-panel`} role="tabpanel" aria-labelledby={`${ids}-tab-${tab}`} className="mt-6">
        {tab === "paid" ? (
          <>
            {tier === "free" ? <ProValue paid={paid} /> : null}
            <ul className={grid}>
              {paid.map((p) => (
                <SkillRow key={p.id} product={p} note={paidNote(p, tier, owned)} fresh={wasNew(p)}>
                  <PaidAction product={p} tier={tier} ready={ready(p)} />
                </SkillRow>
              ))}
            </ul>
          </>
        ) : (
          <ul className={grid}>
            {free.map((p) => (
              <SkillRow key={p.id} product={p} note={p.share.kicker} fresh={wasNew(p)}>
                <FreeDownload product={p} />
              </SkillRow>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6">
        <Link href="/projects/construct/material" className={quiet}>
          Browse all the material
        </Link>
      </p>
    </section>
  );
}

/** What the row says under its name: why it's theirs, or what it costs them. */
function paidNote(p: Product, tier: Tier, owned: Set<string>) {
  if (owned.has(p.id)) return "Bought";
  const deal = offer(p, tier);
  if (deal.kind === "included") return `Included in ${planName(tier)}`;
  if (deal.kind === "locked") return `${planName(deal.needs)} only`;
  // A free account: the plan that would include it.
  if (offer(p, "pro").kind === "included") return "Included in Pro";
  return deal.kind === "buy" && deal.priceCents < deal.fullCents ? "Member price" : "One-time purchase";
}

/** The Paid tab's first card for a free account: the sum, honestly, against Pro. */
function ProValue({ paid }: { paid: Product[] }) {
  const inPro = paid.filter((p) => offer(p, "pro").kind === "included");
  if (inPro.length < 2) return null;
  const sum = inPro.reduce((n, p) => n + p.priceCents, 0);
  const look = LOOK.pro;
  return (
    <div className={`plan-card relative isolate mb-5 flex flex-wrap items-center justify-between gap-5 overflow-clip rounded-[1.6rem] p-6 md:p-7 ${look.card}`} data-tier="pro">
      <div className="min-w-0 max-w-[30rem]">
        <p className="font-serif text-[1.55rem] leading-[1.1] tracking-[-0.02em]">
          All {inPro.length} premium skills, <em>included</em> with Pro.
        </p>
        <p className={`mt-2 text-[0.95rem] leading-[1.45] ${look.soft}`}>
          {`One by one they come to ${money(sum, inPro[0].currency)}. Pro is ${money(PLANS.pro.priceCents, PLANS.pro.currency)} a month, with Masterclass, Design, the live Q&A and Telegram.`}
        </p>
      </div>
      <div className="w-full sm:w-auto sm:min-w-[14rem]">
        <JoinButton tier="pro" label="Upgrade to Pro" />
      </div>
    </div>
  );
}

const grid = "grid gap-3";

/** A skill: its small picture, its name and what it does, and the one button. */
function SkillRow({ product: p, note, fresh, children }: { product: Product; note: string; fresh: boolean; children: React.ReactNode }) {
  const when = fresh ? ago(SKILL_LOOK[p.id].added) : null;
  return (
    <li className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:pr-5`}>
      <div className="flex min-w-0 items-center gap-4">
        <Thumb look={SKILL_LOOK[p.id]} mark={p.id} instance="row" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={p.href} className="text-[1.05rem] font-medium hover:underline hover:underline-offset-4">
              {p.name}
            </Link>
            <span className={`font-mono text-[0.68rem] uppercase tracking-[0.12em] ${soft}`}>{note}</span>
            {fresh ? <NewChip /> : null}
            {when ? <span className="text-[0.8rem] text-[var(--accent-clay-text)]">{when}</span> : null}
          </p>
          <p className={`mt-1 text-[0.92rem] leading-[1.45] ${soft}`}>{p.share.line}</p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-2">{children}</div>
    </li>
  );
}

function PaidAction({ product: p, tier, ready }: { product: Product; tier: Tier; ready: boolean }) {
  if (ready) {
    return (
      <a href={`/api/download?product=${p.id}&member=1`} className={inkPill}>
        <Download aria-hidden className="h-4 w-4" />
        Download
      </a>
    );
  }
  const deal = offer(p, tier);
  if (deal.kind === "locked") {
    return (
      <a href="#billing" className={linePill}>
        <Lock aria-hidden className="h-3.5 w-3.5" />
        See {planName(deal.needs)}
      </a>
    );
  }
  if (deal.kind !== "buy") return null;
  return (
    <Link href={`${p.href}#buy`} className={inkPill}>
      Buy
      <span className="tabular-nums">
        {deal.priceCents < deal.fullCents ? (
          <>
            <s className="mr-1 opacity-60">{money(deal.fullCents, p.currency)}</s>
            {money(deal.priceCents, p.currency)}
          </>
        ) : (
          money(deal.priceCents, p.currency)
        )}
      </span>
    </Link>
  );
}

/** A free skill, signed in: /api/free hands back the download, no email. */
function FreeDownload({ product: p }: { product: Product }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");
  const take = async () => {
    if (state === "busy") return;
    setState("busy");
    const r = (await fetch("/api/free", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ product: p.id }),
    })
      .then((res) => res.json())
      .catch(() => ({}))) as { ok?: boolean; download?: string };
    if (r.ok && r.download) {
      startDownload(r.download);
      setState("done");
    } else setState("failed");
  };
  return (
    <>
      {state === "failed" ? (
        <span role="alert" className="text-[0.88rem] text-[var(--accent-clay-text)]">
          Didn&rsquo;t start.
        </span>
      ) : null}
      <button type="button" onClick={take} disabled={state === "busy"} className={`${state === "done" ? linePill : inkPill} disabled:opacity-70`}>
        {state === "busy" ? (
          <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />
        ) : state === "done" ? (
          <Check aria-hidden className="h-4 w-4" />
        ) : (
          <Download aria-hidden className="h-4 w-4" />
        )}
        {state === "done" ? "Downloaded" : state === "failed" ? "Try again" : "Download"}
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * TRAINING, MASTERCLASS, DESIGN: rows from /api/membership/perks, each
 * on its own shelf. A row above the plan is listed, locked, with the
 * plan that opens it: the server never sent its link.
 * ------------------------------------------------------------------ */
const SHELVES = {
  training: { title: "Training", item: "Video", open: "Watch" },
  masterclass: { title: "Masterclass", item: "Lesson", open: "Watch" },
  design: { title: "Design", item: "Template", open: "Open" },
} as const;

// The library's blocks only load when Design is opened.
const DesignDashboardShelf = dynamic(() => import("@/components/design-library/dashboard-shelf"), {
  ssr: false,
  loading: () => <div className="mt-7 aspect-[3/1] rounded-[2rem] bg-[rgba(11,31,58,0.04)]" />,
});

export function ShelfSection({
  ids,
  shelf,
  tier,
  perks,
  wasNew,
}: {
  ids: string;
  shelf: keyof typeof SHELVES;
  tier: Tier;
  perks: Perks | null;
  wasNew: (row: Perks["training"][number]) => boolean;
}) {
  const s = SHELVES[shelf];
  const all = (perks?.training ?? []).filter((t) => t.shelf === shelf);
  // Training sheets (one-page PDFs) are drawn as pages; everything else is a row.
  const sheets = all.filter((t) => t.kind === "sheet");
  const rows = all.filter((t) => t.kind !== "sheet");
  const anyLocked = all.some((t) => t.locked);
  const line =
    shelf === "training"
      ? tier === "pro"
        ? "Selected training: one-page sheets to keep next to your screen, and videos."
        : "The complete training library: every sheet, every video and every file."
      : shelf === "masterclass"
        ? "In-depth lessons, 10 to 20 minutes each, on what I'd teach a friend building their first product. Made for members, never on YouTube."
        : "Interactive components to copy into your site: play with them, take the code, or hand one to Claude.";
  return (
    <section aria-labelledby={`${ids}-${shelf}`}>
      <SectionHead id={`${ids}-${shelf}`} title={s.title} line={line} />
      {shelf === "design" ? <DesignDashboardShelf /> : null}
      {!perks ? (
        shelf === "design" ? null : <p className={`${card} mt-7 p-6 text-[1rem] ${soft}`}>Loading…</p>
      ) : (
        <>
          {sheets.length ? (
            <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {sheets.map((t) => (
                <SheetCard key={t.id} row={t} fresh={wasNew(t)} />
              ))}
            </ul>
          ) : null}
          {rows.length ? (
            <ul className={`${card} mt-7 divide-y divide-[var(--hairline)]`}>
              {rows.map((t, i) => (
                <ShelfRow key={t.id} row={t} n={i + 1} shelf={shelf} fresh={wasNew(t)} />
              ))}
            </ul>
          ) : null}
          {!all.length && shelf !== "design" ? <ComingSoon shelf={shelf} /> : null}
        </>
      )}
      {tier === "pro" && (anyLocked || shelf === "training") ? (
        <p className={`mt-6 flex flex-wrap items-center gap-2 text-[0.95rem] ${soft}`}>
          <PlanBadge tier="ultimate" /> {shelf === "training" ? "opens the complete library." : "opens the locked ones too."}
          <a href="#billing" className={quiet}>
            See Ultimate
          </a>
        </p>
      ) : null}
    </section>
  );
}

/**
 * A TRAINING SHEET: a small picture of the page, its title, and the way in
 * (it opens as a PDF in a new tab). Above the plan, the picture is dimmed
 * and the way in is the plan that opens it.
 */
function SheetCard({ row: t, fresh }: { row: Perks["training"][number]; fresh: boolean }) {
  const id = t.id.replace(/^sheet-/, "");
  const body = (
    <>
      <span className="relative block overflow-hidden rounded-[0.9rem] border border-[var(--hairline)] bg-white shadow-[0_1px_2px_rgba(11,31,58,0.05),0_14px_30px_-18px_rgba(11,31,58,0.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-0.6deg]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.locked ? `/training/${id}-locked.webp` : `/api/membership/file?id=${id}&picture=1`}
          alt=""
          loading="lazy"
          className={`block aspect-[210/279] w-full object-cover object-top ${t.locked ? "opacity-50" : ""}`}
        />
        {t.locked ? (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 shadow-sm">
              <Lock aria-hidden className="h-3.5 w-3.5 opacity-60" />
              <PlanBadge tier="ultimate" />
            </span>
          </span>
        ) : null}
      </span>
      <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[0.98rem] font-medium leading-[1.3]">{t.title}</span>
        {fresh && !t.locked ? <NewChip /> : null}
      </span>
      {t.summary ? <span className={`mt-1 block text-[0.88rem] leading-[1.45] ${soft}`}>{t.summary}</span> : null}
      <span className={`mt-2 inline-flex items-center gap-1 text-[0.88rem] ${t.locked ? soft : "text-[var(--ink)]"}`}>
        {t.locked ? "Opens with Ultimate" : "Open the PDF"}
        {t.locked ? null : <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />}
      </span>
    </>
  );
  const cls =
    "group block rounded-[1rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]";
  return (
    <li>
      {t.url ? (
        <a href={t.url} target="_blank" rel="noopener noreferrer" className={cls}>
          {body}
        </a>
      ) : (
        <a href="#billing" className={cls}>
          {body}
        </a>
      )}
    </li>
  );
}

/**
 * A LESSON OR A TEMPLATE: its number on the shelf's colour, the title and
 * the way in. A locked one shows what it is and the plan that opens it; the
 * server never sent its link.
 */
function ShelfRow({ row: t, n, shelf, fresh }: { row: Perks["training"][number]; n: number; shelf: keyof typeof SHELVES; fresh: boolean }) {
  const s = SHELVES[shelf];
  const row =
    "flex items-center justify-between gap-4 p-4 pr-5 hover:bg-[rgba(11,31,58,0.03)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)]";
  const text = (
    <span className={`flex min-w-0 items-center gap-4 ${t.locked ? "opacity-60" : ""}`}>
      <Thumb look={SHELF_LOOK[shelf]} n={n} instance="row" />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[1.02rem] font-medium">{t.title}</span>
          {fresh && !t.locked ? <NewChip /> : null}
        </span>
        {t.summary ? <span className={`mt-0.5 block text-[0.9rem] leading-[1.45] ${soft}`}>{t.summary}</span> : null}
      </span>
    </span>
  );
  return (
    <li>
      {t.url ? (
        <a href={t.url} target="_blank" rel="noopener noreferrer" className={row}>
          {text}
          <span className={`flex flex-none items-center gap-1.5 text-[0.9rem] ${soft}`}>
            {s.open}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </span>
        </a>
      ) : (
        <a href="#billing" className={row}>
          {text}
          <span className="flex flex-none items-center gap-2">
            <Lock aria-hidden className="h-3.5 w-3.5 opacity-55" />
            <PlanBadge tier="ultimate" />
            <span className="sr-only">Opens with Ultimate</span>
          </span>
        </a>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * CUSTOM SKILLS: a note to Tobia (/api/membership/inquire), for a quote.
 * ------------------------------------------------------------------ */
export function CustomSection() {
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
      <SectionHead
        id={`${ids}-h`}
        title="Custom skills"
        line="A skill built to your spec, for you and your work. Billed separately: tell me what you need and I'll reply with a quote."
      />
      {state === "sent" ? (
        <p role="status" className={`${card} mt-7 p-6 text-[1.02rem]`}>
          Sent. I&rsquo;ll reply from my own inbox.
        </p>
      ) : (
        <form onSubmit={submit} className={`${card} mt-7 flex flex-col gap-4 p-6 md:p-8`} noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div>
            <label htmlFor={`${ids}-body`} className={`mb-1.5 block text-[0.92rem] ${soft}`}>
              What should it do?
            </label>
            <textarea id={`${ids}-body`} name="body" required rows={5} maxLength={4000} className={`${field} resize-y`} />
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
          <button type="submit" disabled={state === "busy"} className={`${inkButton} -mt-2 self-start`}>
            {state === "busy" ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
            Send it to me
          </button>
        </form>
      )}
    </section>
  );
}

/** The lock mark beside a section the plan doesn't reach. */
export function LockMark({ tier }: { tier: PaidTier }) {
  return (
    <span className="ml-auto flex items-center gap-1" title={`Opens with ${planName(tier)}`}>
      <Lock aria-hidden className="h-3.5 w-3.5 opacity-55" />
      <span className="sr-only">Opens with {planName(tier)}</span>
    </span>
  );
}
