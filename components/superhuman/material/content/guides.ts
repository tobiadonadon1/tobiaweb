import type { MaterialEntry } from "../material-types";

/**
 * THREE GUIDES.
 *
 * The folder held eight before, and they were fine. They were also the eight
 * things somebody writes when they are writing guides rather than answering
 * questions: how to pick a school, keeping the work yours, what to do when it
 * goes wrong. Read as a set they described an attitude. Nobody arrives at a
 * material page looking for an attitude.
 *
 * These three are the questions people actually ask, in the order they ask
 * them. What do I install. Which model do I use and why does it get worse
 * after an hour. And the one underneath both, which is that having the tools
 * running is not the same as having anything to build.
 *
 * ORDER IS THE ARGUMENT. Set up, then choose, then think. The third one is
 * last because it is the one you can only use once the first two have stopped
 * being interesting.
 *
 * FIGURES, NOT PHOTOGRAPHS. These carry drawn diagrams (figures.tsx) because
 * their subjects cannot be photographed. Every figure has to say something the
 * paragraph beside it does not, which is also why the prose around a figure is
 * short: the picture is carrying that part of the argument.
 */

export const GUIDES: MaterialEntry[] = [
  /* ================================================================== *
   * 01 — SET UP THE TOOLS
   * ================================================================== */
  {
    slug: "set-up-the-tools",
    title: "Set up the tools",
    kind: "guide",
    summary: "A blank machine to a working agent, in the order that avoids the wasted hour.",
    minutes: 3,
    status: "ready",
    when: "You have heard what these things do and you have not installed one.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "The setup guides you have found are wrong in the same way. Eight tools, a comparison table, and a paragraph about how it depends on your workflow. You do not have a workflow yet. That is the problem.",
      },
      {
        type: "p",
        text: "The whole thing is three installs and one habit. About twenty minutes.",
      },
      {
        type: "figure",
        id: "setup-order",
        caption: "Backwards, and the afternoon goes to a path variable instead of to the work.",
      },
      {
        type: "watch",
        text: "Before you start: Claude Code needs a paid Claude plan, Pro or above, or a Console account with credits on it. There is no free tier. If that is a problem, stop here rather than at step three.",
      },

      { type: "h", text: "One. The terminal" },
      {
        type: "p",
        text: "You already have one. On a Mac it is Terminal, in Applications then Utilities. On Windows, install Windows Terminal from the Microsoft Store. Do not go and learn the shell first.",
      },

      { type: "h", text: "Two. The editor" },
      {
        type: "p",
        text: "Install VS Code from code.visualstudio.com. You are not going to write code in it. You are going to watch the agent change files and read what it did. Add the Claude Code extension later.",
      },

      { type: "h", text: "Three. The agent" },
      {
        type: "p",
        text: "One line, and it is the same line on Mac, Linux and WSL.",
      },
      {
        type: "code",
        label: "Installing Claude Code",
        text: `# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# or on a Mac, if you already use Homebrew
brew install --cask claude-code

# then check it worked
claude --version`,
      },
      {
        type: "p",
        text: "The native install is the one to use. It keeps itself up to date in the background, which the Homebrew and WinGet versions do not. If claude --version prints a number, you are done installing.",
      },
      {
        type: "code",
        label: "Starting it, in the folder you want it to work on",
        text: `cd /path/to/your/project
claude`,
      },
      {
        type: "p",
        text: "It opens a browser to log you in once, then remembers.",
      },

      { type: "h", text: "Four. The step everybody skips" },
      {
        type: "p",
        text: "Point it at something you already understand and ask what it does. You can tell straight away when the answer is wrong, which is the only way to calibrate what it is good at.",
      },
      {
        type: "watch",
        text: "Do not install a second agent on day one. Two agents on a machine you cannot yet drive is two sets of unfamiliar output and no way to tell which one is confusing you.",
      },

      { type: "h", text: "The second agent, later" },
      {
        type: "p",
        text: "Once one is normal to you, a second earns its place. Not because it is better. Because it fails differently. Give it a problem the first one is stuck on and read the disagreement.",
      },
      {
        type: "figure",
        id: "tool-split",
        caption: "The overlap is why the second one is cheap to try. The edges are why it is worth keeping.",
      },
      {
        type: "p",
        text: "OpenAI's Codex is the obvious second. Its install command has changed more than once, so take it from OpenAI's own documentation rather than from a guide, this one included.",
      },

      { type: "h", text: "The one file worth writing" },
      {
        type: "p",
        text: "Put a file called CLAUDE.md in the root of your project. What it is, what it is built with, any rule you are tired of repeating. The agent reads it every session.",
      },
      {
        type: "figure",
        id: "project-file",
        caption: "Five minutes to write, then read back on every session for the life of the project.",
      },
      {
        type: "code",
        label: "CLAUDE.md, and this is genuinely enough to start",
        text: `# What this is
A personal site. Next.js, TypeScript, Tailwind.

# Rules
- No new dependencies without asking.
- Match the style of the file you are editing.
- If you are unsure, ask one question rather than guessing.`,
      },
      {
        type: "pull",
        text: "Everything you leave out of that file is something you will type forty times.",
      },

      { type: "h", text: "What you can ignore for now" },
      {
        type: "list",
        items: [
          "Every extension, plugin and marketplace. None fix a day one problem.",
          "The comparison videos. Benchmarks run on somebody else's codebase.",
          "Learning git properly. Three commands, picked up by watching.",
          "Choosing a framework. No framework means no project yet, and that is the third guide.",
        ],
      },
      {
        type: "p",
        text: "When you can open a folder, start the agent, ask a question about your own code and understand the answer, the setup is finished. A lower bar than the internet suggests, and the actual one.",
      },
    ],
  },

  /* ================================================================== *
   * 02 — PICK THE MODEL
   * ================================================================== */
  {
    slug: "pick-the-model",
    title: "Pick the model",
    kind: "guide",
    summary: "Which one to use, and why the answers get worse the longer you talk.",
    minutes: 3,
    status: "ready",
    when: "The answers were good this morning and they are mush now.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Two questions get asked as one. Which model should I use is about the job. Why has it got stupid is about the conversation. Most people answer the first when the problem is the second.",
      },

      { type: "h", text: "Which model" },
      {
        type: "p",
        text: "Three tiers, and the names change faster than the shape does. A small fast one, a middle one, a big one. The middle is the answer to almost everything.",
      },
      {
        type: "figure",
        id: "model-ladder",
        caption: "The ends of the range are where the money and the waiting are.",
      },
      {
        type: "p",
        text: "At the time of writing they are Haiku, Sonnet and Opus, and Claude Code moves between them mid conversation with /model. Learn the tiers, not the names: the names get a new number roughly twice a year and the shape has not changed once.",
      },
      {
        type: "list",
        items: [
          "Haiku is the small one. Mechanical work where you already know the answer and you want it typed.",
          "Sonnet is the middle one and it is the default for a reason. Features, debugging, building a page, ordinary refactors.",
          "Opus is the big one. Reach for it when the problem is shaped like a search rather than like a task.",
        ],
      },
      {
        type: "p",
        text: "Shaped like a search means a bug living across three files, or an architecture decision you will live with for a year. Renaming a variable does not repay the extra thinking.",
      },
      {
        type: "watch",
        text: "The most expensive mistake is not picking the small model for a hard job. It is running the big model on a conversation that has already gone bad, which costs more and fixes nothing, because the problem is in the context rather than in the reasoning.",
      },

      { type: "h", text: "Why it gets worse" },
      {
        type: "p",
        text: "The model has no memory. Every message sends the whole conversation again, with the project rules and every file it has read. That bundle is the context window, and it has a size.",
      },
      {
        type: "figure",
        id: "context-window",
        caption: "The fixed cost at the front never moves. The middle grows, and the middle is mostly things that stopped mattering an hour ago.",
      },
      {
        type: "p",
        text: "It is not the model getting tired. It is signal against noise: ninety messages of dead ends and deleted files, weighed the same as what you asked thirty seconds ago.",
      },

      { type: "h", text: "Compacting, and what it costs you" },
      {
        type: "p",
        text: "Compacting replaces the middle of that bundle with a summary of itself. You keep the decisions, you lose the exact wording, and you get the room back. In Claude Code you type /compact. It also happens on its own when the window gets close to full, a safety net rather than a strategy.",
      },
      {
        type: "figure",
        id: "session-arc",
        caption: "The automatic compact fires wherever you happen to be, which is never the boundary you would have picked.",
      },
      {
        type: "pull",
        text: "Compact at a boundary you chose, not at the one the machine picked.",
      },
      {
        type: "steps",
        items: [
          "Compact when you finish a thing, not halfway through one. A summary written mid-thought summarises a mess.",
          "Say what to keep. Compacting takes an instruction, so name the decisions and the file paths.",
          "Start fresh when the next task is unrelated. A summary of the wrong project costs you all day.",
          "Move anything permanent into CLAUDE.md. A rule you re-explain after every compact was never conversation.",
        ],
      },
      {
        type: "p",
        text: "A conversation is working memory. A file is long term memory. Durable facts kept in the chat will eventually be summarised away.",
      },
      {
        type: "watch",
        text: "If you have compacted twice on the same task and it is still going badly, the problem is not the context. Stop, write down in one sentence what you are actually trying to do, and open a new conversation with that sentence. That fixes it more often than a third compact.",
      },
    ],
  },

  /* ================================================================== *
   * 03 — FIND THE IDEA
   * ================================================================== */
  {
    slug: "find-the-idea",
    title: "Find the idea",
    kind: "guide",
    summary: "Getting from something that bothers you to one sentence you can start on Monday.",
    minutes: 2,
    status: "ready",
    when: "You can build almost anything now and you cannot think of what.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Building got cheap. A thing that was three weeks is an afternoon. The bottleneck moved from your hands to the part of you that decides what is worth making, which has had no practice because it was never the constraint.",
      },
      {
        type: "p",
        text: "So people build the tutorial. Or they build the thing they already know how to build, again, slightly better. Both are ways of avoiding the choosing.",
      },

      { type: "h", text: "You do not have an idea. You have an impulse." },
      {
        type: "p",
        text: "An impulse is real and it is not usable. Something about how people organise their notes. Something for freelancers. A better version of this app I hate. Each one could still be four hundred different products.",
      },
      {
        type: "p",
        text: "The work is narrowing. Not validating, not researching the market. Narrowing, until one thing is left that you could open a folder and begin.",
      },
      {
        type: "figure",
        id: "idea-funnel",
        caption: "Every cut throws away work you have not done yet, which is why making them early costs nothing.",
      },

      { type: "h", text: "The three cuts" },
      {
        type: "steps",
        items: [
          "One person. Somebody you could name and message today. If you cannot name one you have a category rather than a problem, and the category feels safer because it is empty.",
          "One occasion. The exact moment it happens. Not \"freelancers struggle with invoicing\" but \"on the last day of the month she opens a spreadsheet, copies last month's invoice, and changes the dates\".",
          "One sentence. What that person can do afterwards that they could not do before.",
        ],
      },
      {
        type: "pull",
        text: "If the sentence needs an \"and\", you have two ideas.",
      },

      { type: "h", text: "When it will not narrow" },
      {
        type: "p",
        text: "Sometimes nothing survives the cuts. That is a result, not a failure. The impulse was borrowed, or it is two ideas sharing a word, or you do not know the person well enough yet.",
      },
      {
        type: "p",
        text: "The last one is the most common and the most fixable. An hour with one person who has the problem beats a week of narrowing it in your own head.",
      },

      { type: "h", text: "The taste part, which is the part nobody can give you" },
      {
        type: "p",
        text: "Two people can pass all three cuts and arrive at different ideas, and one of them is better. That difference is taste: the accumulated result of paying attention in one area and having opinions about which of it was any good.",
      },
      {
        type: "figure",
        id: "two-endings",
        caption: "Nothing in the method separates these two. That is why the method is the easy half.",
      },
      {
        type: "p",
        text: "The only way to get it is to build the narrow thing, look at it honestly, and be specific about what is wrong. Do that thirty times and you start choosing better before you build, rather than after.",
      },
      {
        type: "watch",
        text: "Do not narrow before you are interested. The cuts are for an impulse you already care about. Running them on an idea you picked because it looked like a market gives you a very specific thing you do not want to build, which is worse than a vague one you do.",
      },
      {
        type: "p",
        text: "When you have the sentence, that is the brief. Take it to the spec skill, get it written down before anybody builds it, and start Monday.",
      },
    ],
  },
];
