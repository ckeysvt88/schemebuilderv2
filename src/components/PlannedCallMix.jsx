import { useId, useRef, useState } from 'react';
import { MIX_ROLE_LABELS, splitSharedCallInstructions } from '../engine/sharedCallInstructions.js';
import './plannedCallMix.css';
import MatchCheckAdvice from './MatchCheckAdvice.jsx';

const cues = { foundation: 'Keep your base answer sound.', 'coverage-variation': 'Change coverage before it becomes a tell.', 'response-counter': 'Answer their possible adjustment.', 'conditional-pressure': 'Check the hot outlet first.', 'pressure-look': 'Present pressure while retaining coverage.', 'additional-variation': 'Keep another coverage answer ready.' };

function AdjustmentNotes({ settings }) {
  return settings.map(item => <div className="mix-adjustment" key={item.setting}>
    <strong>{item.setting}: {item.value}</strong>
    {item.why && <p>{item.why}</p>}
    {item.tradeoff && <p><strong>What you give up:</strong> {item.tradeoff}</p>}
  </div>);
}

function SharedInstructions({ shared, count, purpose, userPosition }) {
  if (!shared.setup.length && !shared.userJob && !shared.watchFor) return null;
  return <details className="mix-shared">
    <summary>Applies to all {count} calls<span>{purpose?.context?.label || 'Current situation'} · Shared setup &amp; responsibilities</span></summary>
    <div className="mix-shared-content">
      {shared.setup.length > 0 && <p><strong>Setup:</strong> {shared.setup.join(' · ')}</p>}
      {shared.userJob && <p><strong>Your job{userPosition ? ` · ${userPosition}` : ''}:</strong> {shared.userJob}</p>}
      {shared.watchFor && <p><strong>Be ready for:</strong> {shared.watchFor}</p>}
      <AdjustmentNotes settings={shared.adjustmentSettings} />
    </div>
  </details>;
}

