import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { META_ADS as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { LoopVideo } from "./loop-video";
import { StickyBuy } from "./sticky-buy";

/**
 * META ADS SKILL, three skills for Claude Code that run a Meta ad account.
 * Given away: free for an email, downloading at once.
 *
 * THE WEB DESIGNER PRO FLOW, SHORTER (Tobia, 2026-10-30): the poster with the
 * line and the button, then ONE section (what comes back each morning, as six
 * tiles, and the result), then the close and the sticky bar. No "what it
 * gets you": it's free.
 *
 * THE COLOURS ARE LIVE ONES, as he asked: real black, pure white and one
 * vivid orange, the film's own. Wide Archivo, opened up so the words breathe.
 *
 * THE WORDS lead with the fear (handing an AI your ad budget) and answer it
 * with the skill's golden rule: it reads and proposes on its own, and spends
 * only after a written ok. One line per claim.
 *
 * WHAT IS REAL: the film is rendered from Tobia's own Claude Code (his
 * terminal, light theme) running the skill's real commands (ads.py, the
 * competitor-ads skill), and an Ads Manager table rebuilt from real Ads
 * Manager screenshots. Every number is an example account, and the film,
 * the tiles and the result card say so.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--mad-archivo", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--mad-mono", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "mad-close";
const S = (name: string) => `/shop/meta-ads/${name}`;

const BLACK = "#000000";
const WHITE = "#FFFFFF";
/** The film's orange. Large type only on white (3.2:1); body text stays black. */
const ORANGE = "#FF4D00";
const GREY = "#F2F2F2";
const MUTED = "text-[color:rgba(0,0,0,0.62)]";
const DISPLAY =
  "font-[family-name:var(--mad-archivo)] font-black uppercase tracking-[-0.01em] [word-spacing:0.12em] [font-variation-settings:'wdth'_84]";
const ORANGE_BUTTON = "bg-[#FF4D00]! text-black! hover:bg-[#ff6a26]! shadow-[0_18px_40px_-18px_rgba(255,77,0,0.8)]";

const STEPS: React.ReactNode[] = [
  <>Get it free. It downloads at once.</>,
  <>Copy the three skills into Claude Code and open it in the folder.</>,
  <>
    Type <q className="font-semibold text-black">set up my Meta ads</q>. It connects your account with you, spending limit
    first.
  </>,
];

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
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs(PRODUCT.href) },
};

/** A small mono label, the page's editorial voice. */
function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--mad-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}

/** One of the six, as a tile in its own colour: the claim, then the proof. */
function Tile({
  n,
  title,
  text,
  bg,
  fg,
  children,
  wide = false,
}: {
  n: string;
  title: string;
  text: string;
  bg: string;
  fg: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <li
      className={`relative flex flex-col overflow-hidden rounded-[1.6rem] ${wide ? "lg:col-span-2" : ""}`}
      style={{ background: bg, color: fg }}
    >
      <div className="px-7 pb-7 pt-7 sm:px-9 sm:pt-9">
        <Mono className="opacity-70">{n}</Mono>
        <h3 className={`mt-3 max-w-[18ch] text-balance text-[clamp(2rem,4.4vw,3.1rem)] leading-[0.94] ${DISPLAY}`}>
          {title}
        </h3>
        <p className="mt-4 max-w-[46ch] text-pretty text-[1.06rem] font-medium leading-[1.5] opacity-85">{text}</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-8 sm:pb-8">{children}</div>
    </li>
  );
}

/** A terminal card, for what the skill reads and writes. */
function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[34rem] rounded-[1.2rem] bg-black p-5 text-left text-white shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] ring-1 ring-white/15 sm:p-6">
      <Mono className="text-white/55">{label}</Mono>
      <div className="mt-4 font-[family-name:var(--mad-mono)] text-[0.88rem] leading-[1.55]">{children}</div>
    </div>
  );
}

function StudyProof() {
  const rows: [string, string][] = [
    ["ads.py numbers", "spend, views, leads, cost per lead"],
    ["leads.csv", "who replied, who's serious"],
    ["Ad Library", "what competitors run, and lead with"],
    ["Web search", "your sector's cost per lead"],
  ];
  return (
    <Term label="Before any proposal">
      <ul className="list-none space-y-2.5 p-0">
        {rows.map(([k, v]) => (
          <li key={k} className="flex gap-3">
            <span className="shrink-0 text-[#3ddc6b]">⏺</span>
            <span>
              <span className="font-bold">{k}</span> <span className="text-white/60">· {v}</span>
            </span>
          </li>
        ))}
      </ul>
    </Term>
  );
}

