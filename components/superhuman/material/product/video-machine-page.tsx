import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { VIDEO_MACHINE as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { SIX } from "./video-machine-bits";
import { ClipCompare } from "./video-machine-compare";
import { VideoLoader } from "./video-machine-loader";

/**
 * VIDEO MACHINE: 20 video skills packed into one AI editor for Claude Code.
 *
 * VIRAL MACHINE'S FORMAT (Tobia's call): an opening, the name and the button,
 * what's inside, what it does, the proof, and the close. Given away for an
 * email (free-claim.tsx): the download link arrives in the inbox and the
 * address lands in the leads sheet.
 *
 * THE MOOD, in his words: "these are 20 skills packaged into one. That is
 * basically an AI editor. Never hire an editor or use software again." No
 * mascots and no graphics (his calls, 2026-10-20 and -21): the page is clean,
 * and it sells with a video. Two sentences open it ("It has never been
 * easier to run your personal brand. You can now edit videos with Claude
 * Code."), then his own raw clip against the edit the pack made of it. The
 * hook is his: that clip got no prompt. He said each edit on camera, and
 * Claude made it on the word.
 *
 * EVERY VIDEO ON THE PAGE IS REAL: rendered with this pack from the one
 * sentence printed next to it (public/shop/video-machine/). Nothing drawn
 * pretends to be a result.
 */

const HERO_ID = "buy";
const CLOSE_ID = "vd-close";
const BUTTON = "bg-[#16171B] text-white shadow-[0_18px_40px_-18px_rgba(22,23,27,0.7)] hover:bg-black";
const MUTED = "text-[color:rgba(11,31,58,0.62)]";
const DIR = "/shop/video-machine";

/** THE OPENING: his raw iPhone clip, and the pack's edit of it. */
const TALK = {
  before: `${DIR}/talk-before.mp4`,
  after: `${DIR}/talk-after.mp4`,
  beforePoster: `${DIR}/talk-before.jpg`,
  afterPoster: `${DIR}/talk-after.jpg`,
};

/** The four things he said on camera, and what Claude did with each. */
const MOMENTS = [
  { id: "zoom", at: "0:06", said: "Zoom into closer.", did: "It pushed in on my face, then eased back out." },
  { id: "italic", at: "0:10", said: "Big text, italics.", did: "The words came up in italics, one by one, as I said them." },
  { id: "warm", at: "0:13", said: "Warmer, lighter, into my face.", did: "A soft, warm light on my face, kept to the end." },
  { id: "captions", at: "0:29", said: "Just comment the word editing.", did: "Captions all the way through, and that word as the call to action." },
] as const;

/** Hides the loader before first paint when it already played this visit. */
const SEEN = `try{if(sessionStorage.getItem("vd-seen")){var s=document.createElement("style");s.textContent=".vd-load{display:none}:root{--vd-wait:0s!important}";document.head.appendChild(s)}sessionStorage.setItem("vd-seen","1")}catch(e){}`;

/**
 * THE RESULTS: each made by the pack from the sentence beside it. `minutes`
 * is the wall-clock time from the sentence to the finished file.
 */
const RESULTS = [
  {
    id: "launch",
    src: `${DIR}/launch.mp4`,
    poster: `${DIR}/launch.jpg`,
    ratio: "16 / 9",
    say: "Make a 20-second launch video for tobiadonadon.com/projects/construct/material/skills/viral-machine",
    what: "Launch video, from a link",
    minutes: 22,
  },
  {
    id: "explainer",
    src: `${DIR}/explainer.mp4`,
    poster: `${DIR}/explainer.jpg`,
    ratio: "9 / 16",
    say: "Make a 30-second explainer: what actually pushes a post on X, from X's own open-sourced ranking code.",
    what: "Explainer with voiceover and captions",
    minutes: 18,
  },
  {
    id: "stat",
    src: `${DIR}/stat.mp4`,
    poster: `${DIR}/stat.jpg`,
    ratio: "9 / 16",
    say: "Make an 8-second animated stat for X: my last 4 weeks, 1.5M impressions, 16.9K bookmarks, up 63,000% on the month before.",
    what: "Motion graphic, from three numbers",
    minutes: 7,
  },
] as const;

const STEPS: React.ReactNode[] = [
  <>Leave your email. The download link is in your inbox a minute later.</>,
  <>
    Unzip it, open a terminal in the folder, type <code className="font-semibold text-[var(--ink)]">claude</code>, then{" "}
    <q className="font-semibold text-[var(--ink)]">hi</q>. It installs all 20 skills.
  </>,
  <>Say what the video is for. Watch the render. Say what to change.</>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Claude Code",
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

/** A real render: muted, looping, inline, with its poster until it plays. */
function Film({ src, poster, ratio, className = "" }: { src: string; poster: string; ratio: string; className?: string }) {
  return (
    <video
      className={`block h-auto w-full bg-[#0f1012] ${className}`}
      style={{ aspectRatio: ratio }}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

/** The sentence that made it, set like a prompt. */
function Said({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`flex items-start gap-2.5 rounded-[1rem] px-4 py-3 font-mono text-[0.92rem] leading-[1.45] ${
        dark ? "bg-white/10 text-white" : "bg-[#16171B] text-white"
      }`}
    >
      <span className="select-none opacity-50" aria-hidden>
        &gt;
      </span>
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */

export function VideoMachinePage() {
  return (
    <main className="vd-page relative overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script dangerouslySetInnerHTML={{ __html: SEEN }} />
      <VideoLoader />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. THE NAME, THE PROMISE, THE BUTTON, AND THE BEFORE AND AFTER. */}
      <section aria-labelledby="vd-title" className="relative">
        <div className="mx-auto grid max-w-[76rem] grid-cols-1 items-center gap-14 px-5 pb-24 pt-28 sm:px-8 md:pt-32 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <p className="vd-rise flex flex-wrap items-center justify-center gap-2" style={{ "--i": 0 } as React.CSSProperties}>
              <span className="rounded-full bg-[#16171B] px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em] text-white">
                Video Machine
              </span>
              <span className="rounded-full border border-[var(--hairline)] bg-white px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em]">
                Free for Claude Code
              </span>
            </p>
            <h1
              id="vd-title"
              className="vd-rise mt-8 max-w-[12ch] text-balance text-[clamp(3rem,8.4vw,6.4rem)] font-extrabold leading-[0.9] tracking-[-0.055em]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Edit videos with Claude Code.
            </h1>
            <p
              className="vd-rise mt-7 max-w-[36ch] text-balance text-center text-[1.08rem] font-medium leading-[1.45] text-[color:rgba(11,31,58,0.75)] sm:text-[1.25rem]"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              One prompt, and it cuts, zooms, titles, colours and captions.{" "}
              <span className="font-bold text-[var(--ink)]">
                This video didn&rsquo;t even get one: I said the edits out loud while filming, and Claude made them.
              </span>
            </p>
            <div id="claim" className="vd-rise mt-9 flex w-full justify-center scroll-mt-28" style={{ "--i": 3 } as React.CSSProperties}>
              <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ink" />
            </div>
            <p className={`vd-rise mt-4 text-[0.9rem] font-medium ${MUTED}`} style={{ "--i": 4 } as React.CSSProperties}>
              20 video skills in one · Runs on your computer
            </p>
            <div id={HERO_ID} aria-hidden className="h-px" />
          </div>

          {/* The proof, straight away: the same clip, raw and edited. */}
          <figure className="vd-rise mx-auto w-full max-w-[24rem]" style={{ "--i": 2 } as React.CSSProperties}>
            <ClipCompare {...TALK} />
            <figcaption className={`mt-4 text-pretty text-center text-[0.95rem] leading-[1.5] ${MUTED}`}>
              My raw iPhone clip, and Claude&rsquo;s edit. Drag to compare.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. NO PROMPT: what he said on camera, and what Claude did with it. */}
      <section aria-labelledby="vd-said" className="relative">
        <div className="mx-auto max-w-[76rem] px-4 pb-24 pt-4 sm:px-8 md:pb-32">
          <h2
            id="vd-said"
            className="mx-auto max-w-[14ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            I didn&rsquo;t type a prompt. I just said it.
          </h2>
          <p className={`mx-auto mt-5 max-w-[44ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            Claude listened to the clip, found every edit I asked for and made each one on the word. About 12 minutes. No
            editor, no timeline.
          </p>
          <ol className="mt-12 grid list-none grid-cols-2 gap-x-4 gap-y-10 p-0 md:mt-16 lg:grid-cols-4 lg:gap-x-6">
            {MOMENTS.map((m) => (
              <li key={m.id} className="flex flex-col">
                <div className="relative overflow-hidden rounded-[1.2rem] bg-[#0f1012]">
                  <Image
                    src={`${DIR}/talk-${m.id}.jpg`}
                    alt=""
                    width={540}
                    height={960}
                    sizes="(min-width: 1024px) 17rem, 50vw"
                    className="block aspect-[9/16] h-auto w-full object-cover"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[0.75rem] font-semibold text-white backdrop-blur-md">
                    {m.at}
                  </span>
                </div>
                <p className="mt-4 text-pretty text-[1.1rem] font-bold leading-[1.3] tracking-[-0.01em] sm:text-[1.2rem]">
                  &ldquo;{m.said}&rdquo;
                </p>
                <p className={`mt-1.5 text-pretty text-[0.98rem] leading-[1.45] ${MUTED}`}>{m.did}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. EDITOR VS SOFTWARE VS THIS. */}
      <section aria-labelledby="vd-instead" className="relative">
        <div className="mx-auto max-w-[72rem] px-4 pb-24 sm:px-8 md:pb-32">
          <h2
            id="vd-instead"
            className="mx-auto max-w-[16ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            Instead of an editor. Instead of the software.
          </h2>
          <ul className="mt-12 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3 md:gap-4">
            {[
              { who: "An editor", lines: ["Paid per video", "Days of back and forth", "Booked when you need them most"], strike: true },
              { who: "Editing software", lines: ["A subscription every month", "Weeks to learn", "Hours on a timeline per video"], strike: true },
              { who: "Video Machine", lines: ["Free", "One sentence per video", "Change it by saying so"], strike: false },
            ].map((col) => (
              <li
                key={col.who}
                className={`rounded-[1.6rem] p-6 sm:p-7 ${col.strike ? "border border-[var(--hairline)] bg-white" : "bg-[#16171B] text-white"}`}
              >
                <p className={`text-[1.5rem] font-extrabold tracking-[-0.03em] ${col.strike ? "text-black/40" : ""}`}>{col.who}</p>
                <ul className="mt-4 list-none space-y-2.5 p-0">
                  {col.lines.map((l) => (
                    <li key={l} className="flex items-center gap-3 text-[1.08rem] font-semibold">
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] font-black ${
                          col.strike ? "bg-black/[0.07] text-black/40" : "bg-[#19B47D] text-[#032417]"
                        }`}
                        aria-hidden
                      >
                        {col.strike ? "✕" : "✓"}
                      </span>
                      <span className={col.strike ? "text-black/45 line-through decoration-black/25 decoration-2" : ""}>{l}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. WHAT ELSE IT DOES: the six, each with the sentence you'd type. */}
      <section aria-labelledby="vd-does" className="relative">
        <div className="mx-auto max-w-[76rem] px-4 pb-24 sm:px-8 md:pb-32">
          <h2
            id="vd-does"
            className="mx-auto max-w-[15ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            Everything an editor does.
          </h2>
          <p className={`mx-auto mt-5 max-w-[40ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            Talking or typing, the whole interface is a sentence. Here are six.
          </p>
          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 md:mt-16 lg:grid-cols-3">
            {SIX.map((s) => (
              <li key={s.key} className="flex flex-col rounded-[1.6rem] border border-[var(--hairline)] bg-white p-7 sm:p-8">
                <p className={`text-[0.95rem] font-bold ${MUTED}`}>{s.sticker}</p>
                <h3 className="mt-3 text-balance text-[clamp(1.6rem,2.8vw,2rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                  {s.title}
                </h3>
                <p className={`mt-4 flex-1 text-pretty text-[1.02rem] font-medium leading-[1.5] ${MUTED}`}>{s.text}</p>
                <div className="mt-6">
                  <Said>{s.say}</Said>
                </div>
              </li>
            ))}
          </ul>
          <p className={`mx-auto mt-10 max-w-[60ch] text-balance text-center text-[0.95rem] leading-[1.55] ${MUTED}`}>
            20 skills inside: talking-head edits, reel captions, launch videos, explainers, motion graphics, camera moves,
            title cards, colour grades, music and sound, AI clips cut into one film, and the engine that renders them.
            Built on{" "}
            <a href="https://github.com/heygen-com/hyperframes" className="underline decoration-1 underline-offset-2" rel="noopener">
              HyperFrames
            </a>
            , HeyGen&rsquo;s open-source video engine: fourteen of the skills are theirs, installed fresh at setup. Six are
            Video Machine&rsquo;s own.
          </p>
        </div>
      </section>

      {/* 5. THE RESULTS: real renders, each with the sentence that made it. */}
      <section aria-labelledby="vd-made" className="relative bg-[#141518] text-white">
        <div className="mx-auto max-w-[76rem] px-4 py-24 sm:px-8 md:py-32">
          <p className="text-center">
            <span className="inline-block rounded-full bg-white px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em] text-[#16171B]">
              Made with Video Machine
            </span>
          </p>
          <h2
            id="vd-made"
            className="mx-auto mt-6 max-w-[14ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            One prompt in. These out.
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] text-white/65">
            Claude made each of these with the pack, from the sentence under it: it planned the video, built it, checked its
            own frames and rendered it. Nobody opened an editor.
          </p>
          <ul className="mt-14 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-[1fr_1fr] lg:gap-6">
            {RESULTS.map((r, i) => (
              <li key={r.id} className={`flex flex-col gap-4 ${i === 0 ? "md:col-span-2" : ""}`}>
                <div
                  className={`overflow-hidden rounded-[1.4rem] border border-white/10 ${i === 0 ? "" : "mx-auto w-full max-w-[22rem]"}`}
                >
                  <Film src={r.src} poster={r.poster} ratio={r.ratio} />
                </div>
                <div className={i === 0 ? "" : "mx-auto w-full max-w-[22rem]"}>
                  <p className="text-[1.05rem] font-bold">
                    {r.what}
                    {r.minutes > 0 && <span className="font-medium text-white/55"> · {r.minutes} minutes</span>}
                  </p>
                  <div className="mt-2">
                    <Said dark>{r.say}</Said>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="vd-close-title" className="scroll-mt-28">
        <div className="mx-auto max-w-[72rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2
                id="vd-close-title"
                className="max-w-[13ch] text-balance text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
              >
                Your next video is one sentence away.
              </h2>
              <p className="mt-6 max-w-[38ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-[color:rgba(11,31,58,0.72)]">
                20 skills that would take an editor years to learn, packed into one AI editor that lives in Claude Code and
                works on your computer. Your reels, your launches, your explainers: you say what each one is for, it does the
                rest.
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
