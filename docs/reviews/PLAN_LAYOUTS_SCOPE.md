# Plan layout options

The **Layout** button in the Plan header opens a picker for **Original**,
**Quick Call**, **Coaching Board**, and **Formation First**. Original is the default and preserves the
existing call-plan panel and immediately visible formation list. The three new
views are optional. The selected layout is remembered on the same browser
or device under `sb_plan_layout`; unavailable storage does not block switching.
The header keeps the existing top row for Back (when applicable) and Call Sheet.
Its bottom row contains Notes, Adjust, and Layout, in that order. Existing header,
setup controls, toolbar colors, and borders are preserved. Narrow-screen header
rules keep the title and controls readable.

- Quick Call puts the primary call, defensive user assignment, and exact quick
  setup first. Changeup and conditional pressure expand on demand.
- Coaching Board shows the user assignment and coaching keys together, followed
  by visible changeup and pressure triggers. Columns stack on small screens.
  Opening an alternative's coaching details expands that card across the full
  board width and moves its sibling below. Only one alternative expands at a
  time; closing it restores the two-column layout.
- Formation First groups primary, changeup and pressure calls by defensive
  formation. The primary formation opens first; other formations expand on
  demand. Calls in the same formation share one group, retaining their own
  job, setup, triggers and Test this call action.
- Coaching Board always shows a pressure slot: either the selected conditional
  call or an explicit reason for holding coverage / using the primary pressure.
  The engine exposes its existing pressure decision as structured metadata;
  ranking, eligibility and selected calls are unchanged. Duplicate pressure
  notes are omitted only where that decision is already displayed.
- All four render the same existing `recommendation.callPlan`. Missing alternatives
  are never fabricated, and the engine's explanatory notes remain visible.
- The formation browser is expandable in all optional views. Its open state survives
  layout switching, and existing formation cards and details remain available.
- Test this call uses the selected entry's formation, call, and adjustment plan.
  PDF, scouting, setup controls, and In-Game Adjust retain their existing paths.
- New styling uses the app's existing light and dark theme tokens.
  Purpose, user assignment, quick setup, and coaching-key panels have matching
  subtle borders. Existing Original view and shared component borders remain
  unchanged.

## Validation

- Production build passes.
- All 204 engine tests pass, including pressure decision reasons.
- New presentation and storage modules pass ESLint. GamePlanScreen retains the
  same 10 existing lint findings, with no additional findings.
- React interaction checks in a simulated DOM pass for the original default and
  restoring the original formation list, all four picker choices, Escape and
  focus return, switching, remembering
  the choice after remounting, invalid or blocked storage, formation browser
  state, and logging the pressure entry with its correct setup. The engine's
  result object remains unchanged throughout these checks.
- These checks do not replace native iPhone/PWA or desktop browser testing.

Reviewed locally and approved for main. The release preserves Original as the
default and is published through one squash commit for a straightforward revert.
See [PLAN_LAYOUTS_ROLLBACK.md](PLAN_LAYOUTS_ROLLBACK.md) for the backup and rollback path.
