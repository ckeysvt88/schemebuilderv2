# Defensive setup implementation review

Release changes based on main `9ca82e415fdfe6763696869af85053778731fe97`.

## Behavioral changes

| Area | Previously | Updated |
|---|---|---|
| Setup evaluation | No dedicated Underneath shading effect | Bounded directional tradeoff; no stacking with active Zone Strategy |
| Starting look | Optional shell advice inferred from coverage family | Only existing authored starting geometry; unavailable evidence stays unknown |
| Variations | Response gain then same formation | Response gain then shared authored starting geometry, without relaxing eligibility |
| Pressure | Play Art conflict checks separate from evaluator | Shared stunt/contain compatibility; conflicting authored setup earns no extra contain credit |
| Responsibilities | Private assignment examples inside Play Art | Shared authored assignment source and counts; no receiver-specific man target inferred |
| Box/Bingo | Quadrant landmark without declaring obvious pickups | Clear single-route quadrant branches declare a match; overloaded reads stay unresolved |
| Zone It | Only followed defender's landmark | All participating zone areas visible; no receiver-match links |
| Appearance | Foreground could inherit surrounding preview styles | Explicit product foreground and light-mode action contrast |

Underneath effects are heuristic ranking points: quick/crossers +2, vertical -3, sideline -2; combined setup delta remains capped at ±4. These values are not calibrated game success rates. They do not change the assignment ledger or claim exact shading depth. A selected non-default Zone Strategy suppresses this additional shading effect to avoid correlated stacking.

Authored alignment evidence is limited to the existing nine call/formation pairs: Nickel Over (Sky, Tampa 2, Quarters), 4-3 Over Wide (same), 3-4 Over (Sky, Quarters), 3-3-5 Stack (Cover 3). Coordinates are schematic, not independent game validation. Alignment controls whose geometry is not modeled by the recommendation evaluator suppress the starting-look label. Custom Play Art uses its actual displayed coordinates. Four deep zones never imply four high safeties.

Contain compatibility requires the selected edges to rush and no conflicting stunt participants. Existing generic contain scoring remains for calls without authored art; it is not presented as geometry-verified. Macro editing does not automatically alter the planner or exported plan. PDF/live planning share setup evaluation; the PDF keeps its existing compact structure.

Box/Bingo declares a receiver only for an unambiguous quadrant in these scripted releases. Multiple routes entering one quadrant retain the read rather than guessing a game-specific exchange. Match teaching has offensive receivers; the separate macro builder does not.

## Validation

- Full Node regression suite: **294 passed, 0 failed**; includes setup, plan and animation regressions.
- All 626 supported visualizer scenarios and 7,128 defender/stage states checked in browser: assignment links, landmark ownership, finite geometry, fades and field reference.
- Dedicated browser checks passed across **24 theme/width/tab combinations**, without JavaScript errors: Bunch Tight Box corner takes #1 on inside-receiver-to-flat release; Zone It displays four areas and no match links; 320/390/740px in both themes; unsupported look, Quarters two-high/four-zone split, shading tradeoff, contain conflict and blank macro startup.
- Production Vite build and focused ESLint. Repository-wide legacy lint is outside this change's clean-lint claim.

## Source boundaries

Civil guides motivated the setup/pressure audit; official EA describes adjustment intent and match concepts. Neither establishes these numerical weights or every route exchange. Existing authored art is the only starting-look evidence used here. CFB26 techniques are not automatically promoted to verified CFB27 rules.

Mobile follow-up: two-column zone controls, no redundant change list, compact match field with collapsed key, and standard Rush defaults for LOS DL/edge players. Underneath/Overtop shading is persisted and transfers only to compatible LB Hook Curl positions. Numeric drops take priority.
