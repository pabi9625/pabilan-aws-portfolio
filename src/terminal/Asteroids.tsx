import { useEffect, useRef, useState, type PointerEvent } from 'react';

// A tiny vector Asteroids, a nod to the Boot.dev "Build Asteroids" course.

type Vec = { x: number; y: number };
type Rock = Vec & { vx: number; vy: number; r: number; shape: number[] };
type Bullet = Vec & { vx: number; vy: number; life: number };
type Keys = { left: boolean; right: boolean; thrust: boolean; fire: boolean };

const ACCENT = '#3dff8f';
const AMBER = '#ffb547';

function makeRock(w: number, h: number, r: number, at?: Vec): Rock {
  let x = at?.x ?? Math.random() * w;
  let y = at?.y ?? Math.random() * h;
  if (!at) {
    // Keep fresh rocks away from the centre spawn point.
    if (Math.hypot(x - w / 2, y - h / 2) < 110) x = (x + w / 2) % w;
    if (Math.hypot(x - w / 2, y - h / 2) < 110) y = (y + h / 2) % h;
  }
  const speed = 30 + Math.random() * 50 * (40 / r);
  const a = Math.random() * Math.PI * 2;
  const shape = Array.from({ length: 10 }, () => 0.75 + Math.random() * 0.35);
  return { x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r, shape };
}

