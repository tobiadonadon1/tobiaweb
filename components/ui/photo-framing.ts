/**
 * Per-photo crop anchors.
 *
 * Every trail photo is a 700x1244 phone portrait. Anywhere one is shown in a
 * landscape box, `object-fit: cover` takes a band out of the middle, and the
 * middle of a portrait photo is almost never where the subject is: the cap
 * shot lost his face, the fireplace shot cut the tops of two heads off, and
 * the mountain shot kept the sky and threw away the road.
 *
 * These values were picked by rendering each candidate at the real cell
 * aspect and looking at them, not by guessing. The number is the CSS
 * `object-position` Y: 0% anchors the top of the photo, 100% the bottom.
 */
export const PHOTO_Y: Record<string, string> = {
  "/trail/trail-01.jpg": "58%", // cap, eyes, nose and mouth, city behind
  "/trail/trail-10.jpg": "25%", // both faces clear of the top edge
  "/trail/trail-11.jpg": "82%", // ridge, chalet, and a stretch of the road
};

/** `object-position` for a photo, defaulting to a centred crop. */
export const framing = (src: string) => `center ${PHOTO_Y[src] ?? "50%"}`;
