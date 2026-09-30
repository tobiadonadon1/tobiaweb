"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";

import { WhyMeMascot } from "./why-me-mascot";

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
 * THE EMPLOYER, DESCRIBED BUT NOT NAMED. Tobia's call: the card should say
 * what kind of company it is, without the name, in one sentence with its own
 * verb and no label above it. It claims nothing that needs a number to back it.
 */

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
function Fact({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  // On a phone the two facts sit side by side at half width, so the unit is
  // set small next to the numeral rather than at numeral size, where "2.5 yrs"
  // would not fit the card.
  return (
    <motion.article
      variants={item}
      data-mascot-step
      className="flex h-full flex-col overflow-hidden rounded-[24px] border p-5 md:p-7"
      style={CARD_STYLE}
    >
      <span className="whitespace-nowrap font-serif text-[3.75rem] leading-[0.85] tracking-tight text-accent-clay max-[379px]:text-[3rem] md:text-[5.5rem]">
        {value}
        {unit && (
          <span className="ml-1.5 text-[1.6rem] tracking-normal max-[379px]:ml-1 max-[379px]:text-[1.25rem] md:ml-[0.25em] md:text-[5.5rem] md:tracking-tight">
            {unit}
          </span>
        )}
      </span>
      <p className="mt-auto max-w-[26ch] text-pretty pt-5 text-[0.88rem] leading-[1.45] text-black/60 md:pt-6 md:text-[0.95rem] md:leading-[1.5]">
        {label}
      </p>
    </motion.article>
  );
}

export function WhyMeSection() {
  /**
   * The grid is the mascot's stage. He measures every `data-mascot-step` card
   * inside it, groups them into rows, and walks their top edges: across the
   * top row, down to the next, and back up the ladder from the bottom one. So
   * this has to be the positioned ancestor he is placed against, and which
   * cards carry the attribute is what shapes his route. See why-me-mascot.tsx.
   */
  const stage = useRef<HTMLDivElement>(null);

  return (
    <section id="proof" className="paper-bg relative">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        {/* Masthead. The heading used to be "What sets the work apart", which
            asks the reader to agree there IS something apart before anything
            has been shown. This one states the claim the facts then prove. */}
        <div className="mb-12 text-center md:mb-14">
          {/* No kicker. "Why me" between two rules announced the argument
              before making it, and the heading already is the argument. */}
          {/* The question every reader has here is "you are twenty-one, why
              listen?". "Longer than you would guess" answered it in a riddle.
              This names the objection and turns it in three words; the cards
              below are the proof. */}
          <h2 className="text-balance font-serif text-[2.6rem] leading-none tracking-tight text-[#0a0a0a] md:text-5xl">
            Young. Not new.
          </h2>
        </div>

        <motion.div
          ref={stage}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12%" }}
          // Two columns on a phone, not one: the two facts sit side by side
          // there, which keeps the stack short and leaves the little man a gap
          // to hop.
          className="relative grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          <WhyMeMascot scope={stage} />

          {/* Tall left, on ink: the day job, described, and the standard
              that comes with it. It used to be a paragraph claiming
              proximity to "the brightest minds in the room", which is
              unverifiable, immodest, and the exact thing the voice forbids. */}
          <motion.article
            variants={item}
            data-mascot-step
            className="relative col-span-2 flex flex-col overflow-hidden rounded-[24px] border border-[color:var(--hairline-on-ink)] bg-ink p-7 md:col-span-1 md:row-span-2 md:p-10"
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
              {/* No "Day job" label over it any more (Tobia: it does not need
                  one). The sentence carries its own verb instead, so it reads
                  as something he is doing now. Set at the size of the
                  neighbouring card's heading, not the size of the numbers: a
                  sentence at number size filled the whole card. */}
              <h3 className="max-w-[20ch] text-balance font-serif text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.12] tracking-[-0.03em] text-[#faf8f2]">
                I am working at one of the{" "}
                <span className="text-[#7dd3fc]">most important</span>{" "}
                networking companies in the&nbsp;world.
              </h3>
              <p className="mt-auto max-w-sm pt-8 text-pretty text-base leading-relaxed text-[#cfe9ee]/75 md:text-lg">
                Full time, on systems real teams depend on. My own work is held
                to the same standard.
              </p>
            </div>
          </motion.article>

          {/* The two facts, at the top right, in the biggest type here. */}
          <Fact
            value="15"
            label="The age I started my first agency, with paying clients."
          />
          <Fact
            value="2.5"
            unit="yrs"
            label="To finish my degree in the US."
          />

          {/* What the day job actually buys the reader. This replaces the
              "Built across many fronts / the range is the point" card, which
              said nothing the Projects section above had not already shown. */}
          <motion.article
            variants={item}
            data-mascot-step
            className={`${CARD} col-span-2 md:p-9`}
            style={CARD_STYLE}
          >
            {/* This was a kicker, a 2xl heading and a 14px paragraph, all
                competing at the same weight. One claim, set at the size of a
                claim, and the qualifier tucked under it. */}
            <h3 className="max-w-[20ch] text-balance font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1] tracking-tight text-[#0a0a0a]">
              I use it before I write it down.
            </h3>
            <p className="mt-4 max-w-[46ch] text-pretty text-[1.05rem] leading-relaxed text-black/60">
              Nothing here is theory I read somewhere. It is what I actually
              run, including the parts that broke.
            </p>
          </motion.article>

          {/* The counterweight, full width, last. Nobody else has one of these,
              and it is what makes every fact above it land. */}
          <motion.article
            variants={item}
            data-mascot-step
            className={`${CARD} col-span-2 md:col-span-3 md:p-9`}
            style={CARD_STYLE}
          >
            {/* No kicker. "Straight up" was a label announcing that honesty
                was about to happen, which is weaker than just being honest.
                Same treatment as the card beside it: the claim at claim size,
                the qualifier under it. */}
            {/* Admission alone costs credibility; admission then reframe buys
                it (docs COPY-RULES, rule 5). So the list of what is missing
                now ends on what the reader gets instead, and "yet" turns
                the heading from a confession into a direction. */}
            <h3 className="max-w-[24ch] text-balance font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1] tracking-tight text-[#0a0a0a]">
              What I am not, yet.
            </h3>
            <p className="mt-4 max-w-[62ch] text-pretty text-[1.05rem] leading-relaxed text-black/60">
              I have not run a large team. The book is not finished. Myynd has
              no customers yet. If you need twenty years of experience, that is
              not me. If you need something built this week, and a straight
              answer on how it went, it is.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
