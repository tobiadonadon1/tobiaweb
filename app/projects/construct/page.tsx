import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { SuperhumanHero } from "@/components/superhuman/superhuman-hero";
import { SuperhumanPremise } from "@/components/superhuman/superhuman-premise";
import { SuperhumanShelf } from "@/components/superhuman/superhuman-shelf";
import { SuperhumanTogether } from "@/components/superhuman/superhuman-together";
import { SuperhumanClose } from "@/components/superhuman/superhuman-close";
import { SuperhumanCompass } from "@/components/superhuman/superhuman-compass";
import { SHELF, shelfHref } from "@/components/superhuman/shelf-data";
import { SECTION_ORDER } from "@/components/superhuman/sections";
const DESCRIPTION =
  "Free material on working with AI and AI for code, short expert masterclasses, and website templates you can ship as they are. Plus a small amount of one to one work.";

export const metadata: Metadata = {
  title: "Construct",
  description: DESCRIPTION,
  alternates: { canonical: "/projects/construct" },
  openGraph: {
    title: "Construct",
    description: DESCRIPTION,
    url: "/projects/construct",
    type: "website",
    images: [
      {
        url: "/trail/trail-06.jpg",
        width: 1000,
        height: 663,
        alt: "Tobia standing outside at night in a white t-shirt, hands in his pockets, smiling at the camera.",
      },
    ],
  },
};

/**
 * The three families, described for machines the same way they are described
 * for people. No prices, no ratings, no offers: none of those exist yet, and
 * structured data is a bad place to start inventing them.
 *
 * The item URLs are back, because the routes are back: each family now has a
 * real page of its own under /projects/construct/[shelf], generated from
 * this same array.
 */
const ITEM_LIST = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Construct",
  description: DESCRIPTION,
  numberOfItems: SHELF.length,
  itemListOrder: "https://schema.org/ItemListUnordered",
  // A `url` only where there is a page to point at. Masterclass and Design are
  // still listed, because they are still real parts of the shelf, but a
  // ListItem carrying a link to a 404 is worse than one carrying no link.
  itemListElement: SHELF.map((family, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: family.name,
    description: `${family.line} ${family.status}`,
    ...(family.open
      ? { url: `https://tobiadonadon.com${shelfHref(family.id)}` }
      : {}),
  })),
};

export default function SuperhumanPage() {
  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST) }}
      />

      <BackLink />

      <SuperhumanHero />

      {/* The premise carries the disclaimer in its own margin now — one
          scroll stop, claim then disqualifier. There is no third section. */}
      <SuperhumanPremise />

      <SuperhumanShelf />

      <SuperhumanTogether />

      <SuperhumanClose />

      <SuperhumanCompass labels={SECTION_ORDER} />
    </main>
  );
}
