import test from 'node:test';import assert from 'node:assert/strict';
import { normalizePlaybookPreferences,readPlaybookPreferences,savePlaybookPreferences,matchesFormationSearch } from '../src/utils/playbookPreferences.js';
test('remembered priorities discard unknown formations, duplicates, and invalid priority values',()=>{
 assert.deepEqual(normalizePlaybookPreferences({wanted:['Nickel Over','Unknown','Nickel Over','3-3-5 Penny'],priorities:{'Nickel Over':'nice','3-3-5 Penny':'invalid'}}),{wanted:['Nickel Over','3-3-5 Penny'],priorities:{'Nickel Over':'nice','3-3-5 Penny':'must'}});
});
test('preferences survive reload and unavailable storage fails safely',()=>{
 let data;const storage={getItem:()=>data,setItem:(_,v)=>{data=v}};const value={wanted:['Nickel Over'],priorities:{'Nickel Over':'nice'}};
 assert.ok(savePlaybookPreferences(value,storage));assert.deepEqual(readPlaybookPreferences(storage),value);
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};assert.deepEqual(readPlaybookPreferences(blocked),{wanted:[],priorities:{}});assert.equal(savePlaybookPreferences(value,blocked),false);
});
test('search supports punctuation aliases, multiple terms and comma-separated alternatives',()=>{
 assert.ok(matchesFormationSearch('3-3-5 Penny','335 penny'));assert.ok(matchesFormationSearch('Nickel Double Mug','penny, double mug'));assert.ok(!matchesFormationSearch('Nickel Over','double mug'));assert.ok(matchesFormationSearch('Nickel Over',''));
});
