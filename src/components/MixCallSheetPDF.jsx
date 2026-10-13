import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MIX_ROLE_LABELS } from '../engine/sharedCallInstructions.js';

const C = { text: '#0E1525', muted: '#364A5E', gold: '#996600', border: '#CDD5DF', panel: '#F4F6FA' };
const roleColors = { foundation: C.gold, 'coverage-variation': '#1A4FA8', 'response-counter': '#2A7040', 'conditional-pressure': '#A02020', 'additional-variation': '#6A40A8' };
const S = StyleSheet.create({
  page: { padding: 28, fontFamily: 'Helvetica', fontSize: 8, color: C.text },
  header: { borderBottomWidth: 2, borderBottomColor: '#C8960C', paddingBottom: 8, marginBottom: 10 },
  brand: { color: C.gold, fontSize: 7, letterSpacing: 2, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  title: { fontSize: 17, fontFamily: 'Helvetica-Bold' },
  context: { color: C.muted, fontSize: 8, lineHeight: 1.4, marginBottom: 5 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#07090F', color: '#FFFFFF' },
  row: { flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: C.border },
  situation: { width: 68, padding: 6, borderRightWidth: .5, borderRightColor: C.border },
  cell: { flex: 1, padding: 6, borderRightWidth: .5, borderRightColor: C.border },
  heading: { fontSize: 7, fontFamily: 'Helvetica-Bold', lineHeight: 1.3 },
  play: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', lineHeight: 1.3 },
  formation: { fontSize: 7, color: C.muted, lineHeight: 1.3, marginTop: 2 },
  cue: { fontSize: 8, color: C.muted, lineHeight: 1.4, marginTop: 5 },
  cueLabel: { color: C.gold, fontFamily: 'Helvetica-Bold' },
  shared: { backgroundColor: '#F2EAD6', borderWidth: .5, borderColor: C.border, padding: 9, marginBottom: 10 },
  sharedTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  cards: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: { width: 273, padding: 10, backgroundColor: C.panel, borderWidth: .5, borderColor: C.border, borderLeftWidth: 3 },
  cardTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, marginTop: 4 },
  footer: { position: 'absolute', left: 28, right: 28, bottom: 18, flexDirection: 'row', justifyContent: 'space-between', fontSize: 6, color: C.muted },
});
const clean = text => String(text || '').replace(/[—–‑]/g, '-').replace(/’/g, "'");
function Cue({ label, children }) { return <Text style={S.cue}><Text style={S.cueLabel}>{label} </Text>{clean(children)}</Text>; }
function Header({ title }) { return <View style={S.header}><Text style={S.brand}>SCHEME BUILDERS</Text><Text style={S.title}>{title}</Text></View>; }
function Footer() { return <View style={S.footer} fixed><Text>Fit scores are rankings, not success probabilities. | schemebuilders.com</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>; }
function CoachingCard({ call }) {
  return <View wrap={false} style={[S.card, { borderLeftColor: roleColors[call.role] }]}>
    <Text style={[S.heading, { color: roleColors[call.role] }]}>{MIX_ROLE_LABELS[call.role].toUpperCase()}</Text>
    <Text style={S.cardTitle}>{call.call}</Text><Text style={S.formation}>{call.formation} | {call.sc}/100 fit</Text>
    <Cue label="USE">{call.useWhen}</Cue>
    {call.opponentRead && <Cue label="POSSIBLE OFFENSIVE READ">{`${call.opponentRead} Anticipated, not observed.`}</Cue>}
    {!!call.localSetup.length && <Cue label="ADDITIONAL SETUP">{call.localSetup.join(' · ')}</Cue>}
    {call.localUserJob && <Cue label="YOUR JOB">{call.localUserJob}</Cue>}
    {call.localWatchFor && <Cue label="WATCH">{call.localWatchFor}</Cue>}
    {!!call.tradeoffs.length && <Cue label="TRADEOFFS">{call.tradeoffs.map(t => `${t.threat}: ${t.watchFor}`).join(' ')}</Cue>}
    {call.localAdjustmentSettings.map(item => <Cue key={item.setting} label={item.setting.toUpperCase()}>{`${item.value}. ${item.why || ''} ${item.tradeoff ? 'Tradeoff: ' + item.tradeoff : ''}`}</Cue>)}
    <Cue label="CALL CHECK">{call.setupWarning}</Cue>
  </View>;
}

export default function MixCallSheetDocument({ data }) {
  const rows = data.situationMatrix.filter(row => row.down);
  return <Document title="Defensive Call Mix" author="Scheme Builders">
    <Page size="LETTER" style={S.page}>
      <Header title="DEFENSIVE CALL MIX" />
      <Text style={S.context}>{data.contextLabel} | Playbook: {data.myBook} | User: {data.userPosition} | {data.date}</Text>
      <Text style={S.context}>Opponent: {data.runPassLabel} · {data.profile.flatMap(group => group.traits).join(' · ') || 'No traits scouted'}</Text>
      <Text style={S.context}>Use a mix, not a fixed sequence. Match the actual down, personnel and offensive response. Detailed coaching follows for each situation.</Text>
      <View style={S.tableHeader}><View style={S.situation}><Text style={S.heading}>SITUATION</Text></View>{['FOUNDATION', 'VARIATION', 'COUNTER', 'EXTRA / PRESSURE'].map(label => <View style={S.cell} key={label}><Text style={S.heading}>{label}</Text></View>)}</View>
      {rows.map((row, index) => <View key={row.label} wrap={false} style={[S.row, index % 2 === 1 ? { backgroundColor: C.panel } : {}]}>
        <View style={S.situation}><Text style={S.heading}>{row.label}</Text><Text style={S.formation}>{row.distance} yards</Text></View>
        {['foundation', 'coverage-variation', 'response-counter', 'extra'].map(role => {
          const call = row.plannedMix.calls.find(c => role === 'extra' ? ['additional-variation', 'conditional-pressure'].includes(c.role) : c.role === role);
          return <View key={role} style={S.cell}>{call ? <>
            {call.pressure && <Text style={[S.heading, { color: roleColors['conditional-pressure'] }]}>PRESSURE</Text>}
            <Text style={S.play}>{call.call}</Text><Text style={S.formation}>{call.formation}</Text>
          </> : <Text style={S.formation}>No qualifying call</Text>}</View>;
        })}
      </View>)}
      <Cue label="MIXING KEY">Foundation is part of the mix. Variation changes the coverage; a counter addresses a possible offensive answer. Pressure is conditional and requires an answer to the hot outlet.</Cue>
      <Cue label="GOAL LINE / TWO-MINUTE">Set the actual personnel, down, distance and game objective. Field location or clock alone does not justify goal-line personnel or Prevent.</Cue>
      <Footer />
    </Page>
    {rows.map(row => {
      const { shared, calls } = row.mixInstructions;
      return <Page key={row.label} size="LETTER" style={S.page}>
        <Header title="SITUATIONAL COACHING GUIDE" />
        <Text style={S.sharedTitle}>{row.label} - {row.distance} YARDS</Text><Text style={[S.context, { marginTop: 5 }]}>{clean(row.purpose.text)}</Text>
        {(shared.setup.length > 0 || shared.userJob || shared.watchFor) && <View style={S.shared} wrap={false}>
          <Text style={S.sharedTitle}>APPLIES TO ALL {calls.length} CALLS - {row.label}</Text>
          {!!shared.setup.length && <Cue label="SETUP">{shared.setup.join(' · ')}</Cue>}
          {shared.userJob && <Cue label={`YOUR JOB - ${data.userPosition.toUpperCase()}`}>{shared.userJob}</Cue>}
          {shared.watchFor && <Cue label="WATCH">{shared.watchFor}</Cue>}
          {shared.adjustmentSettings.map(item => <Cue label="SETUP TRADEOFF" key={item.setting}>{`${item.setting}: ${item.why || ''} ${item.tradeoff || ''}`}</Cue>)}
        </View>}
        {[0, 2].filter(i => calls[i]).map(i => <View key={i} style={S.cards}>{calls.slice(i, i + 2).map(call => <CoachingCard key={call.role} call={call} />)}</View>)}
        {row.plannedMix.status === 'limited' && <Cue label="LIMITED MIX">No safe meaningful variation qualifies. Broaden your playbook or scout for more options.</Cue>}
        {!calls.length && <Cue label="NO VERIFIED MIX">Set the actual offensive look and use the verified calls in your playbook.</Cue>}
        <Footer />
      </Page>;
    })}
  </Document>;
}
