import test from 'node:test';
import assert from 'node:assert/strict';
import { getCoverageRunSupport, getRunDirections } from '../src/engine/coverageRunSupport.js';
import { assessConceptMatchups, buildConceptScenarios } from '../src/engine/conceptMatchup.js';
import { getCoverageGuidance } from '../src/engine/coverageGuidance.js';
import { rankCoveragesForSituation } from '../src/engine/coverageRank.js';
import { groupScoutThreats } from '../src/engine/scoutThreats.js';
import { formationThreatCoverage } from '../src/engine/scoring.js';

const zone = { rush: 4, deep: 3, und: 4, man: 0, spy: 0, cont: 0, badge: 'ZONE', shell: 3 };
const grade = (call, threat) => assessConceptMatchups(zone, call, [threat]).scenarios[0].grade;

test('coverage support preserves the four approved run-fit structures', () => {
  for (const [name, inside, outside] of [
    ['Cover 4 Quarters', 2, 0], ['Cover 2', 0, 2], ['Cover 6', 1, 1], ['Cover 3 Sky', 1, 0],
  ]) {
    const support = getCoverageRunSupport(name);
    assert.equal(support.fitIn, inside);
    assert.equal(support.fitOut, outside);
  }
});

test('Quarters and Sky improve inside-run grading while Cover 2 improves outside-run grading', () => {
  assert.ok(grade('Cover 4 Quarters', 'inside_run') > grade('Cover 3 Sky', 'inside_run'));
  assert.ok(grade('Cover 3 Sky', 'inside_run') > grade('Cover 2', 'inside_run'));
  assert.ok(grade('Cover 2', 'outside_run') > grade('Cover 4 Quarters', 'outside_run'));
  assert.equal(grade('Cover 6', 'inside_run'), grade('Cover 6', 'outside_run'));
});

test('Drop and Cover 2 Man do not inherit Quarters or cloud-corner run support', () => {
  assert.equal(getCoverageRunSupport('Cover 4 Drop').fitIn, 0);
  assert.equal(getCoverageRunSupport('Cover 2 Man').fitOut, 0);
});

test('coaching identifies the supporting defensive backs and the Cover 6 side', () => {
  assert.match(getCoverageGuidance('Cover 4 Quarters', '', ['inside_run']).takesAway, /Both safeties/);
  const two = getCoverageGuidance('Cover 2', '', ['outside_run']);
  assert.match(two.takesAway, /corners.*outside/);
  assert.match(two.takesAway, /safeties.*deep/);
  const six = getCoverageGuidance('Cover 6', '', ['inside_run', 'outside_run']);
  assert.match(six.takesAway, /quarters-side safety/i);
  assert.match(six.takesAway, /Cover 2-side corner/);
  assert.match(six.offenseAnswer, /call side/);
  assert.match(getCoverageGuidance('Cover 3 Sky', '', ['inside_run']).takesAway, /rotated safety/);
});

test('stretch and counter affect the same run-support ordering as their direction', () => {
  assert.deepEqual(getRunDirections(['hb_stretch']), { inside: false, outside: true });
  assert.deepEqual(getRunDirections(['counter_trap']), { inside: true, outside: false });
  const formation = { coverages: [{ name: 'Cover 2', rating: 4 }, { name: 'Cover 4 Quarters', rating: 4 }] };
  assert.equal(rankCoveragesForSituation(formation, 'base', ['hb_stretch'])[0].name, 'Cover 2');
  assert.equal(rankCoveragesForSituation(formation, 'base', ['counter_trap'])[0].name, 'Cover 4 Quarters');
});

test('QB mobility never removes the RPO handoff', () => {
  for (const tag of ['mobile_qb', 'dual_threat', 'qb_scramble', 'option_run']) {
    assert.ok(buildConceptScenarios(['rpo', tag]).some(s => s.id === 'run-choice'));
  }
  assert.equal(buildConceptScenarios(['rpo', 'inside_run']).filter(s => s.id === 'run-choice').length, 0);
});

test('hard flats answer quick throws without claiming a complete RPO stop', () => {
  const quick = assessConceptMatchups(zone, 'Cover 2 Invert Hard Flat', ['quick_game']);
  const rpo = assessConceptMatchups(zone, 'Cover 2 Invert Hard Flat', ['rpo']);
  const conflict = rpo.scenarios.find(s => s.id === 'rpo');
  assert.ok(quick.scenarios[0].grade > conflict.grade);
  assert.ok(conflict.grade <= 50);
  assert.match(conflict.concession, /one defender/);
});

test('unknown RPO handoff direction does not automatically receive inside-run credit', () => {
  const rpo = assessConceptMatchups(zone, 'Cover 4 Quarters', ['rpo']);
  assert.equal(rpo.scenarios.find(s => s.id === 'run-choice').grade, 50);
  assert.equal(grade('Cover 4 Quarters', 'inside_run'), 66);
});

test('red zone is not automatically described as goal line', () => {
  assert.ok(buildConceptScenarios([], 'rz').every(s => !/goal line/i.test(s.label)));
});

test('overlapping QB and perimeter labels do not multiply formation demand', () => {
  const formation = { coreTags: ['p11', 'outside_run', 'mobile_qb'], suppTags: [] };
  const base = formationThreatCoverage(formation, ['p11', 'outside_run', 'mobile_qb']);
  const repeated = formationThreatCoverage(formation, ['p11', 'outside_run', 'hb_stretch', 'mobile_qb', 'dual_threat', 'qb_scramble']);
  assert.equal(base.demand, repeated.demand);
  assert.equal(base.value, repeated.value);
  assert.equal(groupScoutThreats(['rpo', 'screens', 'option_run', 'inside_run', 'counter_trap']).length, 5);
});
