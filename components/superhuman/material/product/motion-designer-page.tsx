import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { MOTION_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { Film } from "./motion-designer-film";
import { MotionDesignerIntro } from "./motion-designer-intro";
import { SoundtrackWave } from "./motion-designer-wave";

/**
 * MOTION DESIGNER: motion graphics from one sentence, given away for an email.
 *
 * WEB DESIGNER PRO'S PAGE, IN ITS OWN COLOUR (Tobia's call): the opening, a
 * poster hero (a full-bleed field, the name huge in wide black type, one real
 * object over it, mono labels in the margins, pins), the work, six tiles,
 * the close, the sticky bar. The field is the orange of the skill's own
 * storyboard page; the tiles borrow Pro's cobalt, lime and pink.
 *
 * THE OPENING (motion-designer-intro.tsx) is one of the skill's own videos:
 * three Kinetic beats, Describe. Approve. Render., with a timeline under them.
 *
 * EVERY FILM ON THE PAGE IS REAL: made with the skill, one about each of
 * Tobia's own products, from his site's images and their pages' claims (the
 * 98¢ Trade's numbers are its published backtest). The hero reel is cut from
 * those seven. The storyboard is a still of the real page. The
 * devices, the three formats, the type before/after and the waveform are all
 * renders from the skill or its data, nothing drawn to look like a result.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--mdx-archivo", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--mdx-mono", display: "swap" });

const HERO_ID = "claim";
const CLOSE_ID = "mdx-close";
const S = (name: string) => `/shop/motion-designer/${name}`;

const ORANGE = "#FF5A1F";
const COBALT = "#1F3AD6";
const LIME = "#E7F04F";
const PINK = "#F6B6C8";
const INK = "#111111";
const MUTED = "text-[color:rgba(17,17,17,0.64)]";
const BUTTON = "bg-[#111111] text-white shadow-[0_18px_40px_-18px_rgba(17,17,17,0.7)] hover:bg-black";

/** The Studio Display the reel plays on: the skill's own photographed frame and its measured screen. */
const DISPLAY = { src: S("display-v1.webp"), w: 1240, h: 929, x: 3.629, y: 4.952, sw: 92.661, sh: 67.6 };

const STEPS: React.ReactNode[] = [
  <>Unzip the folder.</>,
  <>
    Open it in Claude Code or Codex and type <q className="font-semibold text-[#111]">hi</q>. It installs in a minute
    and makes a test video.
  </>,
  <>Say what the video is for. Check the storyboard. Approve.</>,
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
    <span className={`font-[family-name:var(--mdx-mono)] text-[0.72rem] uppercase tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}

/** A photographed device with something playing in its screen. */
function Device({ d, children, className = "" }: { d: typeof DISPLAY; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${d.w} / ${d.h}` }}>
      {/* black under the bezel's inner edge: scaled down, its soft edge would let the page colour through */}
      <div
        aria-hidden
        className="absolute bg-black"
        style={{ left: `${d.x - 0.8}%`, top: `${d.y - 1}%`, width: `${d.sw + 1.6}%`, height: `${d.sh + 2}%` }}
      />
      <div
        className="absolute overflow-hidden bg-black"
        style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.sw}%`, height: `${d.sh}%` }}
      >
        {children}
      </div>
      <Image src={d.src} alt="" width={d.w} height={d.h} unoptimized className="pointer-events-none absolute inset-0 h-full w-full select-none" />
    </div>
  );
}

/** THE SEVEN, each a film the skill made about one of Tobia's products. */
const STYLES = [
  { n: "01", style: "Keynote", about: "App Designer", best: "Apps & SaaS with screens", id: "keynote", bg: COBALT, fg: "#fff" },
  { n: "02", style: "Aura", about: "Web Designer Pro", best: "AI, fintech, calm premium", id: "aura", bg: PINK, fg: INK },
  { n: "03", style: "Paper", about: "App Launcher", best: "Consumer apps, explainers", id: "paper", bg: LIME, fg: INK },
  { n: "04", style: "Terminal", about: "Video Editor", best: "Dev tools, CLIs, agents", id: "terminal", bg: INK, fg: "#fff" },
  { n: "05", style: "Data", about: "The 98¢ Trade", best: "Results, reports, numbers", id: "data", bg: "#FFFFFF", fg: INK },
  { n: "06", style: "Story", about: "Motion Designer", best: "People, a moment, a turn", id: "story", bg: "#F7B500", fg: INK },
] as const;

/** One of the six, as a tile in its own colour: the claim, then the proof (Pro's tiles). */
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
        <h3 className="mt-3 max-w-[16ch] text-balance font-[family-name:var(--mdx-archivo)] text-[clamp(2.1rem,4.6vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] [font-variation-settings:'wdth'_70]">
          {title}
        </h3>
        <p className="mt-4 max-w-[44ch] text-pretty text-[1.06rem] font-medium leading-[1.5] opacity-90">{text}</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-8 sm:pb-8">{children}</div>
    </li>
  );
}

/** Tile 01: the sentence, and what it decided from it (the end-to-end test, 2026-10-23). */
function DecidedProof() {
  const chips = ["Kinetic", "16:9 for X", "22 s", "7 scenes", "EverMute's colours", "Bricolage type", "118 bpm"];
  return (
    <div className="w-full max-w-[32rem] rounded-[1.2rem] bg-[#111] p-5 text-left text-[#ECEAE3] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.6)] sm:p-6">
      <Mono className="text-[#ECEAE3]/60">What I typed</Mono>
      <p className="mt-3 font-[family-name:var(--mdx-mono)] text-[0.95rem] leading-[1.5]">
        <span className="text-[#FF5A1F]">&gt;</span> make me a launch video for EverMute, the app&rsquo;s in ~/Desktop/Evermute.
        it&rsquo;s for X
      </p>
      <Mono className="mt-5 block text-[#ECEAE3]/60">What it decided</Mono>
      <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
        {chips.map((c) => (
          <li key={c} className="rounded-full bg-white/10 px-3 py-1.5 text-[0.86rem] font-semibold">
            {c}
          </li>
        ))}
      </ul>
      <Mono className="mt-5 block text-[#ECEAE3]/60">Questions asked: 0 · finished in 5 min 10 s</Mono>
    </div>
  );
}

/** Tile 05: the same title rendered with and without the letter check. */
function TypeProof() {
  return (
    <div className="grid w-full max-w-[34rem] gap-3">
      {[
        { src: S("type-before-v2.webp"), label: "Without the check", alt: "Typography, gloriously right: the gradient word's g and y cut off flat at the bottom." },
        { src: S("type-after-v2.webp"), label: "With it", alt: "The same line with every g and y drawn whole." },
      ].map((p) => (
        <figure key={p.label} className="overflow-hidden rounded-[1rem] bg-black">
          <Image src={p.src} alt={p.alt} width={1357} height={172} unoptimized className="block h-auto w-full" />
          <figcaption className="px-4 py-2.5">
            <Mono className="text-white/80">{p.label}</Mono>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Tile 06: sentences that change the video. */
function RevisionsProof() {
  const said = ["make it 15 seconds", "calmer", "vertical for TikTok", "use my colours", "less sound", "swap scenes 2 and 3"];
  return (
    <ul className="flex w-full list-none flex-wrap gap-2.5 p-0">
      {said.map((s) => (
        <li key={s} className="rounded-full border-2 border-current px-4 py-2 font-[family-name:var(--mdx-mono)] text-[0.95rem] font-semibold">
          &ldquo;{s}&rdquo;
        </li>
      ))}
    </ul>
  );
}

export function MotionDesignerPage() {
  return (
    <main className={`mdx-page ${archivo.variable} ${mono.variable} relative overflow-x-clip bg-[#ECEAE3] text-[#111]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <MotionDesignerIntro />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 001. THE POSTER: the name, the reel on a Studio Display, the button. */}
      <section aria-labelledby="mdx-title" className="mdx-hero relative isolate overflow-hidden" style={{ background: ORANGE }}>
        <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_1fr_auto] px-5 pb-10 pt-24 sm:px-8 md:pt-28">
          <div className="mdx-in relative z-20 flex items-start justify-between gap-4" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono>
              Free<span className="hidden sm:inline"> · sent by email</span>
            </Mono>
            <Mono className="hidden text-center lg:block">Motion graphics from one sentence</Mono>
            <Mono className="text-right">
              <span className="hidden sm:inline">Skill for </span>Claude Code &amp; Codex
            </Mono>
          </div>

          <div className="relative z-10 pt-6 [@media(min-width:768px)_and_(min-aspect-ratio:1/1)]:pt-1">
            <h1 id="mdx-title" className="mdx-title font-[family-name:var(--mdx-archivo)] font-black uppercase leading-[0.8] tracking-[-0.035em]">
              <span className="block">Motion</span> <span className="block">Designer.</span>
            </h1>
          </div>

          <figure className="mdx-screen">
            <Device d={DISPLAY}>
              <Film
                src={S("reel-v2.mp4")}
                poster={S("reel-v2.jpg")}
                label="the reel of seven films the skill made"
                eager
                className="h-full w-full"
                buttonClassName="mdx-sound--screen"
              />
            </Device>
            <figcaption className="mt-2 text-center">
              <Mono>Seven films it made · one sentence each</Mono>
            </figcaption>
          </figure>

          <div className="mdx-bottom relative z-20 self-end pt-2">
            <div className="mdx-in" style={{ "--i": 1 } as React.CSSProperties}>
              <p className="max-w-[30ch] text-pretty text-[1.15rem] font-semibold leading-[1.4] text-[#111] sm:text-[1.3rem]">
                <span className="block text-[rgba(17,17,17,0.72)]">Say what the video is for.</span>
                <span className="block">Get the finished film.</span>
              </p>
              <div id={HERO_ID} className="mt-7 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ember" align="start" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 002. SEVEN STYLES: a film in each, about one of Tobia's products. */}
      <section aria-labelledby="mdx-styles" className="relative border-b border-black/10">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">002</Mono>
              <h2 id="mdx-styles" className="mt-3 max-w-[12ch] font-[family-name:var(--mdx-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                Seven <span className="block text-[#E2420C]">styles.</span>
              </h2>
            </div>
            <p className={`max-w-[40ch] text-pretty text-[1.12rem] font-medium leading-[1.5] md:pb-3 ${MUTED}`}>
              It picks the one that fits what you said. Every film here was made with the skill, each about one of my
              products.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:mt-16">
            {STYLES.map((s) => (
              <li key={s.id} className="flex flex-col rounded-[1.1rem] p-5 sm:p-6" style={{ background: s.bg, color: s.fg }}>
                <Mono className="opacity-70">{s.n}</Mono>
                <h3 className="mt-2 font-[family-name:var(--mdx-archivo)] text-[2.3rem] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_66]">
                  {s.style}
                </h3>
                <Mono className="mt-1.5 opacity-75">
                  {s.best} · about {s.about}
                </Mono>
                <div className="mt-6 flex-1" />
                <Film
                  src={S(`${s.id}-v2.mp4`)}
                  poster={S(`${s.id}-v2.jpg`)}
                  label={`the ${s.style} film, about ${s.about}`}
                  className="aspect-video overflow-hidden rounded-[0.9rem] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.55)]"
                />
              </li>
            ))}
          </ul>

          {/* The seventh, and the proof the level holds with nobody steering: one sentence, a fresh agent. */}
          <figure className="mt-3 grid grid-cols-1 items-center gap-6 rounded-[1.1rem] p-5 text-[#111] sm:p-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-10" style={{ background: ORANGE }}>
            <figcaption>
              <Mono className="opacity-75">07 · Kinetic · made on its own</Mono>
              <h3 className="mt-2 font-[family-name:var(--mdx-archivo)] text-[2.3rem] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_66]">
                EverMute
              </h3>
              <p className="mt-3 max-w-[36ch] text-pretty text-[1rem] font-semibold leading-[1.5]">
                One sentence, a fresh agent, no help. It found the app, took its colours and screens, and finished in five
                minutes.
              </p>
            </figcaption>
            <Film
              src={S("kinetic-v2.mp4")}
              poster={S("kinetic-v2.jpg")}
              label="the Kinetic film about EverMute"
              className="aspect-video overflow-hidden rounded-[0.9rem] shadow-[0_20px_40px_-30px_rgba(0,0,0,0.45)]"
            />
          </figure>
        </div>
      </section>

      {/* 003. THE PLAN FIRST: the storyboard, as you see it. */}
      <section aria-labelledby="mdx-plan" className="relative overflow-hidden bg-[#111] text-white">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <Mono className="opacity-60">003</Mono>
              <h2 id="mdx-plan" className="mt-3 max-w-[13ch] font-[family-name:var(--mdx-archivo)] text-[clamp(3rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] [font-variation-settings:'wdth'_68]">
                The plan <span className="block" style={{ color: ORANGE }}>plays first.</span>
              </h2>
            </div>
            <p className="max-w-[30ch] text-pretty text-[1.3rem] font-semibold leading-[1.4] text-white md:pb-3">
              You see the plan before it renders. <span style={{ color: ORANGE }}>Every choice is one tap.</span>
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-[68rem] md:mt-16">
            <Image
              src={S("storyboard-v1.jpg")}
              alt="The storyboard: the video playing on top, and under it what it decided, with the other styles one tap away and Approve and render."
              width={1280}
              height={800}
              unoptimized
              className="block h-auto w-full overflow-hidden rounded-[1.2rem]"
            />
          </div>
        </div>
      </section>

      {/* 004. WHAT YOU GET: six tiles. */}
      <section aria-labelledby="mdx-gets" className="relative">
        <div className="mx-auto max-w-[80rem] px-4 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="relative text-center">
            <Mono className="opacity-60">004</Mono>
            <h2 id="mdx-gets" className="mx-auto mt-3 max-w-[14ch] text-balance font-[family-name:var(--mdx-archivo)] text-[clamp(2.8rem,7.5vw,6.2rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]">
              Done for you.
            </h2>
            <p className={`mx-auto mt-5 max-w-[46ch] text-balance text-[1.08rem] font-medium leading-[1.5] ${MUTED}`}>
              A motion designer inside Claude Code. It decides, shows you, then makes it.
            </p>
          </div>

          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 lg:grid-cols-2">
            <Tile n="01" title="One sentence is enough." text="It picks the style, length, words, fonts and colours. No questionnaire." bg="#FFFFFF" fg={INK}>
              <DecidedProof />
            </Tile>

            <Tile n="02" title="Real hardware." text="Your screens on a real iPhone, MacBook, Studio Display or iPad." bg={INK} fg="#ffffff">
              <Image
                src={S("devices-v1.webp")}
                alt="A Studio Display, an iPad, a MacBook and an iPhone, each showing a real screen: an energy dashboard, a fashion page, an air monitor page and a running app."
                width={1877}
                height={1202}
                unoptimized
                className="block h-auto w-full max-w-[34rem]"
              />
            </Tile>

            <Tile n="03" title="Its own soundtrack." text="Music composed for every video, warm and on the beat. Nothing to license." bg={COBALT} fg="#ffffff" wide>
              <SoundtrackWave />
            </Tile>

            <Tile n="04" title="Every format." text="Landscape, vertical, square. One tap, and the layout rebuilds itself." bg={LIME} fg={INK}>
              <div className="flex w-full items-end justify-center gap-3">
                {[
                  { src: S("fmt-16x9-v1.webp"), w: 960, h: 540, k: "16:9", c: "w-[46%]" },
                  { src: S("fmt-9x16-v1.webp"), w: 540, h: 960, k: "9:16", c: "w-[20%]" },
                  { src: S("fmt-1x1-v1.webp"), w: 960, h: 960, k: "1:1", c: "w-[30%]" },
                ].map((f) => (
                  <figure key={f.k} className={f.c}>
                    <Image src={f.src} alt={`The same EverMute scene at ${f.k}.`} width={f.w} height={f.h} unoptimized className="block h-auto w-full rounded-[0.6rem] shadow-[0_18px_40px_-26px_rgba(0,0,0,0.6)]" />
                    <figcaption className="mt-2 text-center">
                      <Mono>{f.k}</Mono>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Tile>

            <Tile n="05" title="Nothing cut, nothing rushed." text="Every letter is measured before it renders, and every line stays up long enough to read." bg={ORANGE} fg={INK}>
              <TypeProof />
            </Tile>

            <Tile n="06" title="Change it in one sentence." text="Watch it, say what to change. It renders the new version in about a minute." bg={PINK} fg={INK} wide>
              <RevisionsProof />
            </Tile>
          </ul>
          <p className={`mx-auto mt-8 max-w-[56ch] text-balance text-center text-[0.98rem] leading-[1.5] ${MUTED}`}>
            Give it a link and it takes the screenshots, logo and colours from your site. Renders on your computer, on Mac,
            Windows or Linux.
          </p>
        </div>
      </section>

      {/* 005. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="mdx-close-title" className="scroll-mt-28 border-t border-black/10">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="opacity-60">005</Mono>
              <h2 id="mdx-close-title" className="mt-3 max-w-[11ch] font-[family-name:var(--mdx-archivo)] text-[clamp(2.8rem,7.5vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] [font-variation-settings:'wdth'_70]">
                Your launch <span className="text-[#E2420C]">deserves a film.</span>
              </h2>
              <p className={`mt-6 max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
                No After Effects, no editor, no stock music. A sentence, a look at the storyboard, and it&rsquo;s done.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-black/10 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-black/10 py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--mdx-mono)] text-[0.95rem] font-bold">{i + 1}</span>
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
