import type { MaterialEntry, MaterialFolder, MaterialKind } from "./material-types";
import { DO_THIS } from "./content/do-this";
import { GUIDES } from "./content/guides";
import { SKILLS } from "./content/skills";
import { VIDEOS } from "./content/videos";
import { TOOLS } from "./content/tools";
import { SETUPS } from "./content/setups";

/**
 * THE ROOM, ASSEMBLED.
 *
 * FOUR CELLS, TWO OPEN. The room is a grid of four now rather than a list of
 * two, and the two that are not ready are drawn blurred instead of being left
 * off. That is a deliberate promise about the size of the thing: a page
 * showing two folders looks finished at two folders, and a page showing two
 * plus two you cannot read yet says the shelf is still being filled.
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

const SKILLS_FOLDER: MaterialFolder = {
  id: "skills",
  name: "Skills",
  line: "Three roles you put into the agent for the length of a job.",
  lede: "",
  intro: [],
  accent: "clay",
  entries: SKILLS,
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
 * THE TWO THAT ARE NOT OPEN.
 * ---------------------------------------------------------------- */

const VIDEOS_FOLDER: MaterialFolder = {
  id: "videos",
  name: "Videos",
  line: "Three to six minutes each. Screen recordings of the working rhythm.",
  lede: "Written first, filmed second.",
  locked: true,
  soon: "Six written. None filmed.",
  intro: [
    "None of these exist yet, and every row says so. What is here is the notes each will be cut from, which are worth reading on their own.",
  ],
  accent: "mist",
  entries: VIDEOS,
};

const SETUPS_FOLDER: MaterialFolder = {
  id: "setups",
  name: "Setups",
  line: "The configuration layer. Rules that hold whether you remember them or not.",
  lede: "The dull folder that compounds.",
  locked: true,
  soon: "Five written. Not open.",
  intro: [
    "Instruction files, hooks, subagents and housekeeping. None of it is interesting and all of it pays for itself within a week.",
  ],
  accent: "sky",
  entries: SETUPS,
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

/** Drawn blurred in the grid. Not links, not indexed. */
export const MATERIAL_LOCKED_FOLDERS: MaterialFolder[] = [
  VIDEOS_FOLDER,
  SETUPS_FOLDER,
];

/**
 * THE GRID, reading order. Two you can open, then two you cannot. The reading
 * order is the point: the eye lands on something it can use before it lands on
 * something it has to wait for.
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
  SETUPS_FOLDER,
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
  const label =
    ready === total
      ? `${total} ${total === 1 ? "piece" : "pieces"}`
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
