import { EXAMPLE_ART } from './examples.js';
import { PLAY_ART_FORMATIONS, FORMATION_FAMILIES, familyOf, formationDepth, shiftLinebacker, blitzEndpoint } from './catalog.js';
import { buildBugReportUrl } from './feedback.js';
import { readPlayArtStorage, writePlayArtStorage } from './storage.js';

export function mountPlayArt(root, { initialFormation } = {}) {
const formations=PLAY_ART_FORMATIONS;
let formation='Nickel Over',players=formations[formation];
const options={standardRush:['Rush','rush'],rush:['Blitz','rush'],contain:['QB contain','contain'],spy:['QB spy','spy'],hook:['Hook Curl','under'],vertical:['Vertical hook','under'],middle:['Middle Read','under'],seam:['Seam Flat','under'],rec3:['3 Rec Hook','under'],bluff:['Bluff Blitz','under'],curl:['Curl / flat','under'],hard:['Hard flat','under'],cloud:['Cloud flat','under'],soft:['Soft squat','under'],third:['Deep third','deep'],half:['Deep half','deep'],quarter:['Deep quarter','deep'],man:['Man · label only','man'],blank:['Choose assignment','blank']};
// Position menus transcribed from the user's AceMadden reference screenshots.
// These are macro overrides. A stock play can carry an assignment absent from its override menu.
const positionMenus={
 cb:[['third_outside','Outside Third'],['cloud','Cloud Flat'],['hard','Hard Flat'],['curl','Curl Flat'],['half','Deep Half'],['rush','Blitz'],['quarter','Inside Quarter'],['soft','Soft Squat']],
 slot:[['seam','Seam Flat'],['vertical','Vertical Hook'],['hard','Hard Flat'],['curl','Curl Flat'],['half','Deep Half'],['rush','Blitz'],['spy','QB Spy'],['hook','Hook Curl']],
 s:[['middle','Middle Read'],['hook','Hook Curl'],['third_middle','Inside Third'],['curl','Curl Flat'],['half','Deep Half'],['rush','Blitz'],['third_outside','Outside Third'],['quarter','Inside Quarter']],
 outsideLB:[['seam','Seam Flat'],['vertical','Vertical Hook'],['hard','Hard Flat'],['curl','Curl Flat'],['half','Deep Half'],['rush','Blitz'],['spy','QB Spy'],['hook','Hook Curl']],
 insideLB:[['middle','Middle Read'],['hook','Hook Curl'],['hard','Hard Flat'],['curl','Curl Flat'],['third_middle','Middle Third'],['rush','Blitz'],['spy','QB Spy'],['rec3','3 Rec Hook']],
 edge:[['standardRush','Rush'],['vertical','Vertical Hook'],['hook','Hook Curl'],['hard','Hard Flat'],['curl','Curl Flat'],['soft','Soft Squat'],['rush','Blitz'],['spy','QB Spy'],['rec3','3 Rec Hook']],
 dl:[['standardRush','Rush'],['hook:left','Hook Curl Left'],['hook:right','Hook Curl Right'],['curl:left','Curl Left'],['curl:right','Curl Right'],['bluff','Bluff Blitz'],['rush','Blitz'],['spy','QB Spy'],['rec3','3 Rec Hook']]
};
const menuGroup=p=>p[3]==='lb'?(/^(MIKE|SLB)/.test(p[0])?'insideLB':'outsideLB'):p[3];
// Menu names: AceMadden CFB27. Paths: schematic stunt concepts, not animation timing.
const stuntMenu=[['none','None'],...['left','right'].flatMap(side=>[['exit','Exit 2 Man'],['tex','Tex 2 Man'],['tom','Tom 2 Man'],['pirate','Pirate 3 Man'],['tempe','Tempe 4 Man']].map(([key,label])=>[side+'_'+key,side[0].toUpperCase()+side.slice(1)+' '+label])),['elpaso','El Paso 4 Man'],['texas','Texas 4 Man']];
const stuntNotes={exit:'The end goes inside first; the tackle loops outside.',tex:'The tackle goes first; the end loops inside.',tom:'One tackle goes first; the other crosses behind him.',pirate:'Two linemen go inside; the opposite tackle loops behind them.',tempe:'An inside loop on one side and an outside loop on the other.',elpaso:'Both ends go inside; both tackles loop outside.',texas:'Both tackles go first; both ends loop inside.'};
const names={sky:'Cover 3 Sky',two:'Tampa 2',quarters:'Cover 4 Quarters',cover3:'Cover 3',blank:'Blank formation'};
const formationCalls={'Nickel Over':['sky','two','quarters'],'4-3 Over Wide':['sky','two','quarters'],'3-4 Over':['sky','quarters'],'3-3-5 Stack':['cover3']};
const exampleCalls={'Nickel Over':['sky','quarters'],'4-3 Over Wide':['sky','quarters'],'3-4 Over':['sky','quarters'],'3-3-5 Stack':['cover3']};
for(const name of Object.keys(formations))formationCalls[name]=[...(formationCalls[name]||[]),'blank'];
const callMenu=()=>[...(exampleCalls[formation]||[]),'blank'].map(k=>[k,names[k]]);
const formationMenu=()=>Object.keys(formations).filter(n=>familyOf(n)===familyOf(formation)).map(n=>[n,n.replace(familyOf(n)+' ','')]);
const defaultCall=()=>formationCalls[formation][0];
const zoneMenu=[['default','Default'],...Array.from({length:7},(_,i)=>[String(i*5),i*5+' yards'])];
const jobColor=job=>({hard:'flat',cloud:'flat',soft:'flat',curl:'curl',hook:'hook',vertical:'vertical',middle:'vertical',rec3:'vertical',seam:'seam',quarterflat:'seam',bluff:'hook'}[job]||options[job][1]);
const explanations={standardRush:'Rush straight ahead from the defensive line. Stunts and point of attack can change the rush lane.',rush:'Rush toward the quarterback. Showing pressure is a separate setting.',contain:'Keep the outside rush lane. Contain is counted as a rusher, not an extra defender.',spy:'Watch the quarterback. You are giving up a rusher or coverage defender for this job.',hook:'Work in an inside underneath passing lane.',vertical:'Work the inside vertical lane.',middle:'Protect the middle seam from the underneath coverage.',curl:'Work outside underneath, between the short flat and deeper sideline routes.',hard:'Attack the short outside throw. Space opens behind this defender.',cloud:'Cover the outside underneath window. Short throws can open in front of you.',soft:'Read the outside receiver from the flat. Route releases affect what you carry.',third:'Protect one of the three deep areas you select.',half:'Protect the selected deep half.',quarter:'Protect the selected quarter of the deep field.',man:'Man coverage noted. Choose the receiver in game; no matchup is assumed here.'};
Object.assign(explanations,{seam:'Carry the outside seam, then work toward the flat as routes develop.',rec3:'Read the third receiver from the sideline and protect the inside passing lane.',bluff:'Show an initial rush, then drop back underneath.'});
const clone=x=>JSON.parse(JSON.stringify(x));
// Coverage locations are call responsibilities, not inferred from a player's starting x.
// Example assignments transcribed from CFB Labs' referenced play art. Other formations start blank.
const callAssignments={
 '4-3 Over Wide':{
  sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],WILL:['curl','left'],MIKE:['hook','left'],SAM:['hook','right']},
  two:{FS:['half','left'],SS:['half','right'],CB1:['cloud','left'],CB2:['cloud','right'],WILL:['hook','left'],MIKE:['middle','middle'],SAM:['hook','right']}
 },
 'Nickel Over':{
  sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],SLCB:['curl','left'],SLB1:['hook','left'],SLB2:['hook','right']},
  two:{FS:['half','left'],SS:['half','right'],CB1:['cloud','left'],CB2:['cloud','right'],SLCB:['hook','left'],SLB1:['middle','middle'],SLB2:['hook','right']}
 }
};

