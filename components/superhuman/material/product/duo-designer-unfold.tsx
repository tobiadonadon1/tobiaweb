"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE UNFOLD: Apple's own iPhone Duo film (the hero of apple.com/iphone-duo:
 * held in one hand, closed, it turns and opens into two hands), played once
 * as the opening curtain lifts, then held on the open phone.
 *
 * No player, no box: the film's ground is the page's ground (--dd-ground,
 * measured from the film), and its bottom edge dissolves, so the hands rise
 * out of the page. Two cuts of the same film, as Apple ships them: the wide
 * one from 735px up, the taller one (more room above, the hands already
 * fading) on phones.
 *
 * Under the video sits the film's first frame, so the phone is there before
 * a byte of video arrives. Reduced motion (in CSS), or a browser that
 * refuses to autoplay (Low Power Mode): the last frame, the open phone, as a
 * still.
 */
const S = (name: string) => `/shop/duo-designer/${name}`;
const WIDE = "(min-width: 735px)";
/** The opening curtain (.dd-loader) lifts at about 0.9 s: start then. */
const START_MS = 850;

export function DuoUnfold() {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"wait" | "play" | "still">("wait");

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // Reduced motion: the film never plays; CSS shows the last frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      v.play().then(
        () => setState("play"),
        () => setState("still"),
      );
    }, START_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="dd-unfold" data-state={state}>
      <picture className="dd-unfold__frame dd-unfold__frame--start">
        <source media={WIDE} srcSet={S("unfold-wide-start.jpg")} />
        <img src={S("unfold-tall-start.jpg")} alt="" fetchPriority="high" decoding="async" />
      </picture>
      {/* display: none (so, lazy: never fetched) unless it is needed. */}
      <picture className="dd-unfold__frame dd-unfold__frame--end">
        <source media={WIDE} srcSet={S("unfold-wide-end.jpg")} />
        <img src={S("unfold-tall-end.jpg")} alt="" loading="lazy" decoding="async" />
      </picture>
      <video
        ref={video}
        className="dd-unfold__video"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden
        tabIndex={-1}
      >
        <source media={WIDE} src={S("unfold-wide.mp4")} type="video/mp4" />
        <source src={S("unfold-tall.mp4")} type="video/mp4" />
      </video>
      <p className="sr-only">
        A hand holds iPhone Duo closed, its outer screen showing the home screen; the phone turns and opens into two
        hands, landscape, the home screen spread across both pages.
      </p>
    </div>
  );
}
