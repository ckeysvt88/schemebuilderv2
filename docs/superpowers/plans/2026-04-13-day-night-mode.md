# Day/Night Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a day/night toggle to the bottom nav bar that switches between dark (current) and a cool slate light mode, persisted via localStorage.

**Architecture:** A `[data-theme="light"]` CSS block in `index.css` overrides all design tokens. `App.jsx` holds `isDark` state and applies the attribute to `document.documentElement`. The toggle is a 5th slot in `BottomNav`. Hardcoded dark hex values in component files are replaced with CSS variables so all screens adapt automatically.

**Tech Stack:** React 19, Vite, CSS custom properties, localStorage

---

## File Map

| File | Change |
|---|---|
| `src/index.css` | Add `[data-theme="light"]` token block, XO override, transition rule |
| `src/App.jsx` | Add `isDark` state, `onToggle`, `useEffect` to apply `data-theme`, pass to `BottomNav` |
| `src/components/BottomNav.jsx` | Accept `isDark`/`onToggle` props, 5-column grid, 5th slot with `ThemeToggle` |
| `src/components/ScoutScreen.jsx` | Replace 3 hardcoded dark gradients + hardcoded `#07080f` text colors |
| `src/components/GamePlanScreen.jsx` | Replace hardcoded dark header gradient + hardcoded dark surface colors |
| `src/components/CompareScreen.jsx` | Replace hardcoded dark header gradient |
| `src/components/TeamsScreen.jsx` | Replace hardcoded dark header gradient |
| `src/components/DriveLogger.jsx` | Replace hardcoded dark header gradient + dark surface colors |
| `src/components/FormationCard.jsx` | Replace hardcoded dark gradients with CSS variables |
| `src/components/WhySelected.jsx` | Replace hardcoded dark surface with CSS variable |
| `src/components/NotesScreen.jsx` | Replace hardcoded `#07080f` button text color |

**Not changed:** `src/components/ThemeToggle.jsx` (already correct), `src/components/CallSheetPDF.jsx` (PDF renderer, has its own color system independent of CSS)

---

## Task 1: CSS light mode tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add the `[data-theme="light"]` token block and transition rule**

Open `src/index.css` and append the following after the closing `}` of the `:root` block (after line 33):

```css
/* ── Light mode overrides ────────────────────────────────────────────────── */
[data-theme="light"] {
  --color-bg:             #f0f2f5;
  --color-surface-1:      #e8ecf2;
  --color-surface-2:      #dfe5ee;
  --color-surface-3:      #d8dfe8;
  --color-surface-danger: #f5e8e8;
  --color-surface-success:#e8f2ea;
  --color-border-subtle:  #c8d0da;
  --color-border:         #b0bcc8;
  --color-border-active:  #a89050;
  --color-text-1:         #1a2030;
  --color-text-2:         #3a4858;
  --color-text-3:         #5a6878;
  --color-gold:           #7a6018;
  --color-gold-bright:    #9a7828;
  --color-gold-dim:       #6a5418;
  --color-gold-surface:   #eae5d8;
  --color-gold-border:    #a89050;
}

/* ── XO pattern: lighter opacity in light mode ───────────────────────────── */
[data-theme="light"] .xo-hero::before {
  color: rgba(120, 96, 24, 0.15);
}

/* ── Smooth theme transition ─────────────────────────────────────────────── */
*, *::before, *::after {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

- [ ] **Step 2: Verify the CSS is valid**

```bash
cd schemebuilders-v2 && npm run lint
```

Expected: no errors referencing `index.css`.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add light mode CSS token overrides"
```

---

## Task 2: Theme state in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add isDark state and onToggle**

In `src/App.jsx`, add the following after the existing `useState` imports and before the first state declaration (around line 14):

```js
// ── Theme ────────────────────────────────────────────────────────────────────
const [isDark, setIsDark] = useState(() => {
  try { return localStorage.getItem('sb_theme') !== 'light'; } catch { return true; }
});

const onToggle = useCallback(() => {
  setIsDark(prev => {
    const next = !prev;
    try { localStorage.setItem('sb_theme', next ? 'dark' : 'light'); } catch {}
    return next;
  });
}, []);
```

`useCallback` is already imported at the top of the file.

- [ ] **Step 2: Add useEffect to apply data-theme to the document**

Add this after the `onToggle` declaration, still inside the `App` function. `useEffect` needs to be added to the import on line 1:

```js
useEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}, [isDark]);
```

Update the import on line 1 to include `useEffect`:
```js
import { useState, useCallback, useEffect } from 'react';
```

- [ ] **Step 3: Pass isDark and onToggle to BottomNav**

