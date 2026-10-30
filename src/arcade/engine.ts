// Shared bits for the arcade: input model, palette and drawing helpers.

export type Btn = 'left' | 'right' | 'up' | 'down' | 'a';

export type Input = {
  held: Record<Btn, boolean>;
  // Buttons that went down since the last frame.
  pressed: Set<Btn>;
};

export interface Game {
  score: number;
  lives?: number;
  // Extra HUD text, e.g. level or opponent score.
  info?: string;
  over: boolean;
  // Overlay headline when the game ends (defaults to GAME OVER).
  result?: string;
  update(dt: number, input: Input): void;
  draw(ctx: CanvasRenderingContext2D, t: number): void;
}

export type GameDef = {
  id: string;
  title: string;
  blurb: string;
  controls: string;
  // Logical canvas resolution; the cabinet scales it to fit.
  w: number;
  h: number;
  pad: { btn: Btn; label: string }[];
  // Gestures on the game screen for touch players.
  touch?: {
    hint: string;
    // Swiping in a direction taps the mapped button.
    swipe?: Partial<Record<'left' | 'right' | 'up' | 'down', Btn>>;
    tap?: Btn;
    // The whole screen acts as this button while a finger is down.
    hold?: Btn;
  };
  create: () => Game;
};

export const C = {
  bg: '#030504',
  grid: '#0f1a14',
  line: '#233229',
  text: '#dbe7e0',
  dim: '#7a9083',
  accent: '#3dff8f',
  accent2: '#2bd673',
  amber: '#ffb547',
  red: '#ff6b6b',
  blue: '#5cc8ff',
  violet: '#b98cff',
};

export const rnd = (a: number, b: number) => a + Math.random() * (b - a);
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export type Rect = { x: number; y: number; w: number; h: number };
export const overlap = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  { size = 10, color = C.text, align = 'left' as CanvasTextAlign, bold = false } = {},
) {
  ctx.font = `${bold ? 700 : 500} ${size}px 'JetBrains Mono', ui-monospace, monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(s, x, y);
}

// Draws a sprite written as rows of '#' (filled) and '.' (empty).
export function sprite(ctx: CanvasRenderingContext2D, rows: string[], x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color;
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '#') ctx.fillRect(Math.round(x + i * scale), Math.round(y + j * scale), scale, scale);
    }
  }
}
