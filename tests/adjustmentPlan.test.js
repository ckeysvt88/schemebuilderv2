import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYS } from '../src/data/plays.js';
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

test('play action alone does not invent a vertical shot or a linebacker reaction control', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['play_action', 'short_yardage_run']);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Zone Strategy|Safety Depth/);
  assert.match(plan.userKey.text, /fake|crossing/);
  assert.doesNotMatch(JSON.stringify(plan), /Defender Aggression/);
});

test('opposing run tendencies never invent a previous defensive-line adjustment', () => {
  const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), ['inside_run', 'outside_run']);
  assert.doesNotMatch(JSON.stringify(plan.settings), /Pinch|Spread/);
  assert.doesNotMatch(JSON.stringify(plan.alerts), /defensive line|Pinch|Spread/);
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
    assert.doesNotMatch(JSON.stringify(plan.settings), /Pass Commit/);
    assert.match(JSON.stringify(plan.tools), /Pass Commit/);
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
  assert.match(JSON.stringify(long.settings), /16 yards|10 yards/);
  assert.doesNotMatch(JSON.stringify(long.settings), /Pass Commit/);
});

test('advanced counters expose shell, leverage, matchup, match-check, and individual tools when supported', () => {
  const plan = buildAdjustmentPlan(fm('Cover 4 Palms'), ['bunch', 'slant_heavy', 'elite_wr']);
  const text = JSON.stringify(plan.tools);
  assert.match(text, /Coverage Shell/);
  assert.match(text, /Coverage Leverage.*Inside/);
  assert.doesNotMatch(text, /Roll Coverage/);
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


test('RPO and flat targets alone do not prescribe aggressive short-zone behavior', () => {
  for (const traits of [['rpo'], ['flat_attack'], ['rpo','inside_run','outside_run']]) {
    const plan = buildAdjustmentPlan(fm('Cover 3 Sky'), traits);
    assert.doesNotMatch(JSON.stringify(plan.settings), /Zone Strategy.*Aggressive/);
    assert.doesNotMatch(JSON.stringify(plan.alerts), /defensive line/);
  }
});
test('base adjustments distinguish short, deep, mixed, run-heavy and man contexts', () => {
  const setting = (traits, runPass=4, coverage='Cover 3 Sky') =>
    buildAdjustmentPlan({...fm(coverage),runPass},traits).settings;
  assert.equal(setting(['quick_game'])[0].value,'Aggressive');
  assert.equal(setting(['deep_shots'])[0].value,'Conservative');
  assert.ok(!setting(['quick_game','deep_shots']).some(s=>s.setting==='Zone Strategy'));
  assert.equal(setting(['quick_game','inside_run'],7)[0].setting,'Gap Integrity');
  assert.ok(!setting(['quick_game'],4,'Cover 1 Robber Press').some(s=>s.setting==='Zone Strategy'));
});
test('reset notes correspond to displayed controls and vary with the adjustment', () => {
  const quick=buildAdjustmentPlan(fm('Cover 3 Sky'),['quick_game']);
  const deep=buildAdjustmentPlan(fm('Cover 3 Sky'),['deep_shots']);
  assert.match(quick.alerts[0].action,/Zone Strategy to Default/);
  assert.notDeepEqual(quick.alerts,deep.alerts);
  const long=buildAdjustmentPlan(fm('Cover 3 Sky'),['deep_shots','mobile_qb'],{down:4,distance:'long'});
  assert.ok(long.tools.some(s=>s.value==='QB Contain'));
});
test('every catalog call has consistent setup, toolbox and reset instructions', () => {
  let count=0;
  for(const plays of Object.values(PLAYS)) for(const play of plays) {
    count++;
    for(const traits of [
      ['rpo','inside_run','outside_run'], ['quick_game','deep_shots','mobile_qb'],
      ['bunch','elite_wr','slant_heavy'], ['inside_run','quick_game'],
    ]) for(const [down,distance] of [['base',''],[3,'short'],[4,'long'],['rz','']]) {
      const plan=buildAdjustmentPlan({...fm(play.n),runPass:7},traits,{down,distance});
      const all=[...plan.settings,...plan.tools];
      assert.ok(all.every(s=>!['Default','Balanced','Normal','Conservative · O.O.P & Time'].includes(s.value)));
      assert.equal(new Set(all.map(s=>s.setting)).size,all.length,play.n);
      assert.ok(plan.settings.length<=3);
      for(const alert of plan.alerts) if(alert.setting)
        assert.ok(plan.settings.some(s=>s.setting===alert.setting),play.n);
      assert.doesNotMatch(JSON.stringify(plan.alerts),/Return the defensive line/);
      if(!/roll/i.test(play.n)) assert.ok(!all.some(s=>s.setting==='Roll Coverage'));
      if(/drop/i.test(play.n)) assert.ok(!all.some(s=>s.setting==='Formation Check'));
    }
  }
  assert.equal(count,1245);
});
