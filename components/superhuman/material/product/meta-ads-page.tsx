import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { META_ADS as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { MetaAdsLoader } from "./meta-ads-loader";
import { MetaAdsTry } from "./meta-ads-try";
import { MetaAdsGauge } from "./meta-ads-gauge";
import "./meta-ads.css";

/**
 * META ADS 2.0, a skill for Claude Code that runs a business's Meta ads with
 * them: a morning report in plain words, options with the number behind each,
 * nothing changed without their yes.
 *
 * THE LOOK (Tobia, 2026-11-06): simple, straightforward, white space,
 * Helvetica Bold set tight. His colours, exactly: Egyptian blue #03203D,
 * stone blue #639CC5 a little less, scarlet #EB2F33 for highlights.
 * Graphical, dynamic, interactive, converting, four sections at most, the
 * value said up front. No price on the page: the pill says what it is.
 *
 * FOUR SECTIONS: the promise with the morning report drawn live; try a
 * morning yourself (the skill's two real demo reports); the brakes and the
 * three ways in; the close.
 *
 * WHAT IS REAL: every number on the page is the skill's own demo output
 * (`ads demo`, `ads demo --leads`: example accounts, made-up numbers), and the
 * page says so where they show. The approval line is the format the engine
 * writes. The rules quoted are the engine's (engine.mjs RULES).
 *
 * FREE OR PAID: the button follows products.ts. Free → the email claim;
 * paid → checkout, with the button's own words and no price.
 */

const HERO_ID = "get";
const CLOSE_ID = "ma-close";
const CTA = "Get Meta Ads 2.0";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: (PRODUCT.priceCents / 100).toFixed(2),
    priceCurrency: PRODUCT.currency.toUpperCase(),
    url: abs(PRODUCT.href),
  },
};

/** The hero's report: `ads demo`, the example candle shop. */
const REPORT: { v: string; ad: string; num: string; sub: string; w: number }[] = [
  { v: "OFF", ad: "A2 · gift box carousel", num: "$96", sub: "0 sales", w: 45 },
  { v: "NEW", ad: "A4 · founder story", num: "$138", sub: "5 sales · tired", w: 64 },
  { v: "BEST", ad: "A1 · customer video", num: "$214", sub: "$17.83 a sale", w: 100 },
  { v: "KEEP", ad: "A6 · 5-star reviews", num: "$80", sub: "$26.67 a sale", w: 37 },
  { v: "WAIT", ad: "A5 · autumn scents", num: "$11", sub: "2 days live", w: 6 },
];

const STATS: { n: React.ReactNode; t: string }[] = [
  { n: <>1 <i>min</i></>, t: "a morning. Read it, say yes, get on with your day." },
  { n: <>2 <i>weeks</i></>, t: "of numbers behind every call. Never one bad day." },
  { n: <>0</>, t: "changes without your yes. In your words, written down." },
];

const BRAKES = [
  { title: "Your yes, every time.", body: "Every change waits for it, and your words are written down with the date. A yes to one thing is never a yes to another." },
  { title: "Judged on two weeks.", body: "An ad needs 1,000 views and 4 days before it’s judged. One that sells under your target is never switched off." },
  { title: "It says when it’s unsure.", body: "Too early, tracking broken, not enough spent: it tells you, and what would settle it." },
  { title: "Launches paused.", body: "New campaigns are checked first: made-up proof, wording Meta rejects, the rules for housing and jobs. Then they wait for you." },
];

const WAYS = [
  { title: "Meta’s own connector", body: "Log in with Facebook. Read and change from chat.", note: "Easiest" },
  { title: "An Ads Manager export", body: "Nothing to connect. One file a morning, in six languages.", note: "One minute" },
  { title: "A token", body: "Fully automatic: reports, leads, launches.", note: "15 minutes, once" },
];

function GetIt({ id, dark = false }: { id?: string; dark?: boolean }) {
  if (PRODUCT.free) {
    return (
      <div id={id} className="scroll-mt-28">
        <FreeClaim
          productId={PRODUCT.id}
          reveal={CTA}
          tone={dark ? "egypt-night" : "egypt"}
          align={dark ? "center" : "start"}
          prompt={false}
          quiet
          buttonClassName="ma-cta"
        />
      </div>
    );
  }
  return (
    <div id={id} className="scroll-mt-28">
      <BuyForm
        productId={PRODUCT.id}
        price={PRODUCT.priceLabel}
        label={CTA}
        soon={!forSale(PRODUCT)}
        reportErrors={!dark}
        align={dark ? "center" : "start"}
        buttonClassName="ma-cta"
      />
    </div>
  );
}

