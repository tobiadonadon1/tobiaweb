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

export type ProductId = "the-98c-trade" | "launchr" | "jev-crypto-analyst" | "jev-review-miner" | "whitehat" | "app-designer" | "web-designer";

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
  /**
   * The delivery email, after the three setup steps. `preheader` is the
   * inbox preview line and `stepsIntro` the line above the steps; both default
   * to the Claude Code folder wording ("Unzip it, open it in Claude Code").
   */
  email: { after: string[]; footnote?: string; preheader?: string; stepsIntro?: string };
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

export const JEV_CRYPTO_ANALYST: Product = {
  id: "jev-crypto-analyst",
  name: "Jev Crypto Analyst",
  description:
    "A small app for Claude Code that reads any crypto chart in seconds with Jev, TypeSafe's AI: the likely price range, the levels that matter, and why.",
  // Never sold, so never priced; kept at zero so nothing can charge for it.
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/setups/jev-crypto-analyst",
  file: {
    sealed: "jev-crypto-analyst.zip.enc",
    filename: "jev-crypto-analyst.zip",
    // The app is .mjs and node_modules, which Gmail refuses inside a zip.
    attach: false,
  },
  free: true,
  // Free from the start: there is no Stripe product, and checkout refuses it.
  stripeProductId: "none",
  share: {
    description:
      "Type a coin or drop a chart. Jev, TypeSafe's AI, reads real exchange data and tells you where the price is likely to be, which levels matter, and why. Tested on 540 charts it had never seen. Free.",
    kicker: "App · for Claude Code",
    line: "Any crypto chart, read in seconds: the likely range, the key levels, and why.",
    proof: "Free · tested on 540 unseen charts",
  },
  contents: [
    ["app/", "the chart reader: live exchange data, the measurements, and Jev's read"],
    ["app/backtest/", "the honest test on 540 past charts, and the calibration it uses"],
    ["CLAUDE.md", "what Claude follows to install it and open it for you"],
    ["README.md", "how it works, how accurate it is, and what it costs to run"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs it, asks for your TypeSafe key and opens the app.",
  ],
  email: {
    after: [
      "Then type a coin (BTC, ETH, SOL, even a memecoin), pick a timeframe and press Read the chart. You get the likely price range for the window, the support and resistance that matter, whether the market is trending or ranging, and why, in plain words.",
      "It runs on your computer. Each read is one Jev request on your own TypeSafe key.",
    ],
    footnote: "Probabilities, not certainties. Not financial advice.",
  },
  thanks: {
    needs:
      "You'll need Claude Code, Node.js 18.17 or newer, and a TypeSafe API key for Jev (typesafe.ai). Claude asks for the key during setup.",
    next: [
      ["Right after setup", "The app opens in your browser. Type a coin and read your first chart."],
      ["Every read", "About ten seconds from ticker to range, levels and reasons."],
      ["Want proof?", "The accuracy panel shows the measured track record for each timeframe."],
    ],
    footnote: "Not financial advice.",
  },
};

export const JEV_REVIEW_MINER: Product = {
  id: "jev-review-miner",
  name: "Jev Review Miner",
  description:
    "The build guide for a system that reads thousands of customer reviews and writes a product and marketing brief, every claim backed by a count and a real quote.",
  // Never sold, so never priced; kept at zero so nothing can charge for it.
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/guides/jev-review-miner",
  file: {
    sealed: "jev-review-miner.pdf.enc",
    filename: "jev-review-miner-build-guide.pdf",
    // A PDF, which Gmail is happy to carry: it arrives attached.
    attach: true,
  },
  free: true,
  stripeProductId: "none",
  share: {
    description:
      "Jev Review Miner reads thousands of reviews from the App Store, Amazon and G2, finds why people buy, why they leave and what they wish existed, and writes the brief. Every claim backed by real numbers and real quotes. The full build guide, free.",
    kicker: "Guide · for builders",
    line: "What your customers want, in their own words, without reading a single review.",
    proof: "Free · the full 10-page build guide",
  },
  contents: [
    ["The pipeline", "five stages from raw reviews to a cited brief"],
    ["The schema", "the Postgres tables for reviews, extractions and themes"],
    ["The prompts", "the extraction prompt and the brief prompt, ready to paste"],
    ["Stack, cost and rollout", "what to build it on, what it costs, and the first month"],
  ],
  steps: [
    "Open the PDF.",
    "Read the five stages on page 2. They are the whole system on one page.",
    "Start with a CSV of reviews you already have. The MVP needs nothing else.",
  ],
  email: {
    preheader: "The build guide is attached. Start with the five stages on page 2.",
    stepsIntro: "Where to start:",
    after: [
      "The guide has the whole thing: the pipeline, the database schema, the two prompts, the scoring, the stack and what it costs to run.",
      "The one idea to hold on to: never ask a model to read ten thousand reviews at once. Extract per review, count with code, and let the strong model see only the evidence.",
    ],
  },
  thanks: {
    needs: "Nothing to install. It is a PDF: read it, then build it with Claude Code or any stack you like.",
    next: [
      ["First", "Read the five stages on page 2. They are the whole system on one page."],
      ["Week one", "Build the MVP from a CSV export: normalise, extract, count, write the brief."],
      ["Then", "Point it at your competitors' 1 to 3 star reviews. That is where the openings are."],
    ],
  },
};

export const WHITEHAT: Product = {
  id: "whitehat",
  name: "Whitehat",
  description:
    "The build guide for a paid, authorized web-security practice, powered by Gemini 4 Argon: find weak points with permission, report them, fix them, get paid.",
  // Never sold, so never priced; kept at zero so nothing can charge for it.
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/guides/whitehat",
  file: {
    sealed: "whitehat-playbook.pdf.enc",
    filename: "whitehat-playbook.pdf",
    // A PDF, which Gmail is happy to carry: it arrives attached.
    attach: true,
  },
  free: true,
  stripeProductId: "none",
  share: {
    description:
      "Whitehat is the build guide for a paid, authorized web-security practice with Gemini 4 Argon, the model Google built for defenders. Offer a security review, test only with signed permission, report what you find and get paid to fix it. The full 21-page playbook, free.",
    kicker: "Guide · for builders",
    line: "Turn Gemini 4 Argon into a paid, authorized web-security practice.",
    proof: "Free · the full 21-page playbook",
  },
  contents: [
    ["Authorization", "the law, and the signed scope that keeps the work legal"],
    ["The offer", "what you sell, who it is for, and what it is worth"],
    ["The engagement", "five phases from scope to retest, and where Argon fits each"],
    ["The appendix", "the scope template, and the four Argon prompts you reuse on every job"],
  ],
  steps: [
    "Open the PDF.",
    "Read section 02 first. Authorization is the whole business; everything else assumes it.",
    "Build your practice lab (section 04) before you go near a real site.",
  ],
  email: {
    preheader: "The playbook is attached. Start with section 02: authorization is the whole business.",
    stepsIntro: "Where to start:",
    after: [
      "The guide has the whole thing: the authorization and scope that keep you legal, the offer, the five-phase engagement, the report that gets you paid, responsible disclosure, pricing and the 90-day path. The appendix has the scope template and the four Argon prompts you reuse on every job.",
      "The one idea to hold on to: offer first, test only with signed permission, fix what you find. That single discipline is the difference between a whitehat and a headline.",
    ],
  },
  thanks: {
    needs:
      "Nothing to install. It is a PDF: read it, then build your practice with Gemini 4 Argon (or the strongest model you can access) and any stack you like.",
    next: [
      ["First", "Read section 02. Everything else in the guide assumes it."],
      ["Week one", "Build the practice lab and work the OWASP Top 10 on targets made to be broken."],
      ["Then", "Use the outreach in section 05 to offer your first authorized review."],
    ],
  },
};

export const APP_DESIGNER: Product = {
  id: "app-designer",
  name: "App Designer",
  description:
    "A Claude Code skill that designs iPhone apps like an award-winning studio, not like AI: a real concept, three directions explored, every screen rendered and checked for slop.",
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/skills/app-designer",
  file: {
    sealed: "app-designer.zip.enc",
    filename: "app-designer.zip",
    // The skill ships scripts (.mjs, .js), and Gmail refuses those zips.
    attach: false,
  },
  free: true,
  stripeProductId: "none",
  share: {
    description:
      "App Designer is a skill for Claude Code that designs iPhone apps that don't look like AI made them. It finds a concept, explores three directions, renders every screen with real iPhone fonts, scans for AI slop and has a critic score the result. Free.",
    kicker: "Skill · for Claude Code",
    line: "iPhone apps that don't look like AI made them.",
    proof: "Every screen checked for AI slop",
  },
  contents: [
    ["app-designer/SKILL.md", "the process Claude follows, from the brief to the scored screens"],
    ["references/", "the slop catalogue, directions, type, colour, layout, motion, critique"],
    ["assets/", "the iPhone device kit: status bar, Dynamic Island, Apple's fonts, Liquid Glass"],
    ["scripts/shoot.mjs", "renders every screen at 3x and scans it for slop"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs App Designer in about a minute.",
  ],
  email: {
    after: [
      "From then on, type /app-designer in any Claude Code session, or just ask Claude to design your app. Tell it what the app does and who it is for.",
      "It finds a concept, renders three directions so you can pick, designs every screen with Apple's own fonts, scans them for AI slop and has a critic score them before you see anything.",
    ],
  },
  thanks: {
    needs:
      "You'll need a Mac with Google Chrome, Claude Code with a paid Claude plan, and Node.js 18 or newer. If Node is missing, Claude will tell you.",
    next: [
      ["Right after install", "Claude offers to design your first app. Have one sentence ready: what it does, and who it's for."],
      ["Every app", "Three directions to choose from, then every screen rendered, scanned and scored."],
      ["Want changes?", "Say \"warmer\", \"try it dark\" or \"now the App Store screenshots\" and it designs again."],
    ],
  },
};

export const WEB_DESIGNER: Product = {
  id: "web-designer",
  name: "Web Designer",
  description:
    "A Claude Code skill that designs and builds websites and web apps like a top studio, not like AI: three directions explored, real code in your stack, every page scanned for slop and checked on Windows, Linux, Firefox and Safari.",
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/skills/web-designer",
  file: {
    sealed: "web-designer.zip.enc",
    filename: "web-designer.zip",
    // The skill ships scripts (.mjs, .js), and Gmail refuses those zips.
    attach: false,
  },
  free: true,
  stripeProductId: "none",
  share: {
    description:
      "Web Designer is a skill for Claude Code that designs and builds websites and web apps that don't look like AI made them. Three directions, real code in your stack, every page scanned for AI slop and checked on Windows, Linux, Firefox and Safari. Free.",
    kicker: "Skill · for Claude Code",
    line: "Websites that don't look like AI made them.",
    proof: "Checked on every screen and every computer",
  },
  contents: [
    ["web-designer/SKILL.md", "the process Claude follows, from the brief to the scored, cross-checked site"],
    ["references/", "the slop catalogue, directions, type, colour, layout, apps, motion, platforms, stacks, critique"],
    ["scripts/shoot.mjs", "renders every page at four widths and scans it for slop and defects"],
    ["scripts/matrix.mjs", "the same page on Windows, Linux, Android, Firefox, Safari, High Contrast"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs Web Designer in about a minute.",
  ],
  email: {
    after: [
      "From then on, type /web-designer in any Claude Code session, or just ask Claude to design or redesign your site or app. Tell it what it's for.",
      "It renders three directions so you can pick, builds the real thing in your project, then scans every page for AI slop, checks it on Windows, Linux, Firefox and Safari, and has a critic score it before you see anything.",
    ],
  },
  thanks: {
    needs:
      "You'll need Claude Code with a paid Claude plan and Node.js 18 or newer, on a Mac, Windows or Linux. If Node is missing, Claude will tell you.",
    next: [
      ["Right after install", "Claude offers to design your first page. Have one sentence ready: what it's for, or the URL to redesign."],
      ["Every project", "Three directions to choose from, then real code, rendered at every size and checked on every computer."],
      ["Want changes?", "Say \"bolder\", \"try it dark\" or \"now the pricing page\" and it designs again."],
    ],
  },
};

export const PRODUCTS: Record<ProductId, Product> = {
  "the-98c-trade": THE_98C_TRADE,
  launchr: LAUNCHR,
  "jev-crypto-analyst": JEV_CRYPTO_ANALYST,
  "jev-review-miner": JEV_REVIEW_MINER,
  whitehat: WHITEHAT,
  "app-designer": APP_DESIGNER,
  "web-designer": WEB_DESIGNER,
};

export function productById(id: unknown): Product | undefined {
  return typeof id === "string" && Object.hasOwn(PRODUCTS, id)
    ? PRODUCTS[id as ProductId]
    : undefined;
}

/** The file's media type, from its name: the zips and the one PDF. */
export const fileType = (product: Product) =>
  product.file.filename.endsWith(".pdf") ? "application/pdf" : "application/zip";

export const thanksHref = (product: Product) => `${product.href}/thanks`;

/** What a page prints where a price would go. */
export const priceText = (product: Product) => (product.free ? "Free" : product.priceLabel);

/** Where the buyer's copy of the file is fetched from. */
export const downloadHref = (sessionId: string) =>
  `/api/download?session_id=${encodeURIComponent(sessionId)}`;
