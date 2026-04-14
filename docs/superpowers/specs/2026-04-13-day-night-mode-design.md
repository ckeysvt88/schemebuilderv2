# Day/Night Mode — Design Spec
**Date:** 2026-04-13  
**Status:** Approved

---

## Overview

Add a day/night mode toggle to Scheme Builders. The toggle lives as a 5th slot in the bottom navigation bar. Theme preference persists across sessions via `localStorage`. The implementation uses CSS custom property overrides — no new React abstractions.

---

## Decisions Made

| Question | Decision |
|---|---|
| Toggle placement | 5th slot in `BottomNav` (keeps header clean) |
| Light palette direction | Cool Slate / Stone |
| Gold in light mode | Desaturated + darkened (`#7a6018`) — quieter accent, not a pop |
| Implementation approach | `[data-theme="light"]` on `<html>` + prop-drilled state in `App.jsx` |

---

## Section 1 — State & Persistence

**File:** `src/App.jsx`

- Add `isDark` boolean state, initialized from `localStorage` key `sb_theme` (default: `true` / dark)
- Add `onToggle` callback: flips `isDark`, writes `"dark"` or `"light"` to `localStorage`
- Add `useEffect` that applies/removes `data-theme="light"` on `document.documentElement` whenever `isDark` changes
- Pass `isDark` and `onToggle` as props to `BottomNav`

```js
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

useEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}, [isDark]);
```

---

## Section 2 — CSS Token Overrides

**File:** `src/index.css`

Add a `[data-theme="light"]` block that redefines all design tokens. Gold accent colors are desaturated and darkened for light mode. All other accent colors (run, pass, hybrid, pressure, success, danger) remain identical.

### Token Mapping

| Token | Dark | Light |
|---|---|---|
| `--color-bg` | `#07080f` | `#f0f2f5` |
| `--color-surface-1` | `#0a0f18` | `#e8ecf2` |
| `--color-surface-2` | `#0d1622` | `#dfe5ee` |
| `--color-surface-3` | `#111927` | `#d8dfe8` |
| `--color-surface-danger` | `#140708` | `#f5e8e8` |
| `--color-surface-success` | `#071408` | `#e8f2ea` |
| `--color-border-subtle` | `#182030` | `#c8d0da` |
| `--color-border` | `#243548` | `#b0bcc8` |
| `--color-border-active` | `#b8880c` | `#a89050` |
| `--color-text-1` | `#eaf2fa` | `#1a2030` |
| `--color-text-2` | `#b0c8dc` | `#3a4858` |
| `--color-text-3` | `#7a9ab4` | `#5a6878` |
| `--color-gold` | `#b8880c` | `#7a6018` |
| `--color-gold-bright` | `#d4a020` | `#9a7828` |
| `--color-gold-dim` | `#9a7828` | `#6a5418` |
| `--color-gold-surface` | `#191408` | `#eae5d8` |
| `--color-gold-border` | `#5a4010` | `#a89050` |

### XO pattern opacity

The `.xo-hero::before` pseudo-element uses a hardcoded `rgba(184, 136, 12, 0.35)`. In light mode, override this to `rgba(120, 96, 24, 0.15)` — same hue, lower opacity and desaturated so it doesn't overpower the lighter background.

### Transition

Add a smooth mode-switch transition to `*, *::before, *::after`:

```css
[data-theme="light"] *, [data-theme="light"] *::before, [data-theme="light"] *::after,
[data-theme="dark"] *, [data-theme="dark"] *::before, [data-theme="dark"] *::after {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

---

## Section 3 — BottomNav Changes

**File:** `src/components/BottomNav.jsx`

- Accept two new props: `isDark: boolean`, `onToggle: () => void`
- Change the grid from `repeat(4, 1fr)` to `repeat(5, 1fr)`
- Add a 5th slot that renders `ThemeToggle` with `isDark` and `onToggle`
- The active gold top-bar indicator only renders for the 4 navigation tabs, not the toggle slot
- Import `ThemeToggle` at the top of the file

In the toggle slot, render `ThemeToggle` without its border (pass a `noBorder` prop or apply `border: none` inline) so it visually matches the other icon-style nav items rather than looking like a button.

**Update `ThemeToggle.jsx`** to accept an optional `noBorder` prop: when true, removes the `border` from its inline styles.

---

## Section 4 — Hardcoded Color Audit

**Confirmed fix required:**

- `src/components/ScoutScreen.jsx` — sticky header gradient `linear-gradient(135deg, #07090f, #0c1220)` → replace with `linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))`

**Grep during implementation** for any additional hardcoded hex colors in the form `#[0-9a-f]{3,6}` in `.jsx` files. Flag and replace with the appropriate CSS variable if they would look broken in light mode. The most likely culprits are very dark near-black values (`#07`, `#0a`, `#0d`, `#11` prefix).

---

## Section 5 — Files Changed

| File | Change |
|---|---|
| `src/App.jsx` | Add `isDark` state, `onToggle`, `useEffect`, pass to `BottomNav` |
| `src/index.css` | Add `[data-theme="light"]` token block + XO override + transition rule |
| `src/components/BottomNav.jsx` | 5-column grid, 5th toggle slot, import `ThemeToggle` |
| `src/components/ThemeToggle.jsx` | Accept optional `noBorder` prop |
| `src/components/ScoutScreen.jsx` | Replace hardcoded header gradient |

---

## Out of Scope

- `prefers-color-scheme` auto-detection (user wants explicit control)
- Theming the onboarding modal separately (it uses CSS variables, adapts automatically)
- Per-screen theme overrides
