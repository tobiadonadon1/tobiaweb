import { Archivo, Geist_Mono, Instrument_Serif } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { VIDEO_EDITOR_PRO as PRODUCT, forSale } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { VideoEditorProLoader } from "./video-editor-pro-loader";
import { StickyBuy } from "./sticky-buy";

/**
 * VIDEO EDITOR PRO, the paid follow-up to the free Video Editor: one skill
 * (reel-director) that edits your own raw footage into a finished reel, sold
 * with the editing masterclass Tobia is recording, €15.
 *
 * TOBIA'S BRIEF (2026-10-26, third pass): the value from the very start, a
 * loader, few sections and little text, dark with bordeaux writing, and no
 * video until his new one arrives (a grey frame holds its place). So: the
 * loader says the value in three beats; the poster says it again with what
 * you get (the masterclass as a badge, so nobody has to scroll to find it)
 * and the price; the masterclass (you learn it, you don't guess); what it
 * does ("and a bunch more"); the close. The pictures are grey placeholders
 * until the real ones exist.
 *
 * THE VIDEO SLOT is HERO_FILM: null shows the grey frame. When the new video
 * arrives, put it in public/shop/video-editor-pro/ and set its src and poster.
 *
 * WHAT IS REAL: the stills are frames of reel-director's render of Tobia's
 * raw clip (his test, 2026-10-23). The masterclass is described only as what
 * it is: his, on making reels with it.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--vep-archivo", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--vep-serif", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--vep-mono", display: "swap" });

const HERO_ID = "buy";
const CLOSE_ID = "vep-close";
const SOON = !forSale(PRODUCT);

/** The hero's video, or null for the grey frame that holds its place. */
const HERO_FILM = null as { src: string; poster: string } | null;

const GROUND = "#0F0D0E";
const PANEL = "#1A1718";
const WINE = "#B0243B";
const CREAM = "#F4EEE6";
const BUTTON = "bg-[#9E1F34] text-white shadow-[0_18px_40px_-16px_rgba(158,31,52,0.8)] hover:bg-[#b0243b]";

/** What it does: four get a picture (grey placeholders for now), two are words. */
const DOES: { title: string; text: string; img?: string }[] = [
  { title: "Cuts the takes", text: "Retakes, fillers, dead air: gone." },
  { title: "Fixes the light", text: "Exposed on your face, warmer on request.", img: "warmer-v2.jpg" },
  { title: "Captions on the word", text: "Off your face, clear of the app's buttons.", img: "captions-v2.jpg" },
  { title: "Type behind you", text: "You're cut out of every frame.", img: "behind-v2.jpg" },
  { title: "Your colours", text: "One look, taken from your footage.", img: "backdrop-v2.jpg" },
  { title: "Sound, mixed", text: "Clean voice, a sound kit, music that steps aside." },
];

/** "And much more": from the skill's own feature list (README, SKILL.md). */
const MORE = [
  "50 effects",
  "9 moods in one word",
  "Selfie, pro camera or product",
  "6 caption styles",
  "Clear of Instagram, TikTok and Shorts buttons",
  "A before/after of every change",
  "One sentence to change anything",
  "Every version kept",
  "It learns your style",
];

