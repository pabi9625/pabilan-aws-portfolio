import { C, text, type Game } from '../engine';

const CELL = 16;
const COLS = 10;
const ROWS = 20;
const SIDE = COLS * CELL + 14;

const SHAPES: { m: number[][]; c: string }[] = [
  { m: [[1, 1, 1, 1]], c: C.blue },
  { m: [[1, 1], [1, 1]], c: C.amber },
  { m: [[0, 1, 0], [1, 1, 1]], c: C.violet },
  { m: [[0, 1, 1], [1, 1, 0]], c: C.accent },
  { m: [[1, 1, 0], [0, 1, 1]], c: C.red },
  { m: [[1, 0, 0], [1, 1, 1]], c: '#6f8cff' },
  { m: [[0, 0, 1], [1, 1, 1]], c: '#ff9e5c' },
];

type Piece = { m: number[][]; c: string; x: number; y: number };
const rotate = (m: number[][]) => m[0].map((_, i) => m.map((r) => r[i]).reverse());

function cell(ctx: CanvasRenderingContext2D, x: number, y: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x + 1, y + 1, CELL - 2, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 1, y + CELL - 3, CELL - 2, 2);
}

export function createBlocks(): Game {
  const board: (string | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  let bag: number[] = [];
  const draw = () => {
    if (!bag.length) bag = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    return SHAPES[bag.pop()!];
  };
  const spawn = (s: { m: number[][]; c: string }): Piece => ({
    m: s.m, c: s.c, x: Math.floor((COLS - s.m[0].length) / 2), y: 0,
  });

  let cur = spawn(draw());
  let next = draw();
  let lines = 0;
  let level = 1;
  let fall = 0;
  let hold = { left: 0, right: 0 };

  const hits = (m: number[][], x: number, y: number) =>
    m.some((row, j) =>
      row.some((v, i) => {
        if (!v) return false;
        const bx = x + i;
        const by = y + j;
        return bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx] !== null);
      }),
    );

  const lock = () => {
    cur.m.forEach((row, j) => row.forEach((v, i) => {
      if (v && cur.y + j >= 0) board[cur.y + j][cur.x + i] = cur.c;
    }));
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(Boolean)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
        y++;
      }
    }
    g.score += [0, 100, 300, 500, 800][cleared] * level;
    lines += cleared;
    level = 1 + Math.floor(lines / 10);
    g.info = `lines ${lines} · lvl ${level}`;
    cur = spawn(next);
    next = draw();
    if (hits(cur.m, cur.x, cur.y)) g.over = true;
  };

  const move = (dx: number) => {
    if (!hits(cur.m, cur.x + dx, cur.y)) cur.x += dx;
  };

  const g: Game = {
    score: 0,
    info: 'lines 0 · lvl 1',
    over: false,
    update(dt, { held, pressed }) {
      if (g.over) return;
      if (pressed.has('left')) move(-1);
      if (pressed.has('right')) move(1);
      // Auto-repeat while a direction is held.
      for (const d of ['left', 'right'] as const) {
        if (held[d]) {
          hold[d] += dt;
          if (hold[d] > 0.17) {
            hold[d] -= 0.05;
            move(d === 'left' ? -1 : 1);
          }
        } else hold[d] = 0;
      }
      if (pressed.has('up')) {
        const m = rotate(cur.m);
        const kick = [0, -1, 1, -2, 2].find((k) => !hits(m, cur.x + k, cur.y));
        if (kick !== undefined) {
          cur.m = m;
          cur.x += kick;
        }
      }
      if (pressed.has('a')) {
        while (!hits(cur.m, cur.x, cur.y + 1)) {
          cur.y++;
          g.score += 2;
        }
        lock();
        return;
      }
      const speed = held.down ? 0.04 : Math.max(0.08, 0.7 - (level - 1) * 0.06);
      fall += dt;
      if (fall >= speed) {
        fall = 0;
        if (hits(cur.m, cur.x, cur.y + 1)) lock();
        else {
          cur.y++;
          if (held.down) g.score += 1;
        }
      }
    },
    draw(ctx) {
      ctx.fillStyle = C.grid;
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.strokeStyle = '#0b120e';
      for (let x = 1; x < COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
        ctx.stroke();
      }
      board.forEach((row, y) => row.forEach((c, x) => c && cell(ctx, x * CELL, y * CELL, c)));

      // Ghost piece
      let gy = cur.y;
      while (!hits(cur.m, cur.x, gy + 1)) gy++;
      ctx.strokeStyle = cur.c;
      ctx.globalAlpha = 0.35;
      cur.m.forEach((row, j) => row.forEach((v, i) => {
        if (v) ctx.strokeRect((cur.x + i) * CELL + 1.5, (gy + j) * CELL + 1.5, CELL - 3, CELL - 3);
      }));
      ctx.globalAlpha = 1;
      cur.m.forEach((row, j) => row.forEach((v, i) => {
        if (v) cell(ctx, (cur.x + i) * CELL, (cur.y + j) * CELL, cur.c);
      }));

      text(ctx, 'NEXT', SIDE, 6, { color: C.dim });
      next.m.forEach((row, j) => row.forEach((v, i) => {
        if (v) cell(ctx, SIDE + i * CELL, 24 + j * CELL, next.c);
      }));
      text(ctx, 'LINES', SIDE, 80, { color: C.dim });
      text(ctx, String(lines), SIDE, 94, { size: 16, color: C.accent, bold: true });
      text(ctx, 'LEVEL', SIDE, 124, { color: C.dim });
      text(ctx, String(level), SIDE, 138, { size: 16, color: C.amber, bold: true });
    },
  };
  return g;
}
