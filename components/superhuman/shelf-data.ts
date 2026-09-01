/**
 * THE SHELF, AND EVERYTHING BEHIND IT.
 *
 * One file describes three things at once: what the card on the shelf says,
 * what the family's own page says, and what is actually in it. A family is
 * added or changed HERE and the card, the route, the metadata, the sitemap
 * entry and the waitlist's allowed values all follow. Nothing about a family
 * is written twice.
 *
 * WHAT CHANGED, AND WHY. The shelf used to be Playbooks / Systems /
 * Templates: three ways of saying "writing about how I work", all free, all
 * unbuilt, all three cards ending in the same email field. It is a business
 * now, and the three things are genuinely different KINDS of thing, so they
 * are shaped differently:
 *
 *   Material     free, and the way in. Guides, short videos, and the tools
 *                and skills behind the work.
 *   Masterclass  paid, and locked until it exists. Short, expert, and
 *                deliberately not on YouTube.
 *   Design       paid. Finished templates you ship as they are.
 *
 * The card no longer takes an address, because the card is no longer the
 * whole thing: each family has a route now (see app/projects/superhuman/
 * [shelf]/page.tsx) and the page carries the contents, the honest empty
 * state and the field. The card's only job is to be a door that says what is
 * behind it.
 *
 * NOTHING here invents a title, a price, a testimonial or a number. `status`
 * is a fact or it is not written.
 */

/**
 * The three families. These strings are the URL segments, the `interest`
 * values the waitlist API accepts, and the keys everything else joins on, so
 * they are lowercase, singular and never renamed casually.
 */
export type ShelfId = "material" | "masterclass" | "design";

/**
 * What it costs and whether it can be opened yet.
 *
 *   free    open now, no money, no gate.
 *   locked  it will be paid, and it does not exist yet. The card says so and
 *           the page takes an address instead of pretending to sell.
 *   paid    it will be paid and it is being built.
 */
export type ShelfTier = "free" | "locked" | "paid";

/** What a single thing on a family's page IS, which decides how it draws. */
export type ShelfItemKind =
  | "guide"
  | "video"
  | "skill"
  | "tool"
  | "masterclass"
  | "template";

export type ShelfItem = {
  /** Stable, lowercase, hyphenated. Becomes an anchor, and later a route. */
  slug: string;
  title: string;
  kind: ShelfItemKind;
  /** One line. What you get, not what it is about. */
  summary: string;
  /** Running time, for anything that plays. */
  minutes?: number;
  /** Where it really lives. ABSENT MEANS NOT PUBLISHED — never a dead link. */
  href?: string;
  /**
   * True for something announced but not yet openable. An item can be listed
   * and locked; it cannot be listed and pretend to be ready.
   */
  locked?: boolean;
  /**
   * Set on a `tool` whose link pays a commission. The shell prints the
   * disclosure itself, so no page can carry a referral without saying so.
   */
  referral?: boolean;
};

export type ShelfFamily = {
  id: ShelfId;
  name: string;
  tier: ShelfTier;
  /**
   * The word on the chip. Only the LOCKED family shows one: a card that says
   * "Free" next to a sentence that already says free is the page repeating
   * itself, and three chips in a row turn a shelf into a pricing table. A
   * chip earns its place when it changes what you can do, and only one of
   * these does.
   */
  tag: string;
  /** What it is. One sentence, on the card, and nothing longer there. */
  line: string;
  /**
   * Where this family has actually got to. Concrete and falsifiable. It is
   * the page's only proof, so it is never softened into a promise.
   */
  status: string;
  /** The card's door. Verb first. */
  cta: string;
  /** Prefilled subject for the mail fallback on the family's own page. */
  subject: string;
  /**
   * Which of the star's eight rays becomes this card's leading rule, and
   * which becomes the short rule above its way in. Ordered by ray length:
   * the longer rays get the taller rules.
   */
  spineRay: number;
  dividerRay: number;

  /** ------------------------------------------------------------------ *
   * PAGE ONLY. None of this reaches the shelf card; it is what the family's
   * own route renders. Adding a family means filling this in, not writing a
   * page.
   * ------------------------------------------------------------------ */
  page: {
    /** Under the site's `%s · Tobia Donadon` template, and the OG title. */
    title: string;
    /** One sentence, for <meta description> and the top of the page. */
    lede: string;
    /** Two or three short paragraphs. What is in here and who it is for. */
    intro: string[];
    /** The contents. Empty until something real exists. */
    items: ShelfItem[];
    /** What the page says while `items` is empty. Honest, not coming-soon. */
    empty: string;
    /**
     * Where this family will actually transact, once it does. Left undefined
     * until the URL is real — a placeholder link is worse than no link.
     */
    external?: { label: string; href: string };
  };
};

