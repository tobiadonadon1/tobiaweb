"use client";

import { useEffect, useRef, useState } from "react";
import { framing } from "@/components/ui/photo-framing";

type Source =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; src: string };

interface VideoFrameProps {
  /** Poster frame. A real photo, not a grey box. */
  poster: string;
  /** Describes the poster for screen readers and for SEO. */
  posterAlt: string;
  /** Mono line under the frame. */
  caption: string;
  /** Absent means the film does not exist yet, and the frame says so honestly. */
  source?: Source;
  /** Shown in the unfilmed state, e.g. "Filming in autumn". */
  pending?: string;
  /** Tint the light and rule. Defaults to the site blue. */
  accent?: string;
  /** Which ground the frame is sitting on. Only the border and the caption
   *  change: on ink, a black hairline and a black caption both disappear. */
  tone?: "paper" | "ink";
  /** Turn off the pointer light and the "not filmed yet" overlay. A poster
   *  that is worth looking at does not need a caption written across it. */
  bare?: boolean;
  className?: string;
}

/**
 * The video frame: a composed 16:9 slot that is worth looking at BEFORE
 * there is a film in it.
 *
 * Three things keep it alive rather than inert. The poster drifts on a very
 * slow ken-burns scale, so the frame breathes. A soft light follows the
 * pointer across the glass, so it answers the cursor. And the play ring
 * draws itself on approach rather than sitting there pre-drawn.
 *
 * When there is no `source` it does NOT pretend: no dead play button, no fake
 * duration. It states that the film is not made yet and stays handsome.
 * All motion is disabled under prefers-reduced-motion.
 */
export function VideoFrame({
  poster,
  posterAlt,
  caption,
  source,
  pending = "Not filmed yet",
  accent = "var(--accent-sky, #38bdf8)",
  tone = "paper",
  bare = false,
  className = "",
}: VideoFrameProps) {
  const onInk = tone === "ink";
  const frame = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false);
  const ready = Boolean(source);

  // The pointer light. Written straight to style in a rAF-free handler: it is
  // one transform per move, far cheaper than re-rendering React on every px.
  useEffect(() => {
    const el = frame.current;
    const dot = light.current;
    if (!el || !dot) return;
    if (bare) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      dot.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0) translate(-50%, -50%)`;
    };
    const enter = () => setNear(true);
    const leave = () => setNear(false);

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [bare]);

  const embed =
    source?.kind === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`
      : source?.kind === "vimeo"
        ? `https://player.vimeo.com/video/${source.id}?autoplay=1`
        : null;

  return (
    <figure className={`w-full ${className}`}>
      <div
        ref={frame}
        className="group relative aspect-video w-full overflow-hidden rounded-[14px]"
        style={{
          border: `1px solid ${onInk ? "rgba(207,233,238,0.18)" : "var(--hairline, rgba(11,31,58,0.12))"}`,
        }}
      >
        {playing && source?.kind === "file" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={source.src}
            controls
            autoPlay
            playsInline
          />
        ) : playing && embed ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embed}
            title={caption}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            {/* The poster breathes. 24s is slow enough to read as depth
                rather than as an animation you are meant to notice. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- house idiom, local asset */}
            <img
              src={poster}
              alt={posterAlt}
              className="absolute inset-0 h-full w-full object-cover motion-safe:animate-[vf-drift_24s_ease-in-out_infinite_alternate]"
              style={{
                // Every trail photo is a tall phone portrait, so a centred
                // crop into a 16:9 frame throws the subject away.
                objectPosition: framing(poster),
                filter: onInk
                  ? "saturate(0.7) contrast(0.95) brightness(0.92)"
                  : "saturate(0.86) contrast(0.98)",
              }}
            />

            {/* Ink veil so the type on top always clears contrast. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                // On an ink page a normally graded poster is the brightest
                // thing on screen by a mile and reads as a hole punched in the
                // page. It gets sunk further into the ground.
                // The ink veil used to be navy on BOTH grounds, which is part
                // of why the book page read as "too blue": a saturated blue
                // wash sat on top of a warm near-black page. On ink it is now
                // a near-neutral dark that takes the colour of whatever it is
                // laid on rather than adding one.
                // The veil exists to hold contrast under the overlay text. In
                // `bare` mode there IS no overlay text, so it drops to a thin
                // edge wash that only keeps the frame from glaring off a dark
                // page. Heavier when something has to sit legibly on top.
                background: bare
                  ? "linear-gradient(to top, rgba(16,14,12,0.5) 0%, rgba(16,14,12,0.12) 40%, rgba(16,14,12,0.34) 100%)"
                  : onInk
                    ? "linear-gradient(to top, rgba(16,14,12,0.88) 0%, rgba(16,14,12,0.58) 46%, rgba(16,14,12,0.72) 100%)"
                    : "linear-gradient(to top, rgba(11,31,58,0.62) 0%, rgba(11,31,58,0.18) 46%, rgba(11,31,58,0.30) 100%)",
              }}
            />

            {/* The light that follows the pointer. */}
            <div
              ref={light}
              hidden={bare}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle closest-side, color-mix(in srgb, ${accent} 34%, transparent), transparent)`,
                mixBlendMode: "screen",
              }}
            />

            {ready ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 grid h-full w-full place-items-center focus-visible:outline-none"
                aria-label={`Play: ${caption}`}
              >
                <span className="relative grid h-[74px] w-[74px] place-items-center">
                  {/* The ring DRAWS on approach instead of sitting pre-drawn. */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="50" cy="50" r="47" fill="none"
                      stroke="rgba(250,248,242,0.9)" strokeWidth="1.5"
                      strokeDasharray="295"
                      strokeDashoffset={near ? 0 : 295}
                      style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" className="ml-[3px] h-5 w-5" fill="#faf8f2" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            ) : bare ? null : (
              // No film yet, and it says so rather than faking a player.
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#faf8f2]/75">
                  {pending}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 origin-right scale-x-100 opacity-40"
                  style={{ background: accent }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {bare ? null : (
        <figcaption
          className={`mt-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
            onInk ? "text-[color:rgba(207,233,238,0.5)]" : "text-black/40"
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
