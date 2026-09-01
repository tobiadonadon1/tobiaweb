"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleSphere } from "@/components/mynd/particle-sphere";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The four steps, in the product's own words rather than a paraphrase of
 * them. The old set described a search tool that stayed tidy: "it plugs in",
 * "it keeps reading", "plain language, with sources". True, and it left the
 * reader with no idea what actually changes on a Tuesday.
 *
 * These name the thing that happens at each step, and the last one carries
 * the whole point of the page: the automations are where the time and the
 * money come back.
 */
const STEPS: { name: string; body: string }[] = [
  {
    name: "Connect",
    body: "Files, mail, calendars, notes. Nothing new to install.",
  },
  {
    name: "Capture",
    body: "Sit-downs with your people surface what was never written down.",
  },
  {
    name: "Answer",
    body: "Ask anything. The whole company history answers back.",
  },
  {
    name: "Automate",
    body: "Agents take the repetitive work. Your people keep the judgment calls.",
  },
];

/**
 * The four steps, all four on screen at once.
 *
 * The old version panned them sideways past a sticky stage, which meant the
 * heading promised four and the screen showed two and a half. Everything is
 * visible here, hung off a single rule that is one element rather than four
 * card borders with gutters between them, so the line genuinely runs the whole
 * track. The stations sit ON that rule, centred on it, instead of being half
 * a dot clipped by a card's top edge.
 *
 * Device: the rule draws as the section is scrolled, left to right on a wide
 * screen and top to bottom on a narrow one, and each station lands as the line
 * reaches it. Scale and opacity only. The markup is served in its finished
 * state, so with no JavaScript, or with prefers-reduced-motion, the section is
 * simply already drawn.
 *
 * AND THE SHELL COMES BACK. The sphere that came apart over the sentence at
 * the top of the page gathers itself again here, out of nothing, in the air
 * above the section; then it falls, lands, and stays for good. It is put HERE
 * and nowhere else because this is the section that claims nothing gets
 * migrated and nothing gets replaced, and a body that reassembles out of its
 * own pieces and then refuses to move is that claim without a sentence.
 *
 * The canvas is hung off the top of the section rather than fitted to it, so
 * the gathering happens above the heading and the fall has somewhere to fall
 * from. It sits at z-0 with every word above it at z-10, and it is inert:
 * aria-hidden, no pointer events.
 */
export function StepsLine() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    const build = (rule: string, prop: "scaleX" | "scaleY") => () => {
      const line = root.querySelector<HTMLElement>(rule);
      const dots = gsap.utils.toArray<HTMLElement>("[data-station]", root);
      const grid = root.querySelector<HTMLElement>("[data-track]");
      if (!line || !grid) return;

      // A staggered fromTo only renders the from-state of the element whose
      // sub-tween starts at zero, so before the trigger fires the first
      // station sat hidden while the other three showed. Hide all four up
      // front and let the timeline bring them back.
      gsap.set(dots, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 82%",
          end: "bottom 62%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(line, { [prop]: 0 }, { [prop]: 1, ease: "none" }, 0);
      tl.fromTo(
        dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "back.out(2)",
          duration: 0.22,
          stagger: 0.24,
        },
        0.02,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([line, ...dots], { clearProps: "transform,opacity" });
      };
    };

    mm.add("(min-width: 1024px)", build("[data-rule-x]", "scaleX"));
    mm.add("(max-width: 1023px)", build("[data-rule-y]", "scaleY"));

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-sphere-reform
      aria-labelledby="myynd-steps"
      className="relative"
      style={{ background: "var(--myynd-cream)" }}
    >
      {/* The shell's return. Hung a little off the top of the section so the
          pieces gather in the air just above the heading and the drop has
          somewhere to fall from — but not so far that they form on top of the
          film in the section above. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -top-[14vh] z-0"
      >
        <ParticleSphere mode="reform" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:py-32 lg:py-40">
        <h2
          id="myynd-steps"
          className="max-w-[16ch] font-serif text-[2.1rem] leading-[1.04] tracking-tight md:text-[3.1rem]"
          style={{ color: "var(--ink)" }}
        >
          Nothing gets migrated.{" "}
          <span
            className="block"
            style={{ color: "var(--myynd-terracotta)" }}
          >
            Nothing gets replaced.
          </span>
        </h2>

        <div
          data-track
          className="relative mt-16 grid gap-11 lg:mt-24 lg:grid-cols-4 lg:gap-x-9"
        >
          {/* One rule for the whole track. Vertical on a narrow screen,
              horizontal on a wide one, continuous on both. */}
          <span
            aria-hidden
            data-rule-y
            className="absolute bottom-0 left-0 top-0 w-px origin-top lg:hidden"
            style={{ background: "var(--myynd-terracotta)", opacity: 0.55 }}
          />
          <span
            aria-hidden
            data-rule-x
            className="absolute left-0 right-0 top-0 hidden h-px origin-left lg:block"
            style={{ background: "var(--myynd-terracotta)", opacity: 0.55 }}
          />

          {STEPS.map((step) => (
            <article key={step.name} className="relative pl-8 lg:pl-0 lg:pt-11">
              {/* The station sits centred on the rule, not clipped by a border. */}
              <span
                aria-hidden
                data-station
                className="absolute left-0 top-0 block h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  // Matches the ground this section sits on, so the station
                  // reads as a ring ON the rule, not a bead beside it.
                  background: "var(--myynd-cream)",
                  border: "2px solid var(--myynd-terracotta)",
                }}
              />
              <h3
                className="font-serif text-[1.9rem] leading-none tracking-tight md:text-[2.35rem]"
                style={{ color: "var(--ink)" }}
              >
                {step.name}
              </h3>
              <p
                className="mt-3 max-w-[26ch] text-[15px] leading-relaxed md:text-base"
                style={{ color: "rgba(11,31,58,0.66)" }}
              >
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
