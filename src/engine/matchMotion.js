import { CHECK_RULES, OFFENSIVE_LOOKS, getCheckOptions, receiverRoutes, checkResponsibilities } from '../data/coverageChecks.js';

const clamp = n => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
const mix = (a,b,t) => a.map((n,i)=>n+(b[i]-n)*t);
export const MOTION_ROLE_MARKS={corner:'C',flat:'N',hook:'H',safety:'S',backCorner:'c',backSafety:'s'};
export function getReleaseOptions(lookId){
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  return ['verticals','out','cross','shortOne',...(['bunch','trips'].includes(type)?['threeOut']:[]),...(['bunch','stack','trips'].includes(type)?['isolatedShort']:[])];
}
// The route knee is the early release, not a teleport to the final receiver location.
export function routePoint(route,progress){
  const t=clamp(progress),start=[route.x,route.y],end=[route.endX,route.endY];
  const knee=[route.x+(route.endX-route.x)*.38, Math.min(route.y-30,route.endY+(route.y-route.endY)*.65)];
  return t<=.4?mix(start,knee,t/.4):mix(knee,end,(t-.4)/.6);
}
export function buildMatchMotion(scheme,check,lookId,pattern){
  if(!getCheckOptions(scheme,lookId).includes(check)||!getReleaseOptions(lookId).includes(pattern))return null;
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  const routes=receiverRoutes(lookId,pattern),outcomes=checkResponsibilities(scheme,check,lookId,pattern);
  let ids=type==='single'?['backCorner','backSafety']:['corner','flat',...(!['stack','base'].includes(type)?['hook']:[]),'safety'];
  if(scheme==='cover3')ids.push('backCorner');
  if(['lock','combo','topHat','pointCombo'].includes(check)&&scheme!=='cover3')ids=ids.filter(id=>id!=='safety');
  const starts={corner:[88,174],flat:[77,204],hook:[48,185],safety:['cover1','cover3'].includes(scheme)?[50,58]:[65,72],backCorner:[12,175],backSafety:[29,72]};
  if(type==='stack'){starts.flat=[64,192];starts.corner=[90,158];}
  if(type==='single'&&/Tight/.test(lookId))starts.backCorner=[28,175];
  // Top Hat changes the starting matchup, rather than waiting for routes to cross.
  if(check==='topHat'){starts.corner=[88,174];starts.flat=[69,204];}
  const roles=ids.map(id=>{
    const outcome=outcomes[id],target=routes.find(r=>r.id===outcome.target);
    let mode=target?'carry':'read';
    if(check==='zoneIt'||['box','bingo'].includes(check)&&!target||check==='stress'&&pattern==='verticals')mode='zone';
    if(['triangle','pointTriangle'].includes(check)&&id==='safety')mode='bracket';
    if(check==='solo'&&id==='backSafety'||check==='soloCut'&&pattern==='shortOne'&&id==='backCorner')mode='poach';
    if(check==='skate'&&['flat','hook'].includes(id))mode='zone';
    const initial=check==='topHat'?(id==='corner'?'2':'1'):id==='corner'?'1':id==='flat'?'2':id==='hook'?'3':id==='backCorner'?'X':null;
    let read=CHECK_RULES[check].read;
    if(['pointCombo','pointTriangle'].includes(check))read=id==='flat'?'Keep the point receiver #2 locked.':id==='safety'?'Read the two off-point routes for bracket help.':'Watch #1 and #3. #1 goes '+(pattern==='cross'||pattern==='shortOne'?'inside':'up/outside')+'; #3 goes '+(pattern==='cross'||pattern==='threeOut'?'outside':'up/inside')+'.';
    if(check==='combo')read=scheme==='cover3'?'Front #1 belongs to C; rear #2 belongs to N. This is not the man Combo exchange.':'Read the inside and outside releases; do not chase the original alignment.';
    if(check==='palms')read=pattern==='out'?'#2 breaks outside. C jumps #2; S takes #1 deep.':'#2 stays vertical in this example. Keep the deep matching structure.';
    if(check==='stress')read=pattern==='verticals'?'All three go vertical: gain evenly spaced deep leverage.':'This is not all vertical: use the normal Quarters reads.';
    if(check==='soloCut')read=pattern==='shortOne'?'X breaks short inside: s cuts X; c is freed toward trips.':'X does not break short inside. Do not trigger the cut.';
    if(check==='zoneIt')read='Receivers move through your area. Drop to the landmark rather than attaching to one.';
    if(check==='bingo')read=['cross','shortOne'].includes(pattern)?'#1 releases inside: C returns to deep-outside Box rules.':'#1 stays outside: C locks #1; the other defenders retain Box rules.';
    const uncertain=/confirmation|depends|depend on/.test(outcome.text);
    return {id,mark:MOTION_ROLE_MARKS[id],label:['pointCombo','pointTriangle'].includes(check)&&id==='flat'?'Point defender':outcome.label,start:starts[id],zone:outcome.zone,target:target?.id,mode,uncertain,
      before:check==='topHat'?`Switched matchup: ${MOTION_ROLE_MARKS[id]} starts on #${initial}.`:check==='lock'?`Stay with ${initial==='X'?'X':'#'+initial} through the release.`:['pointCombo','pointTriangle'].includes(check)&&id==='flat'?'Lock #2, the point receiver.':CHECK_RULES[check].summary,
      read,after:outcome.text};
  });
  return {scheme,check,lookId,pattern,type,routes,roles,rule:CHECK_RULES[check]};
}
export function defenderPoint(scene,role,progress){
  const t=clamp(progress),target=scene.routes.find(r=>r.id===role.target),q=clamp((t-.12)/.4);
  // Both bracketing defenders stay visibly distinct; the safety remains above the route.
  const destination=target?(()=>{const p=routePoint(target,t);return[p[0]+(role.mode==='bracket'?-4:0),Math.max(32,p[1]-(role.mode==='bracket'?38:20))];})():role.zone;
  return mix(role.start,destination,q);
}
