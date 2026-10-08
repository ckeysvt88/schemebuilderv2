import { useState } from 'react';
import SetupDialog from './SetupDialog.jsx';
import './planPresentation.css';

export function PlanLayoutPicker({ layout, onChange }) {
  const [open, setOpen] = useState(false);
  const choices = [
    { value: 'original', label: 'Original', description: 'Full call plan and formation list.' },
    { value: 'quick', label: 'Quick Call', description: 'Primary call first, alternatives on demand.' },
    { value: 'board', label: 'Coaching Board', description: 'Primary, changeup and pressure together.' },
    { value: 'formation', label: 'Formation First', description: 'Group your planned calls by defensive formation.' },
  ];
  return <>
    <button type="button" className="plan-layout-button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Layout</button>
    {open && <SetupDialog title="Plan Layout" description="Choose how your defensive plan is displayed." onClose={() => setOpen(false)}>
      <div className="plan-layout-choices" role="group" aria-label="Plan layout">
        {choices.map(choice => <button type="button" key={choice.value} aria-pressed={layout === choice.value} onClick={() => { onChange(choice.value); setOpen(false); }}>
          <span className="plan-layout-choice-title">{choice.label}{choice.value === 'original' && <span className="plan-layout-default">Default</span>}</span>
          <span className="plan-layout-choice-description">{choice.description}</span>
        </button>)}
      </div>
    </SetupDialog>}
  </>;
}

function Purpose({ purpose }) {
  if (!purpose) return null;
  return <div className="plan-purpose">
    <div className="plan-purpose-heading"><strong>{purpose.label}</strong>{purpose.target && <span>{purpose.target}</span>}</div>
    <p>{purpose.text}</p>
  </div>;
}

function CallTitle({ entry, primary = false, showFormation = true }) {
  return <>
    <div className="plan-call-heading">
      <span className={`plan-role plan-role-${entry.role}`}>{primary ? 'Primary · Start here' : entry.role === 'pressure' ? 'Conditional pressure' : 'Changeup'}</span>
      <span className="plan-fit">{entry.sc}/100 fit</span>
    </div>
    {primary ? <h3 className="plan-primary-title">{entry.call}</h3> : <h4 className="plan-alternative-title">{entry.call}</h4>}
    {showFormation && <p className="plan-formation-name">{entry.formation}</p>}
  </>;
}

function UserJob({ entry, userPosition }) {
  return <div className="plan-user-job">
    <strong>Your job{userPosition ? ` · ${userPosition}` : ''}</strong>
    <p>{entry.userJob}</p>
  </div>;
}

function QuickSetup({ entry }) {
  const settings = entry.adjustmentPlan?.settings || [];
  return <div className="plan-quick-setup" aria-label="Quick setup">
    {settings.length ? settings.map(item => <div className="plan-setting" key={item.setting}>
      <span>{item.setting}</span><strong>{item.value}</strong>
    </div>) : <p>{entry.quickSetup || 'No pre-snap changes needed.'}</p>}
  </div>;
}

function CoachingDetails({ entry, onLogCall, includeAssignment = false, userPosition, open, onToggle }) {
  const adjustmentPlan = entry.adjustmentPlan;
  return <details className="plan-coaching-details" open={open} onToggle={onToggle}>
    <summary>{includeAssignment ? 'Setup, your job & coaching' : 'Coaching & adjustment details'}</summary>
    <div className="plan-expanded-coaching">
      {includeAssignment && <><UserJob entry={entry} userPosition={userPosition} /><QuickSetup entry={entry} /></>}
      <p><strong>Be ready for:</strong> {entry.watchFor}</p>
      <p><strong>{entry.role === 'pressure' ? 'Change back:' : 'Change the call when:'}</strong> {entry.switchWhen}</p>
      {entry.reason && <p><strong>Why this change:</strong> {entry.reason}</p>}
      {entry.formationChange && <p><strong>Personnel:</strong> Change formations between snaps; confirm your personnel and available audibles.</p>}
      {(adjustmentPlan?.settings || []).map(item => <div className="plan-adjustment-explanation" key={item.setting}>
        <strong>{item.setting}: {item.value}</strong>
        <p>{item.why}</p>
        <p><strong>What you give up:</strong> {item.tradeoff}</p>
      </div>)}
      {onLogCall && <button type="button" className="plan-log-call" onClick={() => onLogCall(entry)}>Test this call</button>}
    </div>
  </details>;
}

