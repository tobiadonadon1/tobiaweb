"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, LEAD, botShape, ghostShape, type BotSpec } from "./grok-army-bots";

/**
 * YOUR ARMY, BUILT AS YOU READ.
 *
 * There is no fixed roster: the buyer sets the goal and Claude designs the
 * bots for it with them. So the pinned stage acts that out in order. A goal
 * is set (the examples rotate until the first step is read, then one stays)
 * over the empty places, drawn from the start so the stage is never blank, the bot you talk to arrives, the
 * others join one by one, one asks for your OK, and the progress bar moves
 * toward the goal. The bots have no names or jobs here, on purpose.
 *
 * Movement is a short drop and a settle, never a spin or a turn (Tobia hates
 * devices that rotate on a transition). On a phone the stage pins to the top
 * half and the lines pass under it; on a wide screen it holds the left half.
 *
 * NOTHING WAITS ON JAVASCRIPT. Server-rendered, the team is complete and every
 * line is at full strength, so a crawler, a screenshot or a slow phone sees
 * the finished army. Script takes it back to the empty stage and plays it
 * forward with the scroll. Reduced motion keeps the building (it is the
 * content) but drops the fall and the rotating goal.
 */

const GOALS = ["More clients", "More sales", "Launch the app", "Grow on X", "Clear the inbox", "Book more calls"];

const LINES: [string, string][] = [
  ["You set the goal.", "One goal the whole army works on. More clients, more sales, a launch, a bigger audience, a clear inbox. Yours."],
  ["Claude designs the team with you.", "One bot you talk to, and one for each job your goal needs. Rename, add, drop or reshape any of them before it’s built."],
  ["Builder creates it in Grok Bot.", "You give one file to a new Grok Bot. It sets everything up, shows you a first result, then creates the bots."],
  ["It works around the clock.", "On routines, in Grok Bot’s cloud. It asks before anything is sent, posted, bought or deleted."],
  ["It gets better every week.", "Each bot learns from your edits and its own numbers, and the scoreboard shows the progress on your goal."],
];

/** The team's places on a 400 x 240 stage, and when each one joins (in steps read). */
type Place = BotSpec & { x: number; y: number; s: number; at: number };
const TEAM: Place[] = [
  { shape: "circle", color: COLORS.teal, x: 30, y: 20, s: 0.78, at: 2.0 },
  { shape: "square", color: COLORS.blue, x: 162, y: 0, s: 0.72, at: 2.25 },
  { shape: "triangle", color: COLORS.indigo, x: 292, y: 16, s: 0.8, at: 2.5 },
  { shape: "diamond", color: COLORS.violet, x: 14, y: 148, s: 0.88, at: 2.75 },
  { shape: "circle", color: COLORS.red, x: 300, y: 146, s: 0.84, at: 3.0 },
  { ...LEAD, x: 132, y: 96, s: 1.36, at: 1.35 },
];
const ALL = LINES.length;

/** The celebration's sparks, in the bots' colours. */
const SPARKS = [COLORS.blue, COLORS.violet, COLORS.teal, COLORS.orange, COLORS.red, COLORS.indigo, COLORS.blue, COLORS.violet];

