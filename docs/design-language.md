# TobiaWeb Design Language — "Ink & Paper"

The site is Tobia's notebook. Every section is a page in it; the visitor is
reading — and occasionally the notebook comes alive. The product being sold
is Tobia; the craft of the site is the proof (no logo walls — taste instead).

## The five elements

### 1. Paper
Warm `#faf8f2` + fractal grain everywhere (`.paper-bg`). Never `bg-white`,
never clinical. Sections are pages, not screens.

### 2. The Ink
Deep navy `#0b1f3a` (family: `#0c2342`, `#0e2949`, blends toward
`rgba(20,44,76)…rgba(29,63,104)` on glass). The ink is the FUTURE/DEPTH
color: the tide chapter, the cards' aurora, underlines, timeline dots,
selection color. Ink only ever appears with purpose — when the story
deepens. Large ink gradients must use ONE hue with a long eased multi-stop
alpha falloff (banding lesson), and edges always melt (no lines/borders at
color boundaries — waterline lesson).

### 3. The Line
A single continuous thin ink line = the narrative thread of the whole site.
Hand-drawn feel (subtle wobble, imperfect), it draws itself as you scroll
(SVG `stroke-dashoffset` scrubbed). It appears as: hairline rules (already
canon), the spine of the story timeline, an underline beneath one key word
in a headline, an annotation (a circle around a word, a small arrow to a
photo caption), and it ENDS at the site's last CTA as a single dot.
The Line is drawn, never animated in loops. One line per viewport max.

### 4. Photography — "sea tones"
Tobia's own photos only — they are artifacts, not decoration.
Treatment: cool sea-tone grade — slight desaturation, lifted blacks,
shadows shifted toward the ink's cyan-navy so every photo harmonizes with
the tide. Implementation: CSS `filter: saturate(.82) contrast(.97)` +
a navy-tinted overlay (`rgba(11,31,58,0.08)`, `mix-blend-mode: multiply` is
fine INSIDE the photo frame) — tune per batch.
Framing: hairline border on paper, mono caption beneath (place · year).
Motion: photos are never static — choose ONE per context:
 - slow parallax drift while in viewport (scroll-tied, transforms only)
 - "develop" on entrance (blur→sharp + rise, once)
 - very slow scale breathe (≤1.04, ≥20s) for hero-scale images only
Originals live in `assets/` (never deployed); web copies via the sips
recipe (≤1000px, JPEG q80) in `public/`.

### 5. Type voices
- Instrument Serif (`font-serif`) — display; titles speak.
- Serif ITALIC — the "spoken aside" voice: humble, human commentary
  ("Maybe we can figure it out together.").
- Geist Mono UPPERCASE wide-tracked tiny — the FACT voice: dates, statuses,
  captions, numbers. Facts are loud in content, quiet in size: proof is
  always set in mono, small — never shouted.
- Geist — body.
The humble/proof balance is typographic: bold claims in small mono facts,
soft voice in big italic serif.

## Motion principles
1. Three speeds only: hover (instant, ≤300ms) · settle (entrances, ~0.6-0.8s,
   once, blur→sharp/rise) · chapter (scroll-scrubbed, sticky stages).
2. Only three things are ever ALIVE autonomously (one per chapter): the
   mountains (hero), the aurora drift (identity cards), the constellation
   net (the ink). Everything else moves only with the visitor.
3. Scroll choreography is continuative: chapters arrive WITH the scroll and
   leave BY the scroll (no counter-scroll animations — recede lesson).
4. Transforms/opacity only in loops; `prefers-reduced-motion` always
   respected (freeze, don't remove meaning).
5. GSAP-scrubbed elements: initialize transforms via `gsap.set`, never
   inline percentage transforms.

## Page arc (the story being sold)
1. Intro loader — the name, typed; his photos trail the pointer. ✅
2. Hero — identity in one line, mountains alive. ✅
3. Identity cards — philosophy (Who/Where/Why). ✅
4. **The Road So Far** — a ROADMAP, not chapters (Tobia: "quick things are
   better — nobody reads long chapters"): one section, the Line as its
   winding spine drawing itself with scroll, ~7 pins of a few words each
   (mono year · serif phrase · mono sub-line), alternating sides; closes
   with the honesty aside in italic serif ("Most of it isn't finished yet —
   that's why you haven't heard about it"), which does the humble-proof
   work the failure chapter would have. Photos optional, added sparsely
   later. ✅ (`components/sections/RoadSoFar.tsx`)
5. Ink tide → Projects (Book / Sole / Superhuman). ✅ (bento design pending
   Tobia's direction)
6. Proof — concrete artifacts now; real Sole testimonials later (Nick
   pattern: name, company, specific result, set small in mono). ⬜ later
7. Thoughts — "Watch me think.": blog cards (`components/ui/article-card.tsx`
   — serif headline, mono tag-pill/read-time/byline, sea-toned cover,
   glass-on-paper) + working Load More ("More soon." when dry) in
   `components/sections/ThoughtsSection.tsx`. Content = plain array of
   draft posts for now; Hermes may feed the same shape later. ✅ (copy draft)
8. About — "Hi. I'm Tobia.": the quietest section; the visitor finally
   MEETS him. Editorial letter spread (direct-voice letter + italic aside +
   signature + "write me" mailto) beside one sea-toned portrait with mono
   caption and a whisper-sized fact stack (Roots/Formed/Age/Practice/
   Currently). The Line cameos as a hand-drawn stroke under his name,
   drawn on entry. ✅ (`components/sections/AboutSection.tsx`; letter copy
   draft, portrait is a placeholder pick)
9. Now / Talk to me — current focus + one human CTA; the Line ends in a
   dot here. ⬜ later

## References (analyzed June 2026)
- nickvelten.nl — selective-collaborator framing, facts-not-boasts, playful
  type casing, tag clouds, testimonial credibility stacking.
- sophiaamoruso.com (+ /my-story) — escalating chapter narrative, repeating
  header rhythm, the prominent failure beat, story→offer conversions.
We copy their STRUCTURE, never their proof style — Tobia's proof is
building in public and the site's own craft.
