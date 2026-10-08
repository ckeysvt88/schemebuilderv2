import test from 'node:test';
import assert from 'node:assert/strict';
import { buildComplementaryPlan, adjustedScenarioGrade } from '../src/engine/complementaryPlan.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { PLAYS } from '../src/data/plays.js';
import { assessCallRisk } from '../src/engine/personalizationSafety.js';
import { coverageSituation } from '../src/engine/context.js';

function candidate(name, quick, deep, { rushers = 4, score = 70, formation = 'Test Front', deepCount = 2 } = {}) {
  const rows = [{ id: 'quick', label: 'Quick throw', normalizedWeight: 0.6, grade: quick, source: 'observed', support: 'Underneath coverage contests the catch.', concession: 'A route behind the short defender can win.' },
    { id: 'vertical', label: 'Deep shot', normalizedWeight: 0.4, grade: deep, source: 'observed', support: 'Deep defenders cap the release.', concession: 'The checkdown remains available.' }];
  return { formation, personnel: 'Nickel', call: { name, sc: score, gameObjective: 'balanced',
    matchup: { status: 'verified', facts: { rushers, deep: deepCount, underneath: 11 - rushers - deepCount, man: 0, spy: 0 }, concept: { scenarios: rows } },
    adjustmentPlan: { settings: [], userKey: { text: 'Keep your hook zone.' } } } };
}

test('changeup addresses a weak threat, rather than taking the next highest score', () => {
  const primary = candidate('Primary', 50, 80);
  const second = candidate('Second in rank', 52, 80, { score: 69 });
  const complement = candidate('Real complement', 70, 75, { score: 65 });
  const plan = buildComplementaryPlan([primary, second, complement], primary);
  assert.equal(plan.primary.call, 'Primary');
  assert.equal(plan.changeup.call, 'Real complement');
  assert.equal(plan.changeup.comparison.id, 'quick');
  assert.equal(plan.changeup.comparison.gain, 20);
  assert.match(plan.changeup.switchWhen, /starts beating/);
});

test('a changeup cannot sacrifice another credible threat or lose too much overall fit', () => {
  const primary = candidate('Primary', 50, 80);
  for (const bad of [candidate('Explosive liability', 80, 50), candidate('Too low fit', 75, 80, { score: 59 })]) {
    assert.equal(buildComplementaryPlan([primary, bad], primary).changeup, null);
  }
  const equal = candidate('Different name only', 50, 80);
  assert.equal(buildComplementaryPlan([primary, equal], primary).changeup, null);
});

test('hypothesized complements remain conditional and quick setup effects are reused', () => {
  const primary = candidate('Primary', 50, 80);
  primary.call.matchup.concept.scenarios[0].source = 'complement';
  const alt = candidate('Adjusted', 55, 80);
  alt.call.matchup.setup = { effects: [{ scenarios: [{ id: 'quick', delta: 4 }] }] };
  assert.equal(adjustedScenarioGrade(alt.call, alt.call.matchup.concept.scenarios[0]), 59);
  const plan = buildComplementaryPlan([primary, alt], primary);
  assert.match(plan.changeup.useWhen, /not an observed tendency/);
  assert.equal(plan.changeup.comparison.gain, 9);
});

test('a low-weight observed threat is still protected from a catastrophic changeup', () => {
  const primary = candidate('Primary', 50, 80);
  primary.call.matchup.concept.scenarios[1].normalizedWeight = 0.03;
  const alt = candidate('Low-frequency liability', 75, 30);
  assert.equal(buildComplementaryPlan([primary, alt], primary).changeup, null);
});

test('pressure requires verified extra rushers, remains conditional and respects deep goals', () => {
  const primary = candidate('Primary', 60, 80);
  const simulated = candidate('Blitz Sim', 60, 80);
  assert.equal(buildComplementaryPlan([primary, simulated], primary).pressure, null);
  const extra = candidate('Five rushers', 60, 80, { rushers: 5 });
  const plan = buildComplementaryPlan([primary, extra], primary);
  assert.equal(plan.pressure.call, 'Five rushers');
  assert.match(plan.pressure.useWhen, /QB holds the ball/);
  assert.match(plan.pressure.switchWhen, /quick throws/);
  extra.call.matchup.status = 'unverified';
  assert.equal(buildComplementaryPlan([primary, extra], primary).pressure, null);
  extra.call.matchup.status = 'verified';
  assert.equal(buildComplementaryPlan([primary, extra], primary, { gameObjective: 'no_quick_td' }).pressure, null);
  const zero = candidate('Zero', 65, 80, { rushers: 5, deepCount: 0 });
  assert.equal(buildComplementaryPlan([primary, zero], primary, { traits: ['deep_shots'] }).pressure, null);
});

