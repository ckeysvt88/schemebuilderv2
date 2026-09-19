import { assessConceptMatchups } from './conceptMatchup.js';

// Assignment-level guardrails. Counts are transcribed catalog evidence;
// penalties are provisional football judgments, never CFB success estimates.
export const PLAY_RULES = Object.freeze({
  noDeep: -12,
  deepShotsWithoutHelp: -20,
  mobileWithoutAssignment: -8,
  quickAgainstThinZonePressure: -8,
  quickAgainstManPressure: -6,
  crossingAgainstMan: -6,
});

export function threatProfile(traits = []) {
  const selected = new Set(traits);
  const has = (...ids) => ids.some(id => selected.has(id));
  return {
    deep: has('deep_shots', 'seam_routes'),
    mobile: has('mobile_qb', 'dual_threat', 'qb_scramble', 'option_run', 'triple_option'),
    quick: has('quick_game', 'rpo', 'screens', 'slant_heavy', 'west_coast'),
    crossing: has('crossers'),
    run: has('inside_run', 'outside_run', 'hb_stretch', 'counter_trap', 'fb_lead', 'option_run', 'triple_option'),
    rpo: has('rpo'),
    // A formation allows a concept; it does not establish its frequency.
  };
}

export function validPlayStructure(play) {
  if (!play) return false;
  const counts = ['rush', 'deep', 'und', 'man', 'spy', 'cont'].map(key => play[key]);
  return counts.every(n => Number.isInteger(n) && n >= 0)
    && play.rush + play.deep + play.und + play.man + play.spy === 11
    && play.cont <= play.rush;
}

export function assessPlay(play, threats = {}) {
  if (!validPlayStructure(play)) return null;
  const factors = [];
  const add = (id, label, reason) => factors.push({
    id: `play:${id}`, label, delta: PLAY_RULES[id], reason,
    basis: 'Real-football principle applied to catalog assignments; provisional weight',
  });
  if (play.deep === 0) {
    if (threats.deep) add('deepShotsWithoutHelp', 'Deep shots without deep help',
      'Scouted deep threats face no assigned deep-zone help. A beaten matchup can become an explosive play.');
    else add('noDeep', 'No deep-zone help',
      'No assigned deep-zone defender can rescue a beaten underneath or man matchup.');
  }
  if (threats.mobile && play.spy === 0 && play.cont === 0) {
    add('mobileWithoutAssignment', 'QB escape assignment missing',
      'A mobile/option QB is scouted, but this call has no catalogued spy or contain assignment. Ordinary rush lanes or user help may still defend the QB.');
  }
  if (threats.quick && play.rush >= 5) {
    if (play.man === 0 && play.und <= 3) add('quickAgainstThinZonePressure', 'Thin underneath zone pressure',
      'Five or more rushers leave at most three underneath zones against the scouted quick throw. Check the hot outlet before sending pressure.');
    else if (play.man >= 4 && play.und === 0) add('quickAgainstManPressure', 'Man pressure without underneath help',
      'The quick throw faces man pressure without an underneath-zone helper. Winning the rush does not guarantee it arrives before the throw.');
  }
  if (threats.crossing && play.man >= 4) add('crossingAgainstMan', 'Crossers against man assignments',
    'Scouted crossers can create traffic for man defenders. Leverage and switch checks are not represented in this catalog.');

  const facts = {
    rushers: play.rush, deep: play.deep, underneath: play.und,
    man: play.man, spy: play.spy, contain: play.cont, badge: play.badge, shell: play.shell,
  };
  const structure = `${play.rush} rush · ${play.deep} deep · ${play.und} underneath · ${play.man} man · ${play.spy} spy · ${play.cont} contain`;
  const support = [];
  if (play.deep > 0) support.push(`${play.deep} assigned deep-zone defender${play.deep === 1 ? '' : 's'} provide potential help; route distribution and leverage still matter.`);
  if (play.spy > 0) support.push('A true spy is assigned in this call. Its player, speed and pursuit still need verification.');
  if (play.cont > 0) support.push('Contain is assigned to rushers. This is not a true spy or a complete option fit.');
  if (play.rush <= 4) support.push('Four or fewer rushers retain more defenders for coverage or QB support; pressure arrival is unverified.');
  const unknowns = ['Exact zone locations, player matchups, protection and pressure arrival are not scored.'];
  if (play.badge === 'MATCH') unknowns.push('Match checks, motion responses and coaching-setting effects require in-game validation.');
  if (threats.run) unknowns.push('Run gaps and option dive/QB/pitch assignments are unknown; rusher count is not box count.');
  if (threats.rpo) unknowns.push('The RPO conflict defender and read-side leverage are unknown; this is not an RPO stop guarantee.');
  return {
    facts, structure, factors, support, unknowns,
    weaknesses: factors.map(f => f.reason),
    delta: factors.reduce((sum, f) => sum + f.delta, 0),
    // A catastrophic vulnerability cannot disappear behind family/tag bonuses.
    scoreCap: play.deep === 0 && threats.deep ? 35 : 100,
    evidence: 'Transcribed play inventory; not independent gameplay verification',
  };
}

