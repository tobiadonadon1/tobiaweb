import Image from "next/image";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { DONE_CHECKER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";
import { DoneCheckerScene, GuardTerminal, type ReceiptLine } from "./done-checker-scene";
import "./done-checker.css";

/**
 * DONE CHECKER, a free skill for Claude Code and Codex that makes the agent
 * prove its work is finished before it says "done". Free for an email,
 * downloading at once.
 *
 * THE LOOK IS THE RECEIPT'S OWN (Tobia, 2026-11-05: "a bit of a different
 * template, something fun, nice, clean"): a warm desk with a dot grid,
 * thermal paper with torn edges, ink, and three rubber stamps (green DONE,
 * amber PARTLY DONE, red NOT DONE and PROVE IT). Bricolage Grotesque for the
 * words, JetBrains Mono for anything a machine printed.
 *
 * EVERYTHING SHOWN IS REAL. The opening's bubble and receipt, the guard's
 * terminal and the numbers under them come from the test run of 5 Nov 2026
 * (Claude Code adding a signup to a small app with the guard on: it said it
 * was finished, was sent back, and came back with 9 of 9 proven). The receipt
 * near the end is the one this page earned before it went live. Long lines are
 * shortened, never changed in meaning. No claim about how often agents lie.
 */

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--dc-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--dc-mono", display: "swap" });

const HERO_ID = "get";
const CLOSE_ID = "dc-close";

const H = "font-[family-name:var(--dc-display)] font-extrabold tracking-[-0.035em] [font-variation-settings:'opsz'_96,'wdth'_88]";
const MONO = "font-[family-name:var(--dc-mono)]";

/** The test run behind the opening and the guard section (the skill's notes: run B). */
const RUN = {
  date: "5 Nov 2026",
  said: "Signup is in and all 10 tests pass, including the date test that had been failing.",
  stamp: "Done",
  foot: "9/9 proven · receipt 8a3688",
};

const RECEIPT: ReceiptLine[] = [
  { kind: "head", text: "DONE CHECKER" },
  { kind: "meta", text: "plantly · since the session began" },
  { kind: "rule" },
  { kind: "item", mark: "✓", id: "R1", text: "a signup form on the homepage" },
  { kind: "item", mark: "✓", id: "R2", text: "POST /api/signup saves the user" },
  { kind: "item", mark: "✓", id: "R3", text: "bad emails are refused" },
  { kind: "item", mark: "✓", id: "R4", text: "passwords under 8 refused" },
  { kind: "item", mark: "✓", id: "R5", text: "a clear error under the form" },
  { kind: "item", mark: "✓", id: "R6", text: "the same email can't sign up twice" },
  { kind: "item", mark: "✓", id: "R7", text: "looks good on a phone" },
  { kind: "item", mark: "✓", id: "R8", text: "all tests pass, the date one too" },
  { kind: "item", mark: "✓", id: "R9", text: "the old endpoints still work" },
  { kind: "rule" },
  { kind: "lead", left: "tests", right: "10 passed" },
  { kind: "lead", left: "the diff", right: "6 files +249 −7" },
  { kind: "lead", left: "red flags", right: "none" },
  { kind: "lead", left: "second opinion", right: "9 of 9" },
  { kind: "rule" },
  { kind: "meta", text: "NOT CHECKED" },
  { kind: "note", text: "Safari, Firefox, a real phone" },
  { kind: "note", text: "a missing users file would crash the server" },
  { kind: "meta", text: "YOUR CALL" },
  { kind: "note", text: "the two old users have plain-text passwords" },
];

const LIES: { said: string; truth: string; code?: string }[] = [
  { said: "All tests pass.", truth: "One of them was switched off.", code: 'it.skip("empty cart is 0")' },
  { said: "Works great on mobile.", truth: "Nobody ever opened the page." },
  { said: "Fixed the crash.", truth: "It was hidden, not fixed.", code: "catch (e) {}" },
  { said: "Everything you asked for.", truth: "You asked for five things, twenty messages ago. It did four." },
];

const STEPS: { n: string; title: string; body: string; shows: string[] }[] = [
  {
    n: "01",
    title: "What done means",
    body: "Before it builds, your request becomes a checklist: what you said, plus what you'd obviously expect. It still builds, the old features still work, the phone, the error states.",
    shows: ["R1 a signup form on the homepage", "R5 a clear error under the form", "R7 looks good on a phone", "R9 (implied) the old endpoints work"],
  },
  {
    n: "02",
    title: "Run everything",
    body: "Your project's own tests, type check, lint and build, on the code as it is now. Then every line it changed, read for faked work.",
    shows: ["✓ test 10 passed", "· types, lint, build: whatever exists", "✓ 6 files read, line by line", "✓ red flags: none"],
  },
  {
    n: "03",
    title: "Show, don't tell",
    body: "Each item needs proof that ran: a command, a test, or your page opened in a real browser on desktop and a real phone screen, with the form filled in and the button pressed. Proof from before the last edit doesn't count.",
    shows: ["look · desktop 1440", "look · phone 390", "fill Email=bad · click Sign up", "✓ “valid email address” shown"],
  },
  {
    n: "04",
    title: "A second opinion",
    body: "A fresh agent who never saw the work checks it cold: your words, the diff, the proof. It can lower a verdict, never raise one.",
    shows: ["reads your messages", "runs it again itself", "tries to break it", "agreed 9 of 9"],
  },
];

/**
 * THE RECEIPT THIS PAGE EARNED. The page went live first without it (a receipt can only be made once the page is
 * proven and live); then the real receipt was pictured and added. null hides the section, never a stand-in.
 */
const OWN_RECEIPT: { src: string; id: string; verdict: string; date: string } | null = null;

const VERDICTS = [
  { stamp: "Done", cls: "dc-stamp-green", line: "Everything you asked for, proven, on the code as it is now." },
  { stamp: "Partly done", cls: "dc-stamp-amber", line: "What's proven, what isn't, and what it needs from you." },
  { stamp: "Not done", cls: "", line: "The tests or the build fail, or nothing could be shown working." },
];

const FLAGS: { code: string; says: string; stop: boolean }[] = [
  { code: "it.skip(  ·  .only(", says: "a test switched off", stop: true },
  { code: "expect(true).toBe(true)", says: "a test that can't fail", stop: true },
  { code: "− 3 assertions", says: "checks taken out of a test", stop: true },
  { code: "|| true  ·  --passWithNoTests", says: "a check that can't fail", stop: true },
  { code: 'if (NODE_ENV === "test")', says: "code that behaves differently under test", stop: true },
  { code: 'throw new Error("not implemented")', says: "a piece that isn't built", stop: true },
  { code: "// ...rest of the code", says: "code left out", stop: true },
  { code: "sk_live_…", says: "a secret key in the code", stop: true },
  { code: "catch (e) {}", says: "errors thrown away", stop: false },
  { code: "@ts-ignore  ·  as any", says: "warnings silenced, not fixed", stop: false },
  { code: "mockUsers  ·  lorem ipsum", says: "made-up data in the real code", stop: false },
  { code: "console.log(", says: "debug lines left in", stop: false },
];

const FAQ: [string, string][] = [
  ["Does it slow things down?", "A few minutes on a real feature: that's the proof being made. In our test, plain Claude Code finished in about a minute and Claude Code with Done Checker in about five, with 9 of 9 proven and a crash risk found. A one-line fix takes about a minute."],
  ["Does it work with Codex?", "Yes. The skill installs for both, and the guard is a pair of hooks for each. Codex asks you to approve new hooks once: type /hooks and approve them."],
  ["Can it get stuck in a loop?", "No. The guard sends a turn back at most twice per message from you, then lets go and tells you plainly. If anything inside it fails, it lets the turn through: it never breaks a session."],
  ["Does it touch my code?", "No. It writes only to a .done folder that git never sees. It never stages, commits or changes your files. The fixing is still the agent's job."],
  ["My project has no tests.", "Then the proof comes from running things: the command, the request, the page in a real browser. The receipt says what had nothing to run, instead of pretending."],
];

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

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`${MONO} text-[0.72rem] font-bold uppercase tracking-[0.14em] ${className}`}>{children}</span>;
}

