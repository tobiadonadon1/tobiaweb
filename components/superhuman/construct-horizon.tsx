/** Signature move: a room you enter. Paper, one floor, faint grid. Motion 2. */
export function ConstructHorizon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={className}
    >
      <g
        className="origin-bottom motion-safe:animate-[constructFloor_600ms_ease-out]"
        stroke="var(--ink)"
        fill="none"
      >
        <line x1="0" y1="620" x2="1600" y2="620" strokeOpacity="0.1" />
        <line x1="800" y1="620" x2="80" y2="900" strokeOpacity="0.1" />
        <line x1="800" y1="620" x2="1520" y2="900" strokeOpacity="0.1" />
        <line x1="800" y1="620" x2="400" y2="900" strokeOpacity="0.1" />
        <line x1="800" y1="620" x2="1200" y2="900" strokeOpacity="0.1" />
        <line x1="0" y1="700" x2="1600" y2="700" strokeOpacity="0.08" />
        <line x1="0" y1="790" x2="1600" y2="790" strokeOpacity="0.08" />
        <line
          x1="120"
          y1="620"
          x2="1480"
          y2="620"
          strokeOpacity="0.22"
          strokeWidth="1.25"
        />
      </g>
    </svg>
  );
}
