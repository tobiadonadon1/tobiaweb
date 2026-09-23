"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BACKTEST_QUARTERS, BACKTEST_TOTAL, type BacktestQuarter } from "./backtest-data";

/**
 * EVERY TRADE, AS A DOT.
 *
 * A unit chart: 8,318 dots, one per trade the bot would have made, poured
 * into seven columns by the quarter the market settled in. Column height is
 * the number of trades, and the dots fill each column bottom up in settlement
 * order, so a column is a jar filling over three months. The 80 trades that
 * lost their whole stake are drawn in clay, larger, with a paper ring.
 *
 * WHY THIS AND NOT A LINE. The claim on the page is "99% paid out, and every
 * quarter came out ahead", and the honest way to show 99% is to show the 1%.
 * A cumulative line would look better and hide exactly that. Here the losses
 * are visible, scattered through every quarter, and the number under each
 * column is still positive.
 *
 * COLOUR IS THE EMPHASIS FORM: one accent (clay) against a de-emphasis grey.
 * The pair was run through the dataviz validator against the paper surface:
 * CVD separation ΔE 13.2, normal-vision ΔE 19.7, both above 3:1 contrast. Loss
 * dots are also bigger, so identity never rests on colour alone.
 *
 * CANVAS, NOT SVG. Eight thousand circles as DOM nodes is a slow page on the
 * phone most visitors arrive on. The canvas draws them; real buttons sit on
 * top of each column for hover, focus and screen readers; and a table carries
 * the same numbers for anyone who cannot see the picture.
 */

const PAID = "#7a8494";
const LOST = "#ce4631";
const PAPER = "#faf8f2";

const MAX_TRADES = Math.max(...BACKTEST_QUARTERS.map((q) => q.trades));

type Geometry = {
  width: number;
  height: number;
  perRow: number;
  pitch: number;
  cols: { x: number; w: number }[];
};

/**
 * One dot pitch for every column, so heights compare truthfully. `perRow` is
 * chosen so the tallest column lands near the target height at any width:
 * height ≈ trades × pitch² / colWidth, solved for the pitch.
 */
