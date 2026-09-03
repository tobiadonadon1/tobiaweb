"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Specimen } from "./material/specimens";
import { mailto } from "./shelf-data";
import { SECTION_LABELS } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SECTION 5, the human offer.
 *
 * WHAT WAS WRONG. It ran on the shelf's own navy with no seam between them,
 * so the catalogue and the person were one unbroken dark stretch and the eye
 * had no way to tell where one offer ended and the other began. And there was
 * nothing in it: a headline, two paragraphs and a button, all type, on the
 * same ground as the block above. You could not land on it and know in a
 * second what was being offered.
 *
 * THE GROUND. It is paper now, and the shelf melts back to paper at its own
 * foot (see superhuman-shelf.tsx). The page reads paper, paper, paper, INK,
 * paper: one dark band, and it belongs to the thing you buy off a shelf. The
 * person stands on the light.
 *
 * THE OBJECT. A portrait, right, at 4:5. It is the only photograph on the
 * page and the only large object that is not drawn, which is precisely why it
 * carries the section. Everything else here is a rule, a numeral or a word.
 *
 * COLOUR. Clay, not sky. Sky is the product's accent and it is all over the
 * shelf; clay is warm, it is what the homepage statement lights up with, and
 * giving it to this section says plainly that this half is a person and the
 * half above is a catalogue. The button stays ink, because the ask should be
 * the most certain thing on the screen, not the warmest.
 *
 * THE DEVICES, none of which repeat anything else on this page:
 *   · the headline block WIPES up into view as one piece, then holds;
 *   · the portrait wipes up behind it while the image inside it counter
 *     scales, so the frame opens ONTO a picture rather than dragging a
 *     curtain off a still one, and then drifts slowly against the scroll;
 *   · the two ways rise, each behind its own clay rule drawing left to right;
 *   · and once all of that has landed, the headline answers the POINTER: a
 *     soft circle follows the cursor and recolours the type to clay as it
 *     passes, the same live moment the homepage statement has.
 *
 * Only transform, opacity, clip-path and mask-position are ever touched.
 */

/** The clay accent (globals.css --accent-clay). */
const CLAY = "#ce4631";

/**
 * Soft-edged circle for the pointer spotlight. `closest-side` is load-bearing:
 * the mask box is not square, and the default farthest-corner extent leaves
 * the gradient opaque at the box edges, which clips the circle into flat sides.
 */
const MASK =
  "radial-gradient(circle closest-side, #000 0 55%, rgba(0,0,0,0.55) 82%, transparent 100%)";

/** Spotlight diameter once the pointer is over the headline. */
const SPOT_SIZE = 330;

type Portrait =
  | { kind: "image"; src: string; alt: string; position?: string }
  | {
      kind: "video";
      src: string;
      poster?: string;
      alt: string;
      position?: string;
    };

/**
 * THE PORTRAIT. Swap this one object and nothing else.
 *
 * Drop the file into `public/` and point `src` at it:
 *
 *   a photograph  { kind: "image", src: "/one-to-one.jpg", alt: "…" }
 *   a short film  { kind: "video", src: "/one-to-one.mp4",
 *                   poster: "/one-to-one.jpg", alt: "…" }
 *
 * A film plays muted, looped, inline and with no controls, so it reads as a
 * portrait that happens to move rather than as a player asking to be pressed.
 * Shoot it vertical: the frame is 4:5.
 *
 * `position` is the CSS object-position. The frame is 4:5 and the placeholder
 * is a landscape phone photo, so the crop has to be told where he is in it.
 */
const PORTRAIT: Portrait = {
  kind: "image",
  src: "/trail/trail-06.jpg",
  alt: "Tobia outside at night in a white t-shirt, hands in his pockets.",
  position: "44% 44%",
};

/**
 * THE TWO WAYS.
 *
 * They carried "01" and "02" in clay above the label. The ordinals came off
 * for the same reason they came off the skills and the guides: a number
 * standing where a picture should be is a number pretending to be a picture,
 * and there are real marks now. The two are a PAIR, drawn from the same two
 * cut pieces arranged two ways, so the difference between the offers is
 * visible before either sentence is read.
 */
const WAYS = [
  {
    mark: "way-side-by-side",
    label: "Side by side",
    body: "We build it together, in your tools, so it stays yours.",
  },
  {
    mark: "way-hand-it-over",
    label: "Hand it over",
    body: "You say what you need. I build it and show you how it runs.",
  },
];

/**
 * One rendering of the headline block. The base copy and the clay spotlight
 * copy both come from HERE, so their line breaks and metrics are identical by
 * construction and the masked layer lands exactly on the type underneath it.
 */
