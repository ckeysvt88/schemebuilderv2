import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

// Shared shell for the compact setup buttons: same size, backdrop and keyboard
// behavior as the playbook picker. Portal avoids transformed screen containers.
export default function SetupDialog({ title, description, onClose, children }) {
  const titleId = useId();
  const panel = useRef(null);
  const done = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const root = document.getElementById('root');
    const oldOverflow = root?.style.overflow;
    if (root) root.style.overflow = 'hidden';
    done.current?.focus();
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
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown} onClick={event => event.stopPropagation()} style={{ width: '100%', maxWidth: 520, maxHeight: '82dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-2)', border: '1px solid var(--color-gold)', borderRadius: 'var(--r-lg)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexShrink: 0 }}>
          <div>
            <div id={titleId} style={{ fontSize: 16, color: 'var(--color-gold-bright)', fontWeight: 800 }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-2)', lineHeight: 1.45, marginTop: 4 }}>{description}</div>
          </div>
          <button ref={done} onClick={onClose} style={{ minHeight: 36, padding: '0 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', color: 'var(--color-text-2)', cursor: 'pointer' }}>Done</button>
        </div>
        <div style={{ overflowY: 'auto', minHeight: 0, padding: 2 }}>{children}</div>
      </div>
    </div>, document.body,
  );
}
