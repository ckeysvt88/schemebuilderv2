import test from 'node:test';
import assert from 'node:assert/strict';
import { splitSharedCallInstructions } from '../src/engine/sharedCallInstructions.js';
import { recommend } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

test('only the exact common settings and jobs are shared, without changing any call', () => {
  const calls = [
    { quickSetup: 'Zone: Aggressive · Depth: 5', userJob: 'Read mesh', watchFor: 'Seams' },
    { quickSetup: 'Depth: 10 · Zone: Aggressive', userJob: 'Read mesh', watchFor: 'Underneath' },
  ];
  const before = JSON.stringify(calls);
  const result = splitSharedCallInstructions(calls);
  assert.deepEqual(result.shared.setup, ['Zone: Aggressive']);
  assert.equal(result.shared.userJob, 'Read mesh');
  assert.equal(result.shared.watchFor, '');
  assert.deepEqual(result.calls.map(c => c.localSetup), [['Depth: 5'], ['Depth: 10']]);
  for (let i = 0; i < calls.length; i++) {
    assert.deepEqual(new Set([...result.shared.setup, ...result.calls[i].localSetup]), new Set(calls[i].quickSetup.split(' · ')));
    assert.equal(result.shared.userJob || result.calls[i].localUserJob, calls[i].userJob);
    assert.equal(result.shared.watchFor || result.calls[i].localWatchFor, calls[i].watchFor);
  }
  assert.equal(JSON.stringify(calls), before);
});

test('different, empty and single-call jobs are never labeled universal', () => {
  for (const calls of [[], [{ userJob: 'A', quickSetup: 'Zone: Default' }], [{ userJob: 'A' }, { userJob: 'B' }], [{ userJob: '' }, { userJob: '' }]]) {
    const result = splitSharedCallInstructions(calls);
    assert.equal(result.shared.userJob, '');
    assert.deepEqual(result.shared.setup, []);
  }
});

test('a common value cannot hide a different adjustment reason or tradeoff', () => {
  const a = { setting: 'Zone', value: 'Default', why: 'Match', tradeoff: 'Seam' };
  const b = { ...a, tradeoff: 'Flat' };
  const result = splitSharedCallInstructions([{ quickSetup: 'Zone: Default', adjustmentPlan: { settings: [a] } }, { quickSetup: 'Zone: Default', adjustmentPlan: { settings: [b] } }]);
  assert.deepEqual(result.shared.setup, ['Zone: Default']);
  assert.deepEqual(result.shared.adjustmentSettings, []);
  assert.deepEqual(result.calls.map(c => c.localAdjustmentSettings), [[a], [b]]);
});

test('all PDF situations contain the exact live mix and their own shared instructions', () => {
  const input = { traits: ['rpo', 'quick_game', 'inside_run', 'trips', 'crossers'], runPass: 2, familyId: 'p11_gun' };
  const data = buildCallSheetData({ input });
  for (const row of data.situationMatrix.filter(r => r.down)) {
    const live = recommend({ ...input, down: row.down, distance: row.distance });
    assert.deepEqual(row.plannedMix, live.plannedMix);
    assert.deepEqual(row.mixInstructions, splitSharedCallInstructions(live.plannedMix.calls));
    assert.ok(row.plannedMix.calls.length >= 3);
  }
  assert.notDeepEqual(data.situationMatrix[2].mixInstructions.shared.setup, data.situationMatrix[8].mixInstructions.shared.setup);
});
