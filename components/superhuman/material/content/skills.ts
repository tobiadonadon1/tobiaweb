import type { MaterialEntry } from "../material-types";

function skill(
  slug: string,
  title: string,
  summary: string,
  minutes: number,
  when: string,
  level: MaterialEntry["level"],
  why: string,
  how: string,
  matters: string,
  youtube?: boolean,
): MaterialEntry {
  const body: MaterialEntry["body"] = [
    { type: "p", text: why },
    { type: "p", text: how },
    { type: "p", text: matters },
  ];
  if (youtube) {
    body.push({ type: "p", text: "I'll show this on YouTube." });
  }
  return {
    slug,
    title,
    kind: "skill",
    summary,
    minutes,
    status: "ready",
    when,
    level,
    body,
    link: {
      label: "Download SKILL.md",
      href: `/construct/skills/${slug}/SKILL.md`,
      download: true,
    },
  };
}

/** Locked six. List is one line. Page is three short paragraphs. File is the download. */
export const SKILLS: MaterialEntry[] = [
  skill(
    "atelier",
    "Atelier",
    "Run the work like a small shop, not a feed.",
    5,
    "Before you start, or when too many things are already open.",
    "Anyone",
    "You start five things and finish none. This is for that.",
    "Load it before a build. Name one job. Do not start the next until this one can be shown.",
    "A shop with one piece on the table ships. A feed of ideas does not.",
  ),
  skill(
    "page-copy",
    "Page copy",
    "Writes the words before anyone draws a box.",
    6,
    "Before layout, or when a page looks finished and still does not convert.",
    "Anyone",
    "If you write into the layout, the boxes start deciding the words.",
    "Write the whole page in plain sentences first. Headline, why they stall, the shelf, the two doors, the email. Then give it to whoever draws.",
    "A page that looks done and still does not convert is usually a copy problem hiding in a pretty box.",
  ),
  skill(
    "motion-scale",
    "Motion scale",
    "How much a page is allowed to move.",
    5,
    "Before adding animation, or when a page already feels busy.",
    "Some code",
    "Motion is a size. Most pages pick a size that shouts.",
    "Pick small, medium, or large. One signature move. Reduced motion is the same page with nothing moving, still usable.",
    "If the page only makes sense while it is moving, it is not finished.",
    true,
  ),
  skill(
    "the-spec",
    "The spec",
    "Locks what we are building before anyone builds it.",
    6,
    "Before a build, or when two people think they agreed and they did not.",
    "Anyone",
    "Two people can nod and still be building different things.",
    "Write what it is, what it must do, what it must not, and how you will know it is done. Stop and agree. Then build.",
    "A spec that grows during the build is a conversation you skipped.",
  ),
  skill(
    "tester",
    "Tester",
    "Clicks the real thing. Reports what broke. Does not rebuild it.",
    5,
    "A page or flow is supposed to be done.",
    "Anyone",
    "Looking at your own work is not a test.",
    "Use it like a stranger. Phone, keyboard, motion off. Write what broke. Do not fix as you go.",
    "Fixing while you test hides the next failure.",
    true,
  ),
  skill(
    "ship-check",
    "Ship check",
    "The eight-point pass before anything goes live.",
    6,
    "The last hour before publishing.",
    "Some code",
    "The last hour is when you skip the boring checks.",
    "Phone, reduced motion, keyboard, contrast, images, metadata, links, copy. Report. Do not patch until the list is done.",
    "Live is a bad time to find a sideways scroll.",
  ),
];
