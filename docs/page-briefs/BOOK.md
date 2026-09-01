# /projects/book

## What this page IS
A book Tobia is still writing, about consciousness and self discovery next to
artificial minds. The page's ONE job is to earn an email address for when it
is ready. It is the quietest, most atmospheric page on the site.

Existing page is being replaced wholesale. KEEP this copy, it is good:
  lede: "A long book about minds: the ones we are building, and the ones we
  already are."
  The four currents:
    Lifestyle     "how a life actually gets built, day after ordinary day."
    Spirituality  "the parts of being human a model cannot reach."
    Creativity    "making things as a way of thinking, not decorating."
    Mindset       "the quiet discipline running underneath all of it."
  What a reader carries away:
    "A way to think about AI that is neither hype nor doom."
    "The questions worth sitting with, not a stack of tidy answers."
    "Permission to build slowly, and on purpose."
    "A companion for your own figuring out."

## Accent
Deep navy ink dominant, paper receding. This is the one page allowed to go
DARK: an ink ground with paper coloured type. Blue used as the faintest
possible light, never as a button colour. No green, no amber, no clay.

## Grammar
Printed chapters. It should feel like a book object, not a landing page.
Wide margins, a visible baseline discipline, page-number-ish marginalia.

## Feeling curve
1 Stillness: almost nothing on screen
2 Curiosity: one question, held
3 Recognition: the four currents
4 PEAK, intimacy: a real passage surfacing out of the dark, read at reading pace
5 QUIET: what you carry away
6 Resolve: a single line and one field

## The peak, in a visitor's words
"A paragraph rose up out of the dark one line at a time, at the speed you
actually read, and for a second it felt like the book was being written while
you looked at it."

## Signature move
THE SURFACING PASSAGE. A real excerpt on the ink ground. Lines do not fade in
on a timer: they surface as the reader scrolls, each line rising from below a
soft blur with its own slight delay, so scrolling IS the act of reading. Scroll
back and the lines sink again. In the margin a faint line-count ticks. Nothing
else moves on this screen. Reduced motion: the whole passage is simply present.

TODO(tobia): the passage is a placeholder draft. Mark it clearly in the source
so Tobia can drop in real text. Write ~90 words, first person, plain, no
mysticism-by-vocabulary, in his voice.

## Sections, in order

1. HERO. Anchor: centre, enormous negative space. Device: single line of
   kinetic type on ink. No image.
   h1 "The Book"
   lede (keep verbatim) "A long book about minds: the ones we are building,
   and the ones we already are."
   Status, quiet mono: "Being written. No date yet."

2. THE QUESTION. Anchor: centre, one sentence alone on a screen.
   Device: slow character reveal tied to scroll.
   "What happens to a person who spends every day beside something that
   thinks?"

3. THE FOUR CURRENTS. Anchor: lead, indexed like a contents page.
   Device: staggered rows, hairline rules, hover lifts the rule.
   Use the four verbatim.

4. THE PASSAGE (PEAK). Device: the signature move. Largest scroll span.
   Deliberate silence before it: section 3 ends with a lot of air.

5. WHAT YOU CARRY. Anchor: trail. Device: simple stagger, no cleverness.
   The four takeaways verbatim.

6. WHY. Anchor: split with a photo (/trail/trail-01.jpg or 11, portrait).
   h2 "Why I am writing it."
   body "I keep having the same conversation with myself and finding it is
   the same conversation other people are having quietly. Writing it down is
   how I find out what I think. Publishing it is how I find out if I am the
   only one."

7. CLOSE. Anchor: centre. Device: resolve and hold. The one field.
   h2 "It arrives when it is ready."
   body "No launch date, because I do not have one. Leave an address and I
   will write once, when there is something to read."
   Email capture: a REAL accessible form (label, input type=email, required,
   submit). No backend exists: wire it to a `TODO(tobia)` handler that does
   optimistic local success state, and comment clearly that it needs an
   endpoint. Never pretend it stored something it did not.

## Metadata
title "The Book"
description "A long book about minds: the ones we are building, and the ones
we already are. On consciousness, creativity and attention, written in public."
canonical /projects/book. OG image /trail/trail-01.jpg.
JSON-LD: Book with author Tobia Donadon, no ISBN, no price, no date.

## Revision 2 (2026-08-28) — REBUILT
The page was too simple, had nowhere for a film, and opened on two nearly empty
screens. 10,594px -> 6,965px, seven beats -> five.

CUT: `the-question.tsx` (the "What happens to a person who spends every day
beside something that thinks?" screen, which Tobia did not write and does not
want), `carry-list.tsx`, `why-split.tsx`, `close-form.tsx`. Files deleted.

NEW ORDER: the object, the currents, silence, the passage (peak), the film,
the close.

1. THE OBJECT (`floating-book.tsx`). A closed hardback hanging in the dark:
   six real faces in CSS 3D, a page block with visible leaves, a specular band
   that travels across the cover as the book turns, a slow bob and a cast
   shadow. It turns with the pointer from anywhere on screen and it NEVER
   opens. One rAF writes two transforms and one background-position; the loop
   stops via IntersectionObserver when the book is off screen. Reduced motion:
   static at its resting angle.
   Copy remade: "I am writing a book about minds. The ones we are building, and
   the ones we already have." CTA "Stay tuned" jumps to the form.
   The scaled object keeps its full 482px layout box, so the wrapper carries an
   explicit height per breakpoint, including a max-height:720px rule for short
   phones. Verified clear of the bottom nav at 375x667 and 390x844.
2. THE CURRENTS. Kept verbatim, padding roughly halved.
4. THE PASSAGE. Unchanged device; track 480vh -> 320vh.
5. THE FILM (`the-film.tsx`). VideoFrame gained a `tone="ink"` variant that
   sinks the poster into the ground. Poster is trail-11.
   TODO(tobia): pass `source={{ kind: "file", src: "..." }}` when it is shot.
6. THE CLOSE (`stay-tuned.tsx`). "Stay tuned." + one field, posting to
   /api/waitlist, which reports whether the address was actually forwarded to a
   list or only logged. The confirmation copy says which.