const quarterShell={FS:['quarter','middle'],SS:['quarter','innerRight'],CB1:['quarter','left'],CB2:['quarter','right']};
callAssignments['Nickel Over'].quarters={...quarterShell,SLCB:['quarterflat','left'],SLB1:['rec3','middle'],SLB2:['quarterflat','right']};
callAssignments['4-3 Over Wide'].quarters={...quarterShell,WILL:['quarterflat','left'],MIKE:['rec3','middle'],SAM:['quarterflat','right']};
callAssignments['3-4 Over']={
 sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],REDG:['curl','left'],WILL:['hook','left'],MIKE:['hook','right']},
 quarters:{...quarterShell,REDG:['quarterflat','left'],WILL:['rec3','middle'],MIKE:['quarterflat','right']}
};
callAssignments['3-3-5 Stack']={cover3:{FS:['third','middle'],CB1:['third','left'],CB2:['third','right'],SS1:['curl','left'],SS2:['curl','right'],WILL:['hook','left'],SAM:['hook','right']}};
options.quarterflat=['Quarter Flat','under'];
explanations.quarterflat='Match the outside underneath routes, with the deep quarter behind you.';
const supportsStunts=()=>['Nickel Over','4-3 Over Wide'].includes(formation);
function underneathArea(p,call,job){
 // Keep the position's interior lane when reapplying an interior zone.
 // Explicit DL Left/Right selections are handled separately by the editor.
 if(['hook','vertical'].includes(job)){
  const responsibility=callAssignments[formation]?.[call]?.[p[0]];
  if(responsibility&&['hook','vertical','middle'].includes(responsibility[0]))return responsibility[1];
  return p[1]===50?'middle':p[1]<50?'left':'right';
 }
 if(['middle','rec3'].includes(job))return 'middle';
 return p[1]<50?'left':'right';
}
function preset(key){
 const a={};
 players.forEach(([id,x,,group])=>{
  const [job,area]=(key==='blank'?['blank',x<50?'left':'right']:callAssignments[formation]?.[key]?.[id])||[['dl','edge'].includes(group)?'standardRush':'rush',x<50?'left':'right'];
  a[id]={job,area,shade:'default'};
 });
 return{formation,template:key,a,stunt:'none',front:{technique:'default',attack:'default',contain:'none'},zones:{flats:'default',curls:'default',hooks:'default'},team:{cbDepth:'default',sDepth:'default',cbWidth:'default',sWidth:'default',lbShift:'default',show:'none'},view:'assignments'};
}

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu=(values,value)=>values.map(([v,l])=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(l)+'</option>').join('');
function assignmentLabel(a){if(a.job==='man')return 'Man · receiver set in game';if(['third','half','quarter'].includes(a.job))return options[a.job][0]+' · '+a.area;return options[a.job][0];}
function validState(s){
 if(s?.team&&s.team.lbShift===undefined)s.team.lbShift='default';
 if(!s||!Object.hasOwn(formations,s.formation)||!formationCalls[s.formation].includes(s.template)||!s.a)return false;
 if(!formations[s.formation].every(([id])=>{const a=s.a[id];return a&&Object.hasOwn(options,a.job)&&['left','middle','right','innerRight'].includes(a.area)&&['default','inside','outside'].includes(a.shade);}))return false;
 const allowed={zones:{flats:zoneMenu.map(v=>v[0]),curls:zoneMenu.map(v=>v[0]),hooks:zoneMenu.map(v=>v[0])},front:{technique:['default','pinch','right','left','spread'],attack:['default','outside','left','right','inside'],contain:['none','left','right','both']},team:{cbDepth:['default','press','3','5','7','9','12','20'],sDepth:['default','5','9','12','16','25','32'],cbWidth:['default','inside','outside'],sWidth:['default','pinch','spread','wide'],lbShift:['default','left','right','pinch','spread'],show:['none','lb','secondary','both']}};
 return Object.entries(allowed).every(([group,fields])=>s[group]&&Object.entries(fields).every(([key,values])=>values.includes(s[group][key])))&&stuntMenu.some(([key])=>key===s.stunt)&&['assignments','alignment'].includes(s.view);
}
function createApp(app,index){
const persisted=readPlayArtStorage(validState);
if(persisted.current){formation=persisted.current.formation;players=formations[formation];}
if(initialFormation&&Object.hasOwn(formations,initialFormation)){formation=initialFormation;players=formations[formation];}

const layout=app.dataset.layout;let state=(initialFormation?persisted.drafts[formation]:persisted.current)||preset(initialFormation?'blank':defaultCall()),selected=players[0][0],open=false,comparing=false,keyboardMode=false,tab='players',step=0,saved=persisted.saved,history=[];let width=450;const uid='nm'+index;
app.innerHTML='<header class="nm-header app-page-header"><div class="nm-brand">Scheme Builders</div><h1>Design Your Play Macro Builder - Beta</h1></header><main class="nm-main"><div class="nm-pickers"><label>Family<select class="nm-family">'+menu(FORMATION_FAMILIES.map(n=>[n,n]),familyOf(formation))+'</select></label><label class="nm-formation-picker">Formation<select class="nm-formation-select">'+menu(formationMenu(),formation)+'</select></label><label>Play<select class="nm-template">'+menu(callMenu(),defaultCall())+'</select></label></div>'+(layout==='guided'?'<div class="nm-steps" aria-label="Builder steps"><button type="button" data-step="0" aria-pressed="true">1 · Assign</button><button type="button" data-step="1" aria-pressed="false">2 · Align</button><button type="button" data-step="2" aria-pressed="false">3 · Review</button></div>':'')+'<div class="nm-compare" role="group" aria-label="Compare with base call"><button type="button" data-compare="base" aria-pressed="false">Base call</button><button type="button" data-compare="macro" aria-pressed="true">My macro</button><button type="button" data-action="reset">Reset</button></div><div class="nm-compare-status" aria-live="polite"></div><div class="nm-field-feedback nm-sub" role="status" hidden></div><div class="nm-hint">'+(layout==='board'?'Select a player below, or tap a marker on the field.':'Tap a defender to open their assignment popup.')+'</div><div class="nm-field-wrap"><div class="nm-field"><svg role="img" aria-label="Nickel Over custom defensive assignments"></svg><div class="nm-markers"></div></div></div><details class="nm-reference" hidden><summary>Original example play art</summary><img loading="lazy" alt="Original example play art"><a target="_blank" rel="noopener noreferrer">Source: CFB Labs</a></details><div class="nm-custom-note">Coverage areas, not fixed stopping points. Numbered drops show your set depth.</div><div class="nm-art-tools"><details class="nm-art-key"><summary>Play-art key</summary><div class="nm-legend"><span><i class="nm-swatch"></i>Deep zone</span><span><i class="nm-swatch" style="background:var(--nm-flat)"></i>Hard / cloud / soft squat</span><span><i class="nm-swatch" style="background:var(--nm-curl)"></i>Curl flat</span><span><i class="nm-swatch" style="background:var(--nm-hook)"></i>Hook / curl</span><span><i class="nm-swatch" style="background:var(--nm-vertical)"></i>Read / vertical hook</span><span><i class="nm-swatch" style="background:var(--nm-seam)"></i>Seam / quarter flat</span><span><i class="nm-swatch" style="background:var(--nm-rush)"></i>Rush</span><span><i class="nm-swatch" style="background:var(--nm-contain)"></i>Contain</span><span><i class="nm-swatch" style="background:var(--nm-spy);height:8px;border-radius:50%"></i>QB spy</span><span><i class="nm-swatch" style="background:none;height:12px;width:12px;border:1px dashed var(--nm-man);border-radius:50%"></i>Man · label only</span></div></details><div class="nm-toggle-row"><label><span class="nm-sr">Diagram</span><select class="nm-view" aria-label="Diagram">'+menu([['assignments','Assignments'],['alignment','Pre-snap']],'assignments')+'</select></label></div></div>'+(layout==='board'?'<div class="nm-tabbar"><button type="button" data-tab="players" aria-pressed="true">Players</button><button type="button" data-tab="team" aria-pressed="false">Alignment</button></div>':'')+'<div class="nm-roster"'+(layout==='field'?' hidden':'')+'></div><div class="nm-editor" role="dialog" aria-modal="false" hidden></div><details class="nm-zone"><summary>Zone drops</summary><div class="nm-details-body"><div class="nm-zone-grid">'+['flats','curls','hooks'].map(k=>'<label>'+({flats:'Flats',curls:'Curl flats',hooks:'Hooks'}[k])+'<select data-zone="'+k+'">'+menu(zoneMenu,'default')+'</select></label>').join('')+'</div><p class="nm-sub">Applies to every defender in that zone group.</p></div></details><details class="nm-front"><summary>Defensive line</summary><div class="nm-details-body"><label>Stunt<select data-stunt>'+menu(stuntMenu,'none')+'</select></label><p class="nm-stunt-note nm-sub" aria-live="polite"></p><div class="nm-grid"><label>Technique<select data-front="technique">'+menu([['default','Default'],['pinch','Pinch'],['right','Right'],['left','Left'],['spread','Spread']],'default')+'</select></label><label>Point of attack<select data-front="attack">'+menu([['default','Default'],['outside','Outside'],['left','Left'],['right','Right'],['inside','Inside']],'default')+'</select></label><label class="nm-wide">QB contain<select data-front="contain">'+menu([['none','Off'],['left','Left edge'],['right','Right edge'],['both','Both edges']],'none')+'</select></label></div><p class="nm-front-message nm-sub" aria-live="polite"></p><details><summary>About stunt arrows</summary><p class="nm-sub">Arrows illustrate rush lanes, not timing or guaranteed pressure. Check the exact path in game before saving a competitive setup.</p></details></div></details><details class="nm-team"><summary>Player alignment &amp; show blitz</summary><div class="nm-details-body"><div class="nm-grid"><label>Outside CB depth<select data-team="cbDepth">'+menu([['default','Formation default'],['press','Press'],['3','3 yards'],['5','5 yards'],['7','7 yards'],['9','9 yards'],['12','12 yards'],['20','20 yards']],'default')+'</select></label><label>Safety depth<select data-team="sDepth">'+menu([['default','Formation default'],['5','5 yards'],['9','9 yards'],['12','12 yards'],['16','16 yards'],['25','25 yards'],['32','32 yards']],'default')+'</select></label><label>Outside CB width<select data-team="cbWidth">'+menu([['default','Default'],['inside','Tight'],['outside','Wide']],'default')+'</select></label><label>Safety width<select data-team="sWidth">'+menu([['default','Default'],['pinch','Pinch'],['spread','Spread'],['wide','Wide']],'default')+'</select></label><label>Linebacker shift<select data-team="lbShift">'+menu([['default','Default'],['left','Left'],['right','Right'],['pinch','Pinch'],['spread','Spread']],'default')+'</select></label><label>Show blitz<select data-team="show">'+menu([['none','Off'],['lb','Linebackers'],['secondary','Secondary'],['both','Linebackers + secondary']],'none')+'</select></label></div><p class="nm-sub">Depth moves the starting alignment. Secondary Show Blitz sets safeties to 6 yards; corners stay put. Blitz arrows stop before the defensive line. Linebacker blitzes point straight ahead; other blitzes angle toward the QB. DL Rush uses a short, straight arrow.</p></div></details><div class="nm-review" hidden></div>'+(layout==='guided'?'<div class="nm-step-footer"><button type="button" data-action="back">Back</button><button type="button" data-action="next" class="nm-primary">Next · Alignment</button></div>':'')+'<div class="nm-save-row"><label>Macro name<input type="text" class="nm-name" maxlength="42" value="'+formation+' · My Macro"></label><button type="button" class="nm-primary" data-action="save">Save macro</button></div><div class="nm-status" aria-live="polite"></div><div class="nm-footer-actions"><details class="nm-saved"><summary>Saved macros <span class="nm-saved-count">(0)</span></summary><div class="nm-details-body nm-saved-list"><div class="nm-empty">Saved macros stay on this device.</div></div></details><a class="nm-report" href="mailto:help@schemebuilders.com" aria-label="Report a Play Art bug by email">Report a bug</a></div><div class="nm-storage-notice" role="status" hidden></div></main>';
const popup=app.querySelector('.nm-editor');popup.id=uid+'-popup';popup.setAttribute('aria-labelledby',uid+'-popup-title');app.querySelector('.nm-field-wrap').append(popup);
const markers=app.querySelector('.nm-markers');
function buildMarkers(){markers.innerHTML='';players.forEach(([id,,,group,desc])=>{const b=document.createElement('button');b.type='button';b.className='nm-player';b.dataset.player=id;b.dataset.group=group;b.innerHTML='<span class="nm-glyph" aria-hidden="true"></span><span class="nm-player-label">'+id+'</span>';b.setAttribute('aria-label',id+' · '+desc+' · edit assignment');b.setAttribute('aria-pressed','false');b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls',uid+'-popup');b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>{selected=id;open=true;tab='players';if(layout==='guided')step=0;refresh();if(keyboardMode)popup.querySelector('[data-edit=job]').focus();});markers.append(b);});}
buildMarkers();
function snapshot(){history.push(clone(state));if(history.length>30)history.shift();}
function mutate(fn){snapshot();comparing=false;fn();refresh();persist();app.querySelector('.nm-status').textContent='';}
const LOS=354,FIELD_HEIGHT=430;
let scale=15;
const yardY=depth=>LOS-Number(depth)*scale;
const zoneGroup=job=>['hard','cloud','soft'].includes(job)?'flats':['curl','seam','quarterflat'].includes(job)?'curls':['hook','vertical','middle','rec3'].includes(job)?'hooks':null;
// Default coordinates are compact play-art landmarks, not claims of AI stopping depths.
const defaultDrop={hard:1.5,cloud:3.2,soft:3.2,curl:5.5,seam:5.5,quarterflat:5.5,hook:6,vertical:6,middle:9,rec3:5.5,bluff:3.5,third:13,half:13,quarter:13};
function displayedState(){if(!comparing)return state;const base=preset(state.template);base.view=state.view;return base;}
function coords(p,shown=displayedState()){
 const [,bx,by,g]=p;let x=bx,depth=formationDepth(by);
 if(g==='lb')x=shiftLinebacker(x,shown.team.lbShift);
 if(g==='cb'&&shown.team.cbDepth!=='default')depth=shown.team.cbDepth==='press'?.6:Number(shown.team.cbDepth);
 if(g==='s'&&shown.team.sDepth!=='default')depth=Number(shown.team.sDepth);
 const setting=g==='cb'?shown.team.cbWidth:g==='s'?shown.team.sWidth:'default';
 if(setting==='inside')x+=x<50?5:-5;if(setting==='outside')x+=x<50?-4:4;
 if(x!==50){if(setting==='pinch')x+=x<50?6:-6;if(setting==='spread')x+=x<50?-5:5;if(setting==='wide')x+=x<50?-10:10;}
 if(['dl','edge'].includes(g)){
  const t=shown.front.technique;
  if(t==='pinch')x+=(50-x)*.23;if(t==='spread')x+=(x-50)*.22;
  if(t==='left')x-=5;if(t==='right')x+=5;
 }
 const show=shown.team.show;
 if((show==='secondary'||show==='both')&&g==='s')depth=6;
 if((show==='lb'||show==='both')&&g==='lb')depth=Math.min(depth,1);
 return{x:26+(width-52)*Math.max(3,Math.min(97,x))/100,y:yardY(depth),depth};
}
function isOutsideLOS(p){const front=players.filter(q=>q[2]>=63&&['dl','edge','lb'].includes(q[3])).sort((a,b)=>a[1]-b[1]);return p===front[0]||p===front.at(-1);}
function isContained(p,shown){const c=shown.front.contain;return isOutsideLOS(p)&&['rush','standardRush'].includes(shown.a[p[0]].job)&&(c==='both'||c===(p[1]<50?'left':'right'));}
function stuntPlan(shown,positions){
 if(!supportsStunts())return {map:{},participants:[],conflicts:[],active:false,type:'none'};
 const linemen=players.filter(p=>['dl','edge'].includes(p[3])).sort((a,b)=>a[1]-b[1]);
 const [le,lt,rt,re]=linemen.map(p=>p[0]),key=shown.stunt,map={};
 const left=key.startsWith('left'),type=key.split('_')[1]||key;
 const x=id=>positions[id].x,put=(id,target,loop=false)=>{map[id]={target,loop};};
 const exit=(e,t)=>{put(e,x(t));put(t,x(e)+(x(e)<width/2?-10:10),true);};
 const tex=(e,t)=>{put(t,x(e));put(e,width/2+(x(e)<width/2?-width*.035:width*.035),true);};
 if(type==='exit')exit(left?le:re,left?lt:rt);
 if(type==='tex')tex(left?le:re,left?lt:rt);
 if(type==='tom'){put(left?lt:rt,x(left?rt:lt));put(left?rt:lt,x(left?lt:rt),true);}
 if(type==='pirate'){
  const e=left?le:re,t=left?lt:rt,opposite=left?rt:lt;
  put(e,x(t));put(t,x(opposite));put(opposite,x(e)+(left?-10:10),true);
 }
 if(type==='tempe'){if(left){tex(le,lt);exit(re,rt);}else{exit(le,lt);tex(re,rt);}}
 if(type==='elpaso'){exit(le,lt);exit(re,rt);}
 if(type==='texas'){tex(le,lt);tex(re,rt);}
 const ids=Object.keys(map),conflicts=ids.filter(id=>!['rush','standardRush'].includes(shown.a[id].job)||isContained(players.find(p=>p[0]===id),shown));
 const active=key!=='none'&&ids.length>0&&conflicts.length===0;
 return{map:active?map:{},participants:ids,conflicts,active,type};
}
function rushPath(p,shown,positions,plan){
 const q=positions[p[0]],x=q.x,y=q.y,entry=plan.map[p[0]];
 if(isContained(p,shown)){
  const target=Math.max(18,Math.min(width-15,x+(p[1]<50?-22:22)));
  return{kind:'contain',d:`M ${x} ${y+5} Q ${target} ${LOS+18} ${target} ${LOS+43} L ${target} ${LOS+53}`};
 }
 if(entry){
  return{kind:'rush',stunt:true,loop:entry.loop,d:entry.loop?`M ${x} ${y+5} C ${x} ${LOS-14} ${entry.target} ${LOS-14} ${entry.target} ${LOS+23} L ${entry.target} ${LOS+54}`:`M ${x} ${y+5} L ${entry.target} ${LOS+29} L ${entry.target} ${LOS+48}`};
 }
 const endpoint=blitzEndpoint(p[3],x,y,width,LOS,shown.a[p[0]].job==='standardRush');
 let target=endpoint.x;
 if(['dl','edge'].includes(p[3])&&shown.front.attack!=='default'){
  target=x;const attack=shown.front.attack;
  if(attack==='left')target-=17;if(attack==='right')target+=17;
  if(attack==='inside')target+=x<width/2?17:-17;if(attack==='outside')target+=x<width/2?-17:17;
 }

 const startY=y<LOS?Math.min(y+3,LOS-8):y+5;
 return{kind:'rush',d:`M ${x} ${startY} L ${target} ${endpoint.y}`};
}
function draw(){
 const svg=app.querySelector('.nm-field svg');if(!width)return;
 const shown=displayedState();
 const numericDrops=Object.values(shown.zones).filter(v=>v!=='default').map(Number);
 const numericAlign=[shown.team.cbDepth,shown.team.sDepth].filter(v=>!['default','press'].includes(v)).map(Number);
 const maxDepth=Math.max(20,...numericDrops.map(n=>n+3),...numericAlign.map(n=>n+6));
 scale=300/maxDepth;
 const positions=Object.fromEntries(players.map(p=>[p[0],coords(p,shown)])),zones=[],labels=[],rushes=[];
 const plan=stuntPlan(shown,positions),showYards=numericDrops.length>0||numericAlign.length>0;
 svg.setAttribute('viewBox','0 0 '+width+' '+FIELD_HEIGHT);
 let base='<defs>'+['rush','contain'].map(k=>'<marker id="'+uid+'-'+k+'" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--nm-'+k+')"/></marker>').join('')+'</defs>',lines='',shapes='',text='';
 for(let depth=0;depth<=maxDepth-1;depth+=5){
  const y=yardY(depth);
  base+='<line x1="24" y1="'+y+'" x2="'+(width-10)+'" y2="'+y+'" stroke="'+(depth===0?'var(--nm-field-gold)':'var(--nm-field-grid)')+'" stroke-opacity="'+(depth===0?'.8':'.5')+'"/>';
  if(showYards)base+='<text x="5" y="'+(y+4)+'" style="fill:var(--nm-muted);font-size:11px">'+depth+'</text>';
 }
 base+='<text x="12" y="20" style="fill:var(--nm-muted);font-size:11px">'+(showYards?'ZONE DROP / ALIGNMENT · YARDS':'PLAY ART · COVERAGE RESPONSIBILITIES')+'</text><text x="24" y="'+(LOS+15)+'" style="fill:var(--nm-muted);font-size:11px">LOS</text>';
 if(shown.view==='assignments')players.forEach(p=>{
  const [id,bx,,g]=p,a=shown.a[id],{x,y}=positions[id],kind=options[a.job][1];
  if(a.job==='blank')return;
  const tampahook=(shown.template==='two'||['3-4 Over','3-3-5 Stack'].includes(formation))&&a.job==='hook'&&!a.custom;
  const color='var(--nm-'+(tampahook?'tampa':jobColor(a.job))+')',sw=open&&id===selected?2.3:1.7;
  const attrs=' data-assignment="'+a.job+'" data-defender="'+id+'"';
  if(kind==='deep'||kind==='under'){
   const group=zoneGroup(a.job),setting=group?shown.zones[group]:'default';
   let depth=setting!=='default'?Number(setting):defaultDrop[a.job];
   if(kind==='deep'&&shown.team.sDepth!=='default')depth=Math.max(depth,Number(shown.team.sDepth)+5);
   let zx=x,zy=yardY(depth),rx=kind==='deep'?width*.125:Math.max(24,width*.088),ry=kind==='deep'?Math.min(22,scale*1.8):Math.min(16,scale*1.4);
   if(a.job==='third')zx=width*({left:.18,middle:.5,right:.82}[a.area]||.5);
   if(a.job==='half'){zx=width*(a.area==='left'?.27:.73);rx=width*.19;}
   if(a.job==='quarter'){zx=width*({left:.14,middle:.38,right:.86,innerRight:.62}[a.area]||.38);rx=width*.10;}
   if(['hard','cloud','soft','curl','seam','quarterflat'].includes(a.job))zx=width*((g==='dl'?a.area==='left':bx<50)?.17:.83);
   if(['hook','vertical'].includes(a.job))zx=width*({left:.36,middle:.5,right:.64}[a.area]);
   if(['middle','rec3'].includes(a.job))zx=width*.5;
   if(a.job==='bluff'){zx=x;rx=width*.07;}
   zx=Math.max(rx+24,Math.min(width-rx-10,zx));
   zones.push({id,job:a.job,group,depth,explicit:setting!=='default',x:zx,y:zy,rx,ry});
   const line=a.job==='bluff'?`M ${x} ${y+5} L ${x} ${LOS+14} Q ${x+16} ${LOS-3} ${zx} ${zy}`:`M ${x} ${y} L ${zx} ${zy}`;
   lines+='<path'+attrs+' d="'+line+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'"'+(a.job==='bluff'?' stroke-dasharray="4 3"':'')+'/>';
   shapes+='<ellipse'+attrs+' data-zone-group="'+(group||'deep')+'" data-depth="'+depth+'" cx="'+zx+'" cy="'+zy+'" rx="'+rx+'" ry="'+ry+'" fill="'+color+'" fill-opacity=".23" stroke="'+color+'" stroke-width="'+sw+'"/>';
  }else if(kind==='spy')shapes+='<ellipse'+attrs+' data-symbol="spy" cx="'+x+'" cy="'+y+'" rx="15" ry="10" fill="'+color+'" fill-opacity=".2" stroke="'+color+'" stroke-width="1.5"/>';
  else if(kind==='man')shapes+='<circle'+attrs+' data-symbol="man-label" cx="'+x+'" cy="'+y+'" r="12" fill="none" stroke="'+color+'" stroke-width="1" stroke-dasharray="3 3"/>';
  else{
   const route=rushPath(p,shown,positions,plan);rushes.push({id,...route});
   const stroke=route.stunt?2.4:sw;
   lines+='<path'+attrs+' data-rush-path="'+(route.stunt?'stunt':route.kind)+'" d="'+route.d+'" fill="none" stroke="var(--nm-'+route.kind+')" stroke-width="'+stroke+'"/>';
   // Draw arrowheads directly so mobile SVG fragment references cannot hide them.
   const points=route.d.match(/-?\d+(?:\.\d+)?/g).map(Number),tx=points.at(-2),ty=points.at(-1),dx=tx-points.at(-4),dy=ty-points.at(-3),length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
   const bx=tx-8*ux,by=ty-8*uy;
   shapes+='<polygon data-rush-arrowhead="'+id+'" points="'+tx+','+ty+' '+(bx-4*uy)+','+(by+4*ux)+' '+(bx+4*uy)+','+(by-4*ux)+'" fill="var(--nm-'+route.kind+')"/>';
  }
 });
 players.forEach(p=>{
  const q=positions[p[0]],onLine=p[2]>=63;
  const front=players.filter(other=>other[2]>=63).sort((a,b)=>positions[a[0]].x-positions[b[0]].x);
  const dense=onLine&&front.some((other,i)=>i>0&&positions[other[0]].x-positions[front[i-1][0]].x<40);
  const lane=front.findIndex(other=>other[0]===p[0]);
  const labelY=dense?q.y+17+(lane%2)*14:onLine?q.y+4:q.y-14,labelX=dense?q.x:onLine?(formation==='3-4 Over'&&p[0]==='REDG'?q.x-8:q.x+8):q.x,anchor=dense?'middle':onLine?(formation==='3-4 Over'&&p[0]==='REDG'?'end':'start'):'middle';
  labels.push({id:p[0],x:labelX,y:labelY});
  text+='<text data-player-label="'+p[0]+'" x="'+labelX+'" y="'+labelY+'" text-anchor="'+anchor+'" style="fill:var(--nm-field-text);paint-order:stroke;stroke:var(--nm-grass);stroke-width:3px;stroke-linejoin:round;font:700 11px monospace">'+p[0]+'</text>';
 });
 svg.innerHTML=base+lines+shapes+text;
 svg.setAttribute('aria-label',formation+' · '+(comparing?(state.template==='blank'?'Blank formation':'Base call'):'My macro')+' · '+names[state.template]);
 app.artLayout={labels,zones,positions,rushes,stunt:plan,scale,los:LOS,mode:comparing?'base':'macro'};
 players.forEach(p=>{
  const b=markers.querySelector('[data-player="'+p[0]+'"]'),q=positions[p[0]];
  const nearest=Math.min(...players.filter(other=>other[0]!==p[0]).map(other=>{const t=positions[other[0]];return Math.max(Math.abs(t.x-q.x),Math.abs(t.y-q.y));}));
  const hit=Math.min(44,Math.max(12,nearest));b.style.width=hit+'px';b.style.height=hit+'px';b.style.minHeight=hit+'px';b.style.left=(100*q.x/width)+'%';b.style.top=q.y+'px';b.dataset.kind=options[shown.a[p[0]].job][1];b.disabled=comparing;
  b.setAttribute('aria-pressed',String(open&&!comparing&&p[0]===selected));b.setAttribute('aria-expanded',String(open&&!comparing&&p[0]===selected));b.setAttribute('aria-label',p[0]+' · '+assignmentLabel(shown.a[p[0]])+' · edit');
 });
 app.querySelectorAll('[data-compare]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.compare==='base')===comparing)));
 app.querySelector('.nm-compare-status').textContent=(comparing?(state.template==='blank'?'Blank formation':'Base call'):'My macro')+' · '+names[state.template];
}

function counts(){const c={rush:0,contain:0,deep:0,under:0,man:0,spy:0,blank:0};const shown=displayedState();players.forEach(p=>{const a=shown.a[p[0]],contained=isContained(p,shown);c[contained?'contain':options[a.job][1]]++;});return c;}
function closeEditor(restoreFocus=false){
 open=false;const pane=app.querySelector('.nm-editor');if(!keyboardMode&&pane.contains(document.activeElement))document.activeElement.blur();pane.hidden=true;draw();
 if(restoreFocus&&keyboardMode)markers.querySelector('[data-player="'+selected+'"]').focus();
}
function placeEditor(){
 if(!open)return;
 const pane=app.querySelector('.nm-editor'),b=markers.querySelector('[data-player="'+selected+'"]');
 const pw=Math.min(252,width-16),ph=pane.offsetHeight||235;
 const x=parseFloat(b.style.left)*width/100,y=parseFloat(b.style.top);
 const below=y+27,above=y-ph-27;
 const top=below+ph<=422?below:above>=8?above:Math.max(8,Math.min(422-ph,y-ph/2));
 const left=Math.max(8,Math.min(width-pw-8,x-pw/2));
 pane.style.width=pw+'px';pane.style.left=left+'px';pane.style.top=top+'px';
}
function editor(){
 const pane=app.querySelector('.nm-editor');if(!open){pane.hidden=true;return;}
 pane.hidden=false;
 const p=players.find(p=>p[0]===selected),a=state.a[selected],isSafety=p[3]==='s',isDB=['cb','slot','s'].includes(p[3]);
 const jobs=positionMenus[menuGroup(p)];
 const current=a.job==='third'?(a.area==='middle'?'third_middle':'third_outside'):p[3]==='dl'&&['hook','curl'].includes(a.job)?a.job+':'+a.area:a.job;
 const currentInMenu=jobs.some(([key])=>key===current)&&!(a.job==='quarter'&&['left','right'].includes(a.area));
 const deepArea=false;
 let description=a.job==='blank'?'Choose an assignment to draw this defender’s play art.':explanations[a.job];
 if(isSafety&&a.job==='third')description=a.area==='middle'?'Protect the deep middle.':'Protect the deep '+(p[1]<50?'left':'right')+' side automatically.';
 pane.innerHTML='<div class="nm-editor-head"><div><h3 id="'+uid+'-popup-title">'+selected+' <span class="nm-sub">· '+p[4]+'</span></h3></div><button type="button" data-close aria-label="Close '+selected+' assignment">Close</button></div><div class="nm-grid"><label class="nm-wide">Assignment<select data-edit="job">'+(currentInMenu?'':'<option value="base" selected>'+esc(a.job==='blank'?'Choose assignment':'Base call · '+assignmentLabel(a))+'</option>')+menu(jobs,currentInMenu?current:'base')+'</select></label>'+(deepArea?'<label class="nm-wide">Deep area<select data-edit="area">'+menu(a.job==='third'?[['left','Left third'],['middle','Middle third'],['right','Right third']]:a.job==='half'?[['left','Left half'],['right','Right half']]:[['left','Left outside quarter'],['middle','Left inside quarter'],['innerRight','Right inside quarter'],['right','Right outside quarter']],a.area)+'</select></label>':'')+(isDB&&a.job==='man'?'<label class="nm-wide">Man leverage<select data-edit="shade">'+menu([['default','Default'],['inside','Inside'],['outside','Outside']],a.shade)+'</select></label>':'')+'</div>'+(isSafety?'<div class="nm-safety-align"><div class="nm-sub">Safety alignment</div><div class="nm-align-buttons" role="group" aria-label="Safety alignment">'+[['default','Default'],['pinch','Pinch'],['spread','Spread'],['wide','Wide']].map(([v,l])=>'<button type="button" data-safety-width="'+v+'" aria-pressed="'+(state.team.sWidth===v)+'">'+l+'</button>').join('')+'</div></div>':'')+'<p class="nm-selected-desc">'+description+'</p>'+(state.template==='blank'&&a.job!=='blank'?'<button type="button" data-clear-art>Clear this defender’s art</button>':'');
 pane.querySelectorAll('[data-edit]').forEach(el=>el.addEventListener('change',()=>{
  const field=el.dataset.edit,value=el.value;
  if(field==='job'&&!jobs.some(([v])=>v===value))return;
  open=false;
  mutate(()=>{
   const a=state.a[selected];
   if(field==='job'&&value.startsWith('third_')){a.job='third';a.area=value==='third_middle'?'middle':p[1]<50?'left':'right';}
   else if(field==='job'&&value.includes(':')){const [job,area]=value.split(':');a.job=job;a.area=area;}
   else a[field]=value;
   if(field==='job'){
    a.shade='default';a.custom=true;
    if(a.job==='half')a.area=p[1]<50?'left':'right';
    if(a.job==='quarter')a.area=p[1]<50?'middle':'innerRight';
    if(p[3]!=='dl'&&['curl','hook','hard','cloud','soft','seam','vertical','middle','rec3'].includes(a.job))a.area=underneathArea(p,state.template,a.job);
    if(a.job==='half'&&!['left','right'].includes(a.area))a.area=p[1]<50?'left':'right';
    if(a.job==='third'&&a.area==='innerRight')a.area='right';
   }
  });
  closeEditor(true);
 }));
 pane.querySelectorAll('[data-safety-width]').forEach(b=>b.addEventListener('click',()=>{
  const value=b.dataset.safetyWidth;mutate(()=>state.team.sWidth=value);
  pane.querySelector('[data-safety-width="'+value+'"]').focus();
 }));
 pane.querySelector('[data-clear-art]')?.addEventListener('click',()=>{open=false;mutate(()=>{state.a[selected]={job:'blank',area:p[1]<50?'left':'right',shade:'default'};});closeEditor(true);});
 pane.querySelector('[data-close]').addEventListener('click',()=>closeEditor(true));
 placeEditor();
}
function roster(){const list=app.querySelector('.nm-roster');list.innerHTML=players.map(([id])=>'<button type="button" data-roster="'+id+'" aria-pressed="'+(id===selected)+'"><strong>'+id+'</strong><span>'+esc(assignmentLabel(state.a[id]))+'</span></button>').join('');list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.roster;open=true;refresh();}));}
function review(){app.querySelector('.nm-review').innerHTML='<h3>Assignment checklist</h3><div class="nm-review-list">'+players.map(([id])=>'<div class="nm-review-line"><b>'+id+'</b><span>'+esc(assignmentLabel(state.a[id]))+(state.a[id].shade!=='default'?' · '+state.a[id].shade+' leverage':'')+'</span></div>').join('')+'</div><div class="nm-sub">'+Object.entries(state.team).filter(([,v])=>v!=='default'&&v!=='none').map(([k,v])=>({cbDepth:'Outside CB depth',sDepth:'Safety depth',cbWidth:'Outside CB width',sWidth:'Safety width',show:'Show blitz'}[k])+': '+(k.endsWith('Depth')?v+' yards':v)).join(' · ')+'</div>';}
function refresh(){
 const reference=app.querySelector('.nm-reference'),art=EXAMPLE_ART[formation+'|'+state.template];reference.hidden=!art;
 if(art){const img=reference.querySelector('img');if(img.getAttribute('src')!==art.image){reference.open=false;img.src=art.image;img.alt=formation+' — '+names[state.template]+' original play art';}reference.querySelector('a').href=art.source;}
app.querySelector('.nm-report').href=buildBugReportUrl(state,names[state.template]);app.querySelector('.nm-family').value=familyOf(formation);app.querySelector('.nm-formation-select').innerHTML=menu(formationMenu(),formation);draw();editor();roster();review();app.querySelectorAll('[data-team]').forEach(el=>{el.value=displayedState().team[el.dataset.team];el.disabled=comparing;});app.querySelectorAll('[data-zone]').forEach(el=>{el.value=displayedState().zones[el.dataset.zone];el.disabled=comparing;});refreshFront();app.querySelector('.nm-view').value=state.view;app.querySelector('.nm-template').innerHTML=menu(callMenu().some(([k])=>k===state.template)?callMenu():[[state.template,names[state.template]+' (saved)'],...callMenu()],state.template);const team=app.querySelector('.nm-team'),rosterEl=app.querySelector('.nm-roster'),editorEl=app.querySelector('.nm-editor'),reviewEl=app.querySelector('.nm-review');if(layout==='board'){team.hidden=tab!=='team';team.open=tab==='team';rosterEl.hidden=tab!=='players';editorEl.hidden=tab!=='players'||!open;app.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));}if(layout==='guided'){rosterEl.hidden=step!==0;editorEl.hidden=step!==0;team.hidden=step!==1;team.open=step===1;reviewEl.hidden=step!==2;app.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===step)));app.querySelector('[data-action=back]').disabled=step===0;app.querySelector('[data-action=next]').textContent=step===0?'Next · Alignment':step===1?'Next · Review':'Back to assignments';}root.querySelectorAll('.nm-app button,.nm-app select,.nm-app summary').forEach(e=>e.classList.add('cursor-interaction'));}
function savedRender(){app.querySelector('.nm-saved-count').textContent='('+saved.length+')';app.querySelector('.nm-saved-list').innerHTML=saved.length?saved.map((s,i)=>'<div class="nm-save-item"><span>'+esc(s.name)+'</span><div class="nm-inline"><button type="button" data-load="'+i+'">Load</button><button type="button" data-delete="'+i+'" aria-label="Delete '+esc(s.name)+'">Delete</button></div></div>').join(''):'<div class="nm-empty">Saved macros stay on this device.</div>';app.querySelectorAll('[data-load]').forEach(b=>b.addEventListener('click',()=>{const savedMacro=saved[Number(b.dataset.load)];switchFormation(savedMacro.state.formation);mutate(()=>state=clone(savedMacro.state));app.querySelector('.nm-name').value=savedMacro.name;app.querySelector('.nm-status').textContent='Saved macro loaded.';}));app.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{saved.splice(Number(b.dataset.delete),1);savedRender();persist();}));}
const drafts=persisted.drafts,undoByFormation={},namesByFormation={};
function switchFormation(next){
 if(next===formation)return;
 drafts[formation]=clone(state);undoByFormation[formation]=history;namesByFormation[formation]=app.querySelector('.nm-name').value;
 formation=next;players=formations[formation];state=clone(drafts[formation]||preset(defaultCall()));history=undoByFormation[formation]||[];selected=players[0][0];open=false;comparing=false;
 buildMarkers();app.querySelector('.nm-name').value=namesByFormation[formation]||formation+' · My Macro';refresh();persist();
}
function refreshFront(){
 const shown=displayedState(),plan=app.artLayout.stunt;
 const select=app.querySelector('[data-stunt]');select.value=shown.stunt;select.disabled=comparing||!supportsStunts();
 app.querySelectorAll('[data-front]').forEach(el=>{el.value=shown.front[el.dataset.front];el.disabled=comparing||(el.dataset.front==='attack'&&shown.stunt!=='none');});
 app.querySelector('.nm-stunt-note').textContent=shown.stunt==='none'?'':stuntNotes[plan.type];
 const messages=[];
 if(!supportsStunts())messages.push('Stunt diagrams for this front are not available in this Beta.');
 if(plan.conflicts.length)messages.push('Stunt paused: '+plan.conflicts.join(', ')+' must rush without contain for these illustrated paths.');
 if(shown.stunt!=='none')messages.push('The stunt controls rush direction; Point of attack is held aside.');
 const containIDs=players.filter(p=>isOutsideLOS(p)&&(shown.front.contain==='both'||shown.front.contain===(p[1]<50?'left':'right'))&&!['rush','standardRush'].includes(shown.a[p[0]].job)).map(p=>p[0]);
 if(containIDs.length)messages.push('Contain needs a rushing edge: '+containIDs.join(', ')+'.');
 app.querySelector('.nm-front-message').textContent=messages.join(' ');
 const feedback=app.querySelector('.nm-field-feedback');
 feedback.hidden=shown.stunt==='none';
 feedback.textContent=plan.conflicts.length?'Stunt not drawn: '+plan.conflicts.join(', ')+' has coverage or contain. Restore Rush or Blitz and turn off that edge’s contain to view the stunt.':shown.view==='alignment'?'Pre-snap view hides rush arrows. Select Assignments to see your stunt.':(stuntMenu.find(([key])=>key===shown.stunt)?.[1]||'')+' · rush paths shown';
}
app.querySelector('[data-stunt]').addEventListener('change',e=>{closeEditor();mutate(()=>{state.stunt=e.target.value;if(state.stunt!=='none')state.view='assignments';});});
app.querySelectorAll('[data-front]').forEach(el=>el.addEventListener('change',()=>mutate(()=>state.front[el.dataset.front]=el.value)));
app.querySelector('.nm-family').addEventListener('change',e=>switchFormation(Object.keys(formations).find(n=>familyOf(n)===e.target.value)));
app.querySelector('.nm-formation-select').addEventListener('change',e=>switchFormation(e.target.value));
app.addEventListener('pointerdown',e=>{keyboardMode=false;if(open&&!e.target.closest('.nm-editor,.nm-player'))closeEditor();});
app.addEventListener('keydown',e=>{keyboardMode=true;if(open&&e.key==='Escape'){e.preventDefault();closeEditor(true);}});
app.querySelectorAll('[data-zone]').forEach(el=>el.addEventListener('change',()=>mutate(()=>state.zones[el.dataset.zone]=el.value)));
app.querySelectorAll('[data-compare]').forEach(b=>b.addEventListener('click',()=>{closeEditor();comparing=b.dataset.compare==='base';refresh();}));
app.querySelector('.nm-template').addEventListener('change',e=>mutate(()=>state=preset(e.target.value)));
app.querySelector('.nm-view').addEventListener('change',e=>{state.view=e.target.value;draw();refreshFront();persist();});
app.querySelectorAll('[data-team]').forEach(el=>el.addEventListener('change',()=>mutate(()=>state.team[el.dataset.team]=el.value)));
app.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;refresh();}));
app.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.step);refresh();}));

