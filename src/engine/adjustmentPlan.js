import { getCoverageFamily } from './coverageGuidance.js';

const hasAny = (traits, ids) => ids.some(id => traits.includes(id));

function presetMacroFor(traits) {
  const quick = hasAny(traits, ['quick_game', 'rpo', 'screens', 'slant_heavy', 'flat_attack', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass']);

  if (traits.includes('screens')) return {
    priority: 96,
    setting: 'In-game preset', value: 'Defend Screen Pass',
    why: 'Use this after the offense shows repeated receiver or running back screens.',
    tradeoff: 'Do not leave it on when the offense returns to its normal pass game.',
  };
  if (hasAny(traits, ['mobile_qb', 'qb_scramble', 'dual_threat'])) return {
    priority: 95,
    setting: 'In-game preset', value: 'QB Scramble',
    why: 'Use this when the quarterback keeps escaping the pocket or extending pass plays.',
    tradeoff: 'The defense gives extra attention to the quarterback, so watch the throws he creates around it.',
  };
  if (deep && !quick) return {
    priority: 94,
    setting: 'In-game preset', value: 'No Deep Passes',
    why: 'Use this when the offense is repeatedly taking vertical shots.',
    tradeoff: 'Be ready to rally to checkdowns and underneath throws.',
  };
  if (quick && !deep) return {
    priority: 94,
    setting: 'In-game preset', value: 'Play Short Routes',
    why: 'Use this when quick outs, hitches, slants, or RPO throws keep moving the chains.',
    tradeoff: 'Do not overplay the short throw if the offense starts taking shots behind it.',
  };
  return null;
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
  if (hasAny(traits, ['outside_run', 'hb_stretch'])) return {
    title: 'Set the edge',
    text: 'Keep your outside shoulder free and turn the runner back toward the rest of the defense. Do not chase inside and give up the sideline.',
  };
  if (hasAny(traits, ['inside_run', 'counter_trap', 'fb_lead', 'strong_oline', 'run_heavy_1st', 'short_yardage_run'])) return {
    title: 'Fit your gap first',
    text: 'Stay in your assigned gap and make the runner change direction. Do not chase into another defender’s gap and open a cutback lane.',
  };
  return {
    title: 'Keep inside position',
    text: 'Line up between your receiver and the ball. Make the quarterback throw outside instead of giving him an easy throw through the middle.',
  };
}

export function buildAdjustmentPlan(fm, traits = [], situation = {}) {
  const activeCoverage = fm?.personalizedCoverage || fm?.recommendedCoverage;
  const selectedCall = fm?.rankedCoverages?.find(call => call.name === activeCoverage);
  const family = getCoverageFamily(activeCoverage || '', selectedCall?.tag);
  const isZone = ['quarters', 'split', 'tampa2', 'cover2', 'cover3'].includes(family);
  const settings = [];
  const alerts = [];

  const presetMacro = presetMacroFor(traits);

  const quick = hasAny(traits, ['quick_game', 'rpo', 'slant_heavy', 'flat_attack', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass']);
  const insideBreaks = hasAny(traits, ['crossers', 'middle_heavy', 'slant_heavy']);
  const outsideBreaks = hasAny(traits, ['flat_attack', 'back_shoulder']);
  const runThreat = hasAny(traits, ['inside_run', 'outside_run', 'hb_stretch', 'counter_trap', 'fb_lead', 'option_run', 'strong_oline', 'run_heavy_1st', 'short_yardage_run']);
  const mobileQb = hasAny(traits, ['mobile_qb', 'qb_scramble', 'dual_threat', 'option_run']);

  if (mobileQb) {
    settings.push({
      priority: 84,
      setting: 'Pass Rush', value: 'QB Contain',
      why: 'Keep the outside rushers wider so the quarterback has to step up instead of escaping around the edge.',
      tradeoff: 'Contain does not close the middle by itself. The user still has to see the quarterback step up.',
    });
  }

  if (runThreat) {
    settings.push({
      priority: 82,
      setting: 'Gap Integrity', value: 'Conservative',
      why: 'Keep every defender responsible for his run fit and make the ball cut back toward help.',
      tradeoff: 'You may get fewer instant sheds outside the assigned gap.',
    });
  }

  if (isZone && quick && !deep) {
    settings.push({
      priority: 78,
      setting: 'Coverage', value: 'Underneath',
      why: 'Drive on the short routes the offense keeps using to stay on schedule.',
      tradeoff: 'Watch for a double move or route breaking behind the underneath defender.',
    });
  } else if (isZone && deep && !quick) {
    settings.push({
      priority: 78,
      setting: 'Coverage', value: 'Over the top',
      why: 'Make the quarterback complete the checkdown instead of winning with a vertical shot.',
      tradeoff: 'Short routes will have more room before the defense rallies.',
    });
  } else if (!isZone && insideBreaks && !outsideBreaks) {
    settings.push({
      priority: 78,
      setting: 'Coverage leverage', value: 'Inside',
      why: 'Take away the first inside break on slants, digs, and crossers.',
      tradeoff: 'Outside-breaking routes get cleaner access to the sideline.',
    });
  } else if (!isZone && outsideBreaks && !insideBreaks) {
    settings.push({
      priority: 78,
      setting: 'Coverage leverage', value: 'Outside',
      why: 'Make outside-breaking routes work back through the defender instead of winning cleanly to the sideline.',
      tradeoff: 'Inside-breaking routes have more room if there is no help waiting there.',
    });
  }

  if (traits.includes('field_hash') && !traits.includes('boundary_hash')) {
    settings.push({
      priority: 72,
      setting: 'Safety Midpoint', value: 'Field',
      why: 'Lean the safety alignment toward the wide side where the offense has more space.',
      tradeoff: 'The boundary side has less immediate safety help.',
    });
  } else if (traits.includes('boundary_hash') && !traits.includes('field_hash')) {
    settings.push({
      priority: 72,
      setting: 'Safety Midpoint', value: 'Boundary',
      why: 'Lean the safety alignment toward the short side the offense prefers to attack.',
      tradeoff: 'The wide side has less immediate safety help.',
    });
  }

  if (situation?.down === 'rz' && isZone) {
    settings.push({
      priority: 100,
      setting: 'Red Zone Awareness', value: 'On',
      why: 'You are in the red zone. This helps zone defenders tighten up as the field gets shorter.',
      tradeoff: 'Turn it back off when the drive leaves the red zone.',
    });
  } else if (traits.includes('elite_te')) {
    settings.push({
      priority: 70,
      setting: 'Roll Coverage', value: 'TE1',
      why: 'You marked an elite tight end. Make the coverage lean toward him instead of leaving one defender alone.',
      tradeoff: 'Receivers away from the tight end get less safety help.',
    });
  } else if (traits.includes('elite_wr')) {
    settings.push({
      priority: 70,
      setting: 'Roll Coverage', value: 'Fastest',
      why: 'You marked an elite speed threat. Make the coverage lean toward the fastest receiver.',
      tradeoff: 'The rest of the formation gets less safety help.',
    });
  }

  if (traits.includes('play_action')) {
    settings.push({
      priority: 100,
      setting: 'Defensive Aggression', value: 'Conservative',
      why: 'You marked play action. This keeps linebackers from charging at the run fake and opening a throw behind them.',
      tradeoff: 'Linebackers will attack real handoffs more slowly.',
    });
  } else if (situation?.distance === 'short' && hasAny(traits, ['short_yardage_run', 'p22', 'p23']) && !hasAny(traits, ['deep_shots', 'rpo'])) {
    settings.push({
      priority: 90,
      setting: 'Defensive Aggression', value: 'Aggressive',
      why: 'It is short yardage and you marked a heavy run threat. Linebackers will attack downhill sooner.',
      tradeoff: 'Play action can open a large throwing window behind them. Reset it after short yardage.',
    });
  }

  if (traits.includes('redzone_spec') && situation?.down !== 'rz') {
    alerts.push({
      priority: 90,
      when: 'The ball enters the red zone',
      action: 'Turn Red Zone Awareness on for zone calls. Turn it off again when the drive leaves the red zone.',
    });
  }

  if (traits.includes('short_yardage_run') && situation?.distance !== 'short') {
    alerts.push({
      priority: 85,
      when: 'It becomes 3rd/4th-and-short',
      action: 'If the offense shows heavy personnel, use Aggressive defensive behavior. Reset it when normal down-and-distance returns.',
    });
  }

  if (traits.includes('inside_run') && traits.includes('outside_run')) {
    alerts.push({
      priority: 70,
      when: 'The offense changes where it is running',
      action: 'Return the defensive line to normal. Do not leave the line pinched or spread because both runs appeared in the scout.',
    });
  }

  if (hasAny(traits, ['hurry_up', 'no_huddle', 'tempo_shift'])) {
    alerts.push({
      priority: 100,
      when: 'The offense goes hurry-up',
      action: 'Keep the base call and one adjustment you trust. Get lined up before trying another menu change.',
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
    preset: presetMacro ? {
      setting: presetMacro.setting,
      value: presetMacro.value,
      why: presetMacro.why,
      tradeoff: presetMacro.tradeoff,
    } : null,
    alerts: alerts
      .map((item, order) => ({ priority: item.priority ?? 80, order, ...item }))
      .sort((a, b) => b.priority - a.priority || a.order - b.order)
      .slice(0, 2)
      .map(item => ({ when: item.when, action: item.action })),
    userKey: userKeyFor(traits),
  };
}
