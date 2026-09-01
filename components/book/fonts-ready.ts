"use client";

/**
 * Run `task` once the webfonts have actually loaded.
 *
 * Every split on this page measures type. Instrument Serif arrives via
 * next/font with `font-display: swap`, so splitting before it lands measures
 * the fallback and leaves the line boxes wrong the moment the serif swaps in.
 *
 * Returns a cancel function: call it from the effect cleanup so a component
 * that unmounted while the font was still loading never touches the DOM.
 */
export function whenFontsReady(task: () => void) {
  let cancelled = false;
  const run = () => {
    if (!cancelled) task();
  };

  if (typeof document === "undefined") return () => {};
  if (document.fonts?.status === "loaded") run();
  else (document.fonts?.ready ?? Promise.resolve()).then(run);

  return () => {
    cancelled = true;
  };
}
