"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The Road So Far — the centred winding Line (the design Tobia preferred),
 * carrying the tighter funnel COPY. A single thin ink line draws itself down
 * the MIDDLE of the section as you scroll (SVG stroke-dashoffset, scrubbed),
 * winding wide left↔right through one dot per beat. Pins ALTERNATE sides on
 * desktop; on mobile they hang right of a left-edge spine. Entrances settle
 * once (rise + unblur); the line is the only scroll-tied motion.
 *
 * COPY = the compounding through-line (funnel spec §2): a kid building real
 * things → an agency at 15 → Miami → real AI work now → a major company pays
 * him for exactly this. The SEQUENCE is the proof; no single beat carries it.
 * `accent` marks the LIVE beat (the payoff) — its dot earns the sky accent.
 */
type Beat = {
  when: string;
  phrase: string;
  sub: string;
  accent?: boolean;
};

const BEATS: Beat[] = [
  {
    when: "a kid",
    phrase: "Built real things.",
    sub: "drones, 3D printers, anything I could make work",
  },
  {
    when: "at 15",
    phrase: "Started an agency.",
    sub: "a social-media agency, with paying clients",
  },
  {
    when: "at 18",
    phrase: "Left for Miami.",
    sub: "college in the US — graduated in three years",
  },
  {
    when: "now",
    phrase: "AI for businesses.",
    sub: "systems companies actually run on",
  },
  {
    when: "now",
    phrase: "A major company pays me.",
    sub: "to do exactly this",
    accent: true,
  },
];

// The track's vertical rhythm: beat i sits at these fractions of the track
// height (first/last keep margin for the line's entry/exit).
const yFrac = (i: number) => 0.05 + (0.9 * i) / (BEATS.length - 1);

// Deterministic horizontal sweep for the line's waypoints (no Math.random —
// SSR/hydration must match; the path itself is built client-side anyway).
// Wide on purpose: the road develops horizontally, not just down. Pins are
// anchored to these same offsets via --wob, so text rides the curve with its
// dot. Signs alternate with i%2 so the dot swings to the side OPPOSITE its
// text, keeping the words in the readable central band. Mobile uses 0.18×
// around a left-edge spine.
const WOBBLE = [120, -150, 135, -150, 115];

