"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Lock } from "lucide-react";
import { RAY_LOCAL_SHAPE, STAR_CORE_D, STAR_RAYS, RAY_COUNT } from "./superhuman-star";
import {
  SHELF,
  SHELF_RULE_RAY,
  CLOSE_RULE_RAY,
  shelfHref,
  type ShelfFamily,
} from "./shelf-data";
import { SECTION_LABELS } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ *
 * SECTION 4, THE PEAK. Anchor: full bleed grid, on ink.
 *
 * THE SIGNATURE MOVE: the star is the shelf.
 *
 * Eight rays leave the mark and fly to eight measured boxes in the layout.
 * The two longest become the long rules that open and close the shelf, the
 * next three stand on their ends as the cards' leading rules, and the three
 * shortest become the short rules above each card's way in. Rule assignment
 * is by LENGTH, so the star's asymmetry is not decoration here: it is the
 * reason each rule is as long as it is.
 *
 * How it is driven: ONE ScrollTrigger, on one scrubbed proxy number, whose
 * update calls a single pure `render(p)`. Every ray, the core, the heading
 * and the three cards are positioned from that one number. Nothing owns its
 * own tween, nothing owns a rAF, and re-measuring on refresh is all a
 * resize needs.
 *
 * How it ends: each ray HANDS OFF. Once it has flattened onto its box it
 * fades out over the real element underneath, which fades in, identical in
 * place, length, weight and colour. After that the rules are ordinary DOM
 * with ordinary CSS, so hover and resize behave like hover and resize.
 *
 * Below 1024px, and under reduced motion, none of this runs: the cards are
 * simply there, and the rules are the plain elements they always were.
 * ------------------------------------------------------------------ */

/** Where each ray starts moving, and for how long, in units of progress. */
const FLIGHT_START = 0.13;
const FLIGHT_STAGGER = 0.045;
const FLIGHT_DUR = 0.34;
/** A ray flies as a needle and only flattens once it is nearly home. */
const MORPH_LAG = 0.17;
const MORPH_DUR = 0.26;
/** Ray colour in flight, and once it has settled into being furniture.
 *  Full opacity in flight is not a style choice: the core sits UNDER the
 *  eight quads and shows through their antialiased shared edges, so any
 *  alpha below 1 draws eight faint seams out of the middle of the star. */
const RAY_ALPHA_FLIGHT = 1;
const RAY_ALPHA_RULE = 0.5;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smoothStep = (p: number) => p * p * (3 - 2 * p);
/** Crisp in, crisp out. The rays move like a mechanism, not a balloon. */
const snap = (p: number) =>
  p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Shortest way round, so a ray never takes the long route to its rule. */
const shortestTurn = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

type Target = { x: number; y: number; angle: number; len: number; th: number };

/* ------------------------------------------------------------------ *
 * THE CARDS ANSWER THE POINTER.
 *
 * The shelf's own move belongs to the scroll: eight rays fly out of the mark
 * and become the furniture. That happens once, on the way in, and then the
 * section sat completely still — three flat rectangles of type on navy, and
 * nothing on the page said that they were the doors to three different
 * things.
 *
 * So each card is now an object with a face. It tilts a few degrees away from
 * the cursor on two axes and lifts towards the reader as it does. Small
 * numbers on purpose: at ±5 degrees this reads as a card being handled, and
 * anywhere past about eight it reads as a novelty.
 *
 * THE TILT IS THE WHOLE EFFECT. There was a soft light tracking the pointer
 * across each card as well, and it had to go: the shelf has no card borders
 * and no card fills, so a glow bounded by the card's box was the one thing on
 * the section drawing a rectangle nobody had asked to see. It lit the
 * container instead of the contents. The tilt moves the type itself, which is
 * the only thing actually there.
 *
 * WHY THE TILT IS ON AN INNER ELEMENT. The scroll-in writes `transform`
 * straight onto `[data-shelf-card]` every frame, and re-measures by clearing
 * it. A second thing writing transforms on the same node would fight it, and
 * would be wiped on the next refresh. The tilt owns `[data-shelf-tilt]`
 * INSIDE it, so the two never touch the same property on the same element.
 *
 * Fine pointers only, and never under reduced motion.
 * ------------------------------------------------------------------ */