function layout(width: number): Geometry {
  const narrow = width < 560;
  const gap = narrow ? 6 : 14;
  // A wider seam between 2025 and 2026, so the years read as two groups.
  const yearGap = gap * 2.2;
  const n = BACKTEST_QUARTERS.length;
  const colW = (width - gap * (n - 2) - yearGap) / n;
  const target = narrow ? 300 : 360;
  const perRow = Math.max(8, Math.round(Math.sqrt((MAX_TRADES * colW) / target)));
  const pitch = colW / perRow;
  const rows = Math.ceil(MAX_TRADES / perRow);

  let x = 0;
  const cols = BACKTEST_QUARTERS.map((q, i) => {
    const col = { x, w: colW };
    const next = BACKTEST_QUARTERS[i + 1];
    x += colW + (next && next.year !== q.year ? yearGap : gap);
    return col;
  });

  return { width, height: Math.ceil(rows * pitch) + 2, perRow, pitch, cols };
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
const lostOf = (q: BacktestQuarter) => q.lostAt.length;

export function BacktestChart() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const progress = useRef(0);
  const frame = useRef(0);

  const lostSets = useMemo(() => BACKTEST_QUARTERS.map((q) => new Set(q.lostAt)), []);

  /* ---- measure ---- */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      // A zero or tiny width (hidden, mid-layout) has no sensible grid, and
      // would make the pitch NaN. Keep the last good layout instead.
      if (w < 160) return;
      setGeo((g) => (g && g.width === w ? g : layout(w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---- draw ---- */
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
    const rLost = Math.max(2.1, pitch * 0.62);
    const ring = Math.max(1, pitch * 0.2);
    const n = BACKTEST_QUARTERS.length;

    const shown = (i: number) => {
      // Each column starts a little after the one before it.
      const t = Math.min(1, Math.max(0, (progress.current * (1 + 0.08 * n) - 0.08 * i)));
      return Math.round(ease(t) * BACKTEST_QUARTERS[i].trades);
    };

    const pos = (i: number, k: number) => {
      const col = geo.cols[i];
      const row = Math.floor(k / perRow);
      const x = col.x + (k % perRow) * pitch + pitch / 2;
      const y = geo.height - 1 - row * pitch - pitch / 2;
      return [x, y] as const;
    };

    BACKTEST_QUARTERS.forEach((q, i) => {
      const dim = active !== null && active !== i;
      const count = shown(i);

      ctx.globalAlpha = dim ? 0.28 : 1;
      ctx.fillStyle = PAID;
      ctx.beginPath();
      for (let k = 0; k < count; k++) {
        if (lostSets[i].has(k)) continue;
        const [x, y] = pos(i, k);
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Losses last, on top, ringed in paper so they stay legible in the field.
      for (const k of q.lostAt) {
        if (k >= count) continue;
        const [x, y] = pos(i, k);
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        ctx.arc(x, y, rLost + ring, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = LOST;
        ctx.beginPath();
        ctx.arc(x, y, rLost, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }, [geo, active, lostSets]);

  // The pour's animation frame calls the latest draw through this ref, so a
  // hover mid-pour repaints the dimming without restarting the pour.
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
    draw();
  }, [draw]);

  /* ---- pour, once, when it arrives ---- */
  useEffect(() => {
    const el = wrap.current;
    if (!el || !geo) return;
    if (progress.current >= 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      drawRef.current();
      return;
    }

    const DURATION = 1600;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Resumes from wherever it was, if a resize interrupted it.
        const start = performance.now() - progress.current * DURATION;
        const tick = (now: number) => {
          progress.current = Math.min(1, (now - start) / DURATION);
          drawRef.current();
          if (progress.current < 1) frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [geo]);

  const tipQuarter = active !== null ? BACKTEST_QUARTERS[active] : null;
  const tipCol = active !== null && geo ? geo.cols[active] : null;

  return (
    <figure className="m-0">
      {/* ---- legend: two classes, so a legend, and it mirrors the marks ---- */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.66)]">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: PAID }} />
          Paid in full · {(BACKTEST_TOTAL.trades - BACKTEST_TOTAL.lost).toLocaleString("en-US")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full ring-2 ring-[var(--paper)]" style={{ background: LOST }} />
          Lost the stake · {BACKTEST_TOTAL.lost}
        </span>
      </div>

      <div ref={wrap} className="relative w-full" style={{ height: geo?.height ?? 360 }}>
        <canvas
          ref={canvas}
          aria-hidden
          className="absolute inset-0 h-full w-full"
          style={{ width: "100%", height: geo?.height ?? 360 }}
        />

        {/* One real control per column: the hit area, the focus stop and the
            accessible name. Bigger than the dots, which is the point. */}
        {geo?.cols.map((col, i) => {
          const q = BACKTEST_QUARTERS[i];
          return (
            <button
              key={`${q.year}-${q.quarter}`}
              type="button"
              aria-label={`${q.year} Q${q.quarter}: ${q.trades.toLocaleString("en-US")} trades, ${lostOf(q)} lost, ${pct(q.avgReturnPct)} average per trade`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              onClick={() => setActive((a) => (a === i ? null : i))}
              className="absolute bottom-0 top-0 cursor-default rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-clay)]"
              style={{ left: col.x - 3, width: col.w + 6 }}
            />
          );
        })}

        {/* ---- the tooltip: value first, then what it is ---- */}
        {tipQuarter && tipCol && geo ? (
          <div
            role="status"
            className="pointer-events-none absolute z-10 w-max max-w-[15rem] rounded-xl border border-[var(--hairline)] bg-[rgba(250,248,242,0.94)] px-4 py-3 shadow-[0_18px_40px_-20px_rgba(11,31,58,0.45)] backdrop-blur-md"
            style={{
              left: Math.min(
                Math.max(0, tipCol.x + tipCol.w / 2 - 96),
                Math.max(0, geo.width - 200),
              ),
              bottom:
                Math.ceil(tipQuarter.trades / geo.perRow) * geo.pitch + 14,
            }}
          >
            <p className="font-serif text-[1.5rem] leading-none tracking-[-0.02em] text-[var(--ink)]">
              {pct(tipQuarter.avgReturnPct)}
            </p>
            <p className="mt-1 text-[0.85rem] text-[color:rgba(11,31,58,0.7)]">
              average per trade
            </p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[color:rgba(11,31,58,0.62)]">
              {tipQuarter.year} Q{tipQuarter.quarter} · {tipQuarter.trades.toLocaleString("en-US")} trades · {lostOf(tipQuarter)} lost
            </p>
          </div>
        ) : null}
      </div>

      {/* ---- the axis: quarter, and the number that is the claim ---- */}
      {geo ? (
        <div aria-hidden className="relative mt-3" style={{ height: 64 }}>
          {geo.cols.map((col, i) => {
            const q = BACKTEST_QUARTERS[i];
            return (
              <div
                key={`${q.year}-${q.quarter}`}
                className="absolute top-0 text-center"
                style={{ left: col.x, width: col.w }}
              >
                <span
                  className={`block whitespace-nowrap text-[0.64rem] tabular-nums tracking-[-0.03em] transition-colors sm:text-[0.8rem] sm:tracking-[-0.01em] md:text-[0.95rem] ${
                    active === i ? "text-[var(--accent-clay-text)]" : "text-[var(--ink)]"
                  }`}
                >
                  {pct(q.avgReturnPct)}
                </span>
                <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(11,31,58,0.62)] md:text-[0.68rem]">
                  Q{q.quarter}
                </span>
              </div>
            );
          })}
          {/* Years, under their quarters, on a hairline. */}
          {[2025, 2026].map((year) => {
            const idx = BACKTEST_QUARTERS.flatMap((q, i) => (q.year === year ? [i] : []));
            const first = geo.cols[idx[0]];
            const last = geo.cols[idx[idx.length - 1]];
            return (
              <div
                key={year}
                className="absolute border-t border-[var(--hairline-strong)] pt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)] md:text-[0.68rem]"
                style={{ left: first.x, width: last.x + last.w - first.x, top: 44 }}
              >
                {year}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The same numbers, as a table, for anyone who cannot see the dots. */}
      <table className="sr-only">
        <caption>Backtest of The 98¢ Trade on Polymarket, by quarter settled</caption>
        <thead>
          <tr>
            <th scope="col">Quarter</th>
            <th scope="col">Trades</th>
            <th scope="col">Lost</th>
            <th scope="col">Average return per trade</th>
          </tr>
        </thead>
        <tbody>
          {BACKTEST_QUARTERS.map((q) => (
            <tr key={`${q.year}-${q.quarter}`}>
              <th scope="row">
                {q.year} Q{q.quarter}
              </th>
              <td>{q.trades}</td>
              <td>{lostOf(q)}</td>
              <td>{pct(q.avgReturnPct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
