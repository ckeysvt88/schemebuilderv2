import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCalibrationEntry, summarizeCalibrationEntries } from '../src/engine/calibrationLog.js';

test('call test entries keep football context and reject unknown outcomes', () => {
  assert.equal(normalizeCalibrationEntry({ result: 'maybe' }), null);
  const entry = normalizeCalibrationEntry({
    id: 7, recordedAt: '2026-09-13T12:00:00.000Z', down: 4, distance: 'long',
    defensiveFormation: 'Dollar Sugar 3-2', defensiveCall: 'Cover 3 Sky',
    result: 'explosive', problem: 'deep_pass', yards: 44, setup: ['Safety Depth: 16'],
  });
  assert.deepEqual(entry, {
    schemaVersion: 3, runPass: null, id: 7, recordedAt: '2026-09-13T12:00:00.000Z', down: '4', distance: 'long',
    defensiveFormation: 'Dollar Sugar 3-2', defensiveCall: 'Cover 3 Sky', userPosition: '',
    book: '', gameVersion: '', platform: '', difficulty: '', mode: '', setupConfirmed: false,
    objective: '', setup: ['Safety Depth: 16'], opponentLook: '', result: 'explosive',
    problem: 'deep_pass', yards: 44, notes: '',
  });
});

test('call summaries report observations without inventing a success probability', () => {
  const summary = summarizeCalibrationEntries([
    { result: 'stop', problem: 'none', defensiveCall: 'Cover 3 Sky' },
    { result: 'explosive', problem: 'deep_pass', defensiveCall: 'Cover 3 Sky' },
    { result: 'sack', problem: 'pressure_failed', defensiveCall: 'Double Mug Blitz' },
    { result: 'invalid', defensiveCall: 'Cover 0' },
  ]);
  assert.deepEqual(summary[0], {
    key: '["","Cover 3 Sky","","","","","","","","","",false,[]]', formation: '', context: '',
    call: 'Cover 3 Sky', tests: 2, stops: 1, sacks: 0, turnovers: 0,
    firstDowns: 0, explosives: 1, touchdowns: 0, problems: { deep_pass: 1 },
  });
  assert.equal(Object.hasOwn(summary[0], 'successRate'), false);
});

test('same call name is kept separate across formations and test contexts', () => {
  const summary = summarizeCalibrationEntries([
    { result: 'stop', defensiveFormation: '3-4 Tite', defensiveCall: 'Cover 3 Sky', down: '3', distance: 'short' },
    { result: 'explosive', defensiveFormation: 'Dollar Sugar 3-2', defensiveCall: 'Cover 3 Sky', down: '3', distance: 'long' },
    { result: 'sack', defensiveFormation: '3-4 Tite', defensiveCall: 'Cover 3 Sky', down: '3', distance: 'short' },
  ]);
  assert.equal(summary.length, 2);
  assert.equal(summary.find(item => item.formation === '3-4 Tite').tests, 2);
  assert.equal(summary.find(item => item.formation === 'Dollar Sugar 3-2').explosives, 1);
});

test('listed setup only separates evidence when the user confirms it was used', () => {
  const base = { result: 'stop', defensiveFormation: '3-4 Tite', defensiveCall: 'Cover 3 Sky' };
  assert.equal(summarizeCalibrationEntries([
    { ...base, setup: ['Shade underneath'] },
    { ...base, setup: ['Show Cover 2'] },
  ]).length, 1);
  assert.equal(summarizeCalibrationEntries([
    { ...base, setup: ['Shade underneath'], setupConfirmed: true },
    { ...base, setup: ['Show Cover 2'], setupConfirmed: true },
  ]).length, 2);
});
