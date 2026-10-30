import { C, type Btn, type Game } from '../engine';

const CELL = 16;
const COLS = 20;
const ROWS = 20;
type P = { x: number; y: number };
const DIRS: Partial<Record<Btn, P>> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createSnake(): Game {
  let snake: P[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  let dir: P = { x: 1, y: 0 };
  const queue: P[] = [];
  let step = 0.13;
  let acc = 0;

  const place = (): P => {
    for (;;) {
      const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
    }
  };
  let food = place();

  const tick = () => {
    if (queue.length) dir = queue.shift()!;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const eating = head.x === food.x && head.y === food.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (
      head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
      body.some((s) => s.x === head.x && s.y === head.y)
    ) {
      g.over = true;
      return;
    }
    snake = [head, ...body];
    if (eating) {
      g.score += 10;
      g.info = `length ${snake.length}`;
      step = Math.max(0.055, step * 0.97);
      food = place();
    }
  };

  const g: Game = {
    score: 0,
    info: 'length 3',
    over: false,
    update(dt, { pressed }) {
      for (const b of pressed) {
        const d = DIRS[b];
        if (!d) continue;
        const last = queue[queue.length - 1] ?? dir;
        if ((d.x === -last.x && d.y === -last.y) || (d.x === last.x && d.y === last.y)) continue;
        if (queue.length < 3) queue.push(d);
      }
      if (g.over) return;
      acc += dt;
      while (acc >= step && !g.over) {
        acc -= step;
        tick();
      }
    },
    draw(ctx, t) {
      ctx.fillStyle = C.grid;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) ctx.fillRect(x * CELL + 7, y * CELL + 7, 2, 2);

      const pulse = 2 + Math.sin(t * 8) * 1.5;
      ctx.fillStyle = C.amber;
      ctx.fillRect(food.x * CELL + 5 - pulse / 2, food.y * CELL + 5 - pulse / 2, 6 + pulse, 6 + pulse);

      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#b6ffd4' : i % 2 ? C.accent : C.accent2;
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
      // Eyes
      const h = snake[0];
      ctx.fillStyle = C.bg;
      const ex = dir.y !== 0 ? [4, 10] : [dir.x > 0 ? 10 : 4, dir.x > 0 ? 10 : 4];
      const ey = dir.x !== 0 ? [4, 10] : [dir.y > 0 ? 10 : 4, dir.y > 0 ? 10 : 4];
      ctx.fillRect(h.x * CELL + ex[0], h.y * CELL + ey[0], 2, 2);
      ctx.fillRect(h.x * CELL + ex[1], h.y * CELL + ey[1], 2, 2);
    },
  };
  return g;
}
