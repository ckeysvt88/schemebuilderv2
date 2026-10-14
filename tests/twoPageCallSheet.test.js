import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { buildPrintCallSheet } from '../src/engine/printCallSheet.js';
import { getDefaultFamily, getAvailableFamilies } from '../src/data/personnel.js';
import { assessConceptMatchups } from '../src/engine/conceptMatchup.js';
import { recommend } from '../src/engine/recommendations.js';

const akron = { traits: ['p11', 'rpo', 'quick_game', 'trips', 'inside_run', 'outside_run'], familyId: 'p11_gun', runPass: 4 };

test('Akron opens with scouted personnel without removing inventory choices', () => {
  assert.equal(getDefaultFamily(akron.traits, 'akron'), 'p11_gun');
  assert.ok(getAvailableFamilies(akron.traits, 'akron').includes('p10_empty'));
});

test('the two catalog encodings of Tampa carry the same matchup grades', () => {
  const common = { n: 'Tampa 2', badge: 'ZONE', rush: 4, man: 0, spy: 0, cont: 0 };
  for (const situation of ['base', '1_short', '2_short', '3_medium', '3_long']) {
    const a = assessConceptMatchups({ ...common, deep: 3, und: 4, shell: 'tampa' }, 'Tampa 2', [...akron.traits, 'seam_routes', 'crossers'], situation);
    const b = assessConceptMatchups({ ...common, deep: 2, und: 5, shell: 2 }, 'Tampa 2', [...akron.traits, 'seam_routes', 'crossers'], situation);
    assert.deepEqual(a.scenarios.map(s => s.grade), b.scenarios.map(s => s.grade));
    assert.equal(a.utility, b.utility);
  }
});

test('the pole carry has a conversion-window cost and second-and-short retains a shot', () => {
  const play = { n: 'Tampa 2', badge: 'ZONE', rush: 4, deep: 2, und: 5, shell: 2, man: 0, spy: 0, cont: 0 };
  const grade = sit => assessConceptMatchups(play, play.n, akron.traits, sit);
  assert.ok(grade('3_medium').scenarios.find(s => s.id === 'quick').grade < grade('3_long').scenarios.find(s => s.id === 'quick').grade);
  const shot = grade('2_short').scenarios.find(s => s.id === 'vertical');
  assert.equal(shot.source, 'situation');
});

test('Akron has distinct situational foundations and exact live/PDF parity', () => {
  const rows = buildCallSheetData({ input: akron }).situationMatrix.filter(r => r.down);
  assert.ok(rows.filter(r => r.primary.coverage === 'Tampa 2').length <= 3);
  assert.ok(new Set(rows.map(r => r.primary.coverage)).size >= 3);
  for (const row of rows) {
    const live = recommend({ ...akron, down: row.down, distance: row.distance });
    assert.deepEqual(row.plannedMix, live.plannedMix);
    assert.ok(row.plannedMix.calls.length >= 3);
    assert.equal(new Set(row.plannedMix.calls.map(c => c.signature)).size, row.plannedMix.calls.length);
  }
});

test('print references preserve complete instructions and explicitly mark overflow', () => {
  const data = buildCallSheetData({ input: akron });
  const before = JSON.stringify(data);
  const print = buildPrintCallSheet(data);
  assert.equal(print.hasAppReferences, false);
  for (const row of print.rows) for (const call of row.calls) {
    assert.equal(print.setups.find(s => s.id === call.setupRef).text, call.quickSetup);
    assert.equal(print.jobs.find(j => j.id === call.jobRef).text, call.userJob);
  }
  assert.equal(JSON.stringify(data), before);
  data.situationMatrix[0].plannedMix.calls[0].quickSetup = 'Very large instruction '.repeat(20);
  assert.equal(buildPrintCallSheet(data).rows[0].calls[0].setupRef, 'APP');
});
