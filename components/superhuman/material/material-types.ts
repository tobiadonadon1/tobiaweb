/**
 * WHAT A PIECE OF MATERIAL IS.
 *
 * Material is the only free family, and it is the only one with enough in it
 * to need a shape of its own. The shelf's generic `ShelfItem` is a row in a
 * list: a title, a line, maybe a link. That is right for Masterclass and
 * Design, where the thing being listed lives somewhere else. It is wrong
 * here, because a guide, a skill or a tool note IS the page — there is
 * nowhere else for it to live.
 *
 * So Material has a room instead of a list (see material-room.tsx): folders
 * on the way in, and inside each folder an index on the left and the piece
 * itself on the right. This file describes the two things that room needs to
 * know about — a FOLDER and an ENTRY — and nothing else.
 *
 * THE RULE THAT SURVIVES FROM THE SHELF. Nothing here invents a number, a
 * result or a testimonial. `status` is a fact: `ready` means you can read it
 * now, `filming` means the notes exist and the video does not, `draft` means
 * it is being written and says so on its own face. A piece is never listed as
 * ready because listing it as ready would look better.
 */

/** What a single piece IS, which decides its label and how the index reads. */
export type MaterialKind = "note" | "guide" | "skill" | "video" | "tool" | "setup";

/**
 * How far along a piece actually is. The index draws each of these
 * differently, so the page can never quietly promote a draft.
 *
 *   ready    written, finished, open. The default and the only one that
 *            counts towards a folder's published count.
 *   draft    being written. Readable, marked, and honest about it.
 *   filming  the writing exists, the video does not. Only ever on `video`.
 */
export type MaterialStatus = "ready" | "draft" | "filming";

/**
 * Who it is for, in terms of what you already have to be able to do rather
 * than a beginner/intermediate/advanced ladder, which tells nobody anything.
 */
export type MaterialLevel = "Anyone" | "Some code" | "Comfortable in a terminal";

/**
 * The body of a piece, as blocks rather than a string of HTML.
 *
 * WHY NOT MARKDOWN. Because then the page needs a parser, a sanitiser and a
 * set of prose styles that fight the site's own type. Blocks are typed, they
 * render with the page's exact type roles, and a malformed one is a build
 * error rather than a paragraph in the wrong font.
 */
export type Block =
  /** Ordinary prose. */
  | { type: "p"; text: string }
  /** A heading inside the piece. Renders as the reading pane's h3. */
  | { type: "h"; text: string }
  /** Do these, in this order. Numbered. */
  | { type: "steps"; items: string[] }
  /** These things, in no particular order. Ruled, not bulleted. */
  | { type: "list"; items: string[] }
  /** Something to copy: a prompt, a config, a file. Monospaced, selectable. */
  | { type: "code"; label?: string; text: string }
  /** One line worth pulling out. Used sparingly or it stops meaning anything. */
  | { type: "pull"; text: string }
  /** The caveat, the trap, the thing that goes wrong. Marked, not shouted. */
  | { type: "watch"; text: string }
  /**
   * A PICTURE, OR THE HONEST PROMISE OF ONE.
   *
   * Some things cannot be written. Where a window, a panel or a menu is the
   * subject, the page needs to show it. Until the screenshot has been taken,
   * the slot draws itself and says what it will contain — the same rule the
   * unfilmed videos run on. `need` is written so that it works twice: it is
   * the brief for the shot, and it becomes the alt text once `src` lands.
   */
  | { type: "shot"; need: string; src?: string };

export type MaterialEntry = {
  /** Stable, lowercase, hyphenated. It is the deep link into the folder. */
  slug: string;
  title: string;
  kind: MaterialKind;
  /** One line for the index. What you get, not what it is about. */
  summary: string;
  /** Reading time, or running time for a video. Honest, not rounded up. */
  minutes: number;
  status: MaterialStatus;
  /**
   * WHEN TO REACH FOR IT. This is the one thing every piece owes the reader
   * before they commit to reading it, so it is a required field rather than
   * a paragraph somebody might forget to write.
   */
  when: string;
  level: MaterialLevel;
  /** The piece itself. */
  body: Block[];
  /**
   * Where the real thing lives, when the page is only the note about it — a
   * tool's own site, mostly. ABSENT MEANS THERE IS NO LINK, never a dead one.
   *
   * `download` marks a file the reader keeps rather than a page they visit:
   * it saves instead of navigating, and the pane labels it as a download so
   * nobody has to guess which of the two a link is.
   */
  link?: { label: string; href: string; download?: boolean };
  /**
   * Set on anything whose link pays a commission. The reading pane prints the
   * disclosure itself, so a piece cannot carry a paid link silently.
   */
  referral?: boolean;
};

/**
 * A folder: one card in the room, one page of its own.
 *
 * `accent` picks which of the site's existing colours leads the folder's
 * cover. It is deliberately a small closed set — the room is meant to read as
 * one shelf of paper, not six brands.
 */
export type MaterialAccent = "ink" | "sky" | "clay" | "mist";

export type MaterialFolder = {
  /** URL segment under /projects/superhuman/material. */
  id: string;
  name: string;
  /** One line, on the card. */
  line: string;
  /** One sentence at the top of the folder's own page. */
  lede: string;
  /** Two short paragraphs. What is in here and how to use it. */
  intro: string[];
  accent: MaterialAccent;
  entries: MaterialEntry[];
};
