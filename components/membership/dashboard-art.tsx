"use client";

import { useCallback, useEffect, useState } from "react";
import { Specimen } from "@/components/superhuman/material/specimens";
import type { ProductId } from "@/lib/shop/products";

/**
 * THE DASHBOARD'S CHARACTER: colour, the cut-paper marks, the little man.
 *
 * Tobia, on the first dashboard: "a list of white skills, no graphic,
 * nothing... so flat, so white, so without character... something they'll
 * leave there and end up cancelling." The site already has the two things
 * that fix that, so the dashboard borrows them rather than inventing a third
 * look:
 *
 *   THE MARKS. Every skill has a cut-paper drawing (material/specimens.tsx),
 *   the one it wears on the shelf. In the dashboard it is a small picture at
 *   the start of the skill's row (`Thumb`), on two soft colours picked
 *   against the mark (a blue mark on peach, a saffron one on blue). Big
 *   picture cards were tried and were too strong: "it's okay how they were,
 *   I just would have changed the emoji."
 *
 *   THE LITTLE MAN. The logo's figure, who walks the cards on the home page
 *   (sections/why-me-mascot.tsx), drawn here standing still. He waves from
 *   the sidebar when something is new, and cheers on a shelf that is still
 *   being filled, beside a note from Tobi.
 */

/* ------------------------------------------------------------------ *
 * STAGES: [glow, ground]. The glow sits in the top-left corner and fades
 * into the ground. `added` is the day the skill went up, from git (or the
 * day Tobia says it comes out): what makes it "new" in the dashboard, and
 * what puts it first.
 * ------------------------------------------------------------------ */
export type Look = { a: string; b: string };

export const SKILL_LOOK: Record<ProductId, Look & { added: string }> = {
  "the-98c-trade": { a: "#bccdff", b: "#ecf0ff", added: "2026-09-23" },
  launchr: { a: "#ffd29a", b: "#fff2df", added: "2026-09-25" },
  "jev-crypto-analyst": { a: "#bfe6cd", b: "#eff8f1", added: "2026-09-28" },
  "jev-review-miner": { a: "#cdd9ff", b: "#f2f5ff", added: "2026-09-30" },
  whitehat: { a: "#ffd59b", b: "#fff4e2", added: "2026-10-01" },
  "app-designer": { a: "#ffcdb8", b: "#fff1ea", added: "2026-10-03" },
  "web-designer": { a: "#c4d2ff", b: "#eef2ff", added: "2026-10-05" },
  "app-launcher": { a: "#ffdca8", b: "#fff5e6", added: "2026-10-09" },
  "grok-army": { a: "#d9c8ff", b: "#f4efff", added: "2026-10-10" },
  "app-designer-pro": { a: "#ffc3dc", b: "#fff0f5", added: "2026-10-12" },
  "copycat-detective": { a: "#ffe08f", b: "#fff8e3", added: "2026-10-12" },
  "viral-machine": { a: "#ffd0b0", b: "#fff2e6", added: "2026-10-15" },
  "web-designer-pro": { a: "#eef39a", b: "#fbfbe7", added: "2026-10-16" },
  "duo-designer": { a: "#bfe3d6", b: "#eef8f3", added: "2026-10-19" },
  "video-editor": { a: "#ffc9a8", b: "#f2eeff", added: "2026-10-21" },
  "motion-designer": { a: "#ffb08c", b: "#fff1e8", added: "2026-10-23" },
  "shorts-animator": { a: "#a9bdf0", b: "#fdf3d8", added: "2026-10-25" },
  "reel-bot": { a: "#d6d6d4", b: "#f3f3f1", added: "2026-10-26" },
  "video-editor-pro": { a: "#c9b37e", b: "#eef0f5", added: "2026-10-27" },
  "1k-bot": { a: "#f2cd6b", b: "#f6f3ea", added: "2026-10-29" },
  "meta-ads": { a: "#f0a487", b: "#f6f1e8", added: "2026-10-30" },
  "conversion-teardown": { a: "#f5d84a", b: "#f7f4e6", added: "2026-10-31" },
};

