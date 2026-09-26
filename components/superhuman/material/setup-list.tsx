import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, priceText } from "@/lib/shop/products";
import { Specimen } from "./specimens";
import { entryHref } from "./material-data";
import type { MaterialFolder } from "./material-types";

/**
 * THE SETUPS FOLDER'S CONTENTS.
 *
 * Neither the rack nor the list. A rack is three columns you choose between,
 * and a list row is a headline and a link; a setup is a thing with a price,
 * and one of them should not sit in a three-column rack looking like two
 * thirds of the page is missing. So each setup gets a wide card: the mark
 * large on one side, and the name, the line, the price and the way in on the
 * other. The whole card is one link, to the product's own page, where the
 * buying happens.
 */
export function SetupList({ folder }: { folder: MaterialFolder }) {
  return (
    <ul className="grid list-none grid-cols-1 gap-px border border-[var(--hairline)] bg-[var(--hairline)]">
      {folder.entries.map((entry) => {
        const product = entry.product ? PRODUCTS[entry.product] : undefined;
        return (
          <li key={entry.slug} className="bg-[var(--paper)]">
            <Link
              href={entryHref(folder.id, entry.slug)}
              className="group grid grid-cols-1 items-center gap-8 p-6 transition-colors duration-[600ms] ease-out hover:bg-[rgba(206,70,49,0.035)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent-clay)] md:grid-cols-[1fr_1.1fr] md:gap-12 md:p-10"
            >
              <Specimen
                id={entry.slug}
                className="h-auto w-full max-w-[420px] justify-self-center transition-transform duration-[600ms] ease-out group-hover:-translate-y-1.5"
              />

              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  Setup · {entry.minutes} min to set up
                  {product ? ` · ${priceText(product)}` : ""}
                </p>
                <h2 className="mt-4 font-serif text-[clamp(2rem,4.4vw,3.1rem)] leading-[1] tracking-[-0.035em] text-[var(--ink)] transition-colors duration-[600ms] ease-out group-hover:text-[var(--accent-clay)]">
                  {entry.title}
                </h2>
                <p className="mt-4 max-w-[40ch] text-pretty text-[1.08rem] leading-[1.6] text-[color:rgba(11,31,58,0.72)]">
                  {entry.summary}
                </p>
                <p className="mt-3 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.6] text-[color:rgba(11,31,58,0.62)]">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em]">When</span>{" "}
                  {entry.when}
                </p>

                <span className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[var(--accent-clay-text)] px-6 py-3 text-[0.95rem] text-[var(--paper)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  {product ? `See it · ${priceText(product)}` : "See it"}
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
