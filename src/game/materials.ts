/** Building materials. Add a new entry here to make it available in levels. */
export interface MaterialDef {
  id: string;
  /** Physics density (mass per m²). */
  density: number;
  friction: number;
  restitution: number;
  /** Hit points = baseHp + hpPerArea × block area (m²). */
  baseHp: number;
  hpPerArea: number;
  /** Contact impulses below this value cause no damage (resting, sliding). */
  damageThreshold: number;
  /** Damage per unit of impulse above the threshold. */
  damageScale: number;
  /** Points when a block of this material is destroyed. */
  points: number;
  colors: {
    fill: string;
    light: string;
    dark: string;
    grain: string;
    outline: string;
  };
}

export const MATERIALS: Record<string, MaterialDef> = {
  wood: {
    id: "wood",
    density: 0.7,
    friction: 0.7,
    restitution: 0.1,
    baseHp: 6,
    hpPerArea: 10,
    damageThreshold: 1.6,
    damageScale: 1,
    points: 500,
    colors: {
      fill: "#e0a04a",
      light: "#f7c878",
      dark: "#b8742c",
      grain: "#a8662a",
      outline: "#4a2a10",
    },
  },
};

export function getMaterial(id: string): MaterialDef {
  const m = MATERIALS[id];
  if (!m) throw new Error(`Unknown material: ${id}`);
  return m;
}

export function blockHp(material: MaterialDef, w: number, h: number): number {
  return material.baseHp + material.hpPerArea * w * h;
}
