"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE OPENING: BEFORE AND AFTER, ON THE SAME CLIP.
 *
 * Tobia's call (2026-10-21): the opening was motion graphics; show the video
 * instead, and how it changes. So the hero is his raw iPhone clip and the edit
 * Video Editor made of it, stacked and playing in sync. On load the divider
 * sweeps across once, from the raw clip to the edit, and stops halfway; after
 * that it is the viewer's to drag (or arrow-key: it is a range input).
 *
 * The edit is the master clock and carries the sound; the raw clip follows it.
 * "Play with sound" starts it over, since he talks through what is changing.
 */

const DRIFT = 0.12;

export function ClipCompare({
  before,
  after,
  beforePoster,
  afterPoster,
}: {
  before: string;
  after: string;
  beforePoster: string;
  afterPoster: string;
}) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [pos, setPos] = useState<number | null>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const A = a.current;
    const B = b.current;
    if (!A || !B) return;
    const sync = () => {
      if (Math.abs(B.currentTime - A.currentTime) > DRIFT) B.currentTime = A.currentTime;
    };
    const play = () => {
      sync();
      B.play().catch(() => {});
    };
    const pause = () => B.pause();
    A.addEventListener("timeupdate", sync);
    A.addEventListener("seeked", sync);
    A.addEventListener("play", play);
    A.addEventListener("pause", pause);
    return () => {
      A.removeEventListener("timeupdate", sync);
      A.removeEventListener("seeked", sync);
      A.removeEventListener("play", play);
      A.removeEventListener("pause", pause);
    };
  }, []);

  const toggleSound = () => {
    const A = a.current;
    if (!A) return;
    const on = !sound;
    A.muted = !on;
    if (on) {
      A.currentTime = 0;
      A.play().catch(() => {});
    }
    setSound(on);
  };

  return (
    <div
      className="vd-ba relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-[1.6rem] bg-[#0f1012] shadow-[0_40px_80px_-40px_rgba(11,31,58,0.6)]"
      data-sweep={pos === null || undefined}
      style={pos === null ? undefined : ({ "--vd-p": `${pos}%` } as React.CSSProperties)}
    >
      <video
        ref={b}
        className="absolute inset-0 size-full object-cover"
        src={before}
        poster={beforePoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
      />
      <video
        ref={a}
        className="vd-ba__after absolute inset-0 size-full object-cover"
        src={after}
        poster={afterPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="The edited video"
      />
      <span className="vd-ba__line" aria-hidden />
      <span className="vd-ba__tag left-3" aria-hidden>
        Before
      </span>
      <span className="vd-ba__tag right-3" aria-hidden>
        After
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos ?? 50}
        onChange={(e) => setPos(+e.target.value)}
        aria-label="Compare the raw clip with the edit"
        className="vd-ba__range absolute inset-0 z-10 size-full cursor-ew-resize opacity-0"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={sound}
        className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-4 py-2 text-[0.85rem] font-bold text-white backdrop-blur-md transition-colors hover:bg-black/75"
      >
        {sound ? "Mute" : "Play with sound"}
      </button>
    </div>
  );
}
