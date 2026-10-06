import test from 'node:test';
import assert from 'node:assert/strict';
import { ALIGN } from '../src/data/alignments.js';
import { PLAY_ART_FORMATIONS, FORMATION_FAMILIES, familyOf, canCustomizeFormation, positionGroup, formationDepth, shiftLinebacker, blitzTargetX, blitzEndpoint } from '../src/components/playArt/catalog.js';

test('Every complete formation is available with all 11 original positions and coordinates', () => {
  assert.equal(Object.keys(PLAY_ART_FORMATIONS).length,71);
  for(const [name,players] of Object.entries(PLAY_ART_FORMATIONS)){
    assert(canCustomizeFormation(name));assert(FORMATION_FAMILIES.includes(familyOf(name)));
    assert.equal(players.length,11);assert.deepEqual(players.map(p=>p.slice(0,3)),ALIGN[name]);
    for(const [id,,,group] of players)assert.equal(group,positionGroup(id));
  }
  assert.equal(canCustomizeFormation('Prevent 3-Deep'),false);
  assert.equal(canCustomizeFormation('Not a formation'),false);
});

test('Linebacker shifts preserve side relationships and move toward or away from the center',()=>{
  for(const x of [20,35,50,65,80]){
    assert(shiftLinebacker(x,'left')<x);assert(shiftLinebacker(x,'right')>x);
    assert(Math.abs(shiftLinebacker(x,'pinch')-50)<=Math.abs(x-50));
    assert(Math.abs(shiftLinebacker(x,'spread')-50)>=Math.abs(x-50));
    assert.equal(shiftLinebacker(x),x);
  }
  assert.equal(formationDepth(66),0);assert(formationDepth(15)>formationDepth(45));
});

test('Default blitz lanes aim toward the QB except straight linebacker lanes',()=>{
  for(const width of [320,390,720])for(const x of [40,width/2,width-40]){
    assert.equal(blitzTargetX('lb',x,width),x);
    for(const group of ['s','cb','slot','edge','dl'])assert.equal(blitzTargetX(group,x,width),width/2);
  }
  for(const id of ['MIKE1','MIKE2','SLB','SLB2'])assert.equal(positionGroup(id),'lb');
  for(const id of ['RE','LE','RRE','REDG'])assert.equal(positionGroup(id),'edge');
});

test('Backfield blitz arrows stop before the line and DL Rush stays short and straight',()=>{
  for(const width of [320,390,720])for(const group of ['cb','slot','s','lb']){
    for(const x of [40,width/2,width-40])for(const y of [160,250,298]){
      const end=blitzEndpoint(group,x,y,width,300);
      assert(end.y<300);
      if(group==='lb')assert.equal(end.x,x);
      else assert(Math.abs(end.x-width/2)<=Math.abs(x-width/2));
    }
  }
  for(const group of ['dl','edge'])assert.deepEqual(blitzEndpoint(group,80,300,390,300,true),{x:80,y:328});
});
