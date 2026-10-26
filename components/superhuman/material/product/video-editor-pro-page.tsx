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
 * (reel-director) that edits your own raw footage into a finished reel.
 *
 * TOBIA'S BRIEF (2026-10-26): super qualitative, no fluff; in the first thirty
 * seconds a visitor understands what it does, what's inside and what it's
 * worth. So the hero IS the proof: his raw iPhone clip beside the Pro edit of
 * it, the price and one line. Then what it does to a clip (six cards, five of
 * them real frames of that edit), approve-then-one-sentence, what's inside in
 * numbers, the same clip three ways (raw, the free Video Editor, Pro) with
 * the difference in a table, and the close.
 *
 * THE LOOK is the edit's own: the navy it took from his shirt, cream type,
 * a brass accent, heavy grotesk caps with a serif italic second voice
 * ("your own / brand."). The poster family of Motion Designer and Web
 * Designer Pro, in those colours.
 *
 * WHAT IS REAL: the raw clip is the same file as the free Video Editor's page
 * (public/shop/video-editor/talk-before.mp4); the Pro edit is reel-director's
 * render of it (Tobia's test, 2026-10-23), re-encoded for the web; every still
 * is a frame of that render. The numbers are the skill's README and SKILL.md.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--vep-archivo", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--vep-serif", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--vep-mono", display: "swap" });

const HERO_ID = "buy";
const CLOSE_ID = "vep-close";
const SOON = !forSale(PRODUCT);
const S = (name: string) => `/shop/video-editor-pro/${name}`;
const V1 = (name: string) => `/shop/video-editor/${name}`;

const NAVY = "#1D2433";
const CREAM = "#F2E8D5";
const BRASS = "#C9A961";
const PAPER = "#F4F0E8";
const INK = "#14181F";
const BUTTON = "bg-[#C9A961] text-[#14181F] shadow-[0_18px_40px_-18px_rgba(201,169,97,0.8)] hover:bg-[#d8bb73]";
const BUTTON_INK = "bg-[#1D2433] text-[#F2E8D5] shadow-[0_18px_40px_-18px_rgba(29,36,51,0.7)] hover:bg-[#141a26]";

/** What it does to a clip: five are frames of the Pro edit, one is the sound. */
const DOES: { n: string; title: string; text: string; img?: string; alt?: string; list?: string[] }[] = [
  {
    n: "01",
    title: "Cuts the takes.",
    text: "Bad takes can stay in. It keeps the last good one.",
    list: ["Retakes: the last one wins", "Fillers and stutters: out", "Lines that trail off: out", "Dead air: closed", "Talk to the crew: out"],
  },
  {
    n: "02",
    title: "Fixes the light.",
    text: "Exposure measured on your face. Say “warmer” and it relights you.",
    img: "warmer-v1.jpg",
    alt: "The before/after slider across Tobia: the edit's light is warmer than the raw.",
  },
  {
    n: "03",
    title: "Captions on the word.",
    text: "Each word as you say it. Never on your face, never under the app's buttons.",
    img: "captions-v1.jpg",
    alt: "A clean caption, “skill for Claude Code”, low on the frame under Tobia's hands.",
  },
  {
    n: "04",
    title: "Type behind you.",
    text: "You're cut out of every frame, so big words can sit behind your head.",
    img: "behind-v1.jpg",
    alt: "“bigger phrase.” in heavy type and serif italics, behind Tobia's head and raised hand.",
  },
  {
    n: "05",
    title: "One look, from your footage.",
    text: "The colours come from what you wear. Here, the navy of the shirt.",
    img: "backdrop-v1.jpg",
    alt: "The room turned navy behind Tobia, with “your own brand.” in cream and brass.",
  },
  {
    n: "06",
    title: "Sound like an engineer.",
    text: "A clean voice, one designed sound kit, music that steps aside.",
    list: ["Voice: hum and rumble out, de-essed, even, −14 LUFS", "34 sounds made to work together", "Music drops out on the big moments", "The background never pumps"],
  },
];

/** What you can say after it renders, and what happens. */
const SAY: [string, string][] = [
  ["tighter cut", "re-cut; every graphic stays on its word"],
  ["bigger captions", "re-rendered, captions up a size"],
  ["make it moody", "darker grade, captions come in huge"],
  ["warmer", "the grade, measured on your skin"],
  ["go back to the second version", "restored; every version is kept"],
  ["every time I say free, big FREE", "saved to your style, for every video"],
];

const INSIDE: [string, string][] = [
  ["3", "styles: phone selfie, pro camera, product"],
  ["9", "moods, one word each"],
  ["50", "effects, placed off your face and hands"],
  ["6", "caption styles, words lit as they're said"],
  ["10", "colour grades"],
  ["34", "sounds in one studio kit"],
  ["8", "music beds, free to post"],
  ["∞", "versions, any of them restorable"],
];

/** The same clip three ways: raw, the free Video Editor's edit, the Pro edit. */
const THREE = [
  { label: "Raw", note: "Straight off the iPhone", src: V1("talk-before.mp4"), poster: V1("talk-before.jpg"), quiet: true },
  { label: "Video Editor · free", note: "Zoom, titles, warm light, captions", src: V1("talk-after.mp4"), poster: V1("talk-after.jpg"), quiet: false },
  { label: "Video Editor Pro", note: "Cut, lit, designed, scored", src: S("pro-edit-v1.mp4"), poster: S("pro-edit-v1.jpg"), quiet: false },
] as const;

const COMPARE: [string, string, string][] = [
  ["What it is", "21 skills you combine", "One skill that does the whole edit"],
  ["Bad takes", "You cut them", "Found and cut for you"],
  ["Picture", "Warm light where you ask", "Exposed on your face, relit on request"],
  ["Graphics", "Titles and captions", "50 effects in one look, off your face and hands"],
  ["Sound", "Your audio as it was", "An engineered voice, a sound kit, a music bed"],
  ["Before it renders", "A storyboard", "Before/after of every change, and the sound"],
  ["After", "Say what to change", "One sentence; it remembers your style"],
];

const STEPS: React.ReactNode[] = [
  <>Buy, then unzip the folder.</>,
  <>
    Open it in Claude Code and type <q className="font-semibold text-[#F2E8D5]">hi</q>. It installs in a minute.
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
    <span className={`font-[family-name:var(--vep-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>{children}</span>
  );
}

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`vep-phone ${className}`}>
      <div className="vep-phone__screen">{children}</div>
    </div>
  );
}

function Clip({ src, poster, label, eager = false, quiet = false }: { src: string; poster: string; label: string; eager?: boolean; quiet?: boolean }) {
  return (
    <Film src={src} poster={poster} label={label} eager={eager} className="h-full w-full" buttonClassName={quiet ? "!hidden" : "mdx-sound--screen"} />
  );
}

function Buy({ reportErrors = false, ink = false }: { reportErrors?: boolean; ink?: boolean }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get Video Editor Pro · ${PRODUCT.priceLabel}`}
      soon={SOON}
      tone={ink ? "paper" : "ink"}
      align="start"
      reportErrors={reportErrors}
      buttonClassName={ink ? BUTTON_INK : BUTTON}
    />
  );
}

