import test from 'node:test';
import assert from 'node:assert/strict';
import { getMatchCheckRecommendation, matchSchemeForCall } from '../src/engine/matchCheckRecommendation.js';
import { getCheckOptions } from '../src/data/coverageChecks.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { assessAdjustmentMatchup } from '../src/engine/adjustmentMatchup.js';

test('every recommendation resolves to a confirmed menu entry', () => {
  for (const call of ['Cover 1', 'Cover 2 Man', 'Cover 3 Match', 'Cover 4 Quarters', 'Cover 4 Palms', 'Cover 6']) {
    for (const trait of ['bunch', 'stack_align', 'trips']) {
      const rec = getMatchCheckRecommendation(call, [trait]);
      if (['Cover 1', 'Cover 2 Man'].includes(call) && trait === 'trips') {
        assert.equal(rec, null);
      } else {
        assert.ok(rec, `${call}: ${trait}`);
        assert.ok(getCheckOptions(rec.scheme, rec.look).includes(rec.check));
        assert.equal(rec.setting, 'Formation Check');
      }
    }
  }
});

test('zone/drop, unknown and unconfirmed split variants cannot inherit a match menu', () => {
  for (const call of ['Cover 4 Drop Show 2', 'Cover 4 Zone', 'Cover 6 Zone', 'Cover 9 Zone', 'Cover 9', 'Cover 6 Invert', 'Cover 6 Trap', 'Cover 6 Willie', 'Cover 2 Match', 'Cover 3 Sky', 'Cover 3 Man', 'Sim 3 Match', 'Custom Match']) {
    assert.equal(getMatchCheckRecommendation(call, ['bunch']), null, call);
  }
  assert.equal(matchSchemeForCall('Cov 3 Buzz Match Wk'), 'cover3');
  assert.equal(matchSchemeForCall('Cov 2 Man Contain'), 'twoMan');
});

test('mixed scouting alignments never masquerade as one observed formation', () => {
  for (const traits of [[], ['bunch', 'trips'], ['stack_align', 'trips'], ['bunch', 'stack_align', 'trips']]) {
    assert.equal(getMatchCheckRecommendation('Cover 4 Quarters', traits), null);
  }
});

test('Quarters trips retains regular reads; deep shots alone cannot select Stress', () => {
  for (const traits of [['trips'], ['trips', 'deep_shots'], ['trips', 'seam_routes']]) {
    const rec = getMatchCheckRecommendation('Cover 4 Quarters', traits);
    assert.equal(rec.check, 'quarters');
    assert.match(rec.value, /Quarters Trips — Quarters/);
  }
  const rec = getMatchCheckRecommendation('Cover 4 Quarters', ['trips', 'deep_shots']);
  assert.match(rec.why, /only after seeing all three/);
});

test('match option survives a crowded toolbox without becoming an applied scoring bonus', () => {
  const traits = ['bunch', 'deep_shots', 'mobile_qb', 'option_run', 'rpo', 'triple_option', 'slant_heavy', 'elite_wr', 'field_hash', 'screens'];
  const plan = buildAdjustmentPlan({ name: 'Nickel Over', recommendedCoverage: 'Cover 4 Palms' }, traits, { down: 3, distance: 'long' });
  assert.ok(plan.tools.length <= 8);
  assert.equal(plan.tools[0].setting, 'Formation Check');
  assert.equal(plan.tools[0].check, 'box');
  assert.ok(!plan.settings.some(s => s.setting === 'Formation Check'));
  assert.match(plan.userKey.text, /follow its assigned receiver/);
  const play = { rush: 4, deep: 4, und: 3, man: 0 };
  const concept = { scenarios: [{ id: 'vertical', label: 'Vertical', normalizedWeight: 1 }] };
  const withoutTool = { ...plan, tools: [] };
  assert.deepEqual(assessAdjustmentMatchup(play, 'Cover 4 Palms', concept, plan), assessAdjustmentMatchup(play, 'Cover 4 Palms', concept, withoutTool));
});

test('Cover 6 recommendations identify the match side and assignment changes', () => {
  const rec = getMatchCheckRecommendation('Cover 6', ['trips']);
  assert.equal(rec.check, 'stubbie');
  assert.match(rec.tradeoff, /only on the quarters side/);
  assert.match(rec.tradeoff, /press or shading/);
});

test('Skate guidance is not paired with automatic Underneath that changes its rules', () => {
  const plan = buildAdjustmentPlan({ recommendedCoverage: 'Cover 3 Match' }, ['bunch', 'crossers']);
  assert.equal(plan.tools.find(t => t.setting === 'Formation Check').check, 'skate');
  assert.ok(!plan.settings.some(s => s.setting === 'Coverage Shading'));
  const plain = buildAdjustmentPlan({ recommendedCoverage: 'Cover 3 Sky' }, ['crossers']);
  assert.ok(plain.settings.some(s => s.setting === 'Coverage Shading' && s.value === 'Underneath'));
});

test('scouted outside versus vertical threats change supported Cover 3 checks',()=>{
  for(const look of ['bunch','trips']){
    const outside=getMatchCheckRecommendation('Cover 3 Match',[look,'flat_attack']);
    const vertical=getMatchCheckRecommendation('Cover 3 Match',[look,'seam_routes']);
    assert.equal(outside.check,'skate');assert.equal(vertical.check,'skinny');
    assert.match(outside.why,/flat\/sideline tendency/);assert.match(vertical.why,/vertical\/seam tendency/);
    assert.ok(getCheckOptions(outside.scheme,outside.look).includes(outside.check));
    assert.ok(getCheckOptions(vertical.scheme,vertical.look).includes(vertical.check));
    const mixed=getMatchCheckRecommendation('Cover 3 Match',[look,'flat_attack','deep_shots']);
    assert.match(mixed.why,/both outside throws and vertical threats/);
  }
});
test('Cover 6 stack can use Palms for outside throws without treating every quick pass as a trap',()=>{
  assert.equal(getMatchCheckRecommendation('Cover 6',['stack_align','flat_attack']).check,'palms');
  for(const trait of ['quick_game','screens','rpo','crossers'])assert.equal(getMatchCheckRecommendation('Cover 6',['stack_align',trait]).check,'quarters');
  assert.equal(getMatchCheckRecommendation('Cover 6',['stack_align','flat_attack','deep_shots']).check,'quarters');
});
test('insufficient traits never manufacture Stump, Bingo, MEG or all-vertical Stress',()=>{
  for(const call of ['Cover 4 Palms','Cover 4 Quarters','Cover 3 Match','Cover 6'])for(const look of ['bunch','trips','stack_align']){
    const rec=getMatchCheckRecommendation(call,[look,'quick_game','crossers','deep_shots','elite_wr']);
    assert.ok(!['stump','bingo','skinnyMeg','stress'].includes(rec.check));
  }
});
