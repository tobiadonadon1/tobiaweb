"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { LAUNCHR as PRODUCT } from "@/lib/shop/products";
import { BuyForm } from "./buy-form";
import type { DeviceKind, Pose } from "./device-stage";

/**
 * LAUNCHR'S OPENING: ONE PINNED STAGE, ON BLACK.
 *
 * Tobia's brief for the second version: black, techy, cinematic, short, and
 * about what you can make rather than about each film. So: one title, the
 * device in the middle, the buy button under it, and nothing else to read.
 * The laptop opens and powers on into a real Launchr film (device-stage.tsx);
 * scrolling plays the next film on the laptop, then turns it into a phone for
 * the vertical one. Each film is tagged only with its format.
 *
 * `s` runs 0..2 across the pinned travel and is written to `pose` for the 3D
 * without a React render per frame. Only the current film plays, only while
 * the stage is on screen, from its start. Sound is one tap, never automatic.
 *
 * REDUCED MOTION: no pin, no WebGL, no reveal; the title, the three films as
 * plain players, and the button.
 */

const DeviceStage = dynamic(() => import("./device-stage"), { ssr: false });

type Film = { id: string; device: DeviceKind; aspect: string; src: string; poster: string; tag: string };

const FILMS: Film[] = [
  { id: "myynd", device: "laptop", aspect: "16/9", src: "/shop/launchr/myynd.mp4", poster: "/shop/launchr/myynd.jpg", tag: "16:9 · 22 s · original score" },
  { id: "tech", device: "laptop", aspect: "16/9", src: "/shop/launchr/tech.mp4", poster: "/shop/launchr/tech.jpg", tag: "16:9 · 30 s · original score" },
  { id: "bold", device: "phone", aspect: "9/16", src: "/shop/launchr/bold.mp4", poster: "/shop/launchr/bold.jpg", tag: "9:16 · 15 s · original score" },
];

const TITLE = ["Launch", "videos,", "made", "by", "Claude."];

/** Pinned travel for the two changes of film, in small-viewport heights. */
const TRAVEL_SVH = 170;
const LAST = FILMS.length - 1;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const mono = "font-mono uppercase tracking-[0.16em]";

