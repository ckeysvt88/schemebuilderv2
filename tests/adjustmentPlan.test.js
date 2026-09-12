import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';

const fm = coverage => ({ recommendedCoverage: coverage });

test('mixed quick and deep threats produce one balanced smart-zone instruction', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game', 'deep_shots']);
  const zones = plan.settings.filter(item => item.setting === 'Smart Zones');
  assert.equal(zones.length, 1);
  assert.equal(zones[0].value, 'Balanced');
});

test('mobile quarterback guidance uses the documented safe plaster trigger', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['mobile_qb']);
  const plaster = plan.settings.find(item => item.setting === 'Plaster');
  assert.equal(plaster.value, 'Conservative · Out of Pocket + Time');
  assert.doesNotMatch(JSON.stringify(plan), /MIKE\/WILL Assignment|QB Spy/);
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
  const man = buildAdjustmentPlan(fm('Cover 1 Robber Press'), ['quick_game', 'mobile_qb']);
  const unknown = buildAdjustmentPlan(fm('Bracket Switch Willie'), ['deep_shots']);
  assert.doesNotMatch(JSON.stringify(man.settings), /Smart Zones|Plaster/);
  assert.doesNotMatch(JSON.stringify(unknown.settings), /Smart Zones|Plaster/);
});
