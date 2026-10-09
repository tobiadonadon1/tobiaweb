import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { APP_LAUNCHER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { LoopVideo } from "./loop-video";
import { PlayOnView } from "./play-on-view";
import { StickyBuy } from "./sticky-buy";

/**
 * APP LAUNCHER, the skill, given away for an email.
 *
 * Designed with Web Designer: three directions rendered (a search shelf, a
 * stamped passport, a dawn photograph), the shelf's plain promise and real
 * outputs merged with the passport's signature, then scanned, cross-checked
 * and scored.
 *
 * THE GROUND IS GREEN because green is "go" and the skill's mark on the
 * Skills rack is a forest card; no other product page here leads with it.
 * Forest for what the visitor feels (the launch), paper for the evidence (what
 * the skill actually wrote), alternating down the page.
 *
 * THE SIGNATURE is the review sheet in the first screen: the problems the
 * skill found in a test app, each ticked off in turn, then a stamp lands on
 * the sheet: 0 blockers. The fear (rejection) and the relief, in four
 * seconds. With reduced motion the sheet is simply finished.
 *
 * EVERY PICTURE IS REAL OUTPUT. The sheet lists what audit.mjs found in the
 * test app "Lumen". The screenshots, the preview and the listing are what
 * the skill made from EverMute, a real app, from its real screens. The ads
 * report is the skill's verdict on a sample export, and says so.
 *
 * IMAGES ARE VERSIONED (-v1): Next's image cache keys by URL.
 */

const IMG = (name: string, ext = "webp") => `/shop/app-launcher/${name}-v1.${ext}`;
const CLOSE_ID = "al-close";

const display = "text-balance break-words font-bold tracking-[-0.055em] leading-[0.92]";
const h2 = "text-balance break-words font-semibold tracking-[-0.045em] leading-[0.98] text-[clamp(2.3rem,5.2vw,4.4rem)]";
const lead = "text-pretty text-[1.1rem] leading-[1.5] md:text-[1.2rem]";

/** What audit.mjs found in "Lumen", a test app built with known problems. */
const FOUND: [string, string][] = [
  ["Camera used, no purpose string", "5.1.1(ii)"],
  ["No way to delete an account", "5.1.1(v)"],
  ["Purchases, no Restore button", "3.1.1"],
  ["Google sign-in, no Sign in with Apple", "4.8"],
  ["Paywall without Terms of Use", "3.1.2"],
  ["“Not now” before the permission prompt", "5.1.1(iv)"],
  ["No privacy manifest", "ITMS-91053"],
  ["Placeholder text left on a screen", "2.1"],
];

/** The parts of the check, as the visitor would name them. */
const CHECKS = [
  "Permission prompts and their purpose strings",
  "Account deletion, and Sign in with Apple token revocation",
  "Sign in with Apple next to Google or Facebook login",
  "Restore, prices from StoreKit, subscription terms",
  "Pre-permission screens with a way out",
  "Privacy manifest and the reasons Apple requires",
  "Tracking SDKs without the tracking prompt",
  "Data sent to an AI provider without consent",
  "Posts and chat without report and block",
  "Placeholder text, beta labels, test servers",
  "Background modes nothing uses",
  "iPad support you didn't design for",
];

const KIT: [string, string][] = [
  ["Launch-day plan", "Dated from two weeks before to two weeks after, hour by hour on the day."],
  ["The posts", "An X thread, Product Hunt page and first comment, Reddit, LinkedIn, an email."],
  ["Press kit", "One page and a short pitch to the people who cover your kind of app."],
  ["Launch graphics", "Product Hunt gallery, link previews, post and story images, in your app's look."],
  ["Review notes", "What the reviewer needs: the demo account, the steps, what each permission is for."],
  ["Upload-ready listing", "A fastlane folder with every field and screenshot, if you want one command."],
];

const SET_ALT = [
  "EverMute: Keep the apps. Lose the scroll. A phone over a sunlit terrace, with the Instagram and TikTok rows popping out.",
  "Reels off. DMs on. Instagram's and YouTube's feature chips, with Reels, Explore and Shorts struck through.",
  "YouTube, without the rabbit hole. YouTube opening on search, with no home feed.",
  "A breath before it opens. A seven-second countdown over a deep blue sea, a paper boat beside the phone.",
  "Lock it until tonight. The lock options, with Until tonight chosen.",
  "Their socials. Your rules. A parent's family screen and a child's rules.",
];

const ADS: { name: string; where: string; verdict: string; why: string }[] = [
  { name: "instagram reels blocker", where: "Apple Ads search term", verdict: "Promote", why: "64% of taps install, at $1.25 each. Make it an exact keyword." },
  { name: "Hook: 4h a day on Reels", where: "Meta ad", verdict: "Refresh", why: "Click-through down 47% in two weeks while frequency climbed." },
  { name: "parental control", where: "Apple Ads search term", verdict: "Cut", why: "$22 per install against a $3 target, on enough taps to trust it." },
  { name: "brick", where: "Apple Ads search term", verdict: "Negative", why: "$66 spent, nothing installed. A competitor's name." },
];

const STEPS: [string, string][] = [
  ["Drop it in", "Unzip it and move the folder into your app's project."],
  ["Type run app-launcher", "In Claude Code or Codex. It installs itself in about a minute."],
  ["Then just type run", "It works through each step, saves where it got to, and picks up there next time."],
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

/** The review sheet: found, fixed one by one, stamped. */
function ReviewSheet() {
  return (
    <figure className="al-sheet relative m-0" aria-labelledby="al-sheet-cap">
      <div className="al-sheet-paper">
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--al-rule)] pb-3">
          <p className="m-0 text-[0.95rem] font-semibold">Lumen 1.0 · review check</p>
          <p className="m-0 text-[0.85rem] text-[var(--al-ink-soft)]">audit.mjs</p>
        </div>
        <ul className="m-0 list-none p-0">
          {FOUND.map(([what, rule], i) => (
            <li key={what} className="al-line" style={{ "--i": i } as React.CSSProperties}>
              <span className="al-mark" aria-hidden />
              <span className="min-w-0 flex-1">{what}</span>
              <span className="shrink-0 tabular-nums text-[var(--al-ink-soft)]">{rule}</span>
            </li>
          ))}
        </ul>
        <p className="al-sum m-0 pt-4 text-[0.95rem] font-medium">
          <span className="al-sum-before">8 problems found</span>
          <span className="al-sum-after">8 fixed, re-checked</span>
        </p>
      </div>
      <span className="al-stamp" aria-hidden>
        0 blockers
      </span>
      <figcaption id="al-sheet-cap" className="sr-only">
        What App Launcher found in a test app built with known problems: a camera with no purpose string, no account
        deletion, no Restore button, Google sign-in without Sign in with Apple, a paywall without Terms of Use, a
        permission screen with a Not now button, no privacy manifest, and placeholder text left on a screen. All eight fixed, then
        re-checked: zero blockers.
      </figcaption>
    </figure>
  );
}

