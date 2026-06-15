"use client";

import { useEffect } from "react";

/**
 * Instagram hand-off. Links from in-app browsers (his bio traffic) hit a login
 * wall and the follow dies; this client page deep-links into the IG app, then
 * falls back to the web profile. The [placement] segment (now/footer/about/…)
 * isn't read here — its only job is to make each placement its own pageview in
 * Vercel's Routes panel, so we can see which ask earned the click.
 */
export default function InstagramRedirect() {
  useEffect(() => {
    window.location.href = "instagram://user?username=tobia.donadon";
    const t = setTimeout(() => {
      window.location.replace("https://www.instagram.com/tobia.donadon/");
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="paper-bg flex min-h-screen items-center justify-center px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/40">
        Opening Instagram&hellip;
      </p>
    </main>
  );
}
