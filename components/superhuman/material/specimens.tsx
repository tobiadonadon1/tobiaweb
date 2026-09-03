/**
 * THE MARKS.
 *
 * The first version of this file drew each folder as a sample of its own
 * contents: Skills as a skill file, Guides as the opening of a guide. It was
 * a nice idea and it was not a drawing. Tobia, on seeing it: "some simple
 * writing with some orange lines, not designed. It has no texture, it has no
 * real meaning, it has no icon, it has no rememberability, and it all looks
 * the same." All true. Text set inside a frame is a layout, and four layouts
 * in one grid read as one layout repeated.
 *
 * WHAT THESE ARE INSTEAD. Cut paper. Every shape here is an irregular polygon
 * with a deliberately uneven edge, laid over and under other shapes the way
 * you would lay torn paper on a table. Three things make that read:
 *
 *   1. NO SHAPE IS GEOMETRIC. There is not one true rectangle or circle in
 *      this file. Every edge wanders by a few units, because a straight edge
 *      is a machine's edge and the whole point is that a hand made this.
 *   2. COLOUR IS THE IDENTITY. Each mark has a colour signature you could
 *      pick out of a grid from across the room with the titles covered. That
 *      is what rememberability actually is.
 *   3. TEXTURE IS REAL, not implied. A grain filter runs over each
 *      composition so the fills have tooth instead of being flat vector.
 *
 * WHY NOT PHOTOGRAPHS OR ICON FONTS. The rest of the site is drawn rather
 * than shot, and a lucide glyph at 200px is a line drawing with no weight. A
 * cut shape at 200px is a poster.
 *
 * NO HOOKS. These render inside server components, so filter ids are derived
 * from the mark's own id rather than from useId. Two marks never share a
 * document-level id because no page draws the same mark twice.
 */

/* ------------------------------------------------------------------ *
 * THE PALETTE.
 *
 * Five colours, all of which sit on warm paper without arguing with it. The
 * site had exactly one accent before this (clay) and one accent cannot make a
 * grid of four look like four different things. Ultramarine and saffron are
 * the two that do the most work: they are the far ends of the wheel from each
 * other and both hold their own against the paper.
 * ------------------------------------------------------------------ */
const INK = "#0b1f3a";
const VERMILION = "#ce4631";
const ULTRAMARINE = "#2743b8";
const SAFFRON = "#e0952b";
const FOREST = "#1f6b4f";

/** Under-shadow for a cut edge. Paper on paper still casts something. */
const SHADE = "rgba(11,31,58,0.13)";

/* ------------------------------------------------------------------ *
 * CUT SHAPES, in their own unit space, placed with transforms.
 *
 * Each is a closed polygon whose vertices wander off the true figure by a few
 * units. They are hand written rather than generated, because a random jitter
 * looks like noise and a chosen one looks like a decision.
 * ------------------------------------------------------------------ */

/** A card, roughly 200 x 150, torn on all four sides. */
const CARD =
  "M7 12 L33 3 L61 10 L93 2 L127 11 L157 3 L186 10 L197 34 L189 62 L198 92 L190 120 L197 145 L167 153 L135 144 L103 152 L71 142 L41 151 L11 145 L2 119 L10 91 L1 63 L9 37 Z";

/** A disc, roughly 140 across, cut rather than compassed. */
const DISC =
  "M69 1 L83 6 L96 4 L110 15 L120 26 L131 34 L135 49 L131 61 L139 72 L132 86 L124 97 L125 110 L110 118 L98 126 L86 133 L71 131 L58 138 L45 130 L33 124 L22 118 L15 106 L5 97 L3 83 L1 69 L6 55 L3 43 L13 32 L20 20 L33 14 L44 6 L57 7 Z";

/** A long bar, torn along its length. */
const BAR =
  "M4 5 L38 1 L72 7 L107 2 L141 8 L176 1 L211 7 L245 2 L277 8 L280 18 L272 28 L243 32 L210 26 L177 33 L142 26 L108 32 L73 25 L39 33 L6 26 L1 16 Z";

