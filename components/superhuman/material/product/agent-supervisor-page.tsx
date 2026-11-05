import { Geist, Geist_Mono } from "next/font/google";
import { Eye, FlaskConical, MousePointerClick, ScanFace } from "lucide-react";
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
 * it checks the agent's work like a picky human would, so you don't have to
 * explain things twice. Tobia, third pass: the pain isn't "all tests pass",
 * it's "I verified it, the UI looks great, it doesn't look AI" and then it
 * does; "any UX problems?" "No." and then there are.
 *
 * THE LOOK (Tobia, 2026-11-05, second pass, with a reference): royal purple
 * #723CD6 with texture (ribbed glass over a grain), white writing, white
 * liquid-glass cards, one loud accent: sunglow gold #EDB158, a sun glowing
 * behind the ribs. Futuristic, space-calm, minimal, value first. Before that:
 * "short… one simple phrase… a scroll stop… a loader that looks cool… I don't
 * want receipts". The opening loader is the product in two seconds: four
 * checks close a ring, a gold tick, "Proven."
 *
 * Cards are tinted purple glass, not clear: a clear card over the gold sun
 * washed its words out (Tobia's screenshot). Every word is solid white.
 *
 * THE DEMO IS REAL: building the first version of this page (5 Nov 2026). The
 * agent said it looked great on desktop and phone; the fresh agent opened it
 * on a phone and found the opening playing off-screen; it was fixed and
 * looked at again.
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
  { Icon: Eye, title: "Looks like a human", body: "Opens every screen on desktop and phone, and hunts for what’s off." },
  { Icon: ScanFace, title: "Calls out AI-looking design", body: "Clipped text, clumsy spacing, generic layouts. Named, then fixed." },
  { Icon: MousePointerClick, title: "Uses it like you would", body: "Presses the buttons, fills the forms wrong, sees what happens." },
  { Icon: FlaskConical, title: "Proves the code works", body: "Runs your tests and build. Catches skipped tests and fake fixes." },
];

/** The scroll stop. The last two words land in gold. */
const PHRASE = ["“It", "looks", "great,”", "it", "said.", "It", "didn’t."];

const STEPS = ["Get it free", "Type claude, then hi", "Say yes to the guard"];

/** How it supervises, start to finish (SKILL.md, in plain words). */
const HOW = [
  { n: "01", title: "You say it once.", body: "It writes down what “done” means, including what you’d obviously expect but didn’t say. If something’s unclear, it asks, up to three questions." },
  { n: "02", title: "It checks like you would.", body: "Runs your tests and build, reads every changed line for faked work, opens every screen on desktop and phone, and uses it." },
  { n: "03", title: "Fresh eyes judge it.", body: "A second agent that never saw the work hunts for what’s off, AI-looking design included. What it finds gets fixed first." },
  { n: "04", title: "You get the truth.", body: "Done, Partly done or Not done: what’s proven, what nobody could check, and what’s your call." },
];

/** The report from a real run (5 Nov 2026: Claude Code adding a signup to a small app, guard on). */
const REPORT: [string, string][] = [
  ["Tests", "10 passed"],
  ["Faked work", "none found"],
  ["Screens", "desktop + phone"],
  ["Second agent", "agrees, 9 of 9"],
];

const FAQ: [string, string][] = [
  ["Does it slow my agent down?", "A small fix adds about a minute. A real feature, a few: in our test, 5 minutes instead of 1, and it caught a crash nobody had asked about. Less than one round of feedback."],
  ["Will it touch my code?", "No. It only writes its notes, in a folder kept out of git. Your agent fixes what it finds; you see the result."],
  ["What's the guard?", "Two small hooks. When the agent says “done” or “looks great” without the checks, it’s sent back, twice at most, then you’re told."],
  ["Can it check work that's already done?", "Yes. Say “prove it” or “check what Codex did” on any project, branch or pull request."],
  ["What if it can't check something?", "It says so. Another browser, real payments, an OS it doesn’t have: listed under “not checked”, never rounded up."],
  ["Does it work with Codex?", "Yes, Claude Code and Codex, on Mac, Windows and Linux. Codex asks you to approve the two hooks once."],
];

