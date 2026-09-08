"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Galaxy } from "@/components/ui/galaxy";
import { ConstructStar } from "@/components/superhuman/construct-star";

/** Three related chapters. Native sticky positioning keeps scroll in the reader's hands. */
export function ProjectsSection() {
  const liveRef = useRef(1);
  return (
    <section id="projects" aria-labelledby="projects-title" className="project-chapters bg-ink ink-grain relative">
      <div aria-hidden className="pointer-events-none sticky top-0 h-[100svh]">
        <Galaxy progressRef={liveRef} className="absolute inset-0" />
      </div>
      <div className="relative -mt-[100svh] px-6 pb-24 md:px-12 md:pb-36">
        <header className="project-introduction mx-auto max-w-6xl py-24 md:py-32">
          <h2 id="projects-title" className="max-w-[15ch] text-[clamp(2.6rem,6vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-paper">
            Better tools.<br />Deeper questions.
          </h2>
          <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-[#cfe9ee]">
            I build to learn, share what works, and write about what I still don’t understand. These are the places that work lives.
          </p>
        </header>

        <div className="project-stack mx-auto max-w-6xl">
          <article className="project-layer project-layer-construct" aria-labelledby="construct-title">
            <div className="project-layer-copy">
              <p className="project-purpose">Put it into practice</p>
              <h3 id="construct-title">Construct</h3>
              <p>Use AI to build something of your own. The tools, skills, and playbooks I use, with enough detail to try them yourself.</p>
              <div className="project-actions">
                <Link className="project-cta" href="/projects/construct/material">Explore free material <ArrowUpRight aria-hidden size={18} /></Link>
                <Link className="project-secondary" href="/projects/construct">Inside Construct <ArrowUpRight aria-hidden size={16} /></Link>
              </div>
            </div>
            <div className="project-art" aria-hidden>
              <ConstructStar id="homepage-project" className="h-full w-full" />
              <span className="project-art-caption">learn → build → share</span>
            </div>
          </article>

          <article className="project-layer project-layer-myynd" aria-labelledby="myynd-title">
            <div className="project-layer-copy">
              <p className="project-purpose">A digital brain for a business</p>
              <h3 id="myynd-title">Myynd</h3>
              <p>A company’s knowledge is scattered across people, files, and tools. I’m building a brain that brings it together, with automations that put it to work.</p>
              <div className="project-actions">
                <Link className="project-cta" href="/projects/mynd">Explore Myynd <ArrowUpRight aria-hidden size={18} /></Link>
                <span className="project-stage">In development</span>
              </div>
            </div>
            <div className="project-art brain-art" aria-hidden>
              <svg viewBox="0 0 320 320" fill="none">
                <circle cx="160" cy="160" r="116" />
                <ellipse cx="160" cy="160" rx="70" ry="116" />
                <ellipse cx="160" cy="160" rx="116" ry="44" />
                <path d="M44 160h232M160 44v232M78 78l164 164M78 242 242 78" />
                <circle className="brain-core" cx="160" cy="160" r="25" />
                <circle cx="78" cy="78" r="6" /><circle cx="242" cy="242" r="6" />
              </svg>
              <span className="project-art-caption">knowledge → action</span>
            </div>
          </article>

          <article className="project-layer project-layer-book" aria-labelledby="book-title">
            <div className="project-layer-copy">
              <p className="project-purpose">The inner world</p>
              <h3 id="book-title">The Book</h3>
              <p>What does it mean to be conscious? A book about attention, creativity, and the experience of being human. Still being written, one question at a time.</p>
              <div className="project-actions">
                <Link className="project-cta" href="/projects/book">Meet the book <ArrowUpRight aria-hidden size={18} /></Link>
                <span className="project-stage">In progress</span>
              </div>
            </div>
            <div className="project-art book-art" aria-hidden>
              <span className="book-question">What<br />is it to<br /><i>be?</i></span>
              <span className="project-art-caption">a question worth staying with</span>
            </div>
          </article>
        </div>
        <p className="mx-auto mt-16 max-w-6xl text-base leading-relaxed text-[#cfe9ee]">
          Also taking shape: digital twins and Everwave. More here as the work develops.
        </p>
      </div>
    </section>
  );
}