export function ArmyFormation() {
  // How many lines have been read, continuously: 0 before the first, ALL at
  // the end. Starts at ALL so the server's HTML is the finished army.
  const [read, setRead] = useState(ALL);
  const [live, setLive] = useState(false);
  const [goal, setGoal] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const phone = window.matchMedia("(max-width: 1023px)").matches;
      // A line counts once its top passes this line, fully once its
      // bottom does. On a phone the stage covers the top half.
      const line = window.innerHeight * (phone ? 0.74 : 0.6);
      let f = 0;
      for (const el of steps.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        f += Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height * 0.7)));
      }
      setRead(f);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(() => {
      measure();
      setLive(true);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The bar reaches the goal before the last line ends, and the stage
  // celebrates once: the bar turns blue to violet, sparks fly off its end
  // and the bots hop.
  const progress = Math.min(1, Math.max(0, (read - 3.3) / 1.3));
  const reached = progress >= 1;

  // The goal examples keep taking turns, quickly, until the goal is reached.
  const goalSet = !live || read >= 1;
  const rotating = live && !reached;
  useEffect(() => {
    if (!rotating || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setGoal((g) => (g + 1) % GOALS.length), 1000);
    return () => window.clearInterval(t);
  }, [rotating]);

  const designing = read >= 1;
  const asking = read >= 3.3;

  return (
    <div className="ga-formation grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16" data-live={live || undefined} data-reached={reached || undefined}>
      {/* The stage. Pinned; decorative, because the lines beside it say
          everything it shows. */}
      <div className="ga-stage sticky top-0 z-10 -mx-5 flex h-[56svh] min-h-[25rem] flex-col justify-end px-5 pb-5 pt-16 sm:-mx-8 sm:px-8 lg:mx-0 lg:h-svh lg:max-h-[56rem] lg:justify-center lg:px-0 lg:pb-0 lg:pt-0" aria-hidden>
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[32rem]">
          <div className={`ga-goal flex items-center gap-3 rounded-full border px-4 py-2.5 ${goalSet ? "ga-goal-set" : ""}`}>
            <span className="text-[0.8rem] font-semibold text-[var(--ga-soft)] lg:text-[0.9rem]">Goal</span>
            <span className="relative h-[1.4em] flex-1 overflow-hidden text-[1rem] font-semibold lg:text-[1.1rem]">
              {GOALS.map((g, i) => (
                <span key={g} className="ga-goal-word absolute inset-0" data-on={i === goal || undefined}>
                  {g}
                </span>
              ))}
            </span>
          </div>

          <svg viewBox="0 0 400 240" className="mt-5 block h-auto w-full lg:mt-8">
            {TEAM.map((p, i) => {
              const state = read >= p.at ? "in" : "empty";
              return (
                <g key={i} className="ga-place" data-state={state}>
                  <g className="ga-ghost" transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
                    {ghostShape(p.shape)}
                  </g>
                  <g className="ga-bot">{botShape(p, { x: p.x, y: p.y, s: p.s })}</g>
                </g>
              );
            })}
          </svg>

          <div className="mt-4 grid h-8 place-items-center lg:mt-6">
            <span className="ga-ask ga-hint text-[0.8rem] font-medium text-[var(--ga-soft)] [grid-area:1/1] lg:text-[0.9rem]" data-on={(live && !designing) || undefined}>
              Keep scrolling: your army builds itself here.
            </span>
            <span className="[grid-area:1/1] ga-ask inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium lg:text-[0.9rem]" data-on={asking || undefined}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ga-ink)]" />Something is ready. It waits for your OK.
            </span>
          </div>

          <div className="mt-3 lg:mt-6">
            <div className="flex items-baseline justify-between text-[0.8rem] font-medium lg:text-[0.9rem]">
              <span className="text-[var(--ga-ink)]">Progress</span>
              <span className={reached ? "ga-reached-label font-semibold" : "text-[var(--ga-soft)]"}>
                {reached ? "Goal reached" : "Your goal"}
              </span>
            </div>
            <div className="relative mt-2">
              <div className="relative h-2 overflow-hidden rounded-full bg-[var(--ga-track)]">
                <div
                  className="ga-fill absolute inset-y-0 left-0 w-full origin-left rounded-full"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              <span className="ga-sparks absolute right-0 top-1/2" aria-hidden>
                {SPARKS.map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The lines. This list IS the content: real text, read in order. */}
      <ol className="relative list-none p-0 pb-16 lg:py-[20svh]">
        {LINES.map(([title, text], i) => (
          <li
            key={title}
            ref={(el) => {
              steps.current[i] = el;
            }}
            className="ga-step flex min-h-[44svh] flex-col justify-center py-10 lg:min-h-[64svh]"
            data-on={!live || read > i + 0.15 || undefined}
          >
            <h3 className="text-[clamp(1.9rem,5.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[var(--ga-ink)]">
              {title}
            </h3>
            <p className="mt-4 max-w-[34ch] text-pretty text-[1.1rem] leading-[1.5] text-[var(--ga-soft)] lg:text-[1.2rem]">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
