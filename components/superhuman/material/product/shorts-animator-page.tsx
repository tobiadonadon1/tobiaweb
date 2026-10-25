import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { SHORTS_ANIMATOR as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { Film } from "./motion-designer-film";
import { ProIntro } from "./app-designer-pro-intro";

/**
 * SHORTS ANIMATOR: narrated animated shorts drawn frame by frame in code,
 * given away for an email.
 *
 * WEB DESIGNER PRO'S PAGE, SIMPLER (Tobia's call): the opening, a poster hero
 * (a full-bleed field, the name huge in wide type, one real object over it,
 * mono labels in the margins), then only three things: the same drawing in
 * five looks, the two films, the close. The field is the painted night blue
 * of its first short; cream and saffron come from its skies.
 *
 * THE OPENING is App Designer Pro's (Tobia's call, 2026-10-25: "this is
 * perfect"): six words, one a beat, each on a colour from the shorts'
 * palette, then the curtain lifts on the night hero.
 *
 * EVERYTHING ON THE PAGE IS REAL: both films were made with the skill (the
 * scenes written as code, the voice its local narrator, the music its own),
 * and the five looks are one frame of the first film rendered again with
 * each look, nothing retouched.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--sa-archivo", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--sa-mono", display: "swap" });

const HERO_ID = "claim";
const CLOSE_ID = "sa-close";
const S = (name: string) => `/shop/shorts-animator/${name}`;

const NIGHT = "#14254F";
const CREAM = "#F4ECD0";
const SAFFRON = "#F6B23C";
const MUTED = "text-[color:rgba(17,17,17,0.64)]";
const BUTTON = "bg-[#14254F] text-white shadow-[0_18px_40px_-18px_rgba(20,37,79,0.7)] hover:bg-[#0d1a3b]";

/** The opening's six beats, in the colours of the painted shorts. */
const OPENING = [
  { word: "Painted.", bg: SAFFRON, fg: "#1b1206" },
  { word: "Narrated.", bg: NIGHT, fg: CREAM },
  { word: "Captioned.", bg: "#4E9A2E", fg: "#0f2408" },
  { word: "Scored.", bg: "#8FC0EC", fg: "#0b1d3a" },
  { word: "Any look.", bg: "#E8642A", fg: "#1b0a03" },
  { word: "No camera.", bg: CREAM, fg: NIGHT },
];

const STEPS: React.ReactNode[] = [
  <>Unzip the folder.</>,
  <>
    Open it in Claude Code or Codex and type <q className="font-semibold text-[#111]">hi</q>. It installs and makes a
    test short.
  </>,
  <>Give it a verse, a quote or a story, and say how it should look.</>,
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
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

/** A small mono label, the page's editorial voice (the same as Web Designer Pro's). */
function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--sa-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}

/** A phone, drawn: the films are vertical, made for one. */
function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`sa-phone ${className}`}>
      <div className="sa-phone__screen">{children}</div>
    </div>
  );
}

/** THE FIVE LOOKS: one frame of the first film, painted again from five sentences. */
const LOOKS = [
  { id: "oil", name: "Oil", said: "oil paint, like the faith shorts" },
  { id: "watercolor", name: "Watercolour", said: "soft watercolour, dreamy" },
  { id: "pastel", name: "Pastel", said: "crayon on paper, for kids" },
  { id: "ink", name: "Ink", said: "inked, like a graphic novel" },
  { id: "gouache", name: "Gouache", said: "a calm, flat storybook" },
] as const;

/** THE TWO FILMS, both made with the skill. */
const FILMS = [
  {
    id: "love-your-enemies",
    title: "Love Your Enemies",
    meta: "Oil · 40 s · 19 shots · rendered in 56 s",
    note: "Matthew 5:43–48, read by its narrator. Every scene is a few lines of code.",
    bg: NIGHT,
    fg: "#fff",
  },
  {
    id: "the-keeper",
    title: "The Keeper",
    meta: "Watercolour · 13 s · 7 shots · rendered in 9 s",
    note: "A four-line story. It drew the lighthouse and the boat itself: nothing in the kit for them.",
    bg: SAFFRON,
    fg: "#1b1206",
  },
] as const;

