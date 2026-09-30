/** Fruits that can be fired. Add a new entry here (plus a drawer in render/fruit.ts). */
export interface ProjectileDef {
  id: string;
  radius: number;
  density: number;
  friction: number;
  restitution: number;
  /** Angular damping keeps rolling fruit from spinning forever. */
  angularDamping: number;
}

export const PROJECTILES: Record<string, ProjectileDef> = {
  apple: {
    id: "apple",
    radius: 0.45,
    density: 3,
    friction: 0.6,
    restitution: 0.3,
    angularDamping: 1.5,
  },
};

export function getProjectile(id: string): ProjectileDef {
  const p = PROJECTILES[id];
  if (!p) throw new Error(`Unknown projectile: ${id}`);
  return p;
}