function OptionsProof() {
  const opts = ["Pause A2. $9 spent, 0 leads.", "New A1 cut with the price first.", "A1 budget +20%: $10 → $12 a day."];
  return (
    <Term label="Morning report · example account">
      <ol className="list-none space-y-2 p-0">
        {opts.map((o, i) => (
          <li key={o} className="flex gap-3">
            <span className="shrink-0 font-bold" style={{ color: ORANGE }}>
              {i + 1}
            </span>
            <span>{o}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-white/60">Pick any. Waiting for your ok.</p>
      <p className="mt-2">
        <span className="text-white/45">&gt;</span> 1 and 2
      </p>
    </Term>
  );
}

function BrakesProof() {
  const brakes = [
    "A spending limit on the account",
    "A daily cap it can't pass",
    "+20% at most per change",
    "Every ok written in the log",
  ];
  return (
    <ul className="flex w-full list-none flex-wrap gap-2.5 p-0">
      {brakes.map((b) => (
        <li key={b} className="rounded-full border-2 border-current px-4 py-2 text-[1rem] font-bold">
          {b}
        </li>
      ))}
    </ul>
  );
}

/** One Ads Manager row as it looks after the stop rule: the toggle off. */
function CutProof() {
  const cols =
    "grid grid-cols-[4.6rem_1fr_3.9rem_3.7rem] gap-x-2 px-3 sm:grid-cols-[4.5rem_1fr_5rem_5rem] sm:px-4";
  return (
    <div
      role="img"
      aria-label="An Ads Manager row for an example ad, A2 carousel: switched off, $9.04 spent, 0 leads."
      className="w-full max-w-[34rem] overflow-hidden rounded-[1rem] bg-white text-[#1c2b33] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)]"
    >
      <div aria-hidden className={`${cols} border-b border-[#dadde1] py-3 text-[0.85rem] font-semibold`}>
        <span>Off / On</span>
        <span>Ad</span>
        <span className="text-right">Spent</span>
        <span className="text-right">Results</span>
      </div>
      <div aria-hidden className={`${cols} items-center bg-[#f5f6f7] py-4 text-[0.95rem] sm:text-[1rem]`}>
        <span className="relative block h-[1.6rem] w-[2.9rem] rounded-full bg-[#ccd0d5]">
          <span className="absolute left-[0.12rem] top-[0.12rem] h-[1.36rem] w-[1.36rem] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]" />
        </span>
        <span>
          <span className="whitespace-nowrap text-[#1d64c4]">A2 · carousel</span>
          <span className="block text-[0.8rem] text-[#65676b]">Off · by the stop rule</span>
        </span>
        <span className="text-right">$9.04</span>
        <span className="text-right">0</span>
      </div>
    </div>
  );
}

function LearnProof() {
  const bars = [
    { name: "A4 · price first", v: 1.84, win: true },
    { name: "A1 · the original", v: 2.53, win: false },
  ];
  return (
    <div className="w-full max-w-[34rem]">
      <ul className="list-none space-y-4 p-0">
        {bars.map((b) => (
          <li key={b.name}>
            <div className="flex items-baseline justify-between text-[1rem] font-semibold">
              <span>{b.name}</span>
              <span className={`${DISPLAY} text-[1.9rem] leading-none`} style={b.win ? { color: ORANGE } : undefined}>
                ${b.v.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 h-4 rounded-full bg-white/15">
              <div
                className="h-4 rounded-full"
                style={{ width: `${(b.v / 2.53) * 100}%`, background: b.win ? ORANGE : "rgba(255,255,255,0.45)" }}
              />
            </div>
          </li>
        ))}
      </ul>
      <Mono className="mt-5 block opacity-70">Cost per lead · example account · saved to what-worked.md</Mono>
    </div>
  );
}

function QualityProof() {
  const counts = ["Serious", "Call", "Visit"];
  const ignored = ["No reply", "Not interested", "Fake"];
  return (
    <div className="w-full">
      <ul className="flex list-none flex-wrap gap-2.5 p-0">
        {counts.map((c) => (
          <li key={c} className="rounded-full bg-black px-4 py-2 text-[1rem] font-bold text-white">
            {c}
          </li>
        ))}
        {ignored.map((c) => (
          <li
            key={c}
            className="rounded-full border-2 border-black/80 px-4 py-2 text-[1rem] font-bold text-black/70 line-through decoration-[3px]"
            style={{ textDecorationColor: ORANGE }}
          >
            {c}
          </li>
        ))}
      </ul>
      <Mono className="mt-5 block opacity-70">Scales on the first three, never on the last three</Mono>
    </div>
  );
}

/** Four weeks of cost per lead, example account: the result, drawn. */
function ResultChart() {
  const weeks = [3.15, 2.61, 2.02, 1.84];
  return (
    <div
      role="img"
      aria-label="Cost per lead over four weeks, example account: $3.15, $2.61, $2.02, $1.84."
      className="w-full"
    >
      <div aria-hidden className="flex h-[16rem] items-end gap-3 border-b-2 border-white/80 sm:h-[19rem] sm:gap-5">
        {weeks.map((v, i) => {
          const last = i === weeks.length - 1;
          return (
            <div key={v} className="flex flex-1 flex-col items-center justify-end">
              <span
                className={`${DISPLAY} mb-2 text-[clamp(1.2rem,2.6vw,1.9rem)] leading-none`}
                style={{ color: last ? ORANGE : WHITE }}
              >
                ${v.toFixed(2)}
              </span>
              <span
                className="block w-full rounded-t-[0.6rem]"
                style={{ height: `${(v / 3.15) * 13}rem`, background: last ? ORANGE : "rgba(255,255,255,0.9)" }}
              />
            </div>
          );
        })}
      </div>
      <div aria-hidden className="mt-3 flex gap-3 sm:gap-5">
        {weeks.map((v, i) => (
          <Mono key={v} className="flex-1 text-center text-white/60">
            Week {i + 1}
          </Mono>
        ))}
      </div>
    </div>
  );
}

export function MetaAdsPage() {
  return (
    <main className={`${archivo.variable} ${mono.variable} relative overflow-x-clip bg-white text-black`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 001. THE POSTER: the rule, the button, the film. */}
      <section aria-labelledby="mad-title" className="relative isolate overflow-hidden text-white" style={{ background: BLACK }}>
        <div className="mx-auto flex min-h-[100svh] max-w-[90rem] flex-col px-5 pb-12 pt-24 sm:px-8 md:pt-28">
          <div className="flex items-start justify-between gap-4">
            <Mono>
              Free<span className="hidden sm:inline"> · downloads at once</span>
            </Mono>
            <Mono className="hidden text-center lg:block">Your Meta ads, run by Claude</Mono>
            <Mono className="text-right">Skill for Claude Code</Mono>
          </div>

          <h1 id="mad-title" className={`mt-8 text-[clamp(3.1rem,9.6vw,10rem)] leading-[0.88] md:mt-10 ${DISPLAY}`}>
            <span className="block">No dollar moves</span>
            <span className="block">
              without your <span style={{ color: ORANGE }}>ok.</span>
            </span>
          </h1>

          <div className="mt-10 grid flex-1 grid-cols-1 items-end gap-x-14 gap-y-10 md:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
            <div>
              <Mono className="text-white/60">{PRODUCT.name}</Mono>
              <p className="mt-3 max-w-[34ch] text-pretty text-[1.15rem] font-medium leading-[1.45] sm:text-[1.3rem]">
                <span className="block text-white/60">Most tools spend first and explain later.</span>
                <span className="block">This one studies your ads, proposes, and waits for you.</span>
              </p>
              <div id={HERO_ID} className="mt-7 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="dark" align="start" buttonClassName={ORANGE_BUTTON} quiet />
              </div>
            </div>

            <figure>
              <div className="overflow-hidden rounded-[1rem] ring-1 ring-white/15">
                <LoopVideo
                  src={S("film-v2.mp4")}
                  poster={S("film-poster-v2.webp")}
                  label="A 21-second film: Claude Code studies an example ad account, proposes three options, the owner types 1 and 2, Ads Manager switches one ad off and launches a new one, a week later the new ad wins, and cost per lead falls 42% over four weeks."
                  aspect="16/9"
                />
              </div>
              <figcaption className="mt-3">
                <Mono className="text-white/55">The loop, in 21 seconds · example account</Mono>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 002. ONE MORNING: what comes back from one question, as six tiles, then the result. */}
      <section aria-labelledby="mad-morning" className="relative">
        <div className="mx-auto max-w-[80rem] px-4 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 px-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <h2 id="mad-morning" className={`max-w-[12ch] text-[clamp(2.8rem,7.6vw,6.6rem)] leading-[0.9] ${DISPLAY}`}>
              One question.{" "}
              <span className="block" style={{ color: ORANGE }}>
                Every morning.
              </span>
            </h2>
            <p className={`max-w-[40ch] text-pretty text-[1.12rem] font-medium leading-[1.5] md:pb-3 ${MUTED}`}>
              You ask how your ads are doing. It reads everything, spends nothing on its own, and gets better every
              week. The numbers below are an example account.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 lg:grid-cols-2">
            <Tile
              n="01"
              title="It studies first."
              text="Your spend, your leads, your competitors' live ads and your market's cost per lead. Then it speaks."
              bg={GREY}
              fg={BLACK}
            >
              <StudyProof />
            </Tile>

            <Tile
              n="02"
              title="Options, not orders."
              text="A few moves each morning, each with the number behind it. You pick, it does."
              bg={BLACK}
              fg={WHITE}
            >
              <OptionsProof />
            </Tile>

            <Tile
              n="03"
              title="Nothing moves without your ok."
              text="Reading is free. Spending needs your yes, every time, and every yes is written down."
              bg={ORANGE}
              fg={BLACK}
              wide
            >
              <BrakesProof />
            </Tile>

            <Tile
              n="04"
              title="It cuts the waste."
              text="No hook, no leads after three times your target, or Meta stopped showing it: it's off, with a replacement ready."
              bg={GREY}
              fg={BLACK}
            >
              <CutProof />
            </Tile>

            <Tile
              n="05"
              title="It learns what wins."
              text="The winner gets a new variant, written from what worked. The lesson is saved, so next month starts smarter."
              bg={BLACK}
              fg={WHITE}
            >
              <LearnProof />
            </Tile>

            <Tile
              n="06"
              title="Good leads, not just cheap ones."
              text="It tracks who calls, who's serious, who visits, and scales only on those. A hundred cheap leads who never answer don't count."
              bg={GREY}
              fg={BLACK}
              wide
            >
              <QualityProof />
            </Tile>
          </ul>

          {/* The result: what the loop adds up to, on the example account. */}
          <figure className="mt-4 grid grid-cols-1 items-end gap-10 rounded-[1.6rem] bg-black px-7 pb-8 pt-8 text-white sm:mt-5 sm:px-9 sm:pt-9 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <figcaption>
              <Mono className="opacity-70">Four weeks later</Mono>
              <p className={`mt-3 text-[clamp(4rem,10vw,8.5rem)] leading-[0.85] ${DISPLAY}`} style={{ color: ORANGE }}>
                −42%
              </p>
              <p className={`mt-2 text-[clamp(1.6rem,3vw,2.4rem)] leading-[0.95] ${DISPLAY}`}>a lead.</p>
              <p className="mt-5 max-w-[36ch] text-pretty text-[1rem] font-medium leading-[1.5] text-white/75">
                Cut what wastes, test what the market shows, keep what wins: $3.15 to $1.84 a lead. An example account;
                your numbers will be your own.
              </p>
            </figcaption>
            <ResultChart />
          </figure>

          <p className={`mx-auto mt-8 max-w-[58ch] text-balance text-center text-[0.98rem] leading-[1.5] ${MUTED}`}>
            Three skills in one download: the daily manager, the ad writer and the competitor-ads reader. Talks to
            Meta&rsquo;s Marketing API directly, and writes your month-end report.
          </p>
        </div>
      </section>

      {/* 003. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="mad-close-title" className="scroll-mt-28 border-t border-black/10">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="mad-close-title" className={`max-w-[12ch] text-[clamp(2.8rem,7.2vw,5.8rem)] leading-[0.9] ${DISPLAY}`}>
                Stop paying for <span style={{ color: ORANGE }}>ads that don&rsquo;t work.</span>
              </h2>
              <p className={`mt-6 max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
                A dead ad spends every day until someone notices. Now someone checks every morning, and asks you first.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-black/10 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-black/10 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--mad-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-black/75">{step}</span>
                  </li>
                ))}
              </ol>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="ink" align="start" prompt={false} quiet />
                <p className={`mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] ${MUTED}`}>
                  Free. Needs Claude Code (paid Claude plan), Python 3.11+ and a Meta ad account you manage. Mac, Windows
                  or Linux.
                </p>
              </div>
            </div>
          </div>
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
        buttonClassName="bg-[#FF4D00] text-black hover:bg-[#ff6a26]"
      />
    </main>
  );
}
