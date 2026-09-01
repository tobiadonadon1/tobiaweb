"use client";

import { useEffect, useState } from "react";

/**
 * Read the preference synchronously, inside an effect.
 *
 * The hook below cannot help there: it has to start `false` so the server and
 * the first client render agree, which means an effect that trusted it would
 * hide its content for one tick before the state caught up. Reverting that is
 * unreliable, so every effect that hides something asks this first and simply
 * never runs.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True once the browser has told us the reader wants less motion.
 *
 * Starts false so the server render and the first client render agree; every
 * component that uses it must render its FINISHED state by default and only
 * hide things once motion is known to be welcome. That way a reduced-motion
 * reader never sees a flash of the hidden state.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}
