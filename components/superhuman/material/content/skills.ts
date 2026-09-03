import type { MaterialEntry } from "../material-types";

/**
 * THREE SKILLS, NOT SIX, AND NAMED AS ROLES.
 *
 * They were called Atelier, The Spec and The Sweep, which are codenames: you
 * had to already know what they did before the name told you anything. A skill
 * is a role you are putting into the agent for the length of a job, so it is
 * named after the role. You are hiring an art director, not loading a file.
 *
 * The folder used to hold six, and each one was fifteen lines of sensible
 * advice. Fifteen lines is a note, not a skill: an agent that reads it behaves
 * the same way it would have behaved anyway, so downloading it changed
 * nothing. These three are folders instead of files. Each one carries the
 * instructions, the reference the agent opens when it needs detail, and worked
 * examples, and each one is doing a job that an agent measurably does badly
 * without it.
 *
 * WHAT MAKES ONE OF THESE REAL. It has to change the output. If you can load
 * it, ask for the same thing twice, and not tell which answer had the skill,
 * it is not finished and it does not go on the page.
 *
 * The `body` here is the skill's own page. It is the argument for the skill
 * plus how to install it, and it never repeats the summary that got you here.
 */

/** Where a skill's bundle and its raw instructions live. One place. */
const bundle = (slug: string) => `/construct/skills/${slug}.zip`;

export const SKILLS: MaterialEntry[] = [
  /* ---------------------------------------------------------------- *
   * 01
   * ---------------------------------------------------------------- */
  {
    slug: "art-director",
    title: "Art Director",
    kind: "skill",
    summary: "Makes an agent art direct a page instead of assembling one.",
    minutes: 4,
    status: "ready",
    when: "The layout it built is competent and looks like everybody else's.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Ask an agent for a landing page and you get the same page every time. Centred hero, three cards, rounded corners, a soft shadow, one blue button. Nothing in it is wrong. Nothing in it was decided either, and you can feel that in the first second.",
      },
      {
        type: "p",
        text: "Art Director gives the agent the decisions an art director would have made. A type scale with real contrast rather than four sizes a step apart. A grid held by hairlines rather than by cards floating on shadows. One accent colour used with enough force to mean something, instead of five used politely. And motion treated as a size you pick once for the whole page, not an effect added per section.",
      },
      {
        type: "h",
        text: "What changes in the output",
      },
      {
        type: "list",
        items: [
          "Display type gets lighter and tighter as it gets bigger, which is what makes large type look drawn rather than typed.",
          "Layouts commit to a grid and then break it deliberately in one place, instead of centring everything and hoping.",
          "One signature move per page, chosen on purpose. The rest of the page holds still.",
          "The page still works with every animation switched off, because that is the same page with nothing moving.",
        ],
      },
      {
        type: "pull",
        text: "If the page only makes sense while it is moving, it is not finished.",
      },
      {
        type: "watch",
        text: "It has taste, which means it has opinions you may disagree with. It will argue for a hairline where you wanted a card. Override it in your own instructions file and it stops arguing.",
      },
    ],
    link: { label: "Download Art Director", href: bundle("art-director"), download: true },
  },

  /* ---------------------------------------------------------------- *
   * 02
   * ---------------------------------------------------------------- */
  {
    slug: "product-manager",
    title: "Product Manager",
    kind: "skill",
    summary: "Interviews you, then writes what you are building before anything is built.",
    minutes: 4,
    status: "ready",
    when: "Before a build, or the second time you have been surprised by what came back.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Two people can agree completely and be building different things. You find out four days in, when the thing arrives and it is not the thing. With an agent it happens faster, because an agent never says it is confused. It fills the gap with something plausible and keeps going.",
      },
      {
        type: "p",
        text: "Product Manager makes it ask first. It runs an interview, and the questions are chosen to surface disagreement early rather than to be answered smoothly. Then it writes the document: what this is, what it must do, what it must not do, and how anybody will be able to tell it is finished.",
      },
      {
        type: "h",
        text: "The two sections everyone skips",
      },
      {
        type: "p",
        text: "Non goals, and acceptance criteria that are falsifiable. Most specs list features and call the last section done. A criterion that reads well and cannot be checked is not a criterion. \"The page feels fast\" is an opinion you will have an argument about. \"Largest contentful paint under 2.5 seconds on a throttled 4G connection\" is a fact somebody can measure while you are out.",
      },
      {
        type: "watch",
        text: "The interview has a rule for when you say to use its judgement. It does not. It writes the question down as an open decision and carries on, so the thing you waved through is on the page instead of buried in the build.",
      },
    ],
    link: { label: "Download Product Manager", href: bundle("product-manager"), download: true },
  },

  /* ---------------------------------------------------------------- *
   * 03
   * ---------------------------------------------------------------- */
  {
    slug: "code-reviewer",
    title: "Code Reviewer",
    kind: "skill",
    summary: "Audits the code, proves each finding is real, then fixes them one at a time.",
    minutes: 5,
    status: "ready",
    when: "Before you ship, or when the codebase has got away from you.",
    level: "Comfortable in a terminal",
    body: [
      {
        type: "p",
        text: "Ask for a code review and you get forty findings. Some are real, most are style, and a few are invented. Nobody acts on a list of forty, so the list gets saved and never opened, and the review was theatre.",
      },
      {
        type: "p",
        text: "Code Reviewer is a loop rather than a review, and the second step is the one that matters. Before a finding is allowed onto the report it has to be proved: write the actual input that triggers it and the actual wrong output it produces. A finding nobody can trigger is a guess, and guesses are thrown away rather than softened into maybes.",
      },
      {
        type: "steps",
        items: [
          "Sweep the codebase once per dimension. Correctness, then dead code, then accessibility, then error handling, and so on. One pass looking for everything finds nothing.",
          "Prove each finding with a concrete failure. Discard the ones you cannot trigger.",
          "Rank what survives by what it actually costs, not by how easy it was to describe.",
          "Fix the top one. Make the smallest correct change. Run the check that proves it.",
          "Do not start the next one until this one is proven. Never batch fixes.",
          "Sweep again to confirm the fix introduced nothing new.",
        ],
      },
      {
        type: "pull",
        text: "One at a time, proven, then the next. That rule is the whole product.",
      },
      {
        type: "p",
        text: "It stops on its own. When the list is empty it says so, and when something left needs a decision that is yours rather than the machine's, it hands it back instead of guessing at what you would have wanted.",
      },
      {
        type: "watch",
        text: "It will not refactor for taste and it will not rewrite code that works. Anything it cannot prove is broken is left alone and reported as unproven, which is occasionally annoying and is the reason you can trust the rest of it.",
      },
    ],
    link: { label: "Download Code Reviewer", href: bundle("code-reviewer"), download: true },
  },
];
