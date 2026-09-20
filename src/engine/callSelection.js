import { buildCallOptions } from './callOptions.js';
import { assessPersonalChoice, selectOverallCall } from './personalizationSafety.js';

// One selection boundary for live cards, adjustments, sharing and the call sheet.
// An absent eligible choice is not permission to restore a rejected first call.
export function selectFormationCalls(rankedCalls, traits = [], situation = 'base', userProfile = {}) {
  const best = selectOverallCall(rankedCalls, traits, situation);
  if (!best) return null;
  const callOptions = buildCallOptions(rankedCalls, traits, situation, 4, userProfile);
  const playerCall = callOptions.find(call => call.isPlayerChoice);
  if (!playerCall || !assessPersonalChoice(playerCall, best, traits, situation).eligible) return null;
  return { best, callOptions, playerCall };
}
