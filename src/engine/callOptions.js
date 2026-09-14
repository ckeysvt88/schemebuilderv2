import { COVERAGE_FLAGS } from '../data/coverageFlags.js';
import { getCoverageRunSupport, getRunDirections } from './coverageRunSupport.js';
import { normalizeUserProfile } from '../data/userProfile.js';

const QUICK_TRAITS = new Set(['rpo', 'quick_game', 'west_coast', 'screens', 'flat_attack', 'slant_heavy', 'qb_checkdown']);
const MOBILE_TRAITS = new Set(['option_run', 'mobile_qb', 'dual_threat', 'qb_scramble']);

const hasAny = (traits, set) => traits.some(trait => set.has(trait));

export const PERSONAL_CALL_WEIGHTS = Object.freeze({
  position: Object.freeze({
  middle: { mobile: 7, run: 3, quick: 1 },
  safety: { safe: 7, overall: 1 },
  slot: { quick: 7, pressure: 1 },
  line: { pressure: 7, run: 2 },
  }),
  style: Object.freeze({
  balanced: { overall: 5 },
  safe: { safe: 9 },
  pressure: { pressure: 9 },
  }),
  situation: Object.freeze({
    '3lg': { safe: 10 },
    '3sh': { run: 10, quick: 6 },
  }),
});

function personalFit(option, profile, situation, order) {
  const roles = option.optionRoles.map(role => role.id);
  const styleFit = Math.max(0, ...roles.map(role => PERSONAL_CALL_WEIGHTS.style[profile.callStyle]?.[role] || 0));
  const positionFit = Math.max(0, ...roles.map(role => PERSONAL_CALL_WEIGHTS.position[profile.position]?.[role] || 0));
  const situationFit = Math.max(0, ...roles.map(role => PERSONAL_CALL_WEIGHTS.situation[situation]?.[role] || 0));
  return { option, order, styleFit, positionFit, situationFit, total: styleFit + positionFit + situationFit };
}

function personalReason(fit, profile) {
  const roles = fit.option.optionRoles.map(role => role.id);
  const positionReason = {
    middle: roles.includes('mobile')
      ? 'It gives your Linebacker preference the menu’s best answer for quarterback movement.'
      : roles.includes('run')
        ? 'It fits your Linebacker preference by prioritizing the scouted run threat.'
        : '',
    safety: roles.includes('safe') ? 'It fits your Safety preference by keeping more help against the deep pass.' : '',
    slot: roles.includes('quick') ? 'It fits your Slot / Corner preference by prioritizing the quick-throw threat.' : '',
    line: roles.includes('pressure')
      ? 'It fits your Defensive Line preference by choosing the available call designed to hurry the quarterback.'
      : roles.includes('run')
        ? 'It fits your Defensive Line preference by prioritizing the scouted run threat.'
        : '',
  }[profile.position];
  const styleReason = profile.callStyle === 'safe' && roles.includes('safe')
    ? 'It also matches your Protect Explosives style.'
    : profile.callStyle === 'pressure' && roles.includes('pressure')
      ? 'It also matches your Create Pressure style.'
      : profile.callStyle === 'balanced' && roles.includes('overall')
        ? 'It is still the strongest all-around matchup.'
        : '';
  const situationReason = fit.situationFit > 0 && roles.includes('safe')
    ? 'The long-yardage priority is protecting the sticks and preventing the explosive pass.'
    : fit.situationFit > 0 && roles.includes('run')
      ? 'The short-yardage priority is fitting the run first.'
      : fit.situationFit > 0 && roles.includes('quick')
        ? 'The short-yardage priority includes the quick throw and RPO answer.'
        : '';
  const reasons = [positionReason, styleReason, situationReason].filter(Boolean);
  if (reasons.length) return reasons.join(' ');
  return 'A stronger alternative for your saved preferences is not supported in this formation, so stay with Best Overall.';
}

export function isPressureOption(call = {}) {
  const label = `${call.name || ''} ${call.tag || ''}`;
  return /pressure|all-out|\bblitz\b|\bfire\b|\bshoot\b|\bstorm\b|engage eight|gaps all/i.test(label);
}

function addRole(options, call, role) {
  if (!call) return;
  let option = options.find(item => item.name === call.name);
  if (!option) {
    option = { ...call, optionRoles: [] };
    options.push(option);
  }
  if (!option.optionRoles.some(item => item.id === role.id)) option.optionRoles.push(role);
}