export const SHELF: ShelfFamily[] = [
  {
    id: "material",
    name: "Material",
    tier: "free",
    tag: "Free",
    line: "Free. The room of skills, guides, and tools I actually use.",
    status: "Free, and it stays free.",
    cta: "Open the room",
    subject: "Construct: material",
    spineRay: 2,
    dividerRay: 4,
    page: {
      title: "Material",
      lede: "A room of six folders. Free, and it stays free.",
      intro: [
        "The material is already in the room. Open a folder. Nothing here is a fake catalogue.",
      ],
      /**
       * MATERIAL'S CONTENTS ARE NOT HERE. It outgrew a flat list and has a
       * room of its own now — six folders, each with its own page — in
       * components/superhuman/material/. `items` stays empty and `empty`
       * stays written because the type requires both and because a family
       * that ever loses its room should fall back to something honest rather
       * than to a blank page.
       */
      items: [],
      empty:
        "The material lives in six folders rather than in one list. Open any of them from the room above.",
    },
  },
  {
    id: "masterclass",
    name: "Masterclass",
    tier: "locked",
    tag: "Locked",
    line: "Paid. A path, not a pile. Locked until it is real.",
    status: "Not open yet.",
    cta: "See what is coming",
    subject: "Construct: masterclass",
    spineRay: 7,
    dividerRay: 1,
    page: {
      title: "Masterclass",
      lede: "Paid. Locked. Not a shop yet.",
      intro: [
        "When it opens, one advanced move at a time. Not on YouTube. Not for sale yet.",
      ],
      items: [],
      empty:
        "The first classes are being recorded. Leave an address and I write once, when there is something to watch.",
    },
  },
  {
    id: "design",
    name: "Templates",
    tier: "paid",
    tag: "Templates",
    line: "Paid. Later. Not for sale here yet.",
    status: "Not for sale yet.",
    cta: "Not for sale yet",
    subject: "Construct: templates",
    spineRay: 6,
    dividerRay: 5,
    page: {
      title: "Templates",
      lede: "Paid templates later. No shop here.",
      intro: [
        "These will be finished sites, not a catalogue of prices. Nothing to buy yet, so nothing is listed as if you could.",
      ],
      items: [],
      empty:
        "Not for sale yet. I will not put a shop here until there is something to buy.",
    },
  },
];

/** Every family, by id. The route and the metadata both join through this. */
export const SHELF_BY_ID: Record<ShelfId, ShelfFamily> = Object.fromEntries(
  SHELF.map((family) => [family.id, family]),
) as Record<ShelfId, ShelfFamily>;

/** The URL segments, in shelf order. Used by the route and the sitemap. */
export const SHELF_IDS: ShelfId[] = SHELF.map((family) => family.id);

/** Narrowing for anything that receives a segment from outside. */
export function isShelfId(value: string): value is ShelfId {
  return (SHELF_IDS as string[]).includes(value);
}

/** A family's route. One place, so no page hand-writes the path. */
export const shelfHref = (id: ShelfId) => `/projects/superhuman/${id}`;

export const EMAIL = "tobia@donadon.com";
export const mailto = (subject: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

/**
 * The two rays that do not belong to a card: the long rule that opens the
 * shelf and the rule that closes it. Ray 0 is the longest on the star, so it
 * gets the longest rule on the page.
 */
export const SHELF_RULE_RAY = 0;
export const CLOSE_RULE_RAY = 3;
