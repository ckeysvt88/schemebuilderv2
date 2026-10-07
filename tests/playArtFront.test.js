import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAY_ART_FORMATIONS } from '../src/components/playArt/catalog.js';
import { containEdges, selectedContainIds, stuntRoutes } from '../src/components/playArt/front.js';

const keys=['left_exit','right_exit','left_tex','right_tex','left_tom','right_tom','left_pirate','right_pirate','left_tempe','right_tempe','elpaso','texas'];
test('Every complete front has distinct outside contain defenders and valid schematic stunt participants',()=>{
  for(const [name,players] of Object.entries(PLAY_ART_FORMATIONS)){
    const positions=Object.fromEntries(players.map(p=>[p[0],{x:26+3.38*p[1]}]));
    const edges=containEdges(players,positions);
    assert.notEqual(edges.left,edges.right,name);
    assert.equal(selectedContainIds(players,positions,'both').length,2,name);
    for(const id of Object.values(edges)){
      const p=players.find(p=>p[0]===id);assert(p[2]>=63,name);assert(['dl','edge','lb'].includes(p[3]),name);
    }
    const count=players.filter(p=>p[2]>=63&&['dl','edge'].includes(p[3])).length;
    for(const key of keys){
      const result=stuntRoutes(players,positions,390,key),need=/tempe|elpaso|texas/.test(key)?4:key.includes('pirate')?3:2;
      if(count<need){assert(result.reason);assert.equal(Object.keys(result.map).length,0);continue;}
      assert.equal(result.reason,'',name+' '+key);assert.equal(Object.keys(result.map).length,need,name+' '+key);
      for(const [id,path] of Object.entries(result.map)){
        assert(players.some(p=>p[0]===id&&['dl','edge'].includes(p[3])),name);
        assert(Number.isFinite(path.target));assert(path.target>=18&&path.target<=375);
      }
    }
  }
});
test('Five-player fronts retain the true far-right edge and avoid assigning a middle nose to both exchanges',()=>{
  const p=PLAY_ART_FORMATIONS['3-4 Tite'],positions=Object.fromEntries(p.map(x=>[x[0],{x:x[1]*4}]));
  const plan=stuntRoutes(p,positions,400,'texas');
  assert.deepEqual(Object.keys(plan.map).sort(),['REDG','DT1','DT2','LEDG'].sort());
  assert.equal(containEdges(p,positions).right,'LEDG');
});
