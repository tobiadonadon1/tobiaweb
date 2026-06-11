# Projects Section — "Ink Tide" chapter

Date: 2026-06-10 · Approved by Tobia (option: Ink tide; click: same-tab zoom)

## What

Replace the `#projects` placeholder with an immersive chapter directly under the
identity cards:

1. **Ink-tide transition** (sticky, scroll-scrubbed ~240vh): a deep-navy ink wash
   (`#0b1f3a` family) rises over the paper like a tide — `mix-blend-mode: multiply`
   so the paper grain shows through (ink soaking paper). A thin luminous sky-blue
   crest line rides its top edge. Sparse cyan embers (2D canvas, ~110 motes,
   `lighter` compositing) drift upward, peaking at the crest. At the crest a
   paper-white serif line surfaces ("PROJECTS / What I'm building."), then the
   tide recedes and the cards are left surfaced on warm paper. Section ends on
   paper — no permanent dark mode.
2. **Bento grid, reads as three** (adapting the downloaded 21st.dev BentoGrid to
   the house style): grid-cols-3 — The Book = flagship (col-span-2 + row-span-2),
   Launch Consulting + Tools & Products stacked in the third column. Paper-glass
   skin: GLASS_BG gradient, 24px radius, hairline border, backdrop blur, top
   sheen, serif titles, mono uppercase status (no SaaS chips/#tags/dot-grids),
   icon in a soft glass square, "Enter ↗" reveal + lift + faint aurora wisp on
   hover (reuses `.aurora__blob` classes at low opacity).
3. **Click = zoom in, same tab**: card scales toward viewer while the rest fades
   behind a paper overlay (~400ms), then `router.push` to the project's own page.
   Cmd/middle-click untouched (real `<Link>`). Reduced-motion: instant push.
4. **Three stub pages** (copy comes later): `/projects/book`,
   `/projects/agency`, `/projects/products` — paper, serif title, draft blurb,
   back link to `/#projects`. SiteNav urls become `/#…` so nav works from
   subpages.

## Files

- `components/sections/ProjectsSection.tsx` — tide stage (GSAP ScrollTrigger
  scrub, sticky like StackedPhrases) + grid + entrance stagger.
- `components/ui/bento-grid.tsx` — re-skinned bento (items: title, description,
  icon, status, href, flagship) + zoom-out navigation.
- `components/ui/ember-field.tsx` — canvas embers, driven per-frame via
  `progressRef` (house live-ref pattern, like glsl-hills `tintRef`).
- `app/projects/{book,agency,products}/page.tsx` — stubs.
- Edits: `app/page.tsx` (mount section), `components/nav/SiteNav.tsx` (`/#` urls).

## Constraints

Paper everywhere (multiply tide keeps grain; never `bg-white`). GPU-only loops
(transform/opacity; canvas embers gated to the stage being active).
`prefers-reduced-motion`: no tide scrub-jank (tide still scrubs — it's
scroll-tied, not autonomous), embers off, instant navigation. Draft copy is
placeholder — Tobia rewrites later.
