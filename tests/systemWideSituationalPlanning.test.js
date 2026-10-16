import test from 'node:test';
import assert from 'node:assert/strict';
import { TEAMS } from '../src/data/teams.js';
import { FDB } from '../src/data/formations.js';
import { PLAYBOOKS } from '../src/data/playbooks.js';
import { PERSONNEL_FAMILIES, getDefaultFamily } from '../src/data/personnel.js';
import { GAME_OBJECTIVES } from '../src/data/gameObjectives.js';
import { USER_POSITIONS, CALL_STYLES } from '../src/data/userProfile.js';
import { recommend } from '../src/engine/recommendations.js';
import { compareFormationPurpose, formationSituationFit } from '../src/engine/downDistance.js';
import { getPressurePresentation } from '../src/engine/pressureProfile.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { isDeepSafeCall } from '../src/data/coverageFlags.js';

const situations = [[1,2],[1,5],[1,10],[2,2],[2,5],[2,9],[3,2],[3,5],[3,10],[4,1],[4,5],[4,7]];
function check(input, result, label) {
  const mix = result.plannedMix.calls;
  assert.ok(mix.length <= 4, label);
  assert.equal(new Set(mix.map(c => c.signature)).size, mix.length, label);
  for (const f of result.formations) {
    assert.ok(Number.isFinite(f.sc) && f.sc >= 0 && f.sc <= 100, label);
    assert.equal(f.ledger.reduce((sum, item) => sum + item.delta, 0), f.sc, label);
    if (input.book && input.book !== 'All') assert.ok(f.books.includes(input.book) || f.books.includes('All'), label);
    if (input.gameObjective === 'no_quick_td') for (const name of [f.recommendedCoverage, f.personalizedCoverage]) {
      const facts = f.rankedCoverages.find(c => c.name === name).matchup.facts;
      assert.ok(facts.deep >= 2 && facts.rushers <= 4, label);
    }
  }
  const primary = mix[0];
  for (const call of mix) {
    const original = result.formations.find(f => f.name === call.formation)?.rankedCoverages.find(c => c.name === call.call);
    assert.ok(original, label);
    assert.equal(call.sc, original.sc, label);
    assert.equal(original.matchup.status, 'verified', label);
    if (input.down >= 3 && input.distance >= 7) assert.ok(isDeepSafeCall(call.call), label);
    if (input.gameObjective === 'no_quick_td') { assert.ok(call.matchup.facts.deep >= 2, label); assert.equal(call.pressure, false, label); }
    if (input.traits.some(t => ['no_huddle', 'hurry_up', 'tempo_shift'].includes(t))) assert.equal(call.formation, primary.formation, label);
    if (input.down >= 3 && input.distance <= 3 && !FDB[primary.formation].avoidTags.includes('short_yardage_run')) {
      assert.ok(!FDB[call.formation].avoidTags.includes('short_yardage_run'), label);
    }
    const facts = primary.matchup.facts;
    if (input.traits.some(t => ['mobile_qb', 'dual_threat', 'qb_scramble'].includes(t)) && (facts.spy || facts.contain)) {
      assert.ok(call.matchup.facts.spy || call.matchup.facts.contain, label);
    }
  }
}

test('all saved teams retain valid situational menus for all twelve down/distance rows', t => {
  let cases = 0, changedPrimary = 0;
  for (const team of TEAMS) {
    const base = { traits: team.traits, familyId: getDefaultFamily(team.traits, team.id), book: 'All', runPass: 4 };
    const results = situations.map(([down, distance]) => {
      const input = { ...base, down, distance }, result = recommend(input);
      check(input, result, `${team.id} ${down}&${distance}`); cases++;
      return result;
    });
    assert.notDeepEqual(results[6].plannedMix, results[8].plannedMix, team.id);
    if (results[6].callPlan.primary?.formation !== results[8].callPlan.primary?.formation) changedPrimary++;
  }
  t.diagnostic(`${TEAMS.length} teams, ${cases} situation cases; ${changedPrimary} change primary formation between third-and-short and third-and-long.`);
});

