import { CALL_STYLES, USER_POSITIONS } from '../data/userProfile.js';

function ChoiceGroup({ title, value, items, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 7 }}>
        {items.map(item => {
          const active = item.id === value;
          return (
            <button key={item.id} onClick={() => onChange(item.id)} style={{ textAlign: "left", minHeight: 52, padding: "8px 11px", background: active ? "var(--color-gold-surface)" : "var(--color-surface-1)", border: `1px solid ${active ? "var(--color-gold)" : "var(--color-border-subtle)"}`, borderRadius: "var(--r-sm)", cursor: "pointer" }}>
              <div style={{ fontSize: 12, color: active ? "var(--color-gold-bright)" : "var(--color-text-1)", fontWeight: 700 }}>{active ? '✓ ' : ''}{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-3)", lineHeight: 1.4, marginTop: 2 }}>{item.note}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function UserProfileModal({ profile, onChange, onClose }) {
  const update = patch => onChange(current => ({ ...current, ...patch }));
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 520, padding: 20, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={event => event.stopPropagation()} style={{ width: "100%", maxWidth: 520, maxHeight: "82dvh", overflowY: "auto", background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, color: "var(--color-gold-bright)", fontWeight: 800 }}>🎮 My Defensive User</div>
            <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.45, marginTop: 4 }}>Tell the app who you control and what you want your defense to prioritize.</div>
          </div>
          <button onClick={onClose} style={{ minHeight: 32, padding: "0 12px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", cursor: "pointer" }}>Done</button>
        </div>
        <ChoiceGroup title="Which defender do you user?" value={profile.position} items={USER_POSITIONS} onChange={position => update({ position })} />
        <ChoiceGroup title="What should your call prioritize?" value={profile.callStyle} items={CALL_STYLES} onChange={callStyle => update({ callStyle })} />
        <div style={{ fontSize: 11, color: "var(--color-text-2)", lineHeight: 1.5, padding: "10px 11px", background: "var(--color-gold-surface)", borderLeft: "3px solid var(--color-gold)", borderRadius: "var(--r-sm)" }}><strong>How this works:</strong> Best Overall stays visible. Best For You can change based on both choices above when this formation has a supported alternative.</div>
      </div>
    </div>
  );
}
