export const ONBOARDING_STORAGE_KEY = 'sb_onboarded_v3';

export const ONBOARDING_PAGES = [
  {
    topic: 'Scout an opponent', icon: '🔎', title: 'Start with what you have seen',
    body: 'Pick two or three offensive tendencies, then tap Build Game Plan. Add more as you learn how your opponent plays.',
    points: [
      'Scout run style, passing concepts, field targets, personnel, key threats, QB habits, and situations.',
      'Run / Pass Tendency describes the opponent. Moving it changes the weight of run and pass threats in your recommendations.',
      'Save Opponent Profile keeps that scout for your next matchup. Load it from Saved Opponents.',
    ],
  },
  {
    topic: 'Set up your plan', icon: '📋', title: 'Match the plan to this game',
    body: 'On Plan, set your playbook, My Defensive User, and Game Objective. Then choose the live down, distance, and offensive formation or personnel.',
    points: [
      'Your playbook narrows the available calls. My Defensive User considers the position you control and your preferred style.',
      'Choose Balanced, No Quick TD, or Get a Stop. Use Get a Stop when even a field goal can beat you.',
      'Update down and distance as the drive changes. Red zone is a separate situation setting.',
    ],
  },
  {
    topic: 'Read recommendations', icon: '🎮', title: 'Find your call quickly',
    body: 'Start with the recommended formation and call. Open the card when you need the reason, your responsibility, or the main weakness.',
    points: [
      'Best Overall is the top matchup for your current inputs. Best For You also considers your defensive user and style.',
      'Coverage coaching explains when to use a call, what it helps defend, and what to watch for next.',
      'A score compares fits within the app—it is not a success percentage. Make the next call based on what the offense shows.',
    ],
  },
  {
    topic: 'Adjust and test calls', icon: '🧪', title: 'Make one useful adjustment',
    body: 'Use Adjust or the Adjustments tab for the current matchup. Start with Quick Setup; open extra counters only when you see that problem.',
    points: [
      'Read the tradeoff before making a change. An adjustment that helps against one route can open another.',
      'Test This Call records what happened in your game: the setup, result, yards, and what beat it. It does not simulate a snap or automatically retrain recommendations.',
      'Keep notes on repeated results rather than changing your entire defense after one play.',
    ],
  },
  {
    topic: 'Macros: answer a problem', icon: '⚙️', title: 'Build your quick answers',
    body: 'Open Macros and choose the offensive problem. Each package shows the adjustments to make and the kind of call it works with.',
    points: [
      'Set these adjustments covers the setup. At the line covers changes that depend on the receivers in front of you.',
      'Keep up to 10 entries in your plan and copy the loadout for reference.',
      'Enter the settings yourself in CFB 27. The app does not send macros to your console or game.',
    ],
  },
  {
    topic: 'Play Art: create a macro', icon: '✏️', title: 'Design Your Play — Beta',
    body: 'Open Play Art, then choose Family → Formation → Play. Pick Custom to start with just the defenders, or use an example call where available.',
    points: [
      'Tap a defender to choose from that position’s assignments. Your choice immediately updates the diagram.',
      'Use Base call and My macro to compare. Reset restores the selected starting call; on Custom, it clears the assignments.',
      '71 formations have a Custom canvas. Example calls are currently available for four formations; the Beta does not include every play.',
    ],
  },
  {
    topic: 'Play Art: alignments and rushes', icon: '↔️', title: 'Make the picture match your setup',
    body: 'Open Zone drops, Defensive line, or Player alignment & show blitz beneath the field. These controls change the play art.',
    points: [
      'Set zone depth, CB and safety alignment, or shift linebackers. Secondary Show Blitz brings safeties to 6 yards; it does not move your corners.',
      'Selecting a stunt or QB contain assigns the needed rushers. If both need the same defender, your latest choice takes priority. Unavailable stunts explain why.',
      'DL Rush draws a short straight arrow. Assignments shows paths; Pre-snap shows alignment. The diagram illustrates the setup, not exact in-game movement.',
    ],
  },
  {
    topic: 'Teams, playbooks, and formations', icon: '🏈', title: 'Explore before you kick off',
    body: 'Use Teams, Compare, and Forms to prepare without rebuilding a scout from scratch.',
    points: [
      'Teams offers team profiles as a starting point. Change the scout when your actual opponent plays differently.',
      'Compare shows which formations two defensive playbooks share and what each adds.',
      'Forms explains alignments, personnel, strengths, and weaknesses. Customize opens that formation in Play Art.',
    ],
  },
  {
    topic: 'Save, review, and share', icon: '💾', title: 'Keep what worked',
    body: 'Use the Call Sheet and Notes buttons on Plan to keep useful calls and game observations close at hand.',
    points: [
      'Call Sheet offers Save PDF or View PDF without leaving your plan. On iPhone, use Save to Files when the share sheet opens.',
      'Notes and Drive Log keep game observations. Share lets you send or copy your current recommendation summary.',
      'Export / Import backs up saved opponent profiles. Play Art macros save separately on this device; profile exports do not include them.',
    ],
  },
  {
    topic: 'Phone setup and feedback', icon: '📱', title: 'Keep it handy on game day',
    body: 'Use your browser’s Add to Home Screen or Install option to open Scheme Builders like an app. The far-right navigation button switches light and dark mode.',
    points: [
      'Saved profiles, notes, call tests, and macros live in this browser on this device. They do not automatically sync to another device.',
      'In Play Art, name your setup and tap Save macro. Report a bug opens an email to help@schemebuilders.com with the setup included—add what happened and a screenshot, then send it.',
      'Reopen this guide anytime from Guide on Scout. Use the topic picker to jump directly to a feature.',
    ],
  },
];
