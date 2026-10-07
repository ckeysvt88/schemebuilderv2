import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMacroPlan } from '../src/engine/macroPlan.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { exportLoadout } from '../src/data/macros.js';

const macro = (id, context = {}) => buildMacroPlan({ id }, context);
const context = { formation: 'Nickel Over', call: 'Tampa 2' };
const adjustments = (call, traits) => buildAdjustmentPlan({ recommendedCoverage: call }, traits);

test('inside-ten package requires an actual ball spot and Tampa 2 when checking a call', () => {
  for (const yardsToGoal of [undefined, null, '5', 0, -1, 11, Infinity]) {
    assert.equal(macro('inside_ten', { ...context, situation: 'rz', yardsToGoal }).ready, false);
  }
  assert.equal(macro('inside_ten', { ...context, situation: 'rz', yardsToGoal: 5 }).ready, true);
  assert.equal(macro('inside_ten', { ...context, situation: 'long', yardsToGoal: 5 }).ready, false);
  assert.equal(macro('inside_ten', { ...context, call: 'Cover 3 Sky', situation: 'rz', yardsToGoal: 5 }).ready, false);
  const p = macro('inside_ten');
  assert.equal(p.settings.length, 8);
  assert.equal(p.settings.find(s => s.setting === 'DL Stunt').value, 'None');
  assert.equal(p.atLine.length, 2);
  const exported = exportLoadout(['inside_ten']);
  for (const s of p.settings) assert.ok(exported.includes(`${s.setting}: ${s.value}`));
  assert.match(exported, /Inside Quarter/);
});

test('specialized packages reject the wrong coverage and objective', () => {
  assert.equal(macro('press_inside', context).ready, false);
  assert.equal(macro('press_inside', { ...context, call: 'Cover 2 Man' }).ready, true);
  assert.equal(macro('tampa_mable', { ...context, call: 'Cover 3 Sky' }).ready, false);
  assert.equal(macro('tampa_mable', context).ready, true);
  assert.equal(macro('protect_lead', context).ready, false);
  assert.equal(macro('protect_lead', { ...context, gameObjective: 'no_quick_td' }).ready, true);
  assert.equal(macro('te_seam', context).ready, false);
});

test('stunt recipes keep pass guessing and directional pairing conditional', () => {
  const four = macro('texas_four');
  assert.ok(!four.settings.some(s => s.setting === 'Pass Commit'));
  assert.match(four.use, /Four total rushers alone is not enough/);
  const pair = macro('texas_contain');
  assert.ok(!pair.settings.some(s => s.setting === 'QB Contain' && s.value === 'Both'));
  assert.match(pair.atLine[0].when, /do not add Both Contain/);
  assert.equal(macro('texas_four', { formation: 'Prevent 3-Deep', call: 'Prevent' }).ready, false);
});

test('RPO read, pass, and option pitch choices stay distinct optional controls', () => {
  const plan = adjustments('Tampa 2', ['rpo', 'mobile_qb', 'triple_option']);
  for (const setting of ['RPO Read Key', 'RPO Pass Key', 'Option Pitch Key']) {
    assert.ok(plan.tools.some(s => s.setting === setting), setting);
    assert.ok(!plan.settings.some(s => s.setting === setting));
  }
  assert.ok(!adjustments('Tampa 2', ['rpo']).tools.some(s => s.setting === 'RPO Read Key'));
});

test('Plaster trigger is separate, optional and absent from man plans', () => {
  const plan = adjustments('Tampa 2', ['mobile_qb']);
  const trigger = plan.tools.find(s => s.setting === 'Plaster Trigger');
  assert.equal(trigger.value, 'O.O.P');
  assert.match(trigger.why, /Plaster on Conservative and Plaster Time on Default/);
  assert.match(trigger.tradeoff, /no effect with Plaster Off/);
  assert.ok(!adjustments('Cover 2 Man', ['mobile_qb']).tools.some(s => /Plaster/.test(s.setting)));
});

test('trips alone does not prescribe Stress and Cover 6 checks identify the match side', () => {
  const basic = adjustments('Cover 4 Quarters', ['trips']);
  assert.ok(!basic.tools.some(s => s.value.includes('Stress')));
  const vertical = adjustments('Cover 4 Quarters', ['trips', 'deep_shots']);
  assert.match(vertical.tools.find(s => s.setting === 'Formation Check').why, /after seeing all three/);
  const split = adjustments('Cover 6', ['bunch']);
  assert.match(split.tools.find(s => s.setting === 'Formation Check').tradeoff, /only on the quarters side/);
});
