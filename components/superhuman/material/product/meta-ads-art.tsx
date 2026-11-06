/**
 * THE HAND ON THE POSTER (Tobia's reference, 2026-11-06: a streetwear page on
 * Egyptian blue with a stone-blue spray swirl, scarlet paint splatter and a
 * scarlet marker arrow). Drawn as SVG so it stays sharp and weighs nothing:
 * a turbulence filter roughens the edges into spray and marker, and a seeded
 * random keeps the splatter identical on server and client. Decoration only.
 */

function rand(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stone-blue airbrushed swirl. */
export function Spray({ id, d, className = "", width = 34 }: { id: string; d: string; className?: string; width?: number }) {
  return (
    <svg viewBox="0 0 400 300" className={`ma-art ${className}`} aria-hidden>
      <defs>
        <filter id={`${id}-f`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>
      </defs>
      <path d={d} fill="none" stroke="#639CC5" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-f)`} opacity="0.85" />
      <path d={d} fill="none" stroke="#9cc3df" strokeWidth={width * 0.28} strokeLinecap="round" filter={`url(#${id}-f)`} opacity="0.5" />
    </svg>
  );
}

/** Scarlet paint, flicked: a few big drops, many small ones, a couple of trails. */
export function Splatter({ id, seed = 7, className = "" }: { id: string; seed?: number; className?: string }) {
  const r = rand(seed);
  const drops: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const dist = Math.pow(r(), 0.7) * 120;
    const size = i < 7 ? 9 + r() * 12 : 1.5 + r() * 5.5;
    drops.push({ x: 150 + Math.cos(a) * dist * 1.15, y: 150 + Math.sin(a) * dist * 0.9, r: size * (1 - dist / 260) });
  }
  return (
    <svg viewBox="0 0 300 300" className={`ma-art ${className}`} aria-hidden>
      <defs>
        <filter id={`${id}-f`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g fill="#EB2F33" filter={`url(#${id}-f)`}>
        {drops.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.r.toFixed(1)} />
        ))}
        <path d="M150 150 L232 104" stroke="#EB2F33" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 150 L96 214" stroke="#EB2F33" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A scarlet marker stroke that draws itself (meta-ads.css, .ma-marker). */
export function Marker({
  id,
  d,
  viewBox,
  className = "",
  width = 9,
  head,
}: {
  id: string;
  d: string;
  viewBox: string;
  className?: string;
  width?: number;
  /** An arrowhead, drawn after the line. */
  head?: string;
}) {
  return (
    <svg viewBox={viewBox} className={`ma-art ma-marker ${className}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g fill="none" stroke="#EB2F33" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-f)`}>
        <path d={d} pathLength={1} className="ma-marker__line" />
        {head && <path d={head} pathLength={1} className="ma-marker__head" />}
      </g>
    </svg>
  );
}
