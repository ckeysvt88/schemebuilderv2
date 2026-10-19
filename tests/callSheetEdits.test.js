import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCallSheetEdits, callSheetCallId, emptyCallSheetEdits } from '../src/engine/callSheetEdits.js';
import { buildPrintCallSheet } from '../src/engine/printCallSheet.js';
const sample=()=>({situationMatrix:[{label:'3RD & LONG',down:3,distance:10,plannedMix:{calls:[{formation:'A',call:'Zone',role:'foundation',quickSetup:'Setup A',userJob:'Job A'},{formation:'B',call:'Man',role:'coverage-variation',quickSetup:'Setup B',userJob:'Job B'}]}},{label:'1ST & SHORT',down:1,plannedMix:{calls:[{formation:'A',call:'Zone',role:'foundation',quickSetup:'Setup A',userJob:'Job A'}]}}]});
test('promotion and exclusion remain scoped to the situation and never mutate the plan',()=>{
 const data=sample(),before=JSON.stringify(data),row=data.situationMatrix[0];const edits={...emptyCallSheetEdits(),excluded:[callSheetCallId(row,row.plannedMix.calls[0])],starting:{[row.label]:callSheetCallId(row,row.plannedMix.calls[1])}};
 const out=applyCallSheetEdits(data,edits);assert.equal(out.situationMatrix[0].plannedMix.calls[0].call,'Man');assert.equal(out.situationMatrix[1].plannedMix.calls.length,1);assert.equal(JSON.stringify(data),before);
 const printed=buildPrintCallSheet(out);assert.ok(printed.setups.some(s=>s.text==='Setup A'));assert.ok(printed.setups.some(s=>s.text==='Setup B'));
});
test('invalid or stale starting choices cannot introduce new calls',()=>{
 const data=sample(),edits={...emptyCallSheetEdits(),starting:{'3RD & LONG':'unknown'}};
 assert.deepEqual(applyCallSheetEdits(data,edits).situationMatrix[0].plannedMix.calls,data.situationMatrix[0].plannedMix.calls);
});
test('excluding every call marks the row and removes all setup/job references',()=>{
 const data=sample(),excluded=data.situationMatrix.flatMap(r=>r.plannedMix.calls.map(c=>callSheetCallId(r,c)));const out=applyCallSheetEdits(data,{...emptyCallSheetEdits(),excluded});const p=buildPrintCallSheet(out);
 assert.ok(p.rows.every(r=>r.editorExcluded&&r.calls.length===0));assert.equal(p.setups.length,0);assert.equal(p.jobs.length,0);
});
test('hiding coaching preserves required setup while removing job references',()=>{
 const out=applyCallSheetEdits(sample(),{...emptyCallSheetEdits(),includeCoaching:false});const p=buildPrintCallSheet(out);assert.equal(p.jobs.length,0);assert.equal(p.setups.length,2);assert.ok(p.rows.every(r=>r.calls.every(c=>c.jobRef==='-')));
});
