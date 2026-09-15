import test from 'node:test';
import assert from 'node:assert/strict';
import { selectFormationCalls } from '../src/engine/callSelection.js';
import { buildCallOptions } from '../src/engine/callOptions.js';
import { assessPersonalChoice, assessCallRisk } from '../src/engine/personalizationSafety.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { coverageSituation } from '../src/engine/context.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { USER_POSITIONS, CALL_STYLES } from '../src/data/userProfile.js';

const zero = { name: 'Zero Blitz', tag: 'Pressure', sc: 90,
  matchup: { status: 'verified', facts: { deep: 0 } } };
const sky = { name: 'Cover 3 Sky', sc: 65,
  matchup: { status: 'verified', facts: { deep: 3 } } };

test('known catastrophic risk cannot become overall or personal despite the highest score', () => {
  for (const [traits, situation] of [[['deep_shots'], 'base'], [['seam_routes'], 'base'], [[], '3lg']]) {
    const result = selectFormationCalls([zero, sky], traits, situation, { position: 'line', callStyle: 'pressure' });
    assert.equal(result.best.name, sky.name);
    assert.equal(result.playerCall.name, sky.name);
    assert.equal(result.callOptions[0].name, sky.name);
    assert.ok(result.callOptions.some(c => c.name === zero.name)); // Optional pressure, not a winner.
  }
});

test('all-rejected and empty menus return no selection instead of an unsafe fallback', () => {
  assert.equal(selectFormationCalls([zero], ['deep_shots']), null);
  assert.deepEqual(buildCallOptions([zero], ['deep_shots']), []);
  assert.equal(selectFormationCalls([], []), null);
});

test('the score-loss budget uses the eligible overall call, not a rejected higher score', () => {
  const pressure = { name: 'FS Blitz', tag: 'Pressure', sc: 60,
    matchup: { status: 'verified', facts: { deep: 1 } } };
  const result = selectFormationCalls([zero, sky, pressure], ['deep_shots'], 'base', { position: 'line', callStyle: 'pressure' });
  assert.equal(result.best.name, sky.name);
  assert.equal(result.playerCall.name, pressure.name);
});

test('preference score budget allows ten points and rejects eleven', () => {
  const overall = { name: 'Cover 3 Sky', sc: 80 };
  assert.equal(assessPersonalChoice({ name: 'FS Blitz', sc: 70 }, overall).eligible, true);
  assert.equal(assessPersonalChoice({ name: 'FS Blitz', sc: 69 }, overall).eligible, false);
});

test('a known zero-deep structure cannot carry a deep-help label from its name', () => {
  const mislabeled = { ...zero, name: 'Cover 4 Quarters', tag: 'Base' };
  const options = buildCallOptions([mislabeled], [], 'base');
  assert.ok(options.every(call => call.optionRoles.every(role => role.id !== 'safe')));
});

test('every user position and style gets exactly one eligible personalized choice across situations', () => {
  for (const position of USER_POSITIONS) for (const style of CALL_STYLES) {
    for (const [down, distance] of [['base', ''], [3, 'short'], [3, 'long'], [4, 'long']]) {
      const result = recommend({ traits: ['p11', 'deep_shots', 'inside_run', 'quick_game', 'mobile_qb'],
        book: 'Multiple', familyId: 'p11_gun', down, distance,
        userProfile: { position: position.id, callStyle: style.id } });
      assert.ok(result.formations.length);
      for (const formation of result.formations) {
        const situation = coverageSituation(result.context);
        const overall = formation.rankedCoverages.find(call => call.name === formation.recommendedCoverage);
        const personal = formation.callOptions.filter(call => call.isPlayerChoice);
        assert.equal(personal.length, 1);
        assert.equal(personal[0].name, formation.personalizedCoverage);
        assert.ok(assessCallRisk(overall, formation.effectiveTraits, situation).eligible);
        assert.ok(assessPersonalChoice(personal[0], overall, formation.effectiveTraits, situation).eligible);
        assert.equal(formation.sc, overall.sc);
        assert.equal(formation.sc, formation.ledger.reduce((sum, item) => sum + item.delta, 0));
      }
    }
  }
});

test('export and share retain the selected safe personal call and never reconstruct a fallback', () => {
  const input = { traits: ['p11', 'deep_shots'], book: 'Multiple', familyId: 'p11_gun',
    down: 4, distance: 'long', userProfile: { position: 'line', callStyle: 'pressure' } };
  const result = recommend(input);
  const sheet = buildCallSheetData({ input });
  assert.deepEqual(sheet.topFormations.map(f => [f.name, f.coverage]),
    result.formations.slice(0, 4).map(f => [f.name, f.personalizedCoverage]));
  const text = buildRecommendationShareText(result);
  for (const f of result.formations.slice(0, 4)) assert.ok(text.includes(`Best for you: ${f.personalizedCoverage}`));
});
