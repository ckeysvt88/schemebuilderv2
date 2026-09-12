import { useState } from 'react';
import { TRAIT_LABELS } from '../data/traits.js';
import WhySelected from './WhySelected.jsx';
import { getFrontStructure } from '../engine/frontStructure.js';
import { getCoverageGuidance } from '../engine/coverageGuidance.js';
import { buildAdjustmentPlan } from '../engine/adjustmentPlan.js';

function AdjustmentsPanel({ fm, flat, situation }) {
  const plan = buildAdjustmentPlan(fm, flat, situation);
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-1)", marginBottom: 3 }}>Set before the drive</div>
      <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.5, marginBottom: 10 }}>Start here. Do not keep changing settings until the offense proves this answer is wrong.</div>
      {plan.settings.length === 0 && (
        <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold)", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
          <strong style={{ fontSize: 11, color: "var(--color-text-1)" }}>Keep the defaults</strong>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.5, marginTop: 4 }}>This call does not need a universal menu adjustment. Get lined up and execute it first.</div>
        </div>
      )}
      {plan.settings.map(item => (
        <div key={item.setting} style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold)", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
            <strong style={{ fontSize: 11, color: "var(--color-text-1)" }}>{item.setting}</strong>
            <strong style={{ fontSize: 11, color: "var(--color-gold)", textAlign: "right" }}>{item.value}</strong>
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.5, marginTop: 4 }}>{item.why}</div>
          <details style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 5 }}>
            <summary style={{ cursor: "pointer", color: "var(--color-gold)" }}>What you give up</summary>
            <div style={{ marginTop: 4, lineHeight: 1.5 }}>{item.tradeoff}</div>
          </details>
        </div>
      ))}

      {plan.alerts.length > 0 && <>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-1)", margin: "16px 0 8px" }}>Only change it when...</div>
        {plan.alerts.map(item => (
          <div key={item.when} style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-pass)", borderRadius: 5, padding: "10px 13px", marginBottom: 7 }}>
            <strong style={{ fontSize: 11, color: "var(--color-text-1)" }}>{item.when}</strong>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.5, marginTop: 4 }}>{item.action}</div>
          </div>
        ))}
      </>}

      <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-success)", borderRadius: 5, padding: "10px 13px", marginTop: 16 }}>
        <div style={{ fontSize: 10, color: "var(--color-success)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>Your user key</div>
        <strong style={{ fontSize: 11, color: "var(--color-text-1)" }}>{plan.userKey.title}</strong>
        <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.5, marginTop: 4 }}>{plan.userKey.text}</div>
      </div>
    </div>
  );
}

function CoverageCard({ call, index, flat, recommended = false, playerChoice = false }) {
  const guidance = getCoverageGuidance(call.name, call.tag, flat);
  return (
    <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: `3px solid ${["#b8880c","#6090b8","#7858a0","#508860"][index] || "#b8880c"}`, borderRadius: 5, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
        <span style={{ fontWeight: "bold", fontSize: 11, color: "var(--color-text-1)" }}>{call.name}</span>
        <span style={{ fontSize: "10px", background: "var(--color-gold-surface)", border: "1px solid var(--color-gold-border)", color: "var(--color-gold)", padding: "2px 5px", borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{call.tag}</span>
        {recommended && !call.optionRoles?.length && <span style={{ fontSize: "10px", background: "var(--color-surface-success)", border: "1px solid var(--color-border)", color: "var(--color-success)", padding: "2px 5px", borderRadius: 4, fontWeight: "bold", fontFamily: "'IBM Plex Mono', monospace" }}>BEST OVERALL</span>}
        {call.optionRoles?.map(role => (
          <span key={role.id} style={{ fontSize: "10px", background: role.id === 'overall' ? "var(--color-surface-success)" : "var(--color-surface-2)", border: "1px solid var(--color-border)", color: role.id === 'overall' ? "var(--color-success)" : "var(--color-text-2)", padding: "2px 5px", borderRadius: 4, fontWeight: "bold", fontFamily: "'IBM Plex Mono', monospace" }}>
            {role.label}
          </span>
        ))}
        {playerChoice && <span style={{ fontSize: "10px", background: "var(--color-gold-surface)", border: "1px solid var(--color-gold)", color: "var(--color-gold-bright)", padding: "2px 5px", borderRadius: 4, fontWeight: "bold", fontFamily: "'IBM Plex Mono', monospace" }}>BEST FOR YOU</span>}
      </div>
      {call.optionRoles?.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.5, marginBottom: 7 }}>
          {call.optionRoles.map(role => <div key={role.id}>{role.reason}</div>)}
        </div>
      )}
      {playerChoice && call.playerChoiceReason && <div style={{ fontSize: 11, color: "var(--color-gold)", lineHeight: 1.45, marginBottom: 7 }}><strong>Why it fits you:</strong> {call.playerChoiceReason}</div>}
      <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.65 }}>
        <div><strong>Use it when:</strong> {guidance.bestSpot}</div>
        <div><strong>Make them beat you with:</strong> {guidance.offenseAnswer}</div>
      </div>
      <details style={{ fontSize: 11, lineHeight: 1.55, marginTop: 8 }}>
        <summary style={{ cursor: "pointer", color: "var(--color-gold)", fontWeight: 700 }}>Call coaching</summary>
        <p><strong>This call protects:</strong> {guidance.takesAway}</p>
        <p><strong>Your job:</strong> {guidance.userKey}</p>
        <p><strong>Change the call when:</strong> {guidance.getOut}</p>
      </details>
    </div>
  );
}

export default function FormationDetail({ fm, flat, situation }) {
  const [tab, setTab] = useState("coverages");
  const [showWhy, setShowWhy] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const front = getFrontStructure(fm.name);

  return (
    <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-gold)", borderTop: "none", borderLeft: "3px solid var(--color-gold)", borderRadius: "0 0 9px 9px", overflow: "hidden", marginBottom: 18 }}>
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
        {tab === "coverages" && (() => {
          const choices = fm.callOptions?.length ? fm.callOptions : fm.rankedCoverages.slice(0, 4);
          const choiceNames = new Set(choices.map(call => call.name));
          const more = fm.rankedCoverages.filter(call => !choiceNames.has(call.name));
          return <>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-1)", marginBottom: 3 }}>Choose the call for the problem</div>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.5, marginBottom: 10 }}>Best Overall is the top matchup. Best For You also considers your saved defensive user and play style.</div>
            {choices.map((call, index) => <CoverageCard key={call.name} call={call} index={index} flat={flat} recommended={call.name === fm.recommendedCoverage} playerChoice={call.name === fm.personalizedCoverage} />)}
            {more.length > 0 && (
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: "pointer", color: "var(--color-gold)", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>More calls in this formation ({more.length})</summary>
                {more.map((call, index) => <CoverageCard key={call.name} call={call} index={index + choices.length} flat={flat} />)}
              </details>
            )}
          </>;
        })()}

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
          <AdjustmentsPanel fm={fm} flat={flat} situation={situation} />
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
