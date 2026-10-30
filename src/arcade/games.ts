import type { Btn, GameDef } from './engine';
import { createAstro } from './games/astro';
import { createBlocks } from './games/blocks';
import { createBreakout } from './games/breakout';
import { createDino } from './games/dino';
import { createPong } from './games/pong';
import { createSnake } from './games/snake';

const dpad: { btn: Btn; label: string }[] = [
  { btn: 'left', label: '◀' },
  { btn: 'up', label: '▲' },
  { btn: 'down', label: '▼' },
  { btn: 'right', label: '▶' },
];

export const GAMES: GameDef[] = [
  {
    id: 'astro',
    title: 'Astro Shooter',
    blurb: 'Hold the line against waves of drones, weavers and gunships. Grab blue crosses for spread shot.',
    controls: 'arrows move · space fire',
    w: 320,
    h: 420,
    pad: [...dpad, { btn: 'a', label: 'fire' }],
    create: createAstro,
  },
  {
    id: 'snake',
    title: 'Snake',
    blurb: 'Eat, grow, speed up. Don’t bite your own tail or the walls.',
    controls: 'arrows steer',
    w: 320,
    h: 320,
    pad: dpad,
    create: createSnake,
  },
  {
    id: 'blocks',
    title: 'Block Drop',
    blurb: 'Stack falling blocks and clear full rows. Every ten lines the drop gets faster.',
    controls: '← → move · ↑ rotate · ↓ soft · space hard drop',
    w: 240,
    h: 320,
    pad: [...dpad, { btn: 'a', label: 'drop' }],
    create: createBlocks,
  },
  {
    id: 'dino',
    title: 'Dino Dash',
    blurb: 'An endless desert run. Jump the cacti, duck the birds, and keep going as it speeds up.',
    controls: 'space / ↑ jump · ↓ duck',
    w: 480,
    h: 180,
    pad: [{ btn: 'down', label: 'duck' }, { btn: 'a', label: 'jump' }],
    create: createDino,
  },
  {
    id: 'breakout',
    title: 'Brick Breaker',
    blurb: 'Bounce the ball off your paddle and smash every brick. Where it hits the paddle sets the angle.',
    controls: '← → move · space launch',
    w: 320,
    h: 400,
    pad: [{ btn: 'left', label: '◀' }, { btn: 'right', label: '▶' }, { btn: 'a', label: 'launch' }],
    create: createBreakout,
  },
  {
    id: 'pong',
    title: 'Paddle Duel',
    blurb: 'Classic table tennis against the CPU. First to seven wins.',
    controls: '↑ ↓ move',
    w: 480,
    h: 300,
    pad: [{ btn: 'up', label: '▲' }, { btn: 'down', label: '▼' }],
    create: createPong,
  },
];
