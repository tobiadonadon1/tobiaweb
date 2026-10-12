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

export type ProductId = "the-98c-trade" | "launchr" | "jev-crypto-analyst" | "jev-review-miner" | "whitehat" | "app-designer" | "web-designer" | "app-launcher" | "grok-army" | "app-designer-pro" | "copycat-detective";

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
   *
   * EMPTY MEANS NOT ON SALE YET: the page is built and the button says
   * "Checkout opens soon", but nothing can reach Stripe, so a checkout can
   * never create a stray product under a made-up id (see `forSale`).
   */
  stripeProductId: string;
  /** Meta and share descriptions, and the share card's lines. */
  share: {
    description: string;
    kicker: string;
    line: string;
    proof: string;
    /** The share card's ground: the site's paper by default, or black for a page that is. */
    theme?: "dark";
  };
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
  /**
   * FREE WITH AN ACCOUNT, NOT BY EMAIL. Nothing is sent: a visitor signs in
   * (or creates an account) once and the file downloads, and their address
   * is kept with the account. /api/free refuses to email it.
   */
  accountOnly?: boolean;
  /** USED ON ITS PAGE, NOT DOWNLOADED: the shelf's button says "Try it free" and goes to the tool (#check). */
  onPage?: boolean;
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
  // Its old Stripe product (prod_VKL1qwlByvTm4z) now sells Grok Army.
  free: true,
  stripeProductId: "none",
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
    "A Claude Code skill that designs and builds websites, web apps and components like a top studio, not like AI: three directions explored, motion that moves like award-winning work, real code in your stack, every page scanned for slop and checked on Windows, Linux, Firefox and Safari.",
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
      "Web Designer is a skill for Claude Code that designs and builds websites, web apps and components that don't look like AI made them, and that move: dot matrices, 3D objects, ASCII, line art that draws itself. Real code in your stack, every page scanned for AI slop and checked on Windows, Linux, Firefox and Safari. Free.",
    kicker: "Skill · for Claude Code",
    line: "Websites that don't look like AI made them.",
    proof: "Checked on every screen and every computer",
  },
  contents: [
    ["web-designer/SKILL.md", "the process Claude follows, from the brief to the scored, cross-checked site"],
    ["references/", "the slop catalogue, directions, type, colour, layout, apps, motion craft, platforms, stacks, critique"],
    ["scripts/shoot.mjs", "renders every page at four widths and scans it for slop and defects"],
    ["scripts/matrix.mjs", "the same page on Windows, Linux, Android, Firefox, Safari, High Contrast"],
    ["scripts/record.mjs", "records any page or component in motion as an MP4 loop"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs Web Designer in about a minute.",
  ],
  email: {
    after: [
      "From then on, type /web-designer in any Claude Code session, or just ask Claude to design or redesign your site or app. Tell it what it's for.",
      "It renders three directions so you can pick, builds the real thing in your project, with motion that moves like award-winning work (dot matrices, 3D objects, ASCII, line art), then scans every page for AI slop, checks it on Windows, Linux, Firefox and Safari, and has a critic score it before you see anything.",
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

export const APP_LAUNCHER: Product = {
  id: "app-launcher",
  name: "App Launcher",
  description:
    "A skill for Claude Code and Codex that takes an iOS app from its repo to the App Store: finds and fixes what App Review would reject, then writes the listing and keywords, renders the screenshots and preview, and builds the launch kit. After launch, it reads your ads and rewrites onboarding.",
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/skills/app-launcher",
  file: {
    sealed: "app-launcher.zip.enc",
    filename: "app-launcher.zip",
    // The skill ships scripts (.mjs), and Gmail refuses those zips.
    attach: false,
  },
  free: true,
  stripeProductId: "none",
  share: {
    description:
      "App Launcher is a free skill for Claude Code and Codex. Put it in your iOS app's repo and type run: it checks the code the way App Review will and fixes what would get rejected, studies the real competition, writes the listing and keywords, renders the App Store screenshots and preview from your real app, and builds the launch kit. After launch it reads your ads and rewrites onboarding.",
    kicker: "Skill · for Claude Code and Codex",
    line: "From your repo to the App Store.",
    proof: "Checks your code the way App Review will",
  },
  contents: [
    ["skill/SKILL.md", "the process the agent follows, from the review check to launch day and after"],
    ["scripts/audit.mjs", "reads your code the way App Review will: 30+ checks with file and line"],
    ["scripts/store.mjs", "the real App Store: who ranks, their subtitles, screenshots and reviews"],
    ["scripts/imagegen.mjs + composite.mjs", "photoreal scenes from your OpenAI key, with your real app placed in the phone's screen"],
    ["scripts/screens.mjs", "renders App Store screenshots at Apple's exact sizes, captions set as real type"],
    ["scripts/preview.mjs, ads.mjs, meta.mjs", "the app preview video, the ads report, the listing checker"],
    ["references/", "review, positioning, ASO, screenshots, preview, launch, ads, onboarding, specs"],
  ],
  steps: [
    "Unzip it and move the app-launcher folder into your app's project folder.",
    "Open Claude Code or Codex in that folder.",
    "Type run app-launcher. It installs itself in about a minute and starts.",
  ],
  email: {
    preheader: "Your download is inside. Put it in your app's project, then type run app-launcher in Claude Code or Codex.",
    after: [
      "After that, in the same project, just type run (or /app-launcher in Claude Code, $app-launcher in Codex).",
      "It checks your code for what App Review would reject and fixes it, studies the apps you'll sit next to in search, writes your listing and keywords, renders your screenshots and preview from your real app, and builds the launch kit. Everything lands in a launch/ folder in your project.",
    ],
  },
  thanks: {
    needs:
      "You'll need Claude Code or Codex, Node.js 18 or newer, and your app's code (Swift, Expo, React Native, Flutter or Capacitor). On a Mac with Xcode it captures real screens from the Simulator; on Linux it uses screenshots from your phone.",
    next: [
      ["Right after install", "It runs the review check on your code and tells you what it found."],
      ["Then", "Positioning, listing, screenshots, preview and launch kit, one step at a time. Type run again any time to continue."],
      ["Once you're live", "Type run again: it reads your ads and onboarding and tells you what to change."],
    ],
  },
};

/**
 * COPYCAT DETECTIVE, a free skill: paste a link, get the receipt.
 *
 * Built after Tobia's "250 likes and I'll build a tool that exposes every
 * copycat" post. Honesty rules for every word about it: it shows facts (who
 * posted first, credit, what matches) and never calls anyone a copycat; it
 * refuses receipts for things that are only similar, credited, or too close
 * in time. It never posts for you.
 * The zip: sealed with `npm run seal -- ~/Desktop/copycat-detective.zip`.
 */
export const COPYCAT_DETECTIVE: Product = {
  id: "copycat-detective",
  name: "Copycat Detective",
  description:
    "A free Claude Code skill. Paste a link: it finds the original, proves who posted first, checks for credit, compares the two, and draws a side-by-side receipt with a calm post you publish with one tap.",
  priceCents: 0,
  currency: "eur",
  priceLabel: "Free",
  href: "/projects/construct/material/skills/copycat-detective",
  file: {
    sealed: "copycat-detective.zip.enc",
    filename: "copycat-detective.zip",
    // The skill ships scripts (.mjs), and Gmail refuses those zips.
    attach: false,
  },
  free: true,
  accountOnly: true,
  onPage: true,
  stripeProductId: "none",
  share: {
    description:
      "Copycat Detective is a free skill for Claude Code. Paste a link from X, the App Store, GitHub or any site: it finds the original, proves who posted first from the post's own ID, checks the post and its replies for credit, compares the two, and draws one side-by-side receipt with a calm post you publish with one tap. No receipt for things that are only similar.",
    kicker: "Skill · for Claude Code",
    line: "Paste a link. Get the receipt.",
    proof: "Who posted first, proven from the post itself",
  },
  contents: [
    ["skill/SKILL.md", "how Claude checks a case, from the link to the receipt and the post"],
    ["references/judging.md", "what counts as a match, what never does, and when to refuse"],
    ["references/posting.md", "how to write the post: facts, not verdicts"],
    ["scripts/check.mjs", "reads the links, finds the original, dates, credit, frames, colours, words"],
    ["scripts/receipt.mjs", "draws the side-by-side receipt, sized for X"],
    ["scripts/post.mjs", "counts like X, flags loaded words, makes the tap-to-post link"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs Copycat Detective in about a minute.",
  ],
  email: {
    preheader: "Your download is inside. Unzip it, open it in Claude Code, type hi, then paste a link.",
    after: [
      "From then on, type /copycat-detective in any Claude Code session and paste a link, or just ask \"is this a copy?\" with the link.",
      "It finds the original, proves who posted first from the post's own ID, checks for credit, compares the two, and draws the receipt. Then it writes a calm post you can publish with one tap. It never posts for you.",
    ],
  },
  thanks: {
    needs:
      "You'll need Claude Code, Node.js 18 or newer, and Google Chrome or Microsoft Edge. If anything is missing, Claude will tell you.",
    next: [
      ["Right after install", "Paste the link you want checked: the suspected copy, or both."],
      ["Every case", "About a minute to the facts, then the receipt and a post you can publish with one tap."],
      ["Only similar?", "It says so, and makes no receipt. Credited remakes and same-day coincidences get none either."],
    ],
  },
};

/**
 * GROK ARMY, a skill for Claude Code that builds a team of Grok Bots.
 *
 * Stripe: prod_VKL1qwlByvTm4z (Launchr's old product, renamed "GrokBot Army -
 * a 24/7 bot team built around your goal"), default price €15 one-time; the
 * checkout sends priceCents from here, so keep the two equal.
 * The zip: ~/Desktop/grok-army.zip sealed with `npm run seal -- ~/Desktop/grok-army.zip`
 * (private/grok-army.zip.enc). Reseal whenever the skill changes.
 *
 * Honesty rules for every word about it: never promise income or results.
 * It's built around the buyer's goal and keeps score on it; X payouts are
 * not guaranteed.
 */
export const GROK_ARMY: Product = {
  id: "grok-army",
  name: "Grok Army",
  description:
    "A Claude Code skill that turns Grok Bot into a 24/7 bot team you design around your goal: one bot you talk to, and one for each job. Instant download.",
  // Stripe's default_price for prod_VKL1qwlByvTm4z (price_1UJgLvB7HQhkKmiFVmnw6Upn,
  // €15 one-time, read 2026-10-10). The checkout charges this row: keep them equal.
  priceCents: 1500,
  currency: "eur",
  priceLabel: money(1500, "eur"),
  href: "/projects/construct/material/setups/grok-army",
  file: {
    sealed: "grok-army.zip.enc",
    filename: "grok-army.zip",
    // The skill ships install.mjs and build.mjs, which Gmail refuses inside a zip.
    attach: false,
  },
  // Stripe "GrokBot Army - a 24/7 bot team built around your goal" (live).
  stripeProductId: "prod_VKL1qwlByvTm4z",
  share: {
    description:
      "Grok Army turns Grok Bot into a team that works 24/7 on your goal. You set the goal and Claude designs the bots with you: one you talk to, and one for each job. It asks before anything is sent, posted or bought, gets better every week, and keeps score on your goal.",
    kicker: "Skill · for Claude Code",
    line: "Turn Grok Bot into a bot army that works for you 24/7.",
    proof: "Asks before anything goes out",
    theme: "dark",
  },
  contents: [
    ["skill/SKILL.md", "what Claude follows: four questions, then your army, then coaching"],
    ["skill/references/", "the lanes, the playbook craft, the weekly Improve loop, the payback rules"],
    ["skill/scripts/build.mjs", "checks your army's design and writes the one file Grok Bot reads"],
    ["START HERE.txt", "the three steps, if you'd rather read than ask"],
  ],
  steps: [
    "Unzip the folder.",
    "Open Claude Code in the grok-army folder (in a terminal: cd into it, then type claude)",
    "Type start. Claude installs Grok Army and asks you four quick questions.",
  ],
  email: {
    preheader: "Your download is inside. Open it in Claude Code and type start.",
    after: [
      "Claude asks four questions, then writes one file to your Desktop: your army, built around your goal. Give it to a new Grok Bot called Builder and say \"Build my army from this file.\"",
      "Keep the Claude chat open while you set it up: paste anything Grok Bot shows you and Claude tells you the next step. Nothing is posted, sent, bought or deleted without your OK.",
    ],
    footnote: "No income is promised. The army keeps score of what it helps you earn against what your plan costs.",
  },
  thanks: {
    needs:
      "You'll need Claude Code and Grok Bot (included with Cursor Pro or higher, or a linked SuperGrok or X Premium+ plan).",
    next: [
      ["In about ten minutes", "Claude has asked its four questions and your army's file is on your Desktop."],
      ["In the first half hour", "Builder sets up the shared notes and shows you a first result, then creates the bots."],
      ["Every Friday", "A scoreboard: what worked, what each bot rewrote in its playbook, and payback against your plan."],
    ],
  },
};

export const APP_DESIGNER_PRO: Product = {
  id: "app-designer-pro",
  name: "App Designer Pro",
  description:
    "A Claude Code skill that designs your app for iPhone and Android, and everything that sells it: screens that move, human copy, paywalls, store screenshots and icons. Instant download.",
  // Stripe's default_price for prod_VQa83vPcURQp2m (price_1UPiy0B7HQhkKmiFrVTtOXTx,
  // €5 one-time, read 2026-10-12). The checkout charges this row: keep them equal.
  priceCents: 500,
  currency: "eur",
  priceLabel: money(500, "eur"),
  href: "/projects/construct/material/setups/app-designer-pro",
  file: {
    sealed: "app-designer-pro.zip.enc",
    filename: "app-designer-pro.zip",
    // The skill ships scripts (.mjs, .js), and Gmail refuses those zips.
    attach: false,
  },
  // Stripe "Pro App Designer" (live).
  stripeProductId: "prod_VQa83vPcURQp2m",
  share: {
    description:
      "App Designer Pro is the follow-up to the free App Designer skill for Claude Code. It designs your app for iPhone and Android, records the screens that move to video, writes copy a person would say, designs onboarding and paywalls inside the store rules, and exports App Store and Google Play screenshots and both icons. €5.",
    kicker: "Skill · for Claude Code",
    line: "Your app on iPhone and Android, and everything that sells it.",
    proof: "Android · motion · paywalls · store assets",
  },
  contents: [
    ["app-designer-pro/SKILL.md", "the process Claude follows, from the brief to the store screenshots"],
    ["references/", "Android, both platforms, copy, paywalls, motion, stores, directions, critique, code"],
    ["assets/", "the device kit: iPhone and Pixel screens, hardware frames, store panels, icons"],
    ["scripts/shoot.mjs", "renders every screen, panel and icon, and scans design and copy for slop"],
    ["scripts/reel.mjs", "records the screens that move to MP4"],
  ],
  steps: [
    "Unzip the folder.",
    "Open a terminal in the folder and type claude",
    "Type hi. Claude installs App Designer Pro in about a minute.",
  ],
  email: {
    preheader: "Your download is inside. Open it in Claude Code and type hi.",
    after: [
      "From then on, type /app-designer-pro in any Claude Code session, or just ask Claude to design your app. Say what it does, who it's for, and whether it ships on iPhone, Android or both.",
      "It explores three directions, designs every screen on both platforms, writes the copy, and has a critic score each round. Ask for the paywall, the moving screens, the store screenshots or the code whenever you're ready.",
    ],
  },
  thanks: {
    needs:
      "You'll need a Mac with Google Chrome, Claude Code with a paid Claude plan, and Node.js 18 or newer. The videos need ffmpeg; Claude installs it if you say yes.",
    next: [
      ["Right after install", "Claude offers to design your first app. Have one sentence ready: what it does, and who it's for."],
      ["Every app", "Three directions to choose from, then every screen on iPhone and Android, scanned and scored."],
      ["Before you launch", "Say \"now the paywall\", \"make the screens move\" or \"the store screenshots\" and it designs them in the same style."],
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
  "app-launcher": APP_LAUNCHER,
  "grok-army": GROK_ARMY,
  "app-designer-pro": APP_DESIGNER_PRO,
  "copycat-detective": COPYCAT_DETECTIVE,
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

/**
 * CAN IT BE BOUGHT RIGHT NOW? A paid product with a real Stripe product id.
 * One built ahead of its Stripe product (an empty id) is shown but not sold:
 * its button says "Checkout opens soon" and the checkout route refuses it.
 */
export const forSale = (product: Product) =>
  !product.free && product.stripeProductId.startsWith("prod_");

/** What a page prints where a price would go. */
export const priceText = (product: Product) =>
  product.free ? "Free" : forSale(product) ? product.priceLabel : "Coming soon";

/** Where the buyer's copy of the file is fetched from. */
export const downloadHref = (sessionId: string) =>
  `/api/download?session_id=${encodeURIComponent(sessionId)}`;
