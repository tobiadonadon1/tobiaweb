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
 * Six folders, and everything about each one — the card in the room, the URL,
 * the metadata, the sitemap entry, the counts — comes from this array. A
 * folder is added by adding an object here and a content file next to it;
 * nothing else needs touching.
 *
 * ORDER IS MEANING. "Do this" is first because somebody arriving has an "I
 * have not installed it" problem, not a philosophy problem. Then the two
 * folders that are the substance, guides and skills. Then the video shelf,
 * which is honest about being unfilmed. Then tools and setups, which are
 * reference rather than reading.
 *
 * EVERY DESCRIPTION IS ONE PARAGRAPH. Tobia, on the first version: "within
 * each section, you just write too much". The folder page already carries a
 * name, a lede and an index; a second and third paragraph of preamble is the
 * page clearing its throat. Anything worth saying about a folder belongs in
 * the pieces inside it.
 */
export const MATERIAL_FOLDERS: MaterialFolder[] = [
  {
    id: "do-this",
    name: "Do this",
    line: "Install the tools, and use them. Three guides, in order.",
    lede: "Three things you do at a keyboard.",
    intro: [
      "Install both agents, learn what to type, and learn to read the editor they are changing. About half an hour, and you are set up for good.",
    ],
    accent: "sky",
    entries: DO_THIS,
  },
  {
    id: "guides",
    name: "Guides",
    line: "Long walkthroughs of things I have shipped, including what went wrong.",
    lede: "Records, not lessons.",
    intro: [
      "Each one is a walkthrough of something I actually did. Read them against a real task; almost nothing here survives being read as theory.",
    ],
    accent: "ink",
    entries: GUIDES,
  },
  {
    id: "skills",
    name: "Skills",
    line: "Instruction packs that make an agent work my way by default.",
    lede: "Written once, loaded every time.",
    intro: [
      "Every entry carries the actual text, not a description of it. Copy it, change the parts that are about me rather than about the job, and use it.",
    ],
    accent: "clay",
    entries: SKILLS,
  },
  {
    id: "videos",
    name: "Short videos",
    line: "Three to six minutes each. Screen recordings of the working rhythm.",
    lede: "Written first, filmed second.",
    intro: [
      "None of these exist yet, and every row says so. What is here is the notes each will be cut from, which are worth reading on their own.",
    ],
    accent: "mist",
    entries: VIDEOS,
  },
  {
    id: "tools",
    name: "Tools",
    line: "What I build with, and when each one earns its place.",
    lede: "The stack, with the reasoning attached.",
    intro: [
      "Everything here is something this site is actually built on. Each note answers the same three questions, and the third one — what I would not use it for — is usually the useful part.",
    ],
    accent: "ink",
    entries: TOOLS,
  },
  {
    id: "setups",
    name: "Setups",
    line: "The configuration layer. Rules that hold whether you remember them or not.",
    lede: "The dull folder that compounds.",
    intro: [
      "Instruction files, hooks, subagents and housekeeping. None of it is interesting and all of it pays for itself within a week.",
    ],
    accent: "sky",
    entries: SETUPS,
  },
];

/** Every folder, by id. Routes and metadata both join through this. */
export const FOLDER_BY_ID: Record<string, MaterialFolder> = Object.fromEntries(
  MATERIAL_FOLDERS.map((folder) => [folder.id, folder]),
);

export const FOLDER_IDS = MATERIAL_FOLDERS.map((folder) => folder.id);

export function isFolderId(value: string): boolean {
  return FOLDER_IDS.includes(value);
}

/** A folder's route. One place, so nothing hand-writes the path. */
export const folderHref = (id: string) => `/projects/superhuman/material/${id}`;

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

/** Total pieces across the room, for the head of the material page. */
export const MATERIAL_TOTAL = MATERIAL_FOLDERS.reduce(
  (n, folder) => n + folder.entries.length,
  0,
);

export const MATERIAL_READY = MATERIAL_FOLDERS.reduce(
  (n, folder) => n + folder.entries.filter((e) => e.status === "ready").length,
  0,
);

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
