import { useId, useRef, useState } from 'react';

const DOWNS = [['base', 'Base'], ['1', '1st'], ['2', '2nd'], ['3', '3rd'], ['4', '4th']];
const DISTANCES = [['', 'Any'], ['short', 'Short'], ['mid', 'Mid'], ['long', 'Long']];

export default function PlanToolbar({ options, value, fallbackLabel, onChange, down, distance, onSituationChange }) {
  const [open, setOpen] = useState(null);
  const panelId = useId();
  const downTrigger = useRef(null);
  const formationTrigger = useRef(null);
  const selected = options.find(option => option.id === value);
  const activeDown = down === 'rz' ? ['rz', 'Red Zone'] : (DOWNS.find(([id]) => id === String(down)) || DOWNS[0]);
  const distanceEnabled = ['1', '2', '3', '4'].includes(activeDown[0]);
  const activeDistance = distanceEnabled ? (DISTANCES.find(([id]) => id === distance) || DISTANCES[0]) : DISTANCES[0];
  const situationLabel = distanceEnabled ? `${activeDown[1]} & ${activeDistance[1]}` : activeDown[1];
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
        <strong className="plan-toolbar__value">{situationLabel}</strong>
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
      <div className="plan-toolbar__clip">
        <div className="plan-toolbar__options plan-toolbar__situations">
          <div className="plan-toolbar__choice-column" role="group" aria-label="Down">
            <span className="plan-toolbar__column-title">Down</span>
            {DOWNS.map(([id, label]) => <button key={id} type="button" aria-pressed={activeDown[0] === id} onClick={() => {
              const numbered = ['1', '2', '3', '4'].includes(id);
              onSituationChange(id, numbered ? activeDistance[0] : '');
              if (!numbered) close();
            }}>{label}</button>)}
          </div>
          <div className="plan-toolbar__choice-column" role="group" aria-label="Distance">
            <span className="plan-toolbar__column-title">Distance</span>
            {DISTANCES.map(([id, label]) => <button key={id} type="button" disabled={!distanceEnabled} aria-pressed={distanceEnabled && activeDistance[0] === id} onClick={() => {
              onSituationChange(activeDown[0], id);
              close();
            }}>{label}</button>)}
            <button type="button" aria-pressed={activeDown[0] === 'rz'} onClick={() => {
              onSituationChange('rz', '');
              close();
            }}>Red Zone</button>
          </div>
          {!distanceEnabled && <span className="plan-toolbar__distance-hint" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Choose 1st–4th to set distance.</span>}
        </div>
      </div>
    </div>
    <div id={`${panelId}-formation`} className="plan-toolbar__reveal" data-open={open === 'formation'} aria-hidden={open !== 'formation'} inert={open !== 'formation'}>
      <div className="plan-toolbar__clip"><div className="plan-toolbar__options plan-toolbar__formations" role="group" aria-label="Choose offensive formation and personnel">
        {options.map(option => <button key={option.id} type="button" aria-pressed={option.id === value} onClick={() => { onChange(option.id); close(); }}>
          <strong>{option.label}</strong>
          {option.personnel && <span className="plan-toolbar__composition">{option.personnel}</span>}
        </button>)}
      </div></div>
    </div>
  </section>;
}
