"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JOIN_HREF } from "@/components/account/links";
import { money, PLANS } from "@/lib/membership/tiers";
import { accountHref, useAccess } from "./access";
import { BlockDialog } from "./block-dialog";
import { BLOCKS, type Block } from "./catalog.generated";
import { groundOf, Stage } from "./stage";

/**
 * THE DESIGN LIBRARY: every block, live, in a grid.
 *
 * Its own look on purpose: white, neutral grey cards and few words, so the
 * blocks are the colour on the page, not the site's paper. Hover and drag
 * work right in the card; a click opens the block (block-dialog.tsx) with its
 * knobs and its code. Anyone can play; the code is for Pro and Ultimate, one
 * block at a time, and the few marked Free are open to any account. The open
 * block is in the URL (?block=<slug>): it can be linked, and Back closes it.
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
  const pills: (readonly [string, number])[] =
    access === "member" ? [["All", BLOCKS.length], ...categories] : [["All", BLOCKS.length], [FREE, freeCount], ...categories];

  // "New": the latest batch, by date (no clock, so server and browser agree),
  // and only while it's a few blocks, not the whole library on its first day.
  const fresh = useMemo(() => {
    const latest = BLOCKS.reduce((m, b) => (b.added > m ? b.added : m), "");
    const recent = BLOCKS.filter((b) => Date.parse(latest) - Date.parse(b.added) < 7 * 864e5);
    return new Set(recent.length <= Math.max(3, BLOCKS.length / 4) ? recent.map((b) => b.slug) : []);
  }, []);

  // The open block lives in the URL. `pushed`: this page added the ?block
  // entry, so closing is the same as Back. `opener`: the card to give the
  // keyboard back to on close.
  const pushed = useRef(false);
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
    if (slug && !had) {
      window.history.pushState(null, "", url);
      pushed.current = true;
    } else window.history.replaceState(null, "", url);
    setOpen(slug);
  }, []);

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
      <header className="mx-auto max-w-[40rem] text-center">
        <h1 className="text-balance text-[clamp(2.4rem,5.6vw,3.6rem)] font-medium leading-[1] tracking-[-0.035em]">
          Interactive components
        </h1>
        <p className="mt-4 text-[1.1rem] text-[color:rgba(20,20,20,0.6)]">Play with them. Take the code.</p>
        {access === "guest" || access === "free" ? (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[0.95rem] text-[color:rgba(20,20,20,0.6)]">
            <Link
              href={`${JOIN_HREF}#pro`}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#141414] px-5 text-[0.98rem] font-medium text-white transition-transform active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              Get the code · {PRO_PRICE}/mo
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            {access === "guest" ? (
              <Link href={accountHref("signin")} className="underline decoration-[rgba(20,20,20,0.25)] underline-offset-4 hover:text-[#141414]">
                Sign in
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <nav
        aria-label="Filter the library"
        className="-mx-5 mt-12 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] md:mx-0 md:px-0 lg:[mask-image:none]"
      >
        <ul className="mx-auto flex w-max gap-2 pr-8 lg:pr-0">
          {pills.map(([name, count]) =>
            count ? (
              <li key={name}>
                <button
                  type="button"
                  aria-pressed={filter === name}
                  onClick={() => setFilter(name)}
                  className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-[0.92rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] ${
                    filter === name ? "bg-[#141414] text-white" : "bg-[#f1f1f0] text-[#141414] hover:bg-[#e8e8e6]"
                  }`}
                >
                  {name}
                  <span className="text-[0.78rem] tabular-nums opacity-45">{count}</span>
                </button>
              </li>
            ) : null,
          )}
        </ul>
      </nav>

      <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
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

/**
 * A CARD: the block running for real. Hover and drag happen in place; a
 * click (a press that didn't travel) opens it. The click is caught on the way
 * down, before the block's own handlers, so a toggle or a button inside
 * opens the block rather than firing in the grid. Keyboard clicks are left
 * alone: the title below is the keyboard's way in.
 */
function BlockCard({ block: b, fresh, onOpen }: { block: Block; fresh: boolean; onOpen: () => void }) {
  const down = useRef<{ x: number; y: number } | null>(null);
  return (
    <li className="group">
      <div
        data-cursor
        onPointerDownCapture={(e) => {
          down.current = { x: e.clientX, y: e.clientY };
        }}
        onClickCapture={(e) => {
          if (e.detail === 0) return;
          const d = down.current;
          if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return; // a drag, not a click
          e.stopPropagation();
          e.preventDefault();
          onOpen();
        }}
        className="relative aspect-[44/34] cursor-pointer overflow-hidden rounded-[24px] transition-[box-shadow] duration-300 [content-visibility:auto] hover:shadow-[inset_0_0_0_1px_rgba(20,20,20,0.08)]"
        style={{ background: groundOf(b), color: b.dark ? "#f4f4f2" : "#141414" }}
      >
        <Stage width={440} height={340}>
          <b.Component />
        </Stage>
        <span className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
          {fresh ? <Chip dark={b.dark}>New</Chip> : null}
          {b.free ? <Chip dark={b.dark}>Free</Chip> : null}
        </span>
      </div>
      <button
        id={`block-${b.slug}`}
        type="button"
        onClick={onOpen}
        className="mt-2.5 flex w-full items-baseline justify-between gap-3 rounded-lg px-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
      >
        <span className="text-[0.98rem] font-medium">{b.title}</span>
        <span className="text-[0.85rem] text-[color:rgba(20,20,20,0.45)]">{b.category}</span>
      </button>
    </li>
  );
}

function Chip({ children, dark }: { children: ReactNode; dark: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.72rem] font-medium leading-none ${dark ? "bg-white/14 text-white" : "bg-white text-[#141414]"}`}>
      {children}
    </span>
  );
}
