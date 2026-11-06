"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * THE SKILL, PLAYING: three prompts in a Claude Code window.
 *
 * Every line is real output from the think-first test runs (6 Nov 2026,
 * think-first 1.1, run headless): the clear prompt (the meal planner brief
 * from page 2 of the PDF), the vague one (two turns) and the small one (where
 * it stays out). Only the file writes after "building…" are cut to three.
 *
 * It plays on its own, one tab after another, while it's on screen; a click on
 * a tab plays that one and stops the round. Reduced motion shows each one
 * finished. The animated screen is hidden from assistive tech; the same lines
 * sit beside it as plain text.
 */

type Line =
  | { t: "you"; text: string }
  | { t: "head"; text: string }
  | { t: "gap" }
  | { t: "row"; k: string; v: string; guess?: boolean }
  | { t: "line"; text: string }
  | { t: "q"; n: string; q: string; opts?: string[]; free?: string }
  | { t: "note"; text: string }
  | { t: "build" }
  | { t: "tool"; text: string }
  | { t: "say"; text: string };

type Step = { line: Line; wait: number };
type Demo = { id: string; tab: string; window: string; caption: string; steps: Step[] };

const TYPE_MS = 26;
const HOLD_MS = 4200;
/** The first round waits for the opening (think-first-loader) to lift. */
const FIRST_WAIT_MS = 2300;

const s = (line: Line, wait = 120): Step => ({ line, wait });

const DEMOS: Demo[] = [
  {
    id: "clear",
    tab: "clear prompt",
    window: "night-meals — claude",
    caption: "Clear prompt: no questions. 2 lines, then it builds.",
    steps: [
      s({ t: "you", text: "build the meal planner from @brief.md" }, 700),
      s({ t: "head", text: "think-first · here's what i'll build:" }, 160),
      s({ t: "gap" }, 0),
      s({ t: "line", text: "a 3am meal planner that shows a night nurse her next meal, its time, and what to grab, in under 5s." }, 260),
      s({ t: "line", text: "light weather-style cards, one black card, a big \"ate it\" button. no calories, streaks, emoji or accounts." }, 300),
      s({ t: "gap" }, 0),
      s({ t: "build" }, 1100),
      s({ t: "tool", text: "Write(index.html)" }, 380),
      s({ t: "tool", text: "Write(styles.css)" }, 380),
      s({ t: "tool", text: "Write(app.js)" }, 0),
    ],
  },
  {
    id: "vague",
    tab: "vague prompt",
    window: "waitlist — claude",
    caption: "Vague prompt: 3 quick questions, one reply, then 2 lines.",
    steps: [
      s({ t: "you", text: "build a landing page for my app" }, 700),
      s({ t: "head", text: "think-first · 3 things missing, quick ones:" }, 160),
      s({ t: "gap" }, 0),
      s({ t: "q", n: "1", q: "what's the app?", free: "one line is enough" }, 200),
      s({ t: "q", n: "2", q: "the one action?", opts: ["join waitlist", "download app", "start free trial"] }, 200),
      s({ t: "q", n: "3", q: "a look you love?", free: "paste a link or drop a screenshot" }, 260),
      s({ t: "gap" }, 0),
      s({ t: "note", text: "reply like: invoice chaser for freelancers, a, [screenshot] · or \"go\" and i'll use my best guess" }, 1300),
      s({ t: "gap" }, 0),
      s({ t: "you", text: "it chases late invoices for freelancers, a, go" }, 700),
      s({ t: "head", text: "think-first · got it. here's what i'll build:" }, 160),
      s({ t: "gap" }, 0),
      s({ t: "line", text: "a waitlist page for an app that chases freelancers' late invoices; on a phone, they get it and join in under 10s." }, 260),
      s({ t: "line", text: "looks like a paper invoice with a red overdue stamp, one email field. no pricing, fake logos or dashboard mockups." }, 300),
      s({ t: "gap" }, 0),
      s({ t: "build" }, 0),
    ],
  },
  {
    id: "small",
    tab: "small task",
    window: "night-meals — claude",
    caption: "Small task: it stays out of the way.",
    steps: [
      s({ t: "you", text: "change the page title to Night Meals" }, 700),
      s({ t: "tool", text: "Bash(grep -n -i \"title\" index.html)" }, 500),
      s({ t: "tool", text: "Update(index.html) · <title>Night Meals</title>" }, 600),
      s({ t: "say", text: "I changed the page title in index.html:2 from \"Meals\" to \"Night Meals\". The <h1> heading already said \"Night Meals\", so now the browser tab and the heading match." }, 0),
    ],
  },
];

/** When each step starts, and when the whole demo has finished, in ms. */
function schedule(steps: Step[]) {
  let at = 0;
  const starts = steps.map((st) => {
    const start = at;
    at += (st.line.t === "you" ? st.line.text.length * TYPE_MS : 0) + st.wait;
    return start;
  });
  return { starts, end: at };
}
const PLANS = DEMOS.map((d) => schedule(d.steps));

function plain(line: Line): string {
  switch (line.t) {
    case "you": return `> ${line.text}`;
    case "head": return `◆ ${line.text}`;
    case "gap": return "";
    case "row": return `  ${line.k.padEnd(9)} ${line.guess ? "~ " : ""}${line.v}`;
    case "q": return `  ${line.n}  ${line.q}  ${line.opts ? line.opts.map((o, i) => `[${"abc"[i]}] ${o}`).join("  ") : line.free}`;
    case "note": return `  ${line.text}`;
    case "line": return `  ${line.text}`;
    case "build": return "building…";
    case "tool": return `⏺ ${line.text}`;
    case "say": return `⏺ ${line.text}`;
  }
}

