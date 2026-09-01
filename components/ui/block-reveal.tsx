"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

type BlockRevealProps = {
  /** Text elements to reveal. Each DIRECT child is split into its own lines. */
  children: ReactNode;
  /** The wiping block's colour. */
  blockColor?: string;
  /** Gap between consecutive line reveals, in seconds. */
  stagger?: number;
  /** How long one half of a wipe takes (in, then out). */
  duration?: number;
  /** Easing for each half of the wipe. */
  ease?: string;
  /** Fired once every line has finished revealing. */
  onRevealed?: () => void;
  /** Held before the first line moves. */
  delay?: number;
  /** Extra beat inserted before each child after the first. */
  groupGap?: number;
  /** ScrollTrigger start for the whole group. */
  start?: string;
  className?: string;
};

/**
 * Line-by-line block reveal: a solid bar wipes across each line from the
 * left, the line becomes visible underneath it, and the bar clears off to
 * the right. Every line in the group is staggered off one trigger, so a
 * heading and the line under it read as a single movement.
 *
 * Lines are measured with SplitText's `autoSplit`, so a resize re-wraps and
 * re-measures instead of leaving bars stranded over the old line boxes.
 */
export function BlockReveal({
  children,
  blockColor = "#0a0a0a",
  // Deliberately quick and tightly staggered: the bar should read as a
  // shimmer passing down the block, not a curtain being drawn.
  stagger = 0.07,
  duration = 0.42,
  ease = "power2.inOut",
  delay = 0,
  groupGap = 0.1,
  // Late enough that the block is genuinely IN view — at 85% it began
  // while only the top sliver had crossed the fold.
  start = "top 72%",
  onRevealed,
  className,
}: BlockRevealProps) {
  const scope = useRef<HTMLDivElement>(null);
  // Once the reveal has played, a LATER re-split (resize) has to land on the
  // finished state — otherwise resizing the window replays it from black.
  const played = useRef(false);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    // Reduced motion: the markup already renders fully visible, so the
    // honest thing to do is simply not split or hide anything.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // One timeline PER split child, keyed by child index. onSplit fires
      // once per SplitText instance, so a single `current` would let the
      // last child clobber the others and leave their lines hidden.
      // ScrollTrigger is created ONCE, outside the splits — creating one
      // inside onSplit would leak a trigger on every resize re-split.
      const timelines: gsap.core.Timeline[] = [];
      // Lines counted per child, so the stagger runs CONTINUOUSLY across
      // children: the one-line understatement has to wait out the six lines
      // above it, not fire alongside the heading's first line.
      const lineCounts: number[] = [];
      let entered = false;

      // Children marked data-no-split (hairlines, spacers) carry no text —
      // splitting them would add empty groups to the stagger.
      const splittable = (Array.from(el.children) as HTMLElement[]).filter(
        (child) => !child.hasAttribute("data-no-split"),
      );

      const splits = splittable.map((target, childIndex) =>
        SplitText.create(target, {
          type: "lines",
          linesClass: "br-line",
          autoSplit: true,
          // SplitText normalises whitespace by default, and JS \s matches
          // U+00A0 — so non-breaking spaces would be flattened to ordinary
          // ones and the pairs they bind would break apart anyway. Pass text
          // as a single string (not multi-line JSX) so nothing else leaks in.
          reduceWhiteSpace: false,
          onSplit: (self: SplitText) => {
            // Each line gets a relatively-positioned wrapper so its bar can
            // sit exactly on the line's box and reflow WITH it. No
            // overflow:hidden — the bar is inset:0, so it never leaves the
            // box, and clipping here would shave descenders.
            lineCounts[childIndex] = self.lines.length;
            const precedingLines = lineCounts
              .slice(0, childIndex)
              .reduce((sum, n) => sum + (n ?? 0), 0);

            const blocks: HTMLElement[] = [];
            self.lines.forEach((line) => {
              const el = line as HTMLElement;
              const wrapper = document.createElement("div");
              wrapper.style.position = "relative";
              el.parentNode?.insertBefore(wrapper, el);
              wrapper.appendChild(el);

              const block = document.createElement("div");
              block.style.cssText = `position:absolute;inset:0;background:${blockColor};pointer-events:none;will-change:transform;`;
              wrapper.appendChild(block);
              blocks.push(block);
            });

            if (played.current) {
              gsap.set(self.lines, { opacity: 1 });
              gsap.set(blocks, { scaleX: 0 });
              return;
            }

            gsap.set(self.lines, { opacity: 0 });
            gsap.set(blocks, { scaleX: 0, transformOrigin: "left center" });

            const tl = gsap.timeline({
              paused: true,
              onComplete: () => {
                played.current = true;
                onRevealed?.();
              },
            });

            blocks.forEach((block, i) => {
              const at =
                delay + (precedingLines + i) * stagger + childIndex * groupGap;
              // In from the left, hand the line over, then out to the right.
              tl.to(block, { scaleX: 1, duration, ease }, at);
              tl.set(self.lines[i], { opacity: 1 }, at + duration);
              tl.set(block, { transformOrigin: "right center" }, at + duration);
              tl.to(block, { scaleX: 0, duration, ease }, at + duration);
            });

            timelines[childIndex] = tl;
            if (entered) tl.play();
            return tl;
          },
        }),
      );

      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          entered = true;
          timelines.forEach((tl) => tl.play());
        },
      });

      return () => splits.forEach((s) => s.revert());
    }, scope);

    return () => ctx.revert();
  }, [blockColor, stagger, duration, ease, delay, groupGap, start, onRevealed]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
