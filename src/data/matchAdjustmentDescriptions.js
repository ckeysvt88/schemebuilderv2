import { getCheckOptions, OFFENSIVE_LOOKS, COVERAGE_CHECK_SOURCES } from './coverageChecks.js';

// Expanded original explanations grounded in the guide, EA/CollegeFootball.gg,
// existing role-resolution logic and owner-confirmed release exchanges.
// Combo follows the guide’s release exchange, not the article’s conflicting fixed swap.
// Stump intent follows EA; exact short-route ownership remains unspecified. Availability is controlled
// by the CFB-specific menus, never by the broader EA article's examples.
const descriptions = {
  lock: 'Each defender stays responsible for his assigned receiver, including when routes cross. There is no inside/outside exchange to avoid traffic; the defender must follow his receiver through it.',
  combo: 'Read #1 first. If #1 continues vertically or breaks outside, the corner stays with #1 and the other defender handles #2. If #1 breaks inside early, the corner takes #2 and the other defender picks up #1. A flat route by #2 alone does not force an exchange. Receiver numbers remain visible so you can track the change.',
  pointCombo: 'The point defender keeps #2. The corner reads #1: retain him on a vertical or outside release; exchange onto #3 when #1 breaks inside early. The hook then takes #1; otherwise the hook keeps #3. The locked point receiver is not part of that exchange. The example assumes the original point assignment has not been changed manually.',
  box: 'Four defenders sort the bunch by route direction: corner deep outside, safety deep inside, flat defender short outside, and hook defender short inside.\n\nThese are matching responsibilities, not four permanent spot-drop zones. In the all-vertical example, the corner takes #1, safety takes #2, and hook carries #3. Receiver movement determines the pickup.',
  bingo: 'Start with Box distribution. If #1 releases outside, the corner locks onto him and the other defenders distribute the remaining receivers. If #1 releases inside, the corner uses Box reads instead of treating him as a permanent man assignment.',
  skate: 'The underneath defenders expand toward bunch or trips. The outside defender handles the flat while the strong hook gains more depth and width to help with an outside high-low. Corners retain deep-third areas; this is a zone-spacing response rather than permanent man locks. The diagram keeps deep-middle help and shows the hook deeper than the flat. Exact drop distances and the opposite hook exchange are not simulated.',
  skinny: 'The corner carries the outside deep threat. The seam defender handles the #2 outside or vertical release, while the hook accounts for the route entering the #3 responsibility.\n\nFollow where the receivers finish their releases. If the original #3 releases outside and #2 crosses inside, the hook can take the crossing receiver rather than chase the original #3.',
  skinnyMeg: 'Use Skinny distribution on the multiple-receiver side. The backside corner has a different rule: stay with the isolated receiver on short routes as well as deep routes, rather than waiting for a vertical-route trigger.',
  stress: 'When all three trips receivers release vertically, the deep defenders protect spaced deep areas. When that condition is absent, use the regular Quarters reads. Selecting Stress does not convert every route combination into spot-drop coverage.',
  stubbie: 'The corner locks #1. The other defenders use ordered reads over #2 and #3: the overhang takes #3 when he releases to the flat; otherwise he takes #2 vertical or outside. When #2 breaks inside, the overhang passes that route toward the hook and settles outside.\n\nThe safety takes vertical #3. If #3 goes to the flat, the safety takes vertical #2 instead; without either vertical threat he retains a deep quarter. The hook takes quick-inside #3, or quick-inside #2 when #3 is not coming inside. Without that inside route he walls the threat and settles in the hook area. The corner lock stays separate. A backside running back creating a fourth strong-side receiver needs additional push rules outside this focused example.',
  stump: 'Stump uses a Stubbie foundation and adds help against short routes by #1. EA does not provide the complete defender exchange for that branch.',
  solo: 'On the isolated side, the corner follows the lone receiver. The safety can leave that side to help toward trips, including the strong-side #3 threat. The animation distinguishes that help from a guaranteed second man assignment.',
  soloCut: 'When the isolated receiver breaks short inside, the safety takes him and the corner becomes the helper toward trips. Other releases retain Solo behavior: corner on the isolated receiver, safety available to help away. The swap is conditional.',
  zoneIt: 'Stop matching receivers and defend the assigned coverage areas. In the animation, defenders move to zone landmarks and receivers can pass through without being carried as a man assignment. Zone bubbles indicate responsibilities, not hard boundaries.',
  seam: 'In Cover 3 Match, the corner carries a deep outside release and the seam defender takes #2 outside or vertical. The deep-middle defender retains his area. Underneath pickups follow the release distribution rather than a permanent pre-snap receiver number.',
  quarters: 'The corner handles #1 deep. The safety reads #2 vertically; if #2 goes short instead, an underneath defender takes that responsibility. Where a third receiver is involved, the hook accounts for #3. Exchanges follow the routes, not just starting alignment.',
  palms: 'The corner reads #2. When #2 breaks to the flat, the corner takes that route and the safety covers #1 deep. With both receivers vertical, corner carries #1 and safety carries #2. After the corner takes #2 outside, the safety owns #1 and the overhang settles in the flat. If #1 instead stays short while #2 is vertical, the overhang can collect #1 while the corner retains a deep quarter. Running-back side and any additional release affect the inside handoffs.',
};
// Inherited checks include their complete base explanation in the same panel.
const complete = {
  bingo: 'Read the bunch by release direction: corner handles deep outside, safety deep inside, flat defender short outside, and hook short inside. These are matching responsibilities, not permanent spot-drop assignments.\n\nBingo adds an exception for #1. If he stays outside, the corner locks him and removes him from the remaining exchange. If he releases inside, the corner reads deep outside again while the other defenders distribute the routes. With three verticals, the corner handles the outside receiver, safety the next inside vertical, and hook the innermost vertical.',
  skinnyMeg: descriptions.skinny + '\n\nThe backside corner stays locked to the isolated receiver on every route, including short routes. The deep-middle safety retains the Cover 3 middle area. That backside lock does not alter the release exchanges on the multiple-receiver side.',
  stress: 'Against three verticals, the corner and safety protect spaced deep quarters while the hook carries #3. This is a conditional response, not a whole-defense switch to spot drops.\n\nOn other releases, the corner reads outside vertical threats. The safety reads #2 first, then takes vertical #3 if #2 stays short. The overhang handles the outside short release; the hook accounts for the inside break. Thus #2 to the flat with #3 vertical leaves the overhang on #2 and safety on #3. Multiple short breaks and four-strong push exchanges require more context than this focused diagram shows.',
  stump: descriptions.stubbie + '\n\nEA describes Stump as a variation that adds help against short routes from #1. The base responsibilities above explain the starting structure; they are not a claim that every Stubbie assignment remains unchanged once #1 breaks short. EA does not identify the complete C/N/H pickup sequence. Examples with a short or nonvertical #1 are omitted until the assignments are confirmed. The available examples retain the supported Stubbie-based distribution.',
  soloCut: descriptions.solo + '\n\nSolo Cut changes the ownership when the isolated receiver breaks short inside: safety takes that receiver and corner becomes the helper toward trips. If the receiver stays vertical or does not trigger the short-inside break, corner keeps him and safety provides the help. The help landmark does not claim an automatic pickup of a specific trips receiver.',
};
export function getMatchAdjustmentDescription(scheme, look, check) {
  if (!getCheckOptions(scheme, look).includes(check)) return null;
  const type = OFFENSIVE_LOOKS.find(item => item.id === look)?.type;
  if (check === 'quarters' && type === 'single') return {
    text: 'The corner and safety both remain responsible on the isolated receiver’s side. Unlike Solo or Solo Cut, neither is freed to poach toward trips. The animation shows corner coverage with safety help; it does not imply a fixed double-team on every route.',
    source: 'CFB 27 guide summary', url: COVERAGE_CHECK_SOURCES.menus + '#page=6',
  };
  return descriptions[check] ? {
    text: complete[check] || descriptions[check],
    source: check === 'stump' ? 'EA Gameplay Deep Dive · Stump intent' : 'CollegeFootball.gg summary · CFB menu verified',
    url: check === 'stump' ? COVERAGE_CHECK_SOURCES.official : COVERAGE_CHECK_SOURCES.previous,
  } : null;
}
