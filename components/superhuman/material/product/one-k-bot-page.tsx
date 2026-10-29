import { Archivo, Geist_Mono, Instrument_Serif } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { ONE_K_BOT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { LEAD, botShape } from "./grok-army-bots";
import { ChallengeStatus } from "./one-k-bot-status";
import { OneKBotLoader } from "./one-k-bot-loader";
import { GoldenTicket, MiniTicket } from "./one-k-bot-ticket";
import { StickyBuy } from "./sticky-buy";
import "./one-k-bot.css";

/**
 * THE $1K BOT, a free Grok Bot and the way into Tobia's 10-day challenge.
 *
 * Tobia's brief (2026-10-29): given away free, the lead magnet of a post.
 * The design impeccable and "highly premium", the words short, simple and
 * converting; a banger loader; a first screen in Grok Bot's own look (black,
 * clean, little text, straight to the value) with a strong graphic, the way
 * Web Designer's is.
 *
 * SO: Grok's black under a fine grain, warm white type, and gold as metal,
 * never as a flat yellow: "$1K" is struck in gold with a light passing over
 * it, and a serif italic is the second voice beside the heavy grotesk. The
 * opening (one-k-bot-loader.tsx) has the metal disc hop across ten days while
 * an odometer rolls to $1,000, then the screen opens on a gold seam. The
 * graphic is what the bot actually hands you, a morning check-in with today's
 * 3 tasks ticking off. Then three ways in; the challenge as a golden ticket
 * (the instructions open on one); the close.
 *
 * NOTHING FROM THE BOT FILE IS ON THE PAGE: the three ways and the prize are
 * the post's own words, and the file itself is only in the download.
 *
 * WHAT IS REAL: the check-in is an example of the bot's morning message (its
 * shape is the file's: yesterday's numbers, where you stand against $1,000,
 * today's 3 tasks); the caption says it's an example, and no number on the
 * page is anybody's result.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--okb-archivo", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--okb-serif", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--okb-mono", display: "swap" });

const HERO_ID = "claim";
const CLOSE_ID = "okb-close";

const INK = "#070707";

const WAYS = [
  {
    n: "1",
    title: "Sell AI automations to local businesses",
    tag: "Highest success rate",
    does: ["Finds the ones still doing it all by hand", "Builds each one a demo", "Writes the outreach, books the calls"],
  },
  {
    n: "2",
    title: "Sell what you're already good at",
    does: ["Picks one offer you can sell this week", "Finds the people who'd pay for it", "Runs the outreach with you, every day"],
  },
  {
    n: "3",
    title: "Sell the product you already have",
    does: ["Reads your reviews and your competitors", "Rewrites your offer and landing page", "Makes and posts the content that sells it"],
  },
] as const;

const PRIZE = [
  ["A product built with me", "aiming for $10K a month in 30 days"],
  ["A personal masterclass", "on building your own brand on X"],
  ["Construct Ultimate", "the top membership, free"],
] as const;

/** Friday 30 October to Sunday 8 November 2026. */
const DAYS = [
  ["F", "30"],
  ["S", "31"],
  ["S", "1"],
  ["M", "2"],
  ["T", "3"],
  ["W", "4"],
  ["T", "5"],
  ["F", "6"],
  ["S", "7"],
  ["S", "8"],
] as const;

const STEPS: React.ReactNode[] = [
  <>Get the bot. Give its file to a new Grok Bot, on a computer that stays on.</>,
  <>Connect a business email and a way to get paid.</>,
  <>
    Say <q className="font-semibold text-white">Start the challenge</q> and pick 1, 2 or 3.
  </>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Grok Bot",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--okb-mono)] text-[0.7rem] uppercase tracking-[0.14em] ${className}`}>{children}</span>
  );
}