export function ShortsAnimatorPage() {
  return (
    <main className={`sa-page ${archivo.variable} ${mono.variable} relative overflow-x-clip bg-[#F4ECD0] text-[#111]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ProIntro words={OPENING} name="Shorts Animator" className="adp-intro--sa" />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 001. THE POSTER: the name, the first film on a phone, the button. */}
      <section aria-labelledby="sa-title" className="sa-hero relative isolate overflow-hidden text-white" style={{ background: NIGHT }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_1fr_auto] px-5 pb-10 pt-24 sm:px-8 md:pt-28">
          <div className="sa-in relative z-20 flex items-start justify-between gap-4" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono>
              Free<span className="hidden sm:inline"> · sent by email</span>
            </Mono>
            <Mono className="hidden text-center lg:block">No cameras · no stock footage · no studio</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">Skill for </span>Claude Code &amp; Codex
            </Mono>
          </div>

          <div className="relative z-10 pt-6 [@media(min-width:768px)_and_(min-aspect-ratio:1/1)]:pt-1">
            <h1 id="sa-title" className="sa-title font-[family-name:var(--sa-archivo)] font-black uppercase leading-[0.8] tracking-[-0.035em]" style={{ color: CREAM }}>
              <span className="block">Shorts</span> <span className="block">Animator.</span>
            </h1>
          </div>

          <figure className="sa-screen">
            <Phone>
              <Film
                src={S("love-your-enemies-v1.mp4")}
                poster={S("love-your-enemies-v1.jpg")}
                label="Love Your Enemies, a short the skill made"
                eager
                className="h-full w-full"
                buttonClassName="mdx-sound--screen"
              />
            </Phone>
            <figcaption className="mt-3 text-center">
              <Mono className="text-white/75">Made with it</Mono>
            </figcaption>
          </figure>

          <div className="sa-bottom relative z-20 self-end pt-2">
            <div className="sa-in" style={{ "--i": 1 } as React.CSSProperties}>
              <p className="max-w-[30ch] text-pretty text-[1.15rem] font-semibold leading-[1.4] sm:text-[1.3rem]">
                <span className="block text-white/75">Animated shorts, drawn frame by frame</span>
                <span className="block">entirely by code and AI.</span>
              </p>
              <div id={HERO_ID} className="mt-7 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="night" align="start" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 002. DESCRIBE THE LOOK: one frame, five sentences. */}
      <section aria-labelledby="sa-looks" className="relative border-b border-black/10">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">002</Mono>
              <h2 id="sa-looks" className="mt-3 max-w-[12ch] font-[family-name:var(--sa-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                Describe <span className="block" style={{ color: NIGHT }}>the look.</span>
              </h2>
            </div>
            <p className={`max-w-[40ch] text-pretty text-[1.12rem] font-medium leading-[1.5] md:pb-3 ${MUTED}`}>
              Say it in your own words and it paints in it. The same frame, five sentences.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:mt-16 lg:grid-cols-5">
            {LOOKS.map((l) => (
              <li key={l.id} className="flex flex-col">
                <div className="overflow-hidden rounded-[1rem] bg-black/10 shadow-[0_30px_60px_-34px_rgba(0,0,0,0.55)]">
                  <Image
                    src={S(`look-${l.id}-v1.jpg`)}
                    alt={`Two robed figures walking on a meadow under a cream sky, painted as ${l.name.toLowerCase()}.`}
                    width={540}
                    height={960}
                    unoptimized
                    className="block aspect-[9/16] h-auto w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-[0.98rem] font-semibold leading-[1.35]">&ldquo;{l.said}&rdquo;</p>
                <Mono className="mt-1 opacity-60">{l.name}</Mono>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 003. THE FILMS: both made with the skill. */}
      <section aria-labelledby="sa-films" className="relative">
        <div className="mx-auto max-w-[80rem] px-4 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="relative text-center">
            <Mono className="opacity-60">003</Mono>
            <h2 id="sa-films" className="mx-auto mt-3 max-w-[14ch] text-balance font-[family-name:var(--sa-archivo)] text-[clamp(2.8rem,7.5vw,6.2rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]">
              Drawn, painted, narrated.
            </h2>
            <p className={`mx-auto mt-5 max-w-[46ch] text-balance text-[1.08rem] font-medium leading-[1.5] ${MUTED}`}>
              It writes every scene as code, paints each frame like hand animation, then reads it aloud and scores it.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 md:grid-cols-2">
            {FILMS.map((f) => (
              <li key={f.id} className="flex flex-col items-center rounded-[1.6rem] px-6 pb-8 pt-8 sm:px-9" style={{ background: f.bg, color: f.fg }}>
                <div className="w-full">
                  <Mono className="opacity-75">{f.meta}</Mono>
                  <h3 className="mt-3 font-[family-name:var(--sa-archivo)] text-[clamp(2.1rem,4.6vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_70]">
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-pretty text-[1.02rem] font-medium leading-[1.5] opacity-90">{f.note}</p>
                </div>
                <Phone className="mt-8 w-full max-w-[17rem]">
                  <Film src={S(`${f.id}-v1.mp4`)} poster={S(`${f.id}-v1.jpg`)} label={f.title} className="h-full w-full" />
                </Phone>
              </li>
            ))}
          </ul>
          <p className={`mx-auto mt-8 max-w-[56ch] text-balance text-center text-[0.98rem] leading-[1.5] ${MUTED}`}>
            Its voice runs on your computer, or use your own. Captions timed to the words, music composed for every short.
            Vertical, square or wide.
          </p>
        </div>
      </section>

      {/* 004. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="sa-close-title" className="scroll-mt-28 border-t border-black/10">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="opacity-60">004</Mono>
              <h2 id="sa-close-title" className="mt-3 max-w-[11ch] font-[family-name:var(--sa-archivo)] text-[clamp(2.8rem,7.5vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]">
                A painted short <span style={{ color: NIGHT }}>a day.</span>
              </h2>
              <p className={`mt-6 max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
                No animator, no camera, no stock clips. A few lines of words, and about a minute.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-black/10 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-black/10 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--sa-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-[color:rgba(17,17,17,0.75)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ink" align="start" prompt={false} />
                <p className={`mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] ${MUTED}`}>{PRODUCT.thanks.needs}</p>
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
        label="Get it for free"
        note="Free, sent by email"
        buttonClassName={BUTTON}
      />
    </main>
  );
}
