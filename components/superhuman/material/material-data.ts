import type { MaterialEntry, MaterialFolder, MaterialKind } from "./material-types";
import { DO_THIS } from "./content/do-this";
import { GUIDES } from "./content/guides";
import { SKILLS } from "./content/skills";
import { VIDEOS } from "./content/videos";
import { TOOLS } from "./content/tools";
import { SETUPS } from "./content/setups";
import { CONFIGURATION } from "./content/configuration";

/**
 * THE ROOM, ASSEMBLED.
 *
 * FOUR CELLS, THREE OPEN. The room is a grid of four rather than a list, and
 * the folder that is not ready is drawn blurred instead of being left off.
 * That is a deliberate promise about the size of the thing: a page showing
 * only what is finished looks finished, and one cell you cannot read yet says
 * the shelf is still being filled.
 *
 * A BLUR ON ITS OWN IS A TEASE, so every locked folder carries `soon`: one
 * checkable fact about what is written and what is missing. The copy rules ban
 * "coming soon" with no window, and a count beats a window, because a count is
 * true today and a date is a promise made by somebody who does not know.
 *
 * Do this and Tools stay in the data so old URLs still resolve. They are not
 * in the grid and not in the sitemap.
 *
 * NO LEDE, NO INTRO, ON THE OPEN FOLDERS. Both carried a sentence and a
 * paragraph above their contents. Tobia on the skills one, which read "Written
 * once, loaded every time": "this cocky language I don't love". He is right
 * about more than the tone. A folder page that opens with a slogan and a
 * paragraph explaining what a folder is has put two things between you and the
 * three items you came for. The name and the list are enough, and the room
 * already gave each folder a line before you clicked. The fields stay on the
 * type as empty strings rather than being deleted, because the parked folders
 * still use them.
 *
 * EVERY DESCRIPTION IS ONE PARAGRAPH. Tobia, on the first version: "within
 * each section, you just write too much". The folder page already carries a
 * name, a lede and an index; a second and third paragraph of preamble is the
 * page clearing its throat. Anything worth saying about a folder belongs in
 * the pieces inside it.
 */

/**
 * WHEN EACH SKILL CAME OUT, by slug: the day it first went on the shelf (from git), or the day of a release that
 * made it new again (Reel Bot Factory 2.0). Skills lists newest first from this, and the newest wear "New".
 * A NEW SKILL GETS A LINE HERE: tests/shop.test.mjs fails for any entry on Skills without one.
 */
export const RELEASED: Record<string, string> = {
  "agent-supervisor": "2026-11-05",
  "reel-bot": "2026-11-04",
  "carousel-designer": "2026-11-02",
  "mascot-designer": "2026-11-01",
  "conversion-teardown": "2026-10-31",
  "meta-ads": "2026-10-30",
  "1k-bot": "2026-10-29",
  "video-editor-pro": "2026-10-26",
  "shorts-animator": "2026-10-25",
  "motion-designer": "2026-10-23",
  "video-editor": "2026-10-21",
  "duo-designer": "2026-10-19",
  "web-designer-pro": "2026-10-16",
  "viral-machine": "2026-10-15",
  "copycat-detective": "2026-10-12",
  "app-designer-pro": "2026-10-12",
  "grok-army": "2026-10-10",
  "app-launcher": "2026-10-09",
  "web-designer": "2026-10-05",
  "app-designer": "2026-10-03",
  "jev-crypto-analyst": "2026-09-28",
  "launchr": "2026-09-25",
  "the-98c-trade": "2026-09-23",
  "product-manager": "2026-09-03",
  "code-reviewer": "2026-09-03",
  "art-director": "2026-09-03",
};

/** How long a skill wears "New", in days from its release. The page is built at deploy, so it's as of the last one. */
export const NEW_FOR_DAYS = 7;

export function isNew(slug: string, now: Date = new Date()): boolean {
  const day = RELEASED[slug];
  if (!day) return false;
  return now.getTime() - Date.parse(`${day}T00:00:00Z`) < NEW_FOR_DAYS * 86_400_000;
}

