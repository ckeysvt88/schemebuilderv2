import { normalizeRunPass } from '../data/runPassBias.js';
import { getGameObjective } from '../data/gameObjectives.js';
import { getCoverageFamily } from './coverageGuidance.js';
import { normalizeSituation, coverageSituation } from './context.js';

const hasAny = (traits, ids) => ids.some(id => traits.includes(id));
const ZONE_FAMILIES = new Set(['quarters', 'split', 'tampa2', 'cover2', 'cover3']);
const TWO_HIGH_FAMILIES = new Set(['quarters', 'split', 'tampa2', 'cover2', 'twoMan']);

function situationContext(situation = {}) {
  const context = normalizeSituation(situation.down, situation.distance);
  return { context, key: coverageSituation(context) };
}

function objectiveFor(key) {
  if (key === '3lg') return {
    label: 'Protect the sticks',
    text: 'Keep every throw in front of the deep coverage. Make the offense catch it short and tackle before the line to gain.',
  };
  if (key === '3sh') return {
    label: 'Win the line to gain',
    text: 'The run, quarterback keep, RPO, and quick throw are all live. Keep the fit sound and close short windows without giving up a free shot.',
  };
  if (key === 'rz') return {
    label: 'Protect the goal line',
    text: 'The field is compressed. Tighten leverage, identify the best target, and do not create an uncovered receiver with extra adjustments.',
  };
  return {
    label: 'Stay balanced',
    text: 'Use the selected call as drawn, then make one change only when the scouting report points to a clear problem.',
  };
}

