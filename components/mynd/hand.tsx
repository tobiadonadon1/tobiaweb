/**
 * MYND, DRAWN BY HAND.
 *
 * Two things live here: the frame every card is inside, and the flat marks
 * that sit at the top of them.
 *
 * THE FRAME IS NOT A BORDER. A CSS border is one weight all the way round and
 * perfectly square at the corners, which is the fastest way to make a page of
 * cards look like a dashboard. This is a stroked path pushed off its own line
 * by a turbulence displacement, so it wanders the way a hand does and thickens
 * slightly on the turns. Tobia: "squares with squiggly lines, as if they were
 * designed by hand. That would be crazy, much cooler."
 *
 * IT STRETCHES, and that is on purpose. The frame is drawn in a square and
 * laid into whatever rectangle the card turns out to be with
 * `preserveAspectRatio="none"`, so a wide card's wobble is a wider wobble. A
 * hand drawing a long box does exactly that. The stroke itself is held at a
 * true weight with `vector-effect`, so only the WANDER stretches, never the
 * line.
 *
 * THE MARKS ARE FLAT AND BIG, in the manner of the reference: one saturated
 * shape per card, no gradients, no detail, readable across a room. What the
 * reference does with clean vector, these do with the same wobble as the
 * frame, so the illustration and the box around it were made by the same hand.
 *
 * NO HOOKS. Filter ids come from a required `id` prop, because two of these
 * on one page must not share one.
 */

const CLAY = "#e0512a";
const GREEN = "#1f6b4a";
const BLUE = "#2a52d6";
const GOLD = "#e8a41f";
const INK = "#17130f";

/** The wander. One definition, used by the frame and by every mark. */
function Wobble({ id, scale = 1.6 }: { id: string; scale?: number }) {
  return (
    <filter id={id} x="-12%" y="-12%" width="124%" height="124%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.05"
        numOctaves="3"
        seed="11"
        result="n"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

/**
 * The box. Absolute, behind the card's content, so the type on top of it is
 * never touched by the filter.
 */
export function HandFrame({
  id,
  color = INK,
  weight = 1.6,
  className = "",
}: {
  id: string;
  color?: string;
  weight?: number;
  className?: string;
}) {
  const f = `hand-frame-${id}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        {/* Small, and high frequency. The frame is drawn in a square and
            stretched into whatever rectangle the card is, so the wander is
            stretched too: what looks like a gentle wobble at 1:1 becomes a
            doubled line on a tall card. This is the largest value that still
            reads as one drawn line at every card shape on the page. */}
        <Wobble id={f} scale={0.45} />
      </defs>
      <rect
        x="1.2"
        y="1.2"
        width="97.6"
        height="97.6"
        rx="4"
        fill="none"
        stroke={color}
        strokeWidth={weight}
        // Only the wander stretches with the card. The line stays a line.
        vectorEffect="non-scaling-stroke"
        filter={`url(#${f})`}
      />
    </svg>
  );
}

/* ================================================================== *
 * THE MARKS. Flat, saturated, one idea each.
 * ================================================================== */

/** SCATTERED — what the company knows, and where it actually is. */
function Scatter() {
  return (
    <>
      <rect x="8" y="14" width="26" height="22" rx="2" fill={CLAY} />
      <rect x="44" y="8" width="18" height="18" rx="2" fill={GOLD} />
      <rect x="72" y="18" width="22" height="14" rx="2" fill={BLUE} />
      <rect x="14" y="48" width="16" height="16" rx="2" fill={GREEN} />
      <rect x="40" y="42" width="30" height="20" rx="2" fill={INK} />
      <rect x="78" y="52" width="14" height="20" rx="2" fill={CLAY} />
      <rect x="22" y="74" width="24" height="14" rx="2" fill={BLUE} />
      <rect x="56" y="72" width="18" height="18" rx="2" fill={GOLD} />
    </>
  );
}

/** CONNECT — four sources arriving at one place. */
function Connect() {
  return (
    <>
      {[14, 32, 50, 68].map((y, i) => (
        <rect key={y} x="6" y={y} width={26 + i * 3} height="9" rx="2" fill={BLUE} />
      ))}
      <rect x="46" y="10" width="10" height="76" rx="2" fill={INK} />
      <rect x="62" y="26" width="32" height="44" rx="3" fill={CLAY} />
    </>
  );
}

/** CAPTURE — the thing nobody wrote down, said out loud and kept. */
function Capture() {
  return (
    <>
      <rect x="8" y="10" width="72" height="52" rx="6" fill={GOLD} />
      <path d="M26 62 L26 84 L48 62 Z" fill={GOLD} />
      <rect x="24" y="26" width="40" height="7" rx="2" fill={INK} />
      <rect x="24" y="40" width="26" height="7" rx="2" fill={INK} />
    </>
  );
}

/** ANSWER — ask it anything, and the whole history answers back. */
function Answer() {
  return (
    <>
      <circle cx="42" cy="46" r="34" fill="none" stroke={GREEN} strokeWidth="11" />
      <circle cx="42" cy="46" r="12" fill={GREEN} />
      <rect x="64" y="66" width="34" height="11" rx="3" fill={CLAY} transform="rotate(38 64 66)" />
    </>
  );
}

/** AUTOMATE — the repetitive work, taken. */
function Automate() {
  return (
    <>
      {[8, 30, 52, 74].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={i === 3 ? 22 : 34}
          width="17"
          height={i === 3 ? 56 : 32}
          rx="2"
          fill={i === 3 ? CLAY : INK}
        />
      ))}
      <rect x="8" y="86" width="83" height="7" rx="2" fill={BLUE} />
    </>
  );
}

/** FILM — the walkthrough. */
function Film() {
  return (
    <>
      <rect x="6" y="14" width="88" height="60" rx="5" fill={BLUE} />
      <path d="M40 32 L40 58 L66 45 Z" fill="#f2eee7" />
      <rect x="6" y="82" width="34" height="8" rx="2" fill={CLAY} />
    </>
  );
}

const MARKS: Record<string, () => React.ReactElement> = {
  scatter: Scatter,
  connect: Connect,
  capture: Capture,
  answer: Answer,
  automate: Automate,
  film: Film,
};

export function HandMark({
  id,
  name,
  className = "",
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const Drawing = MARKS[name];
  if (!Drawing) return null;
  const f = `hand-mark-${id}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <Wobble id={f} scale={1.7} />
      </defs>
      <g filter={`url(#${f})`}>
        <Drawing />
      </g>
    </svg>
  );
}
