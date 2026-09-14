import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCallOptions, isPressureOption } from '../src/engine/callOptions.js';
import { COVERAGE_FLAGS } from '../src/data/coverageFlags.js';

const calls = [
  { name: 'Cover 3 Sky', tag: 'Base' },
  { name: 'Cover 2 Hard Flat', tag: 'vs Quick Game' },
  { name: 'Cover 4 Quarters', tag: 'Deep Shots' },
  { name: 'Sam Edge 3', tag: 'Zone Pressure' },
  { name: 'Cover 1 Contain Spy', tag: 'vs Mobile QB', matchup: { status: 'verified', facts: { spy: 1, contain: 0, deep: 1 } } },
];

test('call menu keeps the current winner and adds only supported alternatives', () => {
  const options = buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb'], 'base', 6);
  assert.equal(options[0].name, calls[0].name);
  assert.ok(options[0].optionRoles.some(role => role.id === 'overall'));
  assert.ok(options.some(option => option.optionRoles.some(role => role.id === 'quick')));
  assert.ok(options.some(option => option.optionRoles.some(role => role.id === 'mobile')));
  assert.ok(options.some(option => option.optionRoles.some(role => role.id === 'run')));
  assert.equal(new Set(options.map(option => option.name)).size, options.length);
  assert.ok(buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb']).length <= 4);
});

test('deep-help and pressure labels use exact-call classifications', () => {
  const options = buildCallOptions(calls, [], '3lg', 6);
  const safe = options.find(option => option.optionRoles.some(role => role.id === 'safe'));
  const pressure = options.find(option => option.optionRoles.some(role => role.id === 'pressure'));
  assert.equal(COVERAGE_FLAGS[safe?.name]?.longOK, true);
  assert.equal(isPressureOption(safe), false);
  assert.equal(pressure?.name, 'Sam Edge 3');
  assert.match(safe.optionRoles.find(role => role.id === 'safe').reason, /line to gain/);
  assert.equal(isPressureOption({ name: 'Pinch 4 Palms', tag: 'Deep Shots' }), false);
});

test('unsupported user-friendly claims are not created', () => {
  const options = buildCallOptions(calls, ['quick_game']);
  assert.ok(options.every(option => option.optionRoles.every(role => role.id !== 'user')));
});

test('player style selects a supported option without replacing best overall', () => {
  const safe = buildCallOptions(calls, [], 'base', 6, { position: 'middle', callStyle: 'safe' });
  const pressure = buildCallOptions(calls, [], 'base', 6, { position: 'middle', callStyle: 'pressure' });
  assert.equal(safe[0].optionRoles.some(role => role.id === 'overall'), true);
  assert.equal(safe.find(call => call.isPlayerChoice)?.name, 'Cover 2 Hard Flat');
  assert.equal(pressure.find(call => call.isPlayerChoice)?.name, 'Sam Edge 3');
});

test('defensive user changes the supported personalized call', () => {
  const linebacker = buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb'], 'base', 4, { position: 'middle', callStyle: 'balanced' });
  const safety = buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb'], 'base', 4, { position: 'safety', callStyle: 'balanced' });
  const slot = buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb'], 'base', 4, { position: 'slot', callStyle: 'balanced' });
  const line = buildCallOptions(calls, ['inside_run', 'quick_game', 'mobile_qb'], 'base', 4, { position: 'line', callStyle: 'balanced' });
  assert.equal(linebacker.find(call => call.isPlayerChoice)?.name, 'Cover 1 Contain Spy');
  assert.equal(safety.find(call => call.isPlayerChoice)?.name, 'Cover 2 Hard Flat');
  assert.equal(slot.find(call => call.isPlayerChoice)?.name, 'Cover 2 Hard Flat');
  assert.equal(line.find(call => call.isPlayerChoice)?.name, 'Sam Edge 3');
});

test('unsupported player style falls back to best overall', () => {
  const menu = buildCallOptions([{ name: 'Cover 3 Sky', tag: 'Base' }], [], 'base', 4, { callStyle: 'safe' });
  assert.equal(menu[0].isPlayerChoice, true);
  assert.match(menu[0].playerChoiceReason, /not supported/);
});

test('situational objectives change the personalized alternative and remain fully ledgered', () => {
  const long = buildCallOptions(calls, ['inside_run', 'quick_game'], '3lg', 4, { position: 'middle', callStyle: 'balanced' });
  const short = buildCallOptions(calls, ['inside_run', 'quick_game'], '3sh', 4, { position: 'middle', callStyle: 'balanced' });
  const longChoice = long.find(call => call.isPlayerChoice);
  const shortChoice = short.find(call => call.isPlayerChoice);
  assert.ok(longChoice.optionRoles.some(role => role.id === 'safe'));
  assert.ok(shortChoice.optionRoles.some(role => role.id === 'run'));
  for (const choice of [longChoice, shortChoice]) {
    assert.equal(choice.personalFit.style + choice.personalFit.userPosition + choice.personalFit.situation, choice.personalFit.total);
    assert.match(choice.personalFit.basis, /not a gameplay success probability/);
  }
});

test('mixed run scouting favors support in both directions over a one-direction total', () => {
  const mixedCalls = [
    { name: 'Cover 4 Quarters', tag: 'Base' },
    { name: 'Cover 2', tag: 'Base' },
    { name: 'Cover 6', tag: 'Base' },
  ];
  const runChoice = traits => buildCallOptions(mixedCalls, traits, '3sh', 6)
    .find(call => call.optionRoles.some(role => role.id === 'run'));
  assert.equal(runChoice(['inside_run']).name, 'Cover 4 Quarters');
  assert.equal(runChoice(['outside_run']).name, 'Cover 2');
  assert.equal(runChoice(['inside_run', 'outside_run']).name, 'Cover 6');
  assert.equal(runChoice(['counter_trap', 'hb_stretch']).name, 'Cover 6');
});

test('mixed-run choice keeps Best Overall and explains its split support', () => {
  const options = buildCallOptions([
    { name: 'Cover 4 Quarters', tag: 'Base' }, { name: 'Cover 6', tag: 'Base' },
  ], ['inside_run', 'outside_run'], '3sh', 4, { position: 'middle', callStyle: 'balanced' });
  assert.equal(options[0].name, 'Cover 4 Quarters');
  assert.ok(options[0].optionRoles.some(role => role.id === 'overall'));
  const run = options.find(call => call.optionRoles.some(role => role.id === 'run'));
  assert.equal(run.name, 'Cover 6');
  assert.equal(run.isPlayerChoice, true);
  const reason = run.optionRoles.find(role => role.id === 'run').reason;
  assert.match(reason, /quarters-side safety/i);
  assert.match(reason, /Cover 2-side corner/);
});

test('a one-direction fallback does not claim it supplies support in both directions', () => {
  const options = buildCallOptions([{ name: 'Cover 4 Quarters', tag: 'Base' }],
    ['inside_run', 'outside_run'], '3sh', 4);
  const reason = options[0].optionRoles.find(role => role.id === 'run').reason;
  assert.match(reason, /Use it against inside runs/);
  assert.match(reason, /Outside runs still depend/);
  assert.doesNotMatch(reason, /Use it against inside and outside runs/);
});

test('mixed-run support never invents a call outside the available menu', () => {
  const menu = [{ name: 'Cover 3 Sky', tag: 'Base' }, { name: 'Cover 2', tag: 'Base' }];
  const options = buildCallOptions(menu, ['inside_run', 'outside_run'], 'base', 4);
  assert.ok(options.every(option => menu.some(call => call.name === option.name)));
  assert.ok(!options.some(option => option.name === 'Cover 6'));
});


test('QB-control labels require verified assignments, not names or unverified counts', () => {
  for (const matchup of [undefined, { status: 'unverified', facts: { spy: 1, contain: 2 } }]) {
    const options = buildCallOptions([{ name: 'Cover 3 Sky' },
      { name: 'Contain Spy', tag: 'vs Mobile QB', matchup }], ['mobile_qb']);
    assert.ok(options.every(call => call.optionRoles.every(role => role.id !== 'mobile')));
  }
});

test('verified contain explains its inside-escape limitation', () => {
  const options = buildCallOptions([{ name: 'Contain', matchup: { status: 'verified', facts: { contain: 1 } } }], ['mobile_qb']);
  assert.match(options[0].optionRoles.find(role => role.id === 'mobile').reason, /inside escape/);
});

test('personal preference cannot override a substantially stronger matchup', () => {
  const options = buildCallOptions([{ name: 'Cover 4 Quarters', sc: 80 },
    { name: 'FS Blitz', tag: 'Pressure', sc: 55 }], ['deep_shots'], 'base', 4,
  { position: 'line', callStyle: 'pressure' });
  const player = options.find(call => call.isPlayerChoice);
  assert.equal(player.name, 'Cover 4 Quarters');
  assert.match(player.playerChoiceReason, /gives up too much/);
  assert.ok(options.some(call => call.name === 'FS Blitz'));
});

test('competitive preference preserves both overall and personalized cards even at limit one', () => {
  const options = buildCallOptions([{ name: 'Cover 3 Sky', sc: 80 },
    { name: 'FS Blitz', tag: 'Pressure', sc: 73 }], [], 'base', 1,
  { position: 'line', callStyle: 'pressure' });
  assert.equal(options[0].name, 'Cover 3 Sky');
  assert.equal(options.find(call => call.isPlayerChoice).name, 'FS Blitz');
  assert.equal(options.length, 2);
});

test('known zero-deep exposure is blocked despite a close score on deep threats or long yardage', () => {
  for (const [traits, situation] of [[['deep_shots'], 'base'], [[], '3lg'], [['seam_routes'], 'base']]) {
    const options = buildCallOptions([{ name: 'Cover 4 Quarters', sc: 40 },
      { name: 'Zero Blitz', tag: 'Pressure', sc: 35,
        matchup: { status: 'verified', facts: { deep: 0 } } }], traits, situation, 4,
    { position: 'line', callStyle: 'pressure' });
    assert.equal(options.find(call => call.isPlayerChoice).name, 'Cover 4 Quarters');
  }
});
