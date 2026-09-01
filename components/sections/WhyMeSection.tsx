"use client";

import { motion, type Variants } from "motion/react";

/**
 * "Why me" — the credibility beat, sitting between Projects and Thoughts.
 *
 * It answers the one question a reader has at exactly this point: "fine, but
 * why you, you are twenty." The previous version answered it with adjectives
 * ("some of the brightest minds in the room", "the range is the point"), gave
 * its largest card to its vaguest claim, and repeated the Projects section in
 * a strip of chips. All three are gone.
 *
 * What it does instead: states the two facts flat, in the biggest type on the
 * page, and lets the reader be the one who is impressed. At twenty that is the
 * only version of this argument that works, because a fact cannot be argued
 * with and an adjective invites it.
 *
 * The last card says what he is NOT. It is the most on-brand element here and
 * it is what makes everything above it believable.
 */

/**
 * TODO(tobia): put the employer's name here, e.g. `const EMPLOYER = "Acme";`
 *
 * Left as null the copy falls back to an unnamed but honest sentence, so the
 * page NEVER renders a visible placeholder and never has to be shipped with
 * one. Naming it is the single biggest credibility gain available in this
 * section: "a major company" twice, unnamed, reads as either an NDA or an
 * exaggeration and the reader cannot tell which.
 */
const EMPLOYER: string | null = null;

const GLASS_BG =
  "linear-gradient(145deg, rgba(253,252,249,0.9), rgba(247,245,239,0.7))";
const GLASS_SHADOW =
  "0 14px 36px rgba(28,24,14,0.09), inset 0 1px 0 rgba(255,255,255,0.7)";
const INK_GRID =
  "linear-gradient(to right, rgba(207,233,238,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(207,233,238,0.10) 1px, transparent 1px)";
const GRID_MASK =
  "radial-gradient(ellipse 80% 60% at 28% 0%, #000 58%, transparent 112%)";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const CARD =
  "flex h-full flex-col overflow-hidden rounded-[24px] border p-6 md:p-7";
const CARD_STYLE = {
  background: GLASS_BG,
  borderColor: "rgba(30,26,14,0.08)",
  boxShadow: GLASS_SHADOW,
} as const;

/**
 * A fact. The numeral is the argument, so it is the largest type in the
 * section by a wide margin, and the sentence under it stays lowercase mono so
 * it reads as a caption rather than as a competing claim.
 */
function Fact({ value, label }: { value: string; label: string }) {
  return (
    <motion.article variants={item} className={CARD} style={CARD_STYLE}>
      <span className="font-serif text-[4.5rem] leading-[0.85] tracking-tight text-accent-clay md:text-[5.5rem]">
        {value}
      </span>
      <p className="mt-auto max-w-[26ch] pt-6 text-[0.95rem] leading-[1.5] text-black/60">
        {label}
      </p>
    </motion.article>
  );
}

export function WhyMeSection() {
  return (
    <section id="proof" className="paper-bg relative">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        {/* Masthead. The heading used to be "What sets the work apart", which
            asks the reader to agree there IS something apart before anything
            has been shown. This one states the claim the facts then prove. */}
        <div className="mb-14 text-center">
          <div className="mx-auto flex max-w-md items-center gap-4">
            <span className="h-px flex-1 bg-black/10" />
            <span className="text-[0.85rem] text-[color:rgba(11,31,58,0.5)]">
              Why me
            </span>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <h2 className="mt-6 font-serif text-4xl tracking-tight text-[#0a0a0a] md:text-5xl">
            Longer than you would guess.
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12%" }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Tall left, on ink: where he sits, and the standard that comes
              with it. Two sentences. It used to be a paragraph claiming
              proximity to "the brightest minds in the room", which is
              unverifiable, immodest, and the exact thing the voice forbids. */}
          <motion.article
            variants={item}
            className="relative flex flex-col overflow-hidden rounded-[24px] border border-[color:var(--hairline-on-ink)] bg-ink p-8 md:col-span-1 md:row-span-2 md:p-10"
            style={{
              boxShadow:
                "0 24px 60px rgba(8,18,34,0.35), inset 0 1px 0 rgba(207,233,238,0.06)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: INK_GRID,
                backgroundSize: "46px 52px",
                maskImage: GRID_MASK,
                WebkitMaskImage: GRID_MASK,
              }}
            />
            <div className="relative flex h-full flex-col">
              <span className="text-[0.85rem] text-[#7dd3fc]/85">
                Where I sit
              </span>
              <h3 className="mt-6 max-w-sm font-serif text-3xl leading-[1.05] tracking-tight text-[#faf8f2] md:text-4xl">
                This is the job, not the side project.
              </h3>
              <p className="mt-6 max-w-sm text-pretty text-base leading-relaxed text-[#cfe9ee]/75 md:text-lg">
                {EMPLOYER
                  ? `I do this full time at ${EMPLOYER}.`
                  : "I do this full time, for a company, on systems real teams depend on."}{" "}
                That standard is the one I hold my own work to.
              </p>
            </div>
          </motion.article>

          {/* The two facts, at the top right, in the biggest type here. */}
          <Fact
            value="15"
            label="age I started my first agency, with real, paying clients."
          />
          <Fact
            value="2.5 yrs"
            label="to finish a degree in the US."
          />

          {/* What the day job actually buys the reader. This replaces the
              "Built across many fronts / the range is the point" card, which
              said nothing the Projects section above had not already shown. */}
          <motion.article
            variants={item}
            className={`${CARD} md:col-span-2 md:p-9`}
            style={CARD_STYLE}
          >
            {/* This was a kicker, a 2xl heading and a 14px paragraph, all
                competing at the same weight. One claim, set at the size of a
                claim, and the qualifier tucked under it. */}
            <h3 className="max-w-[20ch] font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1] tracking-tight text-[#0a0a0a]">
              I use it before I write it down.
            </h3>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-black/60">
              Nothing here is theory I read somewhere. It is what I run,
              including the parts that went wrong.
            </p>
          </motion.article>

          {/* The counterweight, full width, last. Nobody else has one of these,
              and it is what makes every fact above it land. */}
          <motion.article
            variants={item}
            className={`${CARD} md:col-span-3 md:p-9`}
            style={CARD_STYLE}
          >
            {/* No kicker. "Straight up" was a label announcing that honesty
                was about to happen, which is weaker than just being honest.
                Same treatment as the card beside it: the claim at claim size,
                the qualifier under it. */}
            <h3 className="max-w-[24ch] font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1] tracking-tight text-[#0a0a0a]">
              And what I am not.
            </h3>
            <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed text-black/60">
              I have not run a large team. The book is not finished. Myynd has
              no customers yet. If you want someone with twenty years behind
              them, that is not me.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
