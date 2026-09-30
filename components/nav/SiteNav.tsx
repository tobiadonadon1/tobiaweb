"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Layers, PenLine } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";

// Root-relative hashes so the nav also works from subpages (/projects/…).
const navItems = [
  { name: "Home", url: "/#home", icon: Home },
  { name: "Projects", url: "/#projects", icon: Layers },
  { name: "Thoughts", url: "/#thoughts", icon: PenLine },
];

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  /**
   * The nav stays hidden while the homepage loader owns the screen, then
   * fades in. Everywhere else there is no loader, so it is simply there.
   *
   * `isHome` is derived during render rather than written to state: setting
   * it from an effect meant a synchronous setState and a second render on
   * every project page, for a value already known from the URL.
   */
  const [introDone, setIntroDone] = useState(false);
  const visible = !isHome || introDone;

  useEffect(() => {
    if (!isHome) return;
    // Fires from an event, so this is never a synchronous set.
    const reveal = () => setIntroDone(true);
    window.addEventListener("intro:done", reveal);
    // Backstop only. The loader dispatches on its own, including on the
    // return-visit path where it skips straight to the finished frame.
    // Comfortably past the loader's own release, which now lands at ~5.0s.
    const fallback = setTimeout(reveal, 8000);
    return () => {
      window.removeEventListener("intro:done", reveal);
      clearTimeout(fallback);
    };
  }, [isHome]);

  /**
   * SMOOTH SCROLLING IS ONLY FOR THE READER'S OWN IN-PAGE CLICKS: the nav's
   * Home / Projects / Thoughts and the footer's "Back to the top" while on
   * the homepage. It is switched on (`data-smooth-scroll`, globals.css) for
   * the length of that one scroll and off again after. Left on all the time,
   * every scroll the BROWSER made also glided: a refresh or the Back button
   * raced the reader through the whole site before landing. Now those are
   * cuts, and only a click glides.
   */
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const disarm = () => {
      clearTimeout(timer);
      root.removeAttribute("data-smooth-scroll");
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      const inPage =
        href.startsWith("#") ||
        (href.startsWith("/#") && window.location.pathname === "/");
      if (!inPage) return;
      root.setAttribute("data-smooth-scroll", "");
      clearTimeout(timer);
      // Browsers finish a smooth scroll well inside this; turning the
      // property off afterwards does not interrupt one already running.
      timer = window.setTimeout(disarm, 2000);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      disarm();
    };
  }, []);

  /**
   * A SECTION HASH IS SPENT ONCE THE PAGE HAS ARRIVED AT IT. After a nav click
   * the URL kept "#projects" while the reader scrolled on, so a reload made
   * the browser jump to Projects before the page could put them back where
   * they were: a flash of the wrong section on every Cmd-R. Once scrolling
   * settles, the hash comes off the address bar (Next's own history state is
   * kept), so a reload simply returns to the reading position.
   */
  useEffect(() => {
    if (!isHome) return;
    let timer = 0;
    const settle = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!window.location.hash) return;
        const { pathname, search } = window.location;
        window.history.replaceState(window.history.state, "", pathname + search);
      }, 250);
    };
    window.addEventListener("scroll", settle, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", settle);
    };
  }, [isHome]);

  return (
    <NavBar
      items={navItems}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    />
  );
}
