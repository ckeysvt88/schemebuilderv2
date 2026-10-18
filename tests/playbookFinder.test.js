import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlaybooks } from '../src/utils/playbookFinder.js';
import { FDB } from '../src/data/formations.js';
import { PLAYBOOKS } from '../src/data/playbooks.js';
test('empty selections do not recommend every book',()=>assert.deepEqual(findPlaybooks([]),[]));
test('matches exact membership for every catalog formation',()=>{
 for(const [name,data] of Object.entries(FDB)){
  const found=findPlaybooks([name,name]);
  assert.deepEqual(found.map(r=>r.name).sort(),data.books.filter(b=>Object.hasOwn(PLAYBOOKS,b)).sort());
  assert.ok(found.every(r=>r.complete&&r.count===1&&r.total===1));
 }
});
test('partial combinations show omissions and never substitute similarly named formations',()=>{
 const wanted=['Nickel Over','3-3-5 Penny','3-3-5 3 High Penny'];
 const results=findPlaybooks(wanted);
 assert.ok(results.length>0);
 for(const result of results){
  assert.equal(result.count,result.matched.length);
  assert.equal(result.total,3);
  assert.deepEqual([...result.matched,...result.missing].sort(),[...wanted].sort());
 }
 assert.ok(results.every((r,i)=>!i||results[i-1].count>=r.count));
 assert.ok(findPlaybooks(['Nickel Over','Unknown formation']).every(r=>!r.complete&&r.missing.includes('Unknown formation')));
});
