"use client";

import { useEffect, useRef } from "react";
import PhotoWave from "@/components/ui/photo-wave";

/**
 * The photo wave, made to answer a finger.
 *
 * PhotoWave only listens for `mousemove`, and a phone never sends one while a
 * finger is moving: iOS fires a single synthetic mouse event on tap, so on a
 * phone the wave sat frozen. This wrapper turns touch and pen pointer moves
 * into the mouse events PhotoWave already understands, without touching the
 * shared component.
 *
 * `touch-action: pan-y` is the other half. A vertical swipe still scrolls the
 * page (so the footer is reachable and nothing traps the thumb); a sideways
 * drag belongs to the wave, and sideways is the axis the wave follows.
 *
 * On a touch screen nobody is hovering, so until the first touch the wave
 * sweeps slowly by itself, and it picks the sweep back up a few seconds after
 * the finger lifts. Under reduced motion there is no sweep: the wave rests,
 * and still follows a finger that asks it to move.
 */
export function TouchWave() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const fire = (x: number, y: number) => {
      const target = el.firstElementChild;
      target?.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, clientX: x, clientY: y }),
      );
    };

    const coarse = window.matchMedia("(pointer: coarse)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let resumeAt = 0;
    const t0 = performance.now();

    const sweep = (now: number) => {
      raf = requestAnimationFrame(sweep);
      if (now < resumeAt) return;
      const r = el.getBoundingClientRect();
      // A slow pass from one end of the fan to the other and back, 9s round
      // trip, riding a little up and down so the scene tilts as well.
      const s = (now - t0) / 1000;
      const u = 0.5 + 0.42 * Math.sin((s * Math.PI * 2) / 9);
      const v = 0.5 + 0.18 * Math.sin((s * Math.PI * 2) / 13);
      fire(r.left + r.width * u, r.top + r.height * v);
    };

    const startSweep = () => {
      if (raf || !coarse.matches || still.matches) return;
      raf = requestAnimationFrame(sweep);
    };
    const stopSweep = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      resumeAt = performance.now() + 3500;
      fire(e.clientX, e.clientY);
    };

    // Pause the sweep off screen and in a hidden tab.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) startSweep();
      else stopSweep();
    });
    io.observe(el);
    const onVisibility = () => (document.hidden ? stopSweep() : startSweep());

    el.addEventListener("pointerdown", onPointer, { passive: true });
    el.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    coarse.addEventListener("change", startSweep);
    still.addEventListener("change", stopSweep);

    return () => {
      stopSweep();
      io.disconnect();
      el.removeEventListener("pointerdown", onPointer);
      el.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      coarse.removeEventListener("change", startSweep);
      still.removeEventListener("change", stopSweep);
    };
  }, []);

  return (
    <div ref={host} className="h-full w-full [touch-action:pan-y]">
      <PhotoWave />
    </div>
  );
}