export function RoadSoFar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!track || !svg || !path) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let st: ScrollTrigger | null = null;

    // Build the path through the beat waypoints with smooth curves — dots and
    // text are positioned from the SAME fractions, so everything stays aligned
    // by construction at any size.
    const build = () => {
      const w = track.clientWidth;
      const h = track.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const mobile = w < 768;
      const baseX = mobile ? 36 : w / 2;

      // MUST mirror the pins' CSS: calc(50% + var(--wob)) desktop,
      // calc(36px + var(--wob)*0.18) mobile — dots sit on the line by
      // construction only if both sides share this math.
      const pts = BEATS.map((_, i) => ({
        x: baseX + (mobile ? WOBBLE[i] * 0.18 : WOBBLE[i]),
        y: yFrac(i) * h,
      }));
      // Lead-in above the first dot and tail past the last one.
      const first = { x: baseX - (mobile ? 4 : 30), y: 0 };
      const last = { x: baseX + (mobile ? 4 : 24), y: h };
      const all = [first, ...pts, last];

      // Smooth catmull-rom-ish cubic through the waypoints.
      let d = `M ${all[0].x.toFixed(1)} ${all[0].y.toFixed(1)}`;
      for (let i = 1; i < all.length; i++) {
        const p0 = all[Math.max(0, i - 2)];
        const p1 = all[i - 1];
        const p2 = all[i];
        const p3 = all[Math.min(all.length - 1, i + 1)];
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      path.setAttribute("d", d);

      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = reduced ? "0" : `${len}`;

      st?.kill();
      if (!reduced) {
        st = ScrollTrigger.create({
          trigger: track,
          start: "top 75%",
          end: "bottom 70%",
          scrub: 0.8,
          onUpdate: (self) => {
            path.style.strokeDashoffset = `${len * (1 - self.progress)}`;
          },
        });
      }
    };

    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    // Pins settle in once as they enter (rise + unblur). IntersectionObserver,
    // NOT a per-pin ScrollTrigger: the intro loader's teardown forces a
    // ScrollTrigger refresh, and an instant jump into the section right after
    // it (fast scroll, nav anchor click) left `once` triggers stale — pins
    // stuck invisible. IO fires on actual visibility, however you arrived.
    // (The line scrub above keeps ScrollTrigger; it's progress-mapped, so
    // refresh timing can't strand it.)
    const pins = Array.from(track.querySelectorAll("[data-pin]")) as HTMLElement[];
    let io: IntersectionObserver | null = null;
    if (!reduced) {
      gsap.set(pins, { opacity: 0, y: 16, filter: "blur(5px)" });
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            io?.unobserve(entry.target);
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power3.out",
              // ONLY the animated props — clearProps:"all" wipes the whole
              // inline style, including the `top`/`--wob` that POSITION the
              // pin (revealed pins collapsed into one stacked heap).
              clearProps: "opacity,transform,filter",
            });
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
      );
      pins.forEach((pin) => io?.observe(pin));
    }

    return () => {
      window.removeEventListener("resize", onResize);
      st?.kill();
      io?.disconnect();
      gsap.killTweensOf(pins);
    };
  }, []);

  return (
    <section id="road" className="paper-bg relative">
      {/* Sticky scope: header + track. The headline stays pinned while the
          road scrolls beneath it. */}
      <div className="relative">
        <div
          className="pointer-events-none sticky top-0 z-20 px-6 pb-10 pt-24 text-center md:pt-28"
          style={{
            // Solid paper at the top fading out — passing pins melt under the
            // pinned headline instead of colliding with it.
            background:
              "linear-gradient(to bottom, #faf8f2 0%, #faf8f2 70%, rgba(250,248,242,0) 100%)",
          }}
        >
          <div className="mx-auto max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-ink/35">
              The road so far
            </span>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
              No single thing proves it. The order does.
            </h2>
          </div>
        </div>

        {/* The track: the Line + its pins, all positioned from shared
            fractions + the shared --wob horizontal offsets. */}
        <div
          ref={trackRef}
          className="relative mx-auto h-[160vh] max-w-3xl px-6 md:h-[150vh]"
        >
          <svg
            ref={svgRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="#0b1f3a"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {BEATS.map((b, i) => {
            const left = i % 2 === 0; // text sits on this side of its dot
            return (
              <div
                key={i}
                data-pin
                className="absolute left-[calc(50%_+_var(--wob))] max-md:left-[calc(36px_+_var(--wob)*0.18)]"
                style={
                  {
                    top: `${(yFrac(i) * 100).toFixed(2)}%`,
                    "--wob": `${WOBBLE[i]}px`,
                  } as React.CSSProperties
                }
              >
                {/* The dot — exactly on the waypoint, the wrapper's anchor.
                    The live beat earns the sky accent; the rest stay ink. */}
                <span
                  aria-hidden
                  className={
                    "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full " +
                    (b.accent
                      ? "h-[9px] w-[9px] bg-accent-sky ring-4 ring-accent-sky/15"
                      : "h-2 w-2 bg-ink/70")
                  }
                />
                {/* The words ride beside their dot, out into the curve. */}
                <div
                  className={
                    "absolute top-0 w-[250px] -translate-y-1/2 max-md:left-5 max-md:right-auto max-md:w-[230px] max-md:text-left " +
                    (left ? "right-5 text-right" : "left-5 text-left")
                  }
                >
                  <span
                    className={
                      "font-mono text-[10px] uppercase tracking-[0.4em] " +
                      (b.accent ? "text-accent-deep" : "text-ink/35")
                    }
                  >
                    {b.when}
                  </span>
                  <h3 className="mt-1.5 font-serif text-2xl tracking-tight text-ink md:text-3xl">
                    {b.phrase}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed tracking-wide text-ink/45">
                    {b.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
