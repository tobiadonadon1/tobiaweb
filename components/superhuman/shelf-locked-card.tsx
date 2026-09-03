"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A DOOR THAT DOES NOT OPEN.
 *
 * Masterclass and Design used to be links to pages of their own: a lede, an
 * intro, an empty state and an email field. Two rooms with nothing in them.
 * Those pages are gone, and so are the two CTAs that promised them ("See what
 * is coming", "See the templates"), because a door labelled with what is behind
 * it should not be labelled at all when there is nothing behind it yet.
 *
 * What is here instead: click it and the drawing shakes its head and says "Now
 * locked" for two seconds. Tobia asked for it "in a sweet, humble, very chill
 * way", which is the whole design brief and rules out most of what a locked
 * state usually looks like. So there is no modal, no toast in the corner, no
 * disabled grey, and nothing you have to dismiss. It happens where you clicked,
 * it apologises, and it goes away on its own.
 *
 * THE SHAKE IS `animate()`, NOT A CSS CLASS. The point of it is that it fires
 * AGAIN on the next click, and a class has to be removed, reflowed and re-added
 * to restart an animation. The handle is kept and CANCELLED before each new
 * one: `animate()` starts a fresh Animation rather than rewinding the running
 * one, so without the cancel an impatient clicker stacks live animations on the
 * same element, all of them composing on `transform`.
 *
 * THE FLASH IS MOUNTED, NOT FADED. It lives inside a live region and is
 * rendered only while it is up, so a screen reader is actually told "Now
 * locked" rather than being handed an element whose opacity changed. See
 * `.shelf-lock-flash` in globals.css for the fade and the red bloom.
 *
 * THE DRAWING IS A PROP. It is a server component (the cut-paper Specimen, with
 * its filters and its dozen paths) and it has no reason to be in the client
 * bundle just because the thing wrapping it needs a click handler.
 */

/** How long "Now locked" stays up. */
const FLASH_MS = 2000;
/**
 * The head shake. Deliberately short: much past half a second and it stops
 * reading as "not yet" and starts reading as broken.
 */
const SHAKE_MS = 620;

export function ShelfLockedCard({
  mark,
  body,
}: {
  /** The family's drawing. Rendered on the server, shaken here. */
  mark: ReactNode;
  /** Name, chip and line. Shared with the open card, so there is one copy. */
  body: ReactNode;
}) {
  const markRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const shake = useRef<Animation | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      shake.current?.cancel();
    },
    [],
  );

  const knock = useCallback(() => {
    setFlash(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(false), FLASH_MS);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    shake.current?.cancel();
    shake.current = markRef.current?.animate(
      [
        { transform: "rotate(0deg) translateX(0)" },
        { transform: "rotate(-3.4deg) translateX(-5px)" },
        { transform: "rotate(2.8deg) translateX(4px)" },
        { transform: "rotate(-2deg) translateX(-3px)" },
        { transform: "rotate(1.1deg) translateX(2px)" },
        { transform: "rotate(0deg) translateX(0)" },
      ],
      { duration: SHAKE_MS, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" },
    ) ?? null;
  }, []);

  return (
    <button
      type="button"
      onClick={knock}
      className="group flex h-full w-full flex-col rounded-sm p-2 text-left text-[var(--paper)] transition-colors duration-[600ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
    >
      <span ref={markRef} className="relative block w-full">
        {mark}

        {/* The flash sits over the drawing, centred on it, and never takes the
            pointer: the click that summoned it must still land on the card. */}
        <span
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          {flash ? (
            <span className="shelf-lock-flash inline-flex items-center rounded-full border border-[rgba(240,112,92,0.45)] bg-[rgba(8,20,38,0.92)] px-4 py-1.5 font-hand text-[1.2rem] leading-none text-[#f0705c]">
              Now locked
            </span>
          ) : null}
        </span>
      </span>

      {body}
    </button>
  );
}
