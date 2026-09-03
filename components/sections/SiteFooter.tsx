import Link from "next/link";
import { FooterReveal } from "@/components/sections/footer-reveal";
import { ConstructStar } from "@/components/superhuman/construct-star";

/**
 * THE LAST PAGE.
 *
 * It does not scroll up into view like the rest of the site. It is already
 * there, pinned to the bottom of the viewport underneath everything, and the
 * page slides UP OFF it as you reach the end. So the site does not finish with
 * one more block of content; it finishes by getting out of the way and showing
 * you what was behind it the whole time. That mechanism is two rules and no
 * JavaScript: this footer is `fixed` at z-0, and `.site-content` is `relative`,
 * z-10, opaque, and carries a bottom padding on body exactly `--footer-h` tall.
 *
 * WHAT CHANGED, AND WHY. The previous version was one huge name that FILLED
 * with blue from the bottom as the page left, plus a sheen running across it.
 * Tobia: "I don't like the footer because of how it fills up the color, the
 * shade. I want it more creative, like in the style that we're making now, more
 * playful, like the little animations, the little arrows, the colors that we
 * used in construct stuff, more patches."
 *
 * So the gradient is gone entirely and this is a COLLAGE, in the language the
 * Construct marks are drawn in (see material/specimens.tsx): torn paper, five
 * colours, real grain, nothing geometric. The links are patches you could pick
 * out of the page with the labels covered, which is the whole point of that
 * language. The crayon star signs it, and does not rotate, ever.
 *
 * EVERY ANIMATION HERE IS `--reveal`, AND NONE OF IT IS JAVASCRIPT.
 * footer-reveal.tsx already writes `--reveal` (0 to 1) across the last screen
 * of scroll. Rather than switching things on at a threshold, every moving part
 * reads it directly through calc(): the patches fly up and rotate into their
 * tilts on a stagger, the flecks drift in behind them at their own rates, and
 * the arrow and the underline DRAW THEMSELVES with `pathLength="1"` and a
 * dashoffset. The whole collage assembles under your thumb as you pull the page
 * off it, and it runs backwards if you scroll back up. See `.footer-*` in
 * globals.css.
 */

/* The Construct palette, the same five that the material marks are cut from. */
const INK = "#0b1f3a";
const VERMILION = "#ce4631";
const ULTRAMARINE = "#2743b8";
const SAFFRON = "#e0952b";
const FOREST = "#1f6b4f";

/**
 * Torn tags, in a 240 x 76 box. Two of them so a row of four is not the same
 * silhouette four times, and neither has one true straight edge: a machine's
 * edge is exactly what this language is not.
 *
 * THE TEAR RATE IS THE WHOLE TRICK. The first pass put eight deviations along
 * each long edge, which at the size these actually render (about 110px wide)
 * is a wobble every thirteen pixels: that is not torn paper, it is a sawtooth,
 * and it read as a cartoon badge. Five shallow deviations over the same run,
 * about a pixel and a half each once scaled, is what a tear looks like.
 */
const TAG_A =
  "M3 11 L58 5 L112 9 L168 4 L222 8 L237 14 L235 38 L238 62 L214 70 L160 66 L106 71 L52 67 L10 70 L2 47 L6 29 Z";
const TAG_B =
  "M6 6 L62 11 L118 4 L174 10 L228 5 L238 20 L233 42 L237 66 L206 71 L152 65 L98 72 L44 66 L8 71 L3 50 L7 26 Z";

/**
 * The scatter behind everything: a torn scrap and a torn disc. Both are calm
 * on purpose. The spiky little fleck the material marks use is right at 200px
 * inside a composition; at 30px on its own it reads as a spark, not as paper.
 */
const SCRAP =
  "M8 5 L28 2 L48 7 L66 3 L70 20 L67 38 L71 55 L52 60 L32 56 L12 61 L4 44 L7 26 Z";
const DISC =
  "M32 2 L44 5 L54 12 L60 22 L62 33 L58 45 L49 55 L38 61 L27 62 L16 57 L7 49 L2 38 L3 26 L9 15 L19 6 Z";

/**
 * The links, as patches.
 *
 * Text colour is picked by measurement, not by eye. Against paper white
 * (#faf8f2) vermilion lands at 4.35:1, which misses AA for text this size, so
 * the labels are pure white: 4.62:1 on vermilion, 8.15:1 on ultramarine, 6.40:1
 * on forest. Saffron is far too light to carry white at all (2.47:1), so it
 * takes ink instead, at 6.59:1.
 */
const PATCHES = [
  { href: "/#projects", label: "Projects", fill: ULTRAMARINE, on: "#ffffff", tilt: -2.6, d: TAG_A },
  { href: "/#thoughts", label: "Thoughts", fill: FOREST, on: "#ffffff", tilt: 1.9, d: TAG_B },
  { href: "/projects/construct/material", label: "Free material", fill: SAFFRON, on: INK, tilt: -1.4, d: TAG_A },
  { href: "mailto:tobia@donadon.com", label: "Say hi", fill: VERMILION, on: "#ffffff", tilt: 2.4, d: TAG_B },
];

/**
 * The scatter. Kept to the outer margins on purpose: a scrap of colour sitting
 * under a line of type is not collage, it is litter.
 */