/**
 * SKILLS: EVERY ONE, FREE AND PAID, NEWEST FIRST (Tobia, 2026-11-04). The free skills that set themselves up and the
 * paid ones used to sit in Setups, and Skills opened on the September three, so the newest work was a click away from
 * where people landed. Now there is one list and the only difference between two cards is free or paid.
 * Ties keep their order in the content files.
 */
const ALL_SKILLS = [...SKILLS, ...SETUPS]
  .map((entry, i) => ({ entry, i }))
  .sort((a, b) => (RELEASED[b.entry.slug] ?? "").localeCompare(RELEASED[a.entry.slug] ?? "") || a.i - b.i)
  .map(({ entry }) => entry);

const SKILLS_FOLDER: MaterialFolder = {
  id: "skills",
  name: "Skills",
  line: "Every skill, free and paid, the newest first.",
  lede: "",
  intro: [],
  accent: "clay",
  entries: ALL_SKILLS,
};

const GUIDES_FOLDER: MaterialFolder = {
  id: "guides",
  name: "Guides",
  line: "Set up the tools, pick the model, find the idea.",
  lede: "",
  intro: [],
  accent: "ink",
  entries: GUIDES,
};

/* ---------------------------------------------------------------- *
 * THE ONE THAT IS NOT OPEN YET, AND THE ONE THAT JUST OPENED.
 * ---------------------------------------------------------------- */

const VIDEOS_FOLDER: MaterialFolder = {
  id: "videos",
  name: "Videos",
  line: "Three to six minutes each. Screen recordings of the working rhythm.",
  lede: "Written first, filmed second.",
  locked: true,
  soon: "Six written. None filmed.",
  members: ["pro", "ultimate"],
  intro: [
    "None of these exist yet, and every row says so. What is here is the notes each will be cut from, which are worth reading on their own.",
  ],
  accent: "mist",
  entries: VIDEOS,
};

/**
 * SETUPS, CLOSED AGAIN (Tobia, 2026-11-04: "Setups should be blocked right now because I don't know what to put in
 * it"). Everything it held moved to Skills, and its old addresses redirect there (next.config.ts). It stays in the
 * grid, blurred, with no route of its own until it has something new in it.
 */
const SETUPS_FOLDER: MaterialFolder = {
  id: "setups",
  name: "Setups",
  line: "Finished folders you open in Claude Code. They set themselves up.",
  lede: "",
  locked: true,
  soon: "Being planned. Nothing in it yet.",
  intro: [],
  accent: "sky",
  entries: [],
};

/* ---------------------------------------------------------------- *
 * PARKED. Off the grid, off the sitemap, routes still resolve.
 * ---------------------------------------------------------------- */

const DO_THIS_FOLDER: MaterialFolder = {
  id: "do-this",
  name: "Do this",
  line: "Install the tools, and use them. Three guides, in order.",
  lede: "Three things you do at a keyboard.",
  intro: [
    "Install both agents, learn what to type, and learn to read the editor they are changing. About half an hour, and you are set up for good.",
  ],
  accent: "sky",
  entries: DO_THIS,
};

const CONFIGURATION_FOLDER: MaterialFolder = {
  id: "configuration",
  name: "Configuration",
  line: "The configuration layer. Rules that hold whether you remember them or not.",
  lede: "The dull folder that compounds.",
  intro: [
    "Instruction files, hooks, subagents and housekeeping. None of it is interesting and all of it pays for itself within a week.",
  ],
  accent: "sky",
  entries: CONFIGURATION,
};

const TOOLS_FOLDER: MaterialFolder = {
  id: "tools",
  name: "Tools",
  line: "What I build with, and when each one earns its place.",
  lede: "The stack, with the reasoning attached.",
  intro: [
    "Everything here is something this site is actually built on. Each note answers the same three questions, and the third one, what I would not use it for, is usually the useful part.",
  ],
  accent: "ink",
  entries: TOOLS,
};

/**
 * THE OPEN FOLDERS, in this order. These are the ones with routes, sitemap
 * entries and links pointing at them. A folder is in here only when you can
 * actually read it.
 */
export const MATERIAL_ROOM_FOLDERS: MaterialFolder[] = [
  SKILLS_FOLDER,
  GUIDES_FOLDER,
];

/** Drawn blurred in the grid. Not links, not indexed. Setups has no route at all while it's closed. */
export const MATERIAL_LOCKED_FOLDERS: MaterialFolder[] = [SETUPS_FOLDER, VIDEOS_FOLDER];

