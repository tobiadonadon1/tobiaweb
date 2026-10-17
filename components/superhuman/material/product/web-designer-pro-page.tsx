import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { WEB_DESIGNER_PRO as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { StickyBuy } from "./sticky-buy";
import { WebDesignerProIntro } from "./web-designer-pro-intro";

/**
 * WEB DESIGNER PRO, the paid follow-up to the free Web Designer.
 *
 * THE SAME FLOW AS VIRAL MACHINE AND APP DESIGNER PRO (Tobia's call): the
 * opening, the name and the button, the proof, six tiles, the close, the
 * sticky bar. The look is the poster family the skill itself now teaches,
 * from Tobia's references: a cobalt field, huge wide red type locked over a
 * cut-out portrait with thin cuts through the letters, magazine edge labels,
 * mono numbering, colour tiles.
 *
 * THE OPENING (web-designer-pro-intro.tsx) happens in a design tool: the
 * name is typed, selected, dragged huge, then filled with the page's colour.
 *
 * THE WORDS lead with the pain (every AI-built site looks the same, and
 * visitors can tell) and stay short: one line per claim, the proof does the
 * talking.
 *
 * WHAT IS REAL: the hero is Tobia: his own photo, relit with GPT Image on a
 * ChatGPT plan (studio flash, a warm rim light from the sunset it was taken
 * in), then cut out with the skill's own scripts/cutout.swift; the caption
 * says so. The product drop in tile 05 (the shoe and
 * the street) is made with GPT Image on a ChatGPT plan through the skill's
 * scripts/image.mjs. "The level it starts from" shows the kits that ship
 * inside the skill (assets/kits), rendered as they are, and one page the
 * skill made on its own; the copy says which is which.
 */

// "block", not "swap": the opening types the name in this face at width 112,
// which no fallback can draw, so it waits for the font instead of reflowing.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--wdp-archivo", display: "block" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--wdp-mono", display: "swap" });

const HERO_ID = "buy";
const CLOSE_ID = "wdp-close";
const SOON = !forSale(PRODUCT);
const S = (name: string) => `/shop/web-designer-pro/${name}`;

const COBALT = "#1F3AD6";
const RED = "#FF3B1F";
/** The red on paper, a step darker so large type clears 3:1 (#FF3B1F is 2.96:1 on #ECEAE3). */
const RED_ON_PAPER = "#E8341A";
const BUTTON = "whitespace-nowrap max-[359px]:px-5 max-[359px]:text-[0.92rem] bg-[#FF3B1F] text-[#140300] shadow-[0_18px_40px_-18px_rgba(255,59,31,0.75)] hover:bg-[#ff5236]";
const INK_BUTTON = "whitespace-nowrap max-[359px]:px-5 max-[359px]:text-[0.92rem] bg-[#111111] text-white shadow-[0_18px_40px_-18px_rgba(17,17,17,0.7)] hover:bg-black";
const MUTED = "text-[color:rgba(17,17,17,0.64)]";

const STEPS: React.ReactNode[] = [
  <>Buy, then unzip the folder.</>,
  <>
    Open it in Claude Code or Codex and type <q className="font-semibold text-[#111]">hi</q>. It installs in a minute.
  </>,
  <>Describe your site. It asks, then shows you three directions.</>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
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

function Buy({ reportErrors = false, ink = false }: { reportErrors?: boolean; ink?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get Web Designer Pro · ${PRODUCT.priceLabel}`}
      soon={SOON}
      tone={ink ? "paper" : "ink"}
      reportErrors={reportErrors}
      align="start"
      buttonClassName={ink ? INK_BUTTON : BUTTON}
    />
  );
}

/** A small mono label, the page's editorial voice. */
function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-[family-name:var(--wdp-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>{children}</span>;
}

/** A render, framed like a screen. */
function Shot({
  src,
  alt,
  w,
  h,
  shadow = "shadow-[0_30px_60px_-34px_rgba(0,0,0,0.55)]",
  className = "",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  shadow?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[0.9rem] bg-black/10 ${shadow} ${className}`}>
      <Image src={src} alt={alt} width={w} height={h} unoptimized className="block h-auto w-full" />
    </div>
  );
}

const MADE = [
  { n: "01", name: "Night Shift", kind: "Fashion · with photos", src: S("made-night-shift-v1.webp"), alt: "A fashion page: huge wide red letters NIGHT SHIFT over a cut-out portrait on cobalt, with small labels on the edges.", bg: COBALT, fg: "#fff" },
  { n: "02", name: "Lumo", kind: "Dashboard · no photos", src: S("made-lumo-v2.webp"), alt: "A home energy dashboard: a glowing battery orb with hotspot labels, six pastel metric cards, a day timeline and an insights list.", bg: "#E7F04F", fg: "#111" },
  { n: "03", name: "Afterglow", kind: "Music · one photo", src: S("made-afterglow-v1.webp"), alt: "A record label page: the word Afterglow edge to edge in black with a cover photo dropped on it, and a tracklist below.", bg: "#FFFFFF", fg: "#111" },
  { n: "04", name: "Still", kind: "Product · no photos", src: S("made-still-v2.webp"), alt: "A product page for an air monitor: a dusk sky, a glass orb showing 12, three glowing cards for CO2, humidity and temperature.", bg: "#111111", fg: "#fff" },
];

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
    <li className={`relative flex flex-col overflow-hidden rounded-[1.6rem] ${wide ? "lg:col-span-2" : ""}`} style={{ background: bg, color: fg }}>
      <div className="px-7 pb-7 pt-7 sm:px-9 sm:pt-9">
        <Mono>{n}</Mono>
        <h3 className="mt-3 max-w-[16ch] text-balance font-[family-name:var(--wdp-archivo)] text-[clamp(2.1rem,4.6vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_70]">
          {title}
        </h3>
        <p className="mt-4 max-w-[44ch] text-pretty text-[1.06rem] font-medium leading-[1.5] opacity-90">{text}</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-8 sm:pb-8">{children}</div>
    </li>
  );
}