function Alternative({ entry, board, onLogCall, userPosition, expanded, onExpandedChange }) {
  if (!entry) return null;
  const content = <>
    <p className="plan-use-when"><strong>Use when:</strong> {entry.useWhen}</p>
    {entry.formationChange && <p className="plan-personnel-note">Formation change · Get personnel set between snaps.</p>}
    <CoachingDetails entry={entry} includeAssignment userPosition={userPosition} onLogCall={onLogCall}
      open={board ? expanded : undefined} onToggle={board ? event => onExpandedChange(entry.role, event.currentTarget.open) : undefined} />
  </>;
  if (board) return <section className={`plan-alternative plan-alternative-${entry.role}${expanded ? ' plan-alternative-expanded' : ''}`} aria-label={entry.role === 'pressure' ? 'Conditional pressure' : 'Changeup'}>
    <CallTitle entry={entry} />{content}
  </section>;
  return <details className={`plan-alternative plan-alternative-${entry.role} plan-alternative-collapsed`}>
    <summary><div><CallTitle entry={entry} /></div><span className="plan-expand-mark" aria-hidden="true">＋</span></summary>
    <div className="plan-expanded-alternative">{content}</div>
  </details>;
}

function PressureStatus({ plan, userPosition, onLogCall, board = false, expanded, onExpandedChange }) {
  const decision = plan.pressureDecision;
  return <section className={`plan-alternative plan-alternative-pressure plan-pressure-status${expanded ? ' plan-alternative-expanded' : ''}`} aria-label="Pressure status">
    <span className="plan-role plan-role-pressure">Pressure check</span>
    <h4 className="plan-alternative-title">{decision?.label || 'No separate pressure call'}</h4>
    <p>{decision?.text || 'Use the primary call. A separate pressure option is not included in this plan.'}</p>
    <p><strong>{decision?.status === 'primary' ? 'Already selected:' : 'Use primary setup:'}</strong> {plan.primary.formation} · {plan.primary.call}</p>
    <CoachingDetails entry={plan.primary} includeAssignment userPosition={userPosition} onLogCall={onLogCall}
      open={board ? expanded : undefined} onToggle={board ? event => onExpandedChange('pressure', event.currentTarget.open) : undefined} />
  </section>;
}

function PlanNotes({ plan, pressureShown = false }) {
  const notes = (plan.notes || []).filter(note => !pressureShown || note !== plan.pressureDecision?.text);
  return !!notes.length && <div className="plan-notes">{notes.map(note => <p key={note}>{note}</p>)}</div>;
}

function FormationGroup({ formation, entries, userPosition, onLogCall }) {
  const primary = entries.some(entry => entry.role === 'primary');
  const [open, setOpen] = useState(primary);
  return <details className={`plan-formation-group${primary ? ' plan-formation-group-primary' : ''}`} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>
      <div><span className="plan-role">{primary ? 'Primary formation · Start here' : 'Alternative formation'}</span>
        <h3>{formation}</h3>
        <p>{entries[0].personnel} · {entries.map(entry => entry.call).join(' · ')}</p>
      </div>
      <span className="plan-expand-mark" aria-hidden="true">＋</span>
    </summary>
    <div className="plan-formation-calls">
      {entries.map(entry => <section className={`plan-formation-call plan-alternative-${entry.role}`} key={entry.role} aria-label={`${entry.role} call in ${formation}`}>
        <CallTitle entry={entry} primary={entry.role === 'primary'} showFormation={false} />
        <p><strong>{entry.role === 'primary' ? 'Start here:' : 'Use when:'}</strong> {entry.useWhen}</p>
        {entry.formationChange && <p className="plan-personnel-note">Formation change · Get personnel set between snaps.</p>}
        <UserJob entry={entry} userPosition={userPosition} />
        <QuickSetup entry={entry} />
        <CoachingDetails entry={entry} onLogCall={onLogCall} />
      </section>)}
    </div>
  </details>;
}

