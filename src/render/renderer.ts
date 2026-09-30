import type { Game } from "../game/game";
import { getProjectile } from "../game/projectiles";
import { drawBackground } from "./background";
import { drawBlock } from "./blocks";
import { drawFruit } from "./fruit";
import { bandAnchors, drawBand, drawIdleBand, drawSlingshotBack, drawSlingshotFront } from "./slingshot";

const FONT = '"Lilita One", "Arial Black", Impact, sans-serif';

export interface HudButton {
  x: number;
  y: number;
  r: number;
}

/** Restart button in screen space (top left). */
export function restartButton(width: number, height: number): HudButton {
  const r = Math.max(22, Math.min(width, height) * 0.045);
  return { x: r + 16, y: r + 16, r };
}

export function render(ctx: CanvasRenderingContext2D, game: Game, time: number): void {
  const cam = game.camera;
  const rest = game.rest;
  drawBackground(ctx, cam, time);

  // Trail of the last shot
  for (const t of game.trail) {
    const s = cam.toScreen(t);
    ctx.beginPath();
    ctx.arc(s.x, s.y, cam.ppm * (t.big ? 0.13 : 0.08), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  }

  // Waiting fruit next to the slingshot, with a little idle hop
  game.queue.forEach((id, i) => {
    const slot = game.queueSlot(i);
    const hop = Math.max(0, Math.sin(time * 3 + i * 1.7)) * 0.15;
    const s = cam.toScreen({ x: slot.x, y: slot.y + hop });
    drawFruit(ctx, id, { x: s.x, y: s.y, r: getProjectile(id).radius * 0.8 * cam.ppm, angle: 0 });
  });

  drawSlingshotBack(ctx, cam, rest);

  const anchors = bandAnchors(rest);
  const loaded = game.loaded;
  const inBand = loaded && (game.state === "loading" || game.state === "ready" || game.state === "aiming");
  if (inBand) {
    const r = getProjectile(loaded).radius;
    const pos = fruitInBandPosition(game);
    drawBand(ctx, cam, anchors.back, pos, r, rest);
    const s = cam.toScreen(pos);
    const pull = Math.hypot(pos.x - rest.x, pos.y - rest.y);
    drawFruit(ctx, loaded, {
      x: s.x,
      y: s.y,
      r: r * cam.ppm,
      angle: 0,
      stretch: 1 + pull * 0.03,
      stretchDir: Math.atan2(-(pos.y - rest.y), pos.x - rest.x),
    });
    drawBand(ctx, cam, anchors.front, pos, r, rest);
  } else {
    drawIdleBand(ctx, cam, rest);
  }
  drawSlingshotFront(ctx, cam, rest);

  // Aim preview
  game.preview().forEach((p, i, all) => {
    const s = cam.toScreen(p);
    ctx.beginPath();
    ctx.arc(s.x, s.y, cam.ppm * (0.12 - (i / all.length) * 0.05), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.95 - (i / all.length) * 0.6})`;
    ctx.fill();
  });

  for (const block of game.world.blocks.values()) drawBlock(ctx, cam, block);

  // Flying fruit
  const p = game.world.projectile;
  if (p) {
    const pos = p.body.getPosition();
    const v = p.body.getLinearVelocity();
    const speed = v.length();
    const s = cam.toScreen(pos);
    // Stretch right after launch, then a little with speed.
    const launchKick = Math.max(0, 0.25 - game.sinceLaunch) * 1.2;
    drawFruit(ctx, p.def.id, {
      x: s.x,
      y: s.y,
      r: p.def.radius * cam.ppm,
      angle: -p.body.getAngle(),
      stretch: 1 + Math.min(0.12, speed * 0.004) + launchKick,
      stretchDir: Math.atan2(-v.y, v.x),
      squint: speed > 6,
    });
  }

  drawEffects(ctx, game);
  drawHud(ctx, game);
}

/** Fruit position while in the band, including the hop from the bowl while loading. */
function fruitInBandPosition(game: Game) {
  if (game.state !== "loading") return game.fruitPos;
  const t = game.loadProgress;
  const from = game.queueSlot(0);
  const to = game.rest;
  const e = 1 - (1 - t) * (1 - t);
  return {
    x: from.x + (to.x - from.x) * e,
    y: from.y + (to.y - from.y) * e + Math.sin(t * Math.PI) * 2.2,
  };
}

function drawEffects(ctx: CanvasRenderingContext2D, game: Game): void {
  const cam = game.camera;
  for (const p of game.effects.particles) {
    const s = cam.toScreen(p);
    const fade = 1 - p.life / p.maxLife;
    const size = p.size * cam.ppm;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(p.rot);
    if (p.kind === "splinter") {
      ctx.globalAlpha = Math.min(1, fade * 2);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = "#4a2a10";
      ctx.lineWidth = Math.max(1, cam.ppm * 0.03);
      ctx.beginPath();
      ctx.rect(-size, -size * 0.3, size * 2, size * 0.6);
      ctx.fill();
      ctx.stroke();
    } else if (p.kind === "puff") {
      ctx.globalAlpha = fade * 0.85;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, size * (1.4 - fade * 0.4), 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      drawStar(ctx, size);
    }
    ctx.restore();
  }

  for (const t of game.effects.texts) {
    const s = cam.toScreen(t);
    const fade = 1 - t.life / t.maxLife;
    const pop = Math.min(1, t.life * 8);
    ctx.save();
    ctx.globalAlpha = Math.min(1, fade * 2);
    ctx.font = `${Math.round(cam.ppm * 0.9 * (0.6 + pop * 0.4))}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(3, cam.ppm * 0.14);
    ctx.strokeStyle = "#2a1a0a";
    ctx.lineJoin = "round";
    ctx.strokeText(t.text, s.x, s.y);
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, s.x, s.y);
    ctx.restore();
  }
}

