import test from 'node:test';
import assert from 'node:assert/strict';
import { TRAITS } from '../src/data/traits.js';
import { COVERAGE_TRAIT_GROUPS, getCoverageGuidance } from '../src/engine/coverageGuidance.js';

test('every Scout Traits button is represented in the coverage profile', () => {
  const mapped = new Set(Object.values(COVERAGE_TRAIT_GROUPS).flat());
  const selectable = TRAITS.flatMap(group => group.items.map(item => item.id));
  assert.equal(selectable.length, 57);
  assert.deepEqual(selectable.filter(id => !mapped.has(id)), []);
});

test('coverage cards use plain coaching instructions without assignment counts', () => {
  const sky = getCoverageGuidance('Cover 3 Sky', 'Base', ['inside_run']);
  assert.match(sky.bestSpot, /Early downs/);
  assert.match(sky.offenseAnswer, /Flood|seams/);
  assert.match(sky.getOut, /twice/);
  assert.doesNotMatch(JSON.stringify(sky), /\d+ rush|\d+ underneath|verification|catalog|score|code/i);

  const quarters = getCoverageGuidance('Cover 4 Quarters', 'Deep Shots', ['deep_shots']);
  assert.match(quarters.bestSpot, /deep shots/);
  assert.match(quarters.offenseAnswer, /Quick outs|screens/);
});

test('the same call changes its coaching warning when the selected traits change', () => {
  const quick = getCoverageGuidance('Cover 2', 'Base', ['quick_game']);
  const middle = getCoverageGuidance('Cover 2', 'Base', ['middle_heavy']);
  assert.match(quick.bestSpot, /bubbles|quick outs/);
  assert.match(middle.offenseAnswer, /marked in the scout/);
  assert.notEqual(quick.bestSpot, middle.bestSpot);
});