function AsksProof() {
  const qs = [
    "What does it sell, and to whom?",
    "What should a visitor do in the first ten seconds?",
    "Three words for the feel. Sites you love?",
    "Got photos? If not, I can make them.",
  ];
  return (
    <div className="w-full max-w-[32rem] rounded-[1.2rem] bg-[#111] p-5 text-left text-[#ECEAE3] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] sm:p-6">
      <Mono className="text-[#ECEAE3]/60">Before it designs anything</Mono>
      <ol className="mt-4 list-none space-y-2.5 p-0">
        {qs.map((q, i) => (
          <li key={q} className="flex gap-3 font-[family-name:var(--wdp-mono)] text-[0.88rem] leading-[1.45]">
            <span className="shrink-0 text-[#FF3B1F]">{i + 1}.</span>
            <span>{q}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BannedProof() {
  const banned = ["White receipt cards", "Tilted cards", "Purple gradients", "Emoji icons", "“✨ New” pills", "Inter, again"];
  return (
    <div className="w-full">
      <ul className="flex list-none flex-wrap gap-2.5 p-0">
        {banned.map((b) => (
          <li
            key={b}
            className="rounded-full border-2 border-current px-4 py-2 text-[1rem] font-bold line-through decoration-[#FF3B1F] decoration-[3px]"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A product drop the skill would make: the photos are generated (the shoe cut
 * out, so the name sits behind it), and the page sells: price, stock, one
 * button. A picture of a page, so one label for screen readers.
 */
function ProductDrop() {
  return (
    <div
      role="img"
      aria-label="A product page made with the skill: the name AERO 2 huge in black with a running shoe cut out over it, €149, only 31 left, an Add to bag button, and a photo of the same shoe on a wet street at night."
      className="w-full max-w-[34rem]"
    >
      <div aria-hidden className="relative rounded-[1rem] bg-[#ECEAE3] px-5 pb-5 pt-4 text-[#111] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Mono className="font-semibold">Stride</Mono>
          <Mono className="opacity-60">Run · Train · Bag (0)</Mono>
        </div>
        {/* The name, with the shoe cut out across its foot; the stage leaves
            room under the word for the rest of the shoe. */}
        <div className="relative mt-4 pb-[38%] sm:pb-[30%]">
          <p className="font-[family-name:var(--wdp-archivo)] text-[clamp(4.6rem,22vw,8.4rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] [font-variation-settings:'wdth'_62] lg:text-[clamp(5rem,9.5vw,8.4rem)]">
            Aero 2
          </p>
          <Image
            src={S("shoe-v1.webp")}
            alt=""
            width={1474}
            height={945}
            unoptimized
            className="pointer-events-none absolute right-[-3%] top-[24%] w-[70%] sm:top-[12%] sm:w-[76%] select-none drop-shadow-[0_22px_18px_rgba(0,0,0,0.28)]"
          />
        </div>
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--wdp-archivo)] text-[2rem] font-black leading-none tracking-[-0.02em]">€149</p>
            <Mono className="mt-2 block opacity-70">Only 31 left</Mono>
          </div>
          <span className="shrink-0 rounded-full bg-[#111] px-5 py-3 text-[0.95rem] font-semibold text-white">Add to bag</span>
        </div>
      </div>
      <div aria-hidden className="relative mt-3 overflow-hidden rounded-[1rem]">
        <Image src={S("street-v1.webp")} alt="" width={1200} height={800} unoptimized className="block aspect-[2.4/1] h-auto w-full object-cover object-[50%_62%]" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <Mono className="absolute bottom-3 left-4 text-white">Same shoe · same shoot</Mono>
      </div>
    </div>
  );
}

export function WebDesignerProPage() {
  return (
    <main className={`wdp-page ${archivo.variable} ${mono.variable} relative overflow-x-clip bg-[#ECEAE3] text-[#111]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <WebDesignerProIntro />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 001. THE POSTER: the name, Tobia, and the button. The title and the
          portrait are both sized from the viewport (globals.css .wdp-title,
          .wdp-figure) so his head always clears the second line. */}
      <section aria-labelledby="wdp-title" className="wdp-hero relative isolate overflow-hidden text-white" style={{ background: COBALT }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-rows-[auto_auto_1fr_auto] px-5 pb-10 pt-24 sm:px-8 md:pt-28">
          <div className="relative z-20 flex items-start justify-between gap-4">
            <Mono>
              {PRODUCT.priceLabel}
              <span className="hidden sm:inline"> · instant download</span>
            </Mono>
            <Mono className="hidden text-center lg:block">Websites that don&rsquo;t look AI-made</Mono>
            <Mono className="text-right">Skill for Claude Code &amp; Codex</Mono>
          </div>

          <div className="relative z-10 pt-6 [@media(min-width:768px)_and_(min-aspect-ratio:1/1)]:pt-1">
            <h1
              id="wdp-title"
              className="wdp-title font-[family-name:var(--wdp-archivo)] font-black uppercase leading-[0.8] tracking-[-0.035em]"
              style={{ color: RED }}
            >
              <span className="block">Web</span> <span className="block">Designer</span> <span className="block">Pro.</span>
            </h1>
          </div>

          <figure className="wdp-figure">
            <figcaption className="wdp-figure__cap">
              <Mono>Fig. 01 — Tobia, relit with GPT</Mono>
            </figcaption>
            <div className="wdp-figure__crop">
              <Image
                src={S("tobia-v3.webp")}
                alt="Tobia, who made Web Designer Pro, in a dark vest over a checked shirt, lit by a warm light from the right."
                width={777}
                height={1392}
                loading="eager"
                fetchPriority="high"
                unoptimized
                className="wdp-portrait pointer-events-none select-none"
              />
            </div>
          </figure>

          <div className="relative z-20 self-end pt-2">
            <p className="max-w-[34ch] text-pretty text-[1.15rem] font-medium leading-[1.45] sm:text-[1.3rem]">
              <span className="block text-white/75">Every AI-built site looks the same.</span>
              <span className="block">Yours won&rsquo;t.</span>
            </p>
            <div id={HERO_ID} className="mt-7 scroll-mt-28">
              <Buy reportErrors />
            </div>
            <Mono className="wdp-short-hide mt-5 block text-balance text-white/75">
              <span className="whitespace-nowrap">Asks first ·</span> <span className="whitespace-nowrap">no stock photos ·</span>{" "}
              <span className="whitespace-nowrap">checked on every screen</span>
            </Mono>
          </div>
        </div>
      </section>

      {/* 002. THIS IS THE FLOOR: the kits inside the skill, the level it starts from. */}
      <section aria-labelledby="wdp-made" className="relative border-b border-black/10">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative">
              <Mono className="opacity-60">002</Mono>
              <h2
                id="wdp-made"
                className="mt-3 max-w-[12ch] font-[family-name:var(--wdp-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]"
              >
                This is{" "}
                <span className="block" style={{ color: RED_ON_PAPER }}>
                  the floor.
                </span>
              </h2>
            </div>
            <div className="relative md:pb-3">
              <p className={`max-w-[40ch] text-pretty text-[1.12rem] font-medium leading-[1.5] ${MUTED}`}>
                Four kits ship inside the skill. Every site it designs starts here, then takes your name, words, colours
                and type.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:mt-16">
            {MADE.map((m) => (
              <li key={m.n} className="flex flex-col rounded-[1.1rem] p-5 sm:p-6" style={{ background: m.bg, color: m.fg }}>
                <Mono className="opacity-70">{m.n}</Mono>
                <h3 className="mt-2 font-[family-name:var(--wdp-archivo)] text-[2.3rem] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_66]">
                  {m.name}
                </h3>
                <Mono className="mt-1.5 opacity-75">{m.kind}</Mono>
                <div className="mt-6 flex-1" />
                <Shot src={m.src} alt={m.alt} w={1440} h={900} />
              </li>
            ))}
          </ul>

          {/* The proof that the level holds without anyone steering: one brief,
              a fresh agent, the skill on its own (scratchpad pro-test2). */}
          <figure className="mt-3 grid grid-cols-1 items-center gap-6 rounded-[1.1rem] bg-[#F7B500] p-5 text-[#111] sm:p-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-10">
            <figcaption>
              <Mono className="opacity-70">05 · Made by the skill on its own</Mono>
              <h3 className="mt-2 font-[family-name:var(--wdp-archivo)] text-[2.3rem] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_66]">
                Forno Bruno
              </h3>
              <p className="mt-3 max-w-[36ch] text-pretty text-[1rem] font-medium leading-[1.5]">
                One brief, a fresh agent, no help. It asked, tried three directions, made the photos and shipped this.
              </p>
            </figcaption>
            <Shot
              src={S("made-forno-v3.webp")}
              alt="A bakery page: the word Focaccia huge in black with a photo of a focaccia tray dropped onto it, a yolk-yellow block, 'Out at 7:40. 14 slices left.' and four product cards."
              w={1600}
              h={935}
              shadow="shadow-[0_20px_40px_-30px_rgba(0,0,0,0.45)]"
            />
          </figure>
        </div>
      </section>

      {/* 003. WHAT €5 GETS YOU: six tiles. */}
      <section aria-labelledby="wdp-gets" className="relative">
        <div className="mx-auto max-w-[80rem] px-4 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="relative text-center">
            <Mono className="opacity-60">003</Mono>
            <h2
              id="wdp-gets"
              className="mx-auto mt-3 max-w-[14ch] text-balance font-[family-name:var(--wdp-archivo)] text-[clamp(2.8rem,7.5vw,6.2rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]"
            >
              What {PRODUCT.priceLabel} gets you.
            </h2>
            <p className={`mx-auto mt-5 max-w-[46ch] text-balance text-[1.08rem] font-medium leading-[1.5] ${MUTED}`}>
              The free Web Designer avoids the obvious mistakes. Pro starts from real kits, makes the photos, and won&rsquo;t
              stop at tidy.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 lg:grid-cols-2">
            <Tile
              n="01"
              title="It asks first."
              text="What it sells, who it's for, the sites you love. Then three directions, not one guess."
              bg="#FFFFFF"
              fg="#111"
            >
              <AsksProof />
            </Tile>

            <Tile
              n="02"
              title="Components with an identity."
              text="Not another grey card. Glass, light and colour, straight from the kit."
              bg="#111111"
              fg="#ffffff"
            >
              <Shot src={S("made-cards-v4.webp")} alt="Five rounded metric cards glowing from inside in rose, sage, magenta, cobalt and rust, over a softly blurred photo." w={1512} h={1290} className="max-w-[30rem]" />
            </Tile>

            <Tile
              n="03"
              title="Pages like posters."
              text="Every section designed, not just the hero."
              bg={COBALT}
              fg="#ffffff"
              wide
            >
              <Shot src={S("made-live-crop-v1.webp")} alt="A red events page: the date 07.11 and a giant black word LIVE cropped by the bottom edge." w={1440} h={540} className="w-full" />
            </Tile>

            <Tile
              n="04"
              title="Great without a single photo."
              text="No photos? No stock, no clip-art. Pages that don't need any."
              bg="#E7F04F"
              fg="#111"
            >
              <Shot src={S("made-tondo-v1.webp")} alt="A ceramics school page in three colour sections, a serif headline with italics, and a hand-drawn circle around the words wet clay." w={1440} h={1640} className="max-w-[24rem]" />
            </Tile>

            <Tile
              n="05"
              title="Photos that sell."
              text="Yours, or made on your ChatGPT plan through Codex. Cut out and placed for you."
              bg={RED}
              fg="#140300"
            >
              <ProductDrop />
            </Tile>

            <Tile
              n="06"
              title="The AI look, banned."
              text="Every render is scanned for it. A critic sends back anything merely tidy."
              bg="#F6B6C8"
              fg="#111"
              wide
            >
              <BannedProof />
            </Tile>
          </ul>
          <p className={`mx-auto mt-8 max-w-[56ch] text-balance text-center text-[0.98rem] leading-[1.5] ${MUTED}`}>
            Plain HTML, React, Next.js, Tailwind, Vue, Svelte or Astro. Checked from phone to desktop, on Windows, Linux,
            Safari and Firefox.
          </p>
        </div>
      </section>

      {/* 004. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="wdp-close-title" className="scroll-mt-28 border-t border-black/10">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="opacity-60">004</Mono>
              <h2
                id="wdp-close-title"
                className="mt-3 max-w-[11ch] font-[family-name:var(--wdp-archivo)] text-[clamp(2.8rem,7.5vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]"
              >
                Stop shipping <span style={{ color: RED_ON_PAPER }}>the AI page.</span>
              </h2>
              <p className={`mt-6 max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
                Visitors spot an AI page in a second and leave. Give them one they stay on.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-black/10 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-black/10 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--wdp-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-[color:rgba(17,17,17,0.75)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <Buy ink />
                <p className={`mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] ${MUTED}`}>
                  One-time {PRODUCT.priceLabel}. Secure checkout by Stripe. Needs Claude Code (paid Claude plan) or Codex
                  (ChatGPT plan), and Node.js 18+. Mac, Windows or Linux.
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
        note={SOON ? "Checkout opens soon" : `${PRODUCT.priceLabel} · instant download`}
        soon={SOON}
        buttonClassName={INK_BUTTON}
      />
    </main>
  );
}
