"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname();

  /**
   * The pill used to be pure click state: whatever you last pressed stayed
   * lit forever. So scrolling back up to the top still read "Projects", and
   * arriving on the homepage from anywhere read "Home" even when you were
   * looking at something else. It was reporting your last click, not your
   * position.
   *
   * Now position decides, in three tiers:
   *   route   a /projects/* or /thoughts/* URL owns its tab outright
   *   spy     on the homepage, whichever section is crossing the middle
   *   click   an optimistic flash so the pill answers instantly, before the
   *           smooth scroll has carried the section into view
   *
   * The route tier is derived during render, never written to state, so
   * nothing has to be synchronised.
   */
  const routeTab = pathname?.startsWith("/projects")
    ? items.find((i) => i.url.includes("#projects"))?.name
    : pathname?.startsWith("/thoughts")
      ? items.find((i) => i.url.includes("#thoughts"))?.name
      : undefined;

  const [spyTab, setSpyTab] = useState<string | null>(null);

  /**
   * ON A PHONE THE NAV LIVES AT THE TOP AND GETS OUT OF THE WAY.
   *
   * It used to sit at the bottom, mid-screen, right where a thumb scrolls,
   * so a swipe could land on it and take the reader off the page. Now it sits
   * top right (the back link has the top left), tucks up while you scroll
   * down, and comes back the moment you scroll up, or near the top.
   * Desktop keeps it pinned and visible, as it always was.
   */
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
  const activeTab = routeTab ?? spyTab ?? items[0].name;

  // Scrollspy, homepage only. A tall, thin band across the middle of the
  // viewport is the reading line: at most one section is ever crossing it, so
  // there is no "which of these three is most visible" arithmetic to get
  // wrong. Sections between the nav's own targets (the identity sequence, the
  // why-me block) match nothing and simply leave the last answer standing.
  useEffect(() => {
    if (pathname !== "/") return;

    const byId = new Map<string, string>();
    for (const item of items) {
      const id = item.url.split("#")[1];
      if (id) byId.set(id, item.name);
    }

    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        // Last one down the page wins, so passing from one into the next
        // never leaves both lit.
        let next: string | null = null;
        for (const [id, name] of byId) if (seen.get(id)) next = name;
        if (next) setSpyTab(next);
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    const targets: Element[] = [];
    for (const id of byId.keys()) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    }
    // The homepage mounts its sections after the loader, so a first pass can
    // find nothing. One retry covers it without polling.
    const retry = window.setTimeout(() => {
      for (const id of byId.keys()) {
        const el = document.getElementById(id);
        if (el && !targets.includes(el)) observer.observe(el);
      }
    }, 1200);

    return () => {
      window.clearTimeout(retry);
      observer.disconnect();
    };
  }, [pathname, items]);

  return (
    <div
      className={cn(
        // Top only, never top AND bottom: a fixed wrapper with both set
        // stretches the full viewport height, an invisible z-50 column that
        // once swallowed every click over the hero CTA. On a phone it sits
        // top right, clear of the back link; from `sm` up, top centre.
        "fixed top-0 right-3 z-50 pt-[max(0.9rem,env(safe-area-inset-top))] sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:pt-6",
        className,
      )}
      // Stable hooks for ground-aware theming. A page on an ink ground sets
      // `data-ground="ink"` on its <main>; globals.css keys off THESE
      // attributes, never off Tailwind class names, so restyling the nav
      // survives any refactor of the utility classes below.
      data-site-nav=""
    >
      {/* The pill carries its OWN ground at 72% rather than the old 5%. It
          floats over whatever a page puts under it, and over the homepage's
          full-bleed hero photo the inactive labels measured 2.78:1 against
          the picture, well under the 4.5:1 floor. On paper this reads almost
          identically (paper over paper); over imagery it becomes a legible
          frosted surface instead of near-transparent glass. */}
      <div
        data-nav-pill=""
        className={cn(
          "flex items-center gap-1.5 bg-background/72 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg",
          "transition-[transform,opacity] duration-300 ease-out",
          tucked && "max-sm:pointer-events-none max-sm:-translate-y-[160%] max-sm:opacity-0",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setSpyTab(item.name)}
              data-nav-link=""
              data-nav-active={isActive ? "" : undefined}
              className={cn(
                "relative cursor-pointer text-[13px] font-medium px-5 py-1.5 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    data-nav-lamp=""
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"
                  >
                    <div data-nav-glow="" className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div data-nav-glow="" className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div data-nav-glow="" className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
