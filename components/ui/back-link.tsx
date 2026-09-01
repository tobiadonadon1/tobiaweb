import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * The way back, on every project page.
 *
 * It used to be three different things: a 40%-opacity mono kicker on
 * Superhuman, a different one inside myynd's header flow, and a third at 60%
 * on the book's ink. All of them were, in Tobia's words, hard to see. This is
 * one control, fixed to the top left, with a real target area, a real border,
 * and enough contrast to actually read on either ground.
 *
 * It is `fixed`, not `absolute`: it stays reachable the whole way down instead
 * of scrolling away with the hero. The ink chip tracks whatever dark ground
 * the page is using; it was a warm near-black for the book's old ground and is
 * navy now that the book runs on deep water. The site nav is centred, so nothing
 * collides. z-40 keeps it over pinned sections, under the nav itself.
 */
export function BackLink({
  href = "/#projects",
  label = "Back",
  tone = "paper",
}: {
  href?: string;
  label?: string;
  tone?: "paper" | "ink";
}) {
  const onInk = tone === "ink";
  return (
    <Link
      href={href}
      className={[
        "group fixed left-5 top-5 z-40 inline-flex items-center gap-2 rounded-full",
        "border px-4 py-2.5 text-[13px] leading-none backdrop-blur-md",
        "transition-colors duration-300 sm:left-7 sm:top-7",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        onInk
          ? "border-paper/25 bg-[rgba(5,13,26,0.72)] text-paper/85 outline-paper hover:border-paper/55 hover:text-paper"
          : "border-[rgba(11,31,58,0.2)] bg-[rgba(250,248,242,0.75)] text-[color:rgba(11,31,58,0.8)] outline-[var(--accent-sky)] hover:border-[rgba(11,31,58,0.45)] hover:text-[var(--ink)]",
      ].join(" ")}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
