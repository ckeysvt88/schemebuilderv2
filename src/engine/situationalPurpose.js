import { normalizeSituation, coverageSituation } from './context.js';
import { getGameObjective } from '../data/gameObjectives.js';

// Authored priorities, not offensive frequencies. Preserve the existing modest
// formation modifiers; exact call/threat evaluation still decides the winner.
const RULES = {
  '1_short': ['Win the next gain', 'Fit the run and QB keeper, contest the quick throw, and keep play-action help. Short yardage does not justify all-out pressure.', { run: 10, pass: -5, hybrid: 3 }],
  '1_medium': ['Keep the offense behind schedule', 'Stay balanced against the observed personnel. Fit the run without giving away the complementary pass.', { run: 3, hybrid: 3 }],
  '1_long': ['Limit the first-down gain', 'Stay balanced against the observed personnel. Fit the run, close the underneath throw and keep help against an explosive play.', {}],
  '2_short': ['Defend the run and the shot', 'Expect a run or quick throw, but keep deep help for a play-action shot. Do not sell out just because third down would be manageable.', { run: 10, pass: -5, hybrid: 5 }],
  '2_medium': ['Create a difficult third down', 'Close intermediate windows without losing the run fit. Avoid a gain that leaves an easy third down.', { pass: 3, hybrid: 5 }],
  '2_long': ['Keep third down difficult', 'Defend the longer throw, then rally to screens and underneath gains. Keep the draw and QB escape covered instead of assuming an automatic pass.', { run: -5, pass: 10, hybrid: 3 }],
  '3_short': ['Win the line to gain', 'Fit the run and QB keeper, contest the quick throw, and keep play-action help. Short yardage does not justify all-out pressure.', { run: 10, pass: -5, hybrid: 5 }],
  '3_medium': ['Contest the conversion window', 'Contest hitches, outs, and crossing routes at the sticks. Tackle at the catch; deep cushion alone can concede the conversion.', { run: -5, pass: 8, hybrid: 5 }],
  '3_long': ['Protect the sticks', 'Protect the sticks and deep threats. Rally to short catches and maintain a QB escape answer; pressure must justify its coverage cost.', { run: -15, pass: 15, hybrid: 3 }],
  '4_short': ['Stop the short conversion', 'Fit the run and QB keeper and close the immediate throw. Win at the line to gain while keeping help against play action.', { run: 10, pass: -5, hybrid: 5 }],
  '4_medium': ['Deny the conversion', 'Contest the catch at the sticks. A completion only helps the defense if the tackle keeps it short; retain the run and QB escape answer.', { run: -5, pass: 8, hybrid: 5 }],
  '4_long': ['Deny the conversion', 'Protect the line to gain and deeper routes, then tackle the underneath catch short of the sticks. Long yardage alone does not confirm a pass.', { run: -15, pass: 15, hybrid: 3 }],
};

export function getSituationalPurpose(down = 'base', distance = '', gameObjective = 'balanced') {
  const context = normalizeSituation(down, distance);
  const coverageKey = coverageSituation(context);
  const objective = getGameObjective(gameObjective);
  const [label, text, formationModifiers] = RULES[context.key] || (context.key === 'rz'
    ? ['Protect the goal line', 'Match the offensive personnel and spacing. Red zone is not automatically short yardage; protect the immediate pass and QB run.', {}]
    : ['Stay balanced', 'Add distance for situational guidance. Keep a balanced response to the observed offense.', {}]);
  return {
    id: context.key, context, coverageKey,
    conceptKey: context.distance ? context.key : coverageKey,
    label: objective.id === 'balanced' ? label : objective.label,
    text: objective.id === 'balanced' ? text : objective.id === 'get_stop' && context.distance ? `${objective.text} ${text}` : objective.text,
    target: context.distance ? `Line to gain: ${context.distance} yards` : null,
    earlyDown: context.down != null && context.down <= 2 && context.distance != null,
    conversionDown: context.down >= 3 && context.distance != null,
    shotOpportunity: context.key === '2_short',
    recoveryDown: context.key === '2_long',
    formationModifiers: { ...formationModifiers },
    gameObjective: objective.id,
  };
}
