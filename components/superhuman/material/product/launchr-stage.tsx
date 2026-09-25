"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { LAUNCHR as PRODUCT } from "@/lib/shop/products";
import { BuyForm } from "./buy-form";
import type { DeviceKind, Pose } from "./device-stage";

/**
 * LAUNCHR'S OPENING: ONE PINNED STAGE, THE HERO AND THE FOUR LOOKS.
 *
 * The page opens on the product working: a real Launchr film playing on a 3D
 * phone you can turn with your finger, with the name, the promise and the buy
 * button beside it. Scroll and the stage holds while the device turns into
 * the next format and the next film (phone, laptop, phone, feed post), and
 * the copy says one concrete thing Launchr did in that film, including what
 * it was made from. See scrollcraft/builds/launchr/BRIEF.md.
 *
 * ONE NUMBER DRIVES IT, as on The 98¢ Trade: `s` runs 0..4 across the pinned
 * travel, is written to `pose` for the 3D (no React render per frame), and
 * sets each copy block's opacity directly.
 *
 * THE FILMS ARE REAL <video> ELEMENTS owned here: the 3D reads their frames
 * as textures, and without WebGL the current one is simply shown in a flat
 * frame. Only the current film plays, only while the stage is on screen, and
 * it restarts on each change so the reader sees its hook. Sound is one tap,
 * never automatic.
 *
 * REDUCED MOTION gets no pin and no WebGL: the hero, then the four films as
 * plain players with their captions.
 */

const DeviceStage = dynamic(() => import("./device-stage"), { ssr: false });

type Look = {
  id: string;
  label: string;
  short: string;
  device: DeviceKind;
  aspect: string;
  src: string;
  poster: string;
  film: string;
};

const LOOKS: Look[] = [
  {
    id: "premium",
    label: "Dark premium",
    short: "Premium",
    device: "phone",
    aspect: "9/16",
    src: "/shop/launchr/premium.mp4",
    poster: "/shop/launchr/premium.jpg",
    film: "VOLT energy drink · 20 s · vertical",
  },
  {
    id: "tech",
    label: "Tech dark",
    short: "Tech",
    device: "laptop",
    aspect: "16/9",
    src: "/shop/launchr/tech.mp4",
    poster: "/shop/launchr/tech.jpg",
    film: "Ledgerly web app · 30 s · landscape",
  },
  {
    id: "bold",
    label: "Bold colour",
    short: "Bold",
    device: "phone",
    aspect: "9/16",
    src: "/shop/launchr/bold.mp4",
    poster: "/shop/launchr/bold.jpg",
    film: "Ledgerly mobile app · 15 s · vertical",
  },
  {
    id: "studio",
    label: "Clean studio",
    short: "Studio",
    device: "post",
    aspect: "1/1",
    src: "/shop/launchr/studio.mp4",
    poster: "/shop/launchr/studio.jpg",
    film: "NOIR perfume · 15 s · square",
  },
];

/** The steps of the pinned travel: which film, how close, and what to say. */
const STEPS: { look: number; push: number; title?: string; text?: string }[] = [
  { look: 0, push: 0 },
  {
    look: 0,
    push: 1,
    title: "A product photo becomes a studio shot",
    text: "Launchr cuts your product out of the photo, lights it with shadows, reflections and light sweeps, and calls out your features on it. This film was made from two photos of the can and its logo.",
  },
  {
    look: 1,
    push: 0,
    title: "Your app, on a real screen",
    text: "Give it screenshots of your app or site. It puts them in a laptop, phone, browser or tablet and pushes into the features that matter, like a demo. This one is a logo and two screenshots.",
  },
  {
    look: 2,
    push: 0,
    title: "Loud when you want it",
    text: "Flat brand colours pulled from your logo, punchy type and stickers, every cut on the beat. Made for Reels, TikTok, Shorts and X, from one app screenshot and a logo.",
  },
  {
    look: 3,
    push: 0,
    title: "It ends on your call to action",
    text: "Your logo animates in and the last frame holds your line, price or launch date, clean enough to be the thumbnail. The music is written for each film, so every video is yours to use commercially.",
  },
];

const FIRST_STEP_OF = LOOKS.map((_, i) => STEPS.findIndex((s) => s.look === i && s.push === (i === 0 ? 1 : 0)));

