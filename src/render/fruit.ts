export interface FruitPose {
  /** Screen position and radius in pixels. */
  x: number;
  y: number;
  r: number;
  /** Body rotation in screen radians (clockwise). */
  angle: number;
  /** Squash & stretch: >1 stretches along `stretchDir`. */
  stretch?: number;
  stretchDir?: number;
  /** Eyes squeezed shut (in flight, on impact). */
  squint?: boolean;
}

type FruitDrawer = (ctx: CanvasRenderingContext2D, pose: FruitPose) => void;

/** One drawer per projectile id. Add new fruits here. */
const DRAWERS: Record<string, FruitDrawer> = {
  apple: drawApple,
};

export function drawFruit(ctx: CanvasRenderingContext2D, id: string, pose: FruitPose): void {
  ctx.save();
  ctx.translate(pose.x, pose.y);
  if (pose.stretch && pose.stretch !== 1) {
    const dir = pose.stretchDir ?? 0;
    ctx.rotate(dir);
    ctx.scale(pose.stretch, 1 / pose.stretch);
    ctx.rotate(-dir);
  }
  ctx.rotate(pose.angle);
  (DRAWERS[id] ?? drawApple)(ctx, { ...pose, x: 0, y: 0, angle: 0 });
  ctx.restore();
}

const OUTLINE = "#2a0a06";

function drawApple(ctx: CanvasRenderingContext2D, { r, squint }: FruitPose): void {
  const lw = Math.max(2, r * 0.13);

  // Stem and leaf (behind the body top)
  ctx.lineCap = "round";
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = r * 0.2 + lw;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.75);
  ctx.quadraticCurveTo(r * 0.05, -r * 1.15, r * 0.2, -r * 1.3);
  ctx.stroke();
  ctx.strokeStyle = "#7a4a1c";
  ctx.lineWidth = r * 0.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(r * 0.5, -r * 1.12, r * 0.38, r * 0.18, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#5cc23a";
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.2, -r * 1.02);
  ctx.lineTo(r * 0.78, -r * 1.24);
  ctx.strokeStyle = "#3f8f24";
  ctx.lineWidth = lw * 0.5;
  ctx.stroke();

  // Body: slightly heart-shaped apple
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.78);
  ctx.bezierCurveTo(r * 0.55, -r * 1.12, r * 1.18, -r * 0.62, r * 1.02, r * 0.12);
  ctx.bezierCurveTo(r * 0.92, r * 0.78, r * 0.45, r * 1.05, 0, r * 0.92);
  ctx.bezierCurveTo(-r * 0.45, r * 1.05, -r * 0.92, r * 0.78, -r * 1.02, r * 0.12);
  ctx.bezierCurveTo(-r * 1.18, -r * 0.62, -r * 0.55, -r * 1.12, 0, -r * 0.78);
  ctx.closePath();
  const body = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.15);
  body.addColorStop(0, "#ff7a5c");
  body.addColorStop(0.45, "#e8342a");
  body.addColorStop(1, "#a3170f");
  ctx.fillStyle = body;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = OUTLINE;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Shine
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, -r * 0.42, r * 0.2, r * 0.11, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fill();

  // Belly
  ctx.beginPath();
  ctx.ellipse(r * 0.05, r * 0.55, r * 0.55, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,190,150,0.35)";
  ctx.fill();

  // Eyes (looking right, towards the enemy)
  const eyeY = -r * 0.1;
  for (const ex of [-r * 0.02, r * 0.48]) {
    ctx.beginPath();
    if (squint) {
      ctx.moveTo(ex - r * 0.18, eyeY - r * 0.05);
      ctx.lineTo(ex + r * 0.1, eyeY + r * 0.02);
      ctx.lineTo(ex - r * 0.18, eyeY + r * 0.1);
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = lw * 0.9;
      ctx.stroke();
      continue;
    }
    ctx.ellipse(ex, eyeY, r * 0.2, r * 0.24, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = lw * 0.6;
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex + r * 0.07, eyeY + r * 0.04, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = "#111111";
    ctx.fill();
  }

  // Angry eyebrows: thick, slanting down towards the middle
  ctx.fillStyle = "#1a0a05";
  const brow = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, y2 - r * 0.16);
    ctx.lineTo(x1, y1 - r * 0.2);
    ctx.closePath();
    ctx.fill();
  };
  brow(-r * 0.3, -r * 0.4, r * 0.17, -r * 0.22);
  brow(r * 0.78, -r * 0.44, r * 0.3, -r * 0.22);

  // Frowning mouth
  ctx.beginPath();
  ctx.moveTo(r * 0.02, r * 0.42);
  ctx.quadraticCurveTo(r * 0.25, r * 0.28, r * 0.48, r * 0.42);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = lw * 0.8;
  ctx.lineCap = "round";
  ctx.stroke();
}
