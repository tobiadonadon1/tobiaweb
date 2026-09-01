"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { framing } from "@/components/ui/photo-framing";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

/**
 * The three identity beats, as a pinned scroll sequence.
 *
 * The panel sticks for the length of a tall track. Scrolling hands the copy
 * from one column to the next: the outgoing block's words drop away and the
 * incoming block's words rise, word by word with a three-word overlap, so
 * the handover reads as one continuous motion rather than a crossfade.
 * A photo marquee runs along the bottom, quickening with scroll velocity.
 *
 * Below 1000px — and for anyone who asked for less motion — the pin is
 * dropped entirely and all three beats are simply stacked and readable.
 */
type Beat = { eyebrow: string; title: string; description: string };

/** One beat's split text plus its words flattened across eyebrow + body. */
type BeatSplit = { splits: SplitText[]; words: HTMLElement[] };

/** Verbatim from the identity cards this replaces. */
const BEATS: Beat[] = [
  {
    eyebrow: "01",
    title: "Who Am I",
    description:
      "I aim to build technologies and write ideas that connect AI and consciousness, where design meets depth and innovation serves growth. Through my work, I explore how intelligence can guide us to create with purpose and awareness.",
  },
  {
    eyebrow: "02",
    title: "Where am I going",
    description:
      "I'll keep building, writing, and learning. I'm driven to shape a world where innovation feels human and awareness leads progress. My path is about creating with purpose, growing through experience, and letting what I learn compound into everything I build.",
  },
  {
    eyebrow: "03",
    title: "Why I create",
    description:
      "I create to understand. To turn complexity into clarity. To build systems, stories, and experiences that remind us what we're capable of when intelligence meets intention.",
  },
];

/** The photo strip under the beats. */
const MARQUEE = [
  "/trail/trail-04.jpg",
  "/trail/trail-01.jpg",
  "/trail/trail-09.jpg",
  "/trail/trail-02.jpg",
  "/trail/trail-10.jpg",
  "/trail/trail-03.jpg",
  "/trail/trail-11.jpg",
  "/trail/trail-05.jpg",
  "/trail/trail-06.jpg",
  "/trail/trail-07.jpg",
  "/trail/trail-08.jpg",
];

/** Words already moving when the next one starts — the overlap that makes
 *  the handover feel like one gesture instead of a queue. */
const OVERLAP = 3;

/**
 * The track, cut into five stretches: each beat gets a stretch where NOTHING
 * moves and it can simply be read, and the handovers happen between them.
 * Without the opening dwell, beat 01 began leaving the instant the panel
 * pinned — you arrived and it was already half gone.
 */
const HOLD_1_END = 0.2; // 01 sits still through the first fifth
const SWAP_1_END = 0.42; // 01 → 02 handover done
const HOLD_2_END = 0.6; // 02 sits still
const SWAP_2_END = 0.82; // 02 → 03 handover done; 03 holds out the tail

/**
 * Where word `index` sits (0→1) at a given phase progress. Each word owns a
 * slice of the phase, and slices overlap by OVERLAP words.
 */
function wordProgress(phase: number, index: number, total: number) {
  const scale =
    1 /
    Math.min(
      1 + OVERLAP / total,
      1 + (total - 1) / total + OVERLAP / total,
    );
  const start = (index / total) * scale;
  const end = start + (OVERLAP / total) * scale;
  if (phase <= start) return 0;
  if (phase >= end) return 1;
  return (phase - start) / (end - start);
}

