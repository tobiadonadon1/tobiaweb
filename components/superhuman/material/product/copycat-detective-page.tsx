import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { COPYCAT_DETECTIVE as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { CopycatTool } from "./copycat-tool";

/**
 * COPYCAT DETECTIVE, used right here on the page.
 *
 * The page IS the tool: one field and a Check button at the top. Signing in
 * once is the only gate (that's how the address is kept); after that it just
 * runs. Under the field sits an example receipt until there's a real one.
 *
 * Below, the explanation is short and drawn rather than written: three steps
 * as little pictures (a link, the facts, the receipt), then the three verdicts
 * that get no receipt, as the receipt's own rubber stamps.
 *
 * The example receipt was drawn by the skill from a made-up app (Sprout) and
 * made-up accounts (@you, @someone), and the caption says so: a receipt naming
 * a real account would be an accusation.
 *
 * IMAGES ARE VERSIONED (-v2): Next's image cache keys by URL.
 */

const sans = Geist({ subsets: ["latin"], variable: "--cd-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--cd-mono", display: "swap" });

const NO: [string, string][] = [
  ["Just similar", "Same kind of app, same trends, nothing specific."],
  ["Credited", "They named the original. Nothing to call out."],
  ["Too close to call", "Under two days apart. Same idea, same week."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  author: { "@type": "Person", name: "Tobia Donadon" },
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

const kicker = "font-[family-name:var(--cd-mono)] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a665c]";
const display = "font-bold tracking-[-0.045em] text-balance";

/** Step one, drawn: the link you paste. */
function LinkArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6">
      <div className="flex items-center gap-2 rounded-full border border-[#d4cfc2] bg-white py-2 pl-4 pr-2 shadow-[0_10px_24px_-18px_rgba(40,30,10,0.5)]">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--cd-mono)] text-[0.82rem] text-[#3d3a33]">x.com/someone/status/2108…</span>
        <span className="rounded-full bg-[#121212] px-3 py-1.5 text-[0.78rem] font-semibold text-[#f3f0e8]">Check</span>
      </div>
      <p className="pl-4 font-[family-name:var(--cd-mono)] text-[0.75rem] text-[#8a8579]">or an App Store, GitHub or web link</p>
    </div>
  );
}

/** Step two, drawn: the three facts it checks. */
function FactsArt() {
  const row = (k: string, v: string, tone = "#121212") => (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#d9d4c8] py-2 last:border-b-0">
      <span className="font-[family-name:var(--cd-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[#6a665c]">{k}</span>
      <span className="text-[0.95rem] font-semibold" style={{ color: tone }}>{v}</span>
    </div>
  );
  return (
    <div className="flex h-full flex-col justify-center px-6">
      <div className="rounded-[14px] bg-white px-4 py-2 shadow-[0_10px_24px_-18px_rgba(40,30,10,0.5)]">
        {row("First", "Oct 5 · 16:28")}
        {row("Credit", "None", "#d2321f")}
        {row("Same", "4 things")}
      </div>
    </div>
  );
}

/** Step three, drawn: the receipt itself, small. */
function ReceiptArt() {
  return (
    <div className="flex h-full items-center justify-center px-5">
      <div className="w-full overflow-hidden rounded-[10px] shadow-[0_0_0_1px_rgba(18,18,18,0.08),0_14px_30px_-18px_rgba(40,30,10,0.55)]">
        <Image src="/shop/copycat-detective/receipt-v2.webp" alt="" width={2400} height={1350} sizes="(min-width: 768px) 22rem, 90vw" unoptimized className="block h-auto w-full" />
      </div>
    </div>
  );
}

const STEPS: [string, string, () => React.ReactElement][] = [
  ["Paste a link.", "A post, an app or a site. It finds the original for you.", LinkArt],
  ["It checks the facts.", "Who posted first, to the second. Whether they gave credit. What’s the same.", FactsArt],
  ["You get the receipt.", "One picture with both side by side, and a calm caption. You post it.", ReceiptArt],
];

