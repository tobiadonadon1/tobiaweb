import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ConstructStar } from "@/components/superhuman/construct-star";

/**
 * The hero's one sales door: a small paper card in the bottom right that
 * points straight at Construct, where the setups are sold and given away.
 * Same paper and ink as the Construct project card further down the page.
 *
 * It arrives after the name has landed (HeroSequence animates `.js-hero-card`)
 * so it never competes with the loader. On a phone it becomes a slim strip
 * along the bottom edge, below the name.
 */
export function HeroConstructCard() {
  return (
    <Link
      href="/projects/construct"
      aria-label="Construct: the AI setups I actually run. Most are free."
      className="js-hero-card group absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-4 rounded-[20px] bg-paper p-3 pr-4 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay-text)] sm:inset-x-auto sm:right-6 sm:w-[22rem] md:bottom-20 md:right-12 md:p-4 md:pr-5 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
    >
      <span
        aria-hidden
        className="relative flex size-16 shrink-0 items-center justify-center rounded-[14px] bg-[#efe9dc] md:size-20"
      >
        <ConstructStar id="hero-card" className="size-12 md:size-16" />
        <span className="absolute -right-1 -top-1 rounded-full bg-[var(--accent-clay)] px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase leading-none tracking-wide text-paper">
          New
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.75rem] font-medium text-[var(--accent-clay-text)]">
          Construct
        </span>
        <span className="mt-0.5 block text-[1.05rem] font-medium leading-tight tracking-[-0.02em] md:text-[1.15rem]">
          The AI setups I actually run
        </span>
        <span className="mt-1 hidden text-[0.8rem] leading-snug text-[#4a5568] sm:block">
          Trading bot, launch videos, crypto analyst. Most are free.
        </span>
      </span>
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink text-paper transition-colors duration-200 group-hover:bg-[#244466]"
      >
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