/** The second voice: a serif italic, in gold. */
function Gold({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`okb-metal font-[family-name:var(--okb-serif)] font-normal italic tracking-[-0.02em] ${className}`}>{children}</span>;
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M3.5 8.4 6.6 11.2 12.5 4.8" fill="none" stroke="#140d00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * THE HERO'S GRAPHIC: the bot's morning message, as it lands in Grok Bot.
 * The money so far, the bar to $1,000 with its ten days, today's 3 tasks
 * (each already prepared, each ticking off), and the bot perched on top.
 */
function CheckIn() {
  const tasks = [
    ["Approve 12 demo emails", "drafts ready"],
    ["Call Studio Nove at 3 pm", "notes ready"],
    ["Follow up 5 open quotes", "drafts ready"],
  ] as const;
  return (
    <figure className="m-0 w-full max-w-[31rem] justify-self-center">
      <div className="relative pt-24">
        <div className="relative">
          {/* The bot lives behind the card and peeks out round its edges. */}
          <div className="okb-peek" aria-hidden>
            <svg viewBox="0 0 100 100" className="okb-peek__bot overflow-visible">
              {botShape(LEAD)}
            </svg>
          </div>
          <div className="okb-glass relative z-[2] rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 100" className="w-9 shrink-0" aria-hidden>
                {botShape(LEAD)}
              </svg>
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[0.98rem] font-semibold leading-tight text-white">The $1K Bot</p>
                <p className="m-0 mt-0.5 whitespace-nowrap text-[0.84rem] text-white/45">
                  <span className="hidden min-[400px]:inline">Good morning · </span>7:00
                </p>
              </div>
              <Mono className="okb-chip shrink-0 rounded-full px-3 py-1.5 text-[0.62rem] text-[#F2CD6B]">Day 6 of 10</Mono>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <p className="m-0 font-[family-name:var(--okb-archivo)] text-[3.6rem] font-black leading-[0.85] tracking-[-0.045em] text-white">
                <span className="sr-only">$480</span>
                <span className="okb-cash" aria-hidden />
              </p>
              <p className="m-0 pb-1 text-right text-[0.88rem] leading-snug text-white/50">
                of <span className="font-semibold text-[#F2CD6B]">$1,000</span>
                <br />
                collected
              </p>
            </div>
            <div className="relative mt-5 h-[7px] overflow-hidden rounded-full bg-white/[0.07]">
              <div className="okb-fill okb-foil h-full rounded-full shadow-[0_0_16px_rgba(242,205,107,0.55)]" />
            </div>
            <div className="mt-2.5 grid grid-cols-10 gap-1" aria-hidden>
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={`h-[3px] rounded-full ${i < 6 ? "bg-white/30" : "bg-white/[0.08]"}`} />
              ))}
            </div>

            <p className="m-0 mt-8">
              <Mono className="text-white/40">Today&rsquo;s 3 tasks</Mono>
            </p>
            <ol className="m-0 mt-3 list-none space-y-2 p-0">
              {tasks.map(([task, ready], i) => (
                <li
                  key={task}
                  className="okb-task flex items-center gap-3 rounded-[1rem] border border-white/[0.05] bg-white/[0.03] px-3.5 py-3 text-[0.98rem] font-medium text-white"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="okb-task__box grid h-[1.3rem] w-[1.3rem] shrink-0 place-items-center rounded-full border-[1.5px]">
                    <Tick />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{task}</span>
                  <Mono className="hidden shrink-0 text-[0.6rem] text-[#F2CD6B]/75 min-[400px]:inline">{ready}</Mono>
                </li>
              ))}
            </ol>
            <p className="m-0 mt-6 border-t border-white/[0.06] pt-5 text-[0.95rem] leading-snug text-white/65">
              $520 to go. Close today&rsquo;s call and you&rsquo;re past halfway.
            </p>
          </div>
          <div className="absolute -left-2 -top-[5.4rem] z-[3] -rotate-[6deg] sm:-left-9">
            <MiniTicket />
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-center lg:text-right">
        <Mono className="text-white/35">An example morning · it preps, you approve</Mono>
      </figcaption>
    </figure>
  );
}

