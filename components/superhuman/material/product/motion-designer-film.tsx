"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * A FILM THE SKILL MADE, playing. Muted, looping and inline like every film
 * on the site, playing only while it's on screen. Every one has its own
 * soundtrack (composed by the skill), so each has a sound button; turning one
 * on turns the others off, so two never play at once.
 */
const EVENT = "mdx-sound";

export function Film({
  src,
  poster,
  label,
  eager = false,
  className = "",
  buttonClassName = "",
}: {
  src: string;
  poster: string;
  /** What the film is, for the sound button ("Sound for the Keynote film"). */
  label: string;
  eager?: boolean;
  className?: string;
  buttonClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  // play while visible
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // only one film speaks at a time
  useEffect(() => {
    const off = (e: Event) => {
      if ((e as CustomEvent).detail !== src && ref.current) {
        ref.current.muted = true;
        setSound(false);
      }
    };
    window.addEventListener(EVENT, off);
    return () => window.removeEventListener(EVENT, off);
  }, [src]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !sound;
    if (next) {
      window.dispatchEvent(new CustomEvent(EVENT, { detail: src }));
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    } else v.muted = true;
    setSound(next);
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        className="block h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={eager}
        preload={eager ? "auto" : "metadata"}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={sound}
        aria-label={`${sound ? "Mute" : "Sound on"}: ${label}`}
        className={`mdx-sound ${buttonClassName}`}
      >
        {sound ? <Volume2 aria-hidden className="size-4" /> : <VolumeX aria-hidden className="size-4" />}
        <span>{sound ? "Sound on" : "Sound"}</span>
      </button>
    </div>
  );
}
