import test from 'node:test';
import assert from 'node:assert/strict';
import {CHECK_SCHEMES,CHECK_MENUS,OFFENSIVE_LOOKS,getCheckOptions}from'../src/data/coverageChecks.js';
import{buildMatchMotion,getReleaseOptions,routePoint,defenderPoint}from'../src/engine/matchMotion.js';
const role=(scene,id)=>scene.roles.find(r=>r.id===id);
test('every documented check and release animates with finite, continuous positions',()=>{
 const seen=new Set();let combinations=0;
 for(const[scheme]of CHECK_SCHEMES)for(const look of OFFENSIVE_LOOKS)for(const check of getCheckOptions(scheme,look.id))for(const release of getReleaseOptions(look.id)){
  const scene=buildMatchMotion(scheme,check,look.id,release);seen.add(check);combinations++;assert(scene);assert.equal(new Set(scene.roles.map(r=>r.id)).size,scene.roles.length);
  for(const r of scene.roles){assert(r.before&&r.read&&r.after);if(r.target)assert(scene.routes.some(t=>t.id===r.target));for(let i=0;i<=100;i++){const p=defenderPoint(scene,r,i/100);assert(p.every(Number.isFinite));assert(p[0]>=0&&p[0]<=100&&p[1]>=0&&p[1]<=300);}assert.deepEqual(defenderPoint(scene,r,0),r.start);}
  for(const r of scene.routes){assert.deepEqual(routePoint(r,0),[r.x,r.y]);assert.deepEqual(routePoint(r,1),[r.endX,r.endY]);const a=routePoint(r,.399999),b=routePoint(r,.400001);assert(Math.hypot(a[0]-b[0],a[1]-b[1])<.01);}
 }
 assert.deepEqual([...seen].sort(),[...new Set(Object.values(CHECK_MENUS).flatMap(x=>Object.values(x).flat()))].sort());assert(combinations>400);
});
test('man Combo exchanges on crossing/out releases but Cover 3 Combo keeps front/rear structure',()=>{
 for(const pattern of ['cross','out']){const man=buildMatchMotion('cover1','combo','stack',pattern),three=buildMatchMotion('cover3','combo','stack',pattern);assert.equal(role(man,'corner').target,'2');assert.equal(role(man,'flat').target,'1');assert.equal(role(three,'corner').target,'1');assert.equal(role(three,'flat').target,'2');}
 const top=buildMatchMotion('cover1','topHat','stack','verticals');assert.equal(role(top,'corner').target,'2');assert.match(role(top,'corner').before,/Switched matchup/);
});
test('point stays locked while off-point roles exchange; safety brackets without occupying same spot',()=>{
 const s=buildMatchMotion('twoMan','pointTriangle','bunch','cross');assert.equal(role(s,'flat').target,'2');assert.match(role(s,'flat').before,/Lock #2/);assert.match(role(s,'corner').before,/Start outside/);assert.match(role(s,'hook').before,/Start inside/);assert.equal(role(s,'corner').target,'3');assert.equal(role(s,'hook').target,'1');assert.equal(role(s,'safety').mode,'bracket');const helper=role(s,'safety'),carrier=s.roles.find(r=>r.id!=='safety'&&r.target===helper.target);assert.notDeepEqual(defenderPoint(s,helper,1),defenderPoint(s,carrier,1));
});
test('Palms flat exchange, Stress condition, Solo Cut trigger and Meg lock differ from defaults',()=>{
 const palms=buildMatchMotion('palms','palms','stack','out');assert.equal(role(palms,'corner').target,'2');assert.equal(role(palms,'safety').target,'1');
 assert.equal(role(buildMatchMotion('quarters','stress','trips','verticals'),'corner').mode,'zone');assert.equal(role(buildMatchMotion('quarters','stress','trips','out'),'corner').target,'1');
 const cut=buildMatchMotion('quarters','soloCut','single','shortOne');assert.equal(role(cut,'backSafety').target,'X');assert.equal(role(cut,'backCorner').mode,'poach');assert.equal(role(buildMatchMotion('quarters','soloCut','single','verticals'),'backCorner').target,'X');
 assert.equal(role(buildMatchMotion('cover3','skinny','trips','isolatedShort'),'backCorner').target,undefined);assert.equal(role(buildMatchMotion('cover3','skinnyMeg','trips','isolatedShort'),'backCorner').target,'X');
});
test('zone checks retain areas and unsupported menus/reference concepts cannot produce a scene',()=>{
 const scene=buildMatchMotion('cover6','zoneIt','bunch','cross');assert(scene.roles.every(r=>r.mode==='zone'&&!r.target));assert.equal(buildMatchMotion('cover1','pointTriangle','bunch','cross'),null);assert.equal(buildMatchMotion('quarters','stump','trips','verticals'),null);assert.equal(buildMatchMotion('cover6','solo','single','verticals'),null);assert.equal(buildMatchMotion('cover1','lock','stack','threeOut'),null);
});

test('Cover 3 checks keep the safety in the middle rather than inheriting a quarters assignment',()=>{
 for(const look of OFFENSIVE_LOOKS)for(const check of getCheckOptions('cover3',look.id))for(const pattern of getReleaseOptions(look.id)){const scene=buildMatchMotion('cover3',check,look.id,pattern),safety=role(scene,'safety');assert.equal(safety.target,undefined);assert.deepEqual(safety.zone,[50,48]);}
});

test('compressed alignments move the matching defenders and keep isolated verticals straight',()=>{
 for(const [wide,tight] of [['trips','tripsTight'],['stack','stackTight']]){
  const a=buildMatchMotion('quarters','quarters',wide,'verticals'),b=buildMatchMotion('quarters','quarters',tight,'verticals');
  for(const id of ['1','2'])assert(b.routes.find(r=>r.id===id).x<a.routes.find(r=>r.id===id).x);
  for(const id of ['corner','flat'])assert(role(b,id).start[0]<role(a,id).start[0]);
 }
 const solo=buildMatchMotion('quarters','solo','singleTight','verticals'),x=solo.routes.find(r=>r.id==='X');assert.equal(x.x,x.endX);
 assert.deepEqual(getReleaseOptions('single'),['verticals','shortOne']);assert.deepEqual(getReleaseOptions('singleTight'),['verticals','shortOne']);
});
test('Cover 3 reads the actual seam release across presets and does not invent the #3 exchange',()=>{
 for(const look of OFFENSIVE_LOOKS)for(const check of getCheckOptions('cover3',look.id).filter(c=>['seam','skinny','skinnyMeg'].includes(c)))for(const pattern of getReleaseOptions(look.id)){
  const s=buildMatchMotion('cover3',check,look.id,pattern),two=s.routes.find(r=>r.id==='2');
  if(two.endY<=120||two.endX>two.x)assert.equal(role(s,'flat').target,'2',`${check}/${look.id}/${pattern}`);
  if(pattern==='threeOut'){assert.equal(role(s,'hook').target,undefined);assert(role(s,'hook').uncertain);}
 }
 assert(!buildMatchMotion('cover3','seam','spread','verticals').roles.some(r=>r.id==='backCorner'));
});
test('Palms crossing-release explanation matches its actual outside and remaining-deep reads',()=>{
 const s=buildMatchMotion('palms','palms','stack','cross');assert.equal(role(s,'corner').target,'2');assert.equal(role(s,'safety').target,undefined);assert(role(s,'safety').uncertain);assert.match(role(s,'safety').read,/#2 breaks outside/);
 const out=buildMatchMotion('palms','palms','stack','out');assert.equal(role(out,'safety').target,'1');
});
test('Stress uses the trips routes, and only converts the deep defenders to zone spacing',()=>{
 for(const release of ['verticals','isolatedShort']){
  const s=buildMatchMotion('quarters','stress','trips',release);assert.equal(role(s,'corner').mode,'zone');assert.equal(role(s,'safety').mode,'zone');assert.equal(role(s,'flat').mode,'read');assert.equal(role(s,'hook').mode,'read');
 }
 assert.notEqual(role(buildMatchMotion('quarters','stress','trips','threeOut'),'corner').mode,'zone');
});

test('Skate widening stays a space responsibility when #2 breaks outside',()=>{
 const s=buildMatchMotion('cover3','skate','bunch','out');
 for(const id of ['flat','hook']){assert.equal(role(s,id).mode,'zone');assert.equal(role(s,id).target,undefined);assert.deepEqual(defenderPoint(s,role(s,id),1),role(s,id).zone);}
});
