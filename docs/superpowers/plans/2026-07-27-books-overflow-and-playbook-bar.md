# Books Overflow Bottom Sheet + Persistent Playbook Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship two UI fixes that came out of an interactive prototype review (`~/sb-proto/index.html`, options "A3" and "BD"): (1) formation cards show their full playbook list in a bottom sheet instead of an inert "+N" suffix, with the active playbook always sorted first and visually distinct; (2) the Game Plan screen gets a persistent playbook bar that replaces the old two-button "Recommended Playbook" prompt modal.

**Architecture:** Both features are additive UI changes to existing components, no new routes/screens, no new dependencies, no state-management changes beyond reusing what `App.jsx` already exposes (`myBook`, `changeBookManual`). Task 1 touches only `src/components/FormationCard.jsx` (self-contained, uses `react-dom`'s `createPortal` — already used elsewhere in this codebase in `ScoutScreen.jsx` — to escape the `.screen-enter` transform stacking context documented in the audit). Task 2 touches only `src/components/GamePlanScreen.jsx` and removes now-dead `showRecModal` state from `src/App.jsx`. The two tasks do not intersect on any file.

**Tech Stack:** React 19, plain inline `style={{}}` objects using the CSS custom properties in `src/index.css` (no Tailwind, no CSS modules, no component library) — match this convention exactly, do not introduce classNames or a stylesheet.

## Global Constraints

- **No test framework exists in this repo.** `package.json` has only `dev`, `build`, `lint`, `preview` scripts (Vite + ESLint, no vitest/jest/testing-library). Do **not** add one for this plan — that would be disproportionate scope creep for two UI tasks. "Testing" in this plan means: `npx eslint <files you touched>` shows no *new* errors beyond the pre-existing baseline (see below), plus a manual check in the running dev server (`npm run dev`) clicking through the exact interactions listed in each task.
- **Pre-existing lint baseline — do not fix, do not be alarmed by it:** `npx eslint src/` currently reports 52 pre-existing problems repo-wide, entirely in files this plan does not touch (`MacroBuilder.jsx`, `NotesScreen.jsx`, `ScoutScreen.jsx`, `TeamsScreen.jsx`). Specifically for the two files this plan touches: `src/components/FormationCard.jsx` is currently **0 errors** (clean baseline — any error after your change is yours to fix). `src/components/GamePlanScreen.jsx` currently has **16 pre-existing errors** (all `no-unused-vars` and `react-hooks/set-state-in-effect`, unrelated to playbook/recBook code) and `src/App.jsx` has pre-existing errors too. Run `npx eslint <file>` before and after your change on the specific file(s) you touched and confirm the diff in error count matches only what you introduced (should be zero new errors from either task).
- **Styling convention:** every existing component in `src/components/` styles itself with inline `style={{...}}` objects referencing `var(--color-*)`, `var(--font-*)`, `var(--r-*)` custom properties defined in `src/index.css:2-42`. No CSS classes, no styled-components, no Tailwind. New markup in both tasks must follow this exact convention — do not introduce a stylesheet or className-based styling.
- **Do not touch:** `src/data/*.js`, `src/engine/*.js`, `FormationDetail.jsx`, `ScoutScreen.jsx`, `TeamsScreen.jsx`, `CompareScreen.jsx` — out of scope for both tasks.
- Commit after each task with a message describing the change (not "WIP" / "fix").

---

### Task 1: Bottom-sheet books overflow on FormationCard

**Files:**
- Modify: `src/components/FormationCard.jsx` (full file — currently 108 lines)
- Modify: `src/components/GamePlanScreen.jsx:505` and `:526` (add one prop to each `<FormationCard>` call)

**Interfaces:**
- Consumes: `fm.books` (string array, already on every formation object passed to `FormationCard` — no change to its shape), `myBook` (string, already exists as a prop in `GamePlanScreen` at line 104, currently **not** passed down to `FormationCard` — this task adds that one prop at the two call sites).
- Produces: `FormationCard` gains a new optional prop `myBook` (string | undefined). No other component reads anything new from `FormationCard` — `PC` and `PL` named exports (consumed by `CompareScreen.jsx`) are unchanged.

- [ ] **Step 1: Replace `src/components/FormationCard.jsx` in full**

Read the current file first (`Read src/components/FormationCard.jsx`) so you can see exactly what's being replaced — the outer card `<div>` (border/background/padding logic), the priority dot/badge/personnel badge/ddDelta row, the score column, and the score progress bar are all **unchanged**. Only the "books line" (currently lines 70-72: `{fm.books.slice(0, 3).join(" · ")}{fm.books.length > 3 ? ...}`) is replaced, plus a new prop and a new sub-component are added.

Replace the entire file with:

```jsx
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
  const dragState = useRef({ startY: 0, dragging: false });

  const onHandleDown = (e) => {
    dragState.current.startY = e.touches ? e.touches[0].clientY : e.clientY;
    dragState.current.dragging = true;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };
  const onHandleMove = (e) => {
    if (!dragState.current.dragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = Math.max(0, y - dragState.current.startY);
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onHandleUp = (e) => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
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
          onMouseDown={onHandleDown} onMouseMove={onHandleMove} onMouseUp={onHandleUp} onMouseLeave={onHandleUp}
          onTouchStart={onHandleDown} onTouchMove={onHandleMove} onTouchEnd={onHandleUp}
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
```

Notes on what changed vs. the original, so you can sanity-check your edit:
- Added `useRef, useState` and `createPortal` imports.
- Added module-level `orderBooks()` and `BooksSheet` sub-component (new).
- `FormationCard` signature gained a 4th prop, `myBook`.
- The books line (old lines 70-72, the `fm.books.slice(0,3).join(" · ")` text) is now a `<div style={{ display:"flex", flexWrap:"wrap", ...}}>` of real chip `<span>`s plus a `<button>` for "+N" — nothing else in the card (name/badges/score/progress bar/expanded-desc block) changed at all.
- The component now returns a fragment (`<>...</>`) so the portal-rendered sheet can be a sibling of the card `<div>`.

- [ ] **Step 2: Pass `myBook` down from `GamePlanScreen.jsx`**

Two call sites need the same one-prop addition. Read `src/components/GamePlanScreen.jsx` and find these two lines (currently identical text, appearing once around line 505 and once around line 526):

```jsx
<FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
```

Change **both** occurrences to:

```jsx
<FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} myBook={myBook} />
```

`myBook` is already an in-scope prop of `GamePlanScreen` (destructured in its function signature) — no import or new prop threading needed beyond this.

- [ ] **Step 3: Lint the two touched files**

Run: `npx eslint src/components/FormationCard.jsx src/components/GamePlanScreen.jsx`

Expected: `FormationCard.jsx` reports 0 errors (it was 0 before your change — stay at 0). `GamePlanScreen.jsx` reports exactly the same 16 pre-existing errors as the baseline noted in Global Constraints (all `no-unused-vars` / `react-hooks/set-state-in-effect`, none touching the lines you changed) — if you see a 17th, new error, it's yours to fix.

- [ ] **Step 4: Manual verification in the dev server**

Run: `npm run dev` (from the repo root, not the worktree-nested `node_modules` — run it from inside this task's worktree directory). Open the printed local URL in a browser at a narrow (~390px) viewport (devtools device toolbar, e.g. "iPhone 14").

Walk through: Scout a few traits (any traits) → tap "Build Game Plan" → land on the Personnel tab of the Game Plan screen. Confirm:
1. Any formation card whose `books` array has more than 3 entries shows real pill chips (not the old dotted text line) plus a "+N" button.
2. Tapping "+N" opens a bottom sheet listing every playbook for that formation, tapping the card underneath does *not* also toggle formation-detail expansion (the `stopPropagation` on the "+N" button).
3. Tapping the dark backdrop closes the sheet.
4. Dragging the small handle bar down by a good amount closes the sheet; a small drag snaps back open.
5. If you've picked a playbook via the Scout screen's own playbook dropdown (top-right chip) before building the plan, that playbook's chip renders first among the visible three and in gold on every card that includes it — confirm this on at least two different cards.
6. Switch to the "All Formations" tab and repeat steps 1-2 on a card there (second `<FormationCard>` call site).

- [ ] **Step 5: Commit**

```bash
git add src/components/FormationCard.jsx src/components/GamePlanScreen.jsx
git commit -m "Replace inert books '+N' text with a draggable bottom sheet

Formation cards showed a plain '+N' text suffix for playbooks beyond the
first three, with no way to see the rest. Cards now render real chips and
a tappable +N that opens a bottom sheet with the full list; the active
playbook always sorts first and renders in gold."
```

---

### Task 2: Persistent playbook bar on the Game Plan screen

**Files:**
- Modify: `src/components/GamePlanScreen.jsx` (header button removal, new persistent bar, prop list change)
- Modify: `src/App.jsx` (remove now-unused `showRecModal` state)

**Interfaces:**
- Consumes: `myBook`, `changeBook`, `manualBook` (already destructured props of `GamePlanScreen`), `changeBookManual` (already exists in `App.jsx`'s `sharedProps` — passed to every screen — but not yet destructured in `GamePlanScreen`'s prop list; this task adds it there), `recBook` (local `const` already computed inside `GamePlanScreen`, unchanged), `PLAYBOOKS` (already imported in `GamePlanScreen.jsx:2`).
- Produces: no new exports. `showRecModal`/`setShowRecModal` are removed entirely from both files — confirm nothing else in the repo references them (a repo-wide check is in Step 1).

- [ ] **Step 1: Confirm `showRecModal` has no other consumers**

Run: `grep -rn "showRecModal" src/`

Expected output — exactly these lines and no others (if you see any file besides `App.jsx` and `GamePlanScreen.jsx`, stop and report `NEEDS_CONTEXT` rather than deleting):

```
src/App.jsx:46:  const [showRecModal, setShowRecModal] = useState(false);
src/App.jsx:212:    showRecModal, setShowRecModal,
src/components/GamePlanScreen.jsx:110:  showRecModal, setShowRecModal,
src/components/GamePlanScreen.jsx:254:                  onClick={() => setShowRecModal(true)}
src/components/GamePlanScreen.jsx:605:      {showRecModal && recBook && (
src/components/GamePlanScreen.jsx:607:          onClick={() => setShowRecModal(false)}
src/components/GamePlanScreen.jsx:629:                  onClick={() => { changeBook(manualBook); setShowRecModal(false); }}
src/components/GamePlanScreen.jsx:636:                  onClick={() => { changeBook(recBook.book); setShowRecModal(false); }}
src/components/GamePlanScreen.jsx:643:                onClick={() => setShowRecModal(false)}
```

(Line numbers may have drifted slightly if Task 1 was committed first in the same working copy — match by content, not exact line number.)

- [ ] **Step 2: Remove `showRecModal` state from `src/App.jsx`**

Find and delete this line (around line 46):
```jsx
  const [showRecModal, setShowRecModal] = useState(false);
```

Find this line inside the `sharedProps` object (around line 212):
```jsx
    showRecModal, setShowRecModal,
```
Delete it (delete the whole line, including its trailing comma-newline — do not leave a blank line with dangling comma on the neighboring line).

- [ ] **Step 3: Update `GamePlanScreen`'s prop list**

Find this line in the function signature (around line 110):
```jsx
  showRecModal, setShowRecModal,
```
Replace it with:
```jsx
  changeBookManual,
```

- [ ] **Step 4: Delete the header's recommended-playbook button**

Find and delete this whole block (around lines 252-265):
```jsx
              {recBook && (
                <button
                  onClick={() => setShowRecModal(true)}
                  style={{
                    ...hdrBtn,
                    color: myBook === recBook.book ? "#90d070" : "#6aaa78",
                    borderColor: myBook === recBook.book ? "var(--color-success)" : "var(--color-border)",
                    background: myBook === recBook.book ? "var(--color-surface-success)" : "transparent",
                  }}
                  aria-label="Recommended playbook"
                >
                  {recBook.book}
                </button>
              )}
```
The 3-item grid (`ExportPDFButton`, Notes button, Adjust button) that remains in that `gridTemplateColumns: "repeat(2, 1fr)"` container is fine left as-is — do not change the grid container itself.

- [ ] **Step 5: Delete the old recommendation modal**

Find and delete this entire block (around lines 604-651, ending right before the component's closing `</>` and `);`):
```jsx
      {/* ── Recommended Playbook modal — outside screen-enter to avoid transform stacking context ── */}
      {showRecModal && recBook && (
        <div
          onClick={() => setShowRecModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-success)", borderRadius: "var(--r-lg)", padding: "22px 22px 20px", width: "100%", maxWidth: 340 }}
          >
            <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "var(--color-success)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
              Recommended Playbook
            </div>
            <div style={{ fontSize: 26, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
              {recBook.book}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 12 }}>
              {recBook.count} of {recBook.total} top formations are in this playbook — the strongest coverage for this opponent.
            </div>
            <div style={{ fontSize: 12, color: "var(--color-success)", lineHeight: 1.55, marginBottom: 20, paddingLeft: 10, borderLeft: "2px solid #2a5830" }}>
              {PLAYBOOKS[recBook.book] ? PLAYBOOKS[recBook.book].desc : ""}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {myBook === recBook.book ? (
                <button
                  onClick={() => { changeBook(manualBook); setShowRecModal(false); }}
                  style={{ flex: 1, minHeight: 46, background: "#2a5020", border: "1px solid var(--color-success)", borderRadius: "var(--r-md)", color: "#90e070", fontWeight: "700", fontSize: 13, cursor: "pointer" }}
                >
                  Back to {manualBook === "All" ? "All Books" : manualBook}
                </button>
              ) : (
                <button
                  onClick={() => { changeBook(recBook.book); setShowRecModal(false); }}
                  style={{ flex: 1, minHeight: 46, background: "#2a5020", border: "1px solid var(--color-success)", borderRadius: "var(--r-md)", color: "#90e070", fontWeight: "700", fontSize: 13, cursor: "pointer" }}
                >
                  Use {recBook.book}
                </button>
              )}
              <button
                onClick={() => setShowRecModal(false)}
                style={{ flex: 1, minHeight: 46, background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-2)", fontSize: 13, cursor: "pointer" }}
              >
                Keep {myBook === "All" ? "All" : myBook}
              </button>
            </div>
          </div>
        </div>
      )}
```

After this deletion, `recBook.second` and `recBook.gap` (computed at lines ~208-209 inside the `recBook` `useMemo`-free IIFE) become unused-by-name outside the object literal — that's fine, leave the `recBook` computation itself completely untouched, it still returns the same shape and `.second`/`.gap` remain valid fields on the object even if this task's new UI doesn't read them.

- [ ] **Step 6: Add local state and the persistent bar**

Immediately after the line `const [tab, setTab] = useState("coverages");`-style local state declarations near the top of the component body (find `const [personnelSel2] = useState(...)` around line 118 and add the new state right after the other page-local `useState` calls in that same block, e.g. right after `const [showTeamInfo, setShowTeamInfo] = useState(false);`), add:

```jsx
  const [pbOpen, setPbOpen] = useState(false);
```

Then, find the line:
```jsx
      <div style={{ padding: "14px 16px" }}>
```
(this opens the main scrollable content area, right after the sticky header's closing `</div>`). Insert the persistent bar as the **first** child inside it, before the existing `{/* ── Down & Distance Situation ── */}` comment block:

```jsx
        {recBook && myBook !== recBook.book && (
          <div style={{ fontSize: 11, color: "var(--color-text-3)", marginBottom: 6, lineHeight: 1.5 }}>
            <span style={{ color: "var(--color-success)", fontWeight: "700" }}>Recommended for this opponent:</span>{" "}
            {recBook.book} — {recBook.confidence.toLowerCase()} fit, {recBook.count}/{recBook.total} top formations
          </div>
        )}
        <div
          onClick={() => setPbOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)",
            borderRadius: pbOpen ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
            padding: "10px 13px", marginBottom: pbOpen ? 0 : 12, cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Playbook</span>
            <span style={{ fontSize: 13, color: "var(--color-gold-bright)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              {myBook === "All" ? "All Books" : myBook}
            </span>
          </div>
          <span style={{ color: "var(--color-gold)", fontSize: 13, transition: "transform 150ms ease", transform: pbOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
        </div>
        {pbOpen && (
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderTop: "none", borderRadius: "0 0 var(--r-md) var(--r-md)", maxHeight: 280, overflowY: "auto", marginBottom: 12 }}>
            {["All", ...Object.keys(PLAYBOOKS)].map(k => {
              const isCur = myBook === k;
              const isRec = recBook && recBook.book === k;
              return (
                <div
                  key={k}
                  onClick={() => { changeBookManual(k); setPbOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                    padding: "10px 13px", borderBottom: "1px solid var(--color-border-subtle)", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: isCur ? "var(--color-gold-bright)" : "var(--color-text-1)", fontWeight: isCur ? "700" : "400" }}>
                    {k === "All" ? "All Books" : k}
                  </span>
                  <span style={{ display: "flex", gap: 5 }}>
                    {isRec && <span style={{ fontSize: 9, background: "var(--color-surface-success)", border: "1px solid var(--color-success)", color: "var(--color-success)", padding: "2px 7px", borderRadius: 9, fontFamily: "var(--font-mono)", fontWeight: "700" }}>Recommended</span>}
                    {isCur && <span style={{ fontSize: 9, background: "var(--color-gold-surface)", border: "1px solid var(--color-gold)", color: "var(--color-gold)", padding: "2px 7px", borderRadius: 9, fontFamily: "var(--font-mono)", fontWeight: "700" }}>Current</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}
```

`recBook` (an object shaped `{ book, count, total, confidence, second, gap }` or `null`) is already computed above in the component body — do not recompute or duplicate it.

- [ ] **Step 7: Lint the two touched files**

Run: `npx eslint src/App.jsx src/components/GamePlanScreen.jsx`

Expected: error count for each file is the same as (or lower than — you removed one unused-state pair) the pre-existing baseline noted in Global Constraints. No new errors. In particular, `showRecModal`/`setShowRecModal` must not appear anywhere in either file's lint output (they shouldn't exist in the source at all after Step 2/3).

- [ ] **Step 8: Manual verification in the dev server**

Run: `npm run dev`, open in a narrow browser viewport, and:

1. From the Team Picker, tap any team → land on Game Plan. Confirm the old header playbook-chip button (that used to sit next to "Adjust") is gone, and a full-width "Playbook: All Books ▾" bar appears right under the header, above the Down & Distance panel.
2. If a "Recommended for this opponent: …" hint line appears above the bar, tap the bar — confirm it expands into a scrollable list of "All Books" + all 29 real playbooks, with the recommended one badged "Recommended" and the current one badged "Current" (on first load with "All Books" active, only the "Recommended" badge should show, on the recommended row).
3. Tap a different playbook row — confirm the bar's label updates immediately, the panel closes, the formation list re-filters to that playbook, and the "Current" badge (if you reopen the panel) has moved to the row you picked.
4. Tap the row matching the recommended book — confirm the "Recommended for this opponent" hint line disappears (since `myBook === recBook.book` now).
5. Refresh the page (or navigate away to Scout and back) — confirm the picked playbook persisted (this exercises the existing `changeBookManual` → `changeBook` → `localStorage.setItem("cfb26_myBook", ...)` path, unchanged by this task).
6. Confirm the "All Formations" tab and "Adjust"/"Notes"/"Call Sheet" header buttons still work exactly as before (they're untouched, this is a regression check on the header block you edited around them).

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx src/components/GamePlanScreen.jsx
git commit -m "Replace recommended-playbook prompt modal with a persistent bar

The old flow buried the current/recommended playbook behind a header chip
that opened a two-button modal, and required opening it just to see what
book was active. A full-width bar under the header now always shows the
active playbook and expands in place to the full list, with Recommended/
Current badges — no modal, no separate 'confirm' step. Removes the now-dead
showRecModal state from App.jsx and GamePlanScreen.jsx."
```
