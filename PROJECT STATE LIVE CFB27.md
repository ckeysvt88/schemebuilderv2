# PROJECT STATE — SchemeBuilders, CFB 27 Live Release

Status: SHIPPED TO PRODUCTION. schemebuilders.com is serving the CFB 27 build,
PWA install confirmed functional. This document is the point-in-time record of
what is live, how it got there, and what remains open.

---

## What the app is

SchemeBuilders (schemebuilders.com) is a free, no-login defensive scouting PWA
for EA College Football 27. A player picks an opponent, gets a scouting read on
that team's offense, and receives defensive formation, coverage, and adjustment
recommendations built off that read. React 19 + Vite, static-hosted on GitHub
Pages via Actions. Works mobile-first, installs to home screen as a PWA.

---

## Production deploy — how it works (recorded so it isn't re-derived later)

- Production repo: `ckeysvt88/schemebuilderv2`, remote alias `origin`.
- Deploy trigger: push to `main` ONLY. No other branch triggers the production
  Pages build.
- `origin/cfb27` exists but is FROZEN at an early pre-Phase-C commit. It is not
  watched by the workflow and is effectively abandoned. Do not treat it as a
  live target.
- Test site (test.schemebuilders.com) deploys from a SEPARATE repo,
  `ckeysvt88/schemebuilders-test`, remote alias `test`, via
  `git push test cfb27-test:main`. Test and production are different repos with
  different Pages configs and different service-worker cache namespaces.

### CNAME handling — permanent gotcha, do not forget
- `main`'s deploy workflow HARDCODES the production domain:
  `echo "schemebuilders.com" > dist/CNAME`. It does NOT read from a source file.
- `public/CNAME` was DELETED from the tree during this release. It previously
  contained `test.schemebuilders.com`, and a plain merge silently swapped the
  workflow's hardcoded echo for a `cp public/CNAME dist/CNAME` step, which would
  have written the TEST subdomain into the live Pages config and broken the site.
- If deploy.yml is ever edited again: the ONLY correct CNAME step on `main` is
  the hardcoded echo. Never reintroduce a cp-from-file variant, and never
  recreate public/CNAME on the production branch.

### Service worker cache
- Production cache constant is now `schemebuilders-v3-1` (public/sw.js), bumped
  from the prior `schemebuilders-v2-1` to force existing visitors off cached
  CFB 26 assets. The test value `schemebuilders-TEST-v1` must never ship to prod.
- The service worker caches aggressively. ALL production verification is done in
  an incognito window. A normal window can show a stale build even after a
  successful deploy.

### The release commits (on origin/main)
- `d182ba3` — Merge cfb27-test: CFB27 rebuild into production (zero conflicts).
- `fc641e9` — Fix production CNAME handling + bump service worker cache
  (deploy.yml, public/CNAME deleted, public/sw.js). Kept deliberately separate
  from the merge so history shows the merge and the corrections distinctly.

---

## What shipped in this release

### Teams tab — full CFB 27 rebuild (Phase 8, the headline of this release)
- Rebuilt from 108 teams to all 138 CFB 27 teams.
- Schema per team: `{ id, name, conf, color, rating, scheme, defPlaybook,
  traits[], notes }`. `rating`, `scheme`, and `defPlaybook` are new this release.
- Live data source `src/data/teams.js` now holds the 138-team `TEAMS` array
  (conference-grouped with comment dividers) plus a 12-entry `CONFERENCES` array
  (`all` + 11 real conferences).
- The Teams tab itself was previously present in code but unreachable, hidden
  because `BottomNav.jsx`'s TABS array had no `teams` entry. That entry was
  re-added this release; the tab is now reachable and populated.

#### How the trait data was built (the method, so it can be extended consistently)
- Two-layer build. Layer 1: scheme label, star rating, and defensive playbook
  taken verbatim from the Civil.GG CFB 27 team doc. Layer 2: per-team offensive
  formation evidence scraped from playbookprofessor.gg into
  `formations_138_clean.json`, translated into the existing `traits.js`
  vocabulary.
- STANDING RULE established this release: formation evidence supersedes the
  scheme label wherever they conflict. Applied consistently, not case-by-case.
  This is why several teams carry traits that contradict their listed scheme.
- Every team's `traits[]` was validated against `TRAIT_LABELS` in
  `src/data/traits.js` before merge. 27 distinct traits are in use across the
  138 teams. Final validation: 138 entries, zero duplicate ids, every conf
  present in `CONFERENCES`, zero invented conference labels.

#### Conference alignment
- Updated to the current realignment (Pac-12 is active, not dead). Final counts:
  Big Ten 18, ACC 17, Big 12 16, SEC 16, AAC 14, Sun Belt 14, MAC 13, CUSA 10,
  Mountain West 10, Pac-12 8, Independent 2.
- Confirmed against CK's explicit rosters: Army IND→AAC, Florida Atlantic
  CUSA→AAC, Louisiana Tech CUSA→SBC were the corrections applied on top of the
  carried-forward values.

#### Scheme distribution (verbatim Civil.GG labels, for reference)
- Spread 44, Pro Style 26, Multiple O 23, Air Raid 19, Veer & Shoot 10,
  Option 7, Pistol 7, Run & Shoot 2.

### Playbook filter — bug fixed
- The top-right playbook selector was not limiting suggestions to the selected
  playbook in the prior build. Fixed this release; suggestions now correctly
  filter to the chosen playbook.