/** A wedge. The only shape here that points at anything. */
const WEDGE =
  "M5 2 L34 17 L63 31 L92 46 L120 61 L91 76 L62 90 L33 105 L2 119 L8 90 L3 60 L9 31 Z";

/** A small fleck, for the fragments in the reviewer's field. */
const FLECK =
  "M3 4 L12 1 L21 5 L31 1 L38 7 L36 14 L40 21 L35 28 L38 35 L28 37 L19 33 L10 38 L3 32 L5 25 L1 18 L4 11 Z";

/* ------------------------------------------------------------------ *
 * GRAIN.
 *
 * feTurbulence multiplied back over the source, which gives the fills tooth
 * without changing their colour identity. The filter region is clipped to the
 * source, and baseFrequency is high enough that it reads as paper rather than
 * as clouds. One filter per composition, not one per shape: the cost is in
 * the number of filter regions, and a mark with nine shapes would otherwise
 * pay nine times.
 * ------------------------------------------------------------------ */
function Grain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.62"
        numOctaves="4"
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix in="noise" type="saturate" values="0" result="grey" />
      <feComponentTransfer in="grey" result="soft">
        <feFuncA type="linear" slope="0.26" />
      </feComponentTransfer>
      <feComposite operator="in" in="soft" in2="SourceGraphic" result="clipped" />
      <feBlend mode="multiply" in="SourceGraphic" in2="clipped" />
    </filter>
  );
}