export function unverifiedPlayAssessment() {
  return {
    status: 'unverified',
    facts: null,
    structure: 'Exact play assignments need verification.',
    factors: [],
    support: [],
    unknowns: ['Rushers, coverage responsibilities, spy and contain are withheld until this exact call is checked in CFB 27.'],
    weaknesses: [],
    delta: 0,
    scoreCap: 100,
    concept: null,
    evidence: 'Unverified play-art record; excluded from assignment and concept scoring',
  };
}

export function evaluateCoverage(coverage, play, traits, formationScore, evidence = null, situation = 'base', gameObjective = 'balanced', runPass = 4) {
  if (!evidence) {
    const concept = assessConceptMatchups(null, coverage.name, traits, situation, gameObjective, runPass);
    const sc = Math.max(0, Math.min(100, Math.round(formationScore * 0.35 + (concept?.utility ?? 50) * 0.65)));
    return { ...coverage, sc, gameObjective, matchup: { ...unverifiedPlayAssessment(), concept }, ledger: [
      { id: 'play:unverified', label: 'Coverage fit with unknown assignments', delta: sc - formationScore,
        reason: 'The same formation/threat blend applies to every call. Unknown assignments receive a neutral grade; coverage-family run support is retained.',
        basis: 'Common ordinal scoring scale; unknown does not mean safe' },
    ] };
  }
  const matchup = assessPlay(play, threatProfile(traits));
  if (!matchup) return null;
  const assignmentRaw = formationScore + matchup.delta;
  const concept = assessConceptMatchups(play, coverage.name, traits, situation, gameObjective, runPass);
  // Formation gets the defense on the field; the exact call must decide which
  // coverage wins. Weight the verified threat matchup more heavily so a strong
  // formation grade cannot hide a poor call against the selected concept.
  const blended = Math.round(assignmentRaw * 0.35 + (concept?.utility ?? 50) * 0.65);
  const conceptDelta = blended - assignmentRaw;
  const raw = assignmentRaw + conceptDelta;
  const sc = Math.max(0, Math.min(matchup.scoreCap, raw));
  return { ...coverage, sc, gameObjective, matchup: { ...matchup, status: 'verified', verification: evidence, concept }, ledger: [...matchup.factors,
    ...([{ id: 'concept:blend', label: `Threat/complement assessment (${concept?.utility ?? 50}/100)`, delta: conceptDelta,
      reason: `Game objective: ${gameObjective}. The ${situation} situation weights the scouted threats and includes a ${Math.round((concept?.riskWeight ?? 0) * 100)}% bad-case component.`,
      basis: concept?.evidence || 'Neutral threat baseline when no scenario is selected' }]),
    { id: 'play:bounds', label: matchup.scoreCap < 100 ? 'Deep-shot exposure cap (35)' : 'Play score bounds', delta: sc - raw }] };
}
