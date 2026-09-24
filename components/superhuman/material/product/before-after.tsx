"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BACKTEST_QUARTERS, BACKTEST_TOTAL } from "./backtest-data";

/**
 * BEFORE AND AFTER: the bot that guessed, and the one that doesn't.
 *
 * Tobia's brief: show that the first bot didn't work, then that the losses
 * collapsed. So two cards, each mark a real trade:
 *
 *   BEFORE is the first bot's own dashboard, seven trades from one evening,
 *   typeset rather than screenshotted so it stays legible on a phone. Every
 *   row is exactly as the dashboard showed it (time to the minute, entry
 *   price, outcome, P&L). It is on ink, like the dashboard it came from.
 *   AFTER is every trade The 98¢ Trade would have made in the backtest, 8,318
 *   dots poured in settlement order, the 80 losses in clay.
 *
 * Under both, the same bar on the same 0 to 100% scale: the share of trades
 * lost. That bar is the collapse, and it is honest only because the scale is
 * shared.
 *
 * WHAT THE COPY DOES NOT SAY. It does not say Jev alone cut the losses. The
 * product's EVIDENCE.md is explicit that Jev's dispute filter on its own did
 * not improve returns; the change is the whole approach (stop guessing, buy
 * only 97 to 99.5¢ favorites, let Jev read the rules and skip the market types
 * that lag). The page credits the approach.
 *
 * Colour: loss clay against grey, as validated for the old unit chart. On the
 * ink card the clay is lifted to #f07a5f (6.0:1) and wins are #aab3c2 (7.8:1),
 * and every row also says Lost or Won in words.
 */

/** From the first bot's "Recent trades" panel, oldest first. $10 each, all "up" bets on 5-minute markets. */
const FIRST_BOT = [
  { time: "18:28", asset: "SOL", paid: 28, won: true, pnl: 13.7 },
  { time: "18:28", asset: "BTC", paid: 31, won: false, pnl: -7.15 },
  { time: "18:29", asset: "SOL", paid: 15, won: false, pnl: -8.06 },
  { time: "18:34", asset: "DOGE", paid: 68, won: true, pnl: 4.55 },
  { time: "18:38", asset: "ETH", paid: 18, won: false, pnl: -8.52 },
  { time: "18:38", asset: "SOL", paid: 41, won: false, pnl: -8.47 },
  { time: "18:38", asset: "XRP", paid: 28, won: false, pnl: -5.48 },
] as const;

const BEFORE_LOST = FIRST_BOT.filter((t) => !t.won).length;
const BEFORE_PNL = FIRST_BOT.reduce((n, t) => n + t.pnl, 0);

const PAID = "#7a8494";
const LOST = "#ce4631";
const PAPER = "#faf8f2";
const LOST_ON_INK = "#f07a5f";
const WON_ON_INK = "#aab3c2";

const money = (n: number) => `${n < 0 ? "−" : "+"}$${Math.abs(n).toFixed(2)}`;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Every backtest loss as a position in the whole run, in settlement order. */
const LOSS_AT = (() => {
  const set = new Set<number>();
  let offset = 0;
  for (const q of BACKTEST_QUARTERS) {
    for (const k of q.lostAt) set.add(offset + k);
    offset += q.trades;
  }
  return set;
})();

const EDGE = 4; // px of paper around the dot field
const ROW_STEP = 170; // ms between the before rows arriving
const POUR_AFTER = FIRST_BOT.length * ROW_STEP + 250;

