// Public descriptions establish check intent, not exact stock-play/player mappings.
// Menu mappings are transcribed from the CFB-specific guide; Stump is reference-only.
export const COVERAGE_CHECK_SOURCES = {
  official: 'https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay',
  menus: 'https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/',
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
  topHat:rule('Top Hat','Change which defender starts on each stacked receiver.','Account for the front/back matchup switch before the snap.','A switched matchup is not the same as trading every route after the snap.'),
  triangle:rule('Triangle','Use a three-defender bracket around two receivers.','Two defenders distribute the pair; a safety helps on the deeper or side-breaking threat.','The extra help is committed to this pair.'),
  pointCombo:rule('Point Combo','Keep the point receiver locked; distribute the other bunch releases.','Identify the point first. The two off-point matchups can exchange.','The locked point receiver still creates a one-on-one matchup.'),
  pointTriangle:rule('Point Triangle','Layer four defenders over a three-receiver bunch.','Keep the point accounted for; bracket the other releases with safety support.','Extra help near the bunch reduces help available elsewhere.'),
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
  stump:rule('Stump','Related trips structure with additional support on short routes by #1.','Learn the contrast with Stubbie; do not assume it is offered in a CFB menu.','EA describes this concept broadly, but the CFB-specific menu source does not list it.'),
  solo:rule('Solo','Lock the isolated receiver with the backside corner and free safety help toward trips.','Confirm the single-receiver side before applying the poach idea.','The isolated receiver faces a more independent corner matchup.'),
  soloCut:rule('Solo Cut','Use the backside safety on the isolated receiver’s short inside route.','The cut is conditional on the short inside break; it is not a permanent assignment swap.','Other releases require the remaining coverage structure.'),
  zoneIt:rule('Zone It','Replace the matching behavior with spot-drop zone responsibilities.','Defend the assigned area rather than following the first receiver through it.','Receivers can settle between zones; this does not create man matchups.'),
};
const split={stack:['quarters','zoneIt','triangle'],bunch:['box','bingo','pointTriangle','zoneIt'],trips:['quarters','stress','zoneIt'],single:['solo','soloCut','quarters'],base:['quarters','zoneIt']};
export const CHECK_MENUS = {
  cover1:{stack:['lock','combo','topHat'],bunch:['lock','pointCombo'],base:['lock']},
  twoMan:{stack:['lock','combo','triangle','topHat'],bunch:['lock','pointCombo','pointTriangle'],base:['lock']},
  cover3:{stack:['seam','zoneIt','combo'],bunch:['skate','skinny','skinnyMeg','zoneIt'],trips:['skinny','skinnyMeg','zoneIt'],base:['seam','zoneIt']},
  quarters:split,
  palms:{...split,stack:['palms','triangle','zoneIt'],trips:['stubbie','zoneIt'],base:['palms','zoneIt']},
  cover6:{stack:split.stack,bunch:split.bunch,trips:['stubbie','zoneIt'],base:['quarters','zoneIt']},
};
export function getCheckOptions(scheme,lookId){const look=OFFENSIVE_LOOKS.find(l=>l.id===lookId);return CHECK_MENUS[scheme]?.[look?.type]||[];}
// The source does not name the resolved man-bunch default. Do not infer it
// from display order, or call a base teaching example an in-game menu default.
export function getCheckDefault(scheme,lookId){
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  if(type==='base'||(['cover1','twoMan'].includes(scheme)&&type==='bunch'))return null;
  return getCheckOptions(scheme,lookId)[0]||null;
}
export function getCheckRule(scheme,check){
  if(scheme==='cover3'&&check==='combo')return rule('Combo','Match the front and rear stack receivers with the deep-third and seam-flat roles.','The deep-third defender takes front #1; the seam-flat defender takes rear #2.','This front/rear assignment differs from the inside/outside exchange in man Combo.');
  return CHECK_RULES[check];
}
export const RELEASE_PATTERNS = [
  ['verticals','All vertical'],['out','Inside receiver to flat'],['cross','Crossing releases'],['shortOne','Outside receiver short inside'],['threeOut','#3 to the flat'],['isolatedShort','Isolated X short inside'],
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
  if(type!=='base')routes.push({id:'X',x:lookId==='singleTight'?28:10,y:240,endX:(pattern==='shortOne'&&type==='single'||pattern==='isolatedShort')?42:lookId==='singleTight'?28:10,endY:(pattern==='shortOne'&&type==='single'||pattern==='isolatedShort')?196:65});
  return routes;
}
// Role-based teaching outcomes. These are not exact player assignments from the game.
export function checkResponsibilities(scheme,check,lookId,pattern){
  const routes=receiverRoutes(lookId,pattern), type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  const has3=routes.some(r=>r.id==='3')&&type!=='base';
  const result={corner:{label:'Strong corner',zone:[88,75],text:'Keep deep outside leverage.'},safety:{label:['cover1','cover3'].includes(scheme)?'Middle safety':'Strong safety',zone:[62,62],text:['cover1','cover3'].includes(scheme)?'Provide deep middle help.':'Maintain deep inside help.'},flat:{label:'Outside underneath',zone:[88,193],text:'Account for the short outside release.'},hook:{label:'Inside underneath',zone:[52,177],text:'Read the short inside release.'},backCorner:{label:'Backside corner',zone:[12,85],text:'Handle the receiver away from the formation strength.'},backSafety:{label:'Backside safety',zone:[30,62],text:'Retain the weak-side coverage responsibility.'}};
  const assign=(role,target,text)=>Object.assign(result[role],{target,text});
  const pair=type==='stack'?['1','2']:['1','3'];
  const outside=[...routes].filter(r=>pair.includes(r.id)).sort((a,b)=>b.endX-a.endX)[0]?.id||'1',inside=pair.find(id=>id!==outside);
  if(check==='zoneIt'){for(const r of Object.values(result))r.text='Drop to your zone landmark. Pass receivers through; do not follow them across the field.';}
  else if(['lock','pointCombo','combo','topHat','triangle','pointTriangle'].includes(check)){
    const bunch=type==='bunch';
    assign('corner','1','Illustrative initial matchup: follow #1.');assign('flat','2',bunch?'Account for point receiver #2.':'Illustrative initial matchup: follow #2.');
    if(has3)assign('hook','3','Illustrative initial matchup: follow #3.');
    if(['combo','triangle'].includes(check)){assign('corner',scheme==='cover3'?'1':outside,scheme==='cover3'?'Take the front / on-ball receiver #1.':'Take the receiver releasing outside.');assign('flat',scheme==='cover3'?'2':inside,scheme==='cover3'?'Take the rear / off-ball receiver #2.':'Take the receiver releasing inside.');}
    if(check==='topHat'){assign('corner','2','Illustrative switched matchup: rear receiver.');assign('flat','1','Illustrative switched matchup: front receiver.');}
    if(['pointCombo','pointTriangle'].includes(check)){assign('flat','2','Lock the point receiver; do not join the off-point exchange.');assign('corner',outside,'Read the outside off-point release.');assign('hook',inside,'Read the inside off-point release.');}
    if(['triangle','pointTriangle'].includes(check)){const candidates=routes.filter(r=>r.id!=='X'&&(check!=='pointTriangle'||r.id!=='2'));const deep=[...candidates].sort((a,b)=>a.endY-b.endY)[0];assign('safety',deep.id,'Bracket the deeper release in this example.');}
  }else if(['box','bingo'].includes(check)){
    if(check==='bingo'&&!['cross','shortOne'].includes(pattern))assign('corner','1','#1 remains outside: use the outside lock branch.');
    else result.corner.text=check==='bingo'?'#1 goes inside: return to the deep-outside Box responsibility.':'Own the deep-outside quadrant; do not preselect a receiver.';
    result.safety.text='Own the deep-inside quadrant.';result.flat.text='Own the short-outside quadrant.';result.hook.text='Own the short-inside quadrant.';
    // Declare a match only when this schematic release has one unambiguous
    // receiver in that quadrant. Multiple verticals remain a read, not a guess.
    const groups={corner:[],safety:[],flat:[],hook:[]};
    for(const r of routes.filter(r=>['1','2','3'].includes(r.id))){
      const deep=r.endY<=120, outside=r.endX>=80;
      groups[deep?(outside?'corner':'safety'):(outside?'flat':'hook')].push(r);
    }
    for(const [role,candidates] of Object.entries(groups)){
      if(!result[role].target&&candidates.length===1){
        const r=candidates[0];
        assign(role,r.id,`Read the release, then match #${r.id} entering your ${role==='corner'?'deep outside':role==='safety'?'deep inside':role==='flat'?'short outside':'short inside'} responsibility in this example.`);
      }
    }
  }else{
    if(!['cross','shortOne'].includes(pattern))assign('corner','1','Carry the outside vertical release.');
    if(routes.find(r=>r.id==='2')?.endY<=120)assign('safety','2','Carry the inside vertical in this example.');else result.safety.text='No inside vertical: retain deep help and continue the coverage read.';
    const two=routes.find(r=>r.id==='2'),twoOut=two&&two.endY>120&&two.endX>two.x;
    if(twoOut){assign('flat','2','Take the inside receiver releasing outside.');delete result.safety.target;result.safety.text='No #2 vertical: maintain the applicable deep help/read.';}
    if(has3)result.hook.text='Read #3; carry decisions depend on its release and the called coverage.';
    if(check==='palms'&&twoOut){assign('corner','2','Read #2 out: jump the outside release in this branch.');if(routes.find(r=>r.id==='1')?.endY<=120)assign('safety','1','Cover the deeper outside receiver after the corner takes #2.');else{delete result.safety.target;result.safety.text='Neither receiver stays vertical: the exact distribution needs route-specific confirmation.';}delete result.flat.target;result.flat.text='Retain underneath support.';}
    if(check==='skate'){delete result.flat.target;result.flat.zone=[92,190];result.hook.zone=[68,174];result.flat.text='Expand toward the bunch-side quick throw.';result.hook.text='Widen toward the bunch while retaining the inside read.';}
    if(['seam','skinny','skinnyMeg'].includes(check)){delete result.safety.target;result.safety.text='Retain deep middle support in the three-deep structure.';const two=routes.find(r=>r.id==='2');if(two&&(two.endY<=120||two.endX>two.x))assign('flat','2',two.endY<=120?'Carry #2 up the seam.':'Match #2 releasing outside.');if(has3&&pattern==='threeOut'){result.hook.text='Read #3 releasing outside; the exact carry or exchange needs game confirmation.';}}
    if(check==='stress'&&routes.filter(r=>['1','2','3'].includes(r.id)).every(r=>r.endY<=120)){delete result.corner.target;delete result.safety.target;result.corner.text='All three release vertically: maintain spaced deep zone leverage.';result.safety.text='All three release vertically: distribute the deep space rather than chase.';}
    if(check==='stubbie'){assign('corner','1','Lock #1, including its short release.');if(routes.filter(r=>['2','3'].includes(r.id)).every(r=>r.endY<=120)){assign('flat','2','Both inside receivers vertical: carry #2.');assign('safety','3','Both inside receivers vertical: carry #3.');}else if(pattern==='out'){assign('flat','2','Read the quick out by #2.');assign('safety','3','Read #3 first; retain the remaining inside help.');}else if(pattern==='threeOut'){delete result.safety.target;delete result.flat.target;result.flat.text='Read #2 and #3; the detailed exchange for this release needs game confirmation.';result.safety.text='Read #3, then #2; the detailed exchange needs game confirmation.';}else{delete result.safety.target;result.safety.text='Read #3, then #2; this distribution needs route-specific confirmation.';}}
    if(['solo','soloCut','quarters'].includes(check)&&type==='single'){
      for(const key of ['corner','safety','flat','hook']){delete result[key].target;result[key].text='Strong-side responsibility is controlled by the separate trips check.';}
      if(check==='solo'){assign('backCorner','X','Lock the isolated receiver.');result.backSafety.zone=[55,80];result.backSafety.text='Free to help toward strong-side #3.';}
      else if(check==='soloCut'&&pattern==='shortOne'){assign('backSafety','X','Short inside break: use the cut branch.');result.backCorner.zone=[54,94];result.backCorner.text='Freed to help toward #3 in this branch.';}
      else{if(pattern==='verticals'||pattern==='out'||pattern==='cross'||pattern==='threeOut')assign('backCorner','X','Carry the isolated vertical in this example.');result.backSafety.text=check==='soloCut'?'No short inside break: retain help; do not force the cut.':'Standard Quarters support; no automatic poach.';}
    }
    if(check==='skinnyMeg')assign('backCorner','X','Lock the isolated receiver on every route.');
  }
  if(scheme==='cover3'&&check!=='zoneIt'&&check!=='skinnyMeg'){if(routes.find(r=>r.id==='X')?.endY<=120)assign('backCorner','X','Carry X after the vertical release in this example.');else result.backCorner.text='X breaks short inside: retain the deep-third read rather than forcing a man lock.';}
  if(scheme==='cover1'||scheme==='cover3'){result.safety.zone=[50,48];}
  if(scheme==='cover3'){delete result.safety.target;result.safety.text='Retain deep-middle support; this check does not turn the middle safety into a Quarters match defender.';}
  if(scheme==='cover6'){result.backCorner.zone=[12,195];result.backCorner.text='Cover 2 side: short outside responsibility.';result.backSafety.zone=[25,65];result.backSafety.text='Cover 2 side: deep-half help. The selected check changes the quarters side.';}
  return result;
}
