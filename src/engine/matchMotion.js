import { OFFENSIVE_LOOKS, getCheckOptions, getCheckRule, receiverRoutes, checkResponsibilities } from '../data/coverageChecks.js';

const clamp = n => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
const mix = (a,b,t) => a.map((n,i)=>n+(b[i]-n)*t);
export const MOTION_ROLE_MARKS={corner:'C',flat:'N',hook:'H',safety:'S',backCorner:'c',backSafety:'s'};
export function getReleaseOptions(lookId){
  const type=OFFENSIVE_LOOKS.find(l=>l.id===lookId)?.type;
  if(type==='single')return ['verticals','shortOne'];
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
  const tripsVertical=routes.filter(r=>['1','2','3'].includes(r.id)).every(r=>r.endY<=120);
  const zoneScheme=!['cover1','twoMan'].includes(scheme);
  let ids=type==='single'?['backCorner','backSafety']:['corner','flat',...(!['stack','base'].includes(type)||zoneScheme?['hook']:[]),'safety'];
  if(scheme==='cover3'&&type!=='base')ids.push('backCorner');
  if(['lock','combo','topHat','pointCombo'].includes(check)&&scheme!=='cover3')ids=ids.filter(id=>id!=='safety');
  const receiverX=id=>routes.find(r=>r.id===id)?.x;
  const starts={corner:[Math.min(94,receiverX('1')+4),174],flat:[receiverX('2')-7,204],hook:[(receiverX('3')??54)-6,185],safety:['cover1','cover3'].includes(scheme)?[50,58]:[65,72],backCorner:[12,175],backSafety:[29,72]};
  if(type==='stack'){starts.flat=[receiverX('2')-20,192];starts.corner=[receiverX('1')+6,158];}
  if(type==='single'&&/Tight/.test(lookId))starts.backCorner=[28,175];
  const rule=getCheckRule(scheme,check);
  const roles=ids.map(id=>{
    const outcome=outcomes[id],target=routes.find(r=>r.id===outcome.target);
    let mode=target?'carry':'read';
    if(check==='zoneIt'||['box','bingo'].includes(check)&&!target||check==='stress'&&tripsVertical&&['corner','safety'].includes(id))mode='zone';
    if(['triangle','pointTriangle'].includes(check)&&id==='safety')mode='bracket';
    if(check==='solo'&&id==='backSafety'||check==='soloCut'&&pattern==='shortOne'&&id==='backCorner')mode='poach';
    if(check==='skate'&&['flat','hook'].includes(id))mode='zone';
    const initial=check==='topHat'?(id==='corner'?'2':'1'):id==='corner'?'1':id==='flat'?'2':id==='hook'?'3':id==='backCorner'?'X':null;
    let read=rule.read;
    if(['pointCombo','pointTriangle'].includes(check))read=id==='flat'?'Keep the point receiver #2 locked.':id==='safety'?'Read the two off-point routes for bracket help.':'Watch #1 and #3. #1 goes '+(pattern==='cross'||pattern==='shortOne'?'inside':'up/outside')+'; #3 goes '+(pattern==='cross'||pattern==='threeOut'?'outside':'up/inside')+'.';
    if(check==='combo')read=scheme==='cover3'?'Front #1 belongs to C; rear #2 belongs to N. This is not the man Combo exchange.':'Read the inside and outside releases; do not chase the original alignment.';
    if(check==='palms')read=routes.find(r=>r.id==='2')?.endY<=120?'#2 stays vertical in this example. Keep the deep matching structure.':'#2 breaks outside. C responds outside; S checks the remaining deep threat.';
    if(check==='stress')read=tripsVertical?'All three trips receivers go vertical: deep defenders gain spaced leverage.':'The trips releases are not all vertical: use the normal Quarters reads.';
    if(check==='soloCut')read=pattern==='shortOne'?'X breaks short inside: s cuts X; c is freed toward trips.':'X does not break short inside. Do not trigger the cut.';
    if(check==='zoneIt')read='Receivers move through your area. Drop to the landmark rather than attaching to one.';
    if(check==='bingo')read=['cross','shortOne'].includes(pattern)?'#1 releases inside: C returns to deep-outside Box rules.':'#1 stays outside: C locks #1; the other defenders retain Box rules.';
    let before=rule.summary;
    if(check==='topHat')before=`Switched matchup: ${MOTION_ROLE_MARKS[id]} starts on #${initial}.`;
    if(check==='lock')before=`Stay with ${initial==='X'?'X':'#'+initial} through the release.`;
    if(['pointCombo','pointTriangle'].includes(check))before={flat:'Lock #2, the point receiver.',corner:'Start outside the off-point pair (#1 and #3). Read their releases.',hook:'Start inside the off-point pair (#1 and #3). Read their releases.',safety:'Provide help above the off-point pair (#1 and #3).'}[id];
    const uncertain=/confirmation|depends|depend on/.test(outcome.text)||mode==='read';
    return {id,mark:MOTION_ROLE_MARKS[id],label:['pointCombo','pointTriangle'].includes(check)&&id==='flat'?'Point defender':outcome.label,start:starts[id],zone:outcome.zone,target:target?.id,mode,uncertain,
      before,read,after:outcome.text};
  });
  // Show an underneath read without fabricating a game-specific carry or exchange.
  const hook=roles.find(r=>r.id==='hook');
  if(hook&&!hook.target&&check!=='zoneIt'){
    hook.readTargets=routes.filter(r=>!r.id.startsWith('X')&&r.endY>120&&r.endX<r.x&&!roles.some(role=>role.target===r.id)).map(r=>r.id);
    if(hook.readTargets.length){
      const receivers=hook.readTargets.map(id=>'#'+id).join(', ');
      hook.read=`${receivers} breaks inside toward the underneath coverage. H reads this threat; the exact pickup is not confirmed.`;
      hook.after=`Underneath support for ${receivers}. H holds its area; a specific carry or handoff needs game confirmation.`;
    }
  }
  return {scheme,check,lookId,pattern,type,routes,roles,rule};
}
// Continuous, scrub-safe reveal: no clock-dependent CSS transition or sudden bubble.
export function responsibilityReveal(progress){const t=clamp((clamp(progress)-.12)/.28);return t*t*(3-2*t);}
export function responsibilityLandmark(role,progress){
  if(role.target)return null;
  const kind=role.mode==='zone'?'Zone area':role.mode==='poach'?'Help landmark':role.zone[1]<120?'Deep help / read':'Underneath read';
  return {kind,label:`${role.mark} · ${kind}`,opacity:responsibilityReveal(progress),area:role.mode==='zone'};
}
export function defenderPoint(scene,role,progress){
  const t=clamp(progress),target=scene.routes.find(r=>r.id===role.target),q=clamp((t-.12)/.4);
  // Both bracketing defenders stay visibly distinct; the safety remains above the route.
  const destination=target?(()=>{const p=routePoint(target,t);return[p[0]+(role.mode==='bracket'?-4:0),Math.max(32,p[1]-(role.mode==='bracket'?38:20))];})():role.zone;
  return mix(role.start,destination,q);
}
