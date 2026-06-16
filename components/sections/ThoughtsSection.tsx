"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArticleCard } from "@/components/ui/article-card";
import { THOUGHTS } from "@/lib/thoughts";

const PAGE_SIZE = 3;

// (The thoughts corpus lives in lib/thoughts.ts so the /thoughts/[slug]
// reading pages can share it. Tobia rewrites them; later Mind feeds the same
// shape from the DB without touching this UI.)
/**
 * Thoughts — the "watch me think" beat. Blog cards in the house skin with
 * a working Load More (reveals the next batch; says so when it runs dry).
 * Content is a plain array for now; Mind (the AI ghostwriter) can feed it
 * later without touching the UI.
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
        <div className="mb-14 text-center">
          {/* Mono eyebrow flanked by hairline rules — print masthead, not a
              plain centered stack. */}
          <div className="mx-auto flex max-w-md items-center gap-4">
            <span className="h-px flex-1 bg-black/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
              Thoughts
            </span>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <h2 className="mt-6 font-serif text-4xl tracking-tight text-[#0a0a0a] md:text-5xl">
            Watch me think.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-mono text-[10px] uppercase tracking-[0.3em] text-black/30">
            Drafts in public — the thinking before it&rsquo;s finished
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {THOUGHTS.slice(0, visible).map((t) => (
            <ArticleCard key={t.slug} href={`/thoughts/${t.slug}`} {...t} />
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
