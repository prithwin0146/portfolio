import { useCallback } from 'react';

/**
 * 3D perspective tilt + glare effect for cards.
 * Attach onMouseMove, onMouseLeave, onMouseEnter to the card element.
 * Add a child `<div data-glare />` inside the card for the glare overlay.
 */
export function useTilt(maxDeg = 5) {
  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -maxDeg;
      const rotateY = ((x - cx) / cx) * maxDeg;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // Spotlight CSS vars
      el.style.setProperty('--card-x', `${x}px`);
      el.style.setProperty('--card-y', `${y}px`);

      // Glare
      const glare = el.querySelector<HTMLElement>('[data-glare]');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 50%)`;
        glare.style.opacity = '1';
      }
    },
    [maxDeg],
  );

  const onLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = '';
    const glare = el.querySelector<HTMLElement>('[data-glare]');
    if (glare) glare.style.opacity = '0';
    setTimeout(() => {
      el.style.transition = '';
    }, 600);
  }, []);

  const onEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transition = 'none';
  }, []);

  return { onMove, onLeave, onEnter };
}
