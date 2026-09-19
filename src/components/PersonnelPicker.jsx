import { useId, useRef, useState } from 'react';

export default function PersonnelPicker({ options, value, fallbackLabel, onChange }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const titleId = useId();
  const trigger = useRef(null);
  const selected = options.find(option => option.id === value);
  const close = () => {
    // Avoid focus scrolling to the trigger while the list is still shrinking.
    trigger.current?.focus({ preventScroll: true });
    setOpen(false);
  };
  return <section className="personnel-picker" aria-labelledby={titleId} onKeyDown={event => {
    if (open && event.key === 'Escape') { event.preventDefault(); close(); }
  }}>
    <h2 id={titleId} className="personnel-picker__title">Formation &amp; Personnel</h2>
    <button ref={trigger} type="button" className="personnel-picker__trigger" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(current => !current)}>
      <span className="personnel-picker__selection">
        <strong>{selected?.label || fallbackLabel || 'Choose the offensive look'}</strong>
        {selected?.personnel && <span>{selected.personnel}</span>}
      </span>
      <span className="personnel-picker__action">{open ? 'Close' : 'Change'} <span aria-hidden="true" className="personnel-picker__chevron">⌄</span></span>
    </button>
    {/* Keep the contents mounted: animate the actual layout height, not a flash
        of visibility or an arbitrary max-height. Closed choices cannot take focus. */}
    <div id={listId} className="personnel-picker__reveal" data-open={open} aria-hidden={!open} inert={!open}>
      <div className="personnel-picker__clip">
        <div className="personnel-picker__options" role="group" aria-label="Offensive formation and personnel">
          {options.map(option => <button key={option.id} type="button" className="personnel-picker__option" aria-pressed={option.id === value} onClick={() => {
            onChange(option.id);
            close();
          }}>
            <span><strong>{option.label}</strong>{option.personnel && <span className="personnel-picker__composition">{option.personnel}</span>}</span>
            <span aria-hidden="true">{option.id === value ? '✓' : ''}</span>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}
