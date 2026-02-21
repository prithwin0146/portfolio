import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Magesh Kumar',
    role: 'Founder, JobBuddy',
    text: "Prithwin delivered beyond what we expected. The platform handles 1500+ deployments smoothly, and the SSR implementation cut our load times by 40%. Highly recommend for any serious project.",
    avatar: 'MK',
  },
  {
    id: 2,
    name: 'Amal Krishna',
    role: 'Business Owner',
    text: "Working with Prithwin was seamless from start to finish. He understood our vision perfectly and built a site that truly represents our brand. The attention to detail and performance was outstanding.",
    avatar: 'AK',
  },
  {
    id: 3,
    name: 'Paramesh',
    role: 'Project Manager',
    text: "What impressed me the most was the speed of delivery without compromising quality. The admin dashboard he built streamlined our entire workflow. Clean code, great communication.",
    avatar: 'PM',
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      animTimeoutRef.current = setTimeout(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
        setAnimating(false);
      }, 300);
    }, 6000);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      if (animating || i === active) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(i);
        setAnimating(false);
      }, 300);
      // Reset auto-rotate timer on manual navigation
      startAutoRotate();
    },
    [active, animating, startAutoRotate]
  );

  // Auto-rotate — only when in view
  useEffect(() => {
    if (isInView) {
      startAutoRotate();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [isInView, startAutoRotate]);

  const current = testimonials[active];

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
    >
      <SectionHeader number="05" title={t('section.testimonials.title')} accent={t('section.testimonials.accent')} subtitle={t('section.testimonials.sub') || undefined} visible={isInView} />

      <div className={styles.card}>
        <div className={styles.quoteIcon}>"</div>
        <p className={`${styles.text} ${animating ? styles.fadeOut : styles.fadeIn}`}>
          {current.text}
        </p>
        <div className={`${styles.author} ${animating ? styles.fadeOut : styles.fadeIn}`}>
          <div className={styles.avatar}>{current.avatar}</div>
          <div>
            <p className={styles.name}>{current.name}</p>
            <p className={styles.role}>{current.role}</p>
          </div>
        </div>
      </div>

      <div className={styles.dots}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.activeDot : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
