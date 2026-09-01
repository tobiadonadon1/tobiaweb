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
    link: {
      label: "Download atelier SKILL.md",
      href: "/construct/skills/atelier/SKILL.md",
      download: true,
    },

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
    link: {
      label: "Download page-copy SKILL.md",
      href: "/construct/skills/page-copy/SKILL.md",
      download: true,
    },

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
    link: {
      label: "Download motion-scale SKILL.md",
      href: "/construct/skills/motion-scale/SKILL.md",
      download: true,
    },

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
    link: {
      label: "Download the-spec SKILL.md",
      href: "/construct/skills/the-spec/SKILL.md",
      download: true,
    },

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
    link: {
      label: "Download tester SKILL.md",
      href: "/construct/skills/tester/SKILL.md",
      download: true,
    },

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
    link: {
      label: "Download ship-check SKILL.md",
      href: "/construct/skills/ship-check/SKILL.md",
      download: true,
    },

  },
];