export function LaunchrStage() {
  const section = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const pose = useRef<Pose>({ look: 0 });
  const [motion, setMotion] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"3d" | "flat">("3d");
  const [live, setLive] = useState(false);
  const [look, setLook] = useState(0);
  const [sound, setSound] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setMotion(!mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* ---- scroll → s → pose, ticks, current film ---- */
  useEffect(() => {
    if (!motion) return;
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const s = clamp(-r.top / Math.max(1, r.height - window.innerHeight)) * LAST;
      const current = Math.round(s);
      pose.current = { look: current };
      setLook((l) => (l === current ? l : current));
      ticks.current.forEach((t, i) => {
        if (t) t.style.transform = `scaleX(${clamp(s - i + 1)})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [motion]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);

  /* ---- only the current film plays, from its start ---- */
  const prevLook = useRef(0);
  useEffect(() => {
    if (!motion) return;
    if (prevLook.current !== look) {
      const v = videos.current[look];
      if (v) v.currentTime = 0;
      prevLook.current = look;
    }
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === look && seen) {
        v.muted = !sound;
        v.play().catch(() => {
          v.muted = true;
          setSound(false);
          v.play().catch(() => {});
        });
      } else {
        v.pause();
      }
    });
  }, [look, seen, sound, motion]);

  const title = (animate: boolean) => (
    <h1 className="text-balance text-center font-serif text-[clamp(2.3rem,6.2vw,5rem)] leading-[0.95] tracking-[-0.045em] text-[#f4f2ec]">
      {TITLE.map((w, i) => (
        <span
          key={i}
          className={`inline-block ${animate ? "lx-word" : ""} ${i >= 2 ? "text-[rgba(244,242,236,0.5)]" : ""}`}
          style={animate ? { animationDelay: `${250 + i * 110}ms` } : undefined}
        >
          {w}
          {i < TITLE.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );

  const buy = (
    <div id="buy" className="flex scroll-mt-28 flex-col items-center">
      <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} tone="ink" reportErrors />
      <p className={`${mono} mt-3 text-[0.62rem] text-[rgba(244,242,236,0.5)] sm:text-[0.66rem]`}>
        One payment · Unlimited videos · Yours to use
      </p>
    </div>
  );

  /* ---- reduced motion ---- */
  if (motion === false) {
    return (
      <section aria-label="Launchr" className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        {title(false)}
        <div className="mt-8">{buy}</div>
        <ul className="mt-14 grid list-none grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_0.45fr] md:items-end">
          {FILMS.map((f) => (
            <li key={f.id}>
              <video src={f.src} poster={f.poster} controls playsInline preload="none" className="w-full rounded-xl bg-black" style={{ aspectRatio: f.aspect }} />
              <p className={`${mono} mt-3 text-[0.62rem] text-[rgba(244,242,236,0.5)]`}>{f.tag}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      ref={section}
      aria-label="Launchr, and three launch films it made"
      className="relative"
      style={{ height: `calc(100svh + ${TRAVEL_SVH}svh)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* A faint engineering grid, fading out toward the edges. */}
        <div aria-hidden className="lx-grid pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-5 pb-[max(6.4rem,calc(env(safe-area-inset-bottom)+6rem))] pt-[5rem] sm:px-6 sm:pb-9 md:pt-24">
          <p className={`${mono} lx-fade flex items-center justify-center gap-2 text-[0.62rem] text-[rgba(244,242,236,0.55)] sm:text-[0.68rem]`}>
            <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full bg-[#f07a5f]" />
            Launchr · a skill for Claude Code
          </p>
          <div className="mt-3">{title(true)}</div>

          {/* ---- the device ---- */}
          <div className="relative mt-2 min-h-0 flex-1">
            <div
              className={
                mode === "flat"
                  ? "absolute inset-0 flex items-center justify-center"
                  : "pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
              }
            >
              {FILMS.map((f, i) => (
                <video
                  key={f.id}
                  ref={(v) => {
                    videos.current[i] = v;
                  }}
                  src={f.src}
                  poster={f.poster}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  crossOrigin="anonymous"
                  aria-label={`A launch video made with Launchr, ${f.tag}`}
                  className={
                    mode === "flat"
                      ? `max-h-full max-w-full rounded-2xl bg-black ${i === look ? "" : "hidden"}`
                      : "h-px w-px"
                  }
                  style={mode === "flat" ? { aspectRatio: f.aspect } : undefined}
                />
              ))}
            </div>

            {motion && mode === "3d" ? (
              <DeviceStage
                looks={FILMS}
                videos={videos}
                pose={pose}
                onReady={() => setLive(true)}
                onError={() => setMode("flat")}
                className={`absolute inset-0 transition-opacity duration-1000 ${live ? "opacity-100" : "opacity-0"}`}
              />
            ) : null}

            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-pressed={sound}
              className={`${mono} absolute bottom-1 right-0 z-10 inline-flex items-center gap-2 rounded-full border border-[rgba(244,242,236,0.18)] bg-[rgba(10,10,12,0.7)] px-3.5 py-2 text-[0.62rem] text-[rgba(244,242,236,0.85)] backdrop-blur-md transition-colors hover:border-[rgba(244,242,236,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f07a5f]`}
            >
              {sound ? <Volume2 aria-hidden className="h-3.5 w-3.5" /> : <VolumeX aria-hidden className="h-3.5 w-3.5" />}
              {sound ? "Sound on" : "Sound"}
            </button>
          </div>

          {/* ---- where you are, the format, and the button ---- */}
          <div className="mt-3 flex flex-col items-center gap-2.5">
            <div aria-hidden className="flex w-28 gap-1.5">
              {FILMS.map((f, i) => (
                <span key={f.id} className="h-[2px] flex-1 overflow-hidden rounded-full bg-[rgba(244,242,236,0.14)]">
                  <span
                    ref={(n) => {
                      ticks.current[i] = n;
                    }}
                    className="block h-full origin-left bg-[#f4f2ec]"
                    style={{ transform: i === 0 ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>
            <p aria-live="polite" className={`${mono} text-[0.6rem] text-[rgba(244,242,236,0.45)] sm:text-[0.64rem]`}>
              {FILMS[look].tag}
            </p>
            <div className="mt-2">{buy}</div>
          </div>
        </div>
      </div>

      {/* The phone's sticky buy card comes up once the stage has unpinned and
          its own button has scrolled up out of the card's way. */}
      <div id="launchr-top" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[55svh] h-px" />
    </section>
  );
}
