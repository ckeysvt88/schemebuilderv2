import { useState } from 'react';


const RESULTS       = ["TD","FG","Punt","Turnover","Turnover on Downs","Safety","Missed FG","End of Half"];
const RESULT_COLORS = {
  "TD":                "var(--color-pressure)",
  "FG":                "var(--color-run)",
  "Punt":              "var(--color-text-3)",
  "Turnover":          "var(--color-gold)",
  "Turnover on Downs": "var(--color-gold-dim)",
  "Safety":            "var(--color-hybrid)",
  "Missed FG":         "var(--color-success)",
  "End of Half":       "var(--color-text-3)",
};

const fmt = (ts) => new Date(ts).toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit',
});

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function loadNotes() {
  try { const s = localStorage.getItem('cfb26_game_notes'); return s ? JSON.parse(s) : {}; }
  catch(e) { return {}; }
}
function saveNotes(data) {
  try { localStorage.setItem('cfb26_game_notes', JSON.stringify(data)); } catch(e) {}
}
function loadLog() {
  try { const s = localStorage.getItem('cfb26_drive_log'); return s ? JSON.parse(s) : []; }
  catch(e) { return []; }
}
function saveLog(data) {
  try { localStorage.setItem('cfb26_drive_log', JSON.stringify(data)); } catch(e) {}
}

