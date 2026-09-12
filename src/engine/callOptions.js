import { COVERAGE_FLAGS } from '../data/coverageFlags.js';
import { normalizeUserProfile } from '../data/userProfile.js';

const QUICK_TRAITS = new Set(['rpo', 'quick_game', 'west_coast', 'screens', 'flat_attack', 'slant_heavy', 'qb_checkdown']);
const MOBILE_TRAITS = new Set(['option_run', 'mobile_qb', 'dual_threat', 'qb_scramble']);

const hasAny = (traits, set) => traits.some(trait => set.has(trait));

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
  const inside = traits.includes('inside_run');
  const outside = traits.includes('outside_run') || traits.includes('hb_stretch');
  if (!inside && !outside) return null;

  const fitValue = call => {
    const flags = COVERAGE_FLAGS[call.name] || {};
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
    const inside = traits.includes('inside_run');
    const outside = traits.includes('outside_run') || traits.includes('hb_stretch');
    const direction = inside && outside ? 'inside and outside runs' : inside ? 'inside runs' : 'outside runs';
    addRole(options, runFit, {
      id: 'run',
      label: 'RUN-FIT ANSWER',
      reason: `Use it when ${direction} are the offense's best answer.`,
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

  const visible = options.slice(0, Math.max(1, limit));
  const profile = normalizeUserProfile(userProfile);
  const preferredRole = profile.callStyle === 'safe' ? 'safe' : profile.callStyle === 'pressure' ? 'pressure' : 'overall';
  const playerCall = visible.find(option => option.optionRoles.some(role => role.id === preferredRole)) || visible[0];

  return visible.map(option => ({
    ...option,
    isPlayerChoice: option.name === playerCall.name,
    playerChoiceReason: option.name !== playerCall.name ? ''
      : preferredRole === 'safe' && option.optionRoles.some(role => role.id === 'safe')
        ? 'Matches your Protect Explosives style.'
        : preferredRole === 'pressure' && option.optionRoles.some(role => role.id === 'pressure')
          ? 'Matches your Create Pressure style.'
          : profile.callStyle === 'balanced'
            ? 'Matches your Balanced style.'
            : 'Your preferred style is not supported by this menu, so stay with Best Overall.',
  }));
}
