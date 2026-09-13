import test from 'node:test';
import assert from 'node:assert/strict';
import { contextTraits, normalizeSituation } from '../src/engine/context.js';
import { scoreAll, scoreForFamily } from '../src/engine/scoring.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { FDB } from '../src/data/formations.js';
import { PLAYS } from '../src/data/plays.js';
import { PERSONNEL_FAMILIES, deriveImpliedTraits } from '../src/data/personnel.js';

const traits = ['p10', 'p11', 'empty', 'trips', 'inside_run', 'option_run', 'rpo', 'quick_game'];
const shape = f => [f.name, f.sc, f.recommendedCoverage, f.blitz];

test('personnel alone never invents alignment or run frequency', () => {
  for (const p of ['p10', 'p11', 'p12', 'p20']) {
    assert.deepEqual(deriveImpliedTraits([p]), [p]);
    assert.deepEqual(contextTraits([p]), [p]);
  }
});

test('empty family preserves observed runs and the actual personnel package', () => {
  const effective = contextTraits(['p10', 'p11', 'inside_run', 'option_run'], 'p11_empty');
  assert.ok(effective.includes('empty'));
  assert.ok(effective.includes('p11'));
  assert.ok(!effective.includes('p10'));
  assert.ok(!effective.includes('no_run'));
  assert.ok(effective.includes('inside_run'));
  assert.ok(effective.includes('option_run'));
});

test('family scorer honors both playbook and run/pass preference', () => {
  const run = scoreForFamily('p11_gun', traits, 'All', 7);
  const pass = scoreForFamily('p11_gun', traits, 'All', 1);
  assert.ok(run.some(f => pass.find(p => p.name === f.name)?.sc !== f.sc));
  const book = FDB[run[0].name].books.find(b => b !== 'All');
  assert.ok(book);
  const selected = scoreForFamily('p11_gun', traits, book, 7);
  assert.ok(selected.length);
  assert.ok(selected.every(f => f.books.includes(book) || f.books.includes('All')));
});

test('missing distance is neutral; red zone does not prescribe heavy personnel or Prevent', () => {
  assert.equal(normalizeSituation(4, '').key, 'base');
  const base = recommend({ traits });
  assert.deepEqual(recommend({ traits, down: 4 }).formations.map(shape), base.formations.map(shape));
  const redZone = recommend({ traits, down: 'rz' });
  assert.deepEqual(redZone.formations.map(f => f.name).sort(), base.formations.map(f => f.name).sort());
  assert.ok(redZone.formations.every(f => f.personnel !== 'Prevent'));
  assert.ok(base.formations.every(f => f.personnel !== 'Prevent'));
});

test('every recommendation has an exact inventory call; long yardage excludes zero-deep calls', () => {
  const allTraits = [...new Set(Object.values(FDB).flatMap(f => [...f.coreTags, ...f.suppTags]))];
  for (const down of ['base', 3, 4]) {
    const result = recommend({ traits: allTraits, down, distance: 12 });
    assert.ok(result.formations.length);
    for (const f of result.formations) {
      for (const c of f.rankedCoverages) {
        const play = PLAYS[f.name]?.find(p => p.n === c.name);
        assert.ok(play, `${f.name}: ${c.name}`);
        if (down !== 'base') assert.ok(play.deep > 0, `${f.name}: ${c.name}`);
      }
    }
  }
});

test('score and blitz explanations sum exactly across family/situation contexts', () => {
  for (const familyId of [null, ...Object.keys(PERSONNEL_FAMILIES)]) {
    for (const runPass of [1, 4, 7]) {
      for (const [down, distance] of [['base', ''], [2, 2], [3, 12], ['rz', '']]) {
        const result = recommend({ traits, familyId, runPass, down, distance });
        for (const f of result.formations) {
          assert.ok(f.sc > 0 && f.sc <= 100);
          assert.equal(f.ledger.reduce((sum, entry) => sum + entry.delta, 0), f.sc);
          const b = f.blitzLedger;
          assert.equal(b.base + b.positive + b.negative + b.clamp, f.blitz);
        }
      }
    }
  }
});

test('PDF current calls and share output match the live result; matrix changes only situation', () => {
  for (const familyId of [null, 'p11_empty', 'p10_trips']) {
    const input = { traits, familyId, runPass: 6, down: 3, distance: 'long', book: 'All' };
    const live = recommend(input);
    const pdf = buildCallSheetData({ input });
    assert.deepEqual(pdf.topFormations.map(f => [f.name, f.sc, f.coverage]), live.formations.slice(0, 4).map(f => [f.name, f.sc, f.personalizedCoverage]));
    const share = buildRecommendationShareText(live, traits);
    for (const f of live.formations.slice(0, 4)) {
      assert.ok(share.includes(`${f.name} — fit ${f.sc}/100`));
      assert.ok(share.includes(`Best for you: ${f.personalizedCoverage}`));
      assert.ok(!share.includes('Suggested blitz frequency'));
    }
    for (const row of pdf.situationMatrix.filter(r => r.down)) {
      const expected = recommend({ ...input, down: row.down, distance: row.distance }).formations[0];
      assert.equal(row.primary?.name, expected?.name);
      assert.equal(row.primary?.sc, expected?.sc);
      assert.equal(row.primary?.coverage, expected?.personalizedCoverage);
    }
    assert.equal(pdf.situationMatrix.find(r => r.label === '2-MINUTE DEF').primary, null);
    assert.equal(pdf.situationMatrix.find(r => r.label === 'GOAL LINE').primary, null);
  }
});

test('empty input is safe and scoring never mutates the catalog', () => {
  const before = JSON.stringify(FDB);
  assert.deepEqual(recommend().formations, []);
  scoreAll(traits);
  buildCallSheetData({ input: { traits } });
  assert.equal(JSON.stringify(FDB), before);
});
