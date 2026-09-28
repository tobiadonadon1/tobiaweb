import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { JEV_CRYPTO_ANALYST as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FilmStage, type Film } from "./film-stage";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * JEV CRYPTO ANALYST, given away for an email. Same frame as Launchr: black,
 * a MacBook playing the product, a few big lines, the form.
 *
 * The films are the app itself, recorded reading real charts (BTC 4h, ETH 1h,
 * SOL 1d) on live exchange data, so each plays to its end: a coin typed, the
 * read, the result.
 *
 * Every number is from the product's own backtest (README, calibration.json):
 * 540 past charts it had never seen, the 68% range held 66% of the time and
 * the 90% range 92%. Direction is not claimed; the product itself says it is
 * close to a coin flip on most timeframes.
 */

const CLOSE_ID = "buy-close";
const mono = "font-mono uppercase tracking-[0.16em]";
const big = "text-balance font-serif leading-[0.98] tracking-[-0.045em] text-[#f4f2ec]";

const FILMS: Film[] = [
  { id: "btc", device: "laptop", aspect: "16/9", src: "/shop/jev/btc.mp4", poster: "/shop/jev/btc.jpg" },
  { id: "eth", device: "laptop", aspect: "16/9", src: "/shop/jev/eth.mp4", poster: "/shop/jev/eth.jpg" },
  { id: "sol", device: "laptop", aspect: "16/9", src: "/shop/jev/sol.mp4", poster: "/shop/jev/sol.jpg" },
];

const LINES = [
  ["In", "A coin (BTC, ETH, SOL, any memecoin) and a timeframe. Or just drop a chart screenshot."],
  ["Out", "Where the price is likely to be at the end of the window, the levels that matter, trend or range, and why."],
  ["Under the hood", "Live exchange data, every indicator a trader checks, then Jev, TypeSafe's AI, judges the chart."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "macOS",
  image: abs(`/shop/jev/btc.jpg`),
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

export function JevAnalystPage() {
  return (
    <main className="relative overflow-x-clip bg-[#050507] text-[#f4f2ec]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. IT, WORKING. */}
      <FilmStage
        productId={PRODUCT.id}
        name={PRODUCT.name}
        kicker="Jev Crypto Analyst · an app for Claude Code"
        title={["Any", "crypto", "chart,", "read", "in", "seconds."]}
        dimFrom={3}
        value={
          <>
            Type a coin. <span className="text-[#f4f2ec]">Jev, TypeSafe&rsquo;s AI</span>, tells
            you where the price is likely to be, which levels matter, and why.
          </>
        }
        meta="Free · runs on your computer · sent to your inbox"
        films={FILMS}
        filmLabel="Jev Crypto Analyst reading a live crypto chart"
      />

      {/* 2. WHAT IT DOES, AND HOW WELL. */}
      <section aria-labelledby="does-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <Reveal>
            <h2 id="does-title" className={`${big} max-w-[15ch] text-[clamp(2.4rem,6vw,5rem)]`}>
              Where it&rsquo;s going, and how sure.
            </h2>
          </Reveal>
          <dl className="mt-14 grid grid-cols-1 border-t border-[rgba(244,242,236,0.12)] md:mt-20 md:grid-cols-3">
            {LINES.map(([k, v], i) => (
              <Reveal key={k} delay={i * 90}>
                <div className="border-b border-[rgba(244,242,236,0.12)] py-7 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0">
                  <dt className={`${mono} text-[0.66rem] text-[#36e0a2]`}>{k}</dt>
                  <dd className="mt-3 max-w-[32ch] text-pretty text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.8)] md:text-[1.2rem]">{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          {/* The honest test, as the headline numbers. */}
          <Reveal>
            <div className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-[1fr_1fr_1.2fr] md:items-end">
              <div>
                <p className={`${big} text-[clamp(3.4rem,8vw,6rem)]`}>540</p>
                <p className="mt-2 text-[1rem] text-[rgba(244,242,236,0.6)]">past charts it had never seen</p>
              </div>
              <div>
                <p className={`${big} text-[clamp(3.4rem,8vw,6rem)]`}>
                  92<span className="text-[#36e0a2]">%</span>
                </p>
                <p className="mt-2 text-[1rem] text-[rgba(244,242,236,0.6)]">
                  ended inside its 90% range (66% inside the 68% one)
                </p>
              </div>
              <p className="max-w-[36ch] text-pretty text-[1rem] leading-[1.6] text-[rgba(244,242,236,0.6)]">
                The ranges hold as promised. Direction is close to a coin flip on most
                timeframes, and the app tells you so, timeframe by timeframe.
              </p>
            </div>
          </Reveal>

          <p className={`${mono} mt-14 text-[0.62rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.68rem]`}>
            BTC · ETH · SOL · thousands of coins · 15m to 1w · runs on your Mac · Claude Code + a TypeSafe key
          </p>
        </div>
      </section>

      {/* 3. THE FORM. It holds. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[rgba(244,242,236,0.1)] px-6 py-28 text-center md:py-40">
        <h2 id="close-title" className={`${big} mx-auto max-w-[13ch] text-[clamp(2.8rem,8vw,6.5rem)]`}>
          Read your first chart <span className="text-[#36e0a2]">tonight</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[34ch] text-balance text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.72)] md:text-[1.3rem]">
          Two minutes to set up with Claude Code. Free.
        </p>
        <div className="mt-10 flex justify-center">
          <FreeClaim productId={PRODUCT.id} />
        </div>
        <p className={`${mono} mx-auto mt-4 max-w-[52ch] text-[0.6rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.66rem]`}>
          Probabilities, not certainties · Not financial advice
        </p>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="launchr-top" closeId={CLOSE_ID} href="#claim" label="Get it free" />
    </main>
  );
}
