// Shared export toolbar keeps editing in the same flow as viewing and saving.
export default function CallSheetExportActions({ editing, viewing, disabled, exportDisabled, saving, appleMobile, onEdit, onView, onSave }) {
  const style = { minWidth: 0, background: 'var(--color-surface-1)', font: 'inherit', padding: '12px 8px', border: '1px solid var(--color-gold-border)', borderRadius: 'var(--r-sm)', color: 'var(--color-text-1)' };
  return <div role="group" aria-label="Call sheet export options" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>
    <button type="button" style={style} disabled={exportDisabled||saving} onClick={onSave}>{saving ? (appleMobile ? 'Opening save options…' : 'Starting download…') : 'Save PDF'}</button>
    <button type="button" style={style} disabled={exportDisabled} onClick={onView}>{viewing?'Hide Preview':'View PDF'}</button>
    <button type="button" style={{...style,gridColumn:'1 / -1'}} disabled={disabled} aria-expanded={editing} onClick={onEdit}>{editing?'Hide editor':'Edit call sheet'}</button>
  </div>;
}
