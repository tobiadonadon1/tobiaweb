import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/superhuman/material/entry-page";
import {
  FOLDER_BY_ID,
  MATERIAL_FOLDERS,
  entryHref,
} from "@/components/superhuman/material/material-data";

/**
 * /projects/construct/material/[folder]/[entry]
 *
 * A PIECE IS A PAGE NOW. It used to be a selection inside a client side
 * reader: clicking a title swapped the right hand pane and rewrote the hash.
 * That is the right shape for browsing thirty things and the wrong one for
 * three finished documents, because a hash is not a page. It cannot carry its
 * own title, its own description or its own sharing card, so a guide somebody
 * wanted to send to a friend arrived as the folder with a fragment on the end.
 *
 * EVERY FOLDER GETS ENTRY ROUTES, including the parked ones. The folder pages
 * render one list component and that component links to `entryHref` for every
 * row, so generating these for the public folders only would leave the parked
 * folders pointing at 404s. Cheap insurance: all of them are static.
 *
 * All three segments are generated here rather than split across a layout,
 * because the nesting is the point. A piece is not a thing that could belong
 * to another folder, and a folder is not a thing that could belong to another
 * family.
 */
export function generateStaticParams() {
  return MATERIAL_FOLDERS.flatMap((folder) =>
    folder.entries.map((entry) => ({
      shelf: "material",
      folder: folder.id,
      entry: entry.slug,
    })),
  );
}
export const dynamicParams = false;

/** The folder and the piece, or nothing. One lookup, used by both exports. */
function resolve(shelf: string, folderId: string, slug: string) {
  const folder = shelf === "material" ? FOLDER_BY_ID[folderId] : undefined;
  if (!folder) return undefined;
  const entry = folder.entries.find((e) => e.slug === slug);
  if (!entry) return undefined;
  return { folder, entry };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shelf: string; folder: string; entry: string }>;
}): Promise<Metadata> {
  const { shelf, folder: folderId, entry: slug } = await params;
  const found = resolve(shelf, folderId, slug);
  if (!found) return {};

  const { folder, entry } = found;
  const title = `${entry.title} · ${folder.name}`;

  return {
    title,
    description: `${entry.summary} ${entry.when}`,
    alternates: { canonical: entryHref(folder.id, entry.slug) },
    openGraph: {
      title,
      description: entry.summary,
      url: entryHref(folder.id, entry.slug),
      type: "article",
    },
  };
}

export default async function MaterialEntryRoute({
  params,
}: {
  params: Promise<{ shelf: string; folder: string; entry: string }>;
}) {
  const { shelf, folder: folderId, entry: slug } = await params;
  const found = resolve(shelf, folderId, slug);
  // dynamicParams is off, so this is belt and braces, and it is also what
  // narrows the two segments for TypeScript.
  if (!found) notFound();

  return <EntryPage folder={found.folder} entry={found.entry} />;
}
