import { Camera } from "../engine/camera";
import { Effects } from "../engine/particles";
import { GameWorld, PHYSICS_DT, type WorldEvent } from "../engine/world";
import type { LevelDef } from "./level";
import { getProjectile } from "./projectiles";
import { clampPull, launchVelocity, trajectoryPreview, type Vec } from "./slingshot";

export type GameState = "loading" | "ready" | "aiming" | "flying" | "over";

/** Seconds the fruit needs to hop from the bowl into the band. */
const LOAD_TIME = 0.45;
/** How close (m) a press must be to the fruit to grab it. */
const GRAB_RADIUS = 1.6;
/** Everything must be still this long before the next fruit is loaded. */
const SETTLE_TIME = 0.8;
const MAX_TURN_TIME = 10;
const TRAIL_INTERVAL = 0.045;
const POINTS_PER_DAMAGE = 10;
const BONUS_PER_FRUIT = 10000;

/**
 * Game flow on top of the physics world: loading fruit, aiming, flying,
 * waiting for everything to settle, scoring and effects.
 */
export class Game {
  world!: GameWorld;
  readonly camera: Camera;
  readonly effects = new Effects();
  state: GameState = "loading";
  score = 0;
  /** Fruit waiting in the bowl (not counting the loaded one). */
  queue: string[] = [];
  /** Fruit currently in the band (or flying). */
  loaded: string | null = null;
  /** Fruit position while in the band. */
  fruitPos: Vec;
  loadProgress = 0;
  trail: { x: number; y: number; big: boolean }[] = [];
  /** Seconds since the last launch (for squash & stretch). */
  sinceLaunch = 99;
  won = false;
  shakeEnabled = true;

  private accumulator = 0;
  private settleTimer = 0;
  private trailTimer = 0;
  private trailToggle = false;
  private totalBlocks = 0;

  constructor(readonly level: LevelDef) {
    this.camera = new Camera(level.bounds);
    this.fruitPos = { ...level.slingshot };
    this.restart();
  }

  get rest(): Vec {
    return this.level.slingshot;
  }

  restart(): void {
    this.world = new GameWorld(this.level);
    this.totalBlocks = this.world.blocks.size;
    this.effects.clear();
    this.score = 0;
    this.won = false;
    this.trail = [];
    this.queue = [...this.level.projectiles];
    this.accumulator = 0;
    this.camera.x = this.camera.homeX();
    this.loadNext();
  }

  /** Where waiting fruit number `i` sits next to the slingshot. */
  queueSlot(i: number): Vec {
    const r = this.queue[i] ? getProjectile(this.queue[i]!).radius * 0.8 : 0.36;
    return { x: this.rest.x - 1.6 - i * 0.95, y: r };
  }

  /** Trajectory preview dots while aiming. */
  preview(): Vec[] {
    if (this.state !== "aiming") return [];
    const v = launchVelocity(this.rest, this.fruitPos);
    return v ? trajectoryPreview(this.rest, v) : [];
  }

  pointerDown(world: Vec): void {
    if (this.state === "over") {
      this.restart();
      return;
    }
    if (this.state !== "ready") return;
    if (Math.hypot(world.x - this.fruitPos.x, world.y - this.fruitPos.y) <= GRAB_RADIUS) {
      this.state = "aiming";
      this.pointerMove(world);
    }
  }

  pointerMove(world: Vec): void {
    if (this.state !== "aiming" || !this.loaded) return;
    this.fruitPos = clampPull(this.rest, world, getProjectile(this.loaded).radius);
  }

  pointerUp(): void {
    if (this.state !== "aiming" || !this.loaded) return;
    const v = launchVelocity(this.rest, this.fruitPos);
    if (!v) {
      this.state = "ready";
      this.fruitPos = { ...this.rest };
      return;
    }
    this.world.launch(this.loaded, { ...this.rest }, v);
    this.state = "flying";
    this.sinceLaunch = 0;
    this.settleTimer = 0;
    this.trail = [];
    this.trailTimer = 0;
  }

