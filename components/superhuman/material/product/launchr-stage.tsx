"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { LAUNCHR as PRODUCT } from "@/lib/shop/products";
import { BuyForm } from "./buy-form";
import type { DeviceKind, Pose } from "./device-stage";

/**
 * LAUNCHR'S HERO: A REEL THAT IS ALREADY PLAYING.
 *
 * Tobia: a film should be playing the moment you land, and the films should
 * be their best ten seconds, not a slow build. So the hero is a reel of three
 * ten-second cuts (public/shop/launchr/*.mp4, each starting on a strong frame)
 * playing back to back on a 3D device: MYYND and Ledgerly's web app on a
 * MacBook, Ledgerly's mobile app on a phone. When a cut ends, the next one
 * starts, and the laptop turns into the phone and back.
 *
 * The pitch beside it is his: what it saves, and that it runs inside your own
 * Claude subscription. The price is on the page, just not the headline.
 *
 * The first film starts on mount, muted (browsers allow that), before the 3D
 * is even ready. The story-style ticks show where the reel is and jump to a
 * cut. Sound is one tap. Only the current film plays, only while on screen.
 *
 * REDUCED MOTION: no reel and no WebGL; the three cuts as plain players.
 */

const DeviceStage = dynamic(() => import("./device-stage"), { ssr: false });

type Film = { id: string; device: DeviceKind; aspect: string; src: string; poster: string };

const FILMS: Film[] = [
  { id: "myynd", device: "laptop", aspect: "16/9", src: "/shop/launchr/myynd.mp4", poster: "/shop/launchr/myynd.jpg" },
  { id: "tech", device: "laptop", aspect: "16/9", src: "/shop/launchr/tech.mp4", poster: "/shop/launchr/tech.jpg" },
  { id: "bold", device: "phone", aspect: "9/16", src: "/shop/launchr/bold.mp4", poster: "/shop/launchr/bold.jpg" },
];

const mono = "font-mono uppercase tracking-[0.16em]";

