"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleCardProps {
  headline: string;
  excerpt: string;
  /** Cover photo (Tobia's own — rendered natural/ungraded). */
  cover?: string;
  tag?: string;
  readTime?: string; // e.g. "4 min read"
  date?: string; // e.g. "Jun 4, 2026"
  writer?: string;
  clampLines?: number;
  className?: string;
  /** When set, the whole card becomes a link to the post (e.g. /thoughts/slug). */
  href?: string;
}

// Same coloured-glass-on-paper language as the rest of the site.
const GLASS_BG =
  "linear-gradient(145deg, rgba(253,252,249,0.88), rgba(247,245,239,0.66))";
const REST_SHADOW =
  "0 14px 36px rgba(28,24,14,0.1), 0 5px 12px rgba(28,24,14,0.06), inset 0 1px 0 rgba(255,255,255,0.7)";
const HOVER_SHADOW =
  "0 26px 60px rgba(28,24,14,0.17), 0 9px 20px rgba(28,24,14,0.1), inset 0 1px 0 rgba(255,255,255,0.78)";

/**
 * Blog card in the house voice (structure from Tobia's 21st.dev pick:
 * cover → tag · read time → headline → excerpt → byline/date): serif
 * headline, mono facts set small, glass on paper, natural/ungraded cover.
 */
export function ArticleCard({
  headline,
  excerpt,
  cover,
  tag,
  readTime,
  date,
  writer,
  clampLines = 3,
  className,
  href,
}: ArticleCardProps) {
  const hasMeta = tag || readTime;
  const hasFooter = writer || date || href;

  const card = (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border p-3",
        "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5",
        className
      )}
      style={{
        background: GLASS_BG,
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderColor: "rgba(30,26,14,0.07)",
        boxShadow: REST_SHADOW,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = HOVER_SHADOW)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = REST_SHADOW)}
    >
      {cover && (
        <div
          className="relative h-48 w-full overflow-hidden rounded-2xl border"
          style={{ borderColor: "rgba(30,26,14,0.08)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- local photo, object-cover plate */}
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* Covers are natural/ungraded — no sea-tone grade (redesign canon). */}
        </div>
      )}

      <div className="flex flex-grow flex-col p-4 pb-2">
        {hasMeta && (
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
            {tag && (
              <span
                className="rounded-full border px-2.5 py-1"
                style={{ borderColor: "rgba(30,26,14,0.1)" }}
              >
                {tag}
              </span>
            )}
            {tag && readTime && <span className="text-black/25">·</span>}
            {readTime && <span>{readTime}</span>}
          </div>
        )}

        <h3 className="font-serif text-2xl leading-[1.12] tracking-tight text-[#0a0a0a] md:text-[1.7rem]">
          {headline}
        </h3>

        <p
          className={cn(
            "mt-2.5 text-sm leading-relaxed text-black/55",
            clampLines > 0 &&
              "overflow-hidden [-webkit-box-orient:vertical] [display:-webkit-box]"
          )}
          style={clampLines > 0 ? { WebkitLineClamp: clampLines } : undefined}
        >
          {excerpt}
        </p>

        {hasFooter && (
          <div className="mt-auto flex items-center justify-between pt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black/35">
            <span>
              {writer}
              {writer && date && <span className="text-black/20"> · </span>}
              {date}
            </span>
            {href && (
              // The clickability cue — same typographic "Enter ↗" language as
              // the project cards, so a thought reads as openable, not inert.
              <span className="flex items-center gap-1 text-black/40 opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-900/80 group-hover:opacity-100">
                Read <ArrowUpRight className="h-3 w-3" />
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );

  // A thought with an href is a real link to its reading page; otherwise the
  // card renders plain (e.g. previews). The hover lift + "Read ↗" make the
  // link obvious — the card no longer does nothing when clicked.
  return href ? (
    <Link href={href} className="block h-full rounded-[24px]" aria-label={headline}>
      {card}
    </Link>
  ) : (
    card
  );
}
