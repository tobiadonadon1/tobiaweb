import type { MetadataRoute } from "next";
import { THOUGHTS } from "@/lib/thoughts";
import { SHELF_IDS, shelfHref } from "@/components/superhuman/shelf-data";
import {
  FOLDER_IDS,
  folderHref,
} from "@/components/superhuman/material/material-data";

const SITE = "https://tobiadonadon.com";

/**
 * The sitemap is generated, never hand-listed. The Thoughts routes come from
 * the same corpus that renders them, the shelf routes from the same array
 * that renders the cards, and Material's folders from the same array that
 * renders the room — so nothing can be published and silently left out of
 * the index.
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

  const shelf: MetadataRoute.Sitemap = SHELF_IDS.map((id) => ({
    url: `${SITE}${shelfHref(id)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Material's folders. Deeper than the families and updated more often,
  // since a folder changes every time a piece lands in it.
  const folders: MetadataRoute.Sitemap = FOLDER_IDS.map((id) => ({
    url: `${SITE}${folderHref(id)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const thoughts: MetadataRoute.Sitemap = THOUGHTS.map((t) => ({
    url: `${SITE}/thoughts/${t.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...fixed, ...shelf, ...folders, ...thoughts].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
