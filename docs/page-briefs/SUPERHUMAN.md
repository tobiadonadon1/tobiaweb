# /projects/superhuman

## What this page IS
Where Tobia sells his info products. Two things exist and both are real:
  A) Templates, systems and playbooks (digital, self-serve)
  B) One-to-one consulting / advisory (a small number of clients)
It is the most commercial page on the site, and it still must not be cocky.
Sell by being useful and specific, not by promising outcomes.

NO invented prices, NO invented product titles, NO fake testimonials, NO
"join 2,000 others". Where a real title or price is needed, use an obviously
editable placeholder and leave a clear `TODO(tobia):` comment in the source.

## Accent
BLUE is the lead here: `--accent-sky #38bdf8` over paper and deep navy ink.
This is the page where the site's primary colour does the most work.

## The mark
There is a logo reference: an ASYMMETRIC EIGHT POINT STAR, pale blue, with
rays of deliberately uneven length (one long ray up-left, one long right, the
rest shorter). Rebuild it as a clean inline SVG component
`components/ui/superhuman-star.tsx`, single path, currentColor, no raster.
It is the page's recurring device.

## Grammar
Product catalogue with an editorial spine. Distinct scenes.

## Feeling curve
1 Curiosity: a mark, a claim, almost nothing else
2 Recognition: "that is me, I am using these tools at ten percent"
3 QUIET: the honest disclaimer  <- hush before the peak
4 PEAK, appetite: the shelf assembles and you want to open one
5 Trust: the human offer, one to one
6 Resolve: one action

## The peak, in a visitor's words
"The star comes apart into its eight rays and each ray lands as a card on the
shelf, and the one under your cursor lifts and tells you what is inside."

## Signature move
THE STAR IS THE SHELF. The hero mark's eight rays detach on scroll and fly
into position as the product grid, each ray becoming a card's leading rule.
The star then persists as a small fixed compass in the corner whose longest
ray points to the section you are in, rotating as you scroll. Pointer
proximity makes the nearest rays lengthen slightly. Reduced motion: cards are
simply present, compass is static.

## Sections, in order

1. HERO. Anchor: centre, very sparse. Device: SVG draw-on of the star plus
   kinetic type.
   h1 "Superhuman"
   lede "The tools got extremely good, extremely fast. Most of us are still
   using them like a slightly better search box. This is where I write down
   what actually works."

2. THE PREMISE. Anchor: lead. Device: pinned type, line by line.
   h2 "One person with the right systems is doing work that needed a team."
   body "I am not special. I am early, and I take notes. Everything on this
   page is something I run myself, written down properly enough that you can
   run it too."

3. THE DISCLAIMER. Anchor: trail, small. Device: static type. The hush.
   h2 "What you will not find here."
   body "No revenue screenshot. No income claim. No countdown timer. I would
   rather you judge the work than the promise attached to it."

4. THE SHELF (PEAK). Anchor: full bleed grid. Device: the signature move.
   Largest scroll span. Three product families, each a real card:
   Playbooks  "Step by step walkthroughs of things I have actually shipped,
               including the parts that went wrong."
   Systems    "The setups I run every day, documented so you can copy them
               whole rather than rebuild them."
   Templates  "The starting points. Mostly they exist so you never have to
               look at a blank page."
   Each card: name, one line, a short "what is inside" list of 3 items, and a
   CTA. TODO(tobia) markers for real titles and prices.

5. ONE TO ONE. Anchor: split, with a photo (/trail/trail-06.jpg or 02).
   Device: editorial split, image reveal by clip-path.
   h2 "Or we do it together."
   body "Some things do not survive being written down. If you want a second
   pair of hands on something specific, I take a small number of one to one
   clients. Short focused stretches, and things ship in between them."
   CTA: mailto tobia@donadon.com with a subject line prefilled.

6. CLOSE. Anchor: centre. Device: the star reassembles, resolves, holds.
   h2 "Start with one thing."
   body "Pick the nearest one to what you are stuck on. If none of it fits,
   write to me and say what you are trying to do."
   Primary CTA + email link.

## Metadata
title "Superhuman"
description "Templates, systems and playbooks I actually use, plus a small
amount of one to one work. Practical tools for doing more than one person
used to be able to do."
canonical /projects/superhuman. OG image /trail/trail-06.jpg.
JSON-LD: ItemList of the three product families (no prices, no ratings).

## Revision 2 (2026-08-28)
Nothing is for sale yet, so the shelf stopped pretending to be a shop.
- The card foot was `[ title ] · [ price ]`, which reads as out of stock. It is
  now a real `status` line per family (see shelf-data) plus one action,
  "Finish this one first", pointing at `#waitlist` and preselecting that family.
- NEW SECTION 5, THE LIST, between the shelf and the one-to-one. Heading
  "None of it is for sale yet." One email field, three chips, and the honest
  trade: whichever family gets picked most is the one finished next.
- The shelf and the list are ONE continuous ink band. The shelf lost its bottom
  melt; the list owns the melt back to paper.
- The close's primary CTA was "Back to the shelf", which sent a ready reader
  upward. It is now "Put me on the list".
- Hero lede gained ", in enough detail that you can run it tomorrow."
- The compass gained a seventh tick; it reads sections out of the DOM, so it
  stayed in sync by itself.

---

## Revision 4 (2026-08-28)

**The three offer pages are gone.** `/projects/superhuman/{playbooks,systems,
templates}` existed for about one round. The verdict: "The different offers in
SuperHuman could be done way simpler. It could just be a card and not even a
page." Routes deleted, `offer-page.tsx` / `offer-form.tsx` / `offer-meta.ts` /
`offer-motion.tsx` deleted, and `sitemap.ts` no longer emits them.

The capture lives on the CARD now (`shelf-signup.tsx`). The card's action is a
button naming what arrives; pressing it swaps the button for the field in
place, focus already in it, Escape closes and returns focus. The three cards
share a subgrid whose 1fr track absorbs the growth, so opening one does not
move the pinned scrub: card tops measured identical at 320px across closed,
open and sent.

Only the proof line survived from the offer pages ("Two written. One in
testing."), placed above the admission. "What is inside" and "Not for you if"
were cut.

**One ink ground, one melt.** The page went navy shelf, melt to cream, hard cut
into a full-bleed photograph. Three grounds in a few hundred pixels. The
photograph is dropped entirely (not reframed): it was doing the work that scale
and ground should do, and everything else on the page is drawn. The one-to-one
now runs on the same `var(--ink)` as the shelf, unbroken for 4068px, and owns
the single melt back to paper. Measured ground sequence: paper 0-3376, melt,
ink 3508-7576, melt, paper to the end. Two changes, not four.

Visible word count 220, deliberately under the 350-500 budget.
