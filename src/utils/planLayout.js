export const PLAN_LAYOUT_KEY = 'sb_plan_layout';

export function readPlanLayout() {
  try {
    const saved = localStorage.getItem(PLAN_LAYOUT_KEY);
    return ['original', 'quick', 'board', 'formation'].includes(saved) ? saved : 'original';
  } catch {
    return 'original';
  }
}

export function savePlanLayout(layout) {
  try {
    localStorage.setItem(PLAN_LAYOUT_KEY, ['original', 'quick', 'board', 'formation'].includes(layout) ? layout : 'original');
  } catch {
    // The layout still changes when browser storage is unavailable.
  }
}
