# Branch-to-main release review — 20 September 2026

**Recommendation: hold the merge until the release issues below are resolved.** No application code, dependency versions, main ref, or deployment was changed by this review. This report documents the reviewed application revision; a later documentation commit does not change that revision.

## Pinned revisions and scope

- Repository: `ckeysvt88/schemebuilderv2`.
- Reviewed feature branch: `FootballEngineImprovements`, `c1087b92ffafd45fa6ced27f274169eedeb82b8f`.
- Main / rollback source: **`6ecbf15bf76ba7248c79deea8aeaf8126d73f582`** — “Add trips/mesh trait nudge for Cover 2 and Tampa 2 coverages”.
- Feature branch is 44 commits ahead, main is 0 commits ahead. Main is an ancestor; no divergent changes need reconciling at these revisions.
- Complete comparison: 93 files, 8,485 insertions, 2,415 deletions. File-by-file size inventory is appended below.
- Review covered recommendation/scoring/personalization flow, adjustment and macro generation, application state and storage, UI changes, exports, tests, dependency manifests, workflows and service-worker configuration. This is a source and automated-check review, not a fresh visual test on every device or independent validation of every in-game assignment.

## Findings, in release order

### High — personalized call exports carry another call's details (new)

`src/engine/buildCallSheet.js` chooses `personalizedCoverage` for the exported call name but copies `f.matchup` and `f.sc`, which `recommendations.js` sets from the best-overall call. The PDF renders those mismatched fields. Share text similarly prints “Best for you” next to best-overall assignments and analysis without identifying their owner.

Reproduction using real supported inputs: traits `p11` + `deep_shots`, Very pass-heavy (`runPass: 1`), Linebacker + Create Pressure, All playbooks, base situation. Top formation is **3-3-5 3 High Over**:

| Field | Best overall | Best for you |
|---|---|---|
| Call | Cover 4 Quarters | Edge Blitz 2 |
| Fit | 78 | 72 |
| Rush / deep / underneath | 4 / 4 / 3 | 5 / 2 / 4 |

The exported card labels Edge Blitz 2 but uses 78 and 4 / 4 / 3. Confirmed by evaluating both ranked calls and `buildCallSheetData` with the same input. Fix by resolving the selected call once and deriving its name, score, assignments, risk and explanation from the same object; explicitly label overall information if also shown. Add a regression where overall and personal calls differ. Existing export tests pass because they do not catch this semantic mismatch.

### High — rollback is not safe for newly saved opponent profiles (new schema)

The branch writes `{schemaVersion: 2, traits: {...}, runPass: ...}` under the existing `cfb26_profiles` key. Main's `loadProfile` assumes the old plain group-to-array shape and directly assigns it to scout state. Old `Object.values(profileTags).flat()` therefore produces the version number, a nested object, and the bias number, instead of trait IDs. Its share routine calls `ids.map` on those values; reproducing that transformation throws `ids.map is not a function`.

The new branch reads old saves correctly; the reverse is not true. Reverting code alone does not revert browser storage. Before release, preserve the old storage format/key or provide a tested compatibility path and backups. Do not solve rollback by telling users to clear all site data. Profile export must be downloaded from the production origin before rollout; localhost storage is separate.

Other persistence: new call tests use `cfb27_call_tests`, separate from the old `cfb26_drive_log`; old logs are not overwritten by that component. Macro choices keep `cfb27_macros` but are normalized to current IDs and capped at ten, so save the original selection before relying on a rollback. A profile export is not a backup of all localStorage data.

### High — vulnerable development/build dependencies remain (inherited)

See the dependency table below. Dependency versions and the lockfile are unchanged from main; these issues were not introduced by the football branch. Update in a separate commit, rerun clean install/tests/build, and audit the resulting lockfile before release. Do not use `npm audit fix --force` blindly.

### High — deployment does not enforce the test gate (inherited deploy workflow)

