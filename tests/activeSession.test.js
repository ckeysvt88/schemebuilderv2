import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVE_SESSION_KEY, normalizeActiveSession, readActiveSession, writeActiveSession } from '../src/data/activeSession.js';

test('returning from a PDF restores the active scout and plan context without a named save', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  const session = { step: 'plan', sel: { personnel: ['p11'], passStyle: ['deep_shots'] }, runPass: 1, activeP: 'p11_gun', selFm: '3-3-5 3 High Over', mainTab: 'personnel', situDown: '3', situDist: 'long', gameObjective: 'get_stop', objectiveSelected: true, selectedTeam: null };
  writeActiveSession(storage, session);
  assert.deepEqual(readActiveSession(storage), session);
  writeActiveSession(storage, { ...session, sel: {}, step: 'scout' });
  assert.deepEqual(readActiveSession(storage).sel, {});
  assert.equal(readActiveSession(storage).step, 'scout');
  assert.ok(data.has(ACTIVE_SESSION_KEY));
});

test('team context survives and invalid or unavailable storage cannot crash startup', () => {
  const selectedTeam = { id: 'test', name: 'Test', traits: ['p11', 'inside_run'] };
  assert.deepEqual(normalizeActiveSession({ selectedTeam, sel: { _team: selectedTeam.traits } }).selectedTeam, selectedTeam);
  assert.equal(readActiveSession({ getItem: () => '{broken' }).step, 'scout');
  assert.equal(readActiveSession(null).runPass, 4);
  assert.doesNotThrow(() => writeActiveSession(null, {}));
  const invalid = normalizeActiveSession({ step: 'invalid', sel: { personnel: ['bad', 'p11'] }, situDown: 99, situDist: 'bad', runPass: 99 });
  assert.deepEqual(invalid.sel, { personnel: ['p11'] });
  assert.equal(invalid.situDown, 'base');
  assert.equal(invalid.situDist, '');
  assert.equal(invalid.runPass, 4);
});
