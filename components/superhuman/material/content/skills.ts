import type { MaterialEntry } from "../material-types";

/**
 * FOUR SKILLS, NAMED AS ROLES.
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
 *
 * Motion Director is the one that brings its own machinery: a render engine
 * it installs on first run. So its folder is bigger, its page shows what it
 * makes, and it carries its own install steps instead of the skills path.
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
  /* ---------------------------------------------------------------- *
   * 04
   * ---------------------------------------------------------------- */
  {
    slug: "motion-director",
    title: "Motion Director",
    kind: "skill",
    summary: "Turns any idea into a finished short video with its own original soundtrack.",
    // Minutes to a finished video, which is what matters here.
    minutes: 10,
    status: "ready",
    when: "You need a video for a launch, a post or an idea, and you have ten minutes, not a video team.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Type what the video is about and answer two quick rounds of questions. About ten minutes later, a finished 10 to 20 second MP4 with music written for it is on your Desktop, ready to post.",
      },
      {
        type: "reel",
        caption: "Four videos Motion Director made, one in each look. Tap one for sound.",
        items: [
          { src: "/construct/reel/motion-director/explainer.mp4", poster: "/construct/reel/motion-director/explainer.jpg", label: "Motion-graphics explainer", aspect: "16/9" },
          { src: "/construct/reel/motion-director/kinetic.mp4", poster: "/construct/reel/motion-director/kinetic.jpg", label: "Kinetic typography", aspect: "9/16" },
          { src: "/construct/reel/motion-director/neon.mp4", poster: "/construct/reel/motion-director/neon.jpg", label: "Neon, cinematic", aspect: "9/16" },
          { src: "/construct/reel/motion-director/ink.mp4", poster: "/construct/reel/motion-director/ink.jpg", label: "Hand-drawn ink", aspect: "1/1" },
        ],
      },
      { type: "h", text: "What you get" },
      {
        type: "list",
        items: [
          "A video that looks like a studio made it. Claude gives your idea a twist, designs and animates every frame, and checks its own work frame by frame before you see it.",
          "A soundtrack nobody else has. The music is composed from scratch for your video and cut to the picture, so every hit lands on a beat.",
          "Four looks: bold kinetic typography, a clean motion-graphics explainer, neon and cinematic, or hand-drawn ink. Vertical for X, TikTok, Reels and Shorts, or landscape, square and 4:5, as a crisp 1080p MP4.",
          "Yours to use, commercially too. There is no stock footage, no licensed music, no watermark and no editing app.",
          "A project you can open. The picture and the music of every video are plain code in a small folder, so you can tweak it, reuse it, and see exactly how it was made.",
        ],
      },
      { type: "h", text: "How it works" },
      {
        type: "steps",
        items: [
          "Download it, unzip it, open it in Claude Code and type hi. It installs itself in about two minutes.",
          "Tell Claude what the video is about, then pick where it's going, how long, and a look.",
          "Claude writes it, animates it, scores it and checks it. The MP4 lands in a folder on your Desktop.",
        ],
      },
      {
        type: "p",
        text: "Want a change? Say \"faster\", \"change the headline\" or \"make a square version\" and it renders again.",
      },
      {
        type: "watch",
        text: "You need a Mac, Claude Code with a paid Claude plan, and Node.js 18 or newer. Windows and Linux should work but haven't been tested yet. Everything renders on your own computer and nothing is uploaded.",
      },
    ],
    install: [
      "Unzip the folder.",
      "Open a terminal in the folder and type claude",
      "Type hi. Claude installs it and checks it works, in about two minutes.",
    ],
    link: { label: "Download Motion Director", href: bundle("motion-director"), download: true },
  },
];
