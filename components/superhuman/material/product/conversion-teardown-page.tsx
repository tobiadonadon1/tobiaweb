import Image from "next/image";
import { Archivo, Geist_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { CONVERSION_TEARDOWN as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * CONVERSION TEARDOWN, a free skill for Claude Code that scores any landing
 * page out of 20 and writes the fixes. Free for an email, downloading at once.
 *
 * THE LOOK IS THE REPORT'S OWN (Tobia, 2026-10-31: "the usual page, a
 * different style"): signal yellow and ink, the colours of the score card the
 * skill draws, so the page looks like the thing it gives you. Wide Archivo for
 * the numbers, Geist Mono for the labels, black buttons with white words.
 *
 * EVERYTHING SHOWN IS REAL: the cards and the report are the skill's own
 * output on real pages (cal.com, linear.app and this site's Meta Ads page),
 * captured on the date they say. The scores are the skill's judgment against
 * its rubric, and the page says so; no conversion lift is promised.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--ct-archivo", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--ct-mono", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "ct-close";
const S = (name: string) => `/shop/conversion-teardown/${name}`;

const YELLOW = "#FFDD1F";
const PAPER = "#F3F1EA";
const DISPLAY = "font-[family-name:var(--ct-archivo)] font-extrabold tracking-[-0.025em] [font-variation-settings:'wdth'_100]";
const NUMERAL = "font-[family-name:var(--ct-archivo)] font-black tracking-[-0.02em] [font-variation-settings:'wdth'_75]";

/** The example on the page: the skill's real output on cal.com, with the date it was captured. */
const EXAMPLES = {
  cal: { site: "cal.com", score: 14, date: "31 Oct 2026", fix: "Say what happens after Sign up with Google" },
};

const CHECKS: { name: string; ask: string; two: string }[] = [
  { name: "Clarity", ask: "What is it, and is it for me?", two: "A stranger gets what it is and who it's for in five seconds." },
  { name: "Value", ask: "Why should I care?", two: "A specific outcome, and a reason it beats what they do now." },
  { name: "Main action", ask: "What do I do now?", two: "One button that stands out, on desktop and on the phone." },
  { name: "Friction", ask: "What does yes cost me?", two: "Free? Card? How long? Said right by the button." },
  { name: "Proof", ask: "Why should I believe you?", two: "Named people, real numbers, early and next to the claims." },
  { name: "Show it", ask: "Show me, don't tell me.", two: "The product doing its job, not decoration." },
  { name: "Objections", ask: "But what about …?", two: "The real doubts answered where they come up." },
  { name: "Focus", ask: "One page, one job.", two: "Everything pushes toward the one action." },
  { name: "Copy", ask: "Written for the reader?", two: "The headings alone tell the story, in the customer's words." },
  { name: "Phone & speed", ask: "Does it work where people are?", two: "The first phone screen works and loads fast." },
];

const STEPS: React.ReactNode[] = [
  <>Get it free. It downloads at once.</>,
  <>
    Open a terminal in the folder, type <q className="font-semibold text-black">claude</q>, then{" "}
    <q className="font-semibold text-black">hi</q>. It installs itself.
  </>,
  <>
    Type <q className="font-semibold text-black">tear down</q>{" "}and any link: yours, a competitor&rsquo;s, or localhost.
  </>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "macOS, Windows, Linux",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs(PRODUCT.href) },
};

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--ct-mono)] text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

/** Two cells, the way the report draws a check's score. */
function Meter({ score, light = false }: { score: number; light?: boolean }) {
  const on = light ? "bg-[#FFDD1F]" : "bg-[#0B0B0B]";
  const line = light ? "border-[#FFDD1F]" : "border-[#0B0B0B]";
  return (
    <span aria-hidden className="inline-flex gap-1">
      {[1, 2].map((n) => (
        <i key={n} className={`block h-3.5 w-6 rounded-[3px] border-2 ${line} ${score >= n ? on : ""}`} />
      ))}
    </span>
  );
}

