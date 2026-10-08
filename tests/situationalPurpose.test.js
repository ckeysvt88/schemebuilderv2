import test from 'node:test';
import assert from 'node:assert/strict';
import { getSituationalPurpose } from '../src/engine/situationalPurpose.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const formation = { recommendedCoverage: 'Cover 3 Sky' };
const setting = (plan, name) => plan.settings.find(s => s.setting === name);

test('early-down purposes distinguish a shot opportunity from recovery without inventing a scout', () => {
  const first = getSituationalPurpose(1, 10);
  const short = getSituationalPurpose(2, 2);
  const long = getSituationalPurpose(2, 9);
  assert.equal(first.target, 'Line to gain: 10 yards');
  assert.equal(short.shotOpportunity, true);
  assert.equal(long.recoveryDown, true);
  assert.notEqual(first.label, short.label);
  assert.notEqual(short.label, long.label);
  assert.equal(first.conceptKey, '1_long');
  const threats = buildConceptScenarios(['p11'], first.conceptKey);
  assert.ok(threats.some(s => s.id === 'run-choice'));
  assert.ok(threats.some(s => s.id === 'pass-choice'));
  assert.ok(threats.every(s => s.source !== 'observed'));
});

test('unknown distance stays unknown and red zone does not fabricate a conversion target', () => {
  for (const distance of ['', undefined, 0, -1, 'bad']) {
    const p = getSituationalPurpose(4, distance);
    assert.equal(p.id, 'base');
    assert.equal(p.target, null);
    assert.equal(p.conversionDown, false);
    assert.deepEqual(p.formationModifiers, {});
  }
  const red = getSituationalPurpose('rz');
  assert.equal(red.target, null);
  assert.equal(red.conceptKey, 'rz');
  assert.match(red.text, /not automatically short/);
});

test('second and short/long explicitly reset short-zone reactions and retain assignment coaching', () => {
  for (const distance of [2, 9]) {
    const plan = buildAdjustmentPlan(formation, ['quick_game'], { down: 2, distance });
    assert.equal(setting(plan, 'Zone Strategy').value, 'Default');
    assert.equal(setting(plan, 'Zone Strategy').reset, true);
    assert.doesNotMatch(JSON.stringify(plan.settings), /Aggressive|Pass Commit/);
    assert.notEqual(plan.preset?.value, 'Play Short Routes');
    assert.match(plan.userKey.text, /assigned/);
  }
  const first = buildAdjustmentPlan(formation, ['quick_game'], { down: 1, distance: 10 });
  assert.equal(setting(first, 'Zone Strategy').value, 'Aggressive');
});

test('seven-to-nine yard conversions contest scouted quick throws rather than give automatic ten-yard cushion', () => {
  for (const down of [3, 4]) for (const distance of [7, 8, 9]) {
    const plan = buildAdjustmentPlan(formation, ['quick_game'], { down, distance });
    assert.equal(setting(plan, 'Cornerback Depth').value, '5 yards');
    assert.equal(setting(plan, 'Zone Strategy').value, 'Default');
    assert.match(plan.userKey.text, /catch near the sticks/);
    assert.equal(getSituationalPurpose(down, distance).target, `Line to gain: ${distance} yards`);
  }
  const longer = buildAdjustmentPlan(formation, ['quick_game'], { down: 3, distance: 10 });
  assert.equal(setting(longer, 'Cornerback Depth').value, '10 yards');
  assert.equal(setting(longer, 'Zone Strategy').value, 'Conservative');
});

test('scouted vertical threats and No Quick TD preserve deep protection at a nearer conversion', () => {
  const deep = buildAdjustmentPlan(formation, ['quick_game', 'seam_routes'], { down: 4, distance: 7 });
  assert.equal(setting(deep, 'Zone Strategy').value, 'Conservative');
  assert.equal(setting(deep, 'Safety Depth').value, '16 yards');
  const protect = buildAdjustmentPlan({ ...formation, gameObjective: 'no_quick_td' }, ['quick_game'], { down: 4, distance: 7 });
  assert.equal(setting(protect, 'Zone Strategy').value, 'Conservative');
  assert.equal(protect.objective.label, 'No Quick TD');
  assert.equal(protect.preset, null);
});

test('Pass Commit is optional even without run tags, leaving room for mobile QB containment', () => {
  for (const down of [3, 4]) for (const traits of [[], ['deep_shots'], ['quick_game'], ['inside_run'], ['deep_shots', 'mobile_qb']]) {
    const plan = buildAdjustmentPlan(formation, traits, { down, distance: 10 });
    assert.ok(!setting(plan, 'Pass Commit'));
    assert.ok(plan.tools.some(s => s.setting === 'Pass Commit'));
    if (traits.includes('mobile_qb')) assert.equal(setting(plan, 'Pass Rush').value, 'QB Contain');
  }
});

test('Get a Stop does not manufacture an inside-run scheme or overwrite an observed outside run', () => {
  for (const traits of [['p11'], ['p11', 'quick_game'], ['outside_run']]) {
    const rows = buildConceptScenarios(traits, 'base', 'get_stop');
    assert.ok(!rows.some(s => s.id === 'inside-run'));
    if (traits.includes('outside_run')) assert.equal(rows.find(s => s.id === 'edge-run').source, 'observed');
    else assert.equal(rows.find(s => s.id === 'run-choice').supportScope, 'direction-unknown');
  }
  const observed = buildConceptScenarios(['inside_run'], 'base', 'get_stop');
  assert.equal(observed.find(s => s.id === 'inside-run').source, 'observed');
});

test('Plan, formation coaching, sharing and all PDF situations consume the same purpose and setup', () => {
  const input = { traits: ['p10', 'quick_game', 'flat_attack'], down: 4, distance: 7 };
  const result = recommend(input);
  assert.deepEqual(result.callPlan.purpose, result.purpose);
  assert.match(buildRecommendationShareText(result), /Purpose: Deny the conversion\nLine to gain: 7 yards/);
  for (const f of result.formations) {
    assert.equal(f.personalizedCall.adjustmentPlan.objective.label, result.purpose.label);
    assert.equal(f.personalizedCall.adjustmentPlan.objective.text, result.purpose.text);
    assert.equal(f.sc, f.ledger.reduce((sum, entry) => sum + entry.delta, 0));
  }
  const sheet = buildCallSheetData({ input });
  for (const row of sheet.situationMatrix.filter(r => r.down)) {
    const live = recommend({ ...input, down: row.down, distance: row.distance });
    assert.deepEqual(row.purpose, live.purpose);
    assert.equal(row.dcTip, live.purpose.text);
    assert.equal(row.primary.coverage, live.callPlan.primary.call);
    assert.equal(row.primary.quickSetup, live.callPlan.primary.quickSetup);
  }
  assert.match(sheet.situationMatrix.find(r => r.label === '2ND & SHORT').primary.quickSetup, /Zone Strategy: Default/);
});
