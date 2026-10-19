// Edits affect this export only. Calls can only come from that row's safe mix.
export const callSheetCallId = (row, call) => JSON.stringify([row.label,call.formation,call.call,call.role]);
export const emptyCallSheetEdits = () => ({ excluded: [], starting: {}, includeCoaching: true });
export function applyCallSheetEdits(data, edits = emptyCallSheetEdits()) {
  const excluded = new Set(edits.excluded || []);
  return { ...data, edited: true, includeCoaching: edits.includeCoaching !== false,
    situationMatrix: data.situationMatrix.map(row => {
      if (!row.down || !row.plannedMix) return row;
      const calls = row.plannedMix.calls.filter(call => !excluded.has(callSheetCallId(row,call)));
      const pinned = calls.find(call => callSheetCallId(row,call) === edits.starting?.[row.label]);
      const ordered = pinned ? [pinned,...calls.filter(call=>call!==pinned)] : calls;
      return { ...row, editorExcluded: row.plannedMix.calls.length > 0 && calls.length === 0,
        plannedMix: { ...row.plannedMix, calls: ordered } };
    }) };
}
