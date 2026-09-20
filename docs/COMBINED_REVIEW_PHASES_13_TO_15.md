# Combined in-app review — updates 13–25

This is one review of:
- **fa4133b:** selected-threat scoring and context-aware Test This Call logs.
- **399860f:** coverage run support, RPO handoff/conflict logic, and overlapping scout traits.
- **ab668fd:** balanced run-support choices when inside and outside threats are both selected.

- **Update 16:** personalized-call safety and verified QB-control labels.

- **Updates 17–18:** common scoring scale and assignment-bound verification.

- **Update 19:** complete personal-selection safeguards, including rejected-call fallback handling.

- **Update 20:** use owner-validated assignments for all 1,245 plays across 71 formations.

Allow about 60–75 minutes for the full review; the new update 23 checks take about 15–20 minutes plus game practice. You do not need to read code. Mark each numbered check Pass, Fail, or Not tested.

## 1. Update your existing preview

Use your normal browser profile and the same localhost address/port as before so your saved call tests remain available.

1. Open PowerShell in your existing preview folder. You do not need to start Claude Code.
2. If that window is running localhost, press **Ctrl+C** once to stop it.
3. Run each line separately:

```powershell
cd "C:\Users\ckeys\OneDrive\Desktop\schemebuilder-football-preview"
git fetch origin
git switch --detach origin/FootballEngineImprovements
git log -1 --oneline
npm run dev
```

The latest commit message should be **Clarify toolbar borders and track actual user changes**. Compare its short number with the one in my delivery message.

If Git says local changes would be overwritten, stop and send that message; do not discard files or use a force/reset command. If fetch only asks whether to retry deleting the old worktree folders from earlier, answer **n**.

Open the localhost address shown in PowerShell. Leave PowerShell running. Refresh the browser.

- [ ] **Check 1 — Startup:** App loads, navigation works, and your existing saved scouting/user information is still available.

## 2. Use a repeatable starting setup

Use manual scouting so a team's prefilled traits do not affect the checks.

Before each scenario below:
- Clear the previous trait selections.
- Select **11p (1 RB, 1 TE, 3 WR)**.
- Select only the additional traits named in that scenario.
- Keep run/pass bias at the middle/balanced setting.
- Choose the **Multiple** defensive playbook.
- In the game plan, select **11p Gun**.
- Set **My Defensive User → Linebacker**, with the balanced calling style.
- Set **Game Objective → Balanced** unless a check explicitly says otherwise.
- Set **3rd down → Short**, unless the scenario says otherwise.

Open the named defensive formation and its **Coverages** tab. Expand **More calls in this formation** if the requested call is not one of the first cards. Expand **Call coaching** to see **This call protects**, **Your job**, and **Main concern on this down**.

“Best Overall,” “Best For You,” and “Run-Fit Answer” are different labels. A run-support choice does not have to be the overall winner in every situation.

## 3. Run support and this update's mixed-run decision

### Check 2 — Inside runs

Additional trait: **Inside Zone / Power**.

Open **3-4 Tite**:
- [ ] **Cover 4 Quarters** has **RUN-FIT ANSWER**.
- [ ] Its coaching says both safeties read run and add inside support.
- [ ] **Cover 3 Sky** explains the rotated safety's inside support.
- [ ] Quarters still warns that play action or a vertical slot release can hold the safeties out of the fit.

Do not expect a five-player formation front to be labeled five pass rushers. Alignment and the selected call's rush assignments remain different facts.

### Check 3 — Outside runs

Replace Inside Zone / Power with **Outside Runs / Sweeps**.

In **3-4 Tite**:
- [ ] **Tampa 2** receives **RUN-FIT ANSWER** in this setup.
- [ ] Its run-support explanation identifies the corners outside and the safeties protecting deep halves.
- [ ] Replace the trait with **HB Stretch**. The outside-support option still makes sense; the app should not treat stretch as an inside run.

Tampa 2 is the two-deep zone option in this formation's menu. A standard Cover 2 card elsewhere should also describe corner force support, not safety inside fits.

### Check 4 — Both run directions: the new decision

Select **Inside Zone / Power** and **Outside Runs / Sweeps** together.

In **3-4 Tite**:
- [ ] **Cover 6** receives **RUN-FIT ANSWER**.
- [ ] Its reason identifies the quarters-side safety inside and Cover 2-side corner outside.
- [ ] The coaching reminds you to check which side is which.
- [ ] There is still a Best Overall label, and one Best For You choice; sharing a call is allowed.