test('tempo keeps alternatives in the same formation; output does not mutate inputs', () => {
  const primary = candidate('Primary', 50, 80);
  const same = candidate('Same front', 65, 80);
  const other = candidate('Other front', 75, 80, { formation: 'Different Front' });
  const calls = [primary, same, other];
  const before = JSON.stringify(calls);
  const plan = buildComplementaryPlan(calls, primary, { traits: ['hurry_up'] });
  assert.equal(plan.changeup.call, 'Same front');
  assert.equal(JSON.stringify(calls), before);
  assert.deepEqual(buildComplementaryPlan([], null), { primary: null, changeup: null, pressure: null, notes: [] });
});

test('missing pressure has a reason without inventing another call', () => {
  const primary = candidate('Primary', 60, 80);
  const extra = candidate('Five rushers', 60, 80, { rushers: 5 });
  const available = buildComplementaryPlan([primary, extra], primary);
  assert.equal(available.pressureDecision.status, 'available');
  assert.equal(available.pressure.call, 'Five rushers');
  for (const [calls, start, context, expected] of [
    [[primary], primary, {}, 'unavailable'],
    [[primary, extra], primary, { gameObjective: 'no_quick_td' }, 'objective'],
    [[primary, extra], extra, {}, 'primary'],
    [[primary, { ...extra, formation: 'Other Front' }], primary, { traits: ['hurry_up'] }, 'unavailable'],
  ]) {
    const plan = buildComplementaryPlan(calls, start, context);
    assert.equal(plan.pressure, null);
    assert.equal(plan.pressureDecision.status, expected);
    assert.ok(plan.notes.includes(plan.pressureDecision.text));
    assert.equal(plan.primary.call, start.call.name);
  }
});

test('every selected alternative exists in the chosen book and preserves risk, fit and tempo constraints', () => {
  for (const book of ['All', '4-2-5', '3-4 Multiple']) for (const traits of [
    ['p10', 'flat_attack', 'quick_game'], ['p11', 'deep_shots', 'seam_routes'],
    ['p11', 'rpo', 'mobile_qb', 'hurry_up'], ['p12', 'inside_run', 'play_action'],
  ]) for (const down of [1,3,4]) for (const gameObjective of ['balanced', 'no_quick_td']) {
    const result = recommend({ book, traits, down, distance: down === 1 ? 10 : 5, gameObjective });
    const plan = result.callPlan;
    if (!plan.primary) { assert.equal(result.formations.length, 0); continue; }
    assert.equal(plan.primary.formation, result.formations[0].name);
    assert.equal(plan.primary.call, result.formations[0].personalizedCoverage);
    const identities = [];
    for (const entry of [plan.primary, plan.changeup, plan.pressure].filter(Boolean)) {
      identities.push(`${entry.formation}/${entry.call}`);
      const f = result.formations.find(f => f.name === entry.formation);
      const call = f.rankedCoverages.find(c => c.name === entry.call);
      assert.ok(PLAYS[f.name].some(p => p.n === entry.call));
      assert.ok(book === 'All' || f.books.includes(book) || f.books.includes('All'));
      assert.ok(assessCallRisk(call, traits, coverageSituation(result.context)).eligible);
      assert.deepEqual(entry.adjustmentPlan, call.adjustmentPlan);
      assert.ok(plan.primary.sc - entry.sc <= 10);
      if (traits.includes('hurry_up')) assert.equal(entry.formation, plan.primary.formation);
    }
    assert.equal(new Set(identities).size, identities.length);
    if (gameObjective === 'no_quick_td') assert.equal(plan.pressure, null);
  }
});

test('PDF and sharing consume the same primary, changeup, setup and switch triggers as the Plan', () => {
  const input = { traits: ['p10','quick_game','flat_attack'], down: 3, distance: 5 };
  const result = recommend(input);
  const pdf = buildCallSheetData({ input });
  assert.deepEqual(pdf.callPlan, result.callPlan);
  assert.match(buildRecommendationShareText(result), /COORDINATED CALL PLAN/);
  for (const row of pdf.situationMatrix.filter(r => r.down)) {
    const live = recommend({ ...input, down: row.down, distance: row.distance }).callPlan;
    for (const [exported, entry] of [[row.primary, live.primary], [row.secondary, live.changeup], [row.pressure, live.pressure]]) {
      if (!entry) { assert.equal(exported, null); continue; }
      assert.equal(exported.name, entry.formation);
      assert.equal(exported.coverage, entry.call);
      assert.equal(exported.sc, entry.sc);
      assert.equal(exported.quickSetup, entry.quickSetup);
      assert.equal(exported.useWhen, entry.useWhen);
      assert.deepEqual(exported.matchup, entry.matchup);
    }
  }
});
