"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Layers, User, PenLine } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";

// Root-relative hashes so the nav also works from subpages (/projects/…).
const navItems = [
  { name: "Home", url: "/#home", icon: Home },
  { name: "Projects", url: "/#projects", icon: Layers },
  { name: "About", url: "/#about", icon: User },
  { name: "Thoughts", url: "/#thoughts", icon: PenLine },
];

export function SiteNav() {
  const pathname = usePathname();
  // The nav stays hidden until the loader finishes, then fades in. The
  // intro only runs on the homepage — everywhere else (direct loads of
  // /projects/*, the 404 page) "intro:done" never fires, so reveal on
  // mount instead of waiting out the fallback.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(true);
      return;
    }
    const reveal = () => setVisible(true);
    window.addEventListener("intro:done", reveal);
    // Fallback in case the intro event is missed (e.g. reduced-motion skip).
    // Longer than the loader so it never reveals the nav mid-intro.
    const fallback = setTimeout(reveal, 5000);
    return () => {
      window.removeEventListener("intro:done", reveal);
      clearTimeout(fallback);
    };
  }, [pathname]);

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
