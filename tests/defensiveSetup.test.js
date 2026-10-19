import test from 'node:test';
import assert from 'node:assert/strict';
import {assessAuthoredSetup,authoredSetup,summarizeResponsibilities} from '../src/engine/defensiveSetup.js';
import {assessAdjustmentMatchup} from '../src/engine/adjustmentMatchup.js';
import {buildMatchMotion} from '../src/engine/matchMotion.js';

test('starting safeties are independent of post-snap zones; unsupported looks stay unknown',()=>{
 const q=assessAuthoredSetup('Nickel Over','Cover 4 Quarters'),t=assessAuthoredSetup('Nickel Over','Tampa 2');
 assert.equal(q.preSnap.highSafeties,2);assert.equal(q.responsibilities.deep,4);
 assert.equal(t.preSnap.highSafeties,2);assert.equal(t.responsibilities.deep,2);
 assert.equal(q.preSnap.signature,t.preSnap.signature);
 assert.equal(assessAuthoredSetup('3-3-5 Stack','Cover 3').preSnap.highSafeties,1);
 assert.equal(assessAuthoredSetup('Nickel Over','Cover 1 Robber Press'),null);
 assert.equal(assessAuthoredSetup('Nickel Over','Cover 4 Quarters',[{setting:'Safety Depth',value:'16 yards'}]).preSnap,null);
});
test('shared setup checks retain man labels without inventing receiver targets',()=>{
 const a=authoredSetup('Nickel Over','Cover 3 Sky').a;a.SLB1={job:'man'};
 const s=summarizeResponsibilities(a);assert.equal(s.man,1);assert.equal(s.underneath,3);assert.equal(Object.values(s).reduce((a,b)=>a+b),11);assert.equal(a.SLB1.target,undefined);
});
test('pressure evaluator and drawing share contain/stunt conflicts',()=>{
 const base=[{setting:'Pass Rush',value:'QB Contain'}];
 assert.equal(assessAuthoredSetup('Nickel Over','Cover 3 Sky',[...base,{setting:'Stunt',value:'texas'}]).rush.containReady,false);
 assert.equal(assessAuthoredSetup('Nickel Over','Cover 3 Sky',[...base,{setting:'Stunt',value:'left_tom'}]).rush.containReady,true);
});
test('shading gains have a deep tradeoff and do not stack with zone strategy',()=>{
 const p={man:0,und:4,deep:3,rush:4},plan={settings:[{setting:'Coverage Shading',value:'Underneath'}]};
 const evalFor=id=>assessAdjustmentMatchup(p,'Cover 3 Sky',{scenarios:[{id,normalizedWeight:1}]},plan);
 assert(evalFor('crossers').delta>0);assert(evalFor('vertical').delta<0);
 plan.settings.push({setting:'Zone Strategy',value:'Aggressive'});assert.equal(evalFor('crossers').delta,0);
});
test('Box declares the clear bunch-flat matches; Zone It keeps every role receiver-neutral',()=>{
 const s=buildMatchMotion('quarters','box','bunchTight','out');assert(s);
 assert.equal(s.roles.find(r=>r.id==='corner').target,'1');assert.equal(s.roles.find(r=>r.id==='flat').target,'2');assert.equal(s.roles.find(r=>r.id==='safety').target,'3');
 const z=buildMatchMotion('quarters','zoneIt','bunchTight','out');assert(z.roles.every(r=>r.mode==='zone'&&!r.target&&!r.readTargets));
});
