/** Decide once per hero mount; React's effect replay must reuse that decision. */
export function resolveIntroVisit({
  navigationType,
  navigationPath,
  firstMount,
  hash,
  played,
  savedScrollY,
}: {
  navigationType: string;
  navigationPath: string;
  firstMount: boolean;
  hash: string;
  played: boolean;
  savedScrollY: number;
}) {
  const reload = firstMount && navigationType === "reload" && navigationPath === "/";
  const restoreScrollY = reload && Number.isFinite(savedScrollY) ? Math.max(0, savedScrollY) : 0;
  return {
    skip: Boolean(hash && hash !== "#home") || restoreScrollY > 0 || (!reload && played),
    restoreScrollY,
    hash,
  };
}
