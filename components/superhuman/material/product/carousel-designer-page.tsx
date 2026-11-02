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
 * THE LOOK (Tobia, 2026-11-02): "very similar format to the mascots, with a
 * loader and everything, not overcrowded, built to convert and easy". The page
 * reads like a carousel itself: paper and ink, one cobalt for the action, big
 * tight grotesk (the skill's own "bold" look), numbered cards, and the real
 * slides as the pictures. The opening deals five slides into a stack and
 * swipes the top one away.
 *
 * EVERYTHING SHOWN IS REAL OUTPUT: the feed film, the deck, the covers and
 * the six looks are what the skill rendered. The Conversion Teardown deck is
 * about Tobia's own free skill, with its real cal.com score.
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
  "Cover: 6 reasons visitors leave without signing up. For founders with a landing page.",
  "Reason 1 of 6: visitors can't tell what you do in 5 seconds. Read your headline to a stranger; lead with the outcome, not the feature.",
  "Reason 2: your button says Get started. A crossed-out Get started button next to a better one: Start my free trial.",
  "Reason 3: your proof sits at the bottom. Put a real number or a named customer next to the first button.",
  "Reason 4: your form asks for everything. Full name, company, role and phone crossed out, only work email kept.",
  "Reason 5: nobody answers what does it cost. Answer price, setup time or cancelling in one line under the button.",
  "Reason 6: on a phone, the button is below the fold. A phone where the Start free trial button sits under the first screen.",
  "cal.com scored 14 out of 20 in a Conversion Teardown on 31 October 2026: strong headline and button, points lost on proof, the form and doubts.",
  "Score your page out of 20. Comment TEARDOWN and I'll DM you the free Claude Code skill that opens your page, scores it and writes the fixes.",
].map((alt, i) => ({ src: S(`teardown-${String(i + 1).padStart(2, "0")}-v1.webp`), alt }));

const FACTS: { title: string; body: string; source: string }[] = [
  {
    title: "Slide 2 is a second cover.",
    body: "Instagram shows a carousel again, opened at slide 2, to people who didn't swipe. So slide 2 works on its own, and gives value straight away.",
    source: "Adam Mosseri, Instagram, Oct 2024",
  },
  {
    title: "Sends reach new people.",
    body: "Of what Instagram ranks on, sends weigh most for people who don't follow you yet. So it's written to be sent to someone specific.",
    source: "Adam Mosseri, Instagram, Jan 2025",
  },
  {
    title: "One ask converts.",
    body: "In 798,000 automated DM conversations, one button converted 32%. Three buttons: 2%. Every carousel ends on one ask, with a named reward.",
    source: "Inrō, 798k conversations, 2026",
  },
  {
    title: "The cover keeps its promise.",
    body: "If the cover says six, there are six. Clickbait loses recommendation, so a script counts them before anything is drawn.",
    source: "Instagram Recommendations Guidelines",
  },
];

const LOOKS: { id: string; name: string; line: string }[] = [
  { id: "bold", name: "Bold", line: "A poster in the feed: your colour, huge type." },
  { id: "editorial", name: "Editorial", line: "A good magazine: serif, italics, engravings." },
  { id: "scrapbook", name: "Scrapbook", line: "Paper, tape and cut-outs, by hand." },
  { id: "studio", name: "Studio", line: "A product launch: soft light, glass, clay." },
  { id: "midnight", name: "Midnight", line: "Dark and precise, a glow in your colour." },
  { id: "note", name: "Note", line: "Reads like a person, not an ad." },
];

const ASKS = ["What it sells", "Who it's for", "What they should do", "Where you post", "The pictures"];

const READY: [string, string][] = [
  ["Every size", "4:5 for Instagram and LinkedIn, 9:16 for TikTok, a thread for X."],
  ["The LinkedIn PDF", "One page per slide, with its title and first comment written."],
  ["The caption", "The hook in the first 125 characters, five hashtags at most."],
  ["Alt text", "For every slide, its words and its meaning."],
  ["The DM script", "When someone comments your keyword: two messages, one button."],
  ["How to post it", "Step by step for each platform, and what to watch after."],
];

const STEPS: React.ReactNode[] = [
  <>Get it free. It downloads at once.</>,
  <>
    Open a terminal in the folder, type <q className="font-bold">claude</q>, then <q className="font-bold">hi</q>. It installs itself.
  </>,
  <>
    Type <q className="font-bold">make a carousel</q>.
  </>,
];

