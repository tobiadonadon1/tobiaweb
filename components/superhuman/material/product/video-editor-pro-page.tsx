import Image from "next/image";
import { Archivo, Geist_Mono, Instrument_Serif } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { VIDEO_EDITOR_PRO as PRODUCT, VIDEO_EDITOR, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { Film } from "./motion-designer-film";
import { StickyBuy } from "./sticky-buy";

/**
 * VIDEO EDITOR PRO, the paid follow-up to the free Video Editor: one skill
 * (reel-director) that edits your own raw footage into a finished reel, sold
 * with the editing masterclass Tobia is recording, €15.
 *
 * TOBIA'S BRIEF (2026-10-26, second pass): centred on what matters, no pile
 * of examples. So five parts: the poster (the edit playing, the name, the
 * price, one line), what it does to your clip (six cards, four of them real
 * frames), one band on approving and one-sentence changes, what you get (the
 * skill and the masterclass), the close. Royal blue and red, bright and
 * crisp; the hero moves in on load and every section reveals as you scroll.
 *
 * THE VIDEO in the hero is one file (HERO_FILM). Tobia is sending a new one:
 * drop it in public/shop/video-editor-pro/ and change the two names below.
 *
 * WHAT IS REAL: the stills are frames of reel-director's render of Tobia's
 * raw clip (his test, 2026-10-23). The masterclass is described only as what
 * it is: his, on making reels with it. Nothing about it is invented.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--vep-archivo", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--vep-serif", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--vep-mono", display: "swap" });

const HERO_ID = "buy";
const CLOSE_ID = "vep-close";
const SOON = !forSale(PRODUCT);
const S = (name: string) => `/shop/video-editor-pro/${name}`;

/** The hero's video. Swap these two for the new one. */
const HERO_FILM = { src: S("pro-edit-v1.mp4"), poster: S("pro-edit-v1.jpg") };

const BLUE = "#1F3FE0";
const RED = "#FF3B2F";
const PAPER = "#FBF8F3";
const INK = "#0E1220";
const BUTTON = "bg-[#FF3B2F] text-white shadow-[0_18px_40px_-16px_rgba(255,59,47,0.75)] hover:bg-[#ff5247]";

/** What it does to a clip: four are frames of the Pro edit, two are lists. */
const DOES: { title: string; text: string; img?: string; alt?: string; list?: string[] }[] = [
  {
    title: "Cuts the takes.",
    text: "Bad takes can stay in. It keeps the last good one.",
    list: ["Retakes", "Fillers and stutters", "Lines that trail off", "Dead air"],
  },
  {
    title: "Fixes the light.",
    text: "Exposure measured on your face. Say “warmer” and it relights you.",
    img: "warmer-v2.jpg",
    alt: "The before/after slider across Tobia: the edit's light is warmer than the raw.",
  },
  {
    title: "Captions on the word.",
    text: "Each word as you say it. Never on your face or under the app's buttons.",
    img: "captions-v2.jpg",
    alt: "A clean caption, “skill for Claude Code”, low on the frame under Tobia's hands.",
  },
  {
    title: "Type behind you.",
    text: "You're cut out of every frame, so big words sit behind your head.",
    img: "behind-v2.jpg",
    alt: "“bigger phrase.” in heavy type and serif italics, behind Tobia's head and raised hand.",
  },
  {
    title: "Your colours.",
    text: "One look, taken from your footage. Here, the navy of the shirt.",
    img: "backdrop-v2.jpg",
    alt: "The room turned navy behind Tobia, with “your own brand.” in cream and brass.",
  },
  {
    title: "Sound, mixed.",
    text: "A clean voice, a designed sound kit, music that steps aside.",
    list: ["Voice cleaned and levelled", "34 sounds made to fit", "Music drops on the big moments"],
  },
];

const SAY = ["tighter cut", "make it moody", "bigger captions"];

const STEPS: React.ReactNode[] = [
  <>Buy, then unzip the folder.</>,
  <>
    Open it in Claude Code and type <q className="font-semibold text-white">hi</q>. It installs in a minute.
  </>,
  <>Hand it a clip. Approve the plan. Post the reel.</>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
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

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--vep-mono)] text-[0.75rem] font-medium uppercase tracking-[0.08em] ${className}`}>{children}</span>
  );
}

function Buy({ reportErrors = false }: { reportErrors?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get it · ${PRODUCT.priceLabel}`}
      soon={SOON}
      tone="ink"
      align="start"
      reportErrors={reportErrors}
      buttonClassName={BUTTON}
    />
  );
}

