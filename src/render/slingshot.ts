import type { Camera } from "../engine/camera";
import type { Vec } from "../game/slingshot";

const OUTLINE = "#1f2530";
const BAND = "#d8282b";
const BAND_DARK = "#8e1416";

/** Geometry of the fork slingshot, relative to the fruit's rest point. */
export function slingshotGeometry(rest: Vec) {
  return {
    cork: { x: rest.x, y: 0.55, w: 1.5, h: 1.1 },
    // Each fork goes from its base in the cork up to its head.
    back: { base: { x: rest.x - 0.15, y: 0.95 }, head: { x: rest.x - 0.55, y: 3.0 } },
    front: { base: { x: rest.x + 0.15, y: 0.95 }, head: { x: rest.x + 0.5, y: 3.0 } },
  };
}

export function bandAnchors(rest: Vec): { back: Vec; front: Vec } {
  const g = slingshotGeometry(rest);
  return {
    back: { x: g.back.head.x, y: g.back.head.y + 0.1 },
    front: { x: g.front.head.x, y: g.front.head.y + 0.1 },
  };
}

/** Cork and back fork, drawn behind the fruit. */
export function drawSlingshotBack(ctx: CanvasRenderingContext2D, cam: Camera, rest: Vec): void {
  const g = slingshotGeometry(rest);
  drawFork(ctx, cam, g.back.base, g.back.head, true);
  drawCork(ctx, cam, g.cork);
}

/** Front fork, drawn over the fruit and the band. */
export function drawSlingshotFront(ctx: CanvasRenderingContext2D, cam: Camera, rest: Vec): void {
  const g = slingshotGeometry(rest);
  drawFork(ctx, cam, g.front.base, g.front.head, false);
  // Redraw the cork top so the front fork looks stuck in it.
  drawCorkTop(ctx, cam, g.cork);
}

/**
 * One half of the rubber band, from an anchor to the back of the fruit.
 * With no fruit in the band, both halves meet in a slack band between the forks.
 */
export function drawBand(ctx: CanvasRenderingContext2D, cam: Camera, anchor: Vec, fruit: Vec, fruitR: number, rest: Vec): void {
  // Attach to the far side of the fruit (opposite the launch direction).
  const dx = fruit.x - rest.x;
  const dy = fruit.y - rest.y;
  const len = Math.hypot(dx, dy);
  const back = len > 0.05 ? { x: fruit.x + (dx / len) * fruitR * 0.8, y: fruit.y + (dy / len) * fruitR * 0.8 } : { x: fruit.x - fruitR * 0.8, y: fruit.y };
  const stretch = Math.hypot(back.x - anchor.x, back.y - anchor.y);
  const a = cam.toScreen(anchor);
  const b = cam.toScreen(back);
  // The band gets thinner the more it is stretched.
  const width = cam.ppm * Math.max(0.1, 0.24 - stretch * 0.03);
  ctx.lineCap = "round";
  ctx.strokeStyle = BAND_DARK;
  ctx.lineWidth = width + Math.max(2, cam.ppm * 0.06);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.strokeStyle = BAND;
  ctx.lineWidth = width;
  ctx.stroke();
}

/** Slack band hanging between both forks while no fruit is loaded. */
export function drawIdleBand(ctx: CanvasRenderingContext2D, cam: Camera, rest: Vec): void {
  const { back, front } = bandAnchors(rest);
  const a = cam.toScreen(back);
  const b = cam.toScreen(front);
  const mid = cam.toScreen({ x: (back.x + front.x) / 2, y: back.y - 0.35 });
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
  ctx.strokeStyle = BAND_DARK;
  ctx.lineWidth = cam.ppm * 0.24 + Math.max(2, cam.ppm * 0.06);
  ctx.stroke();
  ctx.strokeStyle = BAND;
  ctx.lineWidth = cam.ppm * 0.24;
  ctx.stroke();
}

