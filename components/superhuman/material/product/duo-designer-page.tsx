import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { DUO_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { DuoUnfold } from "./duo-designer-unfold";
import { DuoFoldFace, FOLD_MS } from "./duo-designer-cta";
import { DuoFloats, DuoWall } from "./duo-designer-wall";

/**
 * DUO DESIGNER: apps for iPhone Duo, Apple's foldable iPhone. ROUND 3.
 *
 * Tobia's notes on round 2: no impactful header, no loader, too long, the
 * CSS phone's screens looked squished at the borders, and "I hate" the
 * animation. So this page is three things, Apple-style, on Apple's white:
 *
 * 1. THE OPENING. A thin vertical line, the fold, opens into the page
 *    (.dd-loader, pure CSS, under a second, never takes a click). Then the
 *    name, huge, over Apple's own unfold film (duo-designer-unfold.tsx),
 *    blended into the page with no frame (Tobia: "of course not in a video
 *    frame").
 * 2. WHAT IT MAKES. Three photos the skill's own pipeline made (photo.mjs):
 *    the hands, light and titanium by GPT, the screens designed by GPT from
 *    Tobia's reference shots, each with one short line.
 * 3. THE CLAIM (#claim, the rack pill's target): three steps and the one
 *    FreeClaim on the page, newsletter consent as fine print.
 *
 * Images are versioned (-v3): next/image caches by URL.
 */

const S = (name: string) => `/shop/duo-designer/${name}`;
const MUTED = "text-[#6e6e73]";
const H2 = "dd-display text-balance text-[clamp(2.5rem,7vw,5rem)]";

const SHOTS = {
  closed: {
    src: S("closed-v3.webp"),
    alt: "A hand holding iPhone Duo closed, its outer screen showing Supper, a cookbook, in cooking mode: step 3 of 6 and a timer.",
    w: 1024,
    h: 1326,
  },
  open: {
    src: S("open-v3.webp"),
    alt: "Two hands holding iPhone Duo open: a full-bleed photo of lemon risotto on the left page, the recipe and its ingredients on the right.",
    w: 1536,
    h: 934,
  },
  book: {
    src: S("book-v3.webp"),
    alt: "iPhone Duo standing half open like a book: Procida's harbour full bleed on the left page, a three-day guide on the right.",
    w: 1136,
    h: 900,
  },
};

const STEPS: React.ReactNode[] = [
  <>Leave your email, or sign in and it downloads now.</>,
  <>
    Unzip it, open the folder in Claude Code or Codex, and type <q className="font-semibold text-[#1d1d1f]">hi</q>.
  </>,
  <>
    Ask for <q className="font-semibold text-[#1d1d1f]">my app, ready for iPhone Duo</q>.
  </>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

function Caption({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figcaption className="mx-auto mt-5 max-w-[30rem] px-4 text-center md:mt-6">
      <span className="block text-[clamp(1.2rem,2vw,1.45rem)] font-semibold tracking-[-0.02em]">{title}</span>
      <span className={`mt-1.5 block text-pretty text-[1rem] leading-[1.45] md:text-[1.08rem] ${MUTED}`}>{children}</span>
    </figcaption>
  );
}

export function DuoDesignerPage() {
  return (
    <main className="dd-page relative overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* The opening: the fold, a hairline, opens into the page. Never takes a click. */}
      <div className="dd-loader" aria-hidden>
        <span className="dd-loader__half dd-loader__half--l" />
        <span className="dd-loader__half dd-loader__half--r" />
        <span className="dd-loader__fold" />
      </div>

      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. THE HEADER: the name, huge, over Apple's own unfold. */}
      <section aria-labelledby="dd-title" className="dd-hero relative">
        <DuoFloats />
        <div className="dd-hero__text mx-auto max-w-[72rem] px-4 text-center sm:px-8">
          <p className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[#c9261b] sm:text-[1.05rem]">
            Free skill for Claude Code and Codex
          </p>
          <h1 id="dd-title" className="dd-display dd-hero__title mt-2">
            Duo Designer
          </h1>
          <p className="mx-auto mt-4 max-w-[52ch] text-balance text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
            Most apps will arrive on iPhone&nbsp;Duo stretched. <span className={MUTED}>Yours will unfold.</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="#claim" className="dd-cta dd-fold-btn">
              <DuoFoldFace label="Get it free" scrollTo="claim" banner={false} />
            </a>
          </div>
        </div>
        <div className="dd-hero__film">
          <DuoUnfold />
        </div>
        <DuoWall />
        <p className={`mx-auto mt-5 max-w-[46ch] px-4 text-center text-[0.95rem] leading-[1.45] ${MUTED}`}>
          Designs from the skill&rsquo;s first step: GPT draws each app from your reference shots, native and
          made for both screens.
        </p>
      </section>

      {/* 2. WHAT IT MAKES: three photos the skill made, one line each. */}
      <section aria-labelledby="dd-makes" className="relative pt-14 md:pt-16">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-8">
          <h2 id="dd-makes" className={`${H2} mx-auto max-w-[13ch]`}>
            Both screens. And the fold between.
          </h2>
        </div>

        <figure className="m-0 mt-10 md:mt-14">
          <div className="dd-shot dd-shot--wide mx-auto max-w-[76rem]">
            <Image
              src={SHOTS.open.src}
              alt={SHOTS.open.alt}
              width={SHOTS.open.w}
              height={SHOTS.open.h}
              sizes="(min-width: 1216px) 76rem, (min-width: 768px) 100vw, 130vw"
              className="block h-auto w-full"
            />
          </div>
          <Caption title="Designs your app for iPhone Duo.">
            The outer screen for one hand, the inner spread for two, and what moves as it unfolds.
          </Caption>
        </figure>

        <div className="mx-auto mt-14 grid max-w-[76rem] grid-cols-1 gap-x-6 gap-y-14 px-4 sm:px-8 md:mt-20 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-end">
          <figure className="m-0">
            <div className="dd-shot mx-auto max-w-[24rem] md:max-w-none">
              <Image
                src={SHOTS.closed.src}
                alt={SHOTS.closed.alt}
                width={SHOTS.closed.w}
                height={SHOTS.closed.h}
                sizes="(min-width: 768px) 28rem, 24rem"
                className="block h-auto w-full"
              />
            </div>
            <Caption title="Makes the app you have Duo-ready.">
              Reads your SwiftUI, UIKit, Expo, React Native or Flutter code against Apple&rsquo;s rules, and fixes what
              it finds.
            </Caption>
          </figure>
          <figure className="m-0">
            <div className="dd-shot">
              <Image
                src={SHOTS.book.src}
                alt={SHOTS.book.alt}
                width={SHOTS.book.w}
                height={SHOTS.book.h}
                sizes="(min-width: 768px) 44rem, 100vw"
                className="block h-auto w-full"
              />
            </div>
            <Caption title="Shoots it like Apple would.">
              Every photo here was made by the skill, on a ChatGPT plan: the hands and titanium generated, the screens
              placed in.
            </Caption>
          </figure>
        </div>
      </section>

      {/* 3. THE CLAIM: three steps and the button. The rack pill links here. */}
      <section id="claim" aria-labelledby="dd-get" className="relative scroll-mt-24 pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-8">
          <h2 id="dd-get" className={`${H2} mx-auto max-w-[12ch]`}>
            Free. Ready for October&nbsp;23.
          </h2>
          <ol className="mx-auto mt-10 max-w-[32rem] list-none border-b border-[rgba(0,0,0,0.1)] p-0 text-left">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-baseline gap-5 border-t border-[rgba(0,0,0,0.1)] py-4 text-[1.04rem] leading-[1.45]"
              >
                <span className="w-5 shrink-0 font-semibold">{i + 1}</span>
                <span className={MUTED}>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-9 flex justify-center">
            <FreeClaim
              productId={PRODUCT.id}
              reveal="Get it free"
              tone="ink"
              fine
              prompt={false}
              face={<DuoFoldFace label="Get it free" />}
              hold={FOLD_MS}
              buttonClassName="dd-fold-btn"
            />
          </div>
          <p className={`mx-auto mt-8 max-w-[50ch] text-balance text-[0.85rem] leading-[1.5] ${MUTED}`}>
            Needs Claude Code (a paid Claude plan) or Codex (a ChatGPT plan), and Node.js 18+. A Mac with Xcode 27.1
            for the simulator. No tool can promise App Review approval: it tells you what it checked.
          </p>
        </div>
      </section>
    </main>
  );
}
