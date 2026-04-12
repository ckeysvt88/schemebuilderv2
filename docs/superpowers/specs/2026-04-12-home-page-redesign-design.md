# Home Page Redesign — Design Spec

**Date:** 2026-04-12
**Scope:** `ScoutScreen.jsx` (home page) — layout, hero, onboarding modal
**Status:** Approved

---

## Context

Scheme Builders is a CFB defensive scheme builder app — currently used by a small group, with a public release planned imminently. The primary UX problem is that new users do not know where to start when they land on the Scout screen. The redesign solves this with clear visual structure, a guided step system, and a first-time onboarding modal.

---

## Decisions Made

| Decision | Choice |
|---|---|
| Flow approach | All-Visible Single Scroll — everything on screen, numbered anchors label each step, no gates |
| Trait category layout | 4+3 card grid (4 cards top row, 3 cards bottom row) |
| Hero area | CSS X's & O's pattern — replaces `header.png`, no image asset required |
| Onboarding popup style | Centered modal overlay |
| Onboarding content | Workflow steps (Scout → Bias → Build) + "You'll get" payoff pills |
| Desktop support | Responsive — card grid expands to 7-across at ≥768px |

---

## Page Structure (top to bottom)

1. **Slim sticky top bar** — `CFB · Defensive Intelligence` sub-label (left) + `All Books` playbook selector button (right). No app title here.
2. **X's & O's hero section** — replaces `header.png`. Contains the app title and tagline overlaid on the pattern. Gold bottom border separates hero from content.
3. **Saved Opponents row** — unchanged, only renders when `profiles` exist.
4. **① Scout Traits** — numbered gold anchor label + divider line, followed by the 4+3 card grid.
5. **② Run / Pass Bias** — numbered gold anchor label + the existing 7-position bias slider.
6. **③ Build** — numbered gold anchor label + trait count summary + Build CTA + Save Opponent Profile button.
7. **Footer** — unchanged.
8. **Bottom nav** — unchanged (Scout, Teams, Plan, Compare).

---

## Hero Section

- **No image file.** Pure CSS implementation.
- Background: `#07080f` (existing `--color-bg`)
- Pattern: 6 rows of `X  O  X  O  X ...` rendered via `::before` pseudo-element
  - Font size: ~12px, letter-spacing: 4px, color: `rgba(184,136,12,0.10)` (gold at 10% opacity)
  - Line height: 28px
- Gradient fades: left, right, top, and bottom edges fade into `--color-bg` so the pattern blends seamlessly
- A faint center vertical line (`::after` pseudo-element) evokes a field hash mark
- Bottom border: `2px solid var(--color-gold)`
- **Title block** (inside hero, `position: relative; z-index: 2`):
  - App title: `"Scheme Builders"` — 26px, bold, `--color-text-1` with `"Builders"` in `--color-gold`
  - Tagline: `"Tag tendencies · Set bias · Build your plan"` — 12px, `--color-text-3`, with `Tag`, `Set`, `Build` highlighted in `--color-gold`
- Padding: `28px 16px 18px`

---

## ① Scout Traits — 4+3 Card Grid

### Section anchor
```
① SCOUT TRAITS ————————————————
```
- Gold circle with number, gold label in small caps, gold-to-transparent divider line

### Card grid layout
- **Mobile (default):** Two rows — 4 cards / 3 cards, `gap: 6px`
- **Desktop (≥768px):** Single row of 7 cards

### Card states
| State | Background | Border | Label color | Badge |
|---|---|---|---|---|
| Empty | `#0d1622` | `#182030` | `#7a9ab4` | None |
| Active (has selections) | `#080e0a` | `#2a5828` | `#5a9870` | Green count badge e.g. `3 ✓` |

### Card tap behavior
- Tapping a card **expands an inline panel below the grid** (not a modal)
- Only one panel open at a time — tapping another card closes the current one, opens the new one
- Tapping the active card again collapses it
- Expanded panel: dark background (`#07080f`), green border (`#2a5828`), trait chips inside

### Trait chips (inside expanded panel)
| State | Border | Background | Color |
|---|---|---|---|
| Selected | `1.5px solid #d4a020` | `#191408` | `#d4a020` |
| Unselected | `1px solid #243548` | `#0d1622` | `--color-text-1` |

