"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * THE SOUNDTRACK, SEEN: the EverMute film's own track, as the skill composed
 * and mastered it (its mix.wav: loudness in 240 slices, normalised). Thin
 * ticks are the beats at its tempo; the lime marks are the film's six cuts,
 * and each sits on a beat because the skill snaps every scene's length to the
 * music. Listen plays the same mix, with a playhead.
 */
const DURATION = 21.576;
const BPM = 118;
const CUTS = [2.542, 5.593, 8.61, 11.152, 14.711, 17.508];
const PEAKS = [0.183, 0.418, 0.55, 0.841, 0.693, 0.607, 0.741, 0.51, 0.608, 0.779, 0.598, 0.78, 0.735, 0.469, 0.799, 0.797, 0.463, 0.819, 0.588, 0.491, 0.83, 0.673, 0.66, 0.825, 0.544, 0.64, 0.75, 0.554, 0.852, 0.811, 0.355, 0.738, 0.725, 0.399, 0.891, 0.602, 0.514, 0.792, 0.666, 0.721, 0.886, 0.427, 0.675, 0.765, 0.527, 0.831, 0.666, 0.412, 0.763, 0.73, 0.573, 0.958, 0.514, 0.537, 0.734, 0.604, 0.709, 0.794, 0.529, 0.665, 0.764, 0.526, 0.783, 0.62, 0.409, 0.82, 0.71, 0.599, 0.83, 0.571, 0.58, 0.813, 0.651, 0.696, 0.694, 0.457, 0.702, 0.781, 0.476, 0.901, 0.666, 0.439, 0.812, 0.747, 0.558, 0.78, 0.549, 0.621, 0.839, 0.672, 0.793, 0.737, 0.47, 0.704, 0.776, 0.519, 0.834, 0.728, 0.401, 0.842, 0.699, 0.625, 0.841, 0.559, 0.646, 0.774, 0.577, 0.712, 0.691, 0.463, 0.798, 0.797, 0.451, 0.911, 0.633, 0.487, 0.781, 0.666, 0.642, 0.744, 0.511, 0.639, 0.77, 0.549, 0.835, 0.722, 0.456, 0.805, 0.756, 0.433, 0.849, 0.613, 0.488, 0.807, 0.685, 0.655, 0.793, 0.511, 0.613, 0.76, 0.601, 0.777, 0.632, 0.416, 0.733, 0.703, 0.517, 0.871, 0.593, 0.497, 0.775, 0.618, 0.624, 0.711, 0.489, 0.659, 0.735, 0.5, 0.841, 0.676, 0.438, 0.774, 0.712, 0.538, 0.785, 0.551, 0.512, 0.787, 0.65, 0.724, 0.746, 0.487, 0.689, 0.78, 0.515, 0.759, 0.625, 0.435, 0.888, 0.8, 0.627, 0.877, 0.6, 0.589, 0.833, 0.651, 0.688, 0.713, 0.472, 0.675, 0.765, 0.489, 0.861, 0.655, 0.722, 1.0, 0.868, 0.736, 0.695, 0.682, 0.689, 0.741, 0.679, 0.699, 0.662, 0.641, 0.632, 0.623, 0.622, 0.61, 0.61, 0.615, 0.61, 0.597, 0.601, 0.598, 0.594, 0.591, 0.585, 0.587, 0.591, 0.593, 0.591, 0.591, 0.587, 0.592, 0.592, 0.589, 0.589, 0.588, 0.589, 0.594, 0.59, 0.568, 0.529, 0.49, 0.451, 0.409, 0.363, 0.315];
const SRC = "/shop/motion-designer/kinetic-v2.mp3";
const W = 960;
const H = 220;
const MID = H / 2;
const BW = W / PEAKS.length;
const BEATS = Math.floor((DURATION * BPM) / 60);

export function SoundtrackWave() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (audio.current) setT(audio.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // one sound on the page at a time (motion-designer-film.tsx sends the same event)
  useEffect(() => {
    const off = (e: Event) => {
      if ((e as CustomEvent).detail !== SRC) audio.current?.pause();
    };
    window.addEventListener("mdx-sound", off);
    return () => window.removeEventListener("mdx-sound", off);
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (playing) a.pause();
    else {
      window.dispatchEvent(new CustomEvent("mdx-sound", { detail: SRC }));
      a.play().catch(() => {});
    }
  };

  const at = (t / DURATION) * W;
  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="The EverMute film's soundtrack as a waveform, with its six cuts each landing on a beat."
      >
        {Array.from({ length: BEATS }, (_, i) => {
          const x = ((i * 60) / BPM / DURATION) * W;
          return (
            <line key={i} x1={x} x2={x} y1={MID - 92} y2={MID + 92} stroke="currentColor" strokeOpacity={i % 4 === 0 ? 0.3 : 0.12} strokeWidth={1} />
          );
        })}
        {PEAKS.map((p, i) => {
          const h = Math.max(2, p * 84);
          return (
            <rect key={i} x={i * BW + 0.6} y={MID - h} width={Math.max(1, BW - 1.2)} height={h * 2} rx={1} fill="currentColor" fillOpacity={i * BW <= at ? 1 : 0.55} />
          );
        })}
        {CUTS.map((c) => {
          const x = (c / DURATION) * W;
          return (
            <g key={c}>
              <line x1={x} x2={x} y1={10} y2={H - 4} stroke="#E7F04F" strokeWidth={3} />
              <circle cx={x} cy={9} r={6} fill="#E7F04F" />
            </g>
          );
        })}
        {playing || t > 0 ? <line x1={at} x2={at} y1={0} y2={H} stroke="#ffffff" strokeWidth={2} /> : null}
      </svg>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="button" onClick={toggle} aria-pressed={playing} className="mdx-listen">
          {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          <span>{playing ? "Pause" : "Listen"}</span>
        </button>
        <span className="font-[family-name:var(--mdx-mono)] text-[0.72rem] uppercase tracking-[0.08em] opacity-80">
          {BPM} bpm · 6 cuts, all on the beat
        </span>
      </div>
      <audio
        ref={audio}
        src={SRC}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setT(0);
        }}
      />
    </div>
  );
}
