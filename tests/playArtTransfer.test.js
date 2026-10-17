import test from 'node:test';
import assert from 'node:assert/strict';
import { applyMacroToFormation, matchMacroPositions } from '../src/components/playArt/transfer.js';
import { PLAY_ART_FORMATIONS as formations } from '../src/components/playArt/catalog.js';
const clone = value => JSON.parse(JSON.stringify(value));
function base(formation='Nickel Over') {
  return {formation,template:'blank',view:'assignments',stunt:'none',
    a:Object.fromEntries(formations[formation].map(([id,x])=>[id,{job:'blank',area:x<50?'left':'right',shade:'default'}])),
    front:{technique:'default',attack:'default',contain:'none'},
    team:{cbDepth:'default',cbWidth:'default',sDepth:'default',sWidth:'default',lbShift:'default',show:'none'},
    zones:{flats:'default',curls:'default',hooks:'default'}};
}
test('transfer applies overrides to identical positions while keeping the target formation, play and untouched assignments',()=>{
  const baseline=base(),source=clone(baseline),target=base('Nickel Double Mug');
  source.a.SLB1={job:'spy',area:'left',shade:'default',custom:true};source.a.CB1={job:'half',area:'left',shade:'default',custom:true};
  target.a.SLB2.job='hook';target.view='alignment';
  const original=JSON.stringify({source,baseline,target});
  const result=applyMacroToFormation(source,baseline,target);
  assert.equal(result.state.formation,target.formation);assert.equal(result.state.template,target.template);assert.equal(result.state.view,target.view);
  assert.deepEqual(result.state.a.SLB1,source.a.SLB1);assert.deepEqual(result.state.a.SLB2,target.a.SLB2);
  assert.equal(JSON.stringify({source,baseline,target}),original);
  result.state.a.SLB1.job='rush';assert.equal(source.a.SLB1.job,'spy');
});
test('SLB adjustments never map to MIKE and group shifts do not modify unmatched linebackers',()=>{
  const baseline=base(),source=clone(baseline),target=base('3-4 Over');
  source.a.SLB1.job='spy';source.team.lbShift='left';source.team.show='lb';source.team.cbDepth='press';
  const result=applyMacroToFormation(source,baseline,target);
  assert.deepEqual(result.state.a.MIKE,target.a.MIKE);assert.equal(result.state.team.lbShift,'default');assert.equal(result.state.team.show,'none');
  assert.equal(result.state.team.cbDepth,'press');assert(result.skipped.some(s=>s.startsWith('SLB1')));
});
test('stock play assignments are not copied; explicit same-as-stock edits still transfer',()=>{
  const baseline=base(),target=base('Nickel Double Mug');baseline.template='sky';baseline.a.CB1.job='third';
  const source=clone(baseline);source.team.sWidth='pinch';
  assert.equal(applyMacroToFormation(source,baseline,target).state.a.CB1.job,'blank');
  source.a.CB1.custom=true;
  assert.equal(applyMacroToFormation(source,baseline,target).state.a.CB1.job,'third');
});
test('group drops skip unmatched recipients and preserve their current settings',()=>{
  const baseline=base(),source=clone(baseline),target=base('3-4 Over');
  source.zones.hooks='15';target.a.MIKE.job='hook';target.zones.hooks='5';
  const result=applyMacroToFormation(source,baseline,target);
  assert.equal(result.state.zones.hooks,'5');assert(result.skipped.some(s=>s.startsWith('hooks drops')));
});
test('compatible stunts carry stock rush dependencies; incompatible fronts skip the stunt',()=>{
  const baseline=base();for(const p of formations[baseline.formation])if(['dl','edge'].includes(p[3]))baseline.a[p[0]].job='standardRush';
  const source=clone(baseline);source.stunt='left_exit';
  const result=applyMacroToFormation(source,baseline,base('Nickel Double Mug'));
  assert.equal(result.state.stunt,'left_exit');assert(result.applied.includes('Rush plan'));
  assert.equal(applyMacroToFormation(source,baseline,base('3-4 Over')).state.stunt,'none');
});
test('contain never silently moves to a different edge position in a new formation',()=>{
  const baseline=base(),source=clone(baseline);source.front.contain='both';
  for(const p of formations[source.formation])if(['dl','edge'].includes(p[3]))source.a[p[0]].job='standardRush';
  const target=base('3-4 Over'),result=applyMacroToFormation(source,baseline,target);
  assert.equal(result.state.front.contain,'none');assert(result.skipped.some(s=>s.startsWith('Rush plan')));
});
test('every formation pair preserves unmatched players and never changes target identity',()=>{
  for(const sourceName of Object.keys(formations))for(const targetName of Object.keys(formations)) {
    const baseline=base(sourceName),source=clone(baseline),target=base(targetName);
    for(const a of Object.values(source.a)){a.job='rush';a.custom=true;}
    const result=applyMacroToFormation(source,baseline,target);
    assert.equal(result.state.formation,targetName);assert.deepEqual(Object.keys(result.state.a),Object.keys(target.a));
    for(const [id,,,group] of formations[targetName]) {
      const canonical=id=>({SLB:'SLB1',DT:'DT1',SLCB:'SLCB1'})[id]||id;
      const match=formations[sourceName].find(p=>p[0]===id&&p[3]===group)||formations[sourceName].find(p=>canonical(p[0])===canonical(id)&&p[3]===group);
      assert.deepEqual(result.state.a[id],match?source.a[match[0]]:target.a[id],sourceName+' → '+targetName+' '+id);
    }
  }
});

