"use client";

import { useEffect, useRef } from "react";

/**
 * THE SUPERVISOR AT WORK, PLAYED ONCE WHEN IT'S ON SCREEN. A real moment
 * (5 Nov 2026, building the first version of this page): the agent said the
 * page looked great on desktop and phone; fresh eyes opened it on a phone and
 * found the opening playing off-screen; it was fixed and looked at again.
 * The CSS sequence waits for data-play, set the first time the card is in
 * view. Without script or with reduced motion it shows the final state.
 */
const ROWS: { k: string; v: string; warn?: boolean }[] = [
  { k: "Opened it", v: "desktop + phone" },
  { k: "Looked like a person", v: "1 thing off", warn: true },
  { k: "Fixed it", v: "looked again" },
  { k: "Second agent", v: "agrees" },
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
    <div
      ref={ref}
      className="as-demo as-glass"
      role="img"
      aria-label="The agent says: Done, the page looks great on desktop and phone. Agent Supervisor: show me. Opened it on desktop and phone. Looked like a person: one thing off, on a phone the opening played off-screen. Fixed it and looked again. A second agent agrees. Supervised: fixed before you saw it."
    >
      <div className="as-demo__bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>claude · landing page</span>
      </div>
      <div className="as-demo__body" aria-hidden>
        <p className="as-demo__said">
          <span className="as-demo__who">Agent</span>
          <span className="as-demo__quote">Done. The page looks great on desktop and phone.</span>
        </p>
        <p className="as-demo__prove">
          <span className="as-dot" />
          Show me.
        </p>
        <ul className="as-demo__rows">
          {ROWS.map(({ k, v, warn }, i) => (
            <li key={k} data-warn={warn || undefined} style={{ "--i": i } as React.CSSProperties}>
              <span className="as-demo__state">
                <span className="as-demo__spin" />
                <svg viewBox="0 0 20 20" className="as-demo__check">
                  {warn ? <path d="M10 5.5 L10 11.2 M10 14.4 L10 14.6" pathLength={1} /> : <path d="M5.5 10.5 L8.6 13.4 L14.5 6.8" pathLength={1} />}
                </svg>
              </span>
              <span className="as-demo__k">{k}</span>
              <span className="as-demo__v">{v}</span>
              {warn && <span className="as-demo__note">Phone: the opening played off-screen</span>}
            </li>
          ))}
        </ul>
        <p className="as-demo__done">
          <span>Supervised</span>
          <b>fixed before you saw it</b>
        </p>
      </div>
    </div>
  );
}
