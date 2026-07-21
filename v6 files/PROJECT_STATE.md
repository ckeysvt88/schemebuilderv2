---
name: Scheme Builders project context
description: Core tech stack, structure, features, and current state for Scheme Builders
type: project
originSessionId: ba10d2b0-b3e9-4c5e-8168-00a858af4116
---
**Scheme Builders** — CFB defensive game-planning tool (React 19 + Vite, mobile-first PWA).

## Stack & Structure
- Source: `C:\Users\ckeys\OneDrive\Desktop\schemebuilders-v2\src\`
- Main CSS tokens: `src/index.css` — all colors via CSS custom properties (`var(--color-*)`)
- Light mode: `[data-theme="light"]` on `<html>`, toggled via BottomNav theme button
- Deployed to GitHub Pages via CI; PWA with manifest + sw.js

## Key Files
- Token/design: `src/index.css`, `src/App.css`
- Data: `src/data/formations.js`, `src/data/playbooks.js`, `src/data/teams.js`, `src/data/traits.js`, `src/data/personnel.js`, `src/data/adjustments.js`
- Engine: `src/engine/scoring.js`, `src/engine/downDistance.js`, `src/engine/buildCallSheet.js`
- Components: `ScoutScreen`, `GamePlanScreen`, `FormationDetail`, `BottomNav`, `NotesScreen`, `TeamsScreen`, `CompareScreen`, `BlitzBar`, `WhySelected`, `CallSheetPDF`, `DriveLogger`, `ThemeToggle`

## Completed Features (as of 2026-04-14)

### Initial Build (Apr 2 – Apr 9)
- Initial v2.0 commit with full screen routing (Scout, Game Plan, Compare, Teams, Notes)
- Personnel selection, trait-based filtering, formation scoring
- User profile save/load, adjustments screen
- GitHub Pages deployment with PWA support (manifest, sw.js, CNAME)

### Data & Engine Work (Apr 11)
- PDF call sheet export from game plan page (full-width button)
- World-class 3-page PDF call sheet: DC notes, human-readable tags, situational guide
- Full personnel audit: avoidTags/suppTags for all base, GL, prevent, and nickel mug formations
- Deep audit: fix p13/p23 scoring engine + add avoidTags to all Nickel/Dime formations

### Home Page Redesign (Apr 12)
- Replaced hero image and header with slim top bar + XO hero pattern
- Card grid UI: 4+3 card grid with inline expansion replacing accordion groups
- First-time onboarding modal with localStorage dismiss flag
- Numbered section anchors for bias and build sections
- Various XO pattern and visual polish (text sizes, fade depth, footer echo)

### Day/Night Mode (Apr 13)
- CSS token system: all colors via `var(--color-*)`, light mode overrides via `[data-theme="light"]`
- `isDark` state in App.jsx, wired to BottomNav via `onToggle`
- Theme toggle as 5th slot in BottomNav with `aria-pressed` accessibility
- FOUC prevention: `data-theme` set before CSS evaluation
- Full tokenization pass: all hardcoded hex values replaced with CSS variables in all components
- BottomNav light mode: `rgba(205, 213, 225, 0.98)` via `--nav-bg-color`

### Scoring Engine Deepening (Apr 14 — PR #3)
- **avoidTag penalty scaled**: flat -25 replaced with hit-count formula (1=-15, 2=-23, 3=-31, 4+=-39/40)
- **Personnel browser avoidTag**: was skipping avoidTag evaluation entirely — now applied in `scoreForPersonnel()`
- **blitzMod gaps filled** for 8 formations: option_run/dual_threat QB suppression was missing or weak in 4-3 Over, 3-4 Bear, 3-4 Under, 3-4 Tite, 3-3-5 Stack, 4-4 Split, 3-4 Even, Nickel 2-4 Single Mug
- **downDistance.js tuning**: 2nd medium hybrid +5→+8; 3rd long pass +12→+15, pressure +22→+20; 4th short hybrid +8→+12
- **rawSc ceiling fix**: `applyDownDistance()` now sorts by rawSc (uncapped), displays sc clamped to 100 — eliminates ceiling compression where 7+ formations tied at 100

### Formation Data Audit (Apr 14 — PR #3, continued)
- Coverage tree corrections using confirmed cfb.fan/26 in-game data for: 4-3 Even 6-1, 4-4 Split, 3-4 Tite, 3-4 Bear
- Coverage tree corrections for 3 additional formations using in-game data
- Confirmed plays added to 46 Bear, 5-2 Normal, 3-3-5 3 High, Dime Rush, Goal Line 5-3, Goal Line 6-2, Nickel 2-4 Load Mug, Nickel 2-4, Nickel 2-4 Load, Dime Load Weak
- **Nickel 3-3 Odd**: new formation added (was missing from file), 4 confirmed plays
- **Play name audit**: corrected 27 callsheet entries with wrong shorthand/wrong names; callsheet refs now match exact in-game coverage names (0 mismatches)
- **Odd Ghost**: new formation added with 15 confirmed in-game plays; DEs slant from 5-tech to 4i (ghost the B-gap); supported in 3-3-5 and 3-2-6 playbooks

## Engine Logic Summary
- `scoring.js`: `scoreAll()` and `scoreForPersonnel()` — tag matching, avoidTag penalties (scaled), blitzMod, suppTags
- `downDistance.js`: `applyDownDistance()` — situational score delta by down/distance; rawSc sort prevents ceiling ties
- `buildCallSheet.js`: 3-page PDF export with DC notes and situational guide

## Known State
- Main branch is clean and up to date as of 2026-04-14
- PR #3 merged Apr 14 — scoring engine + full formation data audit
- 3 total PRs merged to main
- No open issues or branches known
