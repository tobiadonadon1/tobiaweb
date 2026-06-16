import type { Metadata } from "next";
import PhotoWave from "@/components/ui/photo-wave";

// Unlisted prototype — not in the nav, not indexed. A place to judge the
// adapted 3D photo wave before deciding where (if anywhere) it lives.
export const metadata: Metadata = {
  title: "Photo wave — prototype",
  robots: { index: false, follow: false },
};

export default function GalleryLabPage() {
  return (
    <main className="paper-bg relative min-h-screen overflow-hidden text-[#0a0a0a]">
      <div className="relative z-10 px-6 pt-16 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
          Prototype · not on the site yet
        </span>
        <h1 className="mt-5 font-serif text-4xl tracking-tight md:text-5xl">
          The photography wave
        </h1>
        <p className="mx-auto mt-4 max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
          move your cursor across it
        </p>
      </div>

      <div className="absolute inset-0 top-24">
        <PhotoWave />
      </div>
    </main>
  );
}