function FormationFirst({ plan, userPosition, onLogCall }) {
  const groups = new Map();
  for (const entry of [plan.primary, plan.changeup, plan.pressure].filter(Boolean)) {
    if (!groups.has(entry.formation)) groups.set(entry.formation, []);
    groups.get(entry.formation).push(entry);
  }
  return <section className="plan-presentation plan-presentation-formation" aria-label="Formation First call plan">
    <Purpose purpose={plan.purpose} />
    <h3 className="plan-next-heading">Your formations & calls</h3>
    <p className="plan-one-setup">Start with the primary formation. Open another formation for its call, setup and your job.</p>
    <div className="plan-formation-groups">{[...groups].map(([formation, entries]) =>
      <FormationGroup key={`${formation}-${entries.some(entry => entry.role === 'primary')}`} formation={formation} entries={entries} userPosition={userPosition} onLogCall={onLogCall} />)}</div>
    {!plan.pressure && <PressureStatus plan={plan} userPosition={userPosition} onLogCall={onLogCall} />}
    <p className="plan-one-setup">Apply one call’s setup at a time. Change personnel between snaps.</p>
    <PlanNotes plan={plan} pressureShown={!plan.pressure} />
  </section>;
}

export default function PlanPresentation({ plan, layout = 'quick', userPosition, onLogCall }) {
  const [expandedAlternative, setExpandedAlternative] = useState(null);
  const changeExpansion = (role, open) => setExpandedAlternative(current => open ? role : current === role ? null : current);
  if (!plan?.primary) return null;
  if (layout === 'formation') return <FormationFirst plan={plan} userPosition={userPosition} onLogCall={onLogCall} />;
  const entry = plan.primary;
  const board = layout === 'board';
  return <section className={`plan-presentation plan-presentation-${layout}`} aria-label={board ? 'Coaching Board call plan' : 'Quick Call plan'}>
    <Purpose purpose={plan.purpose} />
    <section className="plan-primary-call" aria-label="Primary call">
      <CallTitle entry={entry} primary />
      {board ? <div className="plan-board-focus">
        <UserJob entry={entry} userPosition={userPosition} />
        <div className="plan-board-keys"><strong>Coaching keys</strong><p><strong>Be ready for:</strong> {entry.watchFor}</p><p><strong>Change when:</strong> {entry.switchWhen}</p></div>
      </div> : <UserJob entry={entry} userPosition={userPosition} />}
      <QuickSetup entry={entry} />
      <CoachingDetails entry={entry} onLogCall={onLogCall} />
    </section>
    {(board || plan.changeup || plan.pressure) && <>
      <h3 className="plan-next-heading">{plan.changeup || plan.pressure ? 'Have your next answer ready' : 'Pressure check'}</h3>
      <div className={board ? `plan-board-alternatives${expandedAlternative ? ' plan-board-alternatives-expanded' : ''}` : 'plan-quick-alternatives'}>
        <Alternative entry={plan.changeup} board={board} onLogCall={onLogCall} userPosition={userPosition}
          expanded={expandedAlternative === 'changeup'} onExpandedChange={changeExpansion} />
        <Alternative entry={plan.pressure} board={board} onLogCall={onLogCall} userPosition={userPosition}
          expanded={expandedAlternative === 'pressure'} onExpandedChange={changeExpansion} />
        {board && !plan.pressure && <PressureStatus plan={plan} board userPosition={userPosition} onLogCall={onLogCall}
          expanded={expandedAlternative === 'pressure'} onExpandedChange={changeExpansion} />}
      </div>
      <p className="plan-one-setup">Switch for a problem you see. Apply one call’s setup at a time.</p>
    </>}
    <PlanNotes plan={plan} pressureShown={board && !plan.pressure} />
  </section>;
}
