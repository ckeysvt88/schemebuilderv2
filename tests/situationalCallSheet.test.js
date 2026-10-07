import test from 'node:test';
import assert from 'node:assert/strict';
import { buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { recommend } from '../src/engine/recommendations.js';
import { normalizeSituation } from '../src/engine/context.js';
import { PLAYS } from '../src/data/plays.js';

const weight = (rows, id) => rows.find(row => row.id === id)?.normalizedWeight || 0;

test('early-down contexts retain run/pass answers and second-and-short shot risk', () => {
  const firstTen = buildConceptScenarios(['p11'], '1_long');
  assert.ok(weight(firstTen, 'run-choice') > 0);
  assert.ok(weight(firstTen, 'pass-choice') > 0);
  assert.ok(firstTen.every(row => row.source === 'situation'));
  const traits = ['inside_run', 'quick_game', 'deep_shots'];
  const secondShort = buildConceptScenarios(traits, '2_short');
  const secondLong = buildConceptScenarios(traits, '2_long');
  assert.ok(weight(secondShort, 'inside-run') > weight(secondLong, 'inside-run'));
  assert.ok(weight(secondLong, 'vertical') > weight(secondShort, 'vertical'));
  assert.ok(secondShort.some(row => row.id === 'play-action' && row.source === 'situation'));
});

test('medium conversion downs emphasize catch-point routes instead of long-yardage cushion', () => {
  const traits = ['p11', 'inside_run', 'quick_game', 'crossers', 'deep_shots'];
  const medium = buildConceptScenarios(traits, '3_medium');
  const long = buildConceptScenarios(traits, '3_long');
  assert.ok(weight(medium, 'quick') > weight(long, 'quick'));
  assert.ok(weight(medium, 'crossers') > weight(long, 'crossers'));
  assert.ok(weight(long, 'vertical') > weight(medium, 'vertical'));
  assert.equal(medium.find(row => row.id === 'inside-run').source, 'observed');
});

test('call-sheet regression: repetitive quick-game scouts respond to down/distance in the shared engine', () => {
  const profiles = [
    { traits: ['p10', 'quick_game'] },
    { traits: ['p11', 'crossers', 'slant_heavy'] },
    { traits: ['p11', 'inside_run', 'quick_game', 'crossers'], familyId: 'p11_gun' },
  ];
  for (const input of profiles) {
    const data = buildCallSheetData({ input });
    const rows = data.situationMatrix.filter(row => row.down);
    assert.equal(rows.length, 12);
    assert.ok(rows.some(row => row.label === '4TH & MEDIUM'));
    const calls = rows.map(row => row.primary.name + '::' + row.primary.coverage);
    assert.ok(new Set(calls).size >= 3, input.traits.join(','));
    for (const row of rows) {
      const live = recommend({ ...input, down: row.down, distance: row.distance }).formations[0];
      assert.equal(row.primary.name, live.name);
      assert.equal(row.primary.coverage, live.personalizedCall.name);
      assert.equal(row.primary.sc, live.personalizedCall.sc);
      assert.equal(live.personalizedCall.matchup.concept.situation, normalizeSituation(row.down, row.distance).key);
      assert.equal(live.personalizedCall.ledger.reduce((sum, item) => sum + item.delta, 0), row.primary.sc);
    }
    const medium = rows.find(row => row.label === '3RD & MEDIUM');
    const long = rows.find(row => row.label === '3RD & LONG');
    assert.doesNotMatch(rows.find(row => row.label === '2ND & SHORT').primary.quickSetup, /Zone Strategy: Aggressive/);
    assert.match(medium.primary.quickSetup, /Cornerback Depth: 5 yards/);
    assert.doesNotMatch(medium.primary.quickSetup, /Cornerback Depth: 10 yards|Pass Commit/);
    assert.match(long.primary.quickSetup, /Conservative/);
    assert.notEqual(medium.dcTip, long.dcTip);
  }
});

test('restricted playbooks, user preferences, and deep-help guardrails survive every PDF situation', () => {
  for (const book of ['4-2-5', '3-3-5', '3-4 Multiple']) {
    const input = { book, traits: ['p11', 'quick_game', 'inside_run', 'mobile_qb', 'deep_shots'],
      userProfile: { position: 'line', callStyle: 'pressure' }, runPass: 6 };
    const rows = buildCallSheetData({ input }).situationMatrix.filter(row => row.down);
    for (const row of rows) {
      const live = recommend({ ...input, down: row.down, distance: row.distance });
      for (const formation of live.formations) {
        assert.ok(formation.books.includes(book) || formation.books.includes('All'));
        assert.ok(PLAYS[formation.name].some(play => play.n === formation.personalizedCoverage));
        assert.ok(formation.personalizedCall.matchup.facts.deep > 0);
        assert.ok(formation.personalizedCall.sc > 0 && formation.personalizedCall.sc <= 100);
      }
    }
    assert.deepEqual(rows.map(row => row.primary),
      buildCallSheetData({ input }).situationMatrix.filter(row => row.down).map(row => row.primary));
  }
});
