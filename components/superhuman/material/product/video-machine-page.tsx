import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { VIDEO_MACHINE as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { VideoIntro } from "./video-machine-intro";
import { C, SIX, TRACKS } from "./video-machine-bits";

/**
 * VIDEO MACHINE: 20 video skills packed into one AI editor for Claude Code.
 *
 * VIRAL MACHINE'S FORMAT (Tobia's call): an opening, the name and the button,
 * what's inside, what it does, the proof, and the close. Given away for an
 * email (free-claim.tsx): the download link arrives in the inbox and the
 * address lands in the leads sheet.
 *
 * THE MOOD, in his words: "these are 20 skills packaged into one. That is
 * basically an AI editor. Never hire an editor or use software again." So the
 * page speaks the edit suite's own language (an app collapsing into one
 * sentence, the skills as clips on a timeline, a render bar) and no mascots.
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
  const launch = RESULTS[0];
  return (
    <main className="vd-page relative overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <VideoIntro poster={launch.poster} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. THE NAME, THE PROMISE, THE BUTTON, AND A REAL RENDER. */}
      <section aria-labelledby="vd-title" className="relative">
        <div className="mx-auto flex max-w-[72rem] flex-col items-center px-5 pb-20 pt-28 text-center sm:px-8 md:pt-32">
          <p className="vd-rise flex flex-wrap items-center justify-center gap-2" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="rounded-full bg-[#16171B] px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em] text-white">
              20 skills · 1 AI editor
            </span>
            <span className="rounded-full border border-[var(--hairline)] bg-white px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em]">
              for Claude Code
            </span>
          </p>
          <h1
            id="vd-title"
            className="vd-rise mt-8 text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.055em]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Video Machine
          </h1>
          <p
            className="vd-rise mt-7 text-center text-[1.08rem] font-medium leading-[1.45] text-[color:rgba(11,31,58,0.78)] sm:text-[1.3rem] md:text-[1.45rem]"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <span className="block">20 video skills, packed into one AI editor.</span>
            <span className="block font-bold text-[var(--ink)]">Never hire an editor or open editing software again.</span>
          </p>
          <div id="claim" className="vd-rise mt-9 flex w-full justify-center scroll-mt-28" style={{ "--i": 3 } as React.CSSProperties}>
            <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ink" />
          </div>
          <div id={HERO_ID} aria-hidden className="h-px" />

          {/* The proof, straight away: a real render, and the sentence that made it. */}
          <figure className="vd-rise mt-14 w-full max-w-[60rem] md:mt-16" style={{ "--i": 4 } as React.CSSProperties}>
            <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-[#16171B] bg-[#16171B] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.6)]">
              <Film src={launch.src} poster={launch.poster} ratio={launch.ratio} />
              <div className="flex items-center gap-3 px-3 pb-1 pt-3 text-left text-white">
                <span className="vd-done grid size-6 shrink-0 place-items-center rounded-full bg-[#19B47D] text-[0.8rem] font-black text-[#032417]" aria-hidden>
                  ✓
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-[0.85rem] text-white/80 sm:text-[0.92rem]">
                  &gt; {launch.say}
                </span>
              </div>
            </div>
            <figcaption className={`mt-4 text-center text-[0.95rem] leading-[1.5] ${MUTED}`}>
              Not a mockup. Video Machine made this from the one sentence under it.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. WHAT'S IN THE BOX: the 20 skills as clips on a timeline. */}
      <section aria-labelledby="vd-inside" className="relative">
        <div className="mx-auto max-w-[72rem] px-4 pb-24 pt-4 sm:px-8 md:pb-32">
          <h2
            id="vd-inside"
            className="mx-auto max-w-[15ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            20 skills on one timeline.
          </h2>
          <p className={`mx-auto mt-5 max-w-[46ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            A whole edit suite, packed into one install. You never pick between them: say what the video is for, and Claude
            reaches for the right ones.
          </p>
          <div className="vd-tl mt-12 overflow-hidden rounded-[1.6rem] bg-[#141518] p-3 text-white shadow-[0_40px_80px_-44px_rgba(11,31,58,0.7)] sm:p-4">
            <div className="flex items-center justify-between px-2 pb-3 font-mono text-[0.78rem] text-white/45">
              <span>video-machine · 20 skills</span>
              <span className="tabular-nums">00:00:00:00</span>
            </div>
            <div className="relative space-y-2">
              {TRACKS.map((t) => {
                const c = C[t.key];
                return (
                  <div key={t.id} className="grid grid-cols-[4.2rem_1fr] items-stretch gap-2 sm:grid-cols-[8.5rem_1fr]">
                    <div className="flex flex-col justify-center rounded-lg bg-white/[0.06] px-2.5 py-2">
                      <span className="font-mono text-[0.75rem] text-white/45">{t.id}</span>
                      <span className="hidden text-[0.88rem] font-bold leading-tight sm:block">{t.name}</span>
                    </div>
                    <ul className="grid list-none grid-cols-2 gap-1.5 p-0 sm:grid-cols-12">
                      {t.clips.map(([name, w], i) => (
                        <li
                          key={name}
                          className="vd-clip flex min-h-[3.1rem] items-end rounded-lg px-2.5 py-2 text-[0.82rem] font-bold leading-[1.15] sm:text-[0.88rem]"
                          style={
                            {
                              "--w": w,
                              "--i": i,
                              background: i % 2 ? `color-mix(in srgb, ${c.bg} 78%, white)` : c.bg,
                              color: c.fg,
                            } as React.CSSProperties
                          }
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <span className="vd-tl__head" aria-hidden />
            </div>
          </div>
          <p className={`mx-auto mt-6 max-w-[52ch] text-balance text-center text-[0.95rem] leading-[1.5] ${MUTED}`}>
            Music, sound effects, logos, voiceover and colour grades too: it finds them, or makes them, and keeps them for the
            next video.
          </p>
          <p className={`mx-auto mt-3 max-w-[56ch] text-balance text-center text-[0.85rem] leading-[1.5] ${MUTED}`}>
            Built on{" "}
            <a href="https://github.com/heygen-com/hyperframes" className="underline decoration-1 underline-offset-2" rel="noopener">
              HyperFrames
            </a>
            , HeyGen&rsquo;s open-source video engine: fourteen of the skills are theirs, installed fresh at setup. Six are
            Video Machine&rsquo;s own.
          </p>
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

      {/* 4. WHAT IT DOES: the six, each with the sentence you'd type. */}
      <section aria-labelledby="vd-does" className="relative">
        <div className="mx-auto max-w-[76rem] px-4 pb-24 sm:px-8 md:pb-32">
          <h2
            id="vd-does"
            className="mx-auto max-w-[15ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            Everything an editor does.
          </h2>
          <p className={`mx-auto mt-5 max-w-[40ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            The whole interface is a sentence. Here are six.
          </p>
          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 md:mt-16 lg:grid-cols-3">
            {SIX.map((s) => (
              <li key={s.key} className="flex flex-col rounded-[2rem] p-7 sm:p-8" style={{ background: s.bg, color: s.fg }}>
                <p className="text-[0.95rem] font-bold opacity-75">{s.sticker}</p>
                <h3 className="mt-3 text-balance text-[clamp(1.8rem,3.2vw,2.3rem)] font-extrabold leading-[1] tracking-[-0.04em]">
                  {s.title}
                </h3>
                <p className="mt-4 flex-1 text-pretty text-[1.04rem] font-medium leading-[1.5] opacity-90">{s.text}</p>
                <div className="mt-6">
                  <Said dark={s.key === "montage"}>{s.say}</Said>
                </div>
              </li>
            ))}
          </ul>
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
            One sentence in. These out.
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
                Fire the timeline.
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
