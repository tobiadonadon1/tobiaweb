import Image from "next/image";
import Link from "next/link";
import { FooterReveal } from "@/components/sections/footer-reveal";

/**
 * THE LAST PAGE.
 *
 * It does not scroll up into view like the rest of the site. It is already
 * there, pinned to the bottom of the viewport underneath everything, and the
 * page slides UP OFF it as you reach the end. So the site does not finish with
 * one more block of content; it finishes by getting out of the way and showing
 * you what was behind it the whole time. That mechanism is two rules and no
 * JavaScript: this footer is `fixed` at z-0, and `.site-content` is `relative`,
 * z-10, opaque, and carries a bottom padding on body exactly `--footer-h` tall.
 *
 * WHAT CHANGED, AND WHY. The last version was a torn-paper COLLAGE on the same
 * paper as every other section: four cut-out link patches, five flecks of
 * colour, a drawn arrow and the name at display size. It was busy, it was the
 * same ground as the page above it, and it ended the site on a NAME — which is
 * the one thing a reader already knows by then and the least interesting thing
 * this site has to say.
 *
 * Tobia sent a reference (Set Space) and named exactly what he wanted from it:
 * "I like this footer because it's bright. I like the font, but we can use
 * ours. That little star at the bottom, just put it as our logo. I like this
 * color. I like the spacing." And then the real brief: a message that UNITES
 * the site — "not cocky, short, direct, simple, humble" — and his links, plain.
 *
 * SO THE LAST PAGE IS NOW A POSTER, and everything on it is doing one of two
 * jobs: saying the one thing, or getting out of the way.
 *
 *   1. A FULL-BLEED HOT GROUND. The whole footer is one flat colour, so the
 *      moment it appears from under the paper is the loudest moment on the
 *      site. It is the only place this colour is used; it cannot dilute.
 *   2. ONE SENTENCE, SPLIT TO THE EDGES. "Keep" at the far left, "thinking."
 *      at the far right, the way the reference splits its own name. It is a
 *      sentence you finish by reading across the whole page.
 *   3. THE MESSAGE, in one short paragraph, first person, admitting it is
 *      unfinished — see MESSAGE below for why it says what it says.
 *   4. THE LINKS, as three plain columns. No patches, no tilt, no drawing.
 *   5. THE LOGO SIGNS IT, small, bottom right, exactly where the reference
 *      puts its own star. It is the only image left on the page.
 *
 * EVERY ANIMATION HERE IS `--reveal`, AND NONE OF IT IS JAVASCRIPT.
 * footer-reveal.tsx already writes `--reveal` (0 to 1) across the last screen
 * of scroll. Rather than switching things on at a threshold, every moving part
 * reads it directly through calc(): the two halves of the sentence arrive from
 * their own edges, the rule draws itself left to right, the message and the
 * columns rise on a stagger, and the logo lands last. The whole poster
 * assembles under your thumb as you pull the page off it, and runs backwards
 * if you scroll back up. See `.footer-*` in globals.css.
 */

/**
 * THE SENTENCE.
 *
 * The brief was "maybe it shouldn't be my name — maybe curiosity, something
 * like that", and the test was whether one line could carry BOTH halves of
 * this site: the building (Construct, Myynd, the tools) and the human part
 * (the book, the essays, awareness).
 *
 * It reads across the footer: KEEP … THINKING. That is the site's own
 * argument, in two words. "You are replaceable. Your thinking is not." is an
 * essay here. "I create to understand" is an identity beat. "Deciding what is
 * worth doing" is what the whole Construct shelf is for. And it is an
 * invitation rather than a boast: it asks nothing of the reader except the one
 * thing this site believes is still theirs.
 *
 * Two words, so the split to the page edges has something to split.
 */
const WORD_LEFT = "Keep";
const WORD_RIGHT = "thinking.";

/**
 * THE MESSAGE.
 *
 * Three sentences, and each one is load-bearing:
 *
 *   "The tools keep getting better at doing."  — the premise the whole
 *     Construct chapter runs on, stated as a fact rather than a warning.
 *   "Deciding what is worth doing, and why, is the part that stays human."
 *     — the bridge. It is the one line that makes the AI work and the writing
 *     about consciousness the same subject instead of two hobbies.
 *   "So I build things, write about minds, and leave what I learn here, still
 *     working it out in public."  — what the site IS, in the order the site is
 *     in, ending on the admission. The site's own title is "figuring it out in
 *     public"; this is that promise kept at the bottom of the page.
 *
 * NO DASH IN IT. The last clause was hung off an em dash, which is the punctu-
 * ation of an aside, and the admission is not an aside — it is the point of the
 * sentence. A comma keeps it in the same breath as the rest. (Tobia: "remove
 * the em dash".) Nothing else about the line changed.
 *
 * What it deliberately does NOT do: predict, sell, instruct the reader, or
 * claim anything that cannot be checked on the pages above it.
 */
const MESSAGE =
  "The tools keep getting better at doing. Deciding what is worth doing, and why, is the part that stays human. So I build things, write about minds, and leave what I learn here, still working it out in public.";

/**
 * THE LINKS, in three columns, in the order a reader actually needs them: the
 * page they are on, the work, then how to reach him.
 *
 * Instagram and X are NOT here. Both are placeholder hrefs elsewhere in the
 * codebase (see ThoughtsDesktop) and a dead link in a footer is worse than a
 * missing one. When those accounts are real, they are two lines in COLUMN 3.
 */
