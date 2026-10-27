import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { profile } from '../data';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { Asteroids } from './Asteroids';
import { CHIPS, complete, execute } from './commands';

type Line = { id: number; node: ReactNode };

const PROMPT = `${profile.handle}@${profile.host}:~$`;

const BOOT: ReactNode[] = [
  <p className="t-dim">$ ssh {profile.handle}@{profile.host}</p>,
  <p className="t-dim">Connecting to {profile.host}…</p>,
  <p className="t-dim">Authenticated with public key "visitor".</p>,
  <p>&nbsp;</p>,
  <p className="t-accent t-bold">Welcome to {profile.host}: {profile.name}'s home server.</p>,
  <p>
    Status: <span className="t-accent">{profile.status}</span> · Location: {profile.location}
  </p>,
  <p>
    Type <code>help</code> to see available commands, or tap a chip below.
  </p>,
  <p>&nbsp;</p>,
];

let uid = 0;
const line = (node: ReactNode): Line => ({ id: ++uid, node });

type Props = { open: boolean; onClose: () => void };

export function Terminal({ open, onClose }: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booting, setBooting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const booted = useRef(false);
  const bootTimers = useRef<number[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const skipBoot = useCallback(() => {
    bootTimers.current.forEach(window.clearTimeout);
    bootTimers.current = [];
    setLines(BOOT.map(line));
    setBooting(false);
  }, []);

  // Boot once per page load; reopening resumes the session.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    if (!booted.current) {
      booted.current = true;
      if (prefersReducedMotion()) {
        setLines(BOOT.map(line));
      } else {
        setBooting(true);
        setLines([]);
        BOOT.forEach((node, i) => {
          bootTimers.current.push(
            window.setTimeout(() => {
              setLines((l) => [...l, line(node)]);
              if (i === BOOT.length - 1) setBooting(false);
            }, 180 + i * 190),
          );
        });
      }
    }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    return () => {
      if (bootTimers.current.length) skipBoot();
    };
  }, [open, skipBoot]);

  // Restore focus to whatever opened the terminal.
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current.focus?.({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, playing]);

  const close = useCallback(() => {
    setPlaying(false);
    onClose();
  }, [onClose]);

  const run = useCallback(
    (raw: string) => {
      if (booting) skipBoot();
      const echo = line(
        <p>
          <span className="t-prompt">{PROMPT}</span> {raw}
        </p>,
      );
      let cleared = false;
      const out = execute(raw, {
        clear: () => (cleared = true),
        exit: close,
        play: () => setPlaying(true),
      });
      if (cleared) setLines([]);
      else setLines((l) => [...l, echo, ...(out ? [line(out)] : [])]);
      if (raw.trim()) setHistory((h) => (h[h.length - 1] === raw.trim() ? h : [...h, raw.trim()]));
      setHistIdx(-1);
      setInput('');
    },
    [booting, skipBoot, close],
  );

  const endGame = useCallback((score: number) => {
    setPlaying(false);
    setLines((l) => [...l, line(<p className="t-amber">asteroids: session ended. Final score {score}.</p>)]);
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  }, []);

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (booting && e.key !== 'Escape') skipBoot();
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'Tab' && input.trim()) {
      e.preventDefault();
      const { value, options } = complete(input);
      setInput(value);
      if (options.length > 1) {
        setLines((l) => [
          ...l,
          line(
            <p>
              <span className="t-prompt">{PROMPT}</span> {input}
            </p>,
          ),
          line(<p className="t-ls">{options.map((o) => <span key={o}>{o}</span>)}</p>),
        ]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // Esc closes (or quits the game first); Tab stays inside the dialog.
  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      // While playing, the game's own key handler quits and reports the score.
      if (playing) return;
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab' && !e.defaultPrevented) {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([tabindex="-1"]), input, a[href], [tabindex="0"]',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="term-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={dialogRef}
        className="term"
        role="dialog"
        aria-modal="true"
        aria-labelledby="term-title"
        onKeyDown={onDialogKey}
      >
        <div className="term__bar">
          <span className="panel__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <h2 id="term-title" className="term__title">
            ssh {profile.handle}@{profile.host}
          </h2>
          {booting && (
            <button type="button" className="term__skip" onClick={skipBoot}>
              skip
            </button>
          )}
          <button type="button" className="term__close" onClick={close} aria-label="Close terminal">
            ×
          </button>
        </div>

        <div
          ref={logRef}
          className="term__log"
          aria-live="polite"
          onMouseUp={() => {
            if (!playing && !window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
          }}
        >
          {lines.map((l) => (
            <div key={l.id} className="term__line">
              {l.node}
            </div>
          ))}
          {playing && <Asteroids onExit={endGame} />}
        </div>

        {!playing && (
          <>
            <form
              className="term__input"
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
              }}
            >
              <label htmlFor="term-input" className="t-prompt">
                {PROMPT}
              </label>
              <input
                id="term-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  if (booting) skipBoot();
                  setInput(e.target.value);
                }}
                onKeyDown={onInputKey}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                aria-describedby="term-hint"
              />
            </form>
            <p id="term-hint" className="sr-only">
              Type a command and press Enter. Type help for a list of commands.
            </p>
            <div className="term__chips" role="group" aria-label="Quick commands">
              {CHIPS.map((c) => (
                <button key={c} type="button" onClick={() => run(c)}>
                  {c}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
