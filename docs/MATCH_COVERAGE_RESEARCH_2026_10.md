# Match coverage research audit — October 24, 2026

Reviewed coverage research update. Publication authorized by the owner after local validation.

## Authority and scope

The owner's five screenshots define selectable CFB 27 checks. Website menu claims cannot add an option. Default values still use the prior Gaming Tailgate reference; screenshots confirm choices, not default behavior. The app's spread 2×2 view is explicitly base teaching, not another game menu. No Cover 2 Match menu or Middle Read changes were introduced.

Sixteen supplied written guides were reviewed. The supplied YouTube video could not be retrieved and has not been validated. EA's August 6 patch notes provided additional primary evidence about zone-only calls, press, shading and four-strong push interactions.

## Implemented differences

| Case | Previous behavior | Updated behavior |
|---|---|---|
| Combo, #1 vertical / #2 flat | Corner switched to #2 | Corner retains #1; partner takes #2 |
| Point Combo, #1 vertical / #3 flat | Corner switched to #3 | Corner retains #1; point stays locked; hook takes #3 |
| Stubbie, #2 inside / #3 vertical | Overhang took #3; safety unresolved | Safety takes #3; hook takes #2; overhang settles outside |
| Stress, #2 flat / #3 vertical | Hook carried #3 | Safety takes #3; overhang takes flat; hook retains support |
| Box/Bingo, no eligible flat route | Flat defender remained unresolved | Flat defender zones off; confirmed C1/S2/H3 vertical distribution retained |
| Skate | Corners carried receivers | Corners retain thirds; strong hook landmark is deeper than flat |
| Base Quarters/Palms, short #1 | #1 could appear unassigned | Overhang takes short #1 with #2 vertical |
| Palms flat trigger | Safety pickup required vertical #1 | Safety takes #1 after corner takes #2 outside |
| Cover 3 deep middle / Solo help | Some destinations were invisible | Explicit zone / fading dashed Help landmark |

These outcomes apply through shared rules, not team-specific exceptions. Exact route timing and yardage are illustrative.

## Planning and scoring

- A shared recommendation function validates coverage, alignment and check against the confirmed menu. Generic deep-zone counts do not establish match eligibility.
- Named Zone/Drop calls, Cover 9 and unconfirmed variants cannot borrow Cover 6 match rules.
- A supported Formation Check is retained at the front of the optional toolbox instead of disappearing at the eight-item limit.
- Regular Quarters trips advice is available. Deep-shot scouting can mention Stress conditionally but cannot prove three vertical releases.
- Several scouted alignment types are not treated as a single live formation.
- Automatic Underneath is suppressed when a supported match recommendation would make that combination misleading. Advice identifies press/shading interactions and Cover 6's relevant side.
- Match user coaching follows declared receivers rather than treating zone landmarks as hard stopping points.
- Palms' base flat-trap scoring advantage no longer carries into bunch/trips checks. Existing ordinal grades remain heuristics, not measured success rates.
- Optional checks receive zero numerical credit. A guide does not justify a blanket match bonus or prove defender ability, execution, exact routes or a measured win rate.

## Conflicts requiring owner review

1. **Stump: #1 drag, #2/#3 vertical.** Earlier description zones C/N; newer guide sends C to #2 but gives overlapping N/H instructions for the drag. EA is now the intent authority: extra help against short #1. Because EA does not name the complete exchange, the disputed C/N/H roles now remain explicit unresolved reads rather than asserted zone drops. Confirm the actual C/N/H/S pickups. Also test #1 hitch/quick-out with #2/#3 vertical.
2. **Skinny: #3 quick inside, #1/#2 vertical.** New guide's hook conditions differ from the owner's previous distributed-#3 pickup. Owner-confirmed behavior remains intact.
3. **Box/Bingo: three verticals.** Owner-confirmed C1/S2/H3 remains authoritative despite a guide describing a quick-inside-only hook rule.
4. **Skate post safety.** One guide labels a deep half while describing corners in thirds. Deep-middle behavior remains pending replay evidence.
5. **Man checks from Cover 2 Man.** Screenshots establish the man menu; guides demonstrate Cover 1. Existing supported options are preserved, but identical execution from Cover 2 Man is not independently established.

## Remaining model limits

The scene shows the relevant coverage group, not all eleven defenders. It does not model press, manual receiver overrides, applied shading, RB-side choice, four-strong push chains, late route double moves, wall contact, or intermediate timed handoffs. A no-duplicate-owner check is necessary but cannot establish gameplay accuracy. Ambiguous multiple routes in one Box lane remain reads. The model still uses scripted route endpoints for several checks; a complete release-event simulator requires further confirmed footage and inputs.

