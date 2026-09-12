import { getCoverageFamily } from './coverageGuidance.js';

const hasAny = (traits, ids) => ids.some(id => traits.includes(id));

function smartZonePlan(traits) {
  const quick = hasAny(traits, ['quick_game', 'rpo', 'screens', 'slant_heavy', 'flat_attack', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass']);

  if (quick && !deep) return {
    setting: 'Smart Zones', value: 'Aggressive',
    why: 'Closes faster on the quick throws this opponent prefers.',
    tradeoff: 'Deeper windows open behind underneath defenders.',
  };
  if (deep && !quick) return {
    setting: 'Smart Zones', value: 'Conservative',
    why: 'Keeps more depth against vertical routes and explosive throws.',
    tradeoff: 'Expect to concede short completions and rally to tackle.',
  };
  return {
    setting: 'Smart Zones', value: 'Balanced',
    why: quick && deep
      ? 'The offense threatens both quick throws and shots; do not tilt the whole defense toward one answer.'
      : 'Start sound and make the offense prove which area needs extra help.',
    tradeoff: 'Change it only after the same route family beats you more than once.',
  };
}

function userKeyFor(traits) {
  if (hasAny(traits, ['rpo', 'dual_threat', 'option_run'])) return {
    title: 'Slow-play the conflict',
    text: 'Stay square through the mesh. Force the handoff or throw, then commit—chasing too early gives the quarterback the answer.',
  };
  if (hasAny(traits, ['mobile_qb', 'qb_scramble'])) return {
    title: 'Keep the quarterback boxed in',
    text: 'Take away the escape lane first. Close only after he commits outside or crosses the line of scrimmage.',
  };
  if (hasAny(traits, ['crossers', 'middle_heavy', 'slant_heavy'])) return {
    title: 'Protect the inside window',
    text: 'Wall the first inside break and make the quarterback throw around you. Do not chase a shallow route out of the middle.',
  };
  if (hasAny(traits, ['screens', 'quick_game', 'flat_attack'])) return {
    title: 'Trigger, then tackle outside-in',
    text: 'Read the release before attacking the flat. Keep outside leverage so a short completion does not become an explosive play.',
  };
  if (hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes'])) return {
    title: 'Stay deeper than the deepest threat',
    text: 'Do not jump the first underneath route. Make the offense complete the short throw and tackle it in front of you.',
  };
  return {
    title: 'Protect your leverage',
    text: 'Start inside, keep the ball in front, and make the offense complete the harder throw outside.',
  };
}

export function buildAdjustmentPlan(fm, traits = []) {
  const selectedCall = fm?.rankedCoverages?.find(call => call.name === fm?.recommendedCoverage);
  const family = getCoverageFamily(fm?.recommendedCoverage || '', selectedCall?.tag);
  const isZone = ['quarters', 'split', 'tampa2', 'cover2', 'cover3'].includes(family);
  const settings = [];
  const alerts = [];

  if (isZone) settings.push(smartZonePlan(traits));

  if (isZone && hasAny(traits, ['mobile_qb', 'qb_scramble', 'dual_threat'])) {
    settings.push({
      priority: 90,
      setting: 'Plaster', value: 'Conservative · Out of Pocket + Time',
      why: 'Adds scramble-drill help after the quarterback extends the play.',
      tradeoff: 'Keeps the original zone intact longer before defenders attach to receivers.',
    });
  }

  if (traits.includes('redzone_spec') && isZone) {
    settings.push({
      priority: 100,
      setting: 'Red Zone Awareness', value: 'On',
      why: 'Improves zone spacing when the field is compressed near the goal line.',
      tradeoff: 'Use it in the red zone; return to your normal plan outside it.',
    });
  } else if (traits.includes('elite_te')) {
    settings.push({
      priority: 70,
      setting: 'Roll Coverage', value: 'TE1',
      why: 'Leans help toward the tight end instead of asking one defender to win alone.',
      tradeoff: 'The opposite side receives less help.',
    });
  } else if (traits.includes('elite_wr')) {
    settings.push({
      priority: 70,
      setting: 'Roll Coverage', value: 'Fastest',
      why: 'Leans help toward the receiver most likely to create an explosive play.',
      tradeoff: 'The opposite side receives less help.',
    });
  }

  if (traits.includes('play_action')) {
    settings.push({
      priority: 100,
      setting: 'Defensive Aggression', value: 'Conservative',
      why: 'Keeps linebackers more patient against run action and underneath play-action routes.',
      tradeoff: 'They will trigger downhill more slowly against the handoff.',
    });
  } else if (hasAny(traits, ['short_yardage_run', 'p22', 'p23']) && !hasAny(traits, ['deep_shots', 'rpo'])) {
    settings.push({
      priority: 90,
      setting: 'Defensive Aggression', value: 'Aggressive',
      why: 'Gets second-level defenders downhill faster against a confirmed heavy run threat.',
      tradeoff: 'Higher play-action risk; reset it when the offense spreads out.',
    });
  }

  if (traits.includes('bunch')) {
    alerts.push({
      when: 'If you call man against bunch',
      action: 'Use Point Combo so defenders can exchange crossing releases. Use Lock only when you want everyone to chase his original man.',
    });
  } else if (traits.includes('stack_align')) {
    alerts.push({
      when: 'If you call man against a stack',
      action: 'Use Combo so the two defenders can exchange releases instead of fighting through traffic.',
    });
  }

  if (traits.includes('inside_run') && traits.includes('outside_run')) {
    alerts.push({
      when: 'When the run direction changes',
      action: 'Return the front to normal. Do not leave it pinched or spread based only on the scouting report.',
    });
  }

  if (hasAny(traits, ['hurry_up', 'no_huddle', 'tempo_shift'])) {
    alerts.push({
      when: 'If the offense goes fast',
      action: 'Keep the base call and one adjustment you trust. Skip extra menu changes and get aligned first.',
    });
  }

  return {
    settings: settings
      .map((item, order) => ({ priority: item.priority ?? 80, order, ...item }))
      .sort((a, b) => b.priority - a.priority || a.order - b.order)
      .slice(0, 3)
      .map(item => ({
        setting: item.setting,
        value: item.value,
        why: item.why,
        tradeoff: item.tradeoff,
      })),
    alerts: alerts.slice(0, 2),
    userKey: userKeyFor(traits),
  };
}
