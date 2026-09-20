import { buildMacroPlan } from '../engine/macroPlan.js';
export const MACRO_CATS = ["Run Game","RPO & Spread Run","Pass Attack","Clusters & Matchups","QB Problems","Situational"];
// Stable IDs preserve existing saved selections. Coaching and controls live in
// macroCoaching.js / macroPlan.js; legacy position guesses are no longer used.
export const MACRO_LIBRARY = [
  {
    "id": "inside_power",
    "tier": "core",
    "cat": "Run Game",
    "label": "Power / Duo gashing me inside",
    "aka": "inside run downhill iso a gap b gap double team power duo",
    "name": "GAP WALL"
  },
  {
    "id": "outside_zone",
    "tier": "core",
    "cat": "Run Game",
    "label": "Stretch / outside zone to the edge",
    "aka": "wide zone stretch edge perimeter run sweep toss reach",
    "name": "SET THE EDGE"
  },
  {
    "id": "counter_trap",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Counter & trap misdirection",
    "aka": "pullers guard counter gt trap misdirection wham split flow",
    "name": "TRAP RADAR"
  },
  {
    "id": "qb_sneak_short",
    "tier": "deep",
    "cat": "Run Game",
    "label": "3rd & 1 sneak / QB power converts every time",
    "aka": "short yardage sneak tush push qb power fourth and one inches",
    "name": "INCHES"
  },
  {
    "id": "option_read",
    "tier": "core",
    "cat": "Run Game",
    "label": "Zone read / option — QB keeps pulling on me",
    "aka": "read option zone read qb keep pull midline triple option pitch veer",
    "name": "OPTION RULES"
  },
  {
    "id": "rpo_glance",
    "tier": "core",
    "cat": "RPO & Spread Run",
    "label": "RPO glance / slant behind my run fit",
    "aka": "rpo glance slant pop pass conflict defender run pass option",
    "name": "MESH POINT FREEZE"
  },
  {
    "id": "rpo_bubble",
    "tier": "core",
    "cat": "RPO & Spread Run",
    "label": "Bubble / now screens taking free yards",
    "aka": "bubble screen now screen perimeter rpo swing free yards flare",
    "name": "BUBBLE TAX"
  },
  {
    "id": "mesh_crossers",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Mesh / crossers over the middle all day",
    "aka": "mesh crossers shallow cross drag rub middle drive concept",
    "name": "MESH CRUSH"
  },
  {
    "id": "seam_middle",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Seams / benders splitting my safeties",
    "aka": "seam bender middle of field attack hash split safeties glance post dagger",
    "name": "CLOSE THE HASHES"
  },
  {
    "id": "four_verts",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "4 verticals stressing my deep shell",
    "aka": "four verts all go verticals deep stress seams busted coverage",
    "name": "STRESS TEST"
  },
  {
    "id": "deep_shots",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Getting beat over the top",
    "aka": "deep ball go routes bombs over the top explosive posts double moves",
    "name": "NO FLY ZONE"
  },
  {
    "id": "quick_game",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Hitches / slants on schedule every snap",
    "aka": "quick game three step hitch slant spacing timing rhythm catch throw",
    "name": "SCHEDULE BREAKER"
  },
  {
    "id": "screens",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "RB / WR screens gashing my pressure",
    "aka": "screen rb slip screen wr tunnel jailbreak pressure punish",
    "name": "SCREEN ALARM"
  },
  {
    "id": "flood_trips",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Trips flood — three levels to one side",
    "aka": "flood trips sail concept corner route three level strong side overload stem down",
    "name": "FLOOD INSURANCE"
  },
  {
    "id": "pa_shot",
    "tier": "core",
    "cat": "Pass Attack",
    "label": "Play action sucking my safeties in",
    "aka": "play action pa shot bootleg boot fake bite safeties post over the top",
    "name": "NO BITE"
  },
  {
    "id": "empty_5out",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Empty sets spreading me 5-out",
    "aka": "empty backfield five wide 5 out spacing no back quick spread",
    "name": "EMPTY POUNCE"
  },
  {
    "id": "bunch_rubs",
    "tier": "core",
    "cat": "Clusters & Matchups",
    "label": "Bunch rubs destroying my man coverage",
    "aka": "bunch pick plays rub routes compressed sets natural picks man beaters",
    "name": "PICK PROOF"
  },
  {
    "id": "stack_release",
    "tier": "deep",
    "cat": "Clusters & Matchups",
    "label": "Stacked WRs — switch releases beating me",
    "aka": "stack stacked receivers switch release vertical twins tight split",
    "name": "SWITCH RULES"
  },
  {
    "id": "te_seam",
    "tier": "core",
    "cat": "Clusters & Matchups",
    "label": "Elite TE torching my linebackers",
    "aka": "tight end seam te mismatch linebacker cover te y iso benders",
    "name": "ERASER"
  },
  {
    "id": "alpha_wr",
    "tier": "core",
    "cat": "Clusters & Matchups",
    "label": "Their WR1 wins every 1-on-1",
    "aka": "elite receiver alpha wr1 x iso stud double team bracket",
    "name": "CLAMP"
  },
  {
    "id": "scramble_drill",
    "tier": "core",
    "cat": "QB Problems",
    "label": "Scramble drill breaking my coverage late",
    "aka": "scramble extend plays off schedule mobile qb broken play coverage dies",
    "name": "PLASTER KIT"
  },
  {
    "id": "pocket_surgeon",
    "tier": "deep",
    "cat": "QB Problems",
    "label": "Pocket QB picking my zones apart",
    "aka": "pocket passer surgical accurate reads zones apart pre snap dissect",
    "name": "MUDDY WATER"
  },
  {
    "id": "tempo",
    "tier": "core",
    "cat": "Situational",
    "label": "No-huddle tempo trapping my personnel",
    "aka": "tempo no huddle hurry up fast pace cant sub trapped personnel fatigue",
    "name": "TEMPO ANSWER"
  },
  {
    "id": "two_minute",
    "tier": "deep",
    "cat": "Situational",
    "label": "2-minute drill — sideline routes bleeding me",
    "aka": "two minute drill clock sideline outs comebacks hurry end of half",
    "name": "CLOCK COP"
  },
  {
    "id": "redzone_fade",
    "tier": "deep",
    "cat": "Situational",
    "label": "Red zone fades / back-shoulder killing me",
    "aka": "red zone fade back shoulder goal line corner end zone jump ball",
    "name": "GOAL LINE SKY"
  },
  {
    "id": "motion_chaos",
    "tier": "deep",
    "cat": "Situational",
    "label": "Motion scrambling my assignments pre-snap",
    "aka": "motion jet motion shifts orbit pre snap movement confusion assignments",
    "name": "MOTION LOCK"
  },
  {
    "id": "jet_sweep",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Jet sweep / end-around beating my edge",
    "aka": "jet sweep end around fly motion perimeter speed edge orbit handoff",
    "name": "JET LOCK"
  },
  {
    "id": "wildcat",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Wildcat / direct snap running me over",
    "aka": "wildcat direct snap rb quarterback power unbalanced gadget run",
    "name": "CAT TRAP"
  },
  {
    "id": "draw_delay",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Draws & delays gutting my pass rush",
    "aka": "draw delay trap qb draw shovel screen pass rush punish upfield lanes",
    "name": "DRAW CZAR"
  },
  {
    "id": "toss_crack",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Toss & crack toss to the boundary",
    "aka": "toss crack sweep pitch boundary corner block perimeter outside",
    "name": "CRACK REPLACE"
  },
  {
    "id": "qb_counter",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Designed QB counter / power runs",
    "aka": "qb counter gt power designed quarterback run pullers lamar konami",
    "name": "PLUS ONE"
  },
  {
    "id": "unbalanced",
    "tier": "deep",
    "cat": "Run Game",
    "label": "Unbalanced / extra-OL heavy lines",
    "aka": "unbalanced line extra tackle jumbo heavy tight formation overload strength",
    "name": "RESET STRONG"
  },
  {
    "id": "rpo_stick",
    "tier": "deep",
    "cat": "RPO & Spread Run",
    "label": "RPO stick/snag behind my apex",
    "aka": "rpo stick snag spot triangle apex conflict slot quick",
    "name": "STICK SHIFT"
  },
  {
    "id": "qb_draw_spread",
    "tier": "deep",
    "cat": "RPO & Spread Run",
    "label": "QB draw from empty / spread",
    "aka": "qb draw empty spread lanes scramble designed delay quarterback run middle",
    "name": "VACUUM SEAL"
  },
  {
    "id": "speed_option",
    "tier": "deep",
    "cat": "RPO & Spread Run",
    "label": "Speed option to the short side",
    "aka": "speed option pitch boundary flank quick edge quarterback pitch relationship",
    "name": "FLANK RULES"
  },
  {
    "id": "boots_waggle",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Boots & waggles off every run fake",
    "aka": "bootleg waggle naked boot rollout keeper flood off play action edge",
    "name": "BOOT CAMP"
  },
  {
    "id": "shot_off_tempo",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Tempo into deep shots on 1st down",
    "aka": "first down shot play tempo deep post explosive sudden change sugar huddle",
    "name": "SHOT CLOCK"
  },
  {
    "id": "dagger",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Dagger / dig combos carving the intermediate",
    "aka": "dagger dig seam clear out in cut intermediate 15 yards middle carve",
    "name": "DIG WALL"
  },
  {
    "id": "smash_corner",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Smash / corner routes beating my Cover 2",
    "aka": "smash corner route hitch flag cover 2 hole honey hole sideline",
    "name": "HOLE PLUG"
  },
  {
    "id": "rb_wheel",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "RB wheels sneaking out of the backfield",
    "aka": "wheel route running back backfield sneak rail up sideline linebacker chase",
    "name": "WHEEL WATCH"
  },
  {
    "id": "te_leak",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "TE leak / throwback off play action",
    "aka": "tight end leak throwback delay slide across field pa hidden late release",
    "name": "LEAK PATROL"
  },
  {
    "id": "double_moves",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Sluggos & double moves baiting my DBs",
    "aka": "double move sluggo hitch and go out and up stop and go pump fake bait jump",
    "name": "NO BAIT"
  },
  {
    "id": "yankee",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Yankee / deep cross two-man shots",
    "aka": "yankee concept deep cross post dig two man play action max shot crossers",
    "name": "YANKEE TAX"
  },
  {
    "id": "max_protect",
    "tier": "deep",
    "cat": "Pass Attack",
    "label": "Max protect — 7 block, 2 go deep",
    "aka": "max protect seven man protection two routes deep shot chip double moves time",
    "name": "OUTNUMBERED"
  },
  {
    "id": "rb_split_out",
    "tier": "deep",
    "cat": "Clusters & Matchups",
    "label": "RB split wide on my linebacker",
    "aka": "running back split out wide empty motion mismatch linebacker option route",
    "name": "NO ISO"
  },
  {
    "id": "slot_fade",
    "tier": "deep",
    "cat": "Clusters & Matchups",
    "label": "Slot fades torching my nickel",
    "aka": "slot fade nickel matchup seam fade inside receiver back shoulder bang",
    "name": "SLOT CAP"
  },
  {
    "id": "bunch_run",
    "tier": "deep",
    "cat": "Clusters & Matchups",
    "label": "Compressed sets running crack & pin-pull",
    "aka": "bunch run crack toss pin pull compressed condensed formation run blocking receivers",
    "name": "CRUNCH TIME"
  },
  {
    "id": "audible_king",
    "tier": "deep",
    "cat": "QB Problems",
    "label": "He audibles out of every blitz look",
    "aka": "audible check kill mike point protection pre snap read changes play line scrimmage",
    "name": "POKER FACE"
  },
  {
    "id": "hard_count",
    "tier": "deep",
    "cat": "QB Problems",
    "label": "Hard count drawing my line offsides",
    "aka": "hard count cadence draw offsides free play neutral zone jump snap",
    "name": "BALL EYES"
  },
  {
    "id": "backup_qb",
    "tier": "deep",
    "cat": "QB Problems",
    "label": "Backup QB just came in — attack plan",
    "aka": "backup quarterback injury second string bench qb change new passer attack pressure",
    "name": "WELCOME PARTY"
  },
  {
    "id": "four_min_kill",
    "tier": "deep",
    "cat": "Situational",
    "label": "4-minute offense bleeding my clock",
    "aka": "four minute drill clock kill bleed run out lead grind chains milk",
    "name": "CLOCK THIEF"
  },
  {
    "id": "trick_plays",
    "tier": "deep",
    "cat": "Situational",
    "label": "Trick plays — reverses, flea flickers, specials",
    "aka": "trick play flea flicker reverse pass double pass halfback pass gadget special hook ladder",
    "name": "NO MAGIC"
  },
  {
    "id": "third_short_pass",
    "tier": "deep",
    "cat": "Situational",
    "label": "He THROWS on 3rd & 1",
    "aka": "third and one pass play action short yardage throw over top sneak fake tendency breaker",
    "name": "BOTH WAYS"
  },
  {
    "id": "backed_up",
    "tier": "deep",
    "cat": "Situational",
    "label": "Offense pinned inside their 10 — finish it",
    "aka": "backed up pinned own goal line safety pressure coffin corner deep territory conservative",
    "name": "COFFIN NAIL"
  },
  {
    "id": "two_point",
    "tier": "deep",
    "cat": "Situational",
    "label": "Two-point conversion defense",
    "aka": "two point conversion 2pt goal line 3 yards rub pick sprint out one play",
    "name": "CARD COUNTER"
  },
  {
    "id": "hail_mary",
    "tier": "deep",
    "cat": "Situational",
    "label": "End of half — Hail Mary defense",
    "aka": "hail mary end of half game deep heave jump ball prevent last play desperation",
    "name": "REBOUND"
  }
];

