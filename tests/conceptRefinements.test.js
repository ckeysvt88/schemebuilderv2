import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYS } from '../src/data/plays.js';
import { assessConceptMatchups, buildConceptScenarios } from '../src/engine/conceptMatchup.js';
const grade = (play, traits, id) => assessConceptMatchups(play, play.n, traits).scenarios.find(s => s.id === id).grade;
const base = { n: 'Cover 3', rush: 4, und: 4, deep: 3, man: 0, spy: 0, cont: 0, badge: 'ZONE' };

test('hard flats help mixed outside access without receiving a slant bonus', () => {
  const flat = { ...base, n: 'Cover 3 Hard Flat' };
  assert.equal(grade(flat, ['slant_heavy'], 'quick'), grade(base, ['slant_heavy'], 'quick'));
  assert.ok(grade(flat, ['quick_game'], 'quick') > grade(base, ['quick_game'], 'quick'));
  assert.ok(grade(flat, ['quick_game'], 'quick') < 80);
  assert.equal(buildConceptScenarios(['west_coast'])[0].attack, 'mixed');
  assert.equal(buildConceptScenarios(['slant_heavy', 'quick_game']).filter(s => s.id === 'quick').length, 1);
  const thin = { ...flat, rush: 6, und: 2 };
  assert.ok(grade(thin, ['quick_game'], 'quick') < grade(flat, ['quick_game'], 'quick'));
});

test('play action values intermediate help instead of inheriting the vertical ladder', () => {
  const quarters = { ...base, n: 'Cover 4 Quarters', und: 3, deep: 4, badge: 'MATCH' };
  assert.ok(grade(quarters, ['play_action'], 'play-action') < grade(quarters, ['deep_shots'], 'vertical'));
  assert.ok(grade(base, ['play_action'], 'play-action') > grade(quarters, ['play_action'], 'play-action'));
  const zero = { ...base, und: 0, deep: 0, man: 5, rush: 6 };
  assert.ok(grade(zero, ['play_action'], 'play-action') < grade(base, ['play_action'], 'play-action'));
});

test('spy and contain help escapes without claiming to solve designed option assignments', () => {
  const spy = { ...base, und: 3, spy: 1 };
  assert.ok(grade(spy, ['qb_scramble'], 'qb-run') > grade(base, ['qb_scramble'], 'qb-run'));
  assert.equal(grade(spy, ['option_run'], 'qb-run'), grade(base, ['option_run'], 'qb-run'));
  assert.equal(grade({ ...base, cont: 2 }, ['option_run'], 'qb-run'), grade(base, ['option_run'], 'qb-run'));
  const both = buildConceptScenarios(['option_run', 'mobile_qb', 'qb_scramble']);
  assert.equal(both.filter(s => s.id === 'qb-run').length, 1);
  assert.equal(both.find(s => s.id === 'qb-run').scramble, true);
  const pitch = assessConceptMatchups(base, base.n, ['triple_option']);
  assert.match(pitch.scenarios.find(s => s.id === 'qb-run').concession, /pitch/);
});

test('all catalogued formations and calls retain finite, normalized scores for the new distinctions', () => {
  const before = JSON.stringify(PLAYS);
  const traits = [['slant_heavy'], ['quick_game'], ['west_coast'], ['play_action'], ['qb_scramble'], ['option_run'], ['triple_option'], ['mobile_qb', 'option_run', 'rpo']];
  for (const [formation, plays] of Object.entries(PLAYS)) for (const play of plays) {
    for (const scout of traits) for (const situation of ['base', '3sh', '3lg', 'rz']) for (const bias of [1, 4, 7]) {
      const result = assessConceptMatchups(play, play.n, scout, situation, 'balanced', bias);
      assert.ok(Number.isFinite(result.utility) && result.utility >= 0 && result.utility <= 100, `${formation}: ${play.n}`);
      assert.ok(Math.abs(result.scenarios.reduce((n,s) => n + s.normalizedWeight, 0) - 1) < 1e-9);
      assert.ok(result.scenarios.every(s => Number.isFinite(s.grade) && s.support && s.concession));
    }
  }
  assert.equal(JSON.stringify(PLAYS), before);
});
