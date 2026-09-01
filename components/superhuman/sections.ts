/**
 * The beats of the page the compass tracks, named once. Each section tags
 * itself with its label (`data-sh-section`) and the compass is handed the same
 * list in the same order, so the dial can never disagree with the page about
 * how many sections there are or what they are called.
 *
 * TWO BEATS ARE DELIBERATELY NOT ON THE DIAL.
 *
 * "The disclaimer" is gone because the section is: it lives in the margin of
 * the premise now, as the second half of one scroll stop, so it is no longer
 * a place you can be.
 *
 * "The close" is gone because a needle that says THE CLOSE while you are
 * looking at the footer is the page narrating its own ending. The compass
 * already fades out as the footer is uncovered (see `.sh-compass` in
 * globals.css); dropping the label as well means the last thing it ever says
 * is where you actually are, which is the one-to-one.
 */
export const SECTION_LABELS = {
  hero: "Superhuman",
  premise: "The premise",
  shelf: "The shelf",
  together: "One to one",
} as const;

export const SECTION_ORDER: string[] = [
  SECTION_LABELS.hero,
  SECTION_LABELS.premise,
  SECTION_LABELS.shelf,
  SECTION_LABELS.together,
];
