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
