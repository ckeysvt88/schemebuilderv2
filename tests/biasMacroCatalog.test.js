import { normalizeOpponentProfile, saveOpponentProfile } from '../src/data/opponentProfile.js';
import { normalizeCalibrationEntry, summarizeCalibrationEntries } from '../src/engine/calibrationLog.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { FDB } from '../src/data/formations.js';
import { PLAYS } from '../src/data/plays.js';
import { getPlayAssignmentEvidence } from '../src/data/playEvidence.js';
import { MACRO_LIBRARY, MACRO_CATS, matchMacros, normalizeMacroSelection, exportLoadout } from '../src/data/macros.js';
import { MACRO_COACHING } from '../src/data/macroCoaching.js';
import { normalizeRunPass, RUN_PASS_LABELS } from '../src/data/runPassBias.js';
import { buildMacroPlan, macroFormations, normalizeMacroContext } from '../src/engine/macroPlan.js';
import { buildConceptScenarios, assessConceptMatchups } from '../src/engine/conceptMatchup.js';
import { validPlayStructure } from '../src/engine/playMatchup.js';
import { recommend, buildRecommendationShareText } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';
import { assessPersonalChoice, assessCallRisk } from '../src/engine/personalizationSafety.js';
import { coverageSituation } from '../src/engine/context.js';
import { USER_POSITIONS, CALL_STYLES } from '../src/data/userProfile.js';
import { getCoverageRunSupport } from '../src/engine/coverageRunSupport.js';

const allTraits = [...new Set(Object.values(FDB).flatMap(f => [...f.coreTags, ...f.suppTags]))];
const books = ['All', ...new Set(Object.values(FDB).flatMap(f => f.books))];
const scenarios = [['base', ''], [3, 'short'], [3, 'long'], [4, 'long'], ['rz', '']];
const mixed = ['p11', 'inside_run', 'outside_run', 'quick_game', 'deep_shots'];
const macro = id => MACRO_LIBRARY.find(m => m.id === id);
const runMass = rows => rows.filter(s => ['inside-run','edge-run','qb-run','run-choice'].includes(s.id)).reduce((n,s) => n+s.normalizedWeight,0);

function checkResult(result) {
  for (const f of result.formations) {
    const sit = coverageSituation(result.context);
    assert.ok(PLAYS[f.name], f.name);
    assert.equal(f.sc, f.ledger.reduce((n, item) => n + item.delta, 0), f.name);
    assert.ok(Number.isFinite(f.sc) && f.sc > 0 && f.sc <= 100, f.name);
    const best = f.rankedCoverages.find(c => c.name === f.recommendedCoverage);
    const personal = f.callOptions.filter(c => c.isPlayerChoice);
    assert.equal(personal.length, 1, f.name);
    assert.equal(personal[0].name, f.personalizedCoverage);
    assert.ok(assessCallRisk(best, f.effectiveTraits, sit).eligible, f.name);
    assert.ok(assessPersonalChoice(personal[0], best, f.effectiveTraits, sit).eligible, f.name);
    for (const c of f.rankedCoverages) {
      const play = PLAYS[f.name].find(p => p.n === c.name);
      assert.ok(play && getPlayAssignmentEvidence(f.name, c.name, play), `${f.name}/${c.name}`);
      const weights = c.matchup.concept?.scenarios;
      if (weights?.length) assert.ok(Math.abs(weights.reduce((n,s) => n+s.normalizedWeight,0)-1) < 1e-9);
    }
  }
}

test('all seven bias values normalize; malformed input cannot poison recommendations or export labels', () => {
  for (let i=1;i<=7;i++) assert.equal(normalizeRunPass(String(i)), i);
  for (const value of [null,undefined,[],{},true,0,8,1.2,'bad','4.5',Infinity]) {
    assert.equal(normalizeRunPass(value),4);
    assert.deepEqual(recommend({traits:mixed,runPass:value}), recommend({traits:mixed,runPass:4}));
  }
});

