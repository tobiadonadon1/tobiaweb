"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Blocks } from "./material-blocks";
import { KIND_LABEL, neighbours } from "./material-data";
import type { MaterialEntry, MaterialFolder } from "./material-types";

/**
 * THE READER — index on the left, the piece on the right.
 *
 * The shape is the one every reference library has converged on because it
 * is the right one: the whole contents visible and stationary on one side,
 * the thing you are reading on the other. You can see what else is in the
 * folder without leaving what you are reading, which is the entire argument
 * against giving each piece its own page.
 *
 * WHY THE RIGHT-HAND PANE IS INK. Two reasons, and the second one is the real
 * one. It separates the reading from the choosing at a glance, so there is
 * never any doubt which side is the document. And it puts the piece on the
 * same ground as the shelf it came from, so opening something reads as going
 * further in rather than as landing somewhere else.
 *
 * DEEP LINKS. Selecting a piece rewrites the hash with replaceState — no
 * navigation, no scroll jump, no history entry per click, and the URL in the
 * address bar is always the thing being read, so it can be sent to somebody.
 * Arriving with a hash opens that piece.
 *
 * ON SMALL SCREENS the two panes stack: index first, then the piece. Choosing
 * something scrolls the piece into view, because a selection whose result is
 * a screen further down is a selection that looks broken.
 */

/** How a row that is not finished is marked, in the row's own words. */
const STATUS_NOTE: Record<MaterialEntry["status"], string | null> = {
  ready: null,
  draft: "Draft",
  filming: "Not filmed",
};