const STOP = new Set(["can","cant","cannot","stop","stopping","help","defend","defending","does","dont","isn","and","are","the","for","but","with","they","them","their","that","this","its","his","her","every","keeps","keep","killing","kill","gets","getting","being","when","what","time","all","cant","wont","just","really","always","snap","play","plays","team","guy","dude","game","beat","beats","beating","hitting","hit","also","then","because","have","has","against"]);
// Gamer-speak → library vocabulary. Values are appended as extra search tokens.
const SYNONYMS = {
  scrambling:["scramble"], scrambles:["scramble"], escapes:["scramble","mobile"], escaping:["scramble"],
  takeoff:["scramble","mobile"], legs:["mobile","qb"], lamar:["mobile","qb"], running:["run"],
  bombs:["deep"], bombing:["deep"], moss:["fade","jump"], mossed:["fade","jump"], lobs:["fade"],
  torching:["deep"], burnt:["deep"], burned:["deep"], cooked:["deep"],
  picks:["rub","pick"], rubs:["rub"], rubbing:["rub"], crossing:["crossers","cross"],
  spamming:["repeat"], spam:["repeat"],
  unstoppable:["repeat"],
  huddle:["tempo"], nohuddle:["tempo"], fast:["tempo"], pace:["tempo"],
  shotgun:["spread"], middle:["seam","cross","hashes"], seams:["seam"],
  outside:["edge","perimeter"], corner:["edge","corner"], sideline:["out","boundary"],
  short:["quick","yardage"], dinking:["quick","checkdown"], dunking:["quick","checkdown"], checkdowns:["checkdown"],
  bootlegging:["boot"], rollout:["boot","sprint"], rollouts:["boot"], waggles:["boot"],
  pulling:["pull","option"], keeping:["keep","option"], reads:["read","option"], reading:["read"],
  motioning:["motion"], jetting:["jet","motion"], shifting:["motion","shift"],
  hurryup:["tempo"], blitzing:["blitz"], sacks:["pressure"], pancaked:["oline"],
  fades:["fade"], jumpball:["fade","jump"], goalline:["goal","line","red","zone"],
  screens:["screen"], tunnels:["screen","tunnel"], bubbles:["bubble"],
  wheels:["wheel"], leaks:["leak","tight","end"], flats:["flat"],
  draws:["draw"], delays:["draw","delay"], sneaks:["sneak"], counters:["counter"],
  tricks:["trick"], gadgets:["trick","gadget"], flicker:["flea","flicker","trick"],
  audibles:["audible","check"], checks:["audible","check"], kills:["audible"],
};

