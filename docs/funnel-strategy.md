# TobiaWeb Funnel Strategy v2 — the runway to the book

**Status: DRAFT for Tobia's review — nothing implemented in code.**
v1: June 12 (23-agent workflow). **v2: June 15** — rebuilt around Tobia's answers,
which changed two things at the foundation: **Superhuman is sellable today** (it's AI
consulting + systems + infrastructure for businesses, not a not-yet personal journey),
and **the book is finishing — out by the end of 2026** (no longer "written slowly, no
release date"). Everything below is re-pointed at the goal he named: build momentum to
the book launch while selling the two consulting offers that pay today — elegantly,
never salesy.

## v2.1 — answers locked + two-session coordination (June 15, latest)

Tobia's follow-up answers, now locked:

- **The site's identity is the INTERSECTION** of technology and the inner world — *that's
  its power.* The hero expresses that, NOT AI-first. AI-leverage language lives in
  Superhuman only.
- **The Book is NOT about AI.** It's the inner world — consciousness, spirituality,
  presence, mindfulness, "mind power / what we have within" (the four currents
  Lifestyle / Spirituality / Creativity / Mindset). AI is a faint backdrop at most.
- **Superhuman = B2B only, for now** — AI consulting + systems + AI infrastructure for
  businesses, sellable today, keeping the *not-a-course* soul. (B2C later, "more on the
  book side.")
- **Book public line: "out / arriving late 2026."** · **Video per page is the seller**
  (reuse `VideoSlot`; slots now, his footage later; homepage video stays short). ·
  **Struggle grain:** keep only the subtle one (road pin-4 "an ocean from home"); no
  dedicated struggle pin. · **Grazie**, **Vercel Pro**, **first-chapter list:** all yes.

### Two sessions, one repo — the split
- **THIS session (strategy + homepage):** owns copy/positioning + the homepage funnel.
  **BUILT & verified** (`npm run build` green): NOW beat (`components/sections/NowSection.tsx`),
  hero subtitle (intersection), identity cards, road pins + the two whisper-routes
  (pins 3 & 5; pin-2 OBE left untouched), bento consequence lines + Sole/Superhuman
  bodies + Book status ("in review / arriving late 2026"), About follow-aside (IG-first),
  Thoughts tag-links, footer relabel (labeled mono channels + Option B tagline),
  `/ig/[placement]` redirect, analytics foundation (`@vercel/analytics` + `ScrollMark`
  at `reached_projects`/`reached_end`). Did NOT touch `app/projects/**` or the other
  session's components; reuses their `VideoSlot`.
- **OTHER session (`67c23d1c…`, page implementation):** owns the `/projects/*` pages +
  `VideoSlot`/`PhotoSlideshow`/`project-page.tsx`. Built the bespoke Book page (live).
  Now **unblocked** to build Sole + Superhuman bespoke (positioning settled below).

### Handoff to the page-implementation session
1. **Build Sole + Superhuman bespoke** (same treatment as the Book page; each gets a
   `VideoSlot`). Use §3.5. **Superhuman = B2B AI consulting/infrastructure, sellable,
   status `open`, real "write me" CTA** — not the old "unbuyable journey."
2. **Re-point the live Book page copy from AI → inner world.** Its currents are already
   right; fix the three AI-led spots to match: the lede ("minds we're building, and the
   ones we already are"), the "What it is" block ("artificial intelligence, consciousness,
   and what we become when the two blur"), and the page metadata. Suggested lede: *"A long
   book about the mind — not the machine kind, the one you already are."* Suggested "What
   it is": *"A book about consciousness — presence, attention, the mind, and the power we
   keep forgetting we have. Not a hot take, not a manifesto — a slow attempt to think
   clearly about the part of being human no technology can touch."* Keep status "In review
   / arriving late 2026," the first-chapter list, LinkedIn-led follow, and the close.
3. **Homepage bento now points at your pages** with this copy: Sole "open / for first
   launches"; Superhuman "open / taking on a few." Keep page copy consistent with those.

---

---

## 0. What changed in v2 (decisions locked June 15)

**Your answers, as I parsed them** (correct me if the voice transcript misled me):

| # | Question | Your call |
|---|---|---|
| 1 | Ship the NOW beat + maintain it monthly | **Yes**, you'll keep it current |
| 2 | Channel truth | **IG** = your life, work, lifestyle, thoughts, videos — AI sometimes (active, personal). **LinkedIn** = marketing yourself, your products, your work (professional, the selling channel) |
| 3 | First-chapter mailto list | **Yes** |
| 4 | The struggle grain | **Yes** — add it |
| 5 | Footer tagline | You like it → moving "Figuring it out in public." to caption the channels (Option B) |
| 6 | "Grazie for reading this far." | **Yes** — use the Italian |
| 7 | Is "chapter four" true? | **No** — book is in final review, **out end of 2026** |
| 8 | Vercel Pro for measurement | **Fine** ("I don't mind") |

**Three structural shifts from those answers:**

1. **Two products are sellable TODAY, not one.** Sole (launch your first thing) *and*
   Superhuman (make your business superhuman with AI — consulting + systems +
   infrastructure). This strengthens the funnel: the follow stays the universal action
   for the masses, but qualified visitors now have two real things to buy, each with a
   confident CTA and a video.
2. **The book has a date.** "Finishing — out late 2026" replaces "no release date yet."
   That converts the whole Book track from passive ("watch it being written") to a
   **launch runway**: build the first-chapter list now so it exists at launch; the
   bookShift is ~6 months out, not abstract-future.
3. **Media is in scope.** Photos, small hand-drawn graphics, and **video** — including
   YouTube of you talking — now part of the plan (§5). The two sellable products each
   get a video (you, explaining the thing — the strongest possible "show, don't tell"),
   plus one video moment on the homepage.

**What did NOT change:** the spine (humble voice, craft-as-proof, the story sells), the
locked hero headline, every beloved line, the Ink-&-Paper design language, the one-ask
discipline, the Line ending exactly once in the footer.

---

## 1. The strategy in one breath

The site builds toward one horizon — **the book launch, end of 2026** — while doing
three jobs every day until then:

- **Follow** is the universal action for the majority who can't or won't buy anything
  (and it doubles as the book's pre-launch audience). Asked once, at the end, after the
  story is given. **Instagram** for these people — it's your living, personal channel.
- **Sell the two consulting offers** that pay today, to the qualified few: **Sole**
  (founders launching a first thing) and **Superhuman** (businesses wanting AI
  leverage). Real CTAs, a video each, **LinkedIn** as their credibility channel.
- **Build the book's launch list** — the first-chapter mailto list — so end-of-2026 has
  an audience waiting, not a cold start.

Route-by-interest still happens on one shared scroll (no forks): hero subtitle seeds
the threads → identity cards prime → road pins 3/5 whisper-route → the bento is THE
junction with honest status consequences → each product page is its persona's landing
page with one CTA, one video, one cross-exit. Voice rule unchanged: **if a line could
sit in a growth-hacker's bio, it's wrong.**

**Scroll order** (unchanged from today + one new beat):
Loader → Hero → Identity cards → Road → Ink tide → Bento → About → Thoughts →
**NOW / Talk to me (new — the close)** → Footer.

---

## 2. The personas (v2 — now four reader-types, three products + the follow)

| | Arrives | Wants | Converts | Channel |
|---|---|---|---|---|
| **Giulia, the curious** (the majority) | IG bio, a shared "look at this site." On a phone. | To feel less alone figuring life out; someone slightly ahead. | **The follow.** Eventually a **book reader.** Never sold to. | Instagram |
| **Marco, the almost-launcher** → Sole | LinkedIn, a friend's DM. First product stalled at publish. | Proof you ship; a human to write tonight. | **Sole** — `mailto`, "Hi Tobia — Sole." | LinkedIn |
| **Elena, the operator** → Superhuman *(new)* | LinkedIn, a referral. Runs/leads a business or small team; wants AI leverage, has budget. | To see what "superhuman with AI" concretely means, from someone who's built it. | **Superhuman** — the video convinces, `mailto` "Hi Tobia — Superhuman." | LinkedIn |
| **Daniel, the reader** → Book | A LinkedIn essay, a screenshotted Thought. Hype-allergic. | To gauge if the thinking is real; to know when the book lands. | **The follow + the first-chapter list.** A buyer end-2026. | LinkedIn-led |

The load-bearing reads: the locked headline is **Giulia's** whole value proposition;
the Road is **Marco's & Elena's** credibility engine (he's been shipping and building
real systems for five years); craft-as-proof is **Daniel's** prose expectation.
Giulia is the largest group and her only ask is the follow — which is also exactly the
book's launch list. The two who can spend (Marco, Elena) are fewer but get the
confident, video-backed CTAs.

---

## 3. Section roles + copy deck (v2 FINAL)

Format: `current → FINAL`, with intent. ~~Strike~~ = killed by a critic or by v2.
Lines marked **KEEP** are confirmed unchanged. The full v1 critique resolutions still
hold; only deltas are shown in detail.

### 3.1 Hero — `components/hero/HeroSequence.tsx`
- **Headline — LOCKED.**
- **Subtitle — REWRITE** (kills the v1 "day/night" hustle-trope; names a real,
  near-finished book; threads all three interests):
  > I build tools, I'm writing a book about AI and consciousness, and I help people and
  > businesses do things with AI that used to feel out of reach. I'm 20, and I think
  > about the future a lot — this is the notebook I keep in public.

  Intent: "and businesses … with AI" is Elena's seed (Superhuman) + "people …" is
  Marco's (Sole); the book is named for Daniel; ends on the notebook contract. ~40 words.
  *(If "people and businesses … with AI" reads too broad, alt: "…I help people launch
  their first things, and businesses get real leverage from AI.")*
- **CTA — KEEP** "See what I'm building" → `#projects`.
- **Meta description** (one constant feeds meta/OG/Twitter):
  > I'm Tobia — 20. I build tools, I'm writing a book about AI and consciousness, and I
  > help people and businesses get real leverage from AI. The notebook I keep in public.
- Meta title: **KEEP** (flips the day the book ships → §5).

### 3.2 Identity cards — `components/sections/StackedPhrases.tsx`
Bodies were "abstraction soup"; v1 rewrites stand (titles **KEEP**):
- **card-01 "Who Am I":** "It started with 3D printers and drones, and it never stopped
  — the things just kept getting bigger: companies now, a book, the quiet hours after work."
- **card-02 "Where am I going":** "Somewhere I can't fully see yet. But the method is
  small: a morning practice, a few pages, a few quiet hours of building — days that
  compound. I'd rather become it slowly than announce it early."
- **card-03 "Why I create":** "I create to understand. At fifteen, an experience I still
  can't explain left me with a question that won't close: what is awareness, and what
  are we building when we build machines that imitate it? Everything here — the tools,
  the book, these pages — is an attempt."

### 3.3 The Road — `components/sections/RoadSoFar.tsx`
Pins **KEEP** their phrases; the closing aside is protected. Deltas:
- **pin-4 — adopt the struggle alt** (you said yes to the grain):
  `"18 · Left for Miami. · an ocean from home — startups instead of sleep"`
- **pin-5 sub:** `"spirituality, mindset…"` → **"AI, consciousness, spirituality — a year in already"**
- **NEW struggle pin** (draft — needs your real sentence; this is the one beat that buys
  the most belief, per the Amoruso teardown). Placed in sequence, strict format. Two
  drafts to pick from, both true to your story:
  - `"19–20 · The book fought back. · a year of pages I had to delete"`
  - `"now · Building alone. · beside a day job, slower than I'd like"`
- **Whisper-routes — two** (pin-2's OBE route stays killed): pin-3 + **"→ where Sole
  began"** → `/projects/sole`; pin-5 + **"→ the book"** → `/projects/book`. Own separated
  row, one step quieter than the sub.
- pin-7 **KEEP** "an agency, an AI-infrastructure company, the book" (the AI-infrastructure
  company is quietly the engine behind Superhuman — don't rename it).

### 3.4 Bento junction — `components/sections/ProjectsSection.tsx`
Each status gets one mono consequence line. **Two of three are now OPEN:**

| Card | Body (FINAL) | Status + consequence |
|---|---|---|
| **The Book** (flagship) | KEEP | `finishing — out late 2026` |
| **Sole** | "Hands-on help when the thing is built but won't quite ship — positioning, decisions, and the final push to press publish." | `open — for first launches` |
| **Superhuman** | **REWRITE:** "Consulting that makes you or your business superhuman with AI — the systems, the infrastructure, built with you and left running." | `open — taking on a few` |

Crest "What I'm building." **KEEP.** The book's consequence is the biggest single change
on the homepage: a date is a magnet.

### 3.5 Product pages — each its persona's landing page

**/projects/superhuman — REPOSITIONED (the big rewrite).** Status `becoming` → **`open`**.
Keeps the *not-a-course* soul; pivots content from personal daily practice to AI leverage
for a person/business; gets a **video** (you explaining it) and a real CTA.
- **lede (italic):** "With the right systems, an ordinary team starts doing things that
  looked impossible a year ago. I help you build them."
- **§1 (kicker "What it is" / "AI that earns its name"):** "Superhuman is the consulting
  side of my AI work. I come in and build the systems and the infrastructure that let
  one person — or a small team — do what used to take ten. Not advice from the sidelines:
  the actual thing, built with you, running by the time we're done."
- **§2 (kicker "Not a course" / "I don't sell courses") — KEEP the spine, adapt:** "A
  course is something you watch. This is something we build. No curriculum, no
  certificate — just your work, running differently when we're finished. That distinction
  matters to me more than almost anything on this site."
- **§3 (kicker "How it works" / "Hands-on, then yours"):** "We start with where the
  leverage actually is — usually not where you'd guess. Then we build: the systems, the
  AI infrastructure, the small workflows that compound. I stay until it runs without me,
  and you keep what we made."
- **VIDEO** (you, ~2–3 min, what "superhuman with AI" means / a real before→after).
  Sea-toned poster, click-to-play. (§5 art direction.)
- **close — real CTA:** "If you want your work running like this, tell me about it —
  write me a paragraph on what you're building." `mailto` "Hi Tobia — Superhuman."
  · cross-exit: `just getting your first thing off the ground? → Sole is where to start`
- **metadata:** rewrite to the AI-consulting framing; keep "Not a course."

**/projects/sole — sellable, sharpened + optional video.**
- Blocks 1–2 **KEEP.** **sole-3 (v1 final):** "Founders and makers sitting on a first
  product, a first launch, a first anything — close enough to taste it, stuck enough to
  stall. If you're scaling something that already works, Sole isn't for that — it stays
  with first things. If you're at the start, the door is open: write me one paragraph
  about what you're building."
- Standalone italic (only access promise): **"I read and answer every email myself."**
- **Optional VIDEO** (you, on launching a first thing / the publish-moment) — same treatment.
- cross-exit: `nothing to launch yet? → Superhuman is the slower road` · mailto "Hi Tobia — Sole."

**/projects/book — finishing, on the runway.** Status → **`finishing — out late 2026`**.
- lede & §1 **KEEP.**
- **book-2 — REWRITE (tense shift: it's written, you're in the last mile):** "The first
  draft is done; I'm deep in revisions now — the slow, unglamorous part where a book
  actually becomes good. Pieces and the thinking behind them surface in my Thoughts as
  I go. Some of it will still be wrong on arrival, and that's part of the method."
- **book-3 — REWRITE (a date, kept honestly):** "I know how it ends now — the work left
  is making it worthy of the idea. It comes out at the end of 2026. That's a real date,
  and I mean to keep it."
- **close facts (kills "chapter four"):** `WRITTEN IN PUBLIC · IN FINAL REVISION · OUT LATE 2026`
- **the first-chapter list (now the headline ask — it has a real payoff):** "The first
  chapter goes out the week it launches. Want it? Write me 'first chapter' — that's the
  whole list." `mailto` subject "First chapter."
- **the follow (secondary, channel-correct):** "And the road there — the last mile —
  shows up on Instagram; the longer threads on LinkedIn."
- cross-exit: `building something of your own? → Sole is open` · mailto "Hi Tobia — Book."

**Shell footer** (`components/ui/project-page.tsx`): "All projects · Write me" (per-page
subject) **+ the labeled channel echo row** (`INSTAGRAM @TOBIA.DONADON · LINKEDIN ·
EMAIL`, `rel="me"`, IG via `/ig/[placement]`) — fixes the deferring-buyer dead-end.

### 3.6 About — `components/sections/AboutSection.tsx`
- p1, p2, facts, signature, caption **KEEP** (p1 keeps "graduated early").
- **p3 — de-handled aside, IG-first** (IG is the personal channel for Giulia):
  > This site is me figuring things out in public. If something here resonates, I'd
  > genuinely like to hear from you. Or just walk alongside for a while — you can find
  > me on Instagram, and on LinkedIn.
- **Optional: video-portrait** here is the recommended homepage video slot (§5) — the
  warmest "meet me," you talking, sea-toned, click-to-play, replacing/beside the still.
- "Write me" → subject "Hi Tobia."

### 3.7 Thoughts — `components/sections/ThoughtsSection.tsx`
Header, posts, Load more **KEEP**; ask-free. **Tags become quiet links**; **post-4 retags
`superhuman`** (its theme is Giulia's, not the book's). Tag map: `the book`/`consciousness`
→ /projects/book · `building` → /#projects · `superhuman` → /projects/superhuman · `the
road` → /#road. Content runway in §6.

### 3.8 NOW / Talk to me — **NEW**, between Thoughts and footer (the close)
No CTA box, no button, no autonomous animation. The Line may cameo as one short
IO-drawn stroke (About-cameo pattern); **the dot does not move.**

```
NOW — JUNE 2026                                  (mono dateline)

THE BOOK — FINISHING, OUT LATE 2026              (mono, → /projects/book)
SOLE — OPEN, FOR FIRST LAUNCHES                  (mono, → /projects/sole)
SUPERHUMAN — OPEN, A FEW AT A TIME               (mono, → /projects/superhuman)

Two of those doors are open today —              (italic, tier one, for the few)
if Sole or Superhuman is yours, write me.        (mailto "Hi Tobia")

Grazie for reading this far.                     (italic, tier two, for everyone)
This story isn't finished — if you'd like to
see where it goes, it continues here.            (THE follow ask)

INSTAGRAM — @TOBIA.DONADON — THE LIFE, THE WORK, THE AI     (via /ig/now)
LINKEDIN — TOBIA DONADON — THE WORK, AND WHAT I'M BUILDING

I post when there's something true to show.      (small italic — the only hedge)
```

Changes from v1: statuses updated (book has a date; Superhuman is open); tier-one now
names **both** sellable products (one clean line, not two CTAs); **Grazie**; channel
captions corrected to the real split (**IG = the life, the work, the AI**; **LinkedIn =
the work and what I'm building**). The "isn't finished" ask still holds — the *building*
never finishes even when the book ships. Maintenance: the dateline + book status update
in the Monday ritual.

### 3.9 Footer — `components/sections/SiteFooter.tsx`
Three icon circles → **labeled mono links** with the handle, `rel="me"`, IG via `/ig/footer`.
**Option B adopted** (you liked it): move "Figuring it out in public." to sit directly
above the channel links as their caption. The serif name, © line, **and the dot stay put.**

---

## 4. Follow & sell mechanics — the two-channel spine

The channel truth gives the whole system a clean spine:

**Instagram = the person.** Your life, work, lifestyle, thoughts, video, AI sometimes.
This is the **top-of-funnel follow for the majority** (Giulia), the human journey to the
book launch, and the book's pre-launch audience. Every "just follow / walk alongside"
ask points here first.

**LinkedIn = the professional.** Marketing, the products you sell, your work. This is the
**buyer channel** — Marco and Elena live here; it's where the two consulting offers earn
credibility, and where the book's serious threads go. Every product-credibility follow
points here.

The arc:
1. **Earn** — Road close (plant), Thoughts (pulse), the craft itself. No asks.
2. **Mid-scroll catch** — About aside (IG-first, words-as-links).
3. **THE follow ask** — NOW beat, once, after everything (IG + LinkedIn, scoped captions).
4. **Sell** — Sole & Superhuman pages: confident CTA + video + LinkedIn credibility. The
   bento + NOW status lines route here; the videos do the convincing.
5. **Build the list** — Book page first-chapter mailto list (the launch audience).
6. **Echo** — footer + project-shell channel rows (labeled, never an ask).
7. **The loop's other half (off-site):**
   - **IG bio:** "Tobia. 20. My life, my work, and a book about AI + consciousness. Out
     end of 2026. Figuring it out in public →" + link `tobiadonadon.com/?utm_source=instagram&utm_medium=bio`
   - **LinkedIn:** headline "I help people and businesses get real leverage from AI —
     and I'm writing a book about where it's taking us. [Company] by day." Featured pins:
     **Superhuman + Sole** (the sellable ones) + the site, all UTM'd. **Settings → Make
     follow primary.** Profiles link back (rel=me).
8. **Hand-off plumbing** — `/ig/[placement]` client pages (now/footer/about/book/superhuman):
   record their own pageview, attempt `instagram://user?username=tobia.donadon`,
   `location.replace` to the web profile after ~400ms. Fixes the in-app-browser login
   wall + gives per-placement counts on any plan.

---

## 5. Media & art direction (NEW — photos, graphics, video)

You opened the door to graphics, photos, and video, including YouTube of you talking.
All of it lives **inside Ink & Paper**, treated like your photography is treated — as
artifacts, not decoration.

**Universal treatment.** Sea-tone grade (`saturate .82 contrast .97` + navy overlay
`rgba(11,31,58,.08)`), hairline frame on paper, mono caption beneath (`place · year` or
a one-line label). **Video never autoplays with sound**; show a sea-toned poster frame
with a small ink play-mark, click to play. Respect `prefers-reduced-motion`. Lazy-load
everything; videos use a **lite facade** (poster image, load the player only on click —
`youtube-nocookie` if YouTube, or a self-hosted/Mux clip) so the craft-site performance
never pays for an embed it isn't using.

**Where media goes:**

| Placement | Media | Job |
|---|---|---|
| **Superhuman page** | **Video — you explaining "superhuman with AI"** (or a real before→after) | The convincer for Elena. This is the single highest-value asset — it sells the offer better than any paragraph. |
| **Sole page** | Optional video — you on the publish-moment / launching a first thing | Warms Marco; makes the mailto feel like writing a person he's already met. |
| **Book page** | A sea-toned cover/teaser visual or a short "reading a page aloud" clip | Makes "out late 2026" tangible; a quiet anticipation object. |
| **About (homepage)** | **Recommended homepage video slot: a video-portrait** — you talking, ~60–90s, who you are / what you're building | The warmest "meet me." Universal (not product-specific), so it fits the homepage without over-indexing one offer. |
| **Road / inline** | Small hand-drawn ink graphics in the Line's style — an annotation arrow, a tiny diagram, a circled word | "Little graphics," on-language; one Line per viewport still holds. |
| **Photography** | More of your own photos, sparingly, as the design language already specifies | Texture and proof of a real life behind the work. |

**Homepage video — your call (open question):** the About video-portrait is my
recommendation (personal, universal). The alternative you mentioned — a Superhuman video
on the landing page — would put a product pitch on the homepage; I'd keep that on the
Superhuman page and let the homepage stay personal. Flagged in §8.

**Asset status:** I'll scaffold elegant framed placeholders + the facade/player wiring so
the slots exist and look right empty; you drop in real files (or a YouTube/Mux link) when
ready. Nothing waits on the video to ship the rest.

---

## 6. Content runway to the book (you said the content feels "still far")

Follow-first and a launch list only pay if the channels are alive. The floor, tied to
the Monday ritual:

- **Cadence.** IG: your real rhythm — life, work, the occasional AI. LinkedIn: ~weekly,
  the professional thread (the work, a Sole/Superhuman idea, a book thought). One true
  post per channel per month is the *minimum*; the book runway wants more on LinkedIn as
  end-2026 approaches.
- **The book runway specifically.** Start the public last-mile now: "what revising a book
  actually feels like," "the chapter I deleted," "why it's coming end of 2026." Each post
  grows the first-chapter list and the LinkedIn book-thread audience. The closer to
  launch, the more the IG journey ("the last mile") matters.
- **Post angles ready to draw from** — *Book:* "What I got wrong in chapter two" · "The
  chapter that won't finish" · "Can a tool be contemplative?" · *Sole:* "The night before
  you publish" · "What my first client at fifteen taught me" · *Superhuman:* "The system
  that replaced a team of three" · "What businesses get wrong about AI" · "A day, before
  and after the workflow" · *Road/struggle:* "Leaving home at eighteen" (test the struggle
  pin as a post first).
- **Tripwire:** two missed months on a channel → strip its scoped caption before it
  becomes anti-proof.

Parked, explicitly: a real newsletter (the first-chapter mailto list is the bridge until
the book justifies a list); the nav-search/alter-ego idea (stays parked; if ever built,
wayfinding — never a second ask).

---

## 7. Phase flips

### bookShift — now a real ~6-month runway (end 2026), not abstract-future
**NOW → launch (the runway):** publish the last-mile content; grow the first-chapter list;
LinkedIn book-threads ramp; decide + pre-build the purchase path (own store vs ONE
retailer) behind a flag; ESP chosen; OG cover composite made; the Road's launch pin
("the book shipped") built behind a flag.
**FLIP HOUR (launch day):** statuses flip (`finishing` → `out — read the first chapter`);
hero subtitle leads with the book; hero CTA → "Read the first chapter"; bento re-weights
to Book-first; nav gains "Book"; metadata + OG flip; NOW beat re-tiers; **both bios flip
the same hour**; the first-chapter list gets its send.
**WHEN TRUE:** external proof (a real review, a true number) in mono only; Thoughts
book-tag termination line; the launch Road pin ships.

### Superhuman & Sole — already live (no "when it opens")
Both are sellable now. The only future flip: a **`full, for now`** state, pre-written so
it's never improvised — status `full, for now` + consequence `the door reopens — write me
and you'll hear first`; the NOW tier-one line drops the full product while full.

### soleProofShift / superhumanProofShift — the canon Proof beat, reserved
First real result on either (with permission) → one mono fact row on that product's page
(Velten slash-stack: `who / what / specific result`, zero adjectives). At 2–3 results →
the homepage **Proof beat** ships, reserved **between the bento and About**. Until then,
the craft is the proof.

---

## 8. Prioritized implementation list

**P0 — make the site sell + the close exist:**
1. `NowSection` between Thoughts and footer (copy §3.8).
2. **Superhuman page rewrite** (B2B AI consulting, status open, real CTA) + **its video
   slot**. Highest-value content change.
3. Book page reframe (finishing/late-2026 tense, kill "chapter four," first-chapter list).
4. Footer relabel + project-shell channel row (rel=me, `/ig/[placement]` pages).
5. Per-origin mailto subjects everywhere.

**P1 — routing + sharpened copy:**
6. Bento consequence lines + Sole/Superhuman bodies + page-metadata syncs.
7. Road: pin-4 alt, pin-5 sub, whisper-routes (own row), **the new struggle pin** (your
   sentence).
8. Identity cards + hero subtitle + meta description.
9. Thoughts tag-links + post-4 retag. 10. About aside (IG-first) + "Hi Tobia."

**P2 — media + measurement + the loop:**
11. About video-portrait (homepage video) + Sole/Book media slots; sea-tone treatment +
    lite-facade player.
12. Vercel Pro → `@vercel/analytics` (`/next` import) → ScrollMark sentinels → events
    (add `video_play {where}` + `write_me {origin: …, superhuman}`) → UTM'd bio links.
13. Off-site: IG bio, LinkedIn headline/Featured/follow-primary, profiles link back.

**Conditional/parked:** purchase path + first-chapter ESP (bookShift pre-build); Proof
beats on first results; `/elsewhere` bio page.

Implementation note: this repo's Next is non-standard (AGENTS.md) — read
`node_modules/next/dist/docs/` before writing code.

---

## 9. Measurement (Vercel, Pro confirmed)

Five core events from v1 stand (`reached_projects`, `reached_end`, `follow_click
{network, placement}`, `project_open {project, source}`, `write_me {origin}`) **plus**
`video_play {where}` (did the Superhuman/Sole/About video get watched — the sellable
products' real engagement signal). Funnels: scroll survival; follow-rate of finishers by
network/placement; junction split; **Sole + Superhuman write_me rate** (the money lines);
video_play → write_me (does the video convert). Boundary stated plainly: clicks are
measurable, completed follows are not — weekly follow_clicks vs follower delta is the only
proxy. Monday ritual (10 min) doubles as the dateline/book-status refresh.

---

## 10. Open questions {#open-questions}

Most of v1's questions are answered (§0). What's genuinely still yours to decide:

1. **Superhuman scope.** Confirm: "you **or your business**," B2B-leaning AI consulting +
   systems/infrastructure, sellable now, keeping the *not-a-course* soul. (Recommended as
   written.) If it's businesses-only, or still has a personal-growth track, say which.
2. **The book's public line.** "Out **late 2026**" / "end of 2026" — is that the phrasing
   you want public, or keep it vaguer ("2026")? You said "probably sure" — a soft-but-real
   date reads as confidence; a missed hard date reads worse.
3. **The struggle pin.** Pick one (or give me your real sentence): *"The book fought back
   — a year of pages I had to delete"* or *"Building alone — beside a day job, slower than
   I'd like."* Pin-4's "an ocean from home" is already adopted regardless.
4. **Homepage video.** About video-portrait (recommended, personal/universal) — or a
   Superhuman video on the homepage (I'd keep that on the Superhuman page)? And: do you
   have video assets now, or scaffold placeholders?
5. **Subtitle breadth.** "I help people and businesses do things with AI that used to feel
   out of reach" — good, or the more explicit alt ("…people launch their first things, and
   businesses get real leverage from AI")?

---

## 11. Appendix — provenance

v1: workflow `wf_30d9ef67-382` (23 agents, 5 reference teardowns — nickvelten,
sophiaamoruso, sive.rs, jamesclear, craigmod — follow-mechanics + Vercel research,
architect, 4 copywriters, 4 adversarial critics; 31 findings, all resolved). v2:
Tobia's June 15 answers integrated by hand — Superhuman repositioned, book dated, channels
split, media added, copy re-pointed at the goal. Raw v1 structured outputs:
`/tmp/tw-funnel/*.json`. Nothing implemented in code; copy is reviewed before build, per
the standing rule.