app.querySelector('[data-action=reset]').addEventListener('click',()=>mutate(()=>state=preset(state.template)));
app.querySelector('[data-action=back]')?.addEventListener('click',()=>{step=Math.max(0,step-1);refresh();});
app.querySelector('[data-action=next]')?.addEventListener('click',()=>{step=(step+1)%3;refresh();});
app.querySelector('[data-action=save]').addEventListener('click',()=>{const status=app.querySelector('.nm-status'),name=app.querySelector('.nm-name').value.trim();if(!name){status.textContent='Give your macro a name first.';return;}if(saved.length>=50){status.textContent='You have 50 saved macros. Delete one before saving another.';return;}saved.push({name,state:clone(state)});savedRender();app.querySelector('.nm-saved').open=true;status.textContent=persist()?'Macro saved on this device.':'Macro kept for this visit only; device storage is unavailable.';});
function persist(){
 drafts[formation]=clone(state);
 const ok=writePlayArtStorage({current:state,saved,drafts});
 const notice=app.querySelector('.nm-storage-notice');notice.hidden=ok;
 notice.textContent=ok?'':'This browser could not save your setup. Keep this page open to retain your changes.';
 return ok;
}
const resize=new ResizeObserver(entries=>{const next=entries[0].contentRect.width;if(next>0){width=next;draw();placeEditor();}});resize.observe(app.querySelector('.nm-field'));refresh();savedRender();
return {destroy(){persist();resize.disconnect();},getMenu:id=>clone(positionMenus[menuGroup(players.find(p=>p[0]===id))]),getState:()=>clone(state),getLayout:()=>clone(app.artLayout),switchFormation,counts,select:id=>{selected=id;open=true;refresh();},getSaved:()=>clone(saved)};
}
const apps=Array.from(root.querySelectorAll('.nm-app')).map(createApp);
return { apps, destroy(){apps.forEach(app=>app.destroy());root.replaceChildren();} };
}