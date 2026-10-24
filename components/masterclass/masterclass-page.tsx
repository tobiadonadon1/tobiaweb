"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock, Play } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { Specimen } from "@/components/superhuman/material/specimens";
import { hasPerk, money, PLANS } from "@/lib/membership/tiers";
import { TRACKS } from "./tracks";

/**
 * THE MASTERCLASS (the shelf's Masterclass family): its own room, like
 * Design has its own. A dark screening room on purpose: these are films,
 * and the lessons are the light in it.
 *
 *   hero        what it is in one line, the trailer frame, the way in
 *   tracks      five posters, one per subject (tracks.ts)
 *   lessons     a member's real lessons once they're in (/api/membership/perks,
 *               shelf "masterclass"); until then the first slots, coming soon
 *   note        Tobi's line from the dashboard's coming-soon card
 *
 * Who's looking only changes the words and buttons; the lessons' links come
 * from the server, for a plan that opens them.
 */

type Lesson = { id: string; title: string; summary: string | null; url: string | null; locked: boolean; shelf: string };

const PRO_PRICE = money(PLANS.pro.priceCents, PLANS.pro.currency);
const SLOTS = 6;

export function MasterclassPage() {
  const member = useMember();
  const open = Boolean(member && hasPerk(member.tier, "masterclass"));
  const [lessons, setLessons] = useState<Lesson[] | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((r: { ok?: boolean; training?: Lesson[] }) => {
        if (alive && r.ok) setLessons((r.training ?? []).filter((t) => t.shelf === "masterclass"));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open]);

  return (
    <>
      <Hero member={member} open={open} />
      <Tracks />
      <Lessons open={open} lessons={lessons} />
      <Note open={open} member={member} />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * HERO: a spotlight that follows the pointer, the name, one line, and
 * the trailer frame with the Masterclass mark in it.
 * ------------------------------------------------------------------ */
function Hero({ member, open }: { member: ReturnType<typeof useMember>; open: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <section
      ref={ref}
      onPointerMove={move}
      className="relative isolate overflow-hidden px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40"
      style={{ "--mx": "70%", "--my": "30%" } as React.CSSProperties}
    >
      {/* the room's light: a warm spot that follows the pointer, a cold one that doesn't */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-300"
        style={{
          background:
            "radial-gradient(38rem 28rem at var(--mx) var(--my), rgba(206,70,49,0.22), transparent 70%), radial-gradient(50rem 30rem at 10% 0%, rgba(35,70,224,0.25), transparent 70%)",
        }}
      />
      <div className="mx-auto grid w-full max-w-[84rem] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5a3c] opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff5a3c]" />
            </span>
            Filming now
          </span>
          <h1 className="mt-7 font-serif text-[clamp(3.4rem,9vw,7.2rem)] leading-[0.88] tracking-[-0.05em]">
            Master<em>class</em>
          </h1>
          <p className="mt-6 max-w-[30rem] text-[clamp(1.1rem,1.7vw,1.3rem)] leading-[1.45] text-white/72">
            In-depth lessons, 10 to 20 minutes each, on what I&rsquo;d teach a friend building their first product.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2 text-[0.85rem] text-white/80">
            {["10 to 20 minutes", "Never on YouTube", "Pro & Ultimate"].map((t) => (
              <li key={t} className="rounded-full border border-white/12 px-3 py-1.5">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            {member === undefined ? (
              <span className="h-12 w-52 rounded-full bg-white/[0.06]" aria-hidden />
            ) : open ? (
              <p className="flex items-center gap-2.5 text-[1rem] text-white/85">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2b9a72] text-[0.8rem]">✓</span>
                You&rsquo;re in. Lessons land here first.
              </p>
            ) : (
              <>
                <Link
                  href={`${JOIN_HREF}#pro`}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[1rem] font-medium text-[#0a1426] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Join Pro · {PRO_PRICE}/mo
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                {member === null ? (
                  <Link
                    href={`${ACCOUNT_HREF}?mode=signin&next=${encodeURIComponent("/projects/construct/masterclass")}`}
                    className="text-[0.98rem] text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white"
                  >
                    Sign in
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>

        <Trailer />
      </div>
    </section>
  );
}

/** The trailer frame: a 16:9 screen with the Masterclass mark under the light, and a play ring that says it's coming. */
function Trailer() {
  return (
    <figure className="group relative">
      <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-[#0d1c36] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 90% at 50% 40%, #f4ead8 0%, #e9dcc3 38%, #1a2a48 100%)" }}
        />
        <Specimen
          id="family-masterclass"
          instance="trailer"
          className="absolute left-1/2 top-[46%] h-auto w-[62%] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] transition-transform duration-700 ease-out group-hover:rotate-[-1deg] group-hover:scale-[1.03]"
        />
        {/* letterbox and grain, so it reads as a film still */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-[7%] bg-black/80" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[7%] bg-black/80" />
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(transparent_55%,rgba(0,0,0,0.45))]" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white/15 ring-1 ring-white/40 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
            <Play aria-hidden className="ml-1 h-8 w-8 fill-white text-white" />
          </span>
        </span>
        <span className="absolute bottom-[10%] left-[5%] rounded-full bg-black/55 px-3 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-white backdrop-blur">
          Lesson 01 · Coming soon
        </span>
      </div>
      <figcaption className="sr-only">The first lesson, coming soon.</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * TRACKS: five posters. A row you scroll on a phone, five across on a
 * wide screen. They lift and the mark turns on hover.
 * ------------------------------------------------------------------ */
function Tracks() {
  return (
    <section aria-labelledby="mc-tracks" className="px-5 pb-24 md:px-8 md:pb-32">
      <div className="mx-auto w-full max-w-[84rem]">
        <Heading id="mc-tracks" kicker="The tracks" title={<>Five things, <em>properly</em>.</>} />
        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-5">
          {TRACKS.map((t, i) => (
            <li key={t.id} className="w-[72vw] max-w-[19rem] flex-none snap-start md:w-auto md:max-w-none">
              <article
                className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-[1.6rem] p-5 ring-1 ring-white/10 transition-transform duration-500 ease-out hover:-translate-y-1.5"
                style={{ background: `linear-gradient(165deg, ${t.from} 0%, ${t.to} 78%)` }}
              >
                <span aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
                <div className="relative flex items-center justify-between">
                  <span className="font-serif text-[1.05rem] tabular-nums text-white/75">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full bg-black/25 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                    Coming soon
                  </span>
                </div>
                <div className="relative mx-auto my-auto w-[86%] rounded-2xl bg-[#f4ead8] p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out group-hover:rotate-[-3deg] group-hover:scale-[1.04]">
                  <Specimen id={t.mark} instance={`track-${t.id}`} className="h-auto w-full" />
                </div>
                <h3 className="relative font-serif text-[1.45rem] leading-[1.02] tracking-[-0.03em] text-white">{t.title}</h3>
                <p className="relative mt-2 text-[0.88rem] leading-[1.4] text-white/70">{t.line}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * LESSONS: a member's real ones as soon as they're in. Until then (and
 * for everyone else) the first slots, each one coming soon.
 * ------------------------------------------------------------------ */
function Lessons({ open, lessons }: { open: boolean; lessons: Lesson[] | null }) {
  const real = open && lessons && lessons.length ? lessons : null;
  return (
    <section aria-labelledby="mc-lessons" className="px-5 pb-24 md:px-8 md:pb-32">
      <div className="mx-auto w-full max-w-[84rem]">
        <Heading id="mc-lessons" kicker={real ? "Your lessons" : "First up"} title={real ? <>Press <em>play</em>.</> : <>On the <em>way</em>.</>} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {real
            ? real.map((l, i) => (
                <li key={l.id}>
                  <LessonCard n={i + 1} title={l.title} line={l.summary} url={l.url} locked={l.locked} />
                </li>
              ))
            : Array.from({ length: SLOTS }, (_, i) => (
                // three on a phone: six coming-soon frames in a column is a long scroll of the same thing
                <li key={i} className={i >= 3 ? "hidden sm:block" : undefined}>
                  <LessonCard n={i + 1} />
                </li>
              ))}
        </ol>
      </div>
    </section>
  );
}

function LessonCard({ n, title, line, url, locked }: { n: number; title?: string; line?: string | null; url?: string | null; locked?: boolean }) {
  const track = TRACKS[(n - 1) % TRACKS.length];
  const soon = !title;
  const body = (
    <>
      <div className="relative aspect-video overflow-hidden rounded-[1.1rem]" style={{ background: `linear-gradient(150deg, ${track.from}, ${track.to})` }}>
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_30%_10%,rgba(255,255,255,0.2),transparent_70%)]" />
        <span className="absolute left-4 top-3 font-serif text-[3.2rem] leading-none tracking-[-0.04em] text-white/90">{String(n).padStart(2, "0")}</span>
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:scale-110">
          {locked ? <Lock aria-hidden className="h-4 w-4 text-white" /> : <Play aria-hidden className="ml-0.5 h-4 w-4 fill-white text-white" />}
        </span>
        {soon ? (
          <>
            <span aria-hidden className="mc-shimmer absolute inset-0" />
            <span className="absolute bottom-3.5 left-4 text-[0.82rem] font-medium text-white/85">{track.title}</span>
          </>
        ) : null}
      </div>
      <div className="mt-3.5 px-1">
        {soon ? (
          <>
            <span className="block h-3.5 w-[70%] rounded-full bg-white/10" aria-hidden />
            <span className="mt-2.5 flex items-center justify-between text-[0.85rem] text-white/50">
              <span>Coming soon</span>
              <span>10–20 min</span>
            </span>
          </>
        ) : (
          <>
            <span className="block text-[1.02rem] font-medium leading-[1.3] text-white">{title}</span>
            <span className="mt-1 flex items-center justify-between gap-3 text-[0.85rem] text-white/55">
              <span className="truncate">{locked ? "Ultimate" : (line ?? "Watch")}</span>
              {url ? <ArrowUpRight aria-hidden className="h-4 w-4 flex-none" /> : null}
            </span>
          </>
        )}
      </div>
    </>
  );
  const cls = "group block rounded-[1.4rem] bg-white/[0.04] p-2.5 ring-1 ring-white/[0.08] transition-colors duration-300";
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}>
      {body}
    </a>
  ) : (
    <div className={cls} aria-label={soon ? `Lesson ${n}, coming soon` : undefined}>
      {body}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * NOTE: the line from the dashboard's coming-soon card, signed, and the
 * way in once more for anyone not in yet.
 * ------------------------------------------------------------------ */
function Note({ open, member }: { open: boolean; member: ReturnType<typeof useMember> }) {
  return (
    <section className="px-5 pb-32 md:px-8">
      <figure className="mx-auto w-full max-w-[52rem] text-center">
        <blockquote className="font-serif text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.08] tracking-[-0.03em]">
          &ldquo;These are coming <em>shortly</em>. Stay tuned, and thank you for your support.&rdquo;
        </blockquote>
        <figcaption className="mt-5 -rotate-2 font-hand text-[2rem] leading-none text-[#ff7a5c]">Tobi</figcaption>
        {member !== undefined && !open ? (
          <Link
            href={`${JOIN_HREF}#pro`}
            className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[1rem] font-medium text-[#0a1426] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Be there for the first one
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </figure>
    </section>
  );
}

function Heading({ id, kicker, title }: { id: string; kicker: string; title: React.ReactNode }) {
  return (
    <header>
      <p className="text-[0.8rem] font-medium uppercase tracking-[0.16em] text-white/50">{kicker}</p>
      <h2 id={id} className="mt-3 font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] tracking-[-0.035em]">
        {title}
      </h2>
    </header>
  );
}
