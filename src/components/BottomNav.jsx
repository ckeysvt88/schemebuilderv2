const TABS = [
  {
    id: "scout",
    label: "Scout",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <circle cx="11" cy="11" r="7"/>
        <circle cx="11" cy="11" r="2.5" fill="currentColor" stroke="none"/>
        <line x1="11" y1="3"    x2="11" y2="7.5"/>
        <line x1="11" y1="14.5" x2="11" y2="19"/>
        <line x1="3"  y1="11"   x2="7.5" y2="11"/>
        <line x1="14.5" y1="11" x2="19" y2="11"/>
      </svg>
    ),
  },
  {
    id: "teams",
    label: "Teams",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 3L4 6.5v4.5c0 4.2 3.1 6.8 7 8 3.9-1.2 7-3.8 7-8V6.5L11 3z"/>
      </svg>
    ),
  },
  {
    id: "plan",
    label: "Plan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <rect x="4" y="3" width="14" height="16" rx="2"/>
        <line x1="8" y1="8"    x2="14" y2="8"/>
        <line x1="8" y1="11.5" x2="14" y2="11.5"/>
        <line x1="8" y1="15"   x2="11" y2="15"/>
      </svg>
    ),
  },
  {
    id: "compare",
    label: "Compare",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <line x1="11" y1="4" x2="11" y2="18"/>
        <rect x="3"  y="7" width="5" height="8" rx="1"/>
        <rect x="14" y="7" width="5" height="8" rx="1"/>
      </svg>
    ),
  },
];

export default function BottomNav({ step, setStep, hasPlan, isDark = true, onToggle = () => {} }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 90,
      background: "rgba(var(--nav-bg, 7, 8, 15), 0.95)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderTop: "1px solid rgba(184, 136, 12, 0.18)",
      paddingBottom: "env(safe-area-inset-bottom)",
      backgroundColor: "color-mix(in srgb, var(--color-bg) 95%, transparent)",
    }}>
      <div style={{
        maxWidth: 720, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
        height: "var(--nav-h)",
      }}>
        {TABS.map(tab => {
          // "notes" step keeps Plan tab highlighted
          const active   = step === tab.id || (tab.id === "plan" && step === "notes");
          const disabled = tab.id === "plan" && !hasPlan && step !== "notes";

          return (
            <button
              key={tab.id}
              onClick={() => { if (!disabled) setStep(tab.id); }}
              aria-label={tab.label}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 3,
                background: "transparent", border: "none",
                cursor: disabled ? "default" : "pointer",
                color: active ? "var(--color-gold)" : disabled ? "var(--color-border)" : "var(--color-text-3)",
                padding: "6px 4px", position: "relative",
                minHeight: 44,
                transition: "color 150ms ease",
                fontFamily: "var(--font-mono)",
              }}
            >
              {/* Active top bar */}
              {active && (
                <div style={{
                  position: "absolute", top: 0, left: "25%", right: "25%",
                  height: 2, background: "var(--color-gold)",
                  borderRadius: "0 0 2px 2px",
                }}/>
              )}

              {/* Plan badge */}
              {tab.id === "plan" && hasPlan && !active && (
                <div style={{
                  position: "absolute", top: 7, right: "calc(50% - 14px)",
                  width: 7, height: 7,
                  background: "var(--color-gold)", borderRadius: "50%",
                  border: "2px solid var(--color-bg)",
                }}/>
              )}

              <div style={{ lineHeight: 1, opacity: disabled ? 0.3 : 1 }}>
                {tab.icon}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? "700" : "500", letterSpacing: "0.3px", lineHeight: 1 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
        {/* Theme toggle slot */}
        <button
          onClick={onToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={!isDark}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 3,
            background: "transparent", border: "none",
            cursor: "pointer",
            color: "var(--color-text-3)",
            padding: "6px 4px",
            minHeight: 44,
            transition: "color 150ms ease",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div style={{ lineHeight: 1 }}>
            {isDark ? (
              /* Sun icon — click to go light */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="11" cy="11" r="3.8"/>
                <line x1="11" y1="2"  x2="11" y2="5"/>
                <line x1="11" y1="17" x2="11" y2="20"/>
                <line x1="2"  y1="11" x2="5"  y2="11"/>
                <line x1="17" y1="11" x2="20" y2="11"/>
                <line x1="4.5"  y1="4.5"  x2="6.5"  y2="6.5"/>
                <line x1="15.5" y1="15.5" x2="17.5" y2="17.5"/>
                <line x1="17.5" y1="4.5"  x2="15.5" y2="6.5"/>
                <line x1="6.5"  y1="15.5" x2="4.5"  y2="17.5"/>
              </svg>
            ) : (
              /* Moon icon — click to go dark */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M18 13.5A8 8 0 0 1 10 5.5a7.5 7.5 0 0 0-1 0 8 8 0 1 0 9 9 7.5 7.5 0 0 1 0-1z"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: "500", letterSpacing: "0.3px", lineHeight: 1 }}>
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </div>
  );
}
