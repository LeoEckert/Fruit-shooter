import type { Vec } from "../game/slingshot";

/** Horizontal world span (m) the default view is sized for. */
const DESIGN_WIDTH = 40;
/** Vertical world span (m) that must fit above the ground. */
const DESIGN_HEIGHT = 17;

/** Side-view camera: world meters (y up) ↔ screen pixels (y down). */
export class Camera {
  /** Pixels per meter. */
  ppm = 30;
  /** World x at the left screen edge. */
  x = 0;
  width = 1;
  height = 1;
  /** Screen y of the ground line (world y = 0). */
  groundY = 1;
  private shakeAmount = 0;
  private shakeX = 0;
  private shakeY = 0;

  constructor(private readonly bounds: { minX: number; maxX: number }) {}

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    const groundPx = Math.max(height * 0.13, 40);
    this.ppm = Math.min(width / DESIGN_WIDTH, (height - groundPx) / DESIGN_HEIGHT);
    this.groundY = height - groundPx;
    this.x = this.clampX(this.x);
  }

  get viewWidth(): number {
    return this.width / this.ppm;
  }

  /** Left edge that shows the whole level (or as much as fits, starting left). */
  homeX(): number {
    return this.clampX(this.bounds.minX);
  }

  /** Left edge that keeps `worldX` comfortably in view while following it. */
  followX(worldX: number): number {
    return this.clampX(worldX - this.viewWidth * 0.45);
  }

  clampX(x: number): number {
    const span = this.bounds.maxX - this.bounds.minX;
    if (this.viewWidth >= span) return this.bounds.minX - (this.viewWidth - span) / 2;
    return Math.min(Math.max(x, this.bounds.minX), this.bounds.maxX - this.viewWidth);
  }

  moveTowards(targetX: number, dt: number, speed = 4): void {
    this.x += (targetX - this.x) * Math.min(1, dt * speed);
  }

  shake(amount: number): void {
    this.shakeAmount = Math.min(0.6, Math.max(this.shakeAmount, amount));
  }

  update(dt: number, shakeEnabled = true): void {
    this.shakeAmount = Math.max(0, this.shakeAmount - dt * 1.8);
    const s = shakeEnabled ? this.shakeAmount * this.ppm * 0.5 : 0;
    this.shakeX = (Math.random() * 2 - 1) * s;
    this.shakeY = (Math.random() * 2 - 1) * s;
  }

  toScreen(p: Vec): Vec {
    return {
      x: (p.x - this.x) * this.ppm + this.shakeX,
      y: this.groundY - p.y * this.ppm + this.shakeY,
    };
  }

  toWorld(sx: number, sy: number): Vec {
    return { x: sx / this.ppm + this.x, y: (this.groundY - sy) / this.ppm };
  }
}