Now replace those traits with **Counter / Trap** and **HB Stretch**:
- [ ] Cover 6 remains the run-support choice for the two directions.

This checks coverage support across both threats. It does not mean Cover 6 always stops every run or outranks every call.

### Check 5 — No balanced-support call in the menu

Return to **Inside Zone / Power + Outside Runs / Sweeps**. Open **4-3 Over Solid**.

- [ ] The app does not invent a Cover 6 option in this menu.
- [ ] The Run-Fit Answer says which direction it helps.
- [ ] Its reason also explains the other direction still relies on the front/linebackers or front/overhangs.
- [ ] It does not claim a one-direction support call supplies secondary help in both directions.

In the exact setup above, expect **Cover 2 Invert Hard Flat** with outside-support wording and an inside-run caution. Its explanation should not assume an inverted call uses the same player roles as ordinary Cover 2.

## 4. Scouting and situation changes

### Check 6 — Quick throw versus deep shot

Use **Base** down for this check.

Select **Quick Game / Bubble Screens** and open **4-3 Over Solid**:
- [ ] Best Overall is **Cover 2 Invert Hard Flat**.

Replace it with **Deep Shots / Verticals**:
- [ ] Best Overall changes to **Cover 4 Quarters**.
- [ ] Coaching discusses the deep pass and what the offense can take underneath.

Do not judge the update by whether every fit number went up. Scores are ranking aids, not success percentages.

### Check 7 — Overlapping labels

Use **Base** down. Select **Outside Runs / Sweeps**:
- [ ] Add **HB Stretch**. The app remains stable and does not imply two independent outside-run threats solely because both labels are checked.

Then try **Mobile / Scrambling QB**, adding **Dual-Threat QB** and **Scrambles / Extends Plays**:
- [ ] Recommendations remain usable and keep QB escape as the concern.

Scores can still change if an additional selected label matches a formation's stronger authored support or another rule. Exact score equality is not the pass condition. The engine's duplicate-demand and duplicate-warning rules are checked automatically; you are checking useful football behavior and lack of erratic results.

### Check 8 — RPO preserves the run/pass conflict

Use **Base** down and select only **RPO Heavy** in addition to 11p. For this check, change the defensive playbook to **4-3 Press Quarters** so Over Solid stays easy to find.

Open **4-3 Over Solid → Cover 2 Invert Hard Flat → Call coaching**:
- [ ] The main concern explains the problem of one defender having to cover both run and throw.
- [ ] It does not promise that hard flats alone stop the entire RPO.

Add **Mobile / Scrambling QB**:
- [ ] The call remains usable and the warning can shift to QB escape.
- [ ] It never claims the back's handoff disappears because the QB can run.

The handoff's continued presence is also an automated engine check; the UI intentionally displays only the highest-priority concern, not every internal scenario.

### Check 9 — Short versus long yardage

Return the defensive playbook to **Multiple**. Select **Inside Zone / Power + Quick Game / Bubble Screens + Deep Shots / Verticals**.

In **3-4 Tite**:
1. Set **3rd & Short**.
2. Note Best Overall, Best For You, and the main concern on the overall call.
3. Change only distance to **Long**.

- [ ] The overall call changes from **Cover 3 Sky** to **Cover 6** in this exact setup.
- [ ] The overall call's main concern shifts from the inside run toward the vertical/seam throw.
- [ ] The long-yardage choice has **PROTECT THE STICKS**.
- [ ] In **Adjustments**, the long-yardage plan protects the line to gain/deep pass rather than prescribing underneath coverage.
- [ ] Change to **4th & Long**. It still protects conversion/deep threats and does not offer a zero-deep call as the long-yardage recommendation.

Individual alternative cards can keep the same warning when their main vulnerability is unchanged. Compare the overall call and game plan, not just one alternative in isolation.

### Check 10 — Red zone

Select the **Red Zone** situation:
- [ ] The scenario is not automatically described as goal line.
- [ ] It does not automatically force goal-line personnel just because you selected Red Zone.

## 5. Test This Call: saved data and context

Use test notes such as **UI REVIEW — sample** for artificial entries and delete those entries individually afterward. Prefer actual practice outcomes if available. Do not use Clear All to remove samples.

### Check 11 — Old entries and popup behavior

