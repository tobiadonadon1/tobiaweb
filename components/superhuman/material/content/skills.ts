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
    slug: "atelier",
    title: "Atelier",
    kind: "skill",
    summary: "Run the work like a small shop, not a feed.",
    minutes: 5,
    status: "ready",
    when: "You are about to start something, or you already have too many things open.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "An atelier is a room with one job on the table. Not a brand. Not a lifestyle. If three things are in progress, nothing is being made.",
      },
      { type: "h", text: "When to use it" },
      {
        type: "p",
        text: "Load it at the start of a build, a page, or a week of work. Do not load it for a five-minute question.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "steps",
        items: [
          "Copy the text below into atelier.md.",
          "Fill in the one job. If you cannot name it in one line, you do not have a job yet.",
          "Paste it at the top of the conversation before anyone starts building.",
        ],
      },
      {
        type: "code",
        label: "atelier.md",
        text: `# Atelier

You are in a small shop. One job on the table. Finish it.

## Rules
- Name the job in one sentence. If it needs a paragraph, it is two jobs. Pick one.
- Do not start a second piece until the first can be shown.
- Show the work. A file, a URL, a screenshot. Not a plan for later.
- Taste is a decision, not a mood. If two options are fine, pick one and say why in a line.
- No guru talk. No "become". No transformation. The work is the work.
- If you do not know, say so and ask one question. Not five.

## Stop
When the job can be used by someone else without you standing next to it.`,
      },
      {
        type: "watch",
        text: "A list of next jobs is not a shop. It is a stall. Keep the list somewhere else.",
      },
    ],
  },
  {
    slug: "page-copy",
    title: "Page copy",
    kind: "skill",
    summary: "Writes the words before anyone draws a box.",
    minutes: 6,
    status: "ready",
    when: "Before layout, or when a page already looks finished and still does not convert.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Copy written into a layout is copy shaped to fit a box. Write the page as words first. Then the boxes have a job.",
      },
      { type: "h", text: "What it produces" },
      {
        type: "list",
        items: [
          "A headline that names the place, not a promise.",
          "The convert path, in order: why they stall, what is on the shelf, the two doors, the email.",
          "Every visible sentence, short enough to say out loud.",
        ],
      },
      {
        type: "code",
        label: "page-copy.md",
        text: `# Page copy

Write the page as words. Do not write markup. Do not invent a shop.

Voice: humble, short, straight, valuable. No guru. Never "become".

Order, unless I change it:
1. Why people have tools and still fall behind.
2. The shelf. Name what is free, what is paid and locked, what is later. Do not fake a buy button.
3. Two one-to-one doors, side by side. Coach. I build it.
4. Email. One ask.

Rules:
- One idea per sentence.
- Facts only. No invented prices, numbers, or testimonials.
- If something is locked, say locked.
- If something is not for sale yet, say so. Do not dress the empty shelf.
- Stop when the point is made.

End with the words a visitor will actually read, in order, nothing else.`,
      },
      {
        type: "pull",
        text: "If a sentence would embarrass you said to one person across a table, cut it.",
      },
    ],
  },
  {
    slug: "motion-scale",
    title: "Motion scale",
    kind: "skill",
    summary: "How much a page is allowed to move.",
    minutes: 5,
    status: "ready",
    when: "Before adding animation, or when a page already feels busy.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Motion is a size, like type. Most pages pick a size that is too loud. This skill sets the scale before anyone writes a tween.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Run it with the page brief. It should name one move, how far it travels, and what the page does when the visitor has asked for less motion.",
      },
      {
        type: "code",
        label: "motion-scale.md",
        text: `# Motion scale

Decide the scale of motion. Do not add effects until this is agreed.

## Scale
- Small: opacity and a few pixels. Hover, focus, a line drawing in.
- Medium: one section that pins or wipes. The rest of the page stays still.
- Large: one signature move for the whole page. Nothing else competes with it.

Pick one scale. If you need two, the page is two pages.

## Rules
- One signature move. Two is busy.
- Transform and opacity only, unless there is a reason that fits in one sentence.
- Reduced motion is not a smaller version of the same show. It is the finished page with nothing moving, still readable, still usable.
- Never move the whole viewport. Never autoplay a large loop next to body copy.
- If you cannot explain the move in a visitor's words, cut it.

## Report
Name the scale, the one move, and what reduced motion looks like. Then stop.`,
      },
      {
        type: "watch",
        text: "Animation in the morning is how a day of building dies. Scale first. Motion last.",
      },
    ],
  },
  {
    slug: "the-spec",
    title: "The spec",
    kind: "skill",
    summary: "Locks what we are building before anyone builds it.",
    minutes: 6,
    status: "ready",
    when: "Before a build, or when two people think they agreed and they did not.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "A spec is the job written down so nobody has to remember it. Short. Testable. If it cannot fail a check, it is a wish.",
      },
      { type: "h", text: "What it produces" },
      {
        type: "list",
        items: [
          "What it is, in one sentence.",
          "What it must do. What it must not do.",
          "How we will know it is done. One check per must.",
        ],
      },
      {
        type: "code",
        label: "the-spec.md",
        text: `# The spec

Write a spec. Do not build. Do not design.

## Must have
- What it is. One sentence.
- Who it is for, and what they do next.
- Must do: a short list. Each line can be checked yes or no.
- Must not: fake shops, fake numbers, fake testimonials, extra pages.
- Done when: the checks pass. Not when it "feels ready".

## Rules
- No new product strategy. If a decision is missing, name it and stop.
- No scope you cannot ship in this pass.
- If two interpretations are possible, pick one in writing.

Then stop and wait for agreement. After that, build to the spec. If the spec is wrong, say so in one line and stop again.`,
      },
      {
        type: "watch",
        text: "A spec that grows during the build is not a spec. It is a conversation you refused to have at the start.",
      },
    ],
  },
  {
    slug: "tester",
    title: "Tester",
    kind: "skill",
    summary: "Clicks the real thing. Reports what broke. Does not rebuild it.",
    minutes: 5,
    status: "ready",
    when: "A page or flow is supposed to be done.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Testing is not a vibe. Sit down, use it like a stranger, write what happened. Do not fix as you go. Fixing hides the next failure.",
      },
      { type: "h", text: "How to use it" },
      {
        type: "p",
        text: "Load it after the spec and the ship check. Give it the URL and the spec. Ask for a report, not a patch.",
      },
      {
        type: "code",
        label: "tester.md",
        text: `# Tester

Use the thing. Do not rebuild it. Do not redesign it.

## Pass through
1. Land where a stranger lands. First screen: can you tell what this is?
2. Do the main job the spec names. Note where you got stuck.
3. Phone. Keyboard. Reduced motion on.
4. Every link and control you can see. Dead ones, surprise new tabs, missing labels.
5. Copy: anything you would not say out loud. Anything that promises a shop that is not there.

## Report
- PASS or FAIL on the spec's done-when list, line by line.
- The single worst problem, first.
- Edge cases after that, short.

Do not offer a redesign. Do not start coding. If you cannot reach the thing, that is the report.`,
      },
      {
        type: "pull",
        text: "If you found yourself fixing it, you stopped testing.",
      },
    ],
  },
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
