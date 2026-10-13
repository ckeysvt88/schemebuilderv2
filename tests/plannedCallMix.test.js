import test from 'node:test';
import assert from 'node:assert/strict';
import { recommend } from '../src/engine/recommendations.js';
import { recommendWithMix } from '../src/engine/recommendWithMix.js';
import { buildPlannedCallMix, MIX_POLICY } from '../src/engine/plannedCallMix.js';
import { PLAYS } from '../src/data/plays.js';
import { hasVerifiedQbControl } from '../src/engine/personalizationSafety.js';

const scout = { traits: ['rpo', 'quick_game', 'inside_run', 'trips', 'crossers'], runPass: 2, familyId: 'p11_gun' };

test('pass/RPO plan proactively varies real coverage structures, including long yardage', () => {
  for (const [down, distance] of [[1, 10], [2, 2], [3, 5], [3, 10]]) {
    const result = recommendWithMix({ ...scout, down, distance });
    const mix = result.plannedMix.calls;
    assert.ok(mix.length >= 3, result.context.label);
    assert.equal(new Set(mix.map(c => c.signature)).size, mix.length);
    assert.ok(mix.some(c => c.role === 'coverage-variation' && !c.formationChange));
    assert.ok(mix.some(c => c.role === 'response-counter' && c.responseGain > 0));
    assert.ok(mix.slice(1).every(c => c.opponentRead && c.responseBasis.includes('not an observed tendency')));
  }
});

test('mix preserves stock calls, original fit scores, inputs and honest setup warnings', () => {
  const input = { ...scout, down: 3, distance: 10, book: '3-3-5' };
  const snapshot = JSON.stringify(input);
  const baseline = recommend(input);
  const result = recommendWithMix(input);
  assert.deepEqual(result.callPlan, baseline.callPlan);
  assert.equal(JSON.stringify(input), snapshot);
  for (const c of result.plannedMix.calls) {
    const formation = baseline.formations.find(f => f.name === c.formation);
    const original = formation.rankedCoverages.find(call => call.name === c.call);
    assert.ok(formation.books.includes(input.book) || formation.books.includes('All'));
    assert.ok(PLAYS[c.formation].some(play => play.n === c.call));
    assert.equal(c.sc, original.sc);
    assert.ok(c.sc >= baseline.callPlan.primary.sc - MIX_POLICY.maxFitLoss);
    assert.equal(original.matchup.status, 'verified');
    assert.match(c.setupWarning, c.formationChange ? /between snaps/ : /pre-snap picture is not verified identical/);
  }
});

test('tempo keeps the mix within one formation rather than promising unavailable substitutions', () => {
  const result = recommendWithMix({ ...scout, traits: [...scout.traits, 'no_huddle'], down: 1, distance: 10 });
  assert.ok(result.plannedMix.calls.length > 1);
  assert.ok(result.plannedMix.calls.every(c => c.formation === result.callPlan.primary.formation));
});

test('no-quick-TD plan preserves deep help and never adds pressure for variety', () => {
  const result = recommendWithMix({ ...scout, gameObjective: 'no_quick_td', down: 3, distance: 10 });
  for (const c of result.plannedMix.calls) {
    const original = result.formations.find(f => f.name === c.formation).rankedCoverages.find(call => call.name === c.call);
    assert.ok(original.matchup.facts.deep >= 2);
    assert.equal(c.pressure, false);
  }
});

test('a planned variation cannot discard an existing verified QB-control answer', () => {
  const result = recommendWithMix({ traits: ['p11', 'quick_game', 'crossers', 'qb_scramble'], runPass: 2, down: 3, distance: 5 });
  const primary = result.formations.find(f => f.name === result.callPlan.primary.formation).rankedCoverages.find(c => c.name === result.callPlan.primary.call);
  assert.ok(hasVerifiedQbControl(primary), 'fixture must exercise the control safeguard');
  for (const c of result.plannedMix.calls) {
    const original = result.formations.find(f => f.name === c.formation).rankedCoverages.find(call => call.name === c.call);
    assert.ok(hasVerifiedQbControl(original));
  }
});

test('mix is deterministic and discloses tradeoffs instead of inflating call scores', () => {
  const input = { ...scout, down: 3, distance: 10 };
  const first = recommendWithMix(input).plannedMix;
  assert.deepEqual(first, recommendWithMix(input).plannedMix);
  assert.ok(first.calls.some(c => c.tradeoffs.some(t => t.gradeLoss >= 8)));
  assert.ok(first.calls.every(c => c.tradeoffs.every(t => t.watchFor)));
  assert.match(first.notes[0], /not a fixed repeating sequence/);
});

test('a restricted pool reports limited variation rather than fabricating a rotation', () => {
  const result = recommend(scout);
  const primary = result.callPlan.primary;
  const f = result.formations.find(f => f.name === primary.formation);
  const call = f.rankedCoverages.find(c => c.name === primary.call);
  const restricted = { ...result, formations: [{ ...f, rankedCoverages: [call] }] };
  const mix = buildPlannedCallMix(restricted, scout.traits);
  assert.equal(mix.status, 'limited');
  assert.equal(mix.calls.length, 1);
  assert.ok(mix.notes.some(note => note.includes('broaden the playbook')));
  const unverified = { ...call, matchup: { ...call.matchup, status: 'unverified' } };
  assert.equal(buildPlannedCallMix({ ...restricted, formations: [{ ...f, rankedCoverages: [unverified] }] }, scout.traits).calls.length, 0);
  assert.equal(recommendWithMix({ traits: [] }).plannedMix.status, 'empty');
});
