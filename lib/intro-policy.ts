/**
 * Decide once per hero mount; React's effect replay must reuse that decision.
 *
 * THE RULE, IN TOBIA'S WORDS: "If I'm just going back and forth within the
 * website pages, I don't want the loader, but if I refresh it, I do."
 *
 * - A REFRESH of the homepage (Cmd-R or Cmd-Shift-R) is a fresh start: the
 *   whole loader, from the top, nothing skipped. Where the reader was, and any
 *   #section left in the URL, are both ignored. The head script in
 *   app/layout.tsx makes sure the browser has not restored the old scroll
 *   position underneath it, which is what used to send the page racing
 *   through every section before the loader.
 * - Coming back to the homepage from another page in the same tab never
 *   replays it (`played`), and nor does a link straight to a section.
 * - A first visit plays it.
 *
 * `firstMount` limits the refresh signal to the first homepage mount of the
 * document: the navigation entry keeps saying "reload" for the whole life of
 * the tab, including every client-side route change after it.
 */
export function resolveIntroVisit({
  navigationType,
  navigationPath,
  firstMount,
  hash,
  played,
}: {
  navigationType: string;
  navigationPath: string;
  firstMount: boolean;
  hash: string;
  played: boolean;
}) {
  const refresh = firstMount && navigationType === "reload" && navigationPath === "/";
  if (refresh) return { skip: false, hash: "" };
  const toSection = Boolean(hash && hash !== "#home");
  return { skip: toSection || played, hash };
}
