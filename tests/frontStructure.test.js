import test from 'node:test';
import assert from 'node:assert/strict';
import { getFrontStructure } from '../src/engine/frontStructure.js';
import { FDB } from '../src/data/formations.js';

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

test('Dollar edge and linebacker labels are not collapsed into other defenders', () => {
  const front = getFrontStructure('Dollar Sugar 3-2');
  assert.equal(front.count, 5);
  assert.equal(front.interior, 1);
  assert.equal(front.edges, 2);
  assert.equal(front.linebackers, 2);
  assert.equal(front.other, 0);
});

test('every formation has a complete front summary with no lost positions', () => {
  assert.equal(Object.keys(FDB).length, 72);
  for (const [name, formation] of Object.entries(FDB)) {
    if (formation.personnel === 'Prevent') continue;
    const front = getFrontStructure(name);
    assert.ok(front, `${name} is missing a formation alignment`);
    assert.equal(front.count, front.interior + front.edges + front.linebackers + front.other, name);
    assert.equal(front.count, front.labels.length, name);
    assert.ok(front.summary.startsWith(`${front.count} aligned on the front`), name);
  }
  assert.equal(getFrontStructure('Prevent 3-Deep'), null);
});
