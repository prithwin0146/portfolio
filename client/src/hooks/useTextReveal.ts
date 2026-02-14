import { useEffect, useRef, useState } from 'react';

/**
 * Splits text into words and staggers their reveal with a clip-path animation.
 * Returns { ref, words, isRevealed } — attach ref to the container element,
 * map words with the supplied className helper.
 */
export function useTextReveal(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}
