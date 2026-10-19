// Review-only spike. No production imports this module. Effects are qualitative,
// not calibrated grades; exact CFB27 mechanics require verification before rollout.
import { PLAYS } from '../../src/data/plays.js';
import { assessAdjustmentMatchup } from '../../src/engine/adjustmentMatchup.js';
import { PLAY_ART_FORMATIONS } from '../../src/components/playArt/catalog.js';
import { selectedContainIds, stuntRoutes } from '../../src/components/playArt/front.js';
export const EXAMPLES = [
  ['adjusted','Adjusted defense','Priority 1'],['disguise','Disguised variation','Priority 2'],
  ['pressure','Pressure & contain','Priority 3'],['shared','One set of responsibilities','Priority 6'],
  ['rpo','Specific RPO answers','Next · 4'],['execution','User workload','Next · 5'],
];
export const DEFAULTS={underneath:true,stunt:'texas',contain:true,manOverride:false,rpo:'bubble',execution:'simple',situation:'short'};
export const CANDIDATES=['Cover 3 Sky','Tampa 2','Cover 4 Quarters'];
const stock=PLAYS['Nickel Over'].find(p=>p.n==='Cover 3 Sky');
export function evaluatePreview(input={}){
 const state={...DEFAULTS,...input};
 const settings=state.underneath?[{setting:'Coverage Shading',value:'Underneath'}]:[];
 const baseline=assessAdjustmentMatchup(stock,stock.n,{scenarios:[{id:'crossers',label:'Crossers',normalizedWeight:1}]},{settings});
 const players=PLAY_ART_FORMATIONS['Nickel Over'];
 const positions=Object.fromEntries(players.map(([id,x,y])=>[id,{x:x*3,y:y*3}]));
 const rush=stuntRoutes(players,positions,300,state.stunt);
 const contains=selectedContainIds(players,positions,state.contain?'both':'none');
 const conflicts=contains.filter(id=>rush.map[id]);
 const assignments=players.map(([id,x,y,group])=>({id,x,y,job:['dl','edge'].includes(group)?'rush':id==='FS'||id.startsWith('CB')?'deep':id==='SLB1'&&state.manOverride?'man':id.startsWith('SLB')?'hook':'flat'}));
 const ledger=[];
 if(state.underneath)ledger.push({id:'underneath',helps:'Challenge short inside throws',cost:'More space behind the underneath defenders',basis:'Guide-supported direction; depth and grading uncalibrated'});
 if(state.manOverride)ledger.push({id:'reassign',helps:'SLB1 has a man assignment; select the receiver in game',cost:'SLB1 leaves its left inside zone',basis:'Explicit custom defender assignment; receiver unknown'});
 if(state.contain)ledger.push({id:'contain',helps:conflicts.length?'Contain conflicts with the selected stunt':'Edge contain retained in this schematic',cost:conflicts.length?'Resolve the conflicting assignments before recommending this setup':'Contain is not a guarantee against an athletic QB',basis:'Existing Play Art front/path rules'});
 const work=state.execution==='advanced'?{label:'Advanced switching',steps:['Set the receiver matchup before the snap','Start on a coverage defender','Switch only after reading the release'],note:'Optional technique; verify CFB27 behavior before it affects recommendations.'}:state.execution==='comfortable'?{label:'Comfortable adjusting',steps:['Apply the selected adjustment','User the assigned underneath area'],note:'Prefer a small number of compatible changes.'}:{label:'Minimal adjustments',steps:['Use the base call','User the assigned underneath area'],note:'Prefer sound calls that need fewer manual changes; keep matchup safeguards.'};
 const rpo=state.rpo==='bubble'?{pass:'Outside bubble receiver',role:'Outside coverage defender',risk:'Moving that defender outward can reduce nearby run support',job:'Read the inside run; confirm the actual run fit'}:{pass:'Inside glance / slant',role:'Inside coverage defender',risk:'Committing that defender to the run can open the inside throw',job:'Read run/pass conflict; do not also assign the same defender to the bubble'};
 const shared={assignments,ledger,insideZones:assignments.filter(a=>a.job==='hook').length,deepZones:assignments.filter(a=>a.job==='deep').length};
 const fitAdvice=state.situation==='long'?(state.underneath?'Do not prioritize the underneath benefit over protecting the deep conversion.':'Keep deep protection central to this long-yardage evaluation.'):(state.underneath?'The short-throw benefit fits this scenario; keep the deeper tradeoff visible.':'Consider an underneath answer if short crossers are winning.');
 return{state,fitAdvice,baseline,players,positions,rush,contains,conflicts,shared,work,rpo,candidates:CANDIDATES.map(name=>({name,play:PLAYS['Nickel Over'].find(p=>p.n===name)})),
  status:conflicts.length?'Resolve setup conflict':'Ready for matchup evaluation',
  projections:Object.fromEntries(['Plan','Play Art','Call sheet'].map(surface=>[surface,{surface,...shared}]))};
}
