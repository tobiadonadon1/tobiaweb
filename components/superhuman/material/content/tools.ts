import type { MaterialEntry } from "../material-types";

/**
 * TOOLS — what I build with, and when each one earns its place.
 *
 * Every tool listed here is one this site is actually built on, which is the
 * only reason it is in the list. There is no affiliate arrangement behind any
 * of them; if that ever changes, the entry gets `referral: true` and the
 * reading pane prints the disclosure itself.
 *
 * TODO(tobia): prune or extend this list to match what you really reach for.
 * Anything added should be something you have shipped with, not something you
 * have read about.
 */
export const TOOLS: MaterialEntry[] = [
  {
    slug: "claude-code",
    title: "Claude Code",
    kind: "tool",
    summary: "An agent in the terminal. Where the building happens.",
    minutes: 6,
    status: "ready",
    when: "Any change to a real codebase, from a typo to a whole page.",
    level: "Comfortable in a terminal",
    body: [
      {
        type: "p",
        text: "A coding agent that runs in the terminal against your actual project, so it can read the files, run the build, see the error and fix it, rather than producing a snippet you paste somewhere and hope.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "The difference between a chat window and an agent with access to the project is the difference between advice and work. In a chat window you are the clipboard. Here the loop closes: it changes something, runs it, sees what happened, and corrects, and you spend your attention on whether the result is right rather than on ferrying text between two windows.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "steps",
        items: [
          "An AGENTS.md at the root, so it knows the house rules before it reads a line of code. See the Setups folder.",
          "Plan first for anything structural. Read the plan, fix the wrong assumption, then let it run.",
          "One change at a time, checked on screen, committed when it is right. Small commits are the undo button.",
          "Skills for the things I need repeatedly — the brief, the style, the ship check.",
        ],
      },
      { type: "h", text: "What I would not use it for" },
      {
        type: "p",
        text: "Anything I could not review. If the change is in a part of the system I do not understand, the answer is to understand it first, not to accept a diff I am unable to read.",
      },
      {
        type: "watch",
        text: "The failure mode is accepting a lot at once because it looks finished. Keep the steps small enough that you actually look at each one.",
      },
    ],
    link: { label: "claude.com/claude-code", href: "https://claude.com/claude-code" },
  },
  {
    slug: "nextjs",
    title: "Next.js",
    kind: "tool",
    summary: "The framework this site runs on.",
    minutes: 6,
    status: "ready",
    when: "Anything that is a website rather than an app inside a page.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "The React framework that handles the parts you would otherwise assemble by hand: routing from the folder structure, rendering on the server, images, metadata, and the build.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "Pages that are mostly content should arrive as finished HTML, and pages that need to react to a pointer should be able to. Next lets one project do both without choosing a side, and the routing coming out of the folder layout means the structure of the site is visible in the structure of the files.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "list",
        items: [
          "Server components by default. A component becomes a client one only when it needs the browser — a pointer, a scroll position, state.",
          "Content in typed data files, pages generated from them. Every route on this site is built from an array rather than hand-written.",
          "Metadata generated next to the page it describes, so a new page cannot ship without a title and a description.",
        ],
      },
      {
        type: "watch",
        text: "Its conventions move between major versions. Read the documentation shipped inside the version you have installed rather than the article you found. This is genuinely where most wasted time goes.",
      },
    ],
    link: { label: "nextjs.org", href: "https://nextjs.org" },
  },
  {
    slug: "typescript",
    title: "TypeScript",
    kind: "tool",
    summary: "Makes an agent's mistakes fail loudly, not quietly.",
    minutes: 5,
    status: "ready",
    when: "Every project, from the first file.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "JavaScript with types. Its usual selling point is catching your own mistakes, and that is true, but it has become far more valuable for a second reason.",
      },
      { type: "h", text: "Why it earns its place now" },
      {
        type: "p",
        text: "An agent writing code will occasionally invent a field that does not exist or pass the wrong shape into a function. In plain JavaScript that is a bug you find later, from a blank page and a console error. With types it is a red line before anything is even run, and the agent can see it and correct itself without you being involved at all.",
      },
      {
        type: "pull",
        text: "Types are how you make the machine check the machine.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "list",
        items: [
          "Content gets a type before it gets a value. The shape of a page's data is written first, then filled in.",
          "Unions instead of loose strings, so a status can only ever be one of the things a status is allowed to be.",
          "The type check runs as part of the build, so a wrong shape cannot reach the site.",
        ],
      },
    ],
    link: { label: "typescriptlang.org", href: "https://www.typescriptlang.org" },
  },
  {
    slug: "tailwind",
    title: "Tailwind CSS",
    kind: "tool",
    summary: "Styling in the markup. Easy to hand to an agent.",
    minutes: 5,
    status: "ready",
    when: "Any interface work where the design is still moving.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Styles written as small classes directly on the element rather than in a separate stylesheet with names you have to invent.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "Two reasons, and the second one is newer. First, the design lives where the markup lives, so changing how something looks does not mean holding two files in your head. Second, it is the styling approach an agent handles best: the change is local, visible in one place, and there is no cascade of side effects three files away.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "list",
        items: [
          "Every colour, hairline and type role is a variable defined once, and the classes reference those. No hex codes typed into components.",
          "Anything genuinely reusable — a paper ground, an ink section, a rule between list items — becomes one named class, not a string of forty utilities copied around.",
          "Type roles carry zero specificity, so any single call site can still override them without a fight.",
        ],
      },
      {
        type: "watch",
        text: "Left unchecked it produces walls of unreadable class strings. The fix is not to stop using it; it is to name the three or four patterns you keep repeating.",
      },
    ],
    link: { label: "tailwindcss.com", href: "https://tailwindcss.com" },
  },
  {
    slug: "gsap",
    title: "GSAP",
    kind: "tool",
    summary: "For animation tied to the scroll.",
    minutes: 6,
    status: "ready",
    when: "Anything where scroll position drives what you see.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "An animation library, and specifically the one with ScrollTrigger, which is the piece that makes scroll-driven work possible without hand-writing a lot of fragile measurement code.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "Pinning a section, scrubbing a sequence against the scrollbar, and re-measuring correctly when the window resizes are three problems that look small and are not. It handles all three, and it degrades sensibly when somebody has asked their system for less motion.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "steps",
        items: [
          "One trigger per section, driving one number.",
          "That number goes into one pure function that positions everything. Nothing owns its own timer or its own animation frame.",
          "Every effect lives inside a matchMedia block, so reduced motion and small screens simply never run it rather than running a smaller version of it.",
        ],
      },
      {
        type: "pull",
        text: "One scrubbed number, one render function. Ten independent tweens on one section is how a page starts to stutter.",
      },
      {
        type: "watch",
        text: "Anything that turns the page into a scroll container silently breaks every sticky element on the site. If a pinned section stops pinning, look for an overflow rule before you look at the animation.",
      },
    ],
    link: { label: "gsap.com", href: "https://gsap.com" },
  },
  {
    slug: "motion",
    title: "Motion",
    kind: "tool",
    summary: "For things entering, leaving and answering a pointer.",
    minutes: 4,
    status: "ready",
    when: "Component-level animation that has nothing to do with scroll.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "The animation library that used to be called Framer Motion. It animates components declaratively: you describe the states and it handles getting between them.",
      },
      { type: "h", text: "Why both this and GSAP" },
      {
        type: "p",
        text: "They are good at different problems and the split is clean. Motion is better where the animation belongs to a component's own state — a panel opening, an item leaving a list, something responding to hover. GSAP is better where a timeline is driven by something outside the component, which in practice means the scroll.",
      },
      {
        type: "watch",
        text: "Two animation libraries is one more than most projects need. If you are starting out, pick one and live with it for a while before adding the second.",
      },
    ],
    link: { label: "motion.dev", href: "https://motion.dev" },
  },
  {
    slug: "three",
    title: "Three.js",
    kind: "tool",
    summary: "For the one moment that has to be more than flat.",
    minutes: 5,
    status: "ready",
    when: "Rarely, and always for exactly one thing on a page.",
    level: "Comfortable in a terminal",
    body: [
      {
        type: "p",
        text: "The library for drawing with the graphics card in a browser. Three dimensions, shaders, and everything that goes with them.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "There are effects that simply cannot be done any other way — real depth, real light, a material that responds to a pointer as a surface rather than as a rectangle. When a page needs one of those, nothing else is close.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "p",
        text: "Once per site, at most. It is heavy, it costs battery, and it is the easiest thing on a page to over-use. The test I apply is whether the moment would still be worth having if it were the only thing that moved on the entire site.",
      },
      {
        type: "watch",
        text: "It must never be the only way to reach information. Anything a canvas says has to exist as ordinary text underneath for anybody whose device or settings will not run it.",
      },
    ],
    link: { label: "threejs.org", href: "https://threejs.org" },
  },
  {
    slug: "vercel",
    title: "Vercel",
    kind: "tool",
    summary: "Where it goes live. A push becomes a URL.",
    minutes: 4,
    status: "ready",
    when: "Deploying anything built with Next.js.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Hosting for front-end projects. You connect a repository, and every push builds and goes to a URL.",
      },
      { type: "h", text: "Why it earns its place" },
      {
        type: "p",
        text: "The part that matters is not the production deploy, it is that every branch gets its own live URL. Showing somebody the actual page on their own phone is worth more than any number of screenshots, and the argument about whether something works ends the moment they can open it.",
      },
      { type: "h", text: "How I use it" },
      {
        type: "list",
        items: [
          "Every change gets a preview URL before it gets an opinion.",
          "The build has to pass, including the type check. A broken build never reaches the live site.",
          "Nothing secret lives in the code. Keys go in the project's environment, never in a file that gets committed.",
        ],
      },
    ],
    link: { label: "vercel.com", href: "https://vercel.com" },
  },
];