function drawStar(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function outlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, fill = "#ffffff"): void {
  ctx.font = `${Math.round(size)}px ${FONT}`;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(3, size * 0.16);
  ctx.strokeStyle = "#1d2a3a";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

function drawHud(ctx: CanvasRenderingContext2D, game: Game): void {
  const { width: w, height: h } = game.camera;
  const size = Math.max(22, Math.min(w, h) * 0.055);

  // Score (top right)
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  outlinedText(ctx, "PUNKTE", w - 20, 14, size * 0.5, "#fff3b0");
  outlinedText(ctx, game.score.toLocaleString("de-DE"), w - 20, 14 + size * 0.55, size);

  // Level name (top center)
  ctx.textAlign = "center";
  outlinedText(ctx, game.level.name, w / 2, 16, size * 0.6);

  // Restart button (top left)
  const b = restartButton(w, h);
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  const grad = ctx.createLinearGradient(0, b.y - b.r, 0, b.y + b.r);
  grad.addColorStop(0, "#ffe46b");
  grad.addColorStop(1, "#f0a91c");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = Math.max(3, b.r * 0.14);
  ctx.strokeStyle = "#5a3308";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r * 0.48, -Math.PI * 0.35, Math.PI * 1.35);
  ctx.strokeStyle = "#5a3308";
  ctx.lineWidth = b.r * 0.2;
  ctx.lineCap = "round";
  ctx.stroke();
  const ax = b.x + Math.cos(-Math.PI * 0.35) * b.r * 0.48;
  const ay = b.y + Math.sin(-Math.PI * 0.35) * b.r * 0.48;
  ctx.beginPath();
  ctx.moveTo(ax + b.r * 0.28, ay - b.r * 0.02);
  ctx.lineTo(ax - b.r * 0.05, ay - b.r * 0.3);
  ctx.lineTo(ax - b.r * 0.1, ay + b.r * 0.18);
  ctx.closePath();
  ctx.fillStyle = "#5a3308";
  ctx.fill();

  if (game.state === "ready" && game.score === 0 && game.queue.length === game.level.projectiles.length - 1) {
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const pulse = 0.85 + Math.sin(performance.now() / 250) * 0.15;
    ctx.globalAlpha = pulse;
    outlinedText(ctx, "Apfel ziehen, zielen und loslassen!", w / 2, h - 16, size * 0.55);
    ctx.globalAlpha = 1;
  }

  if (game.state === "over") {
    ctx.fillStyle = "rgba(20,30,50,0.45)";
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const title = game.won ? "Alles Kleinholz!" : "Keine Äpfel mehr!";
    outlinedText(ctx, title, w / 2, h * 0.38, size * 1.6, game.won ? "#ffe14a" : "#ffffff");
    outlinedText(ctx, `${game.score.toLocaleString("de-DE")} Punkte`, w / 2, h * 0.52, size);
    outlinedText(ctx, "Tippen für neue Runde", w / 2, h * 0.64, size * 0.6, "#fff3b0");
  }
}
