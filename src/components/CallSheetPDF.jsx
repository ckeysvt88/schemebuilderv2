import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { buildCallSheetData } from '../engine/buildCallSheet.js';

// ── Print-friendly light theme ────────────────────────────────────────────────
const C = {
  bg:          '#FFFFFF',
  navy:        '#07090F',
  gold:        '#996600',
  goldBorder:  '#C8960C',
  goldLight:   '#FFF8E0',
  goldDark:    '#4A3000',
  border:      '#CDD5DF',
  borderMid:   '#8A9AB0',
  text1:       '#0E1525',
  text2:       '#364A5E',
  text3:       '#6A7A90',
  rowAlt:      '#F4F6FA',
  hdrBg:       '#07090F',
  hdrText:     '#FFFFFF',
  sectionBg:   '#EDF0F5',
  noteBg:      '#FFFBF0',
  noteBorder:  '#C8960C',

  run:      '#B05820',
  pass:     '#1A4FA8',
  hybrid:   '#6A40A8',
  pressure: '#A02020',

  coreTagBg:  '#FFF3CC',
  coreTagBdr: '#C8960C',
  coreTagTxt: '#7A5000',
  suppTagBg:  '#EEF2F8',
  suppTagBdr: '#9AAAC0',
  suppTagTxt: '#3A4A60',
};

const PC = { run: C.run, pass: C.pass, hybrid: C.hybrid, pressure: C.pressure };
const PL = { run: 'RUN STOP', pass: 'PASS DEF', hybrid: 'HYBRID', pressure: 'PRESSURE' };

