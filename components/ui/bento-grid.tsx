"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BentoItem {
  title: string;
  description: string;
  /** Quiet mono status — e.g. "in review", "open". */
  status: string;
  /** One mono consequence line under the status — e.g. "arriving late 2026". */
  consequence?: string;
  href: string;
  flagship?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

// Same coloured-glass-on-paper language as the identity cards, one size down.
const GLASS_BG =
  "linear-gradient(145deg, rgba(253,252,249,0.88), rgba(247,245,239,0.66))";
const REST_SHADOW =
  "0 18px 44px rgba(28,24,14,0.12), 0 6px 14px rgba(28,24,14,0.07), inset 0 1px 0 rgba(255,255,255,0.7)";
const HOVER_SHADOW =
  "0 30px 70px rgba(28,24,14,0.2), 0 10px 22px rgba(28,24,14,0.11), inset 0 1px 0 rgba(255,255,255,0.78)";

// Open-into-the-page timing: the glass sheet expands over ~0.6s, the route
// swaps beneath it, then the sheet lifts to reveal the risen page.
const EXPAND_S = 0.6;
const PUSH_MS = 420;
const REVEAL_MS = 1000;

// The hover-revealed Enter ↗ cue (typographic — shared by both card sizes).
function EnterCue() {
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-black/40 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-900/80 group-hover:opacity-100">
      Enter
      <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * The projects bento (21st.dev BentoGrid, re-skinned to the site):
 * three text-only paper-glass cards — one flagship, two companions.
 * Opening a card is a shared-element expansion: a glass sheet lifts off
 * the clicked card, grows to fill the screen while turning to paper, the
 * route changes beneath it, and the sheet dissolves into the new page
 * mid-rise — one continuous motion. Cmd/middle-click keep native
 * new-tab behavior.
 */
export function BentoGrid({ items, className }: BentoGridProps) {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  const navigating = useRef(false);

  // Entrance: cards surface right behind the ink — rise, unblur, stagger.
  // Animates the WRAPPER divs (transforms cleared after play so they never
  // linger as stacking contexts / fight hover CSS).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrappers = Array.from(grid.children) as HTMLElement[];

    const tween = gsap.fromTo(
      wrappers,
      { opacity: 0, y: 36, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.13,
        clearProps: "all",
        scrollTrigger: {
          // "top bottom": the fade starts the moment the grid crosses the
          // fold, right behind the departing navy block.
          trigger: grid,
          start: "top bottom",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: BentoItem) => {
    track("project_open", {
      project: item.href.split("/").pop() || item.href,
      source: "bento",
    });
    // Let the browser handle new-tab/window intents natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (navigating.current) return;
    navigating.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(item.href);
      return;
    }

    // Shared-element expansion: a body-level glass sheet at the card's
    // exact rect grows to fullscreen (vanilla DOM — it must survive the
    // route change), turning to paper as it goes.
    const rect = e.currentTarget.getBoundingClientRect();
    setOpening(true); // the grid dims beneath the sheet

    const sheet = document.createElement("div");
    Object.assign(sheet.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: "24px",
      // The glass colours, opaque (no backdrop-filter on a moving sheet).
      background: "linear-gradient(145deg, #fdfcf9, #f7f5ef)",
      border: "1px solid rgba(30,26,14,0.07)",
      boxShadow: HOVER_SHADOW,
      zIndex: "80",
      pointerEvents: "none",
      willChange: "top, left, width, height",
    } as Partial<CSSStyleDeclaration>);
    const paper = document.createElement("div");
    Object.assign(paper.style, {
      position: "absolute",
      inset: "0",
      borderRadius: "inherit",
      background: "#faf8f2",
      opacity: "0",
    } as Partial<CSSStyleDeclaration>);
    sheet.appendChild(paper);
    document.body.appendChild(sheet);

    gsap.to(sheet, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: EXPAND_S,
      ease: "power3.inOut",
    });
    gsap.to(paper, { opacity: 1, duration: 0.45, delay: 0.15, ease: "power2.out" });

    window.setTimeout(() => router.push(item.href), PUSH_MS);
    window.setTimeout(() => {
      // The new page has mounted beneath and is rising — lift the sheet.
      gsap.to(sheet, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => sheet.remove(),
      });
    }, REVEAL_MS);
  };

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-[260px]",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.href}
          className={cn(item.flagship && "md:col-span-2 md:row-span-2")}
        >
          <Link
            href={item.href}
            onClick={(e) => handleClick(e, item)}
            className={cn(
              "group relative flex h-full min-h-[230px] flex-col overflow-hidden",
              "rounded-[24px] border outline-none",
              "transition-[transform,box-shadow,opacity] duration-300 ease-out",
              "hover:-translate-y-1.5 focus-visible:-translate-y-1.5",
              item.flagship ? "p-9 md:p-12" : "p-7"
            )}
            style={{
              background: GLASS_BG,
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              borderColor: "rgba(30,26,14,0.07)",
              boxShadow: REST_SHADOW,
              // While the sheet expands, the grid quietly recedes under it.
              ...(opening && { opacity: 0.35, transitionDuration: "500ms" }),
            }}
            onMouseEnter={(e) => {
              if (!opening) e.currentTarget.style.boxShadow = HOVER_SHADOW;
            }}
            onMouseLeave={(e) => {
              if (!opening) e.currentTarget.style.boxShadow = REST_SHADOW;
            }}
          >
            {/* Glass sheen along the top, as on the identity cards */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 45%, transparent 100%)",
              }}
            />

            {/* Status up top, the message, Enter below — pure typography. */}
            <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.35em] text-black/35">
              {item.status}
            </span>
            {item.consequence && (
              <span className="relative z-10 mt-1 block font-mono text-[9px] uppercase tracking-[0.3em] text-black/25">
                {item.consequence}
              </span>
            )}
            <h3
              className={cn(
                "relative z-10 font-serif tracking-tight text-[#0a0a0a]",
                item.flagship
                  ? "mt-5 text-4xl leading-[1.05] md:mt-6 md:text-6xl"
                  : "mt-4 text-2xl leading-[1.12] md:text-3xl"
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "relative z-10 leading-relaxed text-black/55",
                item.flagship
                  ? "mt-5 max-w-xl text-base md:text-lg"
                  : "mt-2.5 line-clamp-3 text-sm leading-snug"
              )}
            >
              {item.description}
            </p>
            <div className="relative z-10 mt-auto flex justify-end pt-4">
              <EnterCue />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
