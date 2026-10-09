import Image from "next/image";
import { Archivo, Barlow_Condensed } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { APP_LAUNCHER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * APP LAUNCHER, the skill, given away for an email.
 *
 * A poster, not a brochure: cobalt ground, a condensed uppercase headline,
 * and the one picture that proves the skill: App Store screenshots it made
 * for a real app (EverMute), photographs generated around the app's real
 * screens. Four short sections: the promise, what it does, the proof, how.
 * Designed with Web Designer (three directions rendered; the shelf and the
 * dark contact sheet lost to this one).
 *
 * Its own fonts (Barlow Condensed for the voice, Archivo for reading) so it
 * doesn't look like its neighbours on the Skills shelf.
 *
 * IMAGES ARE VERSIONED (-v2): Next's image cache keys by URL.
 */

const condensed = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "800"], variable: "--al-condensed", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--al-archivo", display: "swap" });

const IMG = (n: number) => `/shop/app-launcher/shot-0${n}-v2.webp`;
const CLOSE_ID = "al-close";

const SHOTS: string[] = [
  "Keep the apps. Lose the scroll. A hand holds the phone over a terrace at sunset; on screen, EverMute's list of apps.",
  "Reels off. DMs on. The phone on a blue sofa beside a coffee; on screen, Instagram's Reels and Explore struck through.",
  "YouTube, without the rabbit hole. Someone in bed holds the phone; on screen, YouTube opens on search with no feed.",
  "A breath before it opens. The phone on a wooden pier over the sea; on screen, a seven-second countdown.",
  "Lock it until tonight. The phone in a stand on a sunny desk; on screen, the lock options.",
  "Their socials. Your rules. A mother on the sofa holds the phone, her son reads beside her; on screen, the family rules.",
];

