# Phase 2 — exact-call assignment assessment

This phase builds on the shared recommendation service. It is a bounded assignment-risk layer, not the complete concept matchup engine. No source catalog entries are bulk rewritten. No user inputs or deployment settings are added.

## Data and decision path

`scouted traits → explicit threat flags → formation heuristic → exact curated play/inventory join → assignment validation → per-call risk adjustments → best call per formation → formation rerank → shared output`

Only curated coverage entries with matching transcribed plays are candidates. The entire 1,245-play inventory is not yet a curated recommendation pool. Counts must be nonnegative integers, sum to eleven (contain is a subset of rush), and have contain no greater than rushers. Invalid/missing structures are ineligible.

`playMatchup.js` introduces a structured assessment containing:

- Exact assignment facts: rushers, deep zones, underneath zones, man assignments, spies, contain, badge and shell.
- Triggered score factors with stable IDs, reasons and evidence labels.
- Structural support, weaknesses and explicit unknowns.
- A score cap for unprotected deep-shot exposure.

All names, ranks, scores and displayed concerns derive from the same selected candidate. The formation's original contextual score is retained as `formationScore`; displayed `sc` includes the chosen call's risk adjustments. Other coverage choices in the expanded card show their own call fit and assessment.

## Explicit threat mappings

These flags describe observed scouting tags, not predicted play probabilities:

| Threat | Tags |
|---|---|
| Deep | deep_shots, seam_routes |
| QB mobility/option | mobile_qb, dual_threat, qb_scramble, option_run, triple_option |
| Quick outlet | quick_game, rpo, screens, slant_heavy, west_coast |
| Crossing | crossers |
| Run-fit uncertainty | inside_run, outside_run, hb_stretch, counter_trap, fb_lead, option_run, triple_option |
| RPO uncertainty | rpo |

Personnel, empty and trips do not automatically turn on any of these flags. Deep includes seam-route observations conservatively; the catalog cannot distinguish short seam access from an actual vertical shot. Quick includes several different concepts; the shared flag checks pressure exposure without claiming these concepts are interchangeable.

## Every new numeric rule

| Condition | Adjustment |
|---|---:|
| Zero deep-zone defenders, without a scouted deep threat | -12 |
| Zero deep-zone defenders against a scouted deep threat | -20, replaces -12; final call score capped at 35 |
| Scouted QB mobility/option; this play has neither spy nor contain | -8 |
| Quick threat; at least five rushers, zero man assignments, at most three underneath zones | -8 |
| Quick threat; at least five rushers, at least four man assignments, zero underneath zones | -6 |
| Crossers; at least four man assignments | -6 |

Quick-pressure alternatives are mutually exclusive. Quick/RPO/screen tags do not repeatedly charge the same condition. Independent conditions can combine. Clamp each call to 0–100 or the explicit 35 cap; omit zero. The explanation ledger records each factor and clamp.

Within a formation, highest adjusted call score wins; ties preserve phase-1 authored coverage ordering (including directional fit and longOK preference). Then rank formations by their selected call score, with name as deterministic tie break. Long-yardage eligibility from phase 1 still excludes zero-deep calls before evaluation.

All coefficients and the cap are provisional product heuristics. They are NOT measured EA mechanics. The cap bounds the score; it does not make zero-deep calls impossible to select when alternatives score even lower. Such calls retain their explicit warning. More rushers, deep defenders or spies receive no automatic success bonus. Contain can resolve the narrow missing-assignment warning; it does not establish a sound QB run fit or stop a mobile QB.

## Concrete changed recommendations

At the audited catalog version, All playbooks, balanced slider, base situation:

| Input | Formation | Phase 1 call | Phase 2 call | Why |
|---|---|---|---|---|
| p11 + crossers; p11_gun family | Nickel 3-3 Stack | Cover 2 Man | Cover 4 Quarters | The man call receives a crossing-traffic penalty. Quarters checks remain unverified; no guarantee that Quarters wins against mesh. |
| p11 + mobile_qb + rpo + quick_game; p11_gun family | Nickel 3-3 Over Jack | Cover 3 Match | Cover 1 Contain | The contain assignment avoids the missing-QB-assignment penalty. Man leverage and actual containment need practice testing. |

These are observable engine behavior changes, not claims of in-game superiority.

A separate regression catches `3-4 Under 4 Tech / Cov 1 QB Contain Spy`: its name includes Spy, but its catalog has zero spies and two contain rushers. Explanations report those exact assignments rather than inferring from the name or another play in the formation.

## Evidence boundaries

- **Catalog evidence:** assignment counts from the app's transcribed play art. Consistency checks do not independently verify the transcription or every playbook's availability.
- **Real-football inference:** coverage/help reductions create potential exposure; mobile QB assignments and crossing traffic deserve attention. Numerical penalties are authored judgments.
- **Confirmed CFB mechanic:** no new gameplay-mechanic claims or bonuses are introduced in this phase. The prior Cover 4 Drop correction remains separately documented.
- **Unverified:** pressure timing, protection, zone locations, match checks, Smart Zones/settings, player ratings, user execution, exact run fits and RPO read-side conflict. These appear as unknowns instead of invented capability scores.

The user-controlled defender's role is not known. The engine must not assign the human two simultaneous jobs or promise that manual help repairs a risk. This phase warns about missing assignments; a future user-role input is needed to evaluate an actual manual assignment.

## Verification and next steps

Sixteen regression tests pass (eight foundation, eight exact-call), including all inventory structures, deep-shot cap arithmetic, no name-based spies, no duplicated quick-threat penalty, and shared result consistency. The production build and targeted engine/test lint pass. Call-assessment server rendering passes. A representative PDF generates and is visually reviewed. Browser/device/PWA and gameplay checks remain pending.

On device, verify the two changed-call examples above, inspect an alternative coverage's separate assessment, and compare the primary call's score/concern between screen, PDF and share text. In practice mode, test both calls in each example; record settings, user position and repetitions. Keep the branch isolated until those results support release.

Next sensible phase: curated route responsibilities and exact supported adjustment combinations, then user-role feasibility and objective-specific alternatives. Do not infer these from coverage names, add unsupported concept probabilities, or label this intermediate engine a validated simulator.
