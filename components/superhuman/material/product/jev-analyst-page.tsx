import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { JEV_CRYPTO_ANALYST as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { AppReel, type Clip } from "./app-reel";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * JEV CRYPTO ANALYST, given away for an email.
 *
 * Second version, after Tobia: no Mac, and copy that is "more qualitative,
 * more immediate": what it does for you, understood in one look, with the
 * form in the first screen. So: one promise, the app itself playing in a
 * plain window, the form. Then three beats and one line of proof. Then the
 * form again.
 *
 * Honest limits kept: it gives a likely range and the levels, not a
 * direction call (the product's own README says direction is close to a coin
 * flip), and it says "not financial advice".
 */

const CLOSE_ID = "buy-close";
const mono = "font-mono uppercase tracking-[0.16em]";
const big = "text-balance font-serif leading-[0.98] tracking-[-0.045em] text-[#f4f2ec]";
const GREEN = "#36e0a2";

const CLIPS: Clip[] = [
  { id: "btc", src: "/shop/jev/btc.mp4", poster: "/shop/jev/btc.jpg", label: "Jev reading the BTC chart" },
  { id: "eth", src: "/shop/jev/eth.mp4", poster: "/shop/jev/eth.jpg", label: "Jev reading the ETH chart" },
  { id: "sol", src: "/shop/jev/sol.mp4", poster: "/shop/jev/sol.jpg", label: "Jev reading the SOL chart" },
];

const BEATS = [
  ["Type a coin", "BTC, ETH, SOL, or the memecoin everyone is talking about."],
  ["Jev reads the chart", "Trend, momentum, volatility, support and resistance, the way a pro would."],
  ["You just know", "Where the price is likely to be, the levels that matter, and why. In plain words."],
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

      {/* 1. THE PROMISE, THE APP, THE FORM. All on the first screen. */}
      <section aria-labelledby="jev-title" className="relative">
        <div aria-hidden className="lx-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 content-center gap-6 px-5 pb-16 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          {/* On a phone: promise, the form, then the app. It was promise, app,
              form, which put the field at 707px on an iPhone 15 whose Safari
              shows 659: the page promised the form on the first screen and
              the phone never got it. The app follows straight after, playing,
              and its top edge is on the first screen as well. On a wide screen
              the words and the form sit left of the app. */}
          <div className="contents text-center lg:col-start-1 lg:row-start-1 lg:block lg:text-left">
            <div className="order-1 text-center lg:text-left">
            <p className={`${mono} lx-fade flex items-center justify-center gap-2 text-[0.62rem] text-[rgba(244,242,236,0.55)] sm:text-[0.68rem] lg:justify-start`}>
              <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
              Jev Crypto Analyst · free
            </p>
            <h1 id="jev-title" className={`${big} mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)]`}>
              Read any crypto chart <span style={{ color: GREEN }}>like a pro</span>. In ten seconds.
            </h1>
            <p className="mx-auto mt-5 max-w-[36ch] text-pretty text-[1.05rem] leading-[1.5] text-[rgba(244,242,236,0.75)] md:text-[1.2rem] lg:mx-0">
              Type a coin. See where the price is likely to be, the levels that matter, and why.
            </p>
            </div>
            <div id="claim" className="order-2 flex scroll-mt-28 flex-col items-center lg:mt-8 lg:items-start">
              <FreeClaim productId={PRODUCT.id} className="lg:items-start lg:text-left" />
              <p className={`${mono} mt-1 text-[0.6rem] text-[rgba(244,242,236,0.45)] sm:text-[0.64rem]`}>
                Free · set up in 2 minutes · runs on your computer
              </p>
            </div>
          </div>

          <div className="lx-fade order-3 lg:col-start-2 lg:row-start-1">
            <AppReel clips={CLIPS} address="Jev Crypto Analyst" />
          </div>
        </div>
        <div id="launchr-top" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[10svh] h-px" />
      </section>

      {/* 2. HOW IT FEELS, IN THREE BEATS. */}
      <section aria-labelledby="how-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 id="how-title" className={`${big} max-w-[16ch] text-[clamp(2.4rem,6vw,4.8rem)]`}>
              No indicators to learn. No squinting at candles.
            </h2>
          </Reveal>
          <ol className="mt-14 grid list-none grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
            {BEATS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 90}>
                <li>
                  <span className="font-serif text-[3.2rem] leading-none tracking-[-0.04em]" style={{ color: GREEN }}>
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
              Tested honestly on hundreds of charts it had never seen, and it always tells
              you how sure it is. When it isn&rsquo;t, it says so.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. THE FORM AGAIN. It holds. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[rgba(244,242,236,0.1)] px-6 py-28 text-center md:py-40">
        <h2 id="close-title" className={`${big} mx-auto max-w-[12ch] text-[clamp(2.8rem,8vw,6.5rem)]`}>
          Stop guessing at <span style={{ color: GREEN }}>charts</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[34ch] text-balance text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.72)] md:text-[1.3rem]">
          It&rsquo;s free. Tell me where to send it.
        </p>
        <div className="mt-10 flex justify-center">
          <FreeClaim productId={PRODUCT.id} prompt={false} />
        </div>
        <p className={`${mono} mx-auto mt-4 max-w-[52ch] text-[0.6rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.66rem]`}>
          Needs Claude Code and a TypeSafe key · Not financial advice
        </p>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="launchr-top" closeId={CLOSE_ID} href="#claim" label="Get it free" />
    </main>
  );
}
