// Public descriptions establish check intent, not exact stock-play/player mappings.
// Selectable menus follow The Gaming Tailgate CFB27 PDF, pp. 5–7.
// Exact timing, thresholds and unresolved exchanges remain schematic.
export const COVERAGE_CHECK_SOURCES = {
  official: 'https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay',
  menus: 'https://www.thegamingtailgate.com/CFB27DefensiveCoachAdjustmentsNew.pdf',
  previous: 'https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/',
};
export const CHECK_SCHEMES = [
  ['cover1','Cover 1 Man'],['twoMan','Cover 2 Man'],['cover3','Cover 3 Match'],['quarters','Quarters'],['palms','Palms'],['cover6','Cover 6 · quarters side'],
];
export const OFFENSIVE_LOOKS = [
  {id:'bunch',label:'Bunch right',type:'bunch'}, {id:'bunchTight',label:'Bunch tight',type:'bunch'},
  {id:'stack',label:'Stack',type:'stack'}, {id:'stackTight',label:'Stack tight',type:'stack'},
  {id:'trips',label:'Trips wide',type:'trips'}, {id:'tripsTight',label:'Trips compressed',type:'trips'},
  {id:'single',label:'Trips · isolated receiver side',type:'single'}, {id:'singleTight',label:'Trips · tight isolated receiver',type:'single'},
  {id:'spread',label:'Spread 2×2 · base teaching',type:'base'},
];
const rule=(label,summary,read,tradeoff)=>({label,summary,read,tradeoff});
export const CHECK_RULES = {
  lock:rule('Lock','Retain the initial receiver matchup through the release.','Track your assigned receiver through traffic; no automatic exchange.','Crossing releases can force defenders through rubs.'),
  combo:rule('Combo','Distribute the stacked releases between the two covering defenders.','Read the inside/outside release rather than blindly chasing through the stack.','A late or mistaken exchange can leave a receiver uncovered.'),
  pointCombo:rule('Point Combo','Keep the point receiver locked; distribute the other bunch releases.','Identify the point first. The two off-point matchups can exchange.','The locked point receiver still creates a one-on-one matchup.'),
  seam:rule('Seam','Use the base Cover 3 match reads on vertical and seam releases.','Corners read vertical threats; seam and hook defenders distribute underneath releases.','Short breaks and route combinations change who carries each receiver.'),
  quarters:rule('Quarters','Read the inside receiver before distributing vertical and underneath routes.','The corner handles the outside vertical; the safety reads the inside vertical.','A flat release and a vertical release demand different responses.'),
  palms:rule('Palms','Make the corner’s response depend on the inside receiver.','A quick out by #2 can bring the corner down while the safety covers #1 deep.','An aggressive flat response leaves the safety with a deeper responsibility.'),
  box:rule('Box','Organize bunch coverage around four release directions.','Account for deep outside, deep inside, short outside, and short inside.','Receivers can enter different areas after their releases.'),
  bingo:rule('Bingo','Add a conditional outside-receiver lock to the bunch distribution.','If #1 stays outside, the corner can lock him. An inside release restores Box distribution.','Do not chase the inside release as though the outside lock were unconditional.'),
  skate:rule('Skate','Expand underneath spacing toward the bunch.','Widen toward the short outside threats while retaining deep coverage.','The widened underneath structure creates different inside windows.'),
  skinny:rule('Skinny','Distribute vertical and outside releases using match reads.','Read #2’s release and #3’s route; a coverage name alone does not assign every branch.','Carry decisions depend on the actual route distribution.'),
  skinnyMeg:rule('Skinny Meg','Use the strong-side match structure with a locked isolated receiver away from it.','The backside corner follows the lone receiver rather than waiting for a depth trigger.','The locked backside matchup has less freedom to help elsewhere.'),
  stress:rule('Stress','Space the deep defenders when the trips release is all vertical.','Check that all three trips receivers release vertically. Otherwise use the normal Quarters reads.','A vertical tendency alone does not activate the all-vertical branch.'),
  stubbie:rule('Stubbie','Lock the outside trips receiver and distribute the two inside receivers.','The corner owns #1; three other roles sort #2 and #3, including their quick-out/vertical branches.','The locked outside matchup still needs to hold up.'),
  stump:rule('Stump','Use the trips distribution with a short-#1 zone-off branch.','When #1 stays short, C and N release their locks and defend space. Otherwise use the Stubbie reads.','The guide gives roughly six yards, not a validated exact trigger or every subsequent exchange.'),
  solo:rule('Solo','Lock the isolated receiver with the backside corner and free safety help toward trips.','Confirm the single-receiver side before applying the poach idea.','The isolated receiver faces a more independent corner matchup.'),
  soloCut:rule('Solo Cut','Use the backside safety on the isolated receiver’s short inside route.','The cut is conditional on the short inside break; it is not a permanent assignment swap.','Other releases require the remaining coverage structure.'),
  zoneIt:rule('Zone It','Replace the matching behavior with spot-drop zone responsibilities.','Defend the assigned area rather than following the first receiver through it.','Receivers can settle between zones; this does not create man matchups.'),
};
const split={stack:['quarters','zoneIt'],bunch:['box','bingo','zoneIt'],trips:['quarters','stress','zoneIt'],single:['solo','soloCut','quarters'],base:['quarters','zoneIt']};
export const CHECK_MENUS = {
  cover1:{stack:['lock','combo'],bunch:['lock','pointCombo'],base:['lock']},
  twoMan:{stack:['lock','combo'],bunch:['lock','pointCombo'],base:['lock']},
  cover3:{stack:['seam','zoneIt'],bunch:['skate','skinny','skinnyMeg','zoneIt'],trips:['skinny','skate','skinnyMeg','zoneIt'],base:['seam','zoneIt']},
  quarters:split,
  palms:{...split,stack:['palms','zoneIt'],trips:['stubbie','stump','zoneIt'],base:['palms','zoneIt']},
  cover6:{stack:['quarters','palms','zoneIt'],bunch:split.bunch,trips:['stubbie','stump','zoneIt'],base:['quarters','zoneIt']},
};
export function getCheckOptions(scheme,lookId){const look=OFFENSIVE_LOOKS.find(l=>l.id===lookId);return CHECK_MENUS[scheme]?.[look?.type]||[];}
export function getCheckDefault(scheme,lookId){
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  return type==='base'?null:getCheckOptions(scheme,lookId)[0]||null;
}
export function getCheckRule(scheme,check){
  // No back-door access to a check missing from this scheme's supported menus.
  return Object.values(CHECK_MENUS[scheme]||{}).some(ids=>ids.includes(check))?CHECK_RULES[check]:null;
}
export const RELEASE_PATTERNS = [
  ['verticals','All vertical'],['out','Inside receiver to flat'],['cross','Crossing releases'],['shortOne','Outside receiver short inside'],['threeOut','#3 to the flat'],['isolatedShort','Isolated X short inside'],['twoIn','#2 short inside'],['threeIn','#3 short inside'],['shortOut','#1 short outside'],['rbFlatDrag','RB flat / #2 drag'],
];
export function receiverRoutes(lookId,pattern){
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  const tight=/Tight/.test(lookId), bunch=type==='bunch',stack=type==='stack';
  const xs=bunch?(tight?[77,70,63]:[84,75,66]):stack?(tight?[72,72]:[84,84]):type==='trips'&&tight?[76,65,54]:[90,70,54];
  const starts=xs.map((x,i)=>({id:String(i+1),x,y:bunch&&i===1?224:stack&&i===0?224:stack?252:242}));
  if(type==='base'){starts.splice(2);starts.push({id:'X1',x:10,y:240},{id:'X2',x:27,y:240});}
  // Receiver numbering is local to the focus side, counted outside-in; P is #2 in bunch.
  const routes=starts.map((r,i)=>({...r,endX:(stack?[r.x+4,r.x-16]:bunch?[90,73,55]:[])[i]??r.x,endY:60+(i%3)*20}));
  for(const r of routes){if(pattern==='out'&&r.id==='2'){r.endX=96;r.endY=200;}if(pattern==='threeOut'&&r.id==='3'){r.endX=95;r.endY=202;}if(pattern==='shortOne'&&r.id==='1'&&type!=='single'){r.endX=35;r.endY=196;}if(pattern==='cross'&&r.id==='1'){r.endX=40;r.endY=140;}if(pattern==='cross'&&r.id===String(stack?2:3)){r.endX=93;r.endY=190;}}
  for(const r of routes){
    if(pattern==='twoIn'&&r.id==='2'){r.endX=42;r.endY=185;}
    if(pattern==='threeIn'&&r.id==='3'){r.endX=40;r.endY=185;}
    if(pattern==='shortOut'&&r.id==='1'){r.endX=96;r.endY=190;}
    if(['shortOne','shortOut'].includes(pattern)&&r.id==='1'&&type!=='single')r.shortForStump=true;
    if(pattern==='rbFlatDrag'&&r.id==='2'){r.endX=35;r.endY=185;}
    if(pattern==='rbFlatDrag'&&r.id==='3'){r.x=50;r.y=254;r.endX=95;r.endY=202;r.position='RB';}
  }
  if(type!=='base')routes.push({id:'X',x:lookId==='singleTight'?28:10,y:240,endX:(pattern==='shortOne'&&type==='single'||pattern==='isolatedShort')?42:lookId==='singleTight'?28:10,endY:(pattern==='shortOne'&&type==='single'||pattern==='isolatedShort')?196:65});
  return routes;
}
// Preserve receiver IDs across the animation while resolving release lanes.
// Only eligible match roles consume this distribution; fixed locks stay intact.
export function matchReleaseDistribution(routes,check){
  const focus=routes.filter(r=>['1','2','3'].includes(r.id));
  const originalOne=focus.find(r=>r.id==='1');
  let one=originalOne;
  // A check that locks #1 cannot trade him away. In exchange-based checks,
  // replace an outside receiver releasing short inside with the next outside
  // vertical, then distribute the remaining releases outside-in.
  if(focus.length===3&&!['stubbie','stump'].includes(check)&&originalOne.endY>120&&originalOne.endX<originalOne.x){
    one=focus.filter(r=>r.endY<=120).sort((a,b)=>b.endX-a.endX)[0]||originalOne;
  }
  const pair=focus.filter(r=>r!==one).sort((a,b)=>b.endX-a.endX||Number(a.id)-Number(b.id));
  return {one,two:pair[0],three:pair[1],order:Object.fromEntries([one,...pair].filter(Boolean).map((r,i)=>[r.id,String(i+1)]))};
}
// Role-based outcomes. Labels and animation consume this same release decision.
// These examples do not claim to reproduce every route exchange in the game.
export function checkResponsibilities(scheme,check,lookId,pattern){
  if(!getCheckOptions(scheme,lookId).includes(check))return null;
  const routes=receiverRoutes(lookId,pattern),type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  const get=id=>routes.find(r=>r.id===id),vertical=r=>!!r&&r.endY<=120,out=r=>!!r&&!vertical(r)&&r.endX>r.x;
  const focus=routes.filter(r=>['1','2','3'].includes(r.id)),one=get('1'),two=get('2'),three=type==='base'?null:get('3');
  const distributed=matchReleaseDistribution(focus,check),releaseOne=distributed.one,releaseTwo=distributed.two,releaseThree=distributed.three;
  const result={corner:{label:'Strong corner',zone:[88,75],text:'Read deep outside; no receiver has been declared.'},safety:{label:['cover1','cover3'].includes(scheme)?'Middle safety':'Strong safety',zone:['cover1','cover3'].includes(scheme)?[50,48]:[62,62],text:'Retain deep help and read the remaining threats.'},flat:{label:'Outside underneath',zone:[88,193],text:'Read the short outside window.'},hook:{label:'Inside underneath',zone:[52,177],text:'Read the short inside window.'},backCorner:{label:'Backside corner',zone:[12,85],text:'Read the isolated receiver.'},backSafety:{label:'Backside safety',zone:[30,62],text:'Retain weak-side help.'}};
  const assign=(role,target,text,mode='carry')=>Object.assign(result[role],{target,text,mode});
  const space=(role,text,zone)=>{delete result[role].target;Object.assign(result[role],{text,mode:'zone',...(zone?{zone}:{})});};
  const poach=(role)=>{delete result[role].target;Object.assign(result[role],{text:'Help toward strong-side #3; the separate trips check controls the final exchange.',mode:'poach',zone:role==='backCorner'?[54,94]:[55,80]});};
  const quarters=()=>{
    if(vertical(releaseOne))assign('corner',releaseOne.id,'Carry the outside vertical after distributing the releases.');
    if(vertical(releaseTwo))assign('safety',releaseTwo.id,'Take the vertical in the #2 release lane.');
    else if(releaseTwo)assign('flat',releaseTwo.id,'Take the short route in the #2 release lane.');
    if(releaseThree)assign('hook',releaseThree.id,'Take the receiver finishing in the #3 release lane, short or vertical; do not keep the original #3 when the releases exchange.');
  };
  const stubbie=()=>{
    assign('corner','1','Keep #1 locked through this release.');
    if(vertical(releaseTwo)||out(releaseTwo))assign('flat',releaseTwo.id,'Take the outside or vertical route in the #2 release lane.');
    if(vertical(releaseThree))assign('safety',releaseThree.id,'Carry the vertical in the #3 release lane.');
    else if(releaseThree)assign('hook',releaseThree.id,'Take the short receiver entering the #3 release lane.');
  };
  if(check==='zoneIt'){
    for(const id of Object.keys(result))space(id,'Defend the zone area; let receivers pass through without a man carry.');
  }else if(type==='single'){
    if(check==='quarters'){
      // Keep BOTH roles on the isolated side. The guide does not specify a
      // universal double-team/carry on every release, so show safety help as help.
      assign('backCorner','X','Play the isolated-side receiver with safety help; no poach.');
      assign('backSafety','X','Stay above the isolated-side receiver; no strong-side poach.','bracket');
    }else if(check==='soloCut'&&pattern==='shortOne'){
      assign('backSafety','X','Take the short inside break; the corner is freed to help away.');poach('backCorner');
    }else {assign('backCorner','X','Stay with the isolated receiver; the safety can help away.');poach('backSafety');}
  }else if(['lock','combo','pointCombo'].includes(check)){
    assign('corner','1','Stay with the assigned outside receiver.');assign('flat','2','Stay with the assigned inside receiver.');
    if(three)assign('hook','3','Stay with the third receiver.');
    if(check==='combo'||check==='pointCombo'){
      const pair=check==='combo'?['1','2']:['1','3'];
      const outside=[...focus].filter(r=>pair.includes(r.id)).sort((a,b)=>b.endX-a.endX)[0].id;
      const inside=pair.find(id=>id!==outside);
      assign('corner',outside,'Read the release and take the outside route.');assign(check==='combo'?'flat':'hook',inside,'Read the release and take the inside route.');
      if(check==='pointCombo')assign('flat','2','Keep point receiver #2 locked; exchange only the off-point pair.');
    }
  }else if(['box','bingo'].includes(check)){
    const locked=check==='bingo'&&one.endX>=one.x;
    if(locked)assign('corner','1','Keep #1 locked while his release stays outside.');
    const groups={corner:[],safety:[],flat:[],hook:[]};
    for(const r of focus.filter(r=>!locked||r.id!=='1'))groups[vertical(r)?(r.endX>=80?'corner':'safety'):(r.endX>=80?'flat':'hook')].push(r);
    for(const [role,rs]of Object.entries(groups)){
      if(result[role].target)continue;
      const area=({corner:'deep outside',safety:'deep inside',flat:'short outside',hook:'short inside'})[role];
      result[role].text=`Read the ${area} release. `+(rs.length>1?'Multiple routes enter this responsibility; the exchange needs confirmation.':'No match declared yet.');
      if(rs.length===1)assign(role,rs[0].id,`Match #${rs[0].id} entering the ${area} responsibility in this example.`);
    }
    // User-confirmed Box all-vertical distribution: C outside, S next, H
    // innermost. The hook carries the additional inside vertical instead of
    // treating both routes as an unresolved safety-zone collision.
    if(groups.safety.length===2&&!result.hook.target){
      const [outer,inner]=[...groups.safety].sort((a,b)=>b.endX-a.endX);
      assign('safety',outer.id,'Take the outer of the two deep-inside releases.');
      assign('hook',inner.id,'Carry the innermost deep release (#3); the safety takes the next receiver outside.');
    }
  }else if(check==='skate'){
    if(vertical(one))assign('corner','1','Retain the outside deep threat.');
    space('flat','Widen toward the strong-side short throw.',[92,190]);space('hook','Widen the underneath support toward the receiver cluster.',[68,174]);
  }else if(['seam','skinny','skinnyMeg'].includes(check)){
    if(vertical(releaseOne))assign('corner',releaseOne.id,'Carry the outside vertical after distributing the releases.');
    if(vertical(releaseTwo)||out(releaseTwo))assign('flat',releaseTwo.id,vertical(releaseTwo)?'Carry the receiver in the #2 release lane up the seam.':'Take the outside release; follow the distribution, not the original receiver number.');
    if(releaseThree)assign('hook',releaseThree.id,'Take the receiver entering the #3 release lane, including a short inside drag.');
    if(check==='skinnyMeg')assign('backCorner','X','Keep the isolated receiver locked, including short routes.');
  }else if(['stubbie','stump'].includes(check)){
    stubbie();
    if(check==='stump'&&one.shortForStump){space('corner','Short #1 triggers zone-off: release the lock and defend outside space.');space('flat','Short #1 triggers zone-off: defend underneath space rather than carry #2.');}
  }else{
    quarters();
    if(check==='palms'&&out(two)){
      assign('corner','2','Drive the #2 outside break.');delete result.flat.target;result.flat.mode='read';result.flat.text='Keep underneath support after the corner takes #2.';
      delete result.safety.target;result.safety.mode='read';
      if(vertical(one))assign('safety','1','Stay above #1 after the corner takes #2.');
      else result.safety.text='Neither receiver stays vertical; the remaining exchange needs confirmation.';
    }
    if(check==='stress'&&focus.length===3&&focus.every(vertical)){
      space('corner','All three are vertical: protect spaced deep outside area.');space('safety','All three are vertical: protect spaced deep inside area.');
    }
  }
  if(scheme==='cover3'){
    if(check!=='zoneIt'&&check!=='skinnyMeg'&&vertical(get('X')))assign('backCorner','X','Carry the backside vertical.');
    result.safety.zone=[50,48];delete result.safety.target;result.safety.text='Retain the deep middle in the three-deep structure.';
  }
  if(scheme==='cover6'){result.backCorner.zone=[12,195];result.backCorner.text='Cover 2 side: short outside responsibility.';result.backSafety.zone=[25,65];result.backSafety.text='Cover 2 side: deep-half help. This adjustment affects the quarters side.';}
  return result;
}
