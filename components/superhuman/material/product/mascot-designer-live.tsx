"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MASCOT DESIGNER, the live bits: real mascots running the skill's own web
 * runtime (public/shop/mascot-designer/mascot.js, the same file the skill
 * hands people, movement library inside). Nothing here is a video or a GIF:
 * each mascot is a <mascot-view> doing the skill's moves, and they react.
 *
 * Pictures are the library's (public/shop/mascot-designer/m/<id>/, 512 px):
 * the same 20 mascots the skill gives people without an OpenAI account.
 */

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "mascot-view": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        state?: string;
        side?: string;
        lazy?: boolean | string;
        poke?: string;
        shadow?: string;
        poses?: string;
      };
    }
  }
}

type MascotEl = HTMLElement & { play: (m: string, o?: { side?: string }) => void; poke: () => void; state: string };

const RUNTIME = "/shop/mascot-designer/mascot.js";
let loading: Promise<void> | null = null;
function useRuntime() {
  useEffect(() => {
    if (loading || typeof window === "undefined") return;
    if (customElements.get("mascot-view")) { loading = Promise.resolve(); return; }
    loading = new Promise((resolve) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = RUNTIME;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }, []);
}

export const M = (id: string) => `/shop/mascot-designer/m/${id}`;

/**
 * One mascot. `move` is what it does at rest; hovering says hello, a click
 * celebrates (or `onTap`), and it goes back to `move` when a one-shot ends.
 */
export function Mascot({
  id,
  move = "idle",
  side,
  className = "",
  label,
  lazy = true,
  hover = "hello",
  tap = "celebrate",
  poses,
  style,
}: {
  id: string;
  move?: string;
  side?: "left" | "right";
  className?: string;
  label?: string;
  lazy?: boolean;
  hover?: string | null;
  tap?: string | null;
  poses?: string;
  style?: React.CSSProperties;
}) {
  useRuntime();
  const ref = useRef<MascotEl>(null);
  const rest = useRef(move);
  useEffect(() => {
    rest.current = move;
    const el = ref.current;
    if (!el) return;
    const onDone = () => { if (el.state !== rest.current) el.play(rest.current, { side }); };
    el.addEventListener("done", onDone);
    return () => el.removeEventListener("done", onDone);
  }, [move, side]);
  const play = (m: string | null) => {
    const el = ref.current;
    if (!m || !el?.play) return;
    if (["hello", "celebrate", "appear"].includes(el.state)) return; // let a one-shot finish
    el.play(m);
  };
  return (
    <mascot-view
      ref={ref as React.Ref<HTMLElement>}
      src={M(id)}
      state={move}
      side={side}
      lazy={lazy ? "" : undefined}
      poses={poses}
      poke="on"
      aria-label={label}
      className={className}
      style={style}
      onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === "mouse") play(hover); }}
      onClick={() => play(tap)}
    />
  );
}

const MOVES: { move: string; label: string; use: string; swift: string }[] = [
  { move: "hello", label: "Hello", use: "Onboarding", swift: ".hello" },
  { move: "think", label: "Thinking", use: "Loading", swift: ".think" },
  { move: "celebrate", label: "Celebrate", use: "Success", swift: ".celebrate" },
  { move: "oops", label: "Oops", use: "Errors", swift: ".oops" },
  { move: "sleep", label: "Sleeping", use: "Empty states", swift: ".sleep" },
  { move: "point", label: "Pointing", use: "Tips", swift: ".point" },
  { move: "love", label: "Love", use: "Thank you", swift: ".love" },
  { move: "appear", label: "Appear", use: "Arrivals", swift: ".appear" },
];

/** Pick a move, watch it, see the one line that does it in SwiftUI and on the web. */
export function MovesPlayground({ id = "penny", name = "Penny" }: { id?: string; name?: string }) {
  useRuntime();
  const ref = useRef<MascotEl>(null);
  const [on, setOn] = useState("hello");
  const auto = useRef(true);
  // Plays through the moves by itself until someone picks one.
  useEffect(() => {
    let i = 0;
    const t = window.setInterval(() => {
      if (!auto.current || !ref.current?.play) return;
      i = (i + 1) % MOVES.length;
      setOn(MOVES[i].move);
      ref.current.play(MOVES[i].move);
    }, 3200);
    return () => window.clearInterval(t);
  }, []);
  const pick = (m: string) => {
    auto.current = false;
    setOn(m);
    ref.current?.play?.(m);
  };
  const cur = MOVES.find((m) => m.move === on) ?? MOVES[0];
  const Name = name.replace(/[^A-Za-z0-9]/g, "");
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
      <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
        <div aria-hidden className="absolute inset-[12%] rounded-full bg-white/70 blur-2xl" />
        <mascot-view
          ref={ref as React.Ref<HTMLElement>}
          src={M(id)}
          state="hello"
          lazy=""
          poke="on"
          aria-label={`${name} doing the ${cur.label} move`}
          className="relative block !w-full"
        />
      </div>
      <div>
        <div role="group" aria-label="Moves" className="flex flex-wrap gap-2.5">
          {MOVES.map((m) => (
            <button
              key={m.move}
              type="button"
              aria-pressed={on === m.move}
              onClick={() => pick(m.move)}
              className={`md-chip ${on === m.move ? "md-chip-on" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[1.05rem] font-semibold text-[#2B1640]/70">
          For: <span className="text-[#2B1640]">{cur.use}</span>
        </p>
        <div className="mt-6 overflow-hidden rounded-[1.4rem] border-[3px] border-[#2B1640] bg-[#1d1030] text-[0.95rem] leading-[1.7] text-white shadow-[0_8px_0_#2B1640]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/50">
            <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2">The same move, two ways</span>
          </div>
          <pre className="overflow-x-auto px-5 py-4 font-mono">
            <span className="text-white/45">{"// SwiftUI, iOS 17+ and macOS 14+"}</span>
            {"\n"}
            <span className="text-[#7ee0ff]">{Name}View</span>(move: <span className="text-[#ffd25a]">{cur.swift}</span>)
            {"\n\n"}
            <span className="text-white/45">{"<!-- the web -->"}</span>
            {"\n"}
            &lt;<span className="text-[#ff9ec0]">mascot-view</span> src=<span className="text-[#b4f28c]">&quot;/{id}&quot;</span> state=<span className="text-[#ffd25a]">&quot;{cur.move}&quot;</span>&gt;
          </pre>
        </div>
      </div>
    </div>
  );
}
