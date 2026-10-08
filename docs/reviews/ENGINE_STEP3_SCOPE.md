# Step 3 — complementary call planning

Local review based on main `5cd9c3f`, the deployed merge of PR #18. Step 3 has not been pushed. The earlier pressure, coverage and macro/adjustment work is merged and live.

## Behavior

The Plan page now starts with a primary call, a complementary changeup when supported, and a conditional extra-rusher option when supported. Each entry retains its exact call, fit score, quick setup, user job and switch trigger. Expanded formation cards contain the same kind of plan within that formation; the existing call coaching remains available in a disclosure.

The primary remains the top formation's existing personalized call. This step does not modify ranking, the score blend, play counts or assignments. Changeups are selected from the existing evaluated inventory rather than inferred from play names or taken from the next formation in rank. Other formations can be considered between snaps, with explicit personnel/audible checks. Tempo limits alternatives to the primary formation.

Pairing requires verified assignment counts and existing objective/deep-help eligibility. It compares the actual scouted scenarios, including quick-setup scenario effects already used by the evaluator. Every observed or objective-driven threat remains protected, regardless of its normalized weight; other complementary hypotheses enter the guardrails at 8% weight or above.

The proposed changeup must improve a weak credible matchup by at least eight ordinal grade points, stay within ten overall fit points of the primary, and avoid losing more than ten grade points against another credible threat. A credible grade cannot fall below 35 unless the primary is already below that level, in which case it cannot become worse. These are provisional product guardrails, not calibrated outcome differences. A target must start below 75; a different call name alone is not a reason to switch.

Pressure needs additional verified rushers and the same comparison/fit guardrails. The user must first observe that the QB holds the ball, the protection is vulnerable, and the hot outlet is covered. It earns no pressure-arrival prediction or extra score bonus. If the primary already sends extra rushers, no duplicate pressure choice is added. No additional pressure choice is suggested for No Quick TD.

If no qualified alternative exists, the plan says to retain the primary. Hypothesized and situation-seeded threats stay conditional and are not relabeled as observed tendencies.

## Shared Plan, PDF and sharing

`recommend()` produces the global and in-formation plans. Sharing consumes that plan. Each PDF situation row calls the same entry point with that row's actual down/distance. The PDF secondary column becomes Changeup; the guide includes its trigger and exact setup plus any conditional pressure choice, primary concern and user job. Goal-line and two-minute labels still do not manufacture a call without the actual context.

The example PDF grows from two to four pages because the detailed guide now prints the alternative calls and triggers. Four detailed situations are grouped per guide page, with repeated headers and footers; context-only rows stay on the final guide page. The compact situation matrix remains one page. This is a reviewable layout tradeoff, not a two-page guarantee for every scout.

## Review and checks

- `engine-step3-comparison.html`: eight interactive examples. Proposed cards use the actual React Plan component rendered to HTML. The current column displays the deployed recommendation output; it is not a screenshot. Includes before/after PDF secondary choices for all twelve situations.
- `engine-step3-current.pdf` / `engine-step3-proposed.pdf`: generated with the actual before/after PDF component and an identical scout. Headers, footers, labels and page boundaries were checked through text extraction and rendered page inspection.
- 216 sampled scout/down/distance/tendency combinations: zero ranking or primary-call changes, 135 supported changeups and 59 conditional pressure options. These counts describe examples, not success rates.
- 191 automated tests pass; production build passes. New tests cover pairing versus rank order, complementary exposure, low-weight observed threats, quick-setup reuse, exact book/call eligibility, tempo and PDF/share identity.
- Eight changed/new engine, component and test files pass ESLint. GamePlanScreen retains the same ten pre-existing lint errors, with no new diagnostics. Repository-wide cleanup is outside this step.
- All eight HTML selector paths were exercised, with twelve PDF matrix rows each and no incomplete display values. A headless browser executable was unavailable and its download failed; full browser/PWA interaction testing was not completed. The PDF layout was rendered and visually inspected.

Reproduce with `node scripts/compare-engine-step3.mjs <baseline-directory>` and `node scripts/render-step3-pdf.mjs <baseline-directory>`, where the baseline directory contains the source and package metadata from deployed main before Step 3.
