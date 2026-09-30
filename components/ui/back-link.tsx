"use client";

import { useEffect, useState } from "react";
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
 * collides. z-40 keeps it over pinned sections, under the nav itself. It
 * steps aside once the footer opens (`.back-link` in globals.css), where it
 * used to float over the footer's headline; the footer has its own links.
 *
 * ON A PHONE IT TUCKS AWAY WHILE YOU READ DOWN, exactly like the nav beside
 * it, and comes back the moment you scroll up or near the top. At 393px wide
 * every heading passes under its corner, and a chip parked over the first
 * word of each one was the most visible blemish on the project pages.
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
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const dy = y - last;
        if (y < 80) setTucked(false);
        else if (dy > 6) setTucked(true);
        else if (dy < -6) setTucked(false);
        if (Math.abs(dy) > 6 || y < 80) last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <Link
      href={href}
      className={[
        "back-link group fixed left-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full",
        "border px-4 py-3 text-[13px] leading-none backdrop-blur-md",
        "transition-[color,border-color,opacity,translate] duration-300 sm:left-7 sm:top-7",
        "top-[max(1.25rem,env(safe-area-inset-top))]",
        tucked ? "max-sm:pointer-events-none max-sm:-translate-y-[160%] max-sm:opacity-0" : "",
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
