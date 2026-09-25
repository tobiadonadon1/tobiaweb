import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { LAUNCHR as PRODUCT } from "@/lib/shop/products";
import { Specimen } from "../specimens";
import { folderHref } from "../material-data";
import { BuyForm } from "./buy-form";
import { Commands } from "./commands";
import { LaunchrStage } from "./launchr-stage";
import { StickyBuy } from "./sticky-buy";

/**
 * LAUNCHR, the second thing on this site with a price.
 *
 * Built from scrollcraft/builds/launchr/BRIEF.md. Five parts, in the order a
 * buyer's questions come up:
 *
 *   1. Does it make something good?   The pinned stage: real films on a 3D
 *                                     device, the buy button on screen one.
 *   2. Why pay for it?                What it replaces, three rows.
 *   3. Is it easy?                    Three steps and the conversation.
 *   4. The leftover questions.
 *   5. Buy. It holds still.
 *
 * Copy rules as on The 98¢ Trade: no dashes, no three-beat slogans, one thing
 * per sentence. No competitor names or prices: nothing here can be checked
 * against a number that changes next month. Every claim about the films is
 * from the product's own example briefs (what each was made from).
 */

const CLOSE_ID = "buy-close";

const h2 =
  "text-balance font-serif text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)]";

const REPLACES: { who: string; what: string; ours?: boolean }[] = [
  {
    who: "An editor or an agency",
    what: "A brief, a quote, a wait, then rounds of revisions. For every video you need.",
  },
  {
    who: "An AI video subscription",
    what: "A bill every month, and still hours of prompting and editing to get something that looks like your brand.",
  },
  {
    who: "Launchr",
    what: `${PRODUCT.priceLabel} once. A new video for every feature, update or campaign, made from your own logo, photos and screens.`,
    ours: true,
  },
];

