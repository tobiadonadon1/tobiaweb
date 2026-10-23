import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { DESIGN_MANIFEST } from "@/components/design-library/manifest.generated";
import { DesignLibrary } from "@/components/design-library/library";

const DESCRIPTION =
  "Interactive React components you can play with: buttons, toggles, sliders, inputs and loaders with real motion. One file each, nothing to install. Members copy the code.";

/** A shared link to one block (?block=<slug>) is titled with that block. */
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ block?: string }> }): Promise<Metadata> {
  const { block } = await searchParams;
  const one = block && Object.hasOwn(DESIGN_MANIFEST, block) ? DESIGN_MANIFEST[block] : null;
  return {
    title: one ? `${one.title} · Design · Construct` : "Design · Construct",
    description: one ? `${one.description} Play with it, then copy the code with Construct Pro.` : DESCRIPTION,
    alternates: { canonical: "/projects/construct/design" },
  };
}

/**
 * THE DESIGN LIBRARY (the shelf's Design family). The page is on paper like
 * the rest of Construct; the library itself is a client component because
 * every block in it runs for real (components/design-library/library.tsx).
 * Blocks are built from their private sources by scripts/design-build.mjs.
 */
export default function DesignPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-white text-[#141414]">
      <BackLink href="/projects/construct" label="Construct" />
      <div className="mx-auto w-full max-w-[88rem] px-5 pb-28 pt-28 md:px-8 md:pt-32">
        <DesignLibrary />
      </div>
    </main>
  );
}
