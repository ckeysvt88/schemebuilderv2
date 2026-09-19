# Run/pass tendency and Macro Builder audit — update 23

Historical update-23 audit: its macro UI and generic rules are superseded by [update 25](MACRO_RECIPES_PHASE25.md).

Reviewed September 15–19, 2026. Branch: `FootballEngineImprovements`.

## Findings and completed changes

| Finding | Change | Practical effect |
|---|---|---|
| Run/pass bias changed the formation prior but never the exact-call threat weights. Hybrid and pressure formations received no direct bias adjustment. | Pass the normalized tendency through the shared recommendation pipeline into concept scoring. | Calls within the same formation can change, including hybrid formations. |
| “Full Run” and “Full Pass” implied certainty. | Seven labels now range from Very pass-heavy to Very run-heavy. | Neither endpoint removes the other offensive answer. |
| Opponent saves contained traits but not bias; loading another opponent left stale bias in place. | Versioned profile saves include bias; old saves load at Balanced. | Saved/reloaded and exported/imported profiles retain the intended tendency. |
| Call tests could combine results recorded at different bias settings. | Log and group by bias; legacy missing values remain unknown. | Balanced, run-heavy, pass-heavy and old unknown observations stay separate. |
| Macros prescribed named players regardless of formation and mixed menu choices with coaching reminders. | All 56 problems now use a formation/base-call resolver tied to plays.js. | No fabricated slot corner, spy, ninth fitter or edge-zone assignment. |
| Soft Squat was treated as an edge/run-fit instruction; some macros promised automatic responses and guaranteed stops. | Replace legacy recipes with short goals, supported settings, manual coaching and tradeoffs. | The user learns the job without treating a pass-zone hot route as a run fit. |
| Search could recommend screens for “no screens”; vague tokens generated unrelated suggestions. | Exclude negated clauses, deduplicate terms, recognize specific football phrases, restrict weak matches. | “Read option,” “QB scramble,” “bunch and mesh,” and “no huddle” return relevant leading answers. |
| Corrupt saved data could crash selection; duplicate/unknown IDs consumed slots; the 11th addition failed silently. | Normalize saved IDs and give explicit capacity feedback. | Existing valid selections survive; the builder remains usable after bad storage/imported values. |
| Deeper problems were hidden from category browsing. | Browse every problem in all six categories. | Search is optional. |
| Export asserted that a launch-week bug remained current. | Remove the stale claim; export the same resolved instructions shown on the cards. | Ready packages and coaching-only notes are distinct; only ready packages receive ACTIVE numbers. |
| Three Single Mug spellings hid valid calls. | Use `Blitz Tex 3 Sim 3`, `Cov 3 Buzz Match Wk`, and `Cov 2 Invert Hard Flat` exactly as validated. | Those calls can enter recommendation scoring without changing their assignments. |

## How the slider now works

This is an opponent tendency, independent of **My Defensive User** and the explicit **Game Objective**. It is not a measured run percentage.

The normalized seven-step values are −1, −0.65, −0.30, 0, 0.30, 0.65, 1. Formation adjustments retain their existing bounded bonuses/penalties. Exact-call scenarios now use:

- Run scenario multiplier: `1 + 0.6 × bias`.
- Pass scenario multiplier: `1 − 0.6 × bias`.
- RPO conflict multiplier: `1` because either answer remains available.
- Existing down/distance and game-objective multipliers still apply; scenario weights are then normalized.
- A non-neutral tendency with no scouted concept receives a broad run or pass scenario. It does not invent inside/outside direction, motion, quarterback mobility or route combinations.
- The broad unknown-direction run retains a neutral grade. The broad pass grade balances the existing quick-pass and vertical structural assessments. Neither claims a specific concept was observed.

The 0.6 coefficient is a **provisional design weight**, not an EA mechanic or community-measured success rate. Deep-risk gates, personal score-loss limits and the bad-case component remain active. A run-heavy setting cannot override the long-yardage or No Quick TD selection safeguards. Rounding, equal matchup grades and safety filtering can correctly leave a call unchanged between adjacent settings.

The same normalized value reaches live cards, sharing and PDF output. Saves preserve it and test history distinguishes it.

## What the Macro Builder does

Choose a formation and exact base call available in the current playbook, then choose the offensive problem. This version prepares a loadout for that selected base call; changing it re-evaluates all selected plans. It does not send settings into the game, change a play's stored counts, or claim the original recommendation score measures the adjusted package.

Cards show **Goal**, **Save these settings**, **Your job**, and **Watch for**. Extra explanation and base-call counts are collapsed. Unchanged calls and coaching-only answers do not need a saved adjustment. Incompatible deep-help setups ask for a different base call rather than inventing defenders.

Long yardage blocks underneath shading and requires at least two deep defenders before a package is ready. Match calls do not receive blanket underneath shading. Bunch/stack man checks require a recognized man family and actual man assignments. Contain requires enough existing rushers. Run packages preserve the front until the user identifies the run direction; there is no universal pinch/spread or run commit.

Shell disguise, exact zone-drop depths, per-player reassignment and stunts are not blindly copied across every formation. Those can be valuable, but require role-level and on-device validation. This deliberately replaces the old unsupported universal recipes. The existing Adjustments toolbox remains separate.

## Research and evidence

These sources were cross-checked against the actual code. A database listing establishes availability; it does not prove a defensive behavior. A creator's tested setup remains a community observation. Promotional claims contradicted by the owner's game build are not reinstated.

