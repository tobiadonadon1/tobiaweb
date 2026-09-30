import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { JEV_REVIEW_MINER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { ReviewStream } from "./review-stream";
import { StickyBuy } from "./sticky-buy";

/**
 * JEV REVIEW MINER, the build guide, given away for an email.
 *
 * Same family and grammar as Jev Crypto Analyst: black, the promise and the
 * form on the first screen, the thing itself working beside them. Then three
 * beats, what is in the guide, the one play that makes it valuable, and the
 * form again. The PDF arrives attached (lib/shop/deliver.ts, sendFree).
 *
 * The visual is labelled an example run, and the page claims nothing about
 * results: it describes what the system does and what the guide contains.
 */

const CLOSE_ID = "buy-close";
const mono = "font-mono uppercase tracking-[0.16em]";
const big = "text-balance font-serif leading-[0.98] tracking-[-0.045em] text-[#f4f2ec]";
const HL = "#ffd84d";

const BEATS = [
  ["It reads every review", "Thousands of them, from the App Store, Amazon and G2. Yours and your competitors'."],
  ["It finds the why", "Why each person bought, why they left, what they wish existed, and the exact words they used."],
  ["It writes the brief", "Themes, counted and ranked. Every claim backed by real numbers and real quotes."],
];

const INSIDE: [string, string][] = [
  ["01", "The five-stage pipeline, from raw reviews to a cited brief"],
  ["02", "The database schema for reviews, extractions and themes"],
  ["03", "The extraction prompt, with the rule that keeps every quote real"],
  ["04", "How themes are built, counted and scored"],
  ["05", "The brief prompt and every section it writes"],
  ["06", "The stack, what it costs, and the first month of rollout"],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  name: `${PRODUCT.name}: Build Guide`,
  description: PRODUCT.share.description,
  encodingFormat: "application/pdf",
  author: { "@type": "Person", name: "Tobia Donadon" },
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[0.12em] px-[0.08em] text-[#0b0b0d] [box-decoration-break:clone]" style={{ background: HL }}>
      {children}
    </span>
  );
}

export function ReviewMinerPage() {
  return (
    <main className="relative overflow-x-clip bg-[#050507] text-[#f4f2ec]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("guides")} label="Guides" tone="ink" />

      {/* 1. THE PROMISE, THE FORM, THE MINER WORKING. All on the first screen. */}
      <section aria-labelledby="miner-title" className="relative">
        <div aria-hidden className="lx-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 content-center gap-8 px-5 pb-16 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div className="text-center lg:text-left">
            <p className={`${mono} lx-fade flex items-center justify-center gap-2 text-[0.62rem] text-[rgba(244,242,236,0.55)] sm:text-[0.68rem] lg:justify-start`}>
              <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full" style={{ background: HL }} />
              Jev Review Miner · free build guide
            </p>
            <h1 id="miner-title" className={`${big} mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)]`}>
              Know what your customers want. <Highlight>In their own words.</Highlight>
            </h1>
            <p className="mx-auto mt-5 max-w-[38ch] text-pretty text-[1.05rem] leading-[1.5] text-[rgba(244,242,236,0.75)] md:text-[1.2rem] lg:mx-0">
              Thousands of reviews in. A product and marketing brief out. Without reading a single review yourself.
            </p>
            <div id="claim" className="mt-8 flex scroll-mt-28 flex-col items-center lg:items-start">
              <FreeClaim productId={PRODUCT.id} className="lg:items-start lg:text-left" />
              <p className={`${mono} mt-1 text-[0.6rem] text-[rgba(244,242,236,0.45)] sm:text-[0.64rem]`}>
                Free · 10-page PDF · straight to your inbox
              </p>
            </div>
          </div>

          <div className="lx-fade">
            <ReviewStream />
          </div>
        </div>
        <div id="miner-top" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[10svh] h-px" />
      </section>

      {/* 2. WHAT IT DOES, IN THREE BEATS. */}
      <section aria-labelledby="how-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 id="how-title" className={`${big} max-w-[17ch] text-[clamp(2.4rem,6vw,4.8rem)]`}>
              Ten thousand reviews. You read none of them.
            </h2>
          </Reveal>
          <ol className="mt-14 grid list-none grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
            {BEATS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 90}>
                <li>
                  <span className="font-serif text-[3.2rem] leading-none tracking-[-0.04em]" style={{ color: HL }}>
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.5rem] tracking-[-0.02em] text-[#f4f2ec]">{k}</h3>
                  <p className="mt-2 max-w-[30ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.68)]">{v}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-16 max-w-[52ch] text-pretty text-[1.15rem] leading-[1.6] text-[rgba(244,242,236,0.8)] md:mt-24 md:text-[1.3rem]">
              Every quote in the brief is checked against the review it came from, word for word.
              No paraphrases. No invented customers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. WHAT IS IN THE GUIDE. */}
      <section aria-labelledby="inside-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-32">
          <Reveal>
            <p className={`${mono} text-[0.62rem] text-[rgba(244,242,236,0.5)]`}>The build guide</p>
            <h2 id="inside-title" className={`${big} mt-4 text-[clamp(2.2rem,4.6vw,3.8rem)]`}>
              Everything you need to build it.
            </h2>
            <p className="mt-5 max-w-[34ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.68)]">
              Ten pages. The first version starts from a CSV of reviews you already have, and nothing else.
            </p>
          </Reveal>
          <ul className="list-none border-t border-[rgba(244,242,236,0.12)]">
            {INSIDE.map(([n, line], i) => (
              <Reveal key={n} delay={i * 60}>
                <li className="flex items-baseline gap-5 border-b border-[rgba(244,242,236,0.12)] py-5">
                  <span className="font-mono text-[0.72rem] tracking-[0.1em]" style={{ color: HL }}>{n}</span>
                  <span className="text-pretty text-[1.1rem] leading-[1.45] text-[#f4f2ec] md:text-[1.2rem]">{line}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. THE PLAY. */}
      <section aria-labelledby="play-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className={`${mono} text-[0.62rem] text-[rgba(244,242,236,0.5)]`}>The play that makes it valuable</p>
            <h2 id="play-title" className={`${big} mx-auto mt-5 max-w-[20ch] text-[clamp(2.1rem,4.8vw,4rem)]`}>
              Your competitors&rsquo; 1&nbsp;to&nbsp;3&nbsp;star reviews are a <Highlight>map of what to build</Highlight>.
            </h2>
            <p className="mx-auto mt-6 max-w-[46ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.7)] md:text-[1.15rem]">
              Every reason their customers leave is a feature you can ship and a headline you can run.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. THE FORM AGAIN. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[rgba(244,242,236,0.1)] px-6 py-28 text-center md:py-40">
        <h2 id="close-title" className={`${big} mx-auto max-w-[13ch] text-[clamp(2.8rem,8vw,6.5rem)]`}>
          Stop guessing what they <span style={{ color: HL }}>want</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[34ch] text-balance text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.72)] md:text-[1.3rem]">
          It&rsquo;s free. Tell me where to send it.
        </p>
        <div className="mt-10 flex justify-center">
          <FreeClaim productId={PRODUCT.id} prompt={false} />
        </div>
        <p className={`${mono} mx-auto mt-4 max-w-[52ch] text-[0.6rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.66rem]`}>
          The PDF arrives attached · Build it with Claude Code
        </p>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="miner-top" closeId={CLOSE_ID} href="#claim" label="Get it free" />
    </main>
  );
}