/** What the masterclass covers, in Tobia's words: how he films, edits with it and posts. */
const LEARN: [string, string][] = [
  ["Film it", "How I shoot a clip on my phone that edits well."],
  ["Edit it", "How I hand it over, approve the plan and change it in a sentence."],
  ["Post it", "How the finished reel goes out."],
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

export function VideoEditorProPage() {
  return (
    <main className={`vep-page ${archivo.variable} ${serif.variable} ${mono.variable} relative overflow-x-clip`} style={{ background: GROUND, color: CREAM }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <VideoEditorProLoader />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 01. THE VALUE, AT ONCE: what it does, what you get, the price. */}
      <section aria-labelledby="vep-title" className="relative isolate overflow-hidden">
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 gap-y-12 px-5 pb-16 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-x-14">
          <div>
            <h1 id="vep-title" className="vep-title font-[family-name:var(--vep-archivo)] font-black uppercase leading-[0.82] tracking-[-0.035em]">
              <span className="vep-line">
                <span style={{ "--i": 0 } as React.CSSProperties}>Video Editor</span>
              </span>
              <span className="vep-line">
                <span className="font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ "--i": 1, color: WINE } as React.CSSProperties}>
                  Pro.
                </span>
              </span>
            </h1>

            <p className="vep-in mt-8 max-w-[22ch] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em]" style={{ "--i": 2 } as React.CSSProperties}>
              The editor you&rsquo;d hire, <span className="whitespace-nowrap" style={{ color: WINE }}>inside Claude Code.</span>
            </p>
            <p className="vep-in mt-4 max-w-[46ch] text-[1.12rem] leading-[1.5] text-[rgba(244,238,230,0.75)]" style={{ "--i": 3 } as React.CSSProperties}>
              Hand it your raw clip. Get back a finished reel.
            </p>

            <div className="vep-in mt-8" style={{ "--i": 4 } as React.CSSProperties}>
              <ul className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0 text-[1.02rem] font-semibold">
                <li className="rounded-full border border-white/20 px-4 py-2">The Video Editor Pro skill</li>
                <li className="vep-badge rounded-full px-4 py-2 text-white" style={{ background: WINE }}>
                  + The editing masterclass
                </li>
              </ul>
              <p className="m-0 mt-3 text-[0.95rem] text-[rgba(244,238,230,0.65)]">Both for {PRODUCT.priceLabel}</p>
            </div>
            <div id={HERO_ID} className="vep-in mt-8 scroll-mt-28" style={{ "--i": 5 } as React.CSSProperties}>
              <Buy reportErrors />
            </div>
          </div>

          <figure className="vep-phone-in m-0 justify-self-center lg:justify-self-end">
            <div className="vep-phone w-[min(70vw,19rem)] lg:w-[min(28vw,21rem)]">
              <div className="vep-phone__screen">
                {HERO_FILM ? (
                  <video src={HERO_FILM.src} poster={HERO_FILM.poster} muted loop playsInline autoPlay className="h-full w-full object-cover" />
                ) : (
                  <div className="vep-grey h-full w-full" role="img" aria-label="The video, coming soon" />
                )}
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* 02. THE MASTERCLASS: you learn it, you don't guess. */}
      <section aria-labelledby="vep-learn" className="border-t border-white/10">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="vep-reveal">
            <p className="m-0 text-[1rem] font-semibold" style={{ color: WINE }}>
              Included: the editing masterclass
            </p>
            <h2 id="vep-learn" className="mt-4 font-[family-name:var(--vep-archivo)] text-[clamp(2.6rem,6.6vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_74]">
              Don&rsquo;t guess.{" "}
              <span className="block font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: WINE }}>
                Learn it.
              </span>
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.15rem] leading-[1.55] text-[rgba(244,238,230,0.78)]">
              Most tools hand you a file and leave you to figure it out. This comes with my masterclass, so your first reel
              already looks right.
            </p>
          </div>
          <ol className="vep-reveal m-0 list-none self-end p-0">
            {LEARN.map(([k, v], i) => (
              <li key={k} className="flex items-baseline gap-6 border-t border-white/12 py-6 last:border-b">
                <span className="w-8 shrink-0 font-[family-name:var(--vep-archivo)] text-[1.3rem] font-black" style={{ color: WINE }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="m-0 font-[family-name:var(--vep-archivo)] text-[1.6rem] font-black uppercase leading-none tracking-[-0.02em] [font-variation-settings:'wdth'_76]">
                    {k}
                  </p>
                  <p className="m-0 mt-2 text-[1.05rem] leading-[1.45] text-[rgba(244,238,230,0.72)]">{v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03. WHAT IT DOES. */}
      <section aria-labelledby="vep-does" className="border-t border-white/10">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 md:py-28">
          <h2 id="vep-does" className="vep-reveal font-[family-name:var(--vep-archivo)] text-[clamp(2.6rem,6.6vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_74]">
            What it does{" "}
            <span className="font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: WINE }}>
              to your clip.
            </span>
          </h2>
          <ol className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {DOES.filter((d) => d.img).map((d) => (
              <li key={d.title} className="vep-reveal flex flex-col overflow-hidden rounded-[1.4rem]" style={{ background: PANEL }}>
                <div className="px-6 pb-5 pt-6">
                  <h3 className="font-[family-name:var(--vep-archivo)] text-[1.6rem] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-variation-settings:'wdth'_76]" style={{ color: WINE }}>
                    {d.title}
                  </h3>
                  <p className="mt-2 text-[1rem] leading-[1.4] text-[rgba(244,238,230,0.75)]">{d.text}</p>
                </div>
                <div className="vep-grey mt-auto aspect-[4/5]" role="img" aria-label={`${d.title}: picture coming soon`} />
              </li>
            ))}
            {DOES.filter((d) => !d.img).map((d) => (
              <li key={d.title} className="vep-reveal flex flex-col justify-between gap-6 rounded-[1.4rem] px-6 py-7 sm:flex-row sm:items-end lg:col-span-2" style={{ background: PANEL }}>
                <h3 className="font-[family-name:var(--vep-archivo)] text-[clamp(1.9rem,3vw,2.6rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-variation-settings:'wdth'_76]" style={{ color: WINE }}>
                  {d.title}
                </h3>
                <p className="max-w-[26ch] text-[1.05rem] leading-[1.4] text-[rgba(244,238,230,0.75)] sm:text-right">{d.text}</p>
              </li>
            ))}
            <li className="vep-reveal rounded-[1.4rem] px-6 py-7 sm:px-8 sm:py-8 lg:col-span-4" style={{ background: WINE }}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
                <h3 className="shrink-0 font-[family-name:var(--vep-serif)] text-[clamp(2.2rem,4vw,3.2rem)] italic leading-none text-white">
                  And a bunch more.
                </h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {MORE.map((m) => (
                    <li key={m} className="rounded-full bg-white/15 px-3.5 py-2 text-[0.95rem] font-semibold text-white">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 04. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="vep-close-title" className="scroll-mt-28 border-t border-white/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-10 px-5 pb-28 pt-20 sm:px-8 md:pb-32 md:pt-28 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="vep-close-title" className="vep-reveal font-[family-name:var(--vep-archivo)] text-[clamp(2.6rem,6.6vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_74]">
            Film it.{" "}
            <span className="block font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: WINE }}>
              It edits. You post.
            </span>
          </h2>
          <div className="vep-reveal">
            <Buy />
            <p className="mt-4 max-w-[40ch] text-[0.95rem] leading-[1.5] text-[rgba(244,238,230,0.6)]">
              The skill and the masterclass, {PRODUCT.priceLabel}, one payment. No editor to hire, no editing app to learn.
              Needs Claude Code; best on a Mac.
            </p>
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
