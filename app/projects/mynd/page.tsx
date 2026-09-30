import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { VideoFrame } from "@/components/ui/video-frame";
import { ParticleSphere } from "@/components/mynd/particle-sphere";
import { MyndGround } from "@/components/mynd/ground";
import { HandFrame, HandMark } from "@/components/mynd/hand";
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
  url: "https://www.tobiadonadon.com/projects/mynd",
  author: {
    "@type": "Person",
    name: "Tobia Donadon",
    url: "https://www.tobiadonadon.com",
  },
  about: {
    "@type": "SoftwareApplication",
    name: "myynd",
    applicationCategory: "BusinessApplication",
    description:
      "A digital brain a company owns. It brings together the know-how scattered across a business's minds, files and tools, answers questions about it with sources, and runs custom automations on top that save time and make money.",
  },
};


export default function MyndPage() {
  return (
    <MyndGround>
      <main className="min-h-screen" style={{ color: "var(--m-ink)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />

        <BackLink />

        {/* ==================================================================
            1 · THE STAGE THE SPHERE TRAVELS ACROSS.

            Unchanged in choreography: the shell holds the middle of the screen
            while the hero leaves, comes across to the square beside the
            sentence, and breaks there. What changed is what it is made of and
            what it sits on. The ground is no longer painted here; the section
            declares a tint and the whole page moves to it (see ground.tsx).
            ================================================================== */}
        <div data-sphere-stage data-tint="open" className="relative">
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
                  "radial-gradient(ellipse 62% 30% at 50% 50%, rgba(242,238,231,0.72) 0%, rgba(242,238,231,0.42) 52%, rgba(242,238,231,0) 84%)",
              }}
            />

            <div className="relative mx-auto w-full max-w-4xl px-6 pb-32 text-center sm:pb-0">
              {/* NO BLOCK REVEAL. The wipe was a near black slab the width of
                  the headline, and on a page whose whole ground now changes
                  colour as you scroll, a hard black rectangle arriving over the
                  title is the one thing on it that looks like a rendering
                  error. The heading simply arrives. */}
              {/* A step down in size. The old setting ran to 6.4rem, which on
                  a wide screen was four words filling a screen and saying
                  nothing the same words say at two thirds the size. */}
              <h1
                className="font-serif text-[2.9rem] leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]"
                style={{ color: "var(--m-ink)" }}
              >
                A brain your company{" "}
                <span style={{ color: "var(--m-clay)" }}>owns.</span>
              </h1>
              {/* THE ONE LINE A STRANGER NEEDS. The title is a promise with no
                  subject: a business owner arriving from a link could read it
                  and still not know what the thing does. This says it in
                  their terms (their business, their team, their time) and
                  says who is building it, which is also the first hint that
                  it is early. */}
              <p
                className="mx-auto mt-6 max-w-[21rem] text-pretty text-[1.02rem] leading-[1.5] sm:mt-7 sm:max-w-md sm:text-[1.1rem]"
                style={{ color: "rgba(23,19,15,0.78)" }}
              >
                I am building myynd. It learns how your business runs, then
                takes the repetitive work off your&nbsp;team.
              </p>
              <p
                className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.16em]"
                style={{ color: "rgba(23,19,15,0.5)" }}
              >
                In development
              </p>
            </div>
          </header>

          {/* What it is, in one sentence, and the square the shell lands in. */}
          <PlainStatement />
        </div>

        {/* ==================================================================
            2 · THE PROBLEM.

            The card is the unit now. A hand drawn box, a flat mark at the top
            of it, and the writing under that. Nothing on this page is
            separated by a hairline any more: things are separated by being
            different objects on the same ground.
            ================================================================== */}
        <section
          aria-labelledby="myynd-problem"
          data-tint="problem"
          className="px-6 py-24 lg:py-32"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <h2
                  id="myynd-problem"
                  className="max-w-[18ch] text-balance font-serif text-[2rem] leading-[1.05] tracking-[-0.03em] md:text-[2.6rem]"
                  style={{ color: "var(--m-ink)" }}
                >
                  Everything the company knows is somewhere.{" "}
                  <span className="block" style={{ color: "var(--m-clay)" }}>
                    Just not anywhere in particular.
                  </span>
                </h2>
                <p
                  className="mt-5 max-w-md text-pretty text-[1rem] leading-[1.65] md:mt-6 md:text-[0.95rem] md:leading-[1.75]"
                  style={{ color: "rgba(23,19,15,0.7)" }}
                >
                  Pricing logic, client history, why that one client gets a
                  discount. It lives in people, not in files, and half of it
                  goes home every&nbsp;night.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div
                  className="relative h-full px-6 py-6 sm:px-7 sm:py-8"
                  style={{ background: "var(--m-cream)" }}
                >
                  <HandFrame id="problem" color="var(--m-ink)" weight={1.6} />
                  <div className="relative">
                    <span
                      className="font-mono text-[0.68rem] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(23,19,15,0.5)" }}
                    >
                      Where it lives today
                    </span>
                    {/* On a phone the card is a full screen of coloured squares
                        if the mark runs the whole width. Held to a strip so it
                        reads as the picture beside the words, not a page. */}
                    <HandMark
                      id="problem"
                      name="scatter"
                      className="mx-auto mt-4 h-auto w-full max-w-[12.5rem] sm:mt-6 sm:max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="-mx-6 mt-12 sm:mx-0 lg:mt-20">
              <SpillMarquee />
            </div>
          </div>
        </section>

        {/* ==================================================================
            3 · WHERE IT IS. The honest beat, in the order that earns trust:
            what is true (it works), what is not yet (nobody pays for it),
            and what the reader gets instead (the four steps, next). An
            admission on its own costs credibility; followed by what IS there,
            it buys it. The heading used to say "How it works." over a photo
            of two people on a boat, which promised a film that is not there.
            ================================================================== */}
        <section
          aria-labelledby="myynd-walkthrough"
          data-tint="work"
          className="px-6 py-20 md:py-32"
        >
          <div className="mx-auto w-full max-w-5xl">
            <Rise>
              <h2
                id="myynd-walkthrough"
                className="text-balance font-serif text-[2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.6rem]"
                style={{ color: "var(--m-ink)" }}
              >
                It works.{" "}
                <span className="block" style={{ color: "var(--m-clay)" }}>
                  No customers&nbsp;yet.
                </span>
              </h2>

              {/* NO MARK AND NO BOX ON THIS ONE.
                  A drawn play button beside a film is the page miming what the
                  film already is, and a hand drawn frame around a rectangle
                  that already has its own edge is two frames. The film is the
                  only photographic thing on the page and it does not need
                  help being noticed. What is left is the warmth behind it,
                  which is salmon rather than the blue that was fighting the
                  picture for attention. */}
              <div className="mt-8 md:mt-10">
                <VideoFrame
                  bare
                  poster="/trail/trail-04.jpg"
                  posterAlt="Tobia and a friend on a boat under a limestone cliff, laughing."
                  caption="Walkthrough of the working product"
                  accent="var(--m-salmon)"
                />
              </div>

              <p
                className="mt-7 max-w-lg text-pretty text-[1rem] leading-[1.65] md:mt-8 md:text-[0.95rem] md:leading-[1.75]"
                style={{ color: "rgba(23,19,15,0.7)" }}
              >
                I am building it in the open, so there are no logos on this
                page and no case study with a percentage in it. Here is what it
                does instead, in the order it does&nbsp;it.
              </p>
            </Rise>
          </div>
        </section>

        {/* ==================================================================
            4 · THE FOUR STEPS.
            ================================================================== */}
        <StepsLine />

        {/* ==================================================================
            5 · CLOSE. The one dark ground, and it is the last thing. It both
            declares its tint and paints itself, so a reader with no JavaScript
            still gets a dark close rather than cream type on cream.
            ================================================================== */}
        <section
          aria-labelledby="myynd-close"
          data-tint="close"
          data-tint-dark="1"
          className="px-6 pb-32 pt-24 lg:py-36"
          style={{ background: "var(--m-green)" }}
        >
          <Rise className="mx-auto max-w-2xl text-center">
            <h2
              id="myynd-close"
              className="font-serif text-[2.1rem] leading-[1.04] tracking-[-0.03em] md:text-[3rem]"
              style={{ color: "var(--m-cream)" }}
            >
              Start with one conversation.{" "}
              <span className="block" style={{ color: "var(--m-gold)" }}>
                Thirty minutes.
              </span>
            </h2>
            {/* THE DOOR OUT IS AN EMAIL NOW. It used to send people to
                soleagency.co, which (checked 2026-09-28) is a parked GoDaddy
                page. A business owner who taps the one button on this page
                and lands on a domain for sale does not come back. The real
                next step for something in development is a conversation with
                the person building it, so that is what the button is. */}
            <p
              className="mx-auto mt-6 max-w-[22rem] text-pretty text-[1rem] leading-[1.65] sm:max-w-md md:text-[0.95rem] md:leading-[1.75]"
              style={{ color: "rgba(242,238,231,0.8)" }}
            >
              Tell me how your company runs. Thirty minutes over a coffee, and
              you know what we would automate&nbsp;first.
            </p>

            <a
              href="mailto:tobia@donadon.com?subject=myynd%3A%20my%2030%20minutes"
              className="mt-10 inline-flex min-h-[3.25rem] items-center gap-2.5 rounded-full px-8 py-4 text-[1rem] leading-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                background: "var(--m-clay)",
                color: "var(--m-cream)",
                outlineColor: "var(--m-cream)",
              }}
            >
              Book my 30 minutes
              <Mail aria-hidden className="h-4 w-4" />
            </a>
            <p
              className="mt-4 font-mono text-[0.68rem] tracking-[0.08em]"
              style={{ color: "rgba(242,238,231,0.6)" }}
            >
              Opens an email to tobia@donadon.com
            </p>
          </Rise>
        </section>
      </main>
    </MyndGround>
  );
}
