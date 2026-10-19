import { FDB } from '../data/formations.js';
import { PLAYBOOKS } from '../data/playbooks.js';

// Exact catalog membership. Required omissions always outrank preferences.
export function findPlaybooks(requested, formations = FDB, books = PLAYBOOKS, priorities = {}) {
  const wanted = [...new Set(requested.filter(name => typeof name === 'string' && name.trim()))];
  if (!wanted.length) return [];
  const required = wanted.filter(name => priorities[name] !== 'nice');
  const preferred = wanted.filter(name => priorities[name] === 'nice');
  return Object.keys(books).filter(name => name !== 'All').map(name => {
    const matched = wanted.filter(formation => formations[formation]?.books?.includes(name));
    const missing = wanted.filter(formation => !matched.includes(formation));
    const requiredMissing = required.filter(formation => !matched.includes(formation));
    return { name, matched, missing, count: matched.length, total: wanted.length, complete: missing.length === 0,
      requiredCount: required.length - requiredMissing.length, requiredTotal: required.length,
      requiredMissing, qualifies: requiredMissing.length === 0,
      preferredCount: preferred.filter(formation => matched.includes(formation)).length, preferredTotal: preferred.length };
  }).filter(book => book.count > 0).sort((a, b) => b.requiredCount - a.requiredCount || b.preferredCount - a.preferredCount || a.name.localeCompare(b.name));
}
