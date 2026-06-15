"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollMark } from "@/components/ui/scroll-mark";
import { track } from "@vercel/analytics";

export default function NowSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setSettled(true);
      return;
    }

    const targets = Array.from(
      el.querySelectorAll<HTMLElement>("[data-now-fade]"),
    );
    if (targets.length === 0) {
      setSettled(true);
      return;
    }

    let tween: gsap.core.Tween | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          setSettled(true);
          tween = gsap.fromTo(
            targets,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              stagger: 0.12,
              clearProps: "opacity,transform",
            },
          );
          break;
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, []);

  return (
    <section className="border-t border-black/5 bg-background">
      <div
        ref={rootRef}
        className="mx-auto max-w-2xl px-6 py-28 text-center md:py-36"
      >
        <ScrollMark event="reached_end" />

        <p
          data-now-fade
          className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35"
          style={settled ? undefined : { opacity: 0 }}
        >
          NOW — JUNE 2026
        </p>

        <div
          data-now-fade
          className="mt-10 flex flex-col items-center gap-3"
          style={settled ? undefined : { opacity: 0 }}
        >
          <Link
            href="/projects/book"
            onClick={() => track("project_open", { project: "book", source: "now" })}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-black/80"
          >
            THE BOOK — IN REVIEW, ARRIVING LATE 2026
          </Link>
          <Link
            href="/projects/sole"
            onClick={() => track("project_open", { project: "sole", source: "now" })}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-black/80"
          >
            SOLE — OPEN, FOR FIRST LAUNCHES
          </Link>
          <Link
            href="/projects/superhuman"
            onClick={() => track("project_open", { project: "superhuman", source: "now" })}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/55 transition-colors hover:text-black/80"
          >
            SUPERHUMAN — OPEN, A FEW AT A TIME
          </Link>
        </div>

        <p
          data-now-fade
          className="mt-10 font-serif text-lg italic text-black/55"
          style={settled ? undefined : { opacity: 0 }}
        >
          Two of those doors are open today — if Sole or Superhuman is yours,{" "}
          <a
            href="mailto:tobia@donadon.com?subject=Hi%20Tobia"
            onClick={() => track("write_me", { origin: "now" })}
            className="underline decoration-black/20 underline-offset-4 hover:text-cyan-900"
          >
            write me
          </a>
          .
        </p>

        <p
          data-now-fade
          className="mt-20 font-serif text-sm italic text-black/40"
          style={settled ? undefined : { opacity: 0 }}
        >
          Grazie for reading this far.
        </p>

        <p
          data-now-fade
          className="mx-auto mt-6 max-w-xl font-serif text-2xl italic leading-snug text-black/70 md:text-3xl"
          style={settled ? undefined : { opacity: 0 }}
        >
          This story isn&rsquo;t finished — if you&rsquo;d like to see where it
          goes, it continues here.
        </p>

        <div
          data-now-fade
          className="mt-12 flex flex-col items-center gap-3"
          style={settled ? undefined : { opacity: 0 }}
        >
          <a
            href="/ig/now"
            onClick={() => track("follow_click", { network: "instagram", placement: "now" })}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/55 hover:text-black/80"
          >
            INSTAGRAM — @TOBIA.DONADON — THE LIFE, THE WORK, THE AI
          </a>
          <a
            href="https://www.linkedin.com/in/tobia-donadon"
            target="_blank"
            rel="me noreferrer"
            onClick={() => track("follow_click", { network: "linkedin", placement: "now" })}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/55 hover:text-black/80"
          >
            LINKEDIN — TOBIA DONADON — THE WORK, AND WHAT I&rsquo;M BUILDING
          </a>
        </div>

        <p
          data-now-fade
          className="mt-12 font-serif text-sm italic text-black/40"
          style={settled ? undefined : { opacity: 0 }}
        >
          I post when there&rsquo;s something true to show.
        </p>
      </div>
    </section>
  );
}