const stem = word => word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
function tokenize(text) {
  if (typeof text !== 'string') return [];
  const raw = text.toLowerCase().split(/[^a-z0-9]+/).filter(w => (w.length > 2 || ['qb', 'te', 'rb', 'hb'].includes(w)) && !STOP.has(w));
  return [...new Set(raw.flatMap(w => [stem(w), ...(SYNONYMS[w] || []).map(stem)]))];
}
const SEARCH_PHRASES = {
  option_read: ['read option', 'zone read'], deep_shots: ['deep shots', 'deep shot', 'over the top'],
  scramble_drill: ['qb scramble', 'scrambling qb'], screens: ['screens', 'screen game', 'rb screen', 'wr screen'],
  mesh_crossers: ['mesh', 'crossers'], bunch_rubs: ['bunch'], four_verts: ['four verticals', '4 verticals', 'four verts'],
};
const vocabulary = new Map(MACRO_LIBRARY.map(m => [m.id, new Set(tokenize(`${m.label} ${m.aka}`))]));
function scoreMacro(m, tokens) {
  const why = tokens.filter(t => vocabulary.get(m.id).has(t));
  // Specific words count more than words shared by most of the library.
  const phraseBonus = (SEARCH_PHRASES[m.id] || []).some(phrase => tokenize(phrase).every(t => tokens.includes(t))) ? 10 : 0;
  const score = phraseBonus + why.reduce((sum, t) => sum + Math.log(1 + MACRO_LIBRARY.length / [...vocabulary.values()].filter(set => set.has(t)).length), 0);
  return { m, why, score };
}
export function matchMacros(text, limit = 5) {
  if (typeof text !== 'string' || !Number.isInteger(limit) || limit < 1) return [];
  // Search describes threats that ARE happening. A negated clause is excluded;
  // it is never silently converted into a different offensive tendency.
  const clauses = text.toLowerCase().replace(/[’‘]/g, "'").replace(/no[ -]huddle/g, 'nohuddle')
    .split(/[,;.!?]|\b(?:and|plus|also|then|but|instead)\b/)
    .filter(c => !/\b(?:no|not|never|without|doesn't|doesnt|isn't|isnt)\b/.test(c) && !/\bcan'?t\b(?!\s+(?:stop|defend|cover|handle)\b)/.test(c))
    .map(tokenize).filter(tokens => tokens.length);
  if (!clauses.length) return [];
  const picked = []; const seen = new Set();
  const push = item => { if (item.why.length && !seen.has(item.m.id) && picked.length < Math.min(limit, 10)) { seen.add(item.m.id); picked.push(item); } };
  for (const tokens of clauses) {
    const ranked = MACRO_LIBRARY.map(m => scoreMacro(m, tokens)).sort((a,b) => b.score - a.score);
    if (ranked[0]) push(ranked[0]);
  }
  const whole = [...new Set(clauses.flat())];
  const ranked = MACRO_LIBRARY.map(m => scoreMacro(m, whole)).sort((a,b) => b.score - a.score);
  ranked.filter(item => item.score >= ranked[0].score * 0.5).forEach(push);
  return picked;
}
export function matchMacroList(text, limit = 5) { return matchMacros(text, limit).map(x => x.m); }
export function normalizeMacroSelection(value) {
  if (!Array.isArray(value)) return [];
  const ids = new Set(MACRO_LIBRARY.map(m => m.id));
  return [...new Set(value.filter(id => typeof id === 'string' && ids.has(id)))].slice(0, 10);
}
export function exportLoadout(selected, context = {}) {
  const ids = normalizeMacroSelection(Array.isArray(selected) ? selected.map(m => typeof m === 'string' ? m : m?.id) : []);
  const entries = ids.map(id => { const macro = MACRO_LIBRARY.find(m => m.id === id); return { macro, plan: buildMacroPlan(macro, context) }; });
  const ready = entries.filter(e => e.plan.ready);
  const header = `SCHEME BUILDERS · CFB 27 CUSTOM ADJUSTMENTS
${ready.length}/10 active adjustments in this plan
Apply one package that fits the current problem and coverage. Do not combine every package.
`;
  let slot = 0;
  return header + entries.map(({macro, plan}) => `
${plan.ready ? `ACTIVE ${++slot} — save as "${macro.name}"` : `CALL CHANGE NEEDED — ${macro.name}`}
PROBLEM: ${macro.label}
USE WITH: ${plan.use}
${plan.ready ? '' : plan.callout}
${plan.settings.map(s => `SAVE: ${s.setting}: ${s.value} — ${s.why}${s.when ? ` Only when: ${s.when}` : ''} Tradeoff: ${s.risk}`).join('\n')}
${plan.atLine.map(s => `AT THE LINE: ${s.setting}: ${s.value} — ${s.why} ${s.when}`).join('\n')}
YOUR JOB: ${plan.user}
WATCH FOR: ${plan.risk}
`).join('');
}