Production deployment runs on pushes to main and directly installs/builds/publishes. It does not run tests or depend on the football checks job. The new checks workflow runs on branch pushes and PRs into main, but that alone does not prove merging is blocked when checks fail. Required branch checks were not confirmed.

Use the same supported Node version and `npm ci` in checks and deployment, and enforce tests before upload/deploy. Confirm the PR check is required in repository rules. Today the deploy uses Node 20 while checks use Node 22; installed Vite requires `^20.19.0 || >=22.12.0`. A current Node 20 patch can satisfy this, so the version difference is a reproducibility concern, not evidence of a failed deployment.

### High football-content follow-up — legacy alignment copy can contradict the engine (inherited)

`src/data/personnel.js` still says Trips Gun always creates a 3-on-2 and that Cover 3 “loses the math every time.” `GamePlanScreen.jsx` renders this under Alignment DC Rule when the alignment section is expanded. These universal statements bypass the new exact-call and situation analysis; coverage labels alone cannot establish all receiver matchups or defender leverage. Replace such blanket legacy instructions with conditional coaching consistent with the recommendation engine before describing the football-content cleanup as complete. The automated suite does not validate the truth of all prose.

## Verification results

| Check | Result |
|---|---|
| Clean `npm ci` | Passed |
| `npm test` | **130 passed, 0 failed** |
| `npm run build` | Passed; main JS 2,552.22 kB / 733.90 kB gzip |
| Latest feature GitHub checks | Success at reviewed commit |
| Whole-repository lint | Not clean: 118 errors, versus 137 on main using the same dependencies |
| Production dependency audit | **0 reported vulnerabilities** |
| Full dependency audit | **9: 6 high, 2 moderate, 1 low; 0 critical** |
| Whitespace diff check | One trailing blank-line warning in `docs/SITUATIONAL_ALTERNATIVES_PHASE8.md` |
| Fresh phone/browser visual acceptance | Not performed in this review |

Full lint includes archived `v4 Updates` / `v5 updates` source and FormationLab. Active source still has 31 errors (App 13, GamePlanScreen 10, NotesScreen 7, TeamsScreen 1). This is largely existing debt, not 118 newly introduced failures. CI only lints a selected file list, so its success must not be described as a clean whole-repository lint.

The automated suite covers the full catalog rather than only 4-3 Over Solid: 72 formation records, 71 play inventories, 1,245 plays, 31 named playbooks and 56 macro problems. Coverage includes bias extremes, situations, user profiles, objectives and macro compatibility. Inventory availability and software consistency do not prove in-game coverage behavior. Some formations/calls are deliberately ineligible in certain scenarios. Regenerated catalog results were inspected without retaining modifications to the existing report.

The large bundle warning is a performance follow-up, especially on phones. Lazy-loading the PDF generator is worth evaluating; it is not a build failure. Avoid bundling unrelated performance changes into the correctness fixes unless measurements require it.

## Dependency audit details

Fresh audit against the committed lockfile. All nine affected packages below have `dev: true`; `npm audit --omit=dev --json` reports zero. That narrows the known exposure to development/build tooling; it is not a proof that the application has no security issues. npm reports a fix available for each; patched resolution has not been installed or validated in this review.

| Package | Installed | Severity | Advisory references |
|---|---|---|---|
| @babel/core | 7.29.0 | low | [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) |
| @humanfs/node | 0.16.7 | moderate | [GHSA-p498-v437-472g](https://github.com/advisories/GHSA-p498-v437-472g) |
| baseline-browser-mapping | 2.10.13 | moderate | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) |
| brace-expansion | 1.1.13 | high | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) |
| browserslist | 4.28.2 | high | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx), [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) |
| js-yaml | 4.1.1 | high | [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68), [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m), [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) |
| nanoid | 3.3.11 | high | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv), [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8), [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) |
| postcss | 8.5.8 | high | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) |
| vite | 8.0.3 | high | [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9), [GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r), [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583), [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3), [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) |

