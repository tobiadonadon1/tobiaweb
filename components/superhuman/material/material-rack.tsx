import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DownloadGate } from "./download-gate";
import { Specimen } from "./specimens";
import { entryHref } from "./material-data";
import type { MaterialEntry, MaterialFolder } from "./material-types";

/**
 * A FOLDER'S CONTENTS, AS A RACK.
 *
 * Columns, not rows. A row gives an item a wide strip and no height, which is
 * the right shape for a headline and a link and the wrong one for something
 * you are meant to look at before you read. Each piece is a column with a mark
 * at the top big enough to be a picture rather than a bullet.
 *
 * BOTH OPEN FOLDERS USE THIS. It was built for Skills and Guides kept the
 * list, on the theory that a skill is looked at and a guide is read. Tobia:
 * "the same graphical treatment done for the skills has to be done into
 * Guides." He is right and the theory was wrong: a guide is chosen before it
 * is read, and choosing is looking. A folder of three things you pick between
 * wants the same furniture whatever those things are.
 *
 * NO ORDINALS. They anchored each item while there was nothing else at the top
 * of it, and a number standing in for a picture is a number pretending to be a
 * picture. There are real marks now.
 *
 * THE MARK IS THE MEMORY. The six compositions (see specimens.tsx) are drawn
 * so that no two share a dominant form: cards, a bitten shape, a field, a
 * structure, a size comparison, a funnel. That is what makes a rack legible at
 * a glance instead of three paragraphs with different first words.
 *
 * ONE PRIMARY, drawn as a pill, and it is not the same promise in both
 * folders. A skill's pill saves a file and its page is the secondary link. A
 * guide has no file, so the page IS the primary and takes the pill. Nothing
 * here shows two equal buttons in one column.
 */

function Column({ folder, entry }: { folder: MaterialFolder; entry: MaterialEntry }) {
  const href = entryHref(folder.id, entry.slug);
  const download = entry.link?.download ? entry.link : undefined;

  return (
    <li className="flex flex-col bg-[var(--paper)] p-6 md:p-8">
      {/* ---- the mark and the title, as one target ---- */}
      <Link
        href={href}
        className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
      >
        <Specimen
          id={entry.slug}
          className="h-auto w-full transition-transform duration-[600ms] ease-out group-hover:-translate-y-1.5"
        />

        <h2 className="mt-6 font-serif text-[clamp(1.5rem,2.6vw,1.95rem)] leading-[1.06] tracking-[-0.03em] text-[var(--ink)] transition-colors duration-[600ms] ease-out group-hover:text-[var(--accent-clay)]">
          {entry.title}
        </h2>
      </Link>

      <p className="mt-3 text-pretty text-[1rem] leading-[1.58] text-[color:rgba(11,31,58,0.72)]">
        {entry.summary}
      </p>

      {/* The line that decides whether this is worth an afternoon. */}
      <p className="mt-3 text-pretty text-[0.92rem] leading-[1.55] text-[color:rgba(11,31,58,0.62)]">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
          When
        </span>{" "}
        {entry.when}
      </p>

      {/* ---- the foot, pinned so columns of unequal text still line their
             buttons up ---- */}
      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {download ? (
            <>
              <DownloadGate
                href={download.href}
                label="Download"
                title={entry.title}
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline-strong)] px-5 py-2.5 text-[0.9rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
              />

              <Link
                href={href}
                className="group/read inline-flex items-center gap-1.5 border-b border-[var(--hairline-strong)] pb-1 text-[0.9rem] text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                What it does
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <Link
              href={href}
              className="group/read inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline-strong)] px-5 py-2.5 text-[0.9rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
            >
              Read it
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
            </Link>
          )}
        </div>

        <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
          {entry.minutes} min · {entry.level}
        </p>
      </div>
    </li>
  );
}

export function MaterialRack({ folder }: { folder: MaterialFolder }) {
  return (
    <ul className="grid list-none grid-cols-1 gap-px border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-3">
      {folder.entries.map((entry) => (
        <Column key={entry.slug} folder={folder} entry={entry} />
      ))}
    </ul>
  );
}