| Source | Evidence type and finding | Decision |
|---|---|---|
| [EA Custom Adjustments help](https://help.ea.com/en/articles/ea-sports-college-football/custom-adjustments/) | **Confirmed EA workflow:** Create & Share setup; 20 saved per side, 10 active; manual selection; players must get set between packages. | Correct setup/export instructions and slot accounting. No automatic offense recognition. |
| [EA gameplay deep dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay) | **EA-described controls:** gap integrity, defensive aggression, leverage, coverage checks and custom packages. Gap discipline and quicker run reaction have different costs. | Separate run-gap discipline from chasing the fake. Do not treat aggression as a universal run-stop improvement. Smart Zones remain excluded per owner instruction. |
| [EA September 3 title update](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026) | **Confirmed patch notes:** fixes address shell application, cloud-flat drop behavior, Combo checks and custom zone-drop play art; wrong-direction press shading receives a greater penalty. | Remove the standing launch-bug warning. Require post-patch practice before making strong leverage or zone-depth claims. |
| [Civil — defensive macros](https://www.civil.gg/tips/best-defensive-macros-cfb-27) | **Community observation, video companion:** recipes have base-coverage/front prerequisites and user duties; some changes are explicitly outside the saved package. | Make the base call explicit. Do not transfer a four-lineman stunt or Tampa setup to every formation. Do not repeat “shuts down” guarantees. |
| [Civil — defensive tips](https://www.civil.gg/tips/best-defensive-tips-strategy-guide) | **Community observation:** short shading and option keys have specific purposes; man without appropriate deep help is vulnerable. The article covers both CFB and Madden. | Use conservative option/RPO keys only for the named problem. Restrict short shading; do not import every cross-title claim as confirmed CFB behavior. |
| [Civil — CFB 27 settings](https://www.civil.gg/tips/cfb-27-settings-you-need-to-change) | **Community observation:** warns about shell alignment in saved setups and emphasizes seeing the controlled defender's assignments. | Keep shell changes out of universal recipes. Later EA shell fixes mean this is a practice concern, not proof every current macro is broken. |
| [Madden Prodigy — Custom Adjustments setup](https://www.maddenprodigy.com/how-to-set-up-custom-adjustments-college-football-27/) | **Public community guide:** build around a defensive problem and distinguish general setup from tested exact recipes. Detailed member recipes were not accessed. | Organize by problem and base call; do not present inaccessible premium content as reviewed evidence. |
| [The Game Haus — Custom Adjustments](https://thegamehaus.com/gaming/how-to-use-new-custom-adjustments-in-college-football-27/2026/07/06/) | **Launch-period reporting:** explains saved/active packages and presets. | Secondary workflow corroboration, superseded by EA help where controls differ. |
| [CFB Labs playbooks](https://www.cfblabs.com/playbooks) and [CollegeFootball.gg playbooks](https://collegefootball.gg/playbooks/) | **Specialist catalogs:** formation/play lookup references. These landing pages do not verify all post-adjustment behaviors. | Retain the owner's validated plays.js counts as the catalog authority; do not infer new assignments from names alone. |

### Video access and limits

Civil's [defensive macro video](https://www.youtube.com/watch?v=7lne-xhhoHc) was located, and its detailed public companion guide above was reviewed. Direct playback/transcript retrieval was throttled; this audit does **not** claim to have watched the video. Other located leads included [AceMadden's coaching-adjustment video](https://www.youtube.com/watch?v=ku4G7IFn8kU) and [a Custom Adjustments setup video](https://www.youtube.com/watch?v=UA7K0_D9A28). Search descriptions alone were not used as proof of mechanics. No paywall was bypassed.

### Football principles versus game claims

Keeping an outside force defender, fitting the handoff separately from the RPO throw, preserving deep help, and passing off a crosser are coaching principles. They explain what the user is trying to accomplish; they do not guarantee the AI will execute it. The owner's established coverage-family run support remains in scoring: Quarters inside safety support, Cover 2 outside corner support, Cover 6 split support and Sky rotated-safety support. Counts do not identify every gap owner or receiver exchange.

## Full-catalog verification and remaining gaps

See [the formation-by-formation report](FULL_FORMATION_COVERAGE_PHASE23.md). All 1,245 validated inventory plays are evaluated. All 31 named playbooks plus All are checked across seven bias settings and five situation selections. Every macro is checked with every inventory play in four contexts. User selection safety is tested for all 12 position/style combinations and three objectives.

Prevent 3-Deep has no inventory. Five other curated call references remain absent from their formation's plays.js and are explicitly listed in the report; they stay excluded. No assignments were invented to fill those gaps. The three confirmed Single Mug spelling mismatches were corrected.

Automated checks establish joins, scoring invariants, persistence normalization, safety gates and instruction consistency. They do not establish game effectiveness. Browser automation could not run because the browser download timed out in this environment; all 117 regression tests, the production build, focused lint and server-render checks across all 71 inventory formations passed. Server rendering does not test browser clicks or layout; visual/device checks remain on the checklist.

## Game testing to perform

Use the same roster, formation, base call, game patch, difficulty and mode. Compare the base call against one package; repeat the target concept and its counter from both sides. Record the adjustment actually applied, user defender, yards/outcome and whether the art/assignment changed. Check option keys against both give and keep; check short shading against the double move; check contain against both rollout and inside escape. Do not call a package universally effective after one favorable snap.

Validation note: focused lint passed for the new/reworked modules. App and GamePlanScreen retain 23 pre-existing lint findings (unused variables, empty catches and state changes in effects); comparison with the starting commit found no new findings in the touched UI files. This update does not claim a clean repository-wide lint gate.
