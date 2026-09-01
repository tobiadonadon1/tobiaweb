# Shared brief — the three project pages

Written for /projects/mynd, /projects/superhuman, /projects/book.
Interviewed 2026-08-27. NOT self-authored.

## Voice (applies to all three)
Humble, smart, curious, knows what he's talking about but never cocky.
First person, always Tobia. Say only what is essential. Short sentences.
No hype words (revolutionary, game-changing, unlock, supercharge).
No invented statistics, no fake testimonials, no revenue screenshots.
Where something is early, SAY it is early. That honesty is the brand.

## Hard rules (from the scrollcraft skill; ship-blockers)
- No "scroll down" cue, arrow, or animated mouse icon.
- No `01 / 06` style section counters as decoration.
- No eyebrow above every heading. At most one per three sections.
- No em dash in any visible copy. Use period, comma, colon, or parentheses.
- Not every section centred. Vary the anchor: lead, trail, centre, split.
- Never the same motion device twice in a row. At least four distinct
  device families per page.
- One engineered peak per page. It gets the most scroll room and the
  quietest section immediately before it.
- The close resolves. It never just fades into the footer.
- Real semantic markup: one h1, real h2s, real p, real links, real reading
  order. No text baked into images.
- transform/opacity/clip-path only. Never animate width/height/top/left,
  never `transition: all`.
- No gradient text, no neon glow, no zero-offset coloured halo shadows.

## Stack + conventions (this repo)
- Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict.
- GSAP 3.15 is the FULL CLUB BUILD (verified real licensed builds in
  node_modules/gsap, no trial warnings). Everything is available:
  ScrollTrigger, SplitText, Observer, ScrollSmoother, Flip, MorphSVGPlugin,
  DrawSVGPlugin, CustomEase, CustomBounce, CustomWiggle, Draggable,
  InertiaPlugin, Physics2DPlugin, PhysicsPropsPlugin, MotionPathPlugin,
  MotionPathHelper, ScrambleTextPlugin, ScrollToPlugin, TextPlugin,
  EasePack, CSSRulePlugin, EaselPlugin, PixiPlugin, GSDevTools.
  Import per-plugin: `import { Flip } from "gsap/Flip"`.
  NOT installed: @gsap/react (useGSAP), lenis, matter-js, splitting,
  imagesloaded, @react-three/fiber, drei, barba, pixi.js, anime.js.
  Use `useLayoutEffect` + `gsap.context()` instead of useGSAP, and
  ScrollSmoother instead of Lenis.
- three 0.184 available. motion 12 available.
- `"use client"` only on components that need it. Pages export `metadata`.
- Plain `<img>` is the house idiom (see video-slot, photo-slideshow).
- Register plugins guarded: `if (typeof window !== "undefined") gsap.registerPlugin(...)`.
- Clean up every GSAP context / ticker / listener on unmount.
- Respect `prefers-reduced-motion`: land on the finished state, no motion.
- Below 1000px, drop pinned scroll sequences for a readable stacked layout.

## Design floor (globals.css tokens, already defined)
paper `--paper #faf8f2` · ink `--ink #0b1f3a` · foreground `#0a0a0a`
accent-sky `#38bdf8` (site primary, BLUE) · accent-clay `#ce4631`
mynd-green `#2f7d5e` · mynd-amber `#d97b2f` (Mynd page ONLY)
hairline `rgba(11,31,58,0.12)`
Fonts: `font-serif` (Instrument Serif), `font-sans` (Geist),
`font-mono` (Geist Mono), `font-helvetica` (Helvetica Neue system stack).
Utility classes that exist: `.paper-bg`, `.page-rise`, `.font-helvetica`.

## Reusable components already in the repo
`components/ui/block-reveal.tsx` — BlockReveal: line-by-line bar wipe.
   Props: blockColor, stagger, duration, ease, delay, groupGap, start,
   onRevealed, className. Children are split per DIRECT child; mark
   non-text children `data-no-split`. Pass text as ONE string (it sets
   SplitText `reduceWhiteSpace:false` so NBSPs survive).
`components/ui/video-slot.tsx` — video placeholder.
`components/ui/photo-slideshow.tsx`, `photo-wave.tsx`, `image-trail.tsx`,
`ember-field.tsx`, `button-colorful.tsx`, `article-card.tsx`.

## Photos available (all have a matching `@2x.jpg`)
/trail/trail-01 … trail-11 .jpg
Portrait: 01, 03, 05, 08, 09, 10, 11. Landscape: 02, 04, 06, 07.
Use `srcSet={`${src} ${w1}w, ${src2x} ${w2}w`}` with a real `sizes`.
Widths: 01,08,10,11 = 700/1400 · 02,04,06 = 1000/2000 · 03 = 480/912 ·
05 = 480/920 · 07 = 960/1920 · 09 = 700/1400.
NOTE: always run PIL's ImageOps.exif_transpose() before resizing a phone
photo. IMG_0107 carried EXIF orientation 6 and exported sideways without it.

## Nav
`SiteNav` is global and fixed: BOTTOM of the viewport under `sm:` (640px),
TOP from `sm:` up. Leave >= 112px clear at the bottom of any full-height
first screen on mobile, or content lands behind it.

## SEO (required on every page)
Export `metadata` with: title, description (<=155 chars, real words),
`alternates.canonical`, and `openGraph` (title, description, url, type,
images: one real /trail/*.jpg with width/height/alt). Add JSON-LD via
`<script type="application/ld+json">` where a type genuinely fits.
Every `<img>` gets a real descriptive `alt`, or `alt=""` if decorative.

## Known hazards (learned from surveying the reference pack)
- Scope EVERY `url(#id)` SVG filter/mask/clipPath with React's `useId()`.
  Two mounted instances sharing an id corrupt each other silently.
- Run anything that splits or measures text after `document.fonts.ready`,
  then call `ScrollTrigger.refresh()`. SplitText's `autoSplit: true` also
  guards font-reflow.
- Never bake `window.innerHeight` into a ScrollTrigger `end:`. Use the
  function form so it recomputes on refresh.
- Never gate a whole effect on a once-evaluated `window.innerWidth > N`.
  Use matchMedia with a change listener, or ScrollTrigger.matchMedia.
- At most ONE wheel-capturing component per route.
