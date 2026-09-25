import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { LAUNCHR as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { LaunchrStage } from "./launchr-stage";
import { StickyBuy } from "./sticky-buy";

/**
 * LAUNCHR, the second thing on this site with a price. On black.
 *
 * Tobia on the first version: shorter, more techy, "straight to the point: a
 * couple of phrases so people know what to buy, max three or four lines", "a
 * couple of big titles", and it should be about what you can make, not about
 * each example. So three parts:
 *
 *   1. The stage: the laptop opens into a real Launchr film, then two more.
 *   2. What it does, in three lines.
 *   3. The price, and the button.
 *
 * No competitor names or prices. The spec lines are facts from the product
 * itself (formats, resolution, what it needs).
 */

const CLOSE_ID = "buy-close";
const mono = "font-mono uppercase tracking-[0.16em]";
const big = "text-balance font-serif leading-[0.98] tracking-[-0.045em] text-[#f4f2ec]";

const LINES = [
  ["In", "Your logo, app screenshots or product photos."],
  ["Out", "A finished 15 to 30 second launch video with its own music, in about ten minutes."],
  ["Done for you", "Device mockups, product cut-outs, callouts, your call to action. Yours to use commercially."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  image: abs(`/shop/launchr/myynd.jpg`),
  url: abs(PRODUCT.href),
  brand: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: (PRODUCT.priceCents / 100).toFixed(2),
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

export function LaunchrPage() {
  return (
    <main className="relative overflow-x-clip bg-[#050507] text-[#f4f2ec]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. WHAT IT MAKES. */}
      <LaunchrStage />

      {/* 2. WHAT IT DOES, IN THREE LINES. */}
      <section aria-labelledby="does-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <Reveal>
            <h2 id="does-title" className={`${big} max-w-[14ch] text-[clamp(2.4rem,6vw,5rem)]`}>
              Drop in your logo. Get a launch video.
            </h2>
          </Reveal>
          <dl className="mt-14 grid grid-cols-1 border-t border-[rgba(244,242,236,0.12)] md:mt-20 md:grid-cols-3">
            {LINES.map(([k, v], i) => (
              <Reveal key={k} delay={i * 90}>
                <div className="border-b border-[rgba(244,242,236,0.12)] py-7 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0">
                  <dt className={`${mono} text-[0.66rem] text-[#f07a5f]`}>{k}</dt>
                  <dd className="mt-3 max-w-[32ch] text-pretty text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.8)] md:text-[1.2rem]">{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <p className={`${mono} mt-10 text-[0.62rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.68rem]`}>
            1080p MP4 · 9:16 · 16:9 · 1:1 · 4:5 · original music · renders on your Mac
          </p>
        </div>
      </section>

      {/* 3. THE PRICE, AND THE BUTTON. It holds. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[rgba(244,242,236,0.1)] px-6 py-28 text-center md:py-40">
        <p className={`${big} text-[clamp(4.5rem,14vw,10rem)]`}>{PRODUCT.priceLabel}</p>
        <h2 id="close-title" className={`${big} mx-auto mt-4 max-w-[18ch] text-[clamp(1.6rem,3.4vw,2.6rem)] text-[rgba(244,242,236,0.7)]`}>
          One payment. Unlimited launch videos.
        </h2>
        <div className="mt-10 flex justify-center">
          <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} tone="ink" />
        </div>
        <p className={`${mono} mx-auto mt-6 max-w-[48ch] text-[0.6rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.66rem]`}>
          Instant download · Mac · Claude Code with a paid plan · Node.js 18+
        </p>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="launchr-top" closeId={CLOSE_ID} />
    </main>
  );
}
