# Release corrections — 20 September 2026

These changes address the source-level issues in RELEASE_REVIEW_2026-09-20.md. That report remains a record of the earlier revision. Changes are on FootballEngineImprovements only; main and production have not been updated.

## Corrected

- **PDF and share identity:** every recommendation carries its selected personal call with that call's score, assignments, matchup risks and complete score ledger. Exports now use that object. Best-overall formation ranking remains unchanged. The situation matrix also resolves the personal call for each situation.
- **Rollback-compatible scouts:** `cfb26_profiles` contains only legacy trait-group arrays. Run/pass preference is stored separately in `cfb27_profile_details`. Existing wrapped profiles are backed up under `cfb27_profiles_before_compatibility` before being converted. If traits are edited in the older app, a later upgrade uses those edited traits and resets stale bias to Balanced. Deleted profiles are not resurrected. Old code cannot restore the new bias field, but can read the traits normally.
- **Dependencies:** updated the lockfile with non-forced `npm audit fix`, within the existing package.json ranges. Vite is now 8.3.0. Both full and production-only audits report zero vulnerabilities. A fresh `npm ci` succeeds.
- **Deployment:** both workflows use Node 22 and `npm ci`. Both run `npm audit --audit-level=high`; high/critical advisories block the job. Main deployment now requires tests and build to pass before uploading/publishing. Deployments are serialized. The targeted lint list includes the new profile storage and release regressions.
- **Football copy:** revised the personnel and alignment guidance across packages, not just Trips Gun. Removed unsupported automatic blitz percentages, claims that empty eliminates QB runs, guaranteed free rushers, rigid option assignments, automatic Cover 3 failure against trips, and assertions that jumbo has no pass threat. The heading is now “Read the alignment.” No play counts or scoring weights were changed in this copy pass.

EA's [CFB 27 gameplay deep dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay) describes checks across Cover 3 Match, Quarters, Palms and Cover 6, and adjustable defensive alignment. It does not justify a blanket claim that all Cover 3 calls lose to trips. The revised alignment text is conditional football coaching, not a guarantee of game AI behavior. Smart Zones remain excluded per the owner's in-game verification.

## Verification

- 135 tests pass, including new differing-call export checks, selected-call ledger checks across formations/user styles, rollback edit/delete tests, wrapped-profile migration and storage-failure protection.
- Fresh locked install and production build pass after dependency updates.
- Full audit: 0 vulnerabilities. Production-only audit: 0 vulnerabilities.
- Targeted ESLint for revised engine/data modules and tests passes.
- Existing large bundle warning remains; whole-repository lint debt is not claimed fixed.
- No fresh visual phone acceptance test or production deploy was performed.

## Review together in the app

1. Build a scout with **11p + Deep Shots / Verticals**, **Very pass-heavy**, **All playbooks**, base situation, **Linebacker / Create Pressure**. Export the PDF and share text. For 3-3-5 3 High Over, the personal Edge Blitz 2 call should show **72**, **5 rush / 2 deep / 4 underneath**, rather than Quarters' 78 and 4 / 4 / 3. Compare other exported rows to their selected call as well.
2. Save a named scout with a non-balanced tendency. Reload and load it: traits and tendency should return. Export/import the scout and repeat. Existing saved scouts should still load. Automated tests cover reading those traits with the old app and editing after rollback; do not roll production back just to test this.
3. Expand Formation & Personnel information for **empty, trips, option, and heavy/jumbo** looks. Read the short advice: empty still warns about QB runs, trips does not automatically rule out Cover 3, and heavy sets still mention play action. There should be no fixed blitz percentages in this personnel guidance.
4. Check PDF download and normal plan building in light/dark mode on desktop and phone after installing the updated lockfile.

## Remaining release checks

- Confirm Settings → Pages domain and HTTPS, and load schemebuilders.com from desktop and phone. This environment could not independently verify the live domain.
- Confirm main requires the PR test-and-build check. GitHub returned no repository rulesets, but the integration received HTTP 403 when reading classic branch protection; its status is unknown. These source changes gate deployment even if PR protection has not been configured. No repository administration setting was changed.
- Back up production profiles and any other valuable browser data before rollout. Storage-full failures can prevent saving or migration; do not clear site data as a recovery shortcut. Profile export is not a backup of call logs/macros.
- Main rollback source remains **6ecbf15bf76ba7248c79deea8aeaf8126d73f582**. Recheck main before merging and follow the prior report's revert-PR procedure. Do not force-reset main.
