import { getCoverageFamily } from './coverageGuidance.js';

const hasAny = (traits, ids) => ids.some(id => traits.includes(id));

function smartZonePlan(traits) {
  const quick = hasAny(traits, ['quick_game', 'rpo', 'screens', 'slant_heavy', 'flat_attack', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass']);

  if (quick && !deep) return {
    setting: 'Smart Zones', value: 'Aggressive',
    why: 'You marked quick throws and screens. This tells zone defenders to drive on those routes sooner.',
    tradeoff: 'Routes behind the underneath defenders will open sooner.',
  };
  if (deep && !quick) return {
    setting: 'Smart Zones', value: 'Conservative',
    why: 'You marked deep shots or seams. This keeps zone defenders from jumping the short throw too soon.',
    tradeoff: 'The offense will get more room for checkdowns and short completions.',
  };
  return {
    setting: 'Smart Zones', value: 'Balanced',
    why: quick && deep
      ? 'You marked both quick throws and deep shots. Stay balanced instead of opening one area to stop the other.'
      : 'Start at the normal setting and make the offense show you what it wants to repeat.',
    tradeoff: 'Balanced will not jump short routes or carry deep routes as aggressively.',
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
      why: 'You marked a scrambling quarterback. Defenders can find nearby receivers after the quarterback breaks the pocket.',
      tradeoff: 'Coverage stays in its original zone longer, so the quarterback may still have room to run.',
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
    alerts: alerts
      .map((item, order) => ({ priority: item.priority ?? 80, order, ...item }))
      .sort((a, b) => b.priority - a.priority || a.order - b.order)
      .slice(0, 2)
      .map(item => ({ when: item.when, action: item.action })),
    userKey: userKeyFor(traits),
  };
}
