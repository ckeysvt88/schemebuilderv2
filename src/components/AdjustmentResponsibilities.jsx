import { useEffect, useRef, useState } from 'react';
import { CHECK_SCHEMES, OFFENSIVE_LOOKS, CHECK_RULES, CHECK_MENUS, RELEASE_PATTERNS, COVERAGE_CHECK_SOURCES, getCheckOptions, getCheckDefault } from '../data/coverageChecks.js';
import { buildMatchMotion, getReleaseOptions, routePoint, defenderPoint, responsibilityReveal, responsibilityLandmark } from '../engine/matchMotion.js';
import './formationTools.css';
import './matchMotion.css';

export function MotionPlayer({scene}){
  const [progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[follow,setFollow]=useState(scene.roles[0].id),[flipped,setFlipped]=useState(false);
  const field=useRef(null),[width,setWidth]=useState(360),[reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
  useEffect(()=>{const observer=new ResizeObserver(([e])=>setWidth(Math.max(200,e.contentRect.width)));observer.observe(field.current);return()=>observer.disconnect();},[]);
  const finished=progress>=1;
  useEffect(()=>{if(!playing||reduced||finished)return;let frame,last=null;function tick(now){if(last!==null){const delta=(now-last)*2/7500;setProgress(p=>Math.min(1,p+delta));}last=now;frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing,reduced,finished]);
  const running=playing&&progress<1&&!reduced,selected=scene.roles.find(r=>r.id===follow),phase=progress<.12?0:progress<.48?1:2;
  const px=x=>20+(width-40)*(flipped?100-x:x)/100,h=270;
  const leftLabel=scene.type==='single'?'Isolated side':scene.type==='base'?'Other side':'Backside',rightLabel=scene.type==='single'?'Trips side':'Focus side';
  const focusRoute=scene.routes.find(r=>r.id===selected.target);
  const landmark=responsibilityLandmark(selected,progress),reveal=responsibilityReveal(progress);
  const zoneRoles=scene.roles.filter(r=>r.mode==='zone');
  const underneath=scene.roles.find(r=>r.readTargets?.length);
  const text=phase===0?selected.before:phase===1?selected.read:selected.after;
  function scrub(n){setPlaying(false);setProgress(n);}
  return <>
    <div className="mm-follow"><label>Follow a defender<select aria-label="Follow a defender" value={follow} onChange={e=>setFollow(e.target.value)}>{scene.roles.map(r=><option key={r.id} value={r.id}>{r.mark} · {r.label}</option>)}</select></label></div>
    <div ref={field} className="ft-field mm-field"><svg viewBox={`0 0 ${width} ${h}`} role="img" aria-label={`${scene.rule.label}; ${['alignment','first steps','response'][phase]}; following ${selected.label}`}>
      <text x="12" y="18" fill="var(--color-text-2)" fontSize="11">{flipped?rightLabel:leftLabel}</text><text x={width-12} y="18" textAnchor="end" fill="var(--color-text-2)" fontSize="11">{flipped?leftLabel:rightLabel}</text>
      {[60,110,160,210].map(y=><line key={y} x1="10" x2={width-10} y1={y} y2={y} stroke="var(--color-border-subtle)"/>)}
      <line data-field-center="true" x1={px(50)} x2={px(50)} y1="28" y2="258" stroke="var(--color-text-2)" opacity=".4" strokeDasharray="3 5"/>
      <ellipse data-ball="true" cx={px(50)} cy="224" rx="3" ry="6" fill="var(--color-text-1)"/>
      <line x1="10" x2={width-10} y1="224" y2="224" stroke="var(--color-gold)"/><text x="12" y="240" fontSize="11" fill="var(--color-text-2)">LOS</text>
      {zoneRoles.map(r=><ellipse key={r.id} data-zone-owner={r.id} cx={px(r.zone[0])} cy={r.zone[1]} rx={Math.min(46,(width-40)*.14)} ry="28" opacity={scene.check==='zoneIt'?1:reveal} fill="var(--color-pass)" fillOpacity={.08+.07*reveal} stroke="var(--color-pass)" strokeOpacity={r.id===follow?.8:.4}><title>{r.mark} · Zone area</title></ellipse>) }
      {landmark&&<g data-landmark={landmark.kind} opacity={landmark.opacity}>
        <title>{landmark.label}</title>
      </g>}
      {scene.roles.flatMap(r=>[...(r.target?[{id:r.target,read:false}]:[]),...(r.readTargets||[]).map(id=>({id,read:true}))].map(link=>{
        const point=defenderPoint(scene,r,progress),receiver=routePoint(scene.routes.find(route=>route.id===link.id),progress);
        return <line key={`${r.id}-${link.id}`} data-responsibility={link.read?'read':r.mode==='bracket'?'bracket':'match'} data-owner={r.id} data-receiver={link.id} x1={px(point[0])} y1={point[1]} x2={px(receiver[0])} y2={receiver[1]} stroke="var(--color-pass)" strokeWidth={r.id===follow?2:1.5} opacity={reveal*(r.id===follow?.85:.5)} strokeDasharray={link.read||r.mode==='bracket'?'3 4':undefined}/>;
      }))}
      {scene.routes.map(r=>{const point=routePoint(r,progress),knee=routePoint(r,Math.min(progress,.4)),highlight=focusRoute?.id===r.id;return <g key={r.id} opacity={scene.type==='single'&&r.id!=='X'||r.id.startsWith('X')&&!scene.roles.some(role=>role.id==='backCorner')?.4:1}>
        {progress>0&&<polyline points={`${px(r.x)},${r.y} ${px(knee[0])},${knee[1]} ${px(point[0])},${point[1]}`} fill="none" stroke="var(--color-danger)" strokeWidth={highlight?2.5:1.5} opacity={highlight?.9:.4}/>}
        <circle cx={px(point[0])} cy={point[1]} r="11" fill="var(--color-surface-1)" stroke="var(--color-danger)" strokeWidth="2"/>
        <text x={px(point[0])} y={point[1]+4} textAnchor="middle" fontSize={r.position==='RB'?10:12} fill="var(--color-text-1)">{r.position==='RB'?'RB':r.id}</text><title>{r.position==='RB'?'RB · original #3':`Original receiver ${r.id}`}</title>
      </g>;})}
      {scene.roles.map(r=>{const point=defenderPoint(scene,r,progress),focused=r.id===follow;return <g key={r.id} data-defender={r.id}>
        {focused&&<circle cx={px(point[0])} cy={point[1]} r="21" fill="none" stroke="var(--color-gold)" strokeWidth="2"/>}
        <rect x={px(point[0])-11} y={point[1]-10} width="22" height="20" rx="3" fill="var(--color-surface-1)" stroke="var(--color-pass)" strokeWidth="2"/>
        <text x={px(point[0])} y={point[1]+4} textAnchor="middle" fontSize="12" fill="var(--color-text-1)">{r.mark}</text>
      </g>;})}
    </svg><div className="mm-cue mm-sr-only" aria-live="polite"><strong>{['Before the snap','Watch the first steps','Responsibility'][phase]} · {selected.mark}</strong><span>{text}{phase===2&&selected.target?` → ${selected.mode==='bracket'?'Bracket':'Match'} ${selected.target==='X'?'X':'#'+selected.target}`:phase===2?` · ${selected.mode==='poach'?'Help toward trips':selected.mode==='zone'?'Defend space':'Maintain the read'}`:''}</span></div></div>
    <div className="mm-playback"><button disabled={reduced} className="ft-primary" onClick={()=>{if(progress>=1)setProgress(0);setPlaying(!running);}}>{running?'Pause':progress>=1?'Replay':'Play'}</button><button onClick={()=>scrub(0)}>Restart</button></div>
    {reduced&&<p className="ft-sub">Reduced motion is on. Use the timeline or stage buttons.</p>}
    <label className="mm-timeline">Scrub the play <span className="mm-progress">{Math.round(progress*100)}%</span><input aria-label="Play progress" aria-valuetext={`${Math.round(progress*100)}% · ${['Alignment','First steps','Response'][phase]}`} style={{'--mm-progress':`${progress*100}%`}} type="range" min="0" max="1000" value={Math.round(progress*1000)} onChange={e=>scrub(Number(e.target.value)/1000)}/></label>
    <div className="mm-stages">{[['Alignment',0],['First steps',.35],['Response',1]].map(([label,n])=><button key={label} onClick={()=>scrub(n)} aria-pressed={phase===(n===0?0:n===1?2:1)}>{label}</button>)}</div>
    <label className="ft-check"><input type="checkbox" checked={flipped} onChange={e=>setFlipped(e.target.checked)}/>Flip field</label>
    {selected.uncertain&&<p className="mm-scope">Read landmarks show responsibility, not exact coverage boundaries. A receiver pickup is only shown as a match when this example assigns it; unresolved exchanges remain reads.</p>}
    <details className="ft-details"><summary>Diagram key &amp; reads</summary>    <p className="mm-legend">Circles = receivers · Numbers track original receivers, not permanent match assignments · RB = original #3 in the flat/drag example · Squares = defenders · Gold ring = your focus{scene.type==='bunch'?' · #2 = original point':''}{scene.type==='stack'?' · #1 = front, #2 = rear':''} · H = inside underneath (often LB) · Solid link = match · Dashed link = read / bracket help · Dimmed receivers = context</p>
    {underneath&&<p className="mm-underneath">H reads {underneath.readTargets.map(id=>`#${id}`).join(', ')} underneath. Dashed links show threats, not a confirmed pickup.</p>}
</details>
    <details className="ft-details"><summary>All responsibilities</summary><div className="ft-details-body">{scene.roles.map(r=><div className="mm-assignment" key={r.id}><button aria-pressed={follow===r.id} onClick={()=>setFollow(r.id)}>{r.mark} · {r.label}</button><p>{r.after}{r.uncertain?' Read landmark; no fixed receiver assignment.':''}</p></div>)}</div></details>
  </>;
}
export default function AdjustmentResponsibilities({initialFormation='Nickel Over',onBack}){
  const [scheme,setScheme]=useState('cover1'),[look,setLook]=useState('bunch'),[chosen,setChosen]=useState('pointCombo'),[release,setRelease]=useState('cross');
  const options=getCheckOptions(scheme,look),check=options.includes(chosen)?chosen:options[0],patterns=getReleaseOptions(look),pattern=patterns.includes(release)?release:patterns[0];
  const scene=buildMatchMotion(scheme,check,look,pattern),heading=useRef(null);
  useEffect(()=>{heading.current?.focus();},[]);
  const availableLooks=OFFENSIVE_LOOKS.filter(l=>getCheckOptions(scheme,l.id).length);
  function changeScheme(value){setScheme(value);if(!getCheckOptions(value,look).length)setLook(OFFENSIVE_LOOKS.find(l=>getCheckOptions(value,l.id).length).id);}
  const defaultId=getCheckDefault(scheme,look);
  return <div className="ft-page mm-page screen-enter"><header className="ft-header app-page-header"><div className="ft-brand">Scheme Builders</div><div className="ft-heading"><h1 ref={heading} tabIndex={-1}>Match Responsibilities <span className="mm-beta">Beta</span></h1>{onBack&&<button onClick={onBack}>← Back</button>}</div></header><main className="ft-body">
    <p className="mm-context">Coverage-role examples · Illustrative alignment, not {initialFormation} player assignments.</p>
    <div className="ft-pickers"><label>Called coverage<select aria-label="Called coverage" value={scheme} onChange={e=>changeScheme(e.target.value)}>{CHECK_SCHEMES.map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label><label>Offensive formation<select aria-label="Offensive formation" value={look} onChange={e=>setLook(e.target.value)}>{availableLooks.map(l=><option value={l.id} key={l.id}>{l.label}</option>)}</select></label></div>
    <div className="ft-pickers"><label>Match adjustment<select aria-label="Match adjustment" value={check} onChange={e=>setChosen(e.target.value)}>{options.map(id=><option value={id} key={id}>{CHECK_RULES[id].label}{id===defaultId?' · Default':''}</option>)}</select></label><label>Receiver releases<select aria-label="Receiver releases" value={pattern} onChange={e=>setRelease(e.target.value)}>{RELEASE_PATTERNS.filter(([id])=>patterns.includes(id)).map(([id,label])=><option value={id} key={id}>{scene?.type==='single'?(id==='verticals'?'Isolated X vertical':'Isolated X short inside'):label}</option>)}</select></label></div>
    {look==='spread'&&<p className="ft-sub">Base coverage teaching; this is not a separate 2×2 adjustment menu.</p>}
    {scene&&<MotionPlayer key={[scheme,look,check,pattern].join(':')} scene={scene}/>}
    <details className="ft-details"><summary>{scene.rule.label} · Why &amp; Tradeoff</summary><div className="ft-details-body"><p className="ft-sub">{scene.rule.summary}</p><p className="ft-sub">{scene.rule.tradeoff}</p>{scene.notes.map(note=><p className="ft-sub" key={note}>{note}</p>)}</div></details>
    <p className="mm-scope">Schematic teaching animation, not a game simulation. Letters identify coverage roles, not fixed player positions. Only the relevant coverage group is shown.</p>
    <details className="ft-details"><summary>Menu coverage &amp; sources</summary><div className="ft-details-body"><p className="ft-sub">{new Set(Object.values(CHECK_MENUS).flatMap(looks=>Object.values(looks).flat())).size} concepts including base/default behaviors. Menus and defaults follow The Gaming Tailgate CFB27 guide, pages 5–7. Stump is available for Palms and Cover 6 trips. Top Hat and Triangle variants appear in broader EA coverage but are absent from this CFB-specific guide, so they are not selectable here.</p><p className="ft-sub">Opened from {initialFormation}. This focused diagram does not claim to reproduce that formation’s exact player assignments. Timing, spacing and help landmarks are illustrative. The guide does not specify every route exchange; those branches remain labeled reads. Stump uses an explicitly short route example, not a measured in-game depth trigger.</p><p><a href={COVERAGE_CHECK_SOURCES.official} target="_blank" rel="noreferrer">EA gameplay explanation</a></p><p><a href={COVERAGE_CHECK_SOURCES.menus} target="_blank" rel="noreferrer">CFB-specific adjustment menus</a></p></div></details>
  </main></div>;
}
