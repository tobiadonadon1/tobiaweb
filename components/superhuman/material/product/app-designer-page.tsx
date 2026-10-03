import Image from "next/image";
import { BackLink } from "@/components/ui/back-link";
import { Reveal } from "@/components/superhuman/reveal";
import { abs } from "@/lib/site";
import { APP_DESIGNER as PRODUCT } from "@/lib/shop/products";
import { folderHref } from "../material-data";
import { FreeClaim } from "./free-claim";
import { StickyBuy } from "./sticky-buy";

/**
 * APP DESIGNER, the skill, given away for an email.
 *
 * THE ONLY LIGHT PRODUCT PAGE. The others are black because they sell
 * machinery. This one sells taste, so it is built the way the skill tells an
 * agent to build: paper, one family set very large, a lot of nothing, and
 * the work itself as the only colour on the page.
 *
 * THE GRADIENTS ARE THE APPS. The two banner bands are soft fields of the
 * colours the skill's own designs were made of (Stride's track blue and
 * tartan red, Fernly's chartreuse, Lull's lamplight), drifting slowly behind
 * those same screens. Decoration that comes from the content.
 *
 * EVERY SCREEN HERE IS REAL OUTPUT. The "before" is what Claude made with no
 * skill, the "after" and the gallery are what fresh agents made following
 * App Designer, from a one-line brief, unedited. Nothing was retouched.
 */

const CLOSE_ID = "ad-close";
const big = "text-balance tracking-[-0.055em] text-[var(--ink)]";
const soft = "text-[color:rgba(11,31,58,0.66)]";
const kicker =
  "font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[color:rgba(11,31,58,0.55)]";

/** The screens, as published under public/shop/app-designer (402 x 874 at 2x). */
const S = (name: string) => `/shop/app-designer/${name}.webp`;

const HERO: { src: string; alt: string }[] = [
  {
    src: S("lull-tonight"),
    alt: "Lull, a sleep app drawn as a village going to sleep: three windows still lit.",
  },
  {
    src: S("stride-today"),
    alt: "Stride, a running app set on an athletics track: today's long run, 16 km.",
  },
  {
    src: S("fernly-tonight"),
    alt: "Fernly, a plant app as a Matisse cut-out: the Big Monstera needs 650 ml.",
  },
];

const BEATS: [string, string][] = [
  [
    "A concept, not a theme.",
    "Every app starts as something real: an athletics track, a village going to sleep, a paper cut-out. That one idea decides the type, the colour and the motion.",
  ],
  [
    "Three directions, then one.",
    "It designs your main screen three different ways before it commits, so you never ship the first idea by default.",
  ],
  [
    "It checks its own work.",
    "Every screen is rendered at iPhone resolution with Apple's own fonts, scanned for the tells of AI design, and scored by a separate critic.",
  ],
];

