import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { REEL_BOT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { LEAD, botShape } from "./grok-army-bots";
import { Film } from "./motion-designer-film";
import { ReelBotLoader } from "./reel-bot-loader";
import { StickyBuy } from "./sticky-buy";

/**
 * REEL BOT, a $10 Grok Bot (free before 2.0): the Director file (with its kit) that a
 * Grok Bot works from to make animated vertical videos with Claude.
 *
 * THE POSTER FAMILY (Tobia, 2026-10-26, after a first version that was a dark,
 * centred column: "nobody's going to read this"): Motion Designer's and Web
 * Designer Pro's page in its own colour. A violet field, the name huge and
 * left, three reels playing on phones (the director rig was taken off the hero, 2026-11-04),
 * one short line; then the three styles as colour tiles, five tiles for what
 * the bot does, the close.
 *
 * THE OPENING (reel-bot-loader.tsx) ends in the bot's eye, which lights up in
 * this violet, so the camera arrives in the hero.
 *
 * 2.0 (2026-11-04, Tobia: "make a 2.0, significantly better"): the Director
 * file runs a tested kit (characters, camera, light, seven looks, voice, music,
 * checks on the real file) instead of having Claude write a renderer each time.
 *
 * WHAT IS REAL: the three reels are the 2.0 trial reels. Each was made from
 * one line (the "asked" text, word for word) by a fresh Claude session that
 * had never seen the kit, following the skill alone, then rendered at
 * 1080x1920; nobody touched them by hand. The brief lines, the contact sheet,
 * the check numbers and the weak spots are those reels' own. COMPARE holds the
 * blind 1.0-vs-2.0 test (same three lines through both versions, scored by
 * critics who didn't know which made which); its numbers are the test's.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--rb-archivo", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--rb-mono", display: "swap" });

const HERO_ID = "claim";
const CLOSE_ID = "rb-close";
const S = (name: string) => `/shop/reel-bot/${name}`;

const VIOLET = "#5B3DF6";
const LIME = "#E4FF4F";
const PINK = "#FFB8D9";
const ORANGE = "#FF6A2B";
const INK = "#111111";
const CREAM = "#F1EEE6";
const CREAM2 = "#E9E4D8";
const BUTTON = "bg-[#5B3DF6] text-white shadow-[0_18px_40px_-18px_rgba(91,61,246,0.8)] hover:bg-[#4a2ee6]";
/** On the violet field the buy button is lime, so the one thing to press is the brightest thing there. */
const BUTTON_ON_VIOLET = "bg-[#E4FF4F] text-[#111] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] hover:bg-[#d8f43a]";

const REELS = [
  {
    id: "lighthouse",
    n: "01",
    style: "Noir",
    title: "The Last Watch",
    asked: "A lighthouse keeper's last night before the lighthouse is automated.",
    len: "29 s",
    bg: "#0E2230",
    fg: "#F2D9A8",
  },
  {
    id: "kite",
    n: "02",
    style: "Papercraft",
    title: "The Long Way Home",
    asked: "A lost paper kite finds its way home.",
    len: "28 s",
    bg: "#F2A98A",
    fg: INK,
  },
  {
    id: "octopus",
    n: "03",
    style: "Explainer",
    title: "Three Hearts",
    asked: "Why octopuses have three hearts.",
    len: "32 s · a voice",
    bg: "#211D5C",
    fg: "#FFFFFF",
  },
] as const;

/** The blind test, 2026-11-04: the same three lines through 1.0 and 2.0, scored /20 by critics who didn't know which
 *  version made which (reel-bot/trials/ab in tobiaweb-private). FILLED FROM THE TEST'S RESULTS, nothing rounded up. */
const COMPARE = {
  rows: [
    ["Critic score, blind, out of 20", "14.3", "18.0"],
    ["Won its head-to-head", "0 of 3", "3 of 3"],
    ["One line to a checked reel", "25–39 min", "9–14 min"],
    ["Final picture", "540×960", "1080×1920"],
    ["Checks on the real file", "4", "15"],
    ["Music", "synthesized", "real musicians"],
  ] as [string, string, string][],
};
const CRITIC_TITLE = "the-last-watch";
const CRITIC_TOTAL = "18";
const CRITIC_ROWS: [string, number][] = [
  ["hook", 2], ["story", 2], ["sound off", 2], ["shots", 2], ["motion", 1],
  ["subjects", 2], ["look", 1], ["text", 2], ["sound", 2], ["ending", 2],
];

const STEPS: React.ReactNode[] = [
  <>Unzip the download: two files, both for your Grok Bot.</>,
  <>Create a new Grok Bot called Director and attach both files.</>,
  <>
    Say <q className="font-semibold">Make my first reel from this file</q>. It asks you four quick questions, then sets
    itself up.
  </>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Grok Bot",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: (PRODUCT.priceCents / 100).toFixed(2),
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

/** The buy button: a real form to /api/checkout; signed out or on Free, the first press opens the Pro card. */
function Buy({ reportErrors = false }: { reportErrors?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get it · ${PRODUCT.priceLabel}`}
      tone="ink"
      align="start"
      reportErrors={reportErrors}
      buttonClassName={BUTTON_ON_VIOLET}
    />
  );
}

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--rb-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>{children}</span>
  );
}

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rb-phone ${className}`}>
      <div className="rb-phone__screen">{children}</div>
    </div>
  );
}

function Reel({ id, label, eager = false, quiet = false }: { id: string; label: string; eager?: boolean; quiet?: boolean }) {
  return (
    <Film
      src={S(`${id}-v2.mp4`)}
      poster={S(`${id}-v2.jpg`)}
      label={label}
      eager={eager}
      className="h-full w-full"
      buttonClassName={quiet ? "!hidden" : "mdx-sound--screen"}
    />
  );
}

/** One of the five things it does, as a tile in its own colour: the claim, then the proof. */
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
      className={`relative flex flex-col overflow-hidden rounded-[1.6rem] ${wide ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:items-end" : ""}`}
      style={{ background: bg, color: fg }}
    >
      <div className="px-7 pb-6 pt-7 sm:px-9 sm:pt-9 lg:self-start">
        <Mono>{n}</Mono>
        <h3 className="mt-3 max-w-[16ch] text-balance font-[family-name:var(--rb-archivo)] text-[clamp(2rem,4.2vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_70]">
          {title}
        </h3>
        <p className="mt-3 max-w-[40ch] text-pretty text-[1.04rem] font-medium leading-[1.5] opacity-90">{text}</p>
      </div>
      <div className="flex flex-1 items-end px-5 pb-6 sm:px-9 sm:pb-9">{children}</div>
    </li>
  );
}

