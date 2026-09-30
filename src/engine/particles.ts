import type { Vec } from "../game/slingshot";

export type ParticleKind = "splinter" | "puff" | "sparkle";

export interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

/** Purely visual effects in world coordinates. */
export class Effects {
  particles: Particle[] = [];
  texts: FloatingText[] = [];

  splinters(at: Vec, count: number, colors: string[], power = 5): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = power * (0.4 + Math.random());
      this.particles.push({
        kind: "splinter",
        x: at.x + (Math.random() - 0.5) * 0.6,
        y: at.y + (Math.random() - 0.5) * 0.6,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s + 3,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 20,
        size: 0.12 + Math.random() * 0.22,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.6,
        color: colors[i % colors.length]!,
      });
    }
  }

  puff(at: Vec, count: number, radius = 0.5): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 0.8 + Math.random() * 1.5;
      this.particles.push({
        kind: "puff",
        x: at.x,
        y: at.y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s + 0.5,
        rot: 0,
        spin: 0,
        size: radius * (0.5 + Math.random() * 0.6),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
        color: "#ffffff",
      });
    }
  }

  sparkles(at: Vec, count: number): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 3;
      this.particles.push({
        kind: "sparkle",
        x: at.x,
        y: at.y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 8,
        size: 0.18 + Math.random() * 0.12,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.3,
        color: "#fff27a",
      });
    }
  }

  text(at: Vec, text: string, color: string): void {
    this.texts.push({ x: at.x, y: at.y, text, color, life: 0, maxLife: 1.2 });
  }

  update(dt: number): void {
    for (const p of this.particles) {
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.kind === "splinter") {
        p.vy -= 18 * dt;
        if (p.y < p.size / 2) {
          p.y = p.size / 2;
          p.vy *= -0.3;
          p.vx *= 0.6;
          p.spin *= 0.5;
        }
      } else {
        p.vx *= 1 - dt * 2.5;
        p.vy *= 1 - dt * 2.5;
      }
    }
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    for (const t of this.texts) {
      t.life += dt;
      t.y += dt * 1.2;
    }
    this.texts = this.texts.filter((t) => t.life < t.maxLife);
  }

  clear(): void {
    this.particles = [];
    this.texts = [];
  }
}
