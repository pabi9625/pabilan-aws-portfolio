import { useEffect, useState } from 'react';
import { navItems, profile } from '../data';
import { useActiveSection } from '../hooks/useActiveSection';

const ids = navItems.map((n) => n.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="#home" aria-label={`${profile.name}, back to top`}>
          <span className="nav__led" aria-hidden="true" />
          {profile.handle}@{profile.host}
        </a>
        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true">{open ? '×' : '≡'}</span>
          <span className="nav__toggle-label">menu</span>
        </button>
        <nav id="nav-menu" className={`nav__menu${open ? ' is-open' : ''}`} aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
