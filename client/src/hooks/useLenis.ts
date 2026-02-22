import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Force scroll to top on page load / refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      prevent: (node: HTMLElement) => {
        // Let native scroll work inside any element with [data-lenis-prevent]
        let el: HTMLElement | null = node;
        while (el) {
          if (el.hasAttribute('data-lenis-prevent')) return true;
          el = el.parentElement;
        }
        return false;
      },
    });

    lenisRef.current = lenis;

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    // Listen for global modal open/close events so ANY modal can pause Lenis
    const onStop = () => lenis.stop();
    const onStart = () => lenis.start();
    window.addEventListener('lenis:stop', onStop);
    window.addEventListener('lenis:start', onStart);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      window.removeEventListener('lenis:stop', onStop);
      window.removeEventListener('lenis:start', onStart);
    };
  }, []);

  /** Stop Lenis smooth-scroll (call when opening a modal) */
  const stop = useCallback(() => lenisRef.current?.stop(), []);

  /** Restart Lenis smooth-scroll (call when closing a modal) */
  const start = useCallback(() => lenisRef.current?.start(), []);

  return { lenisRef, stop, start };
}
