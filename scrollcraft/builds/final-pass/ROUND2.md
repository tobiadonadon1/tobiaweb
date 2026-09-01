# Round 2 — every item

## N · NAVIGATION (mine)
- [x] N1  Back from a project page must land on the homepage's PROJECTS section,
          not replay the hero photo loader from the top
- [x] N2  Nav pill selector sometimes stays on "Projects" while you are on Home
- [x] N3  "Myynd" takes a capital M in the projects listing

## S · SUPERHUMAN (agent A)
- [x] S1  The shelf: too much text, nobody will read it. Redesign + rewrite.
- [x] S2  Move the "None of it is for sale yet" waitlist OFF the superhuman
          page and onto the singular offer page you land on
- [x] S3  No "which one first" chips: entering an offer IS the choice, so the
          form is just an email field
- [x] S4  "Or we do it together" needs a stronger, more impactful design

## M · MYYND (agent B)
- [x] M1  The sphere travels WITH the scroll, down beside the "It reads what the
          company already writes down" statement, then breaks and shatters
          subtly. Scroll back up and it reassembles.
- [x] M2  Delete "There are no numbers on this page." entirely
- [x] M3  Redesign the constellation question panel. Nobody will click or hover.
          Show all three at once. Simpler. The current look underneath is wrong.
- [x] M4  "How it works": remove "Not filmed yet" and remove the subtitle
- [x] M5  Delete the "I lead this one." section

## B · BOOK (agent C)
- [x] B1  "It is not finished." becomes a pre-order
- [x] B2  Remove "One email, the day it is real."
- [x] B3  Remove the hero lede "On the minds we are building..."
- [x] B4  Add colour. It is very black. Orange, blurs, an energy feel.

## W · WHY ME (mine)
- [x] W1  Remove the "Straight up" kicker, make that text bigger
- [x] W2  Same treatment for "I use it before I write it down"
- [x] W3  Both texts should stand out more

## F · FOOTER (mine)
- [x] F4  The name lights up as you reach it


---

## Verified 2026-08-28, round 2

52/52 automated assertions pass across two suites (7/7 navigation, footer and
why-me; 45/45 the three pages), at desktop 1440x900 and mobile 390x844: zero
page errors, zero console errors, zero horizontal overflow, one h1 per page, no
heading-level jumps. Typecheck clean. Production build passes, now 23 routes:
the three offer pages are generated into the sitemap from SHELF, so a fourth
offer cannot be added and silently left out of the index.

Word counts: superhuman 212, each offer page around 165, myynd 377, book 55.

### Still open
- The employer constant in WhyMeSection is still null. The company name never
  arrived. Null renders an honest unnamed sentence, never a placeholder.
- WAITLIST_WEBHOOK_URL is unset, so every form still reports durable:false and
  tells the visitor to email instead. The offer pages and the book pre-order
  both behave correctly and honestly in that state.
- The book no longer says what it is about. Removing the lede was explicit, but
  the page is now a title, a poster and an ask. The film closes that gap.
- Nobody is named on the myynd page now that "I lead this one" is gone. The
  structured data still credits Tobia; no visible copy does.
- The myynd question panel could be matched to the real product interface if
  Tobia sends the screenshots he offered.
