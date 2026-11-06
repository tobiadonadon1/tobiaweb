import { Archivo } from "next/font/google";
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
import { Marker, Splatter, Spray } from "./meta-ads-art";
import "./meta-ads.css";

/**
 * META ADS 2.0, a skill for Claude Code that runs a business's Meta ads with
 * them: a morning report in plain words, options with the number behind each,
 * nothing changed without their yes.
 *
 * THE LOOK (Tobia, 2026-11-06): simple, straightforward, Helvetica set
 * tight. His colours, exactly: Egyptian blue #03203D, stone blue #639CC5 a
 * little less, scarlet #EB2F33 for highlights. A first version on white was
 * not it: he sent a reference (a streetwear poster page) and wanted "the
 * background to be that blue". So: the whole page on Egyptian blue, condensed
 * black uppercase, a stone-blue panel, spray, splatter and marker by hand, an
 * outlined scarlet button (meta-ads.css, meta-ads-art.tsx).
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

/** Where Helvetica Neue Condensed isn't installed (Windows, Android), the same poster in Archivo, narrowed. */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--ma-archivo", display: "swap" });

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
          tone="egypt-night"
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
    <main className={`ma-page ${archivo.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <MetaAdsLoader />
      <BackLink href={folderHref("skills")} label="Skills" tone="ink" />

      {/* 01. THE POSTER: THE PROMISE | THE MORNING REPORT ON STONE. */}
      <section aria-labelledby="ma-title">
        <div className="ma-hero">
          <div className="ma-hero__left">
            <div className="ma-rise relative">
              <p className="ma-pill">
                <b>2.0</b>
                Meta Ads · a skill for Claude Code
              </p>
              <h1 id="ma-title" className="ma-h1 mt-8">
                Stop paying for ads that <span className="ma-red">don&rsquo;t&nbsp;sell.</span>
              </h1>
            </div>
            <div className="ma-hero__low">
              <div className="ma-hero__paint" aria-hidden>
                <Spray id="ma-spray-1" className="-left-12 -bottom-8 h-[16rem] w-[21rem]" d="M30 250 C 60 120, 210 90, 250 170 S 160 290, 120 210 S 230 60, 380 40" />
                <Splatter id="ma-splat-1" seed={11} className="-top-2 left-20 h-[11rem] w-[11rem]" />
              </div>
              <div className="ma-rise relative">
                <p className="ma-shout max-w-[40ch]">
                  Every morning, Claude reads your Facebook and Instagram ads. It tells you what to switch off, what to scale
                  and what to make next, with the number behind every call. And it moves nothing, not one dollar, without
                  your yes.
                </p>
                <div className="mt-8">
                  <GetIt id={HERO_ID} />
                </div>
              </div>
            </div>
          </div>

          <div className="ma-hero__right">
            <div className="ma-streaks" aria-hidden>
              {[
                ["22%", "0.5rem", "0s"],
                ["25%", "1.4rem", "-3s"],
                ["31%", "0.4rem", "-1s"],
                ["47%", "0.9rem", "-5s"],
                ["63%", "1.6rem", "-2s"],
                ["71%", "0.5rem", "-4s"],
                ["88%", "1rem", "-6s"],
              ].map(([t, h, dl]) => (
                <i key={t} style={{ "--t": t, "--h": h, "--dl": dl } as React.CSSProperties} />
              ))}
            </div>
            <p className="ma-hero__caps" aria-hidden>
              <span>It doesn&rsquo;t spend.</span>
              <span>You do.</span>
            </p>
            <div className="ma-cardwrap">
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
                      {r.v === "OFF" && (
                        <Marker
                          id="ma-ring"
                          className="ma-ring"
                          viewBox="0 0 400 60"
                          width={4}
                          d="M30 8 C 120 -2, 330 0, 392 14 C 404 30, 390 52, 300 56 C 190 62, 40 60, 10 46 C -6 34, 4 12, 60 6"
                        />
                      )}
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
              </figure>
              <p id="ma-card-cap" className="ma-card__note">
                The skill&rsquo;s own example report: an example account, made-up numbers.
              </p>
            </div>
          </div>
        </div>

        <ul className="ma-stats">
          {STATS.map((s, i) => (
            <li key={i} className="ma-stat">
              <strong>{s.n}</strong>
              <p>{s.t}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 02. TRY A MORNING. */}
      <section aria-labelledby="ma-try">
        <div className="mx-auto max-w-[80rem] px-5 py-20 sm:px-10 md:py-28">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <div>
              <p className="ma-label">Try a morning</p>
              <h2 id="ma-try" className="ma-h2 relative mt-5 max-w-[14ch]">
                It reads. It proposes. <span className="ma-red">You say yes.</span>
              </h2>
            </div>
            <p className="ma-lede max-w-[34ch]">
              The skill&rsquo;s real report, on two example businesses. Pick what to do, then say yes.
            </p>
          </div>
          <div className="mt-12">
            <MetaAdsTry />
          </div>
        </div>
      </section>

      {/* 03. THE BRAKES: THE LIMIT ON STONE | THE RULES ON BLUE. THEN THE THREE WAYS IN. */}
      <section aria-labelledby="ma-brakes">
        <div className="mx-auto max-w-[80rem] px-5 pb-12 sm:px-10">
          <h2 id="ma-brakes" className="ma-h2 max-w-[13ch]">
            No dollar moves <span className="ma-red">without your yes.</span>
          </h2>
        </div>
        <div className="ma-split">
          <div className="ma-split__stone">
            <MetaAdsGauge />
          </div>
          <div className="ma-split__blue">
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
        </div>
        <div className="mx-auto max-w-[80rem] px-5 pt-16 sm:px-10">
          <h3 className="ma-h2 !text-[clamp(2.2rem,4.4vw,3.8rem)]">
            Connect your way. <span className="ma-stone">Shops and lead businesses.</span>
          </h3>
        </div>
        <ol className="ma-ways mt-8 border-y border-[color:var(--ma-line)]">
          {WAYS.map((w, i) => (
            <li key={w.title} className="ma-way">
              <span className="ma-way__n">0{i + 1}</span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <small>{w.note}</small>
            </li>
          ))}
        </ol>
      </section>

      {/* 04. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="ma-close-title" className="ma-close scroll-mt-28">
        <Spray id="ma-spray-2" className="-right-24 top-10 h-[24rem] w-[32rem] opacity-80" d="M380 40 C 300 90, 330 200, 230 210 S 90 120, 140 70 S 260 160, 40 270" />
        <Splatter id="ma-splat-2" seed={23} className="-left-10 bottom-16 h-[14rem] w-[14rem] opacity-90" />
        <div className="relative mx-auto max-w-[80rem] px-5 pb-28 pt-24 text-center sm:px-10 md:pb-36 md:pt-32">
          <h2 id="ma-close-title" className="ma-h2 mx-auto max-w-[12ch] !text-[clamp(3.6rem,9vw,8.6rem)]">
            Every morning. Plain words. <span className="ma-red">Your call.</span>
          </h2>
          <ol className="ma-steps mx-auto mt-12 max-w-[56rem] text-left">
            <li className="ma-step">
              <b>1</b>Get it, unzip it
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
          <div id="claim" className="mt-12 flex scroll-mt-28 justify-center">
            <GetIt dark />
          </div>
          <ul className="ma-tags mx-auto mt-10 max-w-[46rem] justify-center">
            {["Facebook + Instagram", "Online shops", "Lead businesses", "Claude Code", "Mac · Windows · Linux"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-[52ch] text-[0.88rem] leading-[1.5] text-white/85">
            Needs Claude Code and Node.js 18+. An independent skill, not made by Meta.
          </p>
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
        buttonClassName="bg-[#EB2F33] text-white hover:bg-[#d8262a] font-bold rounded-none"
      />
    </main>
  );
}
