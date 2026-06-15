"use client";

import { useState } from "react";

interface VideoSlotProps {
  /** Sea-toned poster frame. */
  poster: string;
  /** Mono caption beneath the frame. */
  label: string;
  /** When a real film exists: its YouTube id. Absent → an elegant "soon" slot. */
  youtubeId?: string;
}

/**
 * The video slot — a 16:9 sea-toned frame with a play affordance, ready to
 * hold Tobia's short film (why the book, what it means). Until he records
 * it, it stands as a composed placeholder ("soon"), not an empty box.
 */
export function VideoSlot({ poster, label, youtubeId }: VideoSlotProps) {
  const [playing, setPlaying] = useState(false);
  const ready = Boolean(youtubeId);

  return (
    <figure className="w-full">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: "rgba(30,26,14,0.08)" }}
      >
        {playing && youtubeId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={label}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => ready && setPlaying(true)}
            disabled={!ready}
            aria-label={ready ? "Play" : label}
            className="group absolute inset-0 h-full w-full"
            style={{ cursor: ready ? "pointer" : "default" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local poster */}
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.8) contrast(0.97) brightness(0.9)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "rgba(11,31,58,0.3)" }}
            />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5" fill="#faf8f2" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {!ready && (
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#faf8f2]/70">
                Soon
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-black/35">
        {label}
      </figcaption>
    </figure>
  );
}
