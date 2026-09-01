import Link from "next/link";
import { Lock } from "lucide-react";
import { SHELF, shelfHref, type ShelfId } from "./shelf-data";

/**
 * THE TWO PIECES EVERY SHELF PAGE SHARES.
 *
 * Material outgrew the generic list page (it has a room of its own now, see
 * material/material-room.tsx) and the moment there were two page shapes under
 * /projects/construct there were two copies of the head and two copies of
 * the footer nav. This file is what stops that: the ink head and the rest-of-
 * the-shelf nav live here once, and both page shapes call them.
 *
 * The head is deliberately dumb — it takes strings, not a family — because
 * the room's head says something a family object cannot ("34 pieces, 28
 * finished"), and a component that grows a second mode for one caller is how
 * shared components stop being shared.
 */

export function ShelfHead({
  title,
  lede,
  status,
  locked,
  tag,
}: {
  title: string;
  lede: string;
  /** The one honest line under the chip. Concrete, never a promise. */
  status: string;
  /** Only the locked family gets a chip; everywhere else the status carries. */
  locked?: boolean;
  tag?: string;
}) {
  return (
    <header className="ink-grain relative flex min-h-[62svh] items-end bg-[var(--ink)] pb-[22vh] pt-[26vh]">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="flex items-center gap-3">
          {locked && tag ? (
            <span className="inline-flex items-center gap-1.5 border border-[rgba(207,233,238,0.3)] px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.62)]">
              <Lock aria-hidden className="h-3 w-3" />
              {tag}
            </span>
          ) : null}
          <span className="text-[0.9rem] text-[color:rgba(214,238,244,0.55)]">
            {status}
          </span>
        </div>

        <h1 className="mt-7 font-serif text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--paper)]">
          {title}
        </h1>

        <p className="mt-6 max-w-[34ch] text-pretty text-[1.2rem] leading-[1.5] text-[color:rgba(214,238,244,0.86)] md:text-[1.4rem]">
          {lede}
        </p>
      </div>

      {/* The one place the ink lets go. */}
      <span aria-hidden className="melt-to-paper-b" />
    </header>
  );
}

/** The other two families, at the foot of whichever one you are in. */
export function ShelfRest({ currentId }: { currentId: ShelfId }) {
  const others = SHELF.filter((f) => f.id !== currentId);

  return (
    <nav
      aria-label="The rest of the shelf"
      className="mt-20 border-t border-[var(--hairline)] pt-8 md:mt-28"
    >
      <ul className="flex flex-wrap gap-x-10 gap-y-4">
        {others.map((other) => (
          <li key={other.id}>
            <Link
              href={shelfHref(other.id)}
              className="group inline-flex items-baseline gap-2 text-[1.05rem] text-[color:rgba(11,31,58,0.6)] transition-colors hover:text-[var(--ink)]"
            >
              {other.name}
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.38)]">
                {other.tag}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
