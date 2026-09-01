"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

/**
 * The beat directly under the hero: what the thing actually is, in one
 * sentence, taken at the speed the reader is moving.
 *
 * Device family: a scrubbed word ink-in. Every word starts nearly washed out
 * of the paper and is brought up to full as the section crosses the screen, so
 * the statement is read rather than displayed. Opacity only, no movement,
 * which keeps it distinct from the bar wipe in the hero above it and from the
 * drift below.
 *
 * THE WORDS. It used to say "It reads what the company already writes down.
 * It answers, and shows you where the answer came from." Every word of that is
 * true and none of it answers "so why do I care". It described a search box.
 *
 * The product's own site does not sell it that way. It sells LEVERAGE: the
 * know-how is scattered across a few minds and desktops, myynd brings it into
 * one brain the business owns, and then automations are built on top that save
 * time and make money. So that is what this says now, in two beats: what goes
 * in, and what you get out.
 *
 * The second beat is set in the accent AND on its own line. Colour marks the
 * half of the claim that is the actual promise, and the line break stops the
 * two claims running into each other mid-sentence.
 *
 * The measure is 20ch. It is wider than the 18ch this carried before because
 * the forced break costs a line: at 18ch the two beats came to seven lines of
 * display type, which is not a hook any more, it is a paragraph.
 *
 * WATCH THE LAST LINE if you edit these words. `text-wrap: pretty`, which is
 * the normal cure for a single word stranded on its own line, does nothing
 * here: SplitText wraps every word in its own element to ink them in one at a
 * time, and the browser cannot balance a paragraph it can no longer see as
 * running text. So the break is controlled by the only two things left, the
 * measure and the length of the sentence. At this size a line takes about 24
 * characters, so the second beat has to come in under about 48 to land as two
 * full lines. "…You save money and make money." was 54 and stranded "money."
 * on a line of its own; so did "…You save more and make more." at 52.
 *
 * The empty square is the sphere's destination. The shell leaves the hero,
 * comes to rest in it beside this sentence, and breaks there. It is marked
 * with a data attribute rather than a ref because the page composing the two
 * is a server component. Under prefers-reduced-motion nothing travels, so the
 * square collapses instead of leaving a hole.
 *
 * The tail of padding under the sentence was 88vh, and almost all of it read
 * as blank paper between the break and the next section. It could not simply
 * be cut: while the canvas was sticky for exactly the length of this stage,
 * this padding WAS the scroll the shell had to come apart in, so taking it
 * away made the break faster, which was the other complaint.
 *
 * The sphere's journey now runs past the end of the sticky (see BREAK_IN in
 * particle-sphere.tsx), so its runway no longer comes out of this number. 55vh
 * is what the sentence itself wants: enough that the shell is still whole
 * beside the last line, and not one screen more.
 */
export function PlainStatement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    let split: SplitText | null = null;

    document.fonts.ready.then(() => {
      if (!root.current) return;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const target = el.querySelector<HTMLElement>("[data-statement]");
        if (!target) return;

        split = SplitText.create(target, { type: "words" });

        const tween = gsap.from(split.words, {
          opacity: 0.14,
          duration: 1,
          stagger: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: "top 82%",
            end: "bottom 46%",
            scrub: 0.5,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split?.revert();
          split = null;
        };
      });

      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="myynd-what" className="relative z-10">
      <div className="mx-auto w-full max-w-6xl px-6 pb-[55vh] pt-24 md:pt-36 lg:pt-44">
        <div className="relative">
          <span
            data-sphere-dock
            aria-hidden
            className="mx-auto mb-10 block aspect-square w-[58vw] max-w-[280px] motion-reduce:hidden sm:w-[42vw] lg:absolute lg:right-0 lg:top-1/2 lg:mx-0 lg:mb-0 lg:w-[clamp(250px,25vw,340px)] lg:-translate-y-1/2"
          />
          <h2
            id="myynd-what"
            data-statement
            className="font-helvetica max-w-[20ch] text-[clamp(1.9rem,5vw,3.9rem)] font-medium leading-[1.06] tracking-[-0.035em]"
            style={{ color: "var(--ink)" }}
          >
            Twenty years of know-how, out of a few heads.{" "}
            {/* The promise starts its own line. Two claims running into each
                other mid-line is what made the old version read as one long
                feature description instead of a setup and a payoff. */}
            <span
              className="block"
              style={{ color: "var(--myynd-terracotta)" }}
            >
              Then automations on top. Save money, make money.
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
