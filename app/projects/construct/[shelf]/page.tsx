import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MaterialRoom } from "@/components/superhuman/material/material-room";
import {
  OPEN_SHELF_IDS,
  SHELF_BY_ID,
  isShelfId,
  shelfHref,
} from "@/components/superhuman/shelf-data";

/**
 * /projects/construct/[shelf]
 *
 * ONE FAMILY HAS A PAGE NOW, AND THE DATA SAYS WHICH. Masterclass and Design
 * used to render a generic ShelfPage here: a lede, an intro, an empty state and
 * an email field. Two routes whose whole content was an apology for having no
 * content. They are gone, along with that component, and their cards on the
 * shelf are buttons that shake and say "Now locked" instead (see
 * shelf-locked-card.tsx).
 *
 * The params come from OPEN_SHELF_IDS rather than from the whole shelf, so
 * "closed" is a fact in shelf-data.ts and not a rule written twice. With
 * `dynamicParams` off, /projects/construct/masterclass 404s at routing rather
 * than rendering an empty shell; next.config.ts redirects both retired URLs
 * back to the shelf so anything already indexed lands somewhere real.
 *
 * Material is thirty-odd written pieces in six folders, so it gets a room
 * (components/superhuman/material/) rather than a list, and this route hands it
 * over. The metadata still comes from the same SHELF array the card reads, so
 * the two cannot disagree about what Material is.
 */
export function generateStaticParams() {
  return OPEN_SHELF_IDS.map((shelf) => ({ shelf }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shelf: string }>;
}): Promise<Metadata> {
  const { shelf } = await params;
  if (!isShelfId(shelf)) return {};
  const family = SHELF_BY_ID[shelf];
  // A family with no `page` has no route, so this cannot be reached through
  // routing. It is here because the type says the field is optional and a
  // metadata function should not be the thing that throws if that changes.
  if (!family.page) return {};

  return {
    title: `${family.page.title} · Construct`,
    description: `${family.page.lede} ${family.status}`,
    alternates: { canonical: shelfHref(family.id) },
    openGraph: {
      title: `${family.page.title} · Construct`,
      description: family.page.lede,
      url: shelfHref(family.id),
      type: "website",
    },
  };
}

export default async function ShelfFamilyPage({
  params,
}: {
  params: Promise<{ shelf: string }>;
}) {
  const { shelf } = await params;
  // dynamicParams is off, so this is belt and braces rather than a real branch.
  if (shelf !== "material") notFound();
  return <MaterialRoom />;
}
