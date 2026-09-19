import { useId, useRef, useState } from 'react';

const DOWNS = [['1', '1st'], ['2', '2nd'], ['3', '3rd'], ['4', '4th']];
const DISTANCES = [['', 'Any distance'], ['short', 'Short'], ['mid', 'Mid'], ['long', 'Long']];
const PLAN_SITUATIONS = [
  { id: 'base', down: 'base', distance: '', label: 'Base' },
  ...DOWNS.flatMap(([down, label]) => DISTANCES.map(([distance, name]) => ({
    id: `${down}:${distance}`, down, distance, label: `${label} · ${name}`,
    shortLabel: distance ? `${label} & ${name}` : `${label} · Any`,
  }))),
  { id: 'rz', down: 'rz', distance: '', label: 'Red Zone' },
];

export default function PlanToolbar({ options, value, fallbackLabel, onChange, down, distance, onSituationChange }) {
  const [open, setOpen] = useState(null);
  const panelId = useId();
  const downTrigger = useRef(null);
  const formationTrigger = useRef(null);
  const selected = options.find(option => option.id === value);
  const situation = PLAN_SITUATIONS.find(item => item.down === String(down) && item.distance === (distance || '')) || PLAN_SITUATIONS[0];
  const close = () => {
    (open === 'situation' ? downTrigger : formationTrigger).current?.focus({ preventScroll: true });
    setOpen(null);
  };
  return <section className="plan-toolbar" aria-label="Plan situation and offensive formation" onKeyDown={event => {
    if (open && event.key === 'Escape') { event.preventDefault(); close(); }
  }}>
    <div className="plan-toolbar__row">
      <button ref={downTrigger} type="button" className="plan-toolbar__trigger plan-toolbar__situation" aria-expanded={open === 'situation'} aria-controls={`${panelId}-situation`} onClick={() => setOpen(current => current === 'situation' ? null : 'situation')}>
        <span className="plan-toolbar__label">Down &amp; Distance</span>
        <strong className="plan-toolbar__value">{situation.shortLabel || situation.label}</strong>
        <span aria-hidden="true" className="plan-toolbar__chevron">⌄</span>
      </button>
      <button ref={formationTrigger} type="button" className="plan-toolbar__trigger plan-toolbar__formation" aria-expanded={open === 'formation'} aria-controls={`${panelId}-formation`} onClick={() => setOpen(current => current === 'formation' ? null : 'formation')}>
        <span className="plan-toolbar__label">Formation &amp; Personnel</span>
        <strong className="plan-toolbar__value">{selected?.label || fallbackLabel || 'Choose look'}</strong>
        <span className="plan-toolbar__composition">{selected?.personnel || 'Select the offensive look'}</span>
        <span aria-hidden="true" className="plan-toolbar__chevron">⌄</span>
      </button>
    </div>
    {/* Both lists stay mounted so selecting a choice animates closed, rather
        than removing the list in one frame. Hidden options cannot take focus. */}
    <div id={`${panelId}-situation`} className="plan-toolbar__reveal" data-open={open === 'situation'} aria-hidden={open !== 'situation'} inert={open !== 'situation'}>
      <div className="plan-toolbar__clip"><div className="plan-toolbar__options plan-toolbar__situations" role="group" aria-label="Choose down and distance">
        {PLAN_SITUATIONS.map(item => <button key={item.id} type="button" aria-pressed={situation.id === item.id} onClick={() => { onSituationChange(item.down, item.distance); close(); }}>{item.shortLabel || item.label}</button>)}
      </div></div>
    </div>
    <div id={`${panelId}-formation`} className="plan-toolbar__reveal" data-open={open === 'formation'} aria-hidden={open !== 'formation'} inert={open !== 'formation'}>
      <div className="plan-toolbar__clip"><div className="plan-toolbar__options" role="group" aria-label="Choose offensive formation and personnel">
        {options.map(option => <button key={option.id} type="button" aria-pressed={option.id === value} onClick={() => { onChange(option.id); close(); }}>
          <strong>{option.label}</strong>
          {option.personnel && <span className="plan-toolbar__composition">{option.personnel}</span>}
        </button>)}
      </div></div>
    </div>
  </section>;
}
