# Homepage redesign — build contract

**Date:** 2026-06-15 · **Status:** Design APPROVED by Tobia ("go build it and improve"). Speed mode.
**One line:** Kill the "too white / templated / generic" feeling holistically — bring purposeful ink-depth and editorial craft into every flat section, restructure the page, and rewrite the story around Tobia's real qualification (the *approach*, the *combination*), without leaving Ink & Paper.

This doc is the SHARED CONTRACT for a parallel, by-section build. Visual + information-architecture + copy decisions are unified here; each section agent applies ALL THREE to its own files (split by file set, not by concern, to avoid collisions).

---

## 0. Operating constraints (EVERY agent, non-negotiable)

- **Stack:** Next 16.2.7, Tailwind v4 (inline `@theme` in `app/globals.css`), Three.js GLSL hero (`components/ui/glsl-hills.tsx`), GSAP + ScrollTrigger, Motion (navbar only). **READ `node_modules/next/dist/docs/` before using ANY Next API** — per AGENTS.md this Next differs from training data.
- **Design language:** `docs/design-language.md` "Ink & Paper" — but executed per the decisions below.
- **"Not generated-looking" is a hard rule.** BANNED: underline/highlight under a word in a headline; gradient-fill text; equal glassy floating cards; sky-glow as decoration; pill+glow hero; emoji; generic testimonial cards. REQUIRED instead: editorial/print feel — asymmetry, hairline rules, real paper grain, small wide-tracked mono facts, Instrument Serif display, intentional whitespace.
- **No sea-tone photo grading anywhere.** Photos (where they appear) are natural/ungraded. (Overrides design-language.md element 4.)
- **Color discipline:** paper `#faf8f2` stays dominant; deep-navy ink `#0b1f3a` family ARRIVES at the beats for weight/depth (Direction A); sky/teal accent (`#38bdf8` / `#cfe9ee` / `#083344`) reserved mostly for *live/interactive* moments (cursor, hover, the Line's dot) — not decoration.
- **Motion:** three speeds only (hover ≤300ms · settle ~0.6–0.8s once, blur→sharp/rise · chapter scroll-scrubbed). `prefers-reduced-motion`: freeze, keep meaning. Transforms/opacity only in loops. GSAP: init via `gsap.set`, never inline % transforms (known trap).
- **Placeholder policy — DO NOT FABRICATE FACTS.** Tobia will send real company names / results / testimonials later. Until then use clearly-marked placeholders: `{{AGENCY_NAME}}`, `{{AI_COMPANY_NAME}}`, `{{CLIENT_RESULT}}`, `{{TESTIMONIAL_n}}` / `{{ATTRIBUTION_n}}`. Keep honest generic descriptors ("a social-media agency I started at 15", "AI systems businesses actually run", "a major company") — never invent a proper noun, number, or quote. Decision: **name his own companies (placeholders for now), describe the employer, never name it.**

---

## 1. Page order — `app/page.tsx`

```
Hero → StackedPhrases (identity) → RoadSoFar (= Road + About, merged) → ProjectsSection
     → TestimonialsSection (NEW) → PhotosSection (NEW) → ThoughtsSection → SiteFooter (global, in layout)
```
- Standalone `AboutSection` is REMOVED from `page.tsx`; its content folds into the end of `RoadSoFar` (see §3.2).
- Section anchors/nav ids preserved where they exist (`#home #road #projects #thoughts`); add `#testimonials`, `#photos`.

## 2. Copy spine (the through-line — governs ALL section copy)

Tobia's qualification = **the approach + the combination**, proven by a compounding track record:
building real things since a kid → **a social-media agency started at 15 (paying clients)** → **real AI work for businesses now** → **a major company pays him to do exactly this**. No single fact proves it; the *sequence* does.
- The **Road proves it by compounding** — each beat raises the stakes until "businesses, and a big company, pay me for exactly this" reads as inevitable.
- The **offers then read as obvious**: Superhuman (B2B AI systems/infra, OPEN), Sole (launch your first thing, OPEN), the Book (the inner-world horizon, finishing/late 2026).
- The **book + inner-world thread rides alongside as the soul** (the intersection of technology and the inner world) — NEVER as the proof.
- **Retire** the soft/false lines: "fell in love with building things", "travel on a one-way curiosity", "paying attention to dreams", and especially the apologetic Road close *"Most of it isn't finished yet — that's why you haven't heard about it."* Replace with confident: *it's ready / arriving — that's why I'm telling you now.*
- Voice rule: if a line could sit in a growth-hacker's bio, it's wrong. Proof is loud in content, quiet in size (mono).
- Product positioning canon: `docs/funnel-strategy.md` §3 (Superhuman repositioned to B2B AI consulting/infra; Book "finishing — out late 2026"; Sole "open — for first launches").

---

## 3. Section directives

### 3.1 Hero — `components/hero/HeroSequence.tsx`, `components/ui/glsl-hills.tsx`, `components/ui/button-colorful.tsx`
- **Standing weight (not just on hover):** give the mountains more tonal depth at rest (deepen valley ink, lift ridge presence); subtly ground the lower third in ink so the headline + CTA stop floating in white.
- **Kill the awkward blank space:** re-anchor the composition so the empty area reads as intentional — bring the mountains up to meet the text and/or align the headline block to a deliberate margin; place one small **mono detail** (a dateline / where-I-am / a one-line through-line tag) to occupy dead space on purpose.
- **Cursor-on-mountain glow (explicit ask):** extend the EXISTING `uTint` band in the fragment shader to FOLLOW THE POINTER. Add a `uCursorX` (0–1) uniform (+ optional `uCursorActive`); on `mousemove` over the hero, ease a tint band centered on cursor-X across the ridge, in the SAME sky/teal family as the button hover; decay ~0.6s on leave. Reuse the existing `hillsTintRef` RAF-easing pattern; the CTA-hover tint and the cursor tint may coexist (add). Disable under `prefers-reduced-motion`.
- **Headline LOCKED** ("I'm figuring this out. / Maybe we can figure it out together."). **Rewrite the subtitle** to the through-line (names the real work: tools, AI for people & businesses, the book — the intersection). CTA "See what I'm building" → `#projects` KEEP.

### 3.2 The Road + About (merged) — `components/sections/RoadSoFar.tsx` (fold in `components/sections/AboutSection.tsx`)
- **Break the predictable L–R zigzag.** The Line becomes a **continuous left rail** (hand-drawn, draws on scroll) that **deepens to true ink** as it descends toward "now". Entries are typeset rows (mono year · serif phrase · mono sub) stepping down the rail — not alternating sides.
- **Rewrite the pins** to the compounding through-line (the agency at 15, the AI-for-business now, the big company). Keep them few and quick.
- **Lands in the About beat on an ink ground** — the merged "here's who's telling you this": the letter (rewritten, de-generic), the fact stack (Roots/Formed/Age/Practice/Currently — keep mono), the hand-drawn stroke under "Tobia", a "write me" mailto. The portrait is OPTIONAL and ungraded (no sea-tone); a placeholder frame is fine.
- **Close confident**, not apologetic (see §2). The closing aside is the humble-but-proud landing, not "you haven't heard about it."
- Entrances via IntersectionObserver (not ScrollTrigger) — known lesson.

### 3.3 Projects — `components/sections/ProjectsSection.tsx`, `components/ui/bento-grid.tsx`
- **Full-screen section.** Layout = the approved **1b**: **Superhuman is the ink feature** (deep-navy panel, the OPEN/sellable lead, mono status, serif title, body, "write me"); **Sole + The Book are flat editorial index rows** beside it (hairline rules, mono status, serif title) — NO glass, NO equal floats.
- **Hover = blog-unfurl:** hovering an index row expands it (grows; the other recedes) and reveals more copy (and a real photo IF/when provided — ungraded; otherwise just the expanded copy, NO placeholder grey blocks shipped). Keep the existing **click → shared-element expand into the project page**.
- The Book NEVER headlines until launch (then it flips to feature — leave a clear seam/comment for `bookShift`).
- Keep the ink-tide entrance (it's good ink-depth) but ensure it reconciles with the full-screen feature (don't double up). Card copy per §2 / funnel §3.4.

### 3.4 Testimonials — NEW `components/sections/TestimonialsSection.tsx`
- After Projects. **Not testimonial cards.** Typeset: a large serif quote, mono attribution (name · role · company, per the proof-depth decision), hairline rules. Sits on **the one ink spread** (the deliberate big color beat) OR paper with a strong ink accent — pick what reconciles with neighbors.
- Built to hold **2–3 real quotes** Tobia will send; until then, clearly-marked `{{TESTIMONIAL_n}}` placeholders with elegant empty-state styling (must look intentional, not broken).

### 3.5 Photos — NEW `components/sections/PhotosSection.tsx`
- Under Testimonials. Tobia's real photos, **natural/ungraded**, editorial gallery (asymmetric, hairline frames, mono captions `place · year`). Motion: one of develop-on-entrance / slow parallax (transforms only), reduced-motion safe.
- Ship with tasteful framed placeholders that look right empty; Tobia drops real files into `public/` later.

### 3.6 Identity cards / Thoughts / Footer
- **StackedPhrases** (`components/sections/StackedPhrases.tsx`): KEEP; raise to the new depth (ink arrives in the aurora/ground), de-genericize, copy per §2. It's already the most alive section — light touch.
- **ThoughtsSection** (`components/sections/ThoughtsSection.tsx`): KEEP; editorial polish + the new depth; cards stay.
- **SiteFooter** (`components/sections/SiteFooter.tsx`): polish the existing — labeled mono channel links (INSTAGRAM @ · LINKEDIN · EMAIL), `rel="me"`; the serif name; the Line ends in its single dot (keep). Per funnel §3.9.

### 3.7 Foundation — `app/globals.css`
- Add the depth/editorial utilities the sections consume: an **ink-field / ink-spread** background (one-hue navy, long eased multi-stop alpha falloff — banding lesson; edges melt — waterline lesson), an **editorial index-row** hairline pattern, any shared accent tokens. Keep `.paper-bg` grain. Define before/alongside section work so consumers don't diverge.

---

## 4. Build plan (parallel, conflict-free by file set)

1. **Foundation FIRST (sequential):** `app/globals.css` depth utilities + `app/page.tsx` new order (wire placeholders for new sections). Then →
2. **Parallel section agents (disjoint files), each applying the unified visual+IA+copy contract:**
   - **A. Hero** — `HeroSequence.tsx`, `glsl-hills.tsx`, `button-colorful.tsx` (depth + grounding + cursor glow).
   - **B. Road+About** — `RoadSoFar.tsx` (+ fold `AboutSection.tsx`), retire standalone About.
   - **C. Projects** — `ProjectsSection.tsx`, `bento-grid.tsx` (full-screen 1b + hover-unfurl).
   - **D. Testimonials + Photos** — two NEW section files.
   - **E. Identity + Thoughts + Footer** — `StackedPhrases.tsx`, `ThoughtsSection.tsx`, `SiteFooter.tsx`.
3. **Reconcile + verify (lead):** `app/page.tsx` final composition + neighbor transitions (paper↔ink seams melt), then `npm run build` + typecheck clean; reduced-motion sanity; no fabricated facts shipped.

## 5. File-access note
macOS blocks READING pre-existing repo files for some session processes (TCC/provenance). Confirmed: writing NEW files works. Build agents are instructed in their dispatch to obtain real file contents via `git show HEAD:<path> > /tmp/...` then Read the /tmp copy, and to write edits via the confirmed working write path. No action required from Tobia.

## 6. Facts still to collect (non-blocking; scaffold with placeholders)
`{{AGENCY_NAME}}` (the agency at 15 — and what it actually did), `{{AI_COMPANY_NAME}}`, real `{{CLIENT_RESULT}}`s, 2–3 `{{TESTIMONIAL}}`s + attributions, the photo set.