/** The library's own sections, each with its mark from the shelf and the material room. */
export const SHELF_LOOK = {
  skills: { mark: "skills", a: "#ffd29a", b: "#fff3e3" },
  masterclass: { mark: "family-masterclass", a: "#b7c6ff", b: "#edf0ff" },
  design: { mark: "family-design", a: "#ffbca6", b: "#fff0ea" },
  training: { mark: "videos", a: "#b6e0c8", b: "#edf7f1" },
  live: { mark: "family-masterclass", a: "#ffc2b4", b: "#fff1ec" },
  network: { mark: "way-side-by-side", a: "#c9d3ff", b: "#eff2ff" },
} as const;

/**
 * THE OVERVIEW'S TILES, on hover: each section's own soft colour, a glow
 * from the top-right corner fading into a warm white. The Library's four
 * use their shelf's colours; the rest get their own.
 */
const TILE_LOOK: Record<string, Look> = {
  skills: SHELF_LOOK.skills,
  masterclass: SHELF_LOOK.masterclass,
  design: SHELF_LOOK.design,
  training: SHELF_LOOK.training,
  live: SHELF_LOOK.live,
  telegram: { a: "#bfe0f6", b: "#eef7fc" },
  calls: { a: "#d9c8ff", b: "#f5f0ff" },
  custom: { a: "#ffe08f", b: "#fff8e3" },
  network: SHELF_LOOK.network,
};

export const tileGlow = (section: string): React.CSSProperties | undefined => {
  const look = TILE_LOOK[section];
  return look
    ? { background: `radial-gradient(120% 130% at 100% 0%, ${look.a} 0%, transparent 70%), linear-gradient(200deg, ${look.b} 0%, #fffdf9 100%)` }
    : undefined;
};

/** `at` moves the glow, so a row of cards on one colour doesn't repeat itself. */
export const stageStyle = ({ a, b }: Look, at = "12% 0%"): React.CSSProperties => ({
  background: `radial-gradient(85% 110% at ${at}, ${a} 0%, transparent 72%), linear-gradient(165deg, ${b} 0%, #fbf8f2 100%)`,
});

/**
 * A SMALL PICTURE at the start of a row: the skill's mark on its colour, or
 * a lesson's number on its shelf's. Small on purpose ("nothing as strong"):
 * it tells the rows apart, the list stays a list.
 */
export function Thumb({
  look,
  mark,
  n,
  instance,
  className = "h-14 w-14",
}: {
  look: Look;
  mark?: string;
  n?: number;
  instance: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`relative grid flex-none place-items-center overflow-hidden rounded-xl ring-1 ring-inset ring-[rgba(11,31,58,0.06)] ${className}`}
      style={stageStyle(look)}
    >
      {mark ? (
        <Specimen id={mark} instance={instance} className="h-[88%] w-[88%]" />
      ) : (
        <span className="font-serif text-[1.25rem] leading-none tracking-[-0.03em]">{String(n ?? 1).padStart(2, "0")}</span>
      )}
    </span>
  );
}

