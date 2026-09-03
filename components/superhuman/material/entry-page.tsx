import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { Blocks } from "./material-blocks";
import { SkillContents } from "./skill-contents";
import { KIND_LABEL, entryHref, folderHref, neighbours } from "./material-data";
import type { MaterialEntry, MaterialFolder } from "./material-types";

/**
 * ONE PIECE, ON ITS OWN PAGE.
 *
 * THE SHAPE IS A MAGAZINE OPENING, not an app screen. A centred column, a
 * label, the title at a size that means it, one sentence under it, then a
 * short clay rule and the writing. Anthropic's own posts are the reference and
 * the reason is not fashion: an announcement page and a guide are doing the
 * same job, which is holding somebody's attention through eight hundred words
 * of explanation with no interface to click.
 *
 * THE HEAD IS CENTRED AND THE BODY IS NOT. Tobia asked for central text. A
 * centred column is what that means, because centred PROSE is unreadable past
 * about three lines: every line starts in a different place and the eye has to
 * hunt for each one. So the head centres, which is where centring reads as
 * ceremony, and the body sits left aligned inside a centred measure, which is
 * how every printed thing that expects to be read is set.
 *
 * WIDTH IS 42rem AND SOME THINGS BREAK IT. Code, figures and the pulled line
 * hang out past the measure on wide screens (see material-blocks.tsx). One
 * width for everything is a document. Two widths is a designed page.
 *
 * SKILLS GET AN EXTRA SECTION and guides do not. A guide ends when the writing
 * ends. A skill is a file you have to put somewhere, so the page owes you the
 * tree, the path and the command before it lets you go.
 */
export function EntryPage({
  folder,
  entry,
}: {
  folder: MaterialFolder;
  entry: MaterialEntry;
}) {
  const { prev, next } = neighbours(folder, entry.slug);

  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[#0a0a0a]">
      <BackLink href={folderHref(folder.id)} label={folder.name} tone="ink" />

      <article className="mx-auto w-full max-w-[42rem] px-6 pb-28 pt-28 md:pb-36 md:pt-36">
        {/* ------------------------------------------------------------- *
         * THE OPENING.
         * ------------------------------------------------------------- */}
        <header className="text-center">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            {KIND_LABEL[entry.kind]} · {entry.minutes} min · {entry.level}
          </span>

          <h1 className="mx-auto mt-6 max-w-[18ch] text-balance font-serif text-[clamp(2.4rem,7.5vw,4rem)] leading-[0.98] tracking-[-0.035em] text-[var(--ink)]">
            {entry.title}
          </h1>

          <p className="mx-auto mt-6 max-w-[38ch] text-balance text-[1.2rem] leading-[1.42] text-[color:rgba(11,31,58,0.66)] md:text-[1.3rem]">
            {entry.summary}
          </p>

          <span
            aria-hidden
            className="mx-auto mt-10 block h-0.5 w-14 bg-[var(--accent-clay)]"
          />
        </header>

        {/* ------------------------------------------------------------- *
         * NOT FINISHED, AND SAYING SO ABOVE THE WRITING.
         *
         * Above the body rather than in a badge beside the title: a badge can
         * be read as a category, and this is a warning about the thing you are
         * about to spend ten minutes on.
         * ------------------------------------------------------------- */}
        {entry.status !== "ready" ? (
          <p className="mt-12 border-l-2 border-[var(--accent-clay)] py-1 pl-6 text-[1.02rem] leading-[1.65] text-[color:rgba(11,31,58,0.7)]">
            {entry.status === "filming"
              ? "This one is not filmed yet. What follows is the notes it will be cut from, which are worth reading on their own."
              : "This one is still being written and will change."}
          </p>
        ) : null}

        {/* ------------------------------------------------------------- *
         * WHEN TO REACH FOR IT. The one thing a reader is owed before they
         * commit, so it sits above the writing rather than inside it.
         * ------------------------------------------------------------- */}
        <p className="mt-12 border-l-2 border-[var(--hairline-strong)] py-1 pl-6 text-[1.05rem] leading-[1.65] text-[color:rgba(11,31,58,0.62)]">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            Read this when
          </span>
          <span className="mt-1.5 block">{entry.when}</span>
        </p>

        {/* ------------------------------------------------------------- *
         * THE WRITING.
         * ------------------------------------------------------------- */}
        <div className="mt-12">
          <Blocks blocks={entry.body} />
        </div>

        {/* ------------------------------------------------------------- *
         * THE FILE, FOR THE THINGS THAT ARE FILES.
         * ------------------------------------------------------------- */}
        {entry.kind === "skill" && entry.link?.download ? (
          <SkillContents
            slug={entry.slug}
            title={entry.title}
            href={entry.link.href}
          />
        ) : null}

        {/* THE DISCLOSURE PRINTS ITSELF, which is the only way the type's
            promise that "a piece cannot carry a paid link silently" is true. */}
        {entry.referral ? (
          <p className="mt-10 max-w-[62ch] text-[0.92rem] leading-relaxed text-[color:rgba(11,31,58,0.62)]">
            That link pays me if you sign up. It is the same tool I would name
            if it did not, and nothing is listed here because it pays.
          </p>
        ) : null}

        {/* ------------------------------------------------------------- *
         * THE NEIGHBOURS.
         * ------------------------------------------------------------- */}
        {prev || next ? (
          <nav
            aria-label={`Elsewhere in ${folder.name}`}
            className="mt-20 flex flex-wrap items-start justify-between gap-6 border-t border-[var(--hairline)] pt-8 md:mt-24"
          >
            {prev ? (
              <Link
                href={entryHref(folder.id, prev.slug)}
                className="group max-w-[20rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                <span className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Previous
                </span>
                <span className="mt-2 block font-serif text-[1.2rem] leading-snug tracking-tight text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out group-hover:text-[var(--accent-clay)]">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={entryHref(folder.id, next.slug)}
                className="group max-w-[20rem] text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              >
                <span className="flex items-center justify-end gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  Next
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-2 block font-serif text-[1.2rem] leading-snug tracking-tight text-[color:rgba(11,31,58,0.72)] transition-colors duration-[600ms] ease-out group-hover:text-[var(--accent-clay)]">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>
    </main>
  );
}
