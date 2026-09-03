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
 * ONLY MATERIAL HAS A PAGE. Masterclass and Design each used to open a route
 * of their own: a lede, an intro, an empty state and an email field. Three
 * doors, and two of them led to a room with nothing in it and a form. Tobia:
 * "you delete the page that is now present. You also delete 'See what's
 * coming' and 'See the templates'. You just make it so that the card wiggles,
 * and 'Now locked' comes up in a sweet, humble, very chill way."
 *
 * So `open` is the field that matters here now. An open family has a `cta` and
 * a `page` and its card is a link; a closed one has neither and its card is a
 * button that shakes its head at you. A closed family cannot accidentally grow
 * a dead route, because there is no page object for a route to render.
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
   * Can it be opened today? This is the only thing on the shelf that changes
   * what a card IS, so it is a field rather than something inferred from
   * `tier`: "paid" and "locked" are both closed doors, and a card should not
   * have to know the difference to know that it does not open.
   */
  open: boolean;
  /**
   * The word on the chip. Only a CLOSED family shows one: a card that says
   * "Free" next to a sentence that already says free is the page repeating
   * itself, and three chips in a row turn a shelf into a pricing table. A chip
   * earns its place when it changes what you can do.
   */
  tag: string;
  /** What it is. One sentence, on the card, and nothing longer there. */
  line: string;
  /**
   * Where this family has actually got to. Concrete and falsifiable. It is
   * the page's only proof, so it is never softened into a promise.
   */
  status: string;
  /**
   * The card's door. Verb first. OPEN FAMILIES ONLY: a closed card has no door
   * to describe, and "See what is coming" on a card that goes nowhere is the
   * shelf writing a cheque the site cannot cash.
   */
  cta?: string;
  /**
   * Which of the star's eight rays becomes this card's leading rule, and
   * which becomes the short rule above its way in. Ordered by ray length:
   * the longer rays get the taller rules.
   */
  spineRay: number;
  dividerRay: number;

  /** ------------------------------------------------------------------ *
   * PAGE ONLY, AND OPEN FAMILIES ONLY. None of this reaches the shelf card; it
   * is what the family's own route renders. Absent means there is no route:
   * generateStaticParams reads `open`, so a family with no page object cannot
   * be built into one.
   * ------------------------------------------------------------------ */
  page?: {
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
    open: true,
    tag: "Free",
    line: "Three skills you download and three guides you read.",
    status: "Free, and it stays free.",
    cta: "Open the material",
    spineRay: 2,
    dividerRay: 4,
    page: {
      title: "Material",
      lede: "The basics, done properly, and free.",
      intro: [
        "Guides and skills that take you from nothing to working with AI, and then to working with AI on code. No theory you cannot use the same afternoon.",
      ],
      /**
       * MATERIAL'S CONTENTS ARE NOT HERE. It outgrew a flat list and has a
       * room of its own now — two folders, each with its own page — in
       * components/superhuman/material/. `items` stays empty and `empty`
       * stays written because the type requires both and because a family
       * that ever loses its room should fall back to something honest rather
       * than to a blank page.
       */
      items: [],
      empty:
        "The material lives in folders rather than in one list. Open any of them from the room above.",
    },
  },
  {
    id: "masterclass",
    name: "Masterclass",
    tier: "locked",
    open: false,
    tag: "Locked",
    line: "Ten minutes, one advanced move. None of it is on YouTube.",
    status: "Not open yet.",
    spineRay: 7,
    dividerRay: 1,
  },
  {
    id: "design",
    name: "Design",
    tier: "paid",
    open: false,
    // Was "Templates", which is a category rather than a state, and the line
    // under it already says templates. The chip's whole job is to say whether
    // the door opens.
    tag: "Locked",
    line: "Website templates you can ship as they are.",
    status: "First set in build.",
    spineRay: 6,
    dividerRay: 5,
  },
];

/** Every family, by id. The route and the metadata both join through this. */
export const SHELF_BY_ID: Record<ShelfId, ShelfFamily> = Object.fromEntries(
  SHELF.map((family) => [family.id, family]),
) as Record<ShelfId, ShelfFamily>;

/** Every segment, in shelf order. */
export const SHELF_IDS: ShelfId[] = SHELF.map((family) => family.id);

/**
 * The segments that actually resolve to a page. This is what the route builds
 * and what the sitemap publishes, so a closed family cannot be linked to, be
 * indexed, or render an empty shell: it 404s at routing, and next.config sends
 * the two retired URLs back to the shelf.
 */
export const OPEN_SHELF_IDS: ShelfId[] = SHELF.filter((f) => f.open).map(
  (family) => family.id,
);

/** Narrowing for anything that receives a segment from outside. */
export function isShelfId(value: string): value is ShelfId {
  return (SHELF_IDS as string[]).includes(value);
}

/** A family's route. One place, so no page hand-writes the path. */
export const shelfHref = (id: ShelfId) => `/projects/construct/${id}`;

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
