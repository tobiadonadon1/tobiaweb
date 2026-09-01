# Final pass — every item, tracked

Status key: [ ] todo · [x] done + verified · [?] needs confirmation · [-] dropped w/ reason

## A · HOMEPAGE, the scrolling photo marquee
- [x] A1  trail-01 (cap + city): reframe so his FACE is in shot
- [x] A2  trail-10 (two friends): raise/centre so BOTH faces are framed
- [x] A3  trail-11 (mountains): reframe to show a bit of the road

## B · HOMEPAGE, project cards
- [x] B1  Superhuman box hover "jumps" -> make it subtle
- [x] B2  remove the status labels entirely
- [x] B3  remove the "write me, tell me what you're building" slogan under Superhuman
- [x] B4  each card description far shorter

## C · /projects/superhuman
- [x] C1  h1 "Superhuman" letters clipped (the P), fix the clipping
- [x] C2  hero subtitle too long / not engaging / not striking -> rewrite short + striking
- [x] C3  star too bright and flat -> darker, more dimension
- [x] C4  hero not striking enough -> raise it, keep minimal
- [x] C5  "One person with the right systems is doing work that needed a team."
          reads as self-entitled and self-referential. REPLACE with a hard truth
          about the INDUSTRY: the tools became accessible to everyone, almost
          nobody knows how to use them, and that gap is where the chaos and the
          opportunity both are.
- [x] C6  "I am not special. I am early, and I take notes..." -> much shorter,
          better placed, more dynamic. Idea he gave: near-invisible on the paper,
          revealed by the cursor passing over it.
- [x] C7  "What you will not find here." good statement, present it better /
          more dynamic / more interactive
- [x] C8  the shelf: shorter + better copy; grey is too weak to read; rules not
          aligned; does not make him want to open one
- [x] C9  cut "Whichever gets picked most is the one I finish next, and that is
          the whole roadmap." Keep only "Pick the one you would open first."
- [x] C10 "None of it is for sale yet" moves INSIDE, revealed after clicking
          "Finish this one first", not sitting under the shelf
- [x] C11 cut the waitlist subtitle "The three above are real, and about half..."
- [x] C12 remove "One email when the first one lands..." under the email field
- [x] C13 "Or we do it together." KEEP. Rewrite the body to say what the service
          actually is: side by side, or he builds it, with his expertise and
          connections
- [x] C14 "Start with one thing." too cluttered -> simplify
- [x] C15 page overall: more interactive, more fun, more dynamic

## D · /projects/mynd
- [x] D1  KILL the pointer-moves-the-background hero field
- [x] D2  "A brain your company owns." centred
- [x] D3  remove the hero subtitle
- [x] D4  remove the hero status line
- [x] D5  a sphere of particles behind, interacting with each other, alive
- [x] D6  keep the statement/slogan section below the hero
- [x] D7  stop dividing sections with hairlines
- [x] D8  no more tiny type in weak grey (the mono kickers)
- [x] D9  problem section: cut a lot of the text; the right-hand graphic is not
          engaging -> make it move on scroll, possibly the same sphere
- [x] D10 the tool chips are good, but the two rows should travel in OPPOSITE
          directions as you scroll (top -> right, bottom -> left)
- [x] D11 remove the 01/02/03/04 numbers
- [x] D12 completely redesign "Connect it once. Then just ask." Far less text.
- [x] D13 "It does four things." weak title, worse subtitle, and it says FOUR
          while only THREE are visible
- [x] D14 the body under each step will not be read -> cut
- [x] D15 the scrolling line does not complete
- [x] D16 the circle only appears on the lower half
- [x] D17 remove the text over the video AND the cursor light effect on it
- [x] D18 different poster; move the video ABOVE the timeline; retitle "How it works"
- [x] D19 "It is two of us, and a lot of open questions." remove the section.
          Replace with a short, confident line about him leading it.
- [x] D20 remove the cutting line under it (ClosingLine)
- [x] D21 keep "It has its own home." but remove its subtitle and the strip
          before the footer

## E · /projects/book
- [x] E1  too blue
- [x] E2  too much text
- [x] E3  remove the CSS-3D book object
- [x] E4  strip to: the book, a video of him, a preorder button. Nothing else.
- [x] E5  peak copywriting, very simple, very little text
- [x] E6  the mono status lines ("Being written. No date yet.") are bad on every
          axis he named: copy, font, colour, position. Kill the pattern.

## F · GLOBAL
- [x] F1  Back buttons: visible, top left, properly designed, on every page
- [x] F2  ONE typeface across every page. Candidate taken from his photo
          (geometric sans, circular bowls, square i-dot, Futura genre)
- [x] F3  footer redesign: special, arrives in an unusual way, humble, closes
          the page properly

## G · HOMEPAGE, Why-me section
- [x] G1  he is 21, not 20, and the age line should go entirely
- [x] G2  remove "Here is the part that is not obvious from that."
- [x] G3  "3 yrs" -> 2.5 years to finish a US degree
- [x] G4  "In practice" card is not impactful -> redesign

## H · PROCESS
- [x] H1  cross-verify EVERY item above with a screenshot or a DOM assertion
- [x] H2  full build passes, no console errors, no overflow, a11y intact


---

## Verified 2026-08-28

59/59 automated assertions pass (`scrollcraft/builds/final-pass/verify-all.mjs`,
kept in the scratchpad), covering desktop 1440x900 and mobile 390x844:
zero page errors, zero console errors, zero horizontal overflow, exactly one h1
per page, no heading-level jumps. `npx tsc --noEmit` clean. Production build
passes. Every item above additionally eyeballed on a screenshot.

Word counts against the researched budgets:
  /projects/book        53 words   (target 250-400, deliberately far under)
  /projects/mynd       352 words   (target 400-600, ceiling 800)
  /projects/superhuman 304 words   (target 350-500, ceiling 650)

## Still open, and why

- **WhyMeSection.tsx `EMPLOYER` is still `null`.** Tobia agreed to name the
  company but the name did not arrive. Null renders an honest unnamed sentence,
  never a visible placeholder. One-word change when he sends it.
- **`WAITLIST_WEBHOOK_URL` is unset**, so both forms report `durable: false`
  and tell the visitor to email instead. Set it and they become a real list.
- **Both video frames are empty**, and say so. Pass a `source` prop when the
  footage exists.
- **The book page lost the surfacing passage.** It was the strongest device on
  the old page and it was cut because "remove every section" was explicit. It
  is a one-line restore if it is missed.