Open **Test this call** from a coverage card:
- [ ] Formation, exact call, down/distance, and your user position match the card you opened.
- [ ] The popup fits the screen, scrolls internally, and its Close button works.
- [ ] **Saved evidence** still shows old entries if you previously recorded any.
- [ ] With no outcome selected, Save is disabled.
- [ ] Select an outcome and save. One entry is added, outcome selection resets, and Save becomes disabled again.

### Check 12 — Optional test context

Expand **Optional details**:
- [ ] Platform, Difficulty, Mode, Game update, and the setup-confirmation checkbox are present.
- [ ] Save an entry with those fields filled. The saved evidence identifies the context.
- [ ] While the popup stays open, your environment selections remain for the next entry.
- [ ] Close/reopen and confirm the saved entry remains. The form's environment fields may reset when opening a new popup; that is currently expected.

### Check 13 — Same call, different contexts

Record a sample **Cover 4 Quarters** test in each of these:
1. **3-4 Tite, 3rd & Short**
2. **3-4 Tite, 3rd & Long**
3. **4-3 Over Solid, 3rd & Short**

Keep optional environment fields and offense description identical or blank.

- [ ] The three contexts appear as separate evidence groups.
- [ ] Add a second entry with exactly the same context as item 1. That group count increases.
- [ ] Record another item-1 test with a different Game update label. It is kept separate.

### Check 14 — Logging an adjustment setup

Open **Adjustments → Log this setup after the snap**:
- [ ] The popup shows the listed setup.
- [ ] Confirm “I used the listed pre-snap setup” and save an outcome.
- [ ] A test with confirmed setup is kept separate from an otherwise matching test without confirmation.

Opening **Test this call** from a coverage card does not automatically mean the adjustment setup was used. Only confirm a listed setup you actually followed.

### Check 15 — Persistence, export, and no automatic retuning

- [ ] Close the popup and refresh the same localhost page. Saved entries remain.
- [ ] Revisit the same scout, situation, and user settings. Logging outcomes alone has not changed recommendation scores.
- [ ] **Copy Test Data** copies the observations. Paste into Notepad to confirm there is content; you do not need to understand its format.
- [ ] Delete only your sample entries with their individual X buttons. Real earlier observations remain.

## 6. Final usability checks

### Check 16 — Personalization and presentation

- [ ] My Defensive User is easy to find.
- [ ] Change Linebacker to Safety and try the Protect Explosives style. Best For You remains visible on expanded/collapsed cards.
- [ ] Best Overall remains available even when Best For You is a different call.
- [ ] Return to Linebacker/balanced afterward.
- [ ] Try a narrow phone-sized browser window and both themes. Text/buttons do not overlap, and the Test This Call popup can be closed.
- [ ] Main card information is readable quickly; longer coaching stays behind Call coaching.
- [ ] Suggested blitz percentages and Smart Zones have not returned.

### Check 17 — Playbook and call-sheet consistency

- [ ] Change to a different defensive playbook. Only its available formations/calls are recommended.
- [ ] Return to Multiple.
- [ ] Generate the **Call Sheet** for the same situation. Its current recommended formation/call agrees with the live personalized choice.
- [ ] If a comparison fails, first confirm the playbook, family, down/distance, and My Defensive User settings match.

## 7. New personalized-call safeguards

### Check 18 — Pressure preference must respect the matchup

Reset the traits. Select **11p + Deep Shots / Verticals** only. Choose **4-3 Press Quarters**, **11p Gun**, and **Base** down. Set **My Defensive User → Defensive Line → Create Pressure**.

Open **4-3 Over Solid**:
- [ ] **Cover 4 Quarters** is both Best Overall and Best For You.
- [ ] The personal explanation says the preferred alternative gives up too much against this matchup.
- [ ] **FS Blitz** remains available as a pressure alternative, but is not Best For You.
- [ ] Collapse the formation. It still shows the same recommended call.

The app should help you choose pressure when it fits, not force a blitz just because you prefer it.

### Check 19 — Pressure preference still works when calls are competitive

Keep that setup, but replace Deep Shots / Verticals with **Stays in Pocket**.

In **4-3 Over Solid**:
- [ ] **Cover 3 Match** is Best Overall.
- [ ] **FS Blitz** is Best For You.
- [ ] Both calls remain visible. The personal explanation relates the choice to your Defensive Line/Create Pressure settings.
- [ ] Generate the Call Sheet and confirm it follows the same personalized choice.

