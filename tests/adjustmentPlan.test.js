import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';

const fm = coverage => ({ recommendedCoverage: coverage });

test('mixed quick and deep threats do not create conflicting preset instructions', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game', 'deep_shots']);
  assert.doesNotMatch(JSON.stringify(plan), /Smart Zones|Play Short Routes|No Deep Passes/);
});

test('mobile quarterback guidance uses the available QB Scramble preset', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['mobile_qb']);
  const preset = plan.settings.find(item => item.setting === 'In-game preset');
  assert.equal(preset.value, 'QB Scramble');
  assert.doesNotMatch(JSON.stringify(plan), /MIKE\/WILL Assignment|QB Spy/);
});

test('the preset menu gives direct answers for a repeated single threat', () => {
  assert.match(JSON.stringify(buildAdjustmentPlan(fm('Cover 1 Robber Press'), ['screens'])), /Defend Screen Pass/);
  assert.match(JSON.stringify(buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game'])), /Play Short Routes/);
  assert.match(JSON.stringify(buildAdjustmentPlan(fm('Cover 3 Sky'), ['deep_shots'])), /No Deep Passes/);
});

test('play action receives patient linebacker behavior rather than a conflicting run instruction', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['play_action', 'short_yardage_run']);
  const aggression = plan.settings.find(item => item.setting === 'Defensive Aggression');
  assert.equal(aggression.value, 'Conservative');
});

test('opposing run tendencies become a conditional reset, not simultaneous line calls', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['inside_run', 'outside_run']);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Pinch|Spread/);
  assert.match(plan.alerts[0].action, /Return the defensive line to normal/);
});

test('red-zone and short-yardage settings require the live situation', () => {
  const base = buildAdjustmentPlan(fm('Cover 3 Sky'), ['redzone_spec', 'short_yardage_run']);
  assert.doesNotMatch(JSON.stringify(base.settings), /Red Zone Awareness|Defensive Aggression/);
  assert.match(JSON.stringify(base.alerts), /ball enters the red zone|3rd\/4th-and-short/);

  const redZone = buildAdjustmentPlan(fm('Cover 3 Sky'), ['redzone_spec'], { down: 'rz' });
  assert.match(JSON.stringify(redZone.settings), /Red Zone Awareness/);

  const short = buildAdjustmentPlan(fm('Cover 3 Sky'), ['short_yardage_run'], { down: 3, distance: 'short' });
  assert.match(JSON.stringify(short.settings), /Defensive Aggression/);
});

test('the game-day plan stays short and contains no developer language', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game', 'mobile_qb', 'elite_wr', 'play_action', 'hurry_up']);
  assert.ok(plan.settings.length <= 3);
  assert.ok(plan.alerts.length <= 2);
  assert.doesNotMatch(JSON.stringify(plan), /catalog|verification|score|code|unverified/i);
});

test('man and unknown calls do not receive zone-only menu settings', () => {
  const man = buildAdjustmentPlan(fm('Cover 1 Robber Press'), ['elite_wr']);
  const unknown = buildAdjustmentPlan(fm('Bracket Switch Willie'), ['elite_te']);
  assert.doesNotMatch(JSON.stringify(man.settings), /Smart Zones|Plaster|Red Zone Awareness/);
  assert.doesNotMatch(JSON.stringify(unknown.settings), /Smart Zones|Plaster|Red Zone Awareness/);
});
