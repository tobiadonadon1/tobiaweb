import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { REEL_BOT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { COLORS, LEAD, botShape, type BotSpec } from "./grok-army-bots";
import { ReelBotLoader } from "./reel-bot-loader";
import { StickyBuy } from "./sticky-buy";

/**
 * REEL BOT, a free Grok Bot: one Markdown file (Tobia's pipeline) that a
 * Grok Bot works from to make animated vertical videos with Claude.
 *
 * GROK ARMY'S PAGE, WITH ONE BOT (Tobia's call, 2026-10-26): the same matte
 * black, Host Grotesk at 800 and the red word, but the opening is a single
 * bot, the metal disc, hopping onto GROK (reel-bot-loader.tsx). Then four
 * parts: what it is and the field, what it does from topic to file, what it
 * is good at and what to expect, how you get it.
 *
 * EVERY WORD COMES FROM THE FILE: the steps, the styles, the limits and the
 * times are the pipeline's own. Nothing invented: no sample videos (there are
 * none made with it on this site yet), no numbers it doesn't give.
 */

const HERO_ID = "claim";
const CLOSE_ID = "rb-close";

const BUTTON =
  "bg-[var(--ga-red-button)] text-white shadow-[0_18px_44px_-18px_rgba(253,66,57,0.7)] hover:bg-[var(--ga-red-button-hover)]";

/** Hide the opening on the way back: once a visit is enough. */
const SEEN = `try{if(sessionStorage.getItem("rb-seen")){var s=document.createElement("style");s.textContent=".rb-load{display:none}:root{--rb-wait:0s!important}";document.head.appendChild(s)}sessionStorage.setItem("rb-seen","1")}catch(e){}`;

/** The four facts under the field, each with a bot. */
const FACTS: [string, BotSpec][] = [
  ["1 file to Grok Bot", LEAD],
  ["20 to 70 s, vertical", { shape: "square", color: COLORS.blue }],
  ["Every frame drawn in code", { shape: "triangle", color: COLORS.orange }],
  ["Posts only with your OK", { shape: "diamond", color: COLORS.violet }],
];

/** The pipeline, as the file runs it. */
const PIPELINE: [string, string][] = [
  ["You pick a style and a topic.", "Painted noir, a papercraft story, a 2D explainer with a voice. One line is enough."],
  ["It writes the brief.", "Palette, characters, a shot list with timestamps, a twist and an ending, the sound, the quality bar."],
  ["It records the voice.", "If the video talks: a voiceover from ElevenLabs, with the timing of every word for the captions."],
  ["It hands the brief to Claude.", "A new chat in your Claude project, the brief attached, one fixed instruction."],
  ["Claude animates it in code.", "Every frame drawn, the music and sound effects made, the video rendered, the weakest shots fixed."],
  ["It checks the file.", "Downloads the MP4, measures it, makes it light enough to send."],
  ["It sends it to you.", "With an honest list of its weak spots. You approve, then it goes to your scheduler or gets posted."],
];

const GOOD_AT = [
  "Flat painted noir and Art Deco",
  "Painted landscapes with slow camera moves",
  "Stick-figure and papercraft stories",
  "2D explainers with a voiceover",
  "Low-poly 3D, like the first PlayStation",
  "Cartoon explainers with a simple character",
];

const EXPECT = [
  "Characters are simple and a little stiff. Walking is often a slide with a bob.",
  "Hands are blobs, faces are basic shapes, tiny figures in wide shots are hard to read.",
  "Music made in code sounds synthetic. Bring your own track or use ElevenLabs music for better.",
  "A strong story and strong shots matter more than any rendering trick.",
];

const STEPS: React.ReactNode[] = [
  <>Download reel-bot.md.</>,
  <>Create a new Grok Bot and attach the file.</>,
  <>
    Say <q className="font-semibold text-[var(--ga-ink)]">Make my first reel from this file</q>, with a style and a
    topic.
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

function Bot({ spec, className }: { spec: BotSpec; className: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {botShape(spec)}
    </svg>
  );
}

export function ReelBotPage() {
  return (
    <main className="ga-page relative overflow-x-clip bg-[var(--ga-ground)] text-[var(--ga-ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script dangerouslySetInnerHTML={{ __html: SEEN }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. WHAT IT IS, AND THE FIELD: the bot from the opening, waiting. */}
      <section aria-labelledby="rb-title" className="relative">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center px-5 pb-24 pt-20 text-center sm:px-8 md:pt-24 lg:pb-28">
          <Bot spec={LEAD} className="rb-rise w-[5.5rem] lg:w-[6.5rem]" />
          <p className="rb-rise mt-6 text-[1rem] font-semibold text-[var(--ga-soft)]" style={{ "--i": 1 } as React.CSSProperties}>
            Reel Bot · a free Grok Bot
          </p>
          <h1
            id="rb-title"
            className="rb-rise mt-4 max-w-[18ch] text-balance text-[clamp(2.6rem,7.4vw,4.9rem)] font-extrabold leading-[0.95] tracking-[-0.045em]"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            One Grok Bot that makes your <span className="text-[var(--ga-red)]">reels</span>.
          </h1>
          <p
            className="rb-rise mt-6 max-w-[50ch] text-balance text-[1.2rem] font-medium leading-[1.45] lg:text-[1.4rem]"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            Pick a style and a topic. It writes the brief, records the voice, has Claude animate every frame in code,
            checks the video and hands it to you.
          </p>
          <div id={HERO_ID} className="rb-rise mt-8 w-full max-w-[30rem] scroll-mt-28" style={{ "--i": 4 } as React.CSSProperties}>
            <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="dark" />
          </div>
          <ul className="rb-rise mt-8 flex list-none flex-wrap justify-center gap-2.5 p-0" style={{ "--i": 5 } as React.CSSProperties}>
            {FACTS.map(([text, bot]) => (
              <li key={text} className="ga-fact inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[0.9rem] font-medium">
                <Bot spec={bot} className="h-6 w-6 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. FROM A TOPIC TO A FINISHED REEL, as the file runs it. */}
      <section aria-labelledby="rb-how" className="relative bg-[var(--ga-ground-2)]">
        <div className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8 md:py-28">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <h2 id="rb-how" className="max-w-[14ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              From a topic to a finished reel.
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.1rem] leading-[1.55] text-[var(--ga-soft)] lg:pb-2 lg:text-[1.2rem]">
              No drawing, no filming, no editing. One bot does the running around, and Claude does the animation.
            </p>
          </div>
          <ol className="mt-12 grid list-none grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] border border-[var(--ga-line)] bg-[var(--ga-line)] p-0 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {PIPELINE.map(([title, text], i) => (
              <li key={title} className="flex flex-col bg-[var(--ga-ground-2)] p-6 lg:p-7">
                <span className="text-[0.95rem] font-extrabold text-[var(--ga-soft)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[1.3rem] font-bold leading-[1.15] tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-pretty text-[1rem] leading-[1.5] text-[var(--ga-soft)]">{text}</p>
              </li>
            ))}
            <li className="flex flex-col items-start justify-end gap-4 bg-[var(--ga-ground-2)] p-6 lg:p-7" aria-hidden>
              <Bot spec={LEAD} className="w-14" />
              <p className="text-[1rem] font-semibold leading-[1.4] text-[var(--ga-ink)]">
                Then the next one. Every day, if you like.
              </p>
            </li>
          </ol>
          <p className="mt-6 max-w-[64ch] text-pretty text-[1rem] leading-[1.55] text-[var(--ga-faint)]">
            A 30 to 60 second video takes about 25 to 40 minutes of Claude&rsquo;s time. Run a few at once with a few
            bots, one Claude chat each.
          </p>
        </div>
      </section>

      {/* 3. WHAT IT'S GOOD AT, AND WHAT TO EXPECT, straight from the file. */}
      <section aria-labelledby="rb-styles" className="relative">
        <div className="mx-auto max-w-[80rem] px-5 py-20 sm:px-8 md:py-28">
          <h2 id="rb-styles" className="max-w-[16ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Good at styles drawing can do.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="text-[1.2rem] font-bold">What works well</h3>
              <ul className="mt-5 flex list-none flex-wrap gap-2.5 p-0">
                {GOOD_AT.map((s) => (
                  <li key={s} className="ga-fact rounded-full px-4 py-2 text-[1rem] font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[1.2rem] font-bold">What to expect</h3>
              <ul className="mt-5 list-none border-b border-[var(--ga-line)] p-0">
                {EXPECT.map((s) => (
                  <li key={s} className="border-t border-[var(--ga-line)] py-4 text-pretty text-[1.05rem] leading-[1.5] text-[var(--ga-soft)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW YOU GET IT, AND THE FIELD AGAIN. */}
      <section id={CLOSE_ID} aria-labelledby="rb-close-title" className="scroll-mt-28 border-t border-[var(--ga-line)]">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="rb-close-title" className="max-w-[13ch] text-balance text-[clamp(2.3rem,7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                One file. Your first reel in under an hour.
              </h2>
              <ol className="mt-10 list-none border-b border-[var(--ga-line)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[var(--ga-line)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 text-[1rem] font-extrabold text-[var(--ga-ink)]">{i + 1}</span>
                    <span className="text-[var(--ga-soft)]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col items-start gap-6 self-end">
              <Bot spec={LEAD} className="w-[5rem]" />
              <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="dark" align="start" prompt={false} />
              <p className="max-w-[48ch] text-pretty text-[0.95rem] leading-[1.5] text-[var(--ga-soft)]">{PRODUCT.thanks.needs}</p>
            </div>
          </div>

          <p className="mt-16 max-w-[70ch] text-pretty text-[0.95rem] leading-[1.6] text-[var(--ga-faint)]">
            It runs on your own Grok Bot, Claude and ElevenLabs plans. Nothing goes out under your name until you approve
            it. Reel Bot is an independent Grok Bot, not made by xAI or Anthropic.
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
        note="Free, sent by email"
        buttonClassName={BUTTON}
      />
      {/* Last, on purpose: the metal's gradient is defined by the first disc
          in the page, and a hidden loader (second visit, reduced motion)
          can't lend it to the others. */}
      <ReelBotLoader />
    </main>
  );
}