### 7 categories (order)
**Row 1 (4):** Run Style 🏃, Pass Style 🎯, Field Zones 📍, His Personnel 👥
**Row 2 (3):** Key Threats ⚡, QB Tends 🧠, Situational 📋

---

## ② Run / Pass Bias

- Section anchor label same style as ① but with `2`
- Existing 7-position bias slider — no visual changes, just re-anchored with the numbered label

---

## ③ Build

- Section anchor label same style as ① but with `3`
- Trait count: `"X traits selected · [Playbook]"` — 11px, `--color-text-2`, count in `--color-gold`
- **Build CTA button:**
  - Full width, 50px height, `border-radius: 10px`
  - Gold gradient: `linear-gradient(135deg, #b8880c, #d4a020, #b8880c)`
  - Text: `"Build Game Plan →"` (or `"Update Game Plan →"` when plan exists), 13px bold, `#07080f`
  - Disabled state when `flat.length < 2`: `--color-surface-2` bg, `--color-text-3` text
- **Save Opponent Profile button:** appears at `flat.length >= 2`, ghost style, below CTA, unchanged from current

---

## First-Time Onboarding Modal

### Trigger
- Fires on mount if `localStorage.getItem('sb_onboarded')` is falsy
- Sets `localStorage.setItem('sb_onboarded', '1')` on dismiss
- Never shows again after first dismissal

### Overlay
- `position: fixed; inset: 0` (covers full viewport)
- Background: `rgba(0,0,0,0.88)`
- Centers card horizontally and vertically

### Modal card
- Background: `--color-surface-2` (`#0d1622`)
- Border: `1px solid var(--color-gold)`
- Border radius: 12px
- Padding: `20px 18px`
- Max width: `340px`

### Modal content (top to bottom)
1. **Icon:** 🛡️ — 26px, centered
2. **Title:** `"Welcome to Scheme Builders"` — 15px, bold, `--color-text-1`, centered
3. **Sub-label:** `"CFB Defensive Intelligence"` — 9px, `--color-text-3`, uppercase, letter-spacing, centered
4. **3 numbered steps:**
   - Gold circle number badge (20px), bold step name, secondary description text
   - Step 1: **Scout** — "Tag your opponent's offensive tendencies — run style, pass concepts, personnel, QB traits"
   - Step 2: **Set Bias** — "Dial in their run/pass tendency to sharpen your defensive match"
   - Step 3: **Build Your Plan** — "Get a ranked list of defensive formations built for this opponent"
5. **"You'll get" payoff box:**
   - Dark bg (`#07080f`), subtle border
   - Label: `"YOU'LL GET"` — 8px, `--color-text-3`, uppercase
   - Pills: `✓ Ranked formations`, `✓ Coverage packages`, `✓ Blitz %`, `✓ Call sheets`
   - Pill style: green border, dark green bg, `#5a9870` text
6. **CTA button:** `"Let's Build a Game Plan →"` — full width, 44px, gold gradient, bold, `#07080f` text

---

## Responsive Behavior

| Breakpoint | Card grid | Hero | Modal |
|---|---|---|---|
| < 768px (mobile) | 4+3 two rows | Full width, ~90px tall | Centered, max-width 340px, `padding: 20px` |
| ≥ 768px (desktop) | 7-across single row | Full width, same height | Centered, max-width 340px |

- Max content width: 720px, centered (`margin: 0 auto`) — already in place
- Bottom nav: fixed, same on all sizes

---

## Files to Modify

| File | Change |
|---|---|
| `src/components/ScoutScreen.jsx` | Full rewrite of layout — hero, card grid, anchors, inline expansion, modal |
| `src/App.jsx` | Add `onboarded` localStorage check, pass modal state down (or handle in ScoutScreen) |
| `src/index.css` | Add responsive breakpoint for 7-across card grid at ≥768px; add hero CSS |

No new files required. `header.png` / `hero.png` asset no longer referenced by Scout screen.

---

## Out of Scope

- Game Plan screen (`GamePlanScreen.jsx`) — no changes
- Compare screen — no changes
- Notes screen — no changes
- Teams screen — no changes
- Bottom nav — no changes
- Scoring engine — no changes
