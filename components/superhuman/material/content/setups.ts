import type { MaterialEntry } from "../material-types";

/**
 * SETUPS — finished folders you open in Claude Code.
 *
 * A skill is a file you drop into an agent that already works. A setup is the
 * whole working thing: a folder with its own instructions, which Claude reads
 * on the way in and then builds, installs and schedules for you. You download
 * it, open it, and type hi.
 *
 * These are the paid ones, and the only paid things in Material. Each entry
 * names a product in lib/shop/products.ts, which holds the price, and the
 * entry route renders the product's own page instead of an article. `body`
 * is empty because the page is the product page, not a piece of writing.
 */
export const SETUPS: MaterialEntry[] = [
  {
    slug: "the-98c-trade",
    title: "The 98¢ Trade",
    kind: "setup",
    summary:
      "A prediction-market bot that sets itself up. Open the folder in Claude Code and type hi.",
    // Setup time, which is what a buyer wants to know here, not reading time.
    minutes: 10,
    status: "ready",
    when: "You want a tested strategy running every day without writing any code.",
    level: "Anyone",
    body: [],
    product: "the-98c-trade",
  },
];