  update(dt: number): void {
    dt = Math.min(dt, 0.1);
    this.sinceLaunch += dt;

    if (this.state === "loading") {
      this.loadProgress = Math.min(1, this.loadProgress + dt / LOAD_TIME);
      if (this.loadProgress >= 1) this.state = "ready";
    }

    this.accumulator += dt;
    while (this.accumulator >= PHYSICS_DT) {
      this.accumulator -= PHYSICS_DT;
      for (const e of this.world.step()) this.handleEvent(e);
    }

    if (this.state === "flying") this.updateFlight(dt);

    const p = this.world.projectile;
    const target = this.state === "flying" && p ? this.camera.followX(p.body.getPosition().x) : this.camera.homeX();
    this.camera.moveTowards(target, dt, this.state === "flying" ? 5 : 2.5);
    this.camera.update(dt, this.shakeEnabled);
    this.effects.update(dt);
  }

  private updateFlight(dt: number): void {
    const p = this.world.projectile;
    if (!p) {
      this.endTurn();
      return;
    }
    const pos = p.body.getPosition();
    const speed = p.body.getLinearVelocity().length();

    this.trailTimer += dt;
    if (this.trailTimer >= TRAIL_INTERVAL && speed > 2 && p.age < 4) {
      this.trailTimer = 0;
      this.trailToggle = !this.trailToggle;
      this.trail.push({ x: pos.x, y: pos.y, big: this.trailToggle });
    }

    this.settleTimer = this.world.isSettled() ? this.settleTimer + dt : 0;
    const outOfBounds = pos.x > this.level.bounds.maxX + 15 || pos.x < this.level.bounds.minX - 15;
    if ((p.age > 1 && this.settleTimer >= SETTLE_TIME) || p.age > MAX_TURN_TIME || outOfBounds) {
      this.effects.puff({ x: pos.x, y: pos.y }, 8, p.def.radius * 1.4);
      this.world.removeProjectile();
      this.endTurn();
    }
  }

  private endTurn(): void {
    this.loaded = null;
    if (this.world.blocks.size === 0) {
      this.won = true;
      const bonus = this.queue.length * BONUS_PER_FRUIT;
      this.queue.forEach((_, i) => {
        const slot = this.queueSlot(i);
        this.effects.text({ x: slot.x, y: slot.y + 1 }, `${BONUS_PER_FRUIT}`, "#ffe14a");
        this.effects.sparkles(slot, 10);
      });
      this.score += bonus;
      this.queue = [];
      this.state = "over";
      return;
    }
    if (this.queue.length === 0) {
      this.state = "over";
      return;
    }
    this.loadNext();
  }

  private loadNext(): void {
    this.loaded = this.queue.shift() ?? null;
    this.fruitPos = { ...this.rest };
    this.loadProgress = 0;
    this.state = this.loaded ? "loading" : "over";
  }

  private handleEvent(e: WorldEvent): void {
    switch (e.type) {
      case "blockDamaged": {
        this.score += Math.round(e.amount * POINTS_PER_DAMAGE);
        const p = e.block.body.getPosition();
        const c = e.block.material.colors;
        if (e.amount > 3) this.effects.splinters({ x: p.x, y: p.y }, 3, [c.fill, c.dark], 3);
        break;
      }
      case "blockDestroyed": {
        const m = e.block.material;
        this.score += m.points;
        const area = e.block.w * e.block.h;
        this.effects.splinters({ x: e.x, y: e.y }, Math.round(8 + area * 8), [m.colors.fill, m.colors.light, m.colors.dark]);
        this.effects.puff({ x: e.x, y: e.y }, 5, 0.6);
        this.effects.text({ x: e.x, y: e.y + 0.6 }, `${m.points}`, "#ffffff");
        break;
      }
      case "impact": {
        if (e.impulse > 10) this.camera.shake(e.impulse / 70);
        if (e.withProjectile && e.impulse > 6) this.effects.puff({ x: e.x, y: e.y }, 4, 0.35);
        break;
      }
    }
  }

  /** Share of blocks destroyed so far (0..1). */
  get destruction(): number {
    return this.totalBlocks ? 1 - this.world.blocks.size / this.totalBlocks : 0;
  }
}