export function AgentSupervisorPage() {
  return (
    <main className={`as-page ${sans.variable} ${mono.variable} relative overflow-x-clip`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AgentSupervisorLoader />
      {/* Sticky, not fixed: it ends with the page, so the site's footer shows under it. */}
      <div className="as-skywrap" aria-hidden>
        <div className="as-sky">
          <span className="as-sun" />
          <span className="as-sun as-sun--streak" />
          <span className="as-ribs" />
          <span className="as-grain" />
        </div>
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
                <span className="whitespace-nowrap">Your AI agent,</span>
                <br />
                <span className="as-gold">supervised.</span>
              </h1>
              <p className="mt-6 max-w-[34ch] text-pretty text-[1.15rem] leading-[1.5] text-white sm:text-[1.25rem]">
                It checks your agent&rsquo;s work like a picky human would, so you don&rsquo;t have to explain it twice.
              </p>
              <div id={HERO_ID} className="mt-9 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="violet" align="start" quiet buttonClassName="as-cta" />
              </div>
            </div>
            <AgentSupervisorDemo />
          </div>

          <ul className="mt-14 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {DOES.map(({ Icon, title, body }) => (
              <li key={title} className="as-glass as-tile">
                <span className="as-icon" aria-hidden>
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
                </span>
                <h2 className="mt-5 text-[1.08rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white">{title}</h2>
                <p className="mt-1.5 text-[0.93rem] leading-[1.45] text-white">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02. THE SCROLL STOP. */}
      <section aria-label="“It looks great,” it said. It didn’t." className="as-stop">
        <p className="as-phrase">
          {PHRASE.map((w, i) => (
            <span key={w} className={`as-word${i >= PHRASE.length - 2 ? " as-word--gold" : ""}`} style={{ "--i": i } as React.CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* 03. HOW IT SUPERVISES. */}
      <section aria-labelledby="as-how" className="relative">
        <div className="mx-auto max-w-[78rem] px-5 pb-24 sm:px-8 md:pb-32">
          <p className="as-label as-label--gold">How it works</p>
          <h2 id="as-how" className="as-h2 mt-4 max-w-[16ch]">
            A second pair of eyes, <span className="as-gold">every time.</span>
          </h2>
          <ol className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h) => (
              <li key={h.n} className="as-glass as-tile as-how">
                <span className="as-how__n">{h.n}</span>
                <h3 className="mt-8 text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white">{h.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-[1.5] text-white">{h.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04. WHAT YOU GET AT THE END. */}
      <section aria-labelledby="as-get" className="relative">
        <div className="mx-auto grid max-w-[78rem] grid-cols-1 items-center gap-12 px-5 pb-24 sm:px-8 md:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="as-label as-label--gold">What you get</p>
            <h2 id="as-get" className="as-h2 mt-4 max-w-[13ch]">
              The answer, <span className="as-gold">not a “trust me”.</span>
            </h2>
            <ul className="mt-9 grid list-none gap-3.5 p-0 text-[1.05rem] leading-[1.45] text-white">
              {[
                "One word up front: Done, Partly done or Not done.",
                "How each thing you asked for was proven.",
                "What a person would notice, and what was fixed.",
                "What nobody could check, said plainly.",
                "Every changed line, if you want to look.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="as-tick" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <figure className="m-0">
            <div className="as-glass as-report">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.9rem] font-medium text-white">Agent Supervisor · signup</span>
                <span className="as-report__pill">Done</span>
              </div>
              <p className="mt-6 text-[2.6rem] font-normal leading-none tracking-[-0.04em] text-white">
                9/9 <span className="text-[1.1rem] tracking-normal">proven</span>
              </p>
              <ul className="mt-6 list-none p-0">
                {REPORT.map(([k, v]) => (
                  <li key={k} className="as-report__row">
                    <span>{k}</span>
                    <span className="as-report__v">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="as-report__box">
                  <p className="as-label">Not checked</p>
                  <p className="mt-1.5 text-[0.92rem] leading-[1.4] text-white">Safari, Firefox, a real phone</p>
                </div>
                <div className="as-report__box">
                  <p className="as-label as-label--gold">Your call</p>
                  <p className="mt-1.5 text-[0.92rem] leading-[1.4] text-white">Two old users have plain-text passwords</p>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-[0.85rem] text-white">A real report: Claude Code adding a signup to a small app.</figcaption>
          </figure>
        </div>
      </section>

      {/* 05. WITHOUT IT, WITH IT. */}
      <section aria-label="Without it and with it" className="relative">
        <div className="mx-auto grid max-w-[78rem] grid-cols-1 gap-4 px-5 pb-24 sm:px-8 md:grid-cols-2 md:pb-32">
          <div className="as-glass as-vs">
            <p className="as-label">Without it</p>
            <p className="as-vs__say">&ldquo;Verified. The UI looks great.&rdquo;</p>
            <p className="text-white">Then you find five things wrong, and explain them all.</p>
          </div>
          <div className="as-glass as-vs as-vs--with">
            <p className="as-label as-label--gold">With it</p>
            <p className="as-vs__say">&ldquo;On a phone, one thing was off. Fixed, and checked again.&rdquo;</p>
            <p className="text-white">You see it once it&rsquo;s right.</p>
          </div>
        </div>
      </section>

      {/* 06. QUESTIONS. */}
      <section aria-labelledby="as-faq" className="relative">
        <div className="mx-auto max-w-[58rem] px-5 pb-24 sm:px-8 md:pb-32">
          <h2 id="as-faq" className="as-h2 text-center">Questions</h2>
          <div className="mt-10 grid gap-2.5">
            {FAQ.map(([q, a]) => (
              <details key={q} className="as-glass as-faq">
                <summary>
                  {q}
                  <span className="as-faq__plus" aria-hidden />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 07. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="as-close-title" className="relative scroll-mt-28">
        <div className="mx-auto max-w-[78rem] px-5 pb-36 sm:px-8 md:pb-44">
          <div className="as-glass as-close">
            <h2 id="as-close-title" className="as-h2 mx-auto text-center">
              Say it once.
              <br />
              <span className="as-gold">It gets checked.</span>
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
            <ul className="mx-auto mt-8 flex max-w-[40rem] list-none flex-wrap justify-center gap-2 p-0">
              {["Free", "Claude Code", "Codex", "Mac", "Windows", "Linux", "2-minute install"].map((t) => (
                <li key={t} className="as-chip">{t}</li>
              ))}
            </ul>
            <p className="mx-auto mt-5 max-w-[48ch] text-balance text-center text-[0.86rem] leading-[1.5] text-white">
              Needs Node 18+ and git. Chrome, Edge or Brave lets it open your pages.
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