test('SLB and slot-corner aliases transfer in both directions without consuming second slots',()=>{
  for(const [from,to,pairs] of [
    ['Nickel Over','Dime Normal',[['SLB1','SLB'],['SLCB','SLCB1']]],
    ['Dime Normal','Nickel Over',[['SLB','SLB1'],['SLCB1','SLCB']]],
  ]) {
    const baseline=base(from),source=clone(baseline),target=base(to);
    for(const [id] of pairs)source.a[id]={job:'spy',area:'left',shade:'default',custom:true};
    const result=applyMacroToFormation(source,baseline,target);
    for(const [id,dest] of pairs){assert.deepEqual(result.state.a[dest],source.a[id]);assert(result.applied.includes(id+' → '+dest));}
    for(const id of ['SLB2','SLCB2'])if(target.a[id])assert.deepEqual(result.state.a[id],target.a[id]);
  }
});
test('DT aliases transfer assignments, zone drops and compatible stunt dependencies',()=>{
  for(const [from,to,sourceId,targetId] of [['Dime 3-2','Dime 2-3 Odd','DT','DT1'],['Dime 2-3 Odd','Dime 3-2','DT1','DT']]) {
    const baseline=base(from),source=clone(baseline),target=base(to);
    source.a[sourceId]={job:'hook',area:'left',shade:'default',custom:true};source.zones.hooks='10';
    const result=applyMacroToFormation(source,baseline,target);
    assert.deepEqual(result.state.a[targetId],source.a[sourceId]);assert.equal(result.state.zones.hooks,'10');
    for(const p of formations[from])if(['dl','edge'].includes(p[3]))baseline.a[p[0]].job='standardRush';
    const stunt=clone(baseline);stunt.stunt='left_exit';
    const transferred=applyMacroToFormation(stunt,baseline,target);
    assert.equal(transferred.state.stunt,'left_exit');assert.equal(transferred.state.a[targetId].job,'standardRush');
  }
});
test('matching prioritizes exact names and does not guess across roles or numbered slots',()=>{
  const p=(id,group='lb')=>[id,50,50,group];
  const from=[p('SLB'),p('SLB1'),p('SLB2'),p('MIKE')],to=[p('SLB1'),p('SLB2'),p('WILL')];
  const result=matchMacroPositions(from,to);
  assert.deepEqual([...result.sourceToTarget],[['SLB1','SLB1'],['SLB2','SLB2']]);
  assert.equal(matchMacroPositions([p('SLB')],[p('SLB2')]).sourceToTarget.size,0);
  assert.equal(matchMacroPositions([p('DT','dl')],[p('NT','dl')]).sourceToTarget.size,0);
  assert.equal(matchMacroPositions([p('SLCB','slot')],[p('CB1','cb')]).sourceToTarget.size,0);
});
