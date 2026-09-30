import type { Metadata } from "next";
import { TouchWave } from "./touch-wave";

// Unlisted prototype — not in the nav, not indexed. A place to judge the
// adapted 3D photo wave before deciding where (if anywhere) it lives.
export const metadata: Metadata = {
  title: "Photo wave · prototype",
  robots: { index: false, follow: false },
};

export default function GalleryLabPage() {
  return (
    <main className="paper-bg relative flex min-h-[100svh] flex-col overflow-hidden text-[#0a0a0a]">
      <div className="relative z-10 px-6 pt-16 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/55">
          Prototype · not on the site yet
        </span>
        <h1 className="mt-5 text-balance font-serif text-4xl tracking-tight md:text-5xl">
          The photography wave
        </h1>
        <p className="mx-auto mt-4 max-w-md font-mono text-[11px] uppercase tracking-[0.1em] text-black/55">
          <span className="pointer-coarse:hidden">move your cursor across it</span>
          <span className="hidden pointer-coarse:inline">drag sideways across it</span>
        </p>
      </div>

      {/* On a phone the wave sits BELOW the title in the flow: laid over the
          whole screen, as it is on a laptop, its front photo covered the
          title and the hint on a 393px screen. */}
      <div className="relative mt-6 h-[70svh] min-h-[460px] w-full max-sm:scale-[0.74] sm:absolute sm:inset-0 sm:top-24 sm:h-auto sm:min-h-0">
        <TouchWave />
      </div>
    </main>
  );
}