/** Pinned travel for the four transitions, in small-viewport heights. */
const TRAVEL_SVH = 260;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const LAST = STEPS.length - 1;

export function LaunchrStage() {
  const section = useRef<HTMLElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const pose = useRef<Pose>({ look: 0, push: 0 });
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

  /* ---- scroll → s → pose, copy, current look ---- */
  useEffect(() => {
    if (!motion) return;
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const s = clamp(-r.top / Math.max(1, travel)) * LAST;
      const current = Math.round(s);
      const step = STEPS[current];
      pose.current = { look: step.look, push: step.push };
      setLook((l) => (l === step.look ? l : step.look));
      blocks.current.forEach((b, i) => {
        if (!b) return;
        const d = Math.abs(s - i);
        const on = clamp(1 - (d - 0.2) / 0.3);
        b.style.opacity = String(on);
        b.style.transform = `translateY(${(1 - on) * (i > s ? 18 : -18)}px)`;
        b.style.visibility = on < 0.02 ? "hidden" : "visible";
        b.toggleAttribute("inert", on < 0.5);
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

  /* ---- only the current film plays, only while the stage is seen ---- */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!motion) return;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === look && seen) {
        v.muted = !sound;
        v.play().catch(() => {
          // Autoplay with sound can be refused; fall back to muted.
          v.muted = true;
          setSound(false);
          v.play().catch(() => {});
        });
      } else {
        v.pause();
      }
    });
  }, [look, seen, sound, motion]);

  // A change of film starts the new one from its hook.
  const prevLook = useRef(0);
  useEffect(() => {
    if (prevLook.current === look) return;
    const v = videos.current[look];
    if (v) v.currentTime = 0;
    prevLook.current = look;
  }, [look]);

  const goToLook = useCallback((i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * FIRST_STEP_OF[i]) / LAST + 2, behavior: "smooth" });
  }, []);

  const onReady = useCallback(() => setLive(true), []);
  const onError = useCallback(() => setMode("flat"), []);

  const hero = (
    <div>
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
        Skill for Claude Code
      </span>
      <h1 className="mt-3 text-balance font-serif text-[clamp(2.1rem,5.4vw,4.1rem)] leading-[0.98] tracking-[-0.04em] text-[var(--ink)]">
        Your launch video, made in ten minutes.
      </h1>
      <p className="mt-4 max-w-[36ch] text-pretty text-[1.02rem] leading-[1.5] text-[color:rgba(11,31,58,0.72)] md:mt-5 md:text-[1.2rem]">
        Drop in your logo, product photos or app screenshots. Get a finished
        launch video with its own soundtrack.
      </p>
      <div id="buy" className="mt-5 flex scroll-mt-28 flex-col items-start md:mt-7">
        <BuyForm productId={PRODUCT.id} price={PRODUCT.priceLabel} reportErrors />
        <p className="mt-3 text-[0.88rem] text-[color:rgba(11,31,58,0.62)] md:text-[0.95rem]">
          One payment · As many videos as you want
        </p>
      </div>
    </div>
  );

  /* ---- reduced motion: no pin, no WebGL, every film as a player ---- */
  if (motion === false) {
    return (
      <section aria-labelledby="launchr-looks" className="mx-auto max-w-6xl px-6 pb-16 pt-28">
        {hero}
        <h2 id="launchr-looks" className="sr-only">
          Four launch films made with Launchr
        </h2>
        <ul className="mt-14 grid list-none grid-cols-1 gap-8 sm:grid-cols-2">
          {LOOKS.map((l, i) => {
            const step = STEPS[FIRST_STEP_OF[i]];
            return (
              <li key={l.id}>
                <video
                  src={l.src}
                  poster={l.poster}
                  controls
                  playsInline
                  preload="none"
                  className="w-full rounded-xl bg-[var(--ink)]"
                  style={{ aspectRatio: l.aspect }}
                />
                <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
                  {l.label} · {l.film}
                </p>
                <h3 className="mt-2 text-[1.3rem] tracking-[-0.02em] text-[var(--ink)]">{step.title}</h3>
                <p className="mt-1.5 text-[1rem] leading-[1.6] text-[color:rgba(11,31,58,0.7)]">{step.text}</p>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const current = LOOKS[look];

  return (
    <section
      ref={section}
      aria-label="Launchr, and four launch films it made"
      className="relative"
      style={{ height: `calc(100svh + ${TRAVEL_SVH}svh)` }}
    >
      {/* Scrolls away once the hero has had its moment, which is what tells
          the phone's sticky buy card to come up. */}
      <div id="launchr-top" aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[42svh]" />

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 pb-[max(6.2rem,calc(env(safe-area-inset-bottom)+5.8rem))] pt-[4.6rem] sm:px-6 sm:pb-8 md:pt-24 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10 lg:pb-12">
          {/* ---- the device ---- */}
          <div className="relative flex min-h-0 flex-1 flex-col lg:order-2 lg:h-full">
            <div className="relative min-h-0 flex-1">
              {/* The films. Hidden sources for the 3D; the flat frame shows the current one. */}
              <div
                className={
                  mode === "flat"
                    ? "absolute inset-0 flex items-center justify-center"
                    : "pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
                }
              >
                {LOOKS.map((l, i) => (
                  <video
                    key={l.id}
                    ref={(v) => {
                      videos.current[i] = v;
                    }}
                    src={l.src}
                    poster={l.poster}
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                    crossOrigin="anonymous"
                    aria-label={`${l.film}, made with Launchr`}
                    className={
                      mode === "flat"
                        ? `max-h-full max-w-full rounded-2xl bg-[var(--ink)] shadow-[0_30px_60px_-30px_rgba(11,31,58,0.6)] ${i === look ? "" : "hidden"}`
                        : "h-px w-px"
                    }
                    style={mode === "flat" ? { aspectRatio: l.aspect } : undefined}
                  />
                ))}
              </div>

              {motion && mode === "3d" ? (
                <>
                  {/* Until the first 3D frame, the poster holds the place. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOOKS[0].poster}
                    alt=""
                    className={`absolute left-1/2 top-1/2 h-[82%] -translate-x-1/2 -translate-y-1/2 rounded-[1.6rem] object-cover shadow-[0_30px_60px_-30px_rgba(11,31,58,0.6)] transition-opacity duration-700 ${
                      live ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ aspectRatio: "9/16" }}
                  />
                  <DeviceStage
                    looks={LOOKS}
                    videos={videos}
                    pose={pose}
                    onReady={onReady}
                    onError={onError}
                    className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
                  />
                </>
              ) : null}

              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                aria-pressed={sound}
                className="absolute bottom-1 right-0 z-10 inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[rgba(250,248,242,0.9)] px-3.5 py-2 text-[0.82rem] text-[var(--ink)] shadow-[0_10px_24px_-14px_rgba(11,31,58,0.5)] backdrop-blur-md transition-colors hover:border-[var(--accent-clay)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
              >
                {sound ? <Volume2 aria-hidden className="h-4 w-4" /> : <VolumeX aria-hidden className="h-4 w-4" />}
                {sound ? "Sound on" : "Hear it"}
              </button>
            </div>

            {/* ---- the looks: where you are, and a way to jump ---- */}
            <div className="mt-3 flex flex-col items-center gap-2">
              <div role="group" aria-label="Looks" className="flex flex-wrap justify-center gap-1.5">
                {LOOKS.map((l, i) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={i === look}
                    onClick={() => goToLook(i)}
                    className={`rounded-full border px-3 py-1.5 text-[0.8rem] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)] sm:text-[0.86rem] ${
                      i === look
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                        : "border-[var(--hairline-strong)] text-[color:rgba(11,31,58,0.72)] hover:border-[var(--accent-clay)]"
                    }`}
                  >
                    <span className="sm:hidden">{l.short}</span>
                    <span className="hidden sm:inline">{l.label}</span>
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.55)] sm:text-[0.66rem]">
                {current.film}
              </p>
            </div>
          </div>

          {/* ---- the copy: one slot, the blocks cross over in it ---- */}
          <div className="mt-4 grid shrink-0 lg:order-1 lg:mt-0">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={(n) => {
                  blocks.current[i] = n;
                }}
                className="self-center [grid-area:1/1]"
                style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
              >
                {i === 0 ? (
                  hero
                ) : (
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--accent-clay-text)]">
                      {LOOKS[step.look].label}
                    </p>
                    <h2 className="mt-2 text-balance font-serif text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
                      {step.title}
                    </h2>
                    <p className="mt-3 max-w-[42ch] text-pretty text-[0.98rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)] md:text-[1.08rem]">
                      {step.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