Find the `<BottomNav>` usage at the bottom of the JSX (line 195):
```jsx
<BottomNav step={step} setStep={navigate} hasPlan={scored.length > 0} />
```

Replace with:
```jsx
<BottomNav step={step} setStep={navigate} hasPlan={scored.length > 0} isDark={isDark} onToggle={onToggle} />
```

- [ ] **Step 4: Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add isDark state and onToggle in App, wire to BottomNav"
```

---

## Task 3: BottomNav 5th slot

**Files:**
- Modify: `src/components/BottomNav.jsx`

- [ ] **Step 1: Accept isDark and onToggle props**

Change the function signature on line 50 from:
```js
export default function BottomNav({ step, setStep, hasPlan }) {
```
to:
```js
export default function BottomNav({ step, setStep, hasPlan, isDark, onToggle }) {
```

- [ ] **Step 2: Change grid to 5 columns**

Find `gridTemplateColumns: "repeat(4, 1fr)"` (line 65) and change to:
```js
gridTemplateColumns: "repeat(5, 1fr)",
```

- [ ] **Step 3: Add the 5th toggle slot after the TABS.map block**

The `TABS.map(...)` block ends with `)}` before the closing `</div>` of the inner grid div. After the closing `)}` of the map, add:

```jsx
{/* Theme toggle slot */}
<button
  onClick={onToggle}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
  <ThemeToggle isDark={isDark} onToggle={onToggle} style={{ border: "none", pointerEvents: "none" }} />
</button>
```

Wait — `ThemeToggle` renders its own `<button>` which would be nested inside the button above. Instead, render the SVG icon directly in the slot:

```jsx
{/* Theme toggle slot */}
<button
  onClick={onToggle}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
```

- [ ] **Step 4: Verify lint passes and start dev server**

```bash
npm run lint
npm run dev
```

Open the app. Confirm the bottom nav now has 5 slots and the toggle button shows a sun icon (in dark mode). Click it — the app should switch to light mode with the cool slate palette. Click again to return to dark.

- [ ] **Step 5: Commit**

```bash
git add src/components/BottomNav.jsx
git commit -m "feat: add theme toggle as 5th slot in BottomNav"
```

---

## Task 4: Fix sticky header gradients

**Files:**
- Modify: `src/components/ScoutScreen.jsx`
- Modify: `src/components/GamePlanScreen.jsx`
- Modify: `src/components/CompareScreen.jsx`
- Modify: `src/components/TeamsScreen.jsx`
- Modify: `src/components/DriveLogger.jsx`

All of these have `background: "linear-gradient(135deg, #07090f, #0c1220)"` as sticky/fixed headers. In light mode, these render as dark bars on a light page. Replace each with `var(--color-surface-1)` → `var(--color-surface-2)`.

- [ ] **Step 1: Fix ScoutScreen.jsx — sticky top bar (line 119)**

Find:
```js
background: "linear-gradient(135deg, #07090f, #0c1220)",
borderBottom: "1px solid var(--color-border-subtle)",
padding: "8px 16px",
paddingTop: "calc(8px + env(safe-area-inset-top))",
position: "sticky", top: 0, zIndex: 80,
```

Replace `background` value:
```js
background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
```

- [ ] **Step 2: Fix ScoutScreen.jsx — playbook dropdown header (line 148)**

Find:
```js
background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "1px solid var(--color-border-subtle)", padding: "10px 16px", position: "sticky", top: "calc(40px + env(safe-area-inset-top))", zIndex: 79
```

Replace the background:
```js
background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
```

- [ ] **Step 3: Fix GamePlanScreen.jsx — header (line 188)**

Find:
```js
background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)",
```

Replace:
```js
background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)",
```

- [ ] **Step 4: Fix CompareScreen.jsx — header (line 55)**

Find:
```js
background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)",
```

Replace:
```js
background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)",
```

- [ ] **Step 5: Fix TeamsScreen.jsx — header (line 25)**

Find:
```js
background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)",
```

Replace:
```js
background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)",
```

- [ ] **Step 6: Fix DriveLogger.jsx — header (line 78)**

Find:
```js
background: 'linear-gradient(135deg,#07090f,#0c1220)', borderBottom: '2px solid #b8880c',
```

Replace:
```js
background: 'linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))', borderBottom: '2px solid var(--color-gold)',
```

- [ ] **Step 7: Verify in browser**

With the dev server running, toggle to light mode. Check every screen (Scout, Plan, Compare, Teams, and the DriveLogger modal). Every sticky header should now use the cool slate gradient, not a dark bar.

- [ ] **Step 8: Commit**

```bash
git add src/components/ScoutScreen.jsx src/components/GamePlanScreen.jsx src/components/CompareScreen.jsx src/components/TeamsScreen.jsx src/components/DriveLogger.jsx
git commit -m "fix: replace hardcoded dark header gradients with CSS variables"
```

---

## Task 5: Fix gold button text colors

**Files:**
- Modify: `src/components/ScoutScreen.jsx`
- Modify: `src/components/NotesScreen.jsx`

Gold buttons in dark mode use `color: "#07080f"` (dark text on bright gold). In light mode, the gold is darker (`#7a6018`), so the text must be light. Replacing with `var(--color-bg)` works for both: dark mode `--color-bg` = `#07080f` (dark on bright gold ✓), light mode `--color-bg` = `#f0f2f5` (light on dark gold ✓).

