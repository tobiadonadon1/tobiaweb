"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE APP, PLAYING, IN A PLAIN WINDOW.
 *
 * For Jev Crypto Analyst the product IS a screen, so it is shown as one: a
 * flat app window, no 3D device (Tobia: "we don't need the Mac"). The
 * recordings of the app reading real charts play one after another, each to
 * its end, and cross-fade. It starts playing the moment the page opens,
 * muted, and pauses while off screen. Reduced motion shows the first result
 * as a still.
 */

export type Clip = { id: string; src: string; poster: string; label: string };

export function AppReel({ clips, address }: { clips: Clip[]; address: string }) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const [still, setStill] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Read once, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(reduce);
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still) return;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === cur && seen) {
        v.play().catch(() => {});
      } else {
        v.pause();
        if (i !== cur) v.currentTime = 0;
      }
    });
  }, [cur, seen, still]);

  return (
    <div ref={box} className="relative">
      {/* A soft glow in the app's own green, behind the window. */}
      <div aria-hidden className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(54,224,162,0.16),transparent_65%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(244,242,236,0.12)] bg-[#0b0e14] shadow-[0_40px_120px_-40px_rgba(54,224,162,0.35)]">
        <div className="flex items-center gap-2 border-b border-[rgba(244,242,236,0.08)] px-4 py-2.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-2.5 w-2.5 rounded-full bg-[rgba(244,242,236,0.18)]" />
          ))}
          <span className="mx-auto rounded-md bg-[rgba(244,242,236,0.06)] px-3 py-0.5 font-mono text-[0.66rem] text-[rgba(244,242,236,0.5)]">
            {address}
          </span>
          <span className="w-10" />
        </div>
        <div className="relative aspect-[16/9]">
          {clips.map((c, i) => (
            <video
              key={c.id}
              ref={(v) => {
                videos.current[i] = v;
              }}
              src={still ? undefined : c.src}
              poster={c.poster}
              muted
              playsInline
              autoPlay={i === 0 && !still}
              preload={i === 0 ? "auto" : "metadata"}
              onEnded={() => setCur((n) => (n + 1) % clips.length)}
              aria-label={c.label}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === cur ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
      {/* Each dash is a 44px target, not a 19px one: they are how a thumb
          picks the coin, and a 3px line with 8px of padding is a miss. */}
      <div className="mt-1.5 flex justify-center gap-0.5">
        {clips.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCur(i)}
            aria-label={`Show ${c.label}`}
            aria-pressed={i === cur}
            className="flex h-11 min-w-11 items-center justify-center"
          >
            <span className={`block h-[3px] w-10 rounded-full transition-colors ${i === cur ? "bg-[#36e0a2]" : "bg-[rgba(244,242,236,0.16)]"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
