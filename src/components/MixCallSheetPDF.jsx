import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { buildPrintCallSheet } from '../engine/printCallSheet.js';

const C = { text: '#142235', muted: '#46566B', gold: '#8A621A', border: '#CED6DF', panel: '#F1F4F7' };
const S = StyleSheet.create({
  page: { padding: 26, height: 792, minHeight: 792, fontFamily: 'Helvetica', fontSize: 8.5, color: C.text },
  header: { borderBottomWidth: 2, borderBottomColor: C.gold, paddingBottom: 8, marginBottom: 10 },
  brand: { color: C.gold, fontSize: 7, letterSpacing: 1.8, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  context: { color: C.muted, fontSize: 8, lineHeight: 1.4, marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: C.text, color: '#FFFFFF' },
  row: { flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: C.border, minHeight: 40 },
  situation: { width: 70, padding: 6, borderRightWidth: .5, borderRightColor: C.border },
  cell: { flex: 1, padding: 4, borderRightWidth: .5, borderRightColor: C.border },
  heading: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', lineHeight: 1.3 },
  play: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', lineHeight: 1.2 },
  formation: { fontSize: 6.5, color: C.muted, lineHeight: 1.2, marginTop: 2 },
  refs: { color: C.gold, fontSize: 6.5, marginTop: 2, fontFamily: 'Helvetica-Bold' },
  note: { fontSize: 8, lineHeight: 1.4, marginTop: 8, color: C.muted },
  columns: { flexDirection: 'row', gap: 16, marginTop: 6 },
  column: { width: 272 },
  section: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 6, color: C.gold },
  entry: { borderBottomWidth: .5, borderBottomColor: C.border, paddingBottom: 7, marginBottom: 7 },
  entryText: { fontSize: 8.5, lineHeight: 1.35 },
  tag: { fontFamily: 'Helvetica-Bold', color: C.gold },
  box: { backgroundColor: C.panel, borderWidth: .5, borderColor: C.border, padding: 10, marginTop: 10 },
  footer: { position: 'absolute', left: 26, right: 26, bottom: 17, flexDirection: 'row', justifyContent: 'space-between', fontSize: 6.5, color: C.muted },
});
const clean = text => String(text || '').replace(/[—–‑]/g, '-').replace(/’/g, "'");
function Header({ title, data }) { return <View style={S.header}>
  <Text style={S.brand}>SCHEME BUILDERS / DEFENSIVE GAMEPLAN</Text>
  <Text style={S.title}>{title}</Text>
  <Text style={S.context}>{clean(`${data.opponentName ? data.opponentName + ' | ' : ''}${data.contextLabel} | ${data.myBook} | ${data.runPassLabel}`)}</Text>
</View>; }
function Footer() { return <View style={S.footer} fixed><Text>Fit scores are rankings, not probabilities. Full call details: schemebuilders.com</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>; }
function Note({ label, children }) { return <Text style={S.note}><Text style={S.tag}>{label} </Text>{clean(children)}</Text>; }

