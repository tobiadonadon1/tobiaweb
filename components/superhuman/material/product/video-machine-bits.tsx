/**
 * VIDEO MACHINE'S SIX: what the AI editor does, one colour each. The hero's
 * timeline strip and the tiles read from here, so a colour always means the
 * same job.
 *
 * NO MASCOTS. Tobia's call (2026-10-20): this is an editor, not a Grok bot,
 * so the page speaks the language of an edit suite instead: tracks, clips, a
 * playhead, a render bar, and real videos the pack made.
 *
 * `say` is the sentence a buyer types for that job: the whole interface.
 * fg is the ink each colour carries at AA.
 */

export const SIX = [
  {
    key: "titles",
    sticker: "Talking head",
    bg: "#FF5A1F",
    fg: "#1F0700",
    title: "Your talking video, edited.",
    text: "Titles, name tags, quotes and numbers laid over you, timed to your words. 9:16, 16:9 or 4:5.",
    say: "make a 9:16 reel from video.mp4 with titles",
  },
  {
    key: "captions",
    sticker: "Captions",
    bg: "#FFD23F",
    fg: "#231A00",
    title: "Captions people read to the end.",
    text: "Reel-style subtitles on top of the picture, never a band at the bottom. The big words only where they land.",
    say: "add reel captions to interview.mp4",
  },
  {
    key: "launch",
    sticker: "Launch videos",
    bg: "#2F5BFF",
    fg: "#FFFFFF",
    title: "A launch video from a link.",
    text: "Paste your product's page. It reads it, takes your brand, writes the story and renders the promo.",
    say: "a 20-second launch video for mysite.com",
  },
  {
    key: "explainer",
    sticker: "Explainers",
    bg: "#19B47D",
    fg: "#032417",
    title: "An explainer from an article.",
    text: "No camera, no footage. Notes or an article become scenes: type, diagrams and charts that teach.",
    say: "a 30-second explainer from this article",
  },
  {
    key: "motion",
    sticker: "Motion graphics",
    bg: "#A970FF",
    fg: "#1A0638",
    title: "Numbers that hit.",
    text: "Stats, charts, logo stings, animated posts and maps. Short pieces where the movement is the message.",
    say: "animate my 1.5M views for X",
  },
  {
    key: "montage",
    sticker: "Clips to film",
    bg: "#141518",
    fg: "#FFFFFF",
    title: "Your AI clips, cut into one film.",
    text: "Kling, Seedance or Higgsfield clips made vertical, steadied, joined with crossfades and finished with your end card.",
    say: "cut these 6 clips into one vertical video",
  },
] as const;

export type Six = (typeof SIX)[number];
export type Key = Six["key"];
export const C = Object.fromEntries(SIX.map((s) => [s.key, s])) as Record<Key, Six>;

/**
 * THE 20 SKILLS AS A TIMELINE: four tracks, each skill a clip on it, in
 * plain words. `w` is the clip's width in grid columns (out of 12 per track),
 * so the tracks read as a real edit rather than a table.
 */
export const TRACKS: { id: string; name: string; key: Key; clips: [string, number][] }[] = [
  {
    id: "V1",
    name: "Talking head",
    key: "titles",
    clips: [
      ["Moving titles and name tags", 5],
      ["Reel captions", 4],
      ["Captions on top", 3],
    ],
  },
  {
    id: "V2",
    name: "From scratch",
    key: "launch",
    clips: [
      ["Launch videos", 3],
      ["Explainers", 3],
      ["Motion graphics", 3],
      ["Anything longer", 3],
    ],
  },
  {
    id: "FX",
    name: "Motion",
    key: "motion",
    clips: [
      ["One camera move", 3],
      ["Cuts on the curve", 2],
      ["No flash cuts", 2],
      ["Animation rules", 3],
      ["Colour, type, pace", 2],
    ],
  },
  {
    id: "A1",
    name: "Edit & assets",
    key: "montage",
    clips: [
      ["Clips to film", 2],
      ["Title cards", 1],
      ["Music & sound", 2],
      ["Render engine", 2],
      ["Blocks", 1],
      ["Router", 1],
      ["Composition", 2],
      ["Keyframes", 1],
    ],
  },
];
