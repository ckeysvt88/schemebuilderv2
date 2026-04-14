# Scheme Builders — Project State
**Last Updated:** 2026-04-13

---

## Overview

**Scheme Builders** is a React/Vite web application designed as a CFB (College Football) defensive coordinator intelligence tool. It helps users scout opposing offenses and get AI-ranked defensive formation recommendations tailored to the opponent's tendencies.

- **Stack:** React 19, Vite 8, `@react-pdf/renderer` 4.4
- **Styling:** Inline styles + CSS custom properties (no Tailwind or component library)
- **Storage:** `localStorage` only — no backend, no auth
- **Target:** Mobile-first, 720px max-width, designed for phone use on game days
- **Design Language:** Dark navy/black base, gold (`#b8880c`) accent, IBM Plex Mono/Sans typography

---

## App Architecture

### Navigation
Single-page app, 4 tab screens managed by `step` state in `App.jsx`. `BottomNav` is always visible.

| Tab | Component | Purpose |
|-----|-----------|---------|
| Scout | `ScoutScreen.jsx` | Tag opponent offensive tendencies |
| Teams | `TeamsScreen.jsx` | Browse CFB teams with preset trait profiles |
| Plan | `GamePlanScreen.jsx` | View ranked defensive formations + call sheet |
| Compare | `CompareScreen.jsx` | Side-by-side playbook formation comparison |

A 5th screen **Notes** (`NotesScreen.jsx`) is accessible from the Plan tab — it keeps the Plan tab highlighted in the nav.

### Core Data Flow
```
ScoutScreen (trait selection)
  → App.jsx: scoreAll(flat, myBook, runPass)
    → engine/scoring.js
      → FDB (formations.js) ranked list
        → GamePlanScreen renders formation cards + detail
```

### State (App.jsx)
- `sel` — selected traits by group `{ runStyle: [...], personnel: [...], ... }`
- `scored` — ranked formation results from scoring engine
- `activeP` — active personnel family tab in GamePlanScreen
- `selFm` — selected formation name (for detail panel)
- `myBook` — selected playbook filter (persisted to localStorage)
- `profiles` — saved opponent profiles (persisted to localStorage as `cfb26_profiles`)
- `runPass` — run/pass bias slider (1–7 scale)
- `ddDown` / `ddDistance` — down & distance filters for situation-adjusted sort

---

## Component Map

```
src/
├── App.jsx                  — Root: state, navigation, share/export logic
├── index.css                — Design tokens (CSS vars), reset, global utilities
├── main.jsx                 — React 19 entry point
│
├── components/
│   ├── ScoutScreen.jsx      — Hero + trait card grid + onboarding modal + profiles UI
│   ├── GamePlanScreen.jsx   — Personnel tabs, formation cards, call sheet, down/dist filter
│   ├── FormationCard.jsx    — Individual formation card (priority stripe, match %, blitz %)
│   ├── FormationDetail.jsx  — Expanded detail panel: coverages, pre-snap keys, coaching board
│   ├── WhySelected.jsx      — "Why This Formation" explainer with core/supp/avoid hits
│   ├── BlitzBar.jsx         — Visual blitz pressure bar
│   ├── CompareScreen.jsx    — Side-by-side playbook comparison
│   ├── TeamsScreen.jsx      — Team browser with conference filter + search
│   ├── NotesScreen.jsx      — Game notes + drive logger per opponent profile
│   ├── CallSheetPDF.jsx     — PDF export via @react-pdf/renderer
│   ├── BottomNav.jsx        — Fixed bottom 4-tab navigation
│   ├── DriveLogger.jsx      — Drive-by-drive result tracking
│   ├── Footer.jsx           — Footer component
│   └── ThemeToggle.jsx      — (Exists but likely unused/vestigial)
│
├── data/
│   ├── formations.js        — FDB: 23 defensive formations with full metadata
│   ├── traits.js            — TRAITS groups for Scout + TRAIT_LABELS map
│   ├── personnel.js         — Personnel families, PMAP, implied trait derivation
│   ├── playbooks.js         — 9 defensive playbooks with colors
│   ├── teams.js             — CFB team roster with conference + preset trait profiles
│   └── adjustments.js       — Quick adjustment modifiers
│
└── engine/
    ├── scoring.js           — scoreAll(), scoreForPersonnel(), blitz calculation
    ├── downDistance.js      — Situation-based sort adjustments
    └── buildCallSheet.js    — Call sheet generation logic
```

---

## Key Features

### Implemented & Working

1. **Trait Scout Screen** — 7 grouped trait categories (Run Style, Pass Style, Field Zones, Personnel, Threats, QB Tendencies, Situation). Cards expand inline. 4+3 grid layout.

2. **First-Time Onboarding Modal** — Shown once on first visit (localStorage flag `sb_onboarded`). Portal-rendered with a11y focus trap and Escape key dismiss.

3. **XO Hero Section** — On ScoutScreen: gold X/O pattern hero replacing old hero image. Gold lettermark, subtitle, slim top bar. Deep left gradient fade for text legibility.

