import { Image as ImageIcon } from "lucide-react";
import { Figure } from "./figures";
import type { Block } from "./material-types";

/**
 * THE BODY OF A PIECE, ON PAPER.
 *
 * These used to be typed for an ink panel: paper coloured text at 82% over a
 * dark ground, in a 68 character measure held tight because a dark ground
 * makes a long line hard to track back. The reading pane is gone. Every piece
 * is its own page on paper now, so all of it is restated for ink on paper,
 * which reads heavier and wants a slightly longer measure and more leading.
 *
 * There is no markdown anywhere in this. A piece is a typed array, which means
 * a malformed block is a build error rather than a paragraph in the wrong
 * font, and no page can accidentally accept HTML out of a data file.
 *
 * SPACING IS PER BLOCK, not `space-y` on the wrapper. A heading needs twice the
 * air above it that a paragraph does and a pulled line needs more again, and
 * fighting a wrapper's rule for that would mean reaching for `important`,
 * which nothing else on this site does. Every block carries `mt-*` and
 * `first:mt-0`, so the first block never opens with a gap and adjacent margins
 * collapse the way they should.
 *
 * THE MEASURE IS 66ch AND THE COLUMN IS CENTRED. Everything wider than the
 * measure (code, figures, the pulled line) is allowed to break out, because an
 * editorial page earns its rhythm by having two widths rather than one.
 */

const P =
  "mt-7 text-[1.12rem] leading-[1.78] text-[color:rgba(11,31,58,0.8)] first:mt-0 md:text-[1.16rem]";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className={`text-pretty ${P}`}>
                {block.text}
              </p>
            );

          case "h":
            return (
              <h2
                key={i}
                className="mt-14 max-w-[34ch] font-serif text-[1.65rem] leading-[1.15] tracking-[-0.028em] text-[var(--ink)] first:mt-0 md:text-[1.9rem]"
              >
                {block.text}
              </h2>
            );

          case "steps":
            // Numbers in clay, hanging outside the text. The one place a list
            // is allowed to look like a recipe, because it is one.
            return (
              <ol key={i} className="mt-8 list-none space-y-5 first:mt-0">
                {block.items.map((item, n) => (
                  <li key={n} className="flex gap-5">
                    <span className="mt-[0.35rem] w-7 shrink-0 font-mono text-[0.82rem] tabular-nums text-[var(--accent-clay-text)]">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.08rem] leading-[1.72] text-[color:rgba(11,31,58,0.8)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            );

          case "list":
            return (
              <ul key={i} className="editorial-index mt-8 list-none first:mt-0">
                {block.items.map((item, n) => (
                  <li
                    key={n}
                    className="py-4 text-[1.05rem] leading-[1.68] text-[color:rgba(11,31,58,0.76)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "code":
            // Breaks the measure, and owns its own scroll box: a long line
            // inside a piece must never be able to widen the page.
            return (
              <figure key={i} className="mt-8 first:mt-0 lg:-mx-16">
                {block.label ? (
                  <figcaption className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                    {block.label}
                  </figcaption>
                ) : null}
                <pre className="overflow-x-auto border border-[var(--hairline)] bg-[rgba(11,31,58,0.035)] p-5 text-[0.86rem] leading-[1.7] text-[color:rgba(11,31,58,0.82)] md:p-6">
                  <code className="font-mono">{block.text}</code>
                </pre>
              </figure>
            );

          case "pull":
            // The one display moment inside a piece. A clay rule above it
            // rather than beside it, so it reads as a change of voice rather
            // than as a quotation from somebody else.
            return (
              <div key={i} className="mt-14 mb-12 first:mt-0 lg:-mx-16">
                <span
                  aria-hidden
                  className="block h-0.5 w-14 bg-[var(--accent-clay)]"
                />
                <p className="mt-6 max-w-[24ch] font-serif text-[clamp(1.6rem,3.6vw,2.3rem)] leading-[1.15] tracking-[-0.03em] text-[var(--ink)]">
                  {block.text}
                </p>
              </div>
            );

          case "figure":
            return (
              <figure key={i} className="mt-12 first:mt-0 lg:-mx-16">
                {/* SCROLLS RATHER THAN SHRINKS. The drawings are 640 units
                    wide and their labels are sized for that. Fitting one into
                    a 285px phone column renders its type at under 5px, which
                    is a decorative smear, so below a legible width the figure
                    keeps its size and scrolls inside its own box. Nothing here
                    can widen the page. */}
                <div className="overflow-x-auto border border-[var(--hairline)] bg-[rgba(11,31,58,0.02)] px-5 py-8 md:px-10 md:py-12">
                  <Figure id={block.id} className="mx-auto h-auto w-full min-w-[32rem] max-w-2xl" />
                </div>
                <figcaption className="mt-3.5 text-[0.9rem] leading-[1.6] text-[color:rgba(11,31,58,0.62)]">
                  {block.caption}
                </figcaption>
              </figure>
            );

          case "shot":
            // Taken: a plain img rather than next/image, because these are
            // screenshots of wildly different sizes dropped into public/ by
            // hand, and a fixed width/height pair would be wrong for most.
            return block.src ? (
              <figure key={i} className="mt-12 first:mt-0 lg:-mx-16">
                <div className="overflow-hidden border border-[var(--hairline)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local screenshot, intrinsic size unknown */}
                  <img
                    src={block.src}
                    alt={block.need}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3.5 text-[0.9rem] leading-[1.6] text-[color:rgba(11,31,58,0.62)]">
                  {block.need}
                </figcaption>
              </figure>
            ) : (
              // NOT TAKEN. The slot says what it will hold rather than
              // pretending the picture is on its way.
              <figure
                key={i}
                className="mt-12 flex flex-col justify-center border border-dashed border-[var(--hairline-strong)] px-5 py-9 first:mt-0"
              >
                <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  <ImageIcon aria-hidden className="h-3.5 w-3.5" />
                  Image to come
                </span>
                <figcaption className="mt-2 max-w-[52ch] text-[0.98rem] leading-[1.6] text-[color:rgba(11,31,58,0.66)]">
                  {block.need}
                </figcaption>
              </figure>
            );

          case "watch":
            // The caveat. Marked with a clay rule down its left edge, not
            // shouted with an icon and a colour field.
            return (
              <aside
                key={i}
                className="mt-10 border-l-2 border-[var(--accent-clay)] py-1 pl-6 first:mt-0"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  Watch out
                </span>
                <p className="mt-2 text-[1.04rem] leading-[1.7] text-[color:rgba(11,31,58,0.76)]">
                  {block.text}
                </p>
              </aside>
            );
        }
      })}
    </div>
  );
}
