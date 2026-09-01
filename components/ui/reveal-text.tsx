"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Text that is only just there until you go looking for it.
 *
 * At rest it sits at a whisper of ink on the paper: visible enough that you
 * can tell something is written, too faint to read. A soft light follows the
 * pointer and brings whatever is under it up to full contrast, so the line is
 * read by sweeping across it rather than by being handed over.
 *
 * Accessibility, deliberately: the resting state is a real, perceivable tint
 * rather than paper-on-paper, the copy is always in the DOM at full strength
 * for assistive tech, and the whole effect is REFUSED on coarse pointers and
 * under reduced motion, where the line simply renders at normal contrast. A
 * touch reader and a keyboard reader lose nothing. Never put load-bearing
 * copy in here; it is for a line that rewards curiosity, not one that carries
 * the argument.
 *
 * One rAF-free pointermove writes two CSS custom properties. The mask is a
 * radial gradient on a duplicated layer, so nothing reflows and nothing
 * repaints outside the light.
 */
const FINE = "(pointer: fine)";
const CALM = "(prefers-reduced-motion: no-preference)";

function getPointerSnapshot() {
  return window.matchMedia(FINE).matches && window.matchMedia(CALM).matches;
}

function subscribeToPointer(onChange: () => void) {
  const a = window.matchMedia(FINE);
  const b = window.matchMedia(CALM);
  a.addEventListener("change", onChange);
  b.addEventListener("change", onChange);
  return () => {
    a.removeEventListener("change", onChange);
    b.removeEventListener("change", onChange);
  };
}

export function RevealText({
  children,
  radius = 110,
  className = "",
  restColor = "rgba(11,31,58,0.2)",
  litColor = "var(--ink)",
}: {
  children: React.ReactNode;
  /** Radius of the light, in px. */
  radius?: number;
  className?: string;
  /** How present the line is before the pointer arrives. */
  restColor?: string;
  litColor?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  /**
   * Whether this device should get the effect at all. Read through
   * useSyncExternalStore rather than set from an effect: the server snapshot
   * is `false`, so the first paint is plain readable text on every device, and
   * a reader who changes their motion setting mid-session is picked up live
   * without a cascading re-render.
   */
  const lit = useSyncExternalStore(subscribeToPointer, getPointerSnapshot, () => false);

  useEffect(() => {
    const el = host.current;
    if (!el || !lit) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Only pay for the work while the pointer is near the line.
      if (
        e.clientX < r.left - radius ||
        e.clientX > r.right + radius ||
        e.clientY < r.top - radius ||
        e.clientY > r.bottom + radius
      ) {
        el.style.setProperty("--rt-o", "0");
        return;
      }
      el.style.setProperty("--rt-o", "1");
      el.style.setProperty("--rt-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--rt-y", `${e.clientY - r.top}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [radius, lit]);

  const mask = `radial-gradient(circle ${radius}px at var(--rt-x, -999px) var(--rt-y, -999px), #000 0%, #000 34%, rgba(0,0,0,0.35) 68%, transparent 100%)`;

  return (
    <span
      ref={host}
      className={`relative inline-block ${className}`}
      style={{ ["--rt-o" as string]: "0" }}
    >
      {/* The resting layer. This is the real text: it stays in the accessibility
          tree and is what a screen reader announces. */}
      <span style={{ color: lit ? restColor : litColor }}>{children}</span>

      {/* The lit layer, masked to the light. Hidden from assistive tech so the
          line is not announced twice. */}
      {lit ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            color: litColor,
            opacity: "var(--rt-o)",
            transition: "opacity 420ms ease-out",
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