4. **Scoring Engine** — `scoreAll()` normalizes formation scores 0–100% based on core/supp tag hits vs total possible. Blitz % computed from blitzBase + mods. Run/pass bias adjusts scores.

5. **Personnel Family Tabs** — GamePlanScreen groups formations by personnel family (11p, 12p, etc.) and shows recommendations per family.

6. **Formation Detail Panel** — Coverages with ratings, pre-snap keys, coaching board, "Why Selected" explainer, call sheet rows.

7. **Down & Distance Filter** — Toggleable situation filter (1st/2nd/3rd/4th/RZ + Short/Mid/Long) that re-sorts formations for the selected situation.

8. **Opponent Profiles** — Save/load/delete/export/import scouting profiles as JSON. Navigate to Notes screen from a profile.

9. **Teams Browser** — Browse CFB teams by conference, search by name, load preset trait profile and jump to Plan.

10. **Notes + Drive Logger** — Per-profile freeform notes and structured drive-by-drive result logging (TD, FG, Punt, Turnover, etc.).

11. **PDF Call Sheet Export** — `@react-pdf/renderer` generates downloadable PDF call sheet.

12. **Share / Copy** — Native Share API (mobile) with clipboard fallback. Exports top 4 formations as formatted text.

---

## Formation Database (FDB)

23 defensive formations, each with:
- `books[]` — which playbooks include it
- `priority` — `"run"` | `"pass"` | `"hybrid"` | `"pressure"`
- `personnel` — `"Heavy"` | `"Base"` | `"Nickel"` | `"Dime"` | `"Goal Line"`
- `desc` / `dcNote` — user-facing description and DC coaching note
- `blitzBase` + `blitzMods[]` — blitz pressure calculation
- `avoidTags[]` / `coreTags[]` / `suppTags[]` — scoring tag arrays
- `coverages[]` — rated coverage schemes per formation
- `preSnap[]` — pre-snap alignment keys
- `coaching[]` — coaching board key/value pairs
- `callsheet[]` — situation-specific play calls

### Defensive Playbooks (9)
4-3, 4-3 Multiple, 3-4, 3-4 Multiple, 4-2-5, 3-3-5, 3-3-5 Tite, 3-2-6, Multiple

---

## Design System

### CSS Variables (in `index.css`)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#07080f` | App background |
| `--color-surface-1/2/3` | `#0a0f18 / #0d1622 / #111927` | Card surfaces |
| `--color-gold` | `#b8880c` | Primary accent, borders, active states |
| `--color-gold-bright` | `#d4a020` | Hover/emphasis gold |
| `--color-text-1/2/3` | `#eaf2fa / #b0c8dc / #7a9ab4` | Text hierarchy |
| `--font-mono` | IBM Plex Mono | Labels, badges, headers |
| `--font-sans` | IBM Plex Sans | Body text |
| `--nav-h` | 56px | Bottom nav height |

### Priority Colors
- Run: `#c07040` (orange-brown)
- Pass: `#3a80e0` (blue)
- Hybrid: `#7858a0` (purple)
- Pressure: `#bb5050` (red)

---

## localStorage Keys

| Key | Contents |
|-----|---------|
| `cfb26_myBook` | Selected playbook string |
| `cfb26_profiles` | JSON: saved opponent scouting profiles |
| `cfb26_game_notes` | JSON: notes per profile |
| `cfb26_drive_log` | JSON: drive log entries |
| `sb_onboarded` | Flag: onboarding modal dismissed |

---

## Recent Git Activity (last 20 commits)

All work has been in April 2026. Key milestones:

**Visual / UI overhaul (most recent):**
- Deepened left-side gradient fade on XO hero for text legibility over gold pattern
- Extended XO pattern to full width, increased hero height
- Renamed "His Personnel" → "Personnel" in trait groups
- Added XO echo pattern to footer
- Bumped text sizes, brightened XO pattern, fixed bottom card row fill

**UX + Onboarding:**
- Revised ScoutScreen hero and top bar (XO hero, slim top bar, lettermark)
- Added first-time onboarding modal with portal, a11y semantics, Escape dismiss
- Replaced accordion trait groups with 4+3 card grid + inline expansion
- Added numbered section anchors for bias and build sections

**Formation Card cleanup (prior sprint):**
- Auto-scroll selected card below sticky header
- Moved description to card, WhySelected always visible in detail
- Removed duplicate name/badge/books from formation detail header
- Unified border color to gold; faded WHY section background

---

## Outstanding / Planned

Based on the `v5 updates/` folder and recent commit patterns, the project is preparing for or recently completed a v5 release. A `release-notes-v5.html` and `.pdf` exist in that folder. No formal TODO file or open issues found in the repo.

**Known areas to watch:**
- `ThemeToggle.jsx` exists but appears unused (no dark/light toggle wired up in App)
- `Footer.jsx` exists but not imported in App.jsx — usage unclear
- `DriveLogger.jsx` exists as a separate component but may be rendered inside `NotesScreen`

---

## Build & Dev

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # ESLint check
```

No test suite present. No CI/CD configuration found.
