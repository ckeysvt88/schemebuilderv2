export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        minHeight: 36, minWidth: 36, padding: 0,
        background: "transparent",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--r-sm)",
        color: "var(--color-text-2)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "all 150ms ease",
      }}
    >
      {isDark ? (
        /* Sun — click to switch to light */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.8"/>
          <line x1="8" y1="1"  x2="8"  y2="3"/>
          <line x1="8" y1="13" x2="8"  y2="15"/>
          <line x1="1" y1="8"  x2="3"  y2="8"/>
          <line x1="13" y1="8" x2="15" y2="8"/>
          <line x1="3"  y1="3"  x2="4.5" y2="4.5"/>
          <line x1="11.5" y1="11.5" x2="13" y2="13"/>
          <line x1="13" y1="3" x2="11.5" y2="4.5"/>
          <line x1="4.5" y1="11.5" x2="3" y2="13"/>
        </svg>
      ) : (
        /* Moon — click to switch to dark */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M13.5 9A6 6 0 0 1 7.5 15a6 6 0 0 1-5-8.5A5.5 5.5 0 0 0 9 13.5 5.5 5.5 0 0 0 13.5 9z"/>
        </svg>
      )}
    </button>
  );
}