/** "New", beside a row's kicker. */
export function NewChip() {
  return (
    <span className="rounded-full bg-[var(--accent-clay)] px-1.5 py-[0.2rem] font-mono text-[0.6rem] uppercase leading-none tracking-[0.12em] text-white">
      New
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * THE LITTLE MAN, standing still. Same body as the one who walks the home
 * page (26 x 36, clay), with three poses: standing, one arm waving, and
 * both arms up, the logo's own pose.
 * ------------------------------------------------------------------ */
export function LittleMan({ pose = "stand", className = "" }: { pose?: "stand" | "wave" | "cheer"; className?: string }) {
  const stroke = { stroke: "var(--accent-clay)", strokeLinecap: "round" as const, fill: "none" };
  // The walking body's arms hang inside its torso when it stands still, so
  // these are drawn out from the shoulders instead: down and out, or up and
  // out like the logo.
  const down = { l: "M11 13.6C8.4 15.4 7.2 17.8 6.9 20.8", r: "M15 13.6C17.6 15.4 18.8 17.8 19.1 20.8" };
  const up = { l: "M11 14.2C7.2 13.6 4.8 11 4 7.4", r: "M15 14.2C18.8 13.6 21.2 11 22 7.4" };
  return (
    <svg viewBox="0 0 26 36" aria-hidden className={`overflow-visible ${className}`}>
      <path d="M12.2 21.5L11.2 34" strokeWidth="3.5" {...stroke} />
      <path d="M13.8 21.5L14.8 34" strokeWidth="3.5" {...stroke} />
      <path d={pose === "cheer" ? up.l : down.l} strokeWidth="3.2" {...stroke} />
      <path d={pose === "stand" ? down.r : up.r} strokeWidth="3.2" className={pose === "wave" ? "little-man-wave" : undefined} {...stroke} />
      <path d="M13 12.8L13 21.5" strokeWidth="6.2" {...stroke} />
      <circle cx="13" cy="5" r="4" fill="var(--accent-clay)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * A SHELF STILL BEING FILLED. Not "nothing here": a note from Tobi, in his
 * words ("these are coming, stay tuned, thank you for your support"), with
 * the little man cheering on the shelf's own colour.
 * ------------------------------------------------------------------ */
type Shelf = "masterclass" | "design" | "training" | "network";

export function ComingSoon({ shelf }: { shelf: Shelf }) {
  const look = SHELF_LOOK[shelf];
  return (
    <figure className="relative isolate mt-7 overflow-hidden rounded-[2rem] p-7 md:p-11" style={stageStyle(look)}>
      <Specimen
        id={look.mark}
        instance="coming"
        className="pointer-events-none absolute -right-6 bottom-6 -z-10 hidden h-auto w-[36%] max-w-[20rem] rotate-[-6deg] md:block"
      />
      <LittleMan pose="cheer" className="h-14 w-auto" />
      <blockquote className="mt-6 max-w-[30rem] font-serif text-[clamp(1.7rem,3.8vw,2.5rem)] leading-[1.08] tracking-[-0.03em]">
        &ldquo;These are coming <em>shortly</em>. Stay tuned, and thank you for your support.&rdquo;
      </blockquote>
      <figcaption className="mt-5">
        <span className="block -rotate-2 font-hand text-[1.7rem] leading-none text-[var(--accent-clay)]">Tobi</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * THE NEXT LIVE Q&A: the Coming Soon card, with a counter instead of the
 * quote. Sessions are every other Friday from QA_FIRST, so the date rolls
 * on by itself; the YouTube link (MEMBERS_QA_URL) appears when it's set.
 * ------------------------------------------------------------------ */
const QA_FIRST = "2026-11-06";
const DAY = 24 * 3600 * 1000;

/** The next session on or after today, and how many days away it is. */
export function nextQa(now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const first = Date.parse(QA_FIRST);
  const steps = Math.max(0, Math.ceil((today - first) / (14 * DAY)));
  const at = new Date(first + steps * 14 * DAY);
  return { at, days: Math.round((at.getTime() - today) / DAY) };
}

export const qaDate = (at: Date, month: "long" | "short" = "long") =>
  at.toLocaleDateString("en-GB", { weekday: month === "long" ? "long" : "short", day: "numeric", month, timeZone: "UTC" });

export function QaCountdown({ url }: { url?: string | null }) {
  const [next, setNext] = useState<ReturnType<typeof nextQa> | null>(null);
  const [shown, setShown] = useState(0);
  // Today is the viewer's today, so it's read in the browser.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setNext(nextQa()), []);
  // The number rolls up to the days left, once.
  useEffect(() => {
    if (!next) return;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
    let frame = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = ms ? Math.min(1, (t - t0) / ms) : 1;
      setShown(Math.round(next.days * (1 - Math.pow(1 - k, 3))));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [next]);

  const days = next?.days ?? null;
  const at = next?.at;
  return (
    <figure className="relative isolate mt-7 grid items-center gap-8 overflow-hidden rounded-[2rem] p-7 sm:grid-cols-[minmax(0,1fr)_auto] md:p-10" style={stageStyle(SHELF_LOOK.live)}>
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] ring-1 ring-inset ring-[rgba(11,31,58,0.08)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2a2a] opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ff2a2a]" />
          </span>
          Live on YouTube
        </span>
        <p className="mt-6 font-serif leading-[0.85] tracking-[-0.05em]">
          {days === 0 ? (
            <em className="text-[clamp(4rem,11vw,7rem)]">Today!</em>
          ) : days === 1 ? (
            <em className="text-[clamp(4rem,11vw,7rem)]">Tomorrow!</em>
          ) : (
            <>
              <span className="text-[clamp(5rem,14vw,9rem)] tabular-nums">{days === null ? "\u00a0" : shown}</span>
              <span className="ml-3 text-[clamp(1.6rem,3.5vw,2.4rem)] tracking-[-0.03em]">
                days <em>to go</em>
              </span>
            </>
          )}
        </p>
        <figcaption className="mt-5 text-[1.05rem] leading-[1.45]">Bring your questions. {url ? "We go live here." : "The link drops here before we go live."}</figcaption>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-[1rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            Join the live
          </a>
        ) : null}
      </div>
      {/* The date as a calendar page, stuck on at an angle. */}
      {at ? (
        <div aria-label={qaDate(at)} className="mx-auto w-40 rotate-[4deg] overflow-hidden rounded-[1.4rem] bg-white text-center shadow-[0_22px_40px_-18px_rgba(11,31,58,0.45)] transition-transform duration-500 hover:rotate-0 sm:mx-0">
          <p className="bg-[#ff2a2a] py-2 text-[0.85rem] font-medium uppercase tracking-[0.2em] text-white">
            {at.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}
          </p>
          <p className="pt-3 font-serif text-[4.2rem] leading-none tracking-[-0.04em]">{at.getUTCDate()}</p>
          <p className="pb-4 pt-1 text-[0.9rem] text-[color:rgba(11,31,58,0.6)]">{at.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" })}</p>
        </div>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 * WHAT'S NEW, PER SECTION. The last time each section was opened is kept
 * in this browser, per account. Before the first visit, anything from the
 * last week counts as new; nothing older ever does.
 *
 * Two readings: `fresh` (for the sidebar's pings) clears the moment a
 * section is opened; `wasNew` (for the "New" stickers inside it) keeps what
 * was new when the page loaded, so opening a section doesn't wipe the very
 * stickers it was opened to see.
 * ------------------------------------------------------------------ */
const WEEK = 7 * 24 * 3600 * 1000;
type Seen = Record<string, number>;

function readSeen(key: string): Seen {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}") as Seen;
  } catch {
    return {};
  }
}

export function useSeen(email: string) {
  const key = `construct-seen:${email}`;
  const [seen, setSeen] = useState<Seen | null>(null);
  const [atLoad, setAtLoad] = useState<Seen | null>(null);

  useEffect(() => {
    const s = readSeen(key);
    // Read once from this browser's storage, after the first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeen(s);
    setAtLoad(s);
  }, [key]);

  const newer = (from: Seen | null, section: string, iso: string) => {
    if (!from) return false;
    const t = Date.parse(iso);
    return t > Math.max(from[section] ?? 0, Date.now() - WEEK);
  };
  const fresh = useCallback((section: string, iso: string) => newer(seen, section, iso), [seen]);
  const wasNew = useCallback((section: string, iso: string) => newer(atLoad, section, iso), [atLoad]);

  const markSeen = useCallback(
    (section: string) => {
      setSeen((s) => {
        if (!s) return s;
        const next = { ...s, [section]: Date.now() };
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key],
  );

  return { fresh, wasNew, markSeen };
}

/**
 * Calendar days from `iso` to today, where the member is, not in UTC (a bare
 * "2026-10-27" is that day on their own calendar). Negative: still to come.
 */
const daysSince = (iso: string) => {
  const at = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso);
  const day = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / (24 * 3600 * 1000);
  return { at, days: day(new Date()) - day(at) };
};
const dayMonth = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

/** "today", "yesterday", "3 days ago", "last week"; a day still to come is its date, "27 October". */
export const ago = (iso: string) => {
  const { at, days } = daysSince(iso);
  if (days < 0) return dayMonth(at);
  return days === 0 ? "today" : days === 1 ? "yesterday" : days < 7 ? `${days} days ago` : days < 14 ? "last week" : null;
};

/** When it came out: "today", "yesterday", or the date, "27 October". */
export const released = (iso: string) => {
  const { at, days } = daysSince(iso);
  return days === 0 ? "today" : days === 1 ? "yesterday" : dayMonth(at);
};