export function MetaAdsPage() {
  return (
    <main className="ma-page relative overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <MetaAdsLoader />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 01. THE PROMISE, THE BUTTON, THE MORNING REPORT. */}
      <section aria-labelledby="ma-title">
        <div className="mx-auto max-w-[80rem] px-5 pb-16 pt-28 sm:px-8 lg:pt-32">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:min-h-[calc(100svh-15rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="ma-rise">
              <p className="ma-pill">
                <b>2.0</b>
                Meta Ads · a skill for Claude Code
              </p>
              <h1 id="ma-title" className="ma-h1 mt-7">
                Stop paying for ads that <span className="ma-red">don&rsquo;t&nbsp;sell.</span>
              </h1>
              <p className="ma-lede mt-6 max-w-[36ch]">
                Every morning, Claude reads your Facebook and Instagram ads and tells you what to switch off, what to scale and
                what to make next. Nothing moves without your yes.
              </p>
              <div className="mt-9">
                <GetIt id={HERO_ID} />
              </div>
            </div>

            <figure className="ma-card m-0" aria-labelledby="ma-card-cap">
              <div className="ma-card__top">
                <span>Morning report · 09:00</span>
                <span>Example shop</span>
              </div>
              <div className="ma-card__sum">
                <strong>$583</strong>
                <span>
                  this week · 21 sales · <em>target $25</em> a sale
                </span>
              </div>
              <ul className="ma-rows">
                {REPORT.map((r, i) => (
                  <li key={r.ad} className="ma-row" data-v={r.v} style={{ "--i": i } as React.CSSProperties}>
                    <span className="ma-chip" data-v={r.v} style={{ "--i": i } as React.CSSProperties}>
                      {r.v}
                    </span>
                    <div className="ma-row__name">
                      <b>{r.ad}</b>
                      <div className="ma-row__bar" aria-hidden>
                        <i style={{ "--w": `${r.w}%`, "--i": i } as React.CSSProperties} />
                      </div>
                    </div>
                    <span className="ma-row__num">
                      {r.num}
                      <small>{r.sub}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="ma-card__ask">
                <p>
                  Switch off A2?
                  <span>$166 a sale over two weeks. About $96 a week goes to the ads that sell.</span>
                </p>
                <span className="ma-card__yes" aria-hidden>
                  Yes
                </span>
              </div>
              <figcaption id="ma-card-cap" className="ma-card__note">
                The skill&rsquo;s own example report: an example account, made-up numbers.
              </figcaption>
            </figure>
          </div>

          <ul className="ma-stats mt-16 lg:mt-20">
            {STATS.map((s, i) => (
              <li key={i} className="ma-stat">
                <strong>{s.n}</strong>
                <p>{s.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02. TRY A MORNING. */}
      <section aria-labelledby="ma-try" className="ma-band">
        <div className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8 md:py-28">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <div>
              <p className="ma-label text-white">Try a morning</p>
              <h2 id="ma-try" className="ma-h2 mt-5 max-w-[17ch]">
                It reads. It proposes. <span className="ma-stone">You say yes.</span>
              </h2>
            </div>
            <p className="ma-lede max-w-[34ch] text-white!">
              The skill&rsquo;s real report, on two example businesses. Pick what to do, then say yes.
            </p>
          </div>
          <div className="mt-10">
            <MetaAdsTry />
          </div>
        </div>
      </section>

      {/* 03. THE BRAKES, AND THE THREE WAYS IN. */}
      <section aria-labelledby="ma-brakes">
        <div className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8 md:py-28">
          <p className="ma-label">Built with brakes</p>
          <h2 id="ma-brakes" className="ma-h2 mt-5 max-w-[14ch]">
            No dollar moves <span className="ma-red">without your yes.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <MetaAdsGauge />
            <ol className="ma-brakes">
              {BRAKES.map((b, i) => (
                <li key={b.title} className="ma-brake">
                  <span className="ma-brake__n">0{i + 1}</span>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <h3 className="mt-20 text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-[1] tracking-[-0.05em]">
            Connect your way. <span className="ma-stone">Shops and lead businesses.</span>
          </h3>
          <ol className="ma-ways mt-7">
            {WAYS.map((w, i) => (
              <li key={w.title} className="ma-way">
                <span className="ma-way__n">{i + 1}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <small>{w.note}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="ma-close-title" className="scroll-mt-28">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 sm:px-8 md:pb-36">
          <div className="ma-close px-6 py-14 sm:px-12 md:py-20">
            <div className="relative text-center">
              <h2 id="ma-close-title" className="ma-h2 mx-auto max-w-[13ch]">
                Every morning. Plain words. <span className="ma-red">Your call.</span>
              </h2>
              <ol className="ma-steps mx-auto mt-10 max-w-[52rem] text-left">
                <li className="ma-step">
                  <b>1</b>Get it and unzip it
                </li>
                <li className="ma-step">
                  <b>2</b>
                  <span>
                    Type <kbd>claude</kbd>, then <kbd>hi</kbd>
                  </span>
                </li>
                <li className="ma-step">
                  <b>3</b>Answer four questions
                </li>
              </ol>
              <div id="claim" className="mt-10 flex scroll-mt-28 justify-center">
                <GetIt dark />
              </div>
              <ul className="ma-tags mx-auto mt-9 max-w-[44rem] justify-center">
                {["Facebook + Instagram", "Online shops", "Lead businesses", "Claude Code", "Mac · Windows · Linux"].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mx-auto mt-6 max-w-[52ch] text-[0.85rem] leading-[1.5] text-white/80">
                Needs Claude Code and Node.js 18+. An independent skill, not made by Meta.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name="Meta Ads 2.0"
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        href={PRODUCT.free ? "#claim" : undefined}
        label="Get it"
        soon={!PRODUCT.free && !forSale(PRODUCT)}
        note="Your ads, every morning"
        buttonClassName="bg-[#EB2F33] text-white hover:bg-[#d8262a] font-bold"
      />
    </main>
  );
}
