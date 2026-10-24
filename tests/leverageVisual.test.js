import test from 'node:test';
import assert from 'node:assert/strict';
import {leverageLobes,leverageSVG} from '../src/engine/leverageVisual.js';
test('inside/outside mirror by side; overtop is always deeper',()=>{for(const x of [40,160]){const ls=leverageLobes({x,y:100,center:100,horizontal:'inside',vertical:'overtop'});assert.ok(Math.abs(ls[0].x-100)<Math.abs(x-100));assert.ok(ls[2].y<100);assert.ok(ls[3].y>100);}});
test('neutral and centered horizontal overlays do not invent leverage',()=>{assert.equal(leverageLobes({x:100,y:100,center:100,horizontal:'inside'}).length,0);assert.equal(leverageLobes({x:40,y:100,center:100}).length,0);});
test('gradients fade to zero, no blocks/strokes; invalid geometry rejected',()=>{const svg=leverageSVG('test',{x:40,y:60,center:100,horizontal:'outside'});assert.match(svg,/stop-opacity="0"/);assert.equal((svg.match(/<ellipse/g)||[]).length,2);assert.doesNotMatch(svg,/<rect|stroke=/);assert.equal(leverageSVG('test',{x:NaN,y:0,center:10}),'');});

test('team choice always resolves to at most one axis',async()=>{const {leverageAxes}=await import('../src/engine/leverageVisual.js');for(const choice of ['default','inside','outside','underneath','overtop']){const axes=leverageAxes(choice);assert.ok([axes.horizontal,axes.vertical].filter(x=>x!=='default').length<=1);}});

test('zone overlay follows actual landmark and ellipse dimensions, not starting alignment',async()=>{
 const {zoneLeverageSVG}=await import('../src/engine/leverageVisual.js');
 const zone={x:160,y:70,rx:60,ry:24};
 for(const choice of ['inside','outside','overtop','underneath']){
  const {leverageAxes}=await import('../src/engine/leverageVisual.js');
  const svg=zoneLeverageSVG('zone',zone,{center:100,sideX:20,...leverageAxes(choice)});
  const [benefit,risk]=[...svg.matchAll(/data-leverage="(?:benefit|risk)" cx="([^"]+)" cy="([^"]+)"/g)].map(m=>({x:+m[1],y:+m[2]}));
  if(choice==='inside')assert.ok(benefit.x<zone.x&&risk.x>zone.x);
  if(choice==='outside')assert.ok(benefit.x>zone.x&&risk.x<zone.x);
  if(choice==='overtop')assert.ok(benefit.y<zone.y&&risk.y>zone.y);
  if(choice==='underneath')assert.ok(benefit.y>zone.y&&risk.y<zone.y);
  assert.match(svg,/stop-opacity="0"/);
 }
 assert.equal(zoneLeverageSVG('center',{...zone,x:100},{center:100,horizontal:'inside'}),'');
 assert.equal(zoneLeverageSVG('bad',{...zone,rx:0},{center:100,vertical:'overtop'}),'');
 assert.deepEqual(zone,{x:160,y:70,rx:60,ry:24});
});
