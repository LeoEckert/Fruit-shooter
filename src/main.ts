import { Game } from "./game/game";
import { LEVEL_1 } from "./game/level";
import { render, restartButton } from "./render/renderer";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const game = new Game(LEVEL_1);

function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  game.camera.resize(w, h);
}
window.addEventListener("resize", resize);
resize();

// Input: one pointer drives aiming (mouse and touch).
let activePointer: number | null = null;

canvas.addEventListener("pointerdown", (e) => {
  const b = restartButton(game.camera.width, game.camera.height);
  if (Math.hypot(e.clientX - b.x, e.clientY - b.y) <= b.r) {
    game.restart();
    return;
  }
  if (activePointer !== null) return;
  activePointer = e.pointerId;
  canvas.setPointerCapture(e.pointerId);
  game.pointerDown(game.camera.toWorld(e.clientX, e.clientY));
});

canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId !== activePointer) return;
  game.pointerMove(game.camera.toWorld(e.clientX, e.clientY));
});

const release = (e: PointerEvent) => {
  if (e.pointerId !== activePointer) return;
  activePointer = null;
  game.pointerUp();
};
canvas.addEventListener("pointerup", release);
canvas.addEventListener("pointercancel", release);

window.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") game.restart();
});

// Expose the game for debugging and automated browser checks.
(window as unknown as { game: Game }).game = game;

let last = performance.now();
function frame(now: number): void {
  const dt = (now - last) / 1000;
  last = now;
  game.update(dt);
  render(ctx, game, now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