export default function NotesScreen({ profiles, setStep, initProfile, handleShare, shareToast }) {
  const profileKeys    = Object.keys(profiles);
  const [activeTab,    setActiveTab]    = useState("notes");
  const [activeProfile,setActiveProfile]= useState(
    initProfile && profileKeys.includes(initProfile) ? initProfile : (profileKeys.length ? profileKeys[0] : "_general")
  );

  // ── Game Notes ──────────────────────────────────────────────────────────────
  const [allNotes, setAllNotes] = useState(loadNotes);
  const [noteText, setNoteText] = useState("");

  const currentNotes = (allNotes[activeProfile] || []).slice().sort((a,b) => b.ts - a.ts);

  const saveNote = () => {
    if (!noteText.trim()) return;
    const entry = { id: uid(), ts: Date.now(), text: noteText.trim() };
    const updated = { ...allNotes, [activeProfile]: [entry, ...(allNotes[activeProfile] || [])] };
    setAllNotes(updated);
    saveNotes(updated);
    setNoteText("");
  };

  const deleteNote = (id) => {
    const updated = { ...allNotes, [activeProfile]: (allNotes[activeProfile] || []).filter(n => n.id !== id) };
    setAllNotes(updated);
    saveNotes(updated);
  };

  // ── Drive Log ───────────────────────────────────────────────────────────────
  const [log,      setLog]      = useState(loadLog);
  const [dlDown,   setDlDown]   = useState("");
  const [dlDist,   setDlDist]   = useState("");
  const [dlForm,   setDlForm]   = useState("");
  const [dlCall,   setDlCall]   = useState("");
  const [dlResult, setDlResult] = useState("");

  const logPlay = () => {
    if (!dlDown || !dlResult) return;
    const entry = { id: uid(), ts: Date.now(), down: dlDown, dist: dlDist, formation: dlForm, call: dlCall, result: dlResult };
    const updated = [entry, ...log];
    setLog(updated);
    saveLog(updated);
    setDlDown(""); setDlDist(""); setDlForm(""); setDlCall(""); setDlResult("");
  };

  const deletePlay = (id) => {
    const updated = log.filter(e => e.id !== id);
    setLog(updated);
    saveLog(updated);
  };

  const exportLog = () => {
    const lines = ["DRIVE LOG — Scheme Builders", "─".repeat(34), ""];
    log.forEach((e, i) => {
      lines.push(`#${i+1} ${e.down} & ${e.dist || "?"} | ${e.formation || "—"} | ${e.call || "—"} | ${e.result}`);
    });
    lines.push("", `${log.length} plays logged`);
    navigator.clipboard?.writeText(lines.join("\n"));
  };

  const profileLabel = activeProfile === "_general" ? "General" : activeProfile;

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ background: "var(--color-surface-2)", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 12px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Game Notes
            </div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>
              Notes
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {handleShare && (
              <button
                onClick={handleShare}
                style={{ minHeight: 36, padding: "0 14px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}
              >
                {shareToast === "shared" ? "✓ Sent" : shareToast === "copied" ? "✓ Copied" : "Share"}
              </button>
            )}
            <button
              onClick={() => setStep("plan")}
              style={{ minHeight: 36, padding: "0 14px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}
            >
              ← Plan
            </button>
          </div>
        </div>

        {/* Profile selector */}
        {profileKeys.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
              Notes for
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["_general", ...profileKeys].map(k => (
                <button
                  key={k}
                  onClick={() => setActiveProfile(k)}
                  style={{
                    minHeight: 32, padding: "0 12px",
                    borderRadius: "var(--r-pill)",
                    border: `1px solid ${activeProfile === k ? "var(--color-gold)" : "var(--color-border)"}`,
                    background: activeProfile === k ? "var(--color-gold-surface)" : "transparent",
                    color: activeProfile === k ? "var(--color-gold)" : "var(--color-text-2)",
                    fontSize: 12, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontWeight: activeProfile === k ? "700" : "400",
                    transition: "all 120ms ease",
                  }}
                >
                  {k === "_general" ? "General" : k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[{ id:"notes", l:"Game Notes" }, { id:"drivelog", l:"Drive Log" }].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                minHeight: 34, padding: "0 14px",
                background: activeTab === t.id ? "var(--color-gold-surface)" : "transparent",
                border: `1px solid ${activeTab === t.id ? "var(--color-gold)" : "var(--color-border)"}`,
                borderRadius: "var(--r-sm)",
                color: activeTab === t.id ? "var(--color-gold)" : "var(--color-text-2)",
                fontSize: 12, fontWeight: activeTab === t.id ? "700" : "400",
                cursor: "pointer", fontFamily: "var(--font-mono)",
                transition: "all 150ms ease",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 32px" }}>

        {/* ══════════════════ GAME NOTES TAB ══════════════════ */}
        {activeTab === "notes" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                New Note — {profileLabel}
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={`Observations about ${profileLabel === "General" ? "this opponent" : profileLabel}...`}
                rows={4}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "var(--color-surface-2)",
                  border: `1px solid ${noteText ? "var(--color-gold)" : "var(--color-border)"}`,
                  borderRadius: "var(--r-md)",
                  color: "var(--color-text-1)",
                  fontSize: 14, lineHeight: 1.6,
                  fontFamily: "var(--font-sans)",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 150ms ease",
                }}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNote(); }}
              />
              <button
                onClick={saveNote}
                disabled={!noteText.trim()}
                style={{
                  width: "100%", minHeight: 46, marginTop: 8,
                  background: noteText.trim() ? "var(--color-gold)" : "var(--color-surface-1)",
                  border: "none", borderRadius: "var(--r-md)",
                  color: noteText.trim() ? "var(--color-bg)" : "var(--color-text-3)",
                  fontSize: 14, fontWeight: "700",
                  cursor: noteText.trim() ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-mono)",
                  transition: "all 150ms ease",
                }}
              >
                Save Note →
              </button>
            </div>

            {/* Notes timeline */}
            {currentNotes.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--color-text-3)", padding: "32px 0", fontSize: 13 }}>
                No notes yet for {profileLabel}. Add your first observation above.
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 12 }}>
                  {currentNotes.length} Note{currentNotes.length !== 1 ? "s" : ""} — {profileLabel}
                </div>
                {currentNotes.map((note) => (
                  <div key={note.id} style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold-border)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{fmt(note.ts)}</span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        style={{ background: "transparent", border: "none", color: "var(--color-danger)", fontSize: 14, cursor: "pointer", padding: "0 4px", lineHeight: 1, flexShrink: 0 }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ fontSize: 14, color: "var(--color-text-1)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{note.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ DRIVE LOG TAB ══════════════════ */}
        {activeTab === "drivelog" && (
          <div>
            {/* Log a play */}
            <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "14px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 12 }}>
                Log a Play
              </div>

              {/* Down buttons */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>Down</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1,2,3,4].map(d => (
                    <button
                      key={d}
                      onClick={() => setDlDown(String(d))}
                      style={{
                        flex: 1, minHeight: 40,
                        borderRadius: "var(--r-sm)",
                        border: `1px solid ${dlDown === String(d) ? "var(--color-gold)" : "var(--color-border)"}`,
                        background: dlDown === String(d) ? "var(--color-gold-surface)" : "transparent",
                        color: dlDown === String(d) ? "var(--color-gold)" : "var(--color-text-2)",
                        fontSize: 12, cursor: "pointer",
                        fontFamily: "var(--font-mono)", fontWeight: "700",
                        transition: "all 120ms ease",
                      }}
                    >
                      {d}{["st","nd","rd","th"][d-1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance + Formation row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>Distance (yds)</div>
                  <input
                    type="number" min="1" max="99" value={dlDist}
                    onChange={e => setDlDist(e.target.value)}
                    placeholder="e.g. 10"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>Formation Used</div>
                  <input
                    type="text" value={dlForm}
                    onChange={e => setDlForm(e.target.value)}
                    placeholder="e.g. 4-3 Base"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Call + Result row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>Call / Coverage</div>
                  <input
                    type="text" value={dlCall}
                    onChange={e => setDlCall(e.target.value)}
                    placeholder="e.g. Cover 2"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>Result *</div>
                  <select
                    value={dlResult}
                    onChange={e => setDlResult(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select result</option>
                    {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={logPlay}
                disabled={!dlDown || !dlResult}
                style={{
                  width: "100%", minHeight: 46,
                  background: (dlDown && dlResult) ? "var(--color-gold)" : "var(--color-surface-1)",
                  border: "none", borderRadius: "var(--r-md)",
                  color: (dlDown && dlResult) ? "var(--color-bg)" : "var(--color-text-3)",
                  fontSize: 14, fontWeight: "700",
                  cursor: (dlDown && dlResult) ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-mono)",
                  transition: "all 150ms ease",
                }}
              >
                + Log Play
              </button>
            </div>

            {/* Drive log entries */}
            {log.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                    {log.length} Play{log.length !== 1 ? "s" : ""} Logged
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={exportLog} style={smBtn}>Copy</button>
                    <button onClick={() => { setLog([]); saveLog([]); }} style={{ ...smBtn, color: "var(--color-danger)", borderColor: "var(--color-danger)" }}>Clear All</button>
                  </div>
                </div>

                {log.map((entry, i) => (
                  <div key={entry.id} style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: "700", color: "var(--color-text-2)", fontFamily: "var(--font-mono)" }}>
                          {entry.down && `${entry.down}${["st","nd","rd","th"][Number(entry.down)-1]}`}
                          {entry.dist ? ` & ${entry.dist}` : ""}
                        </span>
                        {entry.formation && (
                          <span style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{entry.formation}</span>
                        )}
                        {entry.call && (
                          <span style={{ fontSize: 11, color: "var(--color-text-2)", fontFamily: "var(--font-mono)" }}>{entry.call}</span>
                        )}
                        <span style={{ fontSize: 11, fontWeight: "700", color: RESULT_COLORS[entry.result] || "var(--color-text-2)", background: `${RESULT_COLORS[entry.result]}18`, border: `1px solid ${RESULT_COLORS[entry.result]}44`, padding: "1px 7px", borderRadius: 4, fontFamily: "var(--font-mono)" }}>
                          {entry.result}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{fmt(entry.ts)}</div>
                    </div>
                    <button
                      onClick={() => deletePlay(entry.id)}
                      style={{ background: "transparent", border: "none", color: "var(--color-text-3)", fontSize: 14, cursor: "pointer", padding: "0 4px", flexShrink: 0, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {log.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--color-text-3)", padding: "32px 0", fontSize: 13 }}>
                No plays logged yet. Log a play above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", minHeight: 42, padding: "0 12px",
  background: "var(--color-bg)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--r-sm)",
  color: "var(--color-text-1)",
  fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box",
};

const smBtn = {
  minHeight: 30, padding: "0 12px",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--r-sm)",
  color: "var(--color-text-2)",
  fontSize: 11, cursor: "pointer",
  fontFamily: "var(--font-mono)",
};
