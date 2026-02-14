import { useEffect, useRef } from 'react';

/**
 * Applies a subtle CSS skewY + blur to `.mainContent` based on scroll velocity.
 * Creates a premium, buttery feel when scrolling fast.
 */
export function useScrollSkew() {
  const lastScroll = useRef(0);
  const lastTime = useRef(Date.now());
  const raf = useRef(0);
  const currentSkew = useRef(0);

  useEffect(() => {
    const main = document.querySelector('.mainContent') as HTMLElement | null;
    if (!main) return;

    const MAX_SKEW = 2; // degrees
    const DECAY = 0.9;  // how fast it returns to 0

    const onScroll = () => {
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dy = window.scrollY - lastScroll.current;
      const velocity = dy / dt; // px/ms

      lastScroll.current = window.scrollY;
      lastTime.current = now;

      // Map velocity to skew (-MAX_SKEW to MAX_SKEW)
      const targetSkew = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, velocity * 15));
      currentSkew.current = targetSkew;
    };

    const animate = () => {
      // Decay towards 0
      currentSkew.current *= DECAY;

      // Apply only if significant
      if (Math.abs(currentSkew.current) > 0.01) {
        main.style.transform = `skewY(${currentSkew.current}deg)`;
      } else {
        main.style.transform = '';
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
      main.style.transform = '';
    };
  }, []);
}
