# Scheme Builders

**Scout your opponent. Build a defensive game plan. Understand your next call.**

Scheme Builders is a free, standalone defensive companion for **EA SPORTS College Football 27**, built with user-versus-user games in mind. Describe the offense, choose your defensive playbook and situation, and get formation, exact-call, and adjustment recommendations with coaching and tradeoffs. The app runs in your browser; it does not connect to the game or execute adjustments for you.

**[Open the app](https://schemebuilders.com)** · **[Report an issue](https://github.com/ckeysvt88/schemebuilderv2/issues)** · **[Technical handoff](docs/CLAUDE_HANDOFF.md)**

No account required. No ads. Light and dark themes. Installable on supported phones and browsers. Recommendations run locally without a required backend or live AI service.

## Start here

1. **Scout** the offense using tendencies you have actually observed, or start with a preset in **Teams**. Set the opponent's run/pass tendency.
2. Choose your defensive **Playbook**, **My Defensive User**, and **Game Objective**.
3. Set the current offensive formation/personnel and **Down & Distance**. Update them as the game changes.
4. Review the compact **call mix**. Open a call for its setup, your job, risks, and optional match check when eligible.
5. Use **Adjust** to revise the scout, **Notes** or **Test This Call** to record observations, and **Call Sheet** to edit, preview, or save a PDF.

Selecting a team resets run/pass tendency to **Balanced**: the preset describes concepts and formations, not measured play frequencies. Adjust it for the person you are facing. **Guide** on Scout opens the tutorial and topic picker.

## Features

| Area | Current capabilities |
|---|---|
| **Scout and Teams** | Manual tendencies, seven-level run/pass tendency, 138 team presets, saved opponent profiles, import/export, and in-game Adjust. |
| **Plan** | Personalized exact-call rankings, four layouts, a compact call mix, setup and coaching, optional match checks, and situation-aware alternatives. |
| **Call Sheet** | Two-page PDF, in-app preview with zoom, export-only editor, iPhone/iPad sharing, and direct desktop download. |
| **Compare** | Two-playbook comparison, shared/unique formations, and alphabetical scrolling school lists for each defensive playbook. |
| **Find my playbook** | Formation search, family filters, Must/Nice priorities, bulk selection, remembered choices, Undo, and ranked exact or closest matches. |
| **Forms** | Personnel and alignment reference, strengths/risks, formation comparison overlays, and links to Customize and Match Responsibilities. |
| **Macros** | 62 problem-based adjustment recipes; select up to 10 for a reference loadout with setup, user responsibilities, and tradeoffs. |
| **Play Art — Beta** | Custom defensive canvases, defender assignments, alignment, zone drops, shading, rush controls, Before/After, and saved macros with cross-formation Apply here. |
| **Match Responsibilities — Beta** | Animated, release-dependent examples for six called-coverage contexts and 17 named concepts, with playback, scrubbing, and full rule explanations. |
| **Notes and call tests** | Opponent notes, drive entries, and manual Test This Call observations. These records do not automatically train the engine. |

The catalog contains **72 formation reference entries**, **1,245 plays across 71 formations**, and **31 named defensive playbooks**. **Prevent 3-Deep** is reference-only without an exact-play inventory or customizable canvas. All is an aggregate filter, not a 32nd playbook. Counts describe the current dataset, not guaranteed coverage of every item in the game.

## Planning and recommendations

### Four layouts, one engine

The **Layout** button sits to the right of **Adjust** on the lower Plan header row. **Original** is the default; the selected view is remembered on that browser.

| Layout | Presentation |
|---|---|
| **Original** | Compact 2×2 call mix followed by the formation list. |
| **Quick Call** | Foundation first, with alternatives available on demand. |
| **Coaching Board** | Coaching cues and expandable alternatives. Opening an alternative gives it the available board width; collapsing restores the columns. |
| **Formation First** | Planned calls grouped by formation, with the primary group initially open. |

The mix contains up to four meaningful answers: **Foundation**, coverage **Variation**, a **Counter** to an anticipated offensive response, and qualifying **Pressure** or another variation. It is not a fixed sequence or live play history. Pressure is never added simply to fill a tile, and restricted playbooks may produce fewer calls. Identical instructions appear once in **Applies to all calls**, below the plays and collapsed by default.

**Best Overall** identifies the strongest matchup; **Best For You** considers your controlled position and call style. User positions are Linebacker, Safety, Slot / Corner, and Defensive Line. Objectives are Balanced, No Quick TD, and Get a Stop. Test This Call preserves the selected call and its setup, including alternatives.

### How the engine makes decisions

One shared service supplies the live plan, call details, share text, and PDF recommendations. It combines observed threats, run/pass tendency, current personnel, playbook inventory, exact-call evidence, coverage and run support, down/distance purpose, user preference, and objective.

- Situations distinguish early-down balance, second-and-short shot risk, short conversion downs, and long conversion downs. A short distance does not automatically mean an all-out blitz.
- Defensive-back counts influence personnel fit. A base front is not assumed suitable for a pass-heavy spread merely because its general tags score well. **3-4 Grizzly is categorized as Pressure**; each call's actual rush count determines whether it sends extra rushers.
- The engine reviews twelve situational foundations together and may select an eligible alternative within **four fit points** to reduce repeated exact calls and coverage structures. Scores are not altered to manufacture variety.
- Variation must change meaningful responsibilities, not just the formation's name. Tempo restricts alternatives to one formation; other package changes require checking substitutions and available audibles.
- **No Quick TD** preserves at least two deep defenders and no more than four stock rushers for eligible primary calls and alternatives. A documented mugged **pressure look** is distinguished from a blitz; it does not promise a simulated-pressure exchange.
- Supported Quick setup tradeoffs can affect a score within a bounded **±4 points**. Optional tools, including match checks, receive **no score bonus** merely for being suggested.

**Fit scores are heuristic rankings, not success probabilities.** The engine does not know individual player ability, actual game execution, the opponent's next play, or live route releases. Team presets and hypothetical offensive responses are starting assumptions, not observed evidence.

### Match checks tied to scouting

Eligible expanded call cards and coaching details show a collapsed gold **Optional match check** panel. The same advice is available in the formation-detail toolbox. It names the check, why it fits, and conditions/tradeoffs.

| Eligible context and scout | Example advice |
|---|---|
| Cover 3 Match; bunch/trips; flat/sideline tendency without a competing vertical tendency | Skate |
| Cover 3 Match; bunch/trips; vertical/seam tendency without a competing outside tendency | Skinny |
| Cover 6; stack; outside tendency without competing vertical tendency | Palms on the relevant match side |
| Quarters; trips | Ordinary Quarters; Stress is conditional on the actual release evidence |
| Supported man call; stack/bunch; crossing tendencies | Combo/Point Combo with an explanation of release exchanges and traffic |

Mixed outside/vertical threats retain the alignment baseline with an explanation. Several scouted alignment types do not establish one live formation. Quick-game, screens, and RPO alone do not prove a particular receiver release. Named Zone/Drop calls and unconfirmed variants do not inherit match advice. Automatic Underneath shading is suppressed when a supported match recommendation would create conflicting instructions.

The Quarters, Palms, and Cover 3 Match research informed movement rules, guidance, eligibility, and a targeted scoring correction: Palms' base flat-trap advantage is no longer borrowed for bunch/trips checks. Cover 2 Match was reviewed as background; it did **not** add a selectable check or a new numeric scoring rule. See the [research audit](docs/MATCH_COVERAGE_RESEARCH_2026_10.md).

## Call sheets

Open **Call Sheet** from Plan. **Save PDF**, **View PDF**, and **Edit call sheet** stay together in the export panel.

- Page one shows twelve down/distance situations and their starting calls, variations, counters, and eligible pressure choices.
- Page two collects reusable setup and user responsibilities, keyed to calls. Detailed coaching stays in the app; oversized instruction sets are marked **APP** rather than silently extending the sheet.
- The editor can promote an existing eligible call, exclude alternatives, filter by down or edited rows, reset an individual row, and hide optional coaching. It cannot introduce an arbitrary unvalidated call.
- Edits affect the current export only, not scores or the live plan. **Update PDF** regenerates the document; Save/View are disabled while it is stale. New sheets reset the edits. Entirely excluded situations are labeled.
- **View PDF** renders the actual generated file in the app, with scrolling and zoom.
- On supported iPhones/iPads, **Save PDF** opens sharing so you can choose Save to Files. On desktop it starts a direct download.

## Formation and playbook tools

**Forms → Compare formations** overlays two catalog alignments. Each side uses **Family → Formation** selection. Translucent red/blue circles with thin borders distinguish the layers; shared locations use a split marker. Hide a layer, inspect a marker, or show labels. **Compare** also sits next to **Customize** on formation detail. This compares starting alignments, not coverage behavior.

**Compare → Find my playbook** upgrades the existing comparison workflow. Search with punctuation-free names such as `335`, use comma-separated alternatives, filter by family, or show prioritized selections only. Set **Must** and **Nice** per formation or in bulk, and Undo the last selection change. Select shown applies only to filtered rows.

Books satisfying every Must rank by Nice coverage. When none satisfy all requirements, results explicitly list what is missing. Exact catalog names remain distinct. Start with three results and expand for more; open a result in Compare or view its schools. School lists scroll alphabetically rather than using previous/next pages.

Team headers use full primary/secondary colors with contrasting text. Expanded light-mode details use a muted secondary color, or muted primary when secondary is white; the surrounding border remains consistent with the app theme.

## Play Art — Beta

Choose **Family → Formation** and tap a defender. All **71 customizable formations** start from Custom: LOS defensive tackles and edge players show standard rush; coverage players start unassigned. Reset restores that baseline. There is no selectable stock-play library or original-image panel. Limited authored call data remains internally for existing saved macros and verified starting-look explanations.

- **Assignments:** supported zones, man labels, spies, rushes, blitzes, and contain. Man labels do not link to offensive receivers on this custom canvas; set matchups in the game.
- **Zone drops:** Default or 0–30 yards in five-yard increments for flats, curl flats, and hooks. Hooks applies to Hook Curl, Vertical Hook, and 3 Rec Hook; Middle Read retains its Cover 2-specific depth.
- **Alignment:** corner/safety depth and width, linebacker shifts, and Show Blitz. Secondary Show Blitz moves safeties to six yards while retaining corner positions.
- **Rush controls:** front technique, point of attack, compatible stunts, and left/right/both-edge contain. When a stunt and contain need the same defender, the latest selection takes priority.
- **Before / After:** Before is read-only; After edits the macro. Show changes starts off. Saving during a preview saves the full current macro. The redundant custom-canvas change list and Step through controls are removed.
- **Zone geometry:** lane-aware ovals spread moderately instead of shrinking dramatically. Crowded underneath bubbles retain at least 95% of their dimensions. Explicit deep landmarks and numeric drops stay fixed; some overlap is intentional.
- **Saved macros:** up to 50, new names limited to 20 characters. Existing longer names are preserved within legacy validation and ellipsized in the row.

**Load** restores a saved macro's original formation and setup. **Apply here** keeps the current formation and transfers compatible edited assignments: exact labels first, then SLB ↔ SLB1, DT ↔ DT1, and SLCB ↔ SLCB1. Second/third slots remain distinct; SLB never maps to MIKE. Each source maps at most once. Unmatched players and unedited stock assignments remain unchanged. Shared controls and rush combinations transfer only when their affected participants are compatible. A summary reports applied/skipped changes. Save separately to retain the result; the original is unchanged.

### Shading and leverage visualization

The collapsed **Zone drops & shading** panel contains one team-wide selection: **None, Inside, Outside, Overtop, or Underneath**. The controls use a compact 2×2 grid. Selecting shading enables **Show leverage**; None and Reset turn it off. Loading or applying a saved macro retains shading but starts with its display off and scope set to All defenders.

Smooth green/red gradients show qualitative benefit/risk, with an intensity slider and **All defenders / Selected defender** display scope. The selected-defender picker stays synchronized with field selection.

- A displayed coverage zone takes priority over its owner's starting position; there is no duplicate full-strength position gradient.
- Gradients follow zone depth/spacing and fade beyond the bubble outline. They do not imply a larger coverage area or measured success rate.
- Rush, blitz, contain, spy, and unassigned jobs receive no coverage overlay. A lineman explicitly placed in coverage can show its coverage overlay.
- Pre-snap view uses eligible position overlays. Before hides overlays; After restores the chosen display. A centered zone uses its owner's side when available; if both are centered, inside/outside is not guessed.
- Underneath/Overtop slightly shifts supported linebacker Hook Curl landmarks; explicit numeric hook depth wins. Other zone sizes and pre-snap positions do not change. The offset is illustrative.

Play Art macros do not automatically alter planner scores or execute in-game adjustments. **Report a bug** opens an email to help@schemebuilders.com with the setup included.

## Match Responsibilities — Beta

Open from **Play Art** or **Forms**. Select called coverage, offensive look, available check, and receiver releases. Play/pause/replay at fixed **2×**, scrub, jump between stages, follow a role, or flip the field. Reduced-motion preferences disable automatic playback while preserving manual controls.

The first **Match Adjustment** disclosure is gold and **collapsed by default**, including when the check changes. Descriptions include inherited rules, so Bingo can be understood without jumping to Box. The old Menu coverage & sources section is removed; source metadata remains in code and documentation.

The compact field includes a center reference, ball, and LOS. Solid links show declared matches; dashed links show reads/help. Zone It displays participating zones. A declared match follows the receiver without retaining a misleading zone bubble. Zone/help landmarks fade with playback and identify their owner. The scrubber remains close to the field; the diagram key is collapsed.

Availability follows owner-provided **in-game screenshots**, overriding website claims. The Gaming Tailgate PDF supplies prior default references; screenshots do not establish defaults. Base 2×2 is teaching context, not another game adjustment menu. No unsupported Triangle, Top Hat, or Cover 2 Match adjustment is offered.

**Stump:** EA establishes the intent of extra help against short #1 but does not fully specify the disputed exchange. Nonvertical-#1 examples are omitted from the selector and assignment/motion engines. Supported non-trigger examples retain Stubbie behavior. No short-route pickup or exact yardage threshold is invented.

These are schematic teaching examples for the relevant coverage group, not a full eleven-player game simulation. Press/shading interactions, four-strong push chains, timed wall contact, late double moves, and some contested ownership rules remain outside verified scope. Owner-confirmed releases are preserved; **Middle Read was not changed** by the match research. Details and conflicts: [research audit](docs/MATCH_COVERAGE_RESEARCH_2026_10.md).

## Saved data and installation

On iPhone, use Safari → Share → Add to Home Screen. Other supported browsers offer Install/Add to Home Screen. The service worker caches the app shell and visited assets; this is not a guarantee every unvisited feature works offline.

Profiles, notes, observations, preferences, macro loadouts, and Play Art saves are browser-local and do not sync between devices. Active navigation/scouting is additionally restored through session storage. **Profile Export/Import backs up opponent profiles, not all app data or Play Art macros.** Localhost and the live domain have separate storage.

Coverage Lab, a My Defense workspace, public Play Art macro sharing, automatic live tendency tracking, and prototype workload/RPO controls are **not shipped features**. Review files do not make a feature live.

## Development

Use Git and **Node.js 22.13+ in the Node 22 release line** with npm; CI uses Node 22.

```bash
git clone https://github.com/ckeysvt88/schemebuilderv2.git
cd schemebuilderv2
npm ci
npm run dev
```

For a phone on the same Wi-Fi:

```bash
npm run dev -- --host 0.0.0.0
```

Open Vite's Network URL. For a production preview:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Keep the server running. HTTPS is needed for secure browser/installed-app features.

| Command | Purpose |
|---|---|
| `npm test` | Node regression suite. |
| `npm run build` | Production output in `dist/`. |
| `npm run lint` | Repository-wide ESLint; includes historical files and is not the same as CI's focused lint list. |
| `node scripts/auditFormationCoverage.js` | Inventory/formation audit; regenerates its report, so inspect the resulting diff. |

The app uses React 19, Vite 8, JavaScript, CSS/SVG, React PDF, and PDF.js. `src/App.jsx` owns navigation and shared inputs; `src/engine/recommendations.js` is the recommendation entry point. See [CLAUDE_HANDOFF.md](docs/CLAUDE_HANDOFF.md) for the full module map, storage contracts, evidence hierarchy, regression cases, and release procedure.

GitHub Actions deploys `main` to [schemebuilders.com](https://schemebuilders.com) through GitHub Pages. Deployment runs locked install, a high-severity dependency audit, tests, and build. `public/CNAME` defines the domain. Review workflow definitions before assuming a particular check runs on every push.

The November 10 documentation review rechecked the dataset and ran the regression suite/build. Detailed results and prior visual-validation scope are recorded in the handoff. A successful build may still report a large-chunk warning; performance splitting remains follow-up work.

## Contributing and accuracy

Use a branch/PR, explain changed behavior, and run checks relevant to the change. Football behavior changes need a concrete formation/check/release example and a source or owner-confirmed rule. Update this README when user-facing capability changes.

For bug reports include scouting traits, playbook, formation, exact call, down/distance, controlled position, objective, applied adjustments, expected/actual behavior, game version/platform, and a screenshot when possible.

Do not infer pre-snap safety count from post-snap deep zones: Quarters may start two-high. Do not claim an optional check was applied, an animation proves game accuracy, or an observation retrained the engine. Preserve existing browser data and verify an appropriate rollback before a release when requested.

Independent community project; not affiliated with or endorsed by EA SPORTS. Authored example assignments used [CFB Labs](https://www.cfblabs.com/) references; research sources and unresolved differences are retained in `docs/`.
