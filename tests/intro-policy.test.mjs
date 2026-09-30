import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveIntroVisit } from '../lib/intro-policy.ts';

const first = { navigationType: 'navigate', navigationPath: '/', firstMount: true, hash: '', played: false };
for (const [name, changes, skip] of [
  ['fresh homepage plays the intro', {}, false],
  ['refresh plays the intro again, even after it played', { navigationType: 'reload', played: true }, false],
  ['refresh with a leftover section hash still plays from the top', { navigationType: 'reload', hash: '#projects', played: true }, false],
  ['coming back to the homepage in the same tab does not replay', { played: true }, true],
  ['back/forward to the homepage does not replay', { navigationType: 'back_forward', played: true }, true],
  ['direct section link skips even on first visit', { hash: '#thoughts' }, true],
  ['return from a project after a homepage refresh does not replay', { navigationType: 'reload', firstMount: false, played: true }, true],
  ['refresh of a subpage, then going home, does not replay', { navigationType: 'reload', navigationPath: '/projects/book', played: true }, true],
]) {
  test(name, () => {
    assert.equal(resolveIntroVisit({ ...first, ...changes }).skip, skip);
  });
}

test('a refresh ignores the hash, so nothing scrolls to a section', () => {
  assert.equal(resolveIntroVisit({ ...first, navigationType: 'reload', hash: '#thoughts' }).hash, '');
});