export function ConversionTeardownPage() {
  return (
    <main className={`${archivo.variable} ${mono.variable} relative overflow-x-clip text-[#0B0B0B]`} style={{ background: PAPER }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("setups")} label="Setups" />

      {/* 001. THE POSTER: the promise, the button, a real card. */}
      <section aria-labelledby="ct-title" className="relative isolate border-b-[3px] border-[#0B0B0B]" style={{ background: YELLOW }}>
        <div className="mx-auto flex min-h-[100svh] max-w-[90rem] flex-col px-5 pb-14 pt-24 sm:px-8 md:pt-28">
          <div className="flex items-start justify-between gap-4">
            <Mono>
              Free<span className="hidden sm:inline"> · downloads at once</span>
            </Mono>
            <Mono className="hidden text-center lg:block">A teardown in about 3 minutes</Mono>
            <Mono className="text-right">Skill for Claude Code</Mono>
          </div>

          <div className="mt-10 grid flex-1 grid-cols-1 items-center gap-x-14 gap-y-12 md:mt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)]">
            <div>
              <h1 id="ct-title" className={`text-[clamp(3.2rem,8.4vw,8.2rem)] leading-[0.88] ${DISPLAY}`}>
                <span className="block">Your page,</span>
                <span className="block">
                  out of <span className={NUMERAL}>20.</span>
                </span>
              </h1>
              <p className="mt-7 max-w-[36ch] text-pretty text-[1.15rem] font-medium leading-[1.45] sm:text-[1.3rem]">
                Paste a link. Claude opens it on desktop and phone, scores 10 checks with the page&rsquo;s own words as
                evidence, and writes the fixes, ready to paste.
              </p>
              <div id={HERO_ID} className="mt-8 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="ember" align="start" quiet />
              </div>
            </div>

            <figure>
              <div className="overflow-hidden rounded-[0.9rem] border-[3px] border-[#0B0B0B] bg-[#FFDD1F] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)]">
                <Image
                  src={S("card-cal-v1.webp")}
                  alt={`A Conversion Teardown score card for cal.com: ${EXAMPLES.cal.score} out of 20, the first screen with numbered pins, the ten checks as a meter, and three fixes, starting with "${EXAMPLES.cal.fix}".`}
                  width={2400}
                  height={1350}
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-3">
                <Mono className="opacity-75">
                  The card it draws · a real teardown of {EXAMPLES.cal.site}, {EXAMPLES.cal.date}
                </Mono>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 002. THE TEN CHECKS. */}
      <section aria-labelledby="ct-checks" className="bg-[#0B0B0B] text-white">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <h2 id="ct-checks" className={`max-w-[13ch] text-[clamp(2.6rem,6.6vw,5.6rem)] leading-[0.92] ${DISPLAY}`}>
              Ten questions every visitor <span style={{ color: YELLOW }}>asks.</span>
            </h2>
            <p className="max-w-[40ch] text-pretty text-[1.1rem] font-medium leading-[1.5] text-white/70 md:pb-2">
              Each scored 0, 1 or 2 against a fixed rubric. Every point needs evidence: a quote from the page or a number
              it measured. A quote that isn&rsquo;t on the page word for word is refused.
            </p>
          </div>
          <ol className="mt-12 grid list-none grid-cols-2 gap-px overflow-hidden rounded-[1.2rem] border border-white/15 bg-white/15 p-0 lg:grid-cols-5 md:mt-16">
            {CHECKS.map((c, i) => (
              <li key={c.name} className="flex flex-col bg-[#0B0B0B] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
                <div className="flex items-center justify-between">
                  <Mono className="text-white/55">{String(i + 1).padStart(2, "0")}</Mono>
                  <Meter score={2} light />
                </div>
                <h3 className={`mt-4 text-[1.25rem] leading-[1.05] sm:text-[1.5rem] ${DISPLAY}`}>{c.name}</h3>
                <p className="mt-1.5 text-[0.98rem] font-semibold leading-[1.35]" style={{ color: YELLOW }}>
                  {c.ask}
                </p>
                <p className="mt-3 text-[0.92rem] leading-[1.45] text-white/62">
                  <span className="text-white/85">2 of 2:</span> {c.two}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[62ch] text-[0.95rem] leading-[1.5] text-white/55">
            A polished SaaS page usually lands between 11 and 15. With a TypeSafe key, Jev gives every page an
            independent second score, and the checks where the two disagree get a second look.
          </p>
        </div>
      </section>

      {/* 003. WHAT COMES BACK: not advice, the new words. */}
      <section aria-labelledby="ct-back">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <h2 id="ct-back" className={`max-w-[12ch] text-[clamp(2.6rem,6.6vw,5.6rem)] leading-[0.92] ${DISPLAY}`}>
              Not advice. The new words.
            </h2>
            <p className="max-w-[40ch] text-pretty text-[1.1rem] font-medium leading-[1.5] text-black/70 md:pb-2">
              Every fix quotes what&rsquo;s there, writes what should replace it, and says why. Ranked, so you know which
              three to do this week.
            </p>
          </div>

          <figure className="mt-12 md:mt-16">
            <div className="overflow-hidden rounded-[1.2rem] border-[3px] border-[#0B0B0B] bg-white">
              <Image
                src={S("report-fixes-v1.webp")}
                alt="Fix 1 from the report for cal.com: say what happens after Sign up with Google. What's wrong, the fix, the line 'No credit card required' struck through beside its replacement 'Free for individuals · No credit card required / Next: connect your calendar, set your hours, share your link.', why it helps, and a zoomed crop of the line on the page."
                width={2232}
                height={1386}
                sizes="(min-width: 1280px) 80rem, 100vw"
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mt-3">
              <Mono className="opacity-70">From the report · {EXAMPLES.cal.site}, {EXAMPLES.cal.date}</Mono>
            </figcaption>
          </figure>

          <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["The score", "Out of 20, each check with its evidence, and what the page already does well."],
              ["The fixes", "5 to 8, ranked by impact and effort, the before and after written out."],
              ["Three new first screens", "Headline, subhead and button, written three ways: outcome, edge, pain."],
              ["The card", "Sized for X, with the page's first screen and numbered pins on what to fix."],
            ].map(([k, v]) => (
              <li key={k} className="rounded-[1.1rem] border-[2.5px] border-[#0B0B0B] bg-white px-5 pb-5 pt-4">
                <h3 className={`text-[1.3rem] leading-[1.1] ${DISPLAY}`}>{k}</h3>
                <p className="mt-2 text-[0.98rem] leading-[1.45] text-black/70">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 004. THEN IT GOES DEEPER. */}
      <section aria-labelledby="ct-deeper" className="border-y-[3px] border-[#0B0B0B]" style={{ background: YELLOW }}>
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-28 md:pt-24">
          <h2 id="ct-deeper" className={`max-w-[16ch] text-[clamp(2.6rem,6.6vw,5.6rem)] leading-[0.92] ${DISPLAY}`}>
            Then say what you want next.
          </h2>
          <ul className="mt-12 grid list-none grid-cols-1 gap-x-10 gap-y-8 p-0 md:grid-cols-2">
            {[
              ["“Fix it in my code.”", "It makes the fixes in your project, runs it, photographs it and scores it again, then draws the before and after. It never pushes or deploys: you review and ship."],
              ["“Rewrite the whole page.”", "Section by section, the current words and the new ones, in your voice, with your real facts. Anything only you know stays a [slot] until you fill it."],
              ["“Score every reply.”", "Post a teardown, ask people for their links, paste them all. Each gets a score, a card and a short reply with its biggest fix."],
              ["“Me against my competitors.”", "Your page and theirs on the same 10 checks, so you see exactly where they win and where you can."],
            ].map(([k, v]) => (
              <li key={k} className="border-t-[3px] border-[#0B0B0B] pt-5">
                <h3 className={`text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.05] ${DISPLAY}`}>{k}</h3>
                <p className="mt-3 max-w-[48ch] text-[1.05rem] font-medium leading-[1.5] text-black/75">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 005. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="ct-close-title" className="scroll-mt-28">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="ct-close-title" className={`max-w-[12ch] text-[clamp(2.6rem,6.8vw,5.6rem)] leading-[0.92] ${DISPLAY}`}>
                Find the leak before you buy more traffic.
              </h2>
              <p className="mt-6 max-w-[40ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-black/70">
                More visitors to a page that loses them only costs more. Three minutes tells you where they leave, and what
                to write instead.
              </p>
            </div>
            <div className="self-end">
              <ol className="list-none border-b-[2px] border-[#0B0B0B] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t-[2px] border-[#0B0B0B] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 font-[family-name:var(--ct-mono)] text-[0.95rem] font-bold">{i + 1}</span>
                    <span className="text-black/80">{step}</span>
                  </li>
                ))}
              </ol>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="ink" align="start" prompt={false} quiet />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] text-black/62">
                  Free. Needs Claude Code, Node.js 18+ and Chrome or Edge. Mac, Windows or Linux. The score is a judgment
                  against a rubric, not a measured conversion rate: test the fixes on real traffic.
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
        buttonClassName="bg-[#0B0B0B] text-white hover:bg-black"
      />
    </main>
  );
}
