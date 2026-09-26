import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYS } from '../src/data/plays.js';
import { assessConceptMatchups } from '../src/engine/conceptMatchup.js';
import { assessAdjustmentMatchup, MAX_SETUP_DELTA } from '../src/engine/adjustmentMatchup.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { evaluateCoverage, threatProfile } from '../src/engine/playMatchup.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { getPlayAssignmentEvidence } from '../src/data/playEvidence.js';
const zone = { n: 'Cover 3 Sky', rush: 4, und: 4, deep: 3, man: 0, spy: 0, cont: 0, badge: 'ZONE' };
const plan = (setting, value) => ({ settings: [{ setting, value, why: 'Test', tradeoff: 'Test' }] });
const setup = (traits, adjustments, play = zone) => assessAdjustmentMatchup(play, play.n, assessConceptMatchups(play, play.n, traits), adjustments);

test('zone aggression earns short-throw credit and pays for deeper exposure', () => {
  const aggressive = plan('Zone Strategy', 'Aggressive');
  const conservative = plan('Zone Strategy', 'Conservative');
  assert.ok(setup(['quick_game'], aggressive).delta > 0);
  assert.ok(setup(['deep_shots'], aggressive).delta < 0);
  assert.ok(setup(['deep_shots'], conservative).delta > 0);
  assert.ok(setup(['quick_game'], conservative).delta < 0);
  assert.equal(setup(['play_action'], aggressive).delta, 0);
});

test('optional tools, presets, unknown controls and duplicate entries never stack credits', () => {
  const a = plan('Zone Strategy', 'Aggressive');
  assert.deepEqual(setup(['quick_game'], { ...a, tools: [a.settings[0]], preset: a.settings[0] }), setup(['quick_game'], a));
  assert.equal(setup(['quick_game'], { settings: [], tools: a.settings }).delta, 0);
  assert.deepEqual(setup(['quick_game'], { settings: [...a.settings, ...a.settings] }), setup(['quick_game'], a));
  assert.equal(setup(['quick_game'], plan('Unknown control', 'Aggressive')).delta, 0);
  assert.equal(setup(['quick_game'], plan('Zone Strategy', 'Default')).delta, 0);
});

test('contain setup never fabricates spy facts or option responsibilities', () => {
  const a = plan('Pass Rush', 'QB Contain');
  assert.ok(setup(['qb_scramble'], a).delta > 0);
  assert.equal(setup(['option_run'], a).delta, 0);
  assert.equal(setup(['qb_scramble'], a, { ...zone, cont: 2 }).delta, 0);
  assert.equal(setup(['qb_scramble'], a, { ...zone, spy: 1, und: 3 }).delta, 0);
  assert.equal(threatProfile(['option_run']).mobile, false);
  assert.equal(threatProfile(['qb_scramble']).mobile, true);
});

test('deeper safeties trade inside run arrival only where the coverage has safety support', () => {
  const a = plan('Safety Depth', '16 yards');
  const q = { ...zone, n: 'Cover 4 Quarters', und: 3, deep: 4 };
  const two = { ...zone, n: 'Cover 2', und: 5, deep: 2 };
  assert.ok(setup(['inside_run'], a, q).delta < 0);
  assert.equal(setup(['inside_run'], a, two).delta, 0);
  assert.ok(setup(['deep_shots'], a, q).delta > 0);
});

test('unsafe matchups and unverified calls cannot buy their way past safeguards', () => {
  const zero = { ...zone, n: 'Zero', rush: 6, und: 0, deep: 0, man: 5 };
  const a = plan('Zone Strategy', 'Conservative');
  const evaluated = evaluateCoverage({ name: 'Zero' }, zero, ['deep_shots'], 100, {}, 'base', 'balanced', 4, a);
  assert.ok(evaluated.sc <= 35);
  assert.equal(evaluated.matchup.setup.delta, 0);
  assert.deepEqual(evaluated.matchup.facts.deep, 0);
  const unknown = evaluateCoverage({ name: 'Zero' }, zero, ['deep_shots'], 100, null, 'base', 'balanced', 4, a);
  assert.equal(unknown.matchup.setup, undefined);
});

test('all catalogued calls have bounded setup effects, unchanged assignments and reconciled ledgers', () => {
  const before = JSON.stringify(PLAYS);
  const cases = [
    { traits: ['quick_game'], down: 'base', sit: 'base' },
    { traits: ['deep_shots', 'inside_run'], down: 4, distance: 'long', sit: '3lg' },
    { traits: ['option_run', 'mobile_qb'], down: 3, distance: 'short', sit: '3sh' },
    { traits: ['play_action', 'quick_game'], down: 'rz', sit: 'rz' },
  ];
  for (const [formation, plays] of Object.entries(PLAYS)) for (const play of plays) for (const input of cases) {
    const adjustments = buildAdjustmentPlan({ recommendedCoverage: play.n, runPass: 4 }, input.traits, input);
    const result = evaluateCoverage({ name: play.n }, play, input.traits, 65,
      getPlayAssignmentEvidence(formation, play.n, play), input.sit, 'balanced', 4, adjustments);
    assert.ok(result);
    assert.ok(Math.abs(result.matchup.setup.delta) <= MAX_SETUP_DELTA);
    assert.equal(65 + result.ledger.reduce((sum, item) => sum + item.delta, 0), result.sc);
    assert.equal(result.matchup.facts.contain, play.cont);
    assert.deepEqual(result.adjustmentPlan, adjustments);
  }
  assert.equal(JSON.stringify(PLAYS), before);
});

test('selected setup matches exported call sheet and shared recommendations across user positions', () => {
  for (const position of ['line', 'middle', 'slot', 'safety']) {
    const input = { traits: ['quick_game', 'mobile_qb'], userProfile: { position }, book: 'All' };
    const result = recommend(input);
    const data = buildCallSheetData({ input });
    for (const [i, fm] of result.formations.slice(0, 4).entries()) {
      const p = fm.personalizedCall.adjustmentPlan;
      assert.deepEqual(p, buildAdjustmentPlan(fm, fm.effectiveTraits, input));
      const summary = p.settings.map(s => `${s.setting}: ${s.value}`).join(' · ');
      assert.equal(data.topFormations[i].quickSetup, summary);
      if (summary) assert.ok(buildRecommendationShareText(result).includes(summary));
    }
  }
});
