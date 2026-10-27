/**
 * THE MASTERCLASS LESSONS THAT PLAY ON THE SITE.
 *
 * The video itself sits in the private "products" bucket (`stored`, uploaded
 * with scripts/store-product.mjs) and only ever leaves it as a signed link,
 * handed out by /api/membership/watch to a member whose plan opens the
 * Masterclass, or to someone who bought the skill the lesson comes with
 * (`product`). The cover is public: it says what the lesson is, nothing more.
 *
 * The Drive copy for buyers without a plan is in drive.ts, sealed, so its
 * link is never in the public repository or the page's JavaScript.
 *
 * A new lesson: upload it, add it here (newest first), and put it on the
 * members' dashboard with scripts/shelf-add.mjs masterclass pro "<title>"
 * "/projects/construct/masterclass?watch=<slug>".
 */

export type Lesson = {
  slug: string;
  /** Lesson 01, 02… in the order they went up. */
  number: number;
  title: string;
  line: string;
  /** Which row of the page it belongs to (tracks.ts). */
  track: string;
  /** Length, said once ("7:24") and in seconds for the player. */
  duration: string;
  seconds: number;
  /** Where it is in the private bucket. */
  stored: string;
  /** The cover, public. */
  poster: string;
  /** The same cover, smaller, for emails. */
  emailPoster: string;
  /** Where to jump to: [seconds, what happens there]. */
  chapters: [number, string][];
  /** When it went up (YYYY-MM-DD). */
  added: string;
  /** A skill whose buyers get this lesson too. */
  product?: string;
};

export const MASTERCLASS_HREF = "/projects/construct/masterclass";

export const LESSONS: Lesson[] = [
  {
    slug: "video-editor-pro",
    number: 1,
    title: "Raw clip to finished reel",
    line: "Video Editor Pro, start to finish: the storyboard, the first cut in four minutes, notes on any frame in the creative studio, and how it learns your style.",
    track: "edit",
    duration: "7:24",
    seconds: 444,
    stored: "masterclass/01-video-editor-pro.mp4",
    poster: "/masterclass/01-video-editor-pro.jpg",
    emailPoster: "/masterclass/01-video-editor-pro-email.jpg",
    chapters: [
      [0, "Install it and hand it a clip"],
      [61, "The storyboard, your first checkpoint"],
      [127, "The first cut, in four minutes"],
      [169, "The creative studio: a note on any frame"],
      [208, "Be specific: how to ask for what you want"],
      [320, "It learns your style"],
      [356, "The last check, and the post"],
      [414, "Wrapping up"],
    ],
    added: "2026-10-27",
    product: "video-editor-pro",
  },
];

export const lessonBySlug = (slug: unknown) => LESSONS.find((l) => l.slug === slug);
export const lessonForProduct = (productId: string) => LESSONS.find((l) => l.product === productId);
export const lessonHref = (lesson: Lesson) => `${MASTERCLASS_HREF}?watch=${lesson.slug}`;

/** 61 → "1:01". */
export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
