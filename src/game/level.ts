/** Level data. Coordinates are in meters, y points up, the ground is at y = 0. */
export interface BlockDef {
  material: string;
  /** Center position. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rotation in radians. */
  angle?: number;
}

export interface LevelDef {
  name: string;
  /** Rest point of the fruit in the rubber band. */
  slingshot: { x: number; y: number };
  /** Fruits in firing order. */
  projectiles: string[];
  blocks: BlockDef[];
  /** Horizontal extent the camera is allowed to show. */
  bounds: { minX: number; maxX: number };
}

const POST = { w: 0.4, h: 2.6 };
const PLANK = { w: 4.2, h: 0.4 };
const CUBE = 0.8;

/** Two posts with a plank on top. `y` is the bottom of the posts. */
function arch(material: string, cx: number, y: number): BlockDef[] {
  const half = PLANK.w / 2 - POST.w / 2;
  return [
    { material, x: cx - half, y: y + POST.h / 2, w: POST.w, h: POST.h },
    { material, x: cx + half, y: y + POST.h / 2, w: POST.w, h: POST.h },
    { material, x: cx, y: y + POST.h + PLANK.h / 2, w: PLANK.w, h: PLANK.h },
  ];
}

function cubeStack(material: string, cx: number, y: number, count: number): BlockDef[] {
  return Array.from({ length: count }, (_, i) => ({
    material,
    x: cx,
    y: y + CUBE / 2 + i * CUBE,
    w: CUBE,
    h: CUBE,
  }));
}

const storyHeight = POST.h + PLANK.h;

export const LEVEL_1: LevelDef = {
  name: "Holzturm",
  slingshot: { x: 6, y: 3.2 },
  projectiles: ["apple", "apple", "apple", "apple", "apple"],
  bounds: { minX: -2, maxX: 38 },
  blocks: [
    // Two-story tower
    ...arch("wood", 25, 0),
    ...arch("wood", 25, storyHeight),
    ...cubeStack("wood", 25, 2 * storyHeight, 2),
    // Cubes inside the ground floor
    ...cubeStack("wood", 25, 0, 2),
    // Small wall behind the tower
    ...cubeStack("wood", 30.6, 0, 3),
    ...cubeStack("wood", 32.2, 0, 3),
    { material: "wood", x: 31.4, y: 3 * CUBE + PLANK.h / 2, w: 2.2, h: PLANK.h },
  ],
};