export function DoneCheckerPage() {
  return (
    <main className={`dc ${display.variable} ${mono.variable} relative overflow-x-clip text-[var(--ink)]`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 001. THE OPENING: the promise, the button, a "done" stamped and proven. */}
      <section aria-labelledby="dc-title" className="dc-desk relative isolate">
        <div className="mx-auto flex min-h-[100svh] max-w-[84rem] flex-col px-5 pb-16 pt-24 sm:px-8 md:pt-28">
          <div className="flex items-start justify-between gap-4 text-[var(--soft)]">
            <Label>
              Free<span className="hidden sm:inline"> · downloads at once</span>
            </Label>
            <Label className="text-right">For Claude Code and Codex</Label>
          </div>

          <div className="mt-10 grid flex-1 grid-cols-1 items-center gap-x-14 gap-y-14 md:mt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <h1 id="dc-title" className={`text-[clamp(4rem,11vw,9.6rem)] leading-[0.84] ${H}`}>
                <span className="block">Done?</span>
                <span className="mt-[0.12em] block">
                  <span className="dc-stamp ml-[0.04em] inline-block -rotate-[4deg] text-[0.7em] [font-variation-settings:'opsz'_96,'wdth'_76]">Prove it.</span>
                </span>
              </h1>
              <p className="mt-9 max-w-[36ch] text-pretty text-[1.15rem] font-medium leading-[1.48] text-[var(--ink)]/85 sm:text-[1.28rem]">
                Your agent says it&rsquo;s finished. Done Checker makes it show you: the tests it ran, the page it opened, what
                it didn&rsquo;t check, and every line it changed. No receipt, no done.
              </p>
              <div id={HERO_ID} className="mt-8 max-w-[30rem] scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="ink" align="start" quiet />
              </div>
              <p className={`mt-4 ${MONO} text-[0.74rem] text-[var(--soft)]`}>Free · Claude Code and Codex · Mac, Windows, Linux</p>
            </div>

            <figure className="m-0">
              <DoneCheckerScene said={RUN.said} lines={RECEIPT} stamp={RUN.stamp} foot={RUN.foot} />
              <figcaption className="mt-7 text-center">
                <Label className="text-[var(--soft)]">A real receipt · Claude Code adding a signup to an app · {RUN.date}</Label>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 002. SOUND FAMILIAR: what "done" hides. */}
      <section aria-labelledby="dc-familiar" className="bg-[var(--paper)]">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <h2 id="dc-familiar" className={`max-w-[14ch] text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.92] ${H}`}>
              &ldquo;Done&rdquo; is the most expensive word in AI coding.
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.1rem] font-medium leading-[1.55] text-[var(--soft)] md:pb-2">
              Agents rarely lie on purpose. They lose a request from twenty messages ago, run out of patience with a failing
              test, or never open the page. The summary comes out confident anyway, and you find out three rounds later.
            </p>
          </div>
          <ul className="mt-14 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {LIES.map((l) => (
              <li key={l.said} className="flex flex-col rounded-[1.3rem] border-2 border-[var(--ink)] bg-white p-5">
                <Label className="text-[var(--soft)]">It said</Label>
                <p className={`mt-2 min-h-[2.2em] text-[1.55rem] leading-[1.1] ${H}`}>
                  <span className="dc-strike">{l.said}</span>
                </p>
                <div className="pt-7">
                  <Label className="text-[var(--red)]">✗ What was true</Label>
                  <p className="mt-2 text-[1.02rem] font-semibold leading-[1.4]">{l.truth}</p>
                  {l.code && <code className={`mt-3 inline-block rounded-md bg-[#f3f0e8] px-2 py-1 ${MONO} text-[0.8rem]`}>{l.code}</code>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 003. HOW IT WORKS: four stubs, then the three stamps. */}
      <section aria-labelledby="dc-how" className="dc-desk">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <h2 id="dc-how" className={`max-w-[15ch] text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.92] ${H}`}>
            Four steps between &ldquo;done&rdquo; and done.
          </h2>
          <ol className="mt-14 grid list-none grid-cols-1 gap-x-5 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {STEPS.map((s) => (
              <li key={s.n} className="dc-paper flex flex-col px-5 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className={`${MONO} text-[0.9rem] font-bold text-[var(--soft)]`}>{s.n}</span>
                  <span aria-hidden className={`${MONO} text-[0.7rem] text-[var(--soft)]`}>
                    ✂ - - - -
                  </span>
                </div>
                <h3 className={`mt-4 text-[1.75rem] leading-[1] ${H}`}>{s.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-[1.5] text-[var(--ink)]/78">{s.body}</p>
                <div className="dc-perf mt-auto pt-0" />
                <ul className={`mt-4 list-none space-y-1 p-0 ${MONO} text-[0.74rem] text-[var(--ink)]/80`}>
                  {s.shows.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-20 md:mt-24">
            <Label className="text-[var(--soft)]">Then it hands you one of three</Label>
            <ul className="mt-6 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
              {VERDICTS.map((v) => (
                <li key={v.stamp}>
                  <span className={`dc-stamp ${v.cls} -rotate-[5deg] text-[clamp(2.2rem,4vw,3rem)] ${H} [font-variation-settings:'opsz'_96,'wdth'_78]`}>{v.stamp}</span>
                  <p className="mt-5 max-w-[30ch] text-[1.05rem] font-medium leading-[1.45] text-[var(--ink)]/80">{v.line}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-[58ch] text-[1.05rem] leading-[1.55] text-[var(--ink)]/75">
              Every receipt also lists what nobody checked (another browser, the real payment, production data), the
              decisions left for you, and the one-minute way to see it with your own eyes.
            </p>
          </div>
        </div>
      </section>

      {/* 004. WHAT IT CATCHES: the diff, read line by line. */}
      <section aria-labelledby="dc-catches" className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <h2 id="dc-catches" className={`max-w-[13ch] text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.92] ${H}`}>
              It reads every line it changed.
            </h2>
            <p className="max-w-[42ch] text-pretty text-[1.1rem] font-medium leading-[1.55] text-[var(--paper)]/68 md:pb-2">
              The ways finished-looking work gets faked, found in the diff itself. The red ones stop a DONE until they&rsquo;re
              fixed or explained on the receipt, where you&rsquo;ll read the reason.
            </p>
          </div>
          <ul className="mt-14 grid list-none grid-cols-1 gap-px overflow-hidden rounded-[1.2rem] border border-white/15 bg-white/15 p-0 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {FLAGS.map((f) => (
              <li key={f.code} className="flex flex-col gap-3 bg-[var(--ink)] px-5 pb-5 pt-4">
                <span className={`${MONO} text-[0.72rem] font-bold uppercase tracking-[0.12em] ${f.stop ? "text-[#ff8a7a]" : "text-[#f2c46b]"}`}>
                  {f.stop ? "✗ stops a done" : "! flagged"}
                </span>
                <code className={`${MONO} break-words text-[0.92rem] leading-[1.4] text-white`}>{f.code}</code>
                <span className="mt-auto text-[0.98rem] leading-[1.4] text-[var(--paper)]/72">{f.says}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[64ch] text-[1.05rem] leading-[1.55] text-[var(--paper)]/68">
            And what no scanner can see: the second agent goes through every message you sent, corrections included, and
            names anything you asked for that nobody built.
          </p>
        </div>
      </section>

      {/* 005. THE GUARD: what happened in the test. */}
      <section aria-labelledby="dc-guard" className="bg-[var(--paper)]">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <h2 id="dc-guard" className={`max-w-[12ch] text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.92] ${H}`}>
                No receipt, no done.
              </h2>
              <p className="mt-6 max-w-[42ch] text-pretty text-[1.1rem] font-medium leading-[1.55] text-[var(--ink)]/78">
                Say yes to the guard when you install. When Claude Code or Codex ends a turn saying it&rsquo;s finished, the
                code changed, and there&rsquo;s no fresh receipt, the turn goes back with what to do.
              </p>
              <ul className="mt-8 list-none space-y-3 p-0 text-[1.02rem] leading-[1.45]">
                {[
                  "Twice at most, then it tells you plainly. It can't loop.",
                  "Questions to you, docs-only edits and an honest “not done yet” pass straight through.",
                  "The receipt's verdict has to be in the message, so PARTLY DONE can't turn into “all done”.",
                  "Off for one project, or everywhere, with one command.",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[0.15em] font-bold text-[var(--green)]">✓</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="m-0">
              <GuardTerminal>
                <div className={`overflow-hidden rounded-[1rem] border-2 border-[var(--ink)] bg-[#141413] ${MONO} text-[0.8rem] leading-[1.6] text-[#e9e6dd] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.7)]`}>
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 text-[0.7rem] text-white/45">claude · plantly</span>
                  </div>
                  <ol className="m-0 list-none space-y-3 px-4 pb-5 pt-4 sm:px-5">
                    {(
                      [
                        [<span key="a"><span className="text-white/40">›</span> add a signup to the site … make sure all the tests pass</span>],
                        [<span key="b"><span className="text-[#d7a26b]">●</span> {RUN.said}</span>],
                        [
                          <span key="c" className="block rounded-md border border-[#ff8a7a]/40 bg-[#ff8a7a]/10 px-3 py-2 text-[#ffb3a8]">
                            <b className="text-[#ff8a7a]">■ Done Checker</b>{" "}you&rsquo;re telling the person it&rsquo;s done, but nothing proves it yet.
                            6 files changed this session. Do the Finish steps, then end with the receipt.
                          </span>,
                        ],
                        [<span key="d"><span className="text-[#d7a26b]">●</span> I&rsquo;ll read the skill&rsquo;s Finish steps first.</span>],
                        [<span key="e" className="block pl-4 text-white/70">$ done check <span className="text-[#7ee2a8]">✓ test 10 passed · no red flags</span></span>],
                        [<span key="f" className="block pl-4 text-white/70">$ done look localhost:4399 <span className="text-[#7ee2a8]">✓ desktop ✓ phone</span></span>],
                        [<span key="g" className="block pl-4 text-white/70">⧉ fresh verifier <span className="text-[#7ee2a8]">agreed 9 of 9</span></span>],
                        [<span key="h"><span className="text-[#d7a26b]">●</span> <b className="text-[#7ee2a8]">DONE · 9/9 proven · receipt 8a3688</b></span>],
                      ] as React.ReactNode[][]
                    ).map(([node], i) => (
                      <li key={i} className="dc-term-line" style={{ "--i": i } as React.CSSProperties}>
                        {node}
                      </li>
                    ))}
                  </ol>
                </div>
              </GuardTerminal>
              <figcaption className="mt-4 max-w-[60ch] text-[0.95rem] leading-[1.5] text-[var(--soft)]">
                From the test on {RUN.date}, shortened. A minute in, Claude Code said it was finished. The guard sent it back.
                Five minutes later: 9 of 9 proven, two decisions left for the owner, and a crash risk nobody had asked about.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 006. THIS PAGE HAS A RECEIPT. */}
      {OWN_RECEIPT && (
      <section aria-labelledby="dc-own" className="dc-desk">
        <div className="mx-auto max-w-[80rem] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <h2 id="dc-own" className={`max-w-[12ch] text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[0.92] ${H}`}>
                This page had to prove it too.
              </h2>
              <p className="mt-6 max-w-[42ch] text-pretty text-[1.1rem] font-medium leading-[1.55] text-[var(--ink)]/78">
                It was built by Claude Code with Done Checker on. Before it went live it ran the site&rsquo;s tests, types,
                lint and build, opened itself on a desktop and a phone, and a second agent checked it cold. This is the
                receipt it earned.
              </p>
            </div>
            <figure className="m-0">
              <div className="mx-auto max-w-[34rem] -rotate-[1.2deg]">
                <Image
                  src={OWN_RECEIPT.src}
                  alt={`The Done Checker receipt for building this page (${OWN_RECEIPT.verdict}, receipt ${OWN_RECEIPT.id}, ${OWN_RECEIPT.date}): each requirement with its proof, the checks, the diff, red flags, the second opinion and what was not checked.`}
                  width={1200}
                  height={2400}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="block h-auto w-full drop-shadow-[0_24px_30px_rgba(60,45,15,0.28)]"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>
      )}

      {/* 007. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="dc-close-title" className="scroll-mt-28 bg-[var(--paper)]">
        <div className="mx-auto max-w-[80rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 id="dc-close-title" className={`max-w-[13ch] text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.92] ${H}`}>
                Stop checking its work. Make it show you.
              </h2>
              <dl className="mt-12 max-w-[46rem] space-y-0">
                {FAQ.map(([q, a]) => (
                  <div key={q} className="border-t-2 border-[var(--ink)] py-5">
                    <dt className={`text-[1.3rem] leading-[1.15] ${H}`}>{q}</dt>
                    <dd className="m-0 mt-2 max-w-[56ch] text-[1rem] leading-[1.55] text-[var(--ink)]/75">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="self-start lg:sticky lg:top-28">
              <ol className="list-none border-b-2 border-[var(--ink)] p-0">
                {[
                  <>Get it free. It downloads at once.</>,
                  <>
                    Open a terminal in the folder, type <q className="font-semibold">claude</q> (or{" "}
                    <q className="font-semibold">codex</q>), then <q className="font-semibold">hi</q>.
                  </>,
                  <>Say yes to the guard. Then work as usual: every &ldquo;done&rdquo; comes with its receipt.</>,
                ].map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t-2 border-[var(--ink)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className={`w-5 shrink-0 ${MONO} text-[0.95rem] font-bold`}>{i + 1}</span>
                    <span className="text-[var(--ink)]/85">{step}</span>
                  </li>
                ))}
              </ol>
              <div id="claim" className="mt-10 scroll-mt-28">
                <FreeClaim productId={PRODUCT.id} reveal="Get it free" tone="ink" align="start" prompt={false} quiet />
                <p className="mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] text-[var(--soft)]">
                  Free. Needs Claude Code or Codex, Node.js 18+ and git; Chrome, Edge or Brave to open your pages. Mac,
                  Windows or Linux. It makes your agent prove its work. It can&rsquo;t make the work right for it.
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
        buttonClassName="bg-[var(--ink)] text-white hover:bg-black"
      />
    </main>
  );
}