### Everything from prior phases, now also live on production for the first time
This release is the FIRST time any CFB 27 work reached production. Everything
below was previously live only on the test site:
- Phase 2: all 51 non-stub defensive formations re-authored (desc, dcNote,
  coverages, coaching, callsheets, tags; books preserved).
- 72 formations with full `books:` field populated from the playbook screenshot
  OCR pass, which is what makes the playbook filter functional.
- 1,241 plays across all defensive formation families, transcribed and validated
  against the `rush + deep + und + man + spy === 11` invariant.
- Capability scoring layer (clamped ±15) on top of the tag-score engine.
- Adjustments tab: Formation-Specific (from `formation.coaching[]`) +
  Scouting-Based (trait-matched) sections, values verbatim from in-game menus.
- `macros.js` and `adjustments.js` rewritten to verbatim in-game menu values.
- All CFB 26 user-facing references updated to CFB 27 (real external CFB 26
  source citations intentionally preserved).

---

## Open items — carried forward, NOT blocking the release

### Data-quality flags logged during Phase 8 (unresolved by design)
These were logged during the batch build and did not block ship. They are
accuracy questions, not bugs, and can be revisited without a code change beyond
the affected `teams.js` entries.

1. Option-label mismatches: Jacksonville State, Liberty, Missouri State, and
   Sacramento State are labeled "Option" in the source doc but have ZERO
   option-family formations (no Flexbone/Wingbone/Split T/Wishbone) in the
   scrape. Their traits are evidence-based, not the Option baseline. Air Force,
   Army, and Navy are the genuine option teams. 4 of 7 Option-labeled teams
   lack supporting formations — worth a manual check against the in-game menu.
2. Kennesaw State: labeled "Pistol", zero Pistol formations in the scrape.
   Resolved per CK's instruction to go by the actual plays, not the tag. Traits
   are evidence-based.
3. Air Raid pattern: roughly half the 19 Air Raid-labeled teams show high
   TE-attachment against the label's usual TE-light identity. Wisconsin is the
   extreme case (8% open-surface ratio). Not corrected — flagged as a possible
   sign the "Air Raid" label in this dataset means something closer to
   "shotgun-based" than "four-wide".
4. Single-back Pro Style: 9 of ~26 Pro Style teams have zero 2-back formation
   evidence; p21 was dropped for all of them. This turned out to be the majority
   Pro Style variant, not an exception.
5. Closed "Spread" teams: Charlotte, Coastal Carolina, Georgia Tech, Houston,
   Illinois, Notre Dame, Rutgers and others carry a Spread label but read as
   TE-heavy/closed by formation evidence. Traits are evidence-based.
6. Scrape data gaps (do not affect traits, both families unmapped): Kansas and
   Texas Tech missing both Goal Line and Hail Mary; Stanford and UAB missing
   Goal Line; Clemson missing Hail Mary.
7. UAB curiosity: single Wishbone set inside a Pro Style book — the only
   option-family formation found in any non-Option-labeled team. Too thin to act
   on (1 set), logged only.

### Deferred technical cleanup (backlog, surgical, not urgent)
- `TeamsScreen.jsx` still renders only name/conf/notes. The new `rating`,
  `scheme`, and `defPlaybook` fields are in the data but not yet displayed. This
  is the natural next feature: surface those as structured fields on the team
  card. Deliberately scoped OUT of this release.
- Dead code: `persTag` (computed in TeamsScreen.jsx but never rendered) and
  `PERS_LABELS` (defined, unused). Safe deletions, deferred per surgical-edit
  rule.
- Conference `conf` values in `teams.js` were carried forward from the old file
  and corrected against CK's manual research pass, not independently re-verified
  end to end. If a discrepancy surfaces, that's the place to look.

---

## Working principles established this project (for future sessions)

- Formation/play evidence supersedes scheme labels, always, not case-by-case.
- Source hierarchy: in-game screenshots > CK's direct answers >
  playbookprofessor.gg scrape > Civil.GG labels > documentation (lowest trust).
- `/mnt/project` snapshots drift from the live repo repeatedly. Verify against
  the live repo via Claude Code before any data-file edit. This bit twice this
  project (id mismatches: fiu, la-monroe).
- Strict approval gate: audit → plan → CK approves → implement → localhost/
  incognito review → push. No code before approval.
- Batch work delivered as downloadable files for redline, merged after approval.
- Never stage `.claude/settings.local.json` or transport/BATCH files.
- Production verification is always incognito, given aggressive SW caching.
- Football-logic changes (scoring weights, rules) require explicit approval —
  no silent retuning.

---

## Repo / deploy quick reference

- Production: `ckeysvt88/schemebuilderv2`, remote `origin`, branch `main`,
  deploys on push to `main`. Live at schemebuilders.com.
- Test: `ckeysvt88/schemebuilders-test`, remote `test`,
  `git push test cfb27-test:main`. Live at test.schemebuilders.com.
- Local working branch: `cfb27-test`.
- Prod SW cache constant: `schemebuilders-v3-1`.
- CNAME on main: hardcoded echo in deploy.yml. No public/CNAME file on prod.

---

Release verified live: Teams tab reachable and populated (138), team scouting
data renders, playbook filter narrows suggestions correctly, custom domain
resolving to schemebuilders.com, PWA install functional.
