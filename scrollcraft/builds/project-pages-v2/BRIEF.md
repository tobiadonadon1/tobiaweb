# Project pages, revision 2

Interviewed 2026-08-28. NOT self-authored.
Scope: /projects/superhuman (copy only), /projects/mynd (colour + structure),
/projects/book (rebuild), plus one global scroll bug.

## The bug, in his words
> "They all start from the bottom, so start from the top, not the bottom."

Cause, reproduced and fixed: `globals.css` sets `scroll-behavior: smooth` on
`<html>`. Next 16's router scroll-to-top therefore became a SMOOTH scroll that
was cancelled the instant the new route painted, leaving every project page at
y≈7500-8000 of its own document. Next logs this exact warning in the console.
Fix: `data-scroll-behavior="smooth"` on `<html>` in app/layout.tsx.
Verified: all three now land at y=0 from a homepage scrolled to 55%.

## Interview answers, verbatim

**Superhuman.** "I really like the superhuman one. I just think that the text
is not perfect when it comes to conversion." Nothing is for sale yet, so the
shelf becomes a waitlist: one email field, tell me which one you want first.

**The double Y.** The live product is spelled `myynd`, not `Mynd`. Visible copy
changes everywhere. The route stays /projects/mynd.

**Mynd.** "This one is very good. It's a bit bland. I would put more scroll
section at the top, put more color, and get inspired more by the one that I
share here. soleagency.co"
"'Your business is brilliant. Its memory is terrible.' That's a very strong
statement. Telling a company that we're going to talk about terrible is a bit
too strong." — soften HERE only; the live site keeps the line.
"Other charts that have been designed don't really mean that much."
"The text at the bottom where it says 'The idea', it's not immediate that
someone would click on there and then nothing happens on the right panel where
there's the animation. I don't love that. It does four things. Yes, I would
make it more immediate, though. I would make it a bit better and less bland,
a bit prettier."

**Book.** "Maybe this is a bit too simple as a page, and there is no space for
the video. I don't like the initial statement, 'What happens to a person who
spends every day besides something that thinks?' I didn't write this while I
was building, so no. All of the copy of this is not good. It has to be remade,
and again, this is not interactive at all. I would rather it be shorter, more
dynamic, more scroll-based, but shorter, with a video. Very little to be said,
maybe an image or a design on SVG that you can make of the book of a book...
Maybe just the model of a book, and then 'Learn more' or 'Stay tuned',
something like that, as if it's hovering or something."
Chosen treatment: a floating CLOSED book, scroll-lit, pointer-reactive, never
opens.

## The reference, measured not guessed
soleagency.co, screenshotted at nine scroll positions and its computed styles read.
- Ground `#EFE8E0` cream · ink `#241813` warm dark brown · **accent `#C4623B`
  terracotta** · warm grey `#5C4E44` · closing band `#1C3A2E` deep green.
- Display type is Helvetica Neue, heavy and tight. Kickers are IBM Plex Mono.
- THE device: a two-tone headline. First clause in ink, second clause in
  terracotta. "The business keeps working **when you don't.**" / "It starts with
  a brain **your company owns.**" / "Thirty minutes. **One coffee.**"
- The constellation is the real brand device, but in terracotta on cream at
  full contrast, not the near-invisible grey the portfolio page draws.

That is the "more color" he is asking for: warm terracotta doing structural
work, not a green dot every four screens.

## Feeling curves

### myynd (case file, warmed)
1 Arrival, warm: the field is alive and terracotta before a word is read
2 Recognition, gentle: the problem named without insulting the reader   <- new, softened
3 Clarity: what it actually is, in one two-tone line
4 QUIET: how early it is                                                <- hush
5 PEAK, wonder: ask a question, watch it answered through the graph
6 Understanding: the four steps, on a lit spine
7 Resolve: one door out

### the book (shorter, darker, one object)
1 Stillness, then presence: a book hangs in the dark and turns with your hand
2 Curiosity: four currents, fast
3 PEAK, intimacy: the passage surfaces at reading pace
4 Anticipation: the film
5 Resolve: one line, one field, "stay tuned"

## The peaks, in a visitor's words
**myynd** "I clicked a question and watched the answer walk through the graph,
lighting up the three places it came from."
**book** "There was a book hanging in the dark and it turned when I moved my
mouse, and I could see the light run down its spine."
**superhuman** unchanged: "The star comes apart into its eight rays and each ray
lands as a card on the shelf."

## Tell-someone sentence
"It's the site where the guy shows you the thing instead of describing it, and
tells you plainly what does not exist yet."

## Authored silence (do not fill)
- myynd: the full screen of air before the constellation.
- book: the beat between the hanging book and the first line of the passage.
