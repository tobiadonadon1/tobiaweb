import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import TypingEffect from "@/components/ui/typing-effect";
import { VideoSlot } from "@/components/ui/video-slot";
import { PhotoSlideshow } from "@/components/ui/photo-slideshow";

export const metadata: Metadata = {
  title: "The Book",
  description:
    "A long book about minds — AI, consciousness, and what we become. Written in public, arriving late 2026.",
};

// The four currents the book runs through.
const CURRENTS: [string, string][] = [
  ["Lifestyle", "how a life actually gets built — day after ordinary day."],
  ["Spirituality", "the parts of being human a model can’t reach."],
  ["Creativity", "making things as a way of thinking, not decorating."],
  ["Mindset", "the quiet discipline running underneath all of it."],
];

// What a reader carries away — honest, not a feature list.
const TAKEAWAYS = [
  "A way to think about AI that is neither hype nor doom.",
  "The questions worth sitting with — not a stack of tidy answers.",
  "Permission to build slowly, and on purpose.",
  "A companion for your own figuring-out.",
];

const SLIDES = [
  { src: "/trail/trail-07.jpg" },
  { src: "/trail/trail-02.jpg" },
  { src: "/trail/trail-04.jpg" },
  { src: "/trail/trail-06.jpg" },
  { src: "/trail/trail-05.jpg" },
  { src: "/trail/trail-01.jpg" },
];

function Movement({
  kicker,
  heading,
  children,
}: {
  kicker: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
        {kicker}
      </span>
      <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#0a0a0a] md:text-4xl">
        {heading}
      </h2>
      <div className="mt-5 max-w-2xl text-base leading-relaxed text-black/60 md:text-lg">
        {children}
      </div>
    </section>
  );
}

export default function BookPage() {
  return (
    <main className="paper-bg min-h-screen px-6 pb-28 pt-10 text-[#0a0a0a]">
      <div className="page-rise mx-auto w-full max-w-3xl">
        <Link
          href="/#projects"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-black/40 transition-colors hover:text-black/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        {/* ---- Title ---- */}
        <header className="pt-16">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
            <span>Project · 01</span>
            <span className="h-1 w-1 rounded-full bg-black/25" />
            <span>In review</span>
          </div>
          <h1 className="mt-6 font-serif text-6xl leading-[1.02] tracking-tight md:text-8xl">
            The Book
          </h1>
          {/* The typing accent — the currents, typing themselves out. */}
          <div className="mt-5 h-6">
            <TypingEffect
              texts={["on lifestyle.", "on spirituality.", "on creativity.", "on mindset."]}
              typingSpeed={62}
              rotationInterval={1700}
              className="justify-start text-sm font-normal tracking-wide text-black/40"
            />
          </div>
          <p className="mt-7 max-w-xl font-serif text-2xl italic leading-snug text-black/55 md:text-3xl">
            A long book about minds — the ones we’re building, and the ones we
            already are.
          </p>
        </header>

        {/* ---- The short film ---- */}
        <div className="mt-16">
          <VideoSlot
            poster="/trail/trail-07.jpg"
            label="Why I’m writing this — a short film, soon"
          />
        </div>

        {/* ---- What it is + the photographs beneath ---- */}
        <div className="mt-20 space-y-8">
          <Movement kicker="What it is" heading="Long-form, on purpose">
            A book about artificial intelligence, consciousness, and what we
            become when the two start to blur. Not a hot take, not a manifesto —
            a slow attempt to think clearly about the strangest decade any of us
            will live through. I’m writing it because I couldn’t find the book I
            wanted to read.
          </Movement>
          <PhotoSlideshow slides={SLIDES} />
        </div>

        {/* ---- The four currents ---- */}
        <section className="mt-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
            What it runs through
          </span>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 sm:grid-cols-2">
            {CURRENTS.map(([name, gloss], i) => (
              <div key={name} className="bg-background p-7 md:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-black/30">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-2xl tracking-tight text-[#0a0a0a]">
                    {name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/55">
                  {gloss}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- What you'll take from it ---- */}
        <section className="mt-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
            What you’ll take from it
          </span>
          <ul className="mt-7 space-y-4">
            {TAKEAWAYS.map((t) => (
              <li key={t} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0b1f3a]/55"
                />
                <span className="font-serif text-xl leading-snug text-black/70 md:text-2xl">
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- How it's written ---- */}
        <div className="mt-24">
          <Movement kicker="How it’s written" heading="Slowly, and in public">
            The chapters and the notes behind them are being written in the
            open, first drafts included; pieces surface in my{" "}
            <Link
              href="/#thoughts"
              className="underline decoration-black/20 underline-offset-4 transition-colors hover:text-black/80"
            >
              Thoughts
            </Link>{" "}
            as they form. Writing in public keeps me honest — you’ll watch the
            ideas change as I do. Some of it will be wrong on arrival, and
            that’s part of the method.
          </Movement>
        </div>

        {/* ---- The close: facts → follow → list → thanks → exit ---- */}
        <div className="mt-24 border-t border-black/10 pt-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.32em] text-black/40">
            <span>Written in public</span>
            <span className="h-1 w-1 rounded-full bg-black/20" />
            <span>In review</span>
            <span className="h-1 w-1 rounded-full bg-black/20" />
            <span>Arriving late 2026</span>
          </div>

          <p className="mt-8 max-w-xl font-serif text-xl italic leading-snug text-black/55 md:text-2xl">
            Following along is how you read it as it’s written — the chapters
            and the thinking on{" "}
            <a
              href="https://www.linkedin.com/in/tobia-donadon"
              target="_blank"
              rel="me noreferrer"
              className="not-italic underline decoration-black/25 underline-offset-4 transition-colors hover:text-cyan-900"
            >
              LinkedIn
            </a>
            , the life around the book on{" "}
            <a
              href="https://www.instagram.com/tobia.donadon/"
              target="_blank"
              rel="me noreferrer"
              className="not-italic underline decoration-black/25 underline-offset-4 transition-colors hover:text-cyan-900"
            >
              Instagram
            </a>
            .
          </p>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-black/55">
            If you want the first chapter the day it exists, write me{" "}
            <a
              href="mailto:tobia@donadon.com?subject=First%20chapter"
              className="font-mono text-sm uppercase tracking-[0.15em] text-cyan-900 underline decoration-cyan-900/30 underline-offset-4 hover:decoration-cyan-900/70"
            >
              “first chapter”
            </a>{" "}
            — that’s the whole list.
          </p>

          <p className="mt-10 font-serif text-lg italic text-black/40">
            Thank you for reading this far.
          </p>

          <div className="mt-12 flex flex-col gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/projects/sole"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/45 transition-colors hover:text-black/80"
            >
              building something of your own? → Sole is open
            </Link>
            <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
              <Link href="/#projects" className="hover:text-black/70">
                All projects
              </Link>
              <a
                href="mailto:tobia@donadon.com?subject=Hi%20Tobia%20%E2%80%94%20Book"
                className="inline-flex items-center gap-1 hover:text-black/70"
              >
                Write me <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
