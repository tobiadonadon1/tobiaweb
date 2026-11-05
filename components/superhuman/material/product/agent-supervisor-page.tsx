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
 * THE LOOK (Tobia, 2026-11-05, on the first page: "glassmorphism, modern,
 * short, value-driven… one simple phrase… minimal… a scroll stop… a loader
 * animation that looks cool… I don't want receipts"): near-black with slow
 * mint and blue light behind frosted glass, Geist, one phrase per screen.
 * The opening loader is the product in two seconds: four checks close a ring,
 * a tick, "Proven."
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
        <span className="as-orb as-orb--a" />
        <span className="as-orb as-orb--b" />
        <span className="as-orb as-orb--c" />
      </div>
      <BackLink href={folderHref("skills")} label="Skills" tone="ink" />

      {/* 01. ONE PHRASE, THE BUTTON, THE PROOF. */}
      <section aria-labelledby="as-title" className="relative">
        <div className="mx-auto grid max-w-[76rem] lg:min-h-[100svh] grid-cols-1 items-center gap-x-14 gap-y-14 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pt-24">
          <div className="as-rise">
            <p className="as-pill">
              <span className="as-dot" aria-hidden />
              Free skill for Claude Code &amp; Codex
            </p>
            <h1 id="as-title" className="as-h1 mt-7">
              No proof,
              <br />
              <span className="as-grad">no done.</span>
            </h1>
            <p className="mt-6 max-w-[30ch] text-pretty text-[1.2rem] leading-[1.45] text-white/70 sm:text-[1.3rem]">
              Your AI agent can&rsquo;t say it&rsquo;s finished until it proves it.
            </p>
            <div id={HERO_ID} className="mt-9 scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="dark" align="start" quiet buttonClassName="as-cta" />
            </div>
          </div>
          <AgentSupervisorDemo />
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

      {/* 03. WHAT IT DOES, IN FOUR TILES. */}
      <section aria-labelledby="as-does" className="relative">
        <div className="mx-auto max-w-[76rem] px-5 pb-28 sm:px-8 md:pb-36">
          <h2 id="as-does" className="as-h2 max-w-[16ch]">
            Before it says done, it checks.
          </h2>
          <ul className="mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:mt-12 sm:gap-4 lg:grid-cols-4">
            {DOES.map(({ Icon, title, body }) => (
              <li key={title} className="as-glass as-tile">
                <span className="as-icon" aria-hidden>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-[1.05rem] font-semibold leading-[1.2] tracking-[-0.02em] sm:mt-8 sm:text-[1.2rem]">{title}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-[1.4] text-white/60 sm:text-[0.98rem]">{body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="as-glass as-vs">
              <p className="as-label">Without it</p>
              <p className="as-vs__say">&ldquo;Done! All tests pass.&rdquo;</p>
              <p className="text-white/55">Then you find the bug.</p>
            </div>
            <div className="as-glass as-vs as-vs--with">
              <p className="as-label as-label--mint">With it</p>
              <p className="as-vs__say">
                Done <span className="text-white/40">·</span> <span className="as-grad">9/9 proven</span>
              </p>
              <p className="text-white/55">Or it tells you exactly what&rsquo;s missing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="as-close-title" className="relative scroll-mt-28">
        <div className="mx-auto max-w-[76rem] px-5 pb-36 sm:px-8 md:pb-44">
          <div className="as-glass as-close">
            <h2 id="as-close-title" className="as-h2 mx-auto max-w-[14ch] text-center">
              Ship work that&rsquo;s <span className="as-grad">actually done.</span>
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
              <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="dark" prompt={false} quiet buttonClassName="as-cta" />
            </div>
            <p className="mx-auto mt-6 max-w-[48ch] text-balance text-center text-[0.86rem] leading-[1.5] text-white/45">
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
        buttonClassName="bg-[#0b0e13] text-white hover:bg-black"
      />
    </main>
  );
}
