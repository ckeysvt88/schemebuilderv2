import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cfb26_drive_log';

function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveLog(entries) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (e) {}
}

const RESULTS = ['TD', 'FG', 'Punt', 'Turnover', 'Turnover on Downs', 'Safety', 'Missed FG', 'End of Half'];
const DOWNS   = [1, 2, 3, 4];

export default function DriveLogger({ onClose }) {
  const [entries, setEntries] = useState(loadLog);
  const [form, setForm] = useState({
    down: '', distance: '', formation: '', call: '', result: '', notes: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { saveLog(entries); }, [entries]);

  const addEntry = () => {
    if (!form.result) return;
    const entry = {
      id: Date.now(),
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...form,
    };
    setEntries(prev => [entry, ...prev]);
    setForm({ down: '', distance: '', formation: '', call: '', result: '', notes: '' });
    setShowForm(false);
  };

  const deleteEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));

  const clearAll = () => {
    if (window.confirm('Clear all drive log entries?')) setEntries([]);
  };

  const exportLog = () => {
    const lines = ['CFB26 DRIVE LOG', '═'.repeat(36), ''];
    entries.forEach((e, i) => {
      lines.push(`#${entries.length - i}  ${e.ts}`);
      if (e.down && e.distance) lines.push(`  Down: ${e.down} & ${e.distance}`);
      if (e.formation) lines.push(`  Formation: ${e.formation}`);
      if (e.call) lines.push(`  Call: ${e.call}`);
      lines.push(`  Result: ${e.result}`);
      if (e.notes) lines.push(`  Notes: ${e.notes}`);
      lines.push('');
    });
    const text = lines.join('\n');
    try {
      navigator.clipboard.writeText(text);
      alert('Drive log copied to clipboard!');
    } catch (e) {
      alert(text);
    }
  };

  const resultColor = (r) => {
    if (r === 'TD') return '#aa5050';
    if (r === 'FG') return '#a06030';
    if (r === 'Punt' || r === 'Missed FG' || r === 'End of Half') return '#508860';
    if (r === 'Turnover' || r === 'Turnover on Downs') return '#6090b8';
    if (r === 'Safety') return '#aa5050';
    return '#7858a0';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', flexDirection: 'column', maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#07090f,#0c1220)', borderBottom: '2px solid #b8880c', padding: '12px 15px', paddingTop: 'calc(env(safe-area-inset-top) + 12px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: '#a07830', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>CFB26 · Game Day</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#c5d0dc', fontFamily: "'IBM Plex Mono', monospace" }}>Drive Logger</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {entries.length > 0 && (
              <>
                <button onClick={exportLog} style={btnStyle('#2a5020','#508840','#90e070')}>⬆ Export</button>
                <button onClick={clearAll} style={btnStyle('#3a1010','#7a2020','#cc6060')}>Clear</button>
              </>
            )}
            <button onClick={onClose} style={btnStyle('#1a2030','#2a3d52','#7898ae')}>✕ Close</button>
          </div>
        </div>
      </div>

      {/* Add play button */}
      <div style={{ padding: '10px 14px', flexShrink: 0, borderBottom: '1px solid #1e2a3a' }}>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{ width: '100%', padding: '10px', background: showForm ? '#1a1408' : 'linear-gradient(135deg,#3a2c08,#6a5010,#3a2c08)', border: `2px solid ${showForm ? '#6a5010' : '#b8880c'}`, borderRadius: 9, color: showForm ? '#b8880c' : '#0a0e16', fontWeight: 'bold', fontSize: 12, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '1px' }}
        >
          {showForm ? '▲ Cancel' : '+ Log Drive Result'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ padding: '12px 14px 8px', background: '#080c12', borderBottom: '1px solid #2a3d52', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={labelStyle}>Down</label>
              <select value={form.down} onChange={e => setForm(p => ({ ...p, down: e.target.value }))} style={inputStyle}>
                <option value="">—</option>
                {DOWNS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Distance</label>
              <input type="number" min="1" max="99" placeholder="e.g. 10" value={form.distance}
                onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Formation Called</label>
            <input placeholder="e.g. Nickel 3-3 Over" value={form.formation}
              onChange={e => setForm(p => ({ ...p, formation: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Coverage / Call</label>
            <input placeholder="e.g. Cover 3 Sky" value={form.call}
              onChange={e => setForm(p => ({ ...p, call: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Result *</label>
            <select value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value }))} style={inputStyle}>
              <option value="">Select result…</option>
              {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Notes</label>
            <input placeholder="What happened? Adjustment needed?" value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={inputStyle} />
          </div>
          <button onClick={addEntry} disabled={!form.result} style={{
            width: '100%', padding: 10, background: form.result ? '#b8880c' : '#2a2a2a',
            border: 'none', borderRadius: 7, color: form.result ? '#0a0e16' : '#555',
            fontWeight: 'bold', fontSize: 12, cursor: form.result ? 'pointer' : 'not-allowed',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            Log Entry
          </button>
        </div>
      )}

      {/* Log list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 30px' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4a5a6a', padding: 40, fontSize: 12, fontStyle: 'italic' }}>
            No drives logged yet. Tap "Log Drive Result" to start tracking.
          </div>
        )}
        {entries.map((e, i) => (
          <div key={e.id} style={{ background: '#0d1622', border: '1px solid #1e2a3a', borderLeft: `3px solid ${resultColor(e.result)}`, borderRadius: 7, padding: '10px 13px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#6888a0', fontFamily: "'IBM Plex Mono', monospace" }}>#{entries.length - i} · {e.ts}</span>
                {e.down && e.distance && (
                  <span style={{ fontSize: 10, color: '#a07830', fontFamily: "'IBM Plex Mono', monospace" }}>{e.down} & {e.distance}</span>
                )}
              </div>
              <button onClick={() => deleteEntry(e.id)} style={{ background: 'transparent', border: 'none', color: '#4a5a6a', fontSize: 14, cursor: 'pointer', padding: '0 2px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: e.notes ? 6 : 0 }}>
              <span style={{ fontSize: 12, fontWeight: 'bold', color: resultColor(e.result), background: `${resultColor(e.result)}18`, border: `1px solid ${resultColor(e.result)}55`, padding: '2px 8px', borderRadius: 5, fontFamily: "'IBM Plex Mono', monospace" }}>
                {e.result}
              </span>
              {e.formation && (
                <span style={{ fontSize: 11, color: '#7898ae', fontFamily: "'IBM Plex Mono', monospace" }}>{e.formation}</span>
              )}
              {e.call && (
                <span style={{ fontSize: 11, color: '#90b0c4' }}>· {e.call}</span>
              )}
            </div>
            {e.notes && (
              <div style={{ fontSize: 11, color: '#7f9fb2', fontStyle: 'italic', marginTop: 4 }}>{e.notes}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = (bg, border, color) => ({
  background: bg, border: `1px solid ${border}`, borderRadius: 6,
  padding: '5px 10px', color, fontSize: 11, cursor: 'pointer',
  fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'nowrap',
});

const labelStyle = { display: 'block', fontSize: 10, color: '#6888a0', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 };

const inputStyle = {
  width: '100%', padding: '8px 10px', background: '#080c12', border: '1px solid #2a3a50',
  borderRadius: 6, color: '#c5d0dc', fontSize: 12, boxSizing: 'border-box',
  fontFamily: "'IBM Plex Mono', monospace", outline: 'none',
};
