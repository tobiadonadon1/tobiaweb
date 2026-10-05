import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { WEB_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * WEB DESIGNER, the skill, given away for an email.
 *
 * Designed with the skill itself: three directions rendered, one picked (the
 * fan deck), the other two merged in (the lineup wall, the monitor wall), then
 * scanned, cross-checked and scored by one critic over several rounds.
 *
 * THE GROUNDS MEAN SOMETHING. Grey is the default: the wall Claude's own
 * sites stand against, identical. Saffron is decided: the skill's sites stand
 * on it, and it is the Web Designer mark on the Skills rack (a saffron window
 * stepping out of a grey stack). Night is other people's computers. A visitor
 * who reads nothing still sees the argument: grey, then colour.
 *
 * THE SIGNATURE is the fan: a grey stack of the same site, and four decided
 * sites fanning open over it from one pivot like paint chips, each with its
 * label strip. With reduced motion the fan is simply open.
 *
 * EVERY PAGE HERE IS REAL OUTPUT. "Claude on its own" is what Claude built
 * from a one-line brief with no skill; "with Web Designer" is what a fresh
 * agent built from the same line following the skill, unedited.
 *
 * IMAGES ARE VERSIONED (-v3): Next's image cache keys by URL, so a replaced
 * file must get a new name or the old picture keeps being served.
 */

const S = (name: string) => `/shop/web-designer/${name}-v3.webp`;
const CLOSE_ID = "wd-close";

// break-words: a long German word breaks instead of clipping.
const display = "text-balance break-words font-bold tracking-[-0.06em] leading-[0.9]";
const h2 = "text-balance break-words font-semibold tracking-[-0.045em] leading-[0.98] text-[clamp(2.4rem,5.4vw,4.6rem)]";
const lead = "text-pretty text-[1.1rem] leading-[1.5] md:text-[1.2rem]";

/** The same four briefs, twice. */
const BRIEFS: { key: string; brief: string; name: string; as: string }[] = [
  { key: "ledgerline", brief: "Invoicing app", name: "Ledgerline", as: "a station departure board" },
  { key: "murmur", brief: "AI meeting notes", name: "Murmur", as: "a murmuration of starlings" },
  { key: "halden", brief: "Architects", name: "Halden & Moss", as: "a model on the table" },
  { key: "forager", brief: "Coffee roaster", name: "Forager", as: "a greengrocer's crate label" },
];

/** The fan: grey stack under, four chips fanning from one pivot. */
const FAN: { img: string; label: string }[] = [
  { img: "after-halden", label: "Halden & Moss · model on the table" },
  { img: "after-northline", label: "Northline · T-card board" },
  { img: "after-forager", label: "Forager · crate label" },
  { img: "after-ledgerline", label: "Ledgerline · departure board" },
];

/** One site on six computers (the matrix the skill runs on everything it makes). */
const DESKTOPS: [string, string][] = [
  ["wall-windows-125", "Windows at 125%"],
  ["wall-windows-hc", "Windows High Contrast"],
  ["wall-linux", "Linux"],
];
const PHONES: [string, string, number, number][] = [
  ["wall-safari-iphone", "iPhone", 780, 1688],
  ["wall-android", "Android", 780, 1590],
  ["wall-reflow-320", "320 wide", 640, 1280],
  ["wall-l10n-phone", "German-length text", 780, 1688],
];

const GET: [string, string][] = [
  ["Three directions, then one.", "Your first screen, designed three different ways before it commits."],
  ["Real code, in your project.", "React, Next.js, Tailwind, shadcn, Vue, Svelte or plain HTML."],
  ["Checked before you see it.", "Scanned for AI slop, tested on every computer, scored by a critic."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  author: { "@type": "Person", name: "Tobia Donadon" },
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

/** A website's first screen, as the skill shoots it (1440 x 900), whole. */
function Shot({ src, alt, sizes, className = "", preload = false }: { src: string; alt: string; sizes: string; className?: string; preload?: boolean }) {
  return (
    <Image src={src} alt={alt} width={1440} height={900} sizes={sizes} preload={preload} className={`block h-auto w-full ${className}`} />
  );
}

/** Four first screens in a 2 x 2: the same grid for "before" and "after". */
function Four({ kind }: { kind: "before" | "after" }) {
  return (
    <ul className="mt-12 grid list-none grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 md:mt-16">
      {BRIEFS.map((b, i) => (
        <li key={b.key}>
          <Shot
            src={S(`${kind}-${b.key}`)}
            alt={
              kind === "before"
                ? `${b.brief}, by Claude on its own: warm paper, a serif headline with an italic word, a pill above it.`
                : `${b.name}, the same brief with Web Designer: ${b.as}.`
            }
            sizes="(min-width: 1376px) 40rem, (min-width: 600px) 46vw, 92vw"
            className={`aspect-[4/5] rounded-[6px] object-cover object-left-top min-[600px]:aspect-auto sm:rounded-[8px] ${kind === "before" ? "shadow-[0_22px_38px_-26px_rgba(11,31,58,0.5)]" : "shadow-[0_2px_0_rgba(0,0,0,0.06),0_30px_50px_-30px_rgba(11,31,58,0.7)]"}`}
          />
          <p className="mt-3 text-[0.92rem] leading-[1.35] sm:mt-4 sm:text-[1.02rem]">
            {kind === "before" ? (
              <>
                <b className="mr-2 font-bold tracking-[-0.03em]">{i + 1}</b>
                {b.brief}
              </>
            ) : (
              <>
                <span className="font-semibold">{b.name}</span>
                <span className="text-[var(--wd-ink-warm)]">, as {b.as}</span>
              </>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function WebDesignerPage() {
  return (
    <main className="wd-page relative overflow-x-clip bg-[var(--wd-saffron)] text-[#0b1f3a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. WHAT IT IS. The promise, the button and the fan, all in the first
          screen down to a 1280 x 610 Windows laptop at 150%. */}
      <section aria-labelledby="wd-title" className="relative">
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 items-center gap-10 px-5 pb-14 pt-24 sm:px-8 md:pt-28 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10 lg:pb-16 lg:pt-[clamp(5.5rem,14vh,8rem)]">
          <div className="relative z-10">
            <p className="text-[0.95rem] font-medium text-[var(--wd-ink-warm)]">Free skill for Claude Code</p>
            <h1 id="wd-title" className={`${display} mt-4 max-w-[13ch] text-[clamp(3rem,10.5vw,4.4rem)] lg:max-w-[14ch] lg:text-[min(6.3vw,11.5vh,6.4rem)]`}>
              Websites that don&rsquo;t look like AI made them.
            </h1>
            <p className="mt-6 max-w-[34ch] text-pretty text-[1.12rem] leading-[1.45] text-[var(--wd-ink-warm)] lg:mt-[clamp(1rem,3vh,1.75rem)] lg:text-[1.22rem]">
              Web Designer gives Claude a studio&rsquo;s process, then checks every page on every screen and every
              computer.
            </p>
            <div id="claim" className="mt-8 scroll-mt-28 lg:mt-[clamp(1.25rem,3.5vh,2.25rem)]">
              <FreeClaim productId={PRODUCT.id} reveal="I want it" tone="saffron" align="start" />
            </div>
            <div id="wd-top" aria-hidden className="h-px" />
          </div>

          <div
            className="wd-fan relative mx-auto aspect-[1/0.78] w-full max-w-[38rem] lg:max-w-none"
            role="img"
            aria-label="Four websites designed with Web Designer fanned open like paint chips over a grey stack of the same site Claude makes on its own."
          >
            {[0, 1].map((i) => (
              <div key={i} className={`wd-grey wd-grey-${i} absolute`} aria-hidden>
                <Shot src={S(i ? "before-murmur" : "before-ledgerline")} alt="" sizes="(min-width: 1024px) 26rem, 60vw" />
              </div>
            ))}
            {FAN.map((c, i) => (
              <figure key={c.img} className={`wd-chip wd-chip-${i} absolute m-0`} aria-hidden>
                <figcaption>{c.label}</figcaption>
                <Shot src={S(c.img)} alt="" preload sizes="(min-width: 1024px) 26rem, 60vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DOES IT WORK. Claude on its own, on the grey wall. */}
      <section aria-labelledby="wd-parade" className="wd-wall bg-[var(--wd-wall)]">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <Reveal>
            <h2 id="wd-parade" className={`${h2} max-w-[12ch]`}>
              Four briefs. One website.
            </h2>
            <p className={`${lead} mt-5 max-w-[46ch] text-[#44546a]`}>
              An invoicing app, an AI note-taker, an architecture studio, a coffee roaster. This is what Claude builds
              for each, on its own.
            </p>
          </Reveal>
          <Four kind="before" />
        </div>
      </section>

      {/* ...and the same four with the skill, in the same grid, on saffron. */}
      <section aria-labelledby="wd-after">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <Reveal>
            <h2 id="wd-after" className={`${h2} max-w-[14ch]`}>
              Same four briefs, with Web Designer.
            </h2>
          </Reveal>
          <Four kind="after" />
        </div>
      </section>

      {/* 3. APPS TOO. Grey half, saffron half, the two screens level. */}
      <section aria-labelledby="wd-apps" className="wd-split">
        <div className="mx-auto max-w-[86rem] px-5 pb-12 pt-24 sm:px-8 md:pb-16 md:pt-32">
          <Reveal>
            <h2 id="wd-apps" className={`${h2} max-w-[10ch]`}>
              Web apps too.
            </h2>
            <p className={`${lead} mt-5 max-w-[34ch] text-[#44546a]`}>Not another row of KPI cards. The screen is the work.</p>
          </Reveal>
        </div>
        <div className="mx-auto grid max-w-[86rem] grid-cols-1 md:grid-cols-2">
          <figure className="m-0 bg-[var(--wd-wall)] px-5 pb-12 sm:px-8 md:bg-transparent md:pb-28 md:pr-10">
            <Shot
              src={S("dash-before")}
              alt="A courier dispatch dashboard by Claude on its own: a sidebar, a row of metric cards, a map card and a list card."
              sizes="(min-width: 768px) 40rem, 92vw"
              className="rounded-[8px] shadow-[0_22px_38px_-26px_rgba(11,31,58,0.5)]"
            />
            <figcaption className="mt-4 text-[1rem] font-semibold">Claude on its own</figcaption>
          </figure>
          <figure className="m-0 px-5 pb-24 pt-10 sm:px-8 md:pb-28 md:pl-10 md:pt-0">
            <Shot
              src={S("dash-after")}
              alt="The same brief with Web Designer: a green steel T-card board where the jobs that need you and the drivers' runs own the screen."
              sizes="(min-width: 768px) 40rem, 92vw"
              className="rounded-[8px] shadow-[0_2px_0_rgba(0,0,0,0.06),0_30px_50px_-30px_rgba(11,31,58,0.7)]"
            />
            <figcaption className="mt-4 text-[1rem] font-semibold">With Web Designer</figcaption>
          </figure>
        </div>
      </section>

      {/* 4. WILL IT HOLD UP. One of those sites on six computers, at night. */}
      <section aria-labelledby="wd-wall" className="bg-[var(--wd-night)] text-[#f3f1ea]">
        <div className="mx-auto max-w-[86rem] px-5 py-24 sm:px-8 md:py-32">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
            <Reveal>
              <h2 id="wd-wall" className={`${h2} max-w-[12ch]`}>
                Checked on every computer.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className={`${lead} max-w-[40ch] text-[#a9b4c6]`}>
                Most sites are only checked on one MacBook. Ledgerline&rsquo;s first pass had nine problems elsewhere:
                Safari overlapped the price, a small phone scrolled sideways, German text collided. All fixed before
                anyone saw it.
              </p>
            </Reveal>
          </div>
          <ul className="mt-14 grid list-none grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 md:mt-20">
            {DESKTOPS.map(([src, where]) => (
              <li key={src}>
                <Image src={S(src)} alt={`Ledgerline on ${where}.`} width={1440} height={900} sizes="(min-width: 640px) 28rem, 92vw" className="block aspect-[13/5] h-auto w-full rounded-[6px] object-cover object-left-top" />
                <p className="mt-3 text-[0.95rem] font-semibold">{where}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:grid-cols-4">
            {PHONES.map(([src, where, w, h]) => (
              <li key={src}>
                <Image src={S(src)} alt={`Ledgerline on ${where}.`} width={w} height={h} sizes="(min-width: 640px) 16rem, 30vw" className="block aspect-[9/14] h-auto w-full rounded-[6px] object-cover object-top" />
                <p className="mt-3 text-[0.95rem] font-semibold">{where}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. WHAT YOU GET, and the button again, on the site's own paper
          (saffron straight into the site's orange footer was two oranges). */}
      <div className="bg-[var(--paper)]">
        <section aria-labelledby="wd-get" className="mx-auto max-w-[86rem] px-5 pt-24 sm:px-8 md:pt-32">
          <h2 id="wd-get" className="sr-only">
            What you get
          </h2>
          <ul className="list-none border-t border-[rgba(11,31,58,0.16)]">
            {GET.map(([k, v]) => (
              <li key={k} className="grid grid-cols-1 gap-2 border-b border-[rgba(11,31,58,0.16)] py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-[first_baseline] md:gap-10 md:py-9">
                <h3 className="text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{k}</h3>
                <p className="max-w-[40ch] text-pretty text-[1.08rem] leading-[1.5] text-[#44546a]">{v}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id={CLOSE_ID} aria-labelledby="wd-close-title" className="scroll-mt-28 px-5 pb-28 pt-24 text-center sm:px-8 md:pb-40 md:pt-32">
          <h2 id="wd-close-title" className={`${display} mx-auto max-w-[12ch] text-[clamp(3rem,8.6vw,7.2rem)]`}>
            Make a site worth screenshotting.
          </h2>
          <div className="mt-10 flex justify-center">
            <FreeClaim productId={PRODUCT.id} reveal="I want it" tone="saffron" prompt={false} />
          </div>
          <p className="mt-1 text-[0.95rem] text-[#44546a]">For Claude Code on Mac, Windows and Linux.</p>
        </section>
      </div>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId="wd-top"
        closeId={CLOSE_ID}
        href="#claim"
        label="I want it"
        note="Free, sent by email"
        buttonClassName="bg-[#0b1f3a] text-[#fdf6ea]"
      />
    </main>
  );
}
