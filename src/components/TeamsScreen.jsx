import { useState, useEffect } from 'react';
import { TEAMS, CONFERENCES } from '../data/teams.js';

const PERS_LABELS = { p10:"5-WR", p11:"11p", p12:"12p (2 TE)", p21:"21p (FB)", p22:"22p Jumbo", trips:"Trips", empty:"Empty" };

export default function TeamsScreen({ onBuildFromTeam }) {
  const [teamConf, setTeamConf]     = useState("all");
  const [teamSearch, setTeamSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('root')?.scrollTo(0, 0);
  }, []);

  const filteredTeams = TEAMS.filter(t => {
    const matchConf   = teamConf === "all" || t.conf === teamConf;
    const matchSearch = !teamSearch || t.name.toLowerCase().includes(teamSearch.toLowerCase());
    return matchConf && matchSearch;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 12px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Scheme Builders
            </div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>
              Team Picker
            </div>
          </div>
        </div>
        <input
          value={teamSearch}
          onChange={e => setTeamSearch(e.target.value)}
          placeholder="Search teams..."
          style={{
            width: "100%", minHeight: 44, padding: "0 14px",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--r-md)",
            color: "var(--color-text-1)", fontSize: 16,
            fontFamily: "var(--font-sans)",
            boxSizing: "border-box", outline: "none",
          }}
        />
      </div>

      {/* Conference filter */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5, padding: "10px 14px", borderBottom: "1px solid var(--color-border-subtle)" }}>
        {CONFERENCES.map(c => (
          <button
            key={c.id}
            onClick={() => setTeamConf(c.id)}
            style={{
              minHeight: 36, padding: "0 4px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--color-border-subtle)",
              background: teamConf === c.id ? "var(--color-surface-2)" : "transparent",
              color: teamConf === c.id ? "var(--color-gold)" : "var(--color-text-3)",
              fontSize: 10, cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontWeight: teamConf === c.id ? "700" : "400",
              textAlign: "center",
              transition: "all 120ms ease",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Team list */}
      <div style={{ padding: "12px 14px 24px" }}>
        <div style={{ fontSize: 14, color: "var(--color-text-2)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
          {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""} · tap to build game plan
        </div>

        {filteredTeams.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--color-text-3)", padding: 40, fontSize: 13 }}>
            No teams found
          </div>
        )}

        {filteredTeams.map(team => {
          const persTag = team.traits.find(t => ["p10","p11","p12","p21","p22","trips","empty"].includes(t)) || "p11";
          return (
            <div
              key={team.id}
              onClick={() => onBuildFromTeam(team)}
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-subtle)",
                borderLeft: `4px solid ${team.color || "#507890"}`,
                borderRadius: "var(--r-md)",
                padding: "14px 14px",
                marginBottom: 8,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                minHeight: 64,
                transition: "background 150ms ease",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: "700", color: "var(--color-text-1)" }}>{team.name}</span>
                  <span style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{team.conf}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-3)", lineHeight: 1.4 }}>{team.notes}</div>
              </div>
              <span style={{ color: "var(--color-text-3)", fontSize: 16, marginLeft: 10, flexShrink: 0 }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