/** The big two-voice heading every section uses: grotesk caps, then serif italics. */
function Heading({ id, caps, serifLine, n, dark = false }: { id: string; caps: string; serifLine: string; n: string; dark?: boolean }) {
  return (
    <div>
      <Mono className="opacity-60">{n}</Mono>
      <h2 id={id} className="mt-3 font-[family-name:var(--vep-archivo)] text-[clamp(2.8rem,7.6vw,6.6rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_72]">
        {caps}{" "}
        <span className="block font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: dark ? BRASS : "#9C7C35" }}>
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

      {/* 001. THE POSTER: the raw clip beside the Pro edit, the name, one line, the button. */}
      <section aria-labelledby="vep-title" className="relative isolate overflow-hidden" style={{ background: NAVY, color: CREAM }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 gap-y-10 px-5 pb-14 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <div className="flex items-start justify-between gap-4 lg:col-span-2">
            <Mono>
              {PRODUCT.priceLabel}
              <span className="hidden sm:inline"> · included with Pro</span>
            </Mono>
            <Mono className="hidden text-center md:block">Edits your own footage · no editing app</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">Skill for </span>Claude Code
            </Mono>
          </div>

          <div className="flex flex-col justify-end">
            <h1 id="vep-title" className="vep-title font-[family-name:var(--vep-archivo)] font-black uppercase leading-[0.82] tracking-[-0.035em]">
              <span className="block">Video</span>
              <span className="block">Editor</span>
              <span className="block font-[family-name:var(--vep-serif)] font-normal normal-case italic tracking-[-0.01em]" style={{ color: BRASS }}>
                Pro.
              </span>
            </h1>
            <p className="mt-7 max-w-[34ch] text-[clamp(1.25rem,2.1vw,1.7rem)] font-semibold leading-[1.2]">
              <span className="block">Your raw clip in, bad takes and all.</span>
              <span className="block" style={{ color: BRASS }}>
                A finished reel out.
              </span>
            </p>
            <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
              {["Cut", "Lit", "Captioned", "Designed", "Scored"].map((w) => (
                <li key={w} className="rounded-full border border-[rgba(242,232,213,0.3)] px-3.5 py-1.5 text-[0.95rem] font-semibold">
                  {w}
                </li>
              ))}
            </ul>
            <div id={HERO_ID} className="mt-8 scroll-mt-28">
              <Buy reportErrors />
            </div>
          </div>

          <figure className="m-0 self-end">
            <div className="flex items-end justify-center gap-4 sm:gap-6">
              <div className="w-[38%] max-w-[13rem]">
                <Mono className="mb-2 block text-[rgba(242,232,213,0.65)]">Raw · iPhone</Mono>
                <Phone className="vep-phone--raw">
                  <Clip src={V1("talk-before.mp4")} poster={V1("talk-before.jpg")} label="the raw clip" quiet />
                </Phone>
              </div>
              <span className="vep-arrow mb-[22%] shrink-0 font-[family-name:var(--vep-serif)] text-[2.6rem] italic" style={{ color: BRASS }} aria-hidden>
                →
              </span>
              <div className="w-[52%] max-w-[17.5rem]">
                <Mono className="mb-2 block" >
                  <span style={{ color: BRASS }}>The Pro edit of it</span>
                </Mono>
                <Phone>
                  <Clip src={S("pro-edit-v1.mp4")} poster={S("pro-edit-v1.jpg")} label="the Pro edit" eager />
                </Phone>
              </div>
            </div>
            <figcaption className="mt-4 text-right">
              <Mono className="text-[rgba(242,232,213,0.65)]">Turn the sound on: the voice and the music are its mix</Mono>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 002. WHAT IT DOES TO YOUR CLIP: six cards, five of them frames of that edit. */}
      <section aria-labelledby="vep-does">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <Heading id="vep-does" n="002" caps="What it does" serifLine="to your clip." />
            <p className="max-w-[38ch] text-pretty text-[1.12rem] font-medium leading-[1.5] text-[rgba(20,24,31,0.66)] md:pb-3">
              What an editor in Premiere would do. Every picture here is a frame of the edit above.
            </p>
          </div>
          <ol className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-5">
            {DOES.map((d) => (
              <li key={d.n} className="flex flex-col overflow-hidden rounded-[1.5rem]" style={{ background: d.img ? "#FFFFFF" : NAVY, color: d.img ? INK : CREAM }}>
                <div className="px-6 pb-5 pt-6 sm:px-7">
                  <Mono className="opacity-60">{d.n}</Mono>
                  <h3 className="mt-2 font-[family-name:var(--vep-archivo)] text-[1.9rem] font-black uppercase leading-[0.95] tracking-[-0.02em] [font-variation-settings:'wdth'_74]">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-pretty text-[1.02rem] leading-[1.45] opacity-80">{d.text}</p>
                </div>
                {d.img ? (
                  <div className="relative mt-auto aspect-square overflow-hidden sm:aspect-[4/5]">
                    <Image src={S(d.img)} alt={d.alt ?? ""} fill unoptimized sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  </div>
                ) : (
                  <ul className="mt-auto list-none border-t border-[rgba(242,232,213,0.16)] px-6 pb-7 pt-3 sm:px-7">
                    {d.list?.map((l) => (
                      <li key={l} className="border-b border-[rgba(242,232,213,0.12)] py-3 font-[family-name:var(--vep-mono)] text-[0.88rem] leading-[1.4] last:border-b-0">
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

      {/* 003. YOU APPROVE FIRST, THEN ONE SENTENCE CHANGES IT. */}
      <section aria-labelledby="vep-approve" style={{ background: NAVY, color: CREAM }}>
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Heading id="vep-approve" n="003" caps="You approve" serifLine="before it renders." dark />
              <p className="mt-6 max-w-[42ch] text-pretty text-[1.1rem] leading-[1.55] text-[rgba(242,232,213,0.78)]">
                One page in your browser, once per video. Then it renders and checks its own frames before you see them.
              </p>
              <ul className="mt-8 list-none border-b border-[rgba(242,232,213,0.16)] p-0">
                {[
                  "A before and after frame for every change",
                  "Everything it cut, line by line",
                  "Your raw mic against the finished sound",
                  "Where Instagram, TikTok and Shorts put their buttons",
                  "Notes on anything, then Approve and render",
                ].map((l) => (
                  <li key={l} className="flex gap-4 border-t border-[rgba(242,232,213,0.16)] py-4 text-[1.05rem] leading-[1.4]">
                    <span style={{ color: BRASS }} aria-hidden>
                      ✓
                    </span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Mono className="opacity-60">Then</Mono>
              <h3 className="mt-3 font-[family-name:var(--vep-serif)] text-[clamp(2.2rem,4.6vw,3.6rem)] italic leading-[1] tracking-[-0.01em]" style={{ color: BRASS }}>
                one sentence changes it.
              </h3>
              <ul className="mt-8 list-none p-0">
                {SAY.map(([said, what]) => (
                  <li key={said} className="grid grid-cols-1 gap-1 border-t border-[rgba(242,232,213,0.16)] py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
                    <span className="font-[family-name:var(--vep-mono)] text-[1rem] font-semibold">&ldquo;{said}&rdquo;</span>
                    <span className="text-[1rem] leading-[1.4] text-[rgba(242,232,213,0.72)]">{what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 004. WHAT'S INSIDE, in numbers, with two more of its effects. */}
      <section aria-labelledby="vep-inside">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <Heading id="vep-inside" n="004" caps="What's inside" serifLine="one skill." />
            <p className="max-w-[38ch] text-pretty text-[1.12rem] font-medium leading-[1.5] text-[rgba(20,24,31,0.66)] md:pb-3">
              Restrained by default: cut, colour, captions, music. The rest only where you say it.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-[rgba(20,24,31,0.12)] sm:grid-cols-4">
              {INSIDE.map(([k, v]) => (
                <div key={v} className="bg-white px-5 py-6">
                  <dt className="font-[family-name:var(--vep-archivo)] text-[3rem] font-black leading-none tracking-[-0.03em] [font-variation-settings:'wdth'_80]" style={{ color: NAVY }}>
                    {k}
                  </dt>
                  <dd className="m-0 mt-2 text-pretty text-[0.95rem] leading-[1.35] text-[rgba(20,24,31,0.7)]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: "comment-v1.jpg", name: "Comment reply", alt: "A comment card reading “editing” and the reply “sending it through”, under the caption." },
                { img: "timeline-v1.jpg", name: "Editor timeline", alt: "An editing timeline with thumbnails and a waveform, low on the frame." },
              ].map((e) => (
                <figure key={e.img} className="m-0 overflow-hidden rounded-[1.5rem] bg-white">
                  <div className="relative aspect-[9/14]">
                    <Image src={S(e.img)} alt={e.alt} fill unoptimized sizes="(min-width: 1024px) 18vw, 50vw" className="object-cover object-bottom" />
                  </div>
                  <figcaption className="px-4 py-3">
                    <Mono className="opacity-70">Effect · {e.name}</Mono>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 005. THE SAME CLIP THREE WAYS, and the difference. */}
      <section aria-labelledby="vep-three" className="border-t border-[rgba(20,24,31,0.1)]">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <Heading id="vep-three" n="005" caps="Same clip," serifLine="three ways." />
          <ul className="mt-12 grid list-none grid-cols-3 gap-3 p-0 sm:gap-6 md:mt-16 lg:max-w-[60rem]">
            {THREE.map((c) => (
              <li key={c.label} className="flex flex-col">
                <Phone>
                  <Clip src={c.src} poster={c.poster} label={c.label} quiet={c.quiet} />
                </Phone>
                <p className="mt-3 text-[0.98rem] font-bold leading-[1.2] sm:text-[1.1rem]">{c.label}</p>
                <p className="mt-1 text-[0.85rem] leading-[1.35] text-[rgba(20,24,31,0.62)] sm:text-[0.95rem]">{c.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[24%] pb-4 sm:w-[22%]" />
                  <th className="pb-4 text-[1rem] font-bold">
                    Video Editor <span className="font-normal text-[rgba(20,24,31,0.55)]">· free</span>
                  </th>
                  <th className="pb-4 text-[1rem] font-bold" style={{ color: NAVY }}>
                    Video Editor Pro <span className="font-normal text-[rgba(20,24,31,0.55)]">· {PRODUCT.priceLabel}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, a, b]) => (
                  <tr key={k} className="border-t border-[rgba(20,24,31,0.12)]">
                    <th className="py-4 pr-3 align-top font-[family-name:var(--vep-mono)] text-[0.68rem] sm:pr-4 sm:text-[0.78rem] font-normal uppercase tracking-[0.06em] text-[rgba(20,24,31,0.55)]">{k}</th>
                    <td className="py-4 pr-3 align-top text-[0.9rem] leading-[1.4] text-[rgba(20,24,31,0.7)] sm:pr-6 sm:text-[1rem]">{a}</td>
                    <td className="py-4 align-top text-[0.9rem] font-semibold leading-[1.4] sm:text-[1rem]">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[0.98rem] text-[rgba(20,24,31,0.62)]">
            Making videos from scratch, with no footage? That&rsquo;s the free{" "}
            <a href={VIDEO_EDITOR.href} className="font-semibold text-[#14181F] underline decoration-[rgba(20,24,31,0.3)] underline-offset-4">
              Video Editor
            </a>
            , and both work side by side.
          </p>
        </div>
      </section>

      {/* 006. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="vep-close-title" className="scroll-mt-28" style={{ background: NAVY, color: CREAM }}>
        <div className="mx-auto max-w-[90rem] px-5 pb-28 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <Heading id="vep-close-title" n="006" caps="Film it." serifLine="It edits. You post." dark />
            <div className="self-end">
              <ol className="list-none border-b border-[rgba(242,232,213,0.16)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[rgba(242,232,213,0.16)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--vep-mono)] text-[0.95rem] font-bold" style={{ color: BRASS }}>
                      {i + 1}
                    </span>
                    <span className="text-[rgba(242,232,213,0.85)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <Buy />
                <p className="mt-4 max-w-[48ch] text-pretty text-[0.95rem] leading-[1.5] text-[rgba(242,232,213,0.7)]">
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
        note={SOON ? "Checkout opens soon" : "Instant download"}
        soon={SOON}
        buttonClassName={BUTTON_INK}
      />
    </main>
  );
}
