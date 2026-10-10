import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { GROK_ARMY as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { ArmyFormation } from "./grok-army-formation";
import { botShape, squadShapes } from "./grok-army-bots";
import { StickyBuy } from "./sticky-buy";

/**
 * GROK ARMY, a paid skill: Claude asks four questions and writes one file,
 * and Grok Bot builds a team of bots from it.
 *
 * THREE SECTIONS, Tobia's limit: what it is (and the button), the army
 * assembling as you scroll (one bot per job), how you get it (and the button
 * again). Simple colours, simple words, nothing invented: no amounts, no
 * testimonials, no income promised. "Built to pay for itself" and "keeps
 * score until it does" are the only money words.
 *
 * THE LOOK. Olive drab, because it is an army, and because black would read
 * as Grok's own brand: these are original bots, not xAI's. One yellow does
 * every job that matters (the button, the role labels, the payback bar).
 * The site's own Host Grotesk at 800 for the voice; its round bowls suit the
 * round bots. The mascots are product/grok-army-bots.ts, the same drawings
 * as the Setups card, the share card and the Stripe image.
 *
 * NOT ON SALE UNTIL IT HAS A STRIPE ID. With `stripeProductId` empty the
 * buttons say "Checkout opens soon" and cannot submit; see products.ts.
 */

const HERO_ID = "buy";
const CLOSE_ID = "buy-close";
const SOON = !forSale(PRODUCT);

const BUTTON =
  "bg-[var(--ga-accent)] text-[var(--ga-on-accent)] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.65)] hover:bg-[#ffd361]";

const STEPS: React.ReactNode[] = [
  <>Answer four questions in Claude Code.</>,
  <>Claude writes one file to your Desktop: your army, built around your goal.</>,
  <>
    Give it to a new Grok Bot and say <q className="font-semibold text-[var(--ga-ink)]">Build my army from this file.</q>{" "}
    Claude coaches you through every step in the app.
  </>,
];

const PROMISES: [string, string][] = [
  ["A first result in the first half hour", "Real work on your goal, before the rest of the army is even created."],
  ["It asks first", "Nothing is sent, posted, bought or deleted without your OK. On X, it prepares the post and you tap Post."],
  ["Better every week", "Every Friday each bot reads your edits and its own numbers, and rewrites its playbook."],
  ["It keeps score", "A weekly scoreboard on your goal, and a three-line receipt that traces each result back to the work that caused it."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}.png`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  // No offer until it can actually be bought.
  ...(SOON
    ? {}
    : {
        offers: {
          "@type": "Offer",
          price: (PRODUCT.priceCents / 100).toFixed(2),
          priceCurrency: PRODUCT.currency.toUpperCase(),
          availability: "https://schema.org/InStock",
          url: abs(PRODUCT.href),
        },
      }),
};

function Buy({ reportErrors = false }: { reportErrors?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get Grok Army · ${PRODUCT.priceLabel}`}
      soon={SOON}
      tone="ink"
      reportErrors={reportErrors}
      buttonClassName={BUTTON}
    />
  );
}

export function GrokArmyPage() {
  return (
    <main className="ga-page relative overflow-x-clip bg-[var(--ga-ground)] text-[var(--ga-ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. WHAT IT IS, AND THE BUTTON. The squad first on a phone, so the
          first screen is bots, the promise and the button. */}
      <section aria-labelledby="ga-title" className="relative">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-center gap-6 px-5 pb-20 pt-20 sm:px-8 md:pt-24 lg:min-h-[min(100svh,58rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:pb-24">
          <svg viewBox="0 0 400 330" className="ga-squad mx-auto block h-auto w-[min(78vw,20rem)] lg:order-2 lg:w-full lg:max-w-[36rem]" aria-hidden>
            {squadShapes((_, i) => `ga-hop ga-hop-${i}`)}
          </svg>

          <div className="lg:order-1">
            <p className="text-[1rem] font-semibold text-[var(--ga-accent)]">Grok Army · a skill for Claude Code</p>
            <h1 id="ga-title" className="mt-3 max-w-[15ch] text-balance text-[clamp(2.5rem,10.4vw,5.1rem)] font-extrabold leading-[0.96] tracking-[-0.045em]">
              Turn Grok Bot into an army that works for you 24/7.
            </h1>
            <p className="mt-5 max-w-[38ch] text-pretty text-[1.1rem] leading-[1.5] text-[var(--ga-soft)] lg:text-[1.25rem]">
              Answer four questions in Claude. Grok Bot builds the team: a Chief of Staff you talk to, and one bot for
              each job. Built around your goal, and it keeps score every week.
            </p>
            <div id={HERO_ID} className="mt-8 scroll-mt-28">
              <Buy reportErrors />
            </div>
            <p className="mt-4 max-w-[40ch] text-pretty text-[0.95rem] leading-[1.5] text-[var(--ga-soft)]">
              A first result in the first half hour. Nothing is posted, sent or bought without your OK.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE ARMY, assembling as you scroll: one bot per job. */}
      <section aria-labelledby="ga-army" className="relative bg-[var(--ga-ground-2)]">
        <div className="mx-auto max-w-[80rem] px-5 pt-20 sm:px-8 md:pt-28">
          <h2 id="ga-army" className="max-w-[16ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            One bot for each job, and one boss you talk to.
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty text-[1.1rem] leading-[1.55] text-[var(--ga-soft)] lg:text-[1.2rem]">
            Your army starts with the Chief of Staff and the one or two bots your goal needs. The rest join when they have
            earned a place. They work around the clock on routines, in Grok Bot&rsquo;s cloud.
          </p>
          <ArmyFormation />
        </div>
      </section>

      {/* 3. HOW YOU GET IT, WHAT YOU CAN COUNT ON, AND THE BUTTON. */}
      <section id={CLOSE_ID} aria-labelledby="ga-close" className="scroll-mt-28">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="ga-close" className="max-w-[14ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                From four questions to a working army in one evening.
              </h2>
              <ol className="mt-10 list-none border-b border-[var(--ga-line)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[var(--ga-line)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 text-[1rem] font-extrabold text-[var(--ga-accent)]">{i + 1}</span>
                    <span className="text-[var(--ga-soft)]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <dl className="m-0 grid grid-cols-1 gap-8 self-end sm:grid-cols-2 sm:gap-x-10">
              {PROMISES.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[1.2rem] font-bold leading-[1.2] tracking-[-0.015em]">{k}</dt>
                  <dd className="m-0 mt-2 text-pretty text-[1.05rem] leading-[1.55] text-[var(--ga-soft)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 flex flex-col items-start gap-6 border-t border-[var(--ga-line)] pt-12 sm:flex-row sm:items-center sm:gap-8 md:mt-20">
            <svg viewBox="0 0 100 122" className="w-[5.5rem] shrink-0" aria-hidden>
              {botShape("chief")}
            </svg>
            <div>
              <Buy />
              <p className="mt-4 max-w-[52ch] text-pretty text-[0.95rem] leading-[1.5] text-[var(--ga-soft)]">
                One payment, secure checkout by Stripe. You&rsquo;ll need Claude Code and Grok Bot.
              </p>
            </div>
          </div>

          <p className="mt-12 max-w-[70ch] text-pretty text-[0.95rem] leading-[1.6] text-[var(--ga-faint)]">
            No results are promised. The army tracks its progress on your goal, and what it costs. X decides its own
            creator payouts, and they aren&rsquo;t guaranteed. Grok Army is an independent skill, not made by xAI.
          </p>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        note={SOON ? "Checkout opens soon" : "Instant download"}
        soon={SOON}
        buttonClassName={BUTTON}
      />
    </main>
  );
}
