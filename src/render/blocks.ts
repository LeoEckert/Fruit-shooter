import type { Camera } from "../engine/camera";
import { seededRandom } from "../engine/random";
import type { BlockEntity } from "../engine/world";

/** Draws a wooden (or any material) block with grain, highlights and damage cracks. */
export function drawBlock(ctx: CanvasRenderingContext2D, cam: Camera, block: BlockEntity): void {
  const pos = block.body.getPosition();
  const s = cam.toScreen(pos);
  const w = block.w * cam.ppm;
  const h = block.h * cam.ppm;
  const c = block.material.colors;
  const lw = Math.max(2, cam.ppm * 0.07);
  const radius = Math.min(w, h) * 0.18;

  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(-block.body.getAngle());

  // Body
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, radius);
  ctx.fillStyle = c.fill;
  ctx.fill();

  ctx.save();
  ctx.clip();

  // Light top edge, dark bottom edge (drawn in the block's local frame)
  const horizontal = w >= h;
  const band = Math.min(w, h) * 0.22;
  ctx.fillStyle = c.light;
  if (horizontal) ctx.fillRect(-w / 2, -h / 2, w, band);
  else ctx.fillRect(-w / 2, -h / 2, band, h);
  ctx.fillStyle = c.dark;
  if (horizontal) ctx.fillRect(-w / 2, h / 2 - band, w, band);
  else ctx.fillRect(w / 2 - band, -h / 2, band, h);

  // Grain lines along the long axis
  const rand = seededRandom(block.seed);
  ctx.strokeStyle = c.grain;
  ctx.lineWidth = Math.max(1, cam.ppm * 0.035);
  ctx.lineCap = "round";
  const long = Math.max(w, h);
  const short = Math.min(w, h);
  const lines = Math.max(2, Math.round(short / (cam.ppm * 0.18)));
  for (let i = 0; i < lines; i++) {
    const off = -short / 2 + short * ((i + 0.5 + (rand() - 0.5) * 0.4) / lines);
    const start = -long / 2 + rand() * long * 0.15;
    const end = long / 2 - rand() * long * 0.15;
    const wobble = short * 0.05;
    ctx.beginPath();
    for (let t = 0; t <= 1.0001; t += 0.1) {
      const a = start + (end - start) * t;
      const b = off + Math.sin(t * Math.PI * 2 + i) * wobble;
      const [px, py] = horizontal ? [a, b] : [b, a];
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Knot
  if (long > cam.ppm * 1.2) {
    const k = (rand() - 0.5) * long * 0.6;
    const kx = horizontal ? k : 0;
    const ky = horizontal ? 0 : k;
    ctx.beginPath();
    ctx.ellipse(kx, ky, short * 0.16, short * 0.1, horizontal ? 0 : Math.PI / 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCracks(ctx, block, w, h, lw);
  ctx.restore();

  // Outline
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, radius);
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.restore();
}

function drawCracks(ctx: CanvasRenderingContext2D, block: BlockEntity, w: number, h: number, lw: number): void {
  const ratio = block.hp / block.maxHp;
  const count = ratio < 0.33 ? 4 : ratio < 0.66 ? 2 : 0;
  if (!count) return;
  // Separate generator so cracks stay put while the block moves.
  const rand = seededRandom(block.seed ^ 0x5bd1e995);
  ctx.strokeStyle = block.material.colors.outline;
  ctx.lineWidth = lw * 0.7;
  ctx.lineJoin = "miter";
  for (let i = 0; i < count; i++) {
    // Start on a random edge and zigzag inwards.
    const edge = Math.floor(rand() * 4);
    let x = edge === 0 ? -w / 2 : edge === 1 ? w / 2 : (rand() - 0.5) * w;
    let y = edge === 2 ? -h / 2 : edge === 3 ? h / 2 : (rand() - 0.5) * h;
    const dirX = -x / (w / 2 || 1);
    const dirY = -y / (h / 2 || 1);
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segs = 3 + Math.floor(rand() * 2);
    for (let s = 0; s < segs; s++) {
      x += (dirX * 0.18 + (rand() - 0.5) * 0.35) * w * 0.5;
      y += (dirY * 0.18 + (rand() - 0.5) * 0.35) * h * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
