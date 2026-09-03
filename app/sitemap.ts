import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { THOUGHTS } from "@/lib/thoughts";
import { OPEN_SHELF_IDS, shelfHref } from "@/components/superhuman/shelf-data";
import {
  MATERIAL_ROOM_FOLDERS,
  entryHref,
  folderHref,
} from "@/components/superhuman/material/material-data";


/**
 * The sitemap is generated, never hand-listed. The Thoughts routes come from
 * the same corpus that renders them, the shelf routes from the same array
 * that renders the cards, and Material's folders from the same array that
 * renders the public room — parked folders stay off the sitemap — so nothing
 * in the room can be published and silently left out of the index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/projects/mynd`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/projects/construct`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/projects/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/lab/gallery`, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Open families only. Masterclass and Design have no page, so publishing
  // their URLs would be advertising two 404s.
  const shelf: MetadataRoute.Sitemap = OPEN_SHELF_IDS.map((id) => ({
    url: `${SITE}${shelfHref(id)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Public room only. Parked folders keep their routes; they are not indexed.
  const folders: MetadataRoute.Sitemap = MATERIAL_ROOM_FOLDERS.map((folder) => ({
    url: `${SITE}${folderHref(folder.id)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Every piece in an open folder is its own page and its own document now, so
  // each one is indexed on its own rather than only as a row on its folder.
  const pieces: MetadataRoute.Sitemap = MATERIAL_ROOM_FOLDERS.flatMap((folder) =>
    folder.entries.map((entry) => ({
      url: `${SITE}${entryHref(folder.id, entry.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  const thoughts: MetadataRoute.Sitemap = THOUGHTS.map((t) => ({
    url: `${SITE}/thoughts/${t.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...fixed, ...shelf, ...folders, ...pieces, ...thoughts].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
