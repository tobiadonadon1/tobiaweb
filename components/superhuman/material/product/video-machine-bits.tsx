/**
 * VIDEO MACHINE'S SIX: what the AI editor does.
 *
 * NO MASCOTS, NO GRAPHICS. Tobia's calls (2026-10-20, 2026-10-21): this is an
 * editor, not a Grok bot, and the page stays clean, so the jobs are plain
 * white cards and the colour comes from the real videos.
 *
 * `say` is the sentence a buyer types for that job: the whole interface.
 */

export const SIX = [
  {
    key: "titles",
    sticker: "Talking head",
    title: "Your talking video, edited.",
    text: "Titles, name tags, quotes and numbers laid over you, timed to your words. 9:16, 16:9 or 4:5.",
    say: "make a 9:16 reel from video.mp4 with titles",
  },
  {
    key: "captions",
    sticker: "Captions",
    title: "Captions people read to the end.",
    text: "Reel-style subtitles on top of the picture, never a band at the bottom. The big words only where they land.",
    say: "add reel captions to interview.mp4",
  },
  {
    key: "launch",
    sticker: "Launch videos",
    title: "A launch video from a link.",
    text: "Paste your product's page. It reads it, takes your brand, writes the story and renders the promo.",
    say: "a 20-second launch video for mysite.com",
  },
  {
    key: "explainer",
    sticker: "Explainers",
    title: "An explainer from an article.",
    text: "No camera, no footage. Notes or an article become scenes: type, diagrams and charts that teach.",
    say: "a 30-second explainer from this article",
  },
  {
    key: "motion",
    sticker: "Motion graphics",
    title: "Numbers that hit.",
    text: "Stats, charts, logo stings, animated posts and maps. Short pieces where the movement is the message.",
    say: "animate my 1.5M views for X",
  },
  {
    key: "montage",
    sticker: "Clips to film",
    title: "Your AI clips, cut into one film.",
    text: "Kling, Seedance or Higgsfield clips made vertical, steadied, joined with crossfades and finished with your end card.",
    say: "cut these 6 clips into one vertical video",
  },
] as const;

