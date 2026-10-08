# Step 4 - shared situational purpose

Review baseline: approved local Step 3 commit `896d757`, including the desktop-save fix and indented/bold PDF formatting. The deployed main remains the earlier reviewed release. Step 4 has not been pushed.

## Behavior

`getSituationalPurpose()` supplies the exact context, coverage/concept keys, line-to-gain target, coaching purpose and existing formation priority modifiers. Plan cards, formation adjustment coaching, sharing and PDF defensive keys consume that purpose. First down, second-and-short, second-and-long and fourth-down conversions receive distinct explanations. Unknown distance stays unknown; red zone does not invent a yardage target or personnel package.

The existing formation priority coefficients, scenario weight tables, coverage rubric, verified assignments, book eligibility and user-selection guardrails are retained. This step changes specific setups and one objective-driven scenario:

- Second-and-short and second-and-long against scouted quick throws explicitly set Zone Strategy to Default. This reset stays visible so an earlier aggressive setting is not silently carried forward. The optional Play Short Routes preset is withheld in these contexts; screen and QB-specific counters remain conditional.
- On third/fourth and seven-to-nine, scouted quick throws without scouted deep threats receive five-yard corner depth and Default zone reactions. Scouted vertical/seam threats retain deep protection. No Quick TD keeps its conservative setup regardless of this nearer conversion rule.
- Pass Commit becomes an optional tool on long conversion downs. Yardage alone cannot confirm the next play is a pass. Moving it out of the three-setting budget also preserves QB Contain in the recommended setup when needed.
- Get a Stop retains an unknown-direction run answer when no run scheme is scouted. It no longer fabricates an inside-run scenario; observed inside/outside run evidence remains observed.

No forced call variety is added. A purpose can change the explanation or setup while retaining the same best call. Scores and thresholds remain authored fit judgments, not game success estimates.

## Review evidence

- `engine-step4-comparison.html` renders both actual Plan component versions for nine identical-input examples. The baseline is the approved Step 3 draft, not a live-app screenshot. The selector includes early downs, a nearer conversion, mobile QB, seams, No Quick TD and Get a Stop.
- `engine-step4-comparison.json` captures those engine outputs and matched-context metrics: 432 contexts, 22 primary formation/call changes, 82 rounded-score changes and 139 primary setup changes. Counts indicate changed behavior, not validated improvements in outcomes.
- `engine-step4-current.pdf` and `engine-step4-proposed.pdf` use identical scouting and the actual before/after PDF component. Both have four pages. Complete PDF structure, all footers, text and rendered page layout were checked. The render helper buffers the complete PDF before writing it.
- All 203 automated tests pass. Production build passes. All changed/new JavaScript and JSX files pass targeted ESLint. The review covers unknown distance, actual conversion yardage, preserving deep help, explicit default resets, conditional pass guessing, avoiding invented run direction, ledger balance and shared Plan/PDF/share identity.
- All nine comparison selector paths were exercised in a DOM stub. Native desktop/iPhone/PWA interaction testing was not performed; the previously tested platform-saving behavior is retained.

Reproduce with `node scripts/compare-engine-step4.mjs <step3-source-directory>` and `node scripts/render-step4-pdf.mjs <step3-source-directory>`.
