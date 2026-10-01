import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { WHITEHAT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { WhitehatReview } from "./whitehat-review";
import { StickyBuy } from "./sticky-buy";

/**
 * WHITEHAT, the build guide, given away for an email.
 *
 * Same family and grammar as Jev Review Miner: black, the promise and the form
 * on the first screen, the thing itself beside them. Then three beats, what is
 * in the guide, the opening that makes it valuable, and the form again. The PDF
 * arrives attached (lib/shop/deliver.ts, sendFree).
 *
 * THE PAGE SELLS THE LEGITIMATE VERSION. Its spine, like the guide's, is
 * authorization: it never promises a way to scan strangers, only a way to
 * build a consent-based practice. The INSIDE numbers are the PDF's own
 * section numbers, so "start with section 02" in the email matches. The visual shows a signed scope and a report
 * of fixes, not an attack. Nothing claims a result the guide has not produced.
 */

const CLOSE_ID = "buy-close";
const mono = "font-mono uppercase tracking-[0.16em]";
const big = "text-balance font-serif leading-[0.98] tracking-[-0.045em] text-[#f4f2ec]";
// A secure, verified green: distinct from the other products, and apt for a
// guide whose whole point is the work being signed off and cleared.
const HL = "#4ade9e";

const BEATS = [
  ["Offer first", "You describe the service before you look at anything. No site gets reviewed until its owner has signed."],
  ["Test with permission", "A signed scope names the systems, the window and the methods. You test only what it names. Argon helps you validate, rank and fix."],
  ["Fix, and get paid", "You hand over a report ranked by severity, with a fix for each finding, then confirm the fixes worked. That is what earns the referral."],
];

// The PDF's own section numbers.
const INSIDE: [string, string][] = [
  ["02", "Authorization: the law, and the signed scope that keeps you legal"],
  ["03", "The offer: what you sell, and who to sell it to"],
  ["04", "The practice lab where you get good without touching a stranger"],
  ["05", "The outreach email that offers a service, never a threat"],
  ["06", "The five-phase engagement, and where Argon helps"],
  ["07", "The report that gets you paid and referred"],
  ["09", "Prices, the legal setup, and the first 90 days"],
  ["10", "The scope template and the four Argon prompts"],
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

/**
 * A MARKER STROKE, NOT A BOX. The words turn the accent colour and a soft band
 * sits behind their lower half only, so it can never reach the line above or
 * below, however the heading wraps.
 */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        color: HL,
        backgroundImage: "linear-gradient(transparent 58%, rgba(74,222,158,0.18) 58%, rgba(74,222,158,0.18) 88%, transparent 88%)",
      }}
    >
      {children}
    </span>
  );
}

export function WhitehatPage() {
  return (
    <main className="relative overflow-x-clip bg-[#05070a] text-[#f4f2ec]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("guides")} label="Guides" tone="ink" />

      {/* 1. THE PROMISE, THE FORM, THE REVIEW WORKING. All on the first screen. */}
      <section aria-labelledby="wh-title" className="relative">
        <div aria-hidden className="lx-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 content-center gap-8 px-5 pb-16 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div className="text-center lg:text-left">
            <p className={`${mono} lx-fade flex items-center justify-center gap-2 text-[0.62rem] text-[rgba(244,242,236,0.55)] sm:text-[0.68rem] lg:justify-start`}>
              <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full" style={{ background: HL }} />
              Whitehat · free build guide
            </p>
            <h1 id="wh-title" className={`${big} mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)]`}>
              Get paid to find security holes. <Highlight>With permission.</Highlight>
            </h1>
            <p className="mx-auto mt-5 max-w-[42ch] text-pretty text-[1.05rem] leading-[1.5] text-[rgba(244,242,236,0.75)] md:text-[1.2rem] lg:mx-0">
              Turn Gemini 4 Argon into an authorized web-security practice. Offer a review, test only with a signed scope, and get paid to fix what you find.
            </p>
            <div id="claim" className="mt-8 flex scroll-mt-28 flex-col items-center lg:items-start">
              <FreeClaim productId={PRODUCT.id} className="lg:items-start lg:text-left" />
              <p className={`${mono} mt-1 text-[0.6rem] text-[rgba(244,242,236,0.45)] sm:text-[0.64rem]`}>
                Free · 21-page PDF · straight to your inbox
              </p>
            </div>
          </div>

          <div className="lx-fade">
            <WhitehatReview />
          </div>
        </div>
        <div id="wh-top" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[10svh] h-px" />
      </section>

      {/* 2. THE DISCIPLINE, IN THREE BEATS. */}
      <section aria-labelledby="how-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 id="how-title" className={`${big} max-w-[18ch] text-[clamp(2.2rem,5.6vw,4.4rem)]`}>
              Offer first. Test only with permission. Fix what you find.
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
                  <p className="mt-2 max-w-[32ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.68)]">{v}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-16 max-w-[54ch] text-pretty text-[1.15rem] leading-[1.6] text-[rgba(244,242,236,0.8)] md:mt-24 md:text-[1.3rem]">
              Testing a site without the owner&rsquo;s permission is an offence in most countries, however good your intentions. So the guide is built on one rule: the signature comes first.
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
              Everything you need to build the practice.
            </h2>
            <p className="mt-5 max-w-[34ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.68)]">
              Twenty-one pages, from the first signed scope to the monthly retainer, with the four Argon prompts you reuse on every job.
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

      {/* 4. THE OPENING. */}
      <section aria-labelledby="play-title" className="border-t border-[rgba(244,242,236,0.1)]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className={`${mono} text-[0.62rem] text-[rgba(244,242,236,0.5)]`}>The opening</p>
            <h2 id="play-title" className={`${big} mx-auto mt-5 max-w-[22ch] text-[clamp(2.1rem,4.8vw,4rem)]`}>
              Argon was built for defenders. <Highlight>Work as one.</Highlight>
            </h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-pretty text-[1.05rem] leading-[1.55] text-[rgba(244,242,236,0.7)] md:text-[1.15rem]">
              Google is giving Argon to trusted cyber defenders first. The clinic with a booking form will never hire one of them. It can hire you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. THE FORM AGAIN. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[rgba(244,242,236,0.1)] px-6 py-28 text-center md:py-40">
        <h2 id="close-title" className={`${big} mx-auto max-w-[14ch] text-[clamp(2.8rem,8vw,6.5rem)]`}>
          Your first <span style={{ color: HL }}>signed</span> review starts here.
        </h2>
        <p className="mx-auto mt-6 max-w-[34ch] text-balance text-[1.1rem] leading-[1.5] text-[rgba(244,242,236,0.72)] md:text-[1.3rem]">
          It&rsquo;s free. Tell me where to send it.
        </p>
        <div className="mt-10 flex justify-center">
          <FreeClaim productId={PRODUCT.id} prompt={false} />
        </div>
        <p className={`${mono} mx-auto mt-4 max-w-[56ch] text-[0.6rem] leading-[2] text-[rgba(244,242,236,0.45)] md:text-[0.66rem]`}>
          The 21-page playbook arrives attached · Built for Gemini 4 Argon
        </p>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="wh-top" closeId={CLOSE_ID} href="#claim" label="Get it free" />
    </main>
  );
}
