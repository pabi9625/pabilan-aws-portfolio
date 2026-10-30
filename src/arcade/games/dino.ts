import { C, overlap, rnd, sprite, type Game, type Rect } from '../engine';

const W = 480;
const GROUND = 150;
const S = 2;

const BODY = [
  '.....#####',
  '....##.###',
  '....######',
  '....###...',
  '#..#####..',
  '##.######.',
  '#########.',
  '.#######..',
  '..#####...',
];
const LEGS = [
  ['..#...#...', '..##..##..'],
  ['..#....#..', '..#....##.'],
];
const DUCK = [
  '........#####',
  '#..#######.##',
  '############.',
  '.##########..',
];
const DUCK_LEGS = [
  ['..#..#......', '..##.##.....'],
  ['...#..#.....', '...##.##....'],
];
const BIRD = [
  ['..#.......', '.###......', '#######...', '...######.', '....###...'],
  ['..........', '.##.......', '########..', '...######.', '....#.....'],
];

type Obstacle = Rect & { kind: 'cactus' | 'bird'; arms: number[] };

export function createDino(): Game {
  let y = 0;
  let vy = 0;
  let ducking = false;
  let speed = 260;
  let dist = 0;
  let gap = 300;
  let obs: Obstacle[] = [];
  let clouds = [{ x: 120, y: 30 }, { x: 330, y: 55 }];

  const spawn = () => {
    const score = Math.floor(dist / 10);
    if (score > 250 && Math.random() < 0.3) {
      const high = Math.random() < 0.5;
      obs.push({ kind: 'bird', x: W + 10, y: GROUND - (high ? 28 : 12), w: 20, h: 10, arms: [] });
    } else {
      const n = Math.random() < 0.25 ? 3 : Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const h = rnd(20, 34);
        obs.push({ kind: 'cactus', x: W + 10 + i * 13, y: GROUND - h, w: 10, h, arms: [rnd(6, h - 8), rnd(4, h - 10)] });
      }
    }
    gap = rnd(230, 420) + speed * 0.35;
  };

  const g: Game = {
    score: 0,
    over: false,
    update(dt, { held, pressed }) {
      if (g.over) return;
      const grounded = y >= 0;
      ducking = held.down && grounded;
      if ((pressed.has('a') || pressed.has('up')) && grounded) vy = -540;
      if (!grounded && !held.a && !held.up && vy < -260) vy = -260;
      vy += (held.down ? 3600 : 1700) * dt;
      y = Math.min(0, y + vy * dt);
      if (y >= 0) vy = 0;

      speed = Math.min(620, speed + 9 * dt);
      const dx = speed * dt;
      dist += dx;
      g.score = Math.floor(dist / 10);
      gap -= dx;
      if (gap <= 0) spawn();
      for (const o of obs) o.x -= o.kind === 'bird' ? dx * 1.1 : dx;
      obs = obs.filter((o) => o.x + o.w > -20);
      for (const c of clouds) {
        c.x -= dx * 0.2;
        if (c.x < -40) {
          c.x = W + rnd(0, 80);
          c.y = rnd(20, 70);
        }
      }

      const me: Rect = ducking
        ? { x: 44, y: GROUND + y - 10, w: 22, h: 10 }
        : { x: 44, y: GROUND + y - 20, w: 14, h: 18 };
      if (obs.some((o) => overlap(me, { x: o.x + 2, y: o.y + 2, w: o.w - 4, h: o.h - 2 }))) g.over = true;
    },
    draw(ctx, t) {
      ctx.fillStyle = C.line;
      for (const c of clouds) {
        ctx.fillRect(c.x, c.y, 30, 4);
        ctx.fillRect(c.x + 6, c.y - 4, 14, 4);
      }
      ctx.fillStyle = C.dim;
      ctx.fillRect(0, GROUND, W, 1);
      const off = dist % 40;
      for (let x = -off; x < W; x += 40) {
        ctx.fillRect(x, GROUND + 5, 6, 1);
        ctx.fillRect(x + 22, GROUND + 9, 3, 1);
      }

      for (const o of obs) {
        if (o.kind === 'cactus') {
          ctx.fillStyle = C.accent2;
          ctx.fillRect(o.x + 3, o.y, 4, o.h);
          ctx.fillRect(o.x, o.y + o.arms[0] - 6, 2, 6);
          ctx.fillRect(o.x, o.y + o.arms[0], 4, 2);
          ctx.fillRect(o.x + 8, o.y + o.arms[1] - 5, 2, 5);
          ctx.fillRect(o.x + 6, o.y + o.arms[1], 4, 2);
        } else {
          sprite(ctx, BIRD[Math.floor(t * 6) % 2], o.x, o.y, 2, C.amber);
        }
      }

      const frame = y < 0 ? 0 : Math.floor(t * 12) % 2;
      const color = g.over ? C.red : C.text;
      if (ducking) {
        sprite(ctx, [...DUCK, ...DUCK_LEGS[frame]], 40, GROUND - 12, S, color);
      } else {
        sprite(ctx, [...BODY, ...LEGS[frame]], 40, GROUND + y - 22, S, color);
      }
    },
  };
  return g;
}
