import { FDB } from '../data/formations.js';
export const PLAYBOOK_PREFERENCES_KEY='sb_playbook_preferences_v1';
export function normalizePlaybookPreferences(value){
 const wanted=Array.isArray(value?.wanted)?[...new Set(value.wanted.filter(n=>typeof n==='string'&&Object.hasOwn(FDB,n)))]:[];
 return {wanted,priorities:Object.fromEntries(wanted.map(n=>[n,value?.priorities?.[n]==='nice'?'nice':'must']))};
}
export function readPlaybookPreferences(storage){
 try{return normalizePlaybookPreferences(JSON.parse((storage||globalThis.localStorage).getItem(PLAYBOOK_PREFERENCES_KEY)));}catch{return normalizePlaybookPreferences(null);}
}
export function savePlaybookPreferences(value,storage){
 try{(storage||globalThis.localStorage).setItem(PLAYBOOK_PREFERENCES_KEY,JSON.stringify(normalizePlaybookPreferences(value)));return true;}catch{return false;}
}
export function matchesFormationSearch(name,query){
 const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
 return !query.trim()||query.split(',').some(part=>part.trim()&&part.trim().split(/\s+/).every(term=>normalize(name).includes(normalize(term))));
}
