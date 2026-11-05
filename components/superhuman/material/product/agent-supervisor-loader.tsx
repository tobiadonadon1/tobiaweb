"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: FOUR CHECKS CLOSE A RING.
 *
 * Opens it, looks at it, uses it, proves it: each lights a quarter of a ring
 * while a gold sun swells behind, the ring closes, a tick draws, "Checked." Then the glass lifts off the
 * page. CSS alone runs it (agent-supervisor.css, about 2.7 s) from the first
 * paint; script only steps it aside early on a scroll, key or tap. Reduced
 * motion skips it. Decoration over a page that is already there, so it is
 * hidden from assistive tech.
 */
const CHECKS = ["opens it", "looks at it", "uses it", "proves it"];

export function AgentSupervisorLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => setDone(true);
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
    }, 3000);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  return (
    <div className="as-load" data-done={done || undefined} aria-hidden>
      <div className="as-load__stage">
        <svg viewBox="0 0 100 100" className="as-load__ring">
          <circle className="as-load__track" cx="50" cy="50" r="40" pathLength={100} />
          {CHECKS.map((c, i) => (
            <circle
              key={c}
              className="as-load__arc"
              cx="50"
              cy="50"
              r="40"
              pathLength={100}
              style={{ "--i": i, transform: `rotate(${-90 + 4 + i * 90}deg)` } as React.CSSProperties}
            />
          ))}
          <path className="as-load__tick" d="M35 51 L45 61 L66 39" pathLength={1} />
        </svg>
        <div className="as-load__labels">
          {CHECKS.map((c, i) => (
            <span key={c} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </span>
          ))}
          <span className="as-load__proven">Checked.</span>
        </div>
      </div>
    </div>
  );
}
