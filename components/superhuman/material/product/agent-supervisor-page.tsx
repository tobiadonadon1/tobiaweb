import { Geist, Geist_Mono } from "next/font/google";
import { FlaskConical, MonitorSmartphone, ScanSearch, UsersRound } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { AGENT_SUPERVISOR as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { AgentSupervisorLoader } from "./agent-supervisor-loader";
import { AgentSupervisorDemo } from "./agent-supervisor-demo";
import "./agent-supervisor.css";

/**
 * AGENT SUPERVISOR (was Done Checker), a free skill for Claude Code and Codex:
 * the agent can't say it's done until it proves it.
 *
 * THE LOOK (Tobia, 2026-11-05, second pass, with a reference): royal purple
 * #723CD6 with texture (ribbed glass over a grain), white writing, white
 * liquid-glass cards, one loud accent: sunglow gold #EDB158, a sun glowing
 * behind the ribs. Futuristic, space-calm, minimal, value first. Before that:
 * "short… one simple phrase… a scroll stop… a loader that looks cool… I don't
 * want receipts". The opening loader is the product in two seconds: four
 * checks close a ring, a gold tick, "Proven."
 *
 * THE DEMO IS REAL: Claude Code adding a signup to a small app with the guard
 * on (5 Nov 2026). It said it was finished, was sent back, and came back with
 * 10 tests passing, no faked work, the page opened, and a fresh agent agreeing
 * on 9 of 9.
 */

const sans = Geist({ subsets: ["latin"], variable: "--as-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--as-mono", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "as-close";

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

const DOES = [
  { Icon: FlaskConical, title: "Runs it all", body: "Tests, types, lint, build. Every time." },
  { Icon: ScanSearch, title: "Catches the fakes", body: "Skipped tests, stubs, swallowed errors." },
  { Icon: MonitorSmartphone, title: "Opens the page", body: "On desktop and a real phone screen." },
  { Icon: UsersRound, title: "Asks a second agent", body: "One that never saw the work checks it cold." },
];

const PHRASE = ["Stop", "being", "your", "agent’s", "QA."];

const STEPS = ["Get it free", "Type claude, then hi", "Say yes to the guard"];

export function AgentSupervisorPage() {
  return (
    <main className={`as-page ${sans.variable} ${mono.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AgentSupervisorLoader />
      <div className="as-sky" aria-hidden>
        <span className="as-sun" />
        <span className="as-sun as-sun--streak" />
        <span className="as-ribs" />
        <span className="as-grain" />
      </div>
      <BackLink href={folderHref("skills")} label="Skills" tone="ink" />

      {/* 01. ONE PHRASE, THE BUTTON, THE PROOF, WHAT IT DOES. */}
      <section aria-labelledby="as-title" className="relative">
        <div className="mx-auto flex max-w-[78rem] flex-col px-5 pb-10 pt-28 sm:px-8 lg:min-h-[100svh] lg:pt-32">
          <div className="grid flex-1 grid-cols-1 items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="as-rise">
              <p className="as-pill">
                <span className="as-dot" aria-hidden />
                Free skill for Claude Code &amp; Codex
              </p>
              <h1 id="as-title" className="as-h1 mt-7">
                No proof,
                <br />
                <span className="as-gold">no done.</span>
              </h1>
              <p className="mt-6 max-w-[32ch] text-pretty text-[1.15rem] leading-[1.5] text-white/80 sm:text-[1.25rem]">
                Your AI agent can&rsquo;t say it&rsquo;s finished until it proves it.
              </p>
              <div id={HERO_ID} className="mt-9 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="violet" align="start" quiet buttonClassName="as-cta" />
              </div>
            </div>
            <AgentSupervisorDemo />
          </div>

          <ul className="as-row mt-16 grid list-none grid-cols-2 p-0 lg:mt-20 lg:grid-cols-4">
            {DOES.map(({ Icon, title, body }) => (
              <li key={title}>
                <Icon aria-hidden className="h-[1.1rem] w-[1.1rem] text-[var(--as-gold)]" strokeWidth={1.7} />
                <h2 className="mt-3 text-[1rem] font-medium tracking-[-0.01em]">{title}</h2>
                <p className="mt-1 text-[0.88rem] leading-[1.45] text-white/65">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02. THE SCROLL STOP. */}
      <section aria-label="Stop being your agent’s QA" className="as-stop">
        <p className="as-phrase">
          {PHRASE.map((w, i) => (
            <span key={w} className="as-word" style={{ "--i": i } as React.CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* 03. WITHOUT IT, WITH IT. */}
      <section aria-label="Without it and with it" className="relative">
        <div className="mx-auto grid max-w-[78rem] grid-cols-1 gap-4 px-5 pb-28 sm:px-8 md:grid-cols-2 md:pb-36">
          <div className="as-glass as-vs">
            <p className="as-label">Without it</p>
            <p className="as-vs__say">&ldquo;Done! All tests pass.&rdquo;</p>
            <p className="text-white/70">Then you find the bug.</p>
          </div>
          <div className="as-glass as-vs as-vs--with">
            <p className="as-label as-label--gold">With it</p>
            <p className="as-vs__say">
              Done <span className="text-white/45">·</span> <span className="as-gold">9/9 proven</span>
            </p>
            <p className="text-white/70">Or it tells you exactly what&rsquo;s missing.</p>
          </div>
        </div>
      </section>

      {/* 04. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="as-close-title" className="relative scroll-mt-28">
        <div className="mx-auto max-w-[78rem] px-5 pb-36 sm:px-8 md:pb-44">
          <div className="as-glass as-close">
            <h2 id="as-close-title" className="as-h2 mx-auto max-w-[14ch] text-center">
              Ship work that&rsquo;s <span className="as-gold">actually done.</span>
            </h2>
            <ol className="mx-auto mt-9 flex list-none flex-wrap justify-center gap-2.5 p-0">
              {STEPS.map((s, i) => (
                <li key={s} className="as-step">
                  <span className="as-step__n">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div id="claim" className="mt-10 flex scroll-mt-28 justify-center">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="violet" prompt={false} quiet buttonClassName="as-cta" />
            </div>
            <p className="mx-auto mt-6 max-w-[48ch] text-balance text-center text-[0.86rem] leading-[1.5] text-white/60">
              Free. Claude Code or Codex, Node 18+ and git. Mac, Windows or Linux.
            </p>
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
        buttonClassName="bg-[#723CD6] text-white hover:bg-[#6331c4]"
      />
    </main>
  );
}