test('bias shifts run/pass threat weight monotonically without inventing a run direction or erasing RPO', () => {
  for (const sit of ['base','3sh','3lg','rz']) {
    let last = -1;
    for (let bias=1;bias<=7;bias++) {
      const rows=buildConceptScenarios([...mixed,'rpo','option_run'],sit,'balanced',bias);
      const mass=runMass(rows);
      assert.ok(mass > last, `${sit}/${bias}`); last=mass;
      assert.equal(rows.find(s=>s.id==='rpo').tendencyMultiplier,1);
      assert.ok(rows.every(s=>s.normalizedWeight>0));
    }
  }
  for (const bias of [1,7]) {
    const rows=buildConceptScenarios(['p11'],'base','balanced',bias);
    assert.deepEqual(rows.map(s=>s.id).sort(),['pass-choice','run-choice']);
    assert.ok(rows.every(s=>s.source==='tendency'));
  }
});

test('all 1,245 validated plays receive bias-aware matchup evaluation without changing their counts', () => {
  const before = JSON.stringify(PLAYS);
  let count=0; const seen=new Set();
  for (const [formation,plays] of Object.entries(PLAYS)) for (const play of plays) {
    count++; seen.add(formation);
    assert.ok(validPlayStructure(play),`${formation}/${play.n}`);
    assert.ok(getPlayAssignmentEvidence(formation,play.n,play));
    let last=-1;
    for(let bias=1;bias<=7;bias++) {
      const assessment=assessConceptMatchups(play,play.n,mixed,'base','balanced',bias);
      assert.ok(assessment.utility>=0 && assessment.utility<=100);
      const mass=runMass(assessment.scenarios); assert.ok(mass>last); last=mass;
    }
    const fit=getCoverageRunSupport(play.n);
    assert.ok(fit.fitIn>=0 && fit.fitOut>=0);
  }
  assert.equal(count,1245);assert.equal(seen.size,71);
  assert.equal(JSON.stringify(PLAYS),before);
});

test('every playbook, bias level, and situation obeys catalog and personal-choice safety', () => {
  const seen=new Set();
  for(const book of books) for(let runPass=1;runPass<=7;runPass++) for(const [down,distance] of scenarios) {
    const result=recommend({traits:allTraits,book,runPass,down,distance});
    checkResult(result);
    for(const f of result.formations) {
      assert.ok(book==='All'||f.books.includes(book)||f.books.includes('All'));
      seen.add(f.name);
    }
  }
  // Goal-line zero calls are intentionally not endorsed against an all-threat
  // profile containing deep shots. They must remain usable in true run contexts.
  for(const name of Object.keys(FDB)) {
    const result=recommend({traits:FDB[name].coreTags.filter(t=>!['deep_shots','seam_routes'].includes(t)),down:3,distance:1});
    checkResult(result); for(const f of result.formations)seen.add(f.name);
  }
  assert.deepEqual(Object.keys(FDB).filter(n=>!seen.has(n)),['Prevent 3-Deep']);
});

test('all user styles and objectives retain safety across the full recommendation catalog', () => {
  for(const position of USER_POSITIONS) for(const style of CALL_STYLES) for(const gameObjective of ['balanced','get_stop','no_quick_td']) for(const [down,distance] of scenarios) {
    checkResult(recommend({traits:allTraits,runPass:7,down,distance,gameObjective,userProfile:{position:position.id,callStyle:style.id}}));
  }
});

