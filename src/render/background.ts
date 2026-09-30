import type { Camera } from "../engine/camera";
import { seededRandom } from "../engine/random";

const OUTLINE = "#2d3b1a";

interface Cloud {
  x: number;
  y: number;
  s: number;
}

const rand = seededRandom(7);
const CLOUDS: Cloud[] = Array.from({ length: 9 }, (_, i) => ({
  x: i * 11 + rand() * 6 - 10,
  y: 11 + rand() * 6,
  s: 0.8 + rand() * 0.8,
}));

/** Sky, clouds and hills, drawn with parallax relative to the camera. */
export function drawBackground(ctx: CanvasRenderingContext2D, cam: Camera, time: number): void {
  const { width: w, height: h } = cam;

  const sky = ctx.createLinearGradient(0, 0, 0, cam.groundY);
  sky.addColorStop(0, "#5fb4ee");
  sky.addColorStop(0.6, "#a6dcf8");
  sky.addColorStop(1, "#e3f6ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sun
  const sun = { x: w * 0.82 - cam.x * cam.ppm * 0.05, y: cam.groundY - 14 * cam.ppm };
  const glow = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, cam.ppm * 4);
  glow.addColorStop(0, "rgba(255,250,210,0.9)");
  glow.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(sun.x - cam.ppm * 4, sun.y - cam.ppm * 4, cam.ppm * 8, cam.ppm * 8);
  ctx.fillStyle = "#fff6c2";
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, cam.ppm * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Clouds (slow parallax + drift)
  for (const c of CLOUDS) {
    const span = 110;
    let x = ((c.x + time * 0.25 - cam.x * 0.15) % span) - 12;
    if (x < -12) x += span;
    drawCloud(ctx, (x - 0) * cam.ppm, cam.groundY - c.y * cam.ppm, c.s * cam.ppm);
  }

  // Far hills
  drawHills(ctx, cam, 0.25, 5.5, 3.2, "#9fdc7c", "#86c865", 0.11);
  // Near hills
  drawHills(ctx, cam, 0.5, 3.2, 2.2, "#79c957", "#62b243", 0.17);

  drawGround(ctx, cam);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(x, y, s * 1.1, 0, Math.PI * 2);
  ctx.arc(x + s * 1.3, y - s * 0.5, s * 1.4, 0, Math.PI * 2);
  ctx.arc(x + s * 2.8, y, s * 1.1, 0, Math.PI * 2);
  ctx.arc(x + s * 1.4, y + s * 0.4, s * 1.0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHills(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  parallax: number,
  height: number,
  wave: number,
  top: string,
  bottom: string,
  freq: number,
): void {
  const offset = cam.x * parallax;
  const grad = ctx.createLinearGradient(0, cam.groundY - (height + wave) * cam.ppm, 0, cam.groundY);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(45,80,30,0.35)";
  ctx.lineWidth = Math.max(2, cam.ppm * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, cam.groundY);
  for (let sx = 0; sx <= cam.width + 8; sx += 8) {
    const wx = sx / cam.ppm + offset;
    const hy = height + Math.sin(wx * freq) * wave * 0.6 + Math.sin(wx * freq * 2.3 + 1) * wave * 0.4;
    ctx.lineTo(sx, cam.groundY - hy * cam.ppm);
  }
  ctx.lineTo(cam.width, cam.groundY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawGround(ctx: CanvasRenderingContext2D, cam: Camera): void {
  const y = cam.groundY;
  const { width: w, height: h } = cam;

  // Dirt
  const dirt = ctx.createLinearGradient(0, y, 0, h);
  dirt.addColorStop(0, "#b77b45");
  dirt.addColorStop(1, "#8a5528");
  ctx.fillStyle = dirt;
  ctx.fillRect(0, y, w, h - y);

  // Pebbles in the dirt (scroll with the world)
  const r = seededRandom(3);
  ctx.fillStyle = "rgba(90,50,20,0.45)";
  for (let i = 0; i < 120; i++) {
    const wx = r() * 120 - 20;
    const wy = 0.6 + r() * 3;
    const s = cam.toScreen({ x: wx, y: -wy });
    if (s.x < -10 || s.x > w + 10 || s.y > h) continue;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, cam.ppm * 0.18, cam.ppm * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grass strip with a wavy top edge
  const grassH = Math.max(10, cam.ppm * 0.45);
  ctx.fillStyle = "#6fcc3f";
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = Math.max(2, cam.ppm * 0.07);
  ctx.beginPath();
  ctx.moveTo(-10, y + grassH);
  // Little grass tufts every 0.5 m, anchored to world x so they scroll.
  const first = Math.floor(cam.x * 2) - 1;
  const last = Math.ceil((cam.x + cam.viewWidth) * 2) + 1;
  for (let i = first; i <= last; i++) {
    const sx = cam.toScreen({ x: i / 2, y: 0 }).x;
    ctx.lineTo(sx, y - (i % 2 === 0 ? cam.ppm * 0.14 : 0));
  }
  ctx.lineTo(w + 10, y + grassH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(0, y + grassH * 0.15, w, grassH * 0.25);
}