/** One cut shape, placed. `s` scales the shape's own unit space. */
function Cut({
  d,
  x,
  y,
  s = 1,
  sy,
  fill,
  rotate = 0,
  opacity = 1,
}: {
  d: string;
  x: number;
  y: number;
  s?: number;
  /** Second axis. A card scaled 0.3 by 1.4 is a column, and torn paper is
      allowed to be any proportion, so stretching the edge is honest here. */
  sy?: number;
  fill: string;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s} ${sy ?? s})`}
      opacity={opacity}
    >
      <path d={d} fill={fill} />
    </g>
  );
}

/* ================================================================== *
 * THE FOUR ROOM CELLS.
 * ================================================================== */

/**
 * SKILLS — three cut cards, fanned, one per skill.
 *
 * The count is the meaning: three cards, three skills. They overlap because a
 * skill sits on top of how the agent already behaves rather than beside it.
 */
function Skills() {
  return (
    <>
      <Cut d={CARD} x={22} y={128} s={0.72} fill={SHADE} rotate={-11} />
      <Cut d={CARD} x={14} y={120} s={0.72} fill={ULTRAMARINE} rotate={-11} />
      <Cut d={CARD} x={144} y={98} s={0.76} fill={SHADE} rotate={-2} />
      <Cut d={CARD} x={137} y={90} s={0.76} fill={SAFFRON} rotate={-2} />
      <Cut d={CARD} x={266} y={72} s={0.8} fill={SHADE} rotate={7} />
      <Cut d={CARD} x={259} y={64} s={0.8} fill={VERMILION} rotate={7} />
    </>
  );
}

/**
 * GUIDES — a road, cut rather than drawn, with three stops on it.
 *
 * The site's own motif is a single line that ends in a dot. This is that line
 * with weight: a torn band crossing the frame, and one disc per guide sitting
 * on it. The last disc is vermilion because the last one is where you get to.
 */
function Guides() {
  return (
    <>
      <Cut d={BAR} x={4} y={214} s={1.42} fill={SHADE} rotate={-15} />
      <Cut d={BAR} x={0} y={206} s={1.42} fill={ULTRAMARINE} rotate={-15} />
      <Cut d={DISC} x={40} y={150} s={0.52} fill={FOREST} />
      <Cut d={DISC} x={150} y={104} s={0.58} fill={SAFFRON} />
      <Cut d={DISC} x={268} y={44} s={0.72} fill={VERMILION} />
    </>
  );
}

/**
 * VIDEOS — a cut frame with a wedge in it, and the strip beneath.
 *
 * Ink and one accent only, and the frame is empty. Nothing in this folder is
 * shot, and the mark should not suggest otherwise.
 */
function Videos() {
  return (
    <>
      <Cut d={CARD} x={44} y={40} s={1.5} fill={SHADE} rotate={-1} />
      <Cut d={CARD} x={38} y={34} s={1.5} fill={INK} rotate={-1} />
      <Cut d={WEDGE} x={172} y={96} s={0.86} fill={VERMILION} rotate={2} />
      {[34, 128, 222, 316].map((x, i) => (
        <Cut
          key={x}
          d={FLECK}
          x={x}
          y={272}
          s={1.6}
          rotate={i % 2 === 0 ? -4 : 3}
          fill={i === 0 ? SAFFRON : "rgba(11,31,58,0.2)"}
        />
      ))}
    </>
  );
}

/**
 * SETUPS — plates, stacked. The one that everything reads first is on top and
 * in vermilion; the rest are the layers it governs.
 */
function Setups() {
  return (
    <>
      <Cut d={BAR} x={44} y={252} s={1.12} fill={FOREST} rotate={-2} />
      <Cut d={BAR} x={62} y={202} s={1.0} fill={ULTRAMARINE} rotate={2} />
      <Cut d={BAR} x={48} y={150} s={1.06} fill={SAFFRON} rotate={-3} />
      <Cut d={BAR} x={70} y={104} s={0.86} fill={INK} rotate={2} />
      <Cut d={BAR} x={56} y={54} s={0.72} fill={VERMILION} rotate={-2} />
    </>
  );
}

/* ================================================================== *
 * THE THREE SKILL MARKS.
 *
 * These sit at the head of each column on the skills page, so they are read
 * side by side and have to be distinguishable at a glance with the titles
 * covered. One is a composition, one is two things fitting together, one is a
 * field with a fault in it.
 * ================================================================== */

/**
 * ART DIRECTOR — a composition.
 *
 * The mark for a skill about art direction should BE art directed: weight off
 * centre, one quadrant left alone, one scale jump, three colours where one
 * dominates. It is the only mark here that overlaps three colours, because it
 * is the only skill about arranging things.
 */
function ArtDirector() {
  return (
    <>
      <Cut d={DISC} x={26} y={40} s={1.06} fill={SHADE} />
      <Cut d={DISC} x={20} y={34} s={1.06} fill={VERMILION} />
      <Cut d={CARD} x={128} y={112} s={0.66} fill={ULTRAMARINE} rotate={-7} />
      <Cut d={BAR} x={44} y={196} s={0.62} fill={SAFFRON} rotate={5} />
      <Cut d={FLECK} x={210} y={44} s={1.1} fill={INK} rotate={-8} />
    </>
  );
}

/**
 * PRODUCT MANAGER — two shapes that have to fit.
 *
 * A cut form with a bite out of it and the piece that fills the bite, sitting
 * just short of home. That gap is the whole skill: two people who think they
 * agree, and the distance between them, found before anything is built.
 */
function ProductManager() {
  return (
    <>
      <Cut d={CARD} x={26} y={54} s={0.98} fill={SHADE} rotate={-3} />
      <Cut d={CARD} x={20} y={48} s={0.98} fill={INK} rotate={-3} />
      {/* The bite, knocked out in paper so it reads as absence. */}
      <Cut d={DISC} x={126} y={128} s={0.62} fill="#faf8f2" />
      {/* The piece that fits it, not yet home. */}
      <Cut d={DISC} x={218} y={168} s={0.6} fill={SAFFRON} />
      <Cut d={BAR} x={40} y={252} s={0.44} fill={VERMILION} rotate={2} />
    </>
  );
}

/**
 * CODE REVIEWER — a field with one fault in it.
 *
 * Twelve flecks laid in rows, eleven in ink and one in vermilion, lifted out
 * of line and turned. Finding the one thing that is actually wrong, in a field
 * of things that are fine, is the skill. Nothing else in it is coloured,
 * because the point is that only one thing should be.
 */
function CodeReviewer() {
  const cols = [30, 108, 186, 264];
  const rows = [52, 132, 212];
  return (
    <>
      {rows.map((y, r) =>
        cols.map((x, c) => {
          const fault = r === 1 && c === 2;
          if (fault) return null;
          return (
            <Cut
              key={`${r}-${c}`}
              d={FLECK}
              x={x}
              y={y}
              s={1.5}
              rotate={((r + c) % 3) - 1}
              fill={INK}
              opacity={0.88}
            />
          );
        }),
      )}
      {/* The fault: lifted, turned, and the only colour on the mark. */}
      <Cut d={FLECK} x={188} y={118} s={1.9} rotate={-14} fill={SHADE} />
      <Cut d={FLECK} x={182} y={112} s={1.9} rotate={-14} fill={VERMILION} />
    </>
  );
}

/* ================================================================== *
 * THE THREE GUIDE MARKS.
 *
 * Same language as the skills, different silhouettes. The six marks are drawn
 * to be told apart from each other as well as from their own neighbours: no
 * two of them share a dominant form. Skills are cards, a bitten shape and a
 * field; guides are a structure, a size comparison and a funnel.
 * ================================================================== */

/**
 * SET UP THE TOOLS — a thing built, standing on its footing.
 *
 * Three columns of different heights on one base. The base is the machine you
 * already own, the columns are the three installs, and they are different
 * heights because the guide's whole argument is that they are not equal work.
 * The only architectural mark in the set.
 */
function SetUpTheTools() {
  return (
    <>
      <Cut d={CARD} x={58} y={142} s={0.3} sy={0.96} fill={SHADE} rotate={-1} />
      <Cut d={CARD} x={52} y={136} s={0.3} sy={0.96} fill={INK} rotate={-1} />

      <Cut d={CARD} x={134} y={82} s={0.34} sy={1.36} fill={SHADE} rotate={1} />
      <Cut d={CARD} x={128} y={76} s={0.34} sy={1.36} fill={SAFFRON} rotate={1} />

      <Cut d={CARD} x={216} y={110} s={0.31} sy={1.16} fill={SHADE} rotate={-1} />
      <Cut d={CARD} x={210} y={104} s={0.31} sy={1.16} fill={VERMILION} rotate={-1} />

      {/* The footing, laid last so it sits in front of the columns' feet. */}
      <Cut d={BAR} x={22} y={278} s={1.34} fill={SHADE} rotate={-1} />
      <Cut d={BAR} x={16} y={272} s={1.34} fill={ULTRAMARINE} rotate={-1} />
    </>
  );
}

/**
 * PICK THE MODEL — three sizes on one line.
 *
 * The only quantity that actually changes between models is how much thinking
 * you are buying, so the mark is a size comparison and nothing else. The
 * middle one is vermilion because the middle one is the answer most of the
 * time, and a picture whose point is "default to this" should say which.
 *
 * No band under them, unlike the road in the room's Guides cell: these sit on
 * an implied line so the two marks cannot be confused at a glance.
 */
function PickTheModel() {
  return (
    <>
      <Cut d={DISC} x={50} y={206} s={0.42} fill={SHADE} />
      <Cut d={DISC} x={44} y={200} s={0.42} fill={INK} />

      <Cut d={DISC} x={138} y={164} s={0.72} fill={SHADE} />
      <Cut d={DISC} x={132} y={158} s={0.72} fill={VERMILION} />

      <Cut d={DISC} x={256} y={122} s={1.02} fill={SHADE} />
      <Cut d={DISC} x={250} y={116} s={1.02} fill={ULTRAMARINE} />
    </>
  );
}

/**
 * FIND THE IDEA — many things, then one.
 *
 * Scattered flecks across the top are everything it could still turn out to
 * be. The wedge is the narrowing. The single vermilion disc at its point is
 * the one sentence you can start on Monday. It is the only mark in the set
 * that reads top to bottom, because the guide is about a sequence.
 */
function FindTheIdea() {
  const flecks = [36, 108, 176, 248, 318];
  return (
    <>
      {flecks.map((x, i) => (
        <Cut
          key={x}
          d={FLECK}
          x={x}
          y={30 + (i % 2) * 14}
          s={1.15}
          rotate={(i % 3) * 6 - 6}
          fill={i === 2 ? SAFFRON : INK}
          opacity={0.8}
        />
      ))}

      <Cut d={WEDGE} x={286} y={82} s={1.42} fill={SHADE} rotate={90} />
      <Cut d={WEDGE} x={280} y={76} s={1.42} fill={ULTRAMARINE} rotate={90} />

      <Cut d={DISC} x={171} y={246} s={0.46} fill={SHADE} />
      <Cut d={DISC} x={165} y={240} s={0.46} fill={VERMILION} />
    </>
  );
}

/* ================================================================== *
 * THE THREE FAMILIES ON THE SHELF.
 *
 * Not folders and not skills: these are the three things Construct sells or
 * gives away, and they sit side by side on the Construct page. Same cut paper,
 * same palette, and again no two share a dominant form.
 * ================================================================== */

/**
 * MATERIAL — a sheet with its corner lifted, and what is under it.
 *
 * The free one, and the only one you can open today, so the mark is the only
 * one in the set that is OPEN: the top sheet is peeled back and there is
 * colour underneath. Everything else on this shelf is still shut.
 */
function FamilyMaterial() {
  return (
    <>
      <Cut d={CARD} x={40} y={72} s={1.24} fill={SHADE} rotate={-4} />
      <Cut d={CARD} x={34} y={66} s={1.24} fill={ULTRAMARINE} rotate={-4} />
      {/* The lifted corner, and the saffron showing through it. */}
      <Cut d={CARD} x={202} y={128} s={0.66} fill={SAFFRON} rotate={19} />
      <Cut d={DISC} x={44} y={190} s={0.58} fill={VERMILION} />
      <Cut d={DISC} x={300} y={232} s={0.3} fill={FOREST} />
      <Cut d={FLECK} x={296} y={54} s={1.35} fill="currentColor" rotate={-12} />
    </>
  );
}

/**
 * MASTERCLASS — one thing, held, and shut.
 *
 * Ten minutes and one advanced move, and it does not exist yet. The wedge is
 * nearly as big as the form holding it, because the whole family is a single
 * technique taken to the end rather than a survey. The bar laid across it is
 * the only thing on this shelf that closes something.
 */
function FamilyMasterclass() {
  return (
    <>
      <Cut d={DISC} x={40} y={52} s={1.62} fill={SHADE} />
      <Cut d={DISC} x={34} y={46} s={1.62} fill="currentColor" />
      <Cut d={WEDGE} x={158} y={104} s={1.2} fill={SAFFRON} rotate={5} />
      {/* Laid across, and the only vermilion on the mark. */}
      <Cut d={BAR} x={26} y={250} s={1.3} fill={VERMILION} rotate={-5} />
    </>
  );
}

/**
 * DESIGN — a page, cut into its parts.
 *
 * Templates you ship as they are, so the mark is a layout: a masthead, two
 * unequal columns, a foot. The columns are 7 and 5 rather than 6 and 6,
 * because a template that splits its page in half is the template nobody
 * wants, and the mark should look made by somebody who knows that. The disc
 * is the one thing on it that is not a box, which is what stops three
 * rectangles reading as a wireframe.
 */
function FamilyDesign() {
  return (
    <>
      <Cut d={BAR} x={30} y={54} s={1.26} fill={VERMILION} rotate={-2} />
      <Cut d={CARD} x={34} y={104} s={0.9} sy={1.06} fill={SHADE} rotate={-1} />
      <Cut d={CARD} x={30} y={100} s={0.9} sy={1.06} fill={ULTRAMARINE} rotate={-1} />
      <Cut d={CARD} x={246} y={104} s={0.56} sy={1.06} fill={SHADE} rotate={3} />
      <Cut d={CARD} x={242} y={100} s={0.56} sy={1.06} fill={SAFFRON} rotate={3} />
      <Cut d={DISC} x={252} y={228} s={0.54} fill={FOREST} />
      <Cut d={BAR} x={30} y={286} s={0.72} fill="currentColor" rotate={2} />
    </>
  );
}

/* ================================================================== *
 * THE TWO WAYS OF WORKING TOGETHER.
 *
 * A pair, meant to be read against each other: the same two pieces, arranged
 * two ways.
 * ================================================================== */

/**
 * SIDE BY SIDE — two pieces, level, joined.
 *
 * Same size, same baseline, overlapping where they meet, with a bar laid
 * across both. Neither is in front. That is the offer.
 */
function WaySideBySide() {
  return (
    <>
      <Cut d={CARD} x={26} y={78} s={0.86} fill={SHADE} rotate={-2} />
      <Cut d={CARD} x={20} y={72} s={0.86} fill={VERMILION} rotate={-2} />
      <Cut d={CARD} x={186} y={78} s={0.86} fill={SHADE} rotate={2} />
      <Cut d={CARD} x={180} y={72} s={0.86} fill={ULTRAMARINE} rotate={2} />
      {/* Laid across both, which is the only thing making them a pair. */}
      <Cut d={BAR} x={44} y={222} s={1.12} fill={SAFFRON} rotate={-1} />
    </>
  );
}

/**
 * HAND IT OVER — the same two pieces, one carrying the other.
 *
 * The large form is finished work and it has moved to your side. The small one
 * is what you gave me to start with. The bar runs one way now instead of lying
 * across both, because this arrangement has a direction and the other does not.
 */
function WayHandOver() {
  return (
    <>
      <Cut d={CARD} x={24} y={116} s={0.46} fill={SHADE} rotate={-4} />
      <Cut d={CARD} x={18} y={110} s={0.46} fill={VERMILION} rotate={-4} />
      <Cut d={CARD} x={166} y={64} s={1.06} fill={SHADE} rotate={2} />
      <Cut d={CARD} x={160} y={58} s={1.06} fill={INK} rotate={2} />
      <Cut d={BAR} x={30} y={244} s={1.2} fill={SAFFRON} rotate={-2} />
      <Cut d={FLECK} x={330} y={232} s={1.4} fill={SAFFRON} rotate={-10} />
    </>
  );
}

const MARKS: Record<string, () => React.ReactElement> = {
  // the room
  skills: Skills,
  guides: Guides,
  videos: Videos,
  setups: Setups,
  // the skills themselves
  "art-director": ArtDirector,
  "product-manager": ProductManager,
  "code-reviewer": CodeReviewer,
  // the guides
  "set-up-the-tools": SetUpTheTools,
  "pick-the-model": PickTheModel,
  "find-the-idea": FindTheIdea,
  // the three families on the Construct shelf
  // the two ways of working one to one
  "way-side-by-side": WaySideBySide,
  "way-hand-it-over": WayHandOver,
  // the three families on the Construct shelf
  "family-material": FamilyMaterial,
  "family-masterclass": FamilyMasterclass,
  "family-design": FamilyDesign,
};

export function Specimen({ id, className }: { id: string; className?: string }) {
  const Composition = MARKS[id];
  if (!Composition) return null;
  const grainId = `grain-${id}`;

  return (
    <svg
      viewBox="0 0 400 330"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={className}
    >
      <defs>
        <Grain id={grainId} />
      </defs>
      <g filter={`url(#${grainId})`}>
        <Composition />
      </g>
    </svg>
  );
}
