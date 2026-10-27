import { useEffect } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

// Sets --gx/--gy on <html>; a fixed CSS layer renders the glow there.
export function CursorGlow() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add('has-glow');
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--gx', `${e.clientX}px`);
        root.style.setProperty('--gy', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      root.classList.remove('has-glow');
    };
  }, []);
  return <div className="cursor-glow" aria-hidden="true" />;
}
