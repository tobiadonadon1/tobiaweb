"use client";

import { useEffect, useState } from "react";
import { LEAD, botShape } from "./grok-army-bots";

/**
 * THE OPENING: TEN DAYS, ONE THOUSAND DOLLARS.
 *
 * Tobia (2026-10-29): a banger loader for the $1K Bot. The metal disc drops
 * onto day 01 of a ten-day track and hops along it, one day per hop. Every
 * landing lights its day and rolls an odometer above it, $0,000 climbing to
 * $1,000 on day 10. There the number turns gold, the bot jumps for joy and
 * its eyes light up gold; a gold seam is drawn across the middle of the
 * screen and the screen opens along it onto the page.
 *
 * CSS alone runs it (one-k-bot.css, on one 4 s clock), so it plays from the
 * first paint, on every visit, and ends by itself. The odometer's keyframes
 * are generated here from the same timeline, so the digits roll exactly on
 * the landings. Script only steps it aside on any scroll, key or tap, and
 * reduced motion skips it. Decoration over a page that is already there, so
 * it is hidden from assistive tech.
 */

/** The whole opening, in seconds. Keep in step with one-k-bot.css. */
const T = 4;
/** The bot lands on day 01 here, then hops one day every HOP seconds. */
const FIRST = 0.5;
const HOP = 0.23;
const landing = (day: number) => FIRST + HOP * (day - 1);
/** The odometer after each day's landing: slow, flat days, then it climbs. */
const AFTER_DAY = [0, 0, 60, 60, 210, 210, 430, 610, 780, 1000];
/** Thousands, hundreds, tens, ones. */
const PLACES = [1000, 100, 10, 1];

const pct = (t: number) => `${((t / T) * 100).toFixed(2)}%`;

/**
 * Each digit is a strip of 0-9 repeated, and always rolls forward: a column
 * that goes from 6 to 1 travels 6, 7, 8, 9, 0, 1, like a real counter.
 */
function columns() {
  return PLACES.map((place) => {
    let pos = 0;
    let digit = 0;
    const stops: string[] = ["0% { translate: 0 0; }"];
    AFTER_DAY.forEach((value, i) => {
      const next = Math.floor(value / place) % 10;
      if (next === digit) return;
      const from = pos;
      pos += (next - digit + 10) % 10;
      digit = next;
      const t = landing(i + 1);
      stops.push(
        `${pct(t - 0.05)} { translate: 0 ${-from}em; animation-timing-function: cubic-bezier(0.2, 0.75, 0.25, 1); }`,
        `${pct(t + 0.16)} { translate: 0 ${-pos}em; }`,
      );
    });
    stops.push(`100% { translate: 0 ${-pos}em; }`);
    // A leading zero stays dim until its place first counts (the ones always do).
    const firstDay = place === 1 ? 0 : AFTER_DAY.findIndex((v) => v >= place) + 1;
    const lit = firstDay === 0 ? 0 : landing(firstDay);
    return { place, rolls: pos, lit, keyframes: `@keyframes okb-roll-${place} { ${stops.join(" ")} }` };
  });
}

const COLUMNS = columns();
const KEYFRAMES = COLUMNS.map((c) => c.keyframes).join("\n");

function Digit({ place, rolls, lit }: { place: number; rolls: number; lit: number }) {
  const strip = Array.from({ length: rolls + 1 }, (_, i) => i % 10).join("\n");
  return (
    <span className="okb-load__digit" style={{ "--lit": `${lit}s` } as React.CSSProperties}>
      <span className="okb-load__strip" style={{ animationName: `okb-roll-${place}` }}>
        {strip}
      </span>
    </span>
  );
}

export function OneKBotLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.okbIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    // It ends by itself too. Then stop listening: a late "finish" would
    // restart the fade from fully shown, and for its 320 ms the invisible
    // layer would swallow the click that caused it.
    const end = window.setTimeout(() => {
      for (const e of events) window.removeEventListener(e, finish);
      document.documentElement.dataset.okbIntro = "done";
    }, T * 1000);
    return () => {
      window.clearTimeout(end);
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  const [thousands, hundreds, tens, ones] = COLUMNS;

  return (
    <div className="okb-load" data-done={done || undefined} aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div className="okb-load__half okb-load__half--top" />
      <div className="okb-load__half okb-load__half--bottom" />
      <div className="okb-load__seam" />

      <div className="okb-load__stage">
        <p className="okb-load__count">
          <span className="okb-load__cur">$</span>
          <Digit {...thousands} />
          <span className="okb-load__comma" style={{ "--lit": `${thousands.lit}s` } as React.CSSProperties}>
            ,
          </span>
          <Digit {...hundreds} />
          <Digit {...tens} />
          <Digit {...ones} />
        </p>

        <div className="okb-load__track">
          {AFTER_DAY.map((_, i) => (
            <span key={i} className="okb-load__seg" style={{ "--t": `${landing(i + 1)}s` } as React.CSSProperties}>
              <span className="okb-load__day">{String(i + 1).padStart(2, "0")}</span>
            </span>
          ))}
          <div className="okb-load__x">
            <div className="okb-load__drop">
              <div className="okb-load__hop">
                <div className="okb-load__joy">
                  <svg viewBox="0 0 100 100" className="block h-full w-full overflow-visible">
                    {botShape(LEAD)}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