/**
 * THE GRID, reading order. Two you can open, then two you cannot. The
 * reading order is the point: the eye lands on something it can use before it
 * lands on something it has to wait for.
 */
export const MATERIAL_GRID: MaterialFolder[] = [
  ...MATERIAL_ROOM_FOLDERS,
  ...MATERIAL_LOCKED_FOLDERS,
];

/** Hidden from the room. Files stay; old URLs still resolve. */
export const MATERIAL_PARKED_FOLDERS: MaterialFolder[] = [
  VIDEOS_FOLDER,
  DO_THIS_FOLDER,
  TOOLS_FOLDER,
  CONFIGURATION_FOLDER,
];

/** Room plus parked. Routes and generateStaticParams use this. */
export const MATERIAL_FOLDERS: MaterialFolder[] = [
  ...MATERIAL_ROOM_FOLDERS,
  ...MATERIAL_PARKED_FOLDERS,
];

/** Every folder, by id. Routes and metadata both join through this. */
export const FOLDER_BY_ID: Record<string, MaterialFolder> = Object.fromEntries(
  MATERIAL_FOLDERS.map((folder) => [folder.id, folder]),
);

export const FOLDER_IDS = MATERIAL_FOLDERS.map((folder) => folder.id);

export const ROOM_FOLDER_IDS = MATERIAL_ROOM_FOLDERS.map((folder) => folder.id);

export function isFolderId(value: string): boolean {
  return FOLDER_IDS.includes(value);
}

/** A folder's route. One place, so nothing hand-writes the path. */
export const folderHref = (id: string) => `/projects/construct/material/${id}`;

/**
 * A PIECE'S OWN ROUTE.
 *
 * Pieces used to have no URL of their own: the reader swapped them in place
 * and rewrote the hash. That is right when a folder holds thirty things and
 * you are browsing. It is wrong now that a folder holds three and each one is
 * a finished document somebody might want to send to a person, because a hash
 * on a client component is not a page a search engine or a preview card can
 * see. Three pieces, three routes.
 */
export const entryHref = (folderId: string, slug: string) =>
  `/projects/construct/material/${folderId}/${slug}`;

/**
 * What each kind is called in the open, so a row never needs a legend.
 * Shared by the index, the reading pane and the room's cards.
 */
export const KIND_LABEL: Record<MaterialKind, string> = {
  note: "Note",
  guide: "Guide",
  skill: "Skill",
  video: "Video",
  tool: "Tool",
  setup: "Setup",
};

/**
 * WHAT A FOLDER CAN HONESTLY CLAIM.
 *
 * Skool puts a progress bar on every card, which is a promise about the
 * reader. This is the opposite: a promise about the material. `ready` is how
 * many pieces are finished, `total` is how many are listed, and the card
 * prints both. A folder of six drafts says six drafts.
 */
export function folderCount(folder: MaterialFolder): {
  ready: number;
  total: number;
  label: string;
} {
  const total = folder.entries.length;
  const ready = folder.entries.filter((e) => e.status === "ready").length;
  const filming = folder.entries.filter((e) => e.status === "filming").length;

  // The middle case is derived, not assumed. "None filmed" is only true of a
  // folder whose unfinished pieces are ALL waiting on a camera; a folder of
  // half-written drafts must not inherit the video folder's sentence.
  // A folder of setups counts setups: "1 piece" reads wrong on a product.
  const noun =
    folder.id === "skills" ? "skill" : folder.entries.every((e) => e.kind === "setup") ? "setup" : "piece";
  const label =
    ready === total
      ? `${total} ${noun}${total === 1 ? "" : "s"}`
      : filming === total
        ? `${total} written, none filmed`
        : `${ready} of ${total} finished`;

  return { ready, total, label };
}

/** The neighbours of an entry inside its folder, for the reading pane's feet. */
export function neighbours(
  folder: MaterialFolder,
  slug: string,
): { prev?: MaterialEntry; next?: MaterialEntry } {
  const i = folder.entries.findIndex((e) => e.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? folder.entries[i - 1] : undefined,
    next: i < folder.entries.length - 1 ? folder.entries[i + 1] : undefined,
  };
}
