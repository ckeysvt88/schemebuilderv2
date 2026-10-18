import { useEffect, useRef, useState } from 'react';
import { FDB } from '../data/formations.js';
import { TEAMS } from '../data/teams.js';
import { familyOf, FORMATION_FAMILIES } from './playArt/catalog.js';
import { findPlaybooks } from '../utils/playbookFinder.js';
import CompareSchoolList from './CompareSchoolList.jsx';
import './formationTools.css';

const names=Object.keys(FDB).sort((a,b)=>a.localeCompare(b));
export default function PlaybookFinder({ wanted, setWanted, onBack, onCompare }) {
  const [query,setQuery]=useState(''),[family,setFamily]=useState('All'),[choosing,setChoosing]=useState(true),[limit,setLimit]=useState(3),[school,setSchool]=useState(null);
  const heading=useRef(null),resultsHeading=useRef(null);
  useEffect(()=>{heading.current?.focus();window.scrollTo(0,0);document.getElementById('root')?.scrollTo(0,0);},[]);
  const filtered=names.filter(n=>(family==='All'||familyOf(n)===family)&&n.toLowerCase().includes(query.trim().toLowerCase()));
  const results=findPlaybooks(wanted),full=results.filter(r=>r.complete).length;
  function toggle(name){setWanted(wanted.includes(name)?wanted.filter(n=>n!==name):[...wanted,name]);setLimit(3);}
  return <div className="ft-page screen-enter">
    <header className="ft-header app-page-header"><div className="ft-brand">Scheme Builders</div><div className="ft-heading"><h1 ref={heading} tabIndex={-1}>Find my playbook</h1><button onClick={onBack}>← Back</button></div></header>
    <main className="ft-body">
      <p className="ft-sub">Pick the formations you want. See complete matches first, then the closest combinations.</p>
      {wanted.length>0&&<div className="ft-chips">{wanted.map(n=><button className="ft-chip" key={n} aria-label={'Remove '+n} onClick={()=>toggle(n)}>{n}<span aria-hidden="true">×</span></button>)}</div>}
      <details className="ft-details" open={choosing} onToggle={e=>setChoosing(e.currentTarget.open)}><summary>Choose formations · {wanted.length} selected</summary><div className="ft-details-body">
        <div className="ft-pickers"><label>Search formations<input type="search" value={query} placeholder="e.g. Penny" onChange={e=>setQuery(e.target.value)}/></label><label>Family<select value={family} onChange={e=>setFamily(e.target.value)}><option>All</option>{FORMATION_FAMILIES.map(f=><option key={f}>{f}</option>)}</select></label></div>
        <div className="ft-choices" role="group" aria-label="Available formations">{filtered.map(n=><label className="ft-choice" key={n}><input type="checkbox" checked={wanted.includes(n)} onChange={()=>toggle(n)}/><span>{n}</span></label>)}{!filtered.length&&<p className="ft-sub">No formations match this search.</p>}</div>
        <div className="ft-row"><button disabled={!wanted.length} onClick={()=>{setWanted([]);setLimit(3);}}>Clear selections</button><button className="ft-primary" disabled={!wanted.length} onClick={()=>{setChoosing(false);resultsHeading.current?.focus();}}>See matches</button></div>
      </div></details>
      <section className="ft-results" aria-label="Matching playbooks"><h2 ref={resultsHeading} tabIndex={-1}>{wanted.length?'Your matches':'Choose your formations'}</h2>
        <p className="ft-sub" role="status">{!wanted.length?'Select at least one formation to start.':full?`${full} playbook${full===1?'':'s'} contain all ${wanted.length} selected formations.`:results.length?`No playbook contains all ${wanted.length}. The closest match has ${results[0].count} of ${wanted.length}.`:'No matching playbooks in the current catalog.'}</p>
        {results.slice(0,limit).map(book=><article className="ft-result" key={book.name}>
          <div className="ft-row"><h3>{book.name}</h3><span className="ft-match-count">{book.complete?'All included':`${book.count} of ${book.total} included`}</span></div>
          <div className="ft-meter" aria-hidden="true"><span style={{width:`${100*book.count/book.total}%`}}/></div>
          <ul className="ft-match-list">{wanted.map(n=>{const present=book.matched.includes(n);return <li className={present?'':'ft-missing'} key={n}><span className={'ft-match-icon'+(present?' present':'')} aria-hidden="true">{present?'✓':'−'}</span><span>{n}{!present&&' · Missing'}</span></li>;})}</ul>
          <div className="ft-result-actions"><button onClick={()=>onCompare(book.name)}>Compare this book</button><button onClick={()=>setSchool(book.name)}>View schools</button></div>
        </article>)}
        {results.length>limit&&<button className="ft-more" onClick={()=>setLimit(limit+3)}>Show more matches · {results.length-limit} remaining</button>}
        {wanted.length>0&&<p className="ft-sub">Based on the app’s formation catalog. Similar names count as different formations.</p>}
      </section>
    </main>
    {school&&<CompareSchoolList book={school} schools={TEAMS.filter(t=>t.defPlaybook===school).sort((a,b)=>a.name.localeCompare(b.name))} onClose={()=>setSchool(null)}/>}
  </div>;
}