const FLECKS = [
  { x: "2%", y: "22%", s: 74, c: SAFFRON, r: -14, i: 0, d: SCRAP, vb: "0 0 74 64" },
  { x: "92%", y: "12%", s: 52, c: ULTRAMARINE, r: 19, i: 1, d: DISC, vb: "0 0 64 64" },
  { x: "86%", y: "66%", s: 88, c: VERMILION, r: -7, i: 2, d: SCRAP, vb: "0 0 74 64" },
  { x: "4%", y: "72%", s: 46, c: FOREST, r: 24, i: 3, d: DISC, vb: "0 0 64 64" },
  { x: "95%", y: "40%", s: 38, c: SAFFRON, r: -22, i: 4, d: SCRAP, vb: "0 0 74 64" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer relative overflow-hidden" aria-label="Site footer">
      <FooterReveal />

      {/* GRAIN. One filter for the whole footer rather than one per shape: the
          cost of this effect is in the number of filter regions, and a collage
          of ten cut shapes would otherwise pay ten times. */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="footer-tooth" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feBlend in="SourceGraphic" in2="g" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* The scatter. Behind everything, drifting in at its own rates. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {FLECKS.map((f) => (
          <svg
            key={`${f.x}-${f.y}`}
            className="footer-fleck absolute"
            style={
              {
                left: f.x,
                top: f.y,
                width: f.s,
                height: f.s,
                "--i": f.i,
                "--tilt": `${f.r}deg`,
              } as React.CSSProperties
            }
            viewBox={f.vb}
          >
            <path d={f.d} fill={f.c} filter="url(#footer-tooth)" />
          </svg>
        ))}
      </div>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pb-10 pt-12 md:pb-12 md:pt-14">
        {/* TOP: back to the top, with an arrow that draws itself as the page
            leaves, and the year. */}
        <div className="flex items-start justify-between gap-8">
          <div className="relative">
            <Link
              href="/#home"
              className="group inline-flex items-center gap-x-3"
              aria-label="Tobia Donadon, back to the top"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- small static brand mark */}
              <img src="/logo.png" alt="" className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
              <span className="text-[0.95rem] text-[color:rgba(11,31,58,0.62)] transition-colors duration-300 group-hover:text-[var(--ink)]">
                Back to the top
              </span>
            </Link>

            {/* The little arrow, curling up and back at the link. Drawn twice,
                a heavier stroke with a lighter one just off it, which is what a
                person does going back over a line. */}
            <svg
              aria-hidden
              viewBox="0 0 120 78"
              className="footer-arrow pointer-events-none absolute left-1 top-[-52px] h-[54px] w-[84px] overflow-visible"
            >
              <g fill="none" stroke={VERMILION} strokeLinecap="round" strokeLinejoin="round">
                <path
                  pathLength="1"
                  d="M14 74 C 10 44, 30 20, 58 18 C 84 16, 100 30, 96 44"
                  strokeWidth="2.4"
                  opacity="0.9"
                />
                <path pathLength="1" d="M6 58 L14 74 L26 66" strokeWidth="2.4" opacity="0.9" />
                <path
                  pathLength="1"
                  d="M17 71 C 13 43, 32 23, 58 21 C 82 19, 97 31, 94 43"
                  strokeWidth="1.1"
                  opacity="0.55"
                />
              </g>
            </svg>
            <span
              aria-hidden
              className="footer-hand absolute left-[92px] top-[-40px] whitespace-nowrap font-hand text-[1.3rem] leading-none text-[color:#ce4631]"
            >
              start it again
            </span>
          </div>

          <span className="pt-1 text-[0.8rem] text-[color:rgba(11,31,58,0.4)]">2026</span>
        </div>

        {/* THE NAME. Ink, once, at size, with a hand-drawn rule under it that
            draws on with the reveal. No fill, no sheen, no second colour. */}
        <div className="footer-name relative select-none">
          <h2 className="flex items-end gap-4 whitespace-nowrap font-serif text-[clamp(2.4rem,10.5vw,8rem)] leading-[0.84] tracking-[-0.035em] text-[var(--ink)]">
            Tobia Donadon
            {/* The crayon star signs it. It never rotates. */}
            <ConstructStar
              id="footer"
              className="mb-[0.35em] h-[0.42em] w-[0.42em] shrink-0"
              weight={3.4}
            />
          </h2>
          <svg
            aria-hidden
            viewBox="0 0 600 14"
            preserveAspectRatio="none"
            className="footer-rule mt-3 block h-[9px] w-full max-w-[92%] overflow-visible"
          >
            <path
              pathLength="1"
              d="M2 9 C 74 3, 148 12, 222 6 C 296 1, 370 11, 444 5 C 508 1, 556 9, 598 5"
              fill="none"
              stroke={VERMILION}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* THE PATCHES. */}
        <nav aria-label="Footer">
          <ul className="flex list-none flex-wrap items-center gap-3 md:gap-4">
            {PATCHES.map((p, i) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="footer-patch group relative inline-flex items-center justify-center px-7 py-4 md:px-9 md:py-[1.15rem]"
                  style={{ "--i": i, "--tilt": `${p.tilt}deg` } as React.CSSProperties}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 240 76"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path d={p.d} fill={p.fill} filter="url(#footer-tooth)" />
                  </svg>
                  <span
                    className="relative text-[0.95rem] font-medium tracking-[-0.01em] md:text-[1rem]"
                    style={{ color: p.on }}
                  >
                    {p.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* THE CLOSING LINE. */}
        <p className="font-serif text-lg italic text-[color:rgba(11,31,58,0.5)]">
          Figuring it out in public.
        </p>
      </div>
    </footer>
  );
}