function Shot({ src, alt, w, h, sizes, className = "" }: { src: string; alt: string; w: number; h: number; sizes: string; className?: string }) {
  return <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className={`block h-auto w-full ${className}`} />;
}

export function AppLauncherPage() {
  return (
    <main className="al-page relative overflow-x-clip bg-[var(--al-forest)] text-[var(--al-cream)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. WHAT IT IS: the promise, the button, and the sheet being cleared. */}
      <section aria-labelledby="al-title" className="relative">
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 items-center gap-12 px-5 pb-16 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pb-20 lg:pt-[clamp(5.5rem,13vh,8rem)]">
          <div className="relative z-10">
            <p className="text-[0.95rem] font-medium text-[var(--al-mint)]">Free skill for Claude Code and Codex</p>
            <h1 id="al-title" className={`${display} mt-4 max-w-[12ch] text-[clamp(3.1rem,11vw,4.6rem)] lg:text-[min(6.4vw,11.5vh,6.6rem)]`}>
              From your repo to the App Store.
            </h1>
            <p className="mt-6 max-w-[36ch] text-pretty text-[1.12rem] leading-[1.45] text-[var(--al-cream-soft)] lg:text-[1.22rem]">
              App Launcher finds what App Review would reject and fixes it. Then it writes your listing, makes your
              screenshots and preview from your real app, and plans the launch.
            </p>
            <div id="claim" className="mt-8 scroll-mt-28 lg:mt-[clamp(1.25rem,3.5vh,2.25rem)]">
              <FreeClaim productId={PRODUCT.id} reveal="I want it" tone="forest" align="start" />
            </div>
            <div id="al-top" aria-hidden className="h-px" />
          </div>
          <PlayOnView className="al-play">
            <ReviewSheet />
          </PlayOnView>
        </div>
      </section>

      {/* 2. APPROVAL: what it checks, and how it was tested. On paper: evidence. */}
      <section aria-labelledby="al-review" className="bg-[var(--al-paper)] text-[var(--al-ink)]">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
            <Reveal>
              <h2 id="al-review" className={`${h2} max-w-[13ch]`}>
                It reads your code the way App Review will.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className={`${lead} max-w-[42ch] text-[var(--al-ink-soft)]`}>
                Most rejections aren&rsquo;t about taste. Something is missing, broken or unexplained. App Launcher
                points at the file and the line, says which guideline, and fixes it. Then it walks your app the way a
                reviewer does and writes the notes they&rsquo;ll read.
              </p>
            </Reveal>
          </div>
          <ul className="mt-14 grid list-none grid-cols-1 gap-x-12 border-t border-[var(--al-rule)] p-0 sm:grid-cols-2 md:mt-20">
            {CHECKS.map((c) => (
              <li key={c} className="flex items-baseline gap-3 border-b border-[var(--al-rule)] py-4 text-[1.05rem] leading-[1.4]">
                <span aria-hidden className="al-tick shrink-0" />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-[1fr_1fr] md:gap-16">
            <p className="m-0 max-w-[40ch] text-[1.05rem] leading-[1.5]">
              <b className="font-semibold">Tested before you get it.</b> In test apps built with 36 known problems, it
              found all 36. On EverMute, a real app of mine that Apple approved, it found no blockers.
            </p>
            <p className="m-0 max-w-[40ch] text-[1.05rem] leading-[1.5] text-[var(--al-ink-soft)]">
              Nobody can promise approval. It removes the reasons it can find, and tells you plainly what only App
              Review decides.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SCREENSHOTS: the real set it made, and the search test. */}
      <section aria-labelledby="al-shots" className="bg-[var(--al-forest-deep)]">
        <div className="mx-auto max-w-[86rem] px-5 pb-10 pt-24 sm:px-8 md:pt-32">
          <Reveal>
            <h2 id="al-shots" className={`${h2} max-w-[14ch]`}>
              Screenshots made from your real app.
            </h2>
            <p className={`${lead} mt-5 max-w-[46ch] text-[var(--al-cream-soft)]`}>
              It captures your screens, designs three directions, renders them at Apple&rsquo;s exact sizes, then
              tests them where they&rsquo;ll be seen: in a search row, next to your competitors.
            </p>
          </Reveal>
        </div>
        <ul className="al-strip mx-auto flex max-w-[86rem] list-none gap-3 overflow-x-auto px-5 pb-6 sm:gap-5 sm:px-8 lg:grid lg:grid-cols-6 lg:overflow-visible" aria-label="App Store screenshots App Launcher made for EverMute">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <li key={n} className="w-[62vw] shrink-0 sm:w-[30vw] lg:w-auto">
              <Shot src={IMG(`set-0${n}`)} alt={SET_ALT[n - 1]} w={1206} h={2622} sizes="(min-width: 1024px) 14rem, (min-width: 640px) 30vw, 62vw" className="rounded-[14px]" />
            </li>
          ))}
        </ul>
        <p className="mx-auto max-w-[86rem] px-5 pb-24 text-[0.95rem] text-[var(--al-cream-soft)] sm:px-8 md:pb-32">
          EverMute&rsquo;s set, made with App Launcher from the app&rsquo;s real screens. 1206 × 2622 and 1290 × 2796,
          ready to upload.
        </p>
      </section>

      {/* 4. THE LISTING: written to the byte. */}
      <section aria-labelledby="al-listing" className="bg-[var(--al-paper)] text-[var(--al-ink)]">
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1fr] md:gap-16 md:py-32">
          <Reveal>
            <h2 id="al-listing" className={`${h2} max-w-[12ch]`}>
              A listing written for search.
            </h2>
            <p className={`${lead} mt-5 max-w-[40ch] text-[var(--al-ink-soft)]`}>
              It reads what people actually type, how crowded each term is, and what your competitors&rsquo; unhappy
              reviewers wish they had. Then it fills Apple&rsquo;s fields to the limit, and checks every rule.
            </p>
          </Reveal>
          <div className="al-listing" role="img" aria-label="The listing App Launcher wrote for EverMute: name 30 of 30 characters, subtitle 26 of 30, keywords 96 of 100 bytes, all checks passed.">
            <ListingRow label="Name" value={"EverMute: Block Reels & Shorts"} used={30} max={30} />
            <ListingRow label="Subtitle" value={"Doomscrolling off. DMs on."} used={26} max={30} />
            <ListingRow label="Keywords" value={"blocker,feed,scroll,social,media,screen,time,limit,focus,parental,control,kid,family,detox,habit"} used={96} max={100} unit="bytes" />
            <p className="m-0 mt-6 flex items-center gap-2.5 text-[0.95rem] font-medium">
              <span aria-hidden className="al-tick" /> meta.mjs check: no errors
            </p>
          </div>
        </div>
      </section>

      {/* 5. PREVIEW AND LAUNCH KIT. */}
      <section aria-labelledby="al-kit">
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 items-start gap-14 px-5 py-24 sm:px-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20 md:py-32">
          <figure className="m-0 mx-auto w-full max-w-[19rem] md:sticky md:top-24">
            <LoopVideo src={IMG("preview", "mp4")} poster={IMG("preview-poster", "jpg")} label="EverMute's App Store preview, cut by App Launcher from real recordings." className="rounded-[22px]" />
            <figcaption className="mt-4 text-[0.95rem] text-[var(--al-cream-soft)]">
              The app preview: real recordings, Apple&rsquo;s spec, checked frame by frame.
            </figcaption>
          </figure>
          <div>
            <Reveal>
              <h2 id="al-kit" className={`${h2} max-w-[12ch]`}>
                And the launch, ready to post.
              </h2>
            </Reveal>
            <dl className="mt-12 border-t border-[var(--al-rule-dark)]">
              {KIT.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 border-b border-[var(--al-rule-dark)] py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                  <dt className="text-[1.1rem] font-semibold">{k}</dt>
                  <dd className="m-0 text-[1.02rem] leading-[1.5] text-[var(--al-cream-soft)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 6. AFTER LAUNCH: ads and onboarding. */}
      <section aria-labelledby="al-grow" className="bg-[var(--al-paper)] text-[var(--al-ink)]">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
            <Reveal>
              <h2 id="al-grow" className={`${h2} max-w-[11ch]`}>
                Once you&rsquo;re live, run it again.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className={`${lead} max-w-[42ch] text-[var(--al-ink-soft)]`}>
                Give it your Apple Ads, Meta or TikTok exports: it says what to scale, what to cut and what to test
                next, then designs the new ads. It rewrites your onboarding and paywall to turn more installs into
                people who stay.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 overflow-x-auto md:mt-20">
            <table className="al-ads w-full min-w-[40rem] border-collapse text-left">
              <caption className="pb-4 text-left text-[0.95rem] text-[var(--al-ink-soft)]">ads.mjs on a sample month of Apple Ads and Meta exports</caption>
              <thead>
                <tr>
                  <th scope="col">What</th>
                  <th scope="col">Verdict</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                {ADS.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <span className="block font-semibold">{a.name}</span>
                      <span className="text-[0.9rem] text-[var(--al-ink-soft)]">{a.where}</span>
                    </td>
                    <td>
                      <span className={`al-verdict al-verdict--${a.verdict.toLowerCase()}`}>{a.verdict}</span>
                    </td>
                    <td className="text-[var(--al-ink-soft)]">{a.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. HOW, and the button again. */}
      <section aria-labelledby="al-how">
        <div className="mx-auto max-w-[86rem] px-5 pt-24 sm:px-8 md:pt-32">
          <h2 id="al-how" className="sr-only">
            How to use it
          </h2>
          <ol className="grid list-none grid-cols-1 gap-10 border-t border-[var(--al-rule-dark)] p-0 pt-10 md:grid-cols-3 md:gap-12">
            {STEPS.map(([k, v], i) => (
              <li key={k}>
                <p className="m-0 text-[0.95rem] font-medium tabular-nums text-[var(--al-mint)]">{i + 1}</p>
                <h3 className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{k}</h3>
                <p className="mt-3 max-w-[30ch] text-[1.05rem] leading-[1.5] text-[var(--al-cream-soft)]">{v}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-[60ch] text-[1rem] leading-[1.6] text-[var(--al-cream-soft)]">
            Works with Swift and SwiftUI, Expo, React Native, Flutter and Capacitor apps, on macOS and Linux. On a Mac
            with Xcode it captures your real screens from the Simulator; on Linux it uses screenshots from your phone.
          </p>
        </div>

        <div id={CLOSE_ID} className="scroll-mt-28 px-5 pb-28 pt-24 text-center sm:px-8 md:pb-40 md:pt-32">
          <h2 className={`${display} mx-auto max-w-[11ch] text-[clamp(3rem,8.6vw,7rem)]`}>Launch it properly.</h2>
          <div className="mt-10 flex justify-center">
            <FreeClaim productId={PRODUCT.id} reveal="I want it" tone="forest" prompt={false} />
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
        label="I want it"
        note="Free, sent by email"
        buttonClassName="bg-[#c43d27] text-[#fff8ef]"
      />
    </main>
  );
}

function ListingRow({ label, value, used, max, unit = "characters" }: { label: string; value: string; used: number; max: number; unit?: string }) {
  return (
    <div className="border-b border-[var(--al-rule)] py-5 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="m-0 text-[0.95rem] font-medium text-[var(--al-ink-soft)]">{label}</p>
        <p className="m-0 text-[0.9rem] tabular-nums text-[var(--al-ink-soft)]">
          {used} / {max} {unit}
        </p>
      </div>
      {/* A keyword list breaks after its commas, never inside a word. */}
      <p className="m-0 mt-2 text-[clamp(1.15rem,2vw,1.45rem)] font-semibold leading-[1.25] tracking-[-0.02em]">{value.replace(/,/g, ",\u200b")}</p>
      <div className="al-bar mt-3" aria-hidden>
        <span style={{ width: `${(used / max) * 100}%` }} />
      </div>
    </div>
  );
}
