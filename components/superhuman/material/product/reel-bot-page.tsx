import { DM_Mono, Figtree } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { REEL_BOT as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { Film } from "./motion-designer-film";
import { ReelBotLoader } from "./reel-bot-loader";
import { StickyBuy } from "./sticky-buy";

/**
 * REEL BOT FACTORY 2.0, a $10 Grok Bot: the Director file (with its kit) that a Grok Bot works from to make animated
 * vertical reels, with Claude doing the drawing.
 *
 * DUSK, QUIETLY (Tobia, 2026-11-04: the violet poster was "too similar to the other one", and the colours "kind of
 * hurt… something beautiful but simple"). Not the poster family any more: a soft sky from powder blue to sand, one
 * deep sea slate for the button, a low apricot sun behind the phones; sentence-case Figtree, centred. The reels are
 * the colour; the page stays out of their way.
 *
 * PLAIN VALUE (same day): Grok Bot alone makes the reels now. "What you get" after the hero says it in four plain
 * cards; still called 2.0 (Tobia: "keep it 2.0"), and nothing on the page is technical.
 *
 * THE ORDER, SHORT (Tobia, 2026-11-04: "it looks very complex to run this, but it's not"): the hero (name, one line,
 * the button, three reels on the horizon); one line in, one film out; 1.0 vs 2.0 (the blind test); the close (three
 * steps and the button). The six steps with their proofs and "who does what" were cut: the page sells the reels.
 *
 * WHAT IS REAL: the three reels are the 2.0 trial reels. Each was made from one line (the "asked" text, word for
 * word) by a fresh Claude session that had never seen the kit, following the skill alone, then rendered at 1080x1920;
 * nobody touched them by hand. The brief lines, the contact sheet, the check numbers and the weak spots are those
 * reels' own. COMPARE holds the blind 1.0-vs-2.0 test (reel-bot/trials/ab in tobiaweb-private); its numbers are the
 * test's, nothing rounded up.
 */

const figtree = Figtree({ subsets: ["latin"], variable: "--rb-sans", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--rb-mono", display: "swap" });

const HERO_ID = "claim";
const CLOSE_ID = "rb-close";
const S = (name: string) => `/shop/reel-bot/${name}`;

const BUTTON = "bg-[#2F4858] text-white shadow-[0_16px_34px_-18px_rgba(47,72,88,0.75)] hover:bg-[#263d4b]";

const REELS = [
  { id: "lighthouse", style: "Noir", title: "The Last Watch", asked: "A lighthouse keeper's last night before the lighthouse is automated.", len: "29 s" },
  { id: "kite", style: "Papercraft", title: "The Long Way Home", asked: "A lost paper kite finds its way home.", len: "28 s" },
  { id: "octopus", style: "Explainer, with a voice", title: "Three Hearts", asked: "Why octopuses have three hearts.", len: "32 s" },
] as const;

/** The blind test, 2026-11-04: the same three lines through 1.0 and 2.0, scored /20 by critics who didn't know which
 *  version made which. FILLED FROM THE TEST'S RESULTS. */
const COMPARE: [string, string, string][] = [
  ["Score from blind critics, out of 20", "14.3", "18.0"],
  ["Won the head-to-head", "0 of 3", "3 of 3"],
  ["Time to a finished reel", "25–39 min", "9–14 min"],
  ["Video quality", "Standard", "Full HD"],
  ["What you need", "Grok + Claude", "Grok Bot"],
  ["Music", "Computer-made", "Real musicians"],
]
/** What the buyer gets, in plain words (Tobia, 2026-11-04: "nothing too technical, just straight-up value"). */
const VALUE: { k: string; title: string; text: string }[] = [
  { k: "01", title: "Only Grok Bot", text: "No other app and nothing to install on your computer. The voice and the music are built in." },
  { k: "02", title: "One question", text: "Tell it what your account is about. It picks the style and the topic, and your first reel arrives in the same chat." },
  { k: "03", title: "A finished reel", text: "The story, the drawings, the voice, the music and the captions. Plus the cover and the caption to post it with." },
  { k: "04", title: "You say OK", text: "You see every reel first. Say OK, or say what to change in one sentence. Nothing is posted without you." },
];

const STEPS: React.ReactNode[] = [
  <>Unzip the download: two files, both for your Grok Bot.</>,
  <>Create a new Grok Bot called Director and attach both files.</>,
  <>
    Say <q className="font-semibold">Make my first reel from this file</q>. It asks you one question, then makes your
    first reel.
  </>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Grok Bot",
  image: abs(PRODUCT.share.image ?? `/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: (PRODUCT.priceCents / 100).toFixed(2),
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

/** The buy button: a real form to /api/checkout; signed out or on Free, the first press opens the Pro card. */
function Buy({ reportErrors = false, align = "center" }: { reportErrors?: boolean; align?: "center" | "start" }) {
  return (
    <BuyForm
      productId={PRODUCT.id}
      price={PRODUCT.priceLabel}
      label={`Get it · ${PRODUCT.priceLabel}`}
      tone="paper"
      align={align}
      reportErrors={reportErrors}
      buttonClassName={BUTTON}
    />
  );
}

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--rb-mono)] text-[0.74rem] uppercase tracking-[0.1em] ${className}`}>{children}</span>
  );
}

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rb-phone ${className}`}>
      <div className="rb-phone__screen">{children}</div>
    </div>
  );
}

function Reel({ id, label, eager = false, quiet = false }: { id: string; label: string; eager?: boolean; quiet?: boolean }) {
  return (
    <Film
      src={S(`${id}-v2.mp4`)}
      poster={S(`${id}-v2.jpg`)}
      label={label}
      eager={eager}
      className="h-full w-full"
      buttonClassName={quiet ? "!hidden" : "mdx-sound--screen"}
    />
  );
}

function Heading({ id, kicker, children, aside }: { id: string; kicker: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <Mono className="text-[#2F4858]/70">{kicker}</Mono>
        <h2
          id={id}
          className="mt-3 max-w-[16ch] text-balance text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[1] tracking-[-0.035em]"
        >
          {children}
        </h2>
      </div>
      {aside ? <p className="max-w-[40ch] text-pretty text-[1.1rem] leading-[1.55] text-[#22272E]/65 md:pb-2">{aside}</p> : null}
    </div>
  );
}

export function ReelBotPage() {
  return (
    <main
      className={`rb-page ${figtree.variable} ${mono.variable} relative overflow-x-clip font-[family-name:var(--rb-sans)] text-[#22272E]`}
      style={{ background: "var(--rb-mist)" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" tone="paper" />

      {/* 01. THE HERO: dusk, the name, one line, the button, three reels on the horizon. */}
      <section aria-labelledby="rb-title" className="rb-sky relative isolate overflow-hidden">
        <div className="mx-auto flex max-w-[76rem] flex-col items-center px-5 pb-16 pt-28 text-center sm:px-8 md:pb-20 md:pt-32">
          <div className="rb-rise" style={{ "--i": 0 } as React.CSSProperties}>
            <Mono className="inline-block whitespace-nowrap rounded-full bg-white/55 px-3.5 py-1.5 text-[#2F4858] ring-1 ring-[#2F4858]/10">
              New · 2.0<span className="hidden sm:inline"> · Only Grok Bot needed</span>
            </Mono>
          </div>
          <h1
            id="rb-title"
            className="rb-rise rb-title mt-7 text-balance font-semibold leading-[0.95] tracking-[-0.05em]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Reel Bot Factory
          </h1>
          <p
            className="rb-rise mt-5 max-w-[30ch] text-pretty text-[clamp(1.2rem,2.1vw,1.55rem)] leading-[1.35] text-[#22272E]/70"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Give it a topic. Get a finished, animated reel, scored before you see it.
          </p>
          <div id={HERO_ID} className="rb-rise mt-8 scroll-mt-28" style={{ "--i": 3 } as React.CSSProperties}>
            <Buy reportErrors />
            <p className="mt-4 text-[0.95rem] leading-[1.5] text-[#22272E]/60">
              {PRODUCT.priceLabel} once · instant download · included with Pro
            </p>
          </div>

          <figure className="rb-rise m-0 mt-14 w-full md:mt-16" style={{ "--i": 4 } as React.CSSProperties}>
            <div className="rb-row">
              <Phone className="rb-row__side">
                <Reel id="kite" label="The Long Way Home, a papercraft reel" quiet />
              </Phone>
              <Phone className="rb-row__mid">
                <Reel id="lighthouse" label="The Last Watch, a noir reel" eager />
              </Phone>
              <Phone className="rb-row__side">
                <Reel id="octopus" label="Three Hearts, an explainer reel with a voice" quiet />
              </Phone>
            </div>
            <figcaption className="mt-7">
              <Mono className="text-[#22272E]/55">Three reels it made · each from one line · not touched by hand</Mono>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 01b. WHAT YOU GET: four plain cards. */}
      <section aria-labelledby="rb-get">
        <div className="mx-auto max-w-[76rem] px-5 pt-20 sm:px-8 md:pt-28">
          <Heading id="rb-get" kicker="What you get" aside="No drawing, no filming, no editing. You give it a topic; it gives you a reel.">
            Simple from the first message.
          </Heading>
          <ul className="mt-12 grid list-none grid-cols-1 gap-5 p-0 md:mt-16 md:grid-cols-2">
            {VALUE.map((v) => (
              <li key={v.k} className="rounded-[1.6rem] bg-white p-6 ring-1 ring-black/[0.05] sm:p-8">
                <Mono className="text-[#2F4858]/70">{v.k}</Mono>
                <p className="m-0 mt-3 text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#2F4858]">
                  {v.title}
                </p>
                <p className="m-0 mt-3 max-w-[44ch] text-pretty text-[1.02rem] leading-[1.55] text-[#22272E]/65">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02. ONE LINE IN, ONE FILM OUT. */}
      <section aria-labelledby="rb-styles">
        <div className="mx-auto max-w-[76rem] px-5 py-20 sm:px-8 md:py-28">
          <Heading
            id="rb-styles"
            kicker="One line in"
            aside="Each one with its own story, its own twist and its own music. These three were made from the lines above them."
          >
            One line in. One film out.
          </Heading>

          <ul className="mt-12 grid list-none grid-cols-1 gap-5 p-0 md:mt-16 md:grid-cols-3">
            {REELS.map((r) => (
              <li key={r.id} className="flex flex-col rounded-[1.6rem] bg-white p-5 ring-1 ring-black/[0.05] sm:p-6">
                <p className="m-0 rounded-[1.1rem] rounded-bl-[0.35rem] bg-[#EEF1F4] px-4 py-3 md:min-h-[4.6rem] text-[1rem] leading-[1.45] text-[#22272E]/85">
                  &ldquo;{r.asked}&rdquo;
                </p>
                <Phone className="mx-auto mt-6 w-full max-w-[14.5rem]">
                  <Reel id={r.id} label={r.title} />
                </Phone>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="m-0 text-[1.35rem] font-semibold tracking-[-0.02em]">{r.title}</h3>
                  <Mono className="shrink-0 text-[#22272E]/50">{r.len}</Mono>
                </div>
                <Mono className="mt-1 text-[#2F4858]/75">{r.style}</Mono>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[64ch] text-pretty text-[0.95rem] leading-[1.55] text-[#22272E]/55">
            Each made from that one line. Not touched by hand.
          </p>
        </div>
      </section>

      {/* 03. 1.0 VS 2.0: the blind test. */}
      <section aria-labelledby="rb-vs" className="border-t border-black/[0.06]">
        <div className="mx-auto max-w-[76rem] px-5 py-20 sm:px-8 md:py-28">
          <Heading
            id="rb-vs"
            kicker="What changed"
            aside="We gave the same three ideas to both versions. Critics scored the reels without knowing which was which."
          >
            Better than 1.0, in a blind test.
          </Heading>
          <div className="mt-12 rounded-[1.6rem] bg-white p-5 ring-1 ring-black/[0.05] sm:p-8 md:mt-16">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 pr-4 font-normal"><Mono className="text-[#22272E]/50">Same three ideas</Mono></th>
                  <th className="w-[26%] pb-4 pr-3 font-normal sm:w-[20%]"><Mono className="text-[#22272E]/50">1.0</Mono></th>
                  <th className="w-[26%] pb-4 font-normal sm:w-[20%]"><Mono className="text-[#2F4858]">2.0</Mono></th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, a, b]) => (
                  <tr key={k} className="border-b border-black/[0.06] align-baseline last:border-b-0">
                    <td className="py-4 pr-3 text-[0.95rem] leading-[1.35] text-[#22272E]/75 sm:text-[1.02rem]">{k}</td>
                    <td className="py-4 pr-4 text-[clamp(1rem,2.2vw,1.6rem)] font-semibold tracking-[-0.02em] text-[#22272E]/40">{a}</td>
                    <td className="py-4 text-[clamp(1rem,2.2vw,1.6rem)] font-bold tracking-[-0.02em] text-[#2F4858]">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 04. THE CLOSE, back at dusk. */}
      <section id={CLOSE_ID} aria-labelledby="rb-close-title" className="rb-sky relative isolate scroll-mt-28 overflow-hidden">
        <div className="mx-auto max-w-[76rem] px-5 pb-28 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Mono className="text-[#2F4858]/70">Get it</Mono>
              <h2 id="rb-close-title" className="mt-3 max-w-[12ch] text-balance text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[1] tracking-[-0.04em]">
                A reel a day. Your OK first.
              </h2>
              <ol className="m-0 mt-10 list-none border-b border-[#22272E]/10 p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[#22272E]/10 py-4 text-[1.05rem] leading-[1.5]">
                    <span className="w-5 shrink-0 font-[family-name:var(--rb-mono)] text-[0.9rem] text-[#2F4858]">{i + 1}</span>
                    <span className="text-[#22272E]/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="self-end rounded-[1.6rem] bg-white/70 p-6 ring-1 ring-black/[0.05] backdrop-blur-sm sm:p-8">
              <p className="m-0 text-[1.15rem] font-semibold leading-[1.35] tracking-[-0.01em]">
                Reel Bot Factory 2.0 · {PRODUCT.priceLabel}
              </p>
              <p className="m-0 mt-2 text-[0.98rem] leading-[1.5] text-[#22272E]/65">
                The Director for your Grok Bot and the kit it draws with. Instant download.
              </p>
              <div className="mt-6">
                <Buy align="start" />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.92rem] leading-[1.5] text-[#22272E]/60">{PRODUCT.thanks.needs}</p>
              </div>
            </div>
          </div>
          <p className="mt-16 max-w-[70ch] text-pretty text-[0.88rem] leading-[1.6] text-[#22272E]/50">
            Reel Bot Factory is an independent Grok Bot, not made by xAI or Anthropic. Music: real tracks by real musicians,
            all CC0 (public domain).
          </p>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        note="Director + kit · instant download"
        buttonClassName={BUTTON}
      />
      <ReelBotLoader />
    </main>
  );
}
