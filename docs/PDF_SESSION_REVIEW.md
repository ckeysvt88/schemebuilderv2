# PDF navigation and active-session review

Changes on FootballEngineImprovements only:

- Call Sheet is now a normal button, not a disabled button nested in a download link.
- PDF generation starts only on request. It no longer rebuilds the situation matrix and PDF whenever scouting or plan inputs change.
- The shared dialog shows progress, errors/retry, and separate Open PDF in a new tab / Save PDF links. Both links target another tab if the browser displays the file instead of downloading it.
- Closing the dialog cancels stale UI updates; generated object URLs are cleaned up when replaced or the component unmounts.
- The current tab stores active scouting and plan context in sessionStorage: traits, bias, screen, formation, expanded card, team, down/distance and objective. Refreshing or returning after a full page reload restores this context. Named profile saves remain separate. Browser storage restrictions can prevent restoration; closing a tab can end its session, so named saves remain appropriate for long-term storage.

Verification: 137 tests passed; build and targeted lint passed. A real sample CallSheetDocument rendered through the same pdf(...).toBlob() API produced a 13,449-byte application/pdf blob with a valid PDF header. Session tests cover plan round-trip, cleared scout state, team context, invalid values and blocked/corrupt storage. These are not a substitute for mobile Safari acceptance.

Device review:

1. Select at least two scout traits and set a non-balanced run/pass tendency. Build the plan, choose a formation, objective and 3rd & Long.
2. Tap Call Sheet. Confirm the loading message appears, followed by Open / Save. Open the PDF, then switch back to the app tab: the original plan should remain.
3. Close the call-sheet dialog and refresh the app tab. Check traits, tendency, situation, formation and objective remain selected. Repeat using a team-generated plan.
4. Try Save PDF. On browsers that display PDFs instead of downloading them, return to the existing app tab.
5. Change traits and plan selections repeatedly before opening Call Sheet. Background PDF rebuilding should no longer interrupt these selections.
6. If another button still ignores taps, record its label, screen, phone/browser, and whether the selection highlights or nothing changes. Other unspecified tap failures have not been reproduced or claimed fixed.
