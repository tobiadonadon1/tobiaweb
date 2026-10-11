import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { GROK_ARMY as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { ArmyFormation } from "./grok-army-formation";
import { GrokArmyBanner } from "./grok-army-banner";
import { LEAD, botShape } from "./grok-army-bots";
import { StickyBuy } from "./sticky-buy";

/**
 * GROK ARMY, a paid skill: Claude asks four questions, designs a team of
 * Grok Bots around the buyer's goal WITH them, and writes one file that Grok
 * Bot builds the army from.
 *
 * THREE SECTIONS, Tobia's limit: what it is (and the button), your army being
 * built as you scroll, how you get it (and the button again). Simple words,
 * nothing invented: no amounts, no testimonials, no results promised.
 *
 * NO FIXED ROSTER. The buyer has total creative control: they set the goal,
 * and Claude designs the bots with them (rename, add, drop, reshape). So the
 * page never names bots or gives them jobs. The only role it mentions is the
 * one bot you talk to, without a name.
 *
 * THE BANNER AND THE EXAMPLE BOTS are Tobia's own drawings (public/shop/
 * grok-army/). The bots strip is examples to start from, never a roster.
 *
 * THE LOOK (Tobia, after the first version): matte black, simple colours, and
 * mascots that look like Grok Bot's real avatars (flat shapes, two white pill
 * eyes) with the one you talk to as a brushed-metal disc with slot eyes. The
 * bots are product/grok-army-bots.ts, the same drawings as the Setups card,
 * the share card and the Stripe image. White is the only accent: the button
 * and the progress bar. The site's own Host Grotesk at 800 for the voice.
 */

const HERO_ID = "buy";
const CLOSE_ID = "buy-close";
const SOON = !forSale(PRODUCT);

const BUTTON =
  "bg-[var(--ga-accent)] text-[var(--ga-on-accent)] shadow-[0_18px_40px_-22px_rgba(255,255,255,0.35)] hover:bg-white";

const STEPS: React.ReactNode[] = [
  <>Answer four questions in Claude Code.</>,
  <>Claude writes one file to your Desktop: your army, built around your goal.</>,
  <>
    Give it to a new Grok Bot and say <q className="font-semibold text-[var(--ga-ink)]">Build my army from this file.</q>{" "}
    Claude coaches you through every step in the app.
  </>,
];

const PROMISES: [string, string][] = [
  ["Your army, your design", "Your goal, your bots, your names. Change the team any time, and Claude tunes it with you."],
  ["A first result in the first half hour", "Real work on your goal, before the rest of the army is even created."],
  ["It asks first", "Nothing is sent, posted, bought or deleted without your OK. You always press the last button."],
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

      {/* 1. WHAT IT IS, AND THE BUTTON, then the banner: the whole crowd of
          bots heading for one goal, and the goal keeps changing. */}
      <section aria-labelledby="ga-title" className="relative">
        <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-20 sm:px-8 md:pt-24 lg:pb-24">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-[1rem] font-semibold text-[var(--ga-soft)]">Grok Army · a skill for Claude Code</p>
              <h1 id="ga-title" className="mt-3 max-w-[16ch] text-balance text-[clamp(2.5rem,8.6vw,4.6rem)] font-extrabold leading-[0.96] tracking-[-0.045em]">
                Turn Grok Bot into an army that works for you 24/7.
              </h1>
            </div>
            <div>
              <p className="max-w-[38ch] text-pretty text-[1.1rem] leading-[1.5] text-[var(--ga-soft)] lg:text-[1.2rem]">
                Answer four questions in Claude and design your own team of Grok bots around your goal: more clients,
                more sales, more reach, a launch, a clear inbox. It works on it every day and keeps score every week.
              </p>
              <div id={HERO_ID} className="mt-7 scroll-mt-28">
                <Buy reportErrors />
              </div>
              <p className="mt-4 max-w-[40ch] text-pretty text-[0.95rem] leading-[1.5] text-[var(--ga-soft)]">
                A first result in the first half hour. Nothing is posted, sent or bought without your OK.
              </p>
            </div>
          </div>

          <GrokArmyBanner className="mt-12 lg:mt-16" />
        </div>
      </section>

      {/* 2. YOUR ARMY, built as you scroll: the goal, then the team. */}
      <section aria-labelledby="ga-army" className="relative bg-[var(--ga-ground-2)]">
        <div className="mx-auto max-w-[80rem] px-5 pt-20 sm:px-8 md:pt-28">
          <h2 id="ga-army" className="max-w-[14ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Your army, designed by you.
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty text-[1.1rem] leading-[1.55] text-[var(--ga-soft)] lg:text-[1.2rem]">
            No fixed roster. You choose the goal, and every bot is made for it, with you.
          </p>
          <figure className="m-0 mt-12 lg:mt-16">
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
              <Image
                src="/shop/grok-army/bots.webp"
                alt="Example bots: Chief of Staff, Find Clients, Grow X, Write Posts, Inbox Assistant, Lead Magnets, Research and Support"
                width={1600}
                height={533}
                sizes="(min-width: 1280px) 1216px, (min-width: 640px) 100vw, 56rem"
                className="block h-auto w-[56rem] max-w-none rounded-[1.5rem] sm:w-full sm:max-w-full sm:rounded-[2rem]"
              />
            </div>
            <figcaption className="mt-4 max-w-[52ch] text-pretty text-[1rem] leading-[1.5] text-[var(--ga-soft)]">
              A few bots people start with. Take any of them, rename them, or design ones nobody has made yet.
            </figcaption>
          </figure>
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
                    <span className="w-5 shrink-0 text-[1rem] font-extrabold text-[var(--ga-ink)]">{i + 1}</span>
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
            <svg viewBox="0 0 100 100" className="w-[5rem] shrink-0" aria-hidden>
              {botShape(LEAD)}
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
