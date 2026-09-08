import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveIntroVisit } from '../lib/intro-policy.ts';

const first = { navigationType: 'navigate', navigationPath: '/', firstMount: true, hash: '', played: false, savedScrollY: 0 };
for (const [name, changes, skip, scroll] of [
  ['fresh homepage plays the intro', {}, false, 0],
  ['refresh at the top keeps the full animation', { navigationType: 'reload', played: true }, false, 0],
  ['refresh inside a section skips the intro', { navigationType: 'reload', hash: '#projects', played: true }, true, 0],
  ['refresh at a reading position without a hash skips and restores', { navigationType: 'reload', savedScrollY: 2800 }, true, 2800],
  ['direct section link skips even on first visit', { hash: '#thoughts' }, true, 0],
  ['return from project after a homepage reload does not replay', { navigationType: 'reload', firstMount: false, played: true, savedScrollY: 2800 }, true, 0],
  ['reload of a subpage is not a homepage restart', { navigationType: 'reload', navigationPath: '/projects/book', played: true }, true, 0],
  ['new navigation ignores a stale saved position', { savedScrollY: 2800 }, false, 0],
  ['invalid saved position is ignored', { navigationType: 'reload', savedScrollY: NaN }, false, 0],
]) {
  test(name, () => {
    const actual = resolveIntroVisit({ ...first, ...changes });
    assert.equal(actual.skip, skip);
    assert.equal(actual.restoreScrollY, scroll);
  });
}
