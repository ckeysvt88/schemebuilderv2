# Scheme Builders

**Scout your opponent. Build a defensive game plan. Understand your next call.**

Scheme Builders is a free defensive scouting and planning app for **EA SPORTS College Football 27**. It turns the offensive tendencies you observe into defensive formation, play, and adjustment recommendations, with explanations of your job and the risks behind each choice.

Built with user-versus-user games in mind, it also helps you explore defensive playbooks, learn formations, and design custom defensive setups. It runs as a standalone companion app; scouting inputs and in-game adjustments are entered manually.

**[Open the app](https://schemebuilders.com)** · **[Report an issue](https://github.com/ckeysvt88/schemebuilderv2/issues)**

Free to use. No ads. No account required. Works in your browser and can be added to your phone’s home screen.

## Getting started

1. **Scout the offense.** Choose the tendencies you have actually seen: personnel, run style, passing concepts, field targets, quarterback habits, and situations. Set the opponent’s run/pass tendency.
2. **Build your game plan.** Choose your defensive playbook, **My Defensive User**, and **Game Objective**.
3. **Set the current situation.** Update the offensive formation or personnel, down, and distance as the game changes.
4. **Choose a call.** Start with the primary in **Your call plan**. Review its setup, your job, and the trigger for changing calls. Formation cards also show **Best Overall** and **Best For You**.
5. **Review what happened.** Save opponent profiles, keep notes, or use **Test This Call** to record results from your game.

You can also start from **Teams** and adjust the supplied team profile to match how your actual opponent plays. Open **Guide** on Scout for the tutorial and its topic picker.

## What you can do

| Feature | What it helps you do |
|---|---|
| **Opponent scouting** | Describe the offense using observed tendencies and a run/pass slider. |
| **Defensive game plans** | Find formation and exact-call recommendations for your scout, playbook, personnel matchup, and situation. |
| **Plan layouts** | Choose Original, Quick Call, Coaching Board, or Formation First from the Layout button. |
| **Coordinated call plans** | Start with a primary call and see a matchup-based changeup or conditional pressure option when one qualifies. |
| **My Defensive User** | Tailor call selection to Linebacker, Safety, Slot / Corner, or Defensive Line, plus your preferred call style. |
| **Game objectives** | Choose Balanced, No Quick TD, or Get a Stop to express what the defense needs to accomplish. |
| **Coverage coaching and adjustments** | Understand when to use a call, what it helps defend, what to watch for, and which supported adjustments fit the matchup. |
| **In-game Adjust** | Update the tendencies you are seeing and refresh the plan during a game. |
| **Macros** | Build a reference loadout of up to 10 problem-based adjustment packages, with setup steps, at-the-line changes, your job, and tradeoffs. |
| **Play Art — Beta** | Edit individual defender assignments and alignment on an interactive field, then save your custom setup. |
| **Playbook comparison** | See the formations two defensive playbooks share and what each book adds. Use View schools under either playbook to scroll an alphabetical list of schools assigned to that exact defensive playbook. |
| **Formation reference** | Explore personnel, alignments, strengths, weaknesses, and catalogued play capabilities; open a formation in Play Art with Customize. |
| **Saved profiles and notes** | Reuse opponent scouts, export/import profile backups, and keep game observations. |
| **Call sheets and sharing** | Save or view a PDF call sheet and share or copy your current recommendation summary. |
| **Test This Call** | Record the call, setup, result, yards, and what beat it for later review. |

### Four ways to view your plan

Open **Layout**, to the right of **Adjust** on the lower Plan header row, to choose a view. **Original is the default**, and your choice is remembered in that browser on that device.

| Layout | How it presents the plan |
|---|---|
| **Original** | The familiar call-plan panel followed by the formation list. |
| **Quick Call** | The primary call, your job, and quick setup first, with alternatives expandable on demand. |
| **Coaching Board** | The primary call with your job and coaching keys, followed by changeup and pressure sections. Opening an alternative's details expands it across the board and closes the other; collapsing restores the columns. |
| **Formation First** | Planned calls grouped by defensive formation. The primary formation starts open; expand the other groups for their calls, setup, and coaching. |

All four views use the same recommendations. The optional layouts include an expandable **Browse formations** section, and switching layouts preserves your scouting and planning inputs.

The Coaching Board pressure section includes **Setup, your job & coaching**. If a separate pressure call qualifies, its own assignment and setup are shown. Otherwise, the section explains the pressure decision and identifies the **primary call** whose setup and job apply—including when that primary already sends extra rushers.

### Your call plan

The plan explains the purpose of the current down and distance, including the line to gain when distance is supplied. Its primary call is the starting point; a changeup addresses a credible weakness, and a conditional pressure call includes guidance on when to use it and when to return to the primary.

Each planned call keeps its own setup, user assignment, coaching cues, and formation-change warning. Apply one call's setup at a time. Against tempo, planned alternatives stay in the same defensive formation; confirm your available audibles before the game.

**Test This Call** carries the selected planned call and its setup into the observation form, including when you choose a changeup or pressure option.

### Personalized recommendations

**Best Overall** identifies the strongest matchup for the current inputs. **Best For You** also considers the position you control and your preferred style: Stay Balanced, Protect Explosives, or Create Pressure.

Call details explain when to use the call, what it takes away, what to be ready for, and when to change it. Adjustment guidance includes the tradeoff so you can make a deliberate change as the offense adapts.

### Macros and Play Art

These are two different tools:

- **Macros** answers an offensive problem with a package of adjustments you can reference during a game.
- **Play Art** lets you design and inspect the assignments and alignment of a specific defensive setup.

The app provides instructions and diagrams. Enter the settings yourself in CFB 27; it does not send commands or macros to your game.

## Play Art — Beta

Choose **Family → Formation → Play**, then tap a defender to open that position’s assignment menu.

- **Custom canvases for 71 formations.** Start from the formation’s defenders and choose their assignments.
- **Example calls in four formations:** Nickel Over, 4-3 Over Wide, 3-4 Over, and 3-3-5 Stack. The example library does not include every catalogued play.
- **Position-specific assignments:** supported zones, rushes, blitzes, QB spies, and contain responsibilities.
- **Zone drops:** Default or 0–30 yards in 5-yard increments for flats, curl flats, and hooks.
- **Alignment controls:** corner and safety depth/width, linebacker shifts, and Show Blitz. Secondary Show Blitz brings safeties to 6 yards while keeping corners in place.
- **Defensive line controls:** technique, point of attack, compatible stunts, and left/right/both-edge QB contain.
- **Base call / My macro comparison**, Assignments / Pre-snap views, reset, and named saved macros.

When a stunt and contain setting need the same defender, the latest selection takes priority. Unavailable stunts explain why they cannot be used.

Man coverage is a label in the diagram; select the receiver matchup in game. Paths illustrate responsibilities and rush lanes rather than exact animation, timing, or guaranteed pressure. Saved Play Art setups do not change the recommendation engine.

**Report a bug** in Play Art opens an email to [help@schemebuilders.com](mailto:help@schemebuilders.com) with the current setup included.

## How recommendations work

The app uses a deterministic, data-driven football engine running in your browser. Its catalog contains **1,245 defensive plays across 71 formations** and **31 defensive playbooks**.

The recommendation pipeline combines:

- Scouted offensive threats, personnel, and run/pass tendency.
- Your selected defensive playbook and the live down/distance.
- Exact play names and documented assignment evidence.
- Coverage matchup, run-support considerations, and supported adjustment tradeoffs.
- Your defensive user position, preferred style, and game objective.
- The purpose of the exact down and distance, including early-down balance, second-and-short shot risk, and protecting the line to gain on conversion downs.

After evaluating calls, the engine builds a coordinated plan. A changeup must improve an identified weakness while preserving coverage against other credible threats and staying competitive in overall fit. A separate pressure option needs verified extra rushers and must pass the matchup, fit, objective, and personnel checks. The plan explains when no alternative qualifies.

The shared recommendation service supplies the live plan, call details, share text, and PDF call-sheet recommendations.

**Fit scores are heuristic rankings, not success probabilities.** Assignment counts describe call structure; they do not establish exact defender identities, run-gap ownership, or gameplay outcomes. Team profiles are starting points that should be updated from your observations.

**Test This Call records real gameplay observations.** It does not simulate a snap or automatically retrain the engine.

## Phone use and saved data

On iPhone, open the app in Safari and use **Share → Add to Home Screen**. On supported Android and desktop browsers, use **Install** or **Add to Home Screen**.

The app supports light and dark themes. The far-right navigation button changes the theme.

Saved profiles, notes, call tests, and macros stay in the browser on the device where you created them. They do not automatically sync between devices. Use **Export / Import** to back up opponent profiles; those exports do not include Play Art macros.

The call sheet offers **Save PDF** and **View PDF** without leaving your plan. On iPhone and supported iPads, Save PDF opens the share sheet; choose **Save to Files**. On a desktop, Save PDF starts a direct download.

The PDF includes a situational coaching guide with the primary call, qualifying changeup and pressure options, setup, your job, and defensive keys. Clear headings, emphasized cues, and indented alternatives make it easier to scan. PDF recommendations use the same engine as the live plan.

## Run locally

### Requirements

- Git
- **Node.js 22.13 or newer in the Node 22 release line**, with npm. GitHub Actions uses Node 22.

From a terminal:

```bash
git clone https://github.com/ckeysvt88/schemebuilderv2.git
cd schemebuilderv2
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the interface from a phone on the same Wi-Fi:

```bash
npm run dev -- --host 0.0.0.0
```

Open Vite’s Network URL on the phone. Use HTTPS for installed-app and secure browser features.

To review the production build on a phone on the same Wi-Fi:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Keep the terminal open and enter its **Network** URL in the phone's browser. Local hosting has its own saved data, separate from the live site's profiles and notes.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm test` | Run the Node test suite. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview a production build locally after building it. |
| `npm run lint` | Run repository-wide ESLint. |
| `node scripts/auditFormationCoverage.js` | Audit formation and playbook coverage. |

The regression suite covers recommendation behavior, assignment evidence, run support, personalization, objectives, adjustment plans, macros, Play Art, storage, and PDF/session behavior. CI also runs dependency auditing and production builds. See the workflow files for the focused lint checks used by CI; repository-wide lint also includes historical files.

## Project structure

| Location | Purpose |
|---|---|
| `src/App.jsx` | App navigation, scouting state, preferences, and session restoration. |
| `src/components/` | Scouting, planning, comparison, reference, notes, and PDF interfaces. |
| `src/components/playArt/` | Interactive Play Art editor, formation catalog, example art, storage, and feedback. |
| `src/data/` | Formations, plays, playbooks, team profiles, assignment evidence, macro recipes, and tutorial content. |
| `src/engine/` | Scoring, exact-call evaluation, threat analysis, personalization, adjustments, and call sheets. |
| `src/utils/` | Browser utilities, including PDF saving and remembered Plan layout preferences. |
| `tests/` | Automated regression tests. |
| `public/` | App icons, manifest, service worker, and custom-domain configuration. |
| `docs/` | Football logic audits, validation notes, and implementation records. |
| `.github/workflows/` | Build/check workflows and GitHub Pages deployment. |

Built with **React 19**, **Vite 8**, JavaScript, CSS, SVG play art, and React PDF. The app runs client-side without a required backend or live AI service.

## Deployment

GitHub Actions deploys `main` to **GitHub Pages** at [schemebuilders.com](https://schemebuilders.com).

The deployment workflow installs locked dependencies, audits for high-severity vulnerabilities, runs tests, builds the app, and publishes `dist/`. The custom domain is configured in `public/CNAME`.

The version before the optional Plan layouts is preserved on [`rollback/pre-plan-layouts-2026-10-08`](https://github.com/ckeysvt88/schemebuilderv2/tree/rollback/pre-plan-layouts-2026-10-08). See the [rollback notes](docs/reviews/PLAN_LAYOUTS_ROLLBACK.md) and [layout review](docs/reviews/PLAN_LAYOUTS_SCOPE.md) for release details. Subsequent fixes can be reverted separately.

## Feedback and contributions

Open a [GitHub issue](https://github.com/ckeysvt88/schemebuilderv2/issues) for bugs, football logic corrections, or feature requests. Useful reports include:

- The scouting inputs, defensive playbook, formation, exact call, down, and distance.
- Your user position and the adjustments you applied.
- What you expected, what happened, and a screenshot where possible.
- Game version and platform when reporting an in-game discrepancy.

For code changes, use a branch and pull request. Run `npm test` and `npm run build`, plus lint checks relevant to the changed files. Explain the resulting behavior and include evidence for changes to football assignments or scoring.

Example Play Art references link to [CFB Labs](https://www.cfblabs.com/) from the editor. This is an independent community project and is not affiliated with or endorsed by EA SPORTS.
