/**
 * WHAT IS FOR SALE, WRITTEN ONCE.
 *
 * The page prints the price, Stripe charges the price, and the email names the
 * thing that was bought. All three read this object, so the page can never
 * say $5 while the checkout asks for something else.
 *
 * NOTHING SECRET LIVES HERE. This file is imported by the page as well as by
 * the API routes, so it only describes the product. Keys, the decryption of
 * the file and everything that talks to Stripe live in the server-only
 * modules beside it.
 *
 * `href` is written out rather than built with `entryHref` from the material
 * data, because that module pulls in every piece of written content on the
 * site and the payment routes should not have to load a library of guides to
 * find a URL. `products.test.mjs` checks the two agree.
 */

export type ProductId = "the-98c-trade";

/**
 * The shop's address: the sender of every delivery email and the contact a
 * buyer is given when something goes wrong. Tobia's own Gmail, because it is
 * the inbox he actually reads (the site-wide EMAIL in shelf-data.ts is a
 * different mailbox he cannot get into today).
 */
export const SHOP_EMAIL = "tobia10donadon@gmail.com";

export type Product = {
  id: ProductId;
  /** As it is printed. The cent sign is part of the name. */
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
   * never is.
   */
  file: { sealed: string; filename: string };
  /**
   * The product in Stripe, so every sale lands on ONE product in the
   * dashboard rather than on a new inline product per checkout. The price is
   * still sent from here with each checkout, so the page and the charge
   * cannot disagree. If the product is missing (a fresh test-mode account),
   * the checkout route creates it on first use.
   */
  stripeProductId: string;
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
};

export const PRODUCTS: Record<ProductId, Product> = {
  "the-98c-trade": THE_98C_TRADE,
};

export function productById(id: unknown): Product | undefined {
  return typeof id === "string" && Object.hasOwn(PRODUCTS, id)
    ? PRODUCTS[id as ProductId]
    : undefined;
}

export const thanksHref = (product: Product) => `${product.href}/thanks`;

/** Where the buyer's copy of the file is fetched from. */
export const downloadHref = (sessionId: string) =>
  `/api/download?session_id=${encodeURIComponent(sessionId)}`;
