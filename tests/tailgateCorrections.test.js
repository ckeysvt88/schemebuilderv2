import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMatchMotion, defenderPoint } from '../src/engine/matchMotion.js';
import { getCheckOptions, getCheckDefault } from '../src/data/coverageChecks.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';

const role=(scene,id)=>scene.roles.find(r=>r.id===id);
test('PDF menus and defaults are preserved across tight and wide contexts',()=>{
  const expected={
    cover1:{stack:['lock','combo'],bunch:['lock','pointCombo']},
    twoMan:{stack:['lock','combo'],bunch:['lock','pointCombo']},
    cover3:{stack:['seam','zoneIt'],bunch:['skate','skinny','skinnyMeg','zoneIt'],trips:['skinny','skate','skinnyMeg','zoneIt']},
    quarters:{stack:['quarters','zoneIt'],bunch:['box','bingo','zoneIt'],trips:['quarters','stress','zoneIt'],single:['solo','soloCut','quarters']},
    palms:{stack:['palms','zoneIt'],bunch:['box','bingo','zoneIt'],trips:['stubbie','stump','zoneIt'],single:['solo','soloCut','quarters']},
    cover6:{stack:['quarters','palms','zoneIt'],bunch:['box','bingo','zoneIt'],trips:['stubbie','stump','zoneIt']},
  };
  for(const [scheme,looks] of Object.entries(expected))for(const look of ['stack','bunch','trips','single'])for(const suffix of ['','Tight']){
    assert.deepEqual(getCheckOptions(scheme,look+suffix),looks[look]||[],`${scheme}/${look+suffix}`);
    assert.equal(getCheckDefault(scheme,look+suffix),looks[look]?.[0]||null);
  }
});
test('Quarters carries the receiver finishing in the #3 lane rather than its original label',()=>{
  for(const look of ['trips','tripsTight'])for(const release of ['verticals','threeOut','threeIn','twoIn']){
    const scene=buildMatchMotion('quarters','quarters',look,release);
    assert.equal(role(scene,'hook').target,['threeOut','twoIn'].includes(release)?'2':'3');
    assert.equal(role(scene,'hook').mode,'carry');
    if(release==='twoIn'){assert.equal(role(scene,'flat').target,undefined);assert.equal(role(scene,'safety').target,'3');}
  }
});
test('Stump zones off only the scripted short #1 branches; Stubbie retains its lock',()=>{
  for(const scheme of ['palms','cover6'])for(const look of ['trips','tripsTight'])for(const release of ['shortOne','shortOut']){
    const stump=buildMatchMotion(scheme,'stump',look,release),stubbie=buildMatchMotion(scheme,'stubbie',look,release);
    for(const id of ['corner','flat']){assert.equal(role(stump,id).mode,'zone');assert.equal(role(stump,id).target,undefined);assert.deepEqual(defenderPoint(stump,role(stump,id),1),role(stump,id).zone);}
    assert.equal(role(stubbie,'corner').target,'1');
    assert.equal(role(buildMatchMotion(scheme,'stump',look,'verticals'),'corner').target,'1');
  }
});
test('Solo Cut returns to Solo on a vertical, while isolated Quarters keeps both roles home',()=>{
  for(const scheme of ['quarters','palms'])for(const look of ['single','singleTight']){
    const solo=buildMatchMotion(scheme,'solo',look,'verticals'),fallback=buildMatchMotion(scheme,'soloCut',look,'verticals');
    for(const id of ['backCorner','backSafety']){
      assert.equal(role(fallback,id).mode,role(solo,id).mode);
      assert.equal(role(fallback,id).target,role(solo,id).target);
      assert.deepEqual(defenderPoint(fallback,role(fallback,id),1),defenderPoint(solo,role(solo,id),1));
    }
    const home=buildMatchMotion(scheme,'quarters',look,'verticals');
    assert(home.roles.every(r=>r.mode!=='poach'));
    assert.equal(role(home,'backSafety').mode,'bracket');
    assert.notDeepEqual(defenderPoint(home,role(home,'backCorner'),1),defenderPoint(home,role(home,'backSafety'),1));
  }
});
test('Bingo does not double-assign an outside short #1 after locking it',()=>{
  const scene=buildMatchMotion('quarters','bingo','bunch','shortOut');
  assert.deepEqual(scene.roles.filter(r=>r.target==='1').map(r=>r.id),['corner']);
});
test('planning uses supported stack checks and real CB depth options',()=>{
  for(const [coverage,check] of [['Cover 3 Match','Seam'],['Cover 4 Quarters','Quarters'],['Cover 4 Palms','Palms'],['Cover 6','Quarters']]){
    const plan=buildAdjustmentPlan({recommendedCoverage:coverage},['stack_align','deep_shots']);
    const item=plan.tools.find(t=>t.setting==='Formation Check');
    assert(item,coverage);assert(item.value.endsWith(check),item.value);
    assert.doesNotMatch(JSON.stringify(plan),/Triangle|Top Hat|Stack — Combo/);
    for(const setting of plan.settings.filter(s=>s.setting==='Cornerback Depth'))assert(['Press','3 yards','5 yards','7 yards','9 yards','12 yards','20 yards'].includes(setting.value));
  }
});
