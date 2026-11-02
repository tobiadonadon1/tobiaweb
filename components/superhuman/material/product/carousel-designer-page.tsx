import Image from "next/image";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { CAROUSEL_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { CarouselDeck } from "./carousel-designer-deck";
import { CarouselDesignerLoader } from "./carousel-designer-loader";
import "./carousel-designer.css";

/**
 * CAROUSEL DESIGNER, a free skill for Claude Code that writes and designs
 * social media carousels that sell, on what the research says converts.
 *
 * THE LOOK (Tobia, 2026-11-02, second pass): "a little more colourful, more
 * shapes, less text, especially in the subtitles", and catchier examples
 * "with the colour, more image, not so much text". The page now reads like
 * the skill's "pop" look: flat bands of colour (ink, peach, indigo, cobalt),
 * big flat shapes, one line under each headline, and the real slides as the
 * pictures.
 *
 * EVERYTHING SHOWN IS REAL OUTPUT: the feed film, the deck, the covers and
 * the looks are what the skill rendered. The example is an ad for Higgsfield,
 * the AI creative suite (Tobia, third pass: "we're advertising Higgsfield"):
 * a product-led ad, its own showcase work card after card (from its
 * homepage), one promise each, 25M+ creators from its site, "Start creating".
 */

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--cd-display", display: "swap", axes: ["opsz"] });
const text = Inter({ subsets: ["latin"], variable: "--cd-text", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "cd-close";
const S = (name: string) => `/shop/carousel-designer/${name}`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DesignApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs(PRODUCT.href) },
};

/** The deck on the page: the slides as rendered, with the alt text the skill wrote for them. */
const DECK = [
  "Cover: a young man by the sea with a live octopus on his head, made with Higgsfield. None of this was filmed.",
  "A giant woman crouches over a drift track as a tiny race car spins smoke, a frame from a Seedance 2.5 video. Cinematic video from one prompt.",
  "A Vazu dragon lychee soda can with lychees and a splash, made with Marketing Studio. Your product, ready to post.",
  "Glossy pink lips in macro, a frame from a 30-second lip gloss commercial made with Seedance 2.5. A 30-second spot, no studio.",
  "A poster: two cows look into a cardboard box, headline Out of the box, every word crisp. Made with GPT Image 2. 4K posters, text and all.",
  "Six women in red lie in a circle, a frame from a cherry drink commercial made with Seedance 2.5. 25M+ people already create with Higgsfield; 300M+ videos made.",
  "Make your first ad today. Start creating at higgsfield.ai. Seedance, Kling, GPT Image and more, in one place. Four more Higgsfield images.",
].map((alt, i) => ({ src: S(`ad-${String(i + 1).padStart(2, "0")}-v2.webp`), alt }));

const FACTS: { title: string; body: string; source: string }[] = [
  { title: "Slide 2 is a second cover.", body: "Instagram shows it again to people who didn't swipe.", source: "Adam Mosseri, Oct 2024" },
  { title: "Sends reach new people.", body: "They weigh most for people who don't follow you.", source: "Adam Mosseri, Jan 2025" },
  { title: "One ask converts.", body: "One DM button: 32%. Three buttons: 2%.", source: "Inrō, 798k conversations" },
  { title: "The cover keeps its promise.", body: "Say six, show six. A script counts.", source: "Instagram guidelines" },
];

const ASKS = ["What it sells", "Who it's for", "What they should do", "One real result"];

const READY = ["Every size", "LinkedIn PDF", "Caption", "Alt text", "DM script", "How to post", "Straight to Canva"];

const STEPS: React.ReactNode[] = [
  <>Get it free. It downloads at once.</>,
  <>
    Open a terminal in the folder, type <q className="font-bold">claude</q>, then <q className="font-bold">hi</q>.
  </>,
  <>
    Type <q className="font-bold">make a carousel</q>.
  </>,
];

/** A soft ring, the way the calm pop look draws its shapes. Decoration only. */
function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="14" />
    </svg>
  );
}