## Validation

Automated tests cover every supported built-in scheme/look/check/release combination for finite positions, valid receiver IDs, unique exclusive carries, continuous route movement and reversible reveal. Separate regressions assert the corrected assignments, exact screenshot menu choices, planner eligibility, optional-tool scoring isolation and Palms alignment scoring. Browser checks exercise selections, playback/scrubbing, flipped fields, all check types, disclosure behavior and mobile light/dark widths. Initial research validation: 335/335 full-suite tests passed; production build passed. The engine sweep covered 866 scripted combinations. Browser review exercised 108 selectable contexts spanning all 17 check types, five before/after cases, scrubbing and field flipping, and widths 320/390/720 in light and dark mode, with zero page errors or horizontal overflow. These checks do not claim exhaustive in-game validation.

## Sources

Availability: owner-provided in-game screenshots (October 24, 2026). Prior default reference: https://www.thegamingtailgate.com/CFB27DefensiveCoachAdjustmentsNew.pdf

Behavior guides (availability claims are not imported):

- https://manmatchmadden.substack.com/p/trips-check-how-skinny-works-in-madden
- https://manmatchmadden.substack.com/p/how-stress-works-in-madden-and-college
- https://manmatchmadden.substack.com/p/how-stubbie-works-in-madden-and-college
- https://manmatchmadden.substack.com/p/how-stump-works-in-madden-and-college
- https://manmatchmadden.substack.com/p/how-cover-4-palms-works-in-madden
- https://manmatchmadden.substack.com/p/how-cover-3-match-works-in-madden
- https://manmatchmadden.substack.com/p/how-cover-4-quarters-works-in-madden
- https://manmatchmadden.substack.com/p/how-cover-2-match-works-in-madden
- https://manmatchmadden.substack.com/p/bunch-check-how-skate-works-in-madden
- https://manmatchmadden.substack.com/p/bunch-check-how-box-works-in-madden
- https://manmatchmadden.substack.com/p/bunch-check-how-point-combo-works
- https://manmatchmadden.substack.com/p/bunch-check-how-bingo-works-in-madden
- https://manmatchmadden.substack.com/p/stack-check-how-combo-works-in-madden
- https://www.civil.gg/tips/cfb-27-complete-defense-guide
- https://ballknowerhq.com/coverages/match-coverage-terms-cfb-27/
- https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/
- https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026

Not reviewed due to retrieval failure: https://www.youtube.com/watch?v=flFikgISR_Q

## Follow-up: description presentation and EA Stump authority

The first Match Adjustment panel starts collapsed and uses the existing gold surface/border/text tokens in both themes. Stump references EA internally with no source link in the panel. Quarters/Palms/Cover 3 guides informed movement, eligibility and advice, with a targeted Palms alignment scoring correction. Cover 2 Match was reviewed as background; it did not create a new selectable check or numeric scoring rule. Match check selection currently uses the named coverage, one unambiguous bunch/stack/trips trait, and conditional deep-shot advice. Broader route tendencies affect call scoring but do not yet choose among all match-check alternatives.

The follow-up also fixes a UI omission: generated match checks now render within expanded call-mix cards and coaching details, not only the formation-detail toolbox. Their score effect remains zero unless explicitly modeled as applied settings.

## Follow-up: omit uncertainty and connect scouting to checks

Per owner direction, Stump examples with a nonvertical #1 are no longer offered or returned by the motion/assignment engine. They are not rendered as unresolved assignments. The selector falls back to an available supported example when changing from another check.

Check recommendations now use `flat_attack` versus `deep_shots`/`seam_routes`: Cover 3 bunch/trips may choose Skate for outside threats or Skinny for vertical threats; Cover 6 stack may use Palms on the match side for an outside tendency. This is an authored recommendation inference from documented responsibilities, not measured outcome data. Mixed threats retain the alignment baseline, broad quick-game/RPO/screens do not prove a quick-out #2, and crossing traits explain the traffic rationale for supported man exchanges. Stump/Bingo/MEG/Stress are not selected from traits that lack their specific trigger evidence. Optional checks continue to earn no scoring credit merely for being suggested.

Latest validation: 338/338 full-suite tests passed; production build passed. The supported animation sweep now contains 854 cases after excluding 12 unconfirmed Stump combinations. Browser checks confirmed omission and automatic selection of a supported release for Palms/Cover 6 in wide/tight trips, with no page errors. Tests demonstrate outside/vertical scouting produces different eligible checks, mixed tendencies stay cautious, and optional checks do not inflate scores.