test('bias changes individual calls across fronts, including a hybrid formation', () => {
  const pass=recommend({traits:mixed,runPass:1}); const run=recommend({traits:mixed,runPass:7});
  for(const name of ['3-4 Tite','3-4 Over','Nickel Load Dbl Mug']) {
    const p=pass.formations.find(f=>f.name===name); const r=run.formations.find(f=>f.name===name);
    assert.ok(p && r,name); assert.notEqual(p.recommendedCoverage,r.recommendedCoverage,name);
  }
  assert.ok(run.formations.some(f=>FDB[f.name].priority==='hybrid' && f.rankedCoverages.some(c=>pass.formations.find(p=>p.name===f.name)?.rankedCoverages.find(p=>p.name===c.name)?.sc!==c.sc)));
  for(const runPass of [1,4,7]) {
    const input={traits:mixed,runPass};const live=recommend(input);const pdf=buildCallSheetData({input});
    assert.equal(pdf.runPassLabel,RUN_PASS_LABELS[runPass]);
    assert.ok(buildRecommendationShareText(live).includes(RUN_PASS_LABELS[runPass]));
    assert.deepEqual(pdf.topFormations.map(f=>[f.name,f.coverage,f.sc]),live.formations.slice(0,4).map(f=>[f.name,f.personalizedCoverage,f.sc]));
  }
});

test('macro search handles negation, multiple problems, repeated words, and corrupted input', () => {
  for(const input of [null,{},[],42,'no screens','he never runs','he doesn’t run','he can’t run']) assert.deepEqual(matchMacros(input),[]);
  for(const [query,id] of [['read option','option_read'],['no huddle','tempo'],['qb scramble','scramble_drill'],['not screens but deep shots','deep_shots'],['can’t stop screens','screens']]) assert.equal(matchMacros(query)[0]?.m.id,id,query);
  const mixed=matchMacros('bunch and mesh').map(x=>x.m.id);
  assert.ok(mixed.includes('bunch_rubs')&&mixed.includes('mesh_crossers'));
  assert.deepEqual(matchMacros('mesh mesh mesh').map(x=>x.m.id),matchMacros('mesh').map(x=>x.m.id));
});

test('all 56 macros are browsable and saved IDs recover safely without duplicates or phantom slots', () => {
  assert.equal(MACRO_LIBRARY.length,56);
  assert.equal(new Set(MACRO_LIBRARY.map(m=>m.id)).size,56);
  assert.deepEqual(Object.keys(MACRO_COACHING).sort(),MACRO_LIBRARY.map(m=>m.id).sort());
  assert.ok(MACRO_LIBRARY.every(m=>MACRO_CATS.includes(m.cat)));
  for(const input of [null,{},'wrong']) assert.deepEqual(normalizeMacroSelection(input),[]);
  assert.deepEqual(normalizeMacroSelection(['inside_power','inside_power','missing',null]),['inside_power']);
  assert.equal(normalizeMacroSelection(MACRO_LIBRARY.map(m=>m.id)).length,10);
});

test('every macro checks every exact catalog play across four situations; none rewrites base assignments', () => {
  const before=JSON.stringify(PLAYS);let evaluated=0;
  for(const [formation,plays] of Object.entries(PLAYS)) for(const play of plays) for(const m of MACRO_LIBRARY) for(const situation of ['base','short','long','rz']) {
    const plan=buildMacroPlan(m,{formation,call:play.n,situation}); evaluated++;
    assert.ok(plan,`${formation}/${play.n}/${m.id}`);
    assert.equal(plan.context.call,play.n);
    assert.ok(plan.goal&&plan.user&&plan.risk);
    assert.equal(new Set(plan.settings.map(s=>s.setting)).size,plan.settings.length);
    assert.ok(plan.settings.length<=3);
    assert.ok(!JSON.stringify(plan).match(/Smart Zone|Soft Squat|Look For Work|auto.fir|9th fitter/i));
    if(situation==='long') {
      assert.ok(!plan.settings.some(s=>s.value==='Underneath'));
      if(plan.ready)assert.ok(play.deep>=2);
    }
    if(['deep','deepInside','playAction'].includes(plan.profile)&&play.deep<2)assert.equal(plan.ready,false);
    if(plan.ready)assert.ok(plan.compatible&&plan.settings.length);
  }
  assert.equal(evaluated,278880);
  assert.equal(JSON.stringify(PLAYS),before);
});

