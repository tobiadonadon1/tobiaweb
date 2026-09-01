"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet } from "@/components/book/sheet";
import { VideoFrame } from "@/components/ui/video-frame";
import {
  prefersReducedMotion,
  useReducedMotion,
} from "@/components/book/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The middle of the page, and the only thing in it.
 *
 * `bare` strips the frame back to the picture: no caption written across the
 * poster, no mono line under it, and no light following the cursor. Tobia
 * asked for all three to go, and he is right. A frame that is worth looking at
 * does not need a label explaining that it is a frame.
 *
 * TODO(tobia): when the film exists, pass
 * `source={{ kind: "file", src: "/book/reading.mp4" }}` (or a youtube id).
 * Nothing else here has to change.
 */
export function TheFilm() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-film-frame]",
        { yPercent: 6, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%", end: "top 38%", scrub: 0.6 },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} aria-label="A reading from the book" className="relative py-8 lg:py-14">
      <Sheet className="relative z-10">
        <div data-film-frame className="mx-auto max-w-[56rem]">
          <VideoFrame
            bare
            tone="ink"
            poster="/trail/trail-09.jpg"
            posterAlt="Low sun through a stand of trees in an empty park."
            caption="A reading from the book"
          />
        </div>
      </Sheet>
    </section>
  );
}
