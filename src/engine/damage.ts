/** Damage a block takes from a contact impulse (0 below the threshold). */
export function impulseToDamage(impulse: number, threshold: number, scale: number): number {
  return impulse > threshold ? (impulse - threshold) * scale : 0;
}
