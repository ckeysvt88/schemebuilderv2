import { useEffect, useRef, useState } from 'react';
import { ALIGN, alignCounts } from '../data/alignments.js';
import { FDB } from '../data/formations.js';
import { familyOf, FORMATION_FAMILIES } from './playArt/catalog.js';
import './formationTools.css';

const names = Object.keys(FDB).filter(name => ALIGN[name]).sort((a,b)=>a.localeCompare(b));
const families = FORMATION_FAMILIES.filter(family => names.some(name => familyOf(name) === family));
export default function FormationCompare({ initialFormation = 'Nickel Over', onBack }) {
  const [a,setA]=useState(names.includes(initialFormation)?initialFormation:'Nickel Over');
  const [b,setB]=useState(initialFormation==='Nickel Double Mug'?'Nickel Over':'Nickel Double Mug');
  const [visible,setVisible]=useState({a:true,b:true}),[labels,setLabels]=useState(false),[picked,setPicked]=useState(null);
  const field=useRef(null),heading=useRef(null);const [width,setWidth]=useState(360);
  useEffect(()=>{heading.current?.focus();window.scrollTo(0,0);document.getElementById('root')?.scrollTo(0,0);},[]);
  useEffect(()=>{const observer=new ResizeObserver(([entry])=>setWidth(Math.max(240,entry.contentRect.width)));observer.observe(field.current);return()=>observer.disconnect();},[]);
  const points=[...ALIGN[a].map(p=>({id:p[0],x:p[1],y:p[2],side:'a',name:a})),...ALIGN[b].map(p=>({id:p[0],x:p[1],y:p[2],side:'b',name:b}))];
  const selected= picked ? points.filter(p=>visible[p.side]&&p.x===picked.x&&p.y===picked.y) : [];
  const px=x=>24+(width-48)*x/100,py=y=>12+y*2.6;
  function change(set,name){set(name);setPicked(null);}
  return <div className="ft-page screen-enter">
    <header className="ft-header app-page-header"><div className="ft-brand">Scheme Builders</div><div className="ft-heading"><h1 ref={heading} tabIndex={-1}>Compare formations</h1><button onClick={onBack}>← Back</button></div></header>
    <main className="ft-body">
      <div className="ft-pickers">{[['A',a,setA],['B',b,setB]].map(([label,value,set])=><div className="ft-formation-picker" key={label}>
        <label>Family {label}<select aria-label={'Family '+label} value={familyOf(value)} onChange={e=>change(set,names.find(name=>familyOf(name)===e.target.value))}>{families.map(family=><option key={family}>{family}</option>)}</select></label>
        <label>Formation {label}<select aria-label={'Formation '+label} value={value} onChange={e=>change(set,e.target.value)}>{names.filter(name=>familyOf(name)===familyOf(value)).map(n=><option key={n}>{n}</option>)}</select></label>
      </div>)}</div>
      <div className="ft-legend">{[['a',a],['b',b]].map(([side,name])=><button key={side} aria-pressed={visible[side]} disabled={visible[side]&&!visible[side==='a'?'b':'a']} onClick={()=>setVisible({...visible,[side]:!visible[side]})}><span className={'ft-symbol ft-'+side} aria-hidden="true"/><span>{side.toUpperCase()} · {name}</span></button>)}</div>
      <div className="ft-field" ref={field}>
        <svg viewBox={`0 0 ${width} 222`} role="group" aria-label={`Alignment overlay: ${a} and ${b}`}>
          {[40,80,120,160].map(y=><line key={y} x1="12" x2={width-12} y1={y} y2={y} stroke="var(--color-border-subtle)"/>)}
          <line x1="12" x2={width-12} y1="198" y2="198" stroke="var(--color-gold)"/><text x="12" y="215" fill="var(--color-text-2)" fontSize="11">Line of scrimmage</text>
          {points.filter(p=>visible[p.side]).map(p=><g className="ft-marker" key={p.side+p.id} role="button" tabIndex={0} aria-label={`${p.side.toUpperCase()} · ${p.name} · ${p.id}`} aria-pressed={selected.includes(p)} onClick={()=>setPicked({x:p.x,y:p.y})} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();setPicked({x:p.x,y:p.y});}}}>
            <circle className="ft-hit" cx={px(p.x)} cy={py(p.y)} r="18"/>
            <circle cx={px(p.x)} cy={py(p.y)}
              r={points.some(other=>other.side!==p.side&&visible[other.side]&&other.x===p.x&&other.y===p.y)?(p.side==='a'?6:11):9}
              fill={p.side==='a'?'var(--color-pass)':'none'}
              stroke={p.side==='a'?'var(--color-surface-1)':'var(--color-hybrid)'}
              strokeWidth={p.side==='a'?1.5:2.5}/>
            {selected.includes(p)&&<circle cx={px(p.x)} cy={py(p.y)} r="15" fill="none" stroke="var(--color-text-1)" strokeDasharray="2 3"/>}
            {labels&&<text x={px(p.x)} y={py(p.y)+(p.side==='a'?-14:24)} textAnchor="middle" fontSize="11" fill="var(--color-text-1)" stroke="var(--color-surface-1)" strokeWidth="3" paintOrder="stroke">{p.id}</text>}
          </g>)}
        </svg>
        <div className="ft-inspect" aria-live="polite">{selected.length?selected.map(p=><div key={p.side+p.id}><strong>{p.side.toUpperCase()} · {p.id}</strong> — {p.name}</div>):'Tap a marker to identify its position. A filled dot inside a ring means both formations share that location.'}</div>
      </div>
      <label className="ft-check"><input type="checkbox" checked={labels} onChange={e=>setLabels(e.target.checked)}/>Show position labels</label>
      <p className="ft-sub">Both formations use the same field scale and orientation. Markers show starting alignments; they do not show coverage assignments.</p>
      <details className="ft-details"><summary>Personnel &amp; positions</summary><div className="ft-details-body ft-rosters">{[['A',a],['B',b]].map(([side,name])=>{const counts=alignCounts(name);return <div key={side}><h2>{side} · {name}</h2><p>{Object.entries(counts||{}).filter(([,n])=>n>0).map(([k,n])=>`${n} ${k==='ed'?'EDGE':k.toUpperCase()}`).join(' · ')}</p><p>{ALIGN[name].map(p=>p[0]).join(' · ')}</p></div>;})}</div></details>
    </main>
  </div>;
}
