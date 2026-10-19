import { useState } from 'react';
import { callSheetCallId } from '../engine/callSheetEdits.js';
import './formationTools.css';
const roleLabels={foundation:'Foundation','coverage-variation':'Coverage variation','response-counter':'Response counter','additional-variation':'Additional variation','conditional-pressure':'Conditional pressure','pressure-look':'Pressure look'};
export default function CallSheetEditor({ data, edits, onChange, disabled }) {
  const [down,setDown]=useState('all'),[changedOnly,setChangedOnly]=useState(false);
  const rows=data.situationMatrix.filter(row=>row.down);
  const isEdited=row=>!!edits.starting[row.label]||row.plannedMix?.calls.some(call=>edits.excluded.includes(callSheetCallId(row,call)));
  const visibleRows=rows.filter(row=>(down==='all'||row.down===Number(down))&&(!changedOnly||isEdited(row)));
  const total=rows.reduce((sum,row)=>sum+(row.plannedMix?.calls.length||0),0), included=rows.reduce((sum,row)=>sum+(row.plannedMix?.calls.filter(call=>!edits.excluded.includes(callSheetCallId(row,call))).length||0),0);
  function resetRow(row){const ids=new Set((row.plannedMix?.calls||[]).map(call=>callSheetCallId(row,call)));const starting={...edits.starting};delete starting[row.label];onChange({...edits,starting,excluded:edits.excluded.filter(id=>!ids.has(id))});}
  function keep(row,call,include){const id=callSheetCallId(row,call);const starting={...edits.starting};if(!include&&starting[row.label]===id)delete starting[row.label];onChange({...edits,starting,excluded:include?edits.excluded.filter(key=>key!==id):[...new Set([...edits.excluded,id])]});}
  return <div className="ft-page cs-editor" style={{minHeight:0}}>
    <p className="ft-sub">Choose a starting call or exclude alternatives in each situation. These changes affect this PDF only. Pressure remains conditional.</p>
    <label className="ft-check"><input type="checkbox" disabled={disabled} checked={edits.includeCoaching} onChange={e=>onChange({...edits,includeCoaching:e.target.checked})}/>Include user jobs &amp; situational coaching</label>
    <p className="ft-sub">Setup instructions and safety reminders are always included.</p>
    <div className="ft-row cs-summary"><strong>{included}/{total} calls included</strong><span>{rows.filter(isEdited).length} situations edited</span></div>
    <div className="ft-pickers"><label>Situation filter<select value={down} onChange={e=>setDown(e.target.value)}><option value="all">All downs</option>{[1,2,3,4].map(n=><option value={n} key={n}>Down {n}</option>)}</select></label><label className="ft-check"><input type="checkbox" checked={changedOnly} onChange={e=>setChangedOnly(e.target.checked)}/>Edited situations only</label></div>
    {!visibleRows.length&&<p className="ft-sub" role="status">No edited situations in this view. Turn off the filter to see all calls.</p>}
    {visibleRows.map(row=>{const calls=row.plannedMix?.calls||[],kept=calls.filter(call=>!edits.excluded.includes(callSheetCallId(row,call)));const start=edits.starting[row.label]||callSheetCallId(row,kept[0]||{});return <details className="ft-details" key={row.label}><summary>{row.label} · {kept.length}/{calls.length} calls</summary><div className="ft-details-body">
      {!calls.length&&<p className="ft-sub">No qualifying calls for this situation.</p>}
      {calls.map(call=>{const id=callSheetCallId(row,call),included=!edits.excluded.includes(id);return <div className="cs-edit-call" key={id}><label className="ft-check"><input type="checkbox" disabled={disabled} checked={included} onChange={e=>keep(row,call,e.target.checked)}/><span><strong>{call.call}</strong><br/>{call.formation}<br/><small>{call.roleLabel||roleLabels[call.role]||call.role}{call.pressure?' · Pressure':''}</small></span></label><button disabled={disabled} aria-pressed={included&&start===id} aria-label={'Start with '+call.formation+' '+call.call+' for '+row.label} onClick={()=>onChange({...edits,excluded:edits.excluded.filter(key=>key!==id),starting:{...edits.starting,[row.label]:id}})}>{included&&start===id?'Starting':'Start here'}</button></div>;})}
      {isEdited(row)&&<button disabled={disabled} onClick={()=>resetRow(row)}>Reset this situation</button>}
      {!!calls.length&&!kept.length&&<p className="ft-sub">This row will say “Excluded by you.” Keep a call to restore it.</p>}
    </div></details>;})}
  </div>;
}
