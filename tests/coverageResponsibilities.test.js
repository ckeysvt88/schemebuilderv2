import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYS } from '../src/data/plays.js';
import { assessConceptMatchups, buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { getCoverageResponsibilities } from '../src/engine/coverageResponsibilities.js';
import { evaluateCoverage } from '../src/engine/playMatchup.js';
import { recommend } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const play = name => Object.values(PLAYS).flat().find(p => p.n === name);
const assess = (name, traits, situation = 'base', objective = 'balanced') =>
  assessConceptMatchups(play(name), name, traits, situation, objective);
const grade = (name, traits, id) => assess(name, traits).scenarios.find(s => s.id === id).grade;

test('seams remain one vertical scenario and survive an objective override', () => {
  for (const objective of ['balanced', 'no_quick_td', 'get_stop']) {
    const seam = buildConceptScenarios(['seam_routes'], '3lg', objective).filter(s => s.id === 'vertical');
    assert.equal(seam.length, 1);
    assert.equal(seam[0].attack, 'seam');
    const mixed = buildConceptScenarios(['deep_shots', 'seam_routes'], 'base', objective).filter(s => s.id === 'vertical');
    assert.equal(mixed.length, 1);
    assert.equal(mixed[0].attack, 'mixed');
  }
  assert.equal(buildConceptScenarios(['deep_shots']).find(s => s.id === 'vertical').attack, 'broad');
});

test('Tampa pole helps seams while conceding short middle space', () => {
  assert.ok(grade('Tampa 2', ['seam_routes'], 'vertical') > grade('Cover 2', ['seam_routes'], 'vertical'));
  assert.ok(grade('Tampa 2', ['slant_heavy'], 'quick') < grade('Cover 2', ['slant_heavy'], 'quick'));
  assert.ok(grade('Tampa 2', ['crossers'], 'crossers') < grade('Cover 2', ['crossers'], 'crossers'));
  assert.match(assess('Tampa 2', ['seam_routes']).scenarios.find(s => s.id === 'vertical').concession, /speed.*unknown/);
});

test('hard flats trade low-route help for exposure behind them', () => {
  assert.ok(grade('Cover 3 Hard Flat', ['quick_game'], 'quick') > grade('Cover 3 Sky', ['quick_game'], 'quick'));
  assert.equal(grade('Cover 3 Hard Flat', ['slant_heavy'], 'quick'), grade('Cover 3 Sky', ['slant_heavy'], 'quick'));
  assert.ok(grade('Cover 3 Hard Flat', ['flat_attack'], 'sideline') < grade('Cover 3 Cloud', ['flat_attack'], 'sideline'));
  assert.ok(grade('Cover 2 Hard Flat', ['flat_attack'], 'sideline') < grade('Tampa 2', ['flat_attack'], 'sideline'));
  assert.match(assess('Cover 3 Cloud', ['flat_attack']).mainConcession, /side.*depth.*not known/);
});

test('Buzz changes inside support; Palms does not get an automatic slant bonus', () => {
  assert.ok(grade('Cover 3 Buzz', ['slant_heavy'], 'quick') > grade('Cover 3 Sky', ['slant_heavy'], 'quick'));
  assert.ok(grade('Cover 3 Buzz', ['crossers'], 'crossers') > grade('Cover 3 Sky', ['crossers'], 'crossers'));
  assert.equal(grade('Cover 4 Palms', ['slant_heavy'], 'quick'), grade('Cover 4 Quarters', ['slant_heavy'], 'quick'));
  assert.ok(grade('Cover 4 Palms', ['quick_game'], 'quick') > grade('Cover 4 Quarters', ['quick_game'], 'quick'));
  assert.match(assess('Cover 4 Palms', ['quick_game']).scenarios.find(s => s.id === 'quick').concession, /wrong exchange/);
});

test('names, notes, and formation shapes cannot invent unsupported responsibilities', () => {
  assert.equal(getCoverageResponsibilities(null, 'Cover 3 Buzz'), null);
  const sky = play('Cover 3 Sky');
  assert.equal(getCoverageResponsibilities(sky, 'Cover 3 Buzz'), null);
  assert.equal(getCoverageResponsibilities({ ...sky, n: 'Mystery Buzz Pressure' }, 'Mystery Buzz Pressure').buzz, false);
  assert.equal(getCoverageResponsibilities({ ...sky, n: 'Cover 4 Palms' }, 'Cover 4 Palms').palms, false);
  const raw = assessConceptMatchups(sky, sky.n, ['crossers']);
  const changedNotes = assessConceptMatchups({ ...sky, notes: 'Hard flats and pole and Palms' }, sky.n, ['crossers']);
  assert.deepEqual(changedNotes, raw);
  const unverified = evaluateCoverage({ name: 'Tampa 2' }, play('Tampa 2'), ['seam_routes'], 70, null);
  assert.equal(unverified.matchup.status, 'unverified');
  assert.equal(unverified.matchup.concept.responsibilities, null);
  assert.equal(unverified.matchup.concept.scenarios.find(s => s.id === 'vertical').grade, 50);
});

test('match coverage carries seams without inventing a full solution for every concept', () => {
  assert.ok(grade('Cover 3 Match', ['seam_routes'], 'vertical') > grade('Cover 3 Sky', ['seam_routes'], 'vertical'));
  assert.equal(grade('Cover 3 Match', ['slant_heavy'], 'quick'), grade('Cover 3 Sky', ['slant_heavy'], 'quick'));
  assert.match(assess('Cover 3 Match', ['seam_routes']).scenarios.find(s => s.id === 'vertical').support, /confirm the check/);
  assert.ok(grade('Cover 4 Quarters', ['play_action'], 'play-action') < grade('Cover 4 Quarters', ['seam_routes'], 'vertical'));
});

test('review scouts retain playbook eligibility, exact PDF parity, and additive score ledgers', () => {
  for (const traits of [ ['p11', 'slant_heavy', 'crossers'], ['p12', 'seam_routes', 'play_action'],
    ['p11', 'quick_game', 'flat_attack'], ['p10', 'deep_shots', 'seam_routes'] ]) {
    const input = { traits, book: 'Multiple', down: 3, distance: 5, userProfile: { position: 'middle', callStyle: 'balanced' } };
    const result = recommend(input);
    assert.ok(result.formations.length);
    for (const f of result.formations) {
      assert.ok(f.books.includes('Multiple') || f.books.includes('All'));
      assert.equal(f.sc, f.ledger.reduce((sum, entry) => sum + entry.delta, 0));
      assert.equal(f.personalizedCall.sc, f.personalizedCall.ledger.reduce((sum, entry) => sum + entry.delta, 0));
    }
    const row = buildCallSheetData({ input }).situationMatrix.find(r => r.down === 3 && r.distance === 5);
    assert.equal(row.primary.name, result.formations[0].name);
    assert.equal(row.primary.coverage, result.formations[0].personalizedCoverage);
    assert.equal(row.primary.sc, result.formations[0].personalizedCall.sc);
  }
});