These are expected results for this exact setup, not a claim that FS Blitz always beats a pocket passer.

### Check 20 — No QB-control promise from a play name

Replace Stays in Pocket with **Mobile / Scrambling QB**. Change your defensive user to **Linebacker / Balanced**.

- [ ] In 4-3 Over Solid, no call receives **QB CONTROL** without a verified spy or contain assignment.
- [ ] Best For You still appears and the QB-escape concern remains available in coaching.
- [ ] A Spy or Contain play name alone does not establish QB control; its validated counts decide the label.

Update 20 enables owner-validated spy/contain counts throughout plays.js. Four-three Over Solid still has no spy/contain call in its recommendation menu, but other formations do. Check 29 below verifies a positive QB-control example.

### Check 21 — The previous football improvements remain

- [ ] Repeat Checks 2–4: Quarters inside support, Cover 2 outside support, and Cover 6 mixed support remain.
- [ ] Repeat Check 9: short/long-yardage priorities still change.
- [ ] Best For You may share Best Overall. A different user preference does not have to produce a different call when it sacrifices too much against the scout.

## 8. Common scoring and assignment evidence

### Check 22 — Review ranking changes without expecting scores to stay fixed

Use **11p**, **Multiple**, **11p Gun**, **Base**, balanced run/pass and **Linebacker / Balanced**.

- [ ] With no additional tendencies, recommendations load normally. Scores may be lower than before; they are not success percentages.
- [ ] Add **Deep Shots / Verticals**. Open **4-3 Over Solid**: Best Overall remains **Cover 4 Quarters**.
- [ ] Replace that with **Quick Game / Bubble Screens**: Best Overall becomes **Cover 2 Invert Hard Flat**.
- [ ] Other formations may move in the list. Check that their football advice fits the selected threat; spy, contain and coverage claims should follow the validated play counts.

Every call now uses the same formation/threat blend. Unknown assignment-dependent threats start neutral. This fixes the old scale mismatch; it does not prove equally accurate predictions for every call.

### Check 23 — Run-support credit survives the scoring change

Repeat Checks 2–4 with their **3rd & Short** setup:
- [ ] Quarters remains the inside Run-Fit Answer.
- [ ] Tampa 2 remains the outside Run-Fit Answer in 3-4 Tite.
- [ ] Cover 6 remains the mixed-direction Run-Fit Answer.
- [ ] Coaching still describes safety/corner support without claiming complete front-gap ownership.

### Check 24 — Existing verified calls still work

Open **3-4 Tite** and **4-3 Over Solid**:
- [ ] Coverage cards, coaching and Test This Call still open normally.
- [ ] Previously saved observations remain after refreshing.
- [ ] No verification failure or developer-only assignment message has appeared on the main card.

Behind the scenes, automated checks now change each assignment field in all 1,245 validated records and confirm the altered record loses verification. You do not need to edit files or reproduce those mutations. The stored snapshots preserve the prior reviewed records; they do not count as a new gameplay test.

### Check 25 — Updated scores stay consistent across views

Using one unchanged scout/situation/user setup:
- [ ] Expanded and collapsed cards agree on Best For You.
- [ ] The Call Sheet uses that same personalized call.
- [ ] Shared results and the live list agree on formation fit scores.
- [ ] Reopen Test This Call: formation, call and situation match what you selected.

## 9. Completed selection safeguards

### Check 26 — Protect deep help across user preferences

Use **11p + Deep Shots / Verticals**, **4-3 Press Quarters**, **11p Gun**, and **Base** down.

In **4-3 Over Solid**:
- [ ] Set **Defensive Line / Create Pressure**. Quarters remains both Best Overall and Best For You in this exact setup.
- [ ] Try Linebacker, Safety, Slot / Corner, and Defensive Line with each of the three calling styles. There is exactly one Best For You choice per formation; it may share Best Overall.
- [ ] **Hammer 0 Blast** does not become either winner while Deep Shots is selected.
- [ ] Change to **3rd & Long**, then **4th & Long**. The recommended calls retain deep help, even with Create Pressure selected.

The safeguard covers known zero-deep exposure. It does not promise every selected coverage wins against every deep route.

### Check 27 — A safe choice does not mean pressure is disabled

Return to **Base**. Replace Deep Shots with **Stays in Pocket**. Keep **Defensive Line / Create Pressure**.

