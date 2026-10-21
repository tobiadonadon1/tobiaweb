/**
 * VIDEO EDITOR'S SIX: what the AI editor does.
 *
 * NO MASCOTS. Tobia's calls (2026-10-20, 2026-10-21): this is an editor, not a
 * Grok bot; clean, but not all white, and few words. So each job is a title,
 * a soft gradient of its own and the sentence that does it.
 *
 * `say` is the sentence a buyer types for that job: the whole interface.
 * `tint` is the card's gradient; `dark` cards carry white ink.
 */

export const SIX = [
  {
    key: "titles",
    tint: "linear-gradient(150deg, #FFE6D6 0%, #FFC2A3 100%)",
    sticker: "Talking head",
    title: "Your talking video, edited.",
    say: "make a 9:16 reel from video.mp4 with titles",
  },
  {
    key: "captions",
    tint: "linear-gradient(150deg, #FFF4CC 0%, #FFD86B 100%)",
    sticker: "Captions",
    title: "Captions people read to the end.",
    say: "add reel captions to interview.mp4",
  },
  {
    key: "launch",
    tint: "linear-gradient(150deg, #E0E8FF 0%, #A9BEFF 100%)",
    sticker: "Launch videos",
    title: "A launch video from a link.",
    say: "a 20-second launch video for mysite.com",
  },
  {
    key: "explainer",
    tint: "linear-gradient(150deg, #DDF7EA 0%, #9FE3C4 100%)",
    sticker: "Explainers",
    title: "An explainer from an article.",
    say: "a 30-second explainer from this article",
  },
  {
    key: "motion",
    tint: "linear-gradient(150deg, #FFE0EC 0%, #FFB0CB 100%)",
    sticker: "Motion graphics",
    title: "Numbers that hit.",
    say: "animate my 1.5M views for X",
  },
  {
    key: "montage",
    tint: "linear-gradient(150deg, #2B2E38 0%, #111216 100%)",
    dark: true,
    sticker: "Clips to film",
    title: "Your AI clips, cut into one film.",
    say: "cut these 6 clips into one vertical video",
  },
] as const;

