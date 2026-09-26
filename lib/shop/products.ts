/**
 * WHAT IS FOR SALE, WRITTEN ONCE.
 *
 * The page prints the price, Stripe charges the price, and the email names the
 * thing that was bought. All three read this object, so the page can never
 * say one price while the checkout asks for another.
 *
 * Each product also carries its own words for the places that are not its
 * page: the share card, the delivery email and the thank-you page. Those used
 * to be written for The 98¢ Trade inside the components, which was fine for
 * one product and wrong the moment there were two.
 *
 * NOTHING SECRET LIVES HERE. This file is imported by the page as well as by
 * the API routes, so it only describes the product. Keys, the decryption of
 * the file and everything that talks to Stripe live in the server-only
 * modules beside it.
 *
 * `href` is written out rather than built with `entryHref` from the material
 * data, because that module pulls in every piece of written content on the
 * site and the payment routes should not have to load a library of guides to
 * find a URL. The tests check the two agree.
 */

export type ProductId = "the-98c-trade" | "launchr";

/**
 * The shop's address: the sender of every delivery email and the contact a
 * buyer is given when something goes wrong. Tobia's own Gmail, because it is
 * the inbox he actually reads (the site-wide EMAIL in shelf-data.ts is a
 * different mailbox he cannot get into today).
 */
export const SHOP_EMAIL = "tobia10donadon@gmail.com";

export type Product = {
  id: ProductId;
  /** As it is printed. The cent sign is part of the 98¢ Trade's name. */
  name: string;
  /** One line, for Stripe's checkout page and the receipt. */
  description: string;
  /** Minor units. 500 is five euros. */
  priceCents: number;
  currency: "eur" | "usd";
  /** The price as the page prints it, derived so it cannot drift. */
  priceLabel: string;
  /** The product page. The thank-you page is this plus `/thanks`. */
  href: string;
  /**
   * THE FILE. `sealed` is the encrypted copy committed to the repository's
   * private/ folder (see scripts/seal-product.mjs), `filename` is what the
   * buyer's browser saves it as. The repository is public, so the zip itself
   * never is. Keep it under about 4 MB: Vercel caps a function's response at
   * 4.5 MB, and the download is served by one.
   *
   * Gmail refuses a zip that holds a script file (.js, .mjs and friends),
   * whatever the script does. `attach: false` sends the email with the
   * download link only, for a product that ships code, so Gmail is never
   * handed a message it will refuse. (If it refuses one anyway, deliver.ts
   * sends the link instead.)
   */
  file: { sealed: string; filename: string; attach?: boolean };
  /**
   * The product in Stripe, so every sale lands on ONE product in the
   * dashboard rather than on a new inline product per checkout. The price is
   * still sent from here with each checkout, so the page and the charge
   * cannot disagree. If the product is missing (a fresh test-mode account),
   * the checkout route creates it on first use.
   */
  stripeProductId: string;
  /** Meta and share descriptions, and the share card's lines. */
  share: { description: string; kicker: string; line: string; proof: string };
  /** The delivery email, after the three setup steps. */
  email: { after: string[]; footnote?: string };
  /** The thank-you page: what they need, and what happens next. */
  thanks: { needs: string; next: [string, string][]; footnote?: string };
  /** The three steps, in the email and on the thank-you page. */
  steps: [string, string, string];
  /** What is in the zip, for pages that list it: [name, what it is]. */
  contents?: [string, string][];
  /**
   * GIVEN AWAY FOR AN EMAIL ADDRESS, not sold. The checkout refuses it, the
   * page asks where to send it instead of taking a payment, and the email
   * carries a signed download link (lib/shop/free.ts) rather than a receipt.
   * `priceLabel` stays as the record of what it used to cost; pages say Free.
   */
  free?: boolean;
};

const SYMBOL = { eur: "€", usd: "$" } as const;
const money = (n: number, currency: keyof typeof SYMBOL) =>
  `${SYMBOL[currency]}${n % 100 === 0 ? n / 100 : (n / 100).toFixed(2)}`;