export function CarouselDesignerPage() {
  return (
    <main className={`cd-page ${display.variable} ${text.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <CarouselDesignerLoader
        cards={[
          { src: S("ad-05-v2.webp"), bg: "#0F0E13" },
          { src: S("ad-03-v2.webp"), bg: "#0F0E13" },
          { src: S("ad-06-v2.webp"), bg: "#0F0E13" },
          { src: S("ad-07-v2.webp"), bg: "#F2785C" },
          { src: S("ad-01-v2.webp"), bg: "#0F0E13" },
        ]}
      />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 01. THE COVER: what it is, the button, the carousel in a feed. */}
      <section aria-labelledby="cd-title" className="relative">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-center gap-x-12 gap-y-16 px-5 pb-20 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pb-28">
          <div>
            <p className="cd-sticker">Free · Skill for Claude Code</p>
            <h1 id="cd-title" className="cd-display mt-7 text-[clamp(3.8rem,11.5vw,8.8rem)]">
              Carousels that <mark className="cd-mark">sell.</mark>
            </h1>
            <p className="mt-7 max-w-[26ch] text-pretty text-[1.3rem] font-semibold leading-[1.35] sm:text-[1.45rem]">
              Four questions in. A carousel built to convert out.
            </p>
            <div id={HERO_ID} className="mt-9 scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="swipe" align="start" quiet buttonClassName="cd-cta" />
            </div>
            <ul className="mt-8 flex list-none flex-wrap gap-2 p-0" aria-label="Platforms">
              {["Instagram", "LinkedIn", "TikTok", "X"].map((p, i) => (
                <li key={p} className="cd-pill" data-c={i}>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:max-w-[25rem]">
            <div className="cd-hero-shapes" aria-hidden>
              <span className="cd-hero-shapes__disc" />
              <Ring className="cd-hero-shapes__burst" />
              <span className="cd-hero-shapes__pill" />
            </div>
            <div className="cd-fan" aria-hidden>
              <Image src={S("ad-03-v2.webp")} alt="" width={810} height={1013} sizes="16rem" className="cd-fan__a" />
              <Image src={S("ad-06-v2.webp")} alt="" width={810} height={1013} sizes="16rem" className="cd-fan__b" />
            </div>
            <div className="cd-phone">
              <video
                className="block h-auto w-full"
                src={S("feed-v6.mp4")}
                poster={S("feed-v6.jpg")}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The ad the skill made for Higgsfield, in a phone feed: a thumb swipes from the cover, None of this was filmed, through Higgsfield's own work (a Seedance 2.5 video, a Marketing Studio product ad, a 30-second commercial, a GPT Image 2 poster) to 25M+ people and the ask: start creating."
              />
            </div>
          </figure>
        </div>
      </section>

      {/* 02. SWIPE ONE: the real deck. */}
      <section aria-labelledby="cd-deck" className="cd-ink relative overflow-hidden">
        <span className="cd-shape cd-shape--deck-a" aria-hidden />
        <Ring className="cd-shape cd-shape--deck-b" />
        <div className="relative mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 id="cd-deck" className="cd-display text-[clamp(2.8rem,7vw,5.6rem)]">
              Swipe <mark className="cd-mark cd-mark--peach">one.</mark>
            </h2>
            <p className="text-[1.15rem] font-semibold opacity-80 md:pb-3">An ad for Higgsfield, made with the skill.</p>
          </div>
          <div className="mt-10 md:mt-14">
            <CarouselDeck slides={DECK} label="A carousel made with Carousel Designer for Higgsfield" />
          </div>
        </div>
      </section>

      {/* 03. BUILT ON WHAT CONVERTS. */}
      <section aria-labelledby="cd-why" className="relative">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <h2 id="cd-why" className="cd-display max-w-[13ch] text-[clamp(2.8rem,7vw,5.6rem)]">
            Built on what <mark className="cd-mark">converts.</mark>
          </h2>
          <ol className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <li key={f.title} className="cd-slide">
                <span className="cd-slide__n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="cd-display mt-auto text-[2rem] leading-[1.0]">{f.title}</h3>
                <p className="mt-3 text-[1.02rem] font-medium leading-[1.4]">{f.body}</p>
                <p className="cd-source mt-4">{f.source}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-10 flex list-none flex-wrap gap-2.5 p-0">
            {["36 rules", "Checked before it's drawn", "Scored out of 20"].map((t, i) => (
              <li key={t} className="cd-pill cd-pill--lg" data-c={i + 1}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04. FOUR QUESTIONS, THREE COVERS. */}
      <section aria-labelledby="cd-how" className="cd-peach relative overflow-hidden">
        <span className="cd-shape cd-shape--how" aria-hidden />
        <div className="relative mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="self-center">
              <h2 id="cd-how" className="cd-display text-[clamp(2.8rem,7vw,5.6rem)]">
                Four questions. <span className="cd-mark cd-mark--ink">Pick a cover.</span>
              </h2>
              <ul className="mt-10 flex list-none flex-wrap gap-2.5 p-0">
                {ASKS.map((a, i) => (
                  <li key={a} className="cd-chip">
                    <b>{i + 1}</b> {a}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="self-center">
              <div className="overflow-hidden rounded-[1.6rem] bg-[#ECEAE5]">
                <Image src={S("covers-v5.webp")} alt="Three covers the skill drew for the same ad, numbered 1 to 3: None of this was filmed; Make the ad. Skip the shoot; No crew. No camera. Just Higgsfield." width={1764} height={801} sizes="(min-width: 1024px) 46rem, 92vw" className="block h-auto w-full" />
              </div>
              <figcaption className="cd-kicker mt-4 opacity-70">Three covers · you pick</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 05. THE CLOSE: any style, ready to post, get it. */}
      <section id={CLOSE_ID} aria-labelledby="cd-close-title" className="relative scroll-mt-28">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-16 sm:px-8 md:pb-36 md:pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="cd-close-title" className="cd-display max-w-[11ch] text-[clamp(3rem,8vw,6.2rem)]">
                Your next post, <mark className="cd-mark">sorted.</mark>
              </h2>
              <p className="mt-6 max-w-[30ch] text-pretty text-[1.2rem] font-semibold leading-[1.4]">
                Any style you want. Name it, or show it a post you love.
              </p>
              <div className="cd-stack mt-10" aria-hidden>
                <span className="cd-stack__disc" />
                {["ad-02-v2.webp", "ad-04-v2.webp", "ad-07-v2.webp"].map((f) => (
                  <Image key={f} src={S(f)} alt="" width={810} height={1013} sizes="14rem" />
                ))}
              </div>
            </div>
            <div className="self-end">
              <ol className="list-none border-b-2 border-[var(--ink)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t-2 border-[var(--ink)] py-5 text-[1.12rem] font-medium leading-[1.45]">
                    <span className="cd-step">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <ul className="mt-8 flex list-none flex-wrap gap-2 p-0" aria-label="What you get">
                {READY.map((k) => (
                  <li key={k} className="cd-ready">
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 flex-none">
                      <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {k}
                  </li>
                ))}
              </ul>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="swipe" align="start" prompt={false} quiet buttonClassName="cd-cta" />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] opacity-70">
                  Needs Claude Code and Node.js 18+, on Mac, Windows or Linux. Your own OpenAI account draws custom pictures;
                  without one, it still makes the whole carousel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        href="#claim"
        label="Get it free"
        note="Free, downloads at once"
        buttonClassName="bg-[#2B4BFF] text-white hover:bg-[#1f3df0]"
      />
    </main>
  );
}
