import test from 'node:test';
import assert from 'node:assert/strict';
import { PERSONNEL_FAMILIES } from '../src/data/personnel.js';
import { scoreAll } from '../src/engine/scoring.js';
import { buildConceptScenarios, assessConceptMatchups } from '../src/engine/conceptMatchup.js';
import { recommend } from '../src/engine/recommendations.js';

const runIds = new Set(['inside-run', 'edge-run', 'qb-run', 'run-choice']);
test('opposite tendency penalties survive capped family grades across all families', () => {
  let checked = 0;
  for (const familyId of [null, ...Object.keys(PERSONNEL_FAMILIES)]) {
    const traits = ['p11', 'p12'];
    const neutral = scoreAll(traits, 'All', 4, familyId);
    for (const runPass of [1, 7]) for (const f of scoreAll(traits, 'All', runPass, familyId)) {
      if (f.ledger.find(e => e.id === 'runPass').delta >= 0) continue;
      const base = neutral.find(n => n.name === f.name);
      if (base.sc > 1) { assert.ok(f.sc < base.sc, f.name); checked++; }
      assert.equal(f.sc, f.ledger.reduce((n,e)=>n+e.delta,0));
    }
  }
  assert.ok(checked > 100);
});
test('many pass tags cannot swamp explicit run emphasis and vice versa', () => {
  for (const traits of [
    ['quick_game','screens','crossers','flat_attack','deep_shots'],
    ['inside_run','outside_run','option_run'],
  ]) {
    let last = -1;
    for (let runPass = 1; runPass <= 7; runPass++) {
      const rows = buildConceptScenarios(traits, 'base', 'balanced', runPass);
      const mass = rows.filter(r=>runIds.has(r.id)).reduce((n,r)=>n+r.normalizedWeight,0);
      assert.ok(mass > last); last = mass;
      if (runPass === 1) assert.ok(mass <= 0.201);
      if (runPass === 7) assert.ok(mass >= 0.799);
    }
  }
});
test('unscouted run direction uses both support sides without treating an RPO as solved', () => {
  const grade = name => assessConceptMatchups(null, name, ['p11'], 'base', 'balanced', 7).scenarios.find(s=>s.id==='run-choice').grade;
  assert.ok(grade('Cover 6') > grade('Cover 4 Drop'));
  assert.ok(grade('Cover 4 Quarters') < 66);
  assert.equal(assessConceptMatchups(null,'Cover 4 Quarters',['rpo']).scenarios.find(s=>s.id==='run-choice').grade,50);
});
test('personnel-only and RPO scout setups change leading recommendations at slider extremes', () => {
  for (const traits of [['p11'], ['p11','rpo']]) {
    const best = runPass => recommend({traits, familyId:'p11_gun',runPass}).formations.slice(0,3).map(f=>[f.name,f.recommendedCoverage]);
    assert.notDeepEqual(best(1),best(7));
  }
});


test('slider reweights a threat without changing its underlying coverage grade', () => {
  for (const name of ['Cover 4 Quarters', 'Cover 2', 'Cover 6', 'Cover 3 Sky', 'Cover 4 Drop']) {
    const grades = [];
    for (let runPass = 1; runPass <= 7; runPass++) {
      const assessment = assessConceptMatchups(null, name, ['quick_game'], 'base', 'balanced', runPass);
      grades.push(assessment.scenarios.find(s => s.id === 'run-choice').grade);
    }
    assert.equal(new Set(grades).size, 1, name);
  }
});