In **4-3 Over Solid**:
- [ ] Best Overall is **Cover 3 Match**, and Best For You is **FS Blitz**.
- [ ] Both expanded and collapsed cards agree.
- [ ] Open **Adjustments** and **Log this setup after the snap**. The selected call is FS Blitz, not the overall call.
- [ ] Close without saving if this was only a UI check.

### Check 28 — Recommended calls stay consistent when the situation changes

Return to the Deep Shots setup in Check 26 and select **4th & Long**:
- [ ] Generate the Call Sheet. Its Best For You calls agree with the live cards.
- [ ] Share/copy the plan. The selected personal calls agree with the live cards.
- [ ] Return to Base or change your user profile. The current cards update without retaining a recommendation from the previous situation.

The all-rejected-menu case is tested automatically with controlled candidates. It returns no recommendation rather than restoring a rejected call. You do not need to alter the catalog to trigger it. If you encounter an empty result naturally, the app should say no recommended call fits the scout, situation and playbook; report your setup rather than clearing valid scouting traits to force a result.

## 10. Full-catalog assignment scoring

### Check 29 — QB control now uses the validated catalog

Reset traits. Select **11p + Mobile / Scrambling QB** only. Choose **3-3-5**, **11p Gun**, **Base**, balanced run/pass, and **Linebacker / Stay Balanced**.

Open **Nickel 3-3 Over Jack**:
- [ ] **Cover 1 Contain** is Best Overall and Best For You.
- [ ] It has the **QB CONTROL** label.
- [ ] The reason explains that a defender tracks the QB.
- [ ] Call coaching no longer treats this call as having no spy or contain assignment.

Its validated record has one spy and two contain rushers. Contain is already included in the rush total; it is not two additional defenders. Counts do not need to be displayed on the main card for this check to pass.

### Check 30 — Change the threat, change the answer

Keep the Check 29 setup. Replace Mobile / Scrambling QB with **Deep Shots / Verticals**.

In **Nickel 3-3 Over Jack**:
- [ ] Best Overall changes to **Cover 3 Match**.
- [ ] Best For You is also Cover 3 Match with Linebacker / Stay Balanced.
- [ ] QB CONTROL is not promoted when the mobile-QB concern is no longer selected.
- [ ] Change to 3rd & Long, then 4th & Long. The selected calls retain deep help.

Rankings elsewhere may change too: those formations now receive the same assignment-aware evaluation previously limited to two formations.

### Check 31 — Existing functions still follow the selected call

Return to the mobile-QB setup in Check 29:
- [ ] Expanded and collapsed cards show Cover 1 Contain as Best For You.
- [ ] The Call Sheet and shared plan select the same call for Nickel 3-3 Over Jack.
- [ ] Test This Call opens for Cover 1 Contain with the current formation/situation.
- [ ] Saved observations survive a refresh.
- [ ] Repeat Checks 2–4: coverage-family run support still works.

Every catalog record is covered by automated total/count/snapshot tests; you do not need to manually check 1,245 plays. Future new or edited assignments will need validation. Current recommendation menus remain curated; enabling the full catalog's evidence does not put every play into the short recommendation list.

## 11. Playbook popup

### Check 32 — Same popup on both screens

- [ ] On the scouting screen, tap the playbook button. A centered **My Defensive Playbook** popup opens over a dimmed background.
- [ ] The current book is highlighted. Scroll the list; the Done button stays visible.
- [ ] Select another book. The popup closes and the selected book updates.
- [ ] Open the selector on the game-plan screen. It uses the same popup, highlights the same book, and retains the Recommended label when applicable.
- [ ] Select a book and confirm the game plan refreshes for that book.
- [ ] Reopen, then tap Done or outside the popup. The selection does not change.
- [ ] On desktop, Escape closes it; Tab stays within the popup while it is open.
- [ ] On a narrow phone screen and in both themes, the list scrolls without moving the background and all book names remain readable.

This update changes playbook selection presentation only. Your saved playbook and recommendation logic still use the existing selection handler.

## 12. Game Objective

### Check 33 — Your objective changes the call

Use **11p + Quick Game / Bubble Screens**, **4-3 Press Quarters**, **11p Gun**, **Base**, balanced run/pass and **Linebacker / Stay Balanced**.

