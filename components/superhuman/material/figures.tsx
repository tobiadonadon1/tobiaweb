/**
 * DRAWN FIGURES FOR THE GUIDES.
 *
 * The guides needed pictures and none of the subjects can be photographed. A
 * context window filling up is not a thing you can point a camera at, and the
 * alternative every site reaches for, a stock photograph of somebody at a
 * laptop, would be the one dishonest object on the page.
 *
 * So they are drawn, in the same ink and clay as everything else, and each one
 * has to earn its space by carrying information the paragraph next to it does
 * not. A picture that restates the sentence above it is decoration.
 *
 * NO INVENTED PRECISION. None of these carry a percentage, a benchmark or a
 * price. Numbers go out of date the week after they are published and a
 * diagram is the hardest place to correct one. They show SHAPE: the order of
 * things, what is bigger than what, where a threshold sits. That stays true.
 *
 * NO HOOKS. These render inside server components.
 *
 * Geometry is 640 x X, the width of the reading column when it breaks its
 * measure, so the type inside a figure lands near the page's own small size.
 */

const INK = "#0b1f3a";
const CLAY = "#ce4631";
/**
 * The same clay, darkened until it passes AA at figure-label size, and as the
 * GROUND under paper-coloured text. #ce4631 is 4.35:1 on paper, which clears
 * the 3:1 bar for display type and misses 4.5:1 for anything you read.
 */
const CLAY_TEXT = "#b93a26";
const RULE = "rgba(11,31,58,0.2)";
const FILL_SOFT = "rgba(11,31,58,0.1)";
const FILL_MID = "rgba(11,31,58,0.26)";
const MUTED = "rgba(11,31,58,0.68)";

/** The figures' one type size, so four drawings agree with each other. */
function L({
  x,
  y,
  children,
  fill = MUTED,
  size = 13,
  anchor = "start",
  weight = 400,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fontFamily="var(--font-host)"
      letterSpacing="-0.005em"
    >
      {children}
    </text>
  );
}

/** A tiny uppercase label, the site's fact voice. */
function Tag({ x, y, children, fill = MUTED }: { x: number; y: number; children: React.ReactNode; fill?: string }) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize="10.5"
      fontWeight="500"
      fontFamily="var(--font-host)"
      letterSpacing="0.14em"
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ *
 * THE CONTEXT WINDOW, AND WHAT COMPACTING DOES TO IT.
 *
 * Two bars and an arrow. The top bar is a session that has run long: the
 * fixed cost at the front, the conversation eating the middle, and the
 * shrinking free space at the end, with the threshold marked where answers
 * start to drift rather than at a number nobody can verify. The bottom bar is
 * the same session after a compact: the conversation replaced by a summary
 * of itself, and the room back.
 * ------------------------------------------------------------------ */
