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
 *   the one it wears on the shelf. In the dashboard it sits on a STAGE: two
 *   soft colours picked against the mark (a blue mark on peach, a saffron
 *   one on blue), the way Atoms gives every habit its own colour.
 *
 *   THE LITTLE MAN. The logo's figure, who walks the cards on the home page
 *   (sections/why-me-mascot.tsx), drawn here standing still. He waves from
 *   the sidebar when something is new, and cheers on a shelf that is still
 *   being filled, beside a note from Tobi.
 */

/* ------------------------------------------------------------------ *
 * STAGES: [glow, ground]. The glow sits in the top-left corner and fades
 * into the ground. `added` is the day the skill went up, from git: what
 * makes it "new" in the dashboard.
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
};

/** The library's own sections, each with its mark from the shelf and the material room. */
export const SHELF_LOOK = {
  skills: { mark: "skills", a: "#ffd29a", b: "#fff3e3" },
  masterclass: { mark: "family-masterclass", a: "#b7c6ff", b: "#edf0ff" },
  design: { mark: "family-design", a: "#ffbca6", b: "#fff0ea" },
  training: { mark: "videos", a: "#b6e0c8", b: "#edf7f1" },
} as const;

/** `at` moves the glow, so a row of cards on one colour doesn't repeat itself. */
export const stageStyle = ({ a, b }: Look, at = "12% 0%"): React.CSSProperties => ({
  background: `radial-gradient(85% 110% at ${at}, ${a} 0%, transparent 72%), linear-gradient(165deg, ${b} 0%, #fbf8f2 100%)`,
});

/** A coloured stage with a mark on it. `instance` keeps grain filters apart when a mark is drawn twice. */
export function MarkStage({
  look,
  mark,
  instance,
  className = "",
  markClassName = "",
  children,
}: {
  look: Look;
  mark: string;
  instance: string;
  className?: string;
  markClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={stageStyle(look)}>
      <Specimen
        id={mark}
        instance={instance}
        className={`absolute left-1/2 top-1/2 h-[78%] w-auto max-w-[82%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-[54%] group-hover:-rotate-[1.5deg] ${markClassName}`}
      />
      {children}
    </div>
  );
}

/** A sticker on a stage's corner: "New", "Yours". Cut slightly crooked, like the marks. */
export function Sticker({ tone, children }: { tone: "clay" | "ink"; children: React.ReactNode }) {
  return (
    <span
      className={`absolute left-3 top-3 -rotate-[5deg] rounded-full px-2.5 py-1 font-mono text-[0.66rem] uppercase leading-none tracking-[0.14em] shadow-[0_2px_0_rgba(11,31,58,0.12)] ${
        tone === "clay" ? "bg-[var(--accent-clay)] text-white" : "bg-[var(--ink)] text-[var(--paper)]"
      }`}
    >
      {children}
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
const COMING = {
  masterclass: "The first lessons are being filmed now, and they land here before anywhere else.",
  design: "The first templates are on my desk now, and they land here before anywhere else.",
  training: "The first videos and files are being made now, and they land here first.",
} as const;

export function ComingSoon({ shelf }: { shelf: keyof typeof COMING }) {
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
        <span className="mt-4 block max-w-[30rem] text-[0.98rem] leading-[1.5] text-[color:rgba(11,31,58,0.68)]">{COMING[shelf]}</span>
      </figcaption>
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

export const ago = (iso: string) => {
  const days = Math.floor((Date.now() - Date.parse(iso)) / (24 * 3600 * 1000));
  return days <= 0 ? "today" : days === 1 ? "yesterday" : days < 7 ? `${days} days ago` : days < 14 ? "last week" : null;
};
