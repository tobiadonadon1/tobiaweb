import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { REEL_BOT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { LEAD, botShape } from "./grok-army-bots";
import { Film } from "./motion-designer-film";
import { ReelBotLoader } from "./reel-bot-loader";
import { StickyBuy } from "./sticky-buy";

/**
 * REEL BOT, a free Grok Bot: one Markdown file (Tobia's pipeline) that a
 * Grok Bot works from to make animated vertical videos with Claude.
 *
 * THE POSTER FAMILY (Tobia, 2026-10-26, after a first version that was a dark,
 * centred column: "nobody's going to read this"): Motion Designer's and Web
 * Designer Pro's page in its own colour. A violet field, the name huge and
 * left, three reels playing on phones with the bot sitting on top of them,
 * one short line; then the three styles as colour tiles, five tiles for what
 * the bot does, the close.
 *
 * THE OPENING (reel-bot-loader.tsx) ends in the bot's eye, which lights up in
 * this violet, so the camera arrives in the hero.
 *
 * WHAT IS REAL: the three reels were made the way the file has them made: a
 * written brief (style, shots, twist, sound), then Claude drawing every frame
 * in Python and rendering with ffmpeg, the sound synthesized in code. The
 * contact sheet is that noir reel's own frames, one a second; the ffprobe
 * lines are its real numbers; the weak spots are its real ones. They were
 * made by Claude in a Claude Code session from those briefs, not by a Grok
 * Bot run, and the caption says "the way Reel Bot makes them", nothing more.
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
const BUTTON = "bg-[#5B3DF6] text-white shadow-[0_18px_40px_-18px_rgba(91,61,246,0.8)] hover:bg-[#4a2ee6]";

const REELS = [
  {
    id: "last-light",
    n: "01",
    style: "Noir",
    title: "The Last Light",
    asked: "Rainy Art Deco noir. A man walks into the lamp light. One window lights up.",
    bg: "#0E2230",
    fg: "#F2D9A8",
  },
  {
    id: "paper-boat",
    n: "02",
    style: "Papercraft",
    title: "The Paper Boat",
    asked: "Cut paper at sunrise. A paper boat sails in, and a red bird lands on it.",
    bg: "#8FD0EE",
    fg: INK,
  },
  {
    id: "day-on-mars",
    n: "03",
    style: "Explainer",
    title: "A Day on Mars",
    asked: "A flat 2D explainer with captions: how much longer a day on Mars is.",
    bg: "#211D5C",
    fg: "#FFFFFF",
  },
] as const;

const STEPS: React.ReactNode[] = [
  <>Download reel-bot.md.</>,
  <>Create a new Grok Bot and attach the file.</>,
  <>
    Say <q className="font-semibold">Make my first reel</q>, with a style and a topic.
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
    price: "0",
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

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
      src={S(`${id}-v1.mp4`)}
      poster={S(`${id}-v1.jpg`)}
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
    ["Style", "flat painted noir, Art Deco, one light per shot"],
    ["Shot 1", "0–5.4 s · rainy skyline, a man walks into the lamp"],
    ["Shot 2", "5.4–8 s · low angle up his tower, every window dark"],
    ["Twist", "one window lights. Someone waves."],
    ["Sound", "rain, a low pad, footsteps, a warm chord on the light"],
  ];
  return (
    <dl className="m-0 w-full rounded-[1.1rem] bg-[#111] p-5 text-[#ECEAE3] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] sm:p-6">
      <Mono className="text-[#ECEAE3]/60">brief · the-last-light.txt</Mono>
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
        <span>A</span>
        <span>day</span>
        <span>on</span>
        <span className="text-[#FFD24D]">Mars</span>
      </p>
      <p className="mt-4 font-[family-name:var(--rb-mono)] text-[0.85rem] font-semibold leading-[1.5]">
        2 to 4 words at a time · cut on each word&rsquo;s start
      </p>
    </div>
  );
}

/** Tile 03: the one instruction Claude gets, and the frames it checks. */
function ClaudeProof() {
  return (
    <div className="w-full">
      <blockquote className="m-0 max-w-[46ch] rounded-[1.1rem] bg-white/10 p-5 font-[family-name:var(--rb-mono)] text-[0.95rem] leading-[1.55] sm:p-6">
        &ldquo;Follow the attached brief. Build the 540x960 preview only and show it to me.&rdquo;
      </blockquote>
      <figure className="m-0 mt-5">
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <Image
            src={S("contact-sheet-v1.jpg")}
            alt="Eight frames of The Last Light, one a second: the skyline, the man walking into the lamp light, the tower, the lit window."
            width={1482}
            height={320}
            unoptimized
            className="block h-auto w-[44rem] max-w-none rounded-[0.8rem] sm:w-full sm:max-w-full"
          />
        </div>
        <figcaption className="mt-3">
          <Mono className="opacity-80">Its contact sheet · one frame a second, checked twice</Mono>
        </figcaption>
      </figure>
    </div>
  );
}

/** Tile 04: what it measured on the finished file (the real numbers of The Last Light). */
function CheckProof() {
  const rows: [string, string][] = [
    ["video", "h264 · 540×960 · 24 fps"],
    ["audio", "aac · 44.1 kHz · stereo"],
    ["length", "8.00 s"],
    ["size", "1.0 MB"],
  ];
  return (
    <div className="w-full rounded-[1.1rem] bg-white/[0.07] p-5 font-[family-name:var(--rb-mono)] text-[0.9rem] leading-[1.6] sm:p-6">
      <p className="m-0 text-white/60">$ ffprobe the-last-light.mp4</p>
      {rows.map(([k, v]) => (
        <p key={k} className="m-0 grid grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-3">
          <span className="text-white/60">{k}</span>
          <span>{v}</span>
          <span className="text-[#E4FF4F]">✓</span>
        </p>
      ))}
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
          <p className="m-0 font-bold">The Last Light is ready.</p>
          <p className="m-0 mt-1.5">Weak spots: the walk is a slide with a bob, and the man is small in the wide shot.</p>
          <p className="m-0 mt-1.5">Post it?</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 pl-[3.25rem]">
        <span className="rounded-full bg-[#111] px-4 py-2 text-[0.9rem] font-semibold text-white">Post it</span>
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
              Free<span className="hidden sm:inline"> · it downloads at once</span>
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
              <span className="block">Reel</span>
              <span className="block" style={{ color: LIME }}>
                Bot.
              </span>
            </h1>
            <p className="rb-rise mt-7 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold leading-[1.25]" style={{ "--i": 2 } as React.CSSProperties}>
              Give it a topic. Get a finished reel.
            </p>
            <div id={HERO_ID} className="rb-rise mt-7 max-w-[30rem] scroll-mt-28" style={{ "--i": 3 } as React.CSSProperties}>
              <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="violet" align="start" />
            </div>
          </div>

          <figure className="rb-rise rb-stack m-0 self-end pt-14 lg:pt-0" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="rb-stack__row">
              <Phone className="rb-stack__side">
                <Reel id="paper-boat" label="The Paper Boat, a papercraft reel" quiet />
              </Phone>
              <div className="rb-stack__mid">
                <svg viewBox="0 0 100 100" className="rb-perch" aria-hidden>
                  {botShape(LEAD)}
                </svg>
                <Phone>
                  <Reel id="last-light" label="The Last Light, a noir reel" eager />
                </Phone>
              </div>
              <Phone className="rb-stack__side">
                <Reel id="day-on-mars" label="A Day on Mars, an explainer reel" quiet />
              </Phone>
            </div>
            <figcaption className="mt-4 text-center">
              <Mono className="text-white/80">Three reels · every frame drawn in code</Mono>
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
              One line in, eight seconds out. Each with its own story, its own twist and its own sound.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-16 md:grid-cols-3 md:gap-5">
            {REELS.map((r) => (
              <li key={r.id} className="flex flex-col rounded-[1.6rem] px-6 pb-7 pt-7 sm:px-8" style={{ background: r.bg, color: r.fg }}>
                <div className="flex items-baseline justify-between gap-3">
                  <Mono className="opacity-80">
                    {r.n} · {r.style}
                  </Mono>
                  <Mono className="opacity-70">8 s · with sound</Mono>
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
            Made the way Reel Bot makes them: a written brief, then Claude drawing every frame in Python, composing the
            sound in code and rendering with ffmpeg. No stock, nothing traced.
          </p>
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
            <Tile n="02" title="It gives it a voice." text="ElevenLabs reads the script, and every word gets its time, so captions land on the word." bg={PINK} fg={INK}>
              <CaptionProof />
            </Tile>
            <Tile n="03" title="Claude draws every frame." text="It opens a chat in your Claude project, hands over the brief, and Claude draws, scores and renders it." bg={VIOLET} fg="#fff">
              <ClaudeProof />
            </Tile>
            <Tile n="04" title="It checks the file." text="Downloads the MP4 and measures it before you ever see it." bg={INK} fg="#fff" wide>
              <CheckProof />
            </Tile>
            <Tile n="05" title="Then it asks you." text="With an honest list of weak spots. Nothing posts until you say so." bg={ORANGE} fg={INK}>
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
                <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="violet" align="start" prompt={false} />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] text-white/75">{PRODUCT.thanks.needs}</p>
              </div>
            </div>
          </div>
          <p className="mt-16 max-w-[70ch] text-pretty text-[0.9rem] leading-[1.6] text-white/60">
            It runs on your own Grok Bot, Claude and ElevenLabs plans. Reel Bot is an independent Grok Bot, not made by
            xAI or Anthropic.
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
        label="Get it for free"
        note="Free, downloads at once"
        buttonClassName={BUTTON}
      />
      {/* Last, on purpose: the metal's gradient is defined by the first disc
          in the page, and a loader that has finished can't lend it. */}
      <ReelBotLoader />
    </main>
  );
}