export function BeforeAfter() {
  const root = useRef<HTMLDivElement>(null);
  // "still" until the section is seen; reduced motion goes straight to "done".
  const [phase, setPhase] = useState<"still" | "live" | "done">("still");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reading the preference once, on mount, is the point.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("live");
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const moving = phase === "live";
  const shown = phase !== "still";

  return (
    <div ref={root} className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
      {/* ---------------------------------------------------------- *
       * BEFORE
       * ---------------------------------------------------------- */}
      <figure className="m-0 flex flex-col rounded-2xl bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[0_30px_60px_-36px_rgba(11,31,58,0.7)] sm:p-7">
        <figcaption>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[rgba(250,248,242,0.62)]">
            Before · the first bot
          </span>
          <p className="mt-2 max-w-[36ch] text-pretty text-[0.98rem] leading-[1.5] text-[rgba(250,248,242,0.78)]">
            Seven $10 bets that a coin would be up five minutes later. One evening.
          </p>
        </figcaption>

        <table className="mt-6 w-full border-collapse font-mono text-[0.78rem] tabular-nums sm:text-[0.84rem]">
          <caption className="sr-only">
            The first bot&rsquo;s trades: {BEFORE_LOST} of {FIRST_BOT.length} lost
          </caption>
          <thead>
            <tr className="text-left text-[0.64rem] uppercase tracking-[0.14em] text-[rgba(250,248,242,0.5)]">
              <th scope="col" className="pb-2 font-normal">Time</th>
              <th scope="col" className="pb-2 font-normal">Coin</th>
              <th scope="col" className="pb-2 font-normal">Paid</th>
              <th scope="col" className="pb-2 font-normal">Result</th>
              <th scope="col" className="pb-2 text-right font-normal">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {FIRST_BOT.map((t, i) => (
              <tr
                key={i}
                className="border-t border-[rgba(250,248,242,0.1)]"
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "none" : "translateY(8px)",
                  transition: moving
                    ? `opacity 0.5s ease ${i * ROW_STEP}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * ROW_STEP}ms`
                    : undefined,
                }}
              >
                <td className="py-2.5 text-[rgba(250,248,242,0.55)]">{t.time}</td>
                <td className="py-2.5">{t.asset}</td>
                <td className="py-2.5 text-[rgba(250,248,242,0.78)]">{t.paid}¢</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-2" style={{ color: t.won ? WON_ON_INK : LOST_ON_INK }}>
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={t.won ? { boxShadow: `inset 0 0 0 1.5px ${WON_ON_INK}` } : { background: LOST_ON_INK }}
                    />
                    {t.won ? "Won" : "Lost"}
                  </span>
                </td>
                <td className="py-2.5 text-right" style={{ color: t.won ? WON_ON_INK : LOST_ON_INK }}>
                  {money(t.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Tally
          big={`${BEFORE_LOST} of ${FIRST_BOT.length} lost`}
          small={`${money(BEFORE_PNL)} in ten minutes`}
          share={BEFORE_LOST / FIRST_BOT.length}
          onInk
          grow={shown}
          delay={moving ? FIRST_BOT.length * ROW_STEP : 0}
        />
      </figure>

      {/* ---------------------------------------------------------- *
       * AFTER
       * ---------------------------------------------------------- */}
      <figure className="m-0 flex flex-col rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] p-5 shadow-[0_30px_60px_-40px_rgba(11,31,58,0.45)] sm:p-7">
        <figcaption>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            After · The 98¢ Trade
          </span>
          <p className="mt-2 max-w-[40ch] text-pretty text-[0.98rem] leading-[1.5] text-[color:rgba(11,31,58,0.72)]">
            Every trade it would have made on Polymarket, January 2025 to
            September 2026. Each dot is one.
          </p>
        </figcaption>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.66)]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: PAID }} />
            Paid in full
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full ring-2 ring-[var(--paper)]" style={{ background: LOST }} />
            Lost
          </span>
        </div>

        <Field pour={phase} delay={moving ? POUR_AFTER : 0} />

        <Tally
          big={`${BACKTEST_TOTAL.lost} of ${BACKTEST_TOTAL.trades.toLocaleString("en-US")} lost`}
          small={`+${BACKTEST_TOTAL.avgReturnPct}% per trade on average`}
          share={BACKTEST_TOTAL.lost / BACKTEST_TOTAL.trades}
          grow={shown}
          delay={moving ? POUR_AFTER + 1400 : 0}
        />
      </figure>
    </div>
  );
}

/**
 * The count, and the share of trades lost as a bar on a fixed 0 to 100%
 * scale, so the two cards' bars compare directly.
 */