function presetMacroFor(traits, situationKey) {
  const quick = hasAny(traits, ['quick_game', 'west_coast', 'slant_heavy', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass', 'play_action']);

  if (traits.includes('screens')) return {
    setting: 'In-game preset', value: 'Defend Screen Pass',
    why: 'Use only after the offense has shown repeated receiver or running back screens.',
    tradeoff: 'Turn it off when the offense returns to its normal pass game.',
  };
  if (situationKey === '3lg' && deep) return {
    setting: 'In-game preset', value: 'No Deep Passes',
    why: 'Long yardage plus a vertical tendency makes the deep ball the first threat to remove.',
    tradeoff: 'Turn it off when the offense starts taking easy completions underneath.',
  };
  if (situationKey === '3sh' && quick) return {
    setting: 'In-game preset', value: 'Play Short Routes',
    why: 'Short yardage plus a quick-game tendency makes the catch point the line to defend.',
    tradeoff: 'Turn it off if the offense protects and sends routes behind the underneath coverage.',
  };
  if (hasAny(traits, ['mobile_qb', 'qb_scramble', 'dual_threat'])) return {
    setting: 'In-game preset', value: 'QB Scramble',
    why: 'Use when the quarterback keeps escaping or extending pass plays.',
    tradeoff: 'Turn it off if the quarterback stays in the pocket and attacks the extra attention around him.',
  };
  if (situationKey !== '3lg' && deep && !quick) return {
    setting: 'In-game preset', value: 'No Deep Passes',
    why: 'Use after the offense shows that vertical shots are its preferred answer.',
    tradeoff: 'Turn it off when the offense consistently takes the space underneath.',
  };
  if (situationKey !== '3lg' && quick && !deep) return {
    setting: 'In-game preset', value: 'Play Short Routes',
    why: 'Use after quick outs, hitches, slants, or RPO throws repeatedly move the chains.',
    tradeoff: 'Turn it off when the offense starts attacking behind the short coverage.',
  }
  return null;
}

function add(list, family, item) {
  if (!list.some(entry => entry.family === family)) list.push({ family, ...item });
}

function publicAdjustment(item) {
  return {
    setting: item.setting,
    value: item.value,
    why: item.why,
    tradeoff: item.tradeoff,
  };
}

function matchCheckFor(family, coverageName, traits) {
  const bunch = traits.includes('bunch');
  const stack = traits.includes('stack_align');
  const trips = traits.includes('trips');
  const palms = /Palms/i.test(coverageName);

  if (family === 'cover1' || family === 'twoMan') {
    if (bunch) return { value: 'Bunch — Point Combo', why: 'Let defenders exchange bunch releases instead of chasing through traffic.' };
    if (stack) return { value: 'Stack — Combo', why: 'Trade the two stacked releases so the offense cannot create an easy pick.' };
  }
  if (family === 'cover3') {
    if (bunch) return { value: 'Cover 3 Bunch — Skate', why: 'Widen the underneath defenders toward the bunch and the likely Flood release.' };
    if (stack) return { value: 'Cover 3 Stack — Combo', why: 'Exchange the stacked releases instead of letting them create traffic.' };
    if (trips) return { value: 'Cover 3 Trips — Skinny', why: 'Use the built-in trips distribution so #2 and #3 are not passed off blindly.' };
  }
  if (family === 'quarters' || family === 'split') {
    const prefix = family === 'split' ? 'Cover 6' : palms ? 'Palms' : 'Quarters';
    if (bunch) return { value: `${prefix} Bunch — Box`, why: 'Box the bunch with four defenders owning the four release directions.' };
    if (stack) return { value: `${prefix} Stack — Triangle`, why: 'Bracket two stacked receivers with three defenders and exchange releases.' };
    if (trips && palms) return { value: 'Palms Trips — Stubbie', why: 'Lock #1 while three defenders distribute #2 and #3.' };
    if (trips && family === 'split') return { value: 'Cover 6 Trips — Stubbie', why: 'Point the match side at trips and distribute #2 and #3 with inside help.' };
    if (trips) return { value: 'Quarters Trips — Stress', why: 'Use Stress only when trips repeatedly sends all three receivers vertical.' };
  }
  return null;
}

function shellTool(family) {
  if (['cover1', 'cover3'].includes(family)) return {
    setting: 'Coverage Shell', value: 'Show Cover 2',
    why: 'Hide the one-high rotation until the snap. The selected play still controls the post-snap coverage.',
    tradeoff: 'Confirm the defense actually aligns correctly; shell behavior can vary by play.',
  };
  if (TWO_HIGH_FAMILIES.has(family)) return {
    setting: 'Coverage Shell', value: 'Show Cover 3',
    why: 'Present one-high before rotating to the selected two-high call after the snap.',
    tradeoff: 'Do not sacrifice getting lined up just to disguise the call.',
  };
  return null;
}

function userKeyFor(traits, situationKey) {
  if (situationKey === '3lg') return {
    title: 'Guard the line to gain first',
    text: 'Gain depth with the first inside route, then break downhill. Do not chase a short route that cannot reach the sticks.',
  };
  if (situationKey === '3sh') return {
    title: 'Read run to quick throw',
    text: 'Stay square through the mesh, fit the run if the ball is handed off, and close the first inside throw if the quarterback pulls it.',
  };
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
  return {
    title: 'Protect your space first',
    text: 'Handle the threat entering your assignment before chasing another route. Make the quarterback hold the ball and throw outside.',
  };
}

function resetFor(item) {
  if (item.setting === 'Zone Strategy' && item.value === 'Aggressive') return {
    when: 'Routes start winning behind your zones',
    action: 'Set Zone Strategy to Default. If the deep shot becomes the main threat, use Conservative.',
  };
  if (item.setting === 'Zone Strategy' && item.value === 'Conservative') return {
    when: 'Short completions keep reaching the sticks',
    action: 'Set Zone Strategy to Default. Challenge the catch sooner without pulling away the deep help.',
  };
  const resets = {
    'Cornerback Depth': ['The cushion no longer fits the down', 'Return Cornerback Depth to Default, then set it for the new distance. Keep deep help against fast receivers.'],
    'Cornerback Width': ['The offense starts winning the opposite release', 'Return Cornerback Width to Default before changing leverage again.'],
    'Safety Depth': ['The deep threat stops and underneath gains hurt you', 'Return Safety Depth to Default. Keep the safeties in their coverage assignments.'],
    'Pass Commit': ['A draw or quarterback run beats the pass rush', 'Stop using Pass Commit on the next snap; keep the front ready for both run and pass.'],
    'Gap Integrity': ['The offense shifts away from the run', 'Return Gap Integrity to Balanced and reassess the passing threat.'],
    'Pass Rush': ['The quarterback stays in the pocket', 'If you applied QB Contain, reset the play before returning to its normal rush. Reapply any other adjustments you still need.'],
  };
  const reset = resets[item.setting];
  return reset ? { when: reset[0], action: reset[1] } : null;
}

export function buildAdjustmentPlan(fm, traits = [], situation = {}) {
  const activeCoverage = fm?.personalizedCoverage || fm?.recommendedCoverage || '';
  const selectedCall = fm?.rankedCoverages?.find(call => call.name === activeCoverage);
  const family = getCoverageFamily(activeCoverage, selectedCall?.tag);
  const isZone = ZONE_FAMILIES.has(family);
  const { context, key: situationKey } = situationContext(situation);
  const gameObjective = getGameObjective(fm?.gameObjective);
  if (gameObjective.id === 'no_quick_td') return {
    objective: { ...gameObjective, situation: context.label },
    settings: isZone ? [{ setting: 'Zone Strategy', value: 'Conservative', why: 'Keep zone defenders above developing routes before driving on the short throw.', tradeoff: 'Short gains may be available. Reconsider this objective if those gains put the offense in winning field-goal range.' }] : [],
    tools: shellTool(family) ? [shellTool(family)] : [],
    preset: null,
    alerts: [{ when: 'A field goal can beat you', action: 'Choose Get a Stop and defend the line to gain instead of conceding short gains.' }],
    userKey: { title: 'Keep the deep help intact', text: 'Leave the deep defenders in coverage. Play your own assignment first, then rally after the throw; do not pull a deep defender down to chase a short route.' },
  };
  const settings = [];
  const tools = [];
  const alerts = [];

  const quick = hasAny(traits, ['quick_game', 'west_coast', 'slant_heavy', 'qb_checkdown']);
  const deep = hasAny(traits, ['deep_shots', 'back_shoulder', 'seam_routes', 'two_minute_pass', 'play_action']);
  const insideBreaks = hasAny(traits, ['crossers', 'middle_heavy', 'slant_heavy', 'seam_routes']);
  const outsideBreaks = hasAny(traits, ['flat_attack', 'back_shoulder']);
  const runThreat = hasAny(traits, ['inside_run', 'outside_run', 'hb_stretch', 'counter_trap', 'fb_lead', 'option_run', 'strong_oline', 'run_heavy_1st', 'short_yardage_run']);
  const mobileQb = hasAny(traits, ['mobile_qb', 'qb_scramble', 'dual_threat', 'option_run']);
  const runHeavy = normalizeRunPass(fm?.runPass) >= 6;

  if (situationKey === '3lg') {
    if (isZone) add(settings, 'zone-depth', {
      setting: 'Zone Strategy', value: 'Conservative',
      why: 'Long yardage: zone defenders protect deeper routes before driving on the checkdown.',
      tradeoff: 'The offense can complete a short throw. Rally and tackle before the line to gain.',
    });
    if (deep) add(settings, 'safety-depth', {
      setting: 'Safety Depth', value: '16 yards',
      why: 'The scouting report includes vertical shots. Keep the safeties above seams and posts.',
      tradeoff: 'Safeties arrive later on underneath throws and the run.',
    });
    else add(settings, 'cb-depth', {
      setting: 'Cornerback Depth', value: '10 yards',
      why: 'Put the corners in position to see the route develop and protect the line to gain.',
      tradeoff: 'Quick hitches and outs will be available underneath.',
    });
    add(settings, 'commit', {
      setting: 'Pass Commit', value: 'Pass',
      why: 'On 3rd or 4th-and-long, ignore the run fake and attack the pass protection.',
      tradeoff: 'A draw or quarterback run can punish this. Skip it if the offense has already run successfully from long yardage.',
    });
  } else if (situationKey === '3sh') {
    add(settings, 'cb-depth', {
      setting: 'Cornerback Depth', value: '5 yards',
      why: 'Close the cushion so a hitch, slant, or quick out is contested near the line to gain.',
      tradeoff: 'Do not press a receiver who can win immediately deep without safety help.',
    });
    if (runThreat) add(settings, 'gap', {
      setting: 'Gap Integrity', value: 'Conservative',
      why: 'Short yardage plus a scouted run threat makes every defender holding his assigned gap more valuable than chasing a splash play.',
      tradeoff: 'Defenders are less likely to abandon their gap for an immediate shed.',
    });
    if (quick && isZone) add(settings, 'zone-depth', {
      setting: 'Zone Strategy', value: 'Aggressive',
      why: 'Drive on the short routes that can reach the line to gain immediately.',
      tradeoff: 'A protected double move or seam can open behind an underneath defender.',
    });
  } else if (situationKey === 'rz') {
    add(settings, 'cb-depth', {
      setting: 'Cornerback Depth', value: '5 yards',
      why: 'The field is compressed. Reduce free access without forcing every corner into press coverage.',
      tradeoff: 'Fast receivers can still threaten vertically; keep the selected call’s safety help intact.',
    });
    if (insideBreaks && !outsideBreaks) add(settings, 'cb-width', {
      setting: 'Cornerback Width', value: 'Tight',
      why: 'Take away the slant, glance, and short inside window near the goal line.',
      tradeoff: 'Quick outs and fades get more outside space.',
    });
    if (outsideBreaks && !insideBreaks) add(settings, 'cb-width', {
      setting: 'Cornerback Width', value: 'Wide',
      why: 'Make fades and quick outs release back toward inside help.',
      tradeoff: 'Slants get cleaner access inside.',
    });
  } else {
    if (isZone && deep && !quick) add(settings, 'zone-depth', {
      setting: 'Zone Strategy', value: 'Conservative',
      why: 'The opponent’s clearest passing tendency is vertical. Keep zone defenders above the deep route.',
      tradeoff: 'Short completions will have more room underneath.',
    });
    if (isZone && quick && !deep && !runHeavy) add(settings, 'zone-depth', {
      setting: 'Zone Strategy', value: 'Aggressive',
      why: 'The opponent’s clearest passing tendency is quick game. Break downhill on short routes.',
      tradeoff: 'Routes breaking behind the underneath defender become more dangerous.',
    });

  }

  if (situationKey === 'base' && isZone && quick && deep) add(settings, 'zone-depth', {
    setting: 'Zone Strategy', value: 'Default',
    why: 'Short throws and deeper routes are both scouted. Keep normal zone reactions until one starts beating this call.',
    tradeoff: 'Neither route depth gets extra attention. Use the optional counters after you identify the problem.',
  });
  if (situationKey === 'base' && runHeavy && runThreat) add(settings, 'gap', {
    setting: 'Gap Integrity', value: 'Conservative',
    why: 'You marked the opponent run-heavy. Keep defenders in their gaps before chasing the ball.',
    tradeoff: 'Fewer aggressive sheds; this does not add defenders to the box.',
  });
  if (situationKey === 'base' && runHeavy && isZone && quick && !deep) add(tools, 'zone-depth', {
    setting: 'Zone Strategy', value: 'Aggressive',
    why: 'Use only if the quick throw starts beating you despite the run-heavy tendency.',
    tradeoff: 'Deeper windows open behind defenders who drive on short routes.',
  });

  if (mobileQb) add(settings, 'contain', {
    setting: 'Pass Rush', value: 'QB Contain',
    why: 'Keep the outermost rushers outside the quarterback and force him to step up into traffic.',
    tradeoff: 'Contain protects the edge, not the middle. The user must still see the step-up or draw.',
  });

  const shell = shellTool(family);
  if (shell) add(tools, 'shell', shell);

  if (situationKey === '3lg' && deep) add(tools, 'cb-depth', {
    setting: 'Cornerback Depth', value: '10 yards',
    why: 'Add cushion if intermediate sideline routes are reaching the sticks before the corner can react.',
    tradeoff: 'Quick hitches and outs will be available underneath.',
  });

  if (insideBreaks && !outsideBreaks) add(tools, 'leverage', {
    setting: 'Coverage Leverage', value: 'Inside',
    why: 'Use after slants, digs, or crossers repeatedly win inside.',
    tradeoff: 'Outside-breaking routes get cleaner leverage.',
  });
  if (outsideBreaks && !insideBreaks) add(tools, 'leverage', {
    setting: 'Coverage Leverage', value: 'Outside',
    why: 'Use after outs, corners, or fades repeatedly win toward the sideline.',
    tradeoff: 'Inside-breaking routes get more room.',
  });

  if (insideBreaks !== outsideBreaks) add(tools, 'safety-width', {
    setting: 'Safety Width', value: insideBreaks ? 'Pinch' : 'Wide',
    why: insideBreaks
      ? 'Use after seams, posts, and crossers repeatedly attack between the safeties.'
      : 'Use after corner routes and deep sideline throws repeatedly stretch the safeties outside.',
    tradeoff: insideBreaks
      ? 'The deep sidelines receive less immediate safety help.'
      : 'The middle of the field receives less immediate safety help.',
  });

  if (traits.includes('field_hash') !== traits.includes('boundary_hash')) add(tools, 'midpoint', {
    setting: 'Safety Midpoint', value: traits.includes('field_hash') ? 'Field' : 'Boundary',
    why: `Lean the safeties toward the ${traits.includes('field_hash') ? 'wide side' : 'short side'} the offense prefers to attack.`,
    tradeoff: 'The opposite side receives less immediate safety help.',
  });

  if (/roll/i.test(activeCoverage) && (traits.includes('elite_te') || traits.includes('elite_wr'))) add(tools, 'target-help', {
    setting: 'Roll Coverage', value: traits.includes('elite_te') ? 'TE1' : 'Fastest',
    why: `Send extra help toward the ${traits.includes('elite_te') ? 'featured tight end' : 'speed threat'}.`,
    tradeoff: 'Receivers away from the roll receive less help.',
  });

  if (mobileQb && isZone) add(tools, 'plaster', {
    setting: 'Plaster', value: 'Conservative · O.O.P & Time',
    why: 'After the quarterback escapes and the play extends, backside zone defenders can attach to nearby receivers.',
    tradeoff: 'Coverage eventually leaves its original zone structure. Keep the conservative trigger until scramble-drill throws prove it is too slow.',
  });

  if (hasAny(traits, ['mobile_qb', 'dual_threat']) && traits.includes('option_run')) add(tools, 'option-key', {
    setting: 'Option Read Key', value: 'Conservative',
    why: 'Use after quarterback keeps are the option play’s winning answer; the read defender will focus the quarterback.',
    tradeoff: 'The dive handoff receives less attention. Do not use it merely because option exists in the playbook.',
  });

  if (traits.includes('rpo')) add(tools, 'rpo-key', {
    setting: 'RPO Pass Key', value: 'Conservative',
    why: 'Use after the attached RPO throw repeatedly beats your conflict defender; this tells him to favor pass coverage.',
    tradeoff: 'The run gap receives less help. If the offense starts handing it off, return to Balanced.',
  });

  const supportsMatchCheck = /match|quarters|palms|cover 6/i.test(activeCoverage) || ['cover1', 'twoMan'].includes(family);
  const matchCheck = supportsMatchCheck ? matchCheckFor(family, activeCoverage, traits) : null;
  if (matchCheck) add(tools, 'match-check', {
    setting: 'Formation Check', value: matchCheck.value,
    why: matchCheck.why,
    tradeoff: 'Use only with the named coverage family. A different call may use different rules.',
  });

  if (hasAny(traits, ['elite_wr', 'elite_te', 'slot_threat', 'crossers', 'screens'])) add(tools, 'individual', {
    setting: 'Individual Coverage', value: 'Man up the problem receiver',
    why: 'Use after one receiver or one repeated route—not merely the formation—has proven it can beat the call.',
    tradeoff: 'The assigned defender leaves his original job. Check the play art so his vacated area still has help.',
  });

  if (hasAny(traits, ['hurry_up', 'no_huddle', 'tempo_shift'])) alerts.push({
    when: 'The offense goes hurry-up',
    action: 'Keep the call and the first adjustment you trust. Get lined up before opening another menu.',
  });

  const changes = settings.filter(item => !['Default', 'Balanced', 'Normal'].includes(item.value));
  const visibleSettings = changes.slice(0, 3);
  // Settings beyond the quick-setup budget remain available; do not silently
  // lose QB contain or prescribe duplicate/conflicting controls in the toolbox.
  const displayedTools = [...changes.slice(3), ...tools].filter(item => !['Default', 'Balanced', 'Normal', 'Conservative · O.O.P & Time'].includes(item.value)).filter((item, index, all) =>
    !visibleSettings.some(current => current.family === item.family) &&
    all.findIndex(other => other.family === item.family) === index).slice(0, 8);
  const settingAlerts = visibleSettings.flatMap(item => {
    const note = resetFor(item);
    return note ? [{ setting: item.setting, ...note }] : [];
  });
  return {
    objective: { ...(gameObjective.id === 'balanced' ? objectiveFor(situationKey) : gameObjective), situation: context.label },
    settings: visibleSettings.map(publicAdjustment),
    tools: displayedTools.map(publicAdjustment),
    preset: presetMacroFor(runHeavy && situationKey === 'base' ? traits.filter(t => !['quick_game', 'west_coast', 'slant_heavy', 'qb_checkdown'].includes(t)) : traits, situationKey),
    alerts: [...settingAlerts, ...alerts].slice(0, 2),
    userKey: userKeyFor(traits, situationKey),
  };
}
