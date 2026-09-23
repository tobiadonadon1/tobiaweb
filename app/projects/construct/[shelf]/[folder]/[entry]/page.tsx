import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/superhuman/material/entry-page";
import { The98cTradePage } from "@/components/superhuman/material/product/the-98c-trade-page";
import { PRODUCTS, type ProductId } from "@/lib/shop/products";
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
 * A PIECE WITH A PRICE IS A PRODUCT PAGE. An entry that names a product
 * (see `product` in material-types.ts) renders that product's own sales page
 * and carries its own share card, because it is the page posts link to and the
 * card is the first thing anybody sees of it.
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

  if (entry.product) {
    const product = PRODUCTS[entry.product];
    const description =
      "A prediction-market bot that sets itself up in Claude Code. Tested on 8,318 past Polymarket trades: 99% paid out. " +
      `${product.priceLabel}, instant download.`;
    const card = {
      url: `/shop/${product.id}/card`,
      width: 1200,
      height: 630,
      alt: `${product.name}. A prediction-market bot for Claude Code. ${product.priceLabel}.`,
    };
    return {
      // `absolute`: the layout's template would make it "The 98¢ Trade ·
      // Tobia Donadon", which is right, but the product name should lead a
      // browser tab on its own.
      title: { absolute: `${product.name} · A prediction-market bot for Claude Code` },
      description,
      alternates: { canonical: entryHref(folder.id, entry.slug) },
      openGraph: {
        title: product.name,
        description,
        url: entryHref(folder.id, entry.slug),
        siteName: "Tobia Donadon",
        locale: "en_US",
        type: "website",
        images: [card],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [card],
      },
    };
  }

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

  if (found.entry.product) return <ProductPage id={found.entry.product} />;

  return <EntryPage folder={found.folder} entry={found.entry} />;
}

/** One product today. A second one is a new page component and a new line here. */
function ProductPage({ id }: { id: ProductId }) {
  switch (id) {
    case "the-98c-trade":
      return <The98cTradePage />;
  }
}
