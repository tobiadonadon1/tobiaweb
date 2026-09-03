/**
 * WHO TOBIA IS, WRITTEN ONCE.
 *
 * This lived in three places and drifted. The hero said 21, the share card said
 * 20, and the schema.org Person said a third thing. The share card is the copy
 * nobody looks at while building the site, so it is the one that went stale —
 * and it is also the only one a stranger reads BEFORE they ever reach the page.
 * Tobia, on a link preview: "we need to change the text here, because when i
 * share it the info is kind of wrong."
 *
 * So the age is a number here, the claim is a sentence here, and everything
 * else composes from them: the hero, the <meta description>, the Open Graph and
 * Twitter cards, and the Person in the JSON-LD graph all import from this file.
 * There is nowhere left for a fourth copy to disagree from.
 *
 * ON A BIRTHDAY, `AGE` IS THE ONLY LINE THAT CHANGES.
 */

/**
 * Stated in two sentences on the site and in every link preview of it, so it is
 * a number rather than three typed digits.
 */
export const AGE = 21;

/**
 * The claim, first person. This is the sentence the whole homepage is built
 * around, so it is the one thing here that should be edited with care.
 */
export const CLAIM =
  "I build tools, write about consciousness, and help people launch things.";

/**
 * The same claim in the third person, for schema.org, which describes a person
 * rather than speaking as one. It cannot be derived from CLAIM without
 * mangling the verbs, so it sits next to it instead: change one, change both.
 */
export const CLAIM_THIRD =
  "Builds tools, writes about consciousness, and helps people launch things.";

/**
 * The line under the claim on the homepage.
 *
 * The space after "I'm" is a NON-BREAKING space, written as an escape so it
 * cannot be lost to an editor or a reformat: without it the age can be orphaned
 * onto a line of its own at some widths.
 */
export const CONTEXT = `I'm\u00A0${AGE}, and I think about the future a lot. This is where I share what I'm working on.`;

/**
 * The link preview: what somebody reads in a message before deciding whether to
 * open the site at all. Built from the claim so it cannot contradict the page
 * it is advertising, and kept under about 160 characters so neither Google nor
 * a chat app truncates it mid-sentence.
 *
 * A plain space here rather than the hero's non-breaking one: this string is
 * never laid out as typography, only read out of a meta tag.
 */
export const SHARE_DESCRIPTION = `I'm Tobia, ${AGE}. ${CLAIM} This is where I share what I'm working on, and figure it out in public.`;