function Head({ accent = false }: { accent?: boolean }) {
  const tone = (base: string) => (accent ? { color: CLAY } : { color: base });

  return (
    <>
      <p
        className="text-[0.95rem]"
        style={accent ? { color: CLAY, opacity: 0.7 } : { color: "rgba(11,31,58,0.55)" }}
      >
        One to one
      </p>

      <h2
        // leading-[0.95] makes the line box SHORTER than the glyphs, so the
        // descender of the g in "together" hangs below the element's own box.
        // The arrival wipes this block with clip-path, and an inset(0) clip is
        // still a clip: it cut the tail off the g and left it cut. The padding
        // gives the type its body back, and the timeline drops the clip
        // entirely once it has finished with it.
        className="mt-6 max-w-[14ch] pb-[0.06em] font-serif text-[clamp(2.6rem,6.4vw,4.9rem)] leading-[0.95] tracking-[-0.03em]"
        style={tone("var(--ink)")}
      >
        Or we build it together.
      </h2>

    </>
  );
}

/** The photograph, or the film, in its 4:5 frame. */
function PortraitFrame() {
  const common = "absolute inset-0 h-full w-full object-cover";
  const style = {
    objectPosition: PORTRAIT.position ?? "center",
    // A hair of warmth taken out and a hair of contrast put in, so the image
    // sits ON the warm paper instead of glowing off it.
    filter: "saturate(0.92) contrast(1.02)",
  };

  return (
    <figure data-t2-frame className="relative w-full">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px]"
        style={{ border: "1px solid var(--hairline)" }}
      >
        <div data-t2-media className="absolute inset-0 will-change-transform">
          {PORTRAIT.kind === "video" ? (
            <video
              className={common}
              style={style}
              src={PORTRAIT.src}
              poster={PORTRAIT.poster}
              aria-label={PORTRAIT.alt}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- house idiom, local asset
            <img
              className={common}
              style={style}
              src={PORTRAIT.src}
              alt={PORTRAIT.alt}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        {/* The one thing that keeps the frame from reading as a sticker: a
            faint clay wash in the corner nearest the type, so the picture and
            the words share a light source. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 100%, rgba(206,70,49,0.14) 0%, rgba(206,70,49,0) 62%)",
          }}
        />
      </div>
    </figure>
  );
}

export function SuperhumanTogether() {
  const scope = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  const arm = useCallback(() => setArmed(true), []);

  /* ------------------------------------------------------------------ the
     arrival. One timeline, fired once, at reading pace. */
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Nothing moves, so there is nothing to wait for.
      setArmed(true);
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const head = root.querySelector<HTMLElement>("[data-t2-stage]");
        const frame = root.querySelector<HTMLElement>("[data-t2-frame]");
        const media = root.querySelector<HTMLElement>("[data-t2-media]");
        const rules = gsap.utils.toArray<HTMLElement>("[data-t2-rule]");
        const ways = gsap.utils.toArray<HTMLElement>("[data-t2-way]");
        const act = root.querySelector<HTMLElement>("[data-t2-act]");

        // Set the resting state up front rather than relying on `from`: a
        // `from` leaves everything painted at full until the trigger fires,
        // which on a fast scroll shows the finished section for a frame and
        // then wipes it.
        if (head) gsap.set(head, { clipPath: "inset(100% 0% 0% 0%)" });
        if (frame) gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
        if (media) gsap.set(media, { scale: 1.18 });
        gsap.set(rules, { scaleX: 0 });
        gsap.set(ways, { opacity: 0, y: 22 });
        if (act) gsap.set(act, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 66%", once: true },
          onComplete: () => {
            // The clip has done its job. Leaving it at inset(0) keeps a live
            // clipping box around type whose descenders sit outside it, which
            // is what sliced the g in "together" clean off.
            gsap.set([head, frame].filter(Boolean), { clipPath: "none" });
            arm();
          },
        });

        // The words and the picture open together, the picture a beat behind,
        // so the eye is pulled left to right across the section once.
        tl.to(head, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, 0);
        tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25 }, 0.12);
        // The image un-scales over a longer beat than the wipe, so the frame
        // is still settling after it has finished opening.
        tl.to(media, { scale: 1, duration: 1.9, ease: "power2.out" }, 0.12);

        tl.to(
          rules,
          { scaleX: 1, duration: 0.95, ease: "power3.inOut", stagger: 0.1 },
          0.55,
        );
        tl.to(ways, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.68);
        tl.to(act, { opacity: 1, y: 0, duration: 0.7 }, 1.05);

        /* The drift. The picture moves against the scroll for the length of
           the section: a few percent, enough that it is never quite pinned to
           the type beside it. Scrubbed, so it is a function of position and
           costs nothing to reverse. */
        const drift = media
          ? gsap.fromTo(
              media,
              { yPercent: -3.5 },
              {
                yPercent: 3.5,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            )
          : null;

        return () => {
          drift?.scrollTrigger?.kill();
          drift?.kill();
        };
      }, root);

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
    };
  }, [arm]);

  /* ------------------------------------------------------------------ the
     pointer. Armed only once the section has finished arriving, and only for
     a real pointer that has not asked for less motion. */
  useEffect(() => {
    if (!armed) return;
    const stageEl = stage.current;
    const spot = spotlight.current;
    if (!stageEl || !spot) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The mask lives in the stage's own box, so the pointer has to be taken
    // out of viewport space. Cached: re-measuring on every move forces a
    // layout each time.
    let rect = stageEl.getBoundingClientRect();
    const remeasure = () => {
      rect = stageEl.getBoundingClientRect();
    };

    let size = 0;
    const place = (clientX: number, clientY: number, animate: boolean) => {
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;
      const to = {
        webkitMaskPosition: `${x}px ${y}px`,
        maskPosition: `${x}px ${y}px`,
      };
      if (animate) {
        gsap.to(spot, {
          ...to,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.set(spot, to);
      }
    };

    const onMove = (e: PointerEvent) => place(e.clientX, e.clientY, true);

    const onEnter = (e: PointerEvent) => {
      size = SPOT_SIZE;
      // Seed the position at the final size BEFORE growing, so the circle
      // opens under the cursor instead of sliding in from wherever it was.
      place(e.clientX, e.clientY, false);
      gsap.to(spot, {
        webkitMaskSize: `${SPOT_SIZE}px`,
        maskSize: `${SPOT_SIZE}px`,
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      size = 0;
      gsap.to(spot, {
        webkitMaskSize: "0px",
        maskSize: "0px",
        duration: 0.4,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    stageEl.addEventListener("pointerenter", onEnter);
    stageEl.addEventListener("pointermove", onMove, { passive: true });
    stageEl.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      stageEl.removeEventListener("pointerenter", onEnter);
      stageEl.removeEventListener("pointermove", onMove);
      stageEl.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      gsap.killTweensOf(spot);
    };
  }, [armed]);

  return (
    <section
      ref={scope}
      id="one-to-one"
      data-sh-section={SECTION_LABELS.together}
      className="relative flex w-full flex-col justify-center px-6 pb-[22vh] pt-16 md:pb-36 md:pt-24 lg:min-h-[100svh] lg:py-28"
    >
      {/* Three blocks. On a wide screen the portrait takes the right column
          and spans both rows beside the type; stacked, it sits between the
          headline and the detail, so a phone lands on the offer and then on
          the face without having to scroll past a wall of words first. */}
      <div className="mx-auto grid w-full max-w-6xl gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:gap-y-0">
        {/* ---- the headline, and the only thing on this page that answers
                the pointer ---- */}
        <div
          ref={stage}
          data-t2-stage
          data-cursor-hide
          className="relative order-1 lg:order-none lg:col-span-7"
        >
          <Head />

          {/* The clay copy: the same words, clipped to a circle that follows
              the cursor. Hidden from assistive tech — it IS the layer below. */}
          <div
            ref={spotlight}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage: MASK,
              maskImage: MASK,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "0px",
              maskSize: "0px",
            }}
          >
            <Head accent />
          </div>
        </div>

        {/* ---- the portrait ---- */}
        {/* Capped and centred while the layout is stacked: at full width a 4:5
            frame on a tablet is nearly a whole screen of photograph, which
            takes the section over instead of anchoring it. The cap is above
            the widest phone, so on a phone nothing changes. */}
        <div className="order-2 mx-auto w-full max-w-[420px] lg:order-none lg:col-span-5 lg:row-span-2 lg:mx-0 lg:max-w-none lg:self-center">
          <PortraitFrame />
        </div>

        {/* ---- the two ways, and the ask ---- */}
        <div className="order-3 lg:order-none lg:col-span-7">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mt-14">
            {WAYS.map((way) => (
              <div key={way.label}>
                <span
                  aria-hidden
                  data-t2-rule
                  className="block h-[2px] w-full origin-left"
                  style={{ background: CLAY, opacity: 0.85 }}
                />
                <div data-t2-way className="pt-6">
                  <Specimen id={way.mark} className="h-auto w-full max-w-[16rem]" />
                  <h3
                    className="mt-5 font-serif text-[1.5rem] leading-none tracking-tight md:text-[1.8rem]"
                    style={{ color: "var(--ink)" }}
                  >
                    {way.label}
                  </h3>
                  <p
                    className="mt-3 max-w-[28ch] text-[1.02rem] leading-[1.6]"
                    style={{ color: "rgba(11,31,58,0.66)" }}
                  >
                    {way.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            data-t2-act
            className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
          >
            <a
              href={mailto("One to one")}
              className="group inline-flex items-center gap-2.5 bg-[var(--ink)] px-7 py-4 text-[0.95rem] text-[var(--paper)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              Tell me what you are building
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {/* Turning work away is the cheapest credibility available here. */}
            <p className="max-w-[23ch] text-pretty text-[0.95rem] leading-relaxed text-[color:rgba(11,31,58,0.5)]">
              If I am not the right person, I will tell you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
