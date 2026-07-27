import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { blitzInfo } from '../engine/scoring.js';

const PC = { run: "#c07040", pass: "#3a80e0", hybrid: "#7858a0", pressure: "#bb5050" };
const PL = { run: "RUN STOP", pass: "PASS DEF", hybrid: "HYBRID", pressure: "PRESSURE" };

export { PC, PL };

// Active playbook always sorts first — replaces the old raw-data-order render.
function orderBooks(books, active) {
  if (!active || active === "All" || !books.includes(active)) return books;
  return [active, ...books.filter(b => b !== active)];
}

// Bottom sheet listing the formation's full playbook set. Rendered via
// createPortal to document.body so it escapes the `.screen-enter` wrapper's
// transform (animation-fill-mode: forwards leaves every screen parked on
// `transform: translateY(0)`, which makes it the containing block for any
// position:fixed descendant — see the audit). ScoutScreen.jsx's onboarding
// modal already uses this same createPortal escape for the same reason.
function BooksSheet({ fm, books, active, onClose }) {
  const sheetRef = useRef(null);
  const dragState = useRef({ startY: 0, dragging: false, isTouch: false });

  const onHandleDown = (e) => {
    const isTouch = !!e.touches;
    dragState.current.startY = isTouch ? e.touches[0].clientY : e.clientY;
    dragState.current.dragging = true;
    dragState.current.isTouch = isTouch;
    if (sheetRef.current) sheetRef.current.style.transition = "none";

    // For mouse events, attach window-level listeners to track drag across entire screen
    if (!isTouch) {
      window.addEventListener("mousemove", onWindowMouseMove);
      window.addEventListener("mouseup", onWindowMouseUp);
    }
  };

  const onWindowMouseMove = (e) => {
    if (!dragState.current.dragging || dragState.current.isTouch) return;
    const dy = Math.max(0, e.clientY - dragState.current.startY);
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const onWindowMouseUp = (e) => {
    if (!dragState.current.dragging || dragState.current.isTouch) return;
    dragState.current.dragging = false;
    const dy = Math.max(0, e.clientY - dragState.current.startY);
    if (sheetRef.current) sheetRef.current.style.transition = "transform 200ms ease";
    if (dy > 80) { onClose(); } else if (sheetRef.current) sheetRef.current.style.transform = "translateY(0)";
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);
  };

  const onTouchMove = (e) => {
    if (!dragState.current.dragging || !dragState.current.isTouch) return;
    const y = e.touches[0].clientY;
    const dy = Math.max(0, y - dragState.current.startY);
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const onTouchEnd = (e) => {
    if (!dragState.current.dragging || !dragState.current.isTouch) return;
    dragState.current.dragging = false;
    const y = e.changedTouches[0].clientY;
    const dy = Math.max(0, y - dragState.current.startY);
    if (sheetRef.current) sheetRef.current.style.transition = "transform 200ms ease";
    if (dy > 80) { onClose(); return; }
    if (sheetRef.current) sheetRef.current.style.transform = "translateY(0)";
  };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div
        ref={sheetRef}
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "70%",
          background: "var(--color-surface-2)", borderTop: "1px solid var(--color-gold)",
          borderRadius: "var(--r-lg) var(--r-lg) 0 0", padding: "8px 18px 24px",
          overflowY: "auto", transition: "transform 200ms ease",
        }}
      >
        <div
          onMouseDown={onHandleDown}
          onTouchStart={onHandleDown} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border)", margin: "4px auto 12px", cursor: "grab" }}
        />
        <div style={{ fontSize: 15, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
          {fm.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>
          {books.length} playbook{books.length !== 1 ? "s" : ""} carry this formation
        </div>
        {books.map(b => (
          <div key={b} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            padding: "10px 4px", borderBottom: "1px solid var(--color-border-subtle)",
          }}>
            <span style={{
              fontSize: 13, fontFamily: "var(--font-mono)",
              color: b === active ? "var(--color-gold-bright)" : "var(--color-text-1)",
              fontWeight: b === active ? "700" : "400",
            }}>
              {b}
            </span>
            {b === active && (
              <span style={{ fontSize: 9, background: "var(--color-gold-surface)", border: "1px solid var(--color-gold)", color: "var(--color-gold)", padding: "2px 7px", borderRadius: 10, fontFamily: "var(--font-mono)" }}>
                Active
              </span>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

export default function FormationCard({ fm, onSelect, isSelected, myBook }) {
  const bi = blitzInfo(fm.blitz);
  const [sheetOpen, setSheetOpen] = useState(false);
  const ordered = orderBooks(fm.books, myBook);
  const visible = ordered.slice(0, 3);
  const hiddenCount = ordered.length - 3;

  return (
    <>
    <div
      onClick={() => onSelect(fm)}
      style={{
        background: isSelected
          ? "linear-gradient(to bottom, var(--color-gold-surface) 0%, var(--color-surface-2) 100%)"
          : "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
        borderTop: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`,
        borderRight: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`,
        borderBottom: isSelected ? "none" : `1px solid var(--color-border)`,
        borderLeft: isSelected ? `3px solid var(--color-gold)` : `3px solid ${PC[fm.priority]}`,
        borderRadius: isSelected ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
        padding: "14px 16px",
        marginBottom: isSelected ? 0 : 12,
        cursor: "pointer",
        transition: "all 150ms ease",
        minHeight: 64,
      }}
    >
      {/* Row 1: Name + badges + score */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: PC[fm.priority], flexShrink: 0 }} />
            <span style={{
              fontSize: 14, fontWeight: "700",
              color: isSelected ? "var(--color-gold)" : "var(--color-text-1)",
              fontFamily: "var(--font-mono)",
            }}>
              {fm.name}
            </span>
            <span style={{
              fontSize: 10, fontWeight: "700", letterSpacing: "0.4px",
              background: `${PC[fm.priority]}1a`,
              border: `1px solid ${PC[fm.priority]}55`,
              color: PC[fm.priority],
              padding: "2px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)",
            }}>
              {PL[fm.priority]}
            </span>
            <span style={{
              fontSize: 10,
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border-subtle)",
              color: "var(--color-text-3)",
              padding: "2px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)",
            }}>
              {fm.personnel}
            </span>
            {fm.ddDelta !== undefined && fm.ddDelta !== 0 && (
              <span style={{
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: fm.ddDelta > 0 ? "var(--color-success)" : "var(--color-danger)",
              }}>
                {fm.ddDelta > 0 ? `▲+${fm.ddDelta}` : `▼${fm.ddDelta}`}
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 2, alignItems: "center" }}>
            {visible.map(b => (
              <span key={b} style={{
                fontSize: 10.5, fontWeight: b === myBook ? 700 : 600, fontFamily: "var(--font-mono)",
                padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap",
                background: b === myBook ? "var(--color-gold-surface)" : "var(--color-surface-1)",
                border: `1px solid ${b === myBook ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
                color: b === myBook ? "var(--color-gold-bright)" : "var(--color-text-3)",
              }}>
                {b}
              </span>
            ))}
            {hiddenCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSheetOpen(true); }}
                style={{
                  fontSize: 10.5, fontWeight: 600, fontFamily: "var(--font-mono)",
                  padding: "3px 8px", borderRadius: 4, cursor: "pointer",
                  background: "var(--color-surface-2)", border: "1px solid var(--color-border)",
                  color: "var(--color-text-2)",
                }}
              >
                +{hiddenCount}
              </button>
            )}
          </div>
        </div>

        {/* Score column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span style={{
            fontSize: 17, fontWeight: "800", lineHeight: 1,
            color: "var(--color-gold)",
            fontFamily: "var(--font-mono)",
          }}>
            {fm.sc}%
          </span>
          <span style={{ fontSize: 11, fontWeight: "600", color: bi.color, fontFamily: "var(--font-mono)" }}>
            {fm.blitz}% blitz
          </span>
        </div>
      </div>

      {/* Score progress bar */}
      <div style={{ height: 3, borderRadius: 2, background: "var(--color-border-subtle)", marginTop: 8, marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${Math.min(100, fm.sc)}%`, borderRadius: 2, background: "linear-gradient(90deg, var(--color-border), var(--color-gold))" }} />
      </div>

      {isSelected && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 6, fontFamily: "var(--font-mono)" }}>
            {fm.desc}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>
            ▼ Details below — tap to collapse
          </div>
        </div>
      )}
    </div>
    {sheetOpen && (
      <BooksSheet fm={fm} books={ordered} active={myBook} onClose={() => setSheetOpen(false)} />
    )}
    </>
  );
}
