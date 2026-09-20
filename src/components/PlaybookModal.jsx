import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PLAYBOOKS } from '../data/playbooks.js';

export default function PlaybookModal({ value, recommended, onChange, onClose }) {
  const titleId = useId();
  const panel = useRef(null);
  const current = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const root = document.getElementById('root');
    const oldOverflow = root?.style.overflow;
    if (root) root.style.overflow = 'hidden';
    current.current?.focus();
    current.current?.scrollIntoView({ block: 'nearest' });
    return () => {
      if (root) root.style.overflow = oldOverflow;
      previous?.focus?.();
    };
  }, []);
  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key !== 'Tab') return;
    const buttons = panel.current.querySelectorAll('button');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 520, padding: 20, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown} onClick={event => event.stopPropagation()} style={{ width: '100%', boxSizing: 'border-box', maxWidth: 620, maxHeight: '82dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-2)', border: '1px solid var(--color-gold)', borderRadius: 'var(--r-lg)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexShrink: 0 }}>
          <div>
            <div id={titleId} style={{ fontSize: 16, color: 'var(--color-gold-bright)', fontWeight: 800 }}>My Defensive Playbook</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-2)', lineHeight: 1.45, marginTop: 4 }}>Choose the playbook you use in-game. Tap a book to apply it.</div>
          </div>
          <button onClick={onClose} style={{ minHeight: 36, padding: '0 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', color: 'var(--color-text-2)', cursor: 'pointer' }}>Done</button>
        </div>
        <div className="playbook-choice-grid">
          {['All', ...Object.keys(PLAYBOOKS)].map(book => (
            <button key={book} ref={value === book ? current : null} aria-pressed={value === book} onClick={() => { onChange(book); onClose(); }} style={{ minWidth: 0, minHeight: 54, textAlign: 'center', padding: '7px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, overflowWrap: 'anywhere', background: value === book ? 'var(--color-gold-surface)' : 'var(--color-surface-1)', border: `1px solid ${value === book ? 'var(--color-gold)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--r-sm)', color: value === book ? 'var(--color-gold-bright)' : 'var(--color-text-1)', cursor: 'pointer' }}>
              <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{book === 'All' ? 'All Books' : book}</span>
              {(recommended === book || value === book) && <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, fontSize: 10 }}>
                {recommended === book && <span style={{ color: 'var(--color-success)' }}>Recommended</span>}
                {value === book && <span style={{ color: 'var(--color-gold-bright)' }}>✓ Current</span>}
              </span>}
            </button>
          ))}
        </div>
      </div>
    </div>, document.body,
  );
}
