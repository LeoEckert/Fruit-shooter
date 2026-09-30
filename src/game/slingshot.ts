/** Pure slingshot math: pulling, launch velocity and trajectory preview. */
export interface Vec {
  x: number;
  y: number;
}

export const SLINGSHOT = {
  /** Maximum distance the fruit can be pulled from its rest point (m). */
  maxPull: 3,
  /** Launch speed at full pull (m/s). */
  maxSpeed: 23,
  /** Releasing closer than this to the rest point cancels the shot. */
  cancelDistance: 0.5,
  gravity: -10,
};

/** Clamp the pointer position to the allowed pull circle and keep it above the ground. */
export function clampPull(rest: Vec, pointer: Vec, radius: number): Vec {
  let dx = pointer.x - rest.x;
  let dy = pointer.y - rest.y;
  const len = Math.hypot(dx, dy);
  if (len > SLINGSHOT.maxPull) {
    dx = (dx / len) * SLINGSHOT.maxPull;
    dy = (dy / len) * SLINGSHOT.maxPull;
  }
  const y = Math.max(rest.y + dy, radius + 0.05);
  return { x: rest.x + dx, y };
}

/** Velocity the fruit gets when released at `pulled`. Returns null when the shot is cancelled. */
export function launchVelocity(rest: Vec, pulled: Vec): Vec | null {
  const dx = rest.x - pulled.x;
  const dy = rest.y - pulled.y;
  const len = Math.hypot(dx, dy);
  if (len < SLINGSHOT.cancelDistance) return null;
  const k = SLINGSHOT.maxSpeed / SLINGSHOT.maxPull;
  return { x: dx * k, y: dy * k };
}

/**
 * Points along the first half of the flight (until half the time it takes to
 * come back down to the ground), ignoring collisions.
 */
export function trajectoryPreview(start: Vec, velocity: Vec, count = 14): Vec[] {
  const g = SLINGSHOT.gravity;
  // Solve start.y + vy t + g/2 t² = 0 for the positive root.
  const disc = velocity.y * velocity.y - 2 * g * start.y;
  const tGround = (-velocity.y - Math.sqrt(Math.max(disc, 0))) / g;
  const tEnd = Math.max(tGround, 0) / 2;
  const points: Vec[] = [];
  for (let i = 1; i <= count; i++) {
    const t = (tEnd * i) / count;
    points.push({ x: start.x + velocity.x * t, y: start.y + velocity.y * t + 0.5 * g * t * t });
  }
  return points;
}
