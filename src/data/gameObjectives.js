// Explicit player objectives, not inferred score/clock or CFB success estimates.
export const GAME_OBJECTIVES = [
  { id: 'balanced', label: 'Balanced', text: 'Use the scout and down/distance to choose your call.' },
  { id: 'no_quick_td', label: 'No Quick TD', text: 'Protect against a quick touchdown, accepting short gains. If a field goal can beat you, choose Get a Stop.' },
  { id: 'get_stop', label: 'Get a Stop', text: 'You need the ball back. Defend the line to gain; do not give away a first down just to protect deep.' },
];
export const getGameObjective = id => GAME_OBJECTIVES.find(item => item.id === id) || GAME_OBJECTIVES[0];