const TILT_DEG = 5;
const TILT_LIFT = 14;

function useCardTilt(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-shelf-tilt]"),
        );
        const cleanups = cards.map((card) => {
          // quickTo keeps one interpolator per property per card, so a move
          // event is a number write rather than a new tween every frame.
          const rx = gsap.quickTo(card, "rotationX", {
            duration: 0.5,
            ease: "power3.out",
          });
          const ry = gsap.quickTo(card, "rotationY", {
            duration: 0.5,
            ease: "power3.out",
          });
          const z = gsap.quickTo(card, "z", {
            duration: 0.5,
            ease: "power3.out",
          });

          const onMove = (event: PointerEvent) => {
            const r = card.getBoundingClientRect();
            // -1 to 1 from the middle of the card, on each axis.
            const px = (event.clientX - r.left) / r.width - 0.5;
            const py = (event.clientY - r.top) / r.height - 0.5;
            ry(px * TILT_DEG * 2);
            rx(-py * TILT_DEG * 2);
          };

          const onEnter = () => z(TILT_LIFT);

          const onLeave = () => {
            rx(0);
            ry(0);
            z(0);
          };

          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointermove", onMove, { passive: true });
          card.addEventListener("pointerleave", onLeave);

          return () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
            gsap.killTweensOf(card);
            gsap.set(card, { clearProps: "rotationX,rotationY,z,transform" });
          };
        });

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => {
      mm.revert();
    };
  }, [scope]);
}

