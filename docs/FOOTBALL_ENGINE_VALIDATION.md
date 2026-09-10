# Football engine foundation — review and device validation

Branch: `FootballEngineImprovements`.
Baseline: `6ecbf15bf76ba7248c79deea8aeaf8126d73f582`.
Status: first implementation phase; not approved for production or gameplay accuracy.

## What changed

- One `recommend(input)` service supplies the plan, selected formation details, shared text and PDF. PDF matrix rows change only down/distance; the selected family, scouting traits, run/pass preference and playbook remain fixed.
- Personnel no longer invents trips, empty or rarely-runs tendencies. A selected family supplies its explicit personnel/alignment tags. Empty does not delete observed running tendencies, including Option / QB Run.
- Family and general scoring share the same calculation. The family preference remains an explicit authored bonus. Scores and explanations include the run/pass slider, avoidance penalties, family preference, situation and bounds.
- Formation-menu spy, rush and shell aggregates no longer increase a recommended call's score. Those facts do not establish the assignments of that call. The catalog and reference data remain available.
- Coverage candidates must have exact name matches in the transcribed formation inventory. This is a catalog consistency check, not verification against the game or proof of availability in every listed playbook.
- Third/fourth-and-long candidates must have at least one catalogued deep defender. This is a conservative guardrail, not an assurance of explosive protection. No automatic short-yardage pressure promotion or universal trips/mesh coverage bonus remains.
- Red zone no longer rewards Prevent or penalizes every Nickel/Dime. It currently leaves scoring neutral because the UI lacks a simultaneous red-zone/down/distance description. Two-minute and goal-line PDF rows give conditional guidance instead of forced personnel selections.
- Cover 4 Drop no longer receives inside-run-fit credit from safety participation. Evidence: EA's August 6 CFB 27 update describes Drop safeties not fitting the run: https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026 . Do not extend this change to match Quarters.
- Fit is displayed as a 0–100 heuristic, not a percentage chance of success. Blitz percentage remains an authored suggested frequency, not the selected play's rush count or pressure success rate.

## Transitional scoring, explicitly not calibrated

The underlying tag denominator and catalog ratings remain. This phase makes them consistent and inspectable; it does not replace them with the full proposed football matchup engine.

1. Core personnel tag: 3 points; other core: 2; supporting: 1. Divide matched points by all authored points for that formation, multiply by 100 and round.
2. Slider bias for values 1–7: -1, -0.65, -0.30, 0, 0.30, 0.65, 1. Run/pass priorities receive up to +15 for agreement or -10 for disagreement; hybrid/pressure are neutral.
3. Avoidance: -15 for the first match, another -8 for each additional match, capped at -40.
4. Family authored preference: +20/+14/+9/+5/+3 by list position (later entries +3). It cannot revive an already nonpositive matchup.
5. Clamp formation score to 0–100; omit zero. Apply the provisional down/distance priority table in `downDistance.js`, then clamp again and omit zero. Both clamps are recorded. Pressure receives no situational bonus; there are no blanket personnel-group modifiers.
6. Sort descending, with formation name as a deterministic tie break.
7. Coverage ordering retains authored rating plus 0.25 times directional fit credit when only one run direction is scouted. Third/fourth-and-long promotes the best remaining `longOK` entry if one exists. This rating is separate from the formation fit score.

A high score still does not prove an RPO conflict has been solved, run gaps are assigned, or the human user can execute the call. Family biases and legacy coaching text still require further review. Broad scouting observations can describe several looks; this phase does not fully separate opponent tendencies from current-snap structure. Availability is still represented at formation/playbook level, not exact playbook/play level.

## Automated checks

Run in the repository:

```bash
npm ci
npm test
npm run build
```

The regression suite checks unsupported inferences, preserved run evidence, family/slider/book behavior, neutral unknown situations, exact inventory joins, long-yardage deep-defender eligibility, bounds and explanation sums across all 38 families, live/PDF/share consistency, and catalog immutability.

Repository-wide lint already failed at baseline with 137 errors and 2 warnings, including archived files. The new engine and regression tests should lint cleanly. Do not treat the existing lint backlog as new gameplay failures. The production build also has a large-bundle warning; bundle optimization is outside this phase.

Verification performed: eight regression tests passed; production build passed; changed engine and tests passed ESLint. A representative two-page PDF was generated and visually inspected. Browser interaction testing was blocked because no browser was installed and its download timed out. Phone/PWA and in-game testing remain pending.

## Device acceptance checklist

Use a separate preview, not the production deployment. A Git branch alone does not create a preview website. No deployment configuration is changed by this work.

For a local phone-browser check, run this on your own computer from this branch:

```bash
npm run dev -- --host 0.0.0.0
```

Open the Network URL printed by Vite on your phone on the same Wi-Fi. Local HTTP checks the UI; installed-PWA, share and offline behavior must also be checked on an HTTPS preview. Preserve any uncommitted Claude Code work before switching branches.

| Check | Expected result |
|---|---|
| Scout 10 personnel only | No implied empty, trips or rarely-runs evidence in the score explanation. |
| Add Option / QB Run, select 10p or 11p Empty | Running evidence remains visible wherever the formation matches it. No automatic free-rusher/no-run claim in the updated empty guidance. |
| Move slider from full pass to full run; rebuild | Family scores respond to the same slider used by the general engine. |
| Select a restricted defensive playbook | Every recommended formation belongs to that book or has catalog `All` availability. Check the actual plays in-game separately. |
| Choose 3rd, then Long | Recommended coverage agrees between card and expanded detail. No selected inventory call has zero deep defenders. |
| Choose a down without a distance | Context says distance unknown; no silent short/long assumption. |
| Choose Red Zone | No Prevent recommendation or blanket Nickel/Dime penalty. Neutral treatment is intentional pending richer situational input. |
| Open Why Selected → Scoring Factors | Every shown adjustment adds to the displayed fit score. Change situation while open: values refresh. |
| Export Call Sheet | Top four match the current family, book, slider and situation. Matrix varies down/distance only. Team-selected traits appear in the profile. |
| Share from Notes | Text refers to the current plan context, not necessarily the saved opponent note being viewed; confirm the context label. |
| Change family or quick adjustments with a detail open | No stale score or coverage from a previously stored formation object. |
| Clear scout / use a profile without personnel | No crash, misleading stale results or blank list when eligible calls exist. |
| Save/load existing profiles; use Reference and Compare | Existing storage and reference workflows still function. |
| Narrow phone screen / large text | Card call labels and scoring factors remain readable; PDF download opens. |

## Gameplay validation before the next engine phase

Record game version, platform, difficulty, mode, defensive book, exact play, coaching settings and user-controlled position. Repeat comparable snaps with both old and proposed calls against inside zone, QB draw/read option, RPO bubble, four verticals, mesh and flood. Record conversion, explosive, run-fit and user-assignment failures rather than relying on a single successful snap. Do not claim statistical accuracy from a small practice sample.

Next phase: model exact play + supported adjustments + human assignment, then evaluate multiple likely concepts and risk. Add user-friendly, safe and aggressive alternatives only when their distinctions are supported by that data. No live LLM, backend or football simulator is required.

## Release and rollback

Review the branch diff and complete device checks before merging. Do not push `main` or deploy from this work without approval. If validation fails, keep using production while fixing the branch; no production rollback is needed because this phase has not been deployed.
