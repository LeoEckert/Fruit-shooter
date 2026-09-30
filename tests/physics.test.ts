import { describe, expect, it } from "vitest";
import { impulseToDamage } from "../src/engine/damage";
import { GameWorld } from "../src/engine/world";
import { LEVEL_1 } from "../src/game/level";
import { MATERIALS, blockHp } from "../src/game/materials";
import { PROJECTILES } from "../src/game/projectiles";
import { clampPull, launchVelocity, SLINGSHOT, trajectoryPreview } from "../src/game/slingshot";

/** Pull the fruit back at `deg` degrees below the launch direction by `pull` meters. */
function pullAt(deg: number, pull: number) {
  const rest = LEVEL_1.slingshot;
  const a = (deg * Math.PI) / 180;
  return { x: rest.x - Math.cos(a) * pull, y: rest.y - Math.sin(a) * pull };
}

describe("damage", () => {
  it("ignores impulses below the threshold", () => {
    expect(impulseToDamage(1, 1.6, 1)).toBe(0);
    expect(impulseToDamage(1.6, 1.6, 1)).toBe(0);
  });

  it("scales impulses above the threshold", () => {
    expect(impulseToDamage(11.6, 1.6, 2)).toBeCloseTo(20);
  });

  it("gives bigger blocks more hit points", () => {
    const wood = MATERIALS.wood!;
    expect(blockHp(wood, 4, 0.4)).toBeGreaterThan(blockHp(wood, 0.8, 0.8));
  });
});

describe("slingshot", () => {
  const rest = LEVEL_1.slingshot;

  it("clamps the pull to the maximum radius", () => {
    const p = clampPull(rest, { x: rest.x - 50, y: rest.y }, 0.45);
    expect(Math.hypot(p.x - rest.x, p.y - rest.y)).toBeCloseTo(SLINGSHOT.maxPull);
  });

  it("keeps the fruit above the ground", () => {
    const p = clampPull(rest, { x: rest.x, y: -10 }, 0.45);
    expect(p.y).toBeGreaterThan(0.45);
  });

  it("launches opposite to the pull and cancels tiny pulls", () => {
    const v = launchVelocity(rest, { x: rest.x - 2, y: rest.y - 1 })!;
    expect(v.x).toBeGreaterThan(0);
    expect(v.y).toBeGreaterThan(0);
    expect(launchVelocity(rest, { x: rest.x - 0.1, y: rest.y })).toBeNull();
  });

  it("previews a rising then falling arc", () => {
    const pts = trajectoryPreview(rest, { x: 15, y: 15 });
    expect(pts.length).toBeGreaterThan(5);
    expect(pts.every((p) => p.y > 0)).toBe(true);
    expect(pts[pts.length - 1]!.x).toBeGreaterThan(pts[0]!.x);
  });
});

describe("level data", () => {
  it("only uses known materials and projectiles", () => {
    for (const b of LEVEL_1.blocks) expect(MATERIALS[b.material]).toBeDefined();
    for (const p of LEVEL_1.projectiles) expect(PROJECTILES[p]).toBeDefined();
  });
});

describe("world simulation", () => {
  it("keeps the structure standing and undamaged at rest", () => {
    const w = new GameWorld(LEVEL_1);
    let damage = 0;
    for (let i = 0; i < 300; i++) {
      for (const e of w.step()) if (e.type === "blockDamaged" || e.type === "blockDestroyed") damage++;
    }
    expect(damage).toBe(0);
    expect(w.blocks.size).toBe(LEVEL_1.blocks.length);
    expect(w.isSettled()).toBe(true);
  });

  it("reference shot hits the tower and destroys wood", () => {
    const w = new GameWorld(LEVEL_1);
    for (let i = 0; i < 60; i++) w.step();
    const rest = LEVEL_1.slingshot;
    w.launch("apple", rest, launchVelocity(rest, pullAt(20, 2.5))!);
    let destroyed = 0;
    for (let i = 0; i < 600; i++) {
      for (const e of w.step()) if (e.type === "blockDestroyed") destroyed++;
    }
    expect(destroyed).toBeGreaterThan(0);
    expect(w.blocks.size).toBe(LEVEL_1.blocks.length - destroyed);
  });
});