export function SuperhumanShelf() {
  const scope = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const coreRef = useRef<SVGGElement>(null);
  const groups = useRef<(SVGGElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);

  useCardTilt(scope);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const wrapper = root.querySelector<HTMLElement>("[data-shelf-wrapper]");
        const stage = root.querySelector<HTMLElement>("[data-shelf-stage]");
        const svg = svgRef.current;
        const core = coreRef.current;
        const head = root.querySelector<HTMLElement>("[data-shelf-head]");
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-shelf-card]"),
        );
        const ruleEls = STAR_RAYS.map((_, i) =>
          root.querySelector<HTMLElement>(`[data-rule-ray="${i}"]`),
        );
        if (!wrapper || !stage || !svg || !core || !head) return;

        const fading = [head, ...cards];

        /* ---- measurement, re-run on every ScrollTrigger refresh ---- */
        const targets: (Target | null)[] = new Array(RAY_COUNT).fill(null);
        let cx = 0;
        let cy = 0;
        let R = 200;

        const measure = () => {
          // Measure the layout AT REST. A card may be mid-flight when a
          // refresh lands, and a rule's box has to be where it will finally
          // be, not where the animation currently has it.
          cards.forEach((card) => {
            card.style.transform = "";
          });

          const sr = stage.getBoundingClientRect();
          if (!sr.width || !sr.height) return;
          // One SVG user unit is one CSS pixel. That is what lets a ray be
          // placed exactly on a box measured with getBoundingClientRect.
          svg.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);
          R = gsap.utils.clamp(140, 250, Math.min(sr.width, sr.height) * 0.3);
          cx = sr.width / 2;
          cy = sr.height * 0.5;

          ruleEls.forEach((el, i) => {
            if (!el) {
              targets[i] = null;
              return;
            }
            const r = el.getBoundingClientRect();
            const vertical = r.height > r.width;
            targets[i] = vertical
              ? {
                  x: r.left - sr.left + r.width / 2,
                  y: r.top - sr.top,
                  angle: 90,
                  len: r.height,
                  th: r.width,
                }
              : {
                  x: r.left - sr.left,
                  y: r.top - sr.top + r.height / 2,
                  angle: 0,
                  len: r.width,
                  th: r.height,
                };
          });
        };

        /* ---- the morph: six points, needle to rule ---- */
        const pathFor = (i: number, t: Target, m: number) => {
          const shape = RAY_LOCAL_SHAPE[i];
          const L = shape.length * R;
          // The needle's tip is a point. Give it a hair of width so both
          // shapes carry the same six vertices and the lerp stays honest.
          const eps = 0.0018 * R;
          const h = t.th / 2;
          // The two core corners keep their fractional position along the
          // ray, so the change reads as a flatten and not as a slide.
          const fa = (shape.a.x / shape.length) * t.len;
          const fb = (shape.b.x / shape.length) * t.len;
          const tip = lerp(L, t.len, m);

          const pts: [number, number][] = [
            [0, lerp(-eps, -h, m)],
            [lerp(shape.a.x * R, fa, m), lerp(shape.a.y * R, -h, m)],
            [tip, lerp(-eps, -h, m)],
            [tip, lerp(eps, h, m)],
            [lerp(shape.b.x * R, fb, m), lerp(shape.b.y * R, h, m)],
            [0, lerp(eps, h, m)],
          ];
          return `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;
        };

        /* ---- one function, one number in ---- */
        const render = (p: number) => {
          const windup = -9 * smoothStep(clamp01(p / FLIGHT_START));

          for (let i = 0; i < RAY_COUNT; i++) {
            const g = groups.current[i];
            const path = paths.current[i];
            const t = targets[i];
            if (!g || !path || !t) continue;

            const fStart = FLIGHT_START + i * FLIGHT_STAGGER;
            const f = snap(clamp01((p - fStart) / FLIGHT_DUR));
            const mStart = fStart + MORPH_LAG;
            const m = smoothStep(clamp01((p - mStart) / MORPH_DUR));

            const a0 = STAR_RAYS[i].angle + windup;
            const angle = a0 + shortestTurn(t.angle - a0) * f;
            g.setAttribute(
              "transform",
              `translate(${lerp(cx, t.x, f).toFixed(2)} ${lerp(cy, t.y, f).toFixed(2)}) rotate(${angle.toFixed(2)})`,
            );
            path.setAttribute("d", pathFor(i, t, m));
            path.setAttribute(
              "fill-opacity",
              lerp(RAY_ALPHA_FLIGHT, RAY_ALPHA_RULE, m).toFixed(3),
            );

            // The handoff.
            const hand = smoothStep(
              clamp01((p - (mStart + MORPH_DUR * 0.78)) / (MORPH_DUR * 0.5)),
            );
            g.setAttribute("opacity", (1 - hand).toFixed(3));
            const el = ruleEls[i];
            if (el) el.style.opacity = hand.toFixed(3);
          }

          const coreOut = smoothStep(
            clamp01((p - FLIGHT_START) / (FLIGHT_STAGGER * 2.2)),
          );
          core.setAttribute(
            "transform",
            `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${(R * (1 - 0.35 * coreOut)).toFixed(2)})`,
          );
          core.setAttribute("opacity", (1 - coreOut).toFixed(3));

          const h = smoothStep(clamp01((p - 0.02) / 0.13));
          head.style.opacity = h.toFixed(3);
          head.style.transform = `translate3d(0,${(14 * (1 - h)).toFixed(2)}px,0)`;

          cards.forEach((card, k) => {
            const c = smoothStep(clamp01((p - (0.47 + k * 0.07)) / 0.2));
            card.style.opacity = c.toFixed(3);
            card.style.transform = `translate3d(0,${(22 * (1 - c)).toFixed(2)}px,0)`;
          });
        };

        /* ---- setup ---- */
        gsap.set(svg, { opacity: 1 });
        gsap.set([...ruleEls.filter(Boolean), ...fading] as HTMLElement[], {
          opacity: 0,
        });
        measure();

        const proxy = { p: 0 };
        const tween = gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => render(proxy.p),
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              measure();
              render(self.progress);
            },
          },
        });
        render(0);

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          // render() writes inline styles directly, which gsap has no
          // record of, so put them back by hand.
          for (const el of [...fading, ...ruleEls]) {
            if (!el) continue;
            el.style.opacity = "";
            el.style.transform = "";
          }
        };
      },
    );

    // Measuring before the webfonts land measures the wrong layout, and
    // every rule would come to rest a few pixels off its box.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={scope} id="shelf" data-sh-section={SECTION_LABELS.shelf}>
      {/* THE ONE INK BAND ON THE PAGE, and it belongs to the catalogue.
          It used to run on past the shelf and carry the one-to-one on the same
          navy, with no seam between them. That is exactly why the one-to-one
          did not land: two different offers, one unbroken dark stretch, and
          the reader could not tell where the product stopped and the person
          started. The ink now melts back to paper at the FOOT of the shelf,
          so the page reads paper, paper, paper, INK (what you can buy off a
          shelf), paper (the human), paper. Both edges melt; neither cuts. */}
      <div className="ink-grain relative bg-[var(--ink)]">
        <span aria-hidden className="melt-to-paper-t" />
        {/* Where the ground is SOLID navy, i.e. below the top melt. The
            compass watches this to decide whether to draw itself in paper
            tones or ink ones. */}
        <span
          aria-hidden
          data-sh-ink
          className="pointer-events-none absolute inset-x-0 bottom-[17vh] top-[17vh]"
        />
        <div aria-hidden className="h-[19vh]" />

        {/* The pin exists to give the rays room to fly. If they are not
            going to fly (reduced motion, narrow screen), the tall wrapper
            would just be two and a half screens of dead scroll, so it is
            gated on exactly the same condition the animation is. */}
        <div
          data-shelf-wrapper
          className="relative motion-safe:lg:h-[340vh]"
        >
          <div
            data-shelf-stage
            className="relative z-10 flex flex-col justify-center px-6 py-24 motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-screen motion-safe:lg:py-[max(4.5rem,7vh)]"
          >
            {/* The rays, in a space where one unit is one pixel. */}
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <g ref={coreRef}>
                <path d={STAR_CORE_D} fill="var(--accent-sky)" />
              </g>
              {STAR_RAYS.map((_, i) => (
                <g
                  key={i}
                  ref={(el) => {
                    groups.current[i] = el;
                  }}
                >
                  <path
                    ref={(el) => {
                      paths.current[i] = el;
                    }}
                    fill="var(--accent-sky)"
                    fillOpacity={RAY_ALPHA_FLIGHT}
                  />
                </g>
              ))}
            </svg>

            <div className="relative mx-auto w-full max-w-6xl">
              <h2
                data-shelf-head
                className="max-w-[16ch] font-serif text-[clamp(2.25rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-0.02em] text-[var(--paper)]"
              >
                The shelf, so far.
              </h2>

              {/* Ray 0, the longest on the star, becomes the longest rule. */}
              <Rule ray={SHELF_RULE_RAY} className="mt-6 h-[1.5px] w-full" />

              {/* A CARD IS A DOOR AGAIN, and this time there is something
                  behind it.

                  It was a door once, to three routes that each carried three
                  hundred words and an email field, which was three pages of
                  reading to leave one address. So the field came onto the
                  card and the routes went. That was right while the three
                  families were three flavours of the same free thing.

                  They are not any more. One is free and open, one is paid and
                  locked, one is paid and being built, and each has real
                  contents that a card cannot hold. So the card is a door
                  again — name, one line, what it costs, where it has got to —
                  and everything else lives at /projects/superhuman/[shelf],
                  which is generated from the same data this card reads.

                  The subgrid went with the field. It existed to absorb a card
                  growing when its action turned into an input; nothing grows
                  now, so three flex columns with the action pushed to the
                  bottom do the same job with none of the machinery. */}
              <div className="mt-11 grid grid-cols-1 gap-y-12 lg:mt-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                {SHELF.map((family) => (
                  <ShelfCard key={family.id} family={family} />
                ))}
              </div>

              {/* Ray 3, the second longest, closes the shelf. */}
              <Rule ray={CLOSE_RULE_RAY} className="mt-11 h-[1.5px] w-full lg:mt-9" />
            </div>
          </div>
        </div>

        {/* Room for the melt to run in. The last rule of the shelf must never
            be set in half-dissolved navy, so the air here is taller than the
            17vh the gradient occupies. */}
        <div aria-hidden className="h-[26vh]" />

        {/* The ink lets go, and the person on paper begins. */}
        <span aria-hidden className="melt-to-paper-b" />
      </div>
    </section>
  );
}

/**
 * One door on the shelf: a name, a sentence, a rule, a way in.
 *
 * The whole card is the link, so there is no small "read more" to aim at.
 * Nothing else is on it — no chip, no status, no price — except on the one
 * family you cannot open, which carries a single LOCKED stamp in its corner.
 *
 * The tilt is applied to the inner <Link> and never to the <article>, which
 * belongs to the scroll-in. See useCardTilt.
 */
function ShelfCard({ family }: { family: ShelfFamily }) {
  const locked = family.tier === "locked";

  return (
    <article
      data-shelf-card
      className="group relative h-full [perspective:1200px]"
    >
      {/* The card's leading rule: one ray, stood on its end. */}
      <Rule
        ray={family.spineRay}
        className="absolute left-0 top-0 h-full w-[2px]"
      />

      <Link
        href={shelfHref(family.id)}
        data-shelf-tilt
        className="relative flex h-full flex-col pb-6 pl-6 pr-4 pt-1 [transform-style:preserve-3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-sky)]"
      >
        {/* ONE CHIP ON THE WHOLE SHELF.

            There were three — FREE, LOCKED, TEMPLATES — each with a line of
            status beside it, and together they turned three doors into a
            pricing table. Two of them said nothing the sentence underneath
            did not already say, and the status beside them said it a third
            time. A marker earns its space when it changes what you can DO,
            and only one of these does: this one cannot be opened.

            It sits on the name's own baseline rather than above it or in the
            card's corner. Above it, the two cards without a chip would ride a
            row higher than the one with it; in the corner it floated in the
            gutter and read as though it belonged to the card to its right.
            Beside the name it can only belong to the name, and the row's
            height is set by the heading, so nothing moves. */}
        <div className="flex items-baseline gap-3">
          <h3 className="font-serif text-[1.9rem] leading-none tracking-tight text-[var(--paper)]">
            {family.name}
          </h3>
          {locked ? (
            <span className="inline-flex items-center gap-1.5 border border-[rgba(207,233,238,0.3)] px-2 py-1 font-mono text-[0.66rem] uppercase leading-none tracking-[0.14em] text-[color:rgba(214,238,244,0.62)]">
              <Lock aria-hidden className="h-3 w-3" />
              {family.tag}
            </span>
          ) : null}
        </div>

        <p className="mt-4 max-w-[26ch] text-[1.05rem] leading-[1.5] text-[color:rgba(214,238,244,0.86)]">
          {family.line}
        </p>

        {/* Pushes the rule and the way in to the foot of every card, so the
            three line up however long the sentences above them run. */}
        <span aria-hidden className="grow" />

        <Rule
          ray={family.dividerRay}
          className="mt-8 h-[2px] w-14 lg:mt-10"
        />

        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.95rem] text-[var(--accent-sky)]">
          {family.cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </article>
  );
}

/**
 * A rule that a ray lands on. It is a real element with a real background,
 * so the page reads correctly with no JavaScript, on a phone, and under
 * reduced motion. On a wide screen the peak borrows it, then gives it back.
 * No opacity transition here: the handoff writes opacity every frame.
 */
function Rule({ ray, className }: { ray: number; className?: string }) {
  return (
    <span
      aria-hidden
      data-rule-ray={ray}
      className={`block bg-[rgba(56,189,248,0.5)] transition-colors duration-500 group-focus-within:bg-[rgba(56,189,248,0.95)] group-hover:bg-[rgba(56,189,248,0.95)] ${className ?? ""}`}
    />
  );
}
