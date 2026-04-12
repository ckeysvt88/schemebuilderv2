import { useState } from 'react';
import { getBlitz } from '../engine/scoring.js';
import { ADJUSTMENTS } from '../data/adjustments.js';
import { TRAIT_LABELS } from '../data/traits.js';
import BlitzBar from './BlitzBar.jsx';
import WhySelected from './WhySelected.jsx';

const PC = { run: "#a06030", pass: "#1a6fe8", hybrid: "#7858a0", pressure: "#aa5050" };

function AdjSection({ sec, items, icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: "12px", color: "#b8880c", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{icon} {sec}</div>
      {items.map((a, i) => (
        <div key={i} style={{ background: "#080c15", border: "1px solid #1e2a3a", borderLeft: "3px solid #3a5a7a", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#c5d0dc", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>{a.setting}</div>
          <div style={{ fontSize: 11, color: "#7f9fb2", lineHeight: 1.55 }}>{a.reason}</div>
        </div>
      ))}
    </div>
  );
}

function AdjustmentsPanel({ flat }) {
  const matched = ADJUSTMENTS.filter(a => a.triggers.some(t => flat.includes(t)));
  const ss = matched.filter(a => a.section === "Safety Setup");
  const zd = matched.filter(a => a.section === "Zone Drops");
  const ps = matched.filter(a => a.section === "Pre-Snap");
  const kr = matched.filter(a => a.section === "Keys & Reads");
  const qt = matched.filter(a => a.section === "QB Threat");
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#7c9aaf", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>In-Game Adjustments</div>
      {matched.length === 0 && (
        <div style={{ fontSize: 11, color: "#7f9fb2", padding: "10px", textAlign: "center", fontStyle: "italic" }}>No specific adjustments flagged — default settings apply.</div>
      )}
      <AdjSection sec="QB Threat" items={qt} icon="🏃" />
      <AdjSection sec="Safety Setup" items={ss} icon="🔭" />
      <AdjSection sec="Zone Drops" items={zd} icon="📐" />
      <AdjSection sec="Pre-Snap" items={ps} icon="🎭" />
      <AdjSection sec="Keys & Reads" items={kr} icon="🏈" />
    </div>
  );
}

const SIT_LABELS = { base:"Base", "2md":"2nd & Mid", "3lg":"3rd & Long", "3sh":"3rd & Short", rz:"Red Zone" };
const BIAS_MAP_RP = { 1:-1.0, 2:-0.65, 3:-0.30, 4:0, 5:0.30, 6:0.65, 7:1.0 };

export default function FormationDetail({ fm, flat, situation = "base", runPass = 4 }) {
  const [tab, setTab] = useState("coverages");
  const [showWhy, setShowWhy] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const blitz = getBlitz(fm, flat);

  // ── Scoring factor calculations ───────────────────────────────────────────
  const runBias = BIAS_MAP_RP[runPass] || 0;
  let biasAdj = 0;
  if (fm.priority === "run" && runBias > 0) biasAdj = Math.round(runBias * 15);
  else if (fm.priority === "pass" && runBias < 0) biasAdj = Math.round(-runBias * 15);
  else if (fm.priority === "run" && runBias < 0) biasAdj = Math.round(runBias * 10);
  else if (fm.priority === "pass" && runBias > 0) biasAdj = Math.round(-runBias * 10);

  const avoidFired = (fm.avoidTags || []).filter(t => flat.includes(t));
  const blitzModsFired = (fm.blitzMods || []).filter(m => m.tags.some(t => flat.includes(t)));
  const situAdj = fm._situationAdj || 0;

  return (
    <div style={{ background: "#090f1a", border: "1px solid var(--color-gold)", borderTop: "none", borderLeft: `3px solid ${PC[fm.priority]}`, borderRadius: "0 0 9px 9px", overflow: "hidden", marginBottom: 18 }}>
      {/* Blitz bar */}
      <div style={{ padding: "16px 16px", borderBottom: "1px solid #1e2a3a", background: "#090f1a" }}>
        <BlitzBar pct={blitz} />
        {fm.blitzMods.filter(m => m.tags.some(t => flat.includes(t))).slice(0, 3).map((m, i) => (
          <div key={i} style={{ fontSize: "11px", color: "#7f9fb2", marginTop: 3, display: "flex", gap: 8 }}>
            <span style={{ color: m.d >= 0 ? "#d4aa30" : "#558a68", fontWeight: "bold" }}>{m.d >= 0 ? `+${m.d}%` : `${m.d}%`}</span>
            <span>— {m.tags.filter(t => flat.includes(t)).map(t => TRAIT_LABELS[t] || t).join(", ")}</span>
          </div>
        ))}
      </div>

      {/* Why This Formation Was Selected — collapsible */}
      <div style={{ borderBottom: "1px solid #1e2a3a", background: "#090f1a" }}>
        <button
          onClick={() => setShowWhy(v => !v)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", padding: "10px 16px", cursor: "pointer", textAlign: "left" }}
        >
          <span style={{ fontSize: 11, fontWeight: "700", color: "#7f9fb2", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            Why This Formation Was Selected
          </span>
          <span style={{ fontSize: 11, color: "#b8880c", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, marginLeft: 8 }}>
            {showWhy ? "▼" : "▶"}
          </span>
        </button>

        {showWhy && (
          <div style={{ padding: "12px 16px 12px", background: "linear-gradient(to bottom, #0e1828 0%, #1a2030 25%)", borderTop: "1px solid #2a3545" }}>
            <WhySelected coreHits={fm.coreHits} suppHits={fm.suppHits} />

            {/* DC Logic */}
            <div style={{ marginTop: 12, background: "#080c15", border: "1px solid #1a3050", borderRadius: 5, padding: "10px 13px" }}>
              <div style={{ fontSize: "12px", color: "#6888a0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2, fontFamily: "'IBM Plex Mono', monospace", fontWeight: "700" }}>DC Logic</div>
              <div style={{ fontSize: 11, color: "#7898ae", lineHeight: 1.65 }}>{fm.dcNote}</div>
            </div>

            {/* Collapsible Scoring Factors — nested inside Why */}
            <button
              onClick={() => setShowScoring(v => !v)}
              style={{ marginTop: 10, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: "#b8880c", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px", fontWeight: "700" }}
            >
              {showScoring ? "▼ Scoring Factors" : "▶ Scoring Factors"}
            </button>

            {showScoring && (
              <div style={{ marginTop: 8, borderTop: "1px solid #2a3545", paddingTop: 10 }}>
                <div style={{ fontSize: 10, color: "#6888a0", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>Scoring Factors</div>
                {/* Run/Pass Bias */}
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#6888a0", minWidth: 110 }}>Run/Pass Bias:</span>
                  {biasAdj === 0
                    ? <span style={{ color: "#6888a0" }}>Balanced</span>
                    : <span style={{ color: biasAdj > 0 ? "#70b080" : "#aa6868" }}>
                        {biasAdj > 0 ? `+${biasAdj}` : biasAdj} {fm.priority} {biasAdj > 0 ? "bias" : "penalty"}
                      </span>
                  }
                </div>
                {/* AvoidTags Penalty */}
                {avoidFired.length > 0 && (
                  <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
                    <span style={{ color: "#6888a0", minWidth: 110 }}>Avoid Penalty:</span>
                    <span style={{ color: "#aa6868" }}>-25: {avoidFired.map(t => TRAIT_LABELS[t] || t).join(", ")}</span>
                  </div>
                )}
                {/* Blitz Modifiers */}
                {blitzModsFired.slice(0, 2).map((m, i) => (
                  <div key={i} style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
                    <span style={{ color: "#6888a0", minWidth: 110 }}>Blitz Mod:</span>
                    <span style={{ color: m.d >= 0 ? "#d4aa30" : "#558a68" }}>
                      {m.d >= 0 ? `+${m.d}%` : `${m.d}%`} — {m.tags.filter(t => flat.includes(t)).map(t => TRAIT_LABELS[t] || t).join(", ")}
                    </span>
                  </div>
                ))}
                {/* Situation Adjustment */}
                {situation !== "base" && (
                  <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
                    <span style={{ color: "#6888a0", minWidth: 110 }}>Situation:</span>
                    <span style={{ color: situAdj !== 0 ? "#b8880c" : "#6888a0" }}>
                      {SIT_LABELS[situation]}{situAdj !== 0 ? (situAdj > 0 ? ` +${situAdj}` : ` ${situAdj}`) : " — no adjustment"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inner tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1e2a3a", background: "#080c15" }}>
        {[
          { id: "coverages", l: "📡 Coverages" },
          { id: "preSnap",   l: "🎮 Pre-Snap" },
          { id: "coaching",  l: "⚙️ Adjustments" },
          { id: "callsheet", l: "📋 Callsheet" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "8px 2px", background: "transparent", border: "none",
            borderBottom: tab === t.id ? "2px solid #c8960c" : "2px solid transparent",
            color: tab === t.id ? "#b8880c" : "#7898ae",
            fontSize: "11px", fontWeight: tab === t.id ? "bold" : "normal", cursor: "pointer"
          }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding: 13 }}>
        {tab === "coverages" && fm.coverages.map((c, i) => (
          <div key={i} style={{ background: "#080c15", border: "1px solid #1e2a3a", borderLeft: `3px solid ${["#b8880c","#6090b8","#7858a0","#508860"][i] || "#b8880c"}`, borderRadius: 5, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: "bold", fontSize: 11, color: "#c5d0dc" }}>{c.name}</span>
                <span style={{ fontSize: "12px", background: "#111009", border: "1px solid #3a2800", color: "#b8880c", padding: "1px 5px", borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{c.tag}</span>
                {i === 0 && <span style={{ fontSize: "12px", background: "#0a2010", border: "1px solid #2a6030", color: "#558a68", padding: "1px 5px", borderRadius: 4, fontWeight: "bold", fontFamily: "'IBM Plex Mono', monospace" }}>BASE</span>}
              </div>
              <span style={{ fontSize: 11 }}>
                <span style={{ color: "#d4aa30" }}>{"★".repeat(c.rating)}</span>
                <span style={{ color: "#506880" }}>{"★".repeat(5 - c.rating)}</span>
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#90b0c4", lineHeight: 1.65 }}>{c.detail || c.note}</div>
          </div>
        ))}

        {tab === "preSnap" && (
          <div>
            <div style={{ fontSize: "12px", color: "#7c9aaf", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>Every Snap — Before the Ball is Snapped</div>
            {fm.preSnap.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8, background: "#080c15", border: "1px solid #1e2a3a", borderRadius: 5, padding: "14px 16px", marginBottom: 8 }}>
                <span style={{ color: "#b8880c", flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 11, color: "#98b4c8", lineHeight: 1.55 }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "coaching" && (
          <div>
            <AdjustmentsPanel flat={flat} />
            {(flat.includes("boundary_hash") || flat.includes("field_hash")) && (
              <div style={{ marginTop: 4, background: "#080c15", border: "1px solid #1e2a3a", borderLeft: "3px solid #3a5a7a", borderRadius: 5, padding: "10px 13px" }}>
                <div style={{ fontSize: 10, color: "#b8880c", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>📐 Hash Shade</div>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "#c5d0dc", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>
                  {flat.includes("boundary_hash") ? "Shade toward boundary" : "Shade toward field"}
                </div>
                <div style={{ fontSize: 11, color: "#7f9fb2", lineHeight: 1.55 }}>
                  {flat.includes("boundary_hash")
                    ? "Routes attack the wide side — shade your coverage toward the boundary and rotate safety support to the field."
                    : "Safety midpoint shifts to field side — routes concentrate to the wide hash. Rotate coverage toward the field."}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "callsheet" && (
          <div>
            <div style={{ fontSize: "12px", color: "#7c9aaf", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>Down & Distance Quick Reference</div>
            {fm.callsheet.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "95px 1fr", background: i % 2 === 0 ? "#080c15" : "#060910", border: "1px solid #1e2a3a", borderRadius: 4, marginBottom: 4, overflow: "hidden" }}>
                <div style={{ padding: "10px 12px", background: "#050708", borderRight: "1px solid #1e2a3a", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: "bold", color: "#b8880c", fontFamily: "'IBM Plex Mono', monospace" }}>{c.down}</span>
                </div>
                <div style={{ padding: "10px 13px" }}>
                  <div style={{ fontSize: 15, fontWeight: "700", color: "#c5d0dc", fontFamily: "'IBM Plex Mono', monospace" }}>{c.call}</div>
                  {c.note && <div style={{ fontSize: 11, color: "#7f9fb2", fontStyle: "italic", marginTop: 1 }}>{c.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
