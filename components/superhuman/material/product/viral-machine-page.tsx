import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { abs } from "@/lib/site";
import { VIRAL_MACHINE as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { CtaWake } from "./viral-machine-cta";
import { StickyBuy } from "./sticky-buy";
import { ViralIntro } from "./viral-machine-intro";
import { BotSvg, C, OUCH_MS, SIX, type Key } from "./viral-machine-bits";

/**
 * VIRAL MACHINE: an X manager that lives in Grok Bot.
 *
 * THE SAME THREE SECTIONS AS APP DESIGNER PRO, on purpose (Tobia's call): the
 * name and the button, what it does (six tiles, one colour each), and the
 * close. It sells the value. Given away for an email (free-claim.tsx): the
 * file arrives in the inbox and the address lands in the leads sheet.
 *
 * THE MASCOTS ARE GROK BOT'S OWN AVATARS (grok-army-bots.ts): a flat shape and
 * two leaning pill eyes, recoloured per job. They open the page (six beats),
 * stand in a row over the name, and post, reply and get measured inside the
 * tiles, standing in for real accounts so no stranger is put on a sales page.
 *
 * WHAT THE TILES SHOW: the numbers in the first two tiles are from real test
 * runs (a design launch at 17k–343k views against 1k–4k; a "best post" whose
 * replies were 9 sellers out of 14; this week's niche outliers). The chat,
 * the angles and the Friday note are drawn as examples and say so. The
 * ranking weights are X's own, from its open-sourced For You code.
 */

const HERO_ID = "buy";
const CLOSE_ID = "vm-close";
const BUTTON = "bg-[#16171B] text-white shadow-[0_18px_40px_-18px_rgba(22,23,27,0.7)] hover:bg-black";
const MUTED = "text-[color:rgba(11,31,58,0.62)]";

const STEPS: React.ReactNode[] = [
  <>Leave your email. The file is in your inbox a minute later.</>,
  <>
    In Grok Bot, make a new bot, attach the file and send{" "}
    <q className="font-semibold text-[var(--ink)]">Set yourself up from this file.</q>
  </>,
  <>Answer three questions. About 20 minutes later, your first three posts are ready to tap.</>,
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Grok Bot",
  image: abs(`/shop/${PRODUCT.id}/card`),
  url: abs(PRODUCT.href),
  author: { "@type": "Person", name: "Tobia Donadon" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: PRODUCT.currency.toUpperCase(),
    availability: "https://schema.org/InStock",
    url: abs(PRODUCT.href),
  },
};

/** One of the six, as a tile in its own colour: the claim, then the proof. */
function Tile({ k, title, text, children, wide = false }: { k: Key; title: string; text: string; children: React.ReactNode; wide?: boolean }) {
  const c = C[k];
  return (
    <li
      className={`vm-tile relative flex flex-col overflow-hidden rounded-[2rem] ${wide ? "lg:col-span-2" : ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <div className="relative px-7 pb-8 pt-8 sm:px-9 sm:pt-10">
        <p className="flex items-center gap-2.5 text-[0.95rem] font-semibold">
          <BotSvg spec={c.bot} className="vm-bob size-7 shrink-0" />
          <span className="opacity-75">{c.sticker}</span>
        </p>
        <h3 className="mt-3 max-w-[17ch] text-balance text-[clamp(2rem,4.4vw,2.9rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          {title}
        </h3>
        <p className="mt-4 max-w-[42ch] text-pretty text-[1.06rem] font-medium leading-[1.5] opacity-90">{text}</p>
      </div>
      <div className="relative mt-auto flex flex-1 items-end justify-center px-4 pb-6 sm:px-8 sm:pb-9">{children}</div>
    </li>
  );
}

/** The white card every proof sits on: X's own white, ink text. */
function Card({ children, className = "", example = false }: { children: React.ReactNode; className?: string; example?: boolean }) {
  return (
    <div className={`relative w-full rounded-[1.6rem] bg-white p-5 text-[#0f1419] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] sm:p-6 ${className}`}>
      {example && (
        <span className="absolute right-4 top-4 rounded-full bg-[#eff3f4] px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#536471]">
          Example
        </span>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * THE PROOFS
 * ------------------------------------------------------------------ */

function AccountProof() {
  const rows = [
    { what: "Design launches", views: "17k–343k views", w: "100%", ok: true },
    { what: "Other launches, same format", views: "1k–4k views", w: "9%", ok: false },
  ];
  return (
    <Card className="max-w-[30rem]">
      <p className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-[#536471]">What works for you</p>
      <ul className="mt-4 list-none space-y-4 p-0">
        {rows.map((r) => (
          <li key={r.what}>
            <div className="flex items-baseline justify-between gap-3 text-[1rem] font-semibold">
              <span>{r.what}</span>
              <span className="shrink-0 tabular-nums text-[#536471]">{r.views}</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-[#eff3f4]">
              <div className="vm-grow h-full rounded-full" style={{ width: r.w, background: r.ok ? C.account.bg : "#9aa6ae" }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-[#eff3f4] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[1rem] font-semibold text-[#536471] line-through decoration-2">&ldquo;Best post&rdquo; · 15 replies</span>
          <span className="rounded-full bg-[#fde8e4] px-3 py-1 text-[0.85rem] font-bold text-[#b42318]">Hollow</span>
        </div>
        <p className="mt-1.5 text-[0.95rem] leading-[1.45] text-[#536471]">9 of the 14 replies were sellers fishing for clients. Not a win.</p>
      </div>
    </Card>
  );
}

const OUTLIERS = [
  { bot: C.angles.crew, who: "4K followers", views: "77K", what: "Gave away a free tool, with a demo" },
  { bot: C.voice.crew, who: "A peer", views: "78K", what: "A free Claude skill" },
  { bot: C.niche.crew, who: "A bigger account", views: "1.3M", what: "A “full course” Article" },
];

function NicheProof() {
  return (
    <div className="w-full">
      <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3 sm:gap-4">
        {OUTLIERS.map((o) => (
          <li key={o.what}>
            <Card className="h-full">
              <div className="flex items-center gap-3">
                <BotSvg spec={o.bot} className="vm-bob size-10 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-bold leading-tight">{o.who}</p>
                  <p className="text-[0.85rem] text-[#536471]">this week</p>
                </div>
                <span className="ml-auto rounded-full px-2.5 py-1 text-[0.8rem] font-bold" style={{ background: "#e6f6f1", color: "#0b5e48" }}>
                  Outlier
                </span>
              </div>
              <p className="mt-4 text-[clamp(2.2rem,4vw,2.8rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                {o.views}
                <span className="ml-1.5 text-[1rem] font-semibold tracking-normal text-[#536471]">views</span>
              </p>
              <p className="mt-2 text-[1rem] font-medium leading-[1.4] text-[#0f1419]">{o.what}</p>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-[1.2rem] bg-white/25 px-5 py-3 text-center text-[1.05rem] font-bold">
        This week in your niche: giving something away beats talking about it.
      </p>
    </div>
  );
}

function AnglesProof() {
  const asks = [
    { q: "ok but what did you actually build with it?", likes: 41, bot: C.niche.crew },
    { q: "does this work without paying for ads?", likes: 23, bot: C.account.crew },
  ];
  return (
    <Card className="max-w-[30rem]" example>
      <p className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-[#536471]">Under a 78K-view post</p>
      <ul className="mt-4 list-none space-y-3 p-0">
        {asks.map((a) => (
          <li key={a.q} className="flex items-start gap-3">
            <BotSvg spec={a.bot} className="size-8 shrink-0" />
            <div className="min-w-0 flex-1 rounded-[1.1rem] bg-[#f4f6f7] px-4 py-2.5">
              <p className="text-[1rem] leading-[1.4]">{a.q}</p>
              <p className="mt-1 text-[0.85rem] font-semibold text-[#536471]">♥ {a.likes}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2 text-[0.9rem] font-bold" style={{ color: "#b4561a" }}>
        <span aria-hidden>↓</span> Your post tomorrow
      </div>
      <p className="mt-2 rounded-[1.1rem] border-2 px-4 py-3 text-[1.05rem] font-semibold leading-[1.4]" style={{ borderColor: C.angles.bg }}>
        what i actually built with it, and what it made in 30 days:
      </p>
    </Card>
  );
}

function VoiceProof() {
  return (
    <Card className="max-w-[30rem]" example>
      <div className="flex items-center gap-3">
        <BotSvg spec={C.algo.crew} className="vm-bob size-10 shrink-0" />
        <div>
          <p className="text-[1rem] font-bold leading-tight">X Manager</p>
          <p className="text-[0.85rem] text-[#536471]">08:00 · in your Grok Bot</p>
        </div>
      </div>
      <p className="mt-4 text-[1rem] font-semibold">Morning. Post 1 of 3 · 12:30</p>
      <div className="mt-3 whitespace-pre-line rounded-[1.1rem] bg-[#f4f6f7] px-4 py-3.5 text-[1.05rem] leading-[1.45]">
        {"most people don't need more traffic.\nthey need one offer worth buying.\n\nfix the offer. then automate."}
      </div>
      <p className="mt-3 text-[0.95rem] leading-[1.45] text-[#536471]">
        Why today: 3 of the niche&rsquo;s biggest posts this week were free. Nobody said what comes after.
      </p>
      <span className="vm-tap mt-4 inline-flex items-center gap-2 rounded-full bg-[#0f1419] px-5 py-2.5 text-[1rem] font-bold text-white">
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12Z" />
        </svg>
        Tap to post
      </span>
    </Card>
  );
}

function LearnsProof() {
  const lines = [
    ["v2", "Cut the closing question", "you deleted it twice"],
    ["v3", "Post at 12:30, not 09:00", "your followers' hours"],
    ["v4", "More teardowns", "3 in a row beat your normal"],
  ];
  return (
    <Card className="max-w-[30rem]" example>
      <p className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-[#536471]">Friday review</p>
      <ol className="mt-4 list-none space-y-3 p-0">
        {lines.map(([v, what, why]) => (
          <li key={v} className="flex items-baseline gap-3">
            <span className="w-8 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[0.8rem] font-bold text-white" style={{ background: C.learns.bg }}>
              {v}
            </span>
            <span className="text-[1rem] leading-[1.4]">
              <span className="font-semibold">{what}</span>
              <span className="text-[#536471]"> · {why}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-[#eff3f4] pt-4 text-[0.95rem] leading-[1.45] text-[#536471]">
        If its drafts lose to the posts you write alone two weeks running, it changes how it writes.
      </p>
    </Card>
  );
}

const WEIGHTS: [string, number][] = [
  ["Share by link", 20],
  ["Reply", 5],
  ["Quote", 5],
  ["Follow", 4],
  ["Like", 0.66],
];
const PENALTIES: [string, number][] = [
  ["Report", -234],
  ["Mute", -58.8],
  ["Not interested", -52.3],
];

function AlgoProof() {
  const bar = (n: number, max: number) => `${Math.max(2.5, (Math.abs(n) / max) * 100)}%`;
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      <div className="rounded-[1.6rem] bg-white/[0.07] p-5 sm:p-6">
        <p className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-white/60">What pushes a post</p>
        <ul className="mt-4 list-none space-y-3 p-0">
          {WEIGHTS.map(([what, n]) => (
            <li key={what} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 text-[0.98rem]">
              <span className="font-semibold">{what}</span>
              <span className="h-3 rounded-full bg-white/10">
                <span className="vm-grow block h-full rounded-full bg-[#4DB39B]" style={{ width: bar(n, 20) }} />
              </span>
              <span className="text-right font-bold tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[1.6rem] bg-white/[0.07] p-5 sm:p-6">
        <p className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-white/60">What buries it</p>
        <ul className="mt-4 list-none space-y-3 p-0">
          {PENALTIES.map(([what, n]) => (
            <li key={what} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 text-[0.98rem]">
              <span className="font-semibold">{what}</span>
              <span className="h-3 rounded-full bg-white/10">
                <span className="vm-grow block h-full rounded-full bg-[#EC5A33]" style={{ width: bar(n, 234) }} />
              </span>
              <span className="text-right font-bold tabular-nums">{Math.round(n)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.95rem] leading-[1.45] text-white/70">
          A like is worth 1/30 of a share. One report undoes hundreds of likes. It writes for the first and stays clear of the
          second.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ViralMachinePage() {
  return (
    <main className="vm-page relative overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ViralIntro six={SIX} />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. THE CREW, THE NAME AND THE BUTTON. */}
      <section aria-labelledby="vm-title" className="relative">
        <div className="mx-auto flex min-h-[92svh] max-w-[72rem] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8 md:pt-32">
          <ul className="grid w-full max-w-[52rem] list-none grid-cols-3 gap-x-2 gap-y-5 p-0 sm:grid-cols-6 sm:gap-3" aria-label="What it does">
            {SIX.map((s, i) => (
              <li key={s.key} className="vm-crew flex flex-col items-center gap-2.5" style={{ "--i": i } as React.CSSProperties}>
                <BotSvg spec={s.crew} className="vm-bob size-[3.6rem] sm:size-[4.4rem]" />
                <span
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em] sm:text-[0.92rem]"
                  style={{ background: s.bg, color: s.fg }}
                >
                  {s.sticker}
                </span>
              </li>
            ))}
          </ul>
          <h1
            id="vm-title"
            className="mt-10 text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.055em] md:mt-12"
          >
            Viral Machine
          </h1>
          {/* Two lines, one per sentence, on every screen (Tobia's ask). */}
          <p className="mt-7 text-center text-[1.08rem] font-medium leading-[1.45] text-[color:rgba(11,31,58,0.78)] sm:text-[1.3rem] md:text-[1.45rem]">
            <span className="block">Your X manager, inside Grok Bot.</span>
            <span className="block">It tells you what to post, in your voice.</span>
          </p>
          <div id="claim" className="mt-9 flex w-full justify-center scroll-mt-28">
            <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ink" face={<CtaWake label="Get it for free" />} hold={OUCH_MS} buttonClassName="vm-cta" />
          </div>
          <p className={`mt-4 text-center text-[0.95rem] ${MUTED}`}>It never posts, likes or follows for you.</p>
          <div id={HERO_ID} aria-hidden className="h-px" />
        </div>
      </section>

      {/* 1b. THE PROOF: Tobia's own X, the four weeks the playbook ran. A real
          X Analytics screenshot (15 Oct 2026), cropped, never redrawn. */}
      <section aria-labelledby="vm-mine" className="relative">
        <div className="mx-auto max-w-[60rem] px-4 pb-24 pt-4 sm:px-8 md:pb-32">
          <p className="text-center">
            <span className="inline-block rounded-full bg-[#16171B] px-3.5 py-1.5 text-[0.85rem] font-bold tracking-[-0.01em] text-white">
              My own X · the last 4 weeks
            </span>
          </p>
          <h2
            id="vm-mine"
            className="mx-auto mt-6 max-w-[14ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            1.5 million views in four weeks.
          </h2>
          <p className={`mx-auto mt-5 max-w-[44ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            This is my account. Viral Machine is the playbook I ran to get here: read what works, find the angle people
            are asking for, write it in my own voice, post at the right hour.
          </p>
          <ul className="mx-auto mt-10 grid max-w-[44rem] list-none grid-cols-3 gap-2.5 p-0 sm:gap-4">
            {(
              [
                ["1.5M", "impressions", C.account],
                ["16.9K", "bookmarks", C.niche],
                ["63,000%", "up on the month before", C.angles],
              ] as const
            ).map(([n, label, c]) => (
              <li key={label} className="rounded-[1.25rem] px-3 py-4 text-center sm:px-5 sm:py-5" style={{ background: c.bg, color: c.fg }}>
                <span className="block text-[clamp(1.35rem,4.6vw,2.4rem)] font-extrabold leading-none tracking-[-0.04em]">{n}</span>
                <span className="mt-1.5 block text-[0.8rem] font-semibold leading-[1.25] sm:text-[0.95rem]">{label}</span>
              </li>
            ))}
          </ul>
          <figure className="mx-auto mt-6 max-w-[54rem] sm:mt-8">
            <div className="overflow-hidden rounded-[1.5rem] border border-[var(--hairline)] bg-white p-3 shadow-[0_30px_70px_-40px_rgba(11,31,58,0.45)] sm:p-5">
              <Image
                src="/shop/viral-machine/x-analytics-4w.png"
                alt="X Analytics for @tobiadonadon_, last 4 weeks: 1.5M impressions, 2.6% engagement rate, 41K engagements, 5K profile visits, 5.7K replies, 10.4K likes, 2K reposts, 16.9K bookmarks, 777 shares."
                width={868}
                height={768}
                unoptimized
                className="h-auto w-full"
              />
            </div>
            <figcaption className={`mt-4 text-center text-[0.9rem] leading-[1.5] ${MUTED}`}>
              @tobiadonadon_ in X Analytics, 18 September to 15 October 2026. The green arrows compare with the four weeks
              before.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. WHAT IT DOES: the six, each with the proof. */}
      <section aria-labelledby="vm-does" className="relative">
        <div className="mx-auto max-w-[76rem] px-4 pb-24 sm:px-8 md:pb-32">
          <h2
            id="vm-does"
            className="mx-auto max-w-[15ch] text-balance text-center text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          >
            Everything an X manager does.
          </h2>
          <p className={`mx-auto mt-5 max-w-[40ch] text-balance text-center text-[1.15rem] font-medium leading-[1.5] ${MUTED}`}>
            Every day, for your account. You keep the one job that matters: tapping Post.
          </p>
          <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-16 lg:grid-cols-2">
            <Tile
              k="account"
              title="It knows what works for you."
              text="It reads your posts and finds the pattern behind your hits. Fake wins don't count: replies from sellers, views from a tag."
            >
              <AccountProof />
            </Tile>

            <Tile
              k="voice"
              title="Written like you. One tap to post."
              text="Every morning, posts in your casing, your line length, your words, each with the reason it should work today. Tap one and X opens with it written."
            >
              <VoiceProof />
            </Tile>

            <Tile
              k="niche"
              title="It watches your niche every morning."
              text="12 to 20 accounts like yours. Every post is measured against that account's own normal, so a small account's breakout shows up next to a big one's."
              wide
            >
              <NicheProof />
            </Tile>

            <Tile
              k="angles"
              title="Ideas from what people actually ask."
              text="It reads the replies under the niche's best posts. A question 40 people liked is a post only you can answer."
            >
              <AnglesProof />
            </Tile>

            <Tile
              k="learns"
              title="Better every Friday."
              text="Your edits turn into rules. Every post is scored at 48 hours against your normal, and the next week's plan follows the numbers."
            >
              <LearnsProof />
            </Tile>

            <Tile
              k="algo"
              title="Built on X's own code."
              text="X published the code that ranks For You. Every post is written for what that code rewards, and kept away from what buries it."
              wide
            >
              <AlgoProof />
            </Tile>
          </ul>
          <p className={`mx-auto mt-8 max-w-[52ch] text-balance text-center text-[0.95rem] leading-[1.5] ${MUTED}`}>
            Articles and images too: say &ldquo;article about &hellip;&rdquo; and it writes the whole thing, cover and promo post included.
          </p>
        </div>
      </section>

      {/* 3. THE CLOSE. */}
      <section id={CLOSE_ID} aria-labelledby="vm-close-title" className="scroll-mt-28 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-[72rem] px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2
                id="vm-close-title"
                className="max-w-[13ch] text-balance text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
              >
                An X manager, minus the monthly invoice.
              </h2>
              <p className="mt-6 max-w-[38ch] text-pretty text-[1.15rem] font-medium leading-[1.5] text-[color:rgba(11,31,58,0.72)]">
                A social media manager bills you every month. This one lives in your Grok Bot, works every morning and gets
                sharper every Friday. It never posts, likes, follows or DMs for you: you stay the one who taps Post.
              </p>
              <div className="mt-10 flex items-end gap-3" aria-hidden>
                {SIX.map((s) => (
                  <BotSvg key={s.key} spec={s.crew} className="vm-bob size-11 sm:size-12" />
                ))}
              </div>
            </div>
            <div className="self-end">
              <ol className="list-none border-b border-[var(--hairline)] p-0">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-5 text-[1.1rem] leading-[1.45]">
                    <span className="w-5 shrink-0 text-[1rem] font-extrabold">{i + 1}</span>
                    <span className="text-[color:rgba(11,31,58,0.75)]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <FreeClaim productId={PRODUCT.id} reveal="Get it for free" tone="ink" align="start" prompt={false} face={<CtaWake label="Get it for free" />} hold={OUCH_MS} buttonClassName="vm-cta" />
                <p className={`mt-4 max-w-[46ch] text-pretty text-[0.95rem] leading-[1.5] ${MUTED}`}>
                  Needs Grok Bot (the X Subscription Premium plan or higher) and a public X account.
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
        label="Get it for free"
        note="Free, sent by email"
        buttonClassName={BUTTON}
      />
    </main>
  );
}
