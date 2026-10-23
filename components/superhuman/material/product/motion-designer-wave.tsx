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
const DURATION = 21.148;
const BPM = 122;
const CUTS = [2.459, 5.41, 8.361, 11.066, 14.509, 17.214];
const PEAKS = [0.134, 0.302, 0.22, 0.232, 0.507, 0.569, 0.763, 0.559, 0.491, 0.544, 0.288, 0.751, 0.446, 0.29, 0.354, 0.565, 0.565, 0.63, 0.324, 0.39, 0.455, 0.349, 0.674, 0.613, 0.313, 0.462, 0.569, 0.526, 0.92, 0.601, 0.441, 0.571, 0.383, 0.45, 0.66, 0.361, 0.43, 0.525, 0.405, 1.0, 0.686, 0.396, 0.561, 0.434, 0.526, 0.449, 0.437, 0.36, 0.498, 0.513, 0.63, 0.665, 0.335, 0.649, 0.484, 0.506, 0.416, 0.5, 0.352, 0.493, 0.479, 0.703, 0.627, 0.284, 0.552, 0.56, 0.361, 0.625, 0.511, 0.316, 0.497, 0.525, 0.73, 0.599, 0.406, 0.542, 0.519, 0.23, 0.826, 0.57, 0.308, 0.499, 0.596, 0.704, 0.666, 0.424, 0.475, 0.531, 0.289, 0.727, 0.684, 0.364, 0.454, 0.548, 0.59, 0.697, 0.476, 0.422, 0.475, 0.289, 0.668, 0.708, 0.406, 0.372, 0.552, 0.494, 0.759, 0.467, 0.361, 0.494, 0.422, 0.501, 0.607, 0.38, 0.422, 0.537, 0.474, 0.79, 0.568, 0.347, 0.588, 0.441, 0.414, 0.627, 0.488, 0.431, 0.522, 0.432, 0.797, 0.673, 0.298, 0.581, 0.488, 0.449, 0.474, 0.492, 0.344, 0.456, 0.537, 0.604, 0.498, 0.267, 0.561, 0.466, 0.315, 0.55, 0.53, 0.289, 0.464, 0.53, 0.622, 0.569, 0.308, 0.523, 0.471, 0.263, 0.836, 0.571, 0.298, 0.501, 0.563, 0.546, 0.703, 0.485, 0.507, 0.555, 0.296, 0.647, 0.595, 0.295, 0.501, 0.593, 0.61, 0.766, 0.487, 0.428, 0.55, 0.337, 0.635, 0.746, 0.476, 0.377, 0.538, 0.383, 0.806, 0.621, 0.375, 0.578, 0.412, 0.558, 0.779, 0.522, 0.412, 0.546, 0.431, 0.652, 0.518, 0.523, 0.272, 0.42, 0.281, 0.443, 0.457, 0.457, 0.359, 0.363, 0.302, 0.322, 0.313, 0.3, 0.318, 0.302, 0.31, 0.292, 0.314, 0.303, 0.293, 0.304, 0.302, 0.298, 0.301, 0.306, 0.305, 0.298, 0.312, 0.31, 0.311, 0.311, 0.319, 0.317, 0.31, 0.323, 0.315, 0.302, 0.289, 0.279, 0.255, 0.237, 0.221, 0.193];
const SRC = "/shop/motion-designer/kinetic-v1.mp3";
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
          {BPM} bpm · 6 cuts, all on the beat · −14 LUFS
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
