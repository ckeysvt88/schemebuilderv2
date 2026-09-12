import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCallOptions, isPressureOption } from '../src/engine/callOptions.js';
import { COVERAGE_FLAGS } from '../src/data/coverageFlags.js';

const calls = [
  { name: 'Cover 3 Sky', tag: 'Base' },
  { name: 'Cover 2 Hard Flat', tag: 'vs Quick Game' },
  { name: 'Cover 4 Quarters', tag: 'Deep Shots' },
  { name: 'Sam Edge 3', tag: 'Zone Pressure' },
  { name: 'Cover 1 Contain Spy', tag: 'vs Mobile QB' },
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
