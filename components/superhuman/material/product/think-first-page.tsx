import { Geist, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { THINK_FIRST as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { ThinkFirstLoader } from "./think-first-loader";
import { ThinkFirstDemo } from "./think-first-demo";
import { ThinkFirstTemplate } from "./think-first-template";
import "./think-first.css";

/**
 * THINK-FIRST: the page the THINK comments are sent to. Tobia's X article
 * "how to keep thinking when AI does the work" ends "comment THINK and i'll
 * send you both": the blueprint PDF and the think-first skill. This page hands
 * over both, free, in one download.
 *
 * THE BRIEF (Tobia, 2026-11-06): techy, glassmorphism, liquid glass, strong
 * colours. Soft sand #F0E5DB is the background, every word is mocha green
 * #474329, the highlights and the lighting are watermelon pink #FC75B4.
 * Premium, straight-up value, no bluff, nothing that isn't needed: so five
 * blocks. The phrase and the button; the skill playing real output; the line
 * the article is built on; what's in the download, with the PDF's real pages;
 * page 1's prompt itself, copyable (think-first-prompt.ts, generated from the
 * PDF's source); the close. After the PDF changes, run
 * ~/Desktop/think-first/package/refresh-site.sh and commit what it wrote.
 *
 * THE DOWNLOAD (think-first.zip, built by ~/Desktop/think-first/package/
 * build.sh) installs itself: open a terminal in it, type claude, then hi.
 */

const sans = Geist({ subsets: ["latin"], variable: "--tf-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--tf-mono", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "tf-close";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs(PRODUCT.href) },
};

/** The PDF's four pages, as they are (pages exported from think-first-blueprint.pdf). */
const PAGES = [
  { n: "01", title: "The prompt", body: "The one I fill in before I build anything. Every bracket is a decision." },
  { n: "02", title: "Filled in, twice", body: "A meal planner from zero, and the weather app from the article." },
  { n: "03", title: "Why it works", body: "What each part does for the agent, from Anthropic's and OpenAI's prompting guides." },
  { n: "04", title: "Using it", body: "Claude Code habits, a prompt to paste while it works and one for when it says done, the 2-correction rule." },
];

/** Where each page sits in the fan: sideways, and a tilt. */
const FAN = [
  { x: "-7.4rem", r: "-7deg" },
  { x: "-2.5rem", r: "-2.4deg" },
  { x: "2.5rem", r: "2.4deg" },
  { x: "7.4rem", r: "7deg" },
];

const FLOW: [string, string][] = [
  ["Clear prompt", "No questions. It tells you in 2 lines exactly what it will build, then builds it."],
  ["Vague prompt", "Up to 3 short, specific questions first, with options. You answer in a second."],
  ["Small task", "A fix, a rename, a question: it stays out of the way."],
];

const STEPS = ["Get it free", "Unzip it, type claude, then hi", "Fill the prompt before your next build"];

export function ThinkFirstPage() {
  return (
    <main className={`tf-page ${sans.variable} ${mono.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {/* The opening plays once per visit: a return in the same session skips it before the first paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("tf-intro")){window.__tfSkipIntro=1;var s=document.createElement("style");s.textContent=".tf-load{display:none!important}.tf-rise,.tf-hl--draw{animation-delay:0s!important}";document.head.appendChild(s)}}catch(e){}`,
        }}
      />
      <ThinkFirstLoader />
      {/* Sticky, not fixed: it ends with the page, so the site's footer shows under it. */}
      <div className="tf-skywrap" aria-hidden>
        <div className="tf-sky">
          <span className="tf-light tf-light--a" />
          <span className="tf-light tf-light--b" />
          <span className="tf-light tf-light--c" />
          <span className="tf-grid" />
          <span className="tf-grain" />
        </div>
      </div>
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 01. THE PHRASE, THE BUTTON, THE SKILL PLAYING. */}
      <section aria-labelledby="tf-title">
        <div className="mx-auto grid max-w-[78rem] grid-cols-1 items-center gap-x-14 gap-y-12 px-5 pb-20 pt-28 sm:px-8 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:pb-16 lg:pt-32">
          <div className="tf-rise">
            <p className="tf-pill">
              <span className="tf-diamond" aria-hidden />
              Free · the blueprint PDF + the skill
            </p>
            <h1 id="tf-title" className="tf-h1 mt-7">
              <span className="tf-hl tf-hl--draw whitespace-nowrap">Think first.</span>
              <br />
              <span className="whitespace-nowrap">Then hit enter.</span>
            </h1>
            <p className="mt-7 max-w-[30ch] text-pretty text-[1.18rem] leading-[1.5] sm:text-[1.3rem]">
              The prompt I fill in before I build anything, and a Claude Code skill that does the thinking with you. So the first build is the one you meant.
            </p>
            <div id={HERO_ID} className="mt-9 scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} reveal="Get both free" tone="sand" align="start" prompt={false} quiet buttonClassName="tf-cta" />
            </div>
            <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
              {["4-page PDF", "Claude Code skill", "1-minute install"].map((t) => (
                <li key={t} className="tf-chip">{t}</li>
              ))}
            </ul>
          </div>
          <ThinkFirstDemo />
        </div>
      </section>

      {/* 02. THE LINE THE ARTICLE IS BUILT ON. */}
      <section aria-label="Leave a line blank and the AI fills it with the average." className="tf-stop">
        <p className="tf-phrase">
          Leave a line blank and the AI fills it with <span className="tf-hl">the average.</span>
        </p>
      </section>

      {/* 03. WHAT'S IN THE DOWNLOAD. */}
      <section aria-labelledby="tf-get">
        <div className="mx-auto max-w-[78rem] px-5 pb-24 sm:px-8 md:pb-32">
          <p className="tf-label">One download, two things</p>
          <h2 id="tf-get" className="tf-h2 mt-4 max-w-[18ch]">
            The thinking, on paper <span className="tf-hl">and in your terminal.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <article className="tf-glass tf-card" aria-labelledby="tf-pdf">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 id="tf-pdf" className="m-0 text-[1.6rem] font-medium tracking-[-0.03em]">The blueprint</h3>
                <span className="tf-mono text-[0.78rem]">PDF · 4 pages</span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-8">
                <div className="tf-pages" aria-label="The four pages">
                  {PAGES.map((p, i) => (
                    <a
                      key={p.n}
                      href={`/shop/think-first/page-${i + 1}.webp`}
                      target="_blank"
                      rel="noopener"
                      className="tf-page-img"
                      style={{ "--x": FAN[i].x, "--r": FAN[i].r, "--z": i } as React.CSSProperties}
                      aria-label={`Page ${i + 1}: ${p.title}, full size`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/shop/think-first/page-${i + 1}.webp`} alt="" width={1000} height={1416} loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
                <ol className="tf-list">
                  {PAGES.map((p) => (
                    <li key={p.n}>
                      <span className="tf-num">{p.n}</span>
                      <h4 className="m-0 text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.015em]">{p.title}</h4>
                      <p>{p.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            <article className="tf-glass tf-card lg:self-start" aria-labelledby="tf-skill">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 id="tf-skill" className="m-0 text-[1.6rem] font-medium tracking-[-0.03em]">think-first</h3>
                <span className="tf-mono text-[0.78rem]">Claude Code skill</span>
              </div>
              <p className="mt-3 text-[1rem] leading-[1.5] text-[color:var(--tf-soft)]">
                The blueprint, done with you as you prompt. It reads your project first, so it never asks what it could look up.
              </p>
              <ul className="tf-flow mt-6">
                {FLOW.map(([k, v]) => (
                  <li key={k}>
                    <b>{k}</b>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <p className="tf-modes m-0">
                <strong className="font-semibold">Two modes, off until you say so.</strong> <span className="tf-mono text-[0.85em]">during</span> lists every decision it made that you didn&rsquo;t.{" "}
                <span className="tf-mono text-[0.85em]">after</span> checks the result against your finish line.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 04. THE PARAGRAPH, TO TAKE NOW. */}
      <section aria-labelledby="tf-para">
        <div className="mx-auto max-w-[78rem] px-5 pb-24 sm:px-8 md:pb-32">
          <p className="tf-label">Page 1, right here</p>
          <h2 id="tf-para" className="tf-h2 mt-4 max-w-[20ch]">
            Hard to fill a bracket? <span className="tf-hl">That&rsquo;s where to think.</span>
          </h2>
          <div className="mt-10">
            <ThinkFirstTemplate />
          </div>
        </div>
      </section>

      {/* 05. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="tf-close-title" className="scroll-mt-28">
        <div className="mx-auto max-w-[78rem] px-5 pb-36 sm:px-8 md:pb-44">
          <div className="tf-glass tf-glass--lit tf-close">
            <h2 id="tf-close-title" className="tf-h2 mx-auto max-w-[16ch]">
              Know what you want <span className="tf-hl">before you hit enter.</span>
            </h2>
            <ol className="mx-auto mt-9 flex list-none flex-wrap justify-center gap-2.5 p-0">
              {STEPS.map((s, i) => (
                <li key={s} className="tf-step">
                  <span className="tf-step__n">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div id="claim" className="mt-10 flex scroll-mt-28 justify-center">
              <FreeClaim productId={PRODUCT.id} reveal="Get both free" tone="sand" prompt={false} quiet buttonClassName="tf-cta" />
            </div>
            <p className="mx-auto mt-4 max-w-[46ch] text-balance text-[0.9rem] leading-[1.5]">
              Free. It downloads now, and a copy comes by email. Needs Claude Code; the PDF opens anywhere.
            </p>
          </div>
        </div>
      </section>

      <StickyBuy
        productId={PRODUCT.id}
        name="The blueprint + think-first"
        price={PRODUCT.priceLabel}
        heroId={HERO_ID}
        closeId={CLOSE_ID}
        href="#claim"
        label="Get both free"
        note="Free, downloads at once"
        buttonClassName="bg-[#474329] text-[#F0E5DB] shadow-[0_10px_26px_-8px_rgba(252,117,180,0.95)]"
        colors={{ name: "text-[#474329]", note: "text-[rgba(71,67,41,0.86)]", bar: "border-[rgba(255,255,255,0.9)] bg-[rgba(246,238,230,0.92)] shadow-[0_18px_44px_-18px_rgba(252,117,180,0.7)]" }}
      />
    </main>
  );
}