export function CopycatDetectivePage() {
  return (
    <main className={`${sans.variable} ${mono.variable} relative overflow-x-clip bg-[#f3f0e8] font-[family-name:var(--cd-sans)] text-[#121212]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. The tool. */}
      <section aria-labelledby="cd-title" className="px-4 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <p className={kicker}>Copycat Detective</p>
          <h1 id="cd-title" className={`${display} mt-5 text-[clamp(2.9rem,9.5vw,5.8rem)] leading-[0.93]`}>
            Who posted it first?
          </h1>
          <p className="mt-5 max-w-[34ch] text-pretty text-[1.15rem] leading-[1.45] text-[#3d3a33] md:text-[1.25rem]">
            Paste a link. Get the receipt: who was first, whether they gave credit, and what&rsquo;s the same.
          </p>
        </div>
        <div className="mt-10">
          <CopycatTool
            example={
              <figure className="mx-auto w-full">
                <div className="overflow-hidden rounded-[clamp(10px,1.4vw,18px)] shadow-[0_0_0_1px_rgba(18,18,18,0.08),0_40px_80px_-40px_rgba(40,30,10,0.45),0_12px_24px_-12px_rgba(40,30,10,0.18)]">
                  <Image
                    src="/shop/copycat-detective/receipt-v2.webp"
                    alt="An example receipt. On the left, FIRST: a plant-care app screen by @you, Oct 5, 2026. On the right, LATER: a near-identical screen by @someone, Oct 8, 2026. Beside them: Posted 2 days later, a red NO CREDIT stamp, and what matches: the same lime blob behind the countdown, the same 2 days until it needs water, the same dark 250 ml of water card, the same three plant-stat chips."
                    width={2400}
                    height={1350}
                    sizes="(min-width: 1200px) 72rem, 100vw"
                    unoptimized
                    preload
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-4 text-center font-[family-name:var(--cd-mono)] text-[0.8rem] text-[#6a665c]">
                  An example receipt. The app and both accounts are made up.
                </figcaption>
              </figure>
            }
          />
        </div>
      </section>

      {/* 2. How it works, in three pictures. */}
      <section aria-labelledby="cd-how" className="border-t-2 border-dashed border-[#d9d4c8] px-4 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[72rem]">
          <h2 id="cd-how" className={`${display} text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[0.98]`}>How it works</h2>
          <ol className="mt-10 grid list-none grid-cols-1 gap-6 p-0 md:mt-14 md:grid-cols-3">
            {STEPS.map(([title, line, Art], i) => (
              <li key={title} className="flex flex-col overflow-hidden rounded-[22px] bg-[#e9e5da]">
                <div className="h-[11.5rem]" aria-hidden>
                  <Art />
                </div>
                <div className="flex flex-1 flex-col bg-[#f8f6f0] p-6">
                  <p className="font-[family-name:var(--cd-mono)] text-[0.8rem] font-semibold text-[#d2321f]">0{i + 1}</p>
                  <h3 className="mt-2 text-[1.45rem] font-bold leading-[1.1] tracking-[-0.025em]">{title}</h3>
                  <p className="mt-2 text-pretty text-[1rem] leading-[1.5] text-[#3d3a33]">{line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. When it says no: the refusals, as stamps. */}
      <section aria-labelledby="cd-no" className="bg-[#121212] px-4 py-20 text-[#f3f0e8] sm:px-8 md:py-24">
        <div className="mx-auto max-w-[72rem]">
          <h2 id="cd-no" className={`${display} max-w-[16ch] text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[0.98]`}>
            No receipt for a look-alike.
          </h2>
          <p className="mt-4 max-w-[42ch] text-pretty text-[1.08rem] leading-[1.5] text-[#c9c4b8]">
            Plenty of things that look copied aren&rsquo;t. Then it tells you why, and draws nothing.
          </p>
          <ul className="mt-12 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3 sm:gap-8 md:mt-16">
            {NO.map(([k, v], i) => (
              <li key={k}>
                <span className="cd-stamp" style={{ "--r": `${[-4, 3, -2][i]}deg` } as React.CSSProperties}>
                  {k}
                </span>
                <p className="mt-5 max-w-[28ch] text-pretty text-[1rem] leading-[1.5] text-[#c9c4b8]">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Back to the tool. */}
      <section aria-labelledby="cd-close" className="px-4 pb-28 pt-20 text-center sm:px-8 md:pb-36 md:pt-24">
        <h2 id="cd-close" className={`${display} mx-auto max-w-[18ch] text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[0.98]`}>
          Seen something familiar?
        </h2>
        <p className="mx-auto mt-4 max-w-[38ch] text-pretty text-[1.08rem] leading-[1.5] text-[#3d3a33]">
          Sign in once and check whenever you like. Nothing is posted for you.
        </p>
        <a
          href="#check"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#121212] px-7 py-3.5 text-[1.05rem] font-semibold text-[#f3f0e8] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
        >
          Check a link
        </a>
      </section>
    </main>
  );
}