function Row({ line, typed }: { line: Line; typed?: number }) {
  switch (line.t) {
    case "you": {
      const shown = typed ?? line.text.length;
      return (
        <p className="tf-ln tf-ln--you">
          {line.text.slice(0, shown)}
          {shown < line.text.length ? <span className="tf-caret" /> : null}
        </p>
      );
    }
    case "head":
      return (
        <p className="tf-ln tf-ln--head">
          <span className="tf-gem" />
          {line.text}
        </p>
      );
    case "gap":
      return <p className="tf-ln tf-ln--gap" />;
    case "row":
      return (
        <p className="tf-ln tf-row">
          <b>{line.k}</b>
          <span>
            {line.guess ? <span className="tf-tilde">~</span> : null}
            {line.v}
          </span>
        </p>
      );
    case "q":
      return (
        <p className="tf-ln tf-q">
          <span>{line.n}</span>
          <b>{line.q}</b>
          <span>
            {line.opts
              ? line.opts.map((o, i) => (
                  <span key={o}>
                    <span className="whitespace-nowrap">
                      <span className="tf-opt">[{"abc"[i]}]</span> {o}
                    </span>
                    {i < line.opts!.length - 1 ? " " : ""}
                  </span>
                ))
              : line.free}
          </span>
        </p>
      );
    case "note":
      return <p className="tf-ln tf-ln--note">{line.text}</p>;
    case "line":
      return <p className="tf-ln tf-ln--two">{line.text}</p>;
    case "build":
      return <p className="tf-ln tf-ln--build">building…</p>;
    case "tool":
      return <p className="tf-ln tf-ln--tool">{line.text}</p>;
    case "say":
      return <p className="tf-ln tf-ln--tool">{line.text}</p>;
  }
}

export function ThinkFirstDemo() {
  const [tab, setTab] = useState(0);
  const [run, setRun] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [auto, setAuto] = useState(true);
  const [still, setStill] = useState(false);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const screen = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setStill(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The clock: runs while the window is on screen, from where it stopped.
  const clock = useRef(0);
  // Wait for the opening only while it can still be on screen (not when it was skipped, or long gone).
  useEffect(() => {
    const skipped = (window as { __tfSkipIntro?: number }).__tfSkipIntro;
    clock.current = skipped ? 0 : -Math.max(0, FIRST_WAIT_MS - performance.now());
  }, []);
  useEffect(() => {
    if (still || !visible) return;
    const plan = PLANS[tab];
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      clock.current += now - last;
      last = now;
      if (clock.current >= plan.end + HOLD_MS) {
        if (auto) {
          // The round: on to the next prompt.
          clock.current = 0;
          setElapsed(0);
          setTab((t) => (t + 1) % DEMOS.length);
          setRun((r) => r + 1);
        } else {
          clock.current = plan.end + HOLD_MS;
          setElapsed(clock.current);
        }
        return;
      }
      setElapsed(Math.max(0, clock.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tab, run, still, visible, auto]);

  const pick = (i: number) => {
    setAuto(false);
    setTab(i);
    setRun((r) => r + 1);
    clock.current = 0;
    setElapsed(0);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = (tab + d + DEMOS.length) % DEMOS.length;
    pick(i);
    tabs.current[i]?.focus();
  };

  const demo = DEMOS[tab];
  const plan = PLANS[tab];
  const now = still ? Infinity : elapsed;

  // Like a terminal: the newest line stays in view, older ones scroll off the top.
  useLayoutEffect(() => {
    const el = screen.current;
    if (!el) return;
    const o = el.scrollHeight > el.clientHeight + 1;
    setOver(o);
    el.scrollTop = o ? el.scrollHeight : 0;
  }, [elapsed, tab, run, still]);

  return (
    <figure ref={box} className="tf-glass tf-glass--green tf-glass--lit tf-term m-0">
      <div className="tf-term__bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>{demo.window}</span>
      </div>
      <div role="tablist" aria-label="Three prompts" className="tf-tabs" onKeyDown={onKey}>
        {DEMOS.map((d, i) => (
          <button
            key={d.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tf-tab-${d.id}`}
            aria-selected={i === tab}
            aria-controls="tf-panel"
            tabIndex={i === tab ? 0 : -1}
            className="tf-tab"
            onClick={() => pick(i)}
          >
            {d.tab}
            {i === tab && auto && !still ? (
              <span key={run} className="tf-tab__run" style={{ "--dur": `${plan.end + HOLD_MS}ms`, animationPlayState: visible ? "running" : "paused" } as React.CSSProperties} aria-hidden />
            ) : null}
          </button>
        ))}
      </div>
      <div id="tf-panel" role="tabpanel" aria-labelledby={`tf-tab-${demo.id}`}>
        <div ref={screen} className="tf-screen" data-over={over || undefined} aria-hidden>
          {demo.steps.map((st, i) => {
            const start = plan.starts[i];
            if (now < start) return null;
            const typed = st.line.t === "you" ? Math.min(st.line.text.length, Math.floor((now - start) / TYPE_MS)) : undefined;
            return <Row key={`${run}-${i}`} line={st.line} typed={typed} />;
          })}
        </div>
        <pre className="sr-only">{demo.steps.map((st) => plain(st.line)).join("\n")}</pre>
        <figcaption className="tf-term__cap">
          <span>{demo.caption}</span>
          <small>real output</small>
        </figcaption>
      </div>
    </figure>
  );
}
