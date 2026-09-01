import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { ShelfSignup } from "./shelf-signup";
import { ShelfHead, ShelfRest } from "./shelf-chrome";
import {
  type ShelfFamily,
  type ShelfItem,
  type ShelfItemKind,
} from "./shelf-data";

/**
 * ONE PAGE, THREE FAMILIES, NO PAGE CODE PER FAMILY.
 *
 * This is the whole of what a shelf family's route renders. A family is
 * described in shelf-data.ts and appears here; there is no per-family
 * template to write, and there never should be. When Material has fifteen
 * guides in it and Design has four templates, the work is pushing objects
 * into `page.items` — not building a fourth page that drifts out of step
 * with the other three.
 *
 * WHAT IS DELIBERATELY NOT HERE YET. No prices, no counts, no "coming soon"
 * badges, no fake list of contents. The page renders whatever is in `items`,
 * and when `items` is empty it says so in the family's own words and offers
 * the one thing that is real: an address to write to. That is the same rule
 * the shelf has always run on, moved down a level.
 *
 * THE GROUND. Ink at the top, so opening a card feels like going further
 * into the shelf rather than leaving it, then one melt to paper for the
 * reading. Same two grounds as the parent page, in the same order. The head
 * and the footer nav come from shelf-chrome.tsx, which Material's room shares
 * — two page shapes under this route, one head between them.
 *
 * MATERIAL NO LONGER COMES THROUGH HERE. It has enough in it to need a room
 * of its own (material/material-room.tsx); this renders Masterclass and
 * Design, both of which are still a lede and a list.
 */

/** What each kind is called in the open, so a row never needs a legend. */
const KIND_LABEL: Record<ShelfItemKind, string> = {
  guide: "Guide",
  video: "Video",
  skill: "Skill",
  tool: "Tool",
  masterclass: "Class",
  template: "Template",
};

/**
 * One row of contents. It renders as a link only when there is somewhere to
 * go: an item with no `href`, or one marked `locked`, draws as plain type
 * with a lock, because a link that does nothing is worse than no link.
 */
function Row({ item }: { item: ShelfItem }) {
  const openable = Boolean(item.href) && !item.locked;

  const body = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
          {KIND_LABEL[item.kind]}
        </span>
        <h3 className="font-serif text-[1.35rem] leading-tight tracking-tight text-[var(--ink)] md:text-[1.55rem]">
          {item.title}
        </h3>
        {item.minutes ? (
          <span className="text-[0.85rem] text-[color:rgba(11,31,58,0.45)]">
            {item.minutes} min
          </span>
        ) : null}
      </div>

      <p className="mt-2 max-w-[62ch] text-[1rem] leading-[1.6] text-[color:rgba(11,31,58,0.66)]">
        {item.summary}
        {item.referral ? (
          <span className="text-[color:rgba(11,31,58,0.45)]"> Referral link.</span>
        ) : null}
      </p>
    </>
  );

  return (
    <li className="py-6">
      {openable ? (
        <Link
          href={item.href as string}
          className="group flex items-start justify-between gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-sky)]"
        >
          <span className="block">{body}</span>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-sky)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div className="flex items-start justify-between gap-6 opacity-70">
          <div>{body}</div>
          <Lock
            aria-label="Not open yet"
            className="mt-1 h-4 w-4 shrink-0 text-[color:rgba(11,31,58,0.4)]"
          />
        </div>
      )}
    </li>
  );
}

export function ShelfPage({ family }: { family: ShelfFamily }) {
  const { page } = family;
  const hasReferral = page.items.some((item) => item.referral);

  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/superhuman#shelf" label="The shelf" tone="ink" />

      <ShelfHead
        title={family.name}
        lede={page.lede}
        status={family.status}
        locked={family.tier === "locked"}
        tag={family.tag}
      />

      {/* ---------------------------------------------------------------- *
       * THE READING.
       * ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-4 md:pb-32">
        <div className="max-w-[62ch] space-y-6">
          {page.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-pretty text-[1.08rem] leading-[1.7] text-[color:rgba(11,31,58,0.78)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* ---- what is actually in here ---- */}
        <div className="mt-16 md:mt-20">
          {page.items.length > 0 ? (
            <>
              <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
                Inside
              </h2>
              <ul className="editorial-index mt-4 list-none">
                {page.items.map((item) => (
                  <Row key={item.slug} item={item} />
                ))}
              </ul>

              {/* Printed by the shell, not by a page, so no family can carry
                  a paid link without the disclosure appearing under it. */}
              {hasReferral ? (
                <p className="mt-8 max-w-[62ch] text-[0.9rem] leading-relaxed text-[color:rgba(11,31,58,0.5)]">
                  Some tool links here pay me if you sign up. They are the same
                  tools I would name if they did not, and nothing is listed
                  because it pays.
                </p>
              ) : null}
            </>
          ) : (
            <div className="border-t border-[var(--hairline)] pt-10">
              <p className="max-w-[54ch] text-pretty text-[1.08rem] leading-[1.7] text-[color:rgba(11,31,58,0.7)]">
                {page.empty}
              </p>

              <div className="mt-8">
                <ShelfSignup
                  tone="paper"
                  id={family.id}
                  name={family.name}
                  cta={
                    family.tier === "free"
                      ? "Tell me when it opens"
                      : family.cta
                  }
                  subject={family.subject}
                />
              </div>
            </div>
          )}
        </div>

        {/* ---- where it will really transact, when it does ---- */}
        {page.external ? (
          <a
            href={page.external.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-14 inline-flex items-center gap-2.5 bg-[var(--ink)] px-7 py-4 text-[0.95rem] text-[var(--paper)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            {page.external.label}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}

        <ShelfRest currentId={family.id} />

      </section>
    </main>
  );
}
