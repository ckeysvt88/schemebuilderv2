# Problem-first macros — update 25

## What changed

The macro screen no longer asks for formation, base call or situation. Its introductory description and how-to panel are removed. Search and category browsing lead directly to the existing 56 problems. Saved problem IDs remain compatible; the old saved base-call context is ignored.

The previous engine collapsed several run concepts into one gap-integrity rule. Missing call context also stopped it from returning settings. `macroRecipes.js` now gives every problem an explicit package: line alignment, run reaction, option/RPO keys, shading, leverage, corner/safety alignment, shells, man checks, coverage help and zone drops. Player-specific changes, directional guesses and optional stunts are separately labeled **At the line**.

Cards lead with **Use with**, numbered adjustments and **Watch for**. User coaching and individual tradeoffs are expandable. Export includes the same settings, conditions and at-line instructions. These are alternative packages, not instructions to stack all selected problems together.

## Accuracy boundaries

No formation or call is silently assumed. The visible prerequisite is essential: man checks need man coverage; layered flats need separate short/deep defenders; quick-zone changes need spot-drop coverage and deep help; a four-man stunt needs four rushing linemen. Saved adjustments do not create extra defenders. Run guesses and receiver reassignments require a decision at the line.

Optional exact-call validation remains in the engine for integrations and catalog regression checks. It rejects incompatible contexts instead of partially applying a coupled recipe. The problem-only screen does not run that validation on an unknown live play. It cannot determine whether your current game call meets the prerequisite. Recipes are starting points to practice, not verified universal counters.

Smart Zones and related substitute strategy settings are not added. No player role, updated rush count, or post-adjustment matchup score is invented.

## Sources reviewed September 19, 2026

- [EA gameplay deep dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay): official descriptions of alignment, leverage, coverage checks, receiver help and front controls establish available tools. Choosing when to use each is our football guidance, not an EA effectiveness claim.
- [EA Custom Adjustments help](https://help.ea.com/en/articles/ea-sports-college-football/custom-adjustments/): confirms saved packages and manual application. The app does not transfer them into the game.
- [EA September 3 update](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026): coverage/shell/zone-drop fixes mean launch-period observations must be rechecked on the current patch.
- [Civil's public macro guide](https://www.civil.gg/tips/best-defensive-macros-cfb-27): community-tested examples support separating a deeper cloud flat from a short underneath helper and restricting Texas stunts to suitable rush fronts. The 25/5-yard starting depths need route-depth tuning. The app does not promise a shutdown, copy unsupported strategy settings, or assign a universal slot-corner role. The written guide was reviewed; no new video playback is claimed.

## Validation

121 tests pass, including all 56 macros × 1,245 inventory plays × four contexts (278,880 checks). New checks cover problem-only output, meaningful differences between threats, unsupported-call rejection, prerequisites, exports and mutation safety. Every problem card was server-rendered with stale old context present: settings remain visible and removed controls are absent. Production build and focused lint pass. Browser interaction and in-game effectiveness still require device review.

## Plan-page presentation

Down & Distance now uses a soft green gradient and subtle green border derived from the current theme. Formation/personnel layout alternatives are review-only; that area has not changed in the app.