function bestRunFit(calls, traits) {
  const { inside, outside } = getRunDirections(traits);
  if (!inside && !outside) return null;

  const fitValue = call => {
    const flags = getCoverageRunSupport(call.name);
    return (inside ? flags.fitIn || 0 : 0) + (outside ? flags.fitOut || 0 : 0);
  };
  return calls
    .map((call, order) => ({ call, order, fit: fitValue(call) }))
    .filter(item => item.fit > 0)
    .sort((a, b) => b.fit - a.fit || a.order - b.order)[0]?.call || null;
}

// Builds a short, evidence-gated call menu. These labels describe authored
// exact-call classifications; they do not infer rushers, run fits or user jobs
// from the formation shell.
export function buildCallOptions(rankedCalls = [], traits = [], situation = 'base', limit = 4, userProfile = {}) {
  if (!rankedCalls.length) return [];
  const options = [];

  addRole(options, rankedCalls[0], {
    id: 'overall',
    label: 'BEST OVERALL',
    reason: 'Best current fit in this formation for the scout and game situation.',
  });

  const deepHelp = rankedCalls.find(call => COVERAGE_FLAGS[call.name]?.longOK && !isPressureOption(call));
  addRole(options, deepHelp, {
    id: 'safe',
    label: situation === '3lg' ? 'PROTECT THE STICKS' : 'DEEP HELP',
    reason: situation === '3lg'
      ? 'Keep help over the top, defend the line to gain, and make the offense complete the checkdown.'
      : 'Use it when preventing the explosive pass matters more than squeezing the short throw.',
  });

  const pressure = rankedCalls.find(isPressureOption);
  addRole(options, pressure, {
    id: 'pressure',
    label: 'PRESSURE',
    reason: 'Use it when the quarterback is comfortable. The ball must come out faster, but a quick answer can punish the call.',
  });

  if (hasAny(traits, MOBILE_TRAITS)) {
    const mobile = rankedCalls.find(call => /spy|contain|vs mobile qb/i.test(`${call.tag || ''} ${call.name || ''}`));
    addRole(options, mobile, {
      id: 'mobile',
      label: 'QB CONTROL',
      reason: 'Use it when quarterback keeps, scrambles, or extended plays are the problem.',
    });
  }

  const runFit = bestRunFit(rankedCalls, traits);
  if (runFit) {
    const { inside, outside } = getRunDirections(traits);
    const direction = inside && outside ? 'inside and outside runs' : inside ? 'inside runs' : 'outside runs';
    addRole(options, runFit, {
      id: 'run',
      label: 'RUN-FIT ANSWER',
      reason: `Use it against ${direction}. ${[inside ? getCoverageRunSupport(runFit.name).inside : '', outside ? getCoverageRunSupport(runFit.name).outside : ''].filter(Boolean).join(' ')}`,
    });
  }

  if (hasAny(traits, QUICK_TRAITS)) {
    const quick = rankedCalls.find(call => /vs quick game|hard flat/i.test(`${call.tag || ''} ${call.name || ''}`));
    addRole(options, quick, {
      id: 'quick',
      label: 'QUICK-THROW ANSWER',
      reason: 'Use it when bubbles, quick outs, hitches, or slants are keeping the offense on schedule.',
    });
  }

  const profile = normalizeUserProfile(userProfile);
  const fitted = options.map((option, order) => personalFit(option, profile, situation, order));
  const playerFit = fitted.sort((a, b) => b.total - a.total || a.order - b.order)[0];
  const maxVisible = Math.max(1, limit);
  const visible = options.slice(0, maxVisible);
  if (playerFit && !visible.some(option => option.name === playerFit.option.name)) {
    visible.splice(visible.length - 1, 1, playerFit.option);
  }

  return visible.map(option => ({
    ...option,
    isPlayerChoice: option.name === playerFit?.option.name,
    playerChoiceReason: option.name === playerFit?.option.name ? personalReason(playerFit, profile) : '',
    personalFit: option.name === playerFit?.option.name ? {
      style: playerFit.styleFit,
      userPosition: playerFit.positionFit,
      situation: playerFit.situationFit,
      total: playerFit.total,
      basis: 'Authored preference weights; not a gameplay success probability.',
    } : null,
  }));
}
