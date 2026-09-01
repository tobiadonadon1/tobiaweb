# /projects/mynd

## What this page IS
Tobia's PORTFOLIO CASE STUDY of Mynd. Written as Tobia, not as the company.
"Here is what I am building in this field, and what I have worked out so far."
It advertises and redirects to the real product site, https://www.soleagency.co/.
It is NOT a product landing page and must not read like one.

Mynd = a digital brain for companies. Connects the tools a business already
uses, builds one connected picture of what the company knows, answers
questions in plain language with sources, then automates the repetitive parts.
Same category as hyperspell.com ("a brain for your company").

HONESTY CONSTRAINT: it is a startup, very early. There are NO customers,
NO revenue, NO metrics. Do not invent any. The page says so plainly, and
that candour is the point.

## Accent
Mynd green `--mynd-green #2f7d5e` and amber `--mynd-amber #d97b2f`, on paper,
with navy ink for type. Blue is NOT the lead here.

## Grammar
Case file. Editorial dossier, generous margins, hairline rules, mono kickers
used sparingly. Distinct scenes with real cuts between them.

## Feeling curve
1 Recognition, uneasy: "that is exactly our company"
2 Clarity, the idea lands cleanly
3 QUIET: honest about how early it is  <- the hush before the peak
4 PEAK, wonder: scattered things become one connected structure and answer you
5 Understanding, calm: the four steps
6 Resolve: one door out

## The peak, in a visitor's words
"You drag your cursor over a mess of floating dots and they snap into a
constellation that answers your question, with the sources lit up along the path."

## Signature move (build this, it exists on no other page)
THE CONSTELLATION. A canvas/SVG field of ~40 labelled nodes (Slack, Gmail,
Notion, a contract, an invoice, a person) drifting loose and unconnected.
As the section scrolls in, edges draw between related nodes and the drift
settles into a stable graph. Then three sample questions sit beside it; on
hover/focus/tap of one, a path LIGHTS through the graph node by node and the
answer resolves underneath with its source nodes marked. Pointer parallax on
the whole field. Keyboard accessible: the questions are real buttons, focus
triggers the same path. Reduced motion: graph starts assembled, path shows
instantly on activation, no drift.

## Sections, in order

1. HERO. Anchor: lead (left). Device: kinetic type (use BlockReveal).
   h1 "A brain your company owns."
   lede "I am building a digital brain for businesses. This is the story of
   what it is, and what I have worked out so far."
   Quiet mono line: "Mynd, with one co-founder. Early."

2. THE PROBLEM. Anchor: split. Device: drifting fragments (pointer-reactive
   loose text/document chips that never quite settle).
   h2 "Your business is brilliant. Its memory is terrible."
   body "Everything a company knows sits in someone's head, someone's inbox,
   or a doc that was never finished. It works right up until the person who
   knew is away, or gone. Nobody designs it that way. It just happens, to
   everyone."

3. HOW EARLY IT IS. Anchor: centre, small, lots of air. Device: plain type,
   NO motion beyond a soft rise. This is the deliberate hush before the peak.
   h2 "There are no numbers on this page."
   body "Mynd is early. No customer logos, no revenue chart, no case study
   with a percentage in it. There is a working product, two people, and a
   problem we understand well. I would rather show you the thinking."

4. THE CONSTELLATION (PEAK). Anchor: full bleed. Device: the signature move.
   Largest scroll span on the page by a clear margin.
   h2 "Connect it once. Then just ask."
   Sample questions (real, useful, boring on purpose):
     "What did we promise this client in March?"
     "Who has touched the pricing page?"
     "Where did we land on the refund policy?"
   Each resolves to a short plain answer plus 2-3 lit source nodes.

5. THE FOUR STEPS. Anchor: trail (right). Device: horizontal lateral travel
   (pan). Lateral reads as "options/sequence", vertical reads as "argument".
   Connect  "It plugs in around the tools you already have. Nothing gets
             migrated, nothing gets replaced."
   Capture  "It keeps reading, so the picture stays current instead of going
             stale the week after setup."
   Answer   "Ask in plain language. Every answer carries its sources, so you
             can check it rather than trust it."
   Automate "Once it knows how the work goes, it can start doing the
             repetitive parts of it."