function Tally({
  big,
  small,
  share,
  onInk = false,
  grow,
  delay,
}: {
  big: string;
  small: string;
  share: number;
  onInk?: boolean;
  grow: boolean;
  delay: number;
}) {
  const pct = Math.round(share * 100);
  return (
    <div className="mt-auto pt-7">
      <p
        className="font-serif text-[clamp(2rem,4.4vw,2.7rem)] leading-none tracking-[-0.035em]"
        style={{ color: onInk ? LOST_ON_INK : "var(--ink)" }}
      >
        {big}
      </p>
      <p className={`mt-2 text-[0.95rem] ${onInk ? "text-[rgba(250,248,242,0.7)]" : "text-[color:rgba(11,31,58,0.66)]"}`}>
        {small}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div
          aria-hidden
          className={`relative h-1.5 flex-1 overflow-hidden rounded-full ${onInk ? "bg-[rgba(250,248,242,0.14)]" : "bg-[rgba(11,31,58,0.1)]"}`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              // A share under 1% still gets a visible sliver, never nothing.
              width: grow ? `max(${share * 100}%, 3px)` : "0%",
              background: onInk ? LOST_ON_INK : LOST,
              transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }}
          />
        </div>
        <span
          className={`w-[4.5rem] shrink-0 text-right font-mono text-[0.68rem] uppercase tracking-[0.14em] ${onInk ? "text-[rgba(250,248,242,0.7)]" : "text-[color:rgba(11,31,58,0.66)]"}`}
        >
          {pct < 1 ? "<1" : pct}% lost
        </span>
      </div>
    </div>
  );
}

/**
 * 8,318 dots on a canvas, poured in settlement order once the rows have
 * landed. One pitch fills the box whatever its width.
 */
function Field({ pour, delay }: { pour: "still" | "live" | "done"; delay: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [geo, setGeo] = useState<{ width: number; height: number; perRow: number; pitch: number } | null>(null);
  const progress = useRef(0);
  const frame = useRef(0);
  const N = BACKTEST_TOTAL.trades;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w < 160) return;
      const target = w < 480 ? 250 : 300;
      // The loss dots are bigger than the pitch, so the grid sits inset by
      // EDGE on every side and none of them is clipped at the canvas edge.
      const inner = w - EDGE * 2;
      const pitch = Math.sqrt((inner * target) / N);
      const perRow = Math.max(20, Math.floor(inner / pitch));
      const p = inner / perRow;
      const height = Math.ceil(Math.ceil(N / perRow) * p) + EDGE * 2;
      setGeo((g) => (g && g.width === w ? g : { width: w, height, perRow, pitch: p }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [N]);

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c || !geo) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== Math.round(geo.width * dpr)) {
      c.width = Math.round(geo.width * dpr);
      c.height = Math.round(geo.height * dpr);
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, geo.width, geo.height);

    const { pitch, perRow } = geo;
    const r = Math.max(0.8, pitch * 0.34);
    const rLost = Math.max(2.2, pitch * 0.66);
    const ring = Math.max(1, pitch * 0.22);
    const count = Math.round(ease(progress.current) * N);
    const at = (k: number) =>
      [EDGE + (k % perRow) * pitch + pitch / 2, EDGE + Math.floor(k / perRow) * pitch + pitch / 2] as const;

    ctx.fillStyle = PAID;
    ctx.beginPath();
    for (let k = 0; k < count; k++) {
      if (LOSS_AT.has(k)) continue;
      const [x, y] = at(k);
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();

    for (const k of LOSS_AT) {
      if (k >= count) continue;
      const [x, y] = at(k);
      ctx.fillStyle = PAPER;
      ctx.beginPath();
      ctx.arc(x, y, rLost + ring, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LOST;
      ctx.beginPath();
      ctx.arc(x, y, rLost, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [geo, N]);

  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
    draw();
  }, [draw]);

  useEffect(() => {
    if (!geo || pour === "still") return;
    if (pour === "done") {
      progress.current = 1;
      drawRef.current();
      return;
    }
    if (progress.current >= 1) return;
    const DURATION = 1400;
    let start = 0;
    const timer = window.setTimeout(() => {
      start = performance.now() - progress.current * DURATION;
      const tick = (now: number) => {
        progress.current = Math.min(1, (now - start) / DURATION);
        drawRef.current();
        if (progress.current < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame.current);
    };
  }, [geo, pour, delay]);

  return (
    <div ref={wrap} className="relative mt-4 w-full" style={{ height: geo?.height ?? 300 }}>
      <canvas
        ref={canvas}
        role="img"
        aria-label={`${N.toLocaleString("en-US")} backtested trades as dots, ${BACKTEST_TOTAL.lost} of them lost`}
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: geo?.height ?? 300 }}
      />
    </div>
  );
}