type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: FooterLink[][] = [
  [
    { href: "/#home", label: "Home" },
    { href: "/#projects", label: "Projects" },
    { href: "/#thoughts", label: "Thoughts" },
  ],
  [
    { href: "/projects/construct", label: "Construct" },
    { href: "/projects/construct/material", label: "Free material" },
    { href: "/projects/mynd", label: "Myynd" },
    { href: "/projects/book", label: "The Book" },
  ],
  [
    { href: "mailto:tobia@donadon.com", label: "tobia@donadon.com" },
    {
      href: "https://www.linkedin.com/in/tobia-donadon",
      label: "LinkedIn",
      external: true,
    },
  ],
];

/**
 * Small type on this ground, measured rather than eyeballed. Ink (#0b1f3a) on
 * the footer's ember (#f5501a) is 4.75:1, which clears AA for body text — so
 * every word down here is FULL ink and hierarchy is carried by size, weight
 * and tracking only. Nothing is faded: ink at 80% over this ground drops to
 * 3.9:1 and stops being readable, which is exactly the trap a "quiet" footer
 * link colour would have walked into.
 */
const LABEL =
  "footer-link relative inline-block py-[0.26rem] text-[0.78rem] font-medium uppercase tracking-[0.11em] text-[var(--ink)] md:text-[0.82rem]";

export function SiteFooter() {
  return (
    <footer
      className="site-footer relative overflow-hidden"
      aria-label="Site footer"
      // The site cursor is a red dot (#ff4c24). On this ground it is the same
      // colour as the ground and simply vanishes, so the whole footer asks for
      // the ink one. See custom-cursor.tsx.
      data-cursor-ink
    >
      <FooterReveal />

      <div className="flex h-full flex-col">
        {/* ── THE SENTENCE ─────────────────────────────────────────────────
            Split to the two edges, so reading it takes the full width of the
            page. Below `sm` there is no room for that: the halves stack, and
            the second one still sits hard right, which keeps the gesture. */}
        <div className="mx-auto flex w-full max-w-[96rem] flex-1 items-center px-6 pt-12 pb-7 md:px-10 md:pt-14">
          <h2 className="flex w-full flex-col font-serif text-[clamp(3rem,12.5vw,9rem)] font-medium leading-[0.88] tracking-[-0.04em] text-[var(--ink)] sm:flex-row sm:items-baseline sm:justify-between">
            <span className="footer-word footer-word-a">{WORD_LEFT}</span>
            {/* sr-only is position:absolute, so this space is read aloud
                between the two halves without becoming a third flex item and
                breaking `justify-between`. */}
            <span className="sr-only"> </span>
            <span className="footer-word footer-word-b self-end sm:self-auto">
              {WORD_RIGHT}
            </span>
          </h2>
        </div>

        {/* The rule runs edge to edge, like the reference's. It draws itself
            left to right as the page leaves. */}
        <div
          aria-hidden
          className="footer-rule h-px w-full bg-[color:rgba(11,31,58,0.32)]"
        />

        {/* The bottom padding is not symmetry, it is clearance: on mobile the
            site nav is a pill fixed to the BOTTOM of the viewport (see
            tubelight-navbar), and the footer is the one screen it can land on
            top of. 5.5rem puts the signature row clear above it. From `md` the
            nav is at the top of the screen and the padding goes back to
            normal. */}
        <div className="mx-auto w-full max-w-[96rem] px-6 pt-7 pb-[5.5rem] md:px-10 md:pt-9 md:pb-9">
          {/* ── THE MESSAGE ──
              `--i` counts UP the page, not down it, because that is the order
              the reveal uncovers things in: 0 is the signature row at the very
              bottom, 4 is this. See `.footer-rise` in globals.css. */}
          <p
            className="footer-rise max-w-[58ch] text-[0.98rem] leading-[1.5] text-[var(--ink)] md:text-[1.12rem] md:leading-[1.45]"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            {MESSAGE}
          </p>

          {/* ── THE LINKS ── */}
          <nav
            aria-label="Footer"
            // Capped well short of the footer's own width, so the three
            // columns cluster in the left half rather than stretching to the
            // far edge. That is the reference's proportion exactly: the
            // sentence owns the full width, everything under it is packed
            // left, and the right side stays open for the mark.
            className="mt-8 grid max-w-[64rem] grid-cols-2 gap-x-8 gap-y-0 sm:grid-cols-3 md:mt-10 md:gap-x-12"
          >
            {COLUMNS.map((column, ci) => (
              <ul
                key={column[0].href}
                className="footer-rise list-none"
                style={{ "--i": ci + 1 } as React.CSSProperties}
              >
                {column.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className={LABEL}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className={LABEL}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </nav>

          {/* ── THE SIGNATURE ROW ── */}
          <div
            className="footer-rise mt-9 flex items-end justify-between gap-6 md:mt-11"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <span className="text-[0.68rem] uppercase tracking-[0.13em] text-[var(--ink)] md:text-[0.72rem]">
              © 2026 Tobia Donadon
            </span>

            <div className="flex items-end gap-5 md:gap-7">
              {/* Not on mobile: the nav pill down there already has Home in
                  it, and three items plus the mark do not fit on one line at
                  390px without wrapping into each other. */}
              <Link
                href="/#home"
                className="footer-link group hidden text-[0.68rem] uppercase tracking-[0.13em] text-[var(--ink)] sm:inline md:text-[0.72rem]"
              >
                Back to the top
                <span
                  aria-hidden
                  className="ml-1.5 inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
                >
                  ↑
                </span>
              </Link>

              {/* THE MARK: the logo, where the reference puts its star.

                  It needs no recolouring to sit here, which is the nice part —
                  the file is drawn in #0b1f3a on transparent, the same ink as
                  every word around it, so on the ember it reads as one more
                  mark in the same hand rather than an image dropped on top.

                  `alt=""` on purpose. The name is already set in words half an
                  inch to the left; a screen reader announcing "Tobia Donadon"
                  twice in one row is noise, not access. */}
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="footer-mark h-8 w-8 shrink-0 md:h-10 md:w-10"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
