"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Mascot, M } from "./mascot-designer-live";

/**
 * MASCOT DESIGNER, the casts: the seven on the hero's podiums and the twenty
 * on the toy shelf. Every one is a real mascot from the skill's library, on
 * the skill's own runtime.
 */

type El = HTMLElement & { play: (m: string) => void; state: string };

/** The podium tops in world-v1.webp (1774 x 887): centre x, top-face y, as fractions. */
const PODIUMS: { x: number; y: number; id: string; move: string; name: string }[] = [
  { x: 0.0874, y: 0.631, id: "hoot", move: "point", name: "Hoot, the learning owl" },
  { x: 0.2204, y: 0.555, id: "byte", move: "think", name: "Byte, the AI helper" },
  { x: 0.3574, y: 0.614, id: "ember", move: "idle", name: "Ember, the streak flame" },
  { x: 0.4983, y: 0.532, id: "penny", move: "idle", name: "Penny, the savings pig" },
  { x: 0.6387, y: 0.611, id: "luna", move: "sleep", name: "Luna, the sleepy night cat" },
  { x: 0.7785, y: 0.565, id: "scout", move: "idle", name: "Scout, the travel fox" },
  { x: 0.9132, y: 0.639, id: "fuzz", move: "love", name: "Fuzz, the music monster" },
];
const BOX = 0.17; // mascot box width, as a fraction of the stage width (the stage is 2:1)

export function HeroCast() {
  const stage = useRef<HTMLDivElement>(null);
  // A director: every couple of seconds someone on stage does something.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = () => [...(stage.current?.querySelectorAll("mascot-view") ?? [])] as El[];
    const plan: [number, string][] = [[3, "hello"], [2, "celebrate"], [5, "hello"], [3, "appear"], [0, "point"], [1, "celebrate"], [4, "hello"], [6, "celebrate"], [5, "celebrate"], [2, "hello"]];
    let i = 0;
    const kick = window.setTimeout(() => els()[3]?.play?.("hello"), 900);
    const t = window.setInterval(() => {
      const [k, m] = plan[i++ % plan.length];
      const el = els()[k];
      if (el?.play && !["hello", "celebrate", "appear"].includes(el.state)) el.play(m);
    }, 2300);
    return () => { window.clearTimeout(kick); window.clearInterval(t); };
  }, []);
  return (
    <div ref={stage} className="md-stage">
      <Image src="/shop/mascot-designer/world-v1.webp" alt="" fill priority sizes="max(100vw, 980px)" />
      {PODIUMS.map((p) => (
        <Mascot
          key={p.id}
          id={p.id}
          move={p.move}
          lazy={false}
          label={p.name}
          className="!w-[17%]"
          style={{ left: `${(p.x - BOX / 2) * 100}%`, top: `${(p.y - 0.94 * BOX * 2) * 100}%` }}
          poses={`idle,blink,wave,celebrate,${p.move}`}
        />
      ))}
      <span className="md-say hidden sm:block" style={{ left: "55.5%", top: "21%" }}>Psst. Tap us.</span>
    </div>
  );
}

/** The 20, placed so each stands against a wall of a contrasting colour (shelf-v1's walls, row by row). */
const LIBRARY: [string, string, string][] = [
  ["drop", "Drop", "Hydration"], ["penny", "Penny", "Savings"], ["nimbus", "Nimbus", "Cloud & sync"], ["byte", "Byte", "AI helper"], ["mochi", "Mochi", "Calm"],
  ["shelly", "Shelly", "Security"], ["tick", "Tick", "Time"], ["volt", "Volt", "Energy"], ["luna", "Luna", "Sleep"], ["scout", "Scout", "Travel"],
  ["pebble", "Pebble", "Journaling"], ["sprout", "Sprout", "Habits"], ["inky", "Inky", "Writing"], ["hoot", "Hoot", "Learning"], ["ember", "Ember", "Streaks"],
  ["toasty", "Toasty", "Food"], ["chatty", "Chatty", "Chat"], ["fuzz", "Fuzz", "Music"], ["bagsy", "Bagsy", "Shopping"], ["biscuit", "Biscuit", "Pets"],
];
/** Compartment openings in shelf-v1.webp (1402 x 1122), in pixels. */
const COLS: [number, number][] = [[19, 281], [298, 557], [572, 828], [843, 1103], [1118, 1381]];
const ROWS: [number, number][] = [[14, 272], [290, 544], [560, 819], [829, 1093]];
const SW = 1402, SH = 1122;

export function LibraryShelf() {
  return (
    <div className="md-shelf mx-auto max-w-[62rem]" style={{ ["--shelf-ar" as string]: `${SW / SH}` }}>
      <Image src="/shop/mascot-designer/shelf-v1.webp" alt="" fill sizes="(min-width: 1024px) 62rem, 100vw" />
      <ul className="m-0 list-none p-0">
        {LIBRARY.map(([id, name, what], i) => {
          const [c0, c1] = COLS[i % 5], [r0, r1] = ROWS[Math.floor(i / 5)];
          return (
            <li
              key={id}
              className="slot"
              style={{ left: `${(c0 / SW) * 100}%`, top: `${(r0 / SH) * 100}%`, width: `${((c1 - c0) / SW) * 100}%`, height: `${((r1 - r0) / SH) * 100}%` }}
            >
              <Mascot id={id} move={id === "luna" ? "sleep" : "idle"} label={`${name}: ${what}`} poses={`idle,blink,wave,celebrate${id === "luna" ? ",sleep" : ""}`} style={{ bottom: "-5%" }} />
              <span className="md-round pointer-events-none absolute left-[6%] top-[6%] rounded-full bg-white/90 px-2 py-0.5 text-[clamp(0.55rem,1.15vw,0.85rem)] font-bold leading-tight text-[#2B1640] shadow-[0_2px_0_rgba(43,22,64,0.25)]">
                {name} <span className="font-semibold opacity-60">· {what}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { M };
