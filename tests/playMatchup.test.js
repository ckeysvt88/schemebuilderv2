import test from 'node:test';
import assert from 'node:assert/strict';
import { assessPlay, evaluateCoverage, threatProfile, validPlayStructure } from '../src/engine/playMatchup.js';
import { recommend } from '../src/engine/recommendations.js';
import { PLAYS } from '../src/data/plays.js';
import { VERIFIED_PLAY_ASSIGNMENTS, getPlayAssignmentEvidence } from '../src/data/playEvidence.js';

const zone = { n: 'Fixture', badge: 'ZONE', rush: 4, cont: 0, spy: 0, deep: 3, shell: 3, und: 4, man: 0 };
const zero = { n: 'Zero fixture', badge: 'BLITZ', rush: 6, cont: 0, spy: 0, deep: 0, shell: 0, und: 0, man: 5 };

test('play-name Spy is not evidence of a spy assignment', () => {
  const p = PLAYS['3-4 Under 4 Tech'].find(p => p.n === 'Cov 1 QB Contain Spy');
  const assessment = assessPlay(p, threatProfile(['mobile_qb']));
  assert.equal(assessment.facts.spy, 0);
  assert.equal(assessment.facts.contain, 2);
  assert.ok(assessment.support.some(s => s.includes('not a true spy')));
  assert.ok(!assessment.support.some(s => s.startsWith('A true spy')));
});

test('QB assignment evaluation uses this play, not its formation menu', () => {
  const a = assessPlay(zone, threatProfile(['mobile_qb']));
  assert.ok(a.factors.some(f => f.id === 'play:mobileWithoutAssignment'));
  const withSpy = { ...zone, und: 3, spy: 1 };
  const b = assessPlay(withSpy, threatProfile(['mobile_qb']));
  assert.ok(!b.factors.some(f => f.id === 'play:mobileWithoutAssignment'));
  assert.equal(b.delta, 0); // Presence is not a pressure or run-fit bonus.
});

test('deep-shot exposure caps a highly rated zero call despite formation bonuses', () => {
  const evidence = { source: 'test fixture' };
  const a = evaluateCoverage({ name: zero.n, rating: 5 }, zero, ['deep_shots'], 100, evidence);
  const b = evaluateCoverage({ name: zone.n, rating: 3 }, zone, ['deep_shots'], 100, evidence);
  assert.equal(a.sc, 35);
  assert.ok(b.sc > a.sc);
  assert.equal(100 + a.ledger.reduce((sum, f) => sum + f.delta, 0), a.sc);
  assert.equal(a.matchup.factors.filter(f => f.id.includes('Deep') || f.id.includes('deepShots')).length, 1);
});

test('unverified play-art counts are withheld and cannot change a recommendation score', () => {
  const a = evaluateCoverage({ name: zero.n, rating: 5 }, zero, ['deep_shots'], 73);
  assert.equal(a.sc, 73);
  assert.equal(a.matchup.status, 'unverified');
  assert.equal(a.matchup.facts, null);
  assert.equal(a.matchup.concept, null);
  assert.equal(a.ledger.reduce((sum, item) => sum + item.delta, 0), 0);
});

test('quick/RPO/screen tags do not triple-charge the same thin-pressure risk', () => {
  const fireZone = { ...zone, rush: 5, und: 3 };
  const one = assessPlay(fireZone, threatProfile(['quick_game']));
  const many = assessPlay(fireZone, threatProfile(['quick_game', 'rpo', 'screens']));
  assert.equal(one.delta, many.delta);
  assert.ok(many.unknowns.some(s => s.includes('conflict defender')));
  assert.ok(one.delta < assessPlay(zone, threatProfile(['quick_game'])).delta);
});

test('formation tags do not create concept probabilities or mobility observations', () => {
  const t = threatProfile(['p10', 'empty', 'trips']);
  assert.ok(Object.values(t).every(value => value === false));
});

test('counts cannot claim full run fits or validated match checks', () => {
  const a = assessPlay({ ...zone, badge: 'MATCH' }, threatProfile(['option_run', 'rpo']));
  assert.ok(a.unknowns.some(s => s.includes('Run gaps')));
  assert.ok(a.unknowns.some(s => s.includes('in-game validation')));
});