const DOES: [string, string][] = [
  ["Gets it approved", "It reads your code the way App Review does, finds what would get you rejected, and fixes it."],
  ["Makes your screenshots", "Real photos with your real app inside, at Apple's exact sizes. The kind the top apps pay a studio for."],
  ["Gets you found", "A name, subtitle and keywords built from what people actually search, checked against Apple's rules."],
  ["Plans the launch", "Posts, Product Hunt and a day-by-day plan. After launch, it tells you which ads to keep and fixes your onboarding."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux",
  author: { "@type": "Person", name: "Tobia Donadon" },
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

const poster = "font-[family-name:var(--al-condensed)] font-extrabold uppercase leading-[0.86] tracking-[-0.005em] text-balance";

function Shot({ n, className = "", sizes, priority = false }: { n: number; className?: string; sizes: string; priority?: boolean }) {
  return (
    <Image
      src={IMG(n)}
      alt={SHOTS[n - 1]}
      width={600}
      height={1304}
      sizes={sizes}
      preload={priority}
      className={`block h-auto w-full rounded-[clamp(12px,1.6vw,22px)] shadow-[0_40px_70px_-34px_rgba(0,0,30,0.75)] ${className}`}
    />
  );
}

export function AppLauncherPage() {
  return (
    <main className={`${condensed.variable} ${archivo.variable} al-page relative overflow-x-clip bg-[#1636e6] font-[family-name:var(--al-archivo)] text-white`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. The promise and the button, the proof fanned beside it. */}
      <section aria-labelledby="al-title" className="relative">
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 items-end gap-10 px-5 pt-24 sm:px-8 md:pt-28 lg:min-h-[min(100svh,64rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="relative z-10 pb-4 lg:pb-[clamp(4rem,12vh,7rem)]">
            <p className="text-[1rem] font-medium text-[#c9d3ff]">Free skill for Claude Code and Codex</p>
            <h1 id="al-title" className={`${poster} mt-4 text-[clamp(3.3rem,13.5vw,5.2rem)] lg:text-[min(7.4vw,13vh,8rem)]`}>
              Get your app approved and downloaded.
            </h1>
            <p className="mt-6 max-w-[34ch] text-pretty text-[1.15rem] leading-[1.45] text-[#e3e8ff] lg:text-[1.25rem]">
              Put App Launcher in your iOS app&rsquo;s folder and type <b className="font-semibold text-white">run</b>. It gets
              the app approved, then makes the screenshots, the listing and the launch.
            </p>
            <div id="claim" className="mt-8 scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="cobalt" align="start" />
            </div>
            <div id="al-top" aria-hidden className="h-px" />
          </div>

          <div className="relative mx-auto h-[min(118vw,36rem)] w-full max-w-[34rem] lg:h-[min(86vh,50rem)] lg:max-w-none" aria-hidden>
            <div className="absolute bottom-[-6%] left-[2%] w-[44%] -rotate-[7deg]">
              <Shot n={2} sizes="(min-width: 1024px) 18rem, 40vw" priority />
            </div>
            <div className="absolute bottom-[3%] right-[2%] w-[44%] rotate-[6deg]">
              <Shot n={6} sizes="(min-width: 1024px) 18rem, 40vw" priority />
            </div>
            <div className="absolute bottom-[-2%] left-1/2 z-10 w-[50%] -translate-x-1/2">
              <Shot n={1} sizes="(min-width: 1024px) 21rem, 46vw" priority />
            </div>
          </div>
        </div>
      </section>

      {/* 2. What it does, in four lines. */}
      <section aria-labelledby="al-does" className="relative z-20 bg-[#f4f3ef] text-[#0b1230]">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="al-does" className={`${poster} max-w-[14ch] text-[clamp(2.8rem,7vw,5.6rem)]`}>
            From working app to launched app.
          </h2>
          <ul className="mt-14 grid list-none grid-cols-1 gap-x-14 border-t-2 border-[#0b1230] p-0 md:mt-20 md:grid-cols-2">
            {DOES.map(([k, v]) => (
              <li key={k} className="border-b border-[rgba(11,18,48,0.18)] py-8 md:py-10">
                <h3 className="font-[family-name:var(--al-condensed)] text-[clamp(1.9rem,3.4vw,2.7rem)] font-extrabold uppercase leading-[0.95]">{k}</h3>
                <p className="mt-3 max-w-[40ch] text-pretty text-[1.1rem] leading-[1.5] text-[#3a4160]">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. The proof: the whole set it made. */}
      <section aria-labelledby="al-proof" className="bg-[#0b1230]">
        <div className="mx-auto max-w-[86rem] px-5 pb-8 pt-24 sm:px-8 md:pt-32">
          <h2 id="al-proof" className={`${poster} max-w-[16ch] text-[clamp(2.8rem,7vw,5.6rem)]`}>
            Screenshots that look like the top apps.
          </h2>
          <p className="mt-5 max-w-[48ch] text-pretty text-[1.1rem] leading-[1.5] text-[#c9d0ea] md:text-[1.2rem]">
            Made for EverMute. The photos come from an image model; every screen is the real app, dropped in exactly.
          </p>
        </div>
        <ul
          className="al-strip mx-auto flex max-w-[86rem] list-none gap-3 overflow-x-auto px-5 pb-24 pt-6 sm:gap-5 sm:px-8 md:pb-32 lg:grid lg:grid-cols-6 lg:overflow-visible"
          aria-label="Six App Store screenshots App Launcher made for EverMute"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <li key={n} className="w-[62vw] shrink-0 sm:w-[30vw] lg:w-auto">
              <Shot n={n} sizes="(min-width: 1024px) 14rem, (min-width: 640px) 30vw, 62vw" />
            </li>
          ))}
        </ul>
      </section>

      {/* 4. How, and the button again, on paper so it doesn't run cobalt into the orange footer. */}
      <section id={CLOSE_ID} aria-labelledby="al-close-title" className="scroll-mt-28 bg-[#f4f3ef] text-[#0b1230]">
        <div className="mx-auto max-w-[86rem] px-5 pb-28 pt-24 sm:px-8 md:pb-40 md:pt-32">
          <h2 id="al-close-title" className={`${poster} max-w-[14ch] text-[clamp(3rem,9vw,7rem)]`}>
            Put it in your app&rsquo;s folder. Type run.
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.15rem] leading-[1.5] text-[#3a4160] md:text-[1.25rem]">
            Works in Claude Code and Codex, on Mac and Linux, for Swift, Expo, React Native, Flutter and Capacitor
            apps. Everything it makes lands in one folder in your project.
          </p>
          <div className="mt-10">
            <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="light" align="start" prompt={false} />
          </div>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId="al-top"
        closeId={CLOSE_ID}
        href="#claim"
        label="Get it free"
        note="Free, sent by email"
        buttonClassName="bg-[#d4361a] text-white"
      />
    </main>
  );
}