6. MY PART. Anchor: split, with a photo. Device: pinned editorial.
   Use /trail/trail-08.jpg (portrait, the window shot) or trail-04.
   h2 "It is two of us, and a lot of open questions."
   body "I handle the architecture and the product. My co-founder does the
   research. We are working out the rest in the open, which is why this page
   tells you where it is rather than where we hope it will be."

7. CLOSE. Anchor: centre. Device: quiet resolve, the graph reduced to a
   single lit path that runs off the page.
   h2 "It has its own home."
   body "Mynd lives at soleagency.co. The real thing is there, including a
   thirty minute call if it sounds useful."
   Primary link: https://www.soleagency.co/ (target _blank, rel noopener),
   label "Visit Mynd". Secondary: mailto tobia@donadon.com, "Email me".

## Metadata
title "Mynd" (layout template appends the site name)
description "I am building Mynd, a digital brain for companies: it connects
the tools you already use and answers questions about your own business, with
sources. Early, and built in the open."
canonical /projects/mynd. OG image /trail/trail-04.jpg.

## Revision 2 (2026-08-28)
Renamed to **myynd**, matching the live product. Route stays /projects/mynd.
Palette taken from soleagency.co rather than invented: terracotta #c4623b leads,
forest #1c3a2e is the one dark band, cream #efe8e0 and bark #241813 support.
Tokens are `--myynd-*` in globals.css.
- HERO now sits on a live drifting field of labelled terracotta specks
  (`hero-field.tsx`), the same species of mark the constellation later knits.
- NEW SECTION 1b, WHAT IT IS (`plain-statement.tsx`): one sentence, scrubbed
  word by word. The page used to go title -> problem, telling a stranger what
  is wrong with their company before saying what this is.
- THE PROBLEM headline softened. "Your business is brilliant. Its memory is
  terrible." stays on the product site; here it is "Everything the company
  knows is somewhere. Just not anywhere in particular."
- NEW: `spill-marquee.tsx` under the problem split, two rows of the ordinary
  places knowledge ends up, travelling in opposite directions.
- THE CONSTELLATION: lit colour moved from a green that was nearly invisible
  against the ink to terracotta, path 1.6px -> 2.4px with a wide faint pass
  under it, mesh 0.165 -> 0.30, nodes 0.26 -> 0.32 base. The three questions
  were a plain indented list with a 5px dot; they are bordered buttons now with
  a hover, an arrow and a full accent fill when live, under the label
  "Pick one and watch the field".
- FOUR STEPS: numbered, hung from a terracotta rule.
- CLOSE: moved onto a forest-green band, terracotta button.

---

## Revision 3 (2026-08-28)

**Section 4, the constellation, is DELETED.** The brief above still names it as
the page's peak and quotes it as "the peak, in a visitor's words". That is now
historical. Tobia confirmed the whole section goes: the three questions, their
answers, the source chips and the graph behind them. `constellation.tsx` and
`graph.ts` are gone.

**The new peak is the sphere's break.** `particle-sphere.tsx` travels from the
hero down beside the statement and then comes apart. Retimed so it is still
intact while the sentence is being read: measured 97% of its docked ink still
lit at the moment the statement's last line reaches the reading line, then
inhale (shell tightens 12%), flash (+31% brightness over the inhale), throw
(staggered per-particle launch), wire snap, and debris that keeps travelling
for most of a screen as it fades. Reversible to 100.0% of lit area, centroid
within 0.26 of a cell, radius within 0.05.

**The dangling "Then" is gone** from the statement heading. Removing the word
exposed a worse orphan ("from." alone on a line at every width from 430 to
1920), so the measure moved 19ch to 18ch. Swept 8 measures x 16 widths.

**Ground sequence now:** paper (hero + statement), cream (problem), paper
(How it works), cream (four steps), forest (close).

**The page is at 182 unique visible words**, well under this brief's 400-600
target. That is a direct consequence of the deletions Tobia asked for, not an
oversight. Putting it back in budget is a copy decision, and nothing may be
invented to do it.
