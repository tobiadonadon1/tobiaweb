"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE OPENING of the Done Checker page (done-checker.css has the clock).
 *
 * The agent's "All done!" bubble arrives, a red PROVE IT stamp slams across
 * it, and the receipt prints out of the slot with the green DONE stamp at the
 * bottom. The bubble and the receipt are real: Claude Code's own summary and
 * the receipt Done Checker made in the test run of 5 Nov 2026 (a signup for a
 * small plant-reminder app, run B in the skill's notes). Nothing is invented;
 * long lines are shortened, never changed in meaning.
 *
 * The client part is only the replay: remounting the scene restarts the CSS.
 */

export type ReceiptLine =
  | { kind: "head"; text: string }
  | { kind: "meta"; text: string }
  | { kind: "rule" }
  | { kind: "item"; mark: "✓" | "✗" | "◐"; id: string; text: string }
  | { kind: "lead"; left: string; right: string }
  | { kind: "note"; text: string };

export function DoneCheckerScene({ said, lines, stamp, foot }: { said: string; lines: ReceiptLine[]; stamp: string; foot: string }) {
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  // Plays once it's on screen: on a phone the scene sits below the first screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.play = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.play = "true";
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);
  return (
    <div ref={ref} data-play={run > 0 ? "true" : "false"} className="dc-scene relative mx-auto w-full max-w-[32rem]" key={run}>
      {/* The agent's claim */}
      <div className="dc-bubble relative z-20">
        <div className="dc-bubble-shake relative rounded-[1.4rem] rounded-bl-[0.35rem] border-2 border-[var(--ink)] bg-white px-5 pb-6 pt-3.5 pr-10 shadow-[0_18px_30px_-22px_rgba(40,30,10,0.6)]">
          <p className="font-[family-name:var(--dc-mono)] text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--soft)]">
            Claude Code · just now
          </p>
          <p className="mt-1.5 text-[1.08rem] font-semibold leading-[1.35] text-[var(--ink)] sm:text-[1.15rem]">{said}</p>
          <span
            aria-hidden
            className="dc-prove dc-stamp pointer-events-none font-[family-name:var(--dc-display)] text-[2.1rem] font-extrabold tracking-[0.04em] sm:text-[2.5rem] [font-variation-settings:'wdth'_80]"
          >
            Prove it
          </span>
        </div>
      </div>

      {/* The printer slot and the roll coming out of it */}
      <div className="relative z-10 mt-9">
        <div aria-hidden className="relative z-20 mx-auto h-4 w-[92%] rounded-full bg-[var(--ink)] shadow-[0_6px_10px_-4px_rgba(0,0,0,0.5)]" />
        <div className="relative z-10 mx-auto -mt-2 w-[86%] overflow-hidden pb-4">
          <div className="dc-roll dc-paper dc-flat-top px-5 pb-6 pt-5 font-[family-name:var(--dc-mono)] text-[0.74rem] leading-[1.55] text-[var(--ink)] sm:px-6 sm:text-[0.82rem]">
            <ol className="m-0 list-none p-0" aria-label="The receipt">
              {lines.map((l, i) => (
                <li key={i} className="dc-roll-line" style={{ "--i": i } as React.CSSProperties}>
                  <Line l={l} />
                </li>
              ))}
            </ol>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="dc-done dc-stamp dc-stamp-green font-[family-name:var(--dc-display)] text-[2rem] font-extrabold tracking-[0.05em] [font-variation-settings:'wdth'_80]">
                {stamp}
              </span>
              <span className="text-right text-[0.68rem] leading-[1.35] text-[var(--soft)]">{foot}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="dc-replay absolute -bottom-3 right-1 z-30 rounded-full border border-[var(--ink)]/25 bg-[var(--paper)] px-3 py-1.5 font-[family-name:var(--dc-mono)] text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ink)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
      >
        ↻ Again
      </button>
    </div>
  );
}

function Line({ l }: { l: ReceiptLine }) {
  switch (l.kind) {
    case "head":
      return <p className="m-0 text-center text-[0.8rem] font-extrabold tracking-[0.3em]">{l.text}</p>;
    case "meta":
      return <p className="m-0 text-center text-[var(--soft)]">{l.text}</p>;
    case "rule":
      return <div aria-hidden className="dc-perf my-2" />;
    case "item":
      return (
        <p className="m-0 flex gap-2">
          <b className={l.mark === "✓" ? "text-[var(--green)]" : l.mark === "✗" ? "text-[var(--red)]" : "text-[var(--amber)]"}>{l.mark}</b>
          <span>
            <span className="text-[var(--soft)]">{l.id}</span> {l.text}
          </span>
        </p>
      );
    case "lead":
      return (
        <p className="dc-lead m-0">
          <span>{l.left}</span>
          <i aria-hidden />
          <span className="text-right font-bold">{l.right}</span>
        </p>
      );
    case "note":
      return <p className="m-0 pl-3 -indent-3">· {l.text}</p>;
  }
}

/** The guard's terminal: its lines arrive when it scrolls into view (the attribute is set on the element, no re-render). */
export function GuardTerminal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.on = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.on = "true";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="dc-term" data-on="false">
      {children}
    </div>
  );
}
