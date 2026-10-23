import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOCKS } from "@/components/design-library/catalog.generated";
import { LabBlock } from "./lab-block";

// Unlisted: one design block alone, at the gallery card's size and at the
// detail view's size, for building and checking blocks. Not in the sitemap.
export const metadata: Metadata = { title: "Design block · lab", robots: { index: false, follow: false } };

export default async function DesignLabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!BLOCKS.some((b) => b.slug === slug)) notFound();
  return <LabBlock slug={slug} />;
}