- [ ] **Step 1: Fix ScoutScreen.jsx — onboarding numbered circles (line 82)**

Find:
```js
background: "var(--color-gold)", color: "#07080f", fontSize: 10, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontFamily: "var(--font-mono)"
```

Replace `color: "#07080f"` with `color: "var(--color-bg)"`.

- [ ] **Step 2: Fix ScoutScreen.jsx — onboarding dismiss button (line 107)**

Find:
```js
background: "linear-gradient(135deg,#b8880c,#d4a020,#b8880c)", border: "none", borderRadius: "var(--r-md)", color: "#07080f",
```

Replace `color: "#07080f"` with `color: "var(--color-bg)"`.

- [ ] **Step 3: Fix ScoutScreen.jsx — Build Game Plan button text (line 385)**

Find:
```js
color: flat.length >= 2 ? "#07080f" : "var(--color-text-3)",
```

Replace:
```js
color: flat.length >= 2 ? "var(--color-bg)" : "var(--color-text-3)",
```

- [ ] **Step 4: Fix ScoutScreen.jsx — Load profile button (line 419)**

Find:
```js
style={{ minHeight: 46, background: "var(--color-gold)", border: "none", borderRadius: "var(--r-md)", color: "#07080f",
```

Replace `color: "#07080f"` with `color: "var(--color-bg)"`.

- [ ] **Step 5: Fix ScoutScreen.jsx — Save profile button (line 464)**

Find:
```js
style={{ flex: 1, minHeight: 46, background: "var(--color-gold)", border: "none", borderRadius: "var(--r-md)", color: "#07080f",
```

Replace `color: "#07080f"` with `color: "var(--color-bg)"`.

- [ ] **Step 6: Fix ScoutScreen.jsx — section number circles (line 495)**

Find:
```js
background: "var(--color-gold)", color: "#07080f", fontSize: 11, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-mono)"
```

Replace `color: "#07080f"` with `color: "var(--color-bg)"`.

- [ ] **Step 7: Fix NotesScreen.jsx — add note button text (line 220)**

Find:
```js
color: noteText.trim() ? "#07080f" : "var(--color-text-3)",
```

Replace:
```js
color: noteText.trim() ? "var(--color-bg)" : "var(--color-text-3)",
```

- [ ] **Step 8: Fix NotesScreen.jsx — log drive button text (line 347)**

Find:
```js
color: (dlDown && dlResult) ? "#07080f" : "var(--color-text-3)",
```

Replace:
```js
color: (dlDown && dlResult) ? "var(--color-bg)" : "var(--color-text-3)",
```

- [ ] **Step 9: Verify in browser**

Toggle to light mode. Check Scout screen buttons (numbered circles, build button, save/load profile), Notes screen buttons. All gold-background buttons should have light text in light mode and dark text in dark mode.

- [ ] **Step 10: Commit**

```bash
git add src/components/ScoutScreen.jsx src/components/NotesScreen.jsx
git commit -m "fix: replace hardcoded #07080f gold button text with var(--color-bg)"
```

---

## Task 6: Fix remaining hardcoded dark surfaces

**Files:**
- Modify: `src/components/FormationCard.jsx`
- Modify: `src/components/WhySelected.jsx`
- Modify: `src/components/DriveLogger.jsx`
- Modify: `src/components/GamePlanScreen.jsx`
- Modify: `src/components/ScoutScreen.jsx`

- [ ] **Step 1: Fix FormationCard.jsx — card background gradients (lines 15–16)**

Find:
```js
background: isSelected
  ? "linear-gradient(to bottom, #1c1300 0%, #271a00 45%, #0a0f1a 100%)"
  : "linear-gradient(135deg, #0e1420, #0a0f1a)",
```

Replace with:
```js
background: isSelected
  ? "linear-gradient(to bottom, var(--color-gold-surface) 0%, var(--color-surface-2) 100%)"
  : "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
```

