/**
 * THE TRAINING SHEETS: one-page cheat sheets for members, printed from HTML
 * (sources in ~/Desktop/construct-training) and sealed into
 * private/training/<id>.pdf.enc with SHOP_FILE_KEY, like the shop's files,
 * because the repository is public. The small picture of each page is
 * public/training/<id>.webp.
 *
 * They join the dashboard's Training shelf through /api/membership/perks,
 * beside the rows in the database, and are handed out by
 * /api/membership/file, both after the same plan check (`trainingReach`):
 *
 *   pro       open to Pro and Ultimate ("selected training")
 *   ultimate  Ultimate only; Pro sees it in the list, locked
 *
 * To add one: print it, seal it (npm run seal -- <pdf> private/training/<id>.pdf.enc),
 * add its picture, and add it here. Newest last.
 */
export type Sheet = {
  id: string;
  /** Which row it sits in: how to get the most from one of my skills, or Claude Code itself. */
  group: "skills" | "claude";
  title: string;
  /** One line: what it lets you do. */
  summary: string;
  tier: "pro" | "ultimate";
  added: string;
};

export const SHEETS: Sheet[] = [
  {
    id: "skill-app-designer",
    group: "skills",
    title: "App Designer",
    summary: "What to have ready, what to say, and how to steer the three directions and the critic.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "skill-web-designer",
    group: "skills",
    title: "Web Designer",
    summary: "From brief to built site: the questions, the directions, and feedback that works.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "skill-video-editor",
    group: "skills",
    title: "Video Editor",
    summary: "Footage or from scratch: what to say, how to steer the storyboard, what wastes a run.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "skill-app-launcher",
    group: "skills",
    title: "App Launcher",
    summary: "From review audit to launch kit, then ads, onboarding and paywall.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "skill-grok-army",
    group: "skills",
    title: "Grok Army",
    summary: "Four questions, one file, and how to tune your army every Friday.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "claude-code-commands",
    group: "claude",
    title: "The 14 Claude Code commands you'll actually use",
    summary: "Set up, build, check, fix: every command in the order you'll need it, and six keys worth knowing.",
    tier: "pro",
    added: "2026-10-21",
  },
  {
    id: "brief-claude",
    group: "claude",
    title: "How to brief Claude",
    summary: "The five parts of a brief that works, a weak and a strong one side by side, seven rules and three templates to fill in.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "context",
    group: "claude",
    title: "Context is the whole game",
    summary: "What Claude actually sees, what goes in CLAUDE.md, how to point at things, and how to keep a long chat clean.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "design-references",
    group: "claude",
    title: "Design that doesn't look AI-made",
    summary: "Brief with references, name your taste in words, ban the defaults, and iterate from screenshots.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "skills",
    group: "claude",
    title: "Skills in 10 minutes",
    summary: "What a skill is, where it lives, how to install, run and write one, and the first thing to say to each of my skills.",
    tier: "pro",
    added: "2026-10-23",
  },
  {
    id: "fix-loop",
    group: "claude",
    title: "Fix it without the loop",
    summary: "Debug with Claude: the five-step loop, the two-strikes rule, the evidence to paste and three prompts that break a loop.",
    tier: "ultimate",
    added: "2026-10-23",
  },
  {
    id: "ship-it",
    group: "claude",
    title: "From localhost to live",
    summary: "The pre-flight checklist: checks, secrets, deploy, domain, Stripe from test to live, and the first hour after launch.",
    tier: "ultimate",
    added: "2026-10-23",
  },
];

export const sheetById = (id: string | null) => SHEETS.find((s) => s.id === id) ?? null;
