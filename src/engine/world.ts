import { World, Box, Circle, Edge, type Body, type Contact } from "planck";
import { impulseToDamage } from "./damage";
import { blockHp, getMaterial, type MaterialDef } from "../game/materials";
import { getProjectile, type ProjectileDef } from "../game/projectiles";
import type { BlockDef, LevelDef } from "../game/level";
import { SLINGSHOT, type Vec } from "../game/slingshot";

export const PHYSICS_DT = 1 / 60;

export interface BlockEntity {
  kind: "block";
  id: number;
  material: MaterialDef;
  body: Body;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  /** Stable random seed for cosmetic details (grain, cracks). */
  seed: number;
}

export interface ProjectileEntity {
  kind: "projectile";
  def: ProjectileDef;
  body: Body;
  /** Seconds since launch. */
  age: number;
}

export interface GroundEntity {
  kind: "ground";
}

type Entity = BlockEntity | ProjectileEntity | GroundEntity;

export type WorldEvent =
  | { type: "blockDamaged"; block: BlockEntity; amount: number }
  | { type: "blockDestroyed"; block: BlockEntity; x: number; y: number; angle: number }
  | { type: "impact"; x: number; y: number; impulse: number; withProjectile: boolean };

/** Contacts are ignored for damage right after the level is built, while stacks settle. */
const SPAWN_GRACE = 0.5;
const IMPACT_EVENT_MIN = 4;
const REST_SPEED = 0.12;
const REST_SPIN = 0.15;

/**
 * Physics world without any rendering. Owns planck bodies for ground, blocks
 * and the flying projectile and turns contact impulses into block damage.
 */
export class GameWorld {
  readonly world: World;
  readonly blocks = new Map<number, BlockEntity>();
  projectile: ProjectileEntity | null = null;
  time = 0;

  private nextId = 1;
  private pendingDamage = new Map<number, number>();
  private events: WorldEvent[] = [];

  constructor(level: LevelDef) {
    this.world = new World({ gravity: { x: 0, y: SLINGSHOT.gravity } });
    const ground = this.world.createBody({ type: "static" });
    ground.createFixture({ shape: new Edge({ x: -200, y: 0 }, { x: 400, y: 0 }), friction: 0.9 });
    ground.setUserData({ kind: "ground" } satisfies GroundEntity);

    for (const def of level.blocks) this.addBlock(def);

    this.world.on("post-solve", (contact, impulse) => this.onPostSolve(contact, impulse.normalImpulses));
  }

  addBlock(def: BlockDef): BlockEntity {
    const material = getMaterial(def.material);
    const body = this.world.createBody({
      type: "dynamic",
      position: { x: def.x, y: def.y },
      angle: def.angle ?? 0,
    });
    body.createFixture({
      shape: new Box(def.w / 2, def.h / 2),
      density: material.density,
      friction: material.friction,
      restitution: material.restitution,
    });
    const hp = blockHp(material, def.w, def.h);
    const block: BlockEntity = {
      kind: "block",
      id: this.nextId++,
      material,
      body,
      w: def.w,
      h: def.h,
      hp,
      maxHp: hp,
      seed: Math.floor(Math.random() * 1e9),
    };
    body.setUserData(block);
    this.blocks.set(block.id, block);
    return block;
  }

  launch(projectileId: string, position: Vec, velocity: Vec): ProjectileEntity {
    this.removeProjectile();
    const def = getProjectile(projectileId);
    const body = this.world.createBody({
      type: "dynamic",
      position,
      bullet: true,
      angularDamping: def.angularDamping,
    });
    body.createFixture({
      shape: new Circle(def.radius),
      density: def.density,
      friction: def.friction,
      restitution: def.restitution,
    });
    body.setLinearVelocity(velocity);
    const projectile: ProjectileEntity = { kind: "projectile", def, body, age: 0 };
    body.setUserData(projectile);
    this.projectile = projectile;
    return projectile;
  }

  removeProjectile(): void {
    if (!this.projectile) return;
    this.world.destroyBody(this.projectile.body);
    this.projectile = null;
  }

  /** Advance one fixed physics step and return what happened. */
  step(): WorldEvent[] {
    this.world.step(PHYSICS_DT, 8, 3);
    this.time += PHYSICS_DT;
    if (this.projectile) this.projectile.age += PHYSICS_DT;

    for (const [id, amount] of this.pendingDamage) {
      const block = this.blocks.get(id);
      if (!block) continue;
      block.hp -= amount;
      if (block.hp <= 0) {
        const p = block.body.getPosition();
        this.events.push({ type: "blockDestroyed", block, x: p.x, y: p.y, angle: block.body.getAngle() });
        this.world.destroyBody(block.body);
        this.blocks.delete(id);
      } else {
        this.events.push({ type: "blockDamaged", block, amount });
      }
    }
    this.pendingDamage.clear();

    const out = this.events;
    this.events = [];
    return out;
  }

  /** True when nothing moves anymore (sleeping or nearly still). */
  isSettled(): boolean {
    for (let b = this.world.getBodyList(); b; b = b.getNext()) {
      if (!b.isDynamic() || !b.isAwake()) continue;
      if (b.getLinearVelocity().length() > REST_SPEED) return false;
      if (Math.abs(b.getAngularVelocity()) > REST_SPIN) return false;
    }
    return true;
  }

  private onPostSolve(contact: Contact, normalImpulses: number[]): void {
    let impulse = 0;
    const count = contact.getManifold().pointCount;
    for (let i = 0; i < count; i++) impulse += normalImpulses[i] ?? 0;
    if (impulse <= 0) return;

    const a = contact.getFixtureA().getBody().getUserData() as Entity | null;
    const b = contact.getFixtureB().getBody().getUserData() as Entity | null;

    if (impulse >= IMPACT_EVENT_MIN) {
      const wm = contact.getWorldManifold(null);
      const point = wm?.points[0] ?? contact.getFixtureA().getBody().getPosition();
      this.events.push({
        type: "impact",
        x: point.x,
        y: point.y,
        impulse,
        withProjectile: a?.kind === "projectile" || b?.kind === "projectile",
      });
    }

    if (this.time < SPAWN_GRACE) return;
    for (const e of [a, b]) {
      if (e?.kind !== "block") continue;
      const dmg = impulseToDamage(impulse, e.material.damageThreshold, e.material.damageScale);
      if (dmg > 0) this.pendingDamage.set(e.id, (this.pendingDamage.get(e.id) ?? 0) + dmg);
    }
  }
}
