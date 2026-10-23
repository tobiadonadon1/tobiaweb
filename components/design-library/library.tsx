"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Download, Maximize2 } from "lucide-react";
import { JOIN_HREF } from "@/components/account/links";
import { PlanBadge } from "@/components/membership/plan-badge";
import { money, PLANS } from "@/lib/membership/tiers";
import { accountHref, downloadFile, useAccess, type Access } from "./access";
import { BlockDialog } from "./block-dialog";
import { BLOCKS, type Block } from "./catalog.generated";
import { groundOf, Stage } from "./stage";

/**
 * THE DESIGN LIBRARY: every block, live, in a grid you can play with.
 *
 * Filters by what you DO with a block (press, hover, drag…), big soft cards
 * where the block runs for real, and a detail view (block-dialog.tsx) with
 * its knobs, its code and the ways to take it. Anyone can play; the code is
 * for Pro and Ultimate, and the few blocks marked free are open to any
 * account. The open block is in the URL (?block=<slug>), so a block can be
 * linked to and the back button closes it.
 */

const FREE = "Free";
const PRO_PRICE = money(PLANS.pro.priceCents, PLANS.pro.currency);

export function DesignLibrary() {
  const access = useAccess();
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, number>();
    for (const b of BLOCKS) seen.set(b.category, (seen.get(b.category) ?? 0) + 1);
    return [...seen];
  }, []);
  const freeCount = BLOCKS.filter((b) => b.free).length;
  const shown = BLOCKS.filter((b) => filter === "All" || (filter === FREE ? b.free : b.category === filter));
  // Free is what a visitor without the plan can take, so for them it comes right after All.
  const pills: (readonly [string, number])[] =
    access === "member"
      ? [["All", BLOCKS.length], ...categories]
      : [["All", BLOCKS.length], [FREE, freeCount], ...categories];

  // "New": the latest batch, by date (no clock, so server and browser agree),
  // and only while it's a few blocks, not the whole library on its first day.
  const fresh = useMemo(() => {
    const latest = BLOCKS.reduce((m, b) => (b.added > m ? b.added : m), "");
    const recent = BLOCKS.filter((b) => Date.parse(latest) - Date.parse(b.added) < 7 * 864e5);
    return new Set(recent.length <= Math.max(3, BLOCKS.length / 4) ? recent.map((b) => b.slug) : []);
  }, []);

  // The open block lives in the URL. `pushed`: this page added the ?block
  // entry, so closing is the same as Back.
  const pushed = useRef(false);
  // The card a block was opened from, to give the keyboard back to on close.
  const opener = useRef<string | null>(null);
  useEffect(() => {
    const sync = () => {
      pushed.current = false;
      const slug = new URLSearchParams(window.location.search).get("block");
      setOpen(slug && BLOCKS.some((b) => b.slug === slug) ? slug : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const show = useCallback((slug: string | null) => {
    const url = new URL(window.location.href);
    const had = url.searchParams.has("block");
    if (slug) url.searchParams.set("block", slug);
    else url.searchParams.delete("block");
    // Opening pushes (so Back closes it); moving between blocks or closing replaces.
    if (slug && !had) {
      window.history.pushState(null, "", url);
      pushed.current = true;
    } else window.history.replaceState(null, "", url);
    setOpen(slug);
  }, []);

  // Closed (by any route: the button, Esc, Back): focus goes back to the card
  // it was opened from. Safari doesn't focus a clicked button, so it's said here.
  useEffect(() => {
    if (open || !opener.current) return;
    document.getElementById(`block-${opener.current}`)?.focus({ preventScroll: true });
    opener.current = null;
  }, [open]);

  const current = open ? (BLOCKS.find((b) => b.slug === open) ?? null) : null;
  const step = (dir: 1 | -1) => {
    if (!current) return;
    const list = shown.some((b) => b.slug === current.slug) ? shown : BLOCKS;
    const i = list.findIndex((b) => b.slug === current.slug);
    show(list[(i + dir + list.length) % list.length].slug);
  };

  return (
    <>
      <header className="mx-auto max-w-[58rem] text-center">
        <p className="text-[0.92rem] uppercase tracking-[0.14em] text-[var(--accent-clay-text)]">Construct · Design</p>
        <h1 className="mt-3 text-balance font-serif text-[clamp(2.6rem,6.4vw,4.2rem)] leading-[0.98] tracking-[-0.04em]">
          Components that <em>move</em>.
        </h1>
        <p className="mx-auto mt-5 max-w-[36rem] text-pretty text-[1.1rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">
          {BLOCKS.length} interactive React components. One file each, nothing to install. Play with them here; members
          copy the code or hand it to Claude in one prompt.
        </p>
        <Status access={access} freeCount={freeCount} />
      </header>

      <div className="mt-10 flex items-center justify-between gap-6">
        {/* Scrolls sideways on a phone, with a fade at the edge so the pills that don't fit say so. */}
        <nav
          aria-label="Filter the library"
          className="-mx-5 min-w-0 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] md:mx-0 md:px-0 lg:[mask-image:none]"
        >
          <ul className="flex w-max gap-2 pr-8 lg:pr-0">
            {pills.map(([name, count]) =>
              count ? (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={filter === name}
                    onClick={() => setFilter(name)}
                    className={`flex h-10 items-center gap-2 rounded-full px-4 text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                      filter === name
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "bg-[rgba(11,31,58,0.06)] text-[var(--ink)] hover:bg-[rgba(11,31,58,0.1)]"
                    }`}
                  >
                    {name}
                    <span className={`text-[0.8rem] tabular-nums ${filter === name ? "opacity-60" : "opacity-45"}`}>{count}</span>
                  </button>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
        <p className="hidden flex-none text-[0.92rem] text-[color:rgba(11,31,58,0.55)] lg:block">
          Every card is live. Open one for its settings and code.
        </p>
      </div>
      <p className="mt-3 text-[0.9rem] text-[color:rgba(11,31,58,0.55)] lg:hidden">
        Every card is live. Tap <Maximize2 aria-label="the open button" className="inline h-3.5 w-3.5 align-[-0.15em]" /> for its
        settings and code.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((b) => (
          <BlockCard
            key={b.slug}
            block={b}
            fresh={fresh.has(b.slug)}
            onOpen={() => {
              opener.current = b.slug;
              show(b.slug);
            }}
          />
        ))}
      </ul>

      <Close access={access} freeCount={freeCount} />

      <BlockDialog
        block={current}
        access={access}
        onClose={() => {
          if (pushed.current) window.history.back();
          else show(null);
        }}
        onStep={step}
      />
    </>
  );
}

const PRIMARY =
  "group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--ink)] px-6 text-[1rem] font-medium text-[var(--paper)] transition-transform active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";
const QUIET = "underline decoration-[rgba(11,31,58,0.3)] underline-offset-4 hover:decoration-[var(--ink)]";

/** Members: take all of it. Fetched first, so a session that ended says so here instead of on a bare error page. */
function DownloadAll() {
  const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
  return (
    <>
      <button
        type="button"
        className={PRIMARY}
        aria-busy={state === "busy"}
        onClick={async () => {
          setState("busy");
          setState((await downloadFile("/api/design/source?all=1", "construct-design.zip")) ? "idle" : "failed");
        }}
      >
        <Download aria-hidden className="h-5 w-5" />
        {state === "busy" ? "Preparing the zip…" : `Download all ${BLOCKS.length}`}
      </button>
      <span>
        {state === "failed" ? "The zip didn't download. Try again in a moment." : "Every file, plus a Claude skill that knows them all."}
      </span>
    </>
  );
}

/** The line under the title: what this visitor can take, and the one button that changes it. */
function Status({ access, freeCount }: { access: Access; freeCount: number }) {
  const row = "mt-7 flex min-h-12 flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[1rem] text-[color:rgba(11,31,58,0.72)]";
  if (access === "loading") return <div className={row} aria-hidden />;
  if (access === "member")
    return (
      <div className={row}>
        <DownloadAll />
      </div>
    );
  return (
    <div className={row}>
      <Link href={`${JOIN_HREF}#pro`} className={PRIMARY}>
        Get every component
        <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <span className="text-pretty">
        <span className="whitespace-nowrap">
          <PlanBadge tier="pro" className="align-[0.1em]" /> {PRO_PRICE} a month, cancel any time.
        </span>{" "}
        {access === "guest" ? (
          <>
            {`${freeCount} are free with an account. `}
            <Link href={accountHref("signin")} className={QUIET}>
              Sign in
            </Link>
          </>
        ) : (
          `${freeCount} are free with your account.`
        )}
      </span>
    </div>
  );
}

/** After the grid: the plain answers, and a second way in for anyone who scrolled all the way. */
function Close({ access, freeCount }: { access: Access; freeCount: number }) {
  const faq: [string, ReactNode][] = [
    [
      "What do I get?",
      `Every component here, ${BLOCKS.length} today and more as they're made. Copy one, download it as a file, or copy a prompt that has Claude put it in your project with your colours. "Download all" gives you every file plus a Claude Code skill, so Claude can reach for them on its own.`,
    ],
    [
      "Will they work in my project?",
      "Any React 18 or 19 project: Next.js, Vite, Remix. Each one is a single TypeScript file with its own CSS inside, so there's nothing to install and no Tailwind needed. Keyboard and reduced motion are handled.",
    ],
    ["Can I use them for clients?", "Yes: in your own products and in work you do for clients, paid included. Just don't resell or republish the library itself."],
    ["What if I cancel?", "What you've copied stays in your projects. The code view and new components close with the plan."],
    ["Which ones are free?", `The ${freeCount} marked Free: any account can copy them. Everything else comes with Pro or Ultimate.`],
  ];
  return (
    <section aria-labelledby="design-faq" className="mt-24 grid gap-12 border-t border-[var(--hairline)] pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div>
        <h2 id="design-faq" className="text-balance font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1] tracking-[-0.03em]">
          Take them <em>home</em>.
        </h2>
        <p className="mt-4 max-w-[26rem] text-[1.05rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">
          {access === "member"
            ? "They're yours to copy. New ones land here first."
            : `${BLOCKS.length} components now, new ones as they're made. All of them with Pro, ${PRO_PRICE} a month.`}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4 text-[0.98rem] text-[color:rgba(11,31,58,0.72)]">
          {access === "member" ? (
            <DownloadAll />
          ) : access === "loading" ? null : (
            <>
              <Link href={`${JOIN_HREF}#pro`} className={PRIMARY}>
                Get every component
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {access === "guest" ? (
                <Link href={accountHref("signin")} className={QUIET}>
                  I have an account
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
      <dl className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
        {faq.map(([q, a]) => (
          <div key={q} className="grid gap-2 py-5 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6">
            <dt className="text-[1.02rem] font-medium">{q}</dt>
            <dd className="text-[0.98rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BlockCard({ block: b, fresh, onOpen }: { block: Block; fresh: boolean; onOpen: () => void }) {
  return (
    <li className="group">
      <div
        className="relative aspect-[44/34] overflow-hidden rounded-[28px] [content-visibility:auto]"
        style={{ background: groundOf(b), color: b.dark ? "#f4f1ea" : "var(--ink)" }}
      >
        <Stage width={440} height={340}>
          <b.Component />
        </Stage>
        <span className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
          {fresh ? <Chip dark={b.dark}>New</Chip> : null}
          {b.free ? <Chip dark={b.dark}>Free</Chip> : null}
        </span>
        {/* The mouse's way in; the keyboard's is the title below (one stop per card). */}
        <button
          type="button"
          tabIndex={-1}
          onClick={onOpen}
          aria-label={`Open ${b.title}: settings and code`}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full transition-[opacity,transform] duration-200 hover:scale-105 lg:opacity-0 lg:group-hover:opacity-100 ${
            b.dark ? "bg-white/12 text-white" : "bg-white/80 text-[var(--ink)] shadow-[0_1px_2px_rgba(11,31,58,0.08)]"
          }`}
        >
          <Maximize2 aria-hidden className="h-4 w-4" />
        </button>
      </div>
      <button
        id={`block-${b.slug}`}
        type="button"
        onClick={onOpen}
        className="mt-3 flex w-full items-baseline justify-between gap-3 rounded-lg px-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
      >
        <span className="text-[1.05rem] font-medium">{b.title}</span>
        <span className="flex items-center gap-1.5 text-[0.9rem] text-[color:rgba(11,31,58,0.55)] transition-colors group-hover:text-[var(--ink)]">
          {b.category}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </button>
    </li>
  );
}

function Chip({ children, dark }: { children: ReactNode; dark: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[0.75rem] font-medium leading-none ${
        dark ? "bg-white/14 text-white" : "bg-white text-[var(--ink)] shadow-[0_1px_2px_rgba(11,31,58,0.08)]"
      }`}
    >
      {children}
    </span>
  );
}
