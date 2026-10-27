import { useCallback, useEffect, useState } from 'react';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { CursorGlow } from './components/CursorGlow';
import { Education } from './components/Education';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { useReveal } from './hooks/useReveal';
import { Terminal } from './terminal/Terminal';

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

export function App() {
  const [termOpen, setTermOpen] = useState(false);
  const openTerm = useCallback(() => setTermOpen(true), []);
  const closeTerm = useCallback(() => setTermOpen(false), []);
  useReveal();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' && !termOpen && !isEditable(e.target) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setTermOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [termOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CursorGlow />
      <div className="scanlines" aria-hidden="true" />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero onOpenTerminal={openTerm} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact onOpenTerminal={openTerm} />
      </main>
      <Footer />

      <button type="button" className="term-fab" onClick={openTerm} aria-label="Open terminal">
        <span className="term-fab__glyph" aria-hidden="true">
          &gt;<span className="term-fab__cursor">_</span>
        </span>
        <span className="term-fab__label" aria-hidden="true">
          Open terminal
        </span>
      </button>
      <Terminal open={termOpen} onClose={closeTerm} />
    </>
  );
}