test('macro formation context respects every book; changing the book cannot retain an unavailable call', () => {
  for(const book of books) {
    const expected=Object.keys(PLAYS).filter(n=>book==='All'||FDB[n].books.includes(book)||FDB[n].books.includes('All')).sort();
    assert.deepEqual(macroFormations(book),expected);
    for(const name of expected)assert.equal(normalizeMacroContext({formation:name,call:PLAYS[name][0].n},book).call,PLAYS[name][0].n);
  }
  assert.equal(normalizeMacroContext({formation:'not real',call:'Cover 3 Sky'}).formation,'');
  assert.equal(normalizeMacroContext({formation:'3-4 Tite',call:'Cover 3 Sky'},'4-3').call,'');
  assert.equal(buildMacroPlan(macro('inside_power'),{}).ready,false);
});

test('loadout export exactly matches the displayed settings and separates coaching notes from active slots', () => {
  const context={formation:'3-4 Tite',call:'Cover 3 Sky',situation:'base'};
  const selected=['inside_power','tempo','screens'].map(macro);
  const exported=exportLoadout(selected,context);
  assert.match(exported,/2\/10 active/);
  assert.match(exported,/COACHING NOTE — .*no active slot/);
  for(const m of selected) {
    const plan=buildMacroPlan(m,context);assert.ok(exported.includes(plan.goal));
    for(const s of plan.settings)assert.ok(exported.includes(`SAVE: ${s.setting}: ${s.value}`));
  }
  assert.doesNotMatch(exported,/launch.week bug|Soft Squat|9th fitter/);
  assert.match(exportLoadout(selected,{}),/0\/10 active/);
  assert.match(exportLoadout(null,context),/0\/10 active/);
});


test('Single Mug uses the exact validated abbreviated labels, with coverage coaching preserved', () => {
  const f = FDB['Nickel 3-3 Single Mug'];
  assert.ok(f.coverages.every(c=>PLAYS['Nickel 3-3 Single Mug'].some(p=>p.n===c.name)));
  const result = recommend({traits:['p11','quick_game','crossers']});
  const calls=result.formations.find(f=>f.name==='Nickel 3-3 Single Mug').rankedCoverages;
  for(const name of ['Blitz Tex 3 Sim 3','Cov 3 Buzz Match Wk','Cov 2 Invert Hard Flat'])assert.ok(calls.some(c=>c.name===name),name);
});


test('opponent profile round trips preserve bias; legacy saves reset stale bias to balanced', () => {
  const traits = {runStyle:['inside_run'], personnel:['p11']};
  for(let bias=1;bias<=7;bias++) {
    const saved=saveOpponentProfile(traits,bias);
    assert.deepEqual(normalizeOpponentProfile(JSON.parse(JSON.stringify(saved))),saved);
    assert.equal(saved.runPass,bias);assert.deepEqual(saved.traits,traits);
  }
  assert.equal(normalizeOpponentProfile(traits).runPass,4);
  assert.deepEqual(normalizeOpponentProfile({traits:{runStyle:['bad','inside_run','inside_run']},runPass:90}),{schemaVersion:2,traits:{runStyle:['inside_run']},runPass:4});
});

test('call-test history separates run/pass settings and keeps legacy unknown distinct from balanced', () => {
  const base={defensiveFormation:'3-4 Tite',defensiveCall:'Cover 3 Sky',result:'stop'};
  assert.equal(normalizeCalibrationEntry(base).runPass,null);
  const entries=[base,{...base,runPass:1},{...base,runPass:4},{...base,runPass:7}];
  const summary=summarizeCalibrationEntries(entries);
  assert.equal(summary.length,4);
  assert.ok(summary.some(s=>s.context.includes('Very run-heavy')));
});
