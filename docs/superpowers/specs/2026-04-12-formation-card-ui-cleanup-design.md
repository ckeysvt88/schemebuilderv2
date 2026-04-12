# Formation Card UI Cleanup — Design Spec
**Date:** 2026-04-12  
**Status:** Approved

---

## Problem

When a formation is selected on the GamePlan screen, the highlighted (gold) card and the detail dropdown below it contain duplicate information — name, priority type badge, and playbooks list all appear in both. The "Why This Formation Was Selected" pills appear in the card but also inside the detail. The brief description (`fm.desc`) only lives in the detail sub-box. The DC Logic is stranded in the detail header, disconnected from its reasoning context. When selecting a new formation the screen does not reposition, causing the user's eyes to get lost.

---

## Goals

1. Eliminate duplicate content between the card and the detail sub-box.
2. Move `fm.desc` (brief description) to the main card so key context is immediately visible.
3. Consolidate all "why" reasoning — WhySelected pills + DC Logic — into the detail's WHY section.
4. Auto-scroll the screen when a formation is selected so the card lands directly below the sticky header.

---

## Component Changes

### `FormationCard.jsx`

**Remove:**
- `WhySelected` component render (pills will only live in the detail)

**Add:**
- `fm.desc` — shown when `isSelected === true`, placed below the progress bar, above the "▼ Details below" hint

### `FormationDetail.jsx`

**Remove from header section:**
- `fm.name` (duplicate of card)
- Priority badge `PL[fm.priority]` (duplicate of card)
- `fm.books.join(" · ")` (duplicate of card)
- `fm.desc` (moved to card)

**Restructure "Why" section:**
- `WhySelected` pills are now **always visible** in the detail body (not behind a toggle)
- DC Logic box is moved to sit directly beneath the WhySelected pills, within the same "Why This Formation Was Selected" area
- The `▶ Why this ranked here` toggle now gates only the **Scoring Factors** breakdown (run/pass bias, avoid penalties, blitz mods, situation adjustment)

**Result:** The detail sub-box header shows only the score badge. The body leads with the WHY section (pills → DC Logic → collapsible scoring factors), followed by the blitz bar, then the tabs.

### `GamePlanScreen.jsx`

**Scroll-on-select behavior:**
- Add `data-sticky-header` attribute to the sticky header div
- Pass `data-fm-name={fm.name}` down into each FormationCard wrapper div
- Add a `useEffect` that fires when `selFm` changes:
  - Waits one tick (`setTimeout(..., 50)`) for the DOM to reflect the new selection
  - Reads the sticky header height via `getBoundingClientRect()`
  - Reads the selected card's position via `getBoundingClientRect()`
  - Calls `window.scrollTo({ top: ..., behavior: 'smooth' })` so the card top lands 8px below the header bottom

The `data-fm-name` attribute is added to the outer wrapper `<div key={fm.name}>` in both the personnel tab and the all-formations tab.

---

## Constraints

- No changes to scoring logic, data, or tab content inside FormationDetail.
- No changes to WhySelected component itself — only where it is rendered.
- Localhost review required before any git push.

---

## Files Affected

| File | Change |
|------|--------|
| `src/components/FormationCard.jsx` | Remove WhySelected; add desc when selected |
| `src/components/FormationDetail.jsx` | Remove duplicate header fields; restructure why section |
| `src/components/GamePlanScreen.jsx` | Add scroll-on-select useEffect; add data attributes |
