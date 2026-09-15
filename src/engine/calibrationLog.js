export const CALL_TEST_RESULTS = [
  { id: 'stop', label: 'Stopped them' },
  { id: 'sack', label: 'Sack' },
  { id: 'turnover', label: 'Turnover' },
  { id: 'first_down', label: 'Allowed first down' },
  { id: 'explosive', label: 'Allowed explosive play' },
  { id: 'touchdown', label: 'Allowed touchdown' },
];

export const CALL_TEST_PROBLEMS = [
  { id: 'none', label: 'No clear problem' },
  { id: 'run_fit', label: 'Run fit / missed gap' },
  { id: 'qb_run', label: 'QB escaped or kept it' },
  { id: 'quick_game', label: 'Quick throw' },
  { id: 'screen_rpo', label: 'Screen or RPO' },
  { id: 'intermediate', label: 'Crossing or intermediate route' },
  { id: 'deep_pass', label: 'Deep pass' },
  { id: 'user_assignment', label: 'My user assignment' },
  { id: 'pressure_failed', label: 'Pressure did not arrive' },
  { id: 'coverage_bust', label: 'Coverage bust / wrong assignment' },
];

const resultIds = new Set(CALL_TEST_RESULTS.map(item => item.id));
const problemIds = new Set(CALL_TEST_PROBLEMS.map(item => item.id));
const cleanText = (value, max = 160) => String(value ?? '').trim().slice(0, max);

export function normalizeCalibrationEntry(input = {}) {
  if (!input || typeof input !== 'object') return null;
  const result = resultIds.has(input.result) ? input.result : '';
  if (!result) return null;
  return {
    schemaVersion: 2,
    id: typeof input.id === 'string' || Number.isFinite(input.id) ? input.id : Date.now(),
    recordedAt: cleanText(input.recordedAt, 40) || new Date().toISOString(),
    down: ['1', '2', '3', '4', 'rz'].includes(String(input.down)) ? String(input.down) : '',
    distance: ['short', 'mid', 'long'].includes(input.distance) ? input.distance : '',
    defensiveFormation: cleanText(input.defensiveFormation, 100),
    defensiveCall: cleanText(input.defensiveCall, 100),
    userPosition: cleanText(input.userPosition, 60),
    book: cleanText(input.book, 100),
    gameVersion: cleanText(input.gameVersion, 80),
    platform: cleanText(input.platform, 40),
    difficulty: cleanText(input.difficulty, 40),
    mode: cleanText(input.mode, 60),
    setupConfirmed: input.setupConfirmed === true,
    objective: cleanText(input.objective, 120),
    setup: Array.isArray(input.setup) ? input.setup.map(value => cleanText(value, 120)).filter(Boolean).slice(0, 6) : [],
    opponentLook: cleanText(input.opponentLook, 120),
    result,
    problem: problemIds.has(input.problem) ? input.problem : 'none',
    yards: input.yards != null && String(input.yards).trim() !== '' && Number.isFinite(Number(input.yards)) ? Math.max(-99, Math.min(999, Number(input.yards))) : null,
    notes: cleanText(input.notes, 300),
  };
}

export function summarizeCalibrationEntries(entries = []) {
  const byCall = new Map();
  entries.forEach(raw => {
    const entry = normalizeCalibrationEntry(raw);
    if (!entry || !entry.defensiveCall) return;
    const testedSetup = entry.setupConfirmed ? [...new Set(entry.setup)].sort() : [];
    const key = JSON.stringify([entry.defensiveFormation, entry.defensiveCall, entry.book,
      entry.down, entry.distance, entry.userPosition, entry.gameVersion, entry.platform,
      entry.difficulty, entry.mode, entry.opponentLook, entry.setupConfirmed,
      testedSetup, ...(entry.objective ? [entry.objective] : [])]);
    const downLabel = ({ 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', rz: 'Red zone' })[entry.down];
    const situation = downLabel && entry.down !== 'rz'
      ? `${downLabel}${entry.distance ? ` & ${entry.distance}` : ' down'}`
      : downLabel;
    const current = byCall.get(key) || {
      key, formation: entry.defensiveFormation,
      context: [situation, entry.objective, entry.book, entry.platform, entry.difficulty, entry.mode, entry.gameVersion,
        entry.setupConfirmed && 'listed setup used'].filter(Boolean).join(' · '),
      call: entry.defensiveCall, tests: 0, stops: 0, sacks: 0, turnovers: 0,
      firstDowns: 0, explosives: 0, touchdowns: 0, problems: {},
    };
    current.tests += 1;
    if (entry.result === 'stop') current.stops += 1;
    if (entry.result === 'sack') current.sacks += 1;
    if (entry.result === 'turnover') current.turnovers += 1;
    if (entry.result === 'first_down') current.firstDowns += 1;
    if (entry.result === 'explosive') current.explosives += 1;
    if (entry.result === 'touchdown') current.touchdowns += 1;
    if (entry.problem !== 'none') current.problems[entry.problem] = (current.problems[entry.problem] || 0) + 1;
    byCall.set(key, current);
  });
  return [...byCall.values()].sort((a, b) => b.tests - a.tests || a.call.localeCompare(b.call));
}
