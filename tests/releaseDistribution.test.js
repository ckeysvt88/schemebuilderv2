import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMatchMotion,defenderPoint} from '../src/engine/matchMotion.js';
const target=(scene,id)=>scene.roles.find(r=>r.id===id)?.target;

test('confirmed RB-flat/drag exchange follows destinations across the applicable checks',()=>{
  const cases=[['cover3','skinny'],['cover3','skinnyMeg'],['quarters','quarters'],['quarters','stress'],['palms','stubbie'],['palms','stump'],['cover6','stubbie'],['cover6','stump']];
  for(const [scheme,check]of cases)for(const look of ['trips','tripsTight']){
    const scene=buildMatchMotion(scheme,check,look,'rbFlatDrag');
    assert.equal(target(scene,'corner'),'1');
    assert.equal(target(scene,'flat'),'3',`${scheme}/${check} flat takes RB`);
    assert.equal(target(scene,'hook'),'2',`${scheme}/${check} hook takes drag`);
    assert.equal(scene.routes.find(r=>r.id==='3').position,'RB');
    assert(scene.routes.find(r=>r.id==='3').y>242);
    const hook=scene.roles.find(r=>r.id==='hook');
    assert.match(hook.after,/Original #2.*#3 release/);
    assert.equal(hook.mode,'carry');assert.equal(hook.uncertain,false);
    assert.notDeepEqual(defenderPoint(scene,hook,1),hook.zone);
  }
});
test('Skinny takes the short inside release; exchanging routes is not unique to the RB preset',()=>{
  for(const look of ['bunch','bunchTight','trips','tripsTight'])for(const check of ['skinny','skinnyMeg']){
    for(const [release,corner,flat,hook]of [['verticals','1','2','3'],['threeIn','1','2','3'],['twoIn','1','3','2'],['threeOut','1','3','2'],['cross','2','3','1']]){
      const scene=buildMatchMotion('cover3',check,look,release);
      assert.deepEqual(['corner','flat','hook'].map(id=>target(scene,id)),[corner,flat,hook],`${look}/${check}/${release}`);
      assert.equal(new Set(scene.roles.filter(r=>r.target).map(r=>r.target)).size,scene.roles.filter(r=>r.target).length);
    }
  }
});
test('Box all-verticals uses C1 S2 H3, and the flat/drag exchange also works in bunch',()=>{
  for(const scheme of ['quarters','palms','cover6'])for(const look of ['bunch','bunchTight'])for(const check of ['box','bingo']){
    const vertical=buildMatchMotion(scheme,check,look,'verticals');
    assert.deepEqual(['corner','safety','hook'].map(id=>target(vertical,id)),['1','2','3']);
    const exchange=buildMatchMotion(scheme,check,look,'rbFlatDrag');
    assert.deepEqual(['corner','flat','hook'].map(id=>target(exchange,id)),['1','3','2']);
  }
});
test('Stump non-trigger assignments match Stubbie, and fixed locks survive release redistribution',()=>{
  for(const scheme of ['palms','cover6'])for(const release of ['verticals','threeIn','rbFlatDrag']){
    const stump=buildMatchMotion(scheme,'stump','trips',release),stubbie=buildMatchMotion(scheme,'stubbie','trips',release);
    assert.deepEqual(stump.roles.map(r=>[r.id,r.mode,r.target]),stubbie.roles.map(r=>[r.id,r.mode,r.target]));
  }
  for(const scheme of ['cover1','twoMan']){
    const lock=buildMatchMotion(scheme,'lock','bunch','rbFlatDrag');
    assert.deepEqual(['corner','flat','hook'].map(id=>target(lock,id)),['1','2','3']);
    const point=buildMatchMotion(scheme,'pointCombo','bunch','rbFlatDrag');
    assert.equal(target(point,'flat'),'2');
  }
  const stubbie=buildMatchMotion('palms','stubbie','trips','cross');
  assert.equal(target(stubbie,'corner'),'1');
  const meg=buildMatchMotion('cover3','skinnyMeg','trips','isolatedShort');assert.equal(target(meg,'backCorner'),'X');
  const zone=buildMatchMotion('quarters','zoneIt','trips','rbFlatDrag');assert(zone.roles.every(r=>!r.target&&r.mode==='zone'));
});
