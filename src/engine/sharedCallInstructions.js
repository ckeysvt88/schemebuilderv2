// Presentation-only factoring. Calls and settings retain their original values.
// A common instruction applies only to this situation's complete call mix.
export function splitSharedCallInstructions(calls = []) {
  const setups = calls.map(call => [...new Set((call.quickSetup || '').split(' · ').map(s => s.trim()).filter(Boolean))]);
  const setup = calls.length > 1 ? setups[0].filter(s => setups.every(list => list.includes(s))) : [];
  const identical = key => calls.length > 1 && calls[0][key] && calls.every(call => call[key] === calls[0][key]) ? calls[0][key] : '';
  const sameSetting = (a, b) => ['setting', 'value', 'why', 'tradeoff'].every(key => a[key] === b[key]);
  const adjustmentSettings = calls.length > 1 ? (calls[0].adjustmentPlan?.settings || []).filter(item =>
    setup.includes(`${item.setting}: ${item.value}`) && calls.every(call => call.adjustmentPlan?.settings?.some(other => sameSetting(item, other)))) : [];
  const shared = { setup, userJob: identical('userJob'), watchFor: identical('watchFor'), adjustmentSettings };
  return { shared, calls: calls.map((call, i) => ({ ...call,
    localSetup: setups[i].filter(s => !setup.includes(s)),
    localUserJob: shared.userJob ? '' : call.userJob,
    localWatchFor: shared.watchFor ? '' : call.watchFor,
    localAdjustmentSettings: (call.adjustmentPlan?.settings || []).filter(item => !adjustmentSettings.some(other => sameSetting(item, other))),
  })) };
}

export const MIX_ROLE_LABELS = Object.freeze({ foundation: 'Foundation', 'coverage-variation': 'Variation', 'response-counter': 'Counter', 'conditional-pressure': 'Pressure', 'additional-variation': 'Extra variation' });
