import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { BlockReveal } from "@/components/ui/block-reveal";
import { VideoFrame } from "@/components/ui/video-frame";
import { ParticleSphere } from "@/components/mynd/particle-sphere";
import { PaperDrift } from "@/components/mynd/paper-drift";
import { PlainStatement } from "@/components/mynd/plain-statement";
import { Rise } from "@/components/mynd/rise";
import { SpillMarquee } from "@/components/mynd/spill-marquee";
import { StepsLine } from "@/components/mynd/steps-line";

const DESCRIPTION =
  "I am building myynd: it brings the know-how scattered across a company's minds and desktops into one brain the business owns, then builds automations on top that save time and make money.";

export const metadata: Metadata = {
  title: "myynd",
  description: DESCRIPTION,
  alternates: { canonical: "/projects/mynd" },
  openGraph: {
    title: "myynd",
    description: DESCRIPTION,
    url: "/projects/mynd",
    type: "article",
    images: [
      {
        url: "/trail/trail-04.jpg",
        width: 1000,
        height: 667,
        alt: "myynd, a digital brain for companies, built in the open by Tobia Donadon",
      },
    ],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "myynd",
  description: DESCRIPTION,
  url: "https://tobiadonadon.com/projects/mynd",
  author: {
    "@type": "Person",
    name: "Tobia Donadon",
    url: "https://tobiadonadon.com",
  },
  about: {
    "@type": "SoftwareApplication",
    name: "myynd",
    applicationCategory: "BusinessApplication",
    url: "https://www.soleagency.co/",
    description:
      "A digital brain a company owns. It brings together the know-how scattered across a business's minds, files and tools, answers questions about it with sources, and runs custom automations on top that save time and make money.",
  },
};

const CREAM = { background: "var(--myynd-cream)" };

export default function MyndPage() {
  return (
    <main className="paper-bg min-h-screen text-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <BackLink />

      {/* =====================================================================
          1 · THE STAGE THE SPHERE TRAVELS ACROSS: the hero and the sentence
          under it, treated as one scene.

          The shell of particles used to sit still behind the headline. It is
          on a sticky layer now that runs the whole length of this block, so it
          holds the middle of the screen while the hero leaves, comes across to
          the square beside the sentence, and breaks there. All of it is a
          function of one scroll progress, so scrolling back reassembles it.
          ===================================================================== */}
      <div data-sphere-stage className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="sticky top-0 h-[100svh] w-full">
            <ParticleSphere />
          </div>
        </div>

        <header className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden">
          {/* A clearing in the middle of the shell, so the type keeps its
              contrast without the particles having to be dimmed everywhere. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 42% 22% at 50% 50%, rgba(250,248,242,0.5) 0%, rgba(250,248,242,0.28) 50%, rgba(250,248,242,0) 82%)",
            }}
          />

          <div className="relative mx-auto w-full max-w-4xl px-6 pb-32 text-center sm:pb-0">
            <BlockReveal blockColor="#0b1f3a" start="top 88%">
              <h1
                className="font-serif text-[3.3rem] leading-[0.96] tracking-tight sm:text-7xl lg:text-[6.4rem]"
                style={{ color: "var(--ink)" }}
              >
                A brain your company{" "}
                <span style={{ color: "var(--myynd-terracotta)" }}>owns.</span>
              </h1>
            </BlockReveal>
          </div>
        </header>

        {/* What it is, in one sentence, and the square the shell lands in. */}
        <PlainStatement />
      </div>

      {/* =====================================================================
          2 · THE PROBLEM. The ground changes to cream: sections are cut apart
          by the paper they sit on now, not by a hairline across the page.
          ===================================================================== */}
      <section aria-labelledby="myynd-problem" style={CREAM}>
        <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2
                id="myynd-problem"
                className="font-serif text-[2.1rem] leading-[1.05] tracking-tight md:text-[3.1rem]"
                style={{ color: "var(--ink)" }}
              >
                Everything the company knows is somewhere.{" "}
                <span
                  className="block"
                  style={{ color: "var(--myynd-terracotta)" }}
                >
                  Just not anywhere in particular.
                </span>
              </h2>
              <p
                className="mt-6 max-w-md text-[15px] leading-[1.8] md:text-base"
                style={{ color: "rgba(36,24,19,0.68)" }}
              >
                Pricing logic, client history, twenty years of judgment. Alive
                in a few heads, and half of it goes home every night.
              </p>
            </div>
            {/* Pulled apart by the scroll, never by the cursor. */}
            <div className="lg:col-span-7">
              <PaperDrift />
            </div>
          </div>

          <div className="mt-14 lg:mt-20">
            <SpillMarquee />
          </div>
        </div>
      </section>

      {/* =====================================================================
          3 · HOW IT WORKS. The film carries the proof on its own; nothing is
          written under it.

          Ground: back to paper. The sections on this page are cut apart by
          the paper they sit on, so the sequence alternates
          paper, cream, paper, cream, forest.
          ===================================================================== */}
      <section aria-labelledby="myynd-walkthrough">
        <div className="mx-auto w-full max-w-5xl px-6 py-24 md:py-32">
          <Rise>
            <h2
              id="myynd-walkthrough"
              className="font-serif text-[2.1rem] leading-[1.05] tracking-tight md:text-[3.1rem]"
              style={{ color: "var(--ink)" }}
            >
              How it works.
            </h2>
            <div className="mt-10">
              <VideoFrame
                bare
                poster="/trail/trail-04.jpg"
                posterAlt="Tobia and a friend on a boat under a limestone cliff, laughing."
                caption="Walkthrough of the working product"
                accent="var(--myynd-terracotta)"
              />
            </div>
          </Rise>
        </div>
      </section>

      {/* =====================================================================
          4 · THE FOUR STEPS, all four on screen, hung off one unbroken rule.
          Cream, so it separates from the film above it.
          ===================================================================== */}
      <StepsLine />

      {/* =====================================================================
          5 · CLOSE. The one dark band on the page, and it is the last thing.
          ===================================================================== */}
      <section
        aria-labelledby="myynd-close"
        className="px-6 py-28 lg:py-36"
        style={{ background: "var(--myynd-forest)" }}
      >
        <Rise className="mx-auto max-w-2xl text-center">
          <h2
            id="myynd-close"
            className="font-serif text-[2.4rem] leading-[1.03] tracking-tight md:text-[3.4rem]"
            style={{ color: "var(--myynd-cream)" }}
          >
            It has its own home.{" "}
            <span
              className="block"
              style={{ color: "var(--myynd-terracotta)" }}
            >
              Go and use it.
            </span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-md text-[15px] leading-[1.8] md:text-base"
            style={{ color: "rgba(239,232,224,0.72)" }}
          >
            myynd lives at soleagency.co. Thirty minutes over a coffee, and
            you know what we would automate first.
          </p>

          <a
            href="https://www.soleagency.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] leading-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              background: "var(--myynd-terracotta)",
              color: "var(--myynd-cream)",
              outlineColor: "var(--myynd-cream)",
            }}
          >
            Visit myynd
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Rise>
      </section>
    </main>
  );
}
