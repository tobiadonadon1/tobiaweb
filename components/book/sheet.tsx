import { cn } from "@/lib/utils";

/**
 * The page block of a book: one measure, held inside deliberately wide
 * margins, with an optional running head out in the left margin.
 *
 * Every vertical value on this page is a multiple of the 28px baseline
 * (Tailwind's `7` = 1.75rem = 28px, so `14` = 2 lines, `28` = 4 lines, and
 * the arbitrary `[10.5rem]` = 6 lines). Keeping to it is what makes the page
 * read as typeset rather than laid out.
 */
export function Sheet({
  children,
  runningHead,
  className,
}: {
  children: React.ReactNode;
  /** Marginalia. Sits out in the left margin from `lg:` up, never on mobile. */
  runningHead?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[74rem] px-7 sm:px-12 lg:px-20",
        className,
      )}
    >
      {runningHead ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-0 hidden select-none font-mono text-[11px] uppercase tracking-[0.15em] text-paper/70 [writing-mode:vertical-rl] lg:block"
        >
          {runningHead}
        </span>
      ) : null}
      {children}
    </div>
  );
}
