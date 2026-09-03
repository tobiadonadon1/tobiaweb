import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { HandNote } from "@/components/ui/hand-note";
import { MATERIAL_GRID, folderHref } from "./material-data";
import { Specimen } from "./specimens";
import type { MaterialFolder } from "./material-types";

/**
 * THE ROOM — /projects/construct/material
 *
 * NO HEADER, NO HERO, NO FOOTER NAV. This page used to open with a full ink
 * header carrying a title, a lede and a status line, then an intro paragraph,
 * then a label saying "Two folders" above two folders. Four pieces of writing
 * to get to a choice between two things. All of it is gone. What is left is
 * one sentence and the grid, because the grid is the page and everything else
 * was the page explaining the grid.
 *
 * THE GRID IS A SAMPLE BOOK. A brand manual does not put an icon of the logo
 * in the cell marked Logo. It puts the logo, at a size you can judge. This is
 * the Material page, so it runs the same rule: each cell holds a specimen of
 * what is behind the door (see specimens.tsx) rather than a symbol standing in
 * for it. Nobody has to be told how Skills and Guides differ, because the two
 * cells do not look alike.
 *
 * TWO OF THE FOUR ARE BLURRED. Not hidden, and not removed. A page showing two
 * folders looks finished at two folders. A page showing two you can open and
 * two you cannot read yet says the shelf is still being filled, which is true.
 * The blur is the only place on this site where something is deliberately
 * unreadable, so it is paid for immediately: every locked cell carries one
 * checkable fact about what is written and what is missing. "Six written. None
 * filmed." A count is honest in a way that a date is not.
 *
 * THE RULES ARE THE LAYOUT. `gap-px` over a hairline ground gives real shared
 * 1px rules between cells rather than borders that double up at every seam,
 * which is how the printed reference draws it and the only way to get an
 * unbroken grid without fighting collapsing borders.
 *
 * Nothing here has state. It is the junction between the shelf and the
 * reading, and a junction should be quick.
 */

function Cell({ folder, index }: { folder: MaterialFolder; index: number }) {
  const label = (
    <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
      {folder.name}
    </span>
  );

  /* ---- the specimen, and the blur that is the whole difference ----
   *
   * `h-auto w-full`, not a height cap. The composition is 400 x 300 and it
   * scales to the cell's full width, so a specimen in a 500px cell is 375px
   * tall and fills it. Capping the height instead letterboxes the drawing
   * inside its own cell, and a sample that floats in the middle of a lot of
   * paper reads as an icon rather than as the material. The reference this
   * page is built on fills every cell to its edges, and that is most of why
   * it looks certain of itself. */
  const specimen = (
    <div className="my-7 md:my-9">
      <Specimen
        id={folder.id}
        className={`h-auto w-full transition-transform duration-[600ms] ease-out ${
          folder.locked
            ? "scale-[0.98] opacity-70 blur-[7px]"
            : "group-hover:-translate-y-1"
        }`}
      />
    </div>
  );

  /* ------------------------------------------------------------------ *
   * LOCKED. A div, not a link: nothing here is clickable, so nothing here
   * takes a tab stop or grows a hover state that promises a page.
   * ------------------------------------------------------------------ */
  if (folder.locked) {
    return (
      <li
        className="material-cell relative flex h-full flex-col bg-[var(--paper)] p-6 md:p-8"
        style={{ animationDelay: `${index * 90}ms` }}
      >
        <div className="flex items-start justify-between gap-4">
          {label}
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--hairline)] px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[color:rgba(11,31,58,0.5)]" />
            Not open
          </span>
        </div>

        {specimen}

        <p className="mt-auto font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
          {folder.soon}
        </p>
      </li>
    );
  }

  /* ------------------------------------------------------------------ *
   * OPEN. The whole cell is the target, so there is no button inside a
   * card competing with the card for the same click.
   * ------------------------------------------------------------------ */
  return (
    <li
      className="material-cell bg-[var(--paper)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link
        href={folderHref(folder.id)}
        className="group flex h-full flex-col p-6 transition-colors duration-[600ms] ease-out hover:bg-[rgba(206,70,49,0.035)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent-clay)] md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          {label}
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:rgba(11,31,58,0.5)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-clay)]" />
        </div>

        {specimen}

        <p className="mt-auto max-w-[32ch] text-pretty text-[0.98rem] leading-[1.5] text-[color:rgba(11,31,58,0.62)]">
          {folder.line}
        </p>
      </Link>
    </li>
  );
}

export function MaterialRoom() {
  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/construct#shelf" label="The shelf" tone="ink" />

      {/* ------------------------------------------------------------- *
       * THE ONLY WRITING ON THE PAGE.
       *
       * One sentence and one fact. The sentence is a claim anybody can
       * check by opening a folder, and the fact underneath it is set in
       * the label voice rather than the prose voice, so it reads as a
       * caption on the page instead of a second sentence.
       * ------------------------------------------------------------- */}
      <header className="mx-auto max-w-3xl px-6 pb-14 pt-32 text-center md:pb-20 md:pt-40">
        {/* An h1, not a paragraph. This sentence is the page's title even
            though it does not look like a title, and the page had no heading
            of any level while it was a <p>: a screen reader landing here got
            no rotor entry and no way into the grid except tabbing. Looking
            like a title and being one are separate decisions. */}
        <h1 className="text-balance font-serif text-[clamp(1.7rem,4.2vw,2.75rem)] leading-[1.12] tracking-[-0.032em] text-[var(--ink)]">
          Everything here is something I use.
        </h1>
        <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
          Free, and it stays free
        </p>
      </header>

      {/* ------------------------------------------------------------- *
       * THE GRID.
       * ------------------------------------------------------------- */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-32 md:pb-40">
        {/* Four cells, two of them open, and the hand picks one so nobody has
            to. It points across at the Skills cell rather than down at it,
            because on this page the thing being pointed at is beside the
            note, not under it. */}
        <HandNote
          gesture="right"
          label="start here"
          color="var(--accent-clay)"
          size={86}
          className="pointer-events-none absolute -top-2 left-6 hidden flex-col items-start gap-0.5 lg:flex"
          labelClassName="-rotate-3"
        />

        <ul className="grid list-none grid-cols-1 gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
          {MATERIAL_GRID.map((folder, i) => (
            <Cell key={folder.id} folder={folder} index={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}
