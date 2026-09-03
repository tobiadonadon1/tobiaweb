import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { KIND_LABEL, entryHref } from "./material-data";
import type { MaterialEntry, MaterialFolder } from "./material-types";

/**
 * How a row that is not finished says so, in the row itself. The type
 * promises the index draws each status differently, so this is that promise
 * kept rather than a badge somebody remembered to add.
 */
const STATUS_NOTE: Record<MaterialEntry["status"], string | null> = {
  ready: null,
  draft: "Draft",
  filming: "Not filmed",
};

/**
 * A FOLDER'S CONTENTS, AS A LIST.
 *
 * Both open folders hold three pieces now, and three of anything is a list.
 * It was a two column reader before: an index on the left, an ink pane on the
 * right, one piece visible at a time. That shape earns its place at thirty
 * pieces and is silly at three, because the index and the thing being read
 * are the same length. Tobia: "maybe not a grid, but a list with a small
 * description."
 *
 * NO ORDINALS. They anchored each row while there was nothing else to look
 * at, and a number standing in for a picture is a number pretending to be a
 * picture. Skills have real marks now (see skill-grid.tsx) and a guide does
 * not need one: a guide is a title and a reason to read it.
 *
 * WHEN, NOT WHAT. Every row carries `when` under the summary. The summary
 * says what a piece is, which is what a title mostly already told you. `when`
 * says the situation you have to be in for it to be worth your afternoon, and
 * that is the only line on the row that changes anybody's mind.
 *
 * ONE ROW, TWO PROMISES. A link that saves a file and a link that opens a
 * page are drawn as different objects: the download is a bordered target with
 * a down arrow, the read is a bare underline with a forward arrow. Nobody
 * should have to guess which of the two they are about to get.
 */

function Row({ folder, entry }: { folder: MaterialFolder; entry: MaterialEntry }) {
  const href = entryHref(folder.id, entry.slug);

  return (
    <li className="group border-b border-[var(--hairline)]">
      <div className="py-10 md:py-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h2 className="font-serif text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.05] tracking-[-0.03em] text-[var(--ink)]">
              <Link
                href={href}
                className="transition-colors duration-[600ms] ease-out hover:text-[var(--accent-clay)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                {entry.title}
              </Link>
            </h2>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
              {KIND_LABEL[entry.kind]} · {entry.minutes} min · {entry.level}
              {STATUS_NOTE[entry.status] ? (
                <span className="text-[var(--accent-clay-text)]">
                  {" "}
                  · {STATUS_NOTE[entry.status]}
                </span>
              ) : null}
            </span>
          </div>

          <p className="mt-3 max-w-[48ch] text-pretty text-[1.05rem] leading-[1.6] text-[color:rgba(11,31,58,0.7)]">
            {entry.summary}
          </p>

          {/* The line that decides whether this is worth an afternoon. */}
          <p className="mt-3 max-w-[52ch] text-pretty text-[0.95rem] leading-[1.6] text-[color:rgba(11,31,58,0.62)]">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
              When
            </span>{" "}
            {entry.when}
          </p>

          {/* ---- the two promises ---- */}
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
            {entry.link?.download ? (
              <a
                href={entry.link.href}
                download
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline-strong)] px-5 py-2.5 text-[0.92rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
              >
                <Download className="h-3.5 w-3.5" />
                {entry.link.label}
              </a>
            ) : null}

            <Link
              href={href}
              className="group/read inline-flex items-center gap-2 border-b border-[var(--hairline-strong)] pb-1 text-[0.92rem] text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
            >
              {entry.kind === "skill" ? "What it does" : "Read it"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export function MaterialList({ folder }: { folder: MaterialFolder }) {
  return (
    <ul className="list-none border-t border-[var(--hairline)]">
      {folder.entries.map((entry) => (
        <Row key={entry.slug} folder={folder} entry={entry} />
      ))}
    </ul>
  );
}
