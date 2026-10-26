import type { MaterialEntry } from "../material-types";

/**
 * SETUPS — finished folders you open in Claude Code.
 *
 * A skill is a file you drop into an agent that already works. A setup is the
 * whole working thing: a folder with its own instructions, which Claude reads
 * on the way in and then builds, installs and schedules for you. You download
 * it, open it, and type hi.
 *
 * These are the paid ones, and the only paid things in Material. Each entry
 * names a product in lib/shop/products.ts, which holds the price, and the
 * entry route renders the product's own page instead of an article. `body`
 * is empty because the page is the product page, not a piece of writing.
 */
export const SETUPS: MaterialEntry[] = [
  {
    slug: "web-designer-pro",
    title: "Web Designer Pro",
    kind: "setup",
    summary:
      "Websites and components that look like a studio made them: it asks first, starts from real kits, and works with or without photos.",
    // Minutes to install it, answer its questions and see three directions.
    minutes: 15,
    status: "ready",
    when: "You want a site, a landing page or a component that doesn't look like every other AI page.",
    level: "Anyone",
    body: [],
    product: "web-designer-pro",
  },
  {
    slug: "app-designer-pro",
    title: "App Designer Pro",
    kind: "setup",
    summary:
      "Your app designed for iPhone and Android, plus everything that sells it: screens that move, human copy, paywalls and store assets.",
    // Minutes to install it and see the first three directions.
    minutes: 15,
    status: "ready",
    when: "You're about to launch an app and want it to look like a studio designed it, on both platforms.",
    level: "Anyone",
    body: [],
    product: "app-designer-pro",
  },
  {
    slug: "grok-army",
    title: "Grok Army",
    kind: "setup",
    summary:
      "Four questions in Claude, one file to your Desktop, and Grok Bot builds a team that works on your goal 24/7.",
    // Minutes in Claude to the file on the Desktop; Grok Bot's first result
    // comes within the first half hour after that.
    minutes: 10,
    status: "ready",
    when: "You use Grok Bot and want a team you design, working on your goal every day and keeping score.",
    level: "Anyone",
    body: [],
    product: "grok-army",
  },
  {
    slug: "reel-bot",
    title: "Reel Bot Factory",
    kind: "setup",
    summary: "One file to a Grok Bot, and it makes your animated reels with Claude: the brief, the voice, the video, checked.",
    // Minutes from the download to the bot working on its first reel.
    minutes: 5,
    status: "ready",
    when: "You use Grok Bot and want animated vertical videos for Reels, TikTok or Shorts, without drawing, filming or editing.",
    level: "Anyone",
    body: [],
    product: "reel-bot",
  },
  {
    slug: "the-98c-trade",
    title: "The 98¢ Trade",
    kind: "setup",
    summary:
      "A prediction-market bot that sets itself up. Open the folder in Claude Code and type hi.",
    // Setup time, which is what a buyer wants to know here, not reading time.
    minutes: 10,
    status: "ready",
    when: "You want a tested strategy running every day without writing any code.",
    level: "Anyone",
    body: [],
    product: "the-98c-trade",
  },
  {
    slug: "launchr",
    title: "Launchr",
    kind: "setup",
    summary:
      "Your logo, product photos or screenshots in, a finished launch video with its own soundtrack out, in about ten minutes.",
    // Minutes to a finished video.
    minutes: 10,
    status: "ready",
    when: "You're launching a product, a feature or an update and it needs a video today, not next week.",
    level: "Anyone",
    body: [],
    product: "launchr",
  },
  {
    slug: "jev-crypto-analyst",
    title: "Jev Crypto Analyst",
    kind: "setup",
    summary:
      "Type a coin and Jev reads the chart: the likely price range, the levels that matter, and why.",
    // Seconds per read, rounded up to a minute; setup is about two.
    minutes: 2,
    status: "ready",
    when: "You want a second opinion on a crypto chart in seconds, with the odds said out loud.",
    level: "Anyone",
    body: [],
    product: "jev-crypto-analyst",
  },
];
