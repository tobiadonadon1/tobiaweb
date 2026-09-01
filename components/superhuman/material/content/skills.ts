import type { MaterialEntry } from "../material-types";

function skill(
  slug: string,
  title: string,
  summary: string,
  minutes: number,
  when: string,
  level: MaterialEntry["level"],
): MaterialEntry {
  return {
    slug,
    title,
    kind: "skill",
    summary,
    minutes,
    status: "ready",
    when,
    level,
    body: [],
    link: {
      label: "Download SKILL.md",
      href: `/construct/skills/${slug}/SKILL.md`,
      download: true,
    },
  };
}

/** Locked six. Cards are one line. The file is SKILL.md. */
export const SKILLS: MaterialEntry[] = [
  skill(
    "atelier",
    "Atelier",
    "Run the work like a small shop, not a feed.",
    5,
    "Before you start, or when too many things are already open.",
    "Anyone",
  ),
  skill(
    "page-copy",
    "Page copy",
    "Writes the words before anyone draws a box.",
    6,
    "Before layout, or when a page looks finished and still does not convert.",
    "Anyone",
  ),
  skill(
    "motion-scale",
    "Motion scale",
    "How much a page is allowed to move.",
    5,
    "Before adding animation, or when a page already feels busy.",
    "Some code",
  ),
  skill(
    "the-spec",
    "The spec",
    "Locks what we are building before anyone builds it.",
    6,
    "Before a build, or when two people think they agreed and they did not.",
    "Anyone",
  ),
  skill(
    "tester",
    "Tester",
    "Clicks the real thing. Reports what broke. Does not rebuild it.",
    5,
    "A page or flow is supposed to be done.",
    "Anyone",
  ),
  skill(
    "ship-check",
    "Ship check",
    "The eight-point pass before anything goes live.",
    6,
    "The last hour before publishing.",
    "Some code",
  ),
];
