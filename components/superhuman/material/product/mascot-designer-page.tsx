import Image from "next/image";
import { Titan_One, Fredoka, Nunito } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { MASCOT_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { Mascot, MovesPlayground } from "./mascot-designer-live";
import { HeroCast, LibraryShelf } from "./mascot-designer-cast";
import "./mascot-designer.css";

/**
 * MASCOT DESIGNER, a free skill for Claude Code that designs a mascot for an
 * app or a site, with a reason to exist, and ships it: every pose, the same
 * mastered moves in SwiftUI and on the web, a character sheet and a film.
 *
 * THE LOOK (Tobia, 2026-11-01): "very graphical, colourful, pop, many of these
 * mascots at use, bubble writing for titles, very Pixar, GPT for the graphics".
 * GPT drew the world, the bubble title and the toy shelf; every character on
 * the page is a real mascot from the skill's library, running the skill's own
 * web runtime (they breathe, blink, wave on hover, squish on tap).
 *
 * EVERYTHING SHOWN IS REAL OUTPUT: the film, the character sheet, the
 * recolours and the concepts are what the skill made, as it ships.
 */

const bubble = Titan_One({ weight: "400", subsets: ["latin"], variable: "--md-bubble", display: "swap" });
const round = Fredoka({ subsets: ["latin"], variable: "--md-round", display: "swap" });
const body = Nunito({ subsets: ["latin"], variable: "--md-body", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "md-close";
const S = (name: string) => `/shop/mascot-designer/${name}`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DesignApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs(PRODUCT.href) },
};

/** A frosting edge between two colours. */
function Wave({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 34" preserveAspectRatio="none" className="md-wave" style={{ background: from, transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M0 18 C 120 34, 240 2, 360 18 S 600 34, 720 18 S 960 2, 1080 18 S 1320 34, 1440 18 V34 H0 Z" fill={to} />
    </svg>
  );
}

const LOOKS: { id: string; name: string; style: string; line: string; bg: string; move: string }[] = [
  { id: "penny", name: "Soft clay", style: "clay", line: "Warm, premium, Pixar-short polish.", bg: "#FFE0CF", move: "hello" },
  { id: "hoot", name: "Plush", style: "plush", line: "Cosy and tactile. You'd want to hug it.", bg: "#E3D6FF", move: "idle" },
  { id: "fuzz", name: "Fuzzy", style: "fuzzy", line: "Lovable, cheeky, a bit chaotic.", bg: "#BDF2D5", move: "love" },
  { id: "byte", name: "Designer toy", style: "vinyl", line: "Cool and collectible, made with attitude.", bg: "#BFE6FF", move: "think" },
  { id: "chatty", name: "Flat line", style: "line", line: "Graphic and confident, next to big type.", bg: "#FFF1A8", move: "idle" },
  { id: "tick", name: "Retro sticker", style: "sticker", line: "Playful, nostalgic, a little rebellious.", bg: "#FFD4E8", move: "idle" },
];

const STEPS: React.ReactNode[] = [
  <>Get it free. It downloads at once.</>,
  <>
    Open a terminal in the folder, type <q className="font-extrabold">claude</q>, then <q className="font-extrabold">hi</q>. It installs itself.
  </>,
  <>
    Type <q className="font-extrabold">make a mascot for my app</q>, in your app&rsquo;s folder.
  </>,
];

export function MascotDesignerPage() {
  return (
    <main className={`md-page ${bubble.variable} ${round.variable} ${body.variable} relative overflow-x-clip`} style={{ background: "#FFF7EA" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 001. THE WORLD: the bubble title, the button, mascots on the podiums. */}
      <section aria-labelledby="md-title" className="md-hero relative isolate overflow-hidden">
        <div className="relative z-10 mx-auto flex max-w-[78rem] flex-col items-center px-5 pt-24 text-center sm:px-8 md:pt-24">
          <div className="flex w-full items-start justify-between gap-4 text-[#2B1640]">
            <span className="md-kicker">Free<span className="hidden sm:inline"> · downloads at once</span></span>
            <span className="md-kicker">Skill for Claude Code</span>
          </div>
          <h1 id="md-title" className="mt-2 w-[min(84vw,31rem)] md:mt-0">
            <Image src={S("title-v1.webp")} alt="Mascot Designer" width={1774} height={887} priority sizes="(min-width: 768px) 31rem, 84vw" className="h-auto w-full drop-shadow-[0_10px_0_rgba(43,22,64,0.12)]" />
          </h1>
          <p className="md-round mt-1 max-w-[34ch] text-pretty text-[1.2rem] font-medium leading-[1.35] text-[#2B1640] sm:text-[1.4rem]">
            A mascot for your app, with a reason to exist. Every pose drawn, every move ready for Xcode and the web.
          </p>
          <div id={HERO_ID} className="mt-6 scroll-mt-28">
            <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="pop" align="center" quiet buttonClassName="md-cta" />
          </div>
        </div>
        <div className="relative -mt-16 sm:-mt-[8vw] lg:-mt-[10vw]">
          <HeroCast />
        </div>
      </section>

      {/* 002. SEE IT FIRST: the film every mascot comes with. */}
      <Wave from="#7FB34C" to="#FFD84D" />
      <section aria-labelledby="md-film" className="md-dots relative" style={{ background: "#FFD84D" }}>
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-20">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <h2 id="md-film" className="md-bubble text-[clamp(2.8rem,7vw,5.6rem)]">
              See it <span className="c2">first.</span>
            </h2>
            <p className="max-w-[40ch] text-pretty text-[1.15rem] font-semibold leading-[1.5] md:pb-3">
              Every mascot comes with its film: it lives inside an iPhone app and a Mac app and does every move, before you
              add a line of code.
            </p>
          </div>
          <figure className="mt-10 md:mt-14">
            <div className="md-card overflow-hidden !rounded-[2.2rem] bg-white p-2 sm:p-3">
              <video
                className="block aspect-video h-auto w-full rounded-[1.6rem] bg-[#FFF1EC]"
                src={S("film-v2.mp4")}
                poster={S("film-v2.jpg")}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="The film for Penny, a savings app's mascot: she says hi, sleeps on the empty screen, thinks while it loads, celebrates a goal with confetti, worries at an error, points at a tip and hugs a heart on the rating sheet, on an iPhone, then on a Mac."
              />
            </div>
            <figcaption className="md-kicker mt-4 opacity-75">The film the skill made for Penny, as it ships · 32 s</figcaption>
          </figure>
        </div>
      </section>

      {/* 003. MADE WITH INTENTION. */}
      <Wave from="#FFD84D" to="#FFF7EA" flip />
      <section aria-labelledby="md-why">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-32 md:pt-20">
          <h2 id="md-why" className="md-bubble max-w-[14ch] text-[clamp(2.8rem,7vw,5.6rem)]">
            Not cute. <span className="c3">Meant.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.15rem] font-semibold leading-[1.5] text-[#2B1640]/80">
            A mascot is your app&rsquo;s promise with a face. So it starts with what your app stands for, and every shape
            has a reason.
          </p>
          <ol className="mt-12 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
            <li className="md-card flex flex-col p-6">
              <span className="md-num">1</span>
              <h3 className="md-round mt-5 text-[1.6rem] font-bold leading-[1.1]">Tell it what it stands for.</h3>
              <p className="mt-3 text-[1.02rem] leading-[1.5] text-[#2B1640]/75">Four quick questions, written for your app.</p>
              <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                {["Money that grows", "Calm about money", "A coach that pushes", "Friend who cheers"].map((c, i) => (
                  <li key={c} className={`md-round rounded-full border-[2.5px] border-[#2B1640] px-3 py-1.5 text-[0.95rem] font-semibold ${i === 0 ? "bg-[#FF5C39] text-white" : "bg-white"}`}>{c}</li>
                ))}
              </ul>
            </li>
            <li className="md-card flex flex-col p-6">
              <span className="md-num">2</span>
              <h3 className="md-round mt-5 text-[1.6rem] font-bold leading-[1.1]">It designs the meaning.</h3>
              <p className="mt-3 text-[1.02rem] leading-[1.5] text-[#2B1640]/75">One idea, one signature feature, a shape you can read at 64 pixels.</p>
              <blockquote className="md-round mt-5 rounded-[1.4rem] bg-[#FFE0CF] px-5 py-4 text-[1.15rem] font-semibold leading-[1.35]">
                &ldquo;Penny is a piggy bank with a sprout growing from its coin slot: your savings, growing.&rdquo;
              </blockquote>
            </li>
            <li className="md-card flex flex-col p-6">
              <span className="md-num">3</span>
              <h3 className="md-round mt-5 text-[1.6rem] font-bold leading-[1.1]">Pick from three.</h3>
              <p className="mt-3 text-[1.02rem] leading-[1.5] text-[#2B1640]/75">Three different ideas for the same meaning. Then it draws every pose of the one you pick.</p>
              <div className="mt-5 overflow-hidden rounded-[1.4rem] border-[2.5px] border-[#2B1640] bg-[#EEEEF2]">
                <Image src={S("concepts-v1.webp")} alt="Three concepts the skill drew for a savings app, numbered: a piggy bank with a sprout, a golden coin with a leaf, an acorn hugging a stack of coins." width={1920} height={640} sizes="(min-width: 768px) 24rem, 90vw" className="block h-auto w-full" />
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 004. THE MOVES, MASTERED: play them. */}
      <Wave from="#FFF7EA" to="#BDF2D5" />
      <section aria-labelledby="md-moves" style={{ background: "#BDF2D5" }}>
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-20">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <h2 id="md-moves" className="md-bubble max-w-[13ch] text-[clamp(2.8rem,7vw,5.6rem)]">
              Every move, <span className="c1">mastered.</span>
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.15rem] font-semibold leading-[1.5] md:pb-3">
              Anticipation before every jump, squash and stretch, blinks on their own clock, confetti in its own colours.
              Tuned once, the same in SwiftUI and on the web. Tap a move.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <MovesPlayground id="penny" name="Penny" />
          </div>
        </div>
      </section>

      {/* 005. SIX LOOKS. */}
      <Wave from="#BDF2D5" to="#FFF7EA" flip />
      <section aria-labelledby="md-looks">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-32 md:pt-20">
          <h2 id="md-looks" className="md-bubble text-[clamp(2.8rem,7vw,5.6rem)]">
            Six <span className="c6">looks.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.15rem] font-semibold leading-[1.5] text-[#2B1640]/80">
            Chosen from who your app is for and how it feels: kind and premium, cosy, loud, cool, graphic or cheeky.
          </p>
          <ul className="mt-12 grid list-none grid-cols-2 gap-4 p-0 sm:gap-6 lg:grid-cols-3">
            {LOOKS.map((l) => (
              <li key={l.id} className="md-card relative flex flex-col overflow-hidden !rounded-[2rem] p-0" style={{ background: l.bg }}>
                <div className="relative mx-auto -mb-6 aspect-square w-[88%]">
                  <Mascot id={l.id} move={l.move} label={`${l.name}: a mascot from the library`} poses="idle,blink,wave,celebrate,think,love" className="!absolute inset-0 !h-full !w-full" />
                </div>
                <div className="relative flex-1 border-t-[3px] border-[#2B1640] bg-white px-5 pb-5 pt-4">
                  <h3 className="md-round text-[1.4rem] font-bold leading-[1.1]">{l.name}</h3>
                  <p className="mt-1 text-[0.98rem] leading-[1.4] text-[#2B1640]/72">{l.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 006. THE LIBRARY: 20 ready-made mascots. */}
      <Wave from="#FFF7EA" to="#FFE0CF" />
      <section aria-labelledby="md-library" style={{ background: "#FFE0CF" }}>
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-20">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <h2 id="md-library" className="md-bubble max-w-[14ch] text-[clamp(2.8rem,7vw,5.6rem)]">
              No OpenAI account? <span className="c1">Start from 20.</span>
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.15rem] font-semibold leading-[1.5] md:pb-3">
              Twenty finished mascots, one for each common kind of app, every pose drawn. The skill picks the one that
              means the most for yours, renames it, and recolours it to your brand.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <LibraryShelf />
          </div>
          <figure className="mt-14">
            <div className="md-card overflow-hidden !rounded-[2rem] bg-[#EEEEF2]">
              <Image src={S("recolour-v3.webp")} alt="Penny recoloured by the skill to three brand colours, blue, teal and violet, with the shading, the eyes, the sprout and the red heart kept." width={2400} height={369} sizes="(min-width: 1280px) 80rem, 100vw" className="block h-auto w-full" />
            </div>
            <figcaption className="md-kicker mt-4 opacity-75">Recoloured to a brand: the shading, the eyes and the details stay</figcaption>
          </figure>
        </div>
      </section>

      {/* 007. EVERYTHING TO SHIP IT. */}
      <Wave from="#FFE0CF" to="#FFF7EA" flip />
      <section aria-labelledby="md-kit">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-14 sm:px-8 md:pb-32 md:pt-20">
          <h2 id="md-kit" className="md-bubble max-w-[16ch] text-[clamp(2.8rem,7vw,5.6rem)]">
            Everything to <span className="c4">ship it.</span>
          </h2>
          <figure className="mt-10 md:mt-14">
            <div className="md-card overflow-hidden !rounded-[2rem]">
              <Image src={S("sheet-v2.webp")} alt="Penny's character sheet: the name in bubble letters, what she stands for, her personality, look and palette, the hero pose, and all nine poses with what each is for." width={2400} height={1600} sizes="(min-width: 1280px) 80rem, 100vw" className="block h-auto w-full" />
            </div>
            <figcaption className="md-kicker mt-4 opacity-75">The character sheet it makes · Penny</figcaption>
          </figure>
          <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["The film", "Your mascot in an iPhone app and a Mac app, every move, 1080p."],
              ["The character sheet", "Name, meaning, palette, every pose: one poster for the team."],
              ["Xcode, ready", "An asset catalog at @1x, @2x and @3x, and a SwiftUI view with every move. iOS 17+, macOS 14+."],
              ["The web, ready", "One script and a folder: <mascot-view> with the same moves, to the frame."],
              ["Every pose as PNG", "Nine poses at 1024 pixels, transparent, for anything else."],
              ["Where each move goes", "Onboarding, empty states, waits, wins, errors, tips, thank you: the guide."],
            ].map(([k, v]) => (
              <li key={k} className="md-card px-5 pb-5 pt-4">
                <h3 className="md-round text-[1.3rem] font-bold leading-[1.15]">{k}</h3>
                <p className="mt-2 text-[1rem] leading-[1.45] text-[#2B1640]/72">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 008. THE CLOSE. */}
      <Wave from="#FFF7EA" to="#FFD4E8" />
      <section id={CLOSE_ID} aria-labelledby="md-close-title" className="scroll-mt-28" style={{ background: "#FFD4E8" }}>
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-14 sm:px-8 md:pb-36 md:pt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="md-close-title" className="md-bubble max-w-[12ch] text-[clamp(2.8rem,7vw,5.6rem)]">
                Give your app someone to <span className="c2">love.</span>
              </h2>
              <div className="relative mt-4 h-[17rem] max-w-[34rem] sm:h-[22rem]">
                <Mascot id="sprout" move="idle" label="Sprout, from the library" className="!absolute -bottom-4 -left-4 !w-[52%]" poses="idle,blink,wave,celebrate" />
                <Mascot id="mochi" move="sleep" label="Mochi, from the library" className="!absolute -bottom-4 left-[26%] !w-[50%]" poses="idle,blink,wave,celebrate,sleep" />
                <Mascot id="drop" move="idle" label="Drop, from the library" className="!absolute -bottom-4 left-[55%] !w-[50%]" poses="idle,blink,wave,celebrate" />
              </div>
            </div>
            <div className="self-end">
              <ol className="list-none border-b-[3px] border-[#2B1640] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t-[3px] border-[#2B1640] py-5 text-[1.12rem] font-semibold leading-[1.45]">
                    <span className="md-round w-5 shrink-0 text-[1.1rem] font-bold">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="pop" align="start" prompt={false} quiet buttonClassName="md-cta" />
                <p className="mt-4 max-w-[48ch] text-pretty text-[0.95rem] leading-[1.5] text-[#2B1640]/70">
                  Free. Needs Claude Code and Node.js 18+, on a Mac, Windows or Linux. A one-of-a-kind mascot is drawn with
                  your own OpenAI account (an API key, or ChatGPT through Codex), about 12 images. Without one, start from
                  the 20 ready-made.
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
        href="#claim"
        label="Get it free"
        note="Free, downloads at once"
        buttonClassName="bg-[#FF5C39] text-white hover:bg-[#ff6e4e]"
      />
    </main>
  );
}