export const THE_98C_TRADE: Product = {
  id: "the-98c-trade",
  name: "The 98¢ Trade",
  description:
    "A prediction-market bot for Claude Code that sets itself up. Instant download.",
  priceCents: 500,
  currency: "eur",
  priceLabel: money(500, "eur"),
  href: "/projects/construct/material/setups/the-98c-trade",
  file: {
    sealed: "the-98c-trade.zip.enc",
    filename: "the-98c-trade.zip",
  },
  stripeProductId: "prod_VJUGojh9orpbsI",
  share: {
    description:
      "A prediction-market bot that sets itself up in Claude Code. Tested on 8,318 past Polymarket trades: 99% paid out. €5, instant download.",
    kicker: "Setup · for Claude Code",
    line: "A prediction-market bot that sets itself up in Claude Code.",
    proof: "8,318 trades tested · 99% paid out",
  },
  steps: [
    "Unzip the folder and put it somewhere you'll keep, like Documents.",
    "Open a terminal in the folder and type claude",
    "Type hi",
  ],
  email: {
    after: [
      "Claude takes it from there. It installs what the bot needs, helps you create your one TypeSafe key, runs the first scan and schedules it for every day. About ten minutes.",
      "It starts on paper money, on real prices. It only suggests real trades after it passes its go-live checklist, and you place every one yourself.",
    ],
    footnote: "Not financial advice.",
  },
  thanks: {
    needs:
      "You'll need Claude Code, and you'll create one TypeSafe key when Claude asks for it. Keep the key in the .env file, not in the chat.",
    next: [
      ["Tomorrow", "The first paper orders either fill, because real trades reached their price, or expire."],
      ["In about a week", "The first positions settle. About 99 in 100 pay out; about 1 in 100 loses its stake."],
      ["In 4 to 8 weeks", "The go-live checklist has enough data to judge. Type /status any time to see how close it is."],
    ],
    footnote: "Not financial advice.",
  },
};

export const LAUNCHR: Product = {
  id: "launchr",
  name: "Launchr",
  description:
    "A Claude Code skill that turns your logo, product photos or app screenshots into a finished 15 to 30 second launch video with its own soundtrack. Instant download.",
  priceCents: 1200,
  currency: "eur",
  priceLabel: money(1200, "eur"),
  href: "/projects/construct/material/setups/launchr",
  file: {
    sealed: "launchr.zip.enc",
    filename: "launchr.zip",
    // The render engine is .mjs files, which Gmail refuses inside a zip.
    attach: false,
  },
  // Free since 2026-09-25: Tobia swapped the paywall for an email field.
  free: true,
  stripeProductId: "prod_VKL1qwlByvTm4z",
  share: {
    description:
      "Launchr puts a motion-graphics studio inside Claude Code. Drop in your logo, product photos or screenshots and get a finished launch video with its own soundtrack in about ten minutes. Free, unlimited videos.",
    kicker: "Skill · for Claude Code",
    line: "Your launch video, with its own soundtrack, in ten minutes.",
    proof: "Free · unlimited videos",
  },
  contents: [
    ["launchr/SKILL.md", "the workflow Claude follows, from your assets to the MP4"],
    ["references/", "the launch playbook: structure, the four looks, sound"],
    ["engine/", "the cut-out, device, animation, music and render engine"],
    ["examples/", "four finished launch films as code, one per look"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs Launchr in about two minutes.",
  ],
  email: {
    after: [
      "From then on, type /launchr in any Claude Code session, or just ask for a launch video. Tell it what you're launching and drag in your logo, product photos or screenshots.",
      "About ten minutes later the MP4 is in the Launchr Videos folder on your Desktop. Every video and its soundtrack is yours to use, commercially too, and you can make as many as you want.",
    ],
  },
  thanks: {
    needs:
      "You'll need a Mac, Claude Code with a paid Claude plan, and Node.js 18 or newer. If Node is missing, Claude will tell you.",
    next: [
      ["Right after install", "Claude offers to make your first launch video. Have your logo and a product photo or a screenshot ready."],
      ["Every video", "A few quick questions, your files dragged in, then about ten minutes to a finished MP4."],
      ["Want changes?", "Say \"shorter headline\", \"try dark premium\" or \"now a vertical version\" and it renders again."],
    ],
  },
};

export const PRODUCTS: Record<ProductId, Product> = {
  "the-98c-trade": THE_98C_TRADE,
  launchr: LAUNCHR,
};

export function productById(id: unknown): Product | undefined {
  return typeof id === "string" && Object.hasOwn(PRODUCTS, id)
    ? PRODUCTS[id as ProductId]
    : undefined;
}

export const thanksHref = (product: Product) => `${product.href}/thanks`;

/** What a page prints where a price would go. */
export const priceText = (product: Product) => (product.free ? "Free" : product.priceLabel);

/** Where the buyer's copy of the file is fetched from. */
export const downloadHref = (sessionId: string) =>
  `/api/download?session_id=${encodeURIComponent(sessionId)}`;