const CHAT: { who: "you" | "claude" | "done"; text: string; answer?: string }[] = [
  { who: "you", text: "/launchr" },
  { who: "claude", text: "What are you launching?", answer: "Physical product" },
  { who: "claude", text: "Where will it be posted?", answer: "Vertical 9:16" },
  { who: "claude", text: "How long?", answer: "20 s" },
  { who: "claude", text: "Drag in your logo and product photos." },
  { who: "done", text: "Cut out your product and read your brand colours" },
  { who: "done", text: "Checked every frame" },
  { who: "done", text: "launch.mp4 saved to Launchr Videos" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need to know video editing, or code?",
    a: "No. You answer a few questions and drag in your files. Claude makes the creative decisions, checks every frame and renders the MP4.",
  },
  {
    q: "How many videos can I make?",
    a: "As many as you want. There are no credits and no subscription, and the videos render on your own computer. Making them uses your Claude plan, like any other work in Claude Code.",
  },
  {
    q: "What if my product photos aren't great?",
    a: "Photos on a plain background work best. With only a logo, or nothing at all, it builds the launch from type, shapes and your brand colours.",
  },
  {
    q: "Can I use the videos commercially?",
    a: "Yes. The music is composed for each video and the fonts are open-licensed. No stock footage, no licensed tracks, no watermark.",
  },
  {
    q: "What do I need?",
    a: "A Mac (Windows and Linux should work but haven't been tested yet), Claude Code with a paid Claude plan, and Node.js 18 or newer. Claude tells you if anything is missing.",
  },
  {
    q: "How do I get it?",
    a: "The download opens right after you pay, and the link is emailed to you as well. If you buy on your phone, open the email on your computer.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  image: abs(`/shop/launchr/premium.jpg`),
  url: abs(PRODUCT.href),
  brand: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: (PRODUCT.priceCents / 100).toFixed(2),
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

export function LaunchrPage() {
  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" tone="ink" />

      {/* 1. IT MAKES SOMETHING GOOD. */}
      <LaunchrStage />

      {/* 2. WHY PAY FOR IT. Heading trails, rows lead. */}
      <section aria-labelledby="replaces-title" className="border-y border-[var(--hairline)] bg-[rgba(255,255,255,0.35)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 id="replaces-title" className={`${h2} max-w-[13ch]`}>
              Stop paying for every video
            </h2>
            <p className="mt-5 max-w-[36ch] text-pretty text-[1.05rem] leading-[1.65] text-[color:rgba(11,31,58,0.72)]">
              No stock footage, no licensed music, no watermark. Every video and
              its soundtrack is yours to use commercially.
            </p>
          </div>
          <ul className="list-none">
            {REPLACES.map((r) => (
              <li
                key={r.who}
                className={
                  r.ours
                    ? "mt-3 rounded-2xl bg-[var(--ink)] p-6 text-[var(--paper)] shadow-[0_30px_60px_-36px_rgba(11,31,58,0.7)] md:p-7"
                    : "border-t border-[var(--hairline)] py-6 first:border-t-0 first:pt-0"
                }
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={`text-[1.3rem] tracking-[-0.02em] md:text-[1.45rem] ${r.ours ? "" : "text-[color:rgba(11,31,58,0.55)] line-through decoration-[rgba(206,70,49,0.7)] decoration-2"}`}>
                    {r.who}
                  </h3>
                  {r.ours ? (
                    <span className="font-serif text-[2rem] leading-none tracking-[-0.03em] text-[#f07a5f]">{PRODUCT.priceLabel}</span>
                  ) : null}
                </div>
                <p className={`mt-2 max-w-[48ch] text-pretty text-[1rem] leading-[1.6] ${r.ours ? "text-[rgba(250,248,242,0.8)]" : "text-[color:rgba(11,31,58,0.66)]"}`}>
                  {r.what}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. IS IT EASY. Steps lead, the conversation trails. */}
      <section aria-labelledby="setup-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="setup-title" className={`${h2} max-w-[12ch]`}>
              Ten minutes, start to finish
            </h2>
            <ol className="mt-10 list-none border-b border-[var(--hairline)]">
              {[
                "Download the folder and unzip it.",
                "Open a terminal in the folder, type claude, then hi. It installs itself in about two minutes.",
                "Type /launchr, answer a few questions and drag in your files. About ten minutes later the MP4 is on your Desktop.",
              ].map((s, i) => (
                <li key={i} className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-4 text-[1.04rem] leading-[1.55] text-[var(--ink)]">
                  <span className="w-6 shrink-0 font-mono text-[0.78rem] tracking-[0.1em] text-[var(--accent-clay-text)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <Commands text={s} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.6] text-[color:rgba(11,31,58,0.62)]">
              Want changes? Say &ldquo;shorter headline&rdquo;, &ldquo;try dark
              premium&rdquo; or &ldquo;now a vertical version&rdquo; and it
              renders again.
            </p>
          </div>

          <Reveal>
            <div className="overflow-hidden rounded-2xl bg-[var(--ink)] shadow-[0_30px_60px_-30px_rgba(11,31,58,0.6)]">
              <div className="flex items-center gap-2 border-b border-[rgba(250,248,242,0.1)] px-5 py-3.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2.5 w-2.5 rounded-full bg-[rgba(250,248,242,0.22)]" />
                ))}
                <span className="ml-3 font-mono text-[0.7rem] text-[rgba(250,248,242,0.5)]">claude</span>
              </div>
              <div className="space-y-3 p-5 font-mono text-[0.84rem] leading-[1.5] md:p-6 md:text-[0.9rem]">
                {CHAT.map((c, i) =>
                  c.who === "you" ? (
                    <p key={i} className="text-[var(--paper)]">
                      <span className="text-[#f07a5f]">&gt;</span> {c.text}
                    </p>
                  ) : c.who === "claude" ? (
                    <div key={i}>
                      <p className="text-[rgba(250,248,242,0.8)]">{c.text}</p>
                      {c.answer ? (
                        <p className="mt-1 inline-block rounded-md bg-[rgba(250,248,242,0.1)] px-2 py-0.5 text-[var(--paper)]">{c.answer}</p>
                      ) : null}
                    </div>
                  ) : (
                    <p key={i} className="text-[rgba(250,248,242,0.8)]">
                      <span className="text-[#8fd6a8]">✓</span> {c.text}
                    </p>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. THE LEFTOVER QUESTIONS. */}
      <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-6 pb-24 md:pb-32">
        <h2 id="faq-title" className={h2}>
          Questions
        </h2>
        <dl className="mt-10 border-b border-[var(--hairline)]">
          {FAQ.map((f) => (
            <div key={f.q} className="border-t border-[var(--hairline)] py-6">
              <dt className="text-[1.15rem] tracking-[-0.01em] text-[var(--ink)]">{f.q}</dt>
              <dd className="mt-2 max-w-[60ch] text-pretty text-[1rem] leading-[1.65] text-[color:rgba(11,31,58,0.7)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5. BUY. Centred, still, and it holds. */}
      <section id={CLOSE_ID} aria-labelledby="close-title" className="scroll-mt-28 border-t border-[var(--hairline)] px-6 py-24 text-center md:py-32">
        <Specimen id={PRODUCT.id} instance="close" className="mx-auto h-auto w-[150px] md:w-[180px]" />
        <h2 id="close-title" className={`${h2} mx-auto mt-6 max-w-[16ch]`}>
          Make your first launch video tonight
        </h2>
        <p className="mx-auto mt-5 font-serif text-[3rem] leading-none tracking-[-0.04em] text-[var(--ink)]">{PRODUCT.priceLabel}</p>
        <p className="mx-auto mt-3 max-w-[40ch] text-[1rem] text-[color:rgba(11,31,58,0.66)]">
          One payment. As many videos as you want. Instant download.
        </p>
        <div className="mt-8 flex justify-center">
          <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} />
        </div>
      </section>

      <StickyBuy productId={PRODUCT.id} name={PRODUCT.name} price={PRODUCT.priceLabel} heroId="launchr-top" closeId={CLOSE_ID} />
    </main>
  );
}
