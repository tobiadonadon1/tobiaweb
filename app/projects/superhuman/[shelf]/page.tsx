import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShelfPage } from "@/components/superhuman/shelf-page";
import { MaterialRoom } from "@/components/superhuman/material/material-room";
import {
  SHELF,
  SHELF_BY_ID,
  isShelfId,
  shelfHref,
} from "@/components/superhuman/shelf-data";

/**
 * /projects/superhuman/[shelf]
 *
 * One route for every family on the shelf. Everything it renders comes out of
 * SHELF in shelf-data.ts, so a family is added, renamed or filled in there and
 * this file never changes: the params, the metadata, the structured data and
 * the page body all read from the same array the shelf cards read from.
 *
 * Every family is known at build time, so all three are fully static and any
 * other segment 404s at routing rather than rendering an empty shell.
 *
 * MATERIAL IS THE EXCEPTION, and it earned it. The other two families are a
 * lede and a list of things that live somewhere else, which is exactly what
 * ShelfPage renders. Material is thirty-odd written pieces in six folders,
 * and a flat list of thirty rows is not a page anybody reads. It gets a room
 * instead (components/superhuman/material/), and this route hands it over.
 * The metadata, the params and the head still come from the same SHELF array,
 * so the two shapes cannot disagree about what Material is.
 */
export function generateStaticParams() {
  return SHELF.map((family) => ({ shelf: family.id }));
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
  // dynamicParams is off, so this is belt and braces rather than a real
  // branch — but it is also what narrows the segment to a ShelfId.
  if (!isShelfId(shelf)) notFound();

  if (shelf === "material") return <MaterialRoom />;

  return <ShelfPage family={SHELF_BY_ID[shelf]} />;
}
