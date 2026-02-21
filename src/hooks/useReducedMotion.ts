import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitialState(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Detects the OS `prefers-reduced-motion` setting and listens for changes.
 *
 * Returns `true` when the user prefers reduced motion.
 *
 * Use this hook for programmatic control (e.g. D3 transitions).
 * Framer Motion animations are handled globally via `<MotionConfig reducedMotion="user">`.
 * CSS animations are handled by the `@media (prefers-reduced-motion)` rule in globals.css.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
