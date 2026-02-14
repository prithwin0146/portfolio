import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../../services/api';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import type { Profile } from '../../types';
import styles from './Hero.module.css';

const fallback: Profile = {
  name: 'Prithwin M',
  title: 'Freelance Web Designer & Developer',
  bio: "I design and build modern websites that help businesses stand out online — from landing pages to full-stack web apps. Let's bring your vision to life.",
  email: 'Prithwin0146@gmail.com',
  gitHubUrl: 'https://github.com/prithwin0146',
  linkedInUrl: 'https://www.linkedin.com/in/prithwin-m',
  avatarUrl: '',
};

export default function Hero() {
  const [profile, setProfile] = useState<Profile>(fallback);
  const [loaded, setLoaded] = useState(false);

  const typedTitle = useTypingEffect(
    ['Freelance Web Designer', 'Full-Stack Developer', 'I Build Websites That Convert', 'Your Next Web Partner'],
    80, 40, 2000
  );

  useEffect(() => {
    api.getProfile().then((p) => {
      setProfile(p);
    }).catch(console.error);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Magnetic button effect
  const magnetRef1 = useRef<HTMLAnchorElement>(null);
  const magnetRef2 = useRef<HTMLAnchorElement>(null);

  const handleMagnet = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  }, []);

  const resetMagnet = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return (
    <section className={styles.hero} id="home">
      <div className={styles.glowOrb} />
      <div className={styles.glowOrb2} />

      <p className={`${styles.greeting} ${loaded ? styles.animateIn : ''}`}>Hello, I'm</p>

      <h1 className={`${styles.name} ${loaded ? styles.animateIn : ''}`}>
        {profile.name.split('').map((char, i) => (
          <span
            key={i}
            className={styles.nameChar}
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      <p className={`${styles.title} ${loaded ? styles.animateIn : ''}`}>
        {typedTitle}<span className={styles.cursor}>|</span>
      </p>

      <p className={`${styles.bio} ${loaded ? styles.animateIn : ''}`}>{profile.bio}</p>

      <div className={`${styles.actions} ${loaded ? styles.animateIn : ''}`}>
        <a
          ref={magnetRef1}
          href="#contact"
          className={styles.btnPrimary}
          onMouseMove={handleMagnet}
          onMouseLeave={resetMagnet}
        >
          <span className={styles.btnShine} />
          <span className={styles.btnText}>Hire Me</span>
        </a>
        <a
          ref={magnetRef2}
          href="#projects"
          className={styles.btnSecondary}
          onMouseMove={handleMagnet}
          onMouseLeave={resetMagnet}
        >
          <span className={styles.btnText}>View My Work</span>
        </a>
      </div>

      <div className={`${styles.scrollIndicator} ${loaded ? styles.animateIn : ''}`}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
}
