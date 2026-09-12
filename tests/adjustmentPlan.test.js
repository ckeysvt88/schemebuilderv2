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
  assert.equal(plan.preset.value, 'QB Scramble');
  assert.match(JSON.stringify(plan.settings), /QB Contain/);
  assert.doesNotMatch(JSON.stringify(plan), /MIKE\/WILL Assignment|QB Spy/);
});

test('the preset menu gives direct answers for a repeated single threat', () => {
  assert.equal(buildAdjustmentPlan(fm('Cover 1 Robber Press'), ['screens']).preset.value, 'Defend Screen Pass');
  assert.equal(buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game']).preset.value, 'Play Short Routes');
  assert.equal(buildAdjustmentPlan(fm('Cover 3 Sky'), ['deep_shots']).preset.value, 'No Deep Passes');
});

test('a quick preset does not replace the actual coaching adjustments', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['inside_run', 'quick_game']);
  assert.equal(plan.preset.value, 'Play Short Routes');
  assert.match(JSON.stringify(plan.settings), /Zone Strategy.*Aggressive/);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Gap Integrity/);
  assert.doesNotMatch(JSON.stringify(plan.settings), /In-game preset/);
});

test('play action receives patient linebacker behavior rather than a conflicting run instruction', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['play_action', 'short_yardage_run']);
  assert.match(JSON.stringify(plan.settings), /Defender Aggression.*Conservative/);
});

test('opposing run tendencies become a conditional reset, not simultaneous line calls', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['inside_run', 'outside_run']);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Pinch|Spread/);
  assert.match(plan.alerts[0].action, /Return the defensive line to normal/);
});

test('red-zone and short-yardage settings require the live situation', () => {
  const base = buildAdjustmentPlan(fm('Cover 3 Sky'), ['redzone_spec', 'short_yardage_run']);
  assert.doesNotMatch(JSON.stringify(base.settings), /Red Zone Awareness|Gap Integrity/);

  const redZone = buildAdjustmentPlan(fm('Cover 3 Sky'), ['redzone_spec'], { down: 'rz' });
  assert.equal(redZone.objective.label, 'Protect the goal line');
  assert.match(JSON.stringify(redZone.settings), /Cornerback Depth.*5 yards/);
  assert.doesNotMatch(JSON.stringify(redZone), /Smart Zone|Red Zone Awareness/);

  const short = buildAdjustmentPlan(fm('Cover 3 Sky'), ['short_yardage_run'], { down: 3, distance: 'short' });
  assert.match(JSON.stringify(short.settings), /Gap Integrity.*Conservative/);
});

test('long yardage overrides quick-game scouting and never recommends underneath coverage', () => {
  for (const down of [3, 4]) {
    const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['quick_game', 'inside_run'], { down, distance: 'long' });
    assert.equal(plan.objective.label, 'Protect the sticks');
    assert.match(JSON.stringify(plan.settings), /Zone Strategy.*Conservative|Cornerback Depth.*10 yards/);
    assert.match(JSON.stringify(plan.settings), /Pass Commit.*Pass/);
    assert.doesNotMatch(JSON.stringify(plan.settings), /Underneath|Gap Integrity/);
    assert.notEqual(plan.preset?.value, 'Play Short Routes');
  }
});

test('fourth and long plus a deep-shot tendency produces an explicit deep-pass plan', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['deep_shots'], { down: 4, distance: 'long' });
  assert.equal(plan.objective.label, 'Protect the sticks');
  assert.equal(plan.preset.value, 'No Deep Passes');
  assert.match(JSON.stringify(plan.settings), /Conservative|10 yards|Pass Commit/);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Gap Integrity|Underneath/);
});

test('short and long yardage produce materially different setup instructions', () => {
  const traits = ['quick_game', 'inside_run', 'deep_shots'];
  const short = buildAdjustmentPlan(fm('Cover 3 Sky'), traits, { down: 3, distance: 'short' });
  const long = buildAdjustmentPlan(fm('Cover 3 Sky'), traits, { down: 3, distance: 'long' });
  assert.notDeepEqual(short.settings, long.settings);
  assert.match(JSON.stringify(short.settings), /5 yards|Gap Integrity/);
  assert.match(JSON.stringify(long.settings), /10 yards|Pass Commit/);
});

test('advanced counters expose shell, leverage, matchup, match-check, and individual tools when supported', () => {
  const plan = buildAdjustmentPlan(fm('Cover 4 Palms'), ['bunch', 'slant_heavy', 'elite_wr']);
  const text = JSON.stringify(plan.tools);
  assert.match(text, /Coverage Shell/);
  assert.match(text, /Coverage Leverage.*Inside/);
  assert.match(text, /Roll Coverage/);
  assert.match(text, /Palms Bunch.*Box/);
  assert.match(text, /Individual Coverage/);
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