test('every personnel family/playbook pair respects safeguards across varied scout and player settings', t => {
  const books = ['All', ...Object.keys(PLAYBOOKS)];
  const profiles = [
    ['inside_run','outside_run','rpo','quick_game'], ['deep_shots','seam_routes','play_action'],
    ['qb_scramble','crossers','quick_game'], ['option_run','fb_lead','inside_run'],
    ['screens','slant_heavy','no_huddle'], ['outside_run','motion_heavy','tempo_shift'],
    ['inside_run','short_yardage_run','strong_oline'], [],
  ];
  const seen = { tendency: new Set(), objective: new Set(), position: new Set(), style: new Set(), situation: new Set() };
  let cases = 0;
  for (const familyId of Object.keys(PERSONNEL_FAMILIES)) for (const book of books) {
    const i = cases++, [down, distance] = situations[i % situations.length];
    const personnel = /^p\d\d/.exec(familyId)?.[0] || PERSONNEL_FAMILIES[familyId].base;
    const input = { familyId, book, down, distance, traits: [personnel, ...profiles[i % profiles.length]],
      runPass: i % 7 + 1, gameObjective: GAME_OBJECTIVES[Math.floor(i / 7) % GAME_OBJECTIVES.length].id,
      userProfile: { position: USER_POSITIONS[Math.floor(i / 21) % USER_POSITIONS.length].id,
        callStyle: CALL_STYLES[Math.floor(i / 84) % CALL_STYLES.length].id } };
    const before = JSON.stringify(input);
    check(input, recommend(input), `${familyId}/${book}/${down}&${distance}`);
    assert.equal(JSON.stringify(input), before);
    seen.tendency.add(input.runPass); seen.objective.add(input.gameObjective); seen.position.add(input.userProfile.position); seen.style.add(input.userProfile.callStyle); seen.situation.add(`${down}/${distance}`);
  }
  assert.equal(seen.tendency.size, 7); assert.equal(seen.objective.size, GAME_OBJECTIVES.length);
  assert.equal(seen.position.size, USER_POSITIONS.length); assert.equal(seen.style.size, CALL_STYLES.length); assert.equal(seen.situation.size, 12);
  t.diagnostic(`${cases} family/playbook pairs; all tendencies, objectives, positions, styles and situations covered. Not an exhaustive cross product.`);
});

test('formation score ties use short/long purpose rather than alphabetical labels', () => {
  const run = { name: 'AAA', priority: 'run' }, pass = { name: 'ZZZ', priority: 'pass' };
  assert.ok(compareFormationPurpose(run, pass, { down: 3, distance: 2 }) < 0);
  assert.ok(compareFormationPurpose(run, pass, { down: 3, distance: 10 }) > 0);
  assert.equal(compareFormationPurpose(run, pass, { down: null, distance: null }), 0);
  const team = TEAMS.find(t => t.id === 'air-force');
  const base = { traits: team.traits, familyId: getDefaultFamily(team.traits, team.id), down: 3 };
  assert.equal(FDB[recommend({ ...base, distance: 2 }).callPlan.primary.formation].priority, 'run');
  const long = recommend({ ...base, distance: 10 }).callPlan.primary;
  // Grizzly is now correctly pressure-oriented. A run-capable front can still
  // supply deep coverage against this heavy offensive package; inspect the call.
  assert.ok(isDeepSafeCall(long.call));
  assert.ok(long.matchup.facts.deep >= 2);
  assert.notEqual(long.call, recommend({ ...base, distance: 2 }).callPlan.primary.call);
});

test('custom scouts and team scouts share the same engine and PDF selections', () => {
  for (const id of ['army','baylor','akron','air-force']) {
    const team = TEAMS.find(t => t.id === id);
    const input = { traits: [...team.traits], familyId: getDefaultFamily(team.traits, id), book: 'Multiple', runPass: 4 };
    const sheet = buildCallSheetData({ input: { ...input, opponentName: 'Custom opponent' } });
    for (const row of sheet.situationMatrix.filter(r => r.down)) {
      assert.deepEqual(row.plannedMix, recommend({ ...input, down: row.down, distance: row.distance }).plannedMix);
    }
  }
});

test('short-yardage suitability and long-yardage relief preserve unrelated warnings', () => {
  assert.ok(formationSituationFit({ avoidTags: ['short_yardage_run'] }, { down: 3, distance: 2 }).delta < 0);
  assert.equal(formationSituationFit({ avoidTags: ['short_yardage_run'] }, { down: 1, distance: 2 }).delta, 0);
  assert.ok(formationSituationFit({ coreTags: ['short_yardage_run'] }, { down: 4, distance: 1 }).delta > 0);
  const f = { runPass: 4, ledger: [{ id: 'avoid', delta: -23, tags: ['inside_run','outside_run'] }] };
  const context = { down: 3, distance: 10 };
  assert.ok(formationSituationFit(f, context).delta > 0);
  assert.equal(formationSituationFit({ ...f, runPass: 7 }, context).delta, 0);
  for (const tag of ['p22','quick_game','hurry_up']) assert.equal(formationSituationFit({ ...f, ledger: [{ id: 'avoid', delta: -23, tags: ['inside_run',tag] }] }, context).delta, 0);
});

test('Akron conversion distances change formation purpose and expose a documented coverage pressure look', () => {
  const scout = { traits: ['p11','rpo','quick_game','trips','inside_run','outside_run'], familyId: 'p11_gun', runPass: 4 };
  const results = [2,5,10].map(distance => recommend({ ...scout, down: 3, distance }));
  assert.equal(new Set(results.map(r => r.callPlan.primary.formation)).size, 3);
  const look = results[2].plannedMix.calls.find(c => c.role === 'pressure-look');
  assert.ok(look);
  assert.equal(look.pressure, false);
  assert.equal(look.presentation.rushers, 4);
  assert.ok(look.matchup.facts.deep >= 2);
  const call = results[2].formations.find(f => f.name === look.formation).rankedCoverages.find(c => c.name === look.call);
  assert.ok(getPressurePresentation(look.formation, call));
  assert.equal(getPressurePresentation('Invented Double Mug', call), null);
  assert.equal(getPressurePresentation(look.formation, { matchup: { ...call.matchup, status: 'unverified' } }), null);
});
