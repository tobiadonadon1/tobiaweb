import type { MaterialEntry } from "../material-types";

/**
 * SKILLS — the reusable instruction packs.
 *
 * A skill is a small written document you hand an agent so that it works your
 * way without being told again. It is the fourth habit made permanent: the
 * thing you had to say twice, written down once, in a file that gets loaded
 * every time the job comes up.
 *
 * Each entry carries the actual text, not a description of it. A skill you
 * cannot copy is an anecdote.
 */
export const SKILLS: MaterialEntry[] = [
  {
    slug: "house-style",
    title: "House style",
    kind: "skill",
    summary: "Kills the default voice, permanently.",
    minutes: 5,
    status: "ready",
    when: "Anything that will be read by another person.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "The single highest-value skill to write first, because the default voice shows up in every piece of writing you will ever ask for, and correcting it by hand each time costs a few messages every session forever.",
      },
      { type: "h", text: "When to use it" },
      {
        type: "p",
        text: "Load it for emails, pages, posts, documentation, replies — anything with a reader. Do not load it for code or data work, where it just takes up room.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "steps",
        items: [
          "Copy the text below into a file called house-style.md.",
          "Replace the examples section with three things you have actually written and are happy with. This is the part that does the work; the rules alone get you halfway.",
          "Paste it at the top of any writing conversation, or put it where your tool loads instructions from automatically.",
        ],
      },
      {
        type: "code",
        label: "house-style.md",
        text: `# House style

Write the way I write, not the way things are usually written.

## Rules
- British spelling. Short sentences. Vary their length deliberately.
- Dashes: one pair per paragraph at most. A page of them is the tell.
- Never "it's not just X, it's Y". Never three items purely for rhythm.
- No summary paragraph at the end. Stop when the point is made.
- No rhetorical questions. No exclamation marks.
- Banned words: delve, leverage, seamless, robust, elevate, unlock,
  journey, landscape, testament, tapestry.
- Say the concrete thing. "Four seconds" beats "significantly faster".
- Admit uncertainty in plain words rather than hedging everything.

## Test
Every sentence must survive being read out loud. If I would not say it
to somebody's face, rewrite it.

## Examples of my voice
[paste three real paragraphs you have written]`,
      },
      {
        type: "watch",
        text: "Rules without the examples produce writing that avoids the tells and still sounds like nobody. The examples are not optional.",
      },
    ],
  },
  {
    slug: "brief-first",
    title: "Brief first",
    kind: "skill",
    summary: "Refuses to build until the brief is agreed.",
    minutes: 5,
    status: "ready",
    when: "Any task with more than about three steps.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "The most expensive failure is a beautifully executed answer to the wrong question, and it is expensive precisely because it looks like progress. This skill makes the agent stop, restate the job, and get agreement before any work happens.",
      },
      { type: "h", text: "When to use it" },
      {
        type: "p",
        text: "Anything that will take more than a few minutes to produce or to check. Skip it for small, obvious, single-step requests, where the ceremony costs more than the mistake would.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Load it and then describe the job however loosely you like. You will get questions back instead of work. Answer them, correct the restatement, and only then say go.",
      },
      {
        type: "code",
        label: "brief-first.md",
        text: `# Brief first

Before producing anything for a task with more than three steps:

1. Restate the job in your own words, in two sentences.
2. List every assumption you are making. Mark the ones that would
   change the work if they were wrong.
3. Ask at most three questions — only ones whose answers change what
   you would build. No questions with obvious defaults.
4. State the test: how we will both know the result is right.
5. Stop and wait.

Then, after I agree: build the whole thing. Do not re-open the brief
mid-flight. If something in it turns out to be wrong, say so in one
sentence, state the assumption you are proceeding on, and continue.`,
      },
      {
        type: "pull",
        text: "Three questions maximum. A skill that asks nine is a skill you will stop loading.",
      },
    ],
  },
  {
    slug: "page-brief",
    title: "Page brief",
    kind: "skill",
    summary: "Turns a vague page idea into something buildable.",
    minutes: 7,
    status: "ready",
    when: "Before designing or building any page.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "This is the skill behind every page on this site. It exists because \"make me a landing page\" produces the same page every time, and the reason is that the request contains no information about what the page is supposed to do to somebody.",
      },
      { type: "h", text: "What it produces" },
      {
        type: "list",
        items: [
          "What the page is, and what it must not become.",
          "A feeling curve: five or six beats describing what a visitor feels as they scroll, including one quiet beat before the peak.",
          "One signature move — the single thing this page does that no other page does, written in a visitor's words rather than in technical ones.",
          "The sections in order, each with its anchor, its device and its copy.",
        ],
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Run it before anything is built and keep the result as a file next to the page. When the page drifts, the brief is what you check it against. When you come back in three months, it is the only record of why the page is shaped the way it is.",
      },
      {
        type: "code",
        label: "page-brief.md",
        text: `# Page brief

Produce a brief, not a page. Never write markup during this skill.

Sections, in this order:

WHAT THIS PAGE IS — two sentences. And what it must never become.
ACCENT — one colour that leads, from the existing palette. Not a new one.
GRAMMAR — how the page is laid out overall, in one phrase.
FEELING CURVE — 5 or 6 beats, one line each. One of them must be quiet,
  and it goes immediately before the peak.
THE PEAK, IN A VISITOR'S WORDS — one sentence, no technical terms.
SIGNATURE MOVE — exactly one. Include what happens under reduced motion.
SECTIONS — in order. For each: anchor, device, heading, body copy.
METADATA — title, description, canonical, sharing image.

Rules: no invented prices, titles, numbers or testimonials. Where a real
one is needed, leave an obvious placeholder and a TODO with my name on it.`,
      },
      {
        type: "watch",
        text: "One signature move. Two is the most common way a page ends up feeling busy rather than designed.",
      },
    ],
  },
  {
    slug: "ship-check",
    title: "Ship check",
    kind: "skill",
    summary: "The eight-point pass before anything goes live.",
    minutes: 6,
    status: "ready",
    when: "The last hour before publishing.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Everybody has a mental checklist and everybody skips it at six in the evening. Writing it down means the check happens when you are tired, which is exactly when it is needed.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Run it as the last step, and make it report findings rather than fix them. A skill that fixes as it goes will quietly change four things you did on purpose.",
      },
      {
        type: "code",
        label: "ship-check.md",
        text: `# Ship check

Report findings. Do not fix anything unless I ask.

Check, in this order, and say PASS or the specific problem:

1. Phone. Does anything scroll sideways? Is any tap target under 44px?
2. Reduced motion. With animation off, does every section still make
   sense and is all content still reachable?
3. Keyboard. Can I reach every link and control, and is focus visible?
4. Contrast. Any text under 4.5:1 against its actual background.
5. Images. Alt text that describes, not that names the file. Sizes set
   so nothing jumps as it loads.
6. Metadata. Title, description, canonical, sharing image. Would the
   link look right pasted into a message?
7. Links. Any that go nowhere, or that open a new tab without saying so.
8. Copy. Read every visible word. Flag anything that sounds generated.

End with the single most important thing to fix, and nothing else.`,
      },
      {
        type: "pull",
        text: "Report, do not fix. The check and the change are two different jobs and they need two different moments.",
      },
    ],
  },
  {
    slug: "the-argument",
    title: "The argument",
    kind: "skill",
    summary: "Attacks an idea before you spend a week on it.",
    minutes: 6,
    status: "ready",
    when: "Before committing real time to anything.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Ask for an opinion and you get encouragement, because agreement is the path of least resistance. This skill removes that by naming the job as opposition rather than assessment.",
      },
      { type: "h", text: "When to use it" },
      {
        type: "p",
        text: "Before building, before pitching, before committing money or a week of evenings. Not after — after, it is just a way to feel bad about something you have already shipped.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Give it the idea in a paragraph and whatever evidence you already have. Read the objections without answering them for a day. The ones still bothering you the next morning are the real ones.",
      },
      {
        type: "code",
        label: "the-argument.md",
        text: `# The argument

Your job is to be the smartest person who thinks this is a bad idea.

Do not hedge, do not balance, do not end on encouragement.

Produce:
- The three strongest objections, in order of how likely they are to
  kill it. Each one concrete: name the specific way it fails.
- Who has already tried this and what happened to them. Say plainly
  if you do not know rather than inventing an example.
- The single assumption the whole thing rests on, and what it would
  take to test that assumption this week for almost nothing.
- One sentence: the cheapest test that would change my mind.

Then stop. Do not offer to help me fix the idea.`,
      },
      {
        type: "watch",
        text: "Do not run this on something you have already decided to do. You will either ignore it or lose your nerve, and neither is worth the hour.",
      },
    ],
  },
  {
    slug: "plain-english",
    title: "Plain English",
    kind: "skill",
    summary: "Rewrites anything into language people actually say.",
    minutes: 4,
    status: "ready",
    when: "Anything technical going to a non-technical reader.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Short, and probably the one I use most. It exists because explaining a technical thing simply is a genuinely hard skill, and the default failure is to swap jargon for slightly more approachable jargon.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Paste the thing and say who the reader is. The reader matters more than any instruction about tone — \"for a client who does not code\" and \"for my mother\" produce very different and both correct results.",
      },
      {
        type: "code",
        label: "plain-english.md",
        text: `# Plain English

Rewrite the text for the reader I name. Keep every fact. Keep the
length roughly the same or shorter — this is not a simplification
that removes information.

- Replace every term of art with what it does. If a term must stay
  because the reader will meet it again, define it once in a clause.
- One idea per sentence.
- Use the concrete case instead of the general rule wherever possible.
- No analogies unless the analogy is exact. A wrong analogy is worse
  than the jargon it replaced.
- Keep any caveat that changes what somebody would do. Cut the rest.

Then show me the three terms you removed and what you replaced them
with, so I can put one back if it mattered.`,
      },
      {
        type: "pull",
        text: "The last instruction is the useful one. Showing what was removed is how you catch the thing that should not have been.",
      },
    ],
  },
];
