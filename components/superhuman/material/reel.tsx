"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

/**
 * THE REEL: real videos, playing.
 *
 * For a skill whose output is a video, the proof is the videos, so they play
 * in the page rather than sitting behind a link. The rules that keep that
 * from costing the page:
 *
 *   NOTHING LOADS UNTIL IT IS NEAR. preload="none" and a poster, so the page
 *   costs four small JPEGs until the reader scrolls here.
 *   ONLY WHAT IS ON SCREEN PLAYS. Each video plays, muted and looping, while at
 *   least half of it is visible, and pauses when it leaves.
 *   SOUND IS ONE TAP, AND ONE AT A TIME. The soundtrack is half of what the
 *   skill makes, so every tile has a sound button; turning one on mutes the
 *   rest.
 *   REDUCED MOTION PLAYS NOTHING BY ITSELF. The posters stand still and a play
 *   button starts a video on request.
 *
 * Layout: the landscape film across the top, then the two verticals and the
 * square. On a phone the verticals pair up and the square takes a row.
 */

type Item = { src: string; poster: string; label: string; aspect: "16/9" | "9/16" | "1/1" };

const SPAN: Record<Item["aspect"], string> = {
  "16/9": "col-span-2 md:col-span-3",
  "9/16": "col-span-1",
  "1/1": "col-span-2 md:col-span-1",
};

export function Reel({ items, caption }: { items: Item[]; caption: string }) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [still, setStill] = useState(false);
  const [sound, setSound] = useState<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reading the preference once, on mount, is the point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(reduce);
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.5 },
    );
    videos.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  const toggleSound = (i: number) => {
    const next = sound === i ? null : i;
    videos.current.forEach((v, n) => {
      if (!v) return;
      v.muted = n !== next;
      if (n === next) v.play().catch(() => {});
    });
    setSound(next);
  };

  return (
    <figure className="mt-12 first:mt-0 lg:-mx-24">
      <ul className="grid list-none grid-cols-2 items-center gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <li key={item.src} className={SPAN[item.aspect]}>
            <div
              className="relative overflow-hidden rounded-xl bg-[var(--ink)] shadow-[0_24px_50px_-30px_rgba(11,31,58,0.55)]"
              style={{ aspectRatio: item.aspect }}
            >
              <video
                ref={(v) => {
                  videos.current[i] = v;
                }}
                src={item.src}
                poster={item.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${item.label}, a video made with Motion Director`}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {still ? (
                <button
                  type="button"
                  onClick={() => {
                    const v = videos.current[i];
                    if (v) (v.paused ? v.play() : Promise.resolve(v.pause())).catch(() => {});
                  }}
                  aria-label={`Play ${item.label}`}
                  className="absolute inset-0 flex items-center justify-center bg-[rgba(11,31,58,0.18)] text-[var(--paper)]"
                >
                  <Play aria-hidden className="h-10 w-10" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => toggleSound(i)}
                aria-pressed={sound === i}
                aria-label={sound === i ? `Mute ${item.label}` : `Play ${item.label} with sound`}
                className="absolute bottom-2.5 right-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(11,31,58,0.62)] text-[var(--paper)] backdrop-blur-md transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--paper)]"
              >
                {sound === i ? <Volume2 aria-hidden className="h-4 w-4" /> : <VolumeX aria-hidden className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
              {item.label}
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 text-[0.95rem] leading-relaxed text-[color:rgba(11,31,58,0.62)]">
        {caption}
      </figcaption>
    </figure>
  );
}
