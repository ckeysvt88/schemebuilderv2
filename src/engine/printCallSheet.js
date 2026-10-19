// A two-page quick reference, with full per-call explanations retained in-app.
// Never truncate an instruction into a different instruction. Unusually large
// custom plans use an explicit APP reference for detail beyond the print budget.
export function buildPrintCallSheet(data) {
  const setups = [], jobs = [];
  function reference(list, text, prefix, maxLength) {
    if (!text) return '-';
    const known = list.find(item => item.text === text);
    if (known) return known.id;
    if (list.length >= 8 || text.length > maxLength || list.reduce((sum, item) => sum + item.text.length, 0) + text.length > 1250) return 'APP';
    const item = { id: `${prefix}${list.length + 1}`, text };
    list.push(item);
    return item.id;
  }
  const rows = data.situationMatrix.filter(row => row.down).map(row => ({ ...row,
    calls: (row.plannedMix?.calls || []).map(call => ({ ...call,
      setupRef: reference(setups, call.quickSetup || 'No additional quick setup prescribed.', 'S', 200),
      jobRef: data.includeCoaching === false ? '-' : reference(jobs, call.userJob, 'J', 230),
    })),
  }));
  return { rows, setups, jobs,
    hasAppReferences: rows.some(row => row.calls.some(c => c.setupRef === 'APP' || c.jobRef === 'APP')) };
}
