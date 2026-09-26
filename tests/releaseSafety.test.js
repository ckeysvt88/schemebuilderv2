import test from 'node:test';
import assert from 'node:assert/strict';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { readOpponentProfiles, writeOpponentProfiles, saveOpponentProfile } from '../src/data/opponentProfile.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('personalized exports describe the selected call, including differing assignments and risk', () => {
  const input = { traits: ['p11', 'deep_shots'], runPass: 1, userProfile: { position: 'middle', callStyle: 'pressure' } };
  const result = recommend(input);
  const pdf = buildCallSheetData({ input });
  const f = result.formations[0];
  assert.notEqual(f.personalizedCoverage, f.recommendedCoverage);
  assert.notDeepEqual(f.personalizedCall.matchup, f.matchup);
  for (const [i, row] of pdf.topFormations.entries()) {
    const call = result.formations[i].rankedCoverages.find(c => c.name === row.coverage);
    assert.equal(row.sc, call.sc);
    assert.deepEqual(row.matchup, call.matchup);
  }
  for (const row of pdf.situationMatrix.filter(row => row.down)) {
    const formations = recommend({ ...input, down: row.down, distance: row.distance }).formations;
    for (const [i, exported] of [row.primary, row.secondary].entries()) {
      if (!exported) continue;
      const call = formations[i].rankedCoverages.find(c => c.name === exported.coverage);
      assert.equal(exported.sc, call.sc);
      assert.deepEqual(exported.matchup, call.matchup);
    }
  }
  // Check the complete first formation block, irrespective of preceding headings.
  const first = buildRecommendationShareText(result, input.traits).split('#1 ')[1].split('#2 ')[0];
  assert.ok(first.includes(`fit ${f.personalizedCall.sc}/100`));
  assert.ok(first.includes(`Stock call assignments: ${f.personalizedCall.matchup.structure}`));
  assert.ok(!first.includes(`Stock call assignments: ${f.matchup.structure}`));
});

test('personalized score ledgers and assignments stay tied to the chosen call across formations', () => {
  for (const position of ['middle', 'safety', 'slot', 'line']) for (const callStyle of ['balanced', 'safe', 'pressure']) {
    const r = recommend({ traits: ['p11', 'inside_run', 'quick_game'], userProfile: { position, callStyle } });
    for (const f of r.formations) {
      const call = f.rankedCoverages.find(c => c.name === f.personalizedCoverage);
      assert.equal(f.personalizedCall.sc, call.sc, f.name);
      assert.deepEqual(f.personalizedCall.matchup, call.matchup, f.name);
      assert.equal(f.personalizedCall.ledger.reduce((sum, row) => sum + row.delta, 0), call.sc, f.name);
    }
  }
});

test('save, rollback read, rollback edit, and upgrade preserve traits without stale bias', () => {
  const storage = memoryStorage();
  const traits = { personnel: ['p11'], passStyle: ['deep_shots'] };
  writeOpponentProfiles(storage, { Opponent: saveOpponentProfile(traits, 1) });
  const oldProfiles = JSON.parse(storage.getItem('cfb26_profiles'));
  assert.deepEqual(Object.values(oldProfiles.Opponent).flat(), ['p11', 'deep_shots']);
  assert.doesNotThrow(() => Object.entries(oldProfiles.Opponent).flatMap(([, ids]) => ids.map(id => id)));
  assert.equal(readOpponentProfiles(storage).Opponent.runPass, 1);
  oldProfiles.Opponent.passStyle = ['quick_game'];
  storage.setItem('cfb26_profiles', JSON.stringify(oldProfiles));
  assert.deepEqual(readOpponentProfiles(storage).Opponent.traits, oldProfiles.Opponent);
  assert.equal(readOpponentProfiles(storage).Opponent.runPass, 4);
  storage.setItem('cfb26_profiles', '{}');
  assert.deepEqual(readOpponentProfiles(storage), {}); // Do not resurrect a deleted scout.
});

test('existing wrapped profiles migrate with an untouched backup and retain their tendency', () => {
  const original = JSON.stringify({ Opponent: saveOpponentProfile({ runStyle: ['inside_run'] }, 7) });
  const storage = memoryStorage({ cfb26_profiles: original });
  assert.equal(readOpponentProfiles(storage).Opponent.runPass, 7);
  assert.equal(storage.getItem('cfb27_profiles_before_compatibility'), original);
  assert.deepEqual(JSON.parse(storage.getItem('cfb26_profiles')).Opponent, { runStyle: ['inside_run'] });
  assert.equal(readOpponentProfiles(storage).Opponent.runPass, 7);
});

test('migration does not overwrite data when a backup cannot be stored', () => {
  const original = JSON.stringify({ Opponent: saveOpponentProfile({ personnel: ['p12'] }, 6) });
  const storage = memoryStorage({ cfb26_profiles: original });
  storage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.equal(readOpponentProfiles(storage).Opponent.runPass, 6);
  assert.equal(storage.getItem('cfb26_profiles'), original);
});