export function IdentityScroll() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  // Rendered animated by default; the effect drops to the stacked layout on
  // narrow screens or under reduced motion.
  const [stacked, setStacked] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 999px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(motion.matches);
      setStacked(narrow.matches || motion.matches);
    };
    sync();
    narrow.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      narrow.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  // The word handover, driven by scroll position through the tall track.
  useEffect(() => {
    if (stacked) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const blocks: BeatSplit[] = (q(".js-beat") as HTMLElement[]).map((block) => {
        const splits = (
          Array.from(block.querySelectorAll("[data-words]")) as HTMLElement[]
        ).map((part) =>
          SplitText.create(part, { type: "words", mask: "words" }),
        );
        return {
          splits,
          words: splits.flatMap((s) => s.words) as HTMLElement[],
        };
      });
      if (blocks.length < 3) return;

      // Only the first beat starts on screen; the others wait below their masks.
      gsap.set(blocks[1].words, { yPercent: 100 });
      gsap.set(blocks[2].words, { yPercent: 100 });

      const hand = (out: BeatSplit, into: BeatSplit, phase: number) => {
        out.words.forEach((w, i) =>
          gsap.set(w, {
            yPercent: wordProgress(phase, i, out.words.length) * 100,
          }),
        );
        into.words.forEach((w, i) =>
          gsap.set(w, {
            yPercent: 100 - wordProgress(phase, i, into.words.length) * 100,
          }),
        );
      };

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (st) => {
          const p = st.progress;
          if (bar.current) gsap.set(bar.current, { scaleX: p });

          // A dwell maps to phase 0 (or 1) so the words hold their position
          // rather than creeping; only the swap stretches actually move.
          const span = (from: number, to: number) =>
            Math.max(0, Math.min(1, (p - from) / (to - from)));

          if (p < SWAP_1_END) {
            // Beat three must be parked here too — scrolling back up from the
            // second swap would otherwise leave its words where they stopped.
            gsap.set(blocks[2].words, { yPercent: 100 });
            hand(blocks[0], blocks[1], span(HOLD_1_END, SWAP_1_END));
          } else {
            gsap.set(blocks[0].words, { yPercent: 100 });
            hand(blocks[1], blocks[2], span(HOLD_2_END, SWAP_2_END));
          }
        },
      });

      return () => blocks.forEach((b) => b.splits.forEach((s) => s.revert()));
    }, root);

    return () => ctx.revert();
  }, [stacked]);

  // The marquee: a constant drift that scroll velocity briefly accelerates.
  useEffect(() => {
    if (reduced) return;
    const el = track.current;
    if (!el) return;

    let pos = 0;
    let smooth = 0;
    let target = 0;
    let lastY = window.scrollY;

    const tick = () => {
      // Scroll delta since the previous frame IS the velocity signal — no
      // scroll listener needed, and it is already frame-aligned.
      const y = window.scrollY;
      target = Math.min(3.2, Math.abs(y - lastY) * 0.06);
      lastY = y;

      smooth += (target - smooth) * 0.12;
      pos -= 1.15 + smooth * 9;
      // The strip is rendered twice; wrapping at half its width makes the
      // loop seamless.
      const half = el.scrollWidth / 2;
      if (half > 0 && pos <= -half) pos += half;
      gsap.set(el, { x: pos });
      target *= 0.92;
    };
    gsap.ticker.add(tick);

    return () => gsap.ticker.remove(tick);
  }, [reduced]);

  const beatBody = (b: Beat) => (
    <>
      <p
        data-words
        className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-black/40"
      >
        {b.eyebrow} · {b.title}
      </p>
      <p
        data-words
        className="mt-5 max-w-[28rem] font-helvetica text-[1.15rem] font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a] lg:text-[1.6rem]"
      >
        {b.description}
      </p>
    </>
  );

  const marquee = (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex h-28 items-center overflow-hidden">
      <div ref={track} className="flex shrink-0 gap-3 will-change-transform">
        {[...MARQUEE, ...MARQUEE].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="h-24 w-40 shrink-0 overflow-hidden rounded"
          >
            <img
              src={src}
              sizes="160px"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              // These are tall phone portraits in a 5:3 box, so a centred crop
              // throws the subject away. See photo-framing.ts.
              style={{ objectPosition: framing(src) }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (stacked) {
    return (
      <section
        id="phrases"
        className="paper-bg relative w-full overflow-hidden px-6 py-24"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-16">
          {BEATS.map((b) => (
            <div key={b.eyebrow}>{beatBody(b)}</div>
          ))}
        </div>
        {!reduced && <div className="relative mt-20 h-28">{marquee}</div>}
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="phrases"
      className="paper-bg relative w-full"
      // The track length IS the scroll speed: the sticky panel below is one
      // screen, so every extra viewport here buys the three beats more room to
      // hand over in. 500vh read as slightly hurried on a trackpad. This is the
      // one number to turn if it ever needs retuning.
      style={{ height: "620vh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Progress through the sequence — the only chrome in the panel. */}
        <div className="absolute right-8 top-12 h-px w-40 bg-black/12">
          <div
            ref={bar}
            className="h-full w-full origin-left scale-x-0 bg-[#0a0a0a]"
          />
        </div>

        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 gap-16 px-8 lg:px-12">
          {BEATS.map((b) => (
            <div key={b.eyebrow} className="js-beat flex-1">
              {beatBody(b)}
            </div>
          ))}
        </div>

        {marquee}
      </div>
    </section>
  );
}
