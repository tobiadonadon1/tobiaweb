/**
 * The Thoughts corpus. A plain data module (no "use client", no server-only
 * APIs) so BOTH the homepage Thoughts section (client) and the
 * /thoughts/[slug] reading page (server) can import it.
 *
 * These are honest drafts in Tobia's voice — he rewrites them, and later the
 * "Mind" agent can feed this same shape from the DB without touching the UI.
 * `body` is optional: until a full essay exists the reading page shows the
 * excerpt as the piece's seed (drafts in public), never a fabricated body.
 */
export type Thought = {
  slug: string;
  headline: string;
  excerpt: string;
  cover?: string;
  tag?: string;
  readTime?: string; // e.g. "4 min read"
  date?: string; // e.g. "Jun 4, 2026"
  writer?: string;
  /** Full essay paragraphs, when written. Omitted while still a draft. */
  body?: string[];
};

export const THOUGHTS: Thought[] = [
  {
    slug: "writing-a-book-in-public",
    headline: "Why I'm writing a book in public",
    excerpt:
      "Finished things are easy to admire and hard to learn from. I'd rather show the drafts — the wrong turns included — and let the thinking be the thing.",
    cover: "/trail/trail-03.jpg",
    tag: "the book",
    readTime: "4 min read",
    date: "Jun 4, 2026",
    writer: "Tobia",
  },
  {
    slug: "intelligence-wants-intention",
    headline: "Intelligence wants intention",
    excerpt:
      "The tools are getting smarter by the month. The question that interests me isn't what they can do — it's what we point them at, and why.",
    cover: "/trail/trail-05.jpg",
    tag: "consciousness",
    readTime: "3 min read",
    date: "May 27, 2026",
    writer: "Tobia",
  },
  {
    slug: "notes-from-building-quietly",
    headline: "Notes from building quietly",
    excerpt:
      "Nothing I'm making is finished, and I've stopped being embarrassed about that. A record of what building looks like before anyone is watching.",
    cover: "/trail/trail-01.jpg",
    tag: "building",
    readTime: "5 min read",
    date: "May 18, 2026",
    writer: "Tobia",
  },
  {
    slug: "what-dreams-taught-me-about-attention",
    headline: "What dreams taught me about attention",
    excerpt:
      "Years of paying attention to the strange hours — significant dreams, one unmistakable out-of-body experience — and what it changed about my waking focus.",
    cover: "/trail/trail-06.jpg",
    tag: "consciousness",
    readTime: "4 min read",
    date: "May 9, 2026",
    writer: "Tobia",
  },
  {
    slug: "tools-should-teach-by-doing",
    headline: "Tools should teach by doing",
    excerpt:
      "I don't want to sell courses and I don't want to read manuals. The best things I've learned came from tools that made me better while I used them.",
    cover: "/trail/trail-07.jpg",
    tag: "superhuman",
    readTime: "3 min read",
    date: "Apr 30, 2026",
    writer: "Tobia",
  },
  {
    slug: "on-graduating-early-and-starting-late",
    headline: "On graduating early and starting late",
    excerpt:
      "Three years instead of four, then straight into the biggest company that would have me. Speed is a tool, not an identity — some things still want their full season.",
    cover: "/trail/trail-08.jpg",
    tag: "the road",
    readTime: "4 min read",
    date: "Apr 21, 2026",
    writer: "Tobia",
  },
];

export function getThought(slug: string): Thought | undefined {
  return THOUGHTS.find((t) => t.slug === slug);
}

// Tag → where its label links (funnel-strategy §3.7). Used on cards + pages.
export const TAG_HREF: Record<string, string> = {
  "the book": "/projects/book",
  consciousness: "/projects/book",
  building: "/#projects",
  superhuman: "/projects/superhuman",
  "the road": "/#road",
};
