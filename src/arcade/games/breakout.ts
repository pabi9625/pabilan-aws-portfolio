import { C, clamp, overlap, type Game, type Rect } from '../engine';

const W = 320;
const H = 400;
const COLS = 8;
const ROWS = 6;
const BW = (W - 16) / COLS;
const BH = 12;
const ROW_COLORS = [C.red, '#ff9e5c', C.amber, C.accent, C.blue, C.violet];

type Brick = Rect & { row: number; alive: boolean };

export function createBreakout(): Game {
  const paddle = { x: W / 2 - 28, y: H - 30, w: 56, h: 8 };
  const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 4, stuck: true };
  let level = 1;
  let speed = 230;
  let bricks: Brick[] = [];

  const build = () => {
    bricks = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        bricks.push({ x: 8 + c * BW + 1, y: 50 + r * (BH + 3), w: BW - 2, h: BH, row: r, alive: true });
  };
  build();

  const g: Game = {
    score: 0,
    lives: 3,
    info: 'level 1',
    over: false,
    update(dt, { held, pressed }) {
      if (g.over) return;
      if (held.left) paddle.x -= 340 * dt;
      if (held.right) paddle.x += 340 * dt;
      paddle.x = clamp(paddle.x, 0, W - paddle.w);

      if (ball.stuck) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 1;
        if (pressed.has('a') || pressed.has('up')) {
          ball.stuck = false;
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
          ball.vx = Math.cos(a) * speed;
          ball.vy = Math.sin(a) * speed;
        }
        return;
      }

      // Sub-step so the ball never tunnels through a brick.
      const steps = Math.ceil((Math.hypot(ball.vx, ball.vy) * dt) / 3);
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        ball.x += ball.vx * h;
        let box = { x: ball.x - ball.r, y: ball.y - ball.r, w: ball.r * 2, h: ball.r * 2 };
        let hit = bricks.find((b) => b.alive && overlap(box, b));
        if (hit || ball.x < ball.r || ball.x > W - ball.r) {
          ball.x -= ball.vx * h;
          ball.vx *= -1;
        }
        if (hit) {
          hit.alive = false;
          g.score += (ROWS - hit.row) * 10;
        }

        ball.y += ball.vy * h;
        box = { x: ball.x - ball.r, y: ball.y - ball.r, w: ball.r * 2, h: ball.r * 2 };
        hit = bricks.find((b) => b.alive && overlap(box, b));
        if (hit || ball.y < ball.r) {
          ball.y -= ball.vy * h;
          ball.vy *= -1;
        }
        if (hit) {
          hit.alive = false;
          g.score += (ROWS - hit.row) * 10;
        }

        if (ball.vy > 0 && overlap(box, paddle)) {
          const off = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const a = -Math.PI / 2 + clamp(off, -1, 1) * 1.05;
          speed = Math.min(420, speed + 3);
          ball.vx = Math.cos(a) * speed;
          ball.vy = Math.sin(a) * speed;
          ball.y = paddle.y - ball.r - 1;
        }
      }

      if (ball.y > H + 10) {
        g.lives! -= 1;
        ball.stuck = true;
        if (g.lives! <= 0) g.over = true;
      }
      if (bricks.every((b) => !b.alive)) {
        level += 1;
        g.info = `level ${level}`;
        speed = 230 + level * 20;
        ball.stuck = true;
        build();
      }
    },
    draw(ctx) {
      for (const b of bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = ROW_COLORS[b.row];
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(b.x, b.y, b.w, 2);
      }
      ctx.fillStyle = C.text;
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.fillStyle = C.accent;
      ctx.fillRect(paddle.x + 4, paddle.y + 2, paddle.w - 8, 2);
      ctx.fillStyle = C.amber;
      ctx.fillRect(ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2);
    },
  };
  return g;
}
