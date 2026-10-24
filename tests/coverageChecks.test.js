import test from 'node:test';
import assert from 'node:assert/strict';
import { CHECK_RULES,CHECK_SCHEMES,OFFENSIVE_LOOKS,CHECK_MENUS,RELEASE_PATTERNS,getCheckOptions,getCheckDefault,getCheckRule,receiverRoutes,checkResponsibilities,isCheckReleaseSupported } from '../src/data/coverageChecks.js';

test('check menus exclude unsupported pairings and separate reference-only concepts',()=>{
 assert.ok(!getCheckOptions('cover1','bunch').includes('pointTriangle'));
 assert.ok(!getCheckOptions('twoMan','bunch').includes('pointTriangle'));
 assert.deepEqual(getCheckOptions('cover3','single'),[]);
 assert.ok(CHECK_RULES.stump);
 assert.deepEqual(getCheckOptions('palms','trips'),['stubbie','stump','zoneIt']);
 assert.deepEqual(getCheckOptions('cover6','trips'),['stubbie','stump','zoneIt']);
 assert.ok(Object.values(CHECK_MENUS).every(looks=>Object.values(looks).every(ids=>!ids.some(id=>['triangle','pointTriangle','topHat'].includes(id)))));
});
test('every supported branch resolves to real receiver IDs or finite zone landmarks',()=>{
 for(const[scheme]of CHECK_SCHEMES)for(const look of OFFENSIVE_LOOKS)for(const check of getCheckOptions(scheme,look.id))for(const[pattern]of RELEASE_PATTERNS){
  assert.ok(CHECK_RULES[check]);const routes=receiverRoutes(look.id,pattern);const roles=checkResponsibilities(scheme,check,look.id,pattern);
  if(!isCheckReleaseSupported(check,look.id,pattern)){assert.equal(roles,null);continue;}
  for(const r of Object.values(roles)){assert.ok(r.text&&r.label);assert.ok(r.zone.every(Number.isFinite));if(r.target)assert.ok(routes.some(route=>route.id===r.target),`${scheme}/${look.id}/${check}/${pattern}: ${r.target}`);}
 }
});
test('Point Combo exchanges off-point crossers while point remains locked',()=>{
 const lock=checkResponsibilities('cover1','lock','bunch','cross'),combo=checkResponsibilities('cover1','pointCombo','bunch','cross');
 assert.equal(lock.corner.target,'1');assert.equal(combo.corner.target,'3');assert.equal(combo.hook.target,'1');assert.equal(combo.flat.target,'2');
});
test('route-conditioned checks do not force their special branch on other releases',()=>{
 assert.equal(checkResponsibilities('quarters','bingo','bunch','verticals').corner.target,'1');
 assert.equal(checkResponsibilities('quarters','bingo','bunch','cross').corner.target,undefined);
 assert.equal(checkResponsibilities('quarters','stress','trips','verticals').safety.target,undefined);
 assert.equal(checkResponsibilities('quarters','stress','trips','out').flat.target,'2');
 assert.equal(checkResponsibilities('quarters','soloCut','single','shortOne').backSafety.target,'X');
 assert.equal(checkResponsibilities('quarters','soloCut','single','verticals').backSafety.target,undefined);
 assert.equal(checkResponsibilities('palms','palms','spread','out').corner.target,'2');
 assert.equal(checkResponsibilities('palms','palms','spread','out').safety.target,'1');
});
test('Zone It never assigns a receiver, and Cover 6 retains the opposite half side',()=>{
 for(const[scheme]of CHECK_SCHEMES)for(const look of OFFENSIVE_LOOKS)if(getCheckOptions(scheme,look.id).includes('zoneIt'))for(const[pattern]of RELEASE_PATTERNS)assert.ok(Object.values(checkResponsibilities(scheme,'zoneIt',look.id,pattern)).every(r=>!r.target));
 for(const check of getCheckOptions('cover6','bunch'))assert.match(checkResponsibilities('cover6',check,'bunch','cross').backSafety.text,/Cover 2 side/);
});


test('defaults and Combo descriptions are specific to the documented menu context',()=>{
 assert.equal(getCheckDefault('cover1','bunch'),'lock');
 assert.equal(getCheckDefault('twoMan','bunchTight'),'lock');
 assert.equal(getCheckDefault('cover1','stack'),'lock');
 assert.equal(getCheckDefault('cover3','bunch'),'skate');
 assert.equal(getCheckDefault('quarters','spread'),null);
 assert.equal(getCheckRule('cover3','combo'),null);
 assert.match(getCheckRule('cover1','combo').read,/inside\/outside/);
 assert.deepEqual(getCheckOptions('cover3','stack'),['seam','zoneIt']);
 assert.deepEqual(getCheckOptions('cover3','trips'),['skinny','skate','skinnyMeg','zoneIt']);
 assert.deepEqual(getCheckOptions('quarters','stack'),['quarters','zoneIt']);
 assert.deepEqual(getCheckOptions('cover6','stack'),['quarters','palms','zoneIt']);
});
