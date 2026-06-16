# Mind — design spec

**Date:** 2026-06-15
**Status:** Approved (brainstorming complete), implementation authorized by Tobia ("build everything now").
**One-line:** An AI ghostwriter named **Mind** that knows Tobia, drafts blog posts in his voice, sends them to him on Telegram for one-tap approval, learns from every edit, and auto-publishes the approved ones to the site's Thoughts section 2–3×/week — running on his Claude subscription, not a metered API bill.

---

## 1. Goal & non-goals

**Goal.** Make publishing thoughtful blog posts almost effortless: Mind proposes drafts (proactively and on request), Tobia approves/edits from his phone, and approved posts appear — beautifully rendered — on the live site on a calm 2–3×/week rhythm.

**Non-goals (YAGNI, parked):**
- No fully-autonomous publishing. **Tobia approves every post.**
- No forced daily cadence (his own `docs/funnel-strategy.md` §6 warns against filler).
- No paid image generation (Mind picks from his own photo library).
- No newsletter (parked in the strategy; the site is the surface).
- No public admin dashboard / secret subdomain — Telegram *is* the admin, and it has no public endpoint to leak (see §8).

---

## 2. Decisions locked (from brainstorming)

| # | Decision |
|---|---|
| Name | **Mind** (replaces the old "Hermes" placeholder; update code comments). |
| Control | Tobia **approves every post**; Mind never publishes unsupervised. |
| Channel | **Telegram bot** (push to phone + Mac, inline buttons, photos). |
| Cadence | **2–3×/week**, auto-dripped from an approved queue; pauses gracefully when empty (no filler). |
| Corpus | **Everything**: site docs, the book draft, past essays/social, voice-note transcripts. Grows over time. |
| Initiative | **Proactive** — Mind nudges first on a rhythm; mutable. |
| Cost | Runs on Tobia's **Claude Max subscription** via a 1-year OAuth token (`claude setup-token`), **not** per-token API billing. |
| Store | **Neon Postgres** (Vercel Marketplace, free tier). |
| Rendering | Posts stored as Markdown, **rendered as beautiful styled HTML** on the site (Ink & Paper). Readers never see raw Markdown. |
| Learning | Mind **learns from every edit** — before→after pairs become highest-priority drafting context. |
| Hosting | Brain runs on an **always-on host** (not Tobia's Mac, which is often off). Mac needed only once to mint the token. |

---

## 3. Architecture — two halves

```
  ALWAYS-ON HOST (the brain — Tobia's subscription)          VERCEL (the body — always-on, public)
 ┌───────────────────────────────────────────────┐        ┌──────────────────────────────────────────┐
 │  /mind  Node service (long-polling, no inbound) │        │  Next.js site (existing)                   │
 │   • Telegram bot  ⇄  Tobia                       │ writes │   • Thoughts section reads from DB         │
 │   • drafts via `claude -p` (corpus + style mem) │ ─────▶ │   • /thoughts/[slug] article pages         │
 │   • learns from edits                            │ posts  │   • /api/cron/publish drips scheduled→live │
 │   • assigns publish slots (2–3×/wk)              │        │                                            │
 └───────────────────────────────────────────────┘        └──────────────────┬─────────────────────────┘
                         │                                                     │ reads
                         └──────────────────────────────┬──────────────────────┘
                                                         ▼
                                            ┌─────────────────────────┐
                                            │  Neon Postgres (shared)  │
                                            │  posts, corrections      │
                                            └─────────────────────────┘
```

**Why split this way.**
- Drafting must run where the Claude CLI + OAuth token live → an always-on host (subscription billing, no API bill).
- Publishing must be independent of the host being up → **Vercel cron** flips `scheduled`→`published`. If the brain is briefly down, already-queued posts still go live.
- Each half is small and testable alone. The brain only ever *writes* approved posts; Vercel owns going-live and rendering.

---

## 4. Cost model (the make-or-break, verified)

- `claude setup-token` (run once on the Mac) → **1-year OAuth token** → set as `CLAUDE_CODE_OAUTH_TOKEN` on the host.
- Brain drafts via `claude --bare -p "…" --output-format json --no-session-persistence`. Usage draws from the **Max plan's included Agent SDK credit pool** (~$100/mo on Max), *not* metered API billing.
- ~$0.10 of credit per draft × 2–3/week ≈ **single-digit dollars of included credit/month → effectively free**.
- **Net new recurring cost:** $0 (own always-on machine / Oracle free tier) to ~$2–5/mo (Fly/VPS). Neon free tier. Telegram free. Vercel already on Pro.

Source of truth: Claude Code authentication + headless docs (verified 2026-06-15).

---

## 5. Data model

Single shared `Post` shape (TypeScript type lives in `lib/posts.ts`, mirrored in `/mind/src/store.ts`):

```ts
type PostStatus = 'draft' | 'scheduled' | 'published';

interface Post {
  id: string;            // uuid
  slug: string;          // url-safe, unique
  title: string;
  excerpt: string;       // the card teaser
  bodyMarkdown: string;  // stored as markdown, rendered beautifully on site
  tag: string;           // "the road" | "consciousness" | "building" | "superhuman" | "the book"
  tagHref: string;       // derived from tag (see tag map in funnel-strategy §3.7)
  coverImage: string;    // /trail/...jpg or other library path
  readTime: string;      // "4 min read" (computed from word count)
  writer: string;        // "Tobia"
  status: PostStatus;
  publishAt: string | null; // ISO timestamp; the assigned drip slot
  createdAt: string;
  updatedAt: string;
}
```

`db/schema.sql` creates the `posts` table (and a `corrections` table is optional; corrections also live as a JSONL file on the host — see §7.4). The site reads `status = 'published'` ordered by `publishAt DESC`. `ArticleCardProps` (existing in `components/ui/article-card.tsx`) is derived from `Post`.

**Tag → href map** (from funnel-strategy §3.7): `the book`/`consciousness` → `/projects/book`; `building` → `/#projects`; `superhuman` → `/projects/superhuman`; `the road` → `/#road`.

---

## 6. Site side (Vercel) — what changes in the existing app

> **MUST read `node_modules/next/dist/docs/` before writing any Next.js code** (per AGENTS.md — this Next 16 differs from training data). Confirm: dynamic route conventions, data fetching, on-demand revalidation, and cron route handlers.

1. **`lib/posts.ts`** — Neon client + typed read queries: `getPublishedPosts()`, `getPostBySlug(slug)`. Read-only from the site.
2. **`lib/markdown.tsx`** — Markdown → styled React, mapped to Ink & Paper (serif headings, paper background, hairline rules, measured line length). **No raw markdown ever reaches the reader.**
3. **`app/thoughts/[slug]/page.tsx`** — the new article page. Beautiful long-form reading view; cover image, title, meta, rendered body, back-to-Thoughts. This is a design surface — match `docs/design-language.md`.
4. **`components/sections/ThoughtsSection.tsx`** — replace the hardcoded `THOUGHTS` array with data from `getPublishedPosts()`; keep the existing card UI, Load-more, and entrance animations. Cards now link to `/thoughts/[slug]`. Update the "Hermes" comment → "Mind".
5. **`app/api/cron/publish/route.ts`** — the drip publisher: flips any `scheduled` post with `publishAt <= now` to `published`, then revalidates the home page + `/thoughts`. Secured with a `CRON_SECRET`.
6. **`vercel.ts`** — framework config + cron schedule (hourly is plenty; slot precision comes from `publishAt`). Use `vercel.ts` per current Vercel guidance.
7. **`db/seed.ts`** — migrate the 6 existing hardcoded thoughts into the DB as `published` so nothing is lost.

---

## 7. Brain side (`/mind`) — the always-on service

A standalone Node/TypeScript service in `/mind` (own `package.json`). Uses **grammY** for Telegram (robust, correct MarkdownV2 escaping — directly fixes the "leaked tags / flaky" pain).

### 7.1 Telegram contract (the part built defensively)
- **Owner guard:** every update whose chat id ≠ `TELEGRAM_OWNER_CHAT_ID` is ignored. Only Tobia can talk to Mind.
- **Message whitelist — Mind sends ONLY these three types, nothing else, ever:**
  1. **Draft** — a photo message: cover image + **bold title** + clean body + quiet meta line + inline buttons `[✅ Approve] [✏️ Edit] [✕ Skip]`.
  2. **Short reply** — when Tobia talks to it.
  3. **Publish confirmation** — one line when a post goes live.
- **No system/error spam reaches Tobia.** Errors are caught, logged locally, and swallowed. (Optional: a single, opt-in, throttled "Mind hit a snag" line — off by default.)
- **Formatting is centralized in `src/format.ts` with unit tests** so bold renders as bold and **no raw tags can ever leak**. This is the regression guard.
- Buttons use `callback_data`: `approve:<id>`, `edit:<id>`, `skip:<id>`.

### 7.2 Drafting engine (`src/draft.ts`)
- Builds a prompt: system role ("You are Mind, Tobia's ghostwriter") + voice/design rules + corpus (§7.3) + **style corrections (highest priority, §7.4)** + the 6 existing posts as few-shot.
- Calls `claude --bare -p --output-format json --no-session-persistence` (subscription auth via env token).
- Output is JSON validated to: `{ title, excerpt, bodyMarkdown, tag, suggestedImage, readTime }`. Reject + retry on malformed output.

### 7.3 Corpus (`src/corpus.ts`, `/mind/corpus/`)
- Folders: `site/` (auto-synced from repo docs + locked copy), `book/`, `essays/`, `notes/` (voice-note **transcripts** — audio auto-transcription is a parked v2 add-on).
- **Tobia can grow the corpus by sending Mind a file or text on Telegram** → saved into the right folder. (Voice notes: send as text/dictation for now.)

### 7.4 Edit-learning (`src/learn.ts`, `/mind/style/corrections.jsonl`)
- When Tobia taps **Edit** and sends his revised version, Mind stores `{ topic, draft, final, ts }`.
- The most recent N corrections are injected into every future draft prompt as the **top-priority** instruction ("you wrote X, Tobia changed it to Y — internalize this"). This is the "learns from my edits 100%" mechanism — pure context accumulation, no training cost.

### 7.5 Scheduling (`src/schedule.ts`)
- Cadence slots, e.g. **Mon/Wed/Fri 09:00 Europe/Rome**. On approval, Mind assigns the post the next free slot after the latest `scheduled` post's `publishAt`. Queue drains at 2–3×/week; empties without filler.
- **Proactive nudge:** on a rhythm (e.g. Mon/Thu AM) Mind sends a topic idea (drawn from the rotating angles in funnel-strategy §6). Mutable / can be muted.

### 7.6 Images (`src/images.ts`)
- Pick the best-fitting cover from a library folder (start with the existing `public/trail/*.jpg`). Mind chooses by asking Claude to match a filename to the post. Sent as the Telegram photo and stored as `coverImage`.

### 7.7 Store writes (`src/store.ts`)
- On **Approve:** insert the `Post` into Neon as `scheduled` with the assigned `publishAt`.
- On **Skip:** discard. On **Edit:** capture correction (§7.4), then re-draft or accept Tobia's text.

---

## 8. Security & secrecy
- The brain uses **Telegram long-polling** — it makes only *outbound* connections, exposes **no inbound endpoint/URL**. There is nothing public to find or attack (this is the "secret backend" requirement, met for free).
- Owner-guard restricts all interaction to Tobia's chat id.
- Secrets (`TELEGRAM_BOT_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, `DATABASE_URL`) live only in the host's env, never in git. `/mind/corpus/` and `/mind/style/` are git-ignored (private writing).
- Vercel cron route guarded by `CRON_SECRET`.

---

## 9. File / directory layout

```
TobiaWeb/
  app/thoughts/[slug]/page.tsx        # NEW article page
  app/api/cron/publish/route.ts       # NEW drip publisher
  lib/posts.ts                        # NEW Neon read client + Post type
  lib/markdown.tsx                    # NEW beautiful markdown renderer
  db/schema.sql                       # NEW posts table
  db/seed.ts                          # NEW migrate the 6 existing thoughts
  vercel.ts                           # NEW/updated framework + cron config
  components/sections/ThoughtsSection.tsx   # EDIT: read from DB, Mind comment

  mind/                               # NEW always-on brain (own package.json)
    src/{index,telegram,format,draft,corpus,learn,store,schedule,images}.ts
    corpus/{site,book,essays,notes}/  # git-ignored
    style/corrections.jsonl           # git-ignored
    tests/{format,draft-parse,schedule}.test.ts
    Dockerfile                        # installs node + claude CLI, runs worker
    .env.example
    README.md                         # go-live: BotFather, setup-token, Neon, deploy
```

---

## 10. Interfaces (frozen contract for parallel build)

- **`Post`** type — §5. Owned by `lib/posts.ts`; mirrored in `mind/src/store.ts`.
- **DB:** Neon Postgres; `posts` table per `db/schema.sql`. Brain writes `scheduled`; site reads `published`; Vercel cron flips.
- **Env vars:** `DATABASE_URL` (both sides), `CRON_SECRET` (Vercel), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_CHAT_ID`, `CLAUDE_CODE_OAUTH_TOKEN` (brain).
- **Telegram callbacks:** `approve:<id>`, `edit:<id>`, `skip:<id>`.
- **Draft JSON:** `{ title, excerpt, bodyMarkdown, tag, suggestedImage, readTime }`.

---

## 11. Build plan (agent team, disjoint file sets)

Foundation first (shared types, schema, scaffolding), then parallel:
- **A — Site data:** `lib/posts.ts`, `db/schema.sql`, `db/seed.ts`.
- **B — Site render:** `app/thoughts/[slug]/page.tsx`, `lib/markdown.tsx`, `ThoughtsSection.tsx` edit. (reads Next docs)
- **C — Publish cron:** `app/api/cron/publish/route.ts`, `vercel.ts`. (reads Next/Vercel docs)
- **D — Brain / Telegram:** `mind/src/{telegram,format}.ts` + format tests.
- **E — Brain / drafting:** `mind/src/{draft,corpus,learn}.ts` + parse tests.
- **F — Brain / store+schedule+images+bootstrap:** `mind/src/{store,schedule,images,index}.ts` + schedule tests.
- **G — Ops/docs:** `mind/Dockerfile`, `.env.example`, `README.md`, `.gitignore` updates.

Then: integration + verification by the lead (typecheck, run tests, dry-run the formatter and draft-parser with fixtures).

---

## 12. Go-live checklist (Tobia's part, at the very end)
1. **Telegram:** @BotFather → `/newbot` → copy bot token; get chat id via @userinfobot.
2. **Claude:** run `claude setup-token` once on the Mac → copy the 1-year token.
3. **Neon:** create a Postgres via Vercel Marketplace → copy `DATABASE_URL`; run `db/schema.sql` + `db/seed.ts`.
4. **Host:** deploy `/mind` (Docker) to an always-on machine / Oracle free tier / Fly / VPS; set the env vars.
5. Paste the 4 secrets; Mind says hello.

---

## 13. Testing
- Unit: `format.ts` (bold renders, never leaks tags), draft JSON parser/validator, schedule slot assignment.
- Integration (post-secrets, by Tobia): Telegram round-trip, one `claude -p` draft, one approve→scheduled→published→visible-on-site cycle.
- Site: `next build` + typecheck clean.

---

## 14. Parked / future
- Audio auto-transcription of Telegram voice notes (needs Whisper; cost/complexity — v2).
- Paid image generation (only if he ever wants it).
- A belt-and-suspenders second publisher (currently Vercel cron is the single publisher; fine).
