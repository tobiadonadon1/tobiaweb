"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * THE CURSOR.
 *
 * A dot that follows the pointer and opens into a larger transparent circle
 * over anything you can click. Tobia sent the reference and was clear about
 * both halves: the follow AND the open. Red, not the blue that was here
 * before.
 *
 * WHAT IS DIFFERENT FROM THE REFERENCE, and it is the only thing. The version
 * he sent exposes a `<CustomCursorTarget>` wrapper and you tag every clickable
 * thing on the site with it by hand. Across this many pages that is a tax you
 * pay forever, and any link somebody forgets to wrap silently does nothing.
 * This listens once at the document instead and works out what is under the
 * pointer from the event, so every link, button and control on the site is a
 * target the moment it exists, including ones added later.
 *
 * THE TWO REGION MARKERS ARE HONOURED, because both already exist and both
 * still mean what they meant:
 *
 *   [data-cursor-hide]   the region runs its own pointer feedback (the
 *                        homepage statement's clay spotlight). The dot leaves
 *                        entirely rather than competing with it. This is what
 *                        keeps it off the opening phrase under the hero.
 *   [data-cursor-quiet]  the region is fine with the dot but not with it
 *                        growing (the Thoughts desktop, whose file icons look
 *                        wrong under a 48px ring).
 *
 * Fine pointers only, and nothing at all under reduced motion: a spring that
 * chases the pointer is exactly the kind of movement that setting turns off.
 */

/** Straight from the reference. */
const COLOR = "#ff4c24";
const DOT = 16;
const RING = 48;

const TARGETS =
  "a[href], button:not([disabled]), [role='button'], summary, label[for], input, select, textarea, [data-cursor]";

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 22, stiffness: 150, mass: 0.8 });
  const springY = useSpring(y, { damping: 22, stiffness: 150, mass: 0.8 });

  /* ---- is there a real pointer, and does the reader want motion ---- */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const on = fine && !prefersReduced;

  /* ---- the native cursor steps aside, as it did before ---- */
  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [on]);

  /* ---- follow, and decide what is underneath ---- */
  useEffect(() => {
    if (!on) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;

      // A region with its own pointer feedback takes the dot away entirely.
      if (t.closest("[data-cursor-hide]")) {
        setHidden(true);
        return;
      }
      setHidden(false);
      // A quiet region keeps the dot and refuses the ring.
      setHovering(
        !t.closest("[data-cursor-quiet]") && Boolean(t.closest(TARGETS)),
      );
    };

    const onLeave = () => setHidden(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [on, x, y]);

  if (!on) return null;

  const size = hovering ? RING : DOT;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border"
      initial={false}
      animate={{
        width: size,
        height: size,
        // Solid at rest, a transparent wash once it opens, so the thing under
        // it stays readable through the ring.
        backgroundColor: hovering ? "rgba(255,76,36,0.3)" : COLOR,
        borderColor: COLOR,
        opacity: hidden ? 0 : 1,
      }}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        borderWidth: 1,
      }}
      transition={{ duration: 0.375, ease: [0.625, 0.05, 0, 1] }}
    />
  );
}
