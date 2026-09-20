# PWA call-sheet actions

This replaces the new-tab viewing flow in PDF_SESSION_REVIEW.md.

- **Save PDF:** uses native file sharing when supported. On iPhone, select Save to Files from the sheet. Cancelling the sheet leaves the plan intact. Other browsers use a download link; if a browser displays the file instead, the link targets a separate browsing context to avoid replacing the plan.
- **View PDF:** renders the generated PDF pages inside the existing dialog, with scrolling and Zoom in / Fit width. No navigation, new tab or native PDF plugin is required for viewing.
- **Cancel:** closes the dialog and returns to the game plan. Other setup dialogs retain their Done label.

PDF.js and its worker are bundled with the app, loaded on demand, and not fetched from a CDN. PDF generation still happens only after Call Sheet is tapped. Canvas preview is visual; the downloadable PDF remains available for native document tools. First-time offline viewing requires the viewer assets to have been loaded before going offline; a loading failure leaves Save PDF available.

Checks: 141 tests passed, production build passed, modified component/helper lint passed, npm audit reports zero vulnerabilities. A real generated two-page call sheet was parsed and both pages rendered to canvas with PDF.js in Node. This does not verify the iOS installed-PWA share sheet or browser layout; test those on device. Node font fallback warnings during that smoke check were due to absent standard font URLs; browser preview explicitly uses system fonts for the document's standard fonts.

Device checks:
1. Tap Call Sheet: Save PDF, View PDF and Cancel should be available when generation finishes.
2. View PDF: scroll through both pages, zoom in, then fit width. Cancel should return directly to the unchanged plan.
3. Save PDF: on a supported iPhone HTTPS app, choose Save to Files; try cancelling the share sheet too.
4. In the local phone HTTP preview, native file sharing may be unavailable. Test View and the download fallback there; test native sharing in the installed HTTPS PWA before calling that path validated.

References: [PDF.js rendering examples](https://mozilla.github.io/pdf.js/examples/), [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share). Native file sharing requires browser support, a secure context and a user gesture. The app checks support at the Save tap.
