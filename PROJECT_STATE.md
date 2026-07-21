

## CFB 27 Migration — Phase A (engine + renames + Macro Builder) · 2026-07-13
- Engine: personnel-package tags now weigh 3x in scoreAll (Formation Shifts counter). bunch/stack_align trait labels added (engine-only, Scout UI unchanged).
- Formations: Nickel 3-3 Odd DELETED (not in 27). 3-4 Over Stack -> 3-4 Over Ed (rebuilt, verified 12-play list; tags/blitzMods carried from Over Stack pending tuning). Nickel 3-3 Over -> Nickel 3-3 Over Jack (books + coverage names verified). 3-2-6 Mug -> 3-2-6 Sugar 3-2 (verified). 3-2-6 Odd -> 3-2-6 3-2 (rename verified; coverage play names PENDING lab verification).
- 3-4 Multiple book membership corrected per verified 27 data.
- playbooks.js: replaced with the 32 documented CFB 27 books + style taxonomy (STYLES export). All nine legacy book names survive in 27, so existing formation books[] remain valid; membership in the 23 NEW books lands in the Phase B data pass (Claude Code Prompt 1: fetch all ~72 formation pages from cfb.fan, add ~20 new formations, re-verify every carryover coverage list).
- data/adjustments.js: CFB 27 rewrite (Smart Zones, Plaster, Roll Coverage, match checks w/ verified flags, Gap Integrity, Defensive Aggression) + getAdjustmentChain composer.
- NEW: data/macros.js (26-problem Custom Adjustment macro library: team settings / player assignments / placement per macro) + components/MacroBuilder.jsx (Teams-pattern screen) + Macros tab in BottomNav (6 slots) + App route. Loadout selection persists (cfb27_macros).
- sw.js cache -> schemebuilders-v27-1. index.html og updated to CFB 27.
- KNOWN PENDING: Phase B formation data pass; 3-2-6 3-2 play names; Over Ed tag tuning; match checks flagged verified:false need lab confirmation; teams.js 2026 trait refresh.
