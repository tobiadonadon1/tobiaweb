import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { BookHero } from "@/components/book/book-hero";
import { TheFilm } from "@/components/book/the-film";
import { StayTuned } from "@/components/book/stay-tuned";
import { WaveField, WAVE_GROUND } from "@/components/book/wave-field";

const DESCRIPTION =
  "A long book about minds: the ones we are building, and the ones we already are. On consciousness, creativity and attention, written in public.";

export const metadata: Metadata = {
  title: "The Book",
  description: DESCRIPTION,
  alternates: { canonical: "/projects/book" },
  openGraph: {
    title: "The Book",
    description: DESCRIPTION,
    url: "/projects/book",
    type: "book",
    authors: ["Tobia Donadon"],
    images: [
      {
        url: "/trail/trail-01.jpg",
        width: 700,
        height: 1244,
        alt: "Tobia on a mountain trail in low light.",
      },
    ],
  },
};

/**
 * Schema.org Book. No ISBN, no price, no publication date, because none of
 * those exist yet and inventing them would be the one thing this page cannot
 * afford to do.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "The Book",
  description: DESCRIPTION,
  url: "https://tobiadonadon.com/projects/book",
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: "Tobia Donadon",
    url: "https://tobiadonadon.com",
  },
  about: [
    "Artificial intelligence",
    "Consciousness",
    "Creativity",
    "Attention",
  ],
};

/**
 * /projects/book — the quietest page on the site, and now the shortest.
 *
 * THREE things: the title, the film, the ask. The currents index, the
 * surfacing passage, the carry list, the why-split and the CSS-3D book have
 * all been removed at Tobia's instruction ("remove every section and just have
 * the book and then a video of me, and that's it"). The passage was the best
 * device on the old page and it is a one-line restore if it is ever missed.
 *
 * The ground is deep royal navy again, and this time it earns it. The whole
 * page sits in one moving field: a swell of navy water with an orange flare
 * travelling along its crest, warming as you scroll, so the ask at the bottom
 * is the brightest moment on the page. See wave-field.tsx for how it stays
 * cheap and how it rests under reduced motion.
 */
export default function BookPage() {
  return (
    <main
      data-ground="ink"
      className="relative text-paper"
      // A deep royal navy, one shade under the site ink so paper type keeps
      // its contrast. Kept local rather than tokenised: globals.css is being
      // edited elsewhere in this pass.
      style={{ background: WAVE_GROUND }}
    >
      <script
        type="application/ld+json"
        // Structured data built from constants above, never user content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* The one light on the page. It sticks to the viewport and spans the
          whole document, so the hero, the film and the ask are three moments
          in the same body of water rather than three separate light rigs. */}
      <WaveField />

      <BackLink tone="ink" />

      <BookHero />
      <TheFilm />
      <StayTuned />

      {/* The ink dissolves into the paper of the site footer, rather than
          butting against it with a waterline. */}
      <div className="relative z-10 h-[17vh]">
        <div aria-hidden className="melt-to-paper-b" />
      </div>
    </main>
  );
}
