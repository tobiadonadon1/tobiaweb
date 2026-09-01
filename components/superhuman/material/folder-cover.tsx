import { STAR_OUTLINE_D } from "../superhuman-star";
import type { MaterialAccent } from "./material-types";

/**
 * THE COVERS.
 *
 * Every classroom on the internet puts a photograph on its cards, and every
 * one of those photographs is the same photograph: a person pointing at a
 * screen. The rest of this site is drawn rather than shot, so the covers are
 * drawn too — six compositions in the same ink, on the same paper, each one
 * saying something true about what is behind it.
 *
 * They are SVG rather than images for the obvious reasons (they are a few
 * hundred bytes, they are sharp at any size, they recolour with a token) and
 * for one less obvious one: a drawn cover cannot go out of date, so nothing
 * here has to be re-shot when a folder gains a piece.
 *
 * NO HOOKS. These render inside server components, so nothing in here may
 * call useId — which is why the star arrives as a raw path rather than as
 * <SuperhumanStar />.
 *
 * Geometry is a 320 x 200 box, which is the card's own aspect, so nothing
 * scales unevenly.
 */

/** Which colour leads a cover. `ink` means the folder takes no accent at all. */
const ACCENT: Record<MaterialAccent, string> = {
  ink: "var(--ink)",
  sky: "var(--accent-sky)",
  clay: "var(--accent-clay)",
  mist: "var(--accent-deep)",
};

const LINE = "rgba(11,31,58,0.34)";
const FAINT = "rgba(11,31,58,0.15)";

/** The star, small, dropped into a composition at a given place and size. */
function Mark({
  x,
  y,
  size,
  fill,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
}) {
  // The outline lives in unit space centred on the origin, so it is scaled
  // and translated rather than re-derived.
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d={STAR_OUTLINE_D} fill={fill} />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * ONE COMPOSITION PER FOLDER.
 *
 * Each is keyed by folder id. A new folder without a cover falls back to
 * the mark alone, which is plain but never broken.
 * ------------------------------------------------------------------ */

function DoThis({ accent }: { accent: string }) {
  // The way in: one long line crossing the frame, three stops on it, and the
  // mark at the end. Three stops because there are three guides in here.
  return (
    <>
      <line x1="0" y1="118" x2="228" y2="118" stroke={LINE} strokeWidth="1.5" />
      {[52, 110, 168].map((x) => (
        <line
          key={x}
          x1={x}
          y1="106"
          x2={x}
          y2="130"
          stroke={FAINT}
          strokeWidth="1.5"
        />
      ))}
      <circle cx="52" cy="118" r="4" fill={LINE} />
      <circle cx="110" cy="118" r="4" fill={LINE} />
      <circle cx="168" cy="118" r="4" fill={LINE} />
      <Mark x={252} y={118} size={46} fill={accent} />
    </>
  );
}

function Guides({ accent }: { accent: string }) {
  // The road, which is the site's own motif: a winding line with the ground
  // it crosses drawn as hairlines behind it.
  return (
    <>
      {[46, 82, 118, 154].map((y) => (
        <line key={y} x1="24" y1={y} x2="296" y2={y} stroke={FAINT} strokeWidth="1" />
      ))}
      <path
        d="M24 158 C 82 158, 74 96, 122 96 S 186 132, 224 96 S 268 44, 296 44"
        fill="none"
        stroke={LINE}
        strokeWidth="2"
      />
      <circle cx="24" cy="158" r="5" fill={LINE} />
      <circle cx="296" cy="44" r="5" fill={accent} />
    </>
  );
}

function Skills({ accent }: { accent: string }) {
  // Ten marks in a grid, one of them lit. A skill is the same shape every
  // time; the only thing that changes is which one is loaded.
  const cols = [56, 112, 168, 224, 280];
  const rows = [64, 136];
  return (
    <>
      {rows.map((y, r) =>
        cols.map((x, c) => {
          const on = r === 1 && c === 1;
          return (
            <Mark
              key={`${r}-${c}`}
              x={x}
              y={y}
              size={on ? 30 : 22}
              fill={on ? accent : FAINT}
            />
          );
        }),
      )}
      <line x1="24" y1="100" x2="296" y2="100" stroke={FAINT} strokeWidth="1" />
    </>
  );
}

function Videos({ accent }: { accent: string }) {
  // A strip of four frames, one of them holding a play triangle. Outlines
  // only: nothing in this folder is filled in yet either.
  const frames = [26, 100, 174, 248];
  return (
    <>
      {frames.map((x, i) => (
        <rect
          key={x}
          x={x}
          y="62"
          width="46"
          height="76"
          fill="none"
          stroke={i === 1 ? accent : FAINT}
          strokeWidth={i === 1 ? 1.75 : 1}
        />
      ))}
      {/* Sprockets, top and bottom. */}
      {[38, 112, 186, 260].map((x) => (
        <g key={x}>
          <rect x={x} y="44" width="22" height="7" fill={FAINT} />
          <rect x={x} y="149" width="22" height="7" fill={FAINT} />
        </g>
      ))}
      <path d="M116 84 L 140 100 L 116 116 Z" fill="none" stroke={accent} strokeWidth="1.75" />
    </>
  );
}

function Tools({ accent }: { accent: string }) {
  // The star unrolled: its eight rays, laid flat and sorted, which is what a
  // stack is — a set of things of deliberately different sizes.
  const lengths = [58, 92, 44, 118, 74, 100, 62, 86];
  return (
    <>
      <line x1="24" y1="162" x2="296" y2="162" stroke={LINE} strokeWidth="1.5" />
      {lengths.map((h, i) => (
        <rect
          key={i}
          x={38 + i * 32}
          y={162 - h}
          width="10"
          height={h}
          fill={i === 3 ? accent : FAINT}
        />
      ))}
    </>
  );
}

function Setups({ accent }: { accent: string }) {
  // Layers, nested. The outer ones are the project; the small filled one in
  // the middle is the file everything reads before it does anything.
  const boxes = [0, 1, 2, 3];
  return (
    <>
      {boxes.map((i) => {
        const inset = i * 18;
        return (
          <rect
            key={i}
            x={40 + inset}
            y={30 + inset}
            width={240 - inset * 2}
            height={140 - inset * 2}
            fill="none"
            stroke={i === 3 ? LINE : FAINT}
            strokeWidth={i === 3 ? 1.75 : 1}
          />
        );
      })}
      <rect x={140} y={92} width="40" height="16" fill={accent} />
    </>
  );
}

const COMPOSITIONS: Record<string, (p: { accent: string }) => React.ReactElement> = {
  "do-this": DoThis,
  guides: Guides,
  skills: Skills,
  videos: Videos,
  tools: Tools,
  setups: Setups,
};

export function FolderCover({
  id,
  accent,
  className,
}: {
  id: string;
  accent: MaterialAccent;
  className?: string;
}) {
  const Composition = COMPOSITIONS[id];
  const colour = ACCENT[accent];

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
    >
      {Composition ? (
        <Composition accent={colour} />
      ) : (
        <Mark x={160} y={100} size={54} fill={colour} />
      )}
    </svg>
  );
}