export function CarouselDesignerPage() {
  return (
    <main className={`cd-page ${display.variable} ${text.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <CarouselDesignerLoader
        cards={[
          { src: S("looks-editorial-v1.webp"), bg: "#1B1A17" },
          { src: S("looks-scrapbook-v1.webp"), bg: "#D9822B" },
          { src: S("looks-midnight-v1.webp"), bg: "#0A0A0D" },
          { src: S("looks-studio-v1.webp"), bg: "#2E5FD8" },
          { src: S("teardown-01-v1.webp"), bg: "#FFDD1F" },
        ]}
      />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 01. THE COVER: what it is, the button, the carousel in a feed. */}
      <section aria-labelledby="cd-title" className="relative">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-center gap-x-12 gap-y-14 px-5 pb-20 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:pb-28">
          <div>
            <div className="cd-kicker flex flex-wrap gap-x-5 gap-y-1">
              <span>Free · downloads at once</span>
              <span className="opacity-60">Skill for Claude Code</span>
            </div>
            <h1 id="cd-title" className="cd-display mt-6 text-[clamp(3.6rem,11vw,8.4rem)]">
              Carousels that <mark className="cd-mark">sell.</mark>
            </h1>
            <p className="mt-7 max-w-[34ch] text-pretty text-[1.2rem] font-medium leading-[1.45] sm:text-[1.32rem]">
              Answer five questions about what you sell. Get a carousel built on what converts, in your colours,
              scored out of 20, and shown in a phone feed before you post.
            </p>
            <div id={HERO_ID} className="mt-9 scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="swipe" align="start" quiet buttonClassName="cd-cta" />
            </div>
            <p className="cd-kicker mt-6 opacity-60">Instagram · LinkedIn · TikTok · X</p>
          </div>

          <figure className="relative mx-auto w-full max-w-[19rem] sm:max-w-[24rem] lg:max-w-[26rem]">
            <div className="cd-fan" aria-hidden>
              <Image src={S("teardown-03-v1.webp")} alt="" width={810} height={1013} sizes="16rem" className="cd-fan__a" />
              <Image src={S("teardown-08-v1.webp")} alt="" width={810} height={1013} sizes="16rem" className="cd-fan__b" />
            </div>
            <div className="cd-phone">
              <video
                className="block h-auto w-full"
                src={S("feed-v1.mp4")}
                poster={S("feed-v1.jpg")}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The carousel the skill made for Conversion Teardown, in a phone feed: a thumb swipes from the yellow cover, 6 reasons visitors leave without signing up, through each reason and its fix, to cal.com's real score of 14 out of 20, and the ask: comment TEARDOWN."
              />
            </div>
            <figcaption className="cd-kicker mt-5 text-center opacity-60">The preview it makes · before you post</figcaption>
          </figure>
        </div>
      </section>

      {/* 02. SWIPE ONE: the real deck. */}
      <section aria-labelledby="cd-deck" className="cd-band">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <h2 id="cd-deck" className="cd-display text-[clamp(2.7rem,7vw,5.4rem)]">
              Swipe <mark className="cd-mark">one.</mark>
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.1rem] leading-[1.55] opacity-80 md:pb-3">
              Made with the skill for a real product, Conversion Teardown. Six reasons, each with its fix, a real score as
              proof, one ask. Every number in it is true.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <CarouselDeck slides={DECK} label="A carousel made with Carousel Designer for Conversion Teardown" />
          </div>
        </div>
      </section>

      {/* 03. BUILT ON WHAT CONVERTS. */}
      <section aria-labelledby="cd-why">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <h2 id="cd-why" className="cd-display max-w-[13ch] text-[clamp(2.7rem,7vw,5.4rem)]">
            Built on what <mark className="cd-mark">converts.</mark>
          </h2>
          <ol className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <li key={f.title} className="cd-slide">
                <span className="cd-slide__n">
                  {String(i + 1).padStart(2, "0")}
                  <small>/04</small>
                </span>
                <h3 className="cd-display mt-8 text-[1.9rem] leading-[1.02]">{f.title}</h3>
                <p className="mt-3 text-[1rem] leading-[1.5] opacity-80">{f.body}</p>
                <p className="cd-source mt-4">{f.source}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-[56ch] text-pretty text-[1.15rem] font-medium leading-[1.55]">
            36 rules, from Instagram&rsquo;s own words and studies of millions of posts. A script checks the words before
            anything is drawn. Then a second pair of eyes scores it out of 20, and it isn&rsquo;t done until it passes.
          </p>
        </div>
      </section>

      {/* 04. FIVE QUESTIONS, THREE COVERS. */}
      <section aria-labelledby="cd-how" className="cd-ink">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <h2 id="cd-how" className="cd-display text-[clamp(2.7rem,7vw,5.4rem)]">
                Five questions. <span className="cd-sun">Then pick your cover.</span>
              </h2>
              <ul className="mt-10 flex list-none flex-wrap gap-2.5 p-0">
                {ASKS.map((a, i) => (
                  <li key={a} className="cd-chip">
                    <b>{i + 1}</b> {a}
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[40ch] text-pretty text-[1.1rem] leading-[1.55] opacity-80">
                It reads your site first, so most answers are one tap. Then it writes ten hooks, keeps the three strongest,
                and draws them as covers for you to choose.
              </p>
            </div>
            <figure className="self-center">
              <div className="overflow-hidden rounded-[1.4rem] bg-[#ECEAE5]">
                <Image src={S("covers-v1.webp")} alt="Three covers the skill drew for the same carousel, numbered 1 to 3: 6 reasons visitors leave without signing up; We scored cal.com's homepage, it got 14/20; Your page gets visits, not sign-ups, why?" width={1764} height={801} sizes="(min-width: 1024px) 44rem, 92vw" className="block h-auto w-full" />
              </div>
              <figcaption className="cd-kicker mt-4 opacity-60">Three covers, one deck · you pick</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 05. SIX LOOKS. */}
      <section aria-labelledby="cd-looks">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <h2 id="cd-looks" className="cd-display text-[clamp(2.7rem,7vw,5.4rem)]">
              Six looks. <mark className="cd-mark">Your colour.</mark>
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.1rem] leading-[1.55] opacity-80 md:pb-3">
              Each one a whole system, type, colour, layout and pictures, so every slide reads as one deck. It picks the
              look from who you sell to, and draws the pictures to match.
            </p>
          </div>
          <ul className="mt-12 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:gap-x-6 lg:grid-cols-3">
            {LOOKS.map((l) => (
              <li key={l.id}>
                <div className="cd-cover">
                  <Image src={S(`looks-${l.id}-v1.webp`)} alt={`A cover in the ${l.name} look, made by the skill.`} width={810} height={1013} sizes="(min-width: 1024px) 24rem, 45vw" className="block h-auto w-full" />
                </div>
                <h3 className="cd-display mt-4 text-[1.5rem]">{l.name}</h3>
                <p className="mt-1 text-[0.98rem] leading-[1.45] opacity-75">{l.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06. READY TO POST. */}
      <section aria-labelledby="cd-ready" className="cd-band">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <h2 id="cd-ready" className="cd-display max-w-[14ch] text-[clamp(2.7rem,7vw,5.4rem)]">
            Ready to <mark className="cd-mark">post.</mark>
          </h2>
          <ul className="mt-12 grid list-none grid-cols-1 gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {READY.map(([k, v]) => (
              <li key={k} className="cd-ready">
                <svg viewBox="0 0 24 24" aria-hidden className="mt-1 h-6 w-6 flex-none text-[var(--cobalt)]">
                  <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  <b className="block text-[1.12rem]">{k}</b>
                  <span className="mt-1 block leading-[1.5] opacity-75">{v}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[56ch] text-pretty text-[1.05rem] leading-[1.55] opacity-80">
            Use Canva? It can put the finished carousel in your Canva, to change a word or schedule it from there.
          </p>
        </div>
      </section>

      {/* 07. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="cd-close-title" className="scroll-mt-28">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-16 sm:px-8 md:pb-36 md:pt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="cd-close-title" className="cd-display max-w-[11ch] text-[clamp(2.9rem,8vw,6rem)]">
                Your next post, <mark className="cd-mark">sorted.</mark>
              </h2>
              <div className="cd-stack mt-10" aria-hidden>
                {["looks-studio-v1.webp", "looks-editorial-v1.webp", "teardown-09-v1.webp"].map((f) => (
                  <Image key={f} src={S(f)} alt="" width={810} height={1013} sizes="14rem" />
                ))}
              </div>
            </div>
            <div className="self-end">
              <ol className="list-none border-b-2 border-[var(--ink)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t-2 border-[var(--ink)] py-5 text-[1.12rem] font-medium leading-[1.45]">
                    <span className="cd-display w-6 shrink-0 text-[1.2rem]">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="swipe" align="start" prompt={false} quiet buttonClassName="cd-cta" />
                <p className="mt-4 max-w-[48ch] text-pretty text-[0.95rem] leading-[1.5] opacity-70">
                  Free. Needs Claude Code and Node.js 18+, on a Mac, Windows or Linux. Pictures drawn just for you use your
                  own OpenAI account (an API key, or ChatGPT through Codex); without one, it still makes the whole carousel.
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