Open **Game Objective** in the setup row above down/distance. Open **4-3 Over Solid**:
- [ ] **Balanced** selects Cover 2 Invert Hard Flat as Best Overall.
- [ ] **No Quick TD** changes Best Overall to Cover 3 Match.
- [ ] The No Quick TD description explains that short gains may be conceded and says to use Get a Stop if a field goal can beat you.
- [ ] **Get a Stop** returns the recommendation to Cover 2 Invert Hard Flat in this setup.
- [ ] Return to Balanced. The original ranking and scores return.

These are explicit priorities you choose. The app does not read the scoreboard or calculate whether a field goal can beat you.

### Check 34 — Adjustments and long yardage respect the objective

Select **No Quick TD**:
- [ ] Open the formation's Adjustments tab. Its objective reads No Quick TD and prioritizes keeping deep help.
- [ ] It does not simultaneously tell you to play short routes or use aggressive underneath coverage.
- [ ] Change My Defensive User to **Defensive Line / Create Pressure**. Neither winner becomes a call with fewer than two validated deep defenders.
- [ ] Select **Get a Stop**, then **4th & Long**. The adjustments protect the line to gain; Get a Stop does not force a blitz or recommend underneath coverage on long yardage.

### Check 35 — Export, logging and reset behavior

- [ ] With No Quick TD selected, generate the Call Sheet and share/copy the plan. Both identify the objective and match the live personal calls.
- [ ] Open Test This Call from a coverage card. The popup shows **Objective: No Quick TD**.
- [ ] If recording sample tests, save the same call/situation once with No Quick TD and once with Get a Stop. Saved evidence keeps them in separate groups. Delete sample entries individually afterward.
- [ ] Open a different saved scouting profile, start new scouting, or build a fresh plan. Game Objective resets to Balanced.
- [ ] Refreshing the page also resets the live objective to Balanced; saved observations remain.
- [ ] Reopen the introductory guide. The scouting step mentions Game Objective.
- [ ] On a narrow screen, all three buttons and the selected explanation remain readable.

## What to send back

For a failure, send:
- the check number;
- a screenshot showing selected traits and down/distance, plus the result;
- playbook, offensive family, defensive formation/call, and My Defensive User settings;
- what you expected and what happened.

You can reply compactly:
“Checks 1–7 passed. Check 8: [problem]. Checks 9–35 passed.”

A ranking you disagree with is valuable football feedback even when the app behaves as coded. Include the offensive threat and the call you believe should be favored.

## Already checked automatically

The branch workflow runs the Node tests, production build, and focused lint. Regression tests cover score-ledger consistency, no catalog mutation, exact menu availability, overlapping traits, RPO branches, coverage support mappings, mixed-run choice/fallback behavior, and saved-context grouping.

You do not need to validate those internals manually. This checklist verifies the experience and football usefulness in the actual app.

## Items this review cannot close by itself

See [Critical/high roadmap status](CRITICAL_HIGH_ROADMAP_STATUS.md). Current plays.js count verification is complete based on owner confirmation. Full gap/RPO assignment ownership, broader offensive concepts, clock/score objectives, and gameplay-based scoring calibration remain open or partial. Passing these UI checks does not mark them complete.


## Update 23 — run/pass tendency, macros, and every formation

You can review the new changes with checks 36–45. Your earlier pass/fail results remain useful. [Research and reasoning](BIAS_MACRO_AUDIT_PHASE23.md) · [Every formation and known inventory gap](FULL_FORMATION_COVERAGE_PHASE23.md).

