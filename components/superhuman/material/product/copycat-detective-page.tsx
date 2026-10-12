import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { COPYCAT_DETECTIVE as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * COPYCAT DETECTIVE, the skill, given away for an email.
 *
 * A small page for a small tool, in the receipt's own clothes: its paper, its
 * Geist and Geist Mono, its rubber-stamp red. The receipt at the top is a real
 * one the skill drew; the app on it (Sprout) and both accounts (@you,
 * @someone) were made up for this page, and the caption says so, because a
 * receipt naming a real account would be an accusation.
 *
 * Four short blocks: the promise with the receipt, what's on it (facts, not
 * verdicts), when it says no (the three refusals, as stamps), and the close.
 *
 * IMAGES ARE VERSIONED (-v2): Next's image cache keys by URL.
 */

const sans = Geist({ subsets: ["latin"], variable: "--cd-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--cd-mono", display: "swap" });

const CLOSE_ID = "cd-close";

const FACTS: [string, string, string][] = [
  ["01", "Who was first", "Read from the post’s own ID, to the second. Nobody can edit it, and it survives deletion."],
  ["02", "Whether they credited", "The post, the author’s own replies, the quote, the links. A name counts; “inspired by” on its own doesn’t."],
  ["03", "What matches", "The same video, the same colours, the same words, frame by frame. Only what you can point at in both."],
];

const NO: [string, string][] = [
  ["Just similar", "Same category, same trends, nothing specific to the original."],
  ["Credited", "They named the original. There’s nothing to call out."],
  ["Too close to call", "Under two days apart. Two people can have the same idea."],
];

const SOURCES = ["X", "App Store", "Google Play", "GitHub", "Any website", "YouTube", "TikTok", "Instagram", "Threads", "LinkedIn", "Screenshots"];

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

const kicker = "font-[family-name:var(--cd-mono)] text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#6a665c]";
const display = "font-bold tracking-[-0.045em] text-balance";

