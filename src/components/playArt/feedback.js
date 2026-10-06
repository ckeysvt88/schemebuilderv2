export function buildBugReportUrl(state, callName) {
  const assignments = Object.entries(state.a).map(([id, a]) => `${id}: ${a.job} (${a.area})`).join('; ');
  const settings = group => Object.entries(group).map(([key, value]) => `${key}: ${value}`).join(', ');
  const body = [
    'What went wrong?', '',
    'Steps to reproduce:', '1. ', '',
    'What did you expect?', '',
    'Please attach a screenshot if possible.', '',
    '--- Play Art Beta setup ---',
    `Formation: ${state.formation}`, `Base call: ${callName}`, `Diagram: ${state.view}`,
    `Stunt: ${state.stunt}`, `Alignment: ${settings(state.team)}`,
    `Zone drops: ${settings(state.zones)}`, `Defensive line: ${settings(state.front)}`,
    `Assignments: ${assignments}`,
  ].join('\n');
  return `mailto:help@schemebuilders.com?subject=${encodeURIComponent('Play Art Beta — Bug report')}&body=${encodeURIComponent(body)}`;
}
