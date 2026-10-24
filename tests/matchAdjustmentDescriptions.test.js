import test from 'node:test';
import assert from 'node:assert/strict';
import {CHECK_SCHEMES,OFFENSIVE_LOOKS,getCheckOptions} from '../src/data/coverageChecks.js';
import {getMatchAdjustmentDescription} from '../src/data/matchAdjustmentDescriptions.js';
test('every supported scheme/look/check has an attributed description',()=>{
 for(const [scheme] of CHECK_SCHEMES)for(const look of OFFENSIVE_LOOKS)for(const check of getCheckOptions(scheme,look.id)){
  const d=getMatchAdjustmentDescription(scheme,look.id,check);assert.ok(d?.text);assert.ok(d.source);assert.match(d.url,/^https:\/\//);
 }
});
test('broader EA examples cannot bypass CFB menus',()=>{
 for(const check of ['triangle','pointTriangle','topHat'])assert.equal(getMatchAdjustmentDescription('cover1','bunch',check),null);
 assert.equal(getMatchAdjustmentDescription('cover3','stack','stump'),null);
});
test('isolated Quarters describes its own behavior instead of trips rules',()=>{
 assert.match(getMatchAdjustmentDescription('quarters','single','quarters').text,/isolated/);
 assert.doesNotMatch(getMatchAdjustmentDescription('quarters','trips','quarters').text,/isolated/);
 assert.match(getMatchAdjustmentDescription('quarters','singleTight','quarters').source,/guide/);
});
