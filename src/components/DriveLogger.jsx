import { useMemo, useState } from 'react';
import { CALL_TEST_PROBLEMS, CALL_TEST_RESULTS, normalizeCalibrationEntry, summarizeCalibrationEntries } from '../engine/calibrationLog.js';

const STORAGE_KEY = 'cfb27_call_tests';

function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeCalibrationEntry).filter(Boolean) : [];
  } catch { return []; }
}

function saveEntries(entries) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch { /* storage may be unavailable */ }
}

const emptyDefaults = {
  down: '', distance: '', defensiveFormation: '', defensiveCall: '', userPosition: '',
  book: '', gameVersion: '', platform: '', difficulty: '', mode: '', setupConfirmed: false,
  objective: '', setup: [], opponentLook: '', result: '', problem: 'none', yards: '', notes: '',
};

export default function DriveLogger({ defaults = {}, onClose }) {
  const [entries, setEntries] = useState(loadEntries);
  const [form, setForm] = useState(() => ({ ...emptyDefaults, ...defaults }));
  const summary = useMemo(() => summarizeCalibrationEntries(entries), [entries]);
  const labels = Object.fromEntries([...CALL_TEST_RESULTS, ...CALL_TEST_PROBLEMS].map(item => [item.id, item.label]));
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }));

  const addEntry = () => {
    const entry = normalizeCalibrationEntry(form);
    if (!entry) return;
    const next = [entry, ...entries];
    setEntries(next);
    saveEntries(next);
    setForm(previous => ({ ...previous, result: '', problem: 'none', yards: '', opponentLook: '', notes: '' }));
  };

  const deleteEntry = id => {
    const next = entries.filter(entry => entry.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const clearAll = () => {
    if (!window.confirm('Clear every saved call test?')) return;
    setEntries([]);
    saveEntries([]);
  };

  const exportLog = async () => {
    const text = JSON.stringify({ schemaVersion: 2, exportedAt: new Date().toISOString(), entries }, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      window.alert('Call-test data copied. Paste it into a message when you are ready to review calibration.');
    } catch { window.alert(text); }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-test-title"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div onClick={event => event.stopPropagation()} style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-gold)', borderRadius: 'var(--r-lg)', padding: '20px 22px 16px', width: '100%', maxWidth: 600, maxHeight: '80dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 14, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-gold-dim)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>On-Device Review</div>
            <div id="call-test-title" style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)' }}>Test This Call</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 3 }}>Record what happened after the snap</div>
          </div>
          <button onClick={onClose} style={{ ...buttonStyle, minHeight: 32, padding: '0 12px', flexShrink: 0 }}>Close</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
        <div style={{ background: 'var(--color-gold-surface)', border: '1px solid var(--color-gold-border)', borderRadius: 7, padding: '10px 12px', marginBottom: 11 }}>
          <strong style={{ display: 'block', fontSize: 13 }}>{form.defensiveFormation || 'Formation not selected'}</strong>
          <span style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 700 }}>{form.defensiveCall || 'Call not selected'}</span>
          {(form.down || form.distance) && <div style={{ color: 'var(--color-text-2)', fontSize: 11, marginTop: 4 }}>{form.down === 'rz' ? 'Red zone' : `${form.down || '—'} down`} · {form.distance || 'distance not set'}</div>}
          {form.userPosition && <div style={{ color: 'var(--color-text-3)', fontSize: 10, marginTop: 4 }}>Your user: {form.userPosition}</div>}
          {form.objective && <div style={{ color: 'var(--color-text-2)', fontSize: 11, marginTop: 4 }}>Objective: {form.objective}</div>}
          {form.setup?.length > 0 && <div style={{ color: 'var(--color-text-3)', fontSize: 10, lineHeight: 1.5, marginTop: 5 }}>{form.setup.join(' · ')}</div>}
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 7 }}>What happened?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 11 }}>
          {CALL_TEST_RESULTS.map(item => <button key={item.id} onClick={() => update('result', item.id)} style={{ ...choiceStyle, ...(form.result === item.id ? activeChoiceStyle : {}) }}>{item.label}</button>)}
        </div>

        <label style={labelStyle}>What caused the problem?</label>
        <select value={form.problem} onChange={event => update('problem', event.target.value)} style={inputStyle}>
          {CALL_TEST_PROBLEMS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>

        <details style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 7, padding: '9px 11px', marginTop: 10 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--color-gold)', fontSize: 11, fontWeight: 700 }}>Optional details</summary>
          <div style={{ marginTop: 10 }}>
            <label style={labelStyle}>What did the offense show?</label>
            <input value={form.opponentLook} onChange={event => update('opponentLook', event.target.value)} placeholder="Example: Trips, mesh, QB draw" style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 9 }}>
              <div><label style={labelStyle}>Down</label><select value={form.down} onChange={event => update('down', event.target.value)} style={inputStyle}><option value="">—</option><option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option><option value="rz">Red zone</option></select></div>
              <div><label style={labelStyle}>Distance</label><select value={form.distance} onChange={event => update('distance', event.target.value)} style={inputStyle}><option value="">—</option><option value="short">Short</option><option value="mid">Medium</option><option value="long">Long</option></select></div>
            </div>
            <div style={{ marginTop: 9 }}><label style={labelStyle}>Yards gained</label><input type="number" value={form.yards} onChange={event => update('yards', event.target.value)} style={inputStyle} /></div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-3)', fontWeight: 800, marginBottom: 7 }}>TEST ENVIRONMENT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div><label style={labelStyle}>Platform</label><select value={form.platform} onChange={event => update('platform', event.target.value)} style={inputStyle}><option value="">—</option><option value="PS5">PS5</option><option value="Xbox Series X|S">Xbox Series X|S</option></select></div>
                <div><label style={labelStyle}>Difficulty</label><select value={form.difficulty} onChange={event => update('difficulty', event.target.value)} style={inputStyle}><option value="">—</option><option value="Varsity">Varsity</option><option value="All-American">All-American</option><option value="Heisman">Heisman</option></select></div>
                <div><label style={labelStyle}>Mode</label><select value={form.mode} onChange={event => update('mode', event.target.value)} style={inputStyle}><option value="">—</option><option value="Dynasty">Dynasty</option><option value="Play Now">Play Now</option><option value="Ultimate Team">Ultimate Team</option><option value="Practice">Practice</option></select></div>
                <div><label style={labelStyle}>Game update</label><input value={form.gameVersion} onChange={event => update('gameVersion', event.target.value)} placeholder="Example: Sept update" style={inputStyle} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--color-text-2)', fontSize: 11, lineHeight: 1.4, marginTop: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.setupConfirmed} onChange={event => update('setupConfirmed', event.target.checked)} style={{ marginTop: 2 }} />
                I used the listed pre-snap setup. This keeps setup tests separate from base-call tests.
              </label>
            </div>
            <div style={{ marginTop: 9 }}><label style={labelStyle}>Notes</label><input value={form.notes} onChange={event => update('notes', event.target.value)} placeholder="Anything the categories missed" style={inputStyle} /></div>
          </div>
        </details>

        <button onClick={addEntry} disabled={!form.result} style={{ width: '100%', marginTop: 11, padding: 11, border: 'none', borderRadius: 7, background: form.result ? 'var(--color-gold)' : 'var(--color-surface-3)', color: form.result ? 'var(--color-bg)' : 'var(--color-text-3)', fontWeight: 800, cursor: form.result ? 'pointer' : 'not-allowed' }}>Save Call Test</button>

        {entries.length > 0 && (
          <details style={{ marginTop: 18 }}>
            <summary style={{ cursor: 'pointer', color: 'var(--color-gold)', fontSize: 12, fontWeight: 700 }}>Saved evidence ({entries.length})</summary>
            <div style={{ fontSize: 10, color: 'var(--color-text-3)', lineHeight: 1.5, margin: '8px 0' }}>These observations do not change recommendation scores yet. Review them before calibrating the engine.</div>
            {summary.map(item => <div key={item.key} style={{ padding: '7px 0', borderTop: '1px solid var(--color-border-subtle)', fontSize: 11 }}><strong>{item.formation ? `${item.formation} · ` : ''}{item.call}</strong>{item.context && <div style={{ color: 'var(--color-text-2)', marginTop: 2 }}>{item.context}</div>}<div style={{ color: 'var(--color-text-3)', marginTop: 2 }}>{item.tests} test{item.tests === 1 ? '' : 's'} · {item.stops} stops · {item.sacks} sacks · {item.turnovers} turnovers · {item.explosives} explosives</div></div>)}
            <div style={{ display: 'flex', gap: 7, marginTop: 10 }}><button onClick={exportLog} style={buttonStyle}>Copy Test Data</button><button onClick={clearAll} style={{ ...buttonStyle, color: 'var(--color-danger)' }}>Clear All</button></div>
            {entries.map(entry => <div key={entry.id} style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 6, padding: '8px 10px', marginTop: 8, fontSize: 11 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><strong>{labels[entry.result]}</strong><button onClick={() => deleteEntry(entry.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}>✕</button></div><div style={{ color: 'var(--color-text-3)', marginTop: 3 }}>{entry.defensiveFormation} · {entry.defensiveCall}{entry.problem !== 'none' ? ` · ${labels[entry.problem]}` : ''}</div></div>)}
          </details>
        )}
      </div>
      </div>
    </div>
  );
}

const buttonStyle = { background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '6px 9px', color: 'var(--color-text-2)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-mono)' };
const choiceStyle = { minHeight: 43, padding: '7px 8px', background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 7, color: 'var(--color-text-2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' };
const activeChoiceStyle = { background: 'var(--color-gold-surface)', borderColor: 'var(--color-gold)', color: 'var(--color-gold-bright)' };
const labelStyle = { display: 'block', fontSize: 10, color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 };
const inputStyle = { width: '100%', padding: '9px 10px', background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)', borderRadius: 6, color: 'var(--color-text-1)', fontSize: 12, boxSizing: 'border-box', fontFamily: 'var(--font-mono)', outline: 'none' };