const GALLERY: { src: string; app: string; concept: string }[] = [
  {
    src: S("stride-run-detail"),
    app: "Stride",
    concept: "A running app as an athletics track",
  },
  {
    src: S("lull-wake"),
    app: "Lull",
    concept: "A sleep app as a village waking up",
  },
  {
    src: S("fernly-detail"),
    app: "Fernly",
    concept: "A plant app as a paper cut-out",
  },
  {
    src: S("parlo-today"),
    app: "Parlo",
    concept: "Italian lessons as a deck of Neapolitan cards",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: PRODUCT.name,
  description: PRODUCT.share.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS",
  author: { "@type": "Person", name: "Tobia Donadon" },
  url: abs(PRODUCT.href),
  offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
};

/**
 * A BAND OF MOVING LIGHT. Four blurred fields, each on its own long drift,
 * under whatever sits in the band. `calm` is the quieter version for the
 * close, where the words have to win.
 */
function Band({
  children,
  calm = false,
  className = "",
}: {
  children: React.ReactNode;
  calm?: boolean;
  className?: string;
}) {
  const o = calm ? 0.5 : 0.72;
  // Each app's colour, a step deeper than on its screen: a pale chartreuse or
  // lamplight blurred over paper disappears, and the band reads as blank.
  const blobs: [string, string, string, string, string, string][] = [
    // colour, left, top, width, duration, delay
    ["#2F62B8", "-4%", "22%", "42%", "28s", "0s"],
    ["#B5D334", "22%", "36%", "36%", "24s", "-6s"],
    ["#EBA63A", "48%", "14%", "38%", "30s", "-12s"],
    ["#C9482F", "70%", "34%", "36%", "26s", "-3s"],
  ];
  return (
    <div className={`ad-band ${className}`}>
      <div aria-hidden className="ad-band__field">
        {blobs.map(([c, l, t, w, d, dl]) => (
          <span
            key={c}
            aria-hidden
            className="ad-band__blob"
            style={
              {
                background: c,
                left: l,
                top: t,
                width: `max(${w}, 15rem)`,
                aspectRatio: "1.6",
                opacity: o,
                "--ad-dur": d,
                "--ad-delay": dl,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {children}
    </div>
  );
}

/** One screen, as the skill renders it: a real iPhone frame, no device. */
function Screen({
  src,
  alt,
  className = "",
  preload = false,
}: {
  src: string;
  alt: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={804}
      height={1748}
      preload={preload}
      sizes="(min-width: 1024px) 300px, (min-width: 640px) 34vw, 62vw"
      className={`h-auto w-full drop-shadow-[0_28px_40px_rgba(11,31,58,0.22)] ${className}`}
    />
  );
}

export function AppDesignerPage() {
  return (
    <main className="relative overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <BackLink href={folderHref("skills")} label="Skills" />

      {/* 1. THE PROMISE AND THE FORM. Nothing else on the first screen. */}
      <section aria-labelledby="ad-title" className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-28 sm:px-8 md:pb-8 md:pt-36">
          <p className={`${kicker} lx-fade`}>
            App Designer · a free skill for Claude Code
          </p>
          <h1
            id="ad-title"
            className={`${big} lx-fade mt-6 max-w-[11ch] text-[clamp(3.2rem,9.6vw,8.6rem)] font-medium leading-[0.9]`}
          >
            iPhone apps that don&rsquo;t look like AI made them.
          </h1>
          <div className="mt-10 grid grid-cols-1 items-end gap-10 md:mt-14 md:grid-cols-[1fr_auto] md:gap-16">
            <p
              className={`${soft} max-w-[38ch] text-balance text-[1.15rem] leading-[1.5] md:text-[1.35rem]`}
            >
              App Designer gives Claude a designer&rsquo;s process: a real
              concept, three directions, and every screen checked for AI slop
              before you see it.
            </p>
            <div id="claim" className="scroll-mt-28">
              <FreeClaim productId={PRODUCT.id} tone="light" align="start" />
            </div>
          </div>
        </div>
        <div
          id="ad-top"
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        />
      </section>

      {/* 2. THE WORK, ON A BAND OF ITS OWN COLOURS. */}
      <Band className="-mt-4 py-16 md:-mt-10 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-3 items-end gap-3 px-5 sm:gap-6 sm:px-8 md:gap-10">
          {HERO.map((h, i) => (
            <div
              key={h.src}
              className={i === 1 ? "-translate-y-6 md:-translate-y-12" : ""}
            >
              <Screen src={h.src} alt={h.alt} preload={i === 1} />
            </div>
          ))}
        </div>
      </Band>

      {/* 3. BEFORE AND AFTER: the same app, the same model. */}
      <section
        aria-labelledby="ad-same"
        className="mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-40"
      >
        <Reveal>
          <h2
            id="ad-same"
            className={`${big} max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.6rem)] font-medium leading-[0.95]`}
          >
            Same app. Same model.
          </h2>
          <p
            className={`${soft} mt-6 max-w-[44ch] text-pretty text-[1.1rem] leading-[1.55] md:text-[1.25rem]`}
          >
            A spending app, designed by Claude twice. On the left, on its own.
            On the right, with App Designer.
          </p>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-5 sm:gap-10 md:mt-24 md:gap-20">
          <Reveal>
            <figure className="mx-auto max-w-[19rem]">
              <Screen
                src={S("penny-before")}
                alt="Penny before: a dark fintech dashboard with a lime accent, a greeting and three category tiles."
              />
              <figcaption className={`${kicker} mt-6 text-center`}>
                Claude on its own
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure className="mx-auto max-w-[19rem]">
              <Screen
                src={S("penny-jar")}
                alt="Penny after, designed with App Designer."
              />
              <figcaption
                className={`${kicker} mt-6 text-center !text-[var(--accent-clay-text)]`}
              >
                With App Designer
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 4. WHAT IT DOES DIFFERENTLY, IN THREE BEATS. */}
      <section
        aria-labelledby="ad-how"
        className="border-t border-[var(--hairline)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-40">
          <h2 id="ad-how" className="sr-only">
            How it works
          </h2>
          <ol className="grid list-none grid-cols-1 gap-16 md:grid-cols-3 md:gap-12">
            {BEATS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 90}>
                <li>
                  <span className="block text-[4.5rem] font-medium leading-none tracking-[-0.06em] text-[var(--accent-clay-text)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-balance text-[1.7rem] font-medium leading-[1.1] tracking-[-0.03em]">
                    {k}
                  </h3>
                  <p
                    className={`${soft} mt-3 max-w-[34ch] text-pretty text-[1.08rem] leading-[1.55]`}
                  >
                    {v}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. MORE OF THE WORK. A row on a desktop, a swipe on a phone. */}
      <section aria-labelledby="ad-made" className="pb-28 md:pb-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2
              id="ad-made"
              className={`${big} max-w-[16ch] text-[clamp(2.6rem,6.4vw,5.6rem)] font-medium leading-[0.95]`}
            >
              Every app gets its own world.
            </h2>
          </Reveal>
        </div>
        <ul className="mt-16 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto px-5 pb-6 sm:px-8 md:mx-auto md:mt-24 md:grid md:max-w-6xl md:grid-cols-4 md:gap-8 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GALLERY.map((g, i) => (
            <li
              key={g.src}
              className="w-[62vw] max-w-[17rem] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <Reveal delay={i * 80}>
                <Screen src={g.src} alt={`${g.app}: ${g.concept}.`} />
                <p className="mt-6 text-[1.05rem] font-medium tracking-[-0.02em]">
                  {g.app}
                </p>
                <p className={`${soft} mt-1 text-[0.95rem] leading-[1.45]`}>
                  {g.concept}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. THE FORM AGAIN, ON A QUIETER BAND. */}
      <Band calm className="py-24 md:py-36">
        <section
          id={CLOSE_ID}
          aria-labelledby="ad-close-title"
          className="scroll-mt-28 px-5 text-center sm:px-8"
        >
          <h2
            id="ad-close-title"
            className={`${big} mx-auto max-w-[12ch] text-[clamp(3rem,8.4vw,7.4rem)] font-medium leading-[0.92]`}
          >
            Design an app worth featuring.
          </h2>
          <p
            className={`${soft} mx-auto mt-6 max-w-[34ch] text-balance text-[1.15rem] leading-[1.5] md:text-[1.3rem]`}
          >
            It&rsquo;s free. Tell me where to send it.
          </p>
          <div className="mt-10 flex justify-center">
            <FreeClaim productId={PRODUCT.id} tone="light" prompt={false} />
          </div>
          <p className={`${kicker} mt-2`}>Free · for Claude Code on a Mac</p>
        </section>
      </Band>

      <StickyBuy
        productId={PRODUCT.id}
        name={PRODUCT.name}
        price={PRODUCT.priceLabel}
        heroId="ad-top"
        closeId={CLOSE_ID}
        href="#claim"
        label="Get it free"
      />
    </main>
  );
}
