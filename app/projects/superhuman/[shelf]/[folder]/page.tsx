import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FolderPage } from "@/components/superhuman/material/folder-page";
import {
  FOLDER_BY_ID,
  MATERIAL_FOLDERS,
  folderHref,
} from "@/components/superhuman/material/material-data";

/**
 * /projects/superhuman/material/[folder]
 *
 * MATERIAL IS THE ONLY FAMILY WITH FOLDERS, and this route says so by
 * generating both segments itself: every path it produces has `material` in
 * the shelf position, so /projects/superhuman/design/anything cannot exist.
 * With `dynamicParams` off, that is enforced at routing rather than by a
 * check inside the page.
 *
 * Both segments are generated here (bottom up) rather than split across a
 * layout, because the pairing is the point — a folder is not a thing that
 * could belong to another family.
 */
export function generateStaticParams() {
  return MATERIAL_FOLDERS.map((folder) => ({
    shelf: "material",
    folder: folder.id,
  }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shelf: string; folder: string }>;
}): Promise<Metadata> {
  const { shelf, folder: id } = await params;
  const folder = shelf === "material" ? FOLDER_BY_ID[id] : undefined;
  if (!folder) return {};

  const title = `${folder.name} · Material`;

  return {
    title,
    description: `${folder.lede} ${folder.line}`,
    alternates: { canonical: folderHref(folder.id) },
    openGraph: {
      title,
      description: folder.lede,
      url: folderHref(folder.id),
      type: "website",
    },
  };
}

export default async function MaterialFolderPage({
  params,
}: {
  params: Promise<{ shelf: string; folder: string }>;
}) {
  const { shelf, folder: id } = await params;
  const folder = shelf === "material" ? FOLDER_BY_ID[id] : undefined;
  // dynamicParams is off, so this is belt and braces — and it is also what
  // narrows the segment for TypeScript.
  if (!folder) notFound();

  return <FolderPage folder={folder} />;
}
