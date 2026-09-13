import test from 'node:test';
import assert from 'node:assert/strict';
import { assessConceptMatchups, buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { recommend } from '../src/engine/recommendations.js';

const quarters = { n: 'Cover 4 Quarters', badge: 'MATCH', rush: 4, cont: 0, spy: 0, deep: 4, shell: 4, und: 3, man: 0 };
const zero = { n: 'Zero Blitz', badge: 'BLITZ', rush: 6, cont: 0, spy: 0, deep: 0, shell: 0, und: 0, man: 5 };
const contain = { n: 'Cover 1 Contain', badge: 'MAN', rush: 4, cont: 2, spy: 0, deep: 1, shell: 1, und: 0, man: 6 };
const hardFlat = { n: 'Cover 2 Invert Hard Flat', badge: 'ZONE', rush: 4, cont: 0, spy: 0, deep: 2, shell: 2, und: 5, man: 0 };

test('formation structure alone does not invent concept scenarios', () => {
  assert.deepEqual(buildConceptScenarios(['p11', 'empty', 'trips', 'bunch']), []);
});

test('observed RPO produces labeled, lower-weight complements without duplicating quick game', () => {
  const rpoOnly = buildConceptScenarios(['rpo']);
  assert.equal(rpoOnly.find(s => s.id === 'rpo').source, 'observed');
  assert.equal(rpoOnly.find(s => s.id === 'quick').source, 'complement');
  assert.equal(rpoOnly.find(s => s.id === 'run-choice').source, 'complement');
  const explicit = buildConceptScenarios(['rpo', 'quick_game', 'inside_run']);
  assert.equal(explicit.filter(s => s.id === 'quick').length, 1);
  assert.equal(explicit.find(s => s.id === 'quick').source, 'observed');
  assert.equal(explicit.find(s => s.id === 'inside-run').source, 'observed');
});

test('bad-case weighting prefers balanced vertical protection over a catastrophic zero-deep answer', () => {
  const safe = assessConceptMatchups(quarters, quarters.n, ['deep_shots']);
  const exposed = assessConceptMatchups(zero, zero.n, ['deep_shots']);
  assert.ok(safe.utility > exposed.utility);
  assert.equal(exposed.badCase.id, 'vertical');
  assert.match(exposed.mainConcession, /deep help/);
});

test('verified coverage technique separates calls with similar assignment counts', () => {
  const quickAnswer = assessConceptMatchups(hardFlat, hardFlat.n, ['quick_game']);
  const ordinaryZone = assessConceptMatchups(quarters, quarters.n, ['quick_game']);
  assert.ok(quickAnswer.utility > ordinaryZone.utility);
  assert.match(quickAnswer.scenarios[0].support, /Hard-flat/);

  const verticalAnswer = assessConceptMatchups(quarters, quarters.n, ['deep_shots']);
  assert.equal(verticalAnswer.scenarios[0].grade, 88);
});

test('contain improves the narrow QB-run assessment but states its remaining concession', () => {
  const withContain = assessConceptMatchups(contain, contain.n, ['mobile_qb']);
  const without = assessConceptMatchups(quarters, quarters.n, ['mobile_qb']);
  assert.ok(withContain.utility > without.utility);
  assert.match(withContain.mainConcession, /inside lane|option read/);
});

test('live situation changes threat priority and bad-case protection', () => {
  const traits = ['inside_run', 'mobile_qb', 'quick_game', 'deep_shots'];
  const long = buildConceptScenarios(traits, '3lg');
  const short = buildConceptScenarios(traits, '3sh');
  const weight = (items, id) => items.find(item => item.id === id).normalizedWeight;
  assert.ok(weight(long, 'vertical') > weight(short, 'vertical'));
  assert.ok(weight(short, 'inside-run') > weight(long, 'inside-run'));
  assert.ok(weight(short, 'qb-run') > weight(long, 'qb-run'));

  const longAssessment = assessConceptMatchups(quarters, quarters.n, traits, '3lg');
  const baseAssessment = assessConceptMatchups(quarters, quarters.n, traits, 'base');
  assert.equal(longAssessment.riskWeight, 0.40);
  assert.equal(baseAssessment.riskWeight, 0.25);
  assert.equal(longAssessment.situation, '3lg');
});

test('the visible concern follows the down instead of the lowest raw grade', () => {
  const long = assessConceptMatchups(hardFlat, hardFlat.n, [], '3lg');
  const short = assessConceptMatchups(hardFlat, hardFlat.n, [], '3sh');

  assert.equal(long.priorityRisk.id, 'vertical');
  assert.equal(short.priorityRisk.id, 'inside-run');
  assert.notEqual(long.priorityRisk.label, short.priorityRisk.label);
  assert.doesNotMatch(short.mainConcession, /unverified|catalog|assignment/i);
  assert.ok(long.scenarios.every(scenario => scenario.source === 'situation'));
  assert.ok(short.scenarios.every(scenario => scenario.source === 'situation'));
});

test('unverified catalog calls stay available but withhold scenario claims for the six acceptance looks', () => {
  const verifiedFormations = new Set(['4-3 Over Solid', '3-4 Tite']);
  const cases = [
    { traits: ['p11', 'empty', 'mobile_qb', 'option_run', 'quick_game'], familyId: 'p11_empty' },
    { traits: ['p10', 'inside_run', 'outside_run', 'rpo'], familyId: 'p10_gun' },
    { traits: ['p11', 'bunch', 'crossers', 'quick_game'], familyId: 'p11_bunch' },
    { traits: ['p11', 'flat_attack', 'play_action'], familyId: 'p11_gun' },
    { traits: ['p10', 'deep_shots', 'seam_routes'], familyId: 'p10_gun' },
    { traits: ['p12', 'inside_run', 'play_action', 'seam_routes'], familyId: 'p12_gun' },
  ];
  for (const input of cases) {
    const result = recommend(input);
    assert.ok(result.formations.length);
    for (const formation of result.formations.slice(0, 3)) {
      if (verifiedFormations.has(formation.name)) {
        assert.equal(formation.matchup.status, 'verified');
        assert.ok(formation.matchup.concept);
        continue;
      }
      assert.equal(formation.matchup.status, 'unverified', `${input.familyId}: ${formation.name}`);
      assert.equal(formation.matchup.concept, null);
      assert.equal(formation.matchup.facts, null);
      assert.equal(formation.sc, formation.ledger.reduce((sum, entry) => sum + entry.delta, 0));
    }
  }
});
