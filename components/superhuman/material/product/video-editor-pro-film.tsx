"use client";

import { useRef, useState } from "react";

/**
 * THE HERO FILM: Tobia's reel, edited by the skill, playing in the phone.
 *
 * It's a talking reel, so the sound matters, but a browser only autoplays it
 * muted. So it starts muted (the captions carry it) with a "Sound on" pill;
 * the first tap takes it back to the start, so you hear it from the top.
 */

export function VideoEditorProFilm({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [heard, setHeard] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (!heard) {
      v.currentTime = 0;
      setHeard(true);
    }
    v.muted = !muted;
    setMuted(!muted);
    void v.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-label="Video Editor Pro: a reel Claude Code edited"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!muted}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-2 text-[0.85rem] font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/70"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
          {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
        </svg>
        {muted ? "Sound on" : "Sound off"}
      </button>
    </>
  );
}