function Index({
  folder,
  current,
  onPick,
}: {
  folder: MaterialFolder;
  current: string;
  onPick: (slug: string) => void;
}) {
  return (
    <nav aria-label={`${folder.name} contents`}>
      <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
        Inside · {folder.entries.length}
      </h2>

      <ul className="mt-4 list-none border-t border-[var(--hairline)]">
        {folder.entries.map((entry, i) => {
          const on = entry.slug === current;
          const note = STATUS_NOTE[entry.status];

          return (
            <li key={entry.slug} className="border-b border-[var(--hairline)]">
              <button
                type="button"
                onClick={() => onPick(entry.slug)}
                aria-current={on ? "true" : undefined}
                className={`group flex w-full items-start gap-3 py-4 pr-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-sky)] ${
                  on ? "" : "hover:bg-[rgba(11,31,58,0.03)]"
                }`}
              >
                {/* The marker. A rule rather than a dot, because the rest of
                    the page is made of rules. */}
                <span
                  aria-hidden
                  className={`mt-[0.45rem] h-3 w-3 shrink-0 border-l-2 transition-colors ${
                    on
                      ? "border-[var(--accent-sky)]"
                      : "border-transparent group-hover:border-[var(--hairline-strong)]"
                  }`}
                />

                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[1.02rem] leading-snug transition-colors ${
                      on
                        ? "text-[var(--ink)]"
                        : "text-[color:rgba(11,31,58,0.62)] group-hover:text-[color:rgba(11,31,58,0.85)]"
                    }`}
                  >
                    {entry.title}
                  </span>

                  <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[color:rgba(11,31,58,0.4)]">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{KIND_LABEL[entry.kind]}</span>
                    <span>{entry.minutes} min</span>
                    {note ? (
                      <span className="text-[color:rgba(206,70,49,0.75)]">{note}</span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Meta({ entry }: { entry: MaterialEntry }) {
  const rows: [string, string][] = [
    ["When", entry.when],
    ["For", entry.level],
    [entry.kind === "video" ? "Runs" : "Reads", `${entry.minutes} min`],
  ];

  return (
    <dl className="mt-8 grid grid-cols-1 gap-px border border-[var(--hairline-on-ink)] bg-[var(--hairline-on-ink)] sm:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="bg-[var(--ink)] px-4 py-3.5">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.4)]">
            {label}
          </dt>
          <dd className="mt-1.5 text-[0.92rem] leading-snug text-[color:rgba(214,238,244,0.78)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Piece({
  folder,
  entry,
  onPick,
}: {
  folder: MaterialFolder;
  entry: MaterialEntry;
  onPick: (slug: string) => void;
}) {
  const { prev, next } = neighbours(folder, entry.slug);

  return (
    <article className="ink-grain relative bg-[var(--ink)] px-6 py-10 md:px-10 md:py-12">
      <div className="relative z-10">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.45)]">
          {KIND_LABEL[entry.kind]}
        </span>

        <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[1.05] tracking-[-0.02em] text-[var(--paper)]">
          {entry.title}
        </h2>

        <p className="mt-4 max-w-[52ch] text-pretty text-[1.1rem] leading-[1.5] text-[color:rgba(214,238,244,0.7)]">
          {entry.summary}
        </p>

        {/* The unfinished ones say so above the writing, not in a badge that
            can be mistaken for a category. */}
        {entry.status !== "ready" ? (
          <p className="mt-6 max-w-[52ch] border-l-2 border-[var(--accent-clay)] py-1 pl-4 text-[0.95rem] leading-[1.6] text-[color:rgba(214,238,244,0.72)]">
            {entry.status === "filming"
              ? "This one is not filmed yet. What follows is the notes it will be cut from, which are worth reading on their own."
              : "This one is still being written and will change."}
          </p>
        ) : null}

        <Meta entry={entry} />

        <div className="mt-10">
          <Blocks blocks={folder.id === "skills" ? entry.body.filter((b) => b.type === "p") : entry.body} />
        </div>

        {/* A link that saves a file and a link that opens a page are two
            different promises, so they are drawn as two different things: the
            download is a solid target with a down arrow, the visit is a
            hairline with the usual out arrow. */}
        {entry.link ? (
          entry.link.download ? (
            <a
              href={entry.link.href}
              download
              className="group mt-10 inline-flex items-center gap-2.5 border border-[rgba(207,233,238,0.3)] px-5 py-3.5 text-[0.95rem] text-[color:rgba(214,238,244,0.9)] transition-colors hover:border-[var(--accent-sky)] hover:text-[var(--paper)]"
            >
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              {entry.link.label}
            </a>
          ) : (
            <a
              href={entry.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-2 border-b border-[rgba(207,233,238,0.3)] pb-1 text-[0.98rem] text-[color:rgba(214,238,244,0.86)] transition-colors hover:border-[var(--accent-sky)] hover:text-[var(--paper)]"
            >
              {entry.link.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )
        ) : null}

        {entry.referral ? (
          <p className="mt-6 max-w-[62ch] text-[0.86rem] leading-relaxed text-[color:rgba(214,238,244,0.45)]">
            That link pays me if you sign up. It is the same tool I would name
            if it did not, and nothing is listed here because it pays.
          </p>
        ) : null}

        {/* ---- the neighbours ---- */}
        <div className="mt-14 flex flex-wrap items-start justify-between gap-6 border-t border-[var(--hairline-on-ink)] pt-6">
          {prev ? (
            <button
              type="button"
              onClick={() => onPick(prev.slug)}
              className="group max-w-[20rem] text-left"
            >
              <span className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.42)]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </span>
              <span className="mt-1.5 block text-[0.98rem] leading-snug text-[color:rgba(214,238,244,0.72)] transition-colors group-hover:text-[var(--paper)]">
                {prev.title}
              </span>
            </button>
          ) : (
            <span />
          )}

          {next ? (
            <button
              type="button"
              onClick={() => onPick(next.slug)}
              className="group max-w-[20rem] text-right"
            >
              <span className="flex items-center justify-end gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.42)]">
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1.5 block text-[0.98rem] leading-snug text-[color:rgba(214,238,244,0.72)] transition-colors group-hover:text-[var(--paper)]">
                {next.title}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function FolderReader({ folder }: { folder: MaterialFolder }) {
  const [current, setCurrent] = useState(folder.entries[0]?.slug ?? "");
  const pieceRef = useRef<HTMLDivElement>(null);

  // Arriving with a hash opens that piece. A hash naming nothing is ignored
  // rather than 404ing: the folder is still perfectly readable.
  useEffect(() => {
    const open = () => {
      const slug = window.location.hash.replace(/^#/, "");
      if (slug && folder.entries.some((e) => e.slug === slug)) setCurrent(slug);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [folder]);

  const pick = useCallback((slug: string) => {
    setCurrent(slug);
    // replaceState, not a navigation: no history entry per click and no jump
    // to the anchor, which would undo the scroll we are about to do.
    window.history.replaceState(null, "", `#${slug}`);

    // Stacked layout only. On the two-column layout the piece is already in
    // front of you and moving the page would be the surprising thing.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      pieceRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  }, []);

  const entry =
    folder.entries.find((e) => e.slug === current) ?? folder.entries[0];
  if (!entry) return null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12">
      {/* top-24, not top-16: the BackLink chip is fixed at 28px down and
          about 40px tall, and at exactly 1024px the index column starts under
          it. 6rem clears the chip on every width it can share a row with. */}
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-9rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
        <Index folder={folder} current={entry.slug} onPick={pick} />
      </div>

      <div ref={pieceRef} className="min-w-0 scroll-mt-4">
        <Piece folder={folder} entry={entry} onPick={pick} />
      </div>
    </div>
  );
}