function sitColor(label) {
  if (label.startsWith('1ST'))   return '#183870';
  if (label.startsWith('2ND'))   return '#185830';
  if (label.startsWith('3RD'))   return '#783208';
  if (label.startsWith('4TH'))   return '#781818';
  if (label.startsWith('GOAL'))  return '#481878';
  if (label.startsWith('2-MIN')) return '#185858';
  return C.navy;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Pages
  page: {
    backgroundColor: C.bg,
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 18,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: C.text1,
  },

  // ── PAGE 1: Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: C.goldBorder,
  },
  hdrBrand:    { fontSize: 6, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 2 },
  hdrTitle:    { fontSize: 17, color: C.navy, fontFamily: 'Helvetica-Bold' },
  hdrSubtitle: { fontSize: 7, color: C.text3, marginTop: 2 },
  hdrRight:    { alignItems: 'flex-end' },
  hdrMeta:     { fontSize: 7, color: C.text2, marginBottom: 1 },
  hdrBold:     { fontSize: 7.5, color: C.navy, fontFamily: 'Helvetica-Bold' },

  // ── Body two-column ──
  body:    { flexDirection: 'row', flex: 1 },
  leftCol: { width: 152 },
  rightCol:{ flex: 1, paddingLeft: 12 },

  // Section headers
  secHdr:    { backgroundColor: C.hdrBg, paddingVertical: 4, paddingHorizontal: 8, marginBottom: 7 },
  secHdrTxt: { color: C.hdrText, fontSize: 6.5, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },

  // ── Offensive Profile ──
  profGroup:    { marginBottom: 8 },
  profGrpLabel: { fontSize: 6, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 },
  profTrait:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2.5 },
  profDot:      { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: C.goldBorder, marginRight: 5, marginTop: 1.5 },
  profTraitTxt: { fontSize: 7, color: C.text1, flex: 1, lineHeight: 1.35 },
  noProfile:    { fontSize: 7, color: C.text3, fontStyle: 'italic' },

  // ── Matrix table ──
  matHdrRow: { flexDirection: 'row', backgroundColor: C.hdrBg },
  matRow:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  matRowAlt: { backgroundColor: C.rowAlt },
  matTipRow: { paddingHorizontal: 6, paddingVertical: 2.5, backgroundColor: '#F8F4EC', borderBottomWidth: 1, borderBottomColor: C.border },
  matTipTxt: { fontSize: 5.5, color: '#5A4010', fontStyle: 'italic', lineHeight: 1.35 },

  // Column widths
  cSit:  { width: 70,  paddingVertical: 5, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: C.border, justifyContent: 'center' },
  cPrim: { flex: 3,    paddingVertical: 5, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: C.border },
  cPct:  { width: 30,  paddingVertical: 5, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: C.border, alignItems: 'center', justifyContent: 'center' },
  cSec:  { flex: 2.4,  paddingVertical: 5, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: C.border },
  cPct2: { width: 26,  paddingVertical: 5, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },

  // Header column widths
  cSitH:  { width: 70,  paddingVertical: 4, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)', justifyContent: 'center' },
  cPrimH: { flex: 3,    paddingVertical: 4, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' },
  cPctH:  { width: 30,  paddingVertical: 4, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  cSecH:  { flex: 2.4,  paddingVertical: 4, paddingHorizontal: 6, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' },
  cPct2H: { width: 26,  paddingVertical: 4, paddingHorizontal: 4, alignItems: 'center' },

  matHdrTxt: { color: C.hdrText, fontSize: 6, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  sitTxt:    { fontSize: 7, fontFamily: 'Helvetica-Bold' },
  callName:  { fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 1 },
  callCov:   { fontSize: 6, color: C.text3 },
  callPct:   { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  callBzLbl: { fontSize: 5, marginTop: 1 },
  emptyCell: { fontSize: 6.5, color: C.text3, fontStyle: 'italic' },

  // ── Footer ──
  footer:    { marginTop: 8, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerTxt: { fontSize: 6, color: C.text3 },

  // ── PAGE 2: Formation Cards ──
  p2Hdr:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: C.goldBorder },
  p2Title: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.navy },
  p2Brand: { fontSize: 6, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 2 },
  p2Sub:   { fontSize: 7, color: C.text3 },

  fmCard:    { marginBottom: 8, borderWidth: 1, borderColor: C.border, borderRadius: 3 },
  fmHdr:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  fmHdrL:    { flex: 1 },
  fmNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  fmName:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.navy, marginRight: 6 },
  fmBadge:   { paddingVertical: 2, paddingHorizontal: 5, borderRadius: 2, marginRight: 4 },
  fmBadgeTxt:{ fontSize: 5.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  fmPersBdg: { paddingVertical: 2, paddingHorizontal: 5, borderRadius: 2, borderWidth: 1, borderColor: C.border },
  fmPersTxt: { fontSize: 5.5, color: C.text2 },
  fmHdrR:    { alignItems: 'flex-end', paddingLeft: 10 },
  fmScore:   { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.gold, lineHeight: 1 },
  fmBlitzRow:{ flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  fmBlitzPct:{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginRight: 3 },
  fmBlitzLbl:{ fontSize: 5.5, color: C.text3 },

  // DC Coaching Note
  fmNote:    { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.noteBg, borderBottomWidth: 1, borderBottomColor: C.noteBorder, paddingVertical: 5, paddingHorizontal: 10 },
  fmNoteBar: { width: 2.5, backgroundColor: C.goldBorder, borderRadius: 1, marginRight: 7, alignSelf: 'stretch' },
  fmNoteLbl: { fontSize: 5.5, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 2 },
  fmNoteTxt: { fontSize: 6.5, color: C.goldDark, lineHeight: 1.4, fontStyle: 'italic', flex: 1 },

  fmBody:    { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 10 },
  fmLeft:    { flex: 1, paddingRight: 8 },
  fmRight:   { width: 164 },

  fmSecLbl:  { fontSize: 5.5, color: C.text3, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 },

  // Coverages
  covRow:   { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  covPill:  { paddingVertical: 2.5, paddingHorizontal: 5, borderWidth: 1, borderColor: C.border, borderRadius: 2, marginRight: 4, marginBottom: 3 },
  covStars: { fontSize: 5.5, color: C.gold, marginBottom: 1 },
  covName:  { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: C.text1, marginBottom: 1 },
  covTag:   { fontSize: 5.5, color: C.text3 },

  // Why Selected tags
  tagRow:    { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  tagCore:   { paddingVertical: 1.5, paddingHorizontal: 4, borderRadius: 2, backgroundColor: C.coreTagBg, borderWidth: 1, borderColor: C.coreTagBdr, marginRight: 3, marginBottom: 2.5 },
  tagCoreTxt:{ fontSize: 5.5, color: C.coreTagTxt, fontFamily: 'Helvetica-Bold' },
  tagSupp:   { paddingVertical: 1.5, paddingHorizontal: 4, borderRadius: 2, backgroundColor: C.suppTagBg, borderWidth: 1, borderColor: C.suppTagBdr, marginRight: 3, marginBottom: 2.5 },
  tagSuppTxt:{ fontSize: 5.5, color: C.suppTagTxt },

  // Pre-snap keys
  preList:  { marginBottom: 6 },
  preItem:  { flexDirection: 'row', marginBottom: 2.5 },
  preArrow: { fontSize: 7, color: C.goldBorder, marginRight: 4 },
  preTxt:   { fontSize: 6.5, color: C.text2, flex: 1, lineHeight: 1.35 },

  // Call guide mini-table
  callTbl:    { borderWidth: 1, borderColor: C.border },
  callTblRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  callDnCell: { width: 68, paddingVertical: 3.5, paddingHorizontal: 5, backgroundColor: C.sectionBg, borderRightWidth: 1, borderRightColor: C.border, justifyContent: 'center' },
  callDnTxt:  { fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.navy },
  callBdyCell:{ flex: 1, paddingVertical: 3.5, paddingHorizontal: 5 },
  callCallTxt:{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: C.text1 },
  callNoteTxt:{ fontSize: 5.5, color: C.text3, fontStyle: 'italic', marginTop: 0.5 },

  // ── PAGE 3: Situational Coaching Guide ──
  p3Hdr:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: C.goldBorder },
  p3Title:     { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.navy },
  p3Brand:     { fontSize: 6, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 2 },
  p3Sub:       { fontSize: 7, color: C.text3 },

  guideEntry:  { marginBottom: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#E8EDF4' },
  guideHdrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },
  guideSitLbl: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  guidePers:   { fontSize: 5.5, color: C.text3, fontStyle: 'italic' },
  guideCallRow:{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  guideCallLbl:{ fontSize: 5.5, color: C.text3, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginRight: 5 },
  guideCallTxt:{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', marginRight: 6 },
  guideCallPct:{ fontSize: 6, color: C.text3 },
  guideTipLbl: { fontSize: 5.5, color: C.gold, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginBottom: 1.5 },
  guideTipTxt: { fontSize: 6.5, color: C.text2, lineHeight: 1.4 },
  guideNoCall: { fontSize: 6.5, color: C.text3, fontStyle: 'italic', marginBottom: 2 },
});

// ── Sub-components ────────────────────────────────────────────────────────────

function MatrixRow({ row, isAlt }) {
  const sc = sitColor(row.label);
  return (
    <>
      <View style={[S.matRow, isAlt && S.matRowAlt]}>
        <View style={S.cSit}>
          <Text style={[S.sitTxt, { color: sc }]}>{row.label}</Text>
        </View>

        {/* Primary call */}
        <View style={S.cPrim}>
          {row.primary ? (
            <>
              <Text style={[S.callName, { color: PC[row.primary.priority] || C.text1 }]}>
                {row.primary.name}
              </Text>
              <Text style={S.callCov}>{row.primary.coverage}</Text>
            </>
          ) : <Text style={S.emptyCell}>—</Text>}
        </View>

        {/* Primary match % + blitz label */}
        <View style={S.cPct}>
          {row.primary && (
            <>
              <Text style={[S.callPct, { color: PC[row.primary.priority] || C.gold }]}>
                {row.primary.sc}%
              </Text>
              <Text style={[S.callBzLbl, { color: row.primary.blitzColor || C.text3 }]}>
                {row.primary.blitz}% bz
              </Text>
            </>
          )}
        </View>

        {/* Secondary call */}
        <View style={S.cSec}>
          {row.secondary ? (
            <>
              <Text style={[S.callName, { color: PC[row.secondary.priority] || C.text1, fontSize: 6.5 }]}>
                {row.secondary.name}
              </Text>
              <Text style={S.callCov}>{row.secondary.coverage}</Text>
            </>
          ) : <Text style={S.emptyCell}>—</Text>}
        </View>

        {/* Secondary match % + blitz label */}
        <View style={S.cPct2}>
          {row.secondary && (
            <>
              <Text style={[S.callPct, { fontSize: 7, color: PC[row.secondary.priority] || C.gold }]}>
                {row.secondary.sc}%
              </Text>
              <Text style={[S.callBzLbl, { color: row.secondary.blitzColor || C.text3 }]}>
                {row.secondary.blitz}%
              </Text>
            </>
          )}
        </View>
      </View>

      {/* DC Tip inline — shown for all situations that have one */}
      {row.dcTip && (
        <View style={S.matTipRow}>
          <Text style={S.matTipTxt}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontStyle: 'normal' }}>DC: </Text>
            {row.dcTip}
          </Text>
        </View>
      )}
    </>
  );
}

function FormationCard({ fm, rank }) {
  const prColor = PC[fm.priority] || C.navy;
  return (
    <View style={[S.fmCard, { borderLeftWidth: 3, borderLeftColor: prColor }]}>
      {/* Card header — name, badges, match score */}
      <View style={S.fmHdr}>
        <View style={S.fmHdrL}>
          <View style={S.fmNameRow}>
            <Text style={S.fmName}>#{rank} {fm.name}</Text>
            <View style={[S.fmBadge, { backgroundColor: prColor }]}>
              <Text style={S.fmBadgeTxt}>{PL[fm.priority] || fm.priority}</Text>
            </View>
            <View style={S.fmPersBdg}>
              <Text style={S.fmPersTxt}>{fm.personnel}</Text>
            </View>
          </View>
        </View>
        <View style={S.fmHdrR}>
          <Text style={S.fmScore}>{fm.sc}%</Text>
          <View style={S.fmBlitzRow}>
            <Text style={[S.fmBlitzPct, { color: fm.blitzColor || C.text3 }]}>{fm.blitz}%</Text>
            <Text style={S.fmBlitzLbl}>{fm.blitzLabel}</Text>
          </View>
        </View>
      </View>

      {/* DC Coaching Note — the expert insight that makes this call work */}
      {fm.dcNote ? (
        <View style={S.fmNote}>
          <View style={S.fmNoteBar} />
          <View style={{ flex: 1 }}>
            <Text style={S.fmNoteLbl}>DC NOTE</Text>
            <Text style={S.fmNoteTxt}>{fm.dcNote}</Text>
          </View>
        </View>
      ) : null}

      {/* Card body */}
      <View style={S.fmBody}>
        {/* Left: coverages + why selected */}
        <View style={S.fmLeft}>
          <Text style={S.fmSecLbl}>COVERAGES</Text>
          <View style={S.covRow}>
            {fm.coverages.map((cov, i) => (
              <View key={i} style={S.covPill}>
                <Text style={S.covStars}>
                  {'★'.repeat(cov.rating)}{'☆'.repeat(5 - cov.rating)}
                </Text>
                <Text style={S.covName}>{cov.name}</Text>
                {cov.tag ? <Text style={S.covTag}>{cov.tag}</Text> : null}
              </View>
            ))}
          </View>

          {(fm.coreHits.length > 0 || fm.suppHits.length > 0) && (
            <>
              <Text style={S.fmSecLbl}>WHY SELECTED</Text>
              <View style={S.tagRow}>
                {fm.coreHits.map((t, i) => (
                  <View key={`c${i}`} style={S.tagCore}>
                    <Text style={S.tagCoreTxt}>{t}</Text>
                  </View>
                ))}
                {fm.suppHits.map((t, i) => (
                  <View key={`s${i}`} style={S.tagSupp}>
                    <Text style={S.tagSuppTxt}>{t}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Right: pre-snap keys + call guide */}
        <View style={S.fmRight}>
          {fm.preSnap.length > 0 && (
            <>
              <Text style={S.fmSecLbl}>PRE-SNAP KEYS</Text>
              <View style={S.preList}>
                {fm.preSnap.slice(0, 3).map((key, i) => (
                  <View key={i} style={S.preItem}>
                    <Text style={S.preArrow}>▸</Text>
                    <Text style={S.preTxt}>{key}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {fm.callsheet.length > 0 && (
            <>
              <Text style={S.fmSecLbl}>CALL GUIDE</Text>
              <View style={S.callTbl}>
                {fm.callsheet.map((c, i) => (
                  <View
                    key={i}
                    style={[S.callTblRow, i === fm.callsheet.length - 1 && { borderBottomWidth: 0 }]}
                  >
                    <View style={S.callDnCell}>
                      <Text style={S.callDnTxt}>{c.down}</Text>
                    </View>
                    <View style={S.callBdyCell}>
                      <Text style={S.callCallTxt}>{c.call}</Text>
                      {c.note ? <Text style={S.callNoteTxt}>{c.note}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function GuideEntry({ entry, isLast }) {
  const sc = sitColor(entry.label);
  const hasPrimary = entry.primary && entry.primary.name;

  return (
    <View style={[S.guideEntry, isLast && { borderBottomWidth: 0, marginBottom: 0 }]}>
      {/* Situation label + likely personnel */}
      <View style={S.guideHdrRow}>
        <Text style={[S.guideSitLbl, { color: sc }]}>{entry.label}</Text>
        {entry.likelyPersonnel ? (
          <Text style={S.guidePers}>Expect: {entry.likelyPersonnel}</Text>
        ) : null}
      </View>

      {/* Primary call */}
      {hasPrimary ? (
        <View style={S.guideCallRow}>
          <Text style={S.guideCallLbl}>CALL</Text>
          <Text style={[S.guideCallTxt, { color: PC[entry.primary.priority] || C.text1 }]}>
            {entry.primary.name} · {entry.primary.coverage}
          </Text>
          <Text style={S.guideCallPct}>{entry.primary.sc}% · {entry.primary.blitzLabel}</Text>
        </View>
      ) : (
        <Text style={S.guideNoCall}>No formation matched for this situation</Text>
      )}

      {/* DC Tip */}
      {entry.dcTip ? (
        <>
          <Text style={S.guideTipLbl}>DC KEY</Text>
          <Text style={S.guideTipTxt}>{entry.dcTip}</Text>
        </>
      ) : null}
    </View>
  );
}

// ── PDF Document ──────────────────────────────────────────────────────────────
function CallSheetDocument({ data }) {
  const {
    profile, situationMatrix, topFormations, situationGuide,
    myBook, runPassLabel, date, totalFormations,
  } = data;

  return (
    <Document title="Defensive Call Sheet" author="Scheme Builders">

      {/* ══ PAGE 1: Offensive Profile + Down/Distance Matrix ══ */}
      <Page size="LETTER" style={S.page}>
        <View style={S.header}>
          <View>
            <Text style={S.hdrBrand}>SCHEME BUILDERS</Text>
            <Text style={S.hdrTitle}>DEFENSIVE CALL SHEET</Text>
            <Text style={S.hdrSubtitle}>CFB26 Defensive Scheme Builder — Game Preparation</Text>
          </View>
          <View style={S.hdrRight}>
            <Text style={S.hdrMeta}>{date}</Text>
            <Text style={S.hdrBold}>Playbook: {myBook}</Text>
            <Text style={S.hdrMeta}>Tendency: {runPassLabel}  ·  {totalFormations} formations matched</Text>
          </View>
        </View>

        <View style={S.body}>
          {/* Left: Offensive Profile */}
          <View style={S.leftCol}>
            <View style={S.secHdr}>
              <Text style={S.secHdrTxt}>OFFENSIVE PROFILE</Text>
            </View>
            {profile.length === 0 ? (
              <Text style={S.noProfile}>No traits scouted</Text>
            ) : profile.map((grp, i) => (
              <View key={i} style={S.profGroup}>
                <Text style={S.profGrpLabel}>{grp.group.toUpperCase()}</Text>
                {grp.traits.map((t, j) => (
                  <View key={j} style={S.profTrait}>
                    <View style={S.profDot} />
                    <Text style={S.profTraitTxt}>{t}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Right: Situation Matrix */}
          <View style={S.rightCol}>
            <View style={S.secHdr}>
              <Text style={S.secHdrTxt}>DOWN &amp; DISTANCE MATRIX</Text>
            </View>

            <View style={S.matHdrRow}>
              <View style={S.cSitH}><Text style={S.matHdrTxt}>SITUATION</Text></View>
              <View style={S.cPrimH}><Text style={S.matHdrTxt}>PRIMARY CALL</Text></View>
              <View style={S.cPctH}><Text style={S.matHdrTxt}>MATCH</Text></View>
              <View style={S.cSecH}><Text style={S.matHdrTxt}>SECONDARY CALL</Text></View>
              <View style={S.cPct2H}><Text style={S.matHdrTxt}>%</Text></View>
            </View>

            {situationMatrix.map((row, i) => (
              <MatrixRow key={i} row={row} isAlt={i % 2 === 1} />
            ))}
          </View>
        </View>

        <View style={S.footer}>
          <Text style={S.footerTxt}>Scheme Builders · CFB26 Defensive Scheme Builder · CONFIDENTIAL — GAME PREP</Text>
          <Text style={S.footerTxt}>Page 1 of 3</Text>
        </View>
      </Page>

      {/* ══ PAGE 2: Top Formation Cards ══ */}
      <Page size="LETTER" style={S.page}>
        <View style={S.p2Hdr}>
          <View>
            <Text style={S.p2Brand}>SCHEME BUILDERS</Text>
            <Text style={S.p2Title}>TOP FORMATIONS</Text>
          </View>
          <Text style={S.p2Sub}>Ranked by match score · Playbook: {myBook} · {runPassLabel} tendency</Text>
        </View>

        {topFormations.map((fm, i) =>
          fm ? <FormationCard key={i} fm={fm} rank={i + 1} /> : null
        )}

        <View style={S.footer}>
          <Text style={S.footerTxt}>Scheme Builders · CFB26 Defensive Scheme Builder · CONFIDENTIAL — GAME PREP</Text>
          <Text style={S.footerTxt}>Page 2 of 3</Text>
        </View>
      </Page>

      {/* ══ PAGE 3: Situational Coaching Guide ══ */}
      <Page size="LETTER" style={S.page}>
        <View style={S.p3Hdr}>
          <View>
            <Text style={S.p3Brand}>SCHEME BUILDERS</Text>
            <Text style={S.p3Title}>SITUATIONAL COACHING GUIDE</Text>
          </View>
          <Text style={S.p3Sub}>DC keys · likely personnel · best call — for every game situation</Text>
        </View>

        {situationGuide.map((entry, i) => (
          <GuideEntry
            key={i}
            entry={entry}
            isLast={i === situationGuide.length - 1}
          />
        ))}

        <View style={S.footer}>
          <Text style={S.footerTxt}>Scheme Builders · CFB26 Defensive Scheme Builder · CONFIDENTIAL — GAME PREP</Text>
          <Text style={S.footerTxt}>Page 3 of 3</Text>
        </View>
      </Page>

    </Document>
  );
}

// ── Exported button component ─────────────────────────────────────────────────
// variant="compact"  →  small header button (default)
// variant="full"     →  wide, prominent banner button for top-of-page placement
export function ExportPDFButton({ rawScored, sel, myBook, runPass, variant = 'compact' }) {
  if (!rawScored || rawScored.length === 0) return null;

  const data     = buildCallSheetData({ rawScored, sel, myBook, runPass });
  const fileName = `call-sheet-${new Date().toISOString().slice(0, 10)}.pdf`;
  const isFull   = variant === 'full';

  return (
    <PDFDownloadLink
      document={<CallSheetDocument data={data} />}
      fileName={fileName}
      style={{ textDecoration: 'none', display: isFull ? 'block' : 'inline-block' }}
    >
      {({ loading }) =>
        isFull ? (
          // ── Full-width banner button ──────────────────────────────────────
          <button
            disabled={loading}
            style={{
              width: '100%',
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: loading ? 'transparent' : 'rgba(200,150,12,0.07)',
              border: '1px solid var(--color-gold-border, #4a3808)',
              borderRadius: 'var(--r-sm)',
              color: loading ? 'var(--color-text-3)' : 'var(--color-gold)',
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: '0.5px',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 150ms ease',
              opacity: loading ? 0.55 : 1,
            }}
          >
            {loading
              ? 'Building Call Sheet…'
              : 'Export Defensive Call Sheet  ↓  PDF  (3 pages)'}
          </button>
        ) : (
          // ── Compact header button ─────────────────────────────────────────
          <button
            disabled={loading}
            style={{
              minHeight: 36,
              padding: '0 13px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--r-sm)',
              color: loading ? 'var(--color-text-3)' : 'var(--color-text-2)',
              fontSize: 12,
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '…' : 'PDF'}
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
