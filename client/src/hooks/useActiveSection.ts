import { useEffect, useState, useRef } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState('');
  const idsRef = useRef(sectionIds);
  idsRef.current = sectionIds;

  useEffect(() => {
    const handle = () => {
      const offset = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const id of idsRef.current) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= offset) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return active;
}
