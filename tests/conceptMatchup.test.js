import test from 'node:test';
import assert from 'node:assert/strict';
import { assessConceptMatchups, buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { recommend } from '../src/engine/recommendations.js';

const quarters = { n: 'Cover 4 Quarters', badge: 'MATCH', rush: 4, cont: 0, spy: 0, deep: 4, shell: 4, und: 3, man: 0 };
const zero = { n: 'Zero Blitz', badge: 'BLITZ', rush: 6, cont: 0, spy: 0, deep: 0, shell: 0, und: 0, man: 5 };
const contain = { n: 'Cover 1 Contain', badge: 'MAN', rush: 4, cont: 2, spy: 0, deep: 1, shell: 1, und: 0, man: 6 };

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

test('contain improves the narrow QB-run assessment but states its remaining concession', () => {
  const withContain = assessConceptMatchups(contain, contain.n, ['mobile_qb']);
  const without = assessConceptMatchups(quarters, quarters.n, ['mobile_qb']);
  assert.ok(withContain.utility > without.utility);
  assert.match(withContain.mainConcession, /interior draw|option phase/);
});

test('unverified catalog calls stay available but withhold scenario claims for the six acceptance looks', () => {
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
      assert.equal(formation.matchup.status, 'unverified', `${input.familyId}: ${formation.name}`);
      assert.equal(formation.matchup.concept, null);
      assert.equal(formation.matchup.facts, null);
      assert.equal(formation.sc, formation.ledger.reduce((sum, entry) => sum + entry.delta, 0));
    }
  }
});