- [ ] **Step 2: Fix WhySelected.jsx — support hit tag (line 14)**

Find:
```js
style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: "#0d1622", border: "1px solid #2a4a6a", color: "#5a7a96" }}
```

Replace:
```js
style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-3)" }}
```

- [ ] **Step 3: Fix DriveLogger.jsx — entry row background (line 164)**

Find:
```js
style={{ background: '#0d1622', border: '1px solid #1e2a3a', borderLeft: `3px solid ${resultColor(e.result)}`,
```

Replace:
```js
style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', borderLeft: `3px solid ${resultColor(e.result)}`,
```

- [ ] **Step 4: Fix DriveLogger.jsx — disabled submit button (line 146–147)**

Find:
```js
width: '100%', padding: 10, background: form.result ? '#b8880c' : '#2a2a2a',
border: 'none', borderRadius: 7, color: form.result ? '#0a0e16' : '#555',
```

Replace:
```js
width: '100%', padding: 10, background: form.result ? 'var(--color-gold)' : 'var(--color-surface-3)',
border: 'none', borderRadius: 7, color: form.result ? 'var(--color-bg)' : 'var(--color-text-3)',
```

- [ ] **Step 5: Fix GamePlanScreen.jsx — tempo warning banner (line 291)**

Find:
```js
background: "#0d1408", border: "1px solid var(--color-gold)", borderLeft: "4px solid #b8880c",
```

Replace:
```js
background: "var(--color-gold-surface)", border: "1px solid var(--color-gold-border)", borderLeft: "4px solid var(--color-gold)",
```

- [ ] **Step 6: Fix GamePlanScreen.jsx — avoid/blitz panels (lines 390, 394)**

Find:
```js
background: "#140708", border: "1px solid #4a1818",
```

Replace:
```js
background: "var(--color-surface-danger)", border: "1px solid var(--color-border)",
```

Find (line 394):
```js
background: "#071408", border: "1px solid #184a18",
```

Replace:
```js
background: "var(--color-surface-success)", border: "1px solid var(--color-border)",
```

- [ ] **Step 7: Fix ScoutScreen.jsx — "editing active plan" banner (line 221)**

Find:
```js
background: "#0a140a", border: "1px solid #2a4020", borderLeft: "3px solid var(--color-success)", borderRadius: "var(--r-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#88bb60",
```

Replace:
```js
background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-success)", borderRadius: "var(--r-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--color-success)",
```

- [ ] **Step 8: Fix ScoutScreen.jsx — onboarding "You'll get" tags (line 98)**

Find:
```js
style={{ background: "#0a1a0a", border: "1px solid #1e4020", borderRadius: 16, padding: "3px 9px", fontSize: 9, color: "var(--color-success)" }}
```

Replace:
```js
style={{ background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "3px 9px", fontSize: 9, color: "var(--color-success)" }}
```

- [ ] **Step 9: Verify in browser**

Toggle to light mode and check:
- Formation cards on the Plan screen — should use slate surfaces, selected card uses a warm tint
- WhySelected tags — readable on light background
- DriveLogger entry rows — slate surface
- GamePlanScreen tempo warning, avoid/blitz panels
- Scout screen editing banner and onboarding tags

- [ ] **Step 10: Commit**

```bash
git add src/components/FormationCard.jsx src/components/WhySelected.jsx src/components/DriveLogger.jsx src/components/GamePlanScreen.jsx src/components/ScoutScreen.jsx
git commit -m "fix: replace hardcoded dark surfaces with CSS variables for light mode"
```

---

## Task 7: Final smoke test

- [ ] **Step 1: Lint the full project**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 2: Full dark mode walkthrough**

With the dev server running, ensure dark mode is active. Walk through:
- Scout screen — sticky header, trait cards, section numbers, build button
- Plan screen (build a game plan first) — header, formation cards, avoid/blitz panels, tempo warning if applicable
- Compare screen — header
- Teams screen — header
- Notes screen — add a note, confirm button text is readable

- [ ] **Step 3: Toggle to light mode and repeat walkthrough**

Same screens. Confirm:
- All sticky headers are slate gradient, not dark bars
- Gold is muted (dark bronze tone), not glowing
- All text is dark and readable
- Formation cards, banners, and tag surfaces are all light-toned
- Toggling back to dark mode restores the original appearance

- [ ] **Step 4: Confirm localStorage persistence**

Toggle to light mode. Refresh the page. Confirm it stays in light mode. Toggle back to dark, refresh again. Confirm it stays dark.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: day/night mode toggle complete"
```
