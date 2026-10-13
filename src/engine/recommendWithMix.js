import { recommend } from './recommendations.js';
// Compatibility entry point for the reviewed mix fixtures.
export function recommendWithMix(input = {}) {
  return recommend(input);
}
