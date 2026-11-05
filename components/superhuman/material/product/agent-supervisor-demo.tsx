"use client";

import { useEffect, useRef } from "react";

/**
 * THE PROOF, PLAYED ONCE WHEN IT'S ON SCREEN. A real run (5 Nov 2026):
 * Claude Code added a signup to a small app and said it was finished; the
 * guard sent it back; it came back proven. The CSS sequence waits for
 * data-play, which is set the first time the card is in view (after the
 * opening loader on a desktop, on scroll on a phone). Without script or with
 * reduced motion it shows the final state.
 */
const ROWS: [string, string][] = [
  ["Tests", "10 passed"],
  ["Faked work", "none found"],
  ["Browser", "desktop + phone"],
  ["Second agent", "agrees, 9 of 9"],
];

export function AgentSupervisorDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.play = "true";
        io.disconnect();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="as-demo as-glass" role="img" aria-label="Claude Code says: Done. Signup is in and all 10 tests pass. Agent Supervisor answers: prove it. Tests: 10 passed. Faked work: none found. Browser: desktop and phone. Second agent: agrees, 9 of 9. Proven.">
      <div className="as-demo__bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>claude · signup</span>
      </div>
      <div className="as-demo__body" aria-hidden>
        <p className="as-demo__said">
          <span className="as-demo__who">Agent</span>
          <span className="as-demo__quote">Done. Signup is in and all 10 tests pass.</span>
        </p>
        <p className="as-demo__prove">
          <span className="as-dot" />
          Prove it.
        </p>
        <ul className="as-demo__rows">
          {ROWS.map(([k, v], i) => (
            <li key={k} style={{ "--i": i } as React.CSSProperties}>
              <span className="as-demo__state">
                <span className="as-demo__spin" />
                <svg viewBox="0 0 20 20" className="as-demo__check">
                  <path d="M5.5 10.5 L8.6 13.4 L14.5 6.8" pathLength={1} />
                </svg>
              </span>
              <span className="as-demo__k">{k}</span>
              <span className="as-demo__v">{v}</span>
            </li>
          ))}
        </ul>
        <p className="as-demo__done">
          <span>Proven</span>
          <b>9/9</b>
        </p>
      </div>
    </div>
  );
}