/** Tile 01: the brief it wrote for The Last Light, as it was written. */
function BriefProof() {
  const lines: [string, string][] = [
    ["Hook", "\u201cTomorrow, a machine takes his light.\u201d"],
    ["Shot 2", "2.6–5 s · his logbook rolls up to 14,610 nights"],
    ["Shot 4", "7.6–10 s · the machine's dial nears midnight"],
    ["Turn", "20 s · the sea answers: every boat flashes back"],
    ["Ending", "he waves from the gallery; it loops to frame 0"],
  ];
  return (
    <dl className="m-0 w-full rounded-[1.1rem] bg-[#111] p-5 text-[#ECEAE3] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] sm:p-6">
      <Mono className="text-[#ECEAE3]/60">brief · the-last-watch.md</Mono>
      {lines.map(([k, v]) => (
        <div key={k} className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 font-[family-name:var(--rb-mono)] text-[0.88rem] leading-[1.45]">
          <dt className="text-[#E4FF4F]">{k}</dt>
          <dd className="m-0">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Tile 02: a caption as the reels show them, the word being said lit. */
function CaptionProof() {
  return (
    <div className="w-full">
      <p className="inline-flex flex-wrap gap-x-[0.3em] rounded-[1.4rem] bg-[#0a0c24] px-6 py-4 font-[family-name:var(--rb-archivo)] text-[clamp(1.8rem,4vw,2.6rem)] font-black text-white [font-variation-settings:'wdth'_80]">
        <span>An</span>
        <span>octopus</span>
        <span>has</span>
        <span className="text-[#FFD24D]">three</span>
      </p>
      <p className="mt-4 font-[family-name:var(--rb-mono)] text-[0.85rem] font-semibold leading-[1.5]">
        1 to 3 words at a time · the spoken word lit · clear of the apps&rsquo; buttons
      </p>
    </div>
  );
}

/** Tile 03: what Claude is asked, and the frames it drew (The Last Watch, one every 2.5 s). */
function ClaudeProof() {
  return (
    <div className="w-full">
      <blockquote className="m-0 max-w-[46ch] rounded-[1.1rem] bg-white/10 p-5 font-[family-name:var(--rb-mono)] text-[0.95rem] leading-[1.55] sm:p-6">
        &ldquo;MODE: maker. Make the reel in brief.md. Look at the frames twice, render the preview, fix every FAIL.&rdquo;
      </blockquote>
      <figure className="m-0 mt-5">
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <Image
            src={S("contact-sheet-v2.jpg")}
            alt="Twelve frames of The Last Watch, one every 2.5 seconds: the lighthouse, the logbook, the lamp lit, the machine's dial, the keeper's face, the gallery, the empty sea, the boats' lights, the keeper waving, the lighthouse again."
            width={2226}
            height={332}
            unoptimized
            className="block h-auto w-[44rem] max-w-none rounded-[0.8rem] sm:w-full sm:max-w-full"
          />
        </div>
        <figcaption className="mt-3">
          <Mono className="opacity-80">The Last Watch · one frame every 2.5 s</Mono>
        </figcaption>
      </figure>
    </div>
  );
}

/** Tile 04: what the kit measured on the finished file (Three Hearts, its real numbers). */
function CheckProof() {
  const rows: [string, string][] = [
    ["picture", "1080×1920 · 30 fps · H.264"],
    ["loudness", "−16.0 LUFS · peak −1.5 dBTP"],
    ["voice", "heard back: 0% word error"],
    ["captions", "on the word: 0 ms off"],
    ["screen", "clear of the apps' buttons"],
  ];
  return (
    <div className="w-full rounded-[1.1rem] bg-white/[0.07] p-5 font-[family-name:var(--rb-mono)] text-[0.9rem] leading-[1.6] sm:p-6">
      <p className="m-0 text-white/60">$ reel check three-hearts</p>
      {rows.map(([k, v]) => (
        <p key={k} className="m-0 grid grid-cols-[5.5rem_minmax(0,1fr)_auto] gap-3">
          <span className="text-white/60">{k}</span>
          <span>{v}</span>
          <span className="text-[#E4FF4F]">✓</span>
        </p>
      ))}
      <p className="m-0 mt-2 text-white/60">15 checks · PASS</p>
    </div>
  );
}

/** Tile 05: the critic's score card (COMPARE.score: the blind test's mean for 2.0). */
function CriticProof() {
  const rows: [string, number][] = CRITIC_ROWS;
  return (
    <div className="w-full rounded-[1.1rem] bg-white p-5 text-[#111] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.5)] sm:p-6">
      <div className="flex items-baseline justify-between">
        <Mono className="opacity-60">critic · {CRITIC_TITLE}</Mono>
        <span className="font-[family-name:var(--rb-archivo)] text-[2.2rem] font-black leading-none">
          {CRITIC_TOTAL}
          <span className="text-[1rem] opacity-50">/20</span>
        </span>
      </div>
      <ul className="m-0 mt-3 grid list-none grid-cols-2 gap-x-5 gap-y-1 p-0 font-[family-name:var(--rb-mono)] text-[0.82rem]">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between border-b border-black/10 py-1">
            <span>{k}</span>
            <span aria-label={`${v} of 2`}>{"●".repeat(v)}{"○".repeat(2 - v)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tile 05: the message it sends, with The Last Light's real weak spots. */
function AskProof() {
  return (
    <div className="w-full max-w-[26rem]">
      <div className="flex items-end gap-3">
        <svg viewBox="0 0 100 100" className="w-10 shrink-0" aria-hidden>
          {botShape(LEAD)}
        </svg>
        <div className="rounded-[1.3rem] rounded-bl-[0.3rem] bg-white p-4 text-[0.98rem] font-medium leading-[1.45] text-[#111] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)]">
          <p className="m-0 font-bold">The Last Watch · 29 s · critic {CRITIC_TOTAL}/20</p>
          <p className="m-0 mt-1.5">Weak spots: midnight is a small light on a phone, and the close-up holds a pose.</p>
          <p className="m-0 mt-1.5">Say OK for full quality, or tell me what to change.</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 pl-[3.25rem]">
        <span className="rounded-full bg-[#111] px-4 py-2 text-[0.9rem] font-semibold text-white">OK</span>
        <span className="rounded-full border-2 border-[#111] px-4 py-2 text-[0.9rem] font-semibold">Change it</span>
      </div>
    </div>
  );
}

export function ReelBotPage() {
  return (
    <main className={`rb-page ${archivo.variable} ${mono.variable} relative overflow-x-clip text-[#111]`} style={{ background: CREAM }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 001. THE POSTER: the name, three reels playing with the bot on top, one line, the field. */}
      <section aria-labelledby="rb-title" className="rb-hero relative isolate overflow-hidden text-white" style={{ background: VIOLET }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 gap-y-10 px-5 pb-14 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10">
          <div className="rb-rise flex items-start justify-between gap-4 lg:col-span-2" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono>
              2.0 · {PRODUCT.priceLabel}<span className="hidden sm:inline"> · instant download</span>
            </Mono>
            <Mono className="hidden text-center md:block">Animated reels · no drawing, no filming, no editing</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">A bot for </span>Grok Bot + Claude
            </Mono>
          </div>

          <div className="flex flex-col justify-end">
            <h1
              id="rb-title"
              className="rb-rise rb-title font-[family-name:var(--rb-archivo)] font-black uppercase leading-[0.8] tracking-[-0.035em]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <span className="block">Reel Bot</span>
              <span className="block" style={{ color: LIME }}>
                Factory 2.0
              </span>
            </h1>
            <p className="rb-rise mt-7 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold leading-[1.25]" style={{ "--i": 2 } as React.CSSProperties}>
              Give it a topic. Get a finished reel.
            </p>
            <div id={HERO_ID} className="rb-rise mt-7 max-w-[30rem] scroll-mt-28" style={{ "--i": 3 } as React.CSSProperties}>
              <Buy reportErrors />
              <p className="mt-4 max-w-[38ch] text-pretty text-[0.95rem] leading-[1.5] text-white/75">
                {PRODUCT.priceLabel} once, instant download. Included with Pro.
              </p>
            </div>
          </div>

          <figure className="rb-rise rb-stack m-0 self-end pt-14 lg:pt-0" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="rb-stack__row">
              <Phone className="rb-stack__side">
                <Reel id="kite" label="The Long Way Home, a papercraft reel" quiet />
              </Phone>
              <div className="rb-stack__mid">
                <Phone>
                  <Reel id="lighthouse" label="The Last Watch, a noir reel" eager />
                </Phone>
              </div>
              <Phone className="rb-stack__side">
                <Reel id="octopus" label="Three Hearts, an explainer reel with a voice" quiet />
              </Phone>
            </div>
            <figcaption className="mt-8 text-right">
              <Mono className="text-white/80">Grok Bot directs · Claude draws with the kit</Mono>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 002. PICK A STYLE: the three reels, big, each in its own colour. */}
      <section aria-labelledby="rb-styles">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">002</Mono>
              <h2 id="rb-styles" className="mt-3 font-[family-name:var(--rb-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                Pick a <span style={{ color: VIOLET }}>style.</span>
              </h2>
            </div>
            <p className="max-w-[38ch] text-pretty text-[1.12rem] font-medium leading-[1.5] text-[rgba(17,17,17,0.66)] md:pb-3">
              One line in, a 30-second film out. Each with its own story, its own turn and its own sound.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-16 md:grid-cols-3 md:gap-5">
            {REELS.map((r) => (
              <li key={r.id} className="flex flex-col rounded-[1.6rem] px-6 pb-7 pt-7 sm:px-8" style={{ background: r.bg, color: r.fg }}>
                <div className="flex items-baseline justify-between gap-3">
                  <Mono className="opacity-80">
                    {r.n} · {r.style}
                  </Mono>
                  <Mono className="opacity-70">{r.len}</Mono>
                </div>
                <h3 className="mt-3 font-[family-name:var(--rb-archivo)] text-[clamp(2rem,3.4vw,2.8rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_70]">
                  {r.title}
                </h3>
                <p className="mt-3 text-pretty text-[1rem] font-medium leading-[1.45] opacity-90">&ldquo;{r.asked}&rdquo;</p>
                <Phone className="mx-auto mt-7 w-full max-w-[15.5rem]">
                  <Reel id={r.id} label={r.title} />
                </Phone>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[64ch] text-pretty text-[0.98rem] leading-[1.5] text-[rgba(17,17,17,0.62)]">
            Each made from that one line by a Claude session that had never seen the kit, following the file alone. Not touched
            by hand. Drawn, voiced and scored in code: no stock, nothing traced.
          </p>
        </div>
      </section>

      {/* 002b. 1.0 VS 2.0: the blind test, as a plain table on ink. */}
      <section aria-labelledby="rb-vs" className="text-white" style={{ background: INK }}>
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">What changed</Mono>
              <h2 id="rb-vs" className="mt-3 max-w-[12ch] font-[family-name:var(--rb-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                1.0 vs <span style={{ color: LIME }}>2.0.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-pretty text-[1.12rem] font-medium leading-[1.5] text-white/70 md:pb-3">
              The same three lines through both versions. Critics scored every reel without knowing which version made it.
            </p>
          </div>
          <table className="mt-12 w-full border-collapse text-left md:mt-16">
            <thead>
              <tr className="border-b border-white/25">
                <th className="py-4 pr-4 font-normal"><Mono className="text-white/60">Same three lines</Mono></th>
                <th className="w-[25%] py-4 pr-3 font-normal sm:w-[22%]"><Mono className="text-white/60">1.0</Mono></th>
                <th className="w-[25%] py-4 font-normal sm:w-[22%]"><Mono className="text-[#E4FF4F]">2.0</Mono></th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.rows.map(([k, a, b]) => (
                <tr key={k} className="border-b border-white/15 align-baseline">
                  <td className="py-4 pr-3 text-[0.95rem] leading-[1.3] text-white/80 sm:text-[1.05rem]">{k}</td>
                  <td className="py-4 pr-4 font-[family-name:var(--rb-archivo)] text-[clamp(1rem,2.4vw,1.9rem)] font-black text-white/55">{a}</td>
                  <td className="py-4 font-[family-name:var(--rb-archivo)] text-[clamp(1rem,2.4vw,1.9rem)] font-black" style={{ color: LIME }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 003. WHAT IT DOES: five tiles, each with its proof. */}
      <section aria-labelledby="rb-does" className="border-t border-black/10">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">003</Mono>
              <h2 id="rb-does" className="mt-3 max-w-[12ch] font-[family-name:var(--rb-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                It does the <span style={{ color: VIOLET }}>running around.</span>
              </h2>
            </div>
            <p className="max-w-[38ch] text-pretty text-[1.12rem] font-medium leading-[1.5] text-[rgba(17,17,17,0.66)] md:pb-3">
              Grok Bot runs the errands. Claude does the drawing. You say yes.
            </p>
          </div>

          <ol className="mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-16 lg:grid-cols-3 lg:gap-5">
            <Tile n="01" title="It writes the brief." text="Style, characters, every shot with its time, a twist, an ending and the sound." bg={LIME} fg={INK}>
              <BriefProof />
            </Tile>
            <Tile n="02" title="It gives it a voice." text="ElevenLabs, or a free voice built in. Every word gets its time, so captions and mouths land on it." bg={PINK} fg={INK}>
              <CaptionProof />
            </Tile>
            <Tile n="03" title="Claude draws it with a kit." text="Characters that walk and talk, light, camera moves, seven looks. Claude spends its time on the story, not on rebuilding a renderer." bg={VIOLET} fg="#fff">
              <ClaudeProof />
            </Tile>
            <Tile n="04" title="It measures the real file." text="Loudness, peaks, the voice heard back, captions on the word, nothing under the apps' buttons." bg={INK} fg="#fff">
              <CheckProof />
            </Tile>
            <Tile n="05" title="A fresh critic scores it." text="A second Claude that didn't make it scores it out of 20. Under 16, it goes back for fixes." bg={CREAM2} fg={INK}>
              <CriticProof />
            </Tile>
            <Tile n="06" title="Then it asks you." text="With an honest list of weak spots. Nothing posts until you say so." bg={ORANGE} fg={INK}>
              <AskProof />
            </Tile>
          </ol>
        </div>
      </section>

      {/* 004. THE CLOSE, on the violet again. */}
      <section id={CLOSE_ID} aria-labelledby="rb-close-title" className="scroll-mt-28 text-white" style={{ background: VIOLET }}>
        <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="opacity-70">004</Mono>
              <h2 id="rb-close-title" className="mt-3 max-w-[11ch] font-[family-name:var(--rb-archivo)] text-[clamp(3rem,8vw,6.8rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                A reel a day. <span style={{ color: LIME }}>Your OK first.</span>
              </h2>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-white/20 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-white/20 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--rb-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-white/85">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <ul className="m-0 mb-8 list-none p-0">
                  {(PRODUCT.contents ?? []).map(([name, what]) => (
                    <li key={name} className="grid grid-cols-1 gap-1 border-t border-white/15 py-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
                      <span className="break-all font-[family-name:var(--rb-mono)] text-[0.85rem] text-[#E4FF4F]">{name}</span>
                      <span className="text-[0.95rem] leading-[1.45] text-white/75">{what}</span>
                    </li>
                  ))}
                </ul>
                <Buy />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] text-white/75">{PRODUCT.thanks.needs}</p>
              </div>
            </div>
          </div>
          <p className="mt-16 max-w-[70ch] text-pretty text-[0.9rem] leading-[1.6] text-white/60">
            It runs on your own Grok Bot and Claude plans (ElevenLabs optional). Reel Bot Factory is an independent Grok Bot, not
            made by xAI or Anthropic.
          </p>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        note="Director + kit · instant download"
        buttonClassName={BUTTON}
      />
      {/* Last, on purpose: the metal's gradient is defined by the first disc
          in the page, and a loader that has finished can't lend it. */}
      <ReelBotLoader />
    </main>
  );
}