- [ ] **Check 36 — Slider meaning:** On Scout, find **Opponent Run / Pass Tendency**. Move through all seven buttons. The center says Balanced; the ends say Very pass-heavy and Very run-heavy. The short explanation describes the opponent, not your defensive style.
- [ ] **Check 37 — Calls respond:** Choose 11 personnel, Inside Zone / Power, Outside Runs / Sweeps, Quick Game / Bubble Screens, and Deep Shots / Verticals. Use All playbooks, a normal down, and Balanced objective. Build once at Very pass-heavy and again at Very run-heavy. Compare scores and coverage choices across 3-4 Tite, a Nickel front and a Dime/Dollar front. Several scores or calls should change. Every adjacent click need not change every winner. The formation report contains a reproducible engine example with 25 changed winners; your selected offensive family can change the exact winners.
- [ ] **Check 38 — Long-yardage protection:** With the same scout and Very run-heavy, set 4th & long. Best Overall and Best For You must retain deep help. Choose No Quick TD and a pressure preference: that combination must not select a zero-deep winner. Return to Balanced when finished.
- [ ] **Check 39 — Saved opponents:** Save a temporary opponent profile at Run-heavy. Change the slider to Pass-heavy, then load the saved opponent. It should restore Run-heavy. Export/import that profile and repeat. An older profile without a saved tendency should load at Balanced, rather than inherit another opponent's setting.
- [ ] **Check 40 — Problem-first macros:** Open Macro Builder. The how-to panel, introductory description, formation, base call and situation selectors are gone. Select inside run: DL Alignment should say Pinch. Select outside zone: it should say Spread. Each package has a short Use with condition and concrete adjustments.
- [ ] **Check 41 — Distinct coverage packages:** Compare quick game, deep shots, bunch and flood. Quick game uses short shading with a visible spot-drop/deep-help condition; deep shots use Overtop and deeper alignment; bunch uses Point Combo with a man-only condition; flood uses 25-yard flats, 5-yard curl flats and a separate underneath-player instruction. Do not apply the quick-game package on long yardage.
- [ ] **Check 42 — Search and browsing:** Search “read option,” “QB scramble,” and “bunch and mesh.” The leading answers should match the problems. “No screens” should not recommend a screen package; “no huddle” should find tempo help. Every category now includes all its problems, not just a few favorites.
- [ ] **Check 43 — Loadout, limits and persistence:** Build and copy a loadout. Settings, prerequisites, at-line actions and tradeoffs must match the cards. Reload: selected problems remain; the obsolete base-call selection has no effect. An 11th problem gives a clear remove-one-first message. Apply one suitable package at a time, not the entire sheet.
- [ ] **Check 44 — Other formations and playbooks:** Practice a suitable run and pass package in a 4-3 front, 3-4 front, Nickel and Dime/Dollar. Read Use with first: not every package fits every call. Verify the actual assignment after each change. Never apply the four-man stunt to a three-rusher call; do not apply man bunch checks to zone calls. Software coverage still includes all 71 inventories.
- [ ] **Check 45 — Test log and game practice:** Save the same call outcome at two different tendency settings. The Test This Call summary should keep them separate and show the tendency. Then build one ACTIVE package in the actual game using the listed settings. Practice the target concept AND the listed counter. Confirm that the menu choices exist on your build, assignments display correctly, and the coaching is easy to use. Record the patch, difficulty and actual adjustment applied.

The software checks cover all 71 inventories and every book, not just 4-3 Over Solid. These device checks assess presentation and actual game behavior; automated catalog checks cannot prove a macro defeats a concept in CFB 27. If a menu option is missing or a player reacts differently, send the formation, exact base call, package, game version and screenshot/video. Do not substitute a similarly named setting silently.


## Update 24 — compact defensive setup

### Check 46 — Three setup buttons, one row

- [ ] Only the generated plan shows **Playbook**, **My Defensive User**, and **Game Objective** in one evenly spaced row. Check desktop and phone-width screens: all three stay visible without horizontal scrolling, with compact padding and at least 44px tap height.
- [ ] Each button opens its own popup. Change the playbook, defender/call preference, and objective; the selected values appear on the buttons and still update recommendations.
- [ ] Scout has no three-button setup row; its original playbook picker remains in the top bar. Build the plan and select **No Quick TD** using its Game Objective popup.
- [ ] Close each popup using Done, the outside backdrop, and Escape. Keyboard Tab stays in the popup; closing returns focus to its button. Long popup content scrolls without moving the underlying page.
- [ ] The old stacked setup controls and inline objective description are gone. The plan's down/distance and formation information sit closer to the top.

Build and automated checks cover integration; the responsive appearance and popup interaction checks above still require device review.

## Update 25 — revised macros and clearer situation panel

Checks 40–44 above now describe the new problem-only workflow; prior base-call-selector instructions are superseded.