/** A section heading in two voices: grotesk caps, then a serif italic (red on paper, white on blue). */
function Heading({ id, n, caps, serifLine, onBlue = false }: { id: string; n: string; caps: string; serifLine: string; onBlue?: boolean }) {
  return (
    <div className="vep-reveal">
      <Mono className="opacity-60">{n}</Mono>
      <h2 id={id} className="mt-3 font-[family-name:var(--vep-archivo)] text-[clamp(2.8rem,7.4vw,6.4rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_74]">
        {caps}{" "}
        <span className="block font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: onBlue ? "#FFFFFF" : RED }}>
          {serifLine}
        </span>
      </h2>
    </div>
  );
}

export function VideoEditorProPage() {
  return (
    <main className={`vep-page ${archivo.variable} ${serif.variable} ${mono.variable} relative overflow-x-clip`} style={{ background: PAPER, color: INK }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 01. THE POSTER: the edit playing, the name, the price, one line. */}
      <section aria-labelledby="vep-title" className="relative isolate overflow-hidden text-white" style={{ background: BLUE }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 gap-y-12 px-5 pb-14 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <div className="vep-in flex items-start justify-between gap-4 lg:col-span-2" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono>
              {PRODUCT.priceLabel}
              <span className="hidden sm:inline"> · skill + masterclass</span>
            </Mono>
            <Mono className="hidden text-center md:block">Edits your own footage · no editing app</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">Skill for </span>Claude Code
            </Mono>
          </div>

          <div className="flex flex-col justify-end">
            <h1 id="vep-title" className="vep-title font-[family-name:var(--vep-archivo)] font-black uppercase leading-[0.82] tracking-[-0.035em]">
              <span className="vep-line">
                <span style={{ "--i": 1 } as React.CSSProperties}>Video</span>
              </span>
              <span className="vep-line">
                <span style={{ "--i": 2 } as React.CSSProperties}>Editor</span>
              </span>
              <span className="vep-line">
                <span className="font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ "--i": 3, color: RED } as React.CSSProperties}>
                  Pro.
                </span>
              </span>
            </h1>
            <p className="vep-in mt-7 text-[clamp(1.3rem,2.2vw,1.75rem)] font-semibold leading-[1.2]" style={{ "--i": 4 } as React.CSSProperties}>
              Your raw clip in. A finished reel out.
            </p>
            <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
              {["Cut", "Lit", "Captioned", "Designed", "Mixed"].map((w, i) => (
                <li key={w} className="vep-pop rounded-full bg-white px-3.5 py-1.5 text-[0.95rem] font-bold text-[#1F3FE0]" style={{ "--i": 5 + i * 0.6 } as React.CSSProperties}>
                  {w}
                </li>
              ))}
            </ul>
            <div id={HERO_ID} className="vep-in mt-8 scroll-mt-28" style={{ "--i": 8 } as React.CSSProperties}>
              <Buy reportErrors />
              <p className="mt-3 text-[0.95rem] font-medium text-white/85">The skill and the editing masterclass, one payment.</p>
            </div>
          </div>

          <figure className="vep-phone-in m-0 self-end justify-self-center lg:justify-self-end" style={{ "--i": 3 } as React.CSSProperties}>
            <div className="vep-phone w-[min(72vw,19rem)] lg:w-[min(30vw,23rem)]">
              <div className="vep-phone__screen">
                <Film src={HERO_FILM.src} poster={HERO_FILM.poster} label="a reel Video Editor Pro made" eager className="h-full w-full" buttonClassName="mdx-sound--screen" />
              </div>
            </div>
            <figcaption className="mt-3 text-center">
              <Mono className="text-white/80">Edited by it · sound on</Mono>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 02. WHAT IT DOES TO YOUR CLIP. */}
      <section aria-labelledby="vep-does">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <Heading id="vep-does" n="02" caps="What it does" serifLine="to your clip." />
            <p className="vep-reveal max-w-[36ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-[rgba(14,18,32,0.68)] md:pb-3">
              What a pro editor would do, in one go. The pictures are frames of a real edit.
            </p>
          </div>
          <ol className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-5">
            {DOES.map((d, i) => (
              <li
                key={d.title}
                className="vep-reveal flex flex-col overflow-hidden rounded-[1.5rem]"
                style={{ background: d.img ? "#FFFFFF" : i === 0 ? BLUE : RED, color: d.img ? INK : "#FFFFFF" }}
              >
                <div className="px-6 pb-5 pt-6 sm:px-7">
                  <Mono className="opacity-60">{String(i + 1).padStart(2, "0")}</Mono>
                  <h3 className="mt-2 font-[family-name:var(--vep-archivo)] text-[1.95rem] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-variation-settings:'wdth'_76]">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-pretty text-[1.04rem] font-medium leading-[1.45] opacity-85">{d.text}</p>
                </div>
                {d.img ? (
                  <div className="relative mt-auto aspect-square overflow-hidden sm:aspect-[4/5]">
                    <Image src={S(d.img)} alt={d.alt ?? ""} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" quality={90} className="object-cover object-top" />
                  </div>
                ) : (
                  <ul className="mt-auto flex list-none flex-wrap gap-2 px-6 pb-7 pt-2 sm:px-7">
                    {d.list?.map((l) => (
                      <li key={l} className="rounded-full bg-white/15 px-3.5 py-2 text-[0.95rem] font-semibold">
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03. APPROVE, THEN ONE SENTENCE. One band. */}
      <section aria-labelledby="vep-approve" className="text-white" style={{ background: BLUE }}>
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-end gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Heading id="vep-approve" n="03" caps="You approve." serifLine="Then one sentence changes it." onBlue />
          <div className="vep-reveal">
            <p className="max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-white/85">
              Before it renders, you see every change, before and after. Then just say it:
            </p>
            <ul className="mt-6 flex list-none flex-wrap gap-2.5 p-0">
              {SAY.map((s) => (
                <li key={s} className="rounded-full bg-white px-4 py-2 font-[family-name:var(--vep-mono)] text-[0.98rem] font-semibold text-[#0E1220]">
                  &ldquo;{s}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04. WHAT YOU GET: the skill and the masterclass. */}
      <section aria-labelledby="vep-get">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <Heading id="vep-get" n="04" caps="What you get" serifLine={`for ${PRODUCT.priceLabel}.`} />
          <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
            <article className="vep-reveal rounded-[1.6rem] bg-white p-7 shadow-[0_30px_60px_-40px_rgba(14,18,32,0.35)] sm:p-9">
              <Mono className="text-[#1F3FE0]">The skill</Mono>
              <h3 className="mt-3 font-[family-name:var(--vep-archivo)] text-[clamp(2rem,3.6vw,2.8rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_76]">
                Video Editor Pro
              </h3>
              <p className="mt-4 max-w-[44ch] text-pretty text-[1.08rem] leading-[1.5] text-[rgba(14,18,32,0.72)]">
                Installs into Claude Code in a minute. Hand it a clip, it hands back the reel. Your style is remembered for
                the next one.
              </p>
            </article>
            <article className="vep-reveal rounded-[1.6rem] p-7 text-white sm:p-9" style={{ background: RED }}>
              <Mono className="text-white/80">Included</Mono>
              <h3 className="mt-3 font-[family-name:var(--vep-archivo)] text-[clamp(2rem,3.6vw,2.8rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_76]">
                The editing masterclass
              </h3>
              <p className="mt-4 max-w-[44ch] text-pretty text-[1.08rem] leading-[1.5] text-white/90">
                Mine, on making reels with it: how I film, how I edit with it, how I post.
              </p>
            </article>
          </div>
          <p className="vep-reveal mt-6 text-[0.98rem] text-[rgba(14,18,32,0.62)]">
            Making videos from scratch, with no footage? That&rsquo;s the free{" "}
            <a href={VIDEO_EDITOR.href} className="font-semibold text-[#0E1220] underline decoration-[rgba(14,18,32,0.3)] underline-offset-4">
              Video Editor
            </a>
            .
          </p>
        </div>
      </section>

      {/* 05. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="vep-close-title" className="scroll-mt-28 text-white" style={{ background: BLUE }}>
        <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <Heading id="vep-close-title" n="05" caps="Film it." serifLine="It edits. You post." onBlue />
            <div className="vep-reveal self-end">
              <ol className="list-none border-b border-white/25 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-white/25 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--vep-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-white/90">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <Buy />
                <p className="mt-4 max-w-[48ch] text-pretty text-[0.95rem] leading-[1.5] text-white/80">
                  One payment, secure checkout by Stripe. Included with Pro. {PRODUCT.thanks.needs}
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
        note={SOON ? "Checkout opens soon" : "Skill + masterclass"}
        soon={SOON}
        buttonClassName={BUTTON}
      />
    </main>
  );
}