export default function MixCallSheetDocument({ data }) {
  const { rows, setups, jobs, hasAppReferences } = buildPrintCallSheet(data);
  return <Document title={`${data.opponentName || 'Defensive'} Call Sheet`} author="Scheme Builders">
    <Page size="LETTER" style={S.page} wrap={false}>
      <Header title="SITUATIONAL CALL MENU" data={data} />
      <Text style={[S.context, { marginBottom: 9 }]}>Pick within each row; the first column is a starting option, not an every-snap prescription. S = setup (page 2). {data.includeCoaching !== false ? 'J = your job (page 2).' : 'User coaching hidden.'} Match the actual offensive personnel.</Text>
      <View style={S.tableHeader}><View style={S.situation}><Text style={S.heading}>DOWN / GAIN</Text></View>{(data.edited ? ['YOUR STARTING CALL', 'ALTERNATIVE 1', 'ALTERNATIVE 2', 'ALTERNATIVE 3'] : ['STARTING CALL', 'CHANGE THE LOOK', 'COUNTER', 'EXTRA / PRESSURE']).map(label => <View style={S.cell} key={label}><Text style={S.heading}>{label}</Text></View>)}</View>
      {rows.map((row, index) => <View key={row.label} style={[S.row, index % 2 ? { backgroundColor: C.panel } : {}]}>
        <View style={S.situation}><Text style={S.heading}>{row.label.replace(' & ', '\n')}</Text><Text style={S.formation}>Sample: {row.distance} yd</Text></View>
        {['foundation', 'coverage-variation', 'response-counter', 'extra'].map((role,slot) => {
          const call = data.edited ? row.calls[slot] : row.calls.find(c => role === 'extra' ? ['additional-variation', 'conditional-pressure', 'pressure-look'].includes(c.role) : c.role === role);
          return <View key={role} style={S.cell}>{call ? <>
            <Text style={S.play}>{call.call}</Text><Text style={S.formation}>{call.formation}</Text>
            <Text style={S.refs}>{call.setupRef}{data.includeCoaching !== false ? ' / '+call.jobRef : ''}{call.pressure ? ' / PRESSURE' : call.presentation ? ' / LOOK' : ''}</Text>
          </> : <Text style={S.formation}>{row.editorExcluded ? 'Excluded by you' : data.edited ? '-' : 'No qualifying option'}</Text>}</View>;
        })}
      </View>)}
      <Note label="MIX, THEN READ.">Vary coverage before the offense settles on one tell. PRESSURE sends extra rushers; cover the hot outlet. LOOK presents a mugged front with four or fewer stock rushers and deep help. Neither is mandatory.</Note>
      <Note label="DISTANCE KEY.">Short: 1-3 yards. Medium: 4-6. Long: 7+. Rows use the sample distances shown; set the exact distance in the app. A formation change requires a between-snap personnel / audible check.</Note>
      <Footer />
    </Page>
    <Page size="LETTER" style={S.page} wrap={false}>
      <Header title={data.includeCoaching === false ? "QUICK SETUP KEY" : "SETUP & COACHING KEY"} data={data} />
      <Text style={S.context}>Apply only the S / J references printed in your selected call. Shared instructions appear once here. User position: {data.userPosition}.</Text>
      <View style={S.columns}>
        <View style={[S.column,data.includeCoaching === false ? {width:560} : {}]}><Text style={S.section}>S / QUICK SETUP</Text>
          {setups.map(item => <View style={[S.entry, { flexDirection: 'row' }]} key={item.id}><Text style={[S.entryText, S.tag, { width: 22 }]}>{item.id}</Text><View style={{ flex: 1 }}>{clean(item.text).split(' · ').map((line, i) => <Text key={i} style={S.entryText}>{line}</Text>)}</View></View>)}
          {!setups.length && <Text style={S.entryText}>{data.edited ? "No included calls. Restore calls in the editor to print their setup." : "No verified calls for this scout. Select the offensive look and your available playbook in the app."}</Text>}
          <Note label="RESET BETWEEN CALLS.">Do not stack different setup profiles. Restore settings to the values prescribed by the next call. Confirm audibles and assignments.</Note>
          <Note label="SETUP TRADEOFFS.">Aggressive zones contest short throws but expose deeper windows. Conservative zones protect depth while conceding underneath space. Deeper corners give more cushion. Check the exact match-coverage effect in the app.</Note>
        </View>
        {data.includeCoaching !== false && <View style={S.column}><Text style={S.section}>J / YOUR JOB</Text>
          {jobs.map(item => <View style={S.entry} key={item.id}><Text style={S.entryText}><Text style={S.tag}>{item.id}  </Text>{clean(item.text)}</Text></View>)}
          {!jobs.length && <Text style={S.entryText}>Keep your assigned receiver or zone covered. Rebuild the sheet after adding scouting information.</Text>}
        </View>}
      </View>
      {data.includeCoaching !== false && <View style={S.box}>
        <Text style={S.heading}>SITUATIONAL CHECKS</Text>
        <Note label="SHORT / MEDIUM">Win the gain required. Keep the run, QB keeper and immediate throw covered. On second-and-short, retain help against a shot. Tackle at the catch on conversion downs.</Note>
        <Note label="LONG">Protect the sticks and deeper routes, then rally to the underneath catch. Account for screens, draws and QB escapes. Long yardage does not prove a pass.</Note>
        <Note label="GOAL LINE / TWO-MINUTE">Use actual personnel, distance and game objective. Neither field location nor the clock alone justifies goal-line personnel or Prevent.</Note>
      </View>
      }
      <Note label={hasAppReferences ? 'APP REFERENCE.' : 'DETAILS.'}>{hasAppReferences ? 'APP means this call has additional setup or user detail that exceeds the quick-reference space. Open that call in the app before using it.' : 'This sheet is a quick reference. Expand a call in the app for its individual watch-outs, adjustment reasons, tradeoffs and offensive-response explanation.'}</Note>
      <Footer />
    </Page>
  </Document>;
}