- [ ] **Check 47 — Run and option answers:** Compare Inside Power, Outside Zone, Counter/Trap, QB Sneak, Read Option and Speed Option. Look for pinch versus spread, patient versus downhill reaction, and separate read/pitch keys. These must not all show only Gap Integrity.
- [ ] **Check 48 — RPO and quarterback answers:** Glance shows RPO Pass Key + Inside leverage; bubble shows the pass key + shallow flats with a zone condition. Scramble shows QB Contain and a conditional QB Spy instruction at the line. The elite-WR package tells you to choose the actual receiver for a double team.
- [ ] **Check 49 — Readable cards:** The main card shows the adjustments, their conditions and the main counter. Your job & tradeoffs expands for more coaching. Compare the copied sheet with the card. Old saved macro formation/situation values must not hide these settings.
- [ ] **Check 50 — Down & Distance:** In both light and dark themes, the box has a soft green gradient and readable controls. Change 3rd & short to long and verify the normal recommendations still update. Formation/personnel now uses the compact expandable selector (see Check 51).

### Check 51 — Smooth formation/personnel selector

- [ ] On the plan page, Formation & Personnel shows the current offensive look and composition in one compact selector.
- [ ] Tap Formation & Personnel: all available options expand below the toolbar. Try a scout with seven or more options and a narrow phone screen. No labels should clip.
- [ ] Select another look: the header updates, recommendations update, and the list closes smoothly over about a third of a second, without disappearing in a flash.
- [ ] Reopen and close rapidly: the animation should reverse naturally without a jump or stale selection. Escape closes it; keyboard focus returns to its toolbar control without scrolling the page.
- [ ] When the device has reduced motion enabled, the selector opens/closes immediately. Closed options must not receive keyboard focus.

### Check 52 — Compact toolbar readability

- [ ] Down & Distance and Formation & Personnel occupy one row beneath the setup buttons. Both labels and selections are centered and bold; the green and blue accents remain readable in light and dark themes.
- [ ] Open each control. Only its choices should be available for keyboard interaction. Both lists open and close smoothly, with no duplicate selector farther down the page.
- [ ] Choose 3rd & Short, then 3rd & Long. Recommendations should update and the toolbar should show the correct selection. Base and Red Zone clear distance; Any keeps the down without assuming a distance.
- [ ] Check seven or more formation options on a phone-width screen. Long labels wrap rather than overlap the arrow or get cut off. Selecting a formation updates its label and personnel beneath it.

### Check 53 — Separate down and distance choices

- [ ] Toolbar is slightly shorter; Formation & Personnel is muted blue rather than gold. Labels remain centered and bold in both themes.
- [ ] Open Down & Distance: Base and 1st–4th are on the left; Any, Short, Mid, Long and Red Zone are on the right, with five buttons in each column. There is no full list of combinations.
- [ ] Choose 3rd, then Long. The panel stays open after choosing the down and closes smoothly after choosing distance. The header reads 3rd & Long.
- [ ] Reopen and switch to 4th: Long is preserved until you change it. Base and Red Zone clear distance. Their distance controls are disabled until a numbered down is chosen.


### Check 54 — Team color and quieter setup buttons

- [ ] Untouched setup buttons are white. Choose an option in each popup: that button stays gold after closing. Merely opening and closing an untouched popup does not mark it selected. Saved playbook/user choices stay highlighted after refresh; a new plan resets the objective.
- [ ] Choose teams with different colors. Team Info uses the selected team's color as a soft background tint, including a lighter tint inside its expanded panel. Check readability in light and dark themes.
- [ ] Red Zone is always available at the bottom of the right column, even from Base. Selecting it closes the panel, clears distance and displays Red Zone in the toolbar.


### Check 55 — Visible team outlines and two-column formations

- [ ] Compare Akron, Alabama and Appalachian State in both themes. Team Info has a visible outline on all sides when collapsed and around the full panel when expanded; the fill still follows the team color.
- [ ] Formation & Personnel opens in two equal columns, including with seven choices (four rows). Long labels wrap on a phone without overlapping. Selecting a look still updates recommendations and closes smoothly.
- [ ] Choose All Books or Balanced explicitly: these count as selections too and stay highlighted. Returning from another app tab preserves the selected highlights.


### Check 56 — Toolbar dividers and actual user changes

- [ ] Open either toolbar dropdown: a visible line separates the two header boxes from the choices. Down and Distance column headings also have a divider.
- [ ] Team Info borders are softer and the left edge slightly thinner, while remaining visible for Akron, Alabama and Appalachian State in both themes.
- [ ] An old saved default Linebacker profile alone must not make My Defensive User gold. Opening and closing the popup or tapping the unchanged default must not mark it changed.
- [ ] Change Linebacker to Safety: the top button stays gold after closing. Change back to Linebacker: it stays gold. Refresh: this actual change history is remembered. Changing call priority also counts.
