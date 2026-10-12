import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { APP_DESIGNER_PRO as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { LoopVideo } from "./loop-video";
import { ProIntro } from "./app-designer-pro-intro";
import { StickyBuy } from "./sticky-buy";

/**
 * APP DESIGNER PRO, the paid follow-up to the free App Designer.
 *
 * THREE SECTIONS, short on purpose: the name and the button, what €5 gets you
 * (the six things Pro adds, one tile each), and the close. It sells value, so
 * every tile shows the thing itself.
 *
 * THE OPENING (app-designer-pro-intro.tsx) fires the six words one a beat, each
 * on its own colour, then lifts on the hero. Tobia's idea.
 *
 * THE COLOURS ARE AN IDENTITY PALETTE, the way the skill teaches it: six
 * hues tuned as one family, each owned by one thing Pro adds, the same thing
 * on the opening, the stickers and the tiles. The page itself stays paper and
 * ink so the colour lands.
 *
 * EVERY SCREEN ON THE PAGE IS REAL OUTPUT: made by fresh agents following
 * App Designer Pro from a short brief, unedited (public/shop/app-designer-pro).
 */

const HERO_ID = "buy";
const CLOSE_ID = "adp-close";
const SOON = !forSale(PRODUCT);
const S = (name: string) => `/shop/app-designer-pro/${name}`;

/** The six, in the order they fire. fg is the ink each colour carries at AA. */
const SIX = [
  { key: "android", word: "Android.", sticker: "Android", bg: "#2BC46F", fg: "#08210F" },
  { key: "motion", word: "Motion.", sticker: "Motion", bg: "#2F62F2", fg: "#FFFFFF" },
  { key: "copy", word: "Human copy.", sticker: "Human copy", bg: "#FF86BC", fg: "#2A0716" },
  { key: "money", word: "Paywalls.", sticker: "Paywalls", bg: "#FFC23A", fg: "#2A1B00" },
  { key: "store", word: "Store assets.", sticker: "Store assets", bg: "#FF5B2E", fg: "#230600" },
  { key: "taste", word: "Taste.", sticker: "Better taste", bg: "#16171B", fg: "#FFFFFF" },
] as const;
type Key = (typeof SIX)[number]["key"];
const C = Object.fromEntries(SIX.map((s) => [s.key, s])) as Record<Key, (typeof SIX)[number]>;

const BUTTON =
  "bg-[#16171B] text-white shadow-[0_18px_40px_-18px_rgba(22,23,27,0.7)] hover:bg-black";

const STEPS: React.ReactNode[] = [
  <>Buy it and download the folder.</>,
  <>
    Open it in Claude Code and type <q className="font-semibold text-[var(--ink)]">hi</q>. It installs in about a minute.
  </>,
  <>Tell Claude about your app. It starts with three directions for you to choose from.</>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS",
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

function Buy({ reportErrors = false }: { reportErrors?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get App Designer Pro · ${PRODUCT.priceLabel}`}
      soon={SOON}
      reportErrors={reportErrors}
      buttonClassName={BUTTON}
    />
  );
}

/** One of the six, as a tile in its own colour: the claim, then the proof. */
function Tile({
  k,
  title,
  text,
  children,
  wide = false,
  fit = false,
}: {
  k: Key;
  title: string;
  text: string;
  children: React.ReactNode;
  wide?: boolean;
  /** The proof sets its own height (words, not a picture). */
  fit?: boolean;
}) {
  const c = C[k];
  return (
    <li
      className={`adp-tile relative flex flex-col overflow-hidden rounded-[2rem] ${wide ? "lg:col-span-2" : ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <div className="px-7 pb-8 pt-8 sm:px-9 sm:pt-10">
        <p className="text-[0.95rem] font-semibold opacity-75">{c.sticker}</p>
        <h3 className="mt-2 max-w-[16ch] text-balance text-[clamp(2rem,4.4vw,2.9rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          {title}
        </h3>
        <p className="mt-4 max-w-[40ch] text-pretty text-[1.06rem] font-medium leading-[1.5] opacity-90">{text}</p>
      </div>
      {/* The proof, cropped by the tile's bottom edge like a store panel. */}
      <div
        className={`relative mt-auto flex justify-center overflow-hidden ${
          fit ? "flex-1 items-end" : wide ? "h-[19rem] sm:h-[25rem] lg:h-[29rem]" : "h-[21rem] sm:h-[25rem]"
        }`}
      >
        {children}
      </div>
    </li>
  );
}

/** A phone screen as the skill renders it, cropped by the tile's bottom edge. */
function Shot({ src, alt, w, h, className = "" }: { src: string; alt: string; w: number; h: number; className?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes="(min-width: 1024px) 520px, 90vw"
      className={`block h-auto ${className}`}
    />
  );
}

export function AppDesignerProPage() {
  return (
    <main className="adp-page relative overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ProIntro words={SIX.map(({ word, bg, fg }) => ({ word, bg, fg }))} />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 1. THE NAME AND THE BUTTON, under the six stickers. */}
      <section aria-labelledby="adp-title" className="relative">
        <div className="mx-auto flex min-h-[92svh] max-w-[72rem] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8 md:pt-32">
          <ul className="flex max-w-[56rem] list-none flex-wrap justify-center gap-2.5 p-0 sm:gap-3" aria-label="What Pro adds">
            {SIX.map((s, i) => (
              <li
                key={s.key}
                className="adp-sticker rounded-full px-4 py-2 text-[0.98rem] font-bold tracking-[-0.01em] sm:px-5 sm:py-2.5 sm:text-[1.08rem]"
                style={{ background: s.bg, color: s.fg, "--i": i, "--tilt": `${[-3, 2, -2, 3, -1.5, 2.5][i]}deg` } as React.CSSProperties}
              >
                {s.sticker}
              </li>
            ))}
          </ul>
          <h1
            id="adp-title"
            className="mt-10 text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.055em] md:mt-12"
          >
            App Designer Pro
          </h1>
          <p className="mt-7 max-w-[34ch] text-balance text-[1.2rem] font-medium leading-[1.45] text-[color:rgba(11,31,58,0.78)] md:text-[1.45rem]">
            The design skill to run before you launch. Your app on iPhone and Android, and everything that sells it.
          </p>
          <div id={HERO_ID} className="mt-9 scroll-mt-28">
            <Buy reportErrors />
          </div>
          <p className="mt-4 text-[0.95rem] text-[color:rgba(11,31,58,0.62)]">One payment · instant download</p>
        </div>
      </section>

      {/* 2. WHAT €5 GETS YOU: the six, each with the proof. */}
      <section aria-labelledby="adp-gets" className="relative">
        <div className="mx-auto max-w-[76rem] px-4 pb-24 sm:px-8 md:pb-32">
          <h2
            id="adp-gets"
            className="mx-auto max-w-[14ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            What {PRODUCT.priceLabel} gets you.
          </h2>
          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 lg:grid-cols-2">
            <Tile
              k="android"
              title="Every screen, on both phones."
              text="Native on the iPhone and native on Android, side by side. One app, not a copy pasted onto a Pixel."
              wide
            >
              <Shot
                src={S("android-v2.webp")}
                alt="A savings app designed with App Designer Pro, on iPhone and on Android."
                w={1600}
                h={900}
                className="h-fit w-[175%] max-w-none shrink-0 sm:w-full sm:max-w-[56rem] sm:px-10"
              />
            </Tile>

            <Tile k="motion" title="Screens that move." text="The app doing its job, recorded to video. Ready to post the day you launch.">
              <div className="adp-phone h-fit w-[72%] max-w-[17rem]">
                <LoopVideo
                  src={S("motion-v2.mp4")}
                  poster={S("motion-v2.webp")}
                  label="A focus timer designed with App Designer Pro: put the phone down and the gardener keeps watering."
                  className="!aspect-[402/874] rounded-[2.4rem]"
                />
              </div>
            </Tile>

            <Tile
              k="copy"
              title="Words a person would say."
              text="Every screen gets a word budget. AI phrases, em dashes and paragraphs on a paywall don't get past the check."
              fit
            >
              <div className="flex w-full flex-col justify-end px-7 pb-8 text-left sm:px-9 sm:pb-10">
                <ul className="list-none p-0 text-[1.1rem] font-semibold leading-[1.35] sm:text-[1.25rem]">
                  {["Unlock your potential.", "Not just an app. A lifestyle.", "Seamless. Effortless. Powerful."].map((x) => (
                    <li key={x} className="adp-strike mt-2 w-fit opacity-55">
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-[1.4rem] bg-white/70 px-5 py-4 text-[1.3rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#2A0716] sm:text-[1.5rem]">
                  <span className="text-[#FF5A36]">€49</span> is three takeaways.
                </p>
              </div>
            </Tile>

            <Tile
              k="money"
              title="The screens that make money."
              text="Onboarding and a paywall that convert, inside the App Store and Google Play rules. No fake countdowns, no hidden prices."
            >
              <Shot
                src={S("paywall-v2.webp")}
                alt="A savings app paywall designed with App Designer Pro: €29.99 a year, free for 7 days."
                w={804}
                h={1748}
                className="h-fit w-[72%] max-w-[17rem] drop-shadow-[0_24px_40px_rgba(42,27,0,0.25)]"
              />
            </Tile>

            <Tile
              k="taste"
              title="Taste, turned up."
              text="Bolder colour, characters with a personality, and a critic that won't pass anything that's merely tidy."
            >
              <Shot
                src={S("taste-v3.webp")}
                alt="A focus timer and a weekend trip planner, both designed with App Designer Pro."
                w={1600}
                h={960}
                className="h-fit w-[125%] max-w-none shrink-0 self-end"
              />
            </Tile>

            <Tile
              k="store"
              title="Ready for both stores."
              text="App Store and Google Play screenshots at the exact sizes, the Play feature graphic, and both app icons."
              wide
            >
              <Shot
                src={S("store-v2.webp")}
                alt="Five App Store screenshots designed with App Designer Pro."
                w={1600}
                h={706}
                className="h-fit w-[150%] max-w-none shrink-0 px-4 sm:w-full sm:px-8"
              />
            </Tile>


          </ul>
        </div>
      </section>

      {/* 3. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="adp-close-title" className="scroll-mt-28 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-[72rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2
                id="adp-close-title"
                className="max-w-[13ch] text-balance text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
              >
                Launch looking like you hired a studio.
              </h2>
              <p className="mt-6 max-w-[38ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-[color:rgba(11,31,58,0.72)]">
                The free App Designer went viral. Pro is the one you launch with: everything the free one does, plus all six of the above.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-[var(--hairline)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 text-[1rem] font-extrabold">{i + 1}</span>
                    <span className="text-[color:rgba(11,31,58,0.75)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <Buy />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] text-[color:rgba(11,31,58,0.62)]">
                  Secure checkout by Stripe. Needs a Mac with Google Chrome, Claude Code and Node.js.
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
        buttonClassName={BUTTON}
      />
    </main>
  );
}
