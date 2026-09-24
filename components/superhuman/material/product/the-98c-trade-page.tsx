import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { THE_98C_TRADE as PRODUCT } from "@/lib/shop/products";
import { Specimen } from "../specimens";
import { folderHref } from "../material-data";
import { BeforeAfter } from "./before-after";
import { BACKTEST_TOTAL } from "./backtest-data";
import { BuyForm } from "./buy-form";
import { StickyBuy } from "./sticky-buy";
import { ValueSection } from "./value-section";

/**
 * THE 98¢ TRADE, the first thing on this site with a price.
 *
 * Six parts, in the order a buyer's questions come up: what is it, what do I
 * get, does it work, is it easy, the leftover questions, buy. The first
 * version had ten and read long; Tobia wanted it shorter and "only
 * value-driven". So the page now leads with what the €5 gets you: something
 * that runs itself, a small tested edge, an idea you understand, and code you
 * can build on, acted out by the product's own mark in 3D (value-section.tsx).
 * Everything else was folded into those or into the questions.
 *
 * THE COPY IS PLAIN ON PURPOSE. No dashes, no three-beat slogans, no "the
 * honest part". Tobia's word for that register was "AI slop", and he is right
 * that it reads as nobody in particular. Sentences say one thing each.
 *
 * Every number is in the product's own guide/EVIDENCE.md or generated from
 * its trade-level CSV (backtest-data.ts). Nothing is projected into income.
 */

const HERO_ID = "buy";
const CLOSE_ID = "buy-close";

const label =
  "font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]";
const h2 =
  "text-balance font-serif text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)]";

const VALUE = [
  {
    title: "A bot that runs every day",
    text: "Claude installs it and schedules a daily scan in about ten minutes. You paste one API key and never write a line of code.",
  },
  {
    title: "A small, tested edge",
    text: "It buys bets priced 97 to 99.5¢ that settle within a week, after Jev, TypeSafe's AI, has read each market's rules. It starts with practice money and only suggests real trades once it passes a checklist.",
  },
  {
    title: "An idea you'll understand",
    text: "Crowds slightly underprice outcomes that are nearly certain. The guides explain why that happens, how a market decides who gets paid, and how to test a strategy before you trust it.",
  },
  {
    title: "Code you can build on",
    text: `You get all of it: the Python bot, the research scripts and all ${BACKTEST_TOTAL.trades.toLocaleString("en-US")} backtested trades. Add a market, try your own filter, or point Jev at something else entirely.`,
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Do I need to know how to code?",
    a: "No. Claude installs everything and walks you through each step. The only thing you do yourself is paste one API key into a file.",
  },
  {
    q: "Does it trade with my money?",
    a: "Not at first. It trades practice money on real prices. Once it passes its go-live checklist, usually after four to eight weeks, it suggests real trades and you place them yourself.",
  },
  {
    q: "How much can I make?",
    a: `Nobody can promise a number. In the backtest the average trade made +${BACKTEST_TOTAL.avgReturnPct}%, and about 1 in 100 lost its whole stake. Expect small, steady gains.`,
  },
  {
    q: "What does it cost to run?",
    a: `Jev costs about 1 to 2 cents a day, paid to TypeSafe. The ${PRODUCT.priceLabel} is a one-time payment with no subscription. You also need Claude Code, which comes with a paid Claude plan.`,
  },
  {
    q: "Can I use it where I live?",
    a: "Practice trading works anywhere. Real trading depends on your country: international Polymarket doesn't accept orders from the US, the UK, Italy and a few others, and Kalshi covers the US and many more. The folder has a guide to both.",
  },
  {
    q: "How do I get it?",
    a: "The download opens right after you pay, and the folder is emailed to you as well. If you buy on your phone, open the email on your computer.",
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-[var(--hairline)] bg-[rgba(11,31,58,0.045)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--ink)]">
      {children}
    </code>
  );
}

