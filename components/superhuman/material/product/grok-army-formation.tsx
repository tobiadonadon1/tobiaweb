"use client";

import { useEffect, useRef, useState } from "react";
import { BOTS, botShape, type BotId } from "./grok-army-bots";

/**
 * THE ARMY ASSEMBLES AS YOU READ.
 *
 * A formation of six empty slots stays pinned while the bots' jobs scroll
 * past it. Each job that reaches the reader drops its bot into its slot (a
 * short fall and a settle, never a spin or a turn: Tobia hates devices that
 * rotate on a transition), lights its name, and pushes the payback bar on.
 * On a phone the formation pins to the top half of the screen and the jobs
 * pass under it; on a wide screen it holds the left column.
 *
 * NOTHING WAITS ON JAVASCRIPT. Server-rendered, every bot is already in
 * place and every job is at full strength, so a crawler, a screenshot, a slow
 * phone or JavaScript switched off sees the finished army. Script only takes
 * the empty state back and plays it forward with the scroll. Reduced motion
 * keeps the assembling (it is the content) but drops the fall.
 */

/** Where each bot stands: the back row, then the front, the Chief in the middle. */
const FORMATION: BotId[] = ["scout", "voice", "earner", "outbound", "chief", "inbox"];
const SHORT: Record<BotId, string> = {
  chief: "Chief",
  scout: "Scout",
  voice: "Voice",
  earner: "Earner",
  outbound: "Outbound",
  inbox: "Inbox",
};

export function ArmyFormation() {
  // -1 before the first job; BOTS.length - 1 at the last. Starts "all in"
  // so the server's HTML is the finished army.
  const [active, setActive] = useState(BOTS.length - 1);
  const [live, setLive] = useState(false);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const phone = window.matchMedia("(max-width: 1023px)").matches;
      // On a phone the formation covers the top half, so a job counts once
      // it is well into the half below; on a wide screen, near the middle.
      const line = window.innerHeight * (phone ? 0.72 : 0.62);
      let a = -1;
      steps.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) a = i;
      });
      setActive(Math.min(a, BOTS.length - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    // The first read waits a frame: layout is settled, and the empty
    // formation never flashes before the page has painted.
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

  const joined = active + 1;
  const indexOf = (id: BotId) => BOTS.findIndex((b) => b.id === id);

  return (
    <div className="ga-formation grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16" data-live={live || undefined}>
      {/* The formation. Pinned; decorative, because the list beside it says
          everything it shows. */}
      <div className="ga-stage sticky top-0 z-10 -mx-5 flex h-[50svh] min-h-[22rem] flex-col justify-end px-5 pb-5 pt-16 sm:-mx-8 sm:px-8 lg:mx-0 lg:h-svh lg:max-h-[56rem] lg:justify-center lg:px-0 lg:pb-0 lg:pt-0" aria-hidden>
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-3 gap-x-3 gap-y-1 sm:max-w-[26rem] lg:max-w-[34rem] lg:gap-x-6 lg:gap-y-3">
          {FORMATION.map((id) => {
            const i = indexOf(id);
            const state = i < joined ? (i === active ? "current" : "in") : "out";
            return (
              <div key={id} className={`ga-slot ${id === "chief" ? "ga-slot-chief" : ""}`} data-state={state}>
                <div className="relative">
                  <svg viewBox="0 0 100 122" className="ga-ghost absolute inset-0 h-full w-full">
                    <rect x="9" y="17" width="82" height="91" rx="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="6 7" />
                  </svg>
                  <svg viewBox="0 0 100 122" className="ga-bot relative block h-auto w-full">
                    {botShape(id)}
                  </svg>
                </div>
                <p className="ga-slot-name mt-0.5 text-center text-[0.8rem] font-semibold tracking-[0.01em] lg:text-[0.95rem]">{SHORT[id]}</p>
              </div>
            );
          })}
        </div>

        {/* The goal bar: it fills as the army fills, toward the one thing
            that matters, the buyer's goal. No amounts: none would be true. */}
        <div className="mx-auto mt-4 w-full max-w-[22rem] sm:max-w-[26rem] lg:mt-10 lg:max-w-[34rem]">
          <div className="flex items-baseline justify-between text-[0.8rem] font-medium lg:text-[0.9rem]">
            <span className="text-[var(--ga-ink)]">Progress</span>
            <span className="text-[var(--ga-soft)]">Your goal</span>
          </div>
          <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--ga-track)]">
            <div
              className="ga-fill absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--ga-accent)]"
              style={{ transform: `scaleX(${Math.max(0, joined) / BOTS.length})` }}
            />
          </div>
        </div>
      </div>

      {/* The jobs. This list IS the content: real text, read in order. */}
      <ol className="relative list-none p-0 lg:py-[18svh]">
        {BOTS.map((bot, i) => (
          <li
            key={bot.id}
            ref={(el) => {
              steps.current[i] = el;
            }}
            className="ga-step flex min-h-[46svh] flex-col justify-center py-10 lg:min-h-[72svh]"
            data-on={!live || i <= active || undefined}
          >
            <p className="text-[0.95rem] font-semibold text-[var(--ga-accent)]">{bot.role}</p>
            <h3 className="mt-2 text-[clamp(2.1rem,6vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[var(--ga-ink)]">
              {bot.name}
            </h3>
            <p className="mt-4 max-w-[34ch] text-pretty text-[1.1rem] leading-[1.5] text-[var(--ga-soft)] lg:text-[1.2rem]">
              {bot.job}
            </p>
          </li>
        ))}
        <li className="pb-16 pt-6 lg:pb-0">
          <p className="max-w-[36ch] text-pretty text-[1.05rem] leading-[1.55] text-[var(--ga-soft)]">
            More on call when your goal needs them: referrals, LinkedIn, SEO, competitor watch, UGC ads, paid media and store ops.
          </p>
        </li>
      </ol>
    </div>
  );
}
