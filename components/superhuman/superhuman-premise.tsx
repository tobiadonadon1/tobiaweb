"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_LABELS } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

/**
 * SECTION 2. The claim, and the disqualifier, as ONE scroll stop.
 *
 * WHAT WAS WRONG WITH THE CLAIM. "Everyone got the same tools. The gap got
 * wider." is a sentence about ACCESS, and access stopped being the story the
 * moment everyone had a subscription. Nobody reading this page is short of
 * tools. What separates people now is whether they are actually working the
 * things or just holding them, and the uncomfortable part is that you cannot
 * tell which one you are doing from the inside. So the claim names the
 * confidence itself as the problem. It is meant to sting slightly.
 *
 * WHAT WAS WRONG WITH THE DISQUALIFIER. It was a section of its own, one
 * screen further down, set at nearly the size of the claim: three short
 * refusals given a whole screen and the largest type on the page, which made
 * a footnote look like an argument. It belongs BESIDE the claim, small, in
 * the margin where a disclaimer lives — and it belongs there for a reason
 * that is also structural: the claim is a provocation, and a provocation
 * followed immediately by "and here is what I will not do to you" is a very
 * different thing from one left hanging.
 *
 * SO THEY SHARE A PIN. One sticky stage, one scrubbed timeline, two beats:
 * the claim inks in word by word, and as the last of it lands the refusals
 * come up in the margin and cross themselves out at reading pace. You cannot
 * get the second without having read the first, which is the whole point of
 * putting a scroll stop here.
 *
 * Below 1024px, and under reduced motion, there is no pin and no sweep: the
 * claim is set and the refusals are drawn already struck through, which is a
 * perfectly good way to read either of them.
 */

/**
 * The turn's colour.
 *
 * `--accent-deep` (#083344) was doing this job and it is not doing it: at
 * display size on warm paper it is indistinguishable from `--ink`, so the
 * half of the claim the reader is meant to argue with looked exactly like the
 * half they had already agreed to. This is the middle stop of the gradient the
 * hero mark is cut from, so the type turns the same blue the star is, and it
 * is light enough to read as a change without going near the sky accent,
 * which is a signal colour on this page and belongs to the rules.
 */
const TURN = "#2f7fae";

const REFUSALS = [
  "A revenue screenshot.",
  "A list of prompts.",
  "A countdown timer.",
];

export function SuperhumanPremise() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    let split: SplitText | null = null;

    /* Wide, calm: the pinned two-beat sequence. */
    const buildPinned = () => {
      const claim = root.querySelector<HTMLElement>("[data-premise-claim]");
      const wrapper = root.querySelector<HTMLElement>("[data-premise-wrapper]");
      if (!claim || !wrapper) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-refusal]", root);
      const strikes = gsap.utils.toArray<HTMLElement>("[data-strike]", root);
      const label = root.querySelector<HTMLElement>("[data-refusal-label]");
      const verdict = root.querySelector<HTMLElement>("[data-verdict]");

      split = SplitText.create(claim, { type: "words" });

      // Resting state written up front rather than left to a `from`: a `from`
      // paints the finished section for a frame on a fast scroll and then
      // wipes it back to nothing.
      gsap.set(rows, { opacity: 0, y: 16 });
      gsap.set(strikes, { scaleX: 0 });
      gsap.set([label, verdict].filter(Boolean), { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
        },
      });

      /* BEAT ONE, 0 to 0.55 of the pin: the claim is walked into. */
      tl.from(
        split.words,
        { opacity: 0.11, duration: 1, stagger: 0.34, ease: "none" },
        0,
      );

      /* BEAT TWO, from 0.52: the margin answers. */
      const base = tl.duration() * 0.52;
      tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, base);

      rows.forEach((row, i) => {
        const at = base + 0.5 + i * 0.75;
        tl.to(row, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, at);
        // The line is read, and then it is taken away.
        tl.to(
          strikes[i],
          { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
          at + 0.42,
        );
      });

      tl.to(
        verdict,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        base + 0.5 + rows.length * 0.75,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        split?.revert();
        split = null;
        gsap.set([...rows, ...strikes, label, verdict].filter(Boolean), {
          clearProps: "opacity,transform",
        });
      };
    };

    /* Narrow, or reduced: nothing moves, and the refusals are already gone. */
    const buildStatic = () => {
      gsap.set(root.querySelectorAll("[data-strike]"), { scaleX: 1 });
      gsap.set(
        root.querySelectorAll("[data-refusal], [data-verdict], [data-refusal-label]"),
        { opacity: 1, y: 0 },
      );
    };

    document.fonts.ready.then(() => {
      if (!scope.current) return;
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        buildPinned,
      );
      mm.add("(max-width: 1023px)", buildStatic);
      mm.add("(prefers-reduced-motion: reduce)", buildStatic);
      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={scope} id="premise" data-sh-section={SECTION_LABELS.premise}>
      <div data-premise-wrapper className="relative motion-safe:lg:h-[280vh]">
        <div
          data-premise-stage
          className="flex items-center px-6 py-28 motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-screen motion-safe:lg:py-0"
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-y-16 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:gap-y-0">
            {/* ---- the claim ---- */}
            <h2
              data-premise-claim
              className="font-helvetica max-w-[19ch] text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-[var(--ink)] lg:col-span-7"
            >
              Everyone has the tools. Most are sure they are using them right.{" "}
              {/* The turn takes its own line. It is the half of the claim the
                  reader is supposed to argue with, so it is not allowed to
                  start halfway along a line of the half they agreed with. */}
              <span className="block" style={{ color: TURN }}>
                That is exactly why they are falling behind.
              </span>
            </h2>

            {/* ---- the disqualifier, in the margin ---- */}
            <div className="lg:col-span-5 lg:pl-10">
              <span
                aria-hidden
                className="mb-8 block h-px w-12 bg-[var(--accent-clay)] lg:mb-10"
              />

              <p
                data-refusal-label
                className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[color:rgba(11,31,58,0.45)]"
              >
                What you will not find here
              </p>

              <ul className="mt-6 flex list-none flex-col gap-4 md:mt-8 md:gap-5">
                {REFUSALS.map((line) => (
                  <li key={line} data-refusal className="relative w-fit">
                    <span className="font-helvetica text-[1.15rem] font-medium leading-[1.3] tracking-[-0.02em] text-[color:rgba(11,31,58,0.5)] md:text-[1.3rem]">
                      {line}
                    </span>
                    {/* A real element, so it can be DRAWN from the left rather
                        than switched on. */}
                    <span
                      aria-hidden
                      data-strike
                      className="absolute left-0 top-1/2 block h-[2px] w-full origin-left -translate-y-1/2 bg-[var(--accent-clay)]"
                    />
                  </li>
                ))}
              </ul>

              <p
                data-verdict
                className="mt-9 text-[1.05rem] leading-relaxed text-[color:rgba(11,31,58,0.7)] md:mt-11"
              >
                Judge the work instead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
