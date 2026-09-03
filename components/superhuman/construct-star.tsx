/**
 * THE CONSTRUCT MARK.
 *
 * A NEW SYMBOL, replacing the derived eight ray star entirely. That one was
 * built from angles measured off a photograph and rendered as clean vector
 * geometry, and however much it was fattened and recoloured it stayed a
 * computed object. This one is the thing Tobia actually drew: a seven point
 * star in blue crayon with a second, smaller seven point star filled in red
 * inside it, the two turned against each other so the red points sit in the
 * blue star's gaps.
 *
 * WHAT MAKES IT LOOK DRAWN, and none of it is decoration:
 *
 *   1. NO POINT IS WHERE MATHS WOULD PUT IT. Every tip and every valley
 *      carries a fixed offset in both radius and angle. A regular seven point
 *      star is unmistakably machine made; a hand cannot place seven points
 *      evenly and does not try.
 *   2. THE EDGES WANDER. A turbulence displacement pushes the whole outline
 *      off its own path by a few units, which is what a crayon does when it
 *      crosses paper tooth. This is the single thing that separates "drawn"
 *      from "vector with rounded joins".
 *   3. THE STROKE IS NOT ONE WEIGHT. Round caps and joins, and the wobble
 *      makes the line read thicker on the turns, the way a wax stick loads up
 *      where the hand slows.
 *   4. GRAIN. Wax sits on the high points of the paper and misses the low
 *      ones, so both layers carry tooth rather than being flat fills.
 *
 * IT DOES NOT ROTATE. Anywhere. The old mark span in the compass dial, which
 * is exactly the sort of thing a computed mark can do and a drawn one cannot:
 * a spinning hand drawing looks like a sticker on a fan. Tobia: "Don't make
 * it rotate."
 *
 * NO HOOKS, so filter ids come from a required `id` prop rather than useId.
 * Two marks on one page must not share one, and the caller is the only thing
 * that knows how many there are.
 */

/** Straight off the drawing. Not the site palette: this mark keeps its own. */
export const STAR_BLUE = "#2B4BC4";
export const STAR_RED = "#E8261D";

/* ------------------------------------------------------------------ *
 * GEOMETRY.
 *
 * Seven tips and seven valleys, alternating, in a 100 x 100 box centred on
 * (50, 50). The jitter tables are the drawing's own unevenness, written down
 * once: same numbers every render, on the server and in the browser, so the
 * mark can never differ between the two.
 * ------------------------------------------------------------------ */

const POINTS = 7;
const CX = 50;
const CY = 50;

/** Per tip: radius multiplier, then angular nudge in degrees. */
const OUTER_TIP_R = [1.0, 0.94, 1.03, 0.97, 1.01, 0.93, 0.99];
const OUTER_TIP_A = [0, 4.5, -3, 2.5, -4, 3.5, -2];
const OUTER_VAL_R = [0.44, 0.41, 0.46, 0.42, 0.45, 0.4, 0.43];
const OUTER_VAL_A = [-3, 2, -1.5, 3, -2.5, 1.5, -3.5];

const INNER_TIP_R = [0.79, 0.74, 0.82, 0.75, 0.78, 0.73, 0.8];
const INNER_TIP_A = [-2.5, 3, -4, 2, -3, 4.5, -1.5];
const INNER_VAL_R = [0.37, 0.33, 0.39, 0.34, 0.38, 0.32, 0.36];
const INNER_VAL_A = [2, -3, 1.5, -2, 3.5, -1, 2.5];

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const at = (r: number, deg: number, scale: number) =>
  `${(CX + r * scale * Math.cos(rad(deg))).toFixed(2)} ${(
    CY +
    r * scale * Math.sin(rad(deg))
  ).toFixed(2)}`;

/**
 * One star, as a closed path. `spin` turns the whole thing, which is how the
 * red star ends up sitting in the blue one's gaps rather than on top of its
 * points. `scale` is the outer radius in box units.
 */
function starPath(
  spin: number,
  scale: number,
  tipR: number[],
  tipA: number[],
  valR: number[],
  valA: number[],
): string {
  const step = 360 / POINTS;
  const pts: string[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    pts.push(at(tipR[i], spin + i * step + tipA[i], scale));
    pts.push(at(valR[i], spin + i * step + step / 2 + valA[i], scale));
  }
  return `M${pts.join("L")}Z`;
}

/** The blue one. Drawn as an outline, so it is the bigger of the two. */
export const OUTER_STAR_D = starPath(
  0,
  44,
  OUTER_TIP_R,
  OUTER_TIP_A,
  OUTER_VAL_R,
  OUTER_VAL_A,
);

/**
 * The red one, turned 26 degrees against the blue. That angle is the whole
 * composition: at 0 the two stars line up and the mark reads as one star with
 * a red middle, and at 360/7/2 = 25.7 the red points land squarely in the blue
 * star's valleys, which is what the drawing does.
 */
export const INNER_STAR_D = starPath(
  26,
  44,
  INNER_TIP_R,
  INNER_TIP_A,
  INNER_VAL_R,
  INNER_VAL_A,
);

export function ConstructStar({
  id,
  className,
  /** Stroke weight of the blue outline, in box units. */
  weight = 3.1,
  title,
}: {
  id: string;
  className?: string;
  weight?: number;
  title?: string;
}) {
  const crayon = `cs-crayon-${id}`;
  const tooth = `cs-tooth-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      // The displacement pushes the outline past the nominal box, so the
      // drawing is allowed out of it rather than being clipped square.
      style={{ overflow: "visible" }}
      {...(title
        ? { role: "img" as const, "aria-label": title }
        : { "aria-hidden": true as const })}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* THE HAND. Turbulence displacing the geometry is what makes a path
            look like it was dragged rather than plotted. `scale` is in box
            units, so at 2.2 on a 100 unit box every edge wanders by about two
            percent of the mark's width, which is roughly what a wax stick
            does over paper tooth. */}
        <filter id={crayon} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.034"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* THE WAX. Pigment sits on the high points of the paper and misses
            the low ones, so neither layer is a flat fill. */}
        <filter id={tooth} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed="3"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="soft">
            <feFuncA type="linear" slope="0.42" />
          </feComponentTransfer>
          <feComposite operator="in" in="soft" in2="SourceGraphic" result="clip" />
          <feBlend mode="multiply" in="SourceGraphic" in2="clip" />
        </filter>
      </defs>

      <g filter={`url(#${tooth})`}>
        <g filter={`url(#${crayon})`}>
          {/* Blue first and underneath, because in the drawing the red sits
              on top of it and covers the outline where they cross. */}
          <path
            className="cs-outline"
            d={OUTER_STAR_D}
            fill="none"
            stroke={STAR_BLUE}
            strokeWidth={weight}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* NOT CONCENTRIC. In the drawing the red sits a little up and
              left of the blue, because a hand starting a second shape inside
              a first one does not find the centre. Two degrees of that is the
              difference between drawn and generated. */}
          <path
            className="cs-fill"
            d={INNER_STAR_D}
            fill={STAR_RED}
            transform="translate(-1.6 -1.1)"
          />
        </g>
      </g>
    </svg>
  );
}
