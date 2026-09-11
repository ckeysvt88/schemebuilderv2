import { useState } from 'react';
import { ADJUSTMENTS, computeConflicts } from '../data/adjustments.js';
import { TRAIT_LABELS } from '../data/traits.js';
import BlitzBar from './BlitzBar.jsx';
import WhySelected from './WhySelected.jsx';
import { getFrontStructure } from '../engine/frontStructure.js';

const PC = { run: "#a06030", pass: "#1a6fe8", hybrid: "#7858a0", pressure: "#aa5050" };

function AdjSection({ sec, items, icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: "12px", color: "var(--color-gold)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{icon} {sec}</div>
      {items.map((a, i) => (
        <div key={i} style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-border)", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "var(--color-text-1)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>{a.setting}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.55 }}>{a.reason}</div>
        </div>
      ))}
    </div>
  );
}

function ConflictingReads({ fm, flat, matched }) {
  const conflicts = computeConflicts(fm, flat, matched);
  if (conflicts.length === 0) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>Conflicting Reads</div>
      {conflicts.map(c => (
        <div key={c.axis} style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-danger)", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "var(--color-danger)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>{c.axis}</div>
          {c.entries.map((e, i) => (
            <div key={i} style={{ fontSize: 11, color: "var(--color-text-2)", marginBottom: 3 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: "bold" }}>{e.value}</span>
              <span style={{ color: "var(--color-text-3)" }}> — {e.source}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.55, marginTop: 6 }}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}

function AdjustmentsPanel({ fm, flat }) {
  const matched = ADJUSTMENTS.filter(a => a.triggers.some(t => flat.includes(t)));
  const ss = matched.filter(a => a.section === "Safety Setup");
  const zd = matched.filter(a => a.section === "Zone Drops");
  const ps = matched.filter(a => a.section === "Pre-Snap");
  const kr = matched.filter(a => a.section === "Keys & Reads");
  const qt = matched.filter(a => a.section === "QB Threat");
  return (
    <div>
      {fm.coaching?.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>Formation-Specific</div>
          <div style={{ display: "flex", flexWrap: "nowrap", gap: 5 }}>
            {fm.coaching.map((c, i) => (
              <div key={i} style={{ flex: "1 1 0", minWidth: 0, background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold)", borderRadius: 5, padding: "7px 7px" }}>
                <div style={{ fontSize: 10.5, fontWeight: "bold", color: "var(--color-text-1)", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.3 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.35, marginTop: 3 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConflictingReads fm={fm} flat={flat} matched={matched} />
      <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>Scouting-Based</div>
      {matched.length === 0 && (
        <div style={{ fontSize: 11, color: "var(--color-text-3)", padding: "10px", textAlign: "center", fontStyle: "italic" }}>No specific adjustments flagged — default settings apply.</div>
      )}
      <AdjSection sec="QB Threat" items={qt} icon="🏃" />
      <AdjSection sec="Safety Setup" items={ss} icon="🔭" />
      <AdjSection sec="Zone Drops" items={zd} icon="📐" />
      <AdjSection sec="Pre-Snap" items={ps} icon="🎭" />
      <AdjSection sec="Keys & Reads" items={kr} icon="🏈" />
    </div>
  );
}

export default function FormationDetail({ fm, flat }) {
  const [tab, setTab] = useState("coverages");
  const [showWhy, setShowWhy] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const blitz = fm.blitz;
  const front = getFrontStructure(fm.name);

  return (
    <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-gold)", borderTop: "none", borderLeft: "3px solid var(--color-gold)", borderRadius: "0 0 9px 9px", overflow: "hidden", marginBottom: 18 }}>
      {/* Blitz bar */}
      <div style={{ padding: "16px 16px", borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-bg)" }}>
        <BlitzBar pct={blitz} />
        <div style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 5 }}>
          Suggested frequency: base {fm.blitzLedger.base}% + {fm.blitzLedger.positive}% − {Math.abs(fm.blitzLedger.negative)}%
          {fm.blitzLedger.clamp !== 0 ? `; bounds adjustment ${fm.blitzLedger.clamp > 0 ? '+' : ''}${fm.blitzLedger.clamp}%` : ''}.
          Only the largest increase and largest decrease apply.
        </div>
      </div>

      {/* Why This Formation Was Selected — collapsible */}
      <div style={{ borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-bg)" }}>
        <button
          onClick={() => setShowWhy(v => !v)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", padding: "10px 16px", cursor: "pointer", textAlign: "left" }}
        >
          <span style={{ fontSize: 11, fontWeight: "700", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            Why This Formation Was Selected
          </span>
          <span style={{ fontSize: 11, color: "var(--color-gold)", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, marginLeft: 8 }}>
            {showWhy ? "▼" : "▶"}
          </span>
        </button>

        {showWhy && (
          <div style={{ padding: "12px 16px 12px", background: "var(--color-bg)", borderTop: "1px solid var(--color-border-subtle)" }}>
            <WhySelected coreHits={fm.coreHits} suppHits={fm.suppHits} />

            {/* DC Logic */}
            <div style={{ marginTop: 12, background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderRadius: 5, padding: "10px 13px" }}>
              <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2, fontFamily: "'IBM Plex Mono', monospace", fontWeight: "700" }}>DC Logic</div>
              <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.65 }}>{fm.dcNote}</div>
            </div>

            {/* Collapsible Scoring Factors — nested inside Why */}
            <button
              onClick={() => setShowScoring(v => !v)}
              style={{ marginTop: 10, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: "var(--color-gold)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px", fontWeight: "700" }}
            >
              {showScoring ? "▼ Scoring Factors" : "▶ Scoring Factors"}
            </button>

            {showScoring && (
              <div style={{ marginTop: 8, borderTop: "1px solid var(--color-border-subtle)", paddingTop: 10 }}>
                <div style={{ fontSize: 10, color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>Scoring Factors</div>
                {fm.ledger.map((entry, i) => (
                  <div key={`${entry.id}-${i}`} style={{ fontSize: 11, marginBottom: 5 }}>
                    {entry.label}: {entry.delta > 0 ? '+' : ''}{entry.delta}
                    {entry.reason && <div style={{ color: 'var(--color-text-3)', marginTop: 2 }}>{entry.reason}</div>}
                    {entry.tags?.length ? ` — ${entry.tags.map(t => TRAIT_LABELS[t] || t).join(', ')}` : ''}
                  </div>
                ))}
                <div style={{ fontSize: 11 }}>Fit score: {fm.sc}/100. This is an authored heuristic, not a success probability.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inner tabs */}
      {front && <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-surface-1)", fontSize: 11, lineHeight: 1.5 }}>
        <strong>Formation front:</strong> {front.summary}
        <div style={{ color: "var(--color-text-3)" }}>Positions: {front.labels.join(' · ')}. Alignment only—not the number rushing.</div>
      </div>}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-bg)" }}>
        {[
          { id: "coverages", l: "📡 Coverages" },
          { id: "preSnap",   l: "🎮 Pre-Snap" },
          { id: "coaching",  l: "⚙️ Adjustments" },
          { id: "callsheet", l: "📋 Callsheet" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "8px 2px", background: "transparent", border: "none",
            borderBottom: tab === t.id ? "2px solid var(--color-gold)" : "2px solid transparent",
            color: tab === t.id ? "var(--color-gold)" : "var(--color-text-3)",
            fontSize: "11px", fontWeight: tab === t.id ? "bold" : "normal", cursor: "pointer"
          }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding: 13 }}>
        {tab === "coverages" && fm.rankedCoverages.map((c, i) => (
          <div key={c.name} style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: `3px solid ${["#b8880c","#6090b8","#7858a0","#508860"][i] || "#b8880c"}`, borderRadius: 5, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: "bold", fontSize: 11, color: "var(--color-text-1)" }}>{c.name}</span>
                <span style={{ fontSize: "12px", background: "var(--color-gold-surface)", border: "1px solid var(--color-gold-border)", color: "var(--color-gold)", padding: "1px 5px", borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{c.tag}</span>
                {i === 0 && <span style={{ fontSize: "12px", background: "var(--color-surface-success)", border: "1px solid var(--color-border)", color: "var(--color-success)", padding: "1px 5px", borderRadius: 4, fontWeight: "bold", fontFamily: "'IBM Plex Mono', monospace" }}>RECOMMENDED</span>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.65 }}><strong>Why it fits:</strong> {c.detail || c.note}</div>
            {c.matchup && <div style={{ fontSize: 11, lineHeight: 1.6, marginTop: 8 }}>
              {c.matchup.status !== 'verified' ? <div style={{ color: "var(--color-warning, #9a6b00)", padding: "7px 9px", border: "1px solid var(--color-gold-border)", borderRadius: 4 }}>
                <strong>Exact assignments need verification.</strong> Rush and coverage counts are hidden and do not affect this score.
              </div> : <>
                <div><strong>Overall matchup:</strong> {c.matchup.concept?.utility ?? c.sc}/100 · {c.matchup.concept?.confidence || 'Assignment'} confidence</div>
                {c.matchup.concept && <div style={{ marginTop: 6 }}>
                <p><strong>Biggest risk:</strong> {c.matchup.concept.badCase.label}. {c.matchup.concept.mainConcession}</p>
                <details><summary>Threat-by-threat analysis</summary>
                  {c.matchup.concept.scenarios.map(scenario => <p key={scenario.id}>
                    <strong>{scenario.label} ({scenario.grade}/100)</strong>{scenario.source === 'complement' ? ' · likely counter' : ' · observed'}<br />
                    {scenario.support} <strong>What we allow:</strong> {scenario.concession}
                  </p>)}
                </details>
                </div>}
              <details><summary>Verified assignments and testing limits</summary>
                <p>{c.matchup.structure}</p>
                {c.matchup.support.slice(0, 2).map(text => <p key={text}>{text}</p>)}
                {c.matchup.weaknesses.map(text => <p key={text}>{text}</p>)}
                <p>{c.matchup.evidence}</p>
                {c.matchup.unknowns.map(text => <p key={text}>{text}</p>)}
                <p>Risk adjustments are provisional football judgments, not measured CFB 27 outcomes.</p>
              </details>
              </>}
            </div>}
          </div>
        ))}

        {tab === "preSnap" && (
          <div>
            <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>Every Snap — Before the Ball is Snapped</div>
            {(fm.preSnap || []).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8, background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderRadius: 5, padding: "14px 16px", marginBottom: 8 }}>
                <span style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.55 }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "coaching" && (
          <div>
            <AdjustmentsPanel fm={fm} flat={flat} />
            {(flat.includes("boundary_hash") || flat.includes("field_hash")) && (
              <div style={{ marginTop: 4, background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-border)", borderRadius: 5, padding: "10px 13px" }}>
                <div style={{ fontSize: 10, color: "var(--color-gold)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>📐 Hash Shade</div>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "var(--color-text-1)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>
                  {flat.includes("boundary_hash") ? "Shade toward boundary" : "Shade toward field"}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.55 }}>
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
            <div style={{ fontSize: "12px", color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>Down & Distance Quick Reference</div>
            {(fm.callsheet || []).map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", background: i % 2 === 0 ? "var(--color-surface-1)" : "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: 4, marginBottom: 4, overflow: "hidden" }}>
                <div style={{ padding: "10px 12px", background: "var(--color-bg)", borderRight: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: "bold", color: "var(--color-gold)", fontFamily: "'IBM Plex Mono', monospace" }}>{c.down}</span>
                </div>
                <div style={{ padding: "10px 13px" }}>
                  <div style={{ fontSize: 12, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "'IBM Plex Mono', monospace" }}>{c.call}</div>
                  {c.note && <div style={{ fontSize: 11, color: "var(--color-text-3)", fontStyle: "italic", marginTop: 1 }}>{c.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
