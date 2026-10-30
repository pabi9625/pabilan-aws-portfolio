import { C, clamp, text, type Game } from '../engine';

const W = 480;
const H = 300;
const PH = 50;
const PW = 8;
const WIN = 7;

export function createPong(): Game {
  const you = { y: H / 2 - PH / 2 };
  const cpu = { y: H / 2 - PH / 2, aim: 0 };
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, wait: 1 };
  let cpuScore = 0;
  let youScore = 0;

  const serve = (toward: number) => {
    ball.x = W / 2;
    ball.y = H / 2;
    ball.wait = 0.9;
    const a = (Math.random() - 0.5) * 0.8;
    ball.vx = Math.cos(a) * 250 * toward;
    ball.vy = Math.sin(a) * 250;
  };
  serve(Math.random() < 0.5 ? -1 : 1);

  const bounce = (py: number, dir: number) => {
    const off = clamp((ball.y - (py + PH / 2)) / (PH / 2), -1, 1);
    const sp = Math.min(560, Math.hypot(ball.vx, ball.vy) * 1.06);
    const a = off * 1;
    ball.vx = Math.cos(a) * sp * dir;
    ball.vy = Math.sin(a) * sp;
    cpu.aim = (Math.random() - 0.5) * PH * 0.9;
  };

  const g: Game = {
    score: 0,
    info: 'cpu 0',
    over: false,
    update(dt, { held }) {
      if (g.over) return;
      if (held.up) you.y -= 320 * dt;
      if (held.down) you.y += 320 * dt;
      you.y = clamp(you.y, 0, H - PH);

      // The CPU only chases while the ball heads its way, at a capped speed.
      const target = ball.vx > 0 ? ball.y - PH / 2 + cpu.aim : H / 2 - PH / 2;
      const max = (200 + youScore * 15) * dt;
      cpu.y = clamp(cpu.y + clamp(target - cpu.y, -max, max), 0, H - PH);

      if (ball.wait > 0) {
        ball.wait -= dt;
        return;
      }
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.y < 4 || ball.y > H - 4) {
        ball.vy *= -1;
        ball.y = clamp(ball.y, 4, H - 4);
      }
      if (ball.vx < 0 && ball.x - 4 < 20 + PW && ball.x > 14 && ball.y > you.y - 4 && ball.y < you.y + PH + 4) {
        ball.x = 20 + PW + 4;
        bounce(you.y, 1);
      }
      if (ball.vx > 0 && ball.x + 4 > W - 20 - PW && ball.x < W - 14 && ball.y > cpu.y - 4 && ball.y < cpu.y + PH + 4) {
        ball.x = W - 20 - PW - 4;
        bounce(cpu.y, -1);
      }
      if (ball.x < -10) {
        cpuScore++;
        serve(-1);
      } else if (ball.x > W + 10) {
        youScore++;
        g.score += 100;
        serve(1);
      }
      g.info = `cpu ${cpuScore}`;
      if (youScore >= WIN || cpuScore >= WIN) {
        g.over = true;
        g.result = youScore > cpuScore ? 'YOU WIN' : 'CPU WINS';
      }
    },
    draw(ctx) {
      ctx.fillStyle = C.line;
      for (let y = 6; y < H; y += 18) ctx.fillRect(W / 2 - 1, y, 2, 10);
      text(ctx, String(youScore), W / 2 - 40, 16, { size: 32, color: C.accent, align: 'center', bold: true });
      text(ctx, String(cpuScore), W / 2 + 40, 16, { size: 32, color: C.dim, align: 'center', bold: true });
      ctx.fillStyle = C.accent;
      ctx.fillRect(20, you.y, PW, PH);
      ctx.fillStyle = C.text;
      ctx.fillRect(W - 20 - PW, cpu.y, PW, PH);
      if (ball.wait <= 0 || Math.floor(ball.wait * 8) % 2 === 0) {
        ctx.fillStyle = C.amber;
        ctx.fillRect(ball.x - 4, ball.y - 4, 8, 8);
      }
    },
  };
  return g;
}
