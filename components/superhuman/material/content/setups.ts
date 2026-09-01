import type { MaterialEntry } from "../material-types";

/**
 * SETUPS — the configuration layer.
 *
 * Skills are what you load for a job. Setups are what is true every time,
 * whether you remember it or not. It is the least glamorous folder and the
 * one that changes the most, because everything in it compounds: a rule
 * written here is a rule you never have to type again.
 */
export const SETUPS: MaterialEntry[] = [
  {
    slug: "agents-md",
    title: "AGENTS.md, the file that stops it guessing",
    kind: "setup",
    summary: "One file at the root, read before anything else.",
    minutes: 7,
    status: "ready",
    when: "The first hour of any project you will come back to.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "A plain text file at the top of the project describing how this project works. Every serious coding agent now looks for one, and it is the single most valuable file in the project.",
      },
      { type: "h", text: "What goes in it" },
      {
        type: "list",
        items: [
          "How to run and build it. The two commands, exactly.",
          "The conventions that are not obvious from the code. Naming, structure, the thing you always do that nobody else does.",
          "The traps. Anything that has broken twice belongs here in a sentence.",
          "What not to touch, and why. Generated files, vendored code, the one component held together with tape.",
        ],
      },
      { type: "h", text: "What does not go in it" },
      {
        type: "p",
        text: "Anything the code already says. A list of your folders is a list that goes out of date in a week and that the agent can read for itself in a second. The file is for the things that are true and invisible.",
      },
      {
        type: "pull",
        text: "The test for a line belonging in this file: would a competent new person get it wrong on their first day?",
      },
      { type: "h", text: "The line that matters most" },
      {
        type: "p",
        text: "If your project uses a version of something that changed recently, say so and point at the documentation that shipped with it. A model's idea of a framework is a snapshot of the internet, and the internet is mostly writing about the last major version. This one line prevents a whole class of confident wrong answers.",
      },
      {
        type: "code",
        label: "AGENTS.md",
        text: `# This is NOT the version you know

This project uses [framework] [version], which has breaking changes
against what you have probably read. Read the guide in
node_modules/[framework]/dist/docs/ before writing any code.

## Running it
- dev:   npm run dev
- build: npm run build   (this must pass before anything ships)

## Conventions
- [the thing you always do that nobody else does]
- [naming rule]
- Content lives in typed data files. Pages are generated from them.

## Traps
- [the thing that has broken twice]`,
      },
    ],
  },
  {
    slug: "context-hygiene",
    title: "Context hygiene",
    kind: "setup",
    summary: "What to load, what to leave out, why more is not better.",
    minutes: 6,
    status: "ready",
    when: "Answers have started getting worse over a long session.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "There is a persistent belief that giving a model more will make it do better. Past a point the opposite happens: the important instruction from forty minutes ago is now one paragraph among two hundred, and it gets treated accordingly.",
      },
      { type: "h", text: "The rules" },
      {
        type: "steps",
        items: [
          "One job per conversation. When the job changes, start again.",
          "Load the whole of the thing being worked on, and none of the things next to it. Half a file is worse than no file, because it looks complete.",
          "Put standing instructions in a file that is loaded every time, not in a message near the top that gets buried.",
          "When it starts drifting, ask for a summary, check it, and restart with the summary. Do not try to correct your way out.",
        ],
      },
      { type: "h", text: "The signs it has gone wrong" },
      {
        type: "list",
        items: [
          "Something you settled an hour ago comes back as an open question.",
          "The tone changes without you changing anything.",
          "It starts describing what it is about to do at greater and greater length.",
          "It repeats a fix you already rejected.",
        ],
      },
      {
        type: "watch",
        text: "None of these mean the model got worse. They mean the conversation got too full to see the important parts, and that is a thing you control.",
      },
    ],
  },
  {
    slug: "hooks",
    title: "Hooks, or the rules you should not have to enforce",
    kind: "setup",
    summary: "Rules the environment enforces so you need not.",
    minutes: 6,
    status: "ready",
    when: "You have asked for the same thing three times.",
    level: "Comfortable in a terminal",
    body: [
      {
        type: "p",
        text: "Some rules do not belong in an instruction file, because an instruction is a request and what you want is a guarantee. A hook is a command your tools run automatically at a fixed moment — after a file is written, before something is committed — and it holds whether anybody remembered or not.",
      },
      { type: "h", text: "What is worth hooking" },
      {
        type: "list",
        items: [
          "Formatting. Never ask for consistent formatting again; have it applied every time a file is saved.",
          "The type check, before anything is committed. A broken build should be impossible to create rather than merely discouraged.",
          "A notification when a long job finishes, so you can go and do something else while it runs.",
        ],
      },
      { type: "h", text: "What is not" },
      {
        type: "p",
        text: "Anything requiring judgement. A hook is a rule with no exceptions, and most of what you care about has exceptions. If you would ever want to override it, it belongs in the instruction file, where it can be argued with.",
      },
      {
        type: "pull",
        text: "Instructions are for judgement. Hooks are for facts.",
      },
      {
        type: "watch",
        text: "Every hook runs on every operation it is attached to. A slow one turns a fast loop into a slow one, and you will blame the model rather than the hook.",
      },
    ],
  },
  {
    slug: "subagents",
    title: "Subagents, and when they are worth it",
    kind: "setup",
    summary: "Send an agent to read; keep only the conclusion.",
    minutes: 5,
    status: "ready",
    when: "The answer requires reading far more than it requires writing.",
    level: "Comfortable in a terminal",
    body: [
      {
        type: "p",
        text: "A subagent is a second agent given one task, working in its own conversation, and handing you back only its conclusion. The thing you gain is not speed. It is that all the material it had to read never enters your conversation.",
      },
      { type: "h", text: "When they earn it" },
      {
        type: "list",
        items: [
          "Searching for something across a lot of files, where you want the answer and not the forty excerpts it took to find it.",
          "Genuinely independent pieces of work that can happen at the same time.",
          "A review by something that has not seen the arguments you already made for the thing being reviewed.",
        ],
      },
      { type: "h", text: "When they do not" },
      {
        type: "p",
        text: "When you already know which file the answer is in. Sending an agent to open a file you could have named is slower, costs more, and gives you a summary where you wanted the line.",
      },
      {
        type: "watch",
        text: "A subagent cannot see your conversation unless you put it in the instructions. Most disappointing results are a subagent doing exactly what it was told by somebody who forgot it had no context.",
      },
    ],
  },
  {
    slug: "a-scratchpad",
    title: "A scratchpad, and why it should not be in your project",
    kind: "setup",
    summary: "One directory for debris, outside the project.",
    minutes: 4,
    status: "ready",
    when: "Now, before the first stray file appears.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Working with an agent produces debris: a script to check one thing, a file of intermediate output, three versions of something you were comparing. All of it is useful for an hour and none of it should be near your actual work.",
      },
      { type: "h", text: "How to set it up" },
      {
        type: "steps",
        items: [
          "Pick one directory outside the project for temporary files.",
          "Name it in your instruction file, so every session uses the same one without being asked.",
          "Never commit anything from it. Nothing in there is ever the real version of anything.",
          "Clear it whenever you think of it. If something in there mattered, it should have been moved.",
        ],
      },
      { type: "h", text: "Why it matters more than it sounds" },
      {
        type: "p",
        text: "Debris left in a project gets read the next time somebody looks around, and a stale test script from three weeks ago is treated as a description of how the system works. The cost is not mess. It is that the mess is taken as documentation.",
      },
      {
        type: "pull",
        text: "A file in the project is a claim about the project. Do not leave claims you did not mean to make.",
      },
    ],
  },
];
