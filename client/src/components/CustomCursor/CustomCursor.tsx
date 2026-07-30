import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [cursorLabel, setCursorLabel] = useState('');
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Don't run on touch-only devices
    if ('ontouchstart' in window && !matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onOverInteractive = (e: Event) => {
      setHovering(true);
      const el = e.currentTarget as HTMLElement;
      const label = el.getAttribute('data-cursor-label');
      if (label) setCursorLabel(label);
    };
    const onOutInteractive = () => {
      setHovering(false);
      setCursorLabel('');
    };

    const interactiveSelectors = 'a, button, input, textarea, [data-cursor-hover]';
    const tracked = new WeakSet<Element>();

    const addInteractiveListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        if (tracked.has(el)) return;
        tracked.add(el);
        el.addEventListener('mouseenter', onOverInteractive);
        el.addEventListener('mouseleave', onOutInteractive);
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    addInteractiveListeners();

    // Re-bind when DOM changes (debounced)
    let mutationTimeout: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(addInteractiveListeners, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Smooth ring follow with lerp
    let raf: number;
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Add class to hide native cursor
    document.body.classList.add('has-custom-cursor');

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
      clearTimeout(mutationTimeout);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.dot} ${hovering ? styles.hovering : ''} ${hidden ? styles.hidden : ''}`}
      />
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovering ? styles.hovering : ''} ${hidden ? styles.hidden : ''} ${cursorLabel ? styles.labeled : ''}`}
      />
      <div
        ref={labelRef}
        className={`${styles.label} ${cursorLabel ? styles.labelVisible : ''} ${hidden ? styles.hidden : ''}`}
      >
        {cursorLabel}
      </div>
    </>
  );
}
