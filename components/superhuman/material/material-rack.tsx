import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DownloadGate } from "./download-gate";
import { levelOf } from "@/lib/membership/tiers";
import { PRODUCTS, type Product } from "@/lib/shop/products";
import { Specimen } from "./specimens";
import { entryHref, isNew } from "./material-data";
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

/**
 * A PAID SKILL'S PILL SAYS WHAT A MEMBER PAYS, NOT THE PRICE (Tobia, 2026-11-04: "it should say free if on Pro,
 * free if on Ultimate. Otherwise, in small text, $5, $10"). The price is in the foot, small. The pill goes to the
 * skill's page, where the buying happens: a checkout from a card skipped the page that sells it.
 */
function memberLine(product: Product): string {
  switch (levelOf(product)) {
    case "premium":
      return "Free with Pro";
    case "exclusive":
      return "Ultimate only";
    case "unique":
      return product.memberPrice?.ultimate === 0 ? "Free with Ultimate" : "Less with Pro";
  }
}

const PILL =
  "group/get inline-flex items-center gap-2.5 rounded-full bg-[var(--accent-clay-text)] px-5 py-2.5 text-[0.95rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]";

function Column({ folder, entry }: { folder: MaterialFolder; entry: MaterialEntry }) {
  const href = entryHref(folder.id, entry.slug);
  const download = entry.link?.download ? entry.link : undefined;
  // A skill with a price: the pill buys instead of downloading.
  const product = entry.product ? PRODUCTS[entry.product] : undefined;
  const fresh = folder.id === "skills" && isNew(entry.slug);

  return (
    <li className="flex flex-col border-b border-r border-[var(--hairline)] bg-[var(--paper)] p-6 md:p-8">
      {/* ---- the mark and the title, as one target ---- */}
      <Link
        href={href}
        className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
      >
        <div className="relative">
          <Specimen
            id={entry.slug}
            className="h-auto w-full transition-transform duration-[600ms] ease-out group-hover:-translate-y-1.5"
          />
          {fresh ? (
            <span className="absolute left-0 top-0 rounded-full bg-[var(--accent-clay-text)] px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--paper)]">
              New
            </span>
          ) : null}
        </div>

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
          {product ? (
            <>
              {/* Free or paid, the pill goes to the product page, from its top (its hero has the button). Jumping
                  straight to a form or a checkout landed people on something they hadn't seen yet. */}
              <Link href={href} className={PILL}>
                {product.free ? (product.onPage ? "Try it" : "Get it free") : memberLine(product)}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/get:translate-x-0.5" />
              </Link>
              <Link
                href={href}
                className="group/read relative inline-flex items-center after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] gap-1.5 border-b border-[var(--hairline-strong)] pb-1 text-[0.9rem] text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                What it does
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
              </Link>
            </>
          ) : download ? (
            <>
              <DownloadGate
                href={download.href}
                label="Download"
                title={entry.title}
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline-strong)] px-5 py-2.5 text-[0.9rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
              />

              <Link
                href={href}
                className="group/read relative inline-flex items-center after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] gap-1.5 border-b border-[var(--hairline-strong)] pb-1 text-[0.9rem] text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                What it does
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <Link
              href={href}
              className="group/read relative inline-flex items-center after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] gap-2.5 rounded-full border border-[var(--hairline-strong)] px-5 py-2.5 text-[0.9rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
            >
              Read it
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
            </Link>
          )}
        </div>

        <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
          {product && !product.onPage ? (product.free ? "Free · " : `Or ${product.priceLabel} once · `) : ""}
          {entry.kind === "guide" && product ? "PDF" : `${entry.minutes} min`} · {entry.level}
        </p>
      </div>
    </li>
  );
}

export function MaterialRack({ folder }: { folder: MaterialFolder }) {
  return (
    // ROWS OF THREE, and a fourth starts the next row on its own. The rules
    // are drawn per cell (each draws its right and bottom, the list its left
    // and top) rather than as gaps over a ruled ground, so a short last row
    // ends at its last cell instead of leaving grey blocks where cells are not.
    <ul className="grid list-none grid-cols-1 border-l border-t border-[var(--hairline)] md:grid-cols-3">
      {folder.entries.map((entry) => (
        <Column key={entry.slug} folder={folder} entry={entry} />
      ))}
    </ul>
  );
}