/** Structured data, so a search result can show the price. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: PRODUCT.name,
  description:
    "A prediction-market bot for Polymarket and Kalshi that sets itself up in Claude Code. It trades near-certain bets with practice money first, and Jev reads every market's rules.",
  image: abs(`/shop/${PRODUCT.id}.png`),
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

export function The98cTradePage() {
  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. WHAT IT IS. The button is inside the first screen on a phone. */}
      <header className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
        <Specimen
          id={PRODUCT.id}
          className="product-hero-mark h-auto w-[min(58vw,230px)] md:w-[280px]"
        />

        <span className={`${label} mt-2`}>Setup for Claude Code</span>

        <h1 className="mt-4 font-serif text-[clamp(3.1rem,11vw,6.4rem)] leading-[0.92] tracking-[-0.045em] text-[var(--ink)]">
          {PRODUCT.name}
        </h1>

        <p className="mx-auto mt-6 max-w-[30ch] text-balance text-[1.2rem] leading-[1.42] text-[color:rgba(11,31,58,0.72)] md:text-[1.38rem]">
          A prediction-market bot that sets itself up. Download the folder,
          open it in Claude Code and type hi.
        </p>

        <div id={HERO_ID} className="mt-9 flex scroll-mt-28 flex-col items-center">
          <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} reportErrors />
          <p className="mt-5 text-[0.95rem] text-[color:rgba(11,31,58,0.62)]">
            Backtested on {BACKTEST_TOTAL.trades.toLocaleString("en-US")} Polymarket trades. 99% paid out.
          </p>
        </div>
      </header>

      {/* 2. WHAT THE €5 GETS YOU. One pinned stage: the coin acts it out. */}
      <ValueSection
        title={`What you get for ${PRODUCT.priceLabel}`}
        points={VALUE}
        productId={PRODUCT.id}
      />

      {/* 3. DOES IT WORK. The first bot's trades, then the backtest's. */}
      <section
        aria-labelledby="evidence-title"
        className="border-y border-[var(--hairline)] bg-[rgba(255,255,255,0.35)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <h2 id="evidence-title" className={`${h2} max-w-[17ch]`}>
              From losing 5 trades in 7 to losing 1 in 104
            </h2>
            <p className="max-w-[46ch] text-pretty text-[1.05rem] leading-[1.65] text-[color:rgba(11,31,58,0.72)]">
              The first bot guessed which way crypto would move in the next
              five minutes, and most guesses lost. The 98¢ Trade stopped
              guessing. It only buys what the market already prices at 97 to
              99.5¢, and Jev reads each market&rsquo;s rules first.
            </p>
          </div>

          <div className="mt-12 md:mt-14">
            <BeforeAfter />
          </div>

          <p className="mt-8 max-w-[70ch] text-pretty text-[0.9rem] leading-relaxed text-[color:rgba(11,31,58,0.62)]">
            Before: seven trades from the first bot&rsquo;s dashboard. After:
            the bot as shipped, backtested on Polymarket before real-world fill
            effects. Past results don&rsquo;t guarantee future ones. The data
            and the scripts are in the folder.
          </p>
        </div>
      </section>

      {/* 4. IS IT EASY. Three steps, and what Claude says back. */}
      <section
        aria-labelledby="setup-title"
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1fr_1.05fr] lg:gap-20"
      >
        <div>
          <h2 id="setup-title" className={`${h2} max-w-[12ch]`}>
            Ten minutes to set up
          </h2>

          <ol className="mt-9 max-w-[30rem] list-none border-b border-[var(--hairline)]">
            {[
              <>Download the folder and unzip it.</>,
              <>
                Open a terminal in the folder and type <Kbd>claude</Kbd>
              </>,
              <>
                Type <Kbd>hi</Kbd>
              </>,
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-4 text-[1.08rem] text-[var(--ink)]"
              >
                <span className="w-6 shrink-0 font-mono text-[0.78rem] tracking-[0.1em] text-[var(--accent-clay-text)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-[42ch] text-pretty text-[0.98rem] leading-[1.6] text-[color:rgba(11,31,58,0.66)]">
            You&rsquo;ll need Claude Code and a Mac, Windows or Linux computer.
          </p>
        </div>

        {/* Claude's actual opening line from the folder's /start command, then
            the steps it runs. No counts or results, since those change daily. */}
        <Reveal>
          <figure className="overflow-hidden rounded-2xl bg-[var(--ink)] text-[var(--paper)] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.7)]">
            <div className="flex items-center gap-2 border-b border-[var(--hairline-on-ink)] px-5 py-3.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[rgba(250,248,242,0.22)]" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[rgba(250,248,242,0.22)]" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[rgba(250,248,242,0.22)]" />
              <figcaption className="ml-3 font-mono text-[0.7rem] tracking-[0.06em] text-[rgba(250,248,242,0.55)]">
                ~/Documents/the-98c-trade
              </figcaption>
            </div>
            <div className="space-y-3 px-5 py-6 font-mono text-[0.9rem] leading-[1.6] md:px-7 md:py-8 md:text-[0.95rem]">
              <TerminalLine delay={0}>
                <span className="text-[rgba(250,248,242,0.45)]">$</span> claude
              </TerminalLine>
              <TerminalLine delay={250}>
                <span className="text-[var(--accent-clay)]">&gt;</span> hi
              </TerminalLine>
              <TerminalLine delay={600} className="text-[rgba(250,248,242,0.86)]">
                I&rsquo;ll get your bot running. It takes about 10 minutes and
                I&rsquo;ll do most of it. You&rsquo;ll create one account and paste
                one key.
              </TerminalLine>
              {[
                "Installed what the bot needs",
                "Your TypeSafe key works",
                "First scan done, report written",
                "Runs every day at 9:00",
              ].map((line, i) => (
                <TerminalLine
                  key={line}
                  delay={1000 + i * 260}
                  className="text-[rgba(250,248,242,0.78)]"
                >
                  <span className="mr-2.5 text-[#7fc8a9]">✓</span>
                  {line}
                </TerminalLine>
              ))}
            </div>
          </figure>
        </Reveal>
      </section>

      {/* 5. THE LEFTOVER QUESTIONS. Native <details>, so it works without script. */}
      <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-6 pb-28 md:pb-36">
        <h2 id="faq-title" className={h2}>
          Questions
        </h2>
        <div className="mt-10 border-b border-[var(--hairline)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-t border-[var(--hairline)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.12rem] leading-snug tracking-[-0.01em] text-[var(--ink)] transition-colors hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)] md:text-[1.2rem] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="relative h-3.5 w-3.5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <div className="pb-6 pr-8 text-pretty text-[1.02rem] leading-[1.65] text-[color:rgba(11,31,58,0.7)]">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 6. BUY. The only ink on the page, so the ending is unmistakable. */}
      <section
        id={CLOSE_ID}
        aria-labelledby="close-title"
        className="ink-field relative overflow-hidden px-6 py-24 text-center md:py-32"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <Specimen id={PRODUCT.id} instance="close" className="h-auto w-[140px] md:w-[170px]" />
          <h2
            id="close-title"
            className="mt-6 max-w-[18ch] text-balance font-serif text-[clamp(2.2rem,5.6vw,3.9rem)] leading-[1.04] tracking-[-0.04em] text-[var(--paper)]"
          >
            Set it up tonight and see your first results within a week.
          </h2>
          <div className="mt-10">
            <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} tone="ink" />
          </div>
          <p className="mt-5 text-[0.92rem] text-[rgba(250,248,242,0.7)]">
            One payment, secure checkout by Stripe.
          </p>
          <p className="mt-14 max-w-[56ch] text-pretty text-[0.85rem] leading-relaxed text-[rgba(250,248,242,0.55)]">
            Not financial advice. About 1 in 100 of these trades loses its
            stake, and past results don&rsquo;t guarantee future ones.
            Prediction markets are restricted in some countries.
          </p>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
      />
    </main>
  );
}

/** One line of the terminal, arriving a beat after the one before it. */
function TerminalLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <p>{children}</p>
    </Reveal>
  );
}
