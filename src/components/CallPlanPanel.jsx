const card = { background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 6, padding: '10px 12px', marginTop: 8 };
const text = { fontSize: 11, lineHeight: 1.5, color: 'var(--color-text-2)', margin: '5px 0 0' };

function PlanEntry({ entry, primary = false, showFormation = true }) {
  const title = `${showFormation ? entry.formation + ' · ' : ''}${entry.call}`;
  const coaching = <>
    {entry.quickSetup && <p style={text}><strong>Setup:</strong> {entry.quickSetup}</p>}
    <p style={text}><strong>Be ready for:</strong> {entry.watchFor}</p>
    <p style={text}><strong>Your job:</strong> {entry.userJob}</p>
    {entry.reason && <p style={text}><strong>Why this change:</strong> {entry.reason}</p>}
    {entry.formationChange && <p style={text}>Change formations between snaps; confirm your personnel and available audibles.</p>}
  </>;
  return <div style={{ ...card, borderLeft: `3px solid ${primary ? 'var(--color-gold)' : entry.role === 'pressure' ? 'var(--color-danger)' : 'var(--color-success)'}` }}>
    <div style={{ fontSize: 10, letterSpacing: '0.7px', fontWeight: 800, color: primary ? 'var(--color-gold)' : 'var(--color-text-3)' }}>
      {primary ? 'PRIMARY · START HERE' : entry.role === 'pressure' ? 'CONDITIONAL PRESSURE' : 'CHANGEUP'}
    </div>
    <div style={{ fontSize: 12, fontWeight: 750, color: 'var(--color-text-1)', marginTop: 3 }}>{title} <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-text-3)' }}>{entry.sc}/100</span></div>
    <p style={text}>{primary ? entry.switchWhen : entry.useWhen}</p>
    <details style={{ fontSize: 11, marginTop: 6 }}>
      <summary style={{ cursor: 'pointer', color: 'var(--color-gold)', fontWeight: 650 }}>Setup &amp; your job</summary>
      {coaching}
      {entry.role === 'pressure' && <p style={text}><strong>Change back:</strong> {entry.switchWhen}</p>}
    </details>
  </div>;
}

export default function CallPlanPanel({ plan, showFormation = true, heading = 'Your call plan' }) {
  if (!plan?.primary) return null;
  return <section aria-label={heading} style={{ border: '1px solid var(--color-gold-border)', background: 'var(--color-gold-surface)', borderRadius: 8, padding: '11px 12px', margin: '12px 0 16px' }}>
    <h3 style={{ fontSize: 13, margin: 0, color: 'var(--color-text-1)' }}>{heading}</h3>
    {plan.purpose && <div style={{ borderBottom: '1px solid var(--color-gold-border)', padding: '7px 0 9px', marginBottom: 8 }}>
      <p style={text}><strong>{plan.purpose.label}</strong>{plan.purpose.target && <span style={{ marginLeft: 7, color: 'var(--color-text-3)' }}>{plan.purpose.target}</span>}</p>
      <p style={text}>{plan.purpose.text}</p>
    </div>}
    <p style={{ ...text, color: 'var(--color-text-3)' }}>Start with the primary. Switch for a problem you see; apply one call’s setup at a time.</p>
    <PlanEntry entry={plan.primary} primary showFormation={showFormation} />
    {plan.changeup && <PlanEntry entry={plan.changeup} showFormation={showFormation} />}
    {plan.pressure && <PlanEntry entry={plan.pressure} showFormation={showFormation} />}
    {plan.notes.map(note => <p key={note} style={{ ...text, fontSize: 10, marginTop: 8 }}>{note}</p>)}
  </section>;
}