Vite's Windows alternate-path advisory specifically concerns network-exposed development servers and affected filesystem conditions; the app is deployed as static Pages files, not a Vite development server. The [maintainer advisory](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff) identifies 8.0.16 as a fix for that advisory. Do not assume that one version resolves every current advisory; audit the complete updated dependency tree. Keep local development access limited while the dependencies are being updated.

## Deployment evidence and limits

Confirmed from repository configuration:

- `.github/workflows/deploy.yml` publishes GitHub Pages on **push to main**.
- Uses Node 20, `npm install`, `npm run build`, copies `public/CNAME`, uploads `dist`, then `actions/deploy-pages@v4`.
- Permissions include contents read, pages write and id-token write.
- Domain file: **schemebuilders.com**. Vite base: `/`, consistent with a root custom-domain deployment.
- The feature branch does not trigger that production deploy workflow.
- No dependency/lockfile changes, domain change, Vite base change, or service-worker change in this branch comparison.

Confirmed from GitHub Actions:

- [Feature check run 35516282272](https://github.com/ckeysvt88/schemebuilderv2/actions/runs/35516282272): success at `c1087b92ffafd45fa6ced27f274169eedeb82b8f`.
- [Main deployment run 32907961700](https://github.com/ckeysvt88/schemebuilderv2/actions/runs/32907961700): success at `6ecbf15bf76ba7248c79deea8aeaf8126d73f582`, completed 25 August 2026. Its build, artifact upload and deploy-pages steps all succeeded.

Not independently confirmed: current GitHub Pages Settings, enforced HTTPS, repository rules/required checks, and the bytes currently served at the custom domain. The connector rejected Pages/deployments API routes; direct domain retrieval failed in this runtime and the web tool could not open it. A successful recorded deployment is strong evidence of the deployed revision at that time, but does not certify current DNS, TLS or subsequent manual settings. Before release, check Settings → Pages shows GitHub Actions, schemebuilders.com and working HTTPS; open the live app on desktop and phone.

Service worker: `schemebuilders-v3-2` uses network-first HTML and cache-first hashed assets. The unchanged cache name does not by itself pin online users to old HTML. Already-open tabs and offline installs can retain the old app; release and rollback checks must include online reload and installed-app reopen. Do not erase localStorage to refresh cached assets.

## Rollback plan

**Known main source to return to: `6ecbf15bf76ba7248c79deea8aeaf8126d73f582`.** This matches the successful deployment recorded above. Recheck main immediately before release; if it advances, record the new pre-release main commit and successful deployment instead.

1. Before merging: export production profiles and back up other stored data that matters. Resolve/test the profile-schema compatibility issue. Record the pre-release main SHA, release merge SHA, and deployment run URL. Retain the last known-good Pages artifact if available; source rebuild alone may resolve tools differently until deployment uses a reproducible install.
2. Prefer one reviewed merge PR. If that release causes problems, use GitHub's **Revert** on the merged PR to create a rollback PR. Review and merge that PR into main; the existing main deployment workflow publishes the reverted source.
3. If GitHub cannot create the revert automatically, a maintainer can create a rollback branch from current main and revert the release merge. For a true merge commit use `git revert -m 1 <release-merge-sha>`. For a squash commit use `git revert <release-squash-sha>`. These are different operations; do not paste placeholders or revert the old rollback-source SHA itself.
4. Verify the reverted source, tests/build and successful Pages deployment, then reload the live app online. Verify old profiles load and export. Preserve new-format data if compatibility restoration is needed.
5. Do not force-push main or use a destructive reset as the ordinary rollback procedure. If unrelated changes landed after release, review the revert rather than assuming it recreates the pinned tree exactly.

No rollback ref, merge or deployment was performed by this audit.

## Release acceptance checklist

- [ ] Fix personalized PDF/share call identity; compare both call names, scores, assignments and risks when the two calls differ.
- [ ] Test old profile → new app → save → rollback app, with original traits preserved. Include export/import and saved run/pass tendency.
- [ ] Update dependencies without force; rerun clean install, full audit, production audit, tests and build.
- [ ] Make test/build a production deployment prerequisite; confirm required PR checks and Node/install parity.
- [ ] Correct remaining blanket Alignment DC Rule coaching.
- [ ] Confirm Pages settings/domain/HTTPS and record final pre-release main and release SHAs.
- [ ] Phone and desktop: light/dark modes, narrow toolbar, all setup dialogs, macros, down/distance changes, bias extremes, and representative run/pass formations from several playbooks.
- [ ] Verify PDF download/share, saved scouts, call-test logging, and installed-app online refresh without clearing saved data.
- [ ] Approve merge only after these checks; this audit itself is not a release approval.

## Complete changed-file inventory

Counts below compare the pinned main and application revision, before adding this audit document. `+`/`−` are line counts, not measures of risk.

| File | Added | Removed |
|---|---:|---:|
| `.github/workflows/football-engine-checks.yml` | 22 | 0 |
| `docs/BIAS_MACRO_AUDIT_PHASE23.md` | 86 | 0 |
| `docs/CALIBRATION_LEDGER_PHASE9.md` | 13 | 0 |
| `docs/CALL_OPTIONS_PHASE5.md` | 13 | 0 |
| `docs/CFB27_DEFENSIVE_ADJUSTMENT_AUDIT.md` | 221 | 0 |
| `docs/CFB27_GUIDANCE_SOURCES.md` | 49 | 0 |
| `docs/COMBINED_REVIEW_PHASES_13_TO_15.md` | 617 | 0 |
| `docs/CRITICAL_HIGH_ROADMAP_STATUS.md` | 71 | 0 |
| `docs/DATA_INTEGRITY_PHASE4.md` | 48 | 0 |
| `docs/EXACT_CALL_SITUATION_PILOT_PHASE10.md` | 35 | 0 |
| `docs/FOOTBALL_ENGINE_VALIDATION.md` | 92 | 0 |
| `docs/FULL_FORMATION_COVERAGE_PHASE23.md` | 131 | 0 |
| `docs/GAME_OBJECTIVES_PHASE22.md` | 27 | 0 |
| `docs/MACRO_RECIPES_PHASE25.md` | 32 | 0 |
| `docs/MIXED_RUN_SUPPORT_PHASE15.md` | 27 | 0 |
| `docs/OWNER_VALIDATED_CATALOG_PHASE20.md` | 25 | 0 |
| `docs/PERSONALIZATION_SAFETY_PHASE16.md` | 21 | 0 |
| `docs/PERSONALIZED_CALL_PHASE7.md` | 12 | 0 |
| `docs/PLAY_MATCHUP_PHASE2.md` | 80 | 0 |
| `docs/RUN_SUPPORT_AND_SCOUT_GUARDRAILS_PHASE14.md` | 76 | 0 |
| `docs/SCORING_AND_EVIDENCE_PHASES_17_18.md` | 23 | 0 |
| `docs/SELECTION_SAFETY_PHASE19.md` | 32 | 0 |
| `docs/SITUATIONAL_ALTERNATIVES_PHASE8.md` | 10 | 0 |
| `docs/SITUATION_COACHING_AND_ONBOARDING_PHASE11.md` | 40 | 0 |
| `docs/THREAT_COMPLEMENT_PHASE3.md` | 64 | 0 |
| `docs/THREAT_SCORING_AND_CALIBRATION_PHASE13.md` | 51 | 0 |
| `docs/TITE_EVIDENCE_AND_CALL_TEST_UI_PHASE12.md` | 43 | 0 |
| `docs/USER_PROFILE_PHASE6.md` | 10 | 0 |
| `index.html` | 3 | 3 |
| `package.json` | 2 | 1 |
| `scripts/auditFormationCoverage.js` | 38 | 0 |
| `src/App.jsx` | 63 | 53 |
| `src/components/CallSheetPDF.jsx` | 29 | 32 |
| `src/components/CompareScreen.jsx` | 2 | 2 |
| `src/components/DefensiveSetupRow.jsx` | 35 | 0 |
| `src/components/DriveLogger.jsx` | 113 | 171 |
| `src/components/FormationCard.jsx` | 9 | 6 |
| `src/components/FormationDetail.jsx` | 133 | 150 |
| `src/components/FormationInfo.jsx` | 6 | 12 |
| `src/components/GamePlanScreen.jsx` | 65 | 242 |
| `src/components/MacroBuilder.jsx` | 57 | 87 |
| `src/components/PlanToolbar.jsx` | 73 | 0 |
| `src/components/PlaybookModal.jsx` | 54 | 0 |
| `src/components/ScoutScreen.jsx` | 108 | 84 |
| `src/components/SetupDialog.jsx` | 44 | 0 |
| `src/components/UserProfileModal.jsx` | 32 | 0 |
| `src/data/adjustments.js` | 0 | 93 |
| `src/data/coverageFlags.js` | 6 | 1 |
| `src/data/formations.js` | 5 | 5 |
| `src/data/gameObjectives.js` | 7 | 0 |
| `src/data/macroCoaching.js` | 63 | 0 |
| `src/data/macroRecipes.js` | 102 | 0 |
| `src/data/macros.js` | 509 | 922 |
| `src/data/opponentProfile.js` | 15 | 0 |
| `src/data/personnel.js` | 11 | 28 |
| `src/data/playEvidence.js` | 108 | 0 |
| `src/data/runPassBias.js` | 18 | 0 |
| `src/data/userProfile.js` | 31 | 0 |
| `src/data/validatedPlaySnapshot.js` | 1392 | 0 |
| `src/engine/adjustmentPlan.js` | 386 | 0 |
| `src/engine/buildCallSheet.js` | 37 | 107 |
| `src/engine/calibrationLog.js` | 90 | 0 |
| `src/engine/callOptions.js` | 199 | 0 |
| `src/engine/callSelection.js` | 13 | 0 |
| `src/engine/conceptMatchup.js` | 283 | 0 |
| `src/engine/context.js` | 34 | 0 |
| `src/engine/coverageGuidance.js` | 180 | 0 |
| `src/engine/coverageRank.js` | 19 | 106 |
| `src/engine/coverageRunSupport.js` | 56 | 0 |
| `src/engine/downDistance.js` | 37 | 148 |
| `src/engine/frontStructure.js` | 31 | 0 |
| `src/engine/macroPlan.js` | 58 | 0 |
| `src/engine/personalizationSafety.js` | 32 | 0 |
| `src/engine/playMatchup.js` | 128 | 0 |
| `src/engine/recommendations.js` | 75 | 0 |
| `src/engine/scoring.js` | 85 | 162 |
| `src/engine/scoutThreats.js` | 15 | 0 |
| `src/index.css` | 104 | 0 |
| `tests/adjustmentPlan.test.js` | 157 | 0 |
| `tests/biasMacroCatalog.test.js` | 232 | 0 |
| `tests/calibrationLog.test.js` | 57 | 0 |
| `tests/callOptions.test.js` | 164 | 0 |
| `tests/callSelection.test.js` | 83 | 0 |
| `tests/conceptMatchup.test.js` | 98 | 0 |
| `tests/coverageGuidance.test.js` | 31 | 0 |
| `tests/frontStructure.test.js` | 39 | 0 |
| `tests/gameObjectives.test.js` | 81 | 0 |
| `tests/macroRecipes.test.js` | 76 | 0 |
| `tests/playMatchup.test.js` | 217 | 0 |
| `tests/recommendations.test.js` | 121 | 0 |
| `tests/runSupport.test.js` | 88 | 0 |
| `tests/sliderResponse.test.js` | 61 | 0 |
| `tests/userProfile.test.js` | 14 | 0 |
