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
        // `sm:bottom-auto` is load-bearing: with bottom-0 AND sm:top-0 both
        // set, this fixed wrapper stretched the FULL viewport height — an
        // invisible z-50 column down the screen's center that swallowed all
        // mouse events over the hero CTA (hover never fired).
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
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
        className="flex items-center gap-1.5 bg-background/72 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg"
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