function ContextWindow() {
  return (
    <svg viewBox="0 0 640 310" aria-hidden className="h-auto w-full">
      <Tag x={0} y={14}>A LONG SESSION</Tag>

      {/* ---- bar one ---- */}
      <rect x="0" y="30" width="640" height="42" fill="none" stroke={RULE} strokeWidth="1.5" />
      <rect x="0" y="30" width="118" height="42" fill={CLAY_TEXT} />
      <rect x="118" y="30" width="394" height="42" fill={FILL_MID} />
      <line x1="118" y1="30" x2="118" y2="72" stroke="#faf8f2" strokeWidth="1.5" />
      <line x1="512" y1="30" x2="512" y2="72" stroke={RULE} strokeWidth="1.5" />

      <L x={8} y={57} fill="#faf8f2" size={12} weight={500}>Rules, files</L>
      <L x={126} y={57} fill={INK} size={12}>Everything you have said and it has said</L>
      <L x={520} y={57} size={12}>Free</L>

      {/* ---- the threshold ---- */}
      <line x1="430" y1="76" x2="430" y2="98" stroke={CLAY} strokeWidth="1.5" />
      <L x={430} y={114} fill={CLAY_TEXT} size={12.5} anchor="middle" weight={500}>
        Answers start drifting well before it is full
      </L>

      {/* ---- the move ---- */}
      <line x1="60" y1="140" x2="60" y2="196" stroke={RULE} strokeWidth="1.5" />
      <path d="M54 188 L60 198 L66 188" fill="none" stroke={RULE} strokeWidth="1.5" />
      <rect x="76" y="152" width="112" height="30" fill="none" stroke={INK} strokeWidth="1.5" />
      <L x={132} y={172} fill={INK} size={13.5} anchor="middle" weight={500}>/compact</L>
      <L x={200} y={172} size={12.5}>replaces the middle with a summary of itself</L>

      {/* ---- bar two ---- */}
      <Tag x={0} y={228}>AFTER COMPACTING</Tag>
      <rect x="0" y="244" width="640" height="42" fill="none" stroke={RULE} strokeWidth="1.5" />
      <rect x="0" y="244" width="118" height="42" fill={CLAY_TEXT} />
      <rect x="118" y="244" width="104" height="42" fill={FILL_SOFT} />
      <line x1="118" y1="244" x2="118" y2="286" stroke="#faf8f2" strokeWidth="1.5" />
      <line x1="222" y1="244" x2="222" y2="286" stroke={RULE} strokeWidth="1.5" />

      <L x={8} y={271} fill="#faf8f2" size={12} weight={500}>Rules, files</L>
      <L x={126} y={271} fill={INK} size={12}>Summary</L>
      <L x={230} y={271} size={12}>Free again, and sharp again</L>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * WHICH MODEL, AND WHAT IT COSTS YOU TO PICK WRONG.
 *
 * Three rows. Bar length is how much thinking the model will do, and the row
 * says the kind of job that repays it. The middle one is in clay because the
 * middle one is the answer most of the time, and a diagram whose whole point
 * is "default to this" should say which one that is.
 * ------------------------------------------------------------------ */
function ModelLadder() {
  const rows: [string, number, string, boolean][] = [
    ["Small and fast", 150, "Renames, formatting, one obvious edit, reading a file back", false],
    ["The middle one", 340, "Almost everything. Features, debugging, a page, a refactor", true],
    ["The big one", 520, "Architecture, a bug three files deep, work you cannot check yourself", false],
  ];

  return (
    <svg viewBox="0 0 640 236" aria-hidden className="h-auto w-full">
      <Tag x={0} y={14}>HOW MUCH THINKING YOU ARE BUYING</Tag>

      {rows.map(([name, w, use, lead], i) => {
        const y = 44 + i * 68;
        return (
          <g key={name}>
            <L x={0} y={y + 2} fill={lead ? CLAY_TEXT : INK} size={14} weight={500}>
              {name}
            </L>
            <rect
              x="0"
              y={y + 12}
              width={w}
              height="14"
              fill={lead ? CLAY : FILL_MID}
            />
            <rect
              x={w}
              y={y + 12}
              width={560 - w}
              height="14"
              fill="none"
              stroke={RULE}
              strokeWidth="1"
            />
            <L x={0} y={y + 46} size={12.5}>
              {use}
            </L>
            {i < 2 ? (
              <line x1="0" y1={y + 58} x2="640" y2={y + 58} stroke="rgba(11,31,58,0.1)" strokeWidth="1" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * TWO AGENTS, AND THE PART THAT OVERLAPS.
 *
 * Rectangles rather than circles: a Venn diagram of two soft blobs is the
 * least Swiss object on the internet, and the overlap here is genuinely a
 * rectangle, because it is most of the work.
 * ------------------------------------------------------------------ */
function ToolSplit() {
  return (
    <svg viewBox="0 0 640 230" aria-hidden className="h-auto w-full">
      <rect x="0" y="30" width="330" height="150" fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x="270" y="30" width="370" height="150" fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x="270" y="30" width="60" height="150" fill="rgba(206,70,49,0.12)" />

      <Tag x={0} y={18} fill={INK}>ONE</Tag>
      <Tag x={556} y={18} fill={INK}>THE OTHER</Tag>

      <L x={16} y={68} fill={INK} size={13.5} weight={500}>Lives in your terminal</L>
      <L x={16} y={94} size={12.5}>Reads the whole project</L>
      <L x={16} y={116} size={12.5}>Runs commands and edits files</L>
      <L x={16} y={138} size={12.5}>Long jobs you walk away from</L>

      <L x={348} y={68} fill={INK} size={13.5} weight={500}>A second opinion</L>
      <L x={348} y={94} size={12.5}>Different training, different blind spots</L>
      <L x={348} y={116} size={12.5}>Useful when the first one is stuck</L>
      <L x={348} y={138} size={12.5}>Cheap to check one against the other</L>

      <L x={300} y={204} fill={CLAY_TEXT} size={12.5} anchor="middle" weight={500}>Most work</L>
      <line x1="300" y1="186" x2="300" y2="194" stroke={CLAY} strokeWidth="1.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * FROM AN IMPULSE TO SOMETHING YOU CAN START ON MONDAY.
 *
 * Four steps narrowing. The width is the number of things it could still turn
 * out to be, which is the actual quantity that changes as an idea gets good.
 * The last block is clay because it is the only one you can build.
 * ------------------------------------------------------------------ */
function IdeaFunnel() {
  const steps: [string, string, number, boolean][] = [
    ["An impulse", "Something bothers you. There is no shape to it yet", 620, false],
    ["One person", "Name who has this problem. One real person you could message", 448, false],
    ["One occasion", "The exact moment in their week when they hit it", 292, false],
    ["One sentence", "What they can do after, that they could not before", 168, true],
  ];

  return (
    <svg viewBox="0 0 640 344" aria-hidden className="h-auto w-full">
      <Tag x={0} y={12}>HOW MANY THINGS IT COULD STILL BE</Tag>

      {steps.map(([name, note, w, last], i) => {
        const y = 32 + i * 78;
        return (
          <g key={name}>
            <rect
              x="0"
              y={y}
              width={w}
              height="34"
              fill={last ? CLAY_TEXT : FILL_SOFT}
              stroke={last ? "none" : RULE}
              strokeWidth="1"
            />
            <L x={14} y={y + 22} fill={last ? "#faf8f2" : INK} size={14} weight={500}>
              {name}
            </L>
            {/* Below the bar, never beside it. */}
            <L x={0} y={y + 56} size={13}>
              {note}
            </L>
            {!last ? (
              <path d={`M8 ${y + 66} L8 ${y + 78}`} stroke={RULE} strokeWidth="1.5" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * SETUP ORDER — three installs, and the one that is not an install.
 *
 * The guide's argument is that the order matters and that the fourth step,
 * the one with no download attached, is the one everybody skips. So the
 * fourth block is drawn in clay and has no box round it: it is not a thing
 * you get, it is a thing you do.
 */
function SetupOrder() {
  const steps: [string, string, boolean][] = [
    ["Terminal", "You already have one", false],
    ["Editor", "To watch it work", false],
    ["The agent", "One line, one login", false],
    ["Ask it something you know", "The step everyone skips", true],
  ];
  return (
    <svg viewBox="0 0 640 250" aria-hidden className="h-auto w-full">
      <Tag x={0} y={12}>IN THIS ORDER</Tag>
      {steps.map(([name, note, last], i) => {
        const y = 34 + i * 52;
        return (
          <g key={name}>
            <rect
              x="0"
              y={y}
              width={last ? 268 : 176}
              height="34"
              fill={last ? CLAY_TEXT : "none"}
              stroke={last ? "none" : RULE}
              strokeWidth="1.5"
            />
            <L x={14} y={y + 22} fill={last ? "#faf8f2" : INK} size={14} weight={500}>
              {name}
            </L>
            <L x={last ? 288 : 196} y={y + 22} size={12.5}>
              {note}
            </L>
            {!last ? <path d={`M12 ${y + 36} L12 ${y + 52}`} stroke={RULE} strokeWidth="1.5" /> : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * THE PROJECT FILE — what it saves you, per session.
 *
 * Two columns of the same task: everything you retype every time on the left,
 * and the same job once the file exists on the right. The point of the picture
 * is the difference in height, so nothing else on it is coloured.
 */
function ProjectFile() {
  return (
    <svg viewBox="0 0 640 230" aria-hidden className="h-auto w-full">
      <Tag x={0} y={12}>WHAT YOU TYPE, EVERY SESSION</Tag>
      <Tag x={352} y={12}>WITH THE FILE</Tag>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="0" y={34 + i * 26} width={i % 2 ? 232 : 288} height="15" fill={FILL_MID} />
      ))}
      <L x={0} y={214} size={12.5}>Six things, again</L>

      <rect x="352" y="34" width="196" height="15" fill={CLAY_TEXT} />
      <L x={352} y={214} size={12.5}>One thing. The rest is on disk</L>

      <line x1="320" y1="24" x2="320" y2="196" stroke={RULE} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * THE SESSION — what actually happens to the answers over an hour.
 *
 * A line that climbs, holds, and falls, with the two moves marked where they
 * belong: compact at the top of the fall, start fresh once it has gone.
 * No axis numbers, because the shape is the claim and a number would be one.
 */
function SessionArc() {
  return (
    <svg viewBox="0 0 640 220" aria-hidden className="h-auto w-full">
      <Tag x={0} y={12}>HOW GOOD THE ANSWERS ARE</Tag>
      <line x1="0" y1="168" x2="640" y2="168" stroke={RULE} strokeWidth="1.5" />

      <path
        d="M0 128 C 60 62, 130 52, 210 56 C 300 60, 340 72, 396 104 C 452 136, 520 156, 640 162"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
      />

      {/* Where it turns. */}
      <line x1="396" y1="46" x2="396" y2="104" stroke={CLAY_TEXT} strokeWidth="1.5" />
      <circle cx="396" cy="104" r="5" fill={CLAY_TEXT} />
      <L x={406} y={52} fill={CLAY_TEXT} size={12.5} weight={500}>Compact here</L>
      <L x={406} y={70} size={12}>at a boundary you chose</L>

      <line x1="560" y1="70" x2="560" y2="158" stroke={RULE} strokeWidth="1.5" />
      <circle cx="560" cy="158" r="5" fill={INK} />
      <L x={452} y={196} size={12.5}>Past here, start a new one</L>

      <L x={0} y={196} size={12}>Fresh</L>
    </svg>
  );
}

/**
 * TWO ENDINGS — the part nobody can give you.
 *
 * One impulse, narrowed twice, arriving at two different specific ideas. Both
 * survive every cut in the guide; one of them is better. That gap is taste,
 * and the only way to draw it honestly is to draw both paths identically and
 * colour only the end, because nothing about the PROCESS distinguishes them.
 */
function TwoEndings() {
  return (
    <svg viewBox="0 0 640 240" aria-hidden className="h-auto w-full">
      <Tag x={0} y={12}>THE SAME IMPULSE, NARROWED TWICE</Tag>

      <rect x="252" y="30" width="136" height="30" fill={FILL_MID} />
      <L x={266} y={50} fill={INK} size={13.5} weight={500}>One impulse</L>

      {/* Both routes are drawn the same, because both pass every test. */}
      <path d="M300 62 C 300 96, 150 96, 150 130" fill="none" stroke={RULE} strokeWidth="1.5" />
      <path d="M340 62 C 340 96, 490 96, 490 130" fill="none" stroke={RULE} strokeWidth="1.5" />

      <rect x="62" y="132" width="176" height="30" fill={FILL_SOFT} stroke={RULE} strokeWidth="1" />
      <L x={76} y={152} fill={INK} size={13}>A specific idea</L>
      <rect x="402" y="132" width="176" height="30" fill={FILL_SOFT} stroke={RULE} strokeWidth="1" />
      <L x={416} y={152} fill={INK} size={13}>Also a specific idea</L>

      <path d="M150 164 L150 186" stroke={RULE} strokeWidth="1.5" />
      <path d="M490 164 L490 186" stroke={RULE} strokeWidth="1.5" />

      <rect x="62" y="188" width="176" height="32" fill={FILL_SOFT} stroke={RULE} strokeWidth="1" />
      <L x={76} y={209} size={13}>Fine</L>
      <rect x="402" y="188" width="176" height="32" fill={CLAY_TEXT} />
      <L x={416} y={209} fill="#faf8f2" size={13} weight={500}>The one worth building</L>
    </svg>
  );
}

const FIGURES: Record<string, () => React.ReactElement> = {
  "context-window": ContextWindow,
  "model-ladder": ModelLadder,
  "tool-split": ToolSplit,
  "setup-order": SetupOrder,
  "project-file": ProjectFile,
  "session-arc": SessionArc,
  "idea-funnel": IdeaFunnel,
  "two-endings": TwoEndings,
};

export function Figure({ id, className }: { id: string; className?: string }) {
  const Drawing = FIGURES[id];
  if (!Drawing) return null;
  return (
    <div className={className}>
      <Drawing />
    </div>
  );
}
