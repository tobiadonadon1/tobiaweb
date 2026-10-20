"use client";

import { useEffect, useState } from "react";

/**
 * THE OPENING: THE EDITING APP COLLAPSES INTO ONE SENTENCE.
 *
 * The whole pitch in five seconds, before a word of copy:
 *
 *   1. an editing app fills the screen: menus, panels, a viewer, five tracks
 *      of clips arriving cut by cut, keyframes, a playhead, a running
 *      timecode. Busy, the way editing is;
 *   2. all of it is pulled into the middle and vanishes into one text field;
 *   3. a sentence types itself into the field: the brief;
 *   4. a render bar fills, and the finished video (a frame of the real one on
 *      the page) opens out to fill the screen;
 *   5. the curtain lifts on the name and the button.
 *
 * CSS alone runs it (globals.css, VIDEO MACHINE), so it plays from the first
 * paint and ends by itself. Script only steps it aside on any scroll, key or
 * tap. Reduced motion skips straight to the sentence, then fades. Decoration
 * over a page that is already there underneath, so it is hidden from
 * assistive tech.
 */

const BRIEF = "make a 20-second launch video for my site";

/** Clip blocks per track: [start column, width, colour], in 48 columns. */
const TRACK_CLIPS: [number, number, string][][] = [
  [[1, 9, "#FF5A1F"], [10, 6, "#FF8A5C"], [16, 11, "#FF5A1F"], [27, 7, "#FF8A5C"], [34, 14, "#FF5A1F"]],
  [[4, 8, "#2F5BFF"], [14, 5, "#6F8CFF"], [21, 12, "#2F5BFF"], [36, 9, "#6F8CFF"]],
  [[1, 5, "#A970FF"], [7, 4, "#A970FF"], [13, 6, "#C29BFF"], [22, 3, "#A970FF"], [28, 8, "#C29BFF"], [40, 6, "#A970FF"]],
  [[2, 18, "#19B47D"], [21, 26, "#19B47D"]],
  [[1, 47, "#FFD23F"]],
];
const TRACK_NAMES = ["V3", "V2", "V1", "A1", "A2"];

export function VideoIntro({ poster }: { poster: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      document.documentElement.dataset.vdIntro = "done";
    };
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, finish, { once: true, passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, finish);
    };
  }, []);

  let n = 0;
  return (
    <div className="vd-intro" data-done={done || undefined} aria-hidden>
      {/* 1. THE APP. */}
      <div className="vd-app">
        <div className="vd-app__menu">
          {["File", "Edit", "Clip", "Sequence", "Markers", "Graphics", "Effects", "Window"].map((m) => (
            <span key={m}>{m}</span>
          ))}
          <span className="vd-app__tc">00:00:14:08</span>
        </div>
        <div className="vd-app__body">
          <div className="vd-app__panel">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="vd-app__row" style={{ width: `${55 + ((i * 37) % 40)}%` }} />
            ))}
          </div>
          <div className="vd-app__viewer">
            <span className="vd-app__frame" />
          </div>
          <div className="vd-app__panel">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="vd-app__knob">
                <span style={{ width: `${30 + ((i * 23) % 60)}%` }} />
              </span>
            ))}
          </div>
        </div>
        <div className="vd-app__timeline">
          {TRACK_CLIPS.map((clips, t) => (
            <div key={t} className="vd-app__track">
              <span className="vd-app__name">{TRACK_NAMES[t]}</span>
              <div className="vd-app__lane">
                {clips.map(([start, w, c]) => (
                  <span
                    key={start}
                    className="vd-app__clip"
                    style={{ gridColumn: `${start} / span ${w}`, background: c, "--n": n++ } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          ))}
          <span className="vd-app__playhead" />
        </div>
      </div>

      {/* 2–4. THE SENTENCE, THE RENDER, THE FILM. */}
      <div className="vd-ask">
        <div className="vd-ask__field">
          <span className="vd-ask__prompt">&gt;</span>
          <span className="vd-ask__text" style={{ "--chars": BRIEF.length } as React.CSSProperties}>
            {BRIEF}
          </span>
          <span className="vd-ask__caret" />
        </div>
        <div className="vd-ask__render">
          <span className="vd-ask__bar" />
          <span className="vd-ask__label">Rendering</span>
        </div>
      </div>
      <div className="vd-film" style={{ backgroundImage: `url(${poster})` }} />
    </div>
  );
}
