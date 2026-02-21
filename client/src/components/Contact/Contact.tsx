import { useState, useCallback, type FormEvent } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { trackSocialClick } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import TextReveal from '../TextReveal/TextReveal';
import styles from './Contact.module.css';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const handleMagnetic = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.sendContact(form);
      setSuccess(res.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSuccess('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="contact"
    >
      <SectionHeader number="06" title={t('section.contact.title')} accent={t('section.contact.accent')} subtitle={t('section.contact.sub') || undefined} visible={isInView} />
      <TextReveal className={styles.subtitle} delay={100} stagger={30}>
        Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you within 24 hours.
      </TextReveal>
      <div className={styles.socials}>
        <a href="mailto:Prithwin0146@gmail.com" className={styles.socialLink} onClick={trackSocialClick}>📧 Prithwin0146@gmail.com</a>
        <a href="https://www.linkedin.com/in/prithwin-m" target="_blank" rel="noreferrer" className={styles.socialLink} onClick={trackSocialClick}>💼 LinkedIn</a>
        <a href="https://github.com/prithwin0146" target="_blank" rel="noreferrer" className={styles.socialLink} onClick={trackSocialClick}>💻 GitHub</a>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className={styles.input}
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button
          className={styles.btn}
          type="submit"
          disabled={sending}
          onMouseMove={handleMagnetic}
          onMouseLeave={handleMagneticLeave}
          data-cursor-hover
        >
          {sending ? 'Sending...' : 'Send Message →'}
        </button>
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </section>
  );
}
