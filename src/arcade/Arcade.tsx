import { useEffect, useRef, useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { Cabinet } from './Cabinet';
import { GAMES } from './games';

// Lets the terminal's `play <game>` command load a cartridge.
export const ARCADE_EVENT = 'arcade:play';

export function Arcade() {
  const [active, setActive] = useState<string | null>(null);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const def = GAMES.find((g) => g.id === active);

  useEffect(() => {
    const onPlay = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (GAMES.some((g) => g.id === id)) setActive(id);
    };
    window.addEventListener(ARCADE_EVENT, onPlay);
    return () => window.removeEventListener(ARCADE_EVENT, onPlay);
  }, []);

  useEffect(() => {
    if (active) cabinetRef.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <section id="arcade" className="section" aria-labelledby="arcade-title">
      <SectionTitle id="arcade" command="ls ~/arcade/roms" path="arcade" />
      <p className="section-lead reveal">
        Six mini-games built from scratch on a canvas, no libraries. Pick a cartridge and play with the keyboard or the
        on-screen pad. High scores stay in your browser.
      </p>

      <div ref={cabinetRef} className="arcade__cabinet">
        {def ? (
          <Cabinet key={def.id} def={def} onEject={() => setActive(null)} />
        ) : (
          <div className="cabinet cabinet--idle panel">
            <p className="cabinet__insert">INSERT COIN</p>
            <p className="cabinet__hint">Choose a game below to start.</p>
          </div>
        )}
      </div>

      <ul className="arcade__roms">
        {GAMES.map((g, i) => (
          <li key={g.id} className="reveal">
            <button
              type="button"
              className={`rom${g.id === active ? ' is-active' : ''}`}
              aria-pressed={g.id === active}
              onClick={() => setActive(g.id)}
            >
              <span className="rom__slot" aria-hidden="true">
                0{i + 1} · {g.id}.rom
              </span>
              <span className="rom__title">{g.title}</span>
              <span className="rom__blurb">{g.blurb}</span>
              <span className="rom__controls">{g.controls}</span>
              <span className="rom__play" aria-hidden="true">
                {g.id === active ? '● now playing' : '▶ play'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
