import test from 'node:test';
import assert from 'node:assert/strict';
import { CHECK_MENUS, checkResponsibilities } from '../src/data/coverageChecks.js';
import { assessConceptMatchups } from '../src/engine/conceptMatchup.js';
import { PLAYS } from '../src/data/plays.js';

// Independently transcribed screenshot choices, excluding Default (a menu
// entry, not an extra rule) and the app's explicitly labeled base teaching.
const confirmed = {
  cover1:{stack:'combo lock',bunch:'pointCombo lock'},
  twoMan:{stack:'combo lock',bunch:'pointCombo lock'},
  cover3:{stack:'seam zoneIt',bunch:'skate skinny skinnyMeg zoneIt',trips:'skate skinny skinnyMeg zoneIt'},
  quarters:{stack:'quarters zoneIt',bunch:'box bingo zoneIt',trips:'quarters stress zoneIt',single:'solo soloCut quarters'},
  palms:{stack:'palms zoneIt',bunch:'box bingo zoneIt',trips:'stubbie stump zoneIt',single:'solo soloCut quarters'},
  cover6:{stack:'palms quarters zoneIt',bunch:'box bingo zoneIt',trips:'stubbie stump zoneIt'},
};
test('all selectable checks exactly match owner screenshots, independent of article menus',()=>{
  assert.deepEqual(Object.keys(CHECK_MENUS).sort(),Object.keys(confirmed).sort());
  for(const [scheme,looks] of Object.entries(confirmed)){
    assert.deepEqual(Object.keys(CHECK_MENUS[scheme]).filter(k=>k!=='base').sort(),Object.keys(looks).sort());
    for(const [look,choices]of Object.entries(looks))assert.deepEqual([...CHECK_MENUS[scheme][look]].sort(),choices.split(' ').sort());
  }
});
test('flat releases alone cannot steal the Combo corner from vertical #1',()=>{
  for(const scheme of ['cover1','twoMan']){
    const stack=checkResponsibilities(scheme,'combo','stack','out');
    assert.equal(stack.corner.target,'1');assert.equal(stack.flat.target,'2');
    const bunch=checkResponsibilities(scheme,'pointCombo','bunch','threeOut');
    assert.equal(bunch.corner.target,'1');assert.equal(bunch.flat.target,'2');assert.equal(bunch.hook.target,'3');
    const exchange=checkResponsibilities(scheme,'pointCombo','bunch','shortOne');
    assert.equal(exchange.corner.target,'3');assert.equal(exchange.hook.target,'1');
  }
});
test('Stubbie safety owns vertical #3 when #2 breaks inside',()=>{
  for(const scheme of ['palms','cover6'])for(const check of ['stubbie','stump']){
    const roles=checkResponsibilities(scheme,check,'trips','twoIn');
    assert.equal(roles.safety.target,'3');assert.equal(roles.hook.target,'2');assert.equal(roles.flat.mode,'zone');
  }
});
test('Stress safety reads #3 after short #2 without duplicate hook carry',()=>{
  for(const release of ['out','twoIn']){
    const roles=checkResponsibilities('quarters','stress','trips',release);
    assert.equal(roles.safety.target,'3');assert.notEqual(roles.hook.target,'3');
  }
});
test('empty Box responsibility zones off; owner-confirmed three-vertical carries survive',()=>{
  for(const scheme of ['quarters','palms','cover6'])for(const check of ['box','bingo']){
    const roles=checkResponsibilities(scheme,check,'bunch','verticals');
    assert.equal(roles.flat.mode,'zone');assert.deepEqual([roles.corner.target,roles.safety.target,roles.hook.target],['1','2','3']);
  }
});
test('Skate corners retain thirds instead of permanent locks and hook is deeper than flat',()=>{
  const roles=checkResponsibilities('cover3','skate','bunch','verticals');
  for(const id of ['corner','backCorner','safety','flat','hook']){assert.equal(roles[id].mode,'zone');assert.equal(roles[id].target,undefined);}
  assert(roles.hook.zone[1]<roles.flat.zone[1]);
});
test('base short #1 has a pickup while deep defenders zone or match #2',()=>{
  for(const scheme of ['quarters','palms'])for(const release of ['shortOne','shortOut']){
    const roles=checkResponsibilities(scheme,scheme,'spread',release);
    assert.equal(roles.flat.target,'1');assert.equal(roles.corner.mode,'zone');assert.equal(roles.safety.target,'2');
  }
});
test('Palms base flat-trap credit cannot carry into bunch or trips scoring',()=>{
  const play=Object.values(PLAYS).flat().find(p=>p.n==='Cover 4 Palms');assert(play);
  const grade=traits=>assessConceptMatchups(play,play.n,traits).scenarios.find(s=>s.id==='quick').grade;
  assert(grade(['quick_game'])>grade(['quick_game','bunch']));
  assert.equal(grade(['quick_game','bunch']),grade(['quick_game','trips']));
  assert.equal(grade(['slant_heavy']),grade(['slant_heavy','trips']));
});
