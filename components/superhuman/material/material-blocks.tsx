import { Image as ImageIcon } from "lucide-react";
import type { Block } from "./material-types";

/**
 * THE BODY OF A PIECE, RENDERED ON INK.
 *
 * Every block type in material-types.ts has exactly one rendering, here, and
 * all of them assume the dark panel underneath — this is the reading pane's
 * type, not the site's general prose. Paper on ink reads thinner than ink on
 * paper, so the body sits at 82% rather than the 78% the paper sections use,
 * and the measure is held at 68 characters because a dark ground makes a long
 * line harder to track back.
 *
 * There is no markdown anywhere in this. A piece is a typed array, which
 * means a malformed block is a build error rather than a paragraph in the
 * wrong font, and no page can accidentally accept HTML from a data file.
 *
 * SPACING IS PER BLOCK, not `space-y` on the wrapper. A heading needs twice
 * the air above it that a paragraph does and a pulled line needs more again,
 * and fighting a wrapper's rule for that would mean reaching for `important`
 * — which nothing else on this site does. Every block carries `mt-*` and
 * `first:mt-0`, so the first block never opens with a gap and adjacent
 * margins collapse the way they should.
 */

const P = "mt-6 max-w-[68ch] text-[1.02rem] leading-[1.72] text-[color:rgba(214,238,244,0.82)] first:mt-0";

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
              <h3
                key={i}
                className="mt-12 max-w-[52ch] font-serif text-[1.3rem] leading-snug tracking-tight text-[var(--paper)] first:mt-0"
              >
                {block.text}
              </h3>
            );

          case "steps":
            return (
              <ol key={i} className="mt-6 max-w-[68ch] list-none space-y-4 first:mt-0">
                {block.items.map((item, n) => (
                  <li key={n} className="flex gap-4">
                    <span className="mt-[0.3rem] w-6 shrink-0 font-mono text-[0.78rem] tabular-nums text-[var(--accent-sky)]">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.02rem] leading-[1.7] text-[color:rgba(214,238,244,0.82)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            );

          case "list":
            return (
              <ul
                key={i}
                className="editorial-index editorial-index--on-ink mt-6 max-w-[68ch] list-none first:mt-0"
              >
                {block.items.map((item, n) => (
                  <li
                    key={n}
                    className="py-3.5 text-[1rem] leading-[1.65] text-[color:rgba(214,238,244,0.78)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "code":
            return (
              <figure key={i} className="mt-6 max-w-[68ch] first:mt-0">
                {block.label ? (
                  <figcaption className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.42)]">
                    {block.label}
                  </figcaption>
                ) : null}
                {/* Its own scroll box: a long line inside a piece must never
                    be able to widen the page. */}
                <pre className="overflow-x-auto border border-[var(--hairline-on-ink)] bg-[rgba(0,0,0,0.26)] p-5 text-[0.86rem] leading-[1.65] text-[color:rgba(214,238,244,0.86)]">
                  <code className="font-mono">{block.text}</code>
                </pre>
              </figure>
            );

          case "pull":
            return (
              <p
                key={i}
                className="mt-10 mb-4 max-w-[46ch] border-l-2 border-[var(--accent-sky)] py-1 pl-5 font-serif text-[1.3rem] leading-[1.4] tracking-tight text-[var(--paper)] md:text-[1.45rem]"
              >
                {block.text}
              </p>
            );

          case "shot":
            // Taken: a plain img rather than next/image, because these are
            // screenshots of wildly different sizes dropped into public/ by
            // hand, and a fixed width/height pair would be wrong for most of
            // them. Lazy, so a guide with six of them still opens instantly.
            return block.src ? (
              <figure key={i} className="mt-8 max-w-[68ch] first:mt-0">
                <div className="overflow-hidden border border-[var(--hairline-on-ink)] bg-[rgba(0,0,0,0.26)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local screenshot, intrinsic size unknown */}
                  <img
                    src={block.src}
                    alt={block.need}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2.5 text-[0.86rem] leading-snug text-[color:rgba(214,238,244,0.5)]">
                  {block.need}
                </figcaption>
              </figure>
            ) : (
              // NOT TAKEN. The slot says what it will hold rather than
              // pretending the picture is on its way, which is the same rule
              // the unfilmed videos run on.
              <figure
                key={i}
                className="mt-8 flex max-w-[68ch] flex-col justify-center border border-dashed border-[var(--hairline-on-ink)] px-5 py-8 first:mt-0"
              >
                <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.4)]">
                  <ImageIcon aria-hidden className="h-3.5 w-3.5" />
                  Image to come
                </span>
                <figcaption className="mt-2 max-w-[52ch] text-[0.95rem] leading-[1.6] text-[color:rgba(214,238,244,0.66)]">
                  {block.need}
                </figcaption>
              </figure>
            );

          case "watch":
            return (
              <aside
                key={i}
                className="mt-6 max-w-[62ch] border border-[var(--hairline-on-ink)] p-5 first:mt-0"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(214,238,244,0.45)]">
                  Watch out
                </span>
                <p className="mt-2 text-[0.98rem] leading-[1.62] text-[color:rgba(214,238,244,0.78)]">
                  {block.text}
                </p>
              </aside>
            );
        }
      })}
    </div>
  );
}