function drawFork(ctx: CanvasRenderingContext2D, cam: Camera, base: Vec, head: Vec, isBack: boolean): void {
  const b = cam.toScreen(base);
  const h = cam.toScreen(head);
  const len = Math.hypot(h.x - b.x, h.y - b.y);
  const angle = Math.atan2(h.y - b.y, h.x - b.x) + Math.PI / 2;
  const p = cam.ppm;
  const lw = Math.max(1.2, p * 0.05);

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(angle);
  // Local frame: y goes up the fork towards negative values.
  const handleW = p * 0.2;
  const headW = p * 0.62;
  const neck = len * 0.62;
  const tineLen = p * 0.55;

  const metal = ctx.createLinearGradient(-headW / 2, 0, headW / 2, 0);
  metal.addColorStop(0, isBack ? "#9aa3ad" : "#c3cbd4");
  metal.addColorStop(0.45, isBack ? "#dfe4ea" : "#ffffff");
  metal.addColorStop(1, isBack ? "#7d8691" : "#a2acb8");

  ctx.beginPath();
  ctx.moveTo(-handleW / 2, 0);
  ctx.lineTo(-handleW / 2, -neck);
  ctx.quadraticCurveTo(-headW / 2, -neck - p * 0.15, -headW / 2, -len);
  // Tines
  const tines = 4;
  const tineW = headW / (tines * 2 - 1);
  for (let i = 0; i < tines; i++) {
    const x0 = -headW / 2 + i * 2 * tineW;
    ctx.lineTo(x0, -len - tineLen);
    ctx.arcTo(x0 + tineW / 2, -len - tineLen - tineW * 0.6, x0 + tineW, -len - tineLen, tineW / 2);
    ctx.lineTo(x0 + tineW, -len - tineLen);
    ctx.lineTo(x0 + tineW, -len);
    if (i < tines - 1) ctx.lineTo(x0 + 2 * tineW, -len);
  }
  ctx.quadraticCurveTo(headW / 2, -neck - p * 0.15, handleW / 2, -neck);
  ctx.lineTo(handleW / 2, 0);
  ctx.closePath();
  ctx.fillStyle = metal;
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Shine along the handle
  ctx.beginPath();
  ctx.moveTo(-handleW * 0.1, -p * 0.2);
  ctx.lineTo(-handleW * 0.1, -neck + p * 0.1);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = Math.max(1, p * 0.05);
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();
}

function drawCork(ctx: CanvasRenderingContext2D, cam: Camera, cork: { x: number; y: number; w: number; h: number }): void {
  const c = cam.toScreen({ x: cork.x, y: cork.y });
  const w = cork.w * cam.ppm;
  const h = cork.h * cam.ppm;
  const lw = Math.max(2, cam.ppm * 0.07);

  const grad = ctx.createLinearGradient(c.x - w / 2, 0, c.x + w / 2, 0);
  grad.addColorStop(0, "#b67c43");
  grad.addColorStop(0.4, "#dcaa6c");
  grad.addColorStop(1, "#a86c36");
  // Slightly tapered cork
  ctx.beginPath();
  ctx.moveTo(c.x - w * 0.46, c.y + h / 2);
  ctx.lineTo(c.x - w / 2, c.y - h / 2);
  ctx.lineTo(c.x + w / 2, c.y - h / 2);
  ctx.lineTo(c.x + w * 0.46, c.y + h / 2);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "#4a2a10";
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Cork pores
  ctx.fillStyle = "rgba(110,60,20,0.55)";
  const pores = [
    [-0.3, 0.1], [0.1, -0.2], [0.3, 0.25], [-0.1, 0.3], [0.25, -0.05], [-0.28, -0.25], [0.02, 0.05],
  ];
  for (const [px, py] of pores) {
    ctx.beginPath();
    ctx.ellipse(c.x + px! * w, c.y + py! * h, cam.ppm * 0.06, cam.ppm * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  drawCorkTop(ctx, cam, cork);
}

function drawCorkTop(ctx: CanvasRenderingContext2D, cam: Camera, cork: { x: number; y: number; w: number; h: number }): void {
  const c = cam.toScreen({ x: cork.x, y: cork.y + cork.h / 2 });
  const w = cork.w * cam.ppm;
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, w / 2, cam.ppm * 0.14, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#e8bd82";
  ctx.fill();
  ctx.strokeStyle = "#4a2a10";
  ctx.lineWidth = Math.max(2, cam.ppm * 0.07);
  ctx.stroke();
}
