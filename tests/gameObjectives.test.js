import test from 'node:test';
import assert from 'node:assert/strict';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { summarizeCalibrationEntries } from '../src/engine/calibrationLog.js';
import { getGameObjective } from '../src/data/gameObjectives.js';

const base = { traits: ['p11', 'quick_game'], book: '4-3 Press Quarters', familyId: 'p11_gun' };
const solid = result => result.formations.find(f => f.name === '4-3 Over Solid');

test('balanced is backward compatible and invalid objectives normalize to balanced', () => {
  assert.deepEqual(recommend(base), recommend({ ...base, gameObjective: 'balanced' }));
  assert.deepEqual(recommend(base), recommend({ ...base, gameObjective: 'not-real' }));
  assert.equal(getGameObjective(null).id, 'balanced');
});

test('objective changes the actual winner and returning to balanced restores the result', () => {
  const before = recommend(base);
  const protect = recommend({ ...base, gameObjective: 'no_quick_td' });
  const stop = recommend({ ...base, gameObjective: 'get_stop' });
  assert.equal(solid(before).recommendedCoverage, 'Cover 2 Invert Hard Flat');
  assert.equal(solid(protect).recommendedCoverage, 'Cover 3 Match');
  assert.equal(solid(stop).recommendedCoverage, 'Cover 2 Invert Hard Flat');
  assert.deepEqual(recommend(base), before);
});

test('explicit no-quick-TD goal keeps deep help despite user pressure preferences', () => {
  for (const position of ['line', 'middle', 'slot', 'safety']) {
    const result = recommend({ ...base, book: 'All', gameObjective: 'no_quick_td',
      userProfile: { position, callStyle: 'pressure' } });
    assert.ok(result.formations.length);
    for (const f of result.formations) {
      for (const name of [f.recommendedCoverage, f.personalizedCoverage]) {
        assert.ok(f.rankedCoverages.find(c => c.name === name).matchup.facts.deep >= 2);
      }
      assert.equal(f.sc, f.ledger.reduce((sum, e) => sum + e.delta, 0));
    }
  }
});

test('objectives are explicit scenarios, not invented observed tendencies', () => {
  const traits = ['p11'];
  const scenarios = buildConceptScenarios(traits, 'base', 'no_quick_td');
  assert.ok(scenarios.some(s => s.id === 'vertical' && s.source === 'objective'));
  assert.deepEqual(traits, ['p11']);
  assert.equal(scenarios[0].objectiveMultiplier, 2);
});

test('objective-specific adjustments do not prescribe aggressive short coverage when protecting deep', () => {
  const f = solid(recommend({ ...base, gameObjective: 'no_quick_td' }));
  const plan = buildAdjustmentPlan(f, base.traits, { down: 3, distance: 'short' });
  assert.equal(plan.objective.label, 'No Quick TD');
  assert.equal(plan.preset, null);
  assert.ok(plan.settings.some(s => s.setting === 'Zone Strategy' && s.value === 'Conservative'));
  assert.match(plan.alerts[0].action, /Get a Stop/);
  const stop = solid(recommend({ ...base, gameObjective: 'get_stop', down: 4, distance: 'long' }));
  const stopPlan = buildAdjustmentPlan(stop, base.traits, { down: 4, distance: 'long' });
  assert.equal(stopPlan.objective.label, 'Get a Stop');
  assert.doesNotMatch(JSON.stringify(stopPlan.settings), /Underneath|Play Short Routes/);
});

test('call sheet and share preserve the selected objective and personal calls', () => {
  const input = { ...base, gameObjective: 'no_quick_td' };
  const result = recommend(input);
  const sheet = buildCallSheetData({ input });
  assert.match(sheet.contextLabel, /No Quick TD/);
  assert.match(buildRecommendationShareText(result), /Game objective: No Quick TD/);
  assert.deepEqual(sheet.topFormations.map(f => f.coverage), result.formations.slice(0, 4).map(f => f.personalizedCoverage));
});

test('saved tests separate objectives while retaining older entries', () => {
  const common = { result: 'stop', defensiveFormation: '3-4 Tite', defensiveCall: 'Cover 3 Sky' };
  const groups = summarizeCalibrationEntries([common, { ...common, objective: 'No Quick TD' }, { ...common, objective: 'Get a Stop' }]);
  assert.equal(groups.length, 3);
  assert.ok(groups.some(g => g.context.includes('No Quick TD')));
  assert.equal(summarizeCalibrationEntries([common, common])[0].tests, 2);
});