export function OneKBotPage() {
  return (
    <main
      className={`okb-page ${archivo.variable} ${serif.variable} ${mono.variable} relative overflow-x-clip text-[#F4F2EC]`}
      style={{ background: INK }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 001. THE POSTER: the promise in four words, and what lands every morning. */}
      <section aria-labelledby="okb-title" className="okb-hero relative isolate overflow-hidden">
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 gap-y-12 px-5 pb-14 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14">
          <div className="okb-rise flex items-start justify-between gap-4 text-white/60 lg:col-span-2" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono>
              Free<span className="hidden sm:inline"> · downloads at once</span>
            </Mono>
            <Mono className="hidden text-center md:block">The Grok Bot challenge · Oct 30 → Nov 8</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">A bot for </span>Grok Bot
            </Mono>
          </div>

          <div className="flex flex-col justify-end">
            <h1 id="okb-title" className="m-0 font-normal">
              <span
                className="okb-rise okb-title okb-metal okb-sheen block font-[family-name:var(--okb-archivo)] font-black leading-[0.8] tracking-[-0.055em]"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                $1K
              </span>
              <span
                className="okb-rise okb-title__sub -mt-1 block font-[family-name:var(--okb-serif)] italic leading-[0.95] tracking-[-0.025em] text-white"
                style={{ "--i": 2 } as React.CSSProperties}
              >
                in 10 days.
              </span>
            </h1>
            <p className="okb-rise mt-7 max-w-[29rem] text-pretty text-[clamp(1.1rem,1.6vw,1.3rem)] leading-[1.5] text-white/60" style={{ "--i": 3 } as React.CSSProperties}>
              A free Grok Bot that finds the buyers, does the prep and works while you sleep.{" "}
              <span className="text-white">You approve and close.</span>
            </p>
            <div id={HERO_ID} className="okb-rise mt-9 max-w-[30rem] scroll-mt-28" style={{ "--i": 4 } as React.CSSProperties}>
              <FreeClaim productId={PRODUCT.id} reveal="Get the bot free" tone="gold" align="start" />
            </div>
            <p className="okb-rise mt-7 flex items-center gap-2.5 text-white/50" style={{ "--i": 5 } as React.CSSProperties}>
              <span className="okb-pulse inline-block h-1.5 w-1.5 rounded-full bg-[#F2CD6B] shadow-[0_0_10px_#F2CD6B]" aria-hidden />
              <Mono>
                <ChallengeStatus /> · free to join
              </Mono>
            </p>
          </div>

          <div className="okb-pop grid items-center lg:pt-6" style={{ "--i": 3 } as React.CSSProperties}>
            <CheckIn />
          </div>
        </div>
      </section>

      {/* 002. THREE WAYS IN. */}
      <section aria-labelledby="okb-ways" className="okb-rule relative">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-24 sm:px-8 md:pb-32 md:pt-32">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="text-white/40">002</Mono>
              <h2 id="okb-ways" className="m-0 mt-4 font-[family-name:var(--okb-archivo)] text-[clamp(3rem,7.6vw,6.6rem)] font-black leading-[0.9] tracking-[-0.045em]">
                Pick your <Gold className="pr-[0.06em]">way.</Gold>
              </h2>
            </div>
            <p className="m-0 max-w-[34ch] text-pretty text-[1.12rem] leading-[1.55] text-white/55 md:pb-3">
              Three roads to your first $1,000. Not sure? <span className="text-white">Pick 1.</span>
            </p>
          </div>

          <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-4 p-0 md:mt-20 lg:grid-cols-3 lg:gap-5">
            {WAYS.map((w, i) => (
              <li key={w.n} className={`okb-way relative flex flex-col overflow-hidden rounded-[1.8rem] p-7 sm:p-9 ${i === 0 ? "okb-way--lead" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <Gold className="text-[6.5rem] leading-[0.7]">{w.n}</Gold>
                  {"tag" in w ? <Mono className="okb-foil rounded-full px-3 py-1.5 text-[0.6rem] font-semibold text-[#140d00]">{w.tag}</Mono> : null}
                </div>
                <h3 className="m-0 mt-12 max-w-[16ch] text-balance font-[family-name:var(--okb-archivo)] text-[clamp(1.6rem,2.4vw,2.05rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-white">
                  {w.title}
                </h3>
                <ul className="m-0 mt-8 list-none border-t border-white/[0.08] p-0">
                  {w.does.map((d) => (
                    <li key={d} className="flex gap-3 border-b border-white/[0.08] py-3.5 text-[1rem] leading-[1.45] text-white/70">
                      <span aria-hidden className="text-[#F2CD6B]">
                        →
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 003. THE CHALLENGE, as a golden ticket: ten days, the prize, how to win. */}
      <section aria-labelledby="okb-win" className="relative">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8 md:pb-32">
          <GoldenTicket className="text-[#140d00]">
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-black/20 px-7 py-4 sm:px-12">
              <Mono className="opacity-70">
                <span className="hidden sm:inline">003 · </span>The challenge
              </Mono>
              <Mono className="opacity-70">
                Admit one<span className="hidden sm:inline"> · free</span>
              </Mono>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="px-7 pb-10 pt-10 sm:px-12 sm:pb-14 sm:pt-14">
                <h2 id="okb-win" className="m-0 font-[family-name:var(--okb-archivo)] text-[clamp(3rem,7.4vw,6.4rem)] font-black leading-[0.9] tracking-[-0.045em]">
                  Most money <span className="font-[family-name:var(--okb-serif)] font-normal italic tracking-[-0.02em]">wins.</span>
                </h2>
                <p className="m-0 mt-6 max-w-[36ch] text-pretty text-[1.12rem] leading-[1.55] text-black/70">
                  Ten days, free to join. Make the most real, paid money with the bot and take all three.
                </p>

                <ol className="m-0 mt-10 grid list-none grid-cols-10 gap-1 p-0 sm:gap-1.5" aria-label="Friday October 30 to Sunday November 8">
                  {DAYS.map(([d, n], i) => (
                    <li
                      key={n}
                      className={`flex flex-col items-center rounded-[0.7rem] py-2.5 ${i === 9 ? "bg-[#0a0703] text-[#F2CD6B]" : "bg-black/[0.07]"}`}
                    >
                      <span className="font-[family-name:var(--okb-mono)] text-[0.58rem] opacity-60">{d}</span>
                      <span className="mt-0.5 text-[clamp(0.8rem,2.3vw,1.1rem)] font-bold tabular-nums">{n}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex justify-between">
                  <Mono className="opacity-65">
                    <span className="hidden sm:inline">Fri </span>Oct 30 · go
                  </Mono>
                  <Mono className="opacity-65">
                    <span className="hidden sm:inline">Sun </span>Nov 8 · post it
                  </Mono>
                </div>
              </div>

              <div className="border-t border-dashed border-black/20 px-7 pb-10 pt-10 sm:px-12 sm:pb-14 sm:pt-14 lg:border-l lg:border-t-0">
                <Mono className="opacity-65">The prize</Mono>
                <ol className="m-0 mt-4 list-none border-b border-black/15 p-0">
                  {PRIZE.map(([what, more], i) => (
                    <li key={what} className="flex items-baseline gap-5 border-t border-black/15 py-5">
                      <span className="w-4 shrink-0 font-[family-name:var(--okb-serif)] text-[1.5rem] italic leading-none">{i + 1}</span>
                      <span className="text-[clamp(1.2rem,2vw,1.5rem)] font-bold leading-[1.25] tracking-[-0.01em]">
                        {what} <span className="font-medium text-black/60">{more}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="m-0 mt-8 max-w-[44ch] text-pretty text-[1rem] leading-[1.6] text-black/75">
                  <span className="font-bold text-black">To enter:</span> on day 10, post on X how you made it, with proof of payment
                  (names hidden), and tag <span className="font-bold text-black">@tobiadonadon_</span>. Faked proof is out.
                </p>
              </div>
            </div>
          </GoldenTicket>
          <p className="m-0 mt-6 text-center">
            <Mono className="text-white/35">Grab the ticket · tilt it · let go</Mono>
          </p>
        </div>
      </section>

      {/* 004. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="okb-close-title" className="okb-hero okb-rule relative scroll-mt-28">
        <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-24 sm:px-8 md:pb-32 md:pt-32">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="text-white/40">004</Mono>
              <h2 id="okb-close-title" className="m-0 mt-4 font-[family-name:var(--okb-archivo)] text-[clamp(3rem,7.6vw,6.6rem)] font-black leading-[0.9] tracking-[-0.045em]">
                <span className="block">It preps.</span>
                <Gold className="block pr-[0.06em]">You get paid.</Gold>
              </h2>
            </div>
            <div className="self-end">
              <ol className="m-0 list-none border-b border-white/[0.1] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-white/[0.1] py-5 text-[1.08rem] leading-[1.5]">
                    <Gold className="w-4 shrink-0 text-[1.5rem] leading-none">{i + 1}</Gold>
                    <span className="text-white/75">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <FreeClaim productId={PRODUCT.id} reveal="Get the bot free" tone="gold" align="start" prompt={false} />
                <p className="m-0 mt-5 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.55] text-white/50">{PRODUCT.thanks.needs}</p>
              </div>
            </div>
          </div>
          <p className="m-0 mt-20 max-w-[72ch] text-pretty text-[0.85rem] leading-[1.65] text-white/35">
            $1,000 is the target the bot pushes for, not a promise: money counts when it&rsquo;s paid, and nothing is sent,
            posted or charged in your name without your OK. The $1K Bot is an independent Grok Bot, not made by xAI.
          </p>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        href="#claim"
        label="Get it free"
        note="Free, downloads at once"
        buttonClassName="okb-btn text-[#140d00]"
      />
      {/* Last, on purpose: the metal's gradient is defined by the first disc
          in the page, and a loader that has finished can't lend it. */}
      <OneKBotLoader />
    </main>
  );
}
