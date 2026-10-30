import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { C, text, type Btn, type Game, type GameDef, type Input } from './engine';

const KEYS: Record<string, Btn> = {
  arrowleft: 'left', a: 'left',
  arrowright: 'right', d: 'right',
  arrowup: 'up', w: 'up',
  arrowdown: 'down', s: 'down',
  ' ': 'a', enter: 'a', z: 'a', x: 'a',
};

function readBest(id: string): number {
  try {
    return Number(localStorage.getItem(`arcade:${id}`)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(id: string, n: number) {
  try {
    localStorage.setItem(`arcade:${id}`, String(n));
  } catch {
    /* storage unavailable */
  }
}

type Hud = { score: number; lives?: number; info?: string; over: boolean; result?: string };
const snap = (g: Game): Hud => ({ score: g.score, lives: g.lives, info: g.info, over: g.over, result: g.result });

export function Cabinet({ def, onEject }: { def: GameDef; onEject: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game>(null!);
  if (!game.current) game.current = def.create();
  const input = useRef<Input>({
    held: { left: false, right: false, up: false, down: false, a: false },
    pressed: new Set(),
  });
  const paused = useRef(false);
  const [hud, setHud] = useState<Hud>(() => snap(game.current));
  const [isPaused, setPaused] = useState(false);
  const [best, setBest] = useState(() => readBest(def.id));
  const bestRef = useRef(best);

  const restart = () => {
    game.current = def.create();
    setHud(snap(game.current));
    stageRef.current?.focus({ preventScroll: true });
  };

  const setPause = (p: boolean) => {
    paused.current = p;
    setPaused(p);
    if (p) {
      const { held } = input.current;
      (Object.keys(held) as Btn[]).forEach((k) => (held[k] = false));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const stage = stageRef.current!;
    const ctx = canvas.getContext('2d')!;
    let scale = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
      scale = canvas.width / def.w;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let last = performance.now();
    let raf = 0;
    let prev = '';
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = game.current;
      const inp = input.current;

      if (!paused.current) {
        if (g.over && inp.pressed.has('a')) restart();
        else g.update(dt, inp);
      }
      inp.pressed.clear();

      const cur = game.current;
      const key = `${cur.score}|${cur.lives}|${cur.info}|${cur.over}`;
      if (key !== prev) {
        prev = key;
        setHud(snap(cur));
        if (cur.score > bestRef.current) {
          bestRef.current = cur.score;
          setBest(cur.score);
          writeBest(def.id, cur.score);
        }
      }

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, def.w, def.h);
      cur.draw(ctx, now / 1000);
      if (paused.current && !cur.over) {
        ctx.fillStyle = 'rgba(3,5,4,0.6)';
        ctx.fillRect(0, 0, def.w, def.h);
        text(ctx, 'PAUSED', def.w / 2, def.h / 2 - 8, { size: 14, color: C.accent, align: 'center', bold: true });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    stage.focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [def]);

  const onKey = (down: boolean) => (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const btn = KEYS[k];
    if (btn) {
      e.preventDefault();
      const { held, pressed } = input.current;
      if (down && !held[btn]) pressed.add(btn);
      held[btn] = down;
      if (down && paused.current) setPause(false);
    } else if (down && k === 'p') {
      e.preventDefault();
      setPause(!paused.current);
    } else if (down && k === 'r') {
      e.preventDefault();
      restart();
    } else if (down && k === 'escape') {
      e.preventDefault();
      stageRef.current?.blur();
    }
  };

  const hold = (btn: Btn) => ({
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault();
      const { held, pressed } = input.current;
      if (!held[btn]) pressed.add(btn);
      held[btn] = true;
      stageRef.current?.focus({ preventScroll: true });
    },
    onMouseDown: (e: MouseEvent) => e.preventDefault(),
    onPointerUp: () => (input.current.held[btn] = false),
    onPointerLeave: () => (input.current.held[btn] = false),
    onPointerCancel: () => (input.current.held[btn] = false),
  });

  return (
    <div className="cabinet panel">
      <div className="cabinet__bar">
        <span className="cabinet__title">
          <span className="cabinet__led" aria-hidden="true" />
          {def.title}
        </span>
        <span className="cabinet__stats" aria-live="off">
          <span>score <b>{hud.score}</b></span>
          {hud.lives !== undefined && <span>lives <b>{'♥'.repeat(Math.max(0, hud.lives))}</b></span>}
          {hud.info && <span>{hud.info}</span>}
          <span>hi <b>{best}</b></span>
        </span>
        <button type="button" className="cabinet__eject" onClick={onEject}>
          eject ⏏
        </button>
      </div>
      <div
        ref={stageRef}
        className="cabinet__stage"
        style={{ aspectRatio: `${def.w} / ${def.h}`, ['--ratio' as string]: def.w / def.h }}
        tabIndex={0}
        role="application"
        aria-label={`${def.title}. ${def.controls}. P to pause, R to restart.`}
        onKeyDown={onKey(true)}
        onKeyUp={onKey(false)}
        onFocus={() => setPause(false)}
        onBlur={(e: FocusEvent) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPause(true);
        }}
        onPointerDown={() => stageRef.current?.focus({ preventScroll: true })}
      >
        <canvas ref={canvasRef} />
        {hud.over && (
          <div className="cabinet__over">
            <p className="cabinet__result">{hud.result ?? 'GAME OVER'}</p>
            <p>score {hud.score}{hud.score >= best && hud.score > 0 ? ' · new high score!' : ''}</p>
            <button type="button" className="btn btn--primary" onClick={restart}>
              play again
            </button>
          </div>
        )}
        {isPaused && !hud.over && (
          <button type="button" className="cabinet__resume" onClick={() => stageRef.current?.focus()}>
            ▶ click to resume
          </button>
        )}
      </div>
      <p className="cabinet__help">{def.controls} · p pause · r restart</p>
      <div className="cabinet__pad" aria-hidden="true">
        {def.pad.map((p) => (
          <button key={p.btn} type="button" tabIndex={-1} className={p.btn === 'a' ? 'is-a' : undefined} {...hold(p.btn)}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
