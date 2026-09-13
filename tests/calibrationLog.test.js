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
    schemaVersion: 1, id: 7, recordedAt: '2026-09-13T12:00:00.000Z', down: '4', distance: 'long',
    defensiveFormation: 'Dollar Sugar 3-2', defensiveCall: 'Cover 3 Sky', userPosition: '',
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
    call: 'Cover 3 Sky', tests: 2, stops: 1, sacks: 0, turnovers: 0,
    firstDowns: 0, explosives: 1, touchdowns: 0, problems: { deep_pass: 1 },
  });
  assert.equal(Object.hasOwn(summary[0], 'successRate'), false);
});
