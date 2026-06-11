"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArticleCard, type ArticleCardProps } from "@/components/ui/article-card";

const PAGE_SIZE = 3;

// Draft thoughts (Tobia rewrites; later this may be fed by Hermes — the
// cards only need this array's shape, wherever it comes from).
const THOUGHTS: ArticleCardProps[] = [
  {
    headline: "Why I'm writing a book in public",
    excerpt:
      "Finished things are easy to admire and hard to learn from. I'd rather show the drafts — the wrong turns included — and let the thinking be the thing.",
    cover: "/trail/trail-03.jpg",
    tag: "the book",
    readTime: "4 min read",
    date: "Jun 4, 2026",
    writer: "Tobia",
  },
  {
    headline: "Intelligence wants intention",
    excerpt:
      "The tools are getting smarter by the month. The question that interests me isn't what they can do — it's what we point them at, and why.",
    cover: "/trail/trail-05.jpg",
    tag: "consciousness",
    readTime: "3 min read",
    date: "May 27, 2026",
    writer: "Tobia",
  },
  {
    headline: "Notes from building quietly",
    excerpt:
      "Nothing I'm making is finished, and I've stopped being embarrassed about that. A record of what building looks like before anyone is watching.",
    cover: "/trail/trail-01.jpg",
    tag: "building",
    readTime: "5 min read",
    date: "May 18, 2026",
    writer: "Tobia",
  },
  {
    headline: "What dreams taught me about attention",
    excerpt:
      "Years of paying attention to the strange hours — significant dreams, one unmistakable out-of-body experience — and what it changed about my waking focus.",
    cover: "/trail/trail-06.jpg",
    tag: "consciousness",
    readTime: "4 min read",
    date: "May 9, 2026",
    writer: "Tobia",
  },
  {
    headline: "Tools should teach by doing",
    excerpt:
      "I don't want to sell courses and I don't want to read manuals. The best things I've learned came from tools that made me better while I used them.",
    cover: "/trail/trail-07.jpg",
    tag: "superhuman",
    readTime: "3 min read",
    date: "Apr 30, 2026",
    writer: "Tobia",
  },
  {
    headline: "On graduating early and starting late",
    excerpt:
      "Three years instead of four, then straight into the biggest company that would have me. Speed is a tool, not an identity — some things still want their full season.",
    cover: "/trail/trail-08.jpg",
    tag: "the road",
    readTime: "4 min read",
    date: "Apr 21, 2026",
    writer: "Tobia",
  },
];

/**
 * Thoughts — the "watch me think" beat. Blog cards in the house skin with
 * a working Load More (reveals the next batch; says so when it runs dry).
 * Content is a plain array for now; Hermes can feed it later without
 * touching the UI.
 */
export function ThoughtsSection() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);
  const prevVisible = useRef(PAGE_SIZE);

  const exhausted = visible >= THOUGHTS.length;

  // Settle-once entrances — initial batch via IntersectionObserver, newly
  // loaded batches immediately (they appear in view).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevVisible.current = visible;
      return;
    }
    const cards = Array.from(grid.children) as HTMLElement[];
    const fresh = cards.slice(prevVisible.current === visible ? 0 : prevVisible.current);
    prevVisible.current = visible;
    if (!fresh.length) return;

    gsap.set(fresh, { opacity: 0, y: 26, filter: "blur(6px)" });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            clearProps: "opacity,transform,filter",
          });
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    fresh.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [visible]);

  return (
    <section id="thoughts" className="border-t border-black/5 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="mb-12 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
            Thoughts
          </span>
          <h2 className="mt-5 font-serif text-4xl tracking-tight text-[#0a0a0a] md:text-5xl">
            Watch me think.
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {THOUGHTS.slice(0, visible).map((t) => (
            <ArticleCard key={t.headline} {...t} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            disabled={exhausted}
            onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, THOUGHTS.length))}
            className={
              "rounded-full border px-7 py-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-all duration-300 " +
              (exhausted
                ? "cursor-default border-black/5 text-black/25"
                : "border-black/10 text-black/55 hover:-translate-y-0.5 hover:border-black/20 hover:bg-muted hover:text-black/80")
            }
          >
            {exhausted ? "More soon." : "Load more"}
          </button>
        </div>
      </div>
    </section>
  );
}
