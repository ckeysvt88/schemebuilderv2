import { useEffect, useRef, useState } from 'react';
import { FDB } from '../data/formations.js';
import { TEAMS } from '../data/teams.js';
import { familyOf, FORMATION_FAMILIES } from './playArt/catalog.js';
import { matchesFormationSearch } from '../utils/playbookPreferences.js';
import { findPlaybooks } from '../utils/playbookFinder.js';
import CompareSchoolList from './CompareSchoolList.jsx';
import './formationTools.css';

const names = Object.keys(FDB).sort((a,b)=>a.localeCompare(b));
export default function PlaybookFinder({ wanted, setWanted, priorities, setPriorities, onBack, onCompare }) {
  const [localPriorities, setLocalPriorities] = useState({});
  const prefs = priorities || localPriorities, updatePrefs = setPriorities || setLocalPriorities;
  const [query,setQuery]=useState(''),[family,setFamily]=useState('All'),[choosing,setChoosing]=useState(true),[limit,setLimit]=useState(3),[school,setSchool]=useState(null);
  const [undo,setUndo]=useState(null);
  const [marked,setMarked]=useState([]),[selectedOnly,setSelectedOnly]=useState(false);
  const heading=useRef(null),resultsHeading=useRef(null);
  useEffect(()=>{heading.current?.focus();window.scrollTo(0,0);document.getElementById('root')?.scrollTo(0,0);},[]);
  const filtered=names.filter(n=>(family==='All'||familyOf(n)===family)&&matchesFormationSearch(n,query)&&(!selectedOnly||wanted.includes(n)));
  const results=findPlaybooks(wanted,FDB,undefined,prefs), qualifying=results.filter(r=>r.qualifies);
  const visibleResults=qualifying.length?qualifying:results;
  const must=wanted.filter(n=>prefs[n]!=='nice').length, nice=wanted.length-must;
  function assign(targets,priority){
    setUndo({wanted:[...wanted],priorities:{...prefs}});
    const changed=new Set(targets);
    setWanted(current=>priority==='off'?current.filter(n=>!changed.has(n)):[...new Set([...current,...targets])]);
    updatePrefs(current=>{const next={...current};for(const n of targets){if(priority==='off')delete next[n];else next[n]=priority;}return next;});
    setLimit(3);setMarked([]);
  }
  return <div className="ft-page screen-enter">
    <header className="ft-header app-page-header"><div className="ft-brand">Scheme Builders</div><div className="ft-heading"><h1 ref={heading} tabIndex={-1}>Find my playbook</h1><button onClick={onBack}>← Back</button></div></header>
    <main className="ft-body">
      <p className="ft-sub">Choose must-haves first. Nice-to-haves rank books that meet your requirements.</p>
      <div className="ft-row"><strong>{must} must have · {nice} nice to have</strong><button disabled={!wanted.length} onClick={()=>{setUndo({wanted:[...wanted],priorities:{...prefs}});setWanted([]);updatePrefs({});setMarked([]);setLimit(3);}}>Clear priorities</button></div>
      {undo&&<div className="ft-row ft-undo" role="status"><span>Priorities updated.</span><button onClick={()=>{setWanted(undo.wanted);updatePrefs(undo.priorities);setUndo(null);setMarked([]);setLimit(3);}}>Undo last change</button></div>}
      <details className="ft-details" open={choosing} onToggle={e=>setChoosing(e.currentTarget.open)}><summary>Choose formations · {wanted.length} prioritized</summary><div className="ft-details-body">
        <div className="ft-pickers"><label>Search formations<input type="search" value={query} placeholder="e.g. 335 Penny, Double Mug" onChange={e=>setQuery(e.target.value)}/></label><label>Family<select value={family} onChange={e=>setFamily(e.target.value)}><option>All</option>{FORMATION_FAMILIES.map(f=><option key={f}>{f}</option>)}</select></label></div>
        <label className="ft-check"><input type="checkbox" checked={selectedOnly} onChange={e=>setSelectedOnly(e.target.checked)}/>Show prioritized formations only</label>
        <div className="ft-bulk" role="group" aria-label="Bulk formation priorities"><div className="ft-row"><span>{marked.length} selected for bulk edit</span><button disabled={!filtered.length} onClick={()=>setMarked(current=>[...new Set([...current,...filtered])])}>Select shown ({filtered.length})</button><button disabled={!marked.length} onClick={()=>setMarked([])}>Deselect</button></div><div className="ft-row"><span>Set selected:</span><button disabled={!marked.length} onClick={()=>assign(marked,'must')}>Must have</button><button disabled={!marked.length} onClick={()=>assign(marked,'nice')}>Nice to have</button><button disabled={!marked.length} onClick={()=>assign(marked,'off')}>Remove</button></div></div>
        <div className="ft-priority-list" role="group" aria-label="Formation priorities">{filtered.map(n=>{const priority=wanted.includes(n)?prefs[n]||'must':'off';return <div className="ft-priority-row" key={n}><label><input type="checkbox" aria-label={'Select '+n+' for bulk edit'} checked={marked.includes(n)} onChange={()=>setMarked(current=>current.includes(n)?current.filter(x=>x!==n):[...current,n])}/><span>{n}</span></label><div className="ft-priority-actions"><button aria-label={'Must have '+n} aria-pressed={priority==='must'} onClick={()=>assign([n],priority==='must'?'off':'must')}>Must</button><button aria-label={'Nice to have '+n} aria-pressed={priority==='nice'} onClick={()=>assign([n],priority==='nice'?'off':'nice')}>Nice</button></div></div>;})}{!filtered.length&&<p className="ft-sub">No formations match this view.</p>}</div>
        <button className="ft-primary ft-more" disabled={!wanted.length} onClick={()=>{setChoosing(false);resultsHeading.current?.focus();}}>See matches</button>
<p className="ft-sub">Use commas for alternatives, such as “Penny, Double Mug”. Spaces narrow a search.</p>
      </div></details>
      <section className="ft-results" aria-label="Matching playbooks"><h2 ref={resultsHeading} tabIndex={-1}>{wanted.length?'Your matches':'Choose your formations'}</h2>
        <p className="ft-sub" role="status">{!wanted.length?'Search or pick a family, then tap Must or Nice. Select multiple rows to set priorities together.':qualifying.length?(must?`${qualifying.length} playbook${qualifying.length===1?'':'s'} meet${qualifying.length===1?'s':''} all ${must} must-haves. Ranked by nice-to-have matches.`:`${qualifying.length} playbooks match your preferences. No must-haves selected.`):results.length?`No book meets every must-have. Closest alternatives include ${results[0].requiredCount} of ${must} requirements.`:'No matching playbooks in the current catalog.'}</p>
        {visibleResults.slice(0,limit).map(book=><article className="ft-result" key={book.name}>
          <div className="ft-row"><h3>{book.name}</h3><span className="ft-match-count">{book.qualifies?'Requirements met':`${book.requiredCount}/${must} required`}</span></div>
          <p className="ft-sub">{book.preferredCount}/{nice} nice-to-haves · {book.count}/{wanted.length} formations included</p>
          <div className="ft-meter" aria-hidden="true"><span style={{width:`${100*book.count/book.total}%`}}/></div>
          {book.requiredMissing.length>0&&<p className="ft-sub"><strong>Missing requirements:</strong> {book.requiredMissing.slice(0,3).join(', ')}{book.requiredMissing.length>3?` · +${book.requiredMissing.length-3} more (expand below)`:''}</p>}
          <details className="ft-match-details"><summary>Included &amp; missing formations</summary><ul className="ft-match-list">{wanted.map(n=>{const present=book.matched.includes(n);return <li className={present?'':'ft-missing'} key={n}><span className={'ft-match-icon'+(present?' present':'')} aria-hidden="true">{present?'✓':'−'}</span><span>{n} · {prefs[n]==='nice'?'Nice':'Must'}{!present&&' · Missing'}</span></li>;})}</ul></details>
          <div className="ft-result-actions"><button onClick={()=>onCompare(book.name)}>Compare this book</button><button onClick={()=>setSchool(book.name)}>View schools</button></div>
        </article>)}
        {visibleResults.length>limit&&<button className="ft-more" onClick={()=>setLimit(limit+3)}>Show more matches · {visibleResults.length-limit} remaining</button>}
        {wanted.length>0&&<p className="ft-sub">Based on the app’s catalog. Formation names must match exactly. Missing requirements are never treated as a full match.</p>}
      </section>
    </main>
    {school&&<CompareSchoolList book={school} schools={TEAMS.filter(t=>t.defPlaybook===school).sort((a,b)=>a.name.localeCompare(b.name))} onClose={()=>setSchool(null)}/>}
  </div>;
}