export function Asteroids({ onExit }: { onExit: (score: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Keys>({ left: false, right: false, thrust: false, fire: false });
  const [hud, setHud] = useState({ score: 0, lives: 3, over: false });
  const scoreRef = useRef(0);
  const restartRef = useRef<() => void>(() => {});
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = Math.max(220, Math.min(380, Math.round(w * 0.62)));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let ship = { x: w / 2, y: h / 2, vx: 0, vy: 0, a: -Math.PI / 2, inv: 2 };
    let rocks: Rock[] = [];
    let bullets: Bullet[] = [];
    let wave = 3;
    let lives = 3;
    let score = 0;
    let over = false;
    let cooldown = 0;

    const reset = () => {
      ship = { x: w / 2, y: h / 2, vx: 0, vy: 0, a: -Math.PI / 2, inv: 2 };
      wave = 3;
      lives = 3;
      score = 0;
      over = false;
      bullets = [];
      rocks = Array.from({ length: wave }, () => makeRock(w, h, 34));
      scoreRef.current = 0;
      setHud({ score: 0, lives: 3, over: false });
    };
    restartRef.current = reset;
    reset();

    const wrapPos = (p: Vec) => {
      if (p.x < 0) p.x += w;
      if (p.x > w) p.x -= w;
      if (p.y < 0) p.y += h;
      if (p.y > h) p.y -= h;
    };

    const onKey = (down: boolean) => (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, keyof Keys> = {
        arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right',
        arrowup: 'thrust', w: 'thrust', ' ': 'fire',
      };
      if (map[k]) {
        e.preventDefault();
        keys.current[map[k]] = down;
      } else if (down && (k === 'q' || k === 'escape')) {
        e.preventDefault();
        onExitRef.current(scoreRef.current);
      } else if (down && k === 'r' && over) {
        e.preventDefault();
        reset();
      }
    };
    const kd = onKey(true);
    const ku = onKey(false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = keys.current;

      if (!over) {
        if (k.left) ship.a -= 4.2 * dt;
        if (k.right) ship.a += 4.2 * dt;
        if (k.thrust) {
          ship.vx += Math.cos(ship.a) * 220 * dt;
          ship.vy += Math.sin(ship.a) * 220 * dt;
        }
        ship.vx *= 1 - 0.6 * dt;
        ship.vy *= 1 - 0.6 * dt;
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;
        ship.inv = Math.max(0, ship.inv - dt);
        wrapPos(ship);

        cooldown -= dt;
        if (k.fire && cooldown <= 0 && bullets.length < 6) {
          cooldown = 0.2;
          bullets.push({
            x: ship.x + Math.cos(ship.a) * 12,
            y: ship.y + Math.sin(ship.a) * 12,
            vx: Math.cos(ship.a) * 400 + ship.vx,
            vy: Math.sin(ship.a) * 400 + ship.vy,
            life: 0.9,
          });
        }
      }

      for (const b of bullets) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        wrapPos(b);
      }
      bullets = bullets.filter((b) => b.life > 0);

      for (const r of rocks) {
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        wrapPos(r);
      }

      // Bullet hits
      const next: Rock[] = [];
      for (const r of rocks) {
        const hit = bullets.find((b) => Math.hypot(b.x - r.x, b.y - r.y) < r.r);
        if (hit) {
          hit.life = 0;
          score += r.r > 30 ? 20 : r.r > 15 ? 50 : 100;
          if (r.r > 12) next.push(makeRock(w, h, r.r / 2, r), makeRock(w, h, r.r / 2, r));
        } else next.push(r);
      }
      if (next.length !== rocks.length || score !== scoreRef.current) {
        scoreRef.current = score;
        setHud({ score, lives, over });
      }
      rocks = next;

      // Ship hits
      if (!over && ship.inv <= 0 && rocks.some((r) => Math.hypot(r.x - ship.x, r.y - ship.y) < r.r + 8)) {
        lives -= 1;
        if (lives <= 0) over = true;
        ship = { x: w / 2, y: h / 2, vx: 0, vy: 0, a: -Math.PI / 2, inv: 2 };
        setHud({ score, lives, over });
      }

      if (!over && rocks.length === 0) {
        wave += 1;
        rocks = Array.from({ length: wave }, () => makeRock(w, h, 34));
        ship.inv = 1.5;
      }

      // Draw
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = ACCENT;
      for (const r of rocks) {
        ctx.beginPath();
        r.shape.forEach((m, i) => {
          const a = (i / r.shape.length) * Math.PI * 2;
          const px = r.x + Math.cos(a) * r.r * m;
          const py = r.y + Math.sin(a) * r.r * m;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
      }
      ctx.fillStyle = AMBER;
      for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);

      if (!over && (ship.inv <= 0 || Math.floor(now / 120) % 2 === 0)) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.a);
        ctx.strokeStyle = '#e8f5ee';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-9, -7);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-9, 7);
        ctx.closePath();
        ctx.stroke();
        if (k.thrust) {
          ctx.strokeStyle = AMBER;
          ctx.beginPath();
          ctx.moveTo(-6, -3);
          ctx.lineTo(-14, 0);
          ctx.lineTo(-6, 3);
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    wrap.focus({ preventScroll: true });
    wrap.parentElement?.scrollIntoView({ block: 'end' });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  const hold = (key: keyof Keys) => ({
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault();
      keys.current[key] = true;
    },
    onPointerUp: () => (keys.current[key] = false),
    onPointerLeave: () => (keys.current[key] = false),
    onPointerCancel: () => (keys.current[key] = false),
  });

  return (
    <div className="game">
      <div className="game__hud">
        <span>score {hud.score}</span>
        <span>lives {'▲'.repeat(Math.max(0, hud.lives))}</span>
        <button type="button" className="game__quit" onClick={() => onExit(scoreRef.current)}>
          quit (q)
        </button>
      </div>
      <div
        ref={wrapRef}
        className="game__stage"
        tabIndex={0}
        role="application"
        aria-label="Asteroids mini-game. Arrow keys or W A D to move, Space to fire, Q to quit."
      >
        <canvas ref={canvasRef} />
        {hud.over && (
          <div className="game__over">
            <p>GAME OVER · score {hud.score}</p>
            <button type="button" onClick={() => restartRef.current()}>
              restart (r)
            </button>
          </div>
        )}
      </div>
      <p className="game__help">← → rotate · ↑ thrust · space fire · q / esc quit</p>
      <div className="game__pad" aria-hidden="true">
        <button type="button" tabIndex={-1} {...hold('left')}>◀</button>
        <button type="button" tabIndex={-1} {...hold('thrust')}>▲</button>
        <button type="button" tabIndex={-1} {...hold('right')}>▶</button>
        <button type="button" tabIndex={-1} className="game__fire" {...hold('fire')}>fire</button>
      </div>
    </div>
  );
}
