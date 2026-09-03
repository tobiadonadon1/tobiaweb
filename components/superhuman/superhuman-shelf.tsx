import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { Specimen } from "./material/specimens";
import { HandNote } from "@/components/ui/hand-note";
import { Reveal } from "./reveal";
import { ShelfLockedCard } from "./shelf-locked-card";
import { SHELF, shelfHref, type ShelfFamily } from "./shelf-data";
import { SECTION_LABELS } from "./sections";

/**
 * THE SHELF.
 *
 * THE BAND IS BACK, AND IT IS NOT THE OLD ONE. The first version of this page
 * ran the catalogue on navy under a 300px cyan star that exploded on scroll.
 * That went, and with it went the page's only dark stretch, which I said at
 * the time was a real loss of rhythm and the right trade. Tobia, looking at
 * the result: "you can change the color of the background for a section."
 *
 * So the ink is back and the cyan is not. A dark ground was never the problem
 * with that section; a glowing tech blue on top of it was. Cut paper on a dark
 * field is the oldest trick in the collage book and it is the one thing on
 * this page that changes register, which is exactly what a catalogue sitting
 * between a claim and a person should do.
 *
 * NO RULES BETWEEN THE COLUMNS. They were hairlines on a `gap-px` ground,
 * which drew a grid, and a grid around three cut paper marks is a filing
 * cabinet around three paintings. "You can remove the lines." The columns hold
 * together on alignment and rhythm now, which is how a printed page does it.
 *
 * INK IS `currentColor` INSIDE THE MARKS. Each family's composition has one
 * shape in the darkest tone, and on this ground that shape has to become the
 * lightest one instead. Setting the colour on the column and letting the mark
 * inherit means one class does it, rather than a second set of drawings for a
 * second ground.
 *
 * THE ENTRANCE IS AN OBSERVER AND A CLASS (see reveal.tsx). The marks arrive a
 * beat after the words and land slightly turned, because cut paper is put down
 * by a hand and a hand does not put it down square.
 *
 * ONLY ONE OF THE THREE IS A LINK. Material opens; Masterclass and Design are
 * buttons that shake and say "Now locked" (see shelf-locked-card.tsx). The
 * branch is on `family.open`, never on `tier`, because "paid" and "locked" are
 * both closed doors and this file should not have to know the difference.
 */

/**
 * Everything under the drawing. Shared by both card shapes on purpose: the open
 * one and the closed one differ by a link, a CTA and a chip, and that is not
 * enough to justify two copies of a heading.
 */
function CardText({ family }: { family: ShelfFamily }) {
  return (
    <>
      {/* A CHIP ONLY WHERE IT CHANGES WHAT YOU CAN DO. There were three once,
          which turned three doors into a pricing table; then one, when only
          Masterclass was shut. Now two doors are shut and both say so. */}
      <div className="mt-7 flex items-baseline gap-3">
        <h3 className="font-serif text-[clamp(1.5rem,2.6vw,1.95rem)] leading-none tracking-[-0.03em] text-[var(--paper)]">
          {family.name}
        </h3>
        {!family.open ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(207,233,238,0.34)] px-2.5 py-1 font-mono text-[0.64rem] uppercase leading-none tracking-[0.14em] text-[color:rgba(214,238,244,0.72)]">
            <Lock aria-hidden className="h-3 w-3" />
            {family.tag}
          </span>
        ) : null}
      </div>

      <p className="mt-3 max-w-[28ch] text-pretty text-[1rem] leading-[1.58] text-[color:rgba(214,238,244,0.78)]">
        {family.line}
      </p>

      {/* Pins the way in to the foot of every column, so three columns of
          unequal sentences still line their doors up. */}
      <span aria-hidden className="grow" />

      {family.cta ? (
        <span className="mt-7 inline-flex items-center gap-1.5 text-[0.95rem] text-[color:rgba(214,238,244,0.78)] transition-colors duration-[600ms] ease-out group-hover:text-[var(--paper)]">
          {family.cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </>
  );
}

function Family({ family, index }: { family: ShelfFamily; index: number }) {
  // The drawing lifts on hover whether or not the door opens: a card that goes
  // dead to the touch reads as broken, and this one has something to say.
  const mark = (
    <Specimen
      id={`family-${family.id}`}
      className="h-auto w-full transition-transform duration-[600ms] ease-out group-hover:-translate-y-1.5"
    />
  );

  return (
    <li>
      <Reveal delay={index * 110} className="h-full">
        {family.open ? (
          <Link
            href={shelfHref(family.id)}
            className="group flex h-full flex-col rounded-sm p-2 text-[var(--paper)] transition-colors duration-[600ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
          >
            {mark}
            <CardText family={family} />
          </Link>
        ) : (
          <ShelfLockedCard mark={mark} body={<CardText family={family} />} />
        )}
      </Reveal>
    </li>
  );
}

export function SuperhumanShelf() {
  return (
    <section id="shelf" data-sh-section={SECTION_LABELS.shelf} className="relative">
      <div className="ink-grain relative bg-[var(--ink)]">
        {/* Both edges melt. An ink band that cuts is a stripe; one that melts
            is a chapter. */}
        <span aria-hidden className="melt-to-paper-t" />

        {/* Where the ground is solidly ink. The compass watches this to decide
            whether to draw itself in paper tones or ink ones. */}
        <span
          aria-hidden
          data-sh-ink
          className="pointer-events-none absolute inset-x-0 bottom-[14vh] top-[14vh]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-36 md:py-44">
          <Reveal>
            <h2 className="max-w-[16ch] font-serif text-[clamp(2.25rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-0.03em] text-[var(--paper)]">
              On the shelf.
            </h2>
          </Reveal>

          {/* Three doors and only one of them opens today, so the hand says
              which. It sits over the first column at every width because
              Material is first in the array, not because anything is
              positioned by hand. */}
          <HandNote
            gesture="down"
            label="this one is free"
            color="var(--m-gold, #e8a41f)"
            size={92}
            className="mt-10 hidden flex-col items-start gap-0.5 md:mt-12 md:flex md:w-1/3"
            labelClassName="-rotate-2"
          />

          <ul className="mt-6 grid list-none grid-cols-1 gap-x-12 gap-y-20 md:mt-4 md:grid-cols-3">
            {SHELF.map((family, i) => (
              <Family key={family.id} family={family} index={i} />
            ))}
          </ul>
        </div>

        <span aria-hidden className="melt-to-paper-b" />
      </div>
    </section>
  );
}
