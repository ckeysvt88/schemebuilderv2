import test from 'node:test';
import assert from 'node:assert/strict';
import { MACRO_LIBRARY, exportLoadout } from '../src/data/macros.js';
import { MACRO_RECIPES } from '../src/data/macroRecipes.js';
import { buildMacroPlan } from '../src/engine/macroPlan.js';
import { PLAYS } from '../src/data/plays.js';
const recipe = id => buildMacroPlan({id});

test('all 56 problems give usable instructions without hidden formation state', () => {
  assert.deepEqual(Object.keys(MACRO_RECIPES).sort(), MACRO_LIBRARY.map(m=>m.id).sort());
  const controls = new Set();
  for (const m of MACRO_LIBRARY) {
    const p = buildMacroPlan(m);
    assert.ok(p.ready && p.settings.length && p.use, m.id);
    assert.equal(p.mode, 'problem-recipe');
    assert.ok(p.settings.length <= 3);
    assert.equal(new Set(p.settings.map(s=>s.setting)).size, p.settings.length);
    for (const s of p.settings) {
      assert.ok(s.why && s.risk && s.value);
      controls.add(s.setting);
      if (['man','shortZone','layered'].includes(s.scope)) assert.ok(s.when);
    }
    for (const a of p.atLine) assert.ok(a.why && a.when);
    assert.doesNotMatch(JSON.stringify(p), /Smart Zone|Look For Work|Choose a formation|No saved adjustment/);
    assert.notEqual([...p.settings, ...p.atLine].map(s=>`${s.setting}:${s.value}`).join('|'), 'Gap Integrity:Conservative', m.id);
    assert.ok(exportLoadout([m]).includes(p.use));
  }
  assert.ok(controls.size >= 18, `Only ${controls.size} controls used`);
});

test('different run and pass problems produce different practical adjustments', () => {
  const value = (id, name) => recipe(id).settings.find(s=>s.setting===name)?.value;
  assert.equal(value('inside_power','DL Alignment'),'Pinch');
  assert.equal(value('outside_zone','DL Alignment'),'Spread');
  assert.equal(value('counter_trap','Defensive Aggression'),'Conservative');
  assert.equal(value('qb_sneak_short','Defensive Aggression'),'Aggressive');
  assert.equal(value('option_read','Option Read Key'),'Conservative');
  assert.equal(value('speed_option','Option Pitch Key'),'Aggressive');
  assert.equal(value('rpo_glance','RPO Pass Key'),'Conservative');
  assert.equal(value('rpo_glance','Coverage Leverage'),'Inside');
  assert.equal(value('rpo_bubble','Zone Drops — Flats'),'5 yards');
  assert.equal(value('flood_trips','Zone Drops — Flats'),'25 yards');
  assert.equal(value('flood_trips','Zone Drops — Curl Flats'),'5 yards');
  assert.ok(recipe('flood_trips').atLine.some(a=>a.value.includes('Curl Flat')));
  assert.equal(value('bunch_rubs','Man Bunch Check'),'Point Combo');
  assert.equal(value('stack_release','Man Stack Check'),'Combo');
  assert.equal(value('scramble_drill','QB Contain'),'Both');
  assert.ok(recipe('scramble_drill').atLine.some(a=>a.value==='QB Spy'));
  assert.ok(recipe('alpha_wr').atLine.some(a=>a.setting==='Double Team'));
  assert.ok(recipe('pocket_surgeon').atLine[0].when.includes('four rushing defensive linemen'));
});

test('optional exact-call checks enforce compatibility across all formations', () => {
  const original = JSON.stringify(PLAYS);
  for (const [formation, plays] of Object.entries(PLAYS)) for (const p of plays) {
    const context={formation,call:p.n};
    const bunch=buildMacroPlan({id:'bunch_rubs'}, context);
    if (bunch.ready) assert.ok(p.man>=4);
    const contain=buildMacroPlan({id:'scramble_drill'},context);
    if(contain.ready) assert.ok(p.rush>=2);
    const quick=buildMacroPlan({id:'quick_game'},context);
    if(quick.ready) assert.ok(p.man===0 && p.deep>=2 && p.und>0 && p.badge!=='MATCH');
    assert.equal(buildMacroPlan({id:'quick_game'},{...context,situation:'long'}).ready,false);
    const flood=buildMacroPlan({id:'flood_trips'},context);
    if(flood.ready) assert.ok(p.deep>=2 && p.und>=4 && p.man===0 && p.badge!=='MATCH');
  }
  assert.equal(JSON.stringify(PLAYS),original);
  assert.equal(buildMacroPlan({id:'deep_shots'},{formation:'missing',call:'bad'}).ready,false);
  assert.equal(buildMacroPlan({id:'not-a-problem'}),null);
});

test('recipe results cannot mutate later recommendations', () => {
  const p=recipe('inside_power');p.settings[0].value='bad';p.atLine.push({setting:'bad'});
  assert.equal(recipe('inside_power').settings[0].value,'Pinch');
  assert.equal(recipe('inside_power').atLine.length,0);
});