export function LaunchrStage() {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const hero = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);

  const go = useCallback((i: number) => {
    const next = (i + FILMS.length) % FILMS.length;
    const v = videos.current[next];
    if (v) v.currentTime = 0;
    pose.current = { look: next };
    setLook(next);
  }, []);

  /* ---- the current cut plays; the others wait at their start ---- */
  useEffect(() => {
    if (!motion) return;
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

  /* ---- the ticks fill with the cut, like stories ---- */
  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    const tick = () => {
      fills.current.forEach((f, i) => {
        if (!f) return;
        const v = videos.current[i];
        const p = i < look ? 1 : i > look || !v || !v.duration ? 0 : v.currentTime / v.duration;
        f.style.transform = `scaleX(${p})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [look, motion]);

  const pitch = (
    <>
      <p className={`${mono} lx-fade flex items-center gap-2 text-[0.62rem] text-[rgba(244,242,236,0.55)] sm:text-[0.68rem] lg:justify-start justify-center`}>
        <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full bg-[#f07a5f]" />
        Launchr · a skill for Claude Code
      </p>
      <h1 className="mt-3 text-balance text-center font-serif text-[clamp(2.2rem,5.6vw,4.9rem)] leading-[0.95] tracking-[-0.045em] text-[#f4f2ec] lg:text-left">
        {["Launch", "videos,", "made", "by", "Claude."].map((w, i) => (
          <span
            key={i}
            className={`inline-block ${motion ? "lx-word" : ""} ${i >= 2 ? "text-[rgba(244,242,236,0.5)]" : ""}`}
            style={motion ? { animationDelay: `${120 + i * 90}ms` } : undefined}
          >
            {w}
            {i < 4 ? " " : ""}
          </span>
        ))}
      </h1>
    </>
  );

  const pitchValue = (
    <p className="lx-fade mx-auto max-w-[34ch] text-balance text-center text-[1rem] leading-[1.45] sm:text-[1.08rem] text-[rgba(244,242,236,0.78)] md:text-[1.25rem] lg:mx-0 lg:text-left">
      Skip the <span className="text-[#f4f2ec]">$50+ Higgsfield plan</span> and the{" "}
      <span className="text-[#f4f2ec]">$5,000+ video team</span>. Make every launch
      video inside your own Claude subscription.
    </p>
  );

  const buy = (
    <div id="buy" className="flex scroll-mt-28 flex-col items-center lg:items-start">
      <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} label="Get Launchr" tone="ink" reportErrors />
      <p className={`${mono} mt-3 text-[0.6rem] text-[rgba(244,242,236,0.45)] sm:text-[0.64rem]`}>
        One time · {PRODUCT.priceLabel} · unlimited videos
      </p>
    </div>
  );

  /* ---- reduced motion ---- */
  if (motion === false) {
    return (
      <section aria-label="Launchr" className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        {pitch}
        <div className="mt-6">{pitchValue}</div>
        <div className="mt-8">{buy}</div>
        <ul className="mt-14 grid list-none grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_0.45fr] md:items-end">
          {FILMS.map((f) => (
            <li key={f.id}>
              <video src={f.src} poster={f.poster} controls playsInline preload="none" aria-label="A launch video made with Launchr" className="w-full rounded-xl bg-black" style={{ aspectRatio: f.aspect }} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={hero} aria-label="Launchr" className="relative">
      <div aria-hidden className="lx-grid pointer-events-none absolute inset-0" />
      {/* One copy of everything, placed by the grid: on a phone the title,
          the reel, then the value and the button; on a wide screen the title
          over the value and the button on the left, the reel on the right. */}
      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 content-center gap-4 px-5 pb-28 pt-[4.6rem] [@media(max-height:700px)]:gap-3 [@media(max-height:700px)]:pt-[4.2rem] sm:gap-6 sm:px-6 sm:pt-24 lg:grid-cols-[0.72fr_1.28fr] lg:grid-rows-[1fr_1fr] lg:gap-x-4 lg:gap-y-7 lg:pb-16">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">{pitch}</div>

        {/* ---- the reel ---- */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="relative h-[33svh] min-h-[190px] sm:h-[48svh] lg:h-[72svh] [@media(max-height:700px)]:h-[27svh]">
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
                  autoPlay={i === 0}
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  onEnded={() => i === look && go(i + 1)}
                  aria-label="A launch video made with Launchr"
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
                className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
              />
            ) : null}
          </div>

          <div className="mt-1 flex items-center justify-center gap-4">
            <div role="group" aria-label="Launch videos" className="flex w-40 gap-1.5">
              {FILMS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Play launch video ${i + 1} of ${FILMS.length}`}
                  aria-pressed={i === look}
                  className="group flex-1 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f07a5f]"
                >
                  <span className="block h-[2px] overflow-hidden rounded-full bg-[rgba(244,242,236,0.16)] group-hover:bg-[rgba(244,242,236,0.3)]">
                    <span
                      ref={(n) => {
                        fills.current[i] = n;
                      }}
                      className="block h-full origin-left bg-[#f4f2ec]"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              aria-pressed={sound}
              className={`${mono} inline-flex items-center gap-2 rounded-full border border-[rgba(244,242,236,0.18)] bg-[rgba(10,10,12,0.7)] px-3.5 py-2 text-[0.6rem] text-[rgba(244,242,236,0.85)] transition-colors hover:border-[rgba(244,242,236,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f07a5f]`}
            >
              {sound ? <Volume2 aria-hidden className="h-3.5 w-3.5" /> : <VolumeX aria-hidden className="h-3.5 w-3.5" />}
              {sound ? "Sound on" : "Sound"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-7 lg:col-start-1 lg:row-start-2 lg:items-start lg:self-start">
          {pitchValue}
          {buy}
        </div>
      </div>

      {/* The phone's sticky buy card comes up once the hero's button is gone. */}
      <div id="launchr-top" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[10svh] h-px" />
    </section>
  );
}
