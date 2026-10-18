import { FDB } from '../data/formations.js';
import { PLAYBOOKS } from '../data/playbooks.js';

// Exact catalog membership: no formation-name or family substitutions.
export function findPlaybooks(requested, formations = FDB, books = PLAYBOOKS) {
  const wanted = [...new Set(requested.filter(name => typeof name === 'string' && name.trim()))];
  if (!wanted.length) return [];
  return Object.keys(books).filter(name => name !== 'All').map(name => {
    const matched = wanted.filter(formation => formations[formation]?.books?.includes(name));
    const missing = wanted.filter(formation => !matched.includes(formation));
    return { name, matched, missing, count: matched.length, total: wanted.length, complete: missing.length === 0 };
  }).filter(book => book.count > 0).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