export function CopycatDetectivePage() {
  return (
    <main className={`${sans.variable} ${mono.variable} relative overflow-x-clip bg-[#f3f0e8] font-[family-name:var(--cd-sans)] text-[#121212]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. The promise, the button, and a receipt it drew. */}
      <section aria-labelledby="cd-title" className="px-4 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <p className={kicker}>Free skill for Claude Code</p>
          <h1 id="cd-title" className={`${display} mt-5 text-[clamp(3rem,10.5vw,6.4rem)] leading-[0.92]`}>
            Paste a link. Get the receipt.
          </h1>
          <p className="mt-6 max-w-[36ch] text-pretty text-[1.18rem] leading-[1.45] text-[#3d3a33] md:text-[1.3rem]">
            Copycat Detective finds the original, proves who posted first, checks for credit, and draws one picture you
            can post.
          </p>
          <div id="claim" className="mt-9 scroll-mt-28">
            <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="light" />
          </div>
          <div id="cd-top" aria-hidden className="h-px" />
        </div>

        <figure className="mx-auto mt-14 max-w-[72rem] md:mt-20">
          <div className="cd-slip overflow-hidden rounded-[clamp(10px,1.4vw,18px)] bg-[#f3f0e8] shadow-[0_0_0_1px_rgba(18,18,18,0.08),0_40px_80px_-40px_rgba(40,30,10,0.45),0_12px_24px_-12px_rgba(40,30,10,0.18)]">
            <Image
              src="/shop/copycat-detective/receipt-v2.webp"
              alt="A receipt drawn by Copycat Detective. On the left, FIRST: a plant-care app screen by @you, Oct 5, 2026. On the right, LATER: a near-identical screen by @someone, Oct 8, 2026. Beside them: Posted 2 days later, a red NO CREDIT stamp, and what matches: the same lime blob behind the countdown, the same 2 days until it needs water, the same dark 250 ml of water card, the same three plant-stat chips."
              width={2400}
              height={1350}
              sizes="(min-width: 1200px) 72rem, 100vw"
              unoptimized
              preload
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-4 text-center font-[family-name:var(--cd-mono)] text-[0.82rem] text-[#6a665c]">
            Drawn by Copycat Detective. The app and both accounts are made up for this page.
          </figcaption>
        </figure>
      </section>

      {/* 2. What's on it. */}
      <section aria-labelledby="cd-facts" className="border-t-2 border-dashed border-[#d9d4c8] px-4 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[72rem]">
          <h2 id="cd-facts" className={`${display} max-w-[14ch] text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[0.95]`}>
            Facts, not verdicts.
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty text-[1.12rem] leading-[1.5] text-[#3d3a33] md:text-[1.2rem]">
            Everything on the receipt can be checked by anyone who sees it. Nothing on it calls anyone a name.
          </p>
          <ol className="mt-12 grid list-none grid-cols-1 gap-x-10 p-0 md:mt-16 md:grid-cols-3">
            {FACTS.map(([n, k, v]) => (
              <li key={n} className="border-t-2 border-[#121212] py-7">
                <p className="font-[family-name:var(--cd-mono)] text-[0.85rem] font-semibold text-[#d2321f]">{n}</p>
                <h3 className="mt-3 text-[1.6rem] font-bold leading-[1.1] tracking-[-0.025em]">{k}</h3>
                <p className="mt-3 max-w-[34ch] text-pretty text-[1.05rem] leading-[1.5] text-[#3d3a33]">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. When it says no: the refusals, as stamps. */}
      <section aria-labelledby="cd-no" className="bg-[#121212] px-4 py-20 text-[#f3f0e8] sm:px-8 md:py-28">
        <div className="mx-auto max-w-[72rem]">
          <h2 id="cd-no" className={`${display} max-w-[16ch] text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[0.95]`}>
            No receipt for a look-alike.
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty text-[1.12rem] leading-[1.5] text-[#c9c4b8] md:text-[1.2rem]">
            Plenty of things that look copied aren&rsquo;t. When that&rsquo;s the case, it tells you why and draws
            nothing.
          </p>
          <ul className="mt-14 grid list-none grid-cols-1 gap-12 p-0 sm:grid-cols-3 sm:gap-8 md:mt-20">
            {NO.map(([k, v], i) => (
              <li key={k}>
                <span className="cd-stamp" style={{ "--r": `${[-4, 3, -2][i]}deg` } as React.CSSProperties}>
                  {k}
                </span>
                <p className="mt-6 max-w-[28ch] text-pretty text-[1.05rem] leading-[1.5] text-[#c9c4b8]">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. You decide, and the button again. */}
      <section id={CLOSE_ID} aria-labelledby="cd-close-title" className="scroll-mt-28 px-4 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
        <div className="mx-auto grid max-w-[72rem] grid-cols-1 items-start gap-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <h2 id="cd-close-title" className={`${display} max-w-[12ch] text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[0.95]`}>
              Then you tap Post.
            </h2>
            <p className="mt-5 max-w-[42ch] text-pretty text-[1.12rem] leading-[1.5] text-[#3d3a33] md:text-[1.2rem]">
              It writes a short post that names the original, puts the receipt on your clipboard, and opens X only
              when you say so. Nothing goes out until you tap Post.
            </p>
            <div className="mt-9">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="light" align="start" prompt={false} />
            </div>
            <p className="mt-6 max-w-[44ch] text-[0.95rem] leading-[1.5] text-[#6a665c]">
              Needs Claude Code, Node 18 or newer, and Chrome or Edge. Everything stays on your computer.
            </p>
          </div>

          <div>
            <div className="rounded-[18px] bg-white p-6 shadow-[0_0_0_1px_rgba(18,18,18,0.08),0_24px_48px_-28px_rgba(40,30,10,0.35)] sm:p-7">
              <p className={kicker}>The post it writes</p>
              <p className="mt-4 whitespace-pre-line text-[1.12rem] leading-[1.5]">
                {"@you posted this on Oct 5.\n\nThis came out 2 days later, with no credit."}
              </p>
              <div className="mt-5 overflow-hidden rounded-[12px] shadow-[0_0_0_1px_rgba(18,18,18,0.08)]">
                <Image
                  src="/shop/copycat-detective/receipt-v2.webp"
                  alt=""
                  width={2400}
                  height={1350}
                  sizes="(min-width: 768px) 30rem, 100vw"
                  unoptimized
                  className="block h-auto w-full"
                />
              </div>
            </div>
            <p className={`${kicker} mt-8`}>Reads links from</p>
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {SOURCES.map((s) => (
                <li key={s} className="rounded-full border border-[#d9d4c8] px-3 py-1.5 font-[family-name:var(--cd-mono)] text-[0.85rem] text-[#3d3a33]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId="cd-top"
        closeId={CLOSE_ID}
        href="#claim"
        label="Get it free"
        note="Free, sent by email"
      />
    </main>
  );
}
