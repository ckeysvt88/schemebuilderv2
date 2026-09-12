import test from 'node:test';
import assert from 'node:assert/strict';
import { getCoverageGuidance } from '../src/engine/coverageGuidance.js';

test('coverage guidance supplies a fast use and risk without assignment counts', () => {
  const sky = getCoverageGuidance('Cover 3 Sky', 'Base');
  assert.equal(sky.bestFor, 'Base');
  assert.match(sky.watchFor, /Flood|seams/);
  assert.doesNotMatch(sky.watchFor, /\d+ rush|\d+ underneath/);

  const quarters = getCoverageGuidance('Cover 4 Quarters', 'Deep Shots');
  assert.equal(quarters.bestFor, 'Deep Shots');
  assert.match(quarters.watchFor, /Quick underneath/);
});
