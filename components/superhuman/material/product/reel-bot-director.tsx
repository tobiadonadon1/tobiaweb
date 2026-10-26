import { LEAD, botShape } from "./grok-army-bots";

/**
 * THE DIRECTOR (Tobia, 2026-10-26: "on the hero, Grok Bot filming shots like
 * a director"). The metal disc in a beret, behind a vintage film camera on a
 * tripod: two reels on top turning, a red REC light, and a soft beam from
 * the lens onto the three phones beside it, which are its takes.
 *
 * Plain SVG with a few classes; globals.css (REEL BOT) turns the reels,
 * blinks the REC light and the bot's eyes, and breathes the beam. Reduced
 * motion keeps the scene still. Decorative: the caption under the phones
 * says what they are.
 */

function Reel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="rb-reel">
      <circle cx={cx} cy={cy} r={r} fill="#24242c" stroke="#3b3b46" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="#2f2f39" strokeWidth={2} />
      {[0, 72, 144, 216, 288].map((a) => {
        const t = (a * Math.PI) / 180;
        return <circle key={a} cx={cx + Math.cos(t) * r * 0.5} cy={cy + Math.sin(t) * r * 0.5} r={r * 0.17} fill="#0f0f13" />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#9a9aa4" />
    </g>
  );
}

export function DirectorRig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 330 300" className={`rb-rig overflow-visible ${className}`} aria-hidden>
      <defs>
        <linearGradient id="rb-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#fffbe6" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fffbe6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* the beam, onto the takes */}
      <polygon className="rb-beam" points="300,146 700,-360 820,40" fill="url(#rb-beam)" />

      {/* the director, in a beret, behind the camera */}
      <g transform="translate(2 70) scale(0.98)">{botShape(LEAD, { key: "director" })}</g>
      <g>
        <ellipse cx="52" cy="76" rx="40" ry="11" fill="#17171c" transform="rotate(-10 52 76)" />
        <circle cx="50" cy="63" r="5" fill="#17171c" />
      </g>

      {/* tripod */}
      <g stroke="#141418" strokeWidth={8} strokeLinecap="round">
        <line x1="165" y1="196" x2="104" y2="294" />
        <line x1="165" y1="196" x2="168" y2="298" />
        <line x1="165" y1="196" x2="228" y2="294" />
      </g>
      <rect x="140" y="182" width="52" height="16" rx="5" fill="#1b1b21" />

      {/* reels and the film between them */}
      <path d="M126 92 L150 124 M196 92 L180 124" stroke="#33333d" strokeWidth={4} />
      <Reel cx={126} cy={78} r={36} />
      <Reel cx={198} cy={80} r={31} />

      {/* body, lens, matte box */}
      <rect x="96" y="118" width="134" height="68" rx="13" fill="#202027" />
      <rect x="104" y="126" width="56" height="52" rx="8" fill="#2b2b34" />
      <rect x="230" y="132" width="32" height="36" rx="4" fill="#141418" />
      <polygon points="262,124 304,104 304,192 262,174" fill="#1a1a20" />
      <circle cx="266" cy="149" r="15" fill="#3c2fb8" />
      <circle cx="261" cy="144" r="5" fill="#b7aaff" opacity="0.8" />

      {/* REC */}
      <circle className="rb-rec" cx="214" cy="133" r="5.5" fill="#ff3b30" />
      <text x="176" y="137" fontSize="11" fontWeight="700" fill="#c9c9d2" fontFamily="ui-monospace, monospace">
        REC
      </text>
    </svg>
  );
}