test('malformed assignments are ineligible; contain is a subset of rushers', () => {
  assert.equal(assessPlay({ ...zone, und: 9 }), null);
  assert.equal(assessPlay({ ...zone, cont: 5 }), null);
  assert.equal(assessPlay({ ...zone, spy: undefined }), null);
  assert.equal(validPlayStructure(zone), true);
});

test('catalogued counts satisfy the evaluator and remain unchanged', () => {
  const before = JSON.stringify(PLAYS);
  for (const [name, plays] of Object.entries(PLAYS)) {
    for (const play of plays) assert.ok(validPlayStructure(play), `${name}: ${play.n}`);
  }
  const result = recommend({traits:['p11','mobile_qb','crossers','quick_game','deep_shots'],familyId:'p11_gun'});
  assert.ok(result.formations.length);
  for (const f of result.formations) {
    assert.equal(f.sc, f.rankedCoverages[0].sc);
    assert.equal(f.recommendedCoverage, f.rankedCoverages[0].name);
    assert.equal(f.matchup, f.rankedCoverages[0].matchup);
    assert.equal(f.sc, f.ledger.reduce((sum, item) => sum + item.delta, 0));
  }
  assert.equal(JSON.stringify(PLAYS), before);
});

test('verified formation menus are complete and auditable', () => {
  const menus = {
    '4-3 Over Solid': ['Cover 3 Match', 'Cover 4 Quarters', 'Cover 2 Invert Hard Flat', 'Cover 3 Sky Wk', 'FS Blitz', 'Hammer 0 Blast'],
    '3-4 Tite': ['Cover 3 Sky', 'Cover 4 Quarters', 'Cover 6', 'Saw Blitz 3', 'Cover 3 Match', 'Tampa 2'],
  };
  assert.equal(Object.keys(VERIFIED_PLAY_ASSIGNMENTS).length, Object.values(menus).flat().length);
  for (const [formation, calls] of Object.entries(menus)) {
    for (const call of calls) {
      const evidence = getPlayAssignmentEvidence(formation, call);
      const play = PLAYS[formation].find(item => item.n === call);
      assert.ok(evidence, `${formation}: ${call}`);
      assert.match(evidence.source, /^https:\/\/cfb\.fan\/27\/playbooks\//);
      assert.ok(validPlayStructure(play), `${formation}: ${call}`);
    }
  }
});

test('verified 3-4 Tite uses exact call assignments rather than its five-man front appearance', () => {
  const result = recommend({
    traits: ['p11', 'inside_run', 'rpo', 'option_run', 'deep_shots'],
    book: 'Multiple', familyId: 'p11_gun', down: 3, distance: 'short',
  });
  const formation = result.formations.find(item => item.name === '3-4 Tite');
  assert.ok(formation);
  assert.equal(formation.matchup.status, 'verified');
  assert.equal(formation.rankedCoverages.length, 6);
  assert.ok(formation.rankedCoverages.every(call => call.matchup.status === 'verified'));
  assert.equal(formation.sc, formation.ledger.reduce((sum, item) => sum + item.delta, 0));
});

test('verified 4-3 Over Solid uses situation-aware exact-call scoring', () => {
  const result = recommend({
    traits: ['p11', 'inside_run', 'mobile_qb', 'quick_game', 'deep_shots'],
    book: 'Multiple', familyId: 'p11_gun', down: 3, distance: 'long',
  });
  const formation = result.formations.find(item => item.name === '4-3 Over Solid');
  assert.ok(formation);
  assert.equal(formation.matchup.status, 'verified');
  assert.equal(formation.matchup.concept.situation, '3lg');
  assert.equal(formation.matchup.concept.riskWeight, 0.40);
  assert.equal(formation.sc, formation.ledger.reduce((sum, item) => sum + item.delta, 0));
});

test('verified technique changes the recommended call for distinct problems', () => {
  const selected = traits => recommend({ traits: ['p11', ...traits], book: 'Multiple' })
    .formations.find(item => item.name === '4-3 Over Solid')?.recommendedCoverage;
  assert.equal(selected(['quick_game']), 'Cover 2 Invert Hard Flat');
  assert.equal(selected(['deep_shots']), 'Cover 4 Quarters');
  assert.equal(selected(['inside_run']), 'Cover 4 Quarters');
});
