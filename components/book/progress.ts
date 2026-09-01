/** Shared scroll-progress maths for the two scrubbed sections. */

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Smoothstep: eases both ends so a scrubbed value never starts or stops hard. */
export function smooth(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * Where item `i` of `total` sits, given overall progress `p`.
 *
 * Every item owns a slice of the timeline `span` long, and the slices are
 * spread evenly across it, so consecutive items overlap: several are always
 * in flight at once. That overlap is what makes the passage read as a
 * continuous surfacing rather than a queue of separate fades.
 */
export function sliceProgress(
  p: number,
  i: number,
  total: number,
  span: number,
) {
  if (total <= 1) return smooth(p);
  const step = (1 - span) / (total - 1);
  return smooth((p - i * step) / span);
}