export default function PlannedCallMix({ mix, purpose, layout = 'original', userPosition, onLogCall }) {
  const [selected, setSelected] = useState(null);
  const tiles = useRef(new Map());
  const backButton = useRef(null);
  const detailId = useId();
  const { shared, calls } = splitSharedCallInstructions(mix.calls);
  const entry = selected === null ? null : calls[selected];
  const board = layout === 'board';
  const close = () => {
    const previous = selected;
    setSelected(null);
    requestAnimationFrame(() => {
      const tile = tiles.current.get(previous);
      const group = tile?.closest('details');
      if (group) group.open = true;
      tile?.focus({ preventScroll: true });
    });
  };
  const tile = (call, index, showFormation = true, featured = false) => <button type="button" key={`${call.formation}:${call.call}`}
    className={`mix-tile mix-role-${call.role}${featured ? ' mix-featured' : ''}`} ref={el => { if (el) tiles.current.set(index, el); else tiles.current.delete(index); }}
    aria-expanded={selected === index} aria-controls={detailId} aria-label={`Open ${MIX_ROLE_LABELS[call.role]}: ${call.call}, ${call.formation}`}
    onClick={() => { setSelected(index); requestAnimationFrame(() => backButton.current?.focus({ preventScroll: true })); }}>
    <span className="mix-role-label">{MIX_ROLE_LABELS[call.role]}</span><span className="mix-play">{call.call}</span>
    {showFormation && <span className="mix-formation">{call.formation}</span>}
    {board && <span className="mix-coach-cue">{cues[call.role]}</span>}
  </button>;
  const groups = new Map();
  calls.forEach((call, index) => {
    if (!groups.has(call.formation)) groups.set(call.formation, []);
    groups.get(call.formation).push({ call, index });
  });
  return <section className={`planned-call-mix mix-layout-${layout}`} aria-label="Your planned call mix"
    onKeyDown={event => { if (event.key === 'Escape' && entry) { event.preventDefault(); close(); } }}>
    <h3>Your planned call mix</h3>
    <div className="mix-choices" hidden={!!entry}>
      {board && purpose && <p className="mix-goal"><strong>Coaching goal:</strong> {purpose.label}</p>}
      {layout === 'quick' ? <>
        {tile(calls[0], 0, true, true)}
        {calls.length > 1 && <details className="mix-other"><summary>Other {calls.length - 1} calls · Mix proactively</summary>
          <div className="mix-grid mix-other-grid">{calls.slice(1).map((call, i) => tile(call, i + 1))}</div>
        </details>}
      </> : layout === 'formation' ? [...groups].map(([formation, entries], i) => <details className="mix-group" key={formation} open={i === 0 ? true : undefined}>
        <summary>{formation}<span>{entries.length} {entries.length === 1 ? 'call' : 'calls'} · {entries[0].call.personnel}</span></summary>
        <div className="mix-grid">{entries.map(({ call, index }) => tile(call, index, false))}</div>
      </details>) : <div className="mix-grid">{calls.map((call, i) => tile(call, i))}</div>}
    </div>
    <div id={detailId} hidden={!entry}>
      {entry && <section className={`mix-detail mix-role-${entry.role}`} aria-label="Expanded call details">
        <div className="mix-detail-toolbar"><span className="mix-role-label">{MIX_ROLE_LABELS[entry.role]}</span>
          <button type="button" className="mix-back" ref={backButton} onClick={close}>‹ Call mix</button></div>
        <div className="mix-detail-title"><h4>{entry.call}</h4><span>{entry.sc}/100 fit</span></div>
        <p className="mix-detail-formation">{entry.formation} · {entry.personnel}</p>
        {entry.setupEvidence?.preSnap && <div className="mix-section"><strong>Starting look</strong><p>{entry.setupEvidence.preSnap.label}. Post-snap: {entry.setupEvidence.responsibilities.deep} deep zones.</p><p>Based on existing schematic Play Art. Starting safety alignment is separate from zone count.</p></div>}
        {purpose && <div className="mix-section"><strong>Situation</strong><p>{purpose.context.label}{purpose.target ? ` · ${purpose.target}` : ''}. {purpose.text}</p></div>}
        <div className="mix-section"><strong>Use this call</strong><p>{entry.useWhen}</p></div>
        {entry.opponentRead && <div className="mix-section"><strong>Possible offensive response</strong><p>{entry.opponentRead}</p><p>Anticipated, not an observed tendency.</p></div>}
        {!!entry.localSetup.length && <div className="mix-section"><strong>Additional setup</strong>{entry.localSetup.map(setting => <p key={setting}>{setting}</p>)}</div>}
        {entry.localUserJob && <div className="mix-section"><strong>Your job{userPosition ? ` · ${userPosition}` : ''}</strong><p>{entry.localUserJob}</p></div>}
        {entry.localWatchFor && <div className="mix-section"><strong>Be ready for</strong><p>{entry.localWatchFor}</p></div>}
        {!!entry.tradeoffs.length && <div className="mix-section"><strong>What you give up</strong>{entry.tradeoffs.map(item => <p key={item.threat}><strong>{item.threat}:</strong> {item.watchFor}</p>)}</div>}
        <AdjustmentNotes settings={entry.localAdjustmentSettings} />
        <MatchCheckAdvice plan={entry.adjustmentPlan} />
        <div className="mix-section"><strong>Formation &amp; audible check</strong><p>{entry.setupWarning}</p></div>
        {onLogCall && <button type="button" className="mix-back" onClick={() => onLogCall(entry)}>Test this call</button>}
      </section>}
    </div>
    <SharedInstructions shared={shared} count={calls.length} purpose={purpose} userPosition={userPosition} />
    {mix.status === 'limited' && <p className="mix-limited">Only one call qualifies. Broaden your playbook or scout for more options.</p>}
  </section>;
}
