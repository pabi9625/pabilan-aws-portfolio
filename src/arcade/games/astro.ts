import { C, clamp, rnd, sprite, type Game } from '../engine';

const W = 320;
const H = 420;

type Kind = 'drone' | 'weaver' | 'gunner';
type Enemy = { kind: Kind; x: number; y: number; hp: number; t: number; x0: number; stop: number; cd: number };
type Shot = { x: number; y: number; vx: number; vy: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; c: string };
type Drop = { x: number; y: number };

const ART: Record<Kind, { rows: string[]; c: string; hp: number; pts: number }> = {
  drone: { rows: ['#.....#', '.#####.', '##.#.##', '#######', '.#.#.#.'], c: C.accent, hp: 1, pts: 100 },
  weaver: { rows: ['..###..', '.#####.', '##.#.##', '.#####.', '#.#.#.#'], c: C.violet, hp: 2, pts: 150 },
  gunner: { rows: ['#.###.#', '#######', '##.#.##', '.#####.', '..#.#..', '..#.#..'], c: C.red, hp: 4, pts: 300 },
};

export function createAstro(): Game {
  const ship = { x: W / 2, y: H - 40, inv: 1.5 };
  let enemies: Enemy[] = [];
  let shots: Shot[] = [];
  let foes: Shot[] = [];
  let sparks: Spark[] = [];
  let drops: Drop[] = [];
  let spread = 0;
  let cd = 0;
  let spawnT = 1;
  let time = 0;
  const stars = Array.from({ length: 60 }, () => ({ x: rnd(0, W), y: rnd(0, H), z: rnd(0.2, 1) }));

  const boom = (x: number, y: number, c: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2);
      const s = rnd(30, 140);
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(0.3, 0.7), c });
    }
  };

  const spawn = () => {
    const lvl = 1 + time / 30;
    const r = Math.random();
    const kind: Kind = time > 20 && r < 0.2 ? 'gunner' : time > 8 && r < 0.55 ? 'weaver' : 'drone';
    const x = rnd(20, W - 20);
    if (kind === 'drone' && Math.random() < 0.4) {
      // Small V formation
      for (let i = -1; i <= 1; i++) {
        enemies.push({ kind, x: clamp(x + i * 22, 14, W - 14), y: -12 - Math.abs(i) * 16, hp: 1, t: 0, x0: x, stop: 0, cd: 0 });
      }
    } else {
      enemies.push({ kind, x, y: -14, hp: ART[kind].hp, t: 0, x0: x, stop: rnd(50, 150), cd: rnd(0.6, 1.4) });
    }
    spawnT = Math.max(0.35, rnd(0.9, 1.5) / lvl);
  };

  const g: Game = {
    score: 0,
    lives: 3,
    over: false,
    update(dt, { held }) {
      time += dt;
      for (const s of stars) {
        s.y += s.z * 90 * dt;
        if (s.y > H) {
          s.y = 0;
          s.x = rnd(0, W);
        }
      }
      for (const p of sparks) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      sparks = sparks.filter((p) => p.life > 0);
      if (g.over) return;

      const sp = 190;
      if (held.left) ship.x -= sp * dt;
      if (held.right) ship.x += sp * dt;
      if (held.up) ship.y -= sp * dt;
      if (held.down) ship.y += sp * dt;
      ship.x = clamp(ship.x, 12, W - 12);
      ship.y = clamp(ship.y, H * 0.45, H - 16);
      ship.inv = Math.max(0, ship.inv - dt);
      spread = Math.max(0, spread - dt);

      cd -= dt;
      if (held.a && cd <= 0) {
        cd = 0.16;
        shots.push({ x: ship.x, y: ship.y - 12, vx: 0, vy: -440 });
        if (spread > 0) {
          shots.push({ x: ship.x - 6, y: ship.y - 8, vx: -90, vy: -420 }, { x: ship.x + 6, y: ship.y - 8, vx: 90, vy: -420 });
        }
      }
      for (const s of [...shots, ...foes]) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      shots = shots.filter((s) => s.y > -10 && s.x > -10 && s.x < W + 10);
      foes = foes.filter((s) => s.y < H + 10 && s.y > -10 && s.x > -10 && s.x < W + 10);

      spawnT -= dt;
      if (spawnT <= 0) spawn();

      for (const e of enemies) {
        e.t += dt;
        if (e.kind === 'drone') e.y += 95 * dt;
        else if (e.kind === 'weaver') {
          e.y += 70 * dt;
          e.x = clamp(e.x0 + Math.sin(e.t * 2.4) * 60, 12, W - 12);
        } else {
          if (e.y < e.stop) e.y += 80 * dt;
          else {
            e.x = clamp(e.x0 + Math.sin(e.t * 1.2) * 80, 14, W - 14);
            e.y += 6 * dt;
          }
          e.cd -= dt;
          if (e.cd <= 0) {
            e.cd = 1.5;
            const a = Math.atan2(ship.y - e.y, ship.x - e.x);
            foes.push({ x: e.x, y: e.y + 8, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150 });
          }
        }
      }

      for (const e of enemies) {
        for (const s of shots) {
          if (s.y > -5 && Math.abs(s.x - e.x) < 9 && Math.abs(s.y - e.y) < 8) {
            s.y = -100;
            e.hp--;
            if (e.hp <= 0) {
              g.score += ART[e.kind].pts;
              boom(e.x, e.y, ART[e.kind].c);
              if (Math.random() < (e.kind === 'drone' ? 0.04 : 0.15)) drops.push({ x: e.x, y: e.y });
            } else sparks.push({ x: e.x, y: e.y, vx: 0, vy: -30, life: 0.15, c: C.text });
          }
        }
      }
      enemies = enemies.filter((e) => e.hp > 0 && e.y < H + 20);

      for (const d of drops) d.y += 60 * dt;
      drops = drops.filter((d) => {
        if (Math.abs(d.x - ship.x) < 12 && Math.abs(d.y - ship.y) < 12) {
          spread = 10;
          g.score += 50;
          return false;
        }
        return d.y < H + 10;
      });

      if (ship.inv <= 0) {
        const touched =
          enemies.find((e) => Math.abs(e.x - ship.x) < 13 && Math.abs(e.y - ship.y) < 11) ??
          foes.find((s) => Math.abs(s.x - ship.x) < 6 && Math.abs(s.y - ship.y) < 8);
        if (touched) {
          if ('hp' in touched) touched.hp = 0;
          else touched.y = H + 100;
          boom(ship.x, ship.y, C.amber, 24);
          g.lives! -= 1;
          spread = 0;
          ship.inv = 2;
          if (g.lives! <= 0) g.over = true;
        }
      }
      g.info = spread > 0 ? `spread ${Math.ceil(spread)}s` : undefined;
    },
    draw(ctx, t) {
      for (const s of stars) {
        ctx.fillStyle = s.z > 0.7 ? C.text : s.z > 0.4 ? C.dim : C.line;
        ctx.fillRect(s.x, s.y, s.z > 0.7 ? 2 : 1, s.z > 0.7 ? 2 : 1);
      }
      for (const e of enemies) {
        const a = ART[e.kind];
        sprite(ctx, a.rows, e.x - a.rows[0].length, e.y - a.rows.length, 2, a.c);
      }
      for (const d of drops) {
        ctx.strokeStyle = C.blue;
        ctx.strokeRect(d.x - 6, d.y - 6, 12, 12);
        ctx.fillStyle = C.blue;
        ctx.fillRect(d.x - 2, d.y - 4, 4, 8);
        ctx.fillRect(d.x - 4, d.y - 2, 8, 4);
      }
      ctx.fillStyle = C.amber;
      for (const s of shots) ctx.fillRect(s.x - 1, s.y - 4, 2, 8);
      ctx.fillStyle = C.red;
      for (const s of foes) ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
      for (const p of sparks) {
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      ctx.globalAlpha = 1;

      if (!g.over && (ship.inv <= 0 || Math.floor(t * 10) % 2 === 0)) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.fillStyle = C.amber;
        const flame = 4 + Math.sin(t * 40) * 2;
        ctx.fillRect(-4, 9, 3, flame);
        ctx.fillRect(1, 9, 3, flame);
        ctx.strokeStyle = spread > 0 ? C.blue : C.text;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(10, 9);
        ctx.lineTo(3, 6);
        ctx.lineTo(0, 9);
        ctx.lineTo(-3, 6);
        ctx.lineTo(-10, 9);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = C.accent;
        ctx.fillRect(-1.5, -4, 3, 5);
        ctx.restore();
      }
    },
  };
  return g;
}
