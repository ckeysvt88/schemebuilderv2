import test from 'node:test';
import assert from 'node:assert/strict';
import { getFrontStructure } from '../src/engine/frontStructure.js';

test('3-4 Tite reports its formation front separately from post-snap rush assignments', () => {
  const front = getFrontStructure('3-4 Tite');
  assert.equal(front.count, 5);
  assert.equal(front.interior, 3);
  assert.equal(front.edges, 2);
  assert.deepEqual(front.labels, ['REDG', 'DT1', 'NT', 'DT2', 'LEDG']);
  assert.match(front.evidence, /does not state who rushes/);
});

test('missing alignment does not manufacture a front', () => {
  assert.equal(getFrontStructure('Not a formation'), null);
});
