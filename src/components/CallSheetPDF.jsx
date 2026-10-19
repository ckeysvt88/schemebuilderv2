import { memo, useEffect, useRef, useState } from 'react';
import SetupDialog from './SetupDialog.jsx';
import { isAppleMobileDevice, savePdf } from '../utils/savePdf.js';
import CallSheetPreview from './CallSheetPreview.jsx';
import { pdf } from '@react-pdf/renderer';
import { buildCallSheetData } from '../engine/buildCallSheet.js';
import MixCallSheetDocument from './MixCallSheetPDF.jsx';
import CallSheetEditor from './CallSheetEditor.jsx';
import CallSheetExportActions from './CallSheetExportActions.jsx';
import { applyCallSheetEdits, emptyCallSheetEdits } from '../engine/callSheetEdits.js';

export function CallSheetDocument({ data }) {
  return <MixCallSheetDocument data={data} />;
}

// ── Exported button component ─────────────────────────────────────────────────
// variant="compact"  →  small header button (default)
// variant="full"     →  wide, prominent banner button for top-of-page placement
export const ExportPDFButton = memo(function ExportPDFButton({ input, sel, variant = 'compact', label }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [url, setUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [viewing, setViewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [source,setSource] = useState(null);
  const [edits,setEdits] = useState(emptyCallSheetEdits);
  const [editing,setEditing] = useState(false);
  const [dirty,setDirty] = useState(false);
  const appleMobile = isAppleMobileDevice();
  const generation = useRef(0);
  const objectUrl = useRef(null);
  useEffect(() => () => {
    generation.current += 1;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);
  const close = () => { generation.current += 1; setOpen(false); };
  const generate = async (reuse = false) => {
    const id = ++generation.current;
    setOpen(true); setStatus('loading'); setUrl(null); setFile(null); setViewing(false); setSaveMessage('');
    // Let the dialog paint before calculating the situation matrix.
    await new Promise(resolve => setTimeout(resolve, 30));
    if (id !== generation.current) return;
    try {
      const data = reuse && source ? source : buildCallSheetData({ input, sel });
      const currentEdits = reuse && source ? edits : emptyCallSheetEdits();
      if (!reuse || !source) {setSource(data);setEdits(currentEdits);setEditing(false);}
      const exportData = reuse ? applyCallSheetEdits(data,currentEdits) : data;
      const blob = await pdf(<CallSheetDocument data={exportData} />).toBlob();
      if (id !== generation.current) return;
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = URL.createObjectURL(blob);
      setFile(new File([blob], `call-sheet-${new Date().toISOString().slice(0, 10)}.pdf`, { type: 'application/pdf' }));
      setUrl(objectUrl.current); setStatus('ready');setDirty(false);
    } catch {
      if (id === generation.current) setStatus('error');
    }
  };
  const save = async () => {
    if (saving || !file) return;
    setSaving(true); setSaveMessage('');
    try {
      const result = await savePdf(file, url);
      if (result === 'download') setSaveMessage('Download started. Check your browser’s downloads.');
    }
    catch { setSaveMessage('Could not save the PDF. Please try again.'); }
    finally { setSaving(false); }
  };
  if (!input?.traits?.length) return null;
  const linkStyle = { display: 'block', width: '100%', background: 'var(--color-surface-1)', font: 'inherit', cursor: 'pointer', padding: '12px 16px', marginTop: 12, border: '1px solid var(--color-gold-border)', borderRadius: 'var(--r-sm)', color: 'var(--color-text-1)', textAlign: 'center', textDecoration: 'none' };
  return <>
    <button type="button" onClick={() => generate(false)} style={{ width: '100%', minHeight: variant === 'full' ? 40 : 32, padding: '0 10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', color: 'var(--color-text-2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      {label || 'Call Sheet'}
    </button>
    {open && <SetupDialog title="Your Call Sheet" description="Save a copy or view your call sheet here. Your game plan stays in place." onClose={close} closeLabel="Cancel">
      <div role="status" aria-live="polite" style={{ color: 'var(--color-text-1)', lineHeight: 1.5 }}>
        {status === 'loading' && 'Building your call sheet…'}
        {status === 'error' && 'The PDF could not be created. Your scouting is safe. Please try again.'}
        {status === 'ready' && (dirty ? 'Edits pending. Update the PDF before saving.' : 'Your call sheet is ready.')}
      </div>
      {status === 'error' && <button type="button" onClick={() => generate(!!source)} style={linkStyle}>Try again</button>}
      {source && <>
        <CallSheetExportActions editing={editing} viewing={viewing} disabled={status==='loading'} exportDisabled={!url||dirty||status!=='ready'} saving={saving} appleMobile={appleMobile} onSave={save} onView={()=>setViewing(value=>!value)} onEdit={()=>setEditing(value=>!value)} />
        {editing&&<CallSheetEditor data={source} edits={edits} disabled={status==='loading'} onChange={next=>{setEdits(next);setDirty(true);setViewing(false);setSaveMessage('');}}/>}
        {dirty&&<button type="button" disabled={status==='loading'} onClick={()=>generate(true)} style={linkStyle}>{status==='loading'?'Updating…':'Update PDF'}</button>}
        {editing&&<button type="button" disabled={status==='loading'} onClick={()=>{setEdits(emptyCallSheetEdits());setDirty(true);setViewing(false);}}>Reset edits</button>}
      </>}
      {url && <>
        <p role="status" style={{ fontSize: 12, color: 'var(--color-text-2)' }}>{saveMessage || (appleMobile ? 'Choose Save to Files if the share sheet opens.' : 'Save PDF downloads a copy to your browser’s download location.')}</p>
        {viewing && <CallSheetPreview file={file} />}
      </>}
    </SetupDialog>}
  </>;
});
