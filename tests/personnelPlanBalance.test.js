import test from 'node:test';
import assert from 'node:assert/strict';
import { TEAMS } from '../src/data/teams.js';
import { FDB } from '../src/data/formations.js';
import { recommend, rankSituation } from '../src/engine/recommendations.js';
import { PLAN_SITUATIONS, PLAN_BALANCE_POLICY, foundationCandidates } from '../src/engine/planBalance.js';
import { assessPersonnelFit, defensiveBackCount, offensiveReceiverCount } from '../src/engine/personnelFit.js';
import { getPressureProfile } from '../src/engine/pressureProfile.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
const ecu = TEAMS.find(t => t.id === 'east-carolina');
const input = { traits: ecu.traits, familyId: 'p11_gun', runPass: 2 };
const maxRepeat = rows => Math.max(...Object.values(rows.reduce((a, r) => {
  const key = `${r.callPlan.primary.formation}/${r.callPlan.primary.call}`;
  a[key] = (a[key] || 0) + 1; return a;
}, {})));

test('personnel suitability distinguishes receivers, tendencies, conversion distance and actual DB counts', () => {
  assert.equal(defensiveBackCount('3-4 Grizzly'), 4);
  assert.equal(defensiveBackCount('Nickel 3-3 Stack'), 5);
  assert.equal(offensiveReceiverCount('p11_gun', ['p12']), 3);
  assert.equal(offensiveReceiverCount(null, ['p11','p12']), null);
  const p = { ...input, context: { down: 3, distance: 10 } };
  assert.ok(assessPersonnelFit('3-4 Grizzly', p).delta < assessPersonnelFit('Nickel 3-3 Stack', p).delta);
  assert.ok(assessPersonnelFit('3-4 Grizzly', p).delta < assessPersonnelFit('3-4 Grizzly', { ...p, context: { down: 3, distance: 2 } }).delta);
  assert.ok(assessPersonnelFit('3-4 Grizzly', { ...p, familyId: 'p10_spread' }).delta < assessPersonnelFit('3-4 Grizzly', p).delta);
  assert.equal(assessPersonnelFit('Unknown', p).delta, 0);
  assert.ok(assessPersonnelFit('3-4 Grizzly', { ...p, familyId: 'p12_empty' }).delta < 0);
  assert.equal(assessPersonnelFit('Goal Line 5-3', { familyId: 'p23_jumbo', context: { down: 3, distance: 1 } }).delta, 0);
});

test('Grizzly is pressure-oriented without relabeling four-rusher coverage as a blitz', () => {
  assert.equal(FDB['3-4 Grizzly'].priority, 'pressure');
  const f = rankSituation({ ...input, down: 1, distance: 10 }).formations.find(f => f.name === '3-4 Grizzly');
  assert.equal(getPressureProfile(f.rankedCoverages.find(c => c.name === 'Cover 3')).extraRush, false);
  assert.equal(f.ledger.find(l => l.id === 'runPass').delta, 0);
});

test('ECU plans reduce repeated foundations while remaining inside eligible fit budgets', () => {
  for (const runPass of [1,2,4]) {
    const base = { ...input, runPass };
    const planned = PLAN_SITUATIONS.map(([down,distance]) => recommend({ ...base, down, distance }));
    const isolated = PLAN_SITUATIONS.map(([down,distance]) => rankSituation({ ...base, down, distance }));
    assert.ok(maxRepeat(planned) <= 4);
    assert.ok(maxRepeat(planned) <= maxRepeat(isolated));
    for (let i = 0; i < planned.length; i++) {
      const primary = planned[i].callPlan.primary;
      assert.ok(foundationCandidates(isolated[i], base.traits).some(c => c.formation === primary.formation && c.call.name === primary.call));
      assert.ok(primary.sc >= isolated[i].callPlan.primary.sc - PLAN_BALANCE_POLICY.maxFitLoss);
    }
    if (runPass <= 2) assert.ok(planned.filter(r => r.context.distance >= 7).every(r => r.formations[0].personalizedCall.personnelFit.dbs >= 5));
  }
});

test('plan selection is deterministic, call-order independent and shared with PDF', () => {
  const sheet = buildCallSheetData({ input });
  for (const row of [...sheet.situationMatrix.filter(r => r.down)].reverse()) {
    const live = recommend({ ...input, traits: [...input.traits].reverse(), down: row.down, distance: row.distance });
    assert.equal(live.callPlan.primary.formation, row.primary.name);
    assert.equal(live.callPlan.primary.call, row.primary.coverage);
    assert.equal(live.callPlan.primary.sc, row.primary.sc);
  }
  const first = recommend({ ...input, down: 2, distance: 8 });
  const copy = JSON.stringify(first);
  recommend({ ...input, down: 4, distance: 1 });
  assert.equal(JSON.stringify(first), copy);
  assert.deepEqual(first, recommend({ ...input, down: 2, distance: 8 }));
});

test('tempo and restricted inventories remain constraints on whole-plan balancing', () => {
  for (const book of ['All','3-4 Multiple']) {
    const base = { ...input, book, traits: [...input.traits, 'no_huddle'], gameObjective: 'no_quick_td' };
    for (const [down,distance] of [[1,10],[3,2],[3,10]]) {
      const result = recommend({ ...base, down, distance });
      assert.ok(result.plannedMix.calls.every(c => c.formation === result.callPlan.primary.formation));
      assert.ok(result.plannedMix.calls.every(c => !c.pressure && c.matchup.facts.deep >= 2));
      assert.ok(!result.planningSelection, 'tempo blocks changing the original foundation formation for exposure alone');
    }
  }
});
